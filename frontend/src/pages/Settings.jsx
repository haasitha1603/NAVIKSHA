import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Volume2, Cpu, Shield, Video } from 'lucide-react';

export const Settings = () => {
  const [confidence, setConfidence] = useState(0.65);
  const [debounce, setDebounce] = useState(3);
  const [streamIp, setStreamIp] = useState('127.0.0.1');
  const [streamPort, setStreamPort] = useState(8554);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-space-900 border border-space-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              <span>System Settings & Configuration</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Configure edge AI thresholds, offline voice parameters, and IP streaming.
            </p>
          </div>
        </div>

        <div className="bg-space-900 border border-space-800 p-6 rounded-xl space-y-6 font-mono text-xs">
          <div>
            <label className="text-sm font-bold text-white block mb-2">Inference Confidence Threshold ({Math.round(confidence * 100)}%)</label>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-white block mb-2">Activity Debounce Frames ({debounce} frames)</label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={debounce}
              onChange={(e) => setDebounce(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div className="pt-4 border-t border-space-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Optional Stream IP Address</label>
              <input
                type="text"
                value={streamIp}
                onChange={(e) => setStreamIp(e.target.value)}
                className="w-full bg-space-950 border border-space-800 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Optional Stream Port</label>
              <input
                type="number"
                value={streamPort}
                onChange={(e) => setStreamPort(parseInt(e.target.value))}
                className="w-full bg-space-950 border border-space-800 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
