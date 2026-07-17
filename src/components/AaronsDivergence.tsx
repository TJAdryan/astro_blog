import React, { useState, useMemo, useEffect } from 'react';

// --- Configuration & Types ---
interface Agent {
  id: number;
  name: string;
  competence: number;
  volume: number;
  type: string;
}

export default function AaronsDivergence() {
  const [volumeBias, setVolumeBias] = useState(70); // 0 = Filter by Competence, 100 = Filter by Loudness
  const [noiseLevel, setNoiseLevel] = useState(30);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive grid layout in standard React hook
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Fixed pool of 10 distinct agents to ensure deterministic data behavior
  const agents = useMemo<Agent[]>(() => [
    { id: 1, name: "Agent A (Aaron)", competence: 95, volume: 15, type: "Quiet Expert" },
    { id: 2, name: "Agent B", competence: 88, volume: 25, type: "Quiet Expert" },
    { id: 3, name: "Agent C", competence: 40, volume: 90, type: "Amplified Presenter" },
    { id: 4, name: "Agent D", competence: 30, volume: 95, type: "Amplified Presenter" },
    { id: 5, name: "Agent E", competence: 70, volume: 50, type: "Balanced Contributor" },
    { id: 6, name: "Agent F", competence: 65, volume: 45, type: "Balanced Contributor" },
    { id: 7, name: "Agent G", competence: 20, volume: 85, type: "Amplified Presenter" },
    { id: 8, name: "Agent H", competence: 82, volume: 20, type: "Quiet Expert" },
    { id: 9, name: "Agent I", competence: 55, volume: 60, type: "Balanced Contributor" },
    { id: 10, name: "Agent J", competence: 15, volume: 90, type: "Amplified Presenter" }
  ], []);

  // System logic: calculate metrics based on selection bias
  const processedData = useMemo(() => {
    const biasFactor = volumeBias / 100;
    
    // Score agents based on how the network currently filters information and sort descending by priority
    const rankedAgents = agents.map(agent => {
      // Network score combines Competence and Volume based on slider bias
      const networkScore = (agent.competence * (1 - biasFactor)) + (agent.volume * biasFactor);
      // Degrade effective performance if ambient structural noise is high
      const noisePenalty = (noiseLevel / 100) * (agent.volume * 0.2);
      const finalEffectiveValue = Math.max(0, agent.competence - noisePenalty);

      return { ...agent, networkScore, finalEffectiveValue };
    }).sort((a, b) => b.networkScore - a.networkScore);

    const selected = rankedAgents.slice(0, 3);

    // System efficiency is the average competence of the selected ideas
    const systemEfficiency = Math.round(
      selected.reduce((acc, curr) => acc + curr.finalEffectiveValue, 0) / selected.length
    );

    return { rankedAgents, selected, systemEfficiency };
  }, [agents, volumeBias, noiseLevel]);

  // Role Badge Styling classes
  const getBadgeClass = (type: string) => {
    switch (type) {
      case "Quiet Expert":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      case "Amplified Presenter":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default:
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 font-sans mt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            Aaron's Divergence
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            When Cadence Overtakes Competence
          </p>
        </div>
        
        {/* Status indicator */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          processedData.systemEfficiency > 70 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : processedData.systemEfficiency > 45 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {processedData.systemEfficiency > 70 ? 'High-Performance Flow' : processedData.systemEfficiency > 45 ? 'Sub-Optimal Channel' : 'Communication Collapse'}
        </div>
      </div>

      {/* Control panel section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-850 p-5 rounded-2xl border border-slate-800 mb-6">
        {/* Attention slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Network Attention Filter Bias</span>
            <span className="text-cyan-400 font-mono">{volumeBias}% Loudness</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volumeBias} 
            onChange={(e) => setVolumeBias(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Competence Filter</span>
            <span>Volume/Loudness Filter</span>
          </div>
        </div>

        {/* Noise level slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-300">Structural Ambient Noise</span>
            <span className="text-rose-400 font-mono">{noiseLevel}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={noiseLevel} 
            onChange={(e) => setNoiseLevel(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Clear Channels</span>
            <span>High Saturation</span>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Agent Registry */}
        <div className="lg:col-span-7">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Network Nodes (Talent Pool)
          </h3>
          <div className="grid gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {processedData.rankedAgents.map((agent) => {
              const isSelected = processedData.selected.some(s => s.id === agent.id);
              return (
                <div 
                  key={agent.id} 
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected 
                      ? 'bg-blue-600/10 border-blue-500/35 shadow-[0_0_12px_rgba(59,130,246,0.15)]' 
                      : 'bg-slate-850 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                        {agent.name}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${getBadgeClass(agent.type)}`}>
                        {agent.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex gap-3">
                      <span>Competence: <strong className="text-emerald-400 font-mono">{agent.competence}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Signal Volume: <strong className="text-orange-400 font-mono">{agent.volume}</strong></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Network Priority</div>
                    <div className={`font-mono font-black text-sm ${isSelected ? 'text-blue-400 text-base' : 'text-slate-300'}`}>
                      {Math.round(agent.networkScore)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Efficiency Metric & Aggregated Output */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Circular Efficiency Gauge */}
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 block">
              Overall System Efficiency
            </span>
            
            {/* Efficiency metric display */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - processedData.systemEfficiency / 100)}
                  className={`transition-all duration-500 ${
                    processedData.systemEfficiency > 70 
                      ? 'text-emerald-400' 
                      : processedData.systemEfficiency > 45 
                      ? 'text-amber-400' 
                      : 'text-rose-500'
                  }`}
                />
              </svg>
              <div className="absolute text-3xl font-black font-mono text-white">
                {processedData.systemEfficiency}%
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Calculated as the average actual competence of the top 3 ideas aggregated by the network filter.
            </p>
          </div>

          {/* Aggregated Output Panel */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Aggregated Network Outputs
              </h3>
              <div className="grid gap-2">
                {processedData.selected.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                      <span className="text-sm font-semibold text-white">{agent.name}</span>
                    </div>
                    <div className="text-xs bg-slate-850 border border-slate-850 px-2 py-1 rounded-md font-mono">
                      Value: <strong className="text-emerald-400 font-bold">{Math.round(agent.finalEffectiveValue)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Systemic Summary */}
            <div className="mt-5 p-3.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300/85 leading-relaxed">
              <strong>Aaron's Divergence:</strong> The precise threshold in a communication network where a node's transmission frequency ($V_i$) completely decouples from and masks its empirical validity ($C_i$), causing the routing layer to systematically favor high-velocity noise over low-frequency precision.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
