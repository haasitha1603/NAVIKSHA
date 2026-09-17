import React, { useState } from "react";
import { cva } from "class-variance-authority";
import {
  AlertCircleIcon,
  ArchiveXIcon,
  BanIcon,
  PlayIcon,
  Trash2Icon,
  XCircleIcon,
  CheckCircle2,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const holdButtonVariants = cva("relative min-w-44 touch-none overflow-hidden font-mono text-xs uppercase tracking-wider select-none", {
  variants: {
    variant: {
      cyan: [
        "bg-cyan-950/80 hover:bg-cyan-900/80",
        "text-cyan-400 font-bold",
        "border border-cyan-500/50 shadow-lg shadow-cyan-500/20",
      ],
      red: [
        "bg-red-950/80 hover:bg-red-900/80",
        "text-red-400 font-bold",
        "border border-red-500/50 shadow-lg shadow-red-500/20",
      ],
      green: [
        "bg-emerald-950/80 hover:bg-emerald-900/80",
        "text-emerald-400 font-bold",
        "border border-emerald-500/50 shadow-lg shadow-emerald-500/20",
      ],
      blue: [
        "bg-blue-950/80 hover:bg-blue-900/80",
        "text-blue-400 font-bold",
        "border border-blue-500/50 shadow-lg shadow-blue-500/20",
      ],
      orange: [
        "bg-amber-950/80 hover:bg-amber-900/80",
        "text-amber-400 font-bold",
        "border border-amber-500/50 shadow-lg shadow-amber-500/20",
      ],
      grey: [
        "bg-zinc-900 hover:bg-zinc-850",
        "text-zinc-300 font-bold",
        "border border-zinc-700 shadow",
      ],
    },
  },
  defaultVariants: {
    variant: "cyan",
  },
});

export default function HoldButton({
  className,
  variant = "cyan",
  holdDuration = 1800,
  label = "Hold to confirm",
  onComplete,
  ...props
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const controls = useAnimation();

  async function handleHoldStart() {
    setIsHolding(true);
    setIsTriggered(false);
    controls.set({ width: "0%" });
    await controls.start({
      width: "100%",
      transition: {
        duration: holdDuration / 1000,
        ease: "linear",
      },
    });
    // Trigger action on completion
    setIsHolding(false);
    setIsTriggered(true);
    if (onComplete) onComplete();
    setTimeout(() => {
      setIsTriggered(false);
      controls.set({ width: "0%" });
    }, 2000);
  }

  function handleHoldEnd() {
    if (!isTriggered) {
      setIsHolding(false);
      controls.stop();
      controls.start({
        width: "0%",
        transition: { duration: 0.15 },
      });
    }
  }

  return (
    <Button
      className={cn(holdButtonVariants({ variant, className }))}
      onMouseDown={handleHoldStart}
      onMouseLeave={handleHoldEnd}
      onMouseUp={handleHoldEnd}
      onTouchCancel={handleHoldEnd}
      onTouchEnd={handleHoldEnd}
      onTouchStart={handleHoldStart}
      type="button"
      {...props}
    >
      <motion.div
        animate={controls}
        className={cn("absolute top-0 left-0 h-full pointer-events-none", {
          "bg-cyan-500/40": variant === "cyan",
          "bg-red-500/40": variant === "red",
          "bg-emerald-500/40": variant === "green",
          "bg-blue-500/40": variant === "blue",
          "bg-amber-500/40": variant === "orange",
          "bg-zinc-600/40": variant === "grey",
        })}
        initial={{ width: "0%" }}
      />
      <span className="relative z-10 flex w-full items-center justify-center gap-2">
        {isTriggered ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-white animate-bounce" />
            <span>CONFIRMED</span>
          </>
        ) : (
          <>
            {variant === "cyan" && <PlayIcon className="h-3.5 w-3.5 fill-current" />}
            {variant === "red" && <Trash2Icon className="h-3.5 w-3.5" />}
            {variant === "green" && <ArchiveXIcon className="h-3.5 w-3.5" />}
            {variant === "blue" && <XCircleIcon className="h-3.5 w-3.5" />}
            {variant === "orange" && <AlertCircleIcon className="h-3.5 w-3.5" />}
            {variant === "grey" && <BanIcon className="h-3.5 w-3.5" />}
            <span>{isHolding ? "HOLDING..." : label}</span>
          </>
        )}
      </span>
    </Button>
  );
}
