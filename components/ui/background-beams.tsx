"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(beamRef);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div className={cn("h-full w-full relative overflow-hidden", className)}>
      {/* Beams container */}
      <motion.div
        ref={beamRef}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Primary central beam */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-full w-[2px] top-0 left-[50%] bg-gradient-to-b from-transparent via-indigo-500 to-transparent"
        />

        {/* Diagonal beams */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [i * 45, i * 45 + 5, i * 45],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute h-[120%] w-[1px] origin-bottom"
            style={{
              left: "50%",
              bottom: "0",
              background: "linear-gradient(to top, transparent, rgb(99 102 241), transparent)",
            }}
          />
        ))}

        {/* Floating orbs */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            animate={{
              y: [0, -10, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/10" />

      {/* Radial gradient for beam focus */}
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
    </div>
  );
}; 