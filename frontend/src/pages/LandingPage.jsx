import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, FileText, ArrowRight, ShieldCheck, Sparkles, Terminal, Layers } from "lucide-react";

// Effects & Kokonut UI Components
import MouseSpotlight from "@/components/effects/MouseSpotlight";
import BackgroundPaths from "@/components/kokonut/BackgroundPaths";
import TypewriterTitle from "@/components/kokonut/TypewriterTitle";
import DynamicText from "@/components/kokonut/DynamicText";
import AIVoice from "@/components/kokonut/AIVoice";
import SpotlightCards from "@/components/kokonut/SpotlightCards";
import CardFlip from "@/components/kokonut/CardFlip";
import CardStack from "@/components/kokonut/CardStack";
import HoldButton from "@/components/kokonut/HoldButton";
import AsciiMissionArt from "@/components/AsciiMissionArt";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-slate-100 selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Interactive Mouse Spotlight specifically for Home Page */}
      <MouseSpotlight />

      {/* Hero Section with Animated Flowing SVG Background Paths on Black */}
      <BackgroundPaths className="min-h-auto pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Dynamic Cycling Telemetry Tag */}
          <div className="mb-6 flex justify-center">
            <DynamicText />
          </div>

          {/* Main Hero Word Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_35px_rgba(6,182,212,0.3)] mb-2">
            NAVIKSHA
          </h1>

          {/* Typewriter Dynamic Mission Taglines */}
          <div className="max-w-3xl mx-auto mb-6">
            <TypewriterTitle />
          </div>

          <p className="text-zinc-400 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed mb-8 font-mono">
            Autonomous Vision Intelligence & Knowledge System for Human Activity Assurance in microgravity space experiments. Observes payload feeds locally, validates sequence order in real-time, alerts on out-of-order execution, and provides offline astronaut voice guidance without cloud dependency.
          </p>

          {/* Action CTAs: Hold Button + Standard Route Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* Press and Hold Button for Mission Console */}
            <HoldButton
              variant="cyan"
              label="HOLD TO LAUNCH CONSOLE"
              holdDuration={1500}
              onComplete={() => navigate("/console")}
            />

            <Link
              to="/protocols"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-zinc-900/90 hover:bg-zinc-850 text-slate-200 border border-zinc-700 hover:border-cyan-500/50 px-6 py-2.5 rounded-md transition-all text-xs font-mono font-medium shadow-md"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Explore Protocols</span>
            </Link>

            <Link
              to="/console"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-md transition-all text-xs font-mono font-bold shadow-lg shadow-cyan-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Instant Launch</span>
            </Link>
          </div>

          {/* Stylized Monospace Block ASCII Art in a Word on Black */}
          <div className="max-w-4xl mx-auto mb-16">
            <AsciiMissionArt />
          </div>
        </div>
      </BackgroundPaths>

      {/* Section: Prominent AI Voice Interface (Highlighted as requested) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRIMARY ASTRONAUT INTERACTION INTERFACE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Hands-Free Local Audio Feedback & Voice Control
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl mx-auto mt-2 font-mono">
            Zero-cloud speech synthesis and keyword recognition engine runs directly on payload rack hardware, keeping astronauts focused on complex scientific maneuvers.
          </p>
        </div>

        {/* AI Voice Component */}
        <AIVoice
          onCommand={(cmd) => {
            console.log("Astronaut voice command executed:", cmd);
          }}
        />
      </section>

      {/* Section: 3D Tilt Magnetic Spotlight Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <SpotlightCards />
      </section>

      {/* Section: Expanding Mission Payload Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-6">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            // EXPERIMENT FLIGHT PROTOCOLS
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Active On-Board Microgravity Payloads
          </h2>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto mt-2">
            Click to expand cards and inspect individual payload rack configurations, step tolerances, and vision keypoint parameters.
          </p>
        </div>

        <CardStack />
      </section>

      {/* Section: 3D Interactive Flip Cards for Safety Assurance Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            // INTERACTIVE MODULE INSPECTION
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Experiment Safety Shield
          </h2>
          <p className="text-zinc-400 text-xs max-w-xl mx-auto mt-2">
            Hover over any module card to trigger 3D perspective flip and reveal verification telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <CardFlip
            title="Perception Engine"
            subtitle="Real-time multi-keypoint vision"
            description="High-frequency pose, hand, and object detection pipeline running on edge TensorRT runtime."
            features={[
              "30 FPS Local Stream",
              "21-Point Hand Skeletal Model",
              "Sub-12ms Processing Window",
              "Occlusion Resilient",
            ]}
            buttonText="Launch Console"
            onAction={() => navigate("/console")}
          />

          <CardFlip
            title="Sequence Validator"
            subtitle="Deterministic state machine"
            description="Checks current action against flight checklist rules and emits instant corrective voice cues."
            features={[
              "Out-of-Order Detection",
              "Skipped Step Interception",
              "Hold-Time Compliance",
              "Zero False Positives",
            ]}
            buttonText="View Protocols"
            onAction={() => navigate("/protocols")}
          />

          <CardFlip
            title="Flight Blackbox"
            subtitle="Timestamped audit telemetry"
            description="Generates immutable structured logs with evidentiary video keyframes and confidence metrics."
            features={[
              "Cryptographic Signatures",
              "Multi-Format (JSON/CSV)",
              "Forensic Step Replay",
              "Air-Gapped Local Storage",
            ]}
            buttonText="Inspect Reports"
            onAction={() => navigate("/reports")}
          />
        </div>
      </section>

      {/* Bottom Emergency / Critical Abort Action Demonstration */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center border-t border-zinc-900">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Mission Control Readiness Status
            </h4>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              All on-board AI perception models loaded. Ground communication air-gapped.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <HoldButton
              variant="red"
              label="HOLD TO ABORT STEP"
              holdDuration={2000}
              onComplete={() => alert("Simulation Abort Event Registered")}
            />
            <HoldButton
              variant="green"
              label="HOLD TO SYNC BLACKBOX"
              holdDuration={1500}
              onComplete={() => alert("Flight Blackbox Telemetry Synced")}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
