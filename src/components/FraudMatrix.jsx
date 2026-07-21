import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Search, AlertCircle, ArrowRight, Cpu, ShieldCheck, Activity } from 'lucide-react';

const NODES = [
  { id: '1', name: '+91 90812-34210', type: 'Scam Caller eSIM', risk: 'CRITICAL', badgeClass: 'bg-red-500/10 border-red-500 text-red-500', links: 12, cluster: 'Jamtara Cohort A', desc: 'Sourced 45 spoofed law enforcement impersonation calls. eSIM rotates hourly.', x: 70, y: 190, color: '#EF4444' },
  { id: '2', name: '+91 98823-76120', type: 'VoIP Gateway Gateway', risk: 'MEDIUM', badgeClass: 'bg-amber-500/10 border-amber-500 text-amber-500', links: 8, cluster: 'Jamtara Cohort A', desc: 'Outbound voice traffic router running through proxy servers.', x: 120, y: 70, color: '#F59E0B' },
  { id: '3', name: 'upi: refund@ybl', type: 'Mule Collect Handle', risk: 'CRITICAL', badgeClass: 'bg-red-500/10 border-red-500 text-red-500', x: 260, y: 190, color: '#EF4444', links: 18, cluster: 'Jamtara Cohort A', desc: 'Primary collection node, collected 12 Lakh INR in micro-credits.' },
  { id: '4', name: 'Acc: 9087121289', type: 'Mule Cash Account', risk: 'CRITICAL', badgeClass: 'bg-red-500/10 border-red-500 text-red-500', x: 260, y: 310, color: '#EF4444', links: 14, cluster: 'Dhanbad Ring', desc: 'Correlates ATM cash-out transactions in Dhanbad district.' },
  { id: '5', name: 'telegram: job_bot', type: 'Telegram Spam Bot', risk: 'MEDIUM', badgeClass: 'bg-amber-500/10 border-amber-500 text-amber-500', x: 410, y: 90, color: '#F59E0B', links: 6, cluster: 'Task Scams Ring', desc: 'Broadcasting fraudulent Telegram tasks requiring advance token deposits.' },
  { id: '6', name: 'crypto: 0x82A1f...', type: 'Laundering Wallet', risk: 'CRITICAL', badgeClass: 'bg-red-500/10 border-red-500 text-red-500', x: 410, y: 250, color: '#EF4444', links: 9, cluster: 'Task Scams Ring', desc: 'USDT wallet address routing funds through coin mixers to offshore nodes.' },
  { id: '7', name: 'upi: cyber@police', type: 'Legitimate Portal', risk: 'SAFE', badgeClass: 'bg-emerald-500/10 border-emerald-500 text-emerald-500', x: 210, y: 50, color: '#10B981', links: 2, cluster: 'Verified Hubs', desc: 'Official cyber investigation command center.' }
];

const LINKS = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '3', target: '4' },
  { source: '5', target: '3' },
  { source: '5', target: '6' },
  { source: '4', target: '6' }
];

