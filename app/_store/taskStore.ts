"use client";

import { create } from "zustand";
import type { Task } from "../_types/types";
import {
  STORES,
  getAllFromOfflineStorage,
  replaceOfflineStore,
} from "../_utils/offlineStorage";

/**
 * Where the tasks currently in the store came from. The offline banner uses
 * this so it only claims to be showing cached data when there is any.
 */
export type TaskSource = "none" | "cache" | "server";

export interface TaskStoreSnapshot {
  tasks: Task[];
  locallyDeletedIds: string[];
}

interface TaskStoreState {
  tasks: Task[];
  source: TaskSource;
  userId: string | null;
  /** Number of writes waiting for a connection. */
  pendingCount: number;
  isSyncing: boolean;
  /**
   * Task ids removed locally that a stale server snapshot may still contain.
   * Cleared once an incoming snapshot no longer includes them.
   */
  locallyDeletedIds: string[];

  hydrateFromServer: (userId: string, tasks: Task[]) => void;
  hydrateFromCache: (userId: string) => Promise<void>;
  upsertTask: (task: Task) => void;
  patchTask: (taskId: string, patch: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  restoreSnapshot: (snapshot: TaskStoreSnapshot) => void;
  setPendingCount: (count: number) => void;
  setIsSyncing: (isSyncing: boolean) => void;
}

/**
 * IndexedDB is unavailable in some privacy modes and can fail on quota. Task
 * data is a cache, so a write failure must never break the UI.
 */
function persist(tasks: Task[]) {
  void replaceOfflineStore(STORES.TASKS, tasks).catch((error) => {
    console.warn("Could not cache tasks for offline use:", error);
  });
}

function latestUpdatedAt(tasks: Task[]) {
  return tasks.reduce((max, task) => Math.max(max, task.updatedAt || 0), 0);
}

/**
 * True when `incoming` is an older copy of the same list. Used to ignore a
 * cached layout payload that arrives after a local delay/complete/delete.
 */
function isIncomingTaskSnapshotStale(local: Task[], incoming: Task[]) {
  const incomingById = new Map(incoming.map((task) => [task.id, task]));
  for (const localTask of local) {
    const incomingTask = incomingById.get(localTask.id);
    if (!incomingTask) continue;
    if ((localTask.updatedAt || 0) > (incomingTask.updatedAt || 0)) {
      return true;
    }
  }
  return (
    local.length > 0 &&
    incoming.length > 0 &&
    latestUpdatedAt(incoming) < latestUpdatedAt(local)
  );
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],
  source: "none",
  userId: null,
  pendingCount: 0,
  isSyncing: false,
  locallyDeletedIds: [],

  hydrateFromServer: (userId, tasks) => {
    const current = get();
    // A stale RSC payload (client layout cache) can arrive after an optimistic
    // write. Never replace newer local task data with an older snapshot.
    if (
      current.source === "server" &&
      current.userId === userId &&
      isIncomingTaskSnapshotStale(current.tasks, tasks)
    ) {
      return;
    }
    const incomingIds = new Set(tasks.map((task) => task.id));
    const locallyDeletedIds = current.locallyDeletedIds.filter((id) =>
      incomingIds.has(id),
    );
    const nextTasks = tasks.filter(
      (task) => !current.locallyDeletedIds.includes(task.id),
    );
    set({
      tasks: nextTasks,
      source: "server",
      userId,
      locallyDeletedIds,
    });
    persist(nextTasks);
  },

  hydrateFromCache: async (userId) => {
    // A server hydration is always fresher than the cache.
    if (get().source === "server") return;
    try {
      const cached = await getAllFromOfflineStorage<Task>(
        STORES.TASKS,
        "userId",
        userId,
      );
      if (get().source === "server") return;
      set({
        tasks: cached,
        source: cached.length > 0 ? "cache" : "none",
        userId,
      });
    } catch (error) {
      console.warn("Could not read cached tasks:", error);
    }
  },

  upsertTask: (task) => {
    const tasks = get().tasks.some((existing) => existing.id === task.id)
      ? get().tasks.map((existing) =>
          existing.id === task.id ? task : existing,
        )
      : [...get().tasks, task];
    set({
      tasks,
      locallyDeletedIds: get().locallyDeletedIds.filter((id) => id !== task.id),
    });
    persist(tasks);
  },

  patchTask: (taskId, patch) => {
    const tasks = get().tasks.map((task) =>
      task.id === taskId
        ? { ...task, ...patch, updatedAt: Date.now() }
        : task,
    );
    set({ tasks });
    persist(tasks);
  },

  removeTask: (taskId) => {
    const tasks = get().tasks.filter((task) => task.id !== taskId);
    // Offline temp ids never exist on the server, so they must not block
    // a later hydrate of the real task.
    const locallyDeletedIds = taskId.startsWith("offline-")
      ? get().locallyDeletedIds
      : get().locallyDeletedIds.includes(taskId)
        ? get().locallyDeletedIds
        : [...get().locallyDeletedIds, taskId];
    set({ tasks, locallyDeletedIds });
    persist(tasks);
  },

  restoreSnapshot: (snapshot) => {
    set({
      tasks: snapshot.tasks,
      locallyDeletedIds: snapshot.locallyDeletedIds,
    });
    persist(snapshot.tasks);
  },

  setPendingCount: (pendingCount) => set({ pendingCount }),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
}));

/** True when there is task data on the device to render without a network. */
export function useHasOfflineTasks() {
  return useTaskStore((state) => state.source !== "none");
}

/**
 * After the layout hydrates the store, that list is the live copy (including
 * optimistic offline writes). Until then, fall back to whatever the server
 * rendered into the page.
 */
export function useHydratedTasks(fallback: Task[]) {
  const tasks = useTaskStore((state) => state.tasks);
  const source = useTaskStore((state) => state.source);
  return source === "none" ? fallback : tasks;
}
