import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, FileText, Cpu, Settings, PlayCircle, Eye } from 'lucide-react';

export const Header = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Mission Console', path: '/console', icon: Activity },
    { label: 'Protocol Designer', path: '/protocols', icon: FileText },
    { label: 'Replay & Analysis', path: '/replay', icon: PlayCircle },
    { label: 'Reports', path: '/reports', icon: Shield },
    { label: 'Models & Data', path: '/models', icon: Cpu },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="border-b border-space-800 bg-space-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
              NAVIKSHA
            </div>
            <div className="text-[10px] text-cyan-500/80 font-mono tracking-tighter uppercase hidden sm:block">
              Autonomous Vision Intelligence
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OFFLINE STANDALONE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
