import React, { useState } from 'react';
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
  Sparkles,
  Building,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Layers,
  History
} from 'lucide-react';
import { AccountNode, Scenario } from '../types';
import { soundFx } from '../utils/audio';

interface AccountInspectorProps {
  selectedNode: AccountNode | null;
  scenario?: Scenario;
  onFreezeAccount: (nodeId: string) => void;
  onUnfreezeAccount: (nodeId: string) => void;
  onGenerateSARForNode: (node: AccountNode) => void;
  isFrozen: boolean;
}

export const AccountInspector: React.FC<AccountInspectorProps> = ({
  selectedNode,
  scenario,
  onFreezeAccount,
  onUnfreezeAccount,
  onGenerateSARForNode,
  isFrozen
}) => {
  const [activeTab, setActiveTab] = useState<'PARAMETERS' | 'TRANSACTIONS' | 'SHAP_XAI'>('PARAMETERS');

  if (!selectedNode) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center h-[540px] shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
          <ShieldAlert className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 font-mono">No Account Selected</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Click any account node on the graph canvas or table to inspect surveillance vitals, SHAP features, and graph centrality numbers.
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
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Deceived (Job/Romance Scam)':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Stolen Identity':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'Master Organizer':
        return 'bg-rose-100 text-rose-950 border-rose-300 font-bold';
      case 'Shell Entity':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  // Find linked transactions from current scenario
  const linkedTransfers = scenario 
    ? scenario.links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
    : [];

  const totalInflow = linkedTransfers
    .filter(l => l.target === selectedNode.id)
    .reduce((acc, l) => acc + l.amount, 0);

  const totalOutflow = linkedTransfers
    .filter(l => l.source === selectedNode.id)
    .reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-5 border border-slate-200 shadow-xs flex flex-col h-[540px] overflow-y-auto relative">
      
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base border shadow-xs ${
            isFrozen
              ? 'bg-red-50 border-red-400 text-red-700'
              : selectedNode.riskScore > 90
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            {isFrozen ? '⛔' : `${selectedNode.riskScore}%`}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 font-mono leading-tight">
                {selectedNode.name}
              </h3>
              {isFrozen && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-800 font-bold">
                  HELD / FROZEN
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-slate-700">{selectedNode.accountNumber}</span>
              <span>•</span>
              <span>{selectedNode.bank}</span>
              <span>•</span>
              <span>{selectedNode.country}</span>
            </div>
          </div>
        </div>

        {/* Mule Typology Pill */}
        <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border ${getMuleBadgeColor(selectedNode.muleType)}`}>
          {selectedNode.muleType}
        </span>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 pt-2 pb-1 border-b border-slate-100 text-xs font-mono">
        <button
          onClick={() => {
            soundFx.playScanTick();
            setActiveTab('PARAMETERS');
          }}
          className={`pb-1.5 px-2 font-bold transition-all border-b-2 ${
            activeTab === 'PARAMETERS' 
              ? 'border-emerald-600 text-emerald-900' 
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          Parameters &amp; Vitals
        </button>

        <button
          onClick={() => {
            soundFx.playScanTick();
            setActiveTab('TRANSACTIONS');
          }}
          className={`pb-1.5 px-2 font-bold transition-all border-b-2 flex items-center gap-1 ${
            activeTab === 'TRANSACTIONS' 
              ? 'border-blue-600 text-blue-900' 
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span>Ledger History</span>
          <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-600">{linkedTransfers.length}</span>
        </button>

        <button
          onClick={() => {
            soundFx.playScanTick();
            setActiveTab('SHAP_XAI');
          }}
          className={`pb-1.5 px-2 font-bold transition-all border-b-2 ${
            activeTab === 'SHAP_XAI' 
              ? 'border-purple-600 text-purple-900' 
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          XAI Factors (SHAP)
        </button>
      </div>

      {/* TAB 1: Complete Parameters & Vitals */}
      {activeTab === 'PARAMETERS' && (
        <div className="space-y-3 my-2 font-mono text-xs">
          
          {/* Financial Summary Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500 font-semibold">Current Balance</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                ${selectedNode.balance.toLocaleString()} {selectedNode.currency}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> Total Inflow
              </div>
              <div className="text-sm font-bold text-emerald-800 mt-0.5">
                ${(totalInflow || selectedNode.balance * 1.5).toLocaleString()}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-red-600" /> Total Outflow
              </div>
              <div className="text-sm font-bold text-red-800 mt-0.5">
                ${(totalOutflow || selectedNode.balance * 1.4).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Velocity & Evacuation Parameters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> Pass-Through Drain Time
              </div>
              <div className={`text-sm font-bold mt-0.5 ${
                selectedNode.drainLatencySeconds < 60 ? 'text-red-700' : 'text-slate-800'
              }`}>
                {selectedNode.drainLatencySeconds}s (Rapid Drain)
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Evacuation Ratio</div>
              <div className="text-sm font-bold text-amber-800 mt-0.5">
                {(selectedNode.inflowOutflowRatio * 100).toFixed(1)}% Evacuated
              </div>
            </div>
          </div>

          {/* Graph Centrality & Topological Vector (Graph Numbers) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-blue-200">
            <div className="flex items-center justify-between mb-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <span>Topological Centrality Vector</span>
              <span className="text-[10px] text-slate-500 font-normal">{selectedNode.communityCluster || 'Cluster-A'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">Degree (In / Out)</span>
                <span className="font-bold text-slate-900">
                  <strong className="text-blue-700">{selectedNode.inDegree || 0} In</strong> / <strong className="text-amber-700">{selectedNode.outDegree || 0} Out</strong>
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">Betweenness (g)</span>
                <span className={`font-bold ${(selectedNode.betweennessCentrality || 0) > 0.5 ? 'text-red-700' : 'text-slate-900'}`}>
                  {(selectedNode.betweennessCentrality || 0).toFixed(2)} {(selectedNode.betweennessCentrality || 0) > 0.5 ? '(Hub)' : ''}
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">PageRank Vector</span>
                <span className="font-bold text-emerald-800">
                  {((selectedNode.pageRank || 0) * 100).toFixed(1)}% ({(selectedNode.pageRank || 0).toFixed(3)})
                </span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">Clustering Coeff</span>
                <span className="font-bold text-amber-800">
                  {(selectedNode.clusteringCoefficient || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Device & Network Forensics */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="text-[11px] font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase">
              <Smartphone className="w-3.5 h-3.5 text-blue-700" /> Digital Hardware &amp; IP Geolocation
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Device Fingerprint:</span>
                <div className="text-slate-800 truncate font-semibold">{selectedNode.deviceId}</div>
              </div>
              <div>
                <span className="text-slate-500">IP Geolocation:</span>
                <div className="text-slate-800 font-semibold">{selectedNode.ip} ({selectedNode.country})</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Ledger History (All Linked Inbound & Outbound Transfers) */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="space-y-2 my-2 overflow-y-auto max-h-[340px] pr-1 font-mono text-xs">
          {linkedTransfers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No direct transactions linked in active dataset.
            </div>
          ) : (
            linkedTransfers.map((tx, idx) => {
              const isInbound = tx.target === selectedNode.id;
              const isCrit = tx.riskLevel === 'CRITICAL';
              return (
                <div 
                  key={tx.id || idx}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                    isCrit ? 'bg-red-50/70 border-red-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${isInbound ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {isInbound ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">
                        {isInbound ? `From: ${tx.source}` : `To: ${tx.target}`}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span>{tx.timestamp}</span>
                        <span>•</span>
                        <span>{tx.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`font-bold ${isInbound ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isInbound ? '+' : '-'}${tx.amount.toLocaleString()} USD
                    </div>
                    {tx.flags.length > 0 && (
                      <span className="text-[9px] text-slate-500 font-normal">
                        {tx.flags[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}


      {/* TAB 3: Explainable AI (Full XAI Breakdown) */}
      {activeTab === 'SHAP_XAI' && (
        <div className="space-y-3 my-2 font-mono text-xs">

          {/* ── Plain-English Verdict ── */}
          <div className={`p-3.5 rounded-xl border ${
            selectedNode.riskScore > 80 ? 'bg-red-50 border-red-200' :
            selectedNode.riskScore > 60 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-start gap-2.5">
              <Sparkles className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                selectedNode.riskScore > 80 ? 'text-red-600' :
                selectedNode.riskScore > 60 ? 'text-amber-600' : 'text-emerald-600'
              }`} />
              <div>
                <p className={`text-xs font-bold mb-1 ${
                  selectedNode.riskScore > 80 ? 'text-red-800' :
                  selectedNode.riskScore > 60 ? 'text-amber-800' : 'text-emerald-800'
                }`}>
                  {selectedNode.riskScore > 80 ? '⚠ HIGH RISK — AI Explanation' :
                   selectedNode.riskScore > 60 ? '⚡ MEDIUM RISK — AI Explanation' : '✓ LOW RISK — AI Explanation'}
                </p>
                <p className={`text-[11px] leading-relaxed ${
                  selectedNode.riskScore > 80 ? 'text-red-700' :
                  selectedNode.riskScore > 60 ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {selectedNode.riskScore > 80
                    ? `Account "${selectedNode.name}" was flagged as a ${selectedNode.muleType} because it received funds from ${selectedNode.inDegree} sources and forwarded ${(selectedNode.inflowOutflowRatio * 100).toFixed(0)}% within ${selectedNode.drainLatencySeconds}s — a classic pass-through mule pattern. Its betweenness centrality of ${selectedNode.betweennessCentrality.toFixed(2)} places it as a critical network bridge.`
                    : selectedNode.riskScore > 60
                    ? `Account shows ${selectedNode.velocityScore > 50 ? 'elevated velocity (' + selectedNode.velocityScore + '/100) ' : ''}and ${selectedNode.dormantDaysPriorToBurst > 30 ? 'dormancy-burst behaviour (' + selectedNode.dormantDaysPriorToBurst + ' inactive days)' : 'moderate risk indicators'}. Pattern is consistent with a '${selectedNode.muleType}' profile but lacks full confirmation criteria.`
                    : `Account "${selectedNode.name}" exhibits low-risk behaviour. Normal transaction frequency, low drain ratio, and limited network centrality. KYC tier: ${selectedNode.kycTier}. No syndicate ring membership detected.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* ── Model Info ── */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-100 text-center">
              <div className="text-[10px] text-violet-500 uppercase font-bold">Model</div>
              <div className="text-[11px] font-bold text-violet-900 mt-0.5">GAT v2</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Confidence</div>
              <div className={`text-[11px] font-bold mt-0.5 ${
                selectedNode.riskScore > 80 ? 'text-red-700' : selectedNode.riskScore > 60 ? 'text-amber-700' : 'text-emerald-700'
              }`}>{Math.min(99, 70 + Math.floor(selectedNode.riskScore * 0.25))}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Features</div>
              <div className="text-[11px] font-bold text-slate-900 mt-0.5">{selectedNode.shapFactors.length} active</div>
            </div>
          </div>

          {/* ── SHAP Feature Impact ── */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Cpu className="w-3.5 h-3.5 text-violet-600" /> SHAP Feature Impact
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Risk +</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Risk −</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {selectedNode.shapFactors.map((factor, idx) => {
                const isPositive = factor.impact > 0;
                const barWidth = Math.min(100, Math.abs(factor.impact) * 2);
                return (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-800 font-semibold">{factor.feature}</span>
                      <span className={`font-bold tabular-nums ${isPositive ? 'text-red-700' : 'text-emerald-700'}`}>
                        {isPositive ? `+${factor.impact}` : `${factor.impact}`} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isPositive ? 'bg-gradient-to-r from-amber-400 to-red-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{factor.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Key Risk Drivers (plain English bullets) ── */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Top Risk Drivers (Plain Language)</p>
            <ul className="space-y-1.5">
              {selectedNode.drainLatencySeconds < 120 && (
                <li className="flex items-start gap-1.5 text-[11px] text-red-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  Funds forwarded in {selectedNode.drainLatencySeconds}s — indicates automated or pre-planned fund routing
                </li>
              )}
              {selectedNode.betweennessCentrality > 0.15 && (
                <li className="flex items-start gap-1.5 text-[11px] text-red-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  High network centrality ({selectedNode.betweennessCentrality.toFixed(2)}) — this account bridges otherwise disconnected groups
                </li>
              )}
              {selectedNode.dormantDaysPriorToBurst > 30 && (
                <li className="flex items-start gap-1.5 text-[11px] text-amber-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {selectedNode.dormantDaysPriorToBurst}-day dormancy before sudden activation — classic sleeper mule pattern
                </li>
              )}
              {selectedNode.inflowOutflowRatio > 0.85 && (
                <li className="flex items-start gap-1.5 text-[11px] text-red-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {(selectedNode.inflowOutflowRatio * 100).toFixed(0)}% of received funds immediately evacuated — pure pass-through behaviour
                </li>
              )}
              {selectedNode.velocityScore > 60 && (
                <li className="flex items-start gap-1.5 text-[11px] text-amber-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  Velocity score {selectedNode.velocityScore}/100 — abnormal transaction frequency above AML threshold
                </li>
              )}
              {selectedNode.kycTier === 'TIER_1_BASIC' && selectedNode.riskScore > 60 && (
                <li className="flex items-start gap-1.5 text-[11px] text-amber-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  Only TIER_1 KYC verification — insufficient identity checks given activity volume
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Action Footer Toolkit */}
      <div className="mt-auto pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
        
        {/* Freeze Account Button */}
        <button
          onClick={handleToggleFreeze}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all shadow-xs ${
            isFrozen
              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300'
              : 'bg-red-700 hover:bg-red-800 text-white border border-red-800'
          }`}
        >
          {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          <span>{isFrozen ? 'Release Account Hold' : 'Freeze Outflows (Hold)'}</span>
        </button>

        {/* Generate SAR Button */}
        <button
          onClick={() => onGenerateSARForNode(selectedNode)}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 shadow-xs transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-amber-700" />
          <span>Generate SAR</span>
        </button>

      </div>

    </div>
  );
};
