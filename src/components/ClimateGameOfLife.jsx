import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 40; // 40x40 Grid

// Helper to generate empty grid matrix
const createEmptyGrid = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

// Helper to seed random population matching target density
const seedGrid = (density = 0.2) => {
  return Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill(null).map(() => (Math.random() < density ? 1 : 0))
  );
};

export default function ClimateGameOfLife() {
  // Environmental Variables governed by the user
  const [temperature, setTemperature] = useState(15); // Baseline 15°C
  const [resources, setResources] = useState(100);    // Baseline 100%

  // Simulation State
  const [grid, setGrid] = useState(() => seedGrid(0.2));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [populationDensity, setPopulationDensity] = useState(20);
  const [systemStatus, setSystemStatus] = useState('Stable Equilibrium');
  const [speed, setSpeed] = useState(100); // ms per step
  const [isGameOver, setIsGameOver] = useState(false);

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Track global configuration changes within the active loop
  const configRef = useRef({ temperature, resources, speed });
  configRef.current = { temperature, resources, speed };

  // Calculate population density metrics
  useEffect(() => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const aliveCells = grid.flat().reduce((acc, cell) => acc + cell, 0);
    const density = Math.round((aliveCells / totalCells) * 100);
    setPopulationDensity(density);

    // Determine system structural state
    if (density === 0) {
      setSystemStatus('Mass Extinction');
      if (generation > 0) {
        setIsGameOver(true);
        setIsRunning(false);
      }
    } else if (configRef.current.temperature > 16.5 || configRef.current.resources < 45) {
      setSystemStatus('Degrading / High Stress');
    } else {
      setSystemStatus('Stable Equilibrium');
    }
  }, [grid, generation]);

  // Game loop tick calculations
  const runSimulation = useCallback(() => {
    if (!isRunningRef.current) return;

    let isGameOverDetected = false;

    setGrid((currentGrid) => {
      const aliveCells = currentGrid.flat().reduce((acc, cell) => acc + cell, 0);
      if (aliveCells === 0) {
        isGameOverDetected = true;
        return currentGrid;
      }

      const nextGrid = currentGrid.map((row) => [...row]);
      const { temperature: temp, resources: res } = configRef.current;

      // Map environmental degradation multipliers
      const heatStressDieOffChance = temp > 15 ? (temp - 15) * 0.12 : 0;
      const starvationMultiplier = res < 70 ? (70 - res) * 0.015 : 0;

      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          let neighbors = 0;
          
          // Compute Moore neighborhood (8 directions) with toroidal wrap-around boundaries
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              if (i === 0 && j === 0) continue;
              const newR = (r + i + GRID_SIZE) % GRID_SIZE;
              const newC = (c + j + GRID_SIZE) % GRID_SIZE;
              neighbors += currentGrid[newR][newC];
            }
          }

          // Core Conway Game of Life logic rules
          if (currentGrid[r][c] === 1) {
            if (neighbors < 2 || neighbors > 3) {
              nextGrid[r][c] = 0; // Underpopulation or Overpopulation death
            } else if (Math.random() < heatStressDieOffChance) {
              nextGrid[r][c] = 0; // Environmental Heat Death mutation
            }
          } else {
            // Birth rule modified by resource constraints
            const birthThreshold = 3 + starvationMultiplier;
            if (neighbors >= 3 && neighbors <= birthThreshold) {
              nextGrid[r][c] = 1;
            }
          }
        }
      }

      // Check if next grid is completely empty
      const nextAliveCells = nextGrid.flat().reduce((acc, cell) => acc + cell, 0);
      if (nextAliveCells === 0) {
        isGameOverDetected = true;
      }

      return nextGrid;
    });

    if (isGameOverDetected) {
      setIsRunning(false);
      setIsGameOver(true);
      return;
    }

    setGeneration((g) => g + 1);
    setTimeout(runSimulation, configRef.current.speed);
  }, []);

  // Control triggers
  useEffect(() => {
    if (isRunning) {
      isRunningRef.current = true;
      runSimulation();
    }
  }, [isRunning, runSimulation]);

  // Handle cell click toggling
  const handleCellClick = (r, c) => {
    if (isGameOver) return; // Prevent editing when game is over
    setGrid((currentGrid) => {
      const nextGrid = currentGrid.map((row) => [...row]);
      nextGrid[r][c] = nextGrid[r][c] === 1 ? 0 : 1;
      return nextGrid;
    });
  };

  // Helper to reset the simulation
  const handleReset = () => {
    setGrid(seedGrid(0.2));
    setGeneration(0);
    setIsGameOver(false);
  };

  // Helper to clear the simulation grid
  const handleClear = () => {
    setGrid(createEmptyGrid());
    setGeneration(0);
    setIsGameOver(false);
  };

  // Helper to load presets
  const applyPreset = (temp, res, speedMs, density) => {
    setTemperature(temp);
    setResources(res);
    setSpeed(speedMs);
    setGrid(seedGrid(density));
    setGeneration(0);
    setIsGameOver(false);
  };

  // Determine color status theme classes
  const getStatusColorClass = () => {
    if (systemStatus.includes('Extinction')) {
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    } else if (systemStatus.includes('Stress')) {
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  const getStatusPulseColor = () => {
    if (systemStatus.includes('Extinction')) return 'bg-rose-400';
    if (systemStatus.includes('Stress')) return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 font-sans mt-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              </svg>
            </span>
            Ecosystem Cellular Automata
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            A modified Conway's Game of Life simulation demonstrating non-linear feedback loops.
          </p>
        </div>

        {/* System status badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${getStatusColorClass()}`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusPulseColor()}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getStatusPulseColor()}`}></span>
          </span>
          {systemStatus}
        </div>
      </div>

      {/* Main Grid & Controls Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Game Grid viewport */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-inner relative">
            <div 
              className="grid gap-[1.5px] bg-slate-900 overflow-hidden rounded-lg aspect-square cursor-crosshair select-none"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            >
              {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <div 
                    key={`${rIdx}-${cIdx}`} 
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    className={`w-full h-0 pb-[100%] transition-colors duration-[120ms] rounded-[2px] ${
                      cell === 1 
                        ? 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-teal-500 shadow-[0_0_8px_rgba(52,211,153,0.7)]' 
                        : 'bg-slate-900/80 hover:bg-slate-800/80'
                    }`}
                    title={`Cell: ${rIdx},${cIdx}`}
                  />
                ))
              )}
            </div>

            {/* Game Over Screen Overlay */}
            {isGameOver && (
              <div className="absolute inset-3 bg-slate-950/95 backdrop-blur-[4px] rounded-lg flex flex-col items-center justify-center text-center p-6 border border-rose-500/20 shadow-2xl">
                <span className="p-3 bg-rose-500/10 rounded-full text-rose-500 mb-3 animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                <h3 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-wider">All Life Has Ended</h3>
                <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xs leading-relaxed">
                  The environmental stress thresholds were exceeded, causing a mass systemic extinction.
                </p>
                <div className="mt-4 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Survival Record</span>
                  <span className="text-sm font-bold text-slate-300">Life existed for <strong className="text-white font-mono text-base">{generation}</strong> cycles</span>
                </div>
                <button 
                  onClick={handleReset} 
                  className="mt-6 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Re-Seed Biosphere
                </button>
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-3 text-center">
            Click on cells in the grid to seed or toggle life directly.
          </div>
        </div>

        {/* Right Side: Control Panels */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          
          {/* Section 1: Dashboard Stats */}
          <div className="grid grid-cols-3 gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Gen</span>
              <strong className="text-lg md:text-xl font-black font-mono text-white">{generation}</strong>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Density</span>
              <strong className="text-lg md:text-xl font-black font-mono text-emerald-400">{populationDensity}%</strong>
            </div>
            <div className="text-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Temp</span>
              <strong className="text-lg md:text-xl font-black font-mono text-orange-450 text-orange-400">{temperature.toFixed(2)}°C</strong>
            </div>
          </div>

          {/* Section 2: Presets quick buttons */}
          <div>
            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Sim Pre-sets</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => applyPreset(15, 100, 100, 0.2)}
                className="text-left p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 rounded-xl text-xs transition-all duration-200 flex flex-col gap-0.5 hover:-translate-y-0.5"
              >
                <span className="font-bold text-emerald-400">Stable Biosphere</span>
                <span className="text-[10px] text-slate-500">Temp: 15.00°C • Res: 100%</span>
              </button>
              <button 
                onClick={() => applyPreset(17.25, 120, 80, 0.35)}
                className="text-left p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 rounded-xl text-xs transition-all duration-200 flex flex-col gap-0.5 hover:-translate-y-0.5"
              >
                <span className="font-bold text-orange-400">Greenhouse Cycle</span>
                <span className="text-[10px] text-slate-500">Temp: 17.25°C • Res: 120%</span>
              </button>
              <button 
                onClick={() => applyPreset(14.5, 35, 120, 0.15)}
                className="text-left p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 rounded-xl text-xs transition-all duration-200 flex flex-col gap-0.5 hover:-translate-y-0.5"
              >
                <span className="font-bold text-amber-500">Resource Starvation</span>
                <span className="text-[10px] text-slate-500">Temp: 14.50°C • Res: 35%</span>
              </button>
              <button 
                onClick={() => applyPreset(13.75, 140, 50, 0.45)}
                className="text-left p-3 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 rounded-xl text-xs transition-all duration-200 flex flex-col gap-0.5 hover:-translate-y-0.5"
              >
                <span className="font-bold text-cyan-400 font-semibold">Hyper Growth</span>
                <span className="text-[10px] text-slate-500">Temp: 13.75°C • Res: 140%</span>
              </button>
            </div>
          </div>

          {/* Section 3: Environmental Governance Controls */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">Environmental Variables</span>
            
            {/* Temp slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-350">Global Temperature</span>
                <span className="text-orange-400 font-mono font-bold">{temperature.toFixed(2)}°C</span>
              </div>
              <input 
                type="range" min="13" max="18" step="0.25" value={temperature} 
                onChange={(e) => setTemperature(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-550 text-slate-500 font-medium">
                <span>13.00°C (Cool)</span>
                <span>Baseline: 15.00°C</span>
                <span>18.00°C (Extreme)</span>
              </div>
            </div>

            {/* Resources slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-350">Resource Allocation</span>
                <span className="text-cyan-400 font-mono font-bold">{resources}%</span>
              </div>
              <input 
                type="range" min="20" max="150" value={resources} 
                onChange={(e) => setResources(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-550 text-slate-500 font-medium">
                <span>20% (Barren)</span>
                <span>Baseline: 100%</span>
                <span>150% (Abundant)</span>
              </div>
            </div>

            {/* Simulation speed slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-350">Simulation Interval</span>
                <span className="text-slate-400 font-mono font-bold">{speed}ms</span>
              </div>
              <input 
                type="range" min="50" max="500" step="25" value={speed} 
                onChange={(e) => setSpeed(Number(e.target.value))} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
              <div className="flex justify-between text-[10px] text-slate-550 text-slate-500 font-medium">
                <span>50ms (Fast)</span>
                <span>500ms (Slow)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Primary Simulation controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${
                isRunning 
                  ? 'bg-rose-650 hover:bg-rose-600 bg-rose-600 text-white shadow-[0_4px_12px_rgba(225,29,72,0.3)]' 
                  : 'bg-emerald-650 hover:bg-emerald-600 bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)]'
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Simulation
                </>
              )}
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={handleReset} 
                className="py-3.5 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-300 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 uppercase tracking-wider font-bold"
                title="Reset with random 20% seed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                </svg>
                Reset
              </button>
              <button 
                onClick={handleClear} 
                className="py-3.5 px-4 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-400 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 uppercase tracking-wider font-bold"
                title="Clear all cells"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mechanics Explanation Section */}
      <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
        <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-850">
          <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            Heat Stress Mechanics
          </h4>
          <p className="leading-relaxed text-slate-400 text-xs">
            Temperatures above <strong className="text-white">15.00°C</strong> trigger heat stress. Active cells experience a random chance of dying off each cycle (increasing by <strong className="text-white">12%</strong> per degree above 15°C). At <strong className="text-white">17.25°C+</strong>, extinction dynamics accelerate.
          </p>
        </div>
        <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-850">
          <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Resource Scarcity Mechanics
          </h4>
          <p className="leading-relaxed text-slate-400 text-xs">
            When global resources fall below <strong className="text-white">70%</strong>, the neighbor threshold required for cellular birth rises (requiring more than the standard 3 neighbors). This mimics resource competition in stressed ecosystems.
          </p>
        </div>
      </div>
    </div>
  );
}
