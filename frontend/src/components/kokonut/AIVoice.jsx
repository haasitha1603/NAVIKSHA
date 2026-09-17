import React, { useEffect, useState } from "react";
import { Mic, MicOff, Volume2, Sparkles, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIVoice({ className, onCommand }) {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [transcript, setTranscript] = useState("Awaiting voice command...");
  const [responseMessage, setResponseMessage] = useState(
    "Astronaut voice channel ready. Offline Whisper engine online."
  );

  const sampleCommands = [
    { text: "Verify Step 2: Centrifuge latch", response: "Step 2 latch verified. Astronaut hand clear." },
    { text: "Read next protocol step", response: "Step 3: Transfer 5mL reagent into vial B-2." },
    { text: "Check sequence status", response: "All 5 prior steps validated. Zero protocol deviations." },
    { text: "Log manual override", response: "Override registered with timestamp in flight log." },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let intervalId;
    if (submitted) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(intervalId);
  }, [submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleListen = () => {
    if (!submitted) {
      setSubmitted(true);
      setTranscript("Listening for astronaut voice input...");
      setResponseMessage("Analyzing audio spectrogram at edge...");
      // Simulate speech detection
      const randomCmd =
        sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
      setTimeout(() => {
        setTranscript(`"${randomCmd.text}"`);
        setResponseMessage(randomCmd.response);
        if (onCommand) onCommand(randomCmd.text);
      }, 3500);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-zinc-950/80 border border-zinc-800 p-6 shadow-2xl backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
            OFFLINE ASTRONAUT VOICE ASSISTANT
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          EDGE AUDIO // NO CLOUD
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-3">
        {/* Main Mic Button */}
        <button
          className={cn(
            "group relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300",
            submitted
              ? "bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              : "bg-zinc-900 border border-zinc-700 hover:border-cyan-400/80 hover:bg-zinc-850"
          )}
          onClick={toggleListen}
          type="button"
          aria-label={submitted ? "Stop listening" : "Start listening"}
        >
          {submitted ? (
            <div
              className="pointer-events-auto h-7 w-7 animate-spin rounded-md bg-cyan-400"
              style={{ animationDuration: "2.5s" }}
            />
          ) : (
            <Mic className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
          )}

          {submitted && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
        </button>

        {/* Timer */}
        <span
          className={cn(
            "font-mono text-sm tracking-widest transition-colors duration-300",
            submitted ? "text-cyan-400 font-bold" : "text-zinc-500"
          )}
        >
          {formatTime(time)}
        </span>

        {/* 48 Waveform bars */}
        <div className="flex h-8 w-full max-w-md items-center justify-center gap-1 px-4 py-1 bg-black/40 rounded-lg border border-zinc-900">
          {[...Array(48)].map((_, i) => (
            <div
              className={cn(
                "w-1 rounded-full transition-all duration-200",
                submitted
                  ? "bg-gradient-to-t from-cyan-500 to-blue-400"
                  : "h-1.5 bg-zinc-800"
              )}
              key={i}
              style={
                submitted && isClient
                  ? {
                      height: `${15 + Math.sin(i * 0.4 + time * 3) * 35 + Math.random() * 40}%`,
                      animationDelay: `${i * 0.03}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* Listening / Feedback text */}
        <p className="font-mono text-xs text-center transition-colors">
          {submitted ? (
            <span className="text-cyan-400 animate-pulse">
              ● Listening to astronaut mic feed...
            </span>
          ) : (
            <span className="text-zinc-400">
              Click microphone to speak or test voice commands
            </span>
          )}
        </p>

        {/* Transcript Box */}
        <div className="w-full bg-black/60 border border-zinc-800/80 rounded-lg p-3 text-left font-mono text-xs space-y-1 mt-1">
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider">
            Heard Command:
          </div>
          <div className="text-cyan-300 font-medium">{transcript}</div>
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider pt-1 border-t border-zinc-900">
            NAVIKSHA Speech Response:
          </div>
          <div className="text-emerald-400">{responseMessage}</div>
        </div>

        {/* Sample Command Quick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[10px] text-zinc-500 font-mono">Quick test:</span>
          {sampleCommands.map((cmd) => (
            <button
              key={cmd.text}
              type="button"
              className="text-[10px] font-mono bg-zinc-900 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-zinc-300 px-2 py-1 rounded border border-zinc-800 transition-colors"
              onClick={() => {
                setTranscript(`"${cmd.text}"`);
                setResponseMessage(cmd.response);
                if (onCommand) onCommand(cmd.text);
              }}
            >
              {cmd.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
