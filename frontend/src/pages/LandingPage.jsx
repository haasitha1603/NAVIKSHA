import React from 'react';
import { Link } from 'react-router-dom';
import { AsciiMissionArt } from '../components/AsciiMissionArt';
import { ShieldAlert, Cpu, Activity, Play, CheckCircle2, Mic, FileText, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 bg-grid-pattern pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>ON-BOARD BAS EXPERIMENT ASSURANCE SYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          NAVIKSHA
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-mono text-cyan-400 max-w-3xl mx-auto mb-6">
          Next-generation Autonomous Vision Intelligence and Knowledge System for Human Activity Assurance
        </p>

        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Offline AI-powered astronaut assistance platform that observes experiment video feeds locally, validates procedural order in real time, detects skipped or out-of-sequence steps, provides local voice guidance, and logs structured mission events without internet dependency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/console"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg shadow-lg cyan-glow transition-all text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Mission Console</span>
          </Link>

          <Link
            to="/protocols"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-space-900 hover:bg-space-800 text-slate-200 border border-space-700 px-6 py-3 rounded-lg transition-all text-sm"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Explore Protocols</span>
          </Link>
        </div>

        {/* Responsive Monospace ASCII Art Hero */}
        <div className="max-w-4xl mx-auto mb-16">
          <AsciiMissionArt />
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 text-center mb-8">
          // SYSTEM CAPABILITIES & PROTOCOL ENGINE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-space-900/80 border border-space-800 p-6 rounded-xl hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Real-Time Activity Recognition</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Monitors astronaut physical movements, hand keypoints, component positions, and spatial hand-object interactions on the payload rack using modular perception adapters.
            </p>
          </div>

          <div className="bg-space-900/80 border border-space-800 p-6 rounded-xl hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Protocol Sequence Validation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              State machine engine tracks expected experiment steps, detects skipped steps or out-of-order actions, and provides immediate recovery guidance.
            </p>
          </div>

          <div className="bg-space-900/80 border border-space-800 p-6 rounded-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Local Voice Alerts & Logging</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hands-free offline speech synthesis speaks protocol instructions and warnings while recording timestamped structured logs (JSON, CSV, TXT).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
