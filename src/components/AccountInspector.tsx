import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  FileText, 
  Cpu, 
  Smartphone, 
  Globe, 
  Clock, 
  TrendingDown, 
  AlertOctagon, 
  CheckCircle, 
  UserCheck, 
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AccountNode } from '../types';
import { soundFx } from '../utils/audio';

interface AccountInspectorProps {
  selectedNode: AccountNode | null;
  onFreezeAccount: (nodeId: string) => void;
  onUnfreezeAccount: (nodeId: string) => void;
  onGenerateSARForNode: (node: AccountNode) => void;
  isFrozen: boolean;
}

export const AccountInspector: React.FC<AccountInspectorProps> = ({
  selectedNode,
  onFreezeAccount,
  onUnfreezeAccount,
  onGenerateSARForNode,
  isFrozen
}) => {
  if (!selectedNode) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 flex flex-col items-center justify-center text-center h-[540px]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-glow-sm">
          <ShieldAlert className="w-8 h-8 animate-pulse-slow" />
        </div>
        <h3 className="text-base font-bold text-slate-200 font-mono">No Account Selected</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Click any suspect node or transaction from the network graph or transaction monitor to inspect its AI risk fingerprint and SHAP feature analysis.
        </p>
      </div>
    );
  }

  const handleToggleFreeze = () => {
    if (isFrozen) {
      soundFx.playScanTick();
      onUnfreezeAccount(selectedNode.id);
    } else {
      soundFx.playFreeze();
      onFreezeAccount(selectedNode.id);
    }
  };

  const getMuleBadgeColor = (type: string) => {
    switch (type) {
      case 'Complicit Mule':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Deceived (Job/Romance Scam)':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Stolen Identity':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Master Organizer':
        return 'bg-rose-600/30 text-rose-200 border-rose-500/60 shadow-glow-red';
      case 'Shell Entity':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-emerald-500/30 flex flex-col h-[540px] overflow-y-auto relative">
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base border shadow-md ${
            isFrozen
              ? 'bg-red-950/80 border-red-500 text-red-300 shadow-glow-red'
              : selectedNode.riskScore > 90
              ? 'bg-red-900/40 border-red-500/60 text-red-300'
              : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
          }`}>
            {isFrozen ? '⛔' : `${selectedNode.riskScore}%`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono leading-tight">
                {selectedNode.name}
              </h3>
              {isFrozen && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 animate-pulse">
                  FROZEN
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span>{selectedNode.accountNumber}</span>
              <span>•</span>
              <span>{selectedNode.bank}</span>
              <span>•</span>
              <span>{selectedNode.country}</span>
            </div>
          </div>
        </div>

        {/* Mule Typology Pill */}
        <span className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border ${getMuleBadgeColor(selectedNode.muleType)}`}>
          {selectedNode.muleType}
        </span>
      </div>

      {/* Core Vitals Grid */}
      <div className="grid grid-cols-3 gap-2 my-3">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">Current Balance</div>
          <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">
            ${selectedNode.balance.toLocaleString()} {selectedNode.currency}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> Drain Latency
          </div>
          <div className={`text-sm font-mono font-bold mt-0.5 ${
            selectedNode.drainLatencySeconds < 60 ? 'text-red-400' : 'text-slate-200'
          }`}>
            {selectedNode.drainLatencySeconds}s (Pass-Through)
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] font-mono uppercase text-slate-400">In/Out Ratio</div>
          <div className="text-sm font-mono font-bold text-amber-400 mt-0.5">
            {(selectedNode.inflowOutflowRatio * 100).toFixed(1)}% Evacuated
          </div>
        </div>
      </div>

      {/* Explainable AI (XAI) / SHAP Feature Impact Breakdown */}
      <div className="my-2 p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" /> Explainable AI (SHAP Feature Breakdown)
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Neural AML Classifier</span>
        </div>

        <div className="space-y-2">
          {selectedNode.shapFactors.map((factor, idx) => (
            <div key={idx} className="text-xs">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">{factor.feature}</span>
                <span className={`font-mono font-bold ${factor.impact > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {factor.impact > 0 ? `+${factor.impact} pts` : `${factor.impact} pts`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${factor.impact > 0 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, Math.abs(factor.impact) * 2)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Graph Centrality & Topological Vector (Graph Numbers) */}
      <div className="my-2 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <span>Topological Centrality Vector</span>
          <span className="text-[10px] text-slate-400 font-normal">{selectedNode.communityCluster || 'Cluster-A'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Degree (In / Out)</span>
            <span className="font-bold text-slate-200">
              <strong className="text-cyan-400">{selectedNode.inDegree || 0} In</strong> / <strong className="text-amber-400">{selectedNode.outDegree || 0} Out</strong>
            </span>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Betweenness (g)</span>
            <span className={`font-bold ${(selectedNode.betweennessCentrality || 0) > 0.5 ? 'text-red-400' : 'text-slate-200'}`}>
              {(selectedNode.betweennessCentrality || 0).toFixed(2)} {(selectedNode.betweennessCentrality || 0) > 0.5 ? '(Hub)' : ''}
            </span>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">PageRank Vector</span>
            <span className="font-bold text-emerald-400">
              {((selectedNode.pageRank || 0) * 100).toFixed(1)}% ({(selectedNode.pageRank || 0).toFixed(3)})
            </span>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Clustering Coeff</span>
            <span className="font-bold text-amber-400">
              {(selectedNode.clusteringCoefficient || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Device & Geolocation Forensics */}
      <div className="my-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
        <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5 uppercase">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Device &amp; Network Forensics
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">Device Fingerprint:</span>
            <div className="text-slate-300 truncate font-semibold">{selectedNode.deviceId}</div>
          </div>
          <div>
            <span className="text-slate-500">IP Geolocation:</span>
            <div className="text-slate-300 font-semibold">{selectedNode.ip} ({selectedNode.country})</div>
          </div>
        </div>
        {selectedNode.dormantDaysPriorToBurst > 30 && (
          <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-950/40 p-1.5 rounded border border-amber-500/30 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Account was dormant for {selectedNode.dormantDaysPriorToBurst} days before rapid burst</span>
          </div>
        )}
      </div>

      {/* Action Footer Toolkit */}
      <div className="mt-auto pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
        
        {/* Freeze Account Button */}
        <button
          onClick={handleToggleFreeze}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all shadow-md ${
            isFrozen
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-glow-red border border-red-400'
          }`}
        >
          {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>{isFrozen ? 'Unfreeze Account' : 'Freeze Outflows'}</span>
        </button>

        {/* Generate SAR Button */}
        <button
          onClick={() => onGenerateSARForNode(selectedNode)}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 shadow-glow-gold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Generate SAR</span>
        </button>

      </div>

    </div>
  );
};
