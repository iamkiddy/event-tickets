"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();
  const { scrollY } = useScroll();
  
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const colors = [
    "var(--sky-300)",
    "var(--pink-300)",
    "var(--green-300)",
    "var(--yellow-300)",
    "var(--red-300)",
    "var(--purple-300)",
    "var(--blue-300)",
    "var(--indigo-300)",
    "var(--violet-300)",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Scroll-based animations
  const yOffset = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    setMounted(true);
    // Initial animation
    controls.start({
      scale: [0.8, 1],
      opacity: [0, 1],
      transition: { duration: 1, ease: "easeOut" }
    });
  }, [controls]);

  if (!mounted) return null;

  return (
    <motion.div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        y: yOffset,
        opacity
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-slate-700 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.01, duration: 0.5 }}
        >
          {cols.map((_, j) => (
            <motion.div
              key={`col` + j}
              whileHover={{
                backgroundColor: getRandomColor(),
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: (i + j) * 0.003,
                duration: 0.4,
                ease: "easeOut"
              }}
              className="w-16 h-8 border-r border-t border-slate-700 relative cursor-pointer 
                hover:z-10 hover:shadow-lg hover:shadow-white/10 transition-all"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-700 stroke-[1px] pointer-events-none"
                  whileHover={{
                    scale: 1.2,
                    rotate: 180,
                    opacity: 1,
                  }}
                  initial={{ opacity: 0.5, scale: 0.95, rotate: 0 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </motion.svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const Boxes = React.memo(BoxesCore);
