import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_GREETINGS = [
  { text: "AUTONOMOUS VISION", language: "SYSTEM ACTIVE" },
  { text: "ZERO-LATENCY EDGE AI", language: "LOCAL INFERENCE" },
  { text: "HUMAN ACTIVITY RECOGNITION", language: "POSE & HANDS" },
  { text: "SPACE LAB PROTOCOL ASSURANCE", language: "ISO COMPLIANT" },
  { text: "AIR-GAPPED OFFLINE SECURITY", language: "NO CLOUD" },
  { text: "REAL-TIME EXPERIMENT OBSERVER", language: "30 FPS TELEMETRY" },
];

export default function DynamicText({
  items = DEFAULT_GREETINGS,
  intervalMs = 2200,
  className = "",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [items.length, intervalMs]);

  const textVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -16, opacity: 0 },
  };

  const current = items[currentIndex];

  return (
    <div
      aria-label="Dynamic telemetry status"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div className="relative flex h-9 items-center justify-center overflow-hidden min-w-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            animate={textVariants.visible}
            aria-live="off"
            className="flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full"
            exit={textVariants.exit}
            initial={textVariants.hidden}
            key={currentIndex}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"
            />
            <span>{current.text}</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              [{current.language}]
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
