import React, { useState, useMemo } from 'react';

export default function TVNRSimulation() {
  // Input parameters
  const [initialPop, setInitialPop] = useState(30000);
  const [sterilizationRate, setSterilizationRate] = useState(0.70);
  const [abandonment, setAbandonment] = useState(2500);
  const [birthRate, setBirthRate] = useState(0.40);
  const [mortalityRate, setMortalityRate] = useState(0.15);
  const [years, setYears] = useState(10);

  // UI state
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showLogTable, setShowLogTable] = useState(false);

  // Compute population trajectory
  const { history, finalPop, maxPop, isDeclining, thresholdRate } = useMemo(() => {
    let currentPop = initialPop;
    const historyData = [];
    let maxFound = initialPop;

    // Year 0 entry
    historyData.push({
      year: 0,
      population: currentPop,
      sterilized: Math.round(currentPop * sterilizationRate),
      unsterilized: Math.max(0, currentPop - Math.round(currentPop * sterilizationRate)),
      births: 0,
      deaths: 0,
      netDelta: 0
    });

    for (let y = 1; y <= years; y++) {
      const pop = currentPop;
      const sterilizedCount = Math.round(pop * sterilizationRate);
      const unsterilizedCount = Math.max(0, pop - sterilizedCount);

      const births = Math.round(unsterilizedCount * birthRate);
      const deaths = Math.round(pop * mortalityRate);
      
      // Calculate next population
      const nextPop = Math.max(0, pop + births + abandonment - deaths);
      const netDelta = nextPop - pop;

      currentPop = nextPop;
      if (currentPop > maxFound) maxFound = currentPop;

      historyData.push({
        year: y,
        population: currentPop,
        sterilized: Math.round(currentPop * sterilizationRate),
        unsterilized: Math.max(0, currentPop - Math.round(currentPop * sterilizationRate)),
        births,
        deaths,
        netDelta
      });
    }

    // Analytical threshold sterilization rate (where growth = 0 under simple assumptions without abandonment)
    // birth_rate * (1 - S) = mortality_rate => S = 1 - (mortality_rate / birth_rate)
    const rawThreshold = 1 - (mortalityRate / birthRate);
    const thresholdRateValue = Math.max(0, Math.min(1, rawThreshold));

    return {
      history: historyData,
      finalPop: currentPop,
      maxPop: maxFound,
      isDeclining: currentPop < initialPop,
      thresholdRate: thresholdRateValue
    };
  }, [initialPop, sterilizationRate, abandonment, birthRate, mortalityRate, years]);

  // Chart plotting constants
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const chartYMax = Math.max(1000, maxPop * 1.1); // give 10% headroom

  // Generate SVG coordinates for line chart
  const points = useMemo(() => {
    return history.map((item, idx) => {
      const x = paddingLeft + (item.year / years) * plotWidth;
      const y = chartHeight - paddingBottom - (item.population / chartYMax) * plotHeight;
      return { x, y, ...item };
    });
  }, [history, years, plotWidth, plotHeight, chartYMax]);

  // Construct SVG Path attributes
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const baseLineY = chartHeight - paddingBottom;
    return `${linePath} L ${points[points.length - 1].x} ${baseLineY} L ${points[0].x} ${baseLineY} Z`;
  }, [points, linePath]);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const val = ratio * chartYMax;
      const y = chartHeight - paddingBottom - ratio * plotHeight;
      lines.push({ y, value: val });
    }
    return lines;
  }, [chartYMax, plotHeight]);

  return (
    <div className="w-full p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-xl border border-slate-800 font-sans my-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">🐕</span>
            TVNR Population Simulator
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Dynamic threshold modeling for municipal animal control programs.
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
          isDeclining 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {isDeclining ? 'Declining Trajectory' : 'Growing/Stable Trajectory'}
        </div>
      </div>

      {/* Main Grid: Controls vs Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interactive Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            Simulation Controls
          </h3>

          {/* Initial Population */}
          <div className="flex flex-col gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Initial Stray Population</span>
              <span className="text-orange-400 font-mono font-bold">{initialPop.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="100000" 
              step="1000"
              value={initialPop} 
              onChange={(e) => setInitialPop(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Sterilization Rate */}
          <div className="flex flex-col gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Sterilization Rate (S)</span>
              <span className="text-orange-400 font-mono font-bold">{Math.round(sterilizationRate * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={sterilizationRate} 
              onChange={(e) => setSterilizationRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
              <span>No Control (0%)</span>
              <span className="text-orange-400/70">Critical Threshold: {Math.round(thresholdRate * 100)}%</span>
              <span>Eradication (100%)</span>
            </div>
          </div>

          {/* Annual Abandonment */}
          <div className="flex flex-col gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Annual Pet Abandonment</span>
              <span className="text-orange-400 font-mono font-bold">+{abandonment.toLocaleString()} / year</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="250"
              value={abandonment} 
              onChange={(e) => setAbandonment(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Birth Rate of Unsterilized */}
          <div className="flex flex-col gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Birth Rate (unsterilized)</span>
              <span className="text-orange-400 font-mono font-bold">{Math.round(birthRate * 100)}% / year</span>
            </div>
            <input 
              type="range" 
              min="0.10" 
              max="1.00" 
              step="0.05"
              value={birthRate} 
              onChange={(e) => setBirthRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Natural Mortality */}
          <div className="flex flex-col gap-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Natural Mortality Rate</span>
              <span className="text-orange-400 font-mono font-bold">{Math.round(mortalityRate * 100)}% / year</span>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.40" 
              step="0.01"
              value={mortalityRate} 
              onChange={(e) => setMortalityRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        {/* Right Side: Charts & Key Metrics */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dashboard Summary Blocks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Projected Population (Y{years})
              </span>
              <span className={`text-2xl font-black font-mono ${
                isDeclining ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {finalPop.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Total Feral Net Change
              </span>
              <span className={`text-2xl font-black font-mono ${
                isDeclining ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {finalPop - initialPop > 0 ? '+' : ''}{(finalPop - initialPop).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Responsive SVG Line Chart */}
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Stray Population Curve Over Time
              </span>
              <span className="text-[9px] text-slate-500 font-semibold italic">
                Hover plot points for year metrics
              </span>
            </div>

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none">
              {/* Grid Lines & Y-axis labels */}
              {gridLines.map((line, idx) => (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={line.y} 
                    x2={chartWidth - paddingRight} 
                    y2={line.y} 
                    stroke="rgba(255,255,255,0.06)" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={line.y + 3} 
                    textAnchor="end" 
                    fill="#64748b" 
                    fontSize="9" 
                    fontFamily="monospace"
                  >
                    {Math.round(line.value).toLocaleString()}
                  </text>
                </g>
              ))}

              {/* Area Under Curve */}
              <path 
                d={areaPath} 
                fill="url(#gradient-orange)" 
                opacity="0.15" 
              />

              {/* SVG Gradient Definition */}
              <defs>
                <linearGradient id="gradient-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8c42" />
                  <stop offset="100%" stopColor="#ff8c42" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Trend Line */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#ff8c42" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Plot points */}
              {points.map((p, idx) => (
                <circle 
                  key={idx} 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredIndex === idx ? "6" : "4"} 
                  fill={hoveredIndex === idx ? "#ffffff" : "#ff8c42"} 
                  stroke="#1e293b" 
                  strokeWidth={hoveredIndex === idx ? "2.5" : "1.5"} 
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}

              {/* X-axis year ticks */}
              {points.filter((_, idx) => idx % Math.max(1, Math.round(years / 5)) === 0 || idx === years).map((p, idx) => (
                <g key={idx} transform={`translate(${p.x}, ${chartHeight - paddingBottom + 16})`}>
                  <text textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
                    Yr {p.year}
                  </text>
                </g>
              ))}

              {/* Hover Tooltip Render */}
              {hoveredIndex !== null && points[hoveredIndex] && (
                <g>
                  {/* Vertical indicator line */}
                  <line 
                    x1={points[hoveredIndex].x} 
                    y1={paddingTop} 
                    x2={points[hoveredIndex].x} 
                    y2={chartHeight - paddingBottom} 
                    stroke="rgba(255, 140, 66, 0.3)" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3" 
                  />
                  {/* Hover box */}
                  <g 
                    transform={`translate(${
                      points[hoveredIndex].x > chartWidth / 2 
                        ? points[hoveredIndex].x - 115 
                        : points[hoveredIndex].x + 15
                    }, ${
                      points[hoveredIndex].y > chartHeight / 2 
                        ? points[hoveredIndex].y - 55 
                        : points[hoveredIndex].y + 10
                    })`}
                  >
                    <rect 
                      width="100" 
                      height="46" 
                      rx="8" 
                      fill="#1e293b" 
                      stroke="#475569" 
                      strokeWidth="1" 
                      opacity="0.95" 
                      className="shadow-lg"
                    />
                    <text x="10" y="16" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      YEAR {points[hoveredIndex].year}
                    </text>
                    <text x="10" y="32" fill="#ffffff" fontSize="12" fontWeight="black" fontFamily="monospace">
                      {points[hoveredIndex].population.toLocaleString()}
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

        </div>
      </div>

      {/* Toggle Log details */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowLogTable(!showLogTable)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          {showLogTable ? 'Hide Detailed Log' : 'View Detailed Log'}
          <svg className={`w-3.5 h-3.5 transition-transform ${showLogTable ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showLogTable && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-bold">
                  <th className="p-3 font-mono">Year</th>
                  <th className="p-3 font-mono">Population</th>
                  <th className="p-3 font-mono">Sterilized</th>
                  <th className="p-3 font-mono">Births</th>
                  <th className="p-3 font-mono">Deaths</th>
                  <th className="p-3 font-mono">Net Delta</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.year} className="border-b border-slate-800/50 hover:bg-slate-900/40 text-slate-300">
                    <td className="p-3 font-semibold font-mono text-slate-400">Yr {row.year}</td>
                    <td className="p-3 font-bold font-mono">{row.population.toLocaleString()}</td>
                    <td className="p-3 font-mono">{row.sterilized.toLocaleString()}</td>
                    <td className="p-3 font-mono text-emerald-400">+{row.births.toLocaleString()}</td>
                    <td className="p-3 font-mono text-rose-400">-{row.deaths.toLocaleString()}</td>
                    <td className={`p-3 font-mono font-bold ${
                      row.netDelta < 0 ? 'text-emerald-400' : row.netDelta > 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {row.netDelta > 0 ? '+' : ''}{row.netDelta.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
