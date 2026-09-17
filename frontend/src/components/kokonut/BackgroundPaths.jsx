import React, { memo, useMemo } from "react";
import { motion } from "motion/react";

// Path generation function
function generateAestheticPath(index, position, type) {
  const baseAmplitude =
    type === "primary" ? 150 : type === "secondary" ? 100 : 60;
  const phase = index * 0.2;
  const points = [];
  const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;

  const startX = 2400;
  const startY = 800;
  const endX = -2400;
  const endY = -800 + index * 25;

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const eased = 1 - (1 - progress) ** 2;

    const baseX = startX + (endX - startX) * eased;
    const baseY = startY + (endY - startY) * eased;

    const amplitudeFactor = 1 - eased * 0.3;
    const wave1 =
      Math.sin(progress * Math.PI * 3 + phase) *
      (baseAmplitude * 0.7 * amplitudeFactor);
    const wave2 =
      Math.cos(progress * Math.PI * 4 + phase) *
      (baseAmplitude * 0.3 * amplitudeFactor);
    const wave3 =
      Math.sin(progress * Math.PI * 2 + phase) *
      (baseAmplitude * 0.2 * amplitudeFactor);

    points.push({
      x: baseX * position,
      y: baseY + wave1 + wave2 + wave3,
    });
  }

  const pathCommands = points.map((point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[i - 1];
    const tension = 0.4;
    const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
    const cp1y = prevPoint.y;
    const cp2x = prevPoint.x + (point.x - prevPoint.x) * (1 - tension);
    const cp2y = point.y;
    return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  });

  return pathCommands.join(" ");
}

const generateUniqueId = (prefix) =>
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Memoized FloatingPaths component
export const FloatingPaths = memo(function FloatingPaths({ position = 1 }) {
  const primaryPaths = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: generateUniqueId("primary"),
        d: generateAestheticPath(i, position, "primary"),
        opacity: 0.2 + i * 0.025,
        width: 3.5 + i * 0.3,
        duration: 25,
        delay: 0,
      })),
    [position]
  );

  const secondaryPaths = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: generateUniqueId("secondary"),
        d: generateAestheticPath(i, position, "secondary"),
        opacity: 0.15 + i * 0.02,
        width: 2.5 + i * 0.25,
        duration: 20,
        delay: 0,
      })),
    [position]
  );

  const accentPaths = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: generateUniqueId("accent"),
        d: generateAestheticPath(i, position, "accent"),
        opacity: 0.1 + i * 0.15,
        width: 1.8 + i * 0.2,
        duration: 15,
        delay: 0,
      })),
    [position]
  );

  const sharedAnimationProps = {
    opacity: 1,
    scale: 1,
  };
  const sharedTransition = {
    opacity: { duration: 1 },
    scale: { duration: 1 },
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="h-full w-full text-cyan-500/40"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="-2400 -800 4800 1600"
      >
        <title>Background Paths</title>
        <defs>
          <linearGradient id="navikshaPathGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.6)" />
          </linearGradient>
        </defs>

        <g className="primary-waves">
          {primaryPaths.map((path) => (
            <motion.path
              animate={{
                ...sharedAnimationProps,
                y: [0, -15, 0],
              }}
              d={path.d}
              initial={{ opacity: 0, scale: 0.8 }}
              key={path.id}
              stroke="url(#navikshaPathGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              transition={{
                ...sharedTransition,
                y: {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>

        <g className="secondary-waves" style={{ opacity: 0.8 }}>
          {secondaryPaths.map((path) => (
            <motion.path
              animate={{
                ...sharedAnimationProps,
                y: [0, -10, 0],
              }}
              d={path.d}
              initial={{ opacity: 0, scale: 0.9 }}
              key={path.id}
              stroke="url(#navikshaPathGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              transition={{
                ...sharedTransition,
                y: {
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>

        <g className="accent-waves" style={{ opacity: 0.6 }}>
          {accentPaths.map((path) => (
            <motion.path
              animate={{
                ...sharedAnimationProps,
                y: [0, -5, 0],
              }}
              d={path.d}
              initial={{ opacity: 0, scale: 0.95 }}
              key={path.id}
              stroke="url(#navikshaPathGradient)"
              strokeLinecap="round"
              strokeWidth={path.width}
              style={{ opacity: path.opacity }}
              transition={{
                ...sharedTransition,
                y: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default memo(function BackgroundPaths({
  title = "Background Paths",
  children,
  className = "",
}) {
  return (
    <div className={`relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white ${className}`}>
      <div className="absolute inset-0 pointer-events-none">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 w-full">
        {children ? (
          children
        ) : (
          <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-cyan-400 via-purple-300 to-blue-500 bg-clip-text font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 1.2,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
            >
              {title}
            </motion.h1>
          </div>
        )}
      </div>
    </div>
  );
});
