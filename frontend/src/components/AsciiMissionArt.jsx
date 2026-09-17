import React from "react";
import { Terminal, Shield, Activity, Radio } from "lucide-react";

export const AsciiMissionArt = () => {
  return (
    <div className="relative font-mono text-[9px] sm:text-xs md:text-sm text-cyan-400 bg-black border border-cyan-500/40 rounded-xl p-4 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-x-auto select-none">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3 text-[10px] sm:text-xs text-zinc-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-bold tracking-widest">
            TERMINAL // SYS_ID: NAVIKSHA-EDGE-01
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            AIR-GAPPED STANDALONE
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-cyan-400 font-bold hidden sm:inline">FPS: 30.0</span>
        </div>
      </div>

      {/* ASCII Art in a Word: NAVIKSHA */}
      <div className="py-2 flex flex-col items-center justify-center">
        <pre className="text-center font-extrabold text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] tracking-tighter leading-tight">
{`
███╗   ██╗ █████╗ ██╗   ██╗██╗██╗  ██╗███████╗██╗  ██╗ █████╗ 
████╗  ██║██╔══██╗██║   ██║██║██║ ██╔╝██╔════╝██║  ██║██╔══██╗
██╔██╗ ██║███████║██║   ██║██║█████═╝ ███████╗███████║███████║
██║╚██╗██║██╔══██║╚██╗ ██╔╝██║██╔═██╗ ╚════██║██╔══██║██╔══██║
██║ ╚████║██║  ██║ ╚████╔╝ ██║██║ ╚██╗███████║██║  ██║██║  ██║
╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═══╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`}
        </pre>
        <div className="text-[11px] sm:text-xs text-zinc-400 font-mono tracking-widest mt-1 text-center">
          [ AUTONOMOUS VISION INTELLIGENCE & HUMAN ACTIVITY ASSURANCE ]
        </div>
      </div>

      {/* Rack & Telemetry Grid Frame */}
      <pre className="text-center text-zinc-500 font-mono text-[9px] sm:text-[11px] leading-tight mt-2 hidden sm:block">
{`
 ┌─────────────────────────[ FLIGHT PAYLOAD TELEMETRY ]─────────────────────────┐
 │ HAR INFERENCE: 11.8ms  │ POSE CONFIDENCE: 99.4% │ PROTOCOL: BIO-RACK-04      │
 │ HAND TRACKING: ACTIVE  │ SEQUENCE DRIFT: 0.00%  │ BLACKBOX: LOGGING NOMINAL  │
 └──────────────────────────────────────────────────────────────────────────────┘
`}
      </pre>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-zinc-900 pt-3 mt-3 text-[10px] text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>MISSION CLOCK: T+04:18:22</span>
        </div>
        <span className="text-zinc-600">ISRO // NASA BAS PROTOCOL STANDARD COMPLIANT</span>
      </div>
    </div>
  );
};

export default AsciiMissionArt;
