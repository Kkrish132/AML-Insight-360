import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Users, 
  Zap, 
  RotateCw, 
  Scale, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<string>('stages');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-glow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                AML Typology &amp; Mule Detection Handbook
              </h3>
              <p className="text-xs text-slate-400">
                Theoretical foundation &amp; detection engineering reference for Major Project presentation.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playScanTick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          {[
            { id: 'stages', label: '3 Stages of AML', icon: Layers },
            { id: 'mules', label: 'Mule Archetypes', icon: Users },
            { id: 'typologies', label: 'Detection Typologies', icon: Zap },
            { id: 'compliance', label: 'Regulatory Frameworks', icon: Scale },
          ].map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  soundFx.playScanTick();
                  setActiveSection(sec.id);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  activeSection === sec.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-glow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {activeSection === 'stages' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs">1</span>
                  Placement (Injecting Illicit Funds)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  The initial introduction of illegal proceeds into the legitimate financial system. Common tactics include <strong>smurfing</strong> (breaking large amounts into sums &lt; $10,000 to evade CTR reporting), depositing cash into student accounts, or purchasing prepaid cards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-bold text-amber-400 font-mono flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center text-xs">2</span>
                  Layering (Obfuscating the Money Trail)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Moving funds through multiple complex transactions, cross-border wires, rapid pass-through mule hops, and shell entities to obscure the original source. High-velocity drainage (&lt; 60 seconds) is the signature footprint of layering mules.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-bold text-cyan-400 font-mono flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs">3</span>
                  Integration (Legitimized Asset Conversion)
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Re-entering the cleaned funds into the economy as legitimate wealth—through luxury assets, offshore real estate, commercial investments, or peer-to-peer crypto OTC liquidity desks.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'mules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
                <h4 className="text-sm font-bold text-amber-300 font-mono mb-1">
                  1. Deceived / Unwitting Mule (Scam Victim)
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  Often recruited via fake "Work from Home Payment Processing" job listings, student gigs, or romance scams. The victim believes they are executing legitimate tasks and retains no commission or small stipend before transferring money.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-red-500/30">
                <h4 className="text-sm font-bold text-red-300 font-mono mb-1">
                  2. Complicit Mule (Recruited Facilitator)
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  Knowingly rents their bank credentials or executes rapid withdrawals in exchange for a fixed commission percentage (typically 3% - 10%). Exhibits shared device fingerprints with other syndicate accounts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
                <h4 className="text-sm font-bold text-purple-300 font-mono mb-1">
                  3. Synthetic / Stolen Identity Mule
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  Accounts opened using compromised Social Security Numbers, forged IDs, or synthetic identities pieced together from dark web breaches. Managed via automated headless browsers and VPS proxies.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/40">
                <h4 className="text-sm font-bold text-rose-300 font-mono mb-1">
                  4. Master Ring Organizer / Hub Account
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  The central consolidation node that receives dispersed streams from dozens of micro-mules, aggregates the illicit capital, and executes high-value bulk transfers to offshore bridges or mixers.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'typologies' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  ⚡ Pass-Through Velocity &amp; Rapid Evacuation
                </div>
                <p className="text-slate-300 text-[11px] mt-1">
                  Legitimate accounts maintain a balance and show gradual spending. Money mule accounts exhibit <strong>immediate 95%+ drainage within seconds/minutes</strong> of fund receipt.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 font-mono">
                  📱 Device ID &amp; Subnet Co-Location Clustering
                </div>
                <p className="text-slate-300 text-[11px] mt-1">
                  Multiple distinct legal identities logging into banking apps from the same physical device hardware identifier (IMEI/UUID) or residential proxy subnet indicates organized ring coordination.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 font-mono">
                  🔄 Graph Cycle Detection (Circular Round-Tripping)
                </div>
                <p className="text-slate-300 text-[11px] mt-1">
                  Applying graph theory algorithms (Tarjan’s strongly connected components / DFS cycle traversal) to detect circular invoicing and shell entity round-trips where money returns to the originator.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'compliance' && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div>
                <h4 className="font-mono font-bold text-slate-200">FinCEN (Financial Crimes Enforcement Network)</h4>
                <p className="text-slate-300 text-[11px]">Enforces the Bank Secrecy Act (BSA) in the United States. Mandates filing of Suspicious Activity Reports (SARs) within 30 calendar days.</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="font-mono font-bold text-slate-200">FATF (Financial Action Task Force) 40 Recommendations</h4>
                <p className="text-slate-300 text-[11px]">The global standard setting body for Anti-Money Laundering and Counter-Terrorist Financing (AML/CFT).</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <h4 className="font-mono font-bold text-slate-200">USA PATRIOT Act Section 314(b)</h4>
                <p className="text-slate-300 text-[11px]">Enables financial institutions to share information with one another to detect and prevent money laundering networks.</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={() => {
              soundFx.playScanTick();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-mono font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-emerald-300"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
