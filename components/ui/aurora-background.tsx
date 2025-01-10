"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export const AuroraBackground = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-[350px] xs:h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-slate-950",
        className
      )}
    >
      {/* Aurora blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={controls}
        variants={{
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 1, ease: "easeOut" },
          },
        }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Primary aurora blob */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-3xl" />
        
        {/* Secondary aurora blobs */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-60 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-blue-500/30 to-cyan-500/30 blur-3xl"
        />
        
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-40 left-80 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-pink-500/30 to-rose-500/30 blur-3xl"
        />
      </motion.div>

      {/* Grain effect overlay */}
      <div className="absolute inset-0 bg-slate-950/50" />
      
      {/* Radial gradient mask */}
      <div className="absolute inset-0 bg-slate-950 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 