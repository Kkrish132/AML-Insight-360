import React, { useState } from 'react';
import {
  Cpu, BarChart3, Activity, TrendingUp, Network, Zap, Info, ChevronDown, ChevronUp, Shield, Layers, GitBranch
} from 'lucide-react';
import { AccountNode } from '../types';

interface FeatureExtractionPanelProps {
  selectedNode: AccountNode | null;
}

const GRAPH_FEATURES = [
  { key: 'inDegree', label: 'In-Degree', unit: 'connections', normalRange: [0, 3], desc: 'Number of incoming transactions. High values indicate a collection hub — a classic mule trait.', getValue: (n: AccountNode) => n.inDegree },
  { key: 'outDegree', label: 'Out-Degree', unit: 'connections', normalRange: [0, 3], desc: 'Number of outgoing transactions. Extremely high out-degree signals structured fund dispersal.', getValue: (n: AccountNode) => n.outDegree },
  { key: 'betweenness', label: 'Betweenness Centrality', unit: 'score', normalRange: [0, 0.15], desc: 'How often this account lies on the shortest path between others. High = bridge/pass-through node.', getValue: (n: AccountNode) => n.betweennessCentrality },
  { key: 'pagerank', label: 'PageRank', unit: 'score', normalRange: [0, 0.05], desc: 'Recursive importance — links from important accounts boost this score. High = key network node.', getValue: (n: AccountNode) => n.pageRank },
  { key: 'clustering', label: 'Clustering Coefficient', unit: '0-1', normalRange: [0.4, 1.0], desc: 'How densely interconnected are the account neighbours? Low clustering = isolated bridge node.', getValue: (n: AccountNode) => n.clusteringCoefficient },
  { key: 'velocity', label: 'Velocity Score', unit: '0–100', normalRange: [0, 30], desc: 'Frequency and speed of transactions in rolling 24h window. Extreme velocity = smurfing signal.', getValue: (n: AccountNode) => n.velocityScore },
  { key: 'drainLatency', label: 'Drain Latency', unit: 'seconds', normalRange: [3600, 86400], desc: 'Time between receiving funds and forwarding them. Sub-60s latency is a critical red flag.', getValue: (n: AccountNode) => n.drainLatencySeconds },
  { key: 'inflowRatio', label: 'Inflow-Outflow Ratio', unit: '%', normalRange: [0, 40], desc: 'Percentage of received funds immediately evacuated. Near 100% = pure pass-through mule.', getValue: (n: AccountNode) => Math.round(n.inflowOutflowRatio * 100) },
  { key: 'dormancy', label: 'Dormancy-Burst Days', unit: 'days', normalRange: [0, 30], desc: 'Days of inactivity before sudden high-volume activity — a known sleeper mule pattern.', getValue: (n: AccountNode) => n.dormantDaysPriorToBurst },
  { key: 'riskScore', label: 'Composite Risk Score', unit: '0-100', normalRange: [0, 40], desc: 'GAT model combined output score aggregating all features via graph attention mechanism.', getValue: (n: AccountNode) => n.riskScore },
  { key: 'eigenvector', label: 'Eigenvector Centrality', unit: 'score', normalRange: [0, 0.1], desc: 'Influence score — accounts connected to other influential nodes score higher.', getValue: (n: AccountNode) => n.eigenvectorCentrality },
  { key: 'inOutDegreeRatio', label: 'In/Out Degree Ratio', unit: 'ratio', normalRange: [0.5, 2.0], desc: 'Ratio of incoming vs outgoing links. Extreme imbalance indicates one-way pass-through.', getValue: (n: AccountNode) => n.outDegree > 0 ? parseFloat((n.inDegree / n.outDegree).toFixed(2)) : 0 },
];

