import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, AlertTriangle, CheckCircle2, ShieldAlert, Volume2, VolumeX, Download, RefreshCw, Cpu, Activity, Info, ChevronRight, Video } from 'lucide-react';

export const MissionConsole = () => {
  const [sessionId, setSessionId] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sourceCategory, setSourceCategory] = useState('sample'); // 'sample', 'camera', 'dataset'
  const [datasetVideos, setDatasetVideos] = useState([]);
  const [selectedDatasetVideo, setSelectedDatasetVideo] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Live Telemetry state
  const [frameData, setFrameData] = useState(null);
  const [fps, setFps] = useState(0);
  const [perception, setPerception] = useState({ predicted_activity: 'IDLE', confidence: 0.0, detections: [], keypoints: [] });
  const [protocolState, setProtocolState] = useState({
    status: 'READY',
    completion_percentage: 0,
    current_step: null,
    next_recommended_step: null,
    completed_step_ids: [],
    skipped_step_ids: []
  });

  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Fetch uploaded dataset videos list
    fetch('/api/dataset/videos')
      .then((res) => res.json())
      .then((data) => {
        setDatasetVideos(data);
        if (data.length > 0) {
          setSelectedDatasetVideo(data[0].path);
        }
      })
      .catch((err) => console.error("Failed to load dataset videos:", err));
  }, []);

  // Compute final input_source string
  const getInputSource = () => {
    if (sourceCategory === 'dataset' && selectedDatasetVideo) {
      return `dataset:${selectedDatasetVideo}`;
    }
    return sourceCategory;
  };

  // Web Speech API Local TTS
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Local TTS error:", err);
    }
  };

  // Start Session
  const startSession = async () => {
    try {
      const activeSource = getInputSource();
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment_id: 'exp-2026-color-sort',
          protocol_id: 'color-sort-rack-v1',
          input_source: activeSource,
          model_id: 'baseline-perception-v1'
        })
      });
      const data = await res.json();
      setSessionId(data.id);
      setIsRunning(true);
      setEvents([]);
      setAlerts([]);

      // Connect WebSocket
      connectWebSocket(data.id);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  const stopSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsRunning(false);
  };

  const connectWebSocket = (sid) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/sessions/${sid}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.frame_b64) setFrameData(msg.frame_b64);
      if (msg.fps) setFps(msg.fps);
      if (msg.perception) setPerception(msg.perception);
      if (msg.protocol) setProtocolState(msg.protocol);

      if (msg.new_events && msg.new_events.length > 0) {
        setEvents((prev) => [...msg.new_events, ...prev]);
      }

      if (msg.new_alerts && msg.new_alerts.length > 0) {
        setAlerts((prev) => [...msg.new_alerts, ...prev]);
      }

      if (msg.voice_alerts && msg.voice_alerts.length > 0) {
        msg.voice_alerts.forEach((vMsg) => speakText(vMsg));
      }
    };

    ws.onclose = () => {
      setIsRunning(false);
    };
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const exportLog = (format) => {
    if (!sessionId) return;
    window.open(`/api/sessions/${sessionId}/export/${format}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Top Session Controls Bar */}
      <div className="max-w-7xl mx-auto bg-space-900 border border-space-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wider flex items-center gap-2">
              <span>NAVIKSHA LIVE MISSION CONSOLE</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                {protocolState.status}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Session ID: {sessionId || 'READY_TO_START'} | Protocol: ColorSort-Rack Experiment
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sourceCategory}
            onChange={(e) => setSourceCategory(e.target.value)}
            disabled={isRunning}
            className="bg-space-800 border border-space-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="sample">Synthetic Rack Feed (Demo)</option>
            <option value="camera">Local Webcam</option>
            <option value="dataset">Uploaded Experiment Videos ({datasetVideos.length})</option>
          </select>

          {sourceCategory === 'dataset' && (
            <select
              value={selectedDatasetVideo}
              onChange={(e) => setSelectedDatasetVideo(e.target.value)}
              disabled={isRunning}
              className="bg-space-800 border border-cyan-500/40 text-xs text-cyan-300 rounded-lg px-3 py-2 max-w-xs focus:outline-none"
            >
              {datasetVideos.map((vid) => (
                <option key={vid.id} value={vid.path}>
                  {vid.filename} ({vid.size_mb} MB)
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center space-x-1 transition-all ${
              voiceEnabled ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-space-800 border-space-700 text-slate-400'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!isRunning ? (
            <button
              onClick={startSession}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-5 py-2 rounded-lg shadow cyan-glow flex items-center space-x-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Experiment Session</span>
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs px-5 py-2 rounded-lg flex items-center space-x-2 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Video Canvas & Perception Overlay (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-space-900 border border-space-800 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Live Video Feed ({sourceCategory === 'dataset' ? 'Dataset MP4 Video' : sourceCategory})
              </span>
              <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                <span>FPS: <strong className="text-emerald-400">{fps}</strong></span>
                <span>Mode: <strong className="text-cyan-400">Baseline Edge AI</strong></span>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video bg-space-950 rounded-lg border border-space-800 flex items-center justify-center overflow-hidden">
              {frameData ? (
                <img src={frameData} alt="Live Stream" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-6 text-slate-500 font-mono text-xs">
                  <Cpu className="w-8 h-8 text-space-700 mx-auto mb-2 animate-pulse" />
                  <p>Session Inactive. Select a video source and click "Start Experiment Session".</p>
                </div>
              )}

              {/* Perception Overlay Badge */}
              {isRunning && (
                <div className="absolute bottom-3 left-3 bg-space-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-md text-xs font-mono flex items-center space-x-3 backdrop-blur">
                  <span className="text-slate-400">Observed Action:</span>
                  <span className="text-cyan-400 font-bold">{perception.predicted_activity}</span>
                  <span className="text-emerald-400">({Math.round(perception.confidence * 100)}% Conf)</span>
                </div>
              )}
            </div>
          </div>

          {/* Alert Center & Deviation Warnings */}
          <div className="bg-space-900 border border-space-800 rounded-xl p-4">
            <h3 className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Real-Time Alert Center ({alerts.length})
            </h3>

            {alerts.length === 0 ? (
              <div className="p-4 bg-space-950 rounded-lg text-xs font-mono text-slate-500 text-center border border-space-850">
                No active procedural warnings detected. Protocol running normally.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {alerts.map((alt, idx) => (
                  <div
                    key={alt.id || idx}
                    className={`p-3 rounded-lg border text-xs font-mono flex items-start justify-between ${
                      alt.severity === 'WARNING'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold mb-0.5">{alt.message}</div>
                        <div className="text-[11px] opacity-80">{alt.voice_message}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Protocol Progress & Next Action Guidance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Next Recommended Action Card */}
          <div className="bg-space-900 border border-cyan-500/40 rounded-xl p-5 cyan-glow">
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest mb-1">
              // NEXT RECOMMENDED ASTRONAUT ACTION
            </div>
            
            {protocolState.current_step ? (
              <div>
                <div className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <span>Step {protocolState.current_step.order}: {protocolState.current_step.name}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {protocolState.current_step.description}
                </p>

                <div className="bg-space-950 p-3 rounded-lg border border-space-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected Action:</span>
                    <span className="text-cyan-400 font-bold">{protocolState.current_step.expected_activity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required Target:</span>
                    <span className="text-slate-200">{protocolState.current_step.target_region || 'rack_main'}</span>
                  </div>
                </div>

                {protocolState.current_step.recovery_instruction && (
                  <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-300 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <span>Guide: {protocolState.current_step.recovery_instruction}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs font-mono text-emerald-400 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                Experiment completed! All protocol steps executed.
              </div>
            )}
          </div>

          {/* Protocol Timeline Steps Progress */}
          <div className="bg-space-900 border border-space-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Protocol Progress Timeline ({protocolState.completion_percentage}%)
              </span>
            </div>

            <div className="w-full bg-space-950 h-2 rounded-full overflow-hidden mb-4 border border-space-800">
              <div
                className="bg-cyan-400 h-full transition-all duration-500"
                style={{ width: `${protocolState.completion_percentage}%` }}
              ></div>
            </div>

            <div className="space-y-2 text-xs font-mono max-h-56 overflow-y-auto pr-1">
              {['Prepare Workspace', 'Identify Component', 'Reach for Component', 'Pick Up Component', 'Move Component', 'Place Component', 'Verify Placement', 'Return to Neutral', 'Complete Experiment'].map((stepName, i) => {
                const stepNum = i + 1;
                const stepId = `step-0${stepNum}`;
                const isCompleted = protocolState.completed_step_ids.includes(stepId);
                const isSkipped = protocolState.skipped_step_ids.includes(stepId);
                const isCurrent = protocolState.current_step?.order === stepNum;

                return (
                  <div
                    key={stepId}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : isSkipped
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : isCurrent
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-space-950 border-space-850 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] opacity-70">#{stepNum}</span>
                      <span>{stepName}</span>
                    </div>

                    <span className="text-[10px] font-bold uppercase">
                      {isCompleted && 'COMPLETED'}
                      {isSkipped && 'SKIPPED'}
                      {isCurrent && 'ACTIVE'}
                      {!isCompleted && !isSkipped && !isCurrent && 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export Mission Logs Card */}
          <div className="bg-space-900 border border-space-800 rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">Export Structured Experiment Record:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => exportLog('json')}
                className="bg-space-800 hover:bg-space-700 border border-space-700 text-cyan-400 text-xs px-2.5 py-1 rounded"
              >
                JSON
              </button>
              <button
                onClick={() => exportLog('csv')}
                className="bg-space-800 hover:bg-space-700 border border-space-700 text-cyan-400 text-xs px-2.5 py-1 rounded"
              >
                CSV
              </button>
              <button
                onClick={() => exportLog('txt')}
                className="bg-space-800 hover:bg-space-700 border border-space-700 text-cyan-400 text-xs px-2.5 py-1 rounded"
              >
                TXT Log
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