export default function FraudMatrix() {
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  // Composite Risk Engine state
  const [scamScoreInput, setScamScoreInput] = useState(90);
  const [graphScoreInput, setGraphScoreInput] = useState(80);
  const [currencyScoreInput, setCurrencyScoreInput] = useState(100);
  const [riskResult, setRiskResult] = useState({
    final_risk: 90,
    level: "HIGH",
    explanation: "Multiple scam indicators detected across intelligence modules"
  });

  const selectedNode = NODES.find(n => n.id === selectedId);

  const handleSearch = () => {
    setSearchError('');
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const matched = NODES.find(n => n.name.toLowerCase().includes(query) || n.cluster.toLowerCase().includes(query));
    if (matched) {
      setSelectedId(matched.id);
    } else {
      setSearchError('Node signature not found in central database.');
    }
  };

  const computeCompositeRisk = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/risk-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scam_score: Number(scamScoreInput),
          graph_score: Number(graphScoreInput),
          currency_score: Number(currencyScoreInput)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRiskResult(data);
      } else {
        // Fallback formula execution
        const calc = Math.round(scamScoreInput * 0.6 + graphScoreInput * 0.3 + currencyScoreInput * 0.1);
        setRiskResult({
          final_risk: calc,
          level: calc >= 70 ? "HIGH" : calc >= 40 ? "MEDIUM" : "LOW",
          explanation: "Multiple scam indicators detected across intelligence modules"
        });
      }
    } catch (err) {
      // Fallback formula execution
      const calc = Math.round(scamScoreInput * 0.6 + graphScoreInput * 0.3 + currencyScoreInput * 0.1);
      setRiskResult({
        final_risk: calc,
        level: calc >= 70 ? "HIGH" : calc >= 40 ? "MEDIUM" : "LOW",
        explanation: "Multiple scam indicators detected across intelligence modules"
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Network Graph Container */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Search Header */}
          <div className="flex gap-2 relative">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search suspect number, UPI, or Cluster..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="w-full bg-black/40 border border-white/[0.05] focus:border-teal rounded-lg pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all duration-300 font-sans"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-teal hover:bg-teal/95 text-black font-display font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-lg cursor-pointer transition-opacity"
            >
              Query
            </button>
          </div>

          {searchError && (
            <p className="text-[10px] text-red-500 font-mono flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {searchError}
            </p>
          )}

          {/* Dynamic SVG Grid Node Map */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.05] bg-black/50 aspect-[5/3.5] flex items-center justify-center p-4">
            <svg className="w-full h-full select-none" viewBox="0 0 500 350">
              {/* Draw Link Lines */}
              {LINKS.map((link, idx) => {
                const fromNode = NODES.find(n => n.id === link.source);
                const toNode = NODES.find(n => n.id === link.target);
                const isLinkedToSelected = selectedId && (link.source === selectedId || link.target === selectedId);

                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isLinkedToSelected ? '#00f0ff' : '#4d5360'}
                    strokeWidth={isLinkedToSelected ? 2.5 : 1}
                    className="link-line"
                    style={{ strokeOpacity: isLinkedToSelected ? 0.85 : 0.25 }}
                  />
                );
              })}

              {/* Draw Nodes */}
              {NODES.map((node) => {
                const isSelected = selectedId === node.id;
                const isHighlight = selectedId && LINKS.some(l => 
                  (l.source === selectedId && l.target === node.id) || 
                  (l.target === selectedId && l.source === node.id)
                );

                return (
                  <g 
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className="node-group cursor-pointer"
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 11 : isHighlight ? 9 : 7}
                      fill={node.color}
                      stroke="#050507"
                      strokeWidth={2}
                      className="node-circle"
                    />
                    <text
                      x={node.x + 12}
                      y={node.y + 4}
                      fill={isSelected ? '#ffffff' : '#8f96a3'}
                      fontSize={isSelected ? 10 : 8}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="font-sans pointer-events-none"
                    >
                      {node.name.length > 15 ? node.name.substring(0, 12) + '...' : node.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Overlay HUD labels */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-gray-500 border border-white/[0.05] rounded px-2 py-0.5 pointer-events-none">
              ENGINE N-07: CLUSTER VISUALIZER
            </div>
          </div>
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="bg-black/40 border border-white/[0.05] rounded-xl p-6 min-h-[26rem] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {!selectedId ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col items-center justify-center text-center gap-4 text-gray-500"
              >
                <Network className="w-12 h-12 text-gray-600 animate-pulse-glow" />
                <p className="text-xs font-mono">Select any vector node on the map to audit syndicate linkages.</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col gap-6 text-left"
              >
                <div>
                  <h4 className="font-display font-bold text-base text-white break-all mb-2">{selectedNode.name}</h4>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider border ${selectedNode.badgeClass}`}>
                      {selectedNode.risk} SEVERITY
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{selectedNode.type}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-b border-white/[0.05] py-4">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">MAPPED TARGETS:</span>
                    <span className="text-white">{selectedNode.links} entities</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">COHORT TAG:</span>
                    <span className="text-white">{selectedNode.cluster}</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Cohort Assessment:</h5>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{selectedNode.desc}</p>
                </div>

                <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mt-auto">
                  <p className="text-[10px] text-teal font-mono leading-relaxed flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    Telemetry uploaded to National Cybercrime database for active freeze protocols.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🧠 Unified Risk Scoring Engine Box */}
      <div className="bg-black/50 border border-teal/20 rounded-xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-teal" />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider font-display text-white">
                Unified Risk Scoring Engine
              </h4>
              <p className="text-xs text-gray-400 font-mono">
                Formula: final_score = (scam_score * 0.6) + (graph_score * 0.3) + (currency_score * 0.1)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-teal bg-teal/10 border border-teal/20 px-3 py-1 rounded">
            INTELLIGENCE FUSION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-400 flex justify-between">
              <span>Scam Score (Model)</span>
              <span className="text-teal font-bold">{scamScoreInput}%</span>
            </label>
            <input
              type="range" min="0" max="100"
              value={scamScoreInput}
              onChange={(e) => setScamScoreInput(Number(e.target.value))}
              className="accent-teal cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-400 flex justify-between">
              <span>Graph Risk (Areen)</span>
              <span className="text-teal font-bold">{graphScoreInput}%</span>
            </label>
            <input
              type="range" min="0" max="100"
              value={graphScoreInput}
              onChange={(e) => setGraphScoreInput(Number(e.target.value))}
              className="accent-teal cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-lg">
            <label className="text-[10px] uppercase font-mono text-gray-400 flex justify-between">
              <span>Currency Result (Kripa)</span>
              <span className="text-teal font-bold">{currencyScoreInput}%</span>
            </label>
            <input
              type="range" min="0" max="100"
              value={currencyScoreInput}
              onChange={(e) => setCurrencyScoreInput(Number(e.target.value))}
              className="accent-teal cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
          <button
            onClick={computeCompositeRisk}
            className="w-full sm:w-auto bg-teal hover:bg-teal-light text-black font-display font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Calculate Unified Intelligence Risk
          </button>

          {riskResult && (
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-lg w-full sm:w-auto justify-between">
              <div>
                <span className="text-[9px] uppercase font-mono text-gray-500 block">Unified Final Risk</span>
                <span className="text-xl font-bold font-mono text-red-500">{riskResult.final_risk} / 100</span>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded uppercase">
                {riskResult.level}
              </span>
            </div>
          )}
        </div>

        {riskResult && riskResult.explanation && (
          <p className="text-xs text-gray-300 font-mono bg-black/40 border border-white/[0.05] p-3 rounded-lg">
            ℹ️ {riskResult.explanation}
          </p>
        )}
      </div>
    </div>
  );
}

