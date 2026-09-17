import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const MouseSpotlight = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {/* Primary Cyan/Blue Core Spotlight */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-35 dark:opacity-30 blur-3xl pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(59, 130, 246, 0.2) 35%, rgba(147, 51, 234, 0.08) 60%, transparent 80%)",
        }}
      />

      {/* Subtle secondary ambient ring */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-15 blur-[100px] pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(6, 182, 212, 0.1) 45%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default MouseSpotlight;
