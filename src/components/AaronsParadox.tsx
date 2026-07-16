import React, { useState, useMemo, useEffect } from 'react';

// --- Configuration & Types ---
interface Agent {
  id: number;
  name: string;
  competence: number;
  volume: number;
  type: string;
}

export default function AaronsParadox() {
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
    
    // Score agents based on how the network currently filters information
    const rankedAgents = agents.map(agent => {
      // Network score combines Competence and Volume based on slider bias
      const networkScore = (agent.competence * (1 - biasFactor)) + (agent.volume * biasFactor);
      // Degrade effective performance if ambient structural noise is high
      const noisePenalty = (noiseLevel / 100) * (agent.volume * 0.2);
      const finalEffectiveValue = Math.max(0, agent.competence - noisePenalty);

      return { ...agent, networkScore, finalEffectiveValue };
    });

    // Sort by network score descending and take top 3 "Selected Ideas"
    const sorted = [...rankedAgents].sort((a, b) => b.networkScore - a.networkScore);
    const selected = sorted.slice(0, 3);

    // System efficiency is the average competence of the selected ideas
    const systemEfficiency = Math.round(
      selected.reduce((acc, curr) => acc + curr.finalEffectiveValue, 0) / selected.length
    );

    return { rankedAgents, selected, systemEfficiency };
  }, [agents, volumeBias, noiseLevel]);

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#121212', color: '#e0e0e0', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <h2 style={{ marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '12px', color: '#ffffff' }}>Aaron's Paradox: Transmission vs. Competence</h2>
      
      {/* Controls Container */}
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', marginBottom: '24px', backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', border: '1px solid #2d2d2d' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Network Attention Filter Bias: <span style={{ color: '#4dadff' }}>{volumeBias}% Loudness</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volumeBias} 
            onChange={(e) => setVolumeBias(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4dadff', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginTop: '4px' }}>
            <span>Filter by Competence</span>
            <span>Filter by Volume</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Structural Noise Level: <span style={{ color: '#ff6b6b' }}>{noiseLevel}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={noiseLevel} 
            onChange={(e) => setNoiseLevel(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#ff6b6b', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginTop: '4px' }}>
            <span>Clear Channels</span>
            <span>High Saturation</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr' }}>
        
        {/* Left Column: Complete Agent Registry */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#ffffff' }}>Network Nodes (All Available Talent)</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {processedData.rankedAgents.map((agent) => {
              const isSelected = processedData.selected.some(s => s.id === agent.id);
              return (
                <div 
                  key={agent.id} 
                  style={{ 
                    padding: '12px', 
                    backgroundColor: isSelected ? '#1a2e40' : '#1e1e1e', 
                    border: isSelected ? '1px solid #4dadff' : '1px solid #2d2d2d',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: isSelected ? '#4dadff' : '#fff' }}>
                      {agent.name} 
                      <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>
                        [{agent.type}]
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                      Competence: <strong style={{ color: '#2ecc71' }}>{agent.competence}</strong> | 
                      Signal Volume: <strong style={{ color: '#e67e22' }}>{agent.volume}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#888' }}>Network Priority</div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: isSelected ? '#4dadff' : '#fff' }}>{Math.round(agent.networkScore)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Output & System Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Efficiency Metric Panel */}
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #2d2d2d' }}>
            <div style={{ fontSize: '13px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Overall System Efficiency
            </div>
            <div style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              margin: '12px 0',
              color: processedData.systemEfficiency > 75 ? '#2ecc71' : processedData.systemEfficiency > 45 ? '#f1c40f' : '#e74c3c'
            }}>
              {processedData.systemEfficiency}%
            </div>
            <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: '1.4' }}>
              Calculated as the average actual competence of the top 3 ideas aggregated by the network.
            </p>
          </div>

          {/* Selected Ideas Panel */}
          <div style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', border: '1px solid #2d2d2d', flexGrow: 1 }}>
            <h3 style={{ fontSize: '16px', marginTop: 0, marginBottom: '12px', color: '#4dadff' }}>
              Aggregated System Outputs
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {processedData.selected.map((agent, index) => (
                <div 
                  key={agent.id} 
                  style={{ 
                    padding: '10px', 
                    backgroundColor: '#151515', 
                    borderRadius: '6px', 
                    borderLeft: '4px solid #4dadff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '12px', color: '#888', marginRight: '6px' }}>#{index + 1}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>{agent.name}</span>
                  </div>
                  <div style={{ fontSize: '12px', backgroundColor: '#222', padding: '4px 8px', borderRadius: '4px' }}>
                    Value: <strong style={{ color: '#2ecc71' }}>{Math.round(agent.finalEffectiveValue)}</strong>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#251818', border: '1px solid #4a2323', borderRadius: '6px', fontSize: '12px', color: '#cca3a3', lineHeight: '1.4' }}>
              <strong>Systemic Summary:</strong> When attention filters favor volume over internal validity metrics, high-competence, low-volume agents (such as Aaron) are structurally suppressed from execution pipelines.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
