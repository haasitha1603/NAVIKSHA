import React, { useState } from "react";
import { ArrowRight, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CardFlip({
  title = "Design Systems",
  subtitle = "Explore the fundamentals",
  description = "Dive deep into the world of modern UI/UX design.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
  buttonText = "Start today",
  onAction,
  className,
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "group relative h-[320px] w-full max-w-[280px] [perspective:2000px]",
        className
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-transform duration-500 ease-out",
          "motion-reduce:transition-none",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-zinc-900/90 border border-zinc-800/80 shadow-lg",
            "transition-shadow duration-500",
            "group-hover:shadow-cyan-500/10 group-hover:border-cyan-500/40"
          )}
        >
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-start justify-center pt-24"
            >
              <div className="relative flex h-[100px] w-[200px] items-center justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    className={cn(
                      "absolute h-[50px] w-[50px]",
                      "rounded-[140px]",
                      "animate-[cardFlipScale_3s_linear_infinite]",
                      "motion-reduce:animate-none",
                      "opacity-0",
                      "shadow-[0_0_50px_rgba(6,182,212,0.4)]",
                      "group-hover:animate-[cardFlipScale_2s_linear_infinite]"
                    )}
                    key={i}
                    style={{
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="font-semibold text-lg text-white leading-snug tracking-tighter transition-transform duration-500 group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm text-zinc-300 tracking-tight transition-transform delay-75 duration-500 group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <div
                  className={cn(
                    "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                    "bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent"
                  )}
                />
                <Repeat2
                  aria-hidden="true"
                  className="relative z-10 h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover/icon:-rotate-12 group-hover/icon:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "rounded-2xl p-6",
            "bg-gradient-to-b from-zinc-900 to-black",
            "border border-zinc-800",
            "shadow-lg",
            "flex flex-col",
            "transition-shadow duration-500",
            "group-hover:shadow-cyan-500/10 group-hover:border-cyan-500/40"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-white leading-snug tracking-tight transition-transform duration-500 group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="line-clamp-2 text-sm text-zinc-400 tracking-tight transition-transform duration-500 group-hover:translate-y-[-2px]">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  className="flex items-center gap-2 text-sm text-zinc-300 transition-[transform,opacity] duration-300 ease-out"
                  key={feature}
                  style={{
                    transform: isFlipped
                      ? "translateX(0)"
                      : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 50 + 150}ms`,
                  }}
                >
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3 w-3 text-cyan-400"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-zinc-800 border-t pt-6">
            <button
              className={cn(
                "group/start relative w-full",
                "flex items-center justify-between",
                "-m-3 rounded-xl p-3",
                "transition-[transform,background] duration-300",
                "bg-zinc-800/80",
                "hover:bg-cyan-500/20",
                "hover:scale-[1.02] active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              )}
              onClick={onAction}
              type="button"
            >
              <span className="font-medium text-sm text-white transition-colors duration-300 group-hover/start:text-cyan-300">
                {buttonText}
              </span>
              <div className="group/icon relative">
                <div
                  className={cn(
                    "absolute inset-[-6px] rounded-lg transition-[transform,opacity] duration-300",
                    "bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent",
                    "scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100"
                  )}
                />
                <ArrowRight
                  aria-hidden="true"
                  className="relative z-10 h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
