import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { getTasksByUserId } from "@/app/_lib/tasks-admin";
import { redirect } from "next/navigation";
import TodayPlanSection from "@/app/_components/TodayPlanSection";
import { autoDelayIncompleteTodayTasks } from "@/app/_lib/actions";
import { relevantTodayTasks } from "@/app/_utils/utils";

// Dynamic route - today's tasks change very frequently
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  await autoDelayIncompleteTodayTasks();
  const allUserTasks = await getTasksByUserId(userId);

  return (
    <div className="container mx-auto p-1 sm:p-6 pb-8 space-y-6">
      <TodayPlanSection todayTasks={relevantTodayTasks(allUserTasks)} />
    </div>
  );
}
