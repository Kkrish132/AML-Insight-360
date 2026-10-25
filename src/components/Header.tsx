import React, { useState, useRef, useEffect } from 'react';
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
  Sparkles,
  UploadCloud,
  PlusCircle,
  Download,
  Building2,
  AlertTriangle,
  ArrowRight,
  User,
  ShieldCheck
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { Scenario, AccountNode } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSAR: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenUploadModal: () => void;
  onOpenEditorModal: () => void;
  onExportJSON: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentScenario?: Scenario;
  onSelectNode?: (node: AccountNode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenSAR,
  onOpenKnowledgeBase,
  onOpenUploadModal,
  onOpenEditorModal,
  onExportJSON,
  onSearch,
  searchQuery,
  currentScenario,
  onSelectNode
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Filter search results or show high-risk suggestions when empty
  const queryClean = (searchQuery || '').trim().toLowerCase();
  const allNodes = currentScenario?.nodes || [];

  const searchResults: AccountNode[] = queryClean
    ? allNodes.filter(n =>
        n.name.toLowerCase().includes(queryClean) ||
        n.accountNumber.toLowerCase().includes(queryClean) ||
        n.bank.toLowerCase().includes(queryClean) ||
        n.ip.toLowerCase().includes(queryClean) ||
        n.deviceId.toLowerCase().includes(queryClean) ||
        n.muleType.toLowerCase().includes(queryClean) ||
        n.role.toLowerCase().includes(queryClean)
      ).slice(0, 8)
    : allNodes
        .slice()
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5); // top 5 flagged when empty

  const handleSelectSearchResult = (node: AccountNode) => {
    soundFx.playScanTick();
    if (onSelectNode) {
      onSelectNode(node);
    }
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 lg:px-6 py-2.5 transition-colors duration-200 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Global Node & Transaction Search with Dropdown */}
        <div ref={searchContainerRef} className="w-full md:w-[420px] relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search account no, holder name, IP, device..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                onSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchOpen(false);
              }}
              className="w-full pl-9 pr-8 py-1.5 text-xs font-mono rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  onSearch('');
                  setIsSearchOpen(false);
                }} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500">
                <span>{queryClean ? `Found (${searchResults.length}) Accounts` : '⚡ High Risk Flagged Accounts'}</span>
                <span className="text-[10px] text-slate-400">Click to inspect</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-slate-500">
                    No account matching "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((node) => {
                    const isHigh = node.riskScore > 80;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => handleSelectSearchResult(node)}
                        className="w-full px-3 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                            isHigh ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}>
                            {node.riskScore}%
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold font-mono text-slate-900 group-hover:text-emerald-700 truncate">
                              {node.name}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 truncate">
                              <span className="font-semibold text-slate-700">{node.accountNumber}</span>
                              <span>•</span>
                              <span>{node.bank}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-medium">{node.muleType}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          
          {/* CSV / Dataset Uploader Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenUploadModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-xs"
            title="Upload CSV / JSON Dataset to Generate Custom Graph"
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
            <span>Upload CSV</span>
          </button>

          {/* Add Node/Edge Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenEditorModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:text-blue-900 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all shadow-xs"
            title="Add Custom Node or Transfer Path"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>+ Edit Graph</span>
          </button>

          {/* Export JSON Button */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onExportJSON();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title="Export Current Graph Scenario as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          {/* Quick SAR Generator Trigger */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenSAR();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 shadow-xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>File FinCEN SAR</span>
          </button>

          {/* Typology Knowledge Base */}
          <button
            onClick={() => {
              soundFx.playScanTick();
              onOpenKnowledgeBase();
            }}
            className="p-1.5 rounded-lg border border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title="AML Typology Handbook"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg border transition-all shadow-xs ${
              isMuted 
                ? 'border-slate-300 text-slate-400 bg-slate-50' 
                : 'border-emerald-300 text-emerald-800 bg-emerald-50'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle (Luminous Light / Cyber Dark) */}
          <button
            onClick={handleToggleTheme}
            className="p-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all shadow-xs"
            title={darkMode ? 'Switch to Light Banking Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
