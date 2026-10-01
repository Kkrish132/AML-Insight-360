import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Activity, 
  Sliders, 
  ShieldAlert, 
  Layers, 
  FileText, 
  BookOpen, 
  Sparkles,
  Info,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  Cpu,
  BarChart3,
  Terminal,
  Share2
} from 'lucide-react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { ScenarioSelector } from './components/ScenarioSelector';
import { NetworkVisualizer } from './components/NetworkGraph/NetworkVisualizer';
import { AccountInspector } from './components/AccountInspector';
import { LiveTransactions } from './components/LiveTransactions';
import { MuleRingsMatrix } from './components/MuleRingsMatrix';
import { RuleSimulator } from './components/RuleSimulator';
import { GraphAnalyticsHUD } from './components/GraphAnalyticsHUD';
import { GraphBenchmarkComparison } from './components/GraphBenchmarkComparison';
import { GraphTestSuite } from './components/GraphTestSuite';
import { SARModal } from './components/SARModal';
import { KnowledgeBaseModal } from './components/KnowledgeBaseModal';
import { mockScenarios } from './data/mockScenarios';
import { Scenario, AccountNode } from './types';
import { soundFx } from './utils/audio';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(mockScenarios[0]);
  const [selectedNode, setSelectedNode] = useState<AccountNode | null>(
    mockScenarios[0].nodes.find(n => n.role === 'mule_account') || mockScenarios[0].nodes[0]
  );
  const [frozenAccountIds, setFrozenAccountIds] = useState<string[]>([]);
  const [isSARModalOpen, setIsSARModalOpen] = useState<boolean>(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMainTab, setActiveMainTab] = useState<'COMMAND' | 'TEST_SUITE' | 'BENCHMARKS' | 'TRANSACTIONS' | 'RINGS' | 'SIMULATOR'>('COMMAND');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'alert' } | null>(null);

  // Sync html class for dark/light theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  const showToast = (text: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Switch scenario
  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    // select first critical node in new scenario
    const firstCritical = scenario.nodes.find(n => n.riskScore > 90) || scenario.nodes[0];
    setSelectedNode(firstCritical);
    showToast(`Loaded topology scenario: ${scenario.title}`, 'success');
  };

  // Node Selection Handlers
  const handleSelectNode = (node: AccountNode) => {
    setSelectedNode(node);
  };

  const handleSelectNodeById = (nodeId: string) => {
    const node = currentScenario.nodes.find(n => n.id === nodeId);
    if (node) {
      soundFx.playAlert();
      setSelectedNode(node);
      setActiveMainTab('COMMAND'); // Jump back to graph if on another tab
      showToast(`Selected Account: ${node.name} (${node.accountNumber})`, 'success');
    }
  };

  // Account Freeze / Unfreeze
  const handleFreezeAccount = (nodeId: string) => {
    if (!frozenAccountIds.includes(nodeId)) {
      setFrozenAccountIds(prev => [...prev, nodeId]);
      const node = currentScenario.nodes.find(n => n.id === nodeId);
      showToast(`⛔ Account ${node?.name || nodeId} FROZEN successfully. Outflows halted.`, 'alert');
    }
  };

  const handleUnfreezeAccount = (nodeId: string) => {
    setFrozenAccountIds(prev => prev.filter(id => id !== nodeId));
    const node = currentScenario.nodes.find(n => n.id === nodeId);
    showToast(`✓ Account ${node?.name || nodeId} unfrozen. Restrictions removed.`, 'success');
  };

  const handleGenerateSARForNode = (node: AccountNode) => {
    soundFx.playScanTick();
    setSelectedNode(node);
    setIsSARModalOpen(true);
  };

  // Global Search Filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) return;
    const q = query.toLowerCase();
    const match = currentScenario.nodes.find(n => 
      n.name.toLowerCase().includes(q) ||
      n.accountNumber.toLowerCase().includes(q) ||
      n.bank.toLowerCase().includes(q) ||
      n.ip.toLowerCase().includes(q) ||
      n.deviceId.toLowerCase().includes(q)
    );
    if (match) {
      setSelectedNode(match);
      soundFx.playAlert();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Fixed Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSAR={() => setIsSARModalOpen(true)}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold shadow-2xl backdrop-blur-md ${
            toastMessage.type === 'alert'
              ? 'bg-red-950/90 border-red-500 text-red-200 shadow-glow-red'
              : 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-glow'
          }`}>
            {toastMessage.type === 'alert' ? <AlertOctagon className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-4">
        
        {/* KPI Metrics Strip */}
        <MetricsOverview
          currentScenario={currentScenario}
          frozenAccountsCount={frozenAccountIds.length}
        />

        {/* Major Project Scenario Selector */}
        <ScenarioSelector
          currentScenario={currentScenario}
          onSelectScenario={handleSelectScenario}
        />

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
          
          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('COMMAND');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'COMMAND'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Graph &amp; Node Inspector</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('TEST_SUITE');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'TEST_SUITE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Graph Automated Testing Suite</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('BENCHMARKS');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'BENCHMARKS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Past vs. Present Benchmarks</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('TRANSACTIONS');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'TRANSACTIONS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Transaction Stream</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('RINGS');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'RINGS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Mule Rings Matrix ({currentScenario.muleRings.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveMainTab('SIMULATOR');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeMainTab === 'SIMULATOR'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>AML Rule Simulator</span>
          </button>

        </div>

        {/* Tab 1: Primary Command Center (Graph + Inspector + Graph Analytics HUD) */}
        {activeMainTab === 'COMMAND' && (
          <div className="space-y-4">
            
            {/* Top: Graph Topology Numbers & Centrality Analytics HUD */}
            <GraphAnalyticsHUD
              scenario={currentScenario}
              selectedNode={selectedNode}
            />

            {/* Split Grid: Canvas Graph Left & Account Inspector Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left 7 Columns: Interactive Network Visualizer */}
              <div className="lg:col-span-7 xl:col-span-8">
                <NetworkVisualizer
                  scenario={currentScenario}
                  selectedNode={selectedNode}
                  onSelectNode={handleSelectNode}
                  frozenAccountIds={frozenAccountIds}
                />
              </div>

              {/* Right 5 Columns: Account Inspector, Graph Centrality & XAI Breakdown */}
              <div className="lg:col-span-5 xl:col-span-4">
                <AccountInspector
                  selectedNode={selectedNode}
                  onFreezeAccount={handleFreezeAccount}
                  onUnfreezeAccount={handleUnfreezeAccount}
                  onGenerateSARForNode={handleGenerateSARForNode}
                  isFrozen={selectedNode ? frozenAccountIds.includes(selectedNode.id) : false}
                />
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Graph Automated Testing Suite */}
        {activeMainTab === 'TEST_SUITE' && (
          <GraphTestSuite />
        )}

        {/* Tab 3: Model vs Past Benchmarks & Historical Evolution */}
        {activeMainTab === 'BENCHMARKS' && (
          <GraphBenchmarkComparison />
        )}

        {/* Tab 4: Streaming Transaction HUD */}
        {activeMainTab === 'TRANSACTIONS' && (
          <LiveTransactions
            scenario={currentScenario}
            onSelectNodeById={handleSelectNodeById}
          />
        )}

        {/* Tab 5: Mule Rings Matrix */}
        {activeMainTab === 'RINGS' && (
          <MuleRingsMatrix
            scenario={currentScenario}
            onOpenSAR={() => setIsSARModalOpen(true)}
            onSelectNodeById={handleSelectNodeById}
          />
        )}

        {/* Tab 6: AML Rule Simulator */}
        {activeMainTab === 'SIMULATOR' && (
          <RuleSimulator />
        )}

      </main>

      {/* Regulatory FinCEN SAR Modal */}
      <SARModal
        isOpen={isSARModalOpen}
        onClose={() => setIsSARModalOpen(false)}
        scenario={currentScenario}
        selectedNode={selectedNode}
      />

      {/* AML Typology & Knowledge Base Modal */}
      <KnowledgeBaseModal
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>AegisAML • High-Tech Anti Money Laundering &amp; Mule Account Graph Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Engineered for Major Project Presentation • Graph Neural Network &amp; Quantitative Benchmark Suite
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
