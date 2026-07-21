import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network as NetworkIcon, Search, AlertCircle, ArrowRight, Cpu, ShieldCheck, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Network, DataSet } from 'vis-network/standalone';

const FALLBACK_GRAPH_DATA = {
  total_nodes: 8,
  total_edges: 8,
  total_rings_detected: 1,
  clusters: [
    {
      cluster_id: 1,
      size: 8,
      nodes: ["P1", "P2", "B1", "B2", "D1", "M1", "P3", "B3"],
      risk: "HIGH",
      explanation: "🚨 Fraud Ring Detected - Connected entities involved in coordinated scam"
    }
  ],
  nodes: [
    { id: "P1", label: "Phone +91 90812-34210", type: "phone", color: "#3B82F6", shape: "dot", desc: "Spoofed Jamtara eSIM caller node" },
    { id: "P2", label: "Phone +91 98823-76120", type: "phone", color: "#3B82F6", shape: "dot", desc: "VoIP proxy router phone node" },
    { id: "B1", label: "Bank Acc 9087121289", type: "bank", color: "#F59E0B", shape: "diamond", desc: "SBI Primary cash-out mule account" },
    { id: "B2", label: "UPI refund@ybl", type: "bank", color: "#F59E0B", shape: "diamond", desc: "Coercion micro-credit collect handle" },
    { id: "D1", label: "Device IMEI 8642019", type: "device", color: "#8B5CF6", shape: "square", desc: "Shared Android device fingerprint" },
    { id: "M1", label: "Crypto 0x82A1f...", type: "mule", color: "#EF4444", shape: "triangle", desc: "Offshore USDT coin-mixer laundering wallet" },
    { id: "P3", label: "Phone +91 70098-11223", type: "phone", color: "#3B82F6", shape: "dot", desc: "Task scam broadcast WhatsApp number" },
    { id: "B3", label: "UPI cyber@police", type: "bank", color: "#10B981", shape: "star", desc: "Verified Cyber Crime Helpline Hub" }
  ],
  edges: [
    { source: "P1", target: "B1", from: "P1", to: "B1", label: "extortion transfer" },
    { source: "P2", target: "B1", from: "P2", to: "B1", label: "voip route" },
    { source: "P2", target: "B2", from: "P2", to: "B2", label: "upi request" },
    { source: "B1", target: "D1", from: "B1", to: "D1", label: "device login" },
    { source: "B2", target: "M1", from: "B2", to: "M1", label: "crypto swap" },
    { source: "D1", target: "M1", from: "D1", to: "M1", label: "wallet app link" },
    { source: "P3", target: "B2", from: "P3", to: "B2", label: "advance fee hook" },
    { source: "B3", target: "P3", from: "B3", to: "P3", label: "telemetry audit" }
  ]
};

