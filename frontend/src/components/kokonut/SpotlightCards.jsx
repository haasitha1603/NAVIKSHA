import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap, ShieldCheck, Eye, Cpu, Mic, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 };
const GLOW_SPRING = { stiffness: 180, damping: 22 };

export const DEFAULT_ITEMS = [
  {
    icon: Zap,
    title: "Sub-15ms Edge Inference",
    description:
      "Performs real-time pose and hand keypoint estimation locally on edge hardware with zero network roundtrip.",
    color: "#06b6d4",
  },
  {
    icon: ShieldCheck,
    title: "Air-Gapped & Offline",
    description:
      "Mission-critical standalone assurance. Zero cloud dependency, preventing connectivity dropouts in low Earth orbit.",
    color: "#38bdf8",
  },
  {
    icon: Eye,
    title: "Spatial Action Recognition",
    description:
      "Perceives hand-object interactions, slot container placements, and microgravity equipment states with high confidence.",
    color: "#a855f7",
  },
  {
    icon: Cpu,
    title: "Sequence State Machine",
    description:
      "Deterministic protocol engine that flags skipped steps, out-of-order execution, and immediate corrective guidance.",
    color: "#10b981",
  },
  {
    icon: Mic,
    title: "Astronaut Voice Assistant",
    description:
      "Hands-free local voice feedback provides step guidance and accepts astronaut status reports directly at the rack.",
    color: "#f59e0b",
  },
  {
    icon: HardDrive,
    title: "Flight Blackbox Logging",
    description:
      "Cryptographically verified, timestamped audit trail records video keyframes, confidence scores, and mission logs.",
    color: "#ec4899",
  },
];

function Card({ item, dimmed, onHoverStart, onHoverEnd }) {
  const Icon = item.icon;
  const cardRef = useRef(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.45 : 1,
      }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 text-left cursor-default",
        "border-zinc-800 bg-zinc-950/70 shadow-xl backdrop-blur-sm",
        "transition-[border-color] duration-300",
        "hover:border-white/20"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {/* Static accent tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}15, transparent 65%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}35, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[55%] -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[280%]"
      />

      {/* Icon badge */}
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${item.color}18`,
          boxShadow: `inset 0 0 0 1px ${item.color}40`,
        }}
      >
        <Icon size={18} strokeWidth={2} style={{ color: item.color }} />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h3 className="font-semibold text-base text-white tracking-tight">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}, transparent)`,
        }}
      />
    </motion.div>
  );
}

export default function SpotlightCards({
  items = DEFAULT_ITEMS,
  eyebrow = "// CORE ARCHITECTURE",
  heading = "Space-Grade Autonomous Vision Capabilities",
  className,
}) {
  const [hoveredTitle, setHoveredTitle] = useState(null);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl px-4 sm:px-8 pt-9 pb-10",
        "bg-black/60 border border-zinc-900/90",
        className
      )}
    >
      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-1.5 text-center">
        <p className="font-semibold text-xs text-cyan-400 font-mono uppercase tracking-[0.22em]">
          {eyebrow}
        </p>
        <h2 className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
          {heading}
        </h2>
      </div>

      {/* Card grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
            item={item}
            key={item.title}
            onHoverEnd={() => setHoveredTitle(null)}
            onHoverStart={() => setHoveredTitle(item.title)}
          />
        ))}
      </div>
    </div>
  );
}
