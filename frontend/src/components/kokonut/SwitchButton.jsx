import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SwitchButton({
  className,
  variant = "minimal",
  size = "default",
  showLabel = true,
  ...props
}) {
  const { setTheme, theme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const variants = {
    minimal: [
      "rounded-lg",
      "bg-gradient-to-b from-zinc-800/95 to-zinc-900/95 dark:from-zinc-900/95 dark:to-black/95",
      "hover:from-zinc-700/95 hover:to-zinc-800/95",
      "border border-zinc-700/80 dark:border-zinc-800/80",
      "hover:border-cyan-500/50",
      "shadow-md",
      "transition-all duration-200 ease-out",
      "backdrop-blur-sm",
      "relative overflow-hidden",
    ],
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-9 px-3.5 text-xs font-mono",
    lg: "h-11 px-5 text-sm",
  };

  const isDark = theme === "dark";

  return (
    <Button
      className={cn(
        "group relative",
        "transition-all duration-300 ease-out",
        "text-zinc-300 hover:text-white",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={handleThemeToggle}
      type="button"
      aria-label="Toggle theme"
      {...props}
    >
      <div className="flex items-center gap-2 transition-all duration-300 ease-out relative z-10">
        <Sun
          className={cn(
            "transition-all duration-700 ease-in-out",
            size === "sm" && "h-3.5 w-3.5",
            size === "default" && "h-4 w-4",
            size === "lg" && "h-5 w-5",
            "group-hover:rotate-[360deg] group-hover:scale-110",
            isDark ? "rotate-180 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "rotate-0 text-amber-500",
            "transform-gpu",
            "group-active:scale-95"
          )}
        />
        {showLabel && (
          <span className="relative font-mono uppercase tracking-wider text-[11px]">
            {isDark ? "Deep Space" : "Cleanroom"}
          </span>
        )}
      </div>

      {/* Shimmer sweep */}
      <span
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent",
          "translate-x-[-100%]",
          "group-hover:translate-x-[100%]",
          "transition-transform duration-700",
          "ease-in-out",
          "pointer-events-none",
          "z-[1]"
        )}
      />
    </Button>
  );
}
