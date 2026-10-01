import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Check, 
  TrendingUp, 
  AlertCircle, 
  Zap, 
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { defaultTypologyRules } from '../data/mockScenarios';
import { TypologyRule } from '../types';
import { soundFx } from '../utils/audio';

export const RuleSimulator: React.FC = () => {
  const [rules, setRules] = useState<TypologyRule[]>(defaultTypologyRules);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSliderChange = (id: string, newVal: number) => {
    soundFx.playScanTick();
    setRules(prev => prev.map(r => r.id === id ? { ...r, currentValue: newVal } : r));
  };

  const handleReset = () => {
    soundFx.playScanTick();
    setRules(defaultTypologyRules);
  };

  const handleApply = () => {
    soundFx.playSuccess();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Calculate dynamic simulated metrics based on slider adjustments
  const drainLatency = rules.find(r => r.id === 'rule-drain-latency')?.currentValue || 60;
  const structuringBound = rules.find(r => r.id === 'rule-structuring')?.currentValue || 9000;
  const deviceCount = rules.find(r => r.id === 'rule-device-cluster')?.currentValue || 3;

  const simulatedPrecision = Math.min(99.9, +(96.2 + (drainLatency < 50 ? 2.4 : -1.2) + (deviceCount <= 3 ? 1.2 : -0.8)).toFixed(1));
  const simulatedRecall = Math.min(99.5, +(94.8 + (structuringBound <= 9000 ? 3.1 : -2.0)).toFixed(1));
  const simulatedFPR = Math.max(0.2, +(1.4 - (drainLatency < 60 ? 0.6 : 0)).toFixed(2));

  return (
    <div className="glass-panel rounded-2xl p-4 lg:p-5 border border-emerald-500/20 mb-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                AML Rule &amp; Threshold Simulator
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Major Project Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Fine-tune automated rule parameters and observe real-time model Precision / Recall performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-300 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-sm transition-all"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Rules Deployed!' : 'Apply Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sliders Left, Metrics Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Sliders (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-xs font-bold text-slate-200 font-mono">{rule.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                    {rule.category}
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-400">
                  {rule.currentValue.toLocaleString()} {rule.unit}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">{rule.description}</p>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">{rule.min} {rule.unit}</span>
                <input
                  type="range"
                  min={rule.min}
                  max={rule.max}
                  step={rule.step}
                  value={rule.currentValue}
                  onChange={(e) => handleSliderChange(rule.id, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-[10px] font-mono text-slate-500">{rule.max} {rule.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Simulation Output Metrics */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex flex-col justify-between shadow-glow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-3">
              <Cpu className="w-4 h-4" /> Live Benchmark Impact
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Model Precision:</span>
                  <span className="text-emerald-400 font-bold text-sm">{simulatedPrecision}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${simulatedPrecision}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Detection Recall:</span>
                  <span className="text-cyan-400 font-bold text-sm">{simulatedRecall}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${simulatedRecall}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">False Positive Rate:</span>
                  <span className="text-amber-400 font-bold text-sm">{simulatedFPR}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${simulatedFPR * 20}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
            💡 Threshold adjustments dynamically calibrate neural graph embedding weights and alert triage urgency.
          </div>
        </div>

      </div>

    </div>
  );
};
