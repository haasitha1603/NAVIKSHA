import React, { useState, useEffect } from 'react';
import { PlayCircle, Shield, Download, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const Replay = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="bg-space-900 border border-space-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-cyan-400" />
              <span>Experiment Replay & Historical Analysis</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Review past experiment executions, playback event streams, and analyze procedural sequence logs.
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 bg-space-900 border border-space-800 rounded-xl text-center text-xs font-mono text-slate-500">
            No historical experiment sessions recorded yet. Run a session in the Mission Console to generate logs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div key={sess.id} className="bg-space-900 border border-space-800 p-4 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-cyan-400">{sess.id}</div>
                    <div className="text-slate-400 text-[11px]">{sess.protocol_id}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">
                    {sess.status} ({sess.completion_percentage}%)
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  Started: {new Date(sess.started_at).toLocaleString()}
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-space-800">
                  <a
                    href={`/api/sessions/${sess.id}/export/json`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-space-800 hover:bg-space-700 text-cyan-400 text-[11px] px-2.5 py-1 rounded"
                  >
                    JSON Log
                  </a>
                  <a
                    href={`/api/sessions/${sess.id}/export/csv`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-space-800 hover:bg-space-700 text-cyan-400 text-[11px] px-2.5 py-1 rounded"
                  >
                    CSV
                  </a>
                  <a
                    href={`/api/sessions/${sess.id}/export/txt`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-space-800 hover:bg-space-700 text-cyan-400 text-[11px] px-2.5 py-1 rounded"
                  >
                    TXT Summary
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
