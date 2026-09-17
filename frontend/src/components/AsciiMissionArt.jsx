import React from 'react';

export const AsciiMissionArt = () => {
  return (
    <div className="relative font-mono text-[10px] sm:text-xs md:text-sm text-cyan-400 bg-space-900 border border-cyan-500/30 rounded-lg p-4 shadow-xl overflow-x-auto select-none leading-none">
      <div className="absolute top-2 right-3 flex items-center space-x-2 text-[10px] text-slate-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>EDGE TELEMETRY LIVE</span>
      </div>
      <pre className="text-center font-bold text-cyan-400/90 tracking-tighter">
{`
               ·       ✦         ·                 ·       ✦
         ·             .               ✦      .

                ┌──────────────────────────────────┐
         ┌──────┤           NAVIKSHA AI            ├──────┐
         │      │     MISSION CONTROL CONSOLE      │      │
         │      └──────────────────────────────────┘      │
         │                                                │
         │          [ ON-BOARD PAYLOAD RACK ]             │
         │             ┌────────────────┐                 │
         │             │  ◈  ◇   ○  □   │                 │
         │             │  [SLOT A-1]    │                 │
         │             └────────────────┘                 │
         │                ╲│╱                             │
         │                 ◎ (ASTRONAUT HAND)             │
         │                /│\                             │
         │                                                │
         └─────────────[ OFFLINE EDGE SYSTEM ]────────────┘

    EDGE INTELLIGENCE // HAR PIPELINE // PROTOCOL ASSURANCE
`}
      </pre>
    </div>
  );
};
