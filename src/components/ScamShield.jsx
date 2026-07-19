import React, { useState } from 'react';
import { Phone, MessageSquare, AlertTriangle, Play, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENARIOS = {
  'cbi': {
    id: 'cbi',
    label: 'Fake CBI Officer Call',
    type: 'call',
    score: '96%',
    risk: 'CRITICAL HIGH RISK',
    badgeClass: 'bg-red-500/10 border-red-500 text-red-500 shadow-red-500/10',
    indicators: [
      'Fake Authority: Caller poses as DCP Kumar, Delhi Cyber Bureau.',
      'Coercion: Threatens immediate asset seizure and "digital custody".',
      'Urgency: Demands instant routing to security escrow accounts.'
    ],
    advisory: 'CRITICAL WARNING: Hang up immediately. Police and security forces NEVER demand transfers or conduct "digital arrest" via WhatsApp or telephone.'
  },
  'electricity': {
    id: 'electricity',
    label: 'Electricity Suspension Text',
    type: 'text',
    content: 'Urgent Alert: Your power grid connection will be disconnected tonight at 9:30 PM due to unpaid bills. Contact Officer Verma at 98765-54321 immediately to settle the dues.',
    score: '88%',
    risk: 'HIGH RISK SCAM',
    badgeClass: 'bg-red-500/10 border-red-500 text-red-500 shadow-red-500/10',
    indicators: [
      'Fake Urgency: Threatens service shutoff within hours.',
      'Unofficial Route: Sent from an unverified 10-digit mobile number.',
      'Escrow Fraud: Prompts direct calling to settle bills.'
    ],
    advisory: 'WARNING: Do not dial. Only check payment records on your official power utility company app. This is a credential phishing trap.'
  },
  'lottery': {
    id: 'lottery',
    label: 'WhatsApp Cash Prize',
    type: 'text',
    content: 'Congratulations! Your mobile number has been selected to win a cash prize of ₹25,00,000 from WhatsApp & KBC. To register claim, contact Coordinator Mr. Sharma at +91-70098-XXXXX.',
    score: '99%',
    risk: 'CRITICAL HIGH RISK',
    badgeClass: 'bg-red-500/10 border-red-500 text-red-500 shadow-red-500/10',
    indicators: [
      'Advance Fee Hook: Unsolicited cash award promise.',
      'Brand Impersonation: Employs WhatsApp and KBC logos.',
      'Escrow Fee demand: Asks to pay "clearance tax" before disbursement.'
    ],
    advisory: 'WARNING: Immediate block. Never send funds, processing fees, or verification amounts to receive lottery awards. KBC does not issue WhatsApp payouts.'
  }
};

export default function ScamShield() {
  const [activeId, setActiveId] = useState('cbi');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [showResult, setShowResult] = useState(false);

  const scenario = SCENARIOS[activeId];

  const triggerScan = () => {
    setScanning(true);
    setShowResult(false);
    
    const steps = [
      'Ingesting phonetic payload...',
      'Deconstructing linguistic markers...',
      'Matching cyber-crime cluster nodes...',
      'Audit finalized. Displaying risk payload.'
    ];

    let current = 0;
    setScanStep(steps[0]);

    const timer = setInterval(() => {
      current++;
      if (current < steps.length) {
        setScanStep(steps[current]);
      } else {
        clearInterval(timer);
        setScanning(false);
        setShowResult(true);
      }
    }, 850);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
      {/* Inputs Configuration */}
      <div className="flex flex-col gap-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Analyze suspicious telephone calls, SMS alerts, or WhatsApp messages using our localized semantic and voice-threat engine.
        </p>

        {/* Tab Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
            Select Threat Scenario
          </label>
          <div className="flex flex-col gap-2">
            {Object.values(SCENARIOS).map((scen) => (
              <button
                key={scen.id}
                onClick={() => {
                  setActiveId(scen.id);
                  setShowResult(false);
                  setScanning(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-lg border text-sm font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeId === scen.id
                    ? 'border-teal bg-teal/5 text-white'
                    : 'border-white/[0.05] bg-white/[0.01] text-gray-400 hover:border-teal/30 hover:bg-white/[0.02]'
                }`}
              >
                {scen.type === 'call' ? <Phone className="w-4 h-4 text-teal" /> : <MessageSquare className="w-4 h-4 text-teal" />}
                {scen.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-black/40 border border-white/[0.05] rounded-xl p-6 min-h-[14rem] flex flex-col justify-between">
          <div className="flex-grow flex items-center justify-center">
            {scenario.type === 'call' ? (
              <div className="flex flex-col items-center gap-4 py-4 w-full">
                <div className="flex items-center gap-1.5 h-12 justify-center w-full">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      style={{ animationDelay: `${i * 0.08}s` }}
                      className={`w-1 rounded bg-teal ${
                        scanning ? 'animate-wave' : 'h-3'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-gray-500">VOICE PREVIEW // 00:14 / 00:45</span>
              </div>
            ) : (
              <textarea
                readOnly
                value={scenario.content}
                className="w-full h-24 bg-transparent border-0 resize-none outline-none text-sm leading-relaxed text-gray-300 font-sans"
              />
            )}
          </div>

          <button
            onClick={triggerScan}
            disabled={scanning}
            className="w-full mt-4 bg-teal/5 border border-teal text-teal hover:bg-teal/10 font-display font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg relative overflow-hidden group transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            {scanning && <div className="absolute top-0 left-0 w-full h-[2px] bg-teal shadow-lg shadow-teal animate-scan-v" />}
            {scanning ? 'Running Threat Scan...' : 'Scan Payload'}
          </button>
        </div>
      </div>

      {/* Output Results */}
      <div className="bg-black/40 border border-white/[0.05] rounded-xl p-8 min-h-[28rem] flex items-center justify-center relative overflow-hidden">
        
        {/* Glowing aura */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/[0.02] to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {!scanning && !showResult && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4 text-gray-500"
            >
              <ShieldAlert className="w-12 h-12 text-gray-600 animate-pulse-glow" />
              <p className="text-xs font-mono">Awaiting payload ingest... Click "Scan Payload".</p>
            </motion.div>
          )}

          {scanning && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4 text-teal"
            >
              <AlertTriangle className="w-12 h-12 text-teal animate-bounce" />
              <p className="text-xs font-mono">{scanStep}</p>
            </motion.div>
          )}

          {showResult && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col gap-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
                <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider border ${scenario.badgeClass}`}>
                  {scenario.risk}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-display font-black text-red-500">{scenario.score}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Threat Match</span>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3">Flagged Indicators:</h5>
                <ul className="flex flex-col gap-2.5">
                  {scenario.indicators.map((ind, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5">
                      <span className="text-red-500">⚠️</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.01] border border-dashed border-white/[0.08] rounded-lg p-4 mt-2">
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  {scenario.advisory}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
