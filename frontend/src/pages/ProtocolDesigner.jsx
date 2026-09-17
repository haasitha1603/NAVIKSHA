import React, { useState } from 'react';
import { FileText, Plus, Trash2, Save, Download, Upload, Shield } from 'lucide-react';

export const ProtocolDesigner = () => {
  const [protocol, setProtocol] = useState({
    protocol_id: 'color-sort-rack-v1',
    name: 'ColorSort-Rack Experiment',
    version: '1.0.0',
    description: 'Demonstration protocol for component transfer and placement.',
    steps: [
      { id: 'step-01', order: 1, name: 'Prepare Workspace', expected_activity: 'PREPARE', target_region: 'rack_main', recovery_instruction: 'Return hands to neutral posture.' },
      { id: 'step-02', order: 2, name: 'Identify Component', expected_activity: 'IDENTIFY', target_region: 'source_tray', recovery_instruction: 'Look toward source tray.' },
      { id: 'step-03', order: 3, name: 'Reach for Component', expected_activity: 'REACH', target_region: 'source_tray', recovery_instruction: 'Reach primary hand.' },
      { id: 'step-04', order: 4, name: 'Pick Up Component', expected_activity: 'GRASP', target_region: 'source_tray', recovery_instruction: 'Firmly grasp component.' },
      { id: 'step-05', order: 5, name: 'Move Component', expected_activity: 'MOVE', target_region: 'target_slot', recovery_instruction: 'Move toward target slot.' },
      { id: 'step-06', order: 6, name: 'Place Component', expected_activity: 'PLACE', target_region: 'target_slot', recovery_instruction: 'Insert into slot.' },
    ]
  });

  const addStep = () => {
    const nextOrder = protocol.steps.length + 1;
    const newStep = {
      id: `step-0${nextOrder}`,
      order: nextOrder,
      name: `Custom Step ${nextOrder}`,
      expected_activity: 'VERIFY',
      target_region: 'target_slot',
      recovery_instruction: 'Verify alignment.'
    };
    setProtocol({ ...protocol, steps: [...protocol.steps, newStep] });
  };

  const removeStep = (idx) => {
    const updated = protocol.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
    setProtocol({ ...protocol, steps: updated });
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(protocol, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${protocol.protocol_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-space-900 border border-space-800 p-4 rounded-xl">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Experiment Protocol Designer</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Create, edit, or customize experiment protocols for procedural AI validation.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={addStep}
              className="bg-space-800 hover:bg-space-700 border border-space-700 text-xs px-3 py-2 rounded-lg text-slate-200 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Step</span>
            </button>
            <button
              onClick={exportJson}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow"
            >
              <Download className="w-4 h-4" />
              <span>Export Protocol JSON</span>
            </button>
          </div>
        </div>

        {/* Protocol Details Form */}
        <div className="bg-space-900 border border-space-800 p-5 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Protocol ID</label>
              <input
                type="text"
                value={protocol.protocol_id}
                onChange={(e) => setProtocol({ ...protocol, protocol_id: e.target.value })}
                className="w-full bg-space-950 border border-space-800 rounded px-3 py-2 text-xs font-mono text-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Protocol Name</label>
              <input
                type="text"
                value={protocol.name}
                onChange={(e) => setProtocol({ ...protocol, name: e.target.value })}
                className="w-full bg-space-950 border border-space-800 rounded px-3 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-wider">// PROTOCOL STEPS SEQUENCE ({protocol.steps.length})</h2>
          {protocol.steps.map((step, idx) => (
            <div key={step.id} className="bg-space-900 border border-space-800 p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                  #{step.order}
                </span>
                <div>
                  <div className="font-bold text-white text-sm">{step.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Expected Activity: <strong className="text-cyan-400">{step.expected_activity}</strong> | Target: {step.target_region}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeStep(idx)}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
