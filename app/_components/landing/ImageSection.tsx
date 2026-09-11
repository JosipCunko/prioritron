"use client";

import Image from "next/image";
import { Camera, Grid3x3, Code, Zap } from "lucide-react";
import { m as motion } from "framer-motion";
import { images } from "@/app/_utils/utils";

// Tech Background Pattern Component
function TechBackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute inset-0">
        {/* Horizontal lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            style={{
              top: `${(i + 1) * 8.33}%`,
              width: "100%",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0.3, 1, 0],
              opacity: [0.2, 0.5, 0.25, 0.5, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Vertical lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute w-1  bg-gradient-to-b from-transparent via-primary-500 to-transparent"
            style={{
              left: `${(i + 1) * 12.5}%`,
              height: "100%",
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 0.5, 1, 0],
              opacity: [0.2, 0.5, 0.25, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: [0.42, 0, 0.58, 1] as const,
              delay: i * 0.3,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Floating Dots */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1.5 h-1.5 bg-primary-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1] as const,
            delay: Math.random() * 3,
          }}
        ></motion.div>
      ))}

      {/* Corner Tech Elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary-500/30"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary-500/30"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-primary-500/30"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary-500/30"></div>
    </div>
  );
}

export default function ImageSection() {
  return (
    <section
      id="images"
      className="py-10 md:py-20 bg-gradient-to-br from-background-700 to-background-650 relative overflow-hidden"
    >
      <TechBackgroundPattern />

      <div className="container mx-auto max-w-6xl p-6 text-center relative z-10">
        <motion.div
          className="inline-flex items-center gap-2 p-3 mb-4 bg-background-600/80 backdrop-blur-sm rounded-xl border border-primary-500/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Camera className="w-6 h-6 text-primary-400" />
          <Grid3x3 className="w-5 h-5 text-primary-400" />
          <Code className="w-5 h-5 text-primary-300" />
        </motion.div>

        <motion.h2
          className="text-3xl sm:text-4xl mb-12 md:mb-16 text-glow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          See <span className="text-primary-600">Prioritron</span> in action
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-8 md:gap-12">
          {images.map((image, index) => (
            <motion.div
              key={image.src}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-background-600 rounded-2xl border border-primary-500/20 shadow-[0_0_24px_rgba(14,165,233,0.08)] group-hover:border-primary-500/40 group-hover:shadow-[0_0_32px_rgba(14,165,233,0.18)] transition-[border-color,box-shadow] duration-300">
                <div className="absolute -inset-3 bg-gradient-to-br from-primary-500/15 via-transparent to-accent/15 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Window chrome so screenshots read as the live app, not thumbnails */}
                <div className="relative flex items-center justify-between px-4 py-2 border-b border-primary-500/20 bg-background-700/80 rounded-t-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs font-medium text-primary-300 uppercase tracking-wider">
                    {image.category}
                  </span>
                  <motion.div
                    className="w-2 h-2 bg-success rounded-full"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </div>

                <div className="relative w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    quality={90}
                    className="w-full h-auto rounded-b-2xl"
                    priority={index < 2}
                    sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, min(1152px, 92vw)"
                  />
                </div>
              </div>

              <div className="mt-5 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary-400" />
                  <div className="h-px flex-1 bg-gradient-to-r from-primary-500/50 to-transparent"></div>
                </div>
                <h3 className="text-lg font-bold text-text-high group-hover:text-primary-300 transition-colors duration-300">
                  {image.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
