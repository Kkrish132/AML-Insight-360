import React from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Users, 
  Zap, 
  Network, 
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { Scenario } from '../types';

interface MetricsOverviewProps {
  currentScenario: Scenario;
  frozenAccountsCount: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  currentScenario,
  frozenAccountsCount
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const flaggedPercent = Math.round((currentScenario.summary.flaggedVolume / currentScenario.summary.totalVolume) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      
      {/* Metric 1: Total Capital Flow */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Monitored Flow</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-slate-100">
          {formatCurrency(currentScenario.summary.totalVolume)}
        </div>
        <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-mono">
          <ArrowUpRight className="w-3 h-3" /> Live Transaction Stream
        </div>
      </div>

      {/* Metric 2: Flagged Laundered Amount */}
      <div className="glass-panel p-3.5 rounded-xl border border-amber-500/30 relative overflow-hidden group hover:border-amber-500/50 transition-all shadow-glow-gold">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-500/10 rounded-full blur-lg group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-amber-300 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Flagged Suspicious</span>
          <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-amber-400">
          {formatCurrency(currentScenario.summary.flaggedVolume)}
        </div>
        <div className="text-[10px] text-amber-300/80 flex items-center gap-1 mt-1 font-mono">
          <TrendingUp className="w-3 h-3" /> {flaggedPercent}% of scenario volume
        </div>
      </div>

      {/* Metric 3: Identified Mules */}
      <div className="glass-panel p-3.5 rounded-xl border border-red-500/30 relative overflow-hidden group hover:border-red-500/50 transition-all">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-red-500/10 rounded-full blur-lg group-hover:bg-red-500/20 transition-all"></div>
        <div className="flex items-center justify-between text-red-400 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Mule Accounts</span>
          <Users className="w-4 h-4 text-red-400" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-red-400 flex items-center gap-2">
          {currentScenario.summary.suspiciousAccounts} Nodes
        </div>
        <div className="text-[10px] text-red-300/80 flex items-center gap-1 mt-1 font-mono">
          <ShieldCheck className="w-3 h-3 text-red-400" /> {frozenAccountsCount} Frozen / Intercepted
        </div>
      </div>

      {/* Metric 4: Rapid Drain Velocity */}
      <div className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-cyan-500/5 rounded-full blur-lg group-hover:bg-cyan-500/10 transition-all"></div>
        <div className="flex items-center justify-between text-cyan-400 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Pass-Through Time</span>
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-cyan-300">
          {currentScenario.summary.avgDrainTime}
        </div>
        <div className="text-[10px] text-cyan-400/80 mt-1 font-mono">
          Critical Velocity Alert (&lt;60s)
        </div>
      </div>

      {/* Metric 5: Mule Rings Identified */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Syndicate Rings</span>
          <Network className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-slate-100">
          {currentScenario.muleRings.length} Active Rings
        </div>
        <div className="text-[10px] text-emerald-400 mt-1 font-mono">
          Graph Cycle Detection: Active
        </div>
      </div>

      {/* Metric 6: AI Model Precision */}
      <div className="glass-panel p-3.5 rounded-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-500/5 rounded-full blur-lg group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider">Model Accuracy</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-lg lg:text-xl font-bold font-mono text-emerald-400">
          99.4% F1
        </div>
        <div className="text-[10px] text-slate-400 mt-1 font-mono">
          SHAP XAI Engine Online
        </div>
      </div>

    </div>
  );
};
