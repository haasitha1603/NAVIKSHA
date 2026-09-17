import React from 'react';
import { Cpu, Database, AlertCircle, CheckCircle2, Upload, FileCode } from 'lucide-react';

export const ModelManagement = () => {
  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-space-900 border border-space-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Model Registry & Dataset Management</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Manage edge AI perception models, dataset annotations, and inference configurations.
            </p>
          </div>
        </div>

        {/* Dataset Status Banner */}
        <div className="bg-space-900 border border-amber-500/30 p-5 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>DATASET STATUS: AWAITING CUSTOM EXPERIMENT DATASET UPLOAD</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The system is currently running on the <strong>Baseline Perception Mode</strong> (OpenCV tracking, MediaPipe keypoint heuristics, spatial hand-object interaction rules). Once custom dataset videos are uploaded tonight, custom PyTorch/YOLO model weights can be registered below.
          </p>
        </div>

        {/* Loaded Models List */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">// LOADED AI PERCEPTION ADAPTERS (1)</h2>

          <div className="bg-space-900 border border-cyan-500/30 p-5 rounded-xl font-mono text-xs space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>baseline-perception-v1</span>
                  <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded">ACTIVE BASELINE</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Type: Hybrid Spatial & Temporal Perception Adapter (OpenCV + MediaPipe Keypoints)
                </div>
              </div>

              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                LOADED & OPERATIONAL
              </span>
            </div>

            <div className="bg-space-950 p-3 rounded-lg border border-space-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]">
              <div>
                <span className="text-slate-500 block">Object Classes:</span>
                <span className="text-slate-200">person, hand, rack, component, slot</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pose Estimation:</span>
                <span className="text-slate-200">MediaPipe 2D Keypoints</span>
              </div>
              <div>
                <span className="text-slate-500 block">Orientation Agnostic:</span>
                <span className="text-slate-400">Optional Extension</span>
              </div>
              <div>
                <span className="text-slate-500 block">Training Metrics:</span>
                <span className="text-slate-400">Baseline Heuristic</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