const MODEL_ROUTES = [
  { route: 'Mule Account Detection', model: 'Graph Attention Network (GAT v2)', algo: 'Multi-head attention over node neighbourhoods', complexity: 'O(|E| · d)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { route: 'Transaction Anomaly', model: 'Isolation Forest + LSTM AutoEncoder', algo: 'Unsupervised anomaly scoring on time-series', complexity: 'O(n log n)', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { route: 'Ring / Syndicate Detection', model: 'Louvain Community Detection', algo: 'Modularity optimisation on weighted graph', complexity: 'O(n log n)', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { route: 'Pass-Through Scoring', model: 'Random Forest (300 trees)', algo: 'Ensemble on 12 tabular graph features', complexity: 'O(d · n · log n)', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { route: 'Velocity Alerts', model: 'LSTM Time-Series Classifier', algo: 'Sequence modelling on rolling 24h windows', complexity: 'O(T · h²)', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { route: 'Rule Simulator', model: 'Expert Threshold Rules', algo: 'Configurable AML typology policy engine', complexity: 'O(n)', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

function FeatureBar({ value, min, max, normalMax, label }: { value: number; min: number; max: number; normalMax: number; label: string }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const normalPct = Math.min(100, Math.max(0, ((normalMax - min) / (max - min)) * 100));
  const isFlagged = value > normalMax;

  return (
    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
      {/* Normal range indicator */}
      <div className="absolute top-0 left-0 h-full bg-emerald-100 rounded-full" style={{ width: `${normalPct}%` }} />
      {/* Value bar */}
      <div
        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${isFlagged ? 'bg-red-500' : 'bg-emerald-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export const FeatureExtractionPanel: React.FC<FeatureExtractionPanelProps> = ({ selectedNode }) => {
  const [activeTab, setActiveTab] = useState<'FEATURES' | 'MODELS' | 'ALGORITHMS'>('FEATURES');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="w-8 h-8 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-violet-700" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-mono">ML Feature Extraction</h3>
          <p className="text-xs text-slate-500">12 graph features · Models per route · Algorithms</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        {(['FEATURES', 'MODELS', 'ALGORITHMS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold font-mono transition-colors ${
              activeTab === tab
                ? 'text-violet-700 border-b-2 border-violet-600 bg-violet-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'FEATURES' ? '⚡ Features' : tab === 'MODELS' ? '🤖 Models' : '⚙️ Algorithms'}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">

        {/* ── FEATURES TAB ─────────────────────────────── */}
        {activeTab === 'FEATURES' && (
          <>
            {!selectedNode ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">Select an account node to view extracted features</div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-violet-50 border border-violet-100">
                  <Activity className="w-3.5 h-3.5 text-violet-700" />
                  <span className="text-xs font-mono text-violet-800 font-semibold">Account: {selectedNode.name} ({selectedNode.accountNumber})</span>
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    selectedNode.riskScore > 80 ? 'bg-red-100 text-red-800' :
                    selectedNode.riskScore > 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>Risk: {selectedNode.riskScore}</span>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-full bg-emerald-200 inline-block" /> Normal range</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-full bg-emerald-500 inline-block" /> Value (normal)</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-full bg-red-500 inline-block" /> Value (flagged)</span>
                </div>

                {GRAPH_FEATURES.map(feat => {
                  const val = feat.getValue(selectedNode);
                  const isFlagged = val > feat.normalRange[1];
                  const isExpanded = expandedFeature === feat.key;
                  return (
                    <div key={feat.key} className={`rounded-xl border p-3 transition-all ${isFlagged ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setExpandedFeature(isExpanded ? null : feat.key)}
                      >
                        <span className={`text-xs font-semibold font-mono ${isFlagged ? 'text-red-700' : 'text-slate-700'}`}>{feat.label}</span>
                        <span className={`ml-auto text-xs font-bold font-mono ${isFlagged ? 'text-red-600' : 'text-emerald-700'}`}>{val} <span className="font-normal text-[10px] text-slate-400">{feat.unit}</span></span>
                        {isFlagged && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-mono font-bold">FLAGGED</span>}
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <div className="mt-2">
                        <FeatureBar value={val} min={0} max={feat.normalRange[1] * 3} normalMax={feat.normalRange[1]} label={feat.label} />
                      </div>
                      {isExpanded && (
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed border-t border-slate-200 pt-2">{feat.desc}</p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ── MODELS TAB ─────────────────────────────── */}
        {activeTab === 'MODELS' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 font-mono">Each detection route uses a specialised model optimised for that fraud pattern:</p>
            {MODEL_ROUTES.map(mr => (
              <div key={mr.route} className={`rounded-xl border p-3.5 ${mr.color}`}>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/60 flex items-center justify-center mt-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold font-mono">{mr.route}</p>
                    <p className="text-[11px] font-semibold mt-0.5">{mr.model}</p>
                    <p className="text-[10px] opacity-70 mt-1">{mr.algo}</p>
                    <span className="inline-block mt-1.5 text-[10px] bg-white/50 px-2 py-0.5 rounded-full font-mono font-bold">{mr.complexity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ALGORITHMS TAB ─────────────────────────── */}
        {activeTab === 'ALGORITHMS' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 font-mono">Algorithm selected per dataset type based on graph density and node count:</p>
            <div className="space-y-2">
              {[
                { label: 'Small Graph (&lt;100 nodes)', algo: 'Exact Betweenness + BFS Cycle Detection', why: 'Exhaustive traversal feasible at this scale' },
                { label: 'Medium Graph (100–500 nodes)', algo: 'Approximate Betweenness + Louvain', why: 'Balanced accuracy vs. latency at &lt;200ms' },
                { label: 'Large Graph (&gt;500 nodes)', algo: 'Sampled PageRank + METIS Partitioning', why: 'Sub-linear sampling maintains detection power' },
                { label: 'CSV Upload (Custom)', algo: 'Auto-detected from header schema', why: 'PaySim → GAT pipeline; custom → Random Forest' },
                { label: 'High-Velocity Stream', algo: 'LSTM sliding window (24h)', why: 'Temporal patterns require sequential modelling' },
                { label: 'Ring Detection', algo: 'Tarjan SCC + Louvain communities', why: 'Strongly connected components reveal closed rings' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800 font-mono" dangerouslySetInnerHTML={{ __html: item.label }} />
                      <p className="text-[11px] text-violet-700 font-semibold mt-0.5">{item.algo}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5" dangerouslySetInnerHTML={{ __html: `Why: ${item.why}` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
