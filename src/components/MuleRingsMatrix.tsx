import React from 'react';
import { 
  Network, 
  ShieldAlert, 
  FileText, 
  ExternalLink, 
  Users, 
  DollarSign, 
  Lock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { MuleRing, Scenario, AccountNode } from '../types';
import { soundFx } from '../utils/audio';

interface MuleRingsMatrixProps {
  scenario: Scenario;
  onOpenSAR: () => void;
  onSelectNodeById: (nodeId: string) => void;
}

export const MuleRingsMatrix: React.FC<MuleRingsMatrixProps> = ({
  scenario,
  onOpenSAR,
  onSelectNodeById
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-emerald-500/20 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Identified Money Mule Rings &amp; Syndicates
            </h3>
            <p className="text-[11px] text-slate-400">
              Clustered networks detected by graph cycle detection, device fingerprinting, and flow velocity algorithms.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 self-start sm:self-auto">
          {scenario.muleRings.length} Syndicates Tracked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {scenario.muleRings.map(ring => {
          return (
            <div 
              key={ring.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/25 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-glow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      {ring.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-100 font-mono mt-1">
                      {ring.name}
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                      Risk: {ring.ringRiskScore}/100
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 mb-3 line-clamp-2">
                  {ring.description}
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Total Laundered</span>
                    <div className="font-bold text-amber-400 mt-0.5">
                      ${ring.totalLaundered.toLocaleString()} USD
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase">Mule Nodes</span>
                    <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {ring.nodeCount} Accounts
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectNodeById(ring.keyOrganizerId)}
                  className="text-xs font-mono text-slate-300 hover:text-emerald-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect Hub</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playScanTick();
                    onOpenSAR();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-glow-gold transition-all"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>File FinCEN SAR</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
