import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { MissionConsole } from './pages/MissionConsole';
import { ProtocolDesigner } from './pages/ProtocolDesigner';
import { Replay } from './pages/Replay';
import { Reports } from './pages/Reports';
import { ModelManagement } from './pages/ModelManagement';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/console" element={<MissionConsole />} />
            <Route path="/protocols" element={<ProtocolDesigner />} />
            <Route path="/replay" element={<Replay />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/models" element={<ModelManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