export default function FraudMatrix() {
  const containerRef = useRef(null);
  const networkInstanceRef = useRef(null);

  const [graphData, setGraphData] = useState(FALLBACK_GRAPH_DATA);
  const [selectedNode, setSelectedNode] = useState(null);
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

  // Fetch Graph Data from Backend
  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/graph-data');
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
      }
    } catch (e) {
      console.warn("Backend graph API offline, using synthetic graph telemetry:", e);
    }
  };

  // Initialize Vis.js Network Canvas
  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    const visNodes = new DataSet(
      graphData.nodes.map(n => ({
        id: n.id,
        label: n.label,
        shape: n.shape || (n.type === 'bank' ? 'diamond' : n.type === 'mule' ? 'triangle' : 'dot'),
        color: {
          background: n.color || '#3B82F6',
          border: '#ffffff',
          highlight: { background: '#00f0ff', border: '#ffffff' }
        },
        size: n.type === 'mule' ? 22 : 18,
        font: { color: '#ffffff', face: 'monospace', size: 11 }
      }))
    );

    const visEdges = new DataSet(
      graphData.edges.map(e => ({
        from: e.from || e.source,
        to: e.to || e.target,
        label: e.label || '',
        color: { color: 'rgba(255, 255, 255, 0.25)', highlight: '#00f0ff' },
        width: 1.5,
        font: { color: '#8f96a3', size: 9, face: 'monospace', align: 'horizontal' }
      }))
    );

    const options = {
      nodes: {
        borderWidth: 2,
        shadow: { enabled: true, color: 'rgba(0,240,255,0.2)', size: 10 }
      },
      edges: {
        smooth: { type: 'continuous' }
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -40,
          centralGravity: 0.01,
          springLength: 90,
          springConstant: 0.08
        },
        stabilization: { iterations: 120 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true
      }
    };

    const network = new Network(containerRef.current, { nodes: visNodes, edges: visEdges }, options);
    networkInstanceRef.current = network;

    // Node click interaction
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const found = graphData.nodes.find(n => n.id === nodeId);
        if (found) {
          const connectedEdges = graphData.edges.filter(e => (e.from || e.source) === nodeId || (e.to || e.target) === nodeId);
          setSelectedNode({ ...found, links: connectedEdges.length });
        }
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
      }
    };
  }, [graphData]);

  const handleSearch = () => {
    setSearchError('');
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const matched = graphData.nodes.find(n => n.id.toLowerCase().includes(query) || n.label.toLowerCase().includes(query));
    if (matched) {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.selectNodes([matched.id]);
        networkInstanceRef.current.focus(matched.id, { scale: 1.2, animation: true });
      }
      const connectedEdges = graphData.edges.filter(e => (e.from || e.source) === matched.id || (e.to || e.target) === matched.id);
      setSelectedNode({ ...matched, links: connectedEdges.length });
    } else {
      setSearchError('Node signature not found in graph database.');
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
        const calc = Math.round(scamScoreInput * 0.6 + graphScoreInput * 0.3 + currencyScoreInput * 0.1);
        setRiskResult({
          final_risk: calc,
          level: calc >= 70 ? "HIGH" : calc >= 40 ? "MEDIUM" : "LOW",
          explanation: "Multiple scam indicators detected across intelligence modules"
        });
      }
    } catch (err) {
      const calc = Math.round(scamScoreInput * 0.6 + graphScoreInput * 0.3 + currencyScoreInput * 0.1);
      setRiskResult({
        final_risk: calc,
        level: calc >= 70 ? "HIGH" : calc >= 40 ? "MEDIUM" : "LOW",
        explanation: "Multiple scam indicators detected across intelligence modules"
      });
    }
  };

  const highRiskCluster = graphData.clusters && graphData.clusters.find(c => c.risk === 'HIGH');

  return (
    <div className="flex flex-col gap-8 mt-4">
      
      {/* 🚨 Fraud Ring Alert Banner */}
      {highRiskCluster && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 animate-bounce" />
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-red-400 font-bold">
                🚨 Fraud Ring Cluster Intercepted
              </h4>
              <p className="text-sm font-mono text-gray-200 mt-0.5">
                "{highRiskCluster.explanation}" ({highRiskCluster.size} connected entities mapped)
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-red-500/20 border border-red-500 text-red-400 text-xs font-mono font-bold uppercase tracking-wider shrink-0">
            CRITICAL RING
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Network Graph Container */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Search Header */}
          <div className="flex gap-2 relative">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search suspect number (+91 90812-34210), UPI, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="w-full bg-black/40 border border-white/[0.08] focus:border-teal rounded-lg pl-10 pr-4 py-2.5 text-xs text-white outline-none transition-all duration-300 font-sans"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-teal hover:bg-teal-light text-black font-display font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-lg cursor-pointer transition-opacity"
            >
              Query Node
            </button>
          </div>

          {searchError && (
            <p className="text-[10px] text-red-400 font-mono flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {searchError}
            </p>
          )}

          {/* Interactive Vis-Network Canvas */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-black/60 aspect-[5/3.5] flex flex-col justify-between">
            <div ref={containerRef} className="w-full h-full min-h-[320px] cursor-grab active:cursor-grabbing" />

            {/* Map HUD Legend Bar */}
            <div className="p-3 bg-black/80 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Phone</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45 bg-[#F59E0B]" /> Bank / UPI</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#8B5CF6]" /> Device Fingerprint</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Mule / Crypto Wallet</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Official Hub</span>
              </div>
              <span>Click node to view telemetry</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details Sidebar */}
        <div className="bg-black/40 border border-white/[0.08] rounded-xl p-6 min-h-[26rem] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {!selectedNode ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col items-center justify-center text-center gap-4 text-gray-500 py-12"
              >
                <NetworkIcon className="w-14 h-14 text-gray-600 animate-pulse" />
                <p className="text-xs font-mono max-w-xs">
                  Click any vector node on the interactive network map to audit syndicate linkages and details.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col gap-5 text-left"
              >
                <div>
                  <span className="text-[9px] uppercase font-mono text-teal tracking-widest block mb-1">
                    Vector Entity Node
                  </span>
                  <h4 className="font-display font-bold text-base text-white break-all">{selectedNode.label}</h4>
                  <div className="flex gap-2 items-center mt-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase border ${
                      selectedNode.type === 'mule' ? 'bg-red-500/10 border-red-500 text-red-400' : 
                      selectedNode.type === 'bank' ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-blue-500/10 border-blue-500 text-blue-400'
                    }`}>
                      {selectedNode.type} NODE
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">ID: {selectedNode.id}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 border-t border-b border-white/[0.06] py-3.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">DIRECT CONNECTIONS:</span>
                    <span className="text-teal font-bold">{selectedNode.links || 1} entities</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500">CLUSTER RING TAG:</span>
                    <span className="text-red-400 font-bold">Jamtara Cohort #1</span>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1 font-mono">
                    Threat Telemetry:
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg">
                    {selectedNode.desc || "Linked with multiple scam calls and automated transaction routes."}
                  </p>
                </div>

                <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 mt-auto">
                  <p className="text-[10px] text-teal font-mono leading-relaxed flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    Node telemetry uploaded to Cybercrime Database for active freeze protocols.
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


