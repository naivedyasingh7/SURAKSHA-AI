import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

const NOTES = {
  '500': {
    id: '500',
    label: 'INR 500 Note',
    image: 'fake_currency_inr.jpg',
    status: 'AUTHENTIC',
    badgeClass: 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-emerald-500/10',
    score: '99%',
    scoreClass: 'text-emerald-500',
    indicators: [
      'Security Thread: Intact green-to-blue holographic color shift.',
      'Watermark: Sharp Gandhi portrait with distinct density depth.',
      'Bleed Lines: Intaglio raised print texture verified.'
    ],
    advisory: 'GENUINE NOTE: Optical parameters comply with reserve standards. Safe for trade.',
    markers: [
      { top: '15%', left: '48%', label: 'Security Thread', desc: 'Verified green-to-blue color-shift holographic thread.' },
      { top: '48%', left: '80%', label: 'Watermark Window', desc: 'Sharp Mahatma Gandhi profile embedded in paper pulp.' },
      { top: '75%', left: '15%', label: 'Bleed Markings', desc: 'Intaglio tactile raised print verified on borders.' }
    ]
  },
  '2000': {
    id: '2000',
    label: 'INR 2000 Note (Counterfeit)',
    image: 'fake_currency_inr.jpg',
    status: 'COUNTERFEIT DETECTED',
    badgeClass: 'bg-red-500/10 border-red-500 text-red-500 shadow-red-500/10',
    score: '98%',
    scoreClass: 'text-red-500',
    indicators: [
      'Security Thread: Flat green ink simulation, lacks holographic shift.',
      'Watermark: Gandhi profile printed on surface, lacks multi-tone depth.',
      'Bleed Lines: Smooth border lines, lacks tactile raised ink texture.'
    ],
    advisory: 'CRITICAL COUNTERFEIT: Flagged with 98% confidence match. Do not accept this note. File incident Ticket #CK-9011.',
    markers: [
      { top: '15%', left: '48%', label: 'Security Thread', desc: 'FAIL: Flat color print, no holo shifts or embedded microtext.' },
      { top: '48%', left: '80%', label: 'Watermark Window', desc: 'FAIL: Lacks multi-tone depth, printed directly onto paper surface.' },
      { top: '75%', left: '15%', label: 'Bleed Markings', desc: 'FAIL: Lacks raised intaglio print borders (flat ink).' }
    ]
  }
};

export default function CurrencyGuard() {
  const [activeNote, setActiveNote] = useState('500');
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [hoveredMarker, setHoveredMarker] = useState(null);

  const note = NOTES[activeNote];

  const triggerScan = () => {
    setScanning(true);
    setShowResult(false);
    
    const steps = [
      'Calibrating optical sensors...',
      'Auditing holographic color indices...',
      'Analyzing watermark density profile...',
      'Evaluating intaglio border height values...',
      'Pattern mismatch found. Parsing results.'
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
    }, 700);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
      {/* Canvas Optical Viewer */}
      <div className="flex flex-col gap-6">
        <p className="text-sm text-gray-400 leading-relaxed">
          Verify banknotes in real-time. Our optical network checks microprinting alignments, thread shifts, and pulp watermarks.
        </p>

        {/* Note selection tabs */}
        <div className="flex gap-3">
          {Object.values(NOTES).map(n => (
            <button
              key={n.id}
              onClick={() => {
                setActiveNote(n.id);
                setShowResult(false);
                setScanning(false);
                setHoveredMarker(null);
              }}
              className={`py-2 px-5 rounded-lg border text-xs font-semibold font-display tracking-wider transition-all duration-300 ${
                activeNote === n.id
                  ? 'border-orange bg-orange/5 text-white'
                  : 'border-white/[0.05] bg-white/[0.01] text-gray-400 hover:border-orange/30 hover:bg-white/[0.02]'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        {/* Interactive mock note container */}
        <div className={`relative overflow-hidden rounded-xl border border-white/[0.05] bg-black/50 p-4 aspect-[2.2/1] flex items-center justify-center`}>
          
          {/* Laser scanning bar */}
          {scanning && (
            <div className="absolute top-0 left-0 w-[2px] h-full bg-orange shadow-lg shadow-orange animate-scan-h z-10" />
          )}

          {/* Banknote image layer */}
          <div className="relative w-full h-full">
            <img 
              src={note.image} 
              alt={note.label} 
              className={`w-full h-full object-cover rounded border border-white/[0.05] transition-all duration-500 ${
                scanning ? 'brightness-50 contrast-125' : 'brightness-75'
              }`}
            />

            {/* Suspicious markers overlay */}
            {showResult && note.markers.map((m, i) => (
              <div
                key={i}
                style={{ top: m.top, left: m.left }}
                onMouseEnter={() => setHoveredMarker(m)}
                onMouseLeave={() => setHoveredMarker(null)}
                className={`absolute w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125 shadow-lg ${
                  activeNote === '2000' 
                    ? 'bg-red-500 shadow-red-500/50' 
                    : 'bg-teal shadow-teal/50'
                }`}
              >
                <HelpCircle className="w-3 h-3 text-white" />
              </div>
            ))}
          </div>

          {/* Marker Tooltip */}
          {hoveredMarker && (
            <div className="absolute bottom-6 left-6 right-6 bg-black/95 border border-white/10 rounded-lg p-3 z-20 text-left">
              <h6 className="text-[10px] uppercase font-bold tracking-widest text-orange mb-1">{hoveredMarker.label}</h6>
              <p className="text-xs text-gray-300">{hoveredMarker.desc}</p>
            </div>
          )}
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className="w-full bg-orange/5 border border-orange text-orange hover:bg-orange/10 font-display font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50"
        >
          {scanning ? 'Running Spectral Scan...' : 'Scan Banknote'}
        </button>
      </div>

      {/* Analysis Output Panel */}
      <div className="bg-black/40 border border-white/[0.05] rounded-xl p-8 min-h-[28rem] flex items-center justify-center relative overflow-hidden">
        
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-glow to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {!scanning && !showResult && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4 text-gray-500"
            >
              <Eye className="w-12 h-12 text-gray-600 animate-pulse-glow" />
              <p className="text-xs font-mono">Awaiting optical data feed... Click "Scan Banknote".</p>
            </motion.div>
          )}

          {scanning && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-4 text-orange"
            >
              <HelpCircle className="w-12 h-12 text-orange animate-spin" />
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
                <span className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider border ${note.badgeClass}`}>
                  {note.status}
                </span>
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-display font-black ${note.scoreClass}`}>{note.score}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Match Confidence</span>
                </div>
              </div>

              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3">Optical Discrepancies:</h5>
                <ul className="flex flex-col gap-2.5">
                  {note.indicators.map((ind, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5">
                      <span className={activeNote === '2000' ? 'text-red-500' : 'text-emerald-500'}>
                        {activeNote === '2000' ? '❌' : '🟢'}
                      </span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.01] border border-dashed border-white/[0.08] rounded-lg p-4 mt-2">
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  {note.advisory}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
