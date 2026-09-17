import React, { useEffect, useRef, useState } from "react";

const NAVIKSHA_TASK_SEQUENCES = [
  {
    status: "Edge Vision Pipeline",
    lines: [
      "Initializing ONNX TensorRT edge runtime...",
      "Calibrating payload cameras (30 FPS, 1080p)...",
      "Running MediaPipe hand & pose keypoints...",
      "Segmenting payload rack slot coordinates...",
      "Perception confidence: 99.4% nominal...",
    ],
  },
  {
    status: "Sequence Assurance Engine",
    lines: [
      "Loading active mission protocol schema...",
      "Tracking hand-object spatial interaction...",
      "Validating step order: Step 4 Centrifuge Latch...",
      "Checking step duration & timing tolerances...",
      "Zero sequence violations detected...",
      "Committing cryptographic telemetry log...",
    ],
  },
  {
    status: "Offline Astronaut Assistant",
    lines: [
      "Initializing local neural TTS model...",
      "Synthesizing voice cue: 'Step 4 verified'...",
      "Listening for astronaut voice feedback...",
      "Audio waveform analysis running offline...",
      "All space-grade diagnostics nominal...",
    ],
  },
];

export const LoadingAnimation = ({ progress = 50 }) => (
  <div className="relative h-7 w-7">
    <svg
      aria-label={`Loading progress: ${Math.round(progress)}%`}
      className="h-full w-full"
      fill="none"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Loading Progress Indicator</title>

      <defs>
        <mask id="progress-mask">
          <rect fill="black" height="240" width="240" />
          <circle
            cx="120"
            cy="120"
            fill="white"
            r="120"
            strokeDasharray={`${(progress / 100) * 754}, 754`}
            transform="rotate(-90 120 120)"
          />
        </mask>
      </defs>

      <style>
        {`
          @keyframes rotate-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes rotate-ccw {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .g-spin circle {
            transform-origin: 120px 120px;
          }
          .g-spin circle:nth-child(1) { animation: rotate-cw 8s linear infinite; }
          .g-spin circle:nth-child(2) { animation: rotate-ccw 8s linear infinite; }
          .g-spin circle:nth-child(3) { animation: rotate-cw 8s linear infinite; }
          .g-spin circle:nth-child(4) { animation: rotate-ccw 8s linear infinite; }
          .g-spin circle:nth-child(5) { animation: rotate-cw 8s linear infinite; }
          .g-spin circle:nth-child(6) { animation: rotate-ccw 8s linear infinite; }

          .g-spin circle:nth-child(2n) { animation-delay: 0.2s; }
          .g-spin circle:nth-child(3n) { animation-delay: 0.3s; }
        `}
      </style>

      <g
        className="g-spin"
        mask="url(#progress-mask)"
        strokeDasharray="18% 40%"
        strokeWidth="16"
      >
        <circle cx="120" cy="120" opacity="0.95" r="150" stroke="#06b6d4" />
        <circle cx="120" cy="120" opacity="0.95" r="130" stroke="#3b82f6" />
        <circle cx="120" cy="120" opacity="0.95" r="110" stroke="#10b981" />
        <circle cx="120" cy="120" opacity="0.95" r="90" stroke="#f59e0b" />
        <circle cx="120" cy="120" opacity="0.95" r="70" stroke="#a855f7" />
        <circle cx="120" cy="120" opacity="0.95" r="50" stroke="#ec4899" />
      </g>
    </svg>
  </div>
);

export default function AILoadingState({ taskSequences = NAVIKSHA_TASK_SEQUENCES }) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const codeContainerRef = useRef(null);
  const rootRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const lineHeight = 28;

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const currentSequence = taskSequences[sequenceIndex] || taskSequences[0];
  const totalLines = currentSequence.lines.length;

  useEffect(() => {
    const initialLines = [];
    for (let i = 0; i < Math.min(5, totalLines); i++) {
      initialLines.push({
        text: currentSequence.lines[i],
        number: i + 1,
      });
    }
    setVisibleLines(initialLines);
    setScrollPosition(0);
  }, [sequenceIndex, currentSequence.lines, totalLines]);

  useEffect(() => {
    if (!isVisible) return;

    const advanceTimer = setInterval(() => {
      const firstVisibleLineIndex = Math.floor(scrollPosition / lineHeight);
      const nextLineIndex = (firstVisibleLineIndex + 3) % totalLines;

      if (nextLineIndex < firstVisibleLineIndex && nextLineIndex !== 0) {
        setSequenceIndex((prevIndex) => (prevIndex + 1) % taskSequences.length);
        return;
      }

      if (nextLineIndex >= visibleLines.length && nextLineIndex < totalLines) {
        setVisibleLines((prevLines) => [
          ...prevLines,
          {
            text: currentSequence.lines[nextLineIndex],
            number: nextLineIndex + 1,
          },
        ]);
      }

      setScrollPosition((prevPosition) => prevPosition + lineHeight);
    }, 1800);

    return () => clearInterval(advanceTimer);
  }, [
    isVisible,
    scrollPosition,
    visibleLines,
    totalLines,
    sequenceIndex,
    currentSequence.lines,
    lineHeight,
    taskSequences.length,
  ]);

  useEffect(() => {
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div
      className="flex min-h-full w-full items-center justify-center p-2"
      ref={rootRef}
    >
      <div className="w-full max-w-md space-y-3 bg-zinc-950/90 border border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur">
        <div className="flex items-center space-x-3 font-mono text-xs">
          <LoadingAnimation
            progress={(sequenceIndex / taskSequences.length) * 100 + 33}
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-wide">
              {currentSequence.status}
            </span>
            <span className="text-cyan-400 text-[10px] animate-pulse">
              TELEMETRY BUS MONITOR // VERIFYING...
            </span>
          </div>
        </div>

        <div className="relative">
          <div
            className="relative h-[84px] w-full overflow-hidden rounded-lg bg-black/80 border border-zinc-800/80 font-mono text-[11px]"
            ref={codeContainerRef}
            style={{ scrollBehavior: "smooth" }}
          >
            <div>
              {visibleLines.map((line) => (
                <div
                  className="flex h-[28px] items-center px-2"
                  key={`${line.number}-${line.text}`}
                >
                  <div className="w-6 select-none pr-2 text-right text-zinc-600">
                    {line.number}
                  </div>

                  <div className="ml-1 flex-1 text-cyan-300/90 truncate">
                    {line.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 rounded-lg"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
