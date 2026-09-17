import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Activity,
  FileText,
  Cpu,
  Settings,
  PlayCircle,
  Eye,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SwitchButton from "@/components/kokonut/SwitchButton";
import AILoadingState from "@/components/kokonut/AILoadingState";

export const Header = () => {
  const location = useLocation();
  const [showAILoader, setShowAILoader] = useState(false);

  const navItems = [
    { label: "Mission Console", path: "/console", icon: Activity },
    { label: "Protocol Designer", path: "/protocols", icon: FileText },
    { label: "Replay & Analysis", path: "/replay", icon: PlayCircle },
    { label: "Reports", path: "/reports", icon: Shield },
    { label: "Models & Data", path: "/models", icon: Cpu },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      <header className="border-b border-zinc-800/90 bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
              <Eye className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                NAVIKSHA
              </div>
              <div className="text-[10px] text-cyan-400/80 font-mono tracking-tighter uppercase hidden sm:block">
                Autonomous Vision Intelligence
              </div>
            </div>
          </Link>

          {/* Smooth Animated Tab Menu */}
          <nav className="hidden lg:flex items-center space-x-1 relative p-1 bg-zinc-950/80 border border-zinc-800/80 rounded-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors z-10 ${
                    isActive
                      ? "text-cyan-300 font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="smoothNavPill"
                      className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/40 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Tools: AI State Loader Trigger, Status Badge & SwitchButton */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI State Loader Button for Menu */}
            <button
              onClick={() => setShowAILoader((prev) => !prev)}
              type="button"
              className="flex items-center space-x-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-lg text-cyan-400 text-xs font-mono transition-colors"
              title="Inspect AI State Loading Pipeline"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">AI Pipeline</span>
            </button>

            {/* Offline Standalone Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden md:inline">AIR-GAPPED</span>
            </div>

            {/* Theme Toggle Button */}
            <SwitchButton size="sm" showLabel={false} />
          </div>
        </div>
      </header>

      {/* AI State Loading Modal / Drawer */}
      <AnimatePresence>
        {showAILoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    NAVIKSHA AI State Monitor
                  </h3>
                </div>
                <button
                  onClick={() => setShowAILoader(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Kokonut AI State Loading component */}
              <AILoadingState />

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Autonomous edge telemetry</span>
                <button
                  onClick={() => setShowAILoader(false)}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-700"
                  type="button"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
