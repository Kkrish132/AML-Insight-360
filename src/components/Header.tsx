import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Search, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  FileText, 
  BookOpen, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSAR: () => void;
  onOpenKnowledgeBase: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenSAR,
  onOpenKnowledgeBase,
  onSearch,
  searchQuery
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playScanTick();
    }
  };

  const handleToggleTheme = () => {
    soundFx.playScanTick();
    setDarkMode(!darkMode);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 backdrop-blur-md px-4 lg:px-6 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-900 border border-emerald-400/40 shadow-glow">
            <ShieldAlert className="w-6 h-6 text-emerald-300 animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                AegisAML <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-950/40">AI Core v4.2</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-amber-300/90 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" /> Major Project Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1.5 font-mono">
              <Activity className="w-3 h-3 text-emerald-400 inline" /> Mule Account & Money Laundering Graph Intelligence
            </p>
          </div>
        </div>

        {/* Global Node & Transaction Search */}
        <div className="w-full md:w-80 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search account, name, IP, device..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-mono rounded-lg bg-slate-900/60 dark:bg-slate-900/80 border border-emerald-500/30 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearch('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Typology Knowledge Base */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenKnowledgeBase();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-emerald-300 rounded-lg border border-slate-700/60 hover:border-emerald-500/40 bg-slate-900/50 transition-all"
            title="AML Typologies & Mule Detection Handbook"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">AML Typology Guide</span>
          </button>

          {/* Quick SAR Generator Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenSAR();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 shadow-glow-gold transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate SAR</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all ${
              isMuted 
                ? 'border-slate-700 text-slate-500 bg-slate-900/30' 
                : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40 shadow-glow-sm'
            }`}
            title={isMuted ? 'Unmute High-Tech Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (Luminous Light / Cyber Dark) */}
          <button
            onClick={handleToggleTheme}
            className="p-2 rounded-lg border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 bg-slate-900/50 transition-all"
            title={darkMode ? 'Switch to Luminous Light Mode' : 'Switch to Cyber Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
