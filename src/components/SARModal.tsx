import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  Code, 
  Printer,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AccountNode, Scenario, MuleRing } from '../types';
import { soundFx } from '../utils/audio';

interface SARModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  selectedNode: AccountNode | null;
}

export const SARModal: React.FC<SARModalProps> = ({
  isOpen,
  onClose,
  scenario,
  selectedNode
}) => {
  const [activeTab, setActiveTab] = useState<'DOSSIER' | 'XML'>('DOSSIER');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetNode = selectedNode || scenario.nodes.find(n => n.riskScore > 90) || scenario.nodes[0];
  const targetRing = scenario.muleRings[0];
  const reportId = `SAR-FINCEN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  const handleCopyXML = () => {
    soundFx.playScanTick();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitSAR = () => {
    soundFx.playSuccess();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#06b6d4']
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<FinCEN_SAR_Report version="2.0">
  <Header>
    <ReportID>${reportId}</ReportID>
    <FilingDate>${dateStr}</FilingDate>
    <FilingInstitution>AEGIS FINTECH COMPLIANCE INTELLIGENCE</FilingInstitution>
    <Jurisdiction>US / FinCEN &amp; International FIU</Jurisdiction>
  </Header>
  <SubjectInformation>
    <AccountID>${targetNode.accountNumber}</AccountID>
    <LegalName>${targetNode.name}</LegalName>
    <MuleRole>${targetNode.muleType}</MuleRole>
    <BankEntity>${targetNode.bank}</BankEntity>
    <Country>${targetNode.country}</Country>
    <DeviceFingerprint>${targetNode.deviceId}</DeviceFingerprint>
    <IP_Address>${targetNode.ip}</IP_Address>
    <DrainLatencySeconds>${targetNode.drainLatencySeconds}</DrainLatencySeconds>
  </SubjectInformation>
  <SuspiciousActivityDetails>
    <Typology>${scenario.title} - ${targetRing ? targetRing.typology : 'Money Mule Layering'}</Typology>
    <TotalAmountLaundered currency="USD">${scenario.summary.flaggedVolume}</TotalAmountLaundered>
    <RiskScore>${targetNode.riskScore}</RiskScore>
    <NarrativeSummary>
      Automated AI Detection identified anomalous layering and smurfing behavior. Funds were evacuated within ${targetNode.drainLatencySeconds} seconds of arrival. Node exhibits shared device telemetry with other flagged mule entities.
    </NarrativeSummary>
  </SuspiciousActivityDetails>
</FinCEN_SAR_Report>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-gold rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-amber-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/30 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-glow-gold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                  FinCEN / FIU Suspicious Activity Report (SAR)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {reportId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Automated Regulatory Compliance Filing &amp; Intelligence Dossier
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('DOSSIER');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'DOSSIER'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compliance Dossier Form</span>
          </button>

          <button
            onClick={() => {
              soundFx.playScanTick();
              setActiveTab('XML');
            }}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'XML'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>FinCEN XML Spec</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {activeTab === 'DOSSIER' ? (
            <div className="space-y-4 font-mono text-xs">
              
              {/* Box 1: Filing Institution & Target Vitals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Filing Institution</div>
                  <div className="text-slate-200 font-semibold mt-0.5">Aegis AML Automated Compliance Core</div>
                  <div className="text-[11px] text-slate-400">BSA / AML Unit, FIU Ref: #AGY-8842</div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Primary Target Subject</div>
                  <div className="text-amber-400 font-bold mt-0.5">{targetNode.name}</div>
                  <div className="text-[11px] text-slate-300">
                    A/C: {targetNode.accountNumber} ({targetNode.bank} - {targetNode.country})
                  </div>
                </div>
              </div>

              {/* Box 2: Typology & Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Suspicious Total</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    ${scenario.summary.flaggedVolume.toLocaleString()} USD
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Mule Typology</div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">
                    {targetNode.muleType}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Pass-Through Time</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {targetNode.drainLatencySeconds}s Latency
                  </div>
                </div>
              </div>

              {/* Box 3: AI Generated Narrative */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Generated Compliance Narrative (Part V)
                </div>
                <div className="text-slate-300 space-y-2 leading-relaxed text-[11px] font-sans">
                  <p>
                    Between the monitored review period, subject account <strong>{targetNode.accountNumber}</strong> ({targetNode.name}) was identified as an active participant in an organized laundering network (Scenario: <em>{scenario.title}</em>).
                  </p>
                  <p>
                    <strong>Modus Operandi:</strong> Inflow structured wires totaling <strong>${scenario.summary.flaggedVolume.toLocaleString()} USD</strong> were received from source entities and evacuated within an average duration of <strong>{targetNode.drainLatencySeconds} seconds</strong> to downstream collector accounts.
                  </p>
                  <p>
                    <strong>Forensic Signals:</strong> Model flagged device collision on <code>{targetNode.deviceId}</code> linked to {scenario.nodes.length} co-located accounts, exhibiting a 99.4% fund drainage pattern indicative of money mule operation.
                  </p>
                </div>
              </div>

              {/* Box 4: Recommended Actions */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">
                  Recommended Regulatory Actions
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                  <li>Place immediate precautionary hold on Account {targetNode.accountNumber}.</li>
                  <li>Transmit XML Dossier to FinCEN / National FIU for law enforcement subpoena.</li>
                  <li>Initiate cross-bank reciprocal inquiry under PATRIOT Act Section 314(b).</li>
                </ul>
              </div>

            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto selection:bg-emerald-800">
              {xmlContent}
            </pre>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] font-mono text-slate-400">
            Form 111 (FinCEN SAR) • Compliant with AMLA 2020
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'XML' ? (
              <button
                onClick={handleCopyXML}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-300 transition-all"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied XML!' : 'Copy XML'}</span>
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-300 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>
            )}

            <button
              onClick={handleSubmitSAR}
              disabled={isSubmitted}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-gold transition-all"
            >
              {isSubmitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{isSubmitted ? 'Submitted to FinCEN!' : 'Submit SAR to FIU'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
