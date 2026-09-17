import React, { useState, useEffect } from 'react';
import { Shield, FileText, Download, BarChart2, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Reports = () => {
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
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Experiment Execution Reports</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Structured experiment audit records, accuracy summaries, and compliance reports.
            </p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 bg-space-900 border border-space-800 rounded-xl text-center text-xs font-mono text-slate-500">
            No completed experiment reports recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((sess) => (
              <div key={sess.id} className="bg-space-900 border border-space-800 p-5 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    <span>{sess.id}</span>
                    <span className="text-xs font-normal text-cyan-400">({sess.protocol_id})</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-1">
                    Started: {new Date(sess.started_at).toLocaleString()} | Input: {sess.input_source}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{sess.completion_percentage}% Completed</div>
                    <div className="text-[10px] text-slate-400">{sess.status}</div>
                  </div>

                  <a
                    href={`/api/sessions/${sess.id}/export/txt`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
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
