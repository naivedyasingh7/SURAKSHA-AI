import React, { useState } from 'react';
import { Phone, MessageSquare, AlertTriangle, ShieldAlert, Upload, Mic, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_SCENARIOS = {
  'cbi': {
    id: 'cbi',
    label: 'Fake CBI Officer Call',
    type: 'call',
    content: 'You are under CBI investigation. Disconnect call and transfer money to safety escrow account immediately or face digital custody and arrest warrant.',
  },
  'electricity': {
    id: 'electricity',
    label: 'Electricity Suspension Text',
    type: 'text',
    content: 'Urgent Alert: Your power grid connection will be disconnected tonight at 9:30 PM due to unpaid bills. Contact Officer Verma at 98765-54321 immediately to settle dues.',
  },
  'lottery': {
    id: 'lottery',
    label: 'WhatsApp Cash Prize',
    type: 'text',
    content: 'Congratulations! Your mobile number has been selected to win a cash prize of ₹25,00,000 from WhatsApp & KBC. Contact Mr. Sharma and pay clearance tax to claim now.',
  }
};

// Built-in fallback detection logic in case server is unreachable
function clientFallbackScore(text) {
  if (!text) return { risk_score: 0, label: "Low Risk / Safe", reasons: [], advice: "No content provided." };
  const lower = text.lower ? text.lower() : String(text).toLowerCase();
  
  let score = 0;
  const reasons = [];
  
  const authWords = ["cbi", "police", "ed", "customs", "investigation", "digital custody", "court", "warrant", "dcp", "bureau", "officer"];
  const threatWords = ["arrest", "case", "illegal", "warrant", "seizure", "jail", "freeze", "custody", "penalty", "block", "disconnected"];
  const urgencyWords = ["urgent", "immediately", "now", "tonight", "hours", "instant", "quick", "9:30 pm", "asap"];
  const financialWords = ["money", "transfer", "pay", "bank", "account", "upi", "cash", "lakh", "dues", "escrow", "tax"];

  if (authWords.some(w => lower.includes(w))) { score += 30; reasons.push("Authority impersonation"); }
  if (threatWords.some(w => lower.includes(w))) { score += 30; reasons.push("Threat language"); }
  if (urgencyWords.some(w => lower.includes(w))) { score += 20; reasons.push("Urgency pattern"); }
  if (financialWords.some(w => lower.includes(w))) { score += 20; reasons.push("Financial solicitation / Escrow demand"); }

  score = Math.min(100, score);

  let label = "Low Risk / Safe";
  let advice = "No active scam indicators detected.";

  if (score >= 75) {
    label = "High Risk Scam";
    advice = "Do NOT send money";
  } else if (score >= 40) {
    label = "Moderate Risk Scam";
    advice = "Exercise caution. Do NOT transfer funds or disclose OTPs.";
  }

  return { risk_score: score, label, reasons, advice };
}

const MOCK_DATASET_ITEMS = [
  { id: 'SCAM-001', category: 'CBI / Law Enforcement', text: 'This is Inspector Kumar from CBI Delhi Cyber Cell. You are under digital custody for illegal money laundering. Transfer your bank balance to court verification account immediately to avoid arrest warrant.' },
  { id: 'SCAM-002', category: 'Electricity Disconnection', text: 'Urgent Notice: Your electricity power grid connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact Electricity Officer Verma at 98765-54321 immediately to clear dues.' },
  { id: 'SCAM-003', category: 'WhatsApp / KBC Lottery', text: 'Congratulations! Your mobile number has been selected to win a cash prize of Rs 25,00,000 from WhatsApp & KBC Lucky Draw. Contact Manager Sharma and pay clearance tax fee to release funds now.' },
  { id: 'SCAM-004', category: 'Bank KYC Phishing', text: 'Dear SBI customer, your bank account 9821XXXX has been suspended due to pending KYC verification. Click link http://sbi-kyc-update.com or call bank officer immediately to unblock your account.' },
  { id: 'SCAM-005', category: 'Telegram Task Scam', text: 'Part-Time Job Opportunity: Earn Rs 5000 daily by liking YouTube videos and rating Google maps. Deposit Rs 1000 security fee to Telegram bot job_bot to start earning today.' },
  { id: 'SCAM-006', category: 'Customs / Narcotics Parcel', text: 'Customs Department Alert: Your international parcel containing illegal narcotics and passport has been intercepted at Mumbai airport. CBI investigation initiated. Pay penalty fine immediately.' },
  { id: 'SCAM-007', category: 'TRAI SIM Deactivation', text: 'Your SIM card will be terminated within 2 hours by Telecom Regulatory Authority of India (TRAI) due to illegal spamming. Disconnect call and verify identity now.' },
  { id: 'SCAM-008', category: 'Income Tax Refund Scam', text: 'Income Tax Department Notice: Tax refund of Rs 14,250 approved for your PAN card. Submit bank account details and UPI PIN immediately at http://incometax-refund-portal.in to claim.' },
  { id: 'SAFE-001', category: 'Personal Chat (Safe)', text: "Hey Rahul, let's meet tomorrow at 4 PM near Connaught Place for coffee and discuss the project presentation." },
  { id: 'SAFE-002', category: 'Bank OTP (Safe)', text: 'Your OTP for logging into HDFC NetBanking is 482910. Valid for 10 minutes. Do not share this OTP with anyone, including bank officials.' },
  { id: 'SAFE-003', category: 'Delivery Update (Safe)', text: 'Your Amazon order #402-9812-1102 has been dispatched and will arrive by 7 PM today via BlueDart courier.' },
  { id: 'SAFE-004', category: 'Family Chat (Safe)', text: 'Hi Mom, reaching home in 20 minutes. Please keep dinner warm. Love you!' }
];

export default function ScamShield() {
  const [inputText, setInputText] = useState(PRESET_SCENARIOS['cbi'].content);
  const [activeTab, setActiveTab] = useState('cbi');
  const [audioFile, setAudioFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [benchmarkResult, setBenchmarkResult] = useState(null);

  const handleSelectScenario = (key) => {
    setActiveTab(key);
    setInputText(PRESET_SCENARIOS[key].content);
    setAudioFile(null);
    setResult(null);
    setErrorMessage('');
    setBenchmarkResult(null);
  };

  const handleSelectMockSample = (item) => {
    setActiveTab('dataset');
    setInputText(item.text);
    setAudioFile(null);
    setResult(null);
    setErrorMessage('');
    setBenchmarkResult(null);
  };

  const handleTestCase = (type) => {
    setActiveTab('custom');
    setAudioFile(null);
    setResult(null);
    setErrorMessage('');
    setBenchmarkResult(null);

    if (type === 'scam') {
      setInputText("CBI will arrest you if you don't pay now");
    } else {
      setInputText("Hey let's meet tomorrow");
    }
  };

  const runFullBenchmarkSuite = async () => {
    setScanning(true);
    setResult(null);
    setBenchmarkResult(null);
    setScanStep('Running automated dataset benchmark evaluation...');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const data = await response.json();
        setBenchmarkResult(data);
      } else {
        setErrorMessage("Benchmark evaluation failed");
      }
    } catch (err) {
      setErrorMessage("Backend API offline for benchmark");
    } finally {
      setScanning(false);
    }
  };


  const triggerAnalysis = async () => {
    if (!inputText.trim() && !audioFile) {
      setErrorMessage("Please enter text or upload audio payload to analyze");
      return;
    }

    setScanning(true);
    setResult(null);
    setErrorMessage('');
    
    const steps = [
      'Connecting to Python AI Engine...',
      'Deconstructing linguistic & threat markers...',
      'Calculating authority, urgency & extortion risk...',
      'Finalizing threat payload response...'
    ];

    let stepIdx = 0;
    setScanStep(steps[0]);

    const stepTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setScanStep(steps[stepIdx]);
      } else {
        clearInterval(stepTimer);
      }
    }, 250);

    try {
      let apiResult = null;
      
      // Try backend Python API first
      try {
        let response;
        if (audioFile) {
          const formData = new FormData();
          formData.append('file', audioFile);
          if (inputText) formData.append('text', inputText);
          
          response = await fetch('http://127.0.0.1:5000/api/detect-scam', {
            method: 'POST',
            body: formData,
          });
        } else {
          response = await fetch('http://127.0.0.1:5000/api/detect-scam', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText }),
          });
        }

        if (response.ok) {
          apiResult = await response.json();
        }
      } catch (err) {
        console.warn("Backend API unavailable, executing client intelligence fallback:", err);
      }

      // Fallback if backend API offline
      if (!apiResult) {
        apiResult = clientFallbackScore(inputText);
      }

      setTimeout(() => {
        setScanning(false);
        setResult(apiResult);
      }, 900);

    } catch (e) {
      setScanning(false);
      setErrorMessage("Unable to analyze, try again");
    }
  };

  const isHighRisk = result && result.risk_score >= 70;
  const isSafe = result && result.risk_score < 30;

  return (
    <div className="flex flex-col gap-8 mt-4">
      {/* Pitch & Story Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-teal/10 via-teal/5 to-transparent border border-teal/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-teal flex-shrink-0 animate-pulse" />
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-teal font-bold">Real-time Scam Detection AI</h4>
            <p className="text-sm font-sans text-gray-200 mt-0.5">
              “We analyze language patterns in real time to detect psychological manipulation before money is lost.”
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Input Configuration Column */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Demo Test Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Judges Demo Sequence (Instant Test Cases)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTestCase('scam')}
                className="py-2.5 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Case 1: CBI Scam Call
              </button>

              <button
                onClick={() => handleTestCase('normal')}
                className="py-2.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Case 2: Normal Message
              </button>
            </div>
          </div>

          {/* Mock Dataset Explorer & Benchmark Section */}
          <div className="flex flex-col gap-2.5 bg-black/40 border border-white/[0.08] p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-widest text-teal font-mono">
                📁 Mock Dataset Explorer
              </label>
              <button
                onClick={runFullBenchmarkSuite}
                className="text-[10px] font-mono text-teal bg-teal/10 hover:bg-teal/20 border border-teal/30 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                Run Batch Benchmark (15 Samples)
              </button>
            </div>

            <select
              onChange={(e) => {
                const selected = MOCK_DATASET_ITEMS.find(item => item.id === e.target.value);
                if (selected) handleSelectMockSample(selected);
              }}
              className="w-full bg-black/60 border border-white/[0.1] rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-teal font-sans cursor-pointer"
            >
              <option value="">-- Load Sample from Mock Dataset --</option>
              {MOCK_DATASET_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.id}] {item.category}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Threat Scenarios */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
              Select Preset Scenario
            </label>
            <div className="flex flex-col gap-2">
              {Object.keys(PRESET_SCENARIOS).map((key) => {
                const scen = PRESET_SCENARIOS[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className={`w-full text-left py-2.5 px-3.5 rounded-lg border text-xs font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                      activeTab === key
                        ? 'border-teal bg-teal/10 text-white shadow-md shadow-teal/5'
                        : 'border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-teal/30 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {scen.type === 'call' ? <Phone className="w-3.5 h-3.5 text-teal" /> : <MessageSquare className="w-3.5 h-3.5 text-teal" />}
                      <span>{scen.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{scen.type}</span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Custom Text / Payload Area */}
          <div className="bg-black/40 border border-white/[0.08] rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-teal font-mono">
                Payload Ingest (Text or Audio)
              </label>
              {audioFile && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Audio: {audioFile.name}
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setActiveTab('custom');
                setResult(null);
                setErrorMessage('');
              }}
              placeholder="Paste suspicious SMS, transcript, or call audio text here..."
              className="w-full bg-transparent border-0 resize-none outline-none text-xs leading-relaxed text-gray-200 font-sans placeholder-gray-600 focus:ring-0"
            />

            {/* File Upload / Audio Button */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
              <label className="flex items-center gap-2 text-[11px] font-mono text-gray-400 hover:text-teal cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAudioFile(e.target.files[0]);
                      setActiveTab('custom');
                    }
                  }}
                  className="hidden"
                />
              </label>

              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-[10px] font-mono text-gray-500 hover:text-gray-300"
                >
                  Clear Text
                </button>
              )}
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 font-mono mt-1">{errorMessage}</p>
            )}

            <button
              onClick={triggerAnalysis}
              disabled={scanning}
              className="w-full mt-2 bg-teal border border-teal text-black font-display font-bold uppercase tracking-wider text-xs py-3 rounded-lg relative overflow-hidden group transition-all duration-300 cursor-pointer hover:bg-teal-light disabled:opacity-50"
            >
              {scanning && <div className="absolute top-0 left-0 w-full h-[2px] bg-white shadow-lg animate-scan-v" />}
              {scanning ? 'Running AI Threat Analysis...' : 'Analyze Payload'}
            </button>
          </div>

        </div>

        {/* Right Output Results Column */}
        <div className="bg-black/50 border border-white/[0.08] rounded-xl p-7 min-h-[26rem] flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Subtle glowing aura */}
          <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            isHighRisk ? 'bg-gradient-to-t from-red-500/10 via-transparent to-transparent' : 
            isSafe ? 'bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent' : 'bg-transparent'
          }`} />

          <AnimatePresence mode="wait">
            {benchmarkResult && !scanning && (
              <motion.div
                key="benchmark"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-4 text-left"
              >
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-teal">
                    📊 Dataset Benchmark Results
                  </span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {benchmarkResult.accuracy}% Accuracy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded text-emerald-300">
                    <span className="block text-[9px] uppercase text-emerald-400">True Positives</span>
                    <span className="text-base font-bold">{benchmarkResult.true_positives}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded text-emerald-300">
                    <span className="block text-[9px] uppercase text-emerald-400">True Negatives</span>
                    <span className="text-base font-bold">{benchmarkResult.true_negatives}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded text-gray-300">
                    <span className="block text-[9px] uppercase text-gray-400">Precision</span>
                    <span className="text-base font-bold">{benchmarkResult.precision}%</span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded text-gray-300">
                    <span className="block text-[9px] uppercase text-gray-400">Recall</span>
                    <span className="text-base font-bold">{benchmarkResult.recall}%</span>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-1.5 mt-2">
                  <span className="text-[9px] font-mono uppercase text-gray-400">Batch Samples Breakdown:</span>
                  {benchmarkResult.details && benchmarkResult.details.map((d, i) => (
                    <div key={i} className="flex justify-between text-[11px] font-mono bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                      <span className="truncate max-w-[200px] text-gray-300">[{d.id}] {d.category}</span>
                      <span className={d.status === 'PASS' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {d.score}% ({d.status})
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!scanning && !result && !benchmarkResult && (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center gap-4 text-gray-500 py-12"
              >
                <ShieldAlert className="w-14 h-14 text-gray-600 animate-pulse" />
                <p className="text-xs font-mono max-w-xs">
                  Awaiting payload analysis... Select a scenario or test case, then click <span className="text-teal">"Analyze Payload"</span>.
                </p>
              </motion.div>
            )}


            {scanning && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center gap-4 text-teal py-12"
              >
                <RefreshCw className="w-12 h-12 text-teal animate-spin" />
                <p className="text-xs font-mono tracking-wide">{scanStep}</p>
              </motion.div>
            )}

            {result && !scanning && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-6 text-left"
              >
                {/* Header Score Badge */}
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                      isHighRisk
                        ? 'bg-red-500/10 border-red-500 text-red-500 shadow-lg shadow-red-500/20 animate-pulse'
                        : isSafe
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-amber-500/10 border-amber-500 text-amber-400'
                    }`}>
                      {isHighRisk ? `🔴 ${result.label}` : isSafe ? `🟢 ${result.label}` : `⚠️ ${result.label}`}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-4xl font-display font-black ${isHighRisk ? 'text-red-500' : isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {result.risk_score}%
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">
                      Risk Score
                    </span>
                  </div>
                </div>

                {/* Flagged Reasons */}
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 font-mono">
                    Flagged Risk Indicators:
                  </h5>
                  {result.reasons && result.reasons.length > 0 ? (
                    <ul className="flex flex-col gap-2.5">
                      {result.reasons.map((reason, i) => (
                        <li key={i} className="text-xs text-gray-200 flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg">
                          <span className="text-red-400 font-bold">•</span>
                          <span className="font-semibold">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>No manipulative or high-risk language detected in payload.</span>
                    </div>
                  )}
                </div>

                {/* Actionable Advice */}
                <div className={`border rounded-xl p-4.5 mt-1 ${
                  isHighRisk 
                    ? 'bg-red-500/10 border-red-500/30 text-red-200' 
                    : 'bg-white/[0.02] border-white/[0.08] text-gray-300'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-gray-400 block mb-1">
                    Protective Advisory:
                  </span>
                  <p className="text-xs leading-relaxed font-mono font-medium">
                    {isHighRisk ? `❌ ${result.advice}` : result.advice}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

