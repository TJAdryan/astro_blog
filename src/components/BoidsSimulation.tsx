import React, { useEffect, useRef, useState } from 'react';

// --- Configuration & Types ---
interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const WIDTH = 800;
const HEIGHT = 500;
const BOID_COUNT = 150;
const VISUAL_RANGE = 40;
const MIN_DISTANCE = 15;
const SPEED_LIMIT = 4;
const VISUAL_RANGE_SQ = VISUAL_RANGE * VISUAL_RANGE;
const MIN_DISTANCE_SQ = MIN_DISTANCE * MIN_DISTANCE;

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Real-time Sliders (Vector Weights) ---
  const [separation, setSeparation] = useState(0.15);
  const [alignment, setAlignment] = useState(0.05);
  const [cohesion, setCohesion] = useState(0.01);
  const [showVectorTrails, setShowVectorTrails] = useState(true);
  const [boidStyle, setBoidStyle] = useState<'bird' | 'fish'>('bird');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // --- Initialize Boids ---
    const boids: Boid[] = Array.from({ length: BOID_COUNT }, () => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      vx: (Math.random() - 0.5) * SPEED_LIMIT,
      vy: (Math.random() - 0.5) * SPEED_LIMIT,
    }));

    // Prebuild shape paths once per mode for faster frame rendering.
    const birdPath = new Path2D();
    birdPath.moveTo(11, 0);
    birdPath.lineTo(1, -2);
    birdPath.lineTo(-7, -6);
    birdPath.lineTo(-3, -1);
    birdPath.lineTo(-8, 0);
    birdPath.lineTo(-3, 1);
    birdPath.lineTo(-7, 6);
    birdPath.lineTo(1, 2);
    birdPath.closePath();

    const fishBodyPath = new Path2D();
    fishBodyPath.ellipse(1, 0, 7.5, 4.5, 0, 0, Math.PI * 2);

    const fishTailPath = new Path2D();
    fishTailPath.moveTo(-5, 0);
    fishTailPath.lineTo(-11, -4.5);
    fishTailPath.lineTo(-11, 4.5);
    fishTailPath.closePath();

    // --- Core Physics Engine Loop ---
    const updatePhysics = () => {
      for (const boid of boids) {
        let closeX = 0;
        let closeY = 0;
        let avgVx = 0;
        let avgVy = 0;
        let avgX = 0;
        let avgY = 0;
        let neighborsCount = 0;

        for (const other of boids) {
          if (boid === other) continue;

          const dx = boid.x - other.x;
          const dy = boid.y - other.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < VISUAL_RANGE_SQ) {
            // Rule 1: Separation (avoiding immediate neighbors)
            if (distSq < MIN_DISTANCE_SQ) {
              closeX += dx;
              closeY += dy;
            } else {
              // Rule 2 & 3: Accumulate positions and headings for within-range neighbors
              avgVx += other.vx;
              avgVy += other.vy;
              avgX += other.x;
              avgY += other.y;
              neighborsCount++;
            }
          }
        }

        // Apply Separation
        boid.vx += closeX * separation;
        boid.vy += closeY * separation;

        if (neighborsCount > 0) {
          // Calculate averages
          avgVx /= neighborsCount;
          avgVy /= neighborsCount;
          avgX /= neighborsCount;
          avgY /= neighborsCount;

          // Apply Alignment (match average velocity vector)
          boid.vx += (avgVx - boid.vx) * alignment;
          boid.vy += (avgVy - boid.vy) * alignment;

          // Apply Cohesion (steer toward center of mass)
          boid.vx += (avgX - boid.x) * cohesion;
          boid.vy += (avgY - boid.y) * cohesion;
        }

        // Keep within walls (soft boundaries)
        const margin = 40;
        const turnFactor = 0.25;
        if (boid.x < margin) boid.vx += turnFactor;
        if (boid.x > WIDTH - margin) boid.vx -= turnFactor;
        if (boid.y < margin) boid.vy += turnFactor;
        if (boid.y > HEIGHT - margin) boid.vy -= turnFactor;

        // Speed limit clamp
        const speed = Math.sqrt(boid.vx ** 2 + boid.vy ** 2);
        if (speed > SPEED_LIMIT) {
          boid.vx = (boid.vx / speed) * SPEED_LIMIT;
          boid.vy = (boid.vy / speed) * SPEED_LIMIT;
        }

        // Apply positions
        boid.x += boid.vx;
        boid.y += boid.vy;
      }
    };

    // --- Rendering Loop ---
    const draw = () => {
      // 1. Trail effect: fill with transparent slate background
      if (showVectorTrails) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.18)'; // Dark slate-900 with transparency for trails
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      } else {
        ctx.fillStyle = '#0f172a'; // Clear solid background
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // 2. Draw a faint grid system
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
      }

      // 3. Draw boids
      boids.forEach((boid) => {
        const angle = Math.atan2(boid.vy, boid.vx);

        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);

        if (boidStyle === 'bird') {
          // Bird mode: warm winged silhouette.
          ctx.fillStyle = '#fb923c';
          ctx.fill(birdPath);

          ctx.lineWidth = 1.1;
          ctx.strokeStyle = 'rgba(255, 245, 235, 0.7)';
          ctx.stroke(birdPath);
        } else {
          // Fish mode: cool body + distinct tail and eye.
          ctx.fillStyle = '#22d3ee';
          ctx.fill(fishBodyPath);

          ctx.fillStyle = '#0d9488';
          ctx.fill(fishTailPath);

          // Eye
          ctx.beginPath();
          ctx.arc(5, -1.2, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fill();
        }

        ctx.restore();
      });
    };

    const loop = () => {
      updatePhysics();
      draw();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, [separation, alignment, cohesion, showVectorTrails, boidStyle]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 font-sans mt-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
            Boids Flocking Simulation
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Observe emergent complexity through three simple rules: Separation, Alignment, and Cohesion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Boid Style Toggle */}
          <div className="flex items-center rounded-full border border-slate-700 bg-slate-850 p-1">
            <button
              onClick={() => setBoidStyle('bird')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                boidStyle === 'bird'
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                  : 'text-slate-400'
              }`}
            >
              Bird Mode
            </button>
            <button
              onClick={() => setBoidStyle('fish')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                boidStyle === 'fish'
                  ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                  : 'text-slate-400'
              }`}
            >
              Fish Mode
            </button>
          </div>

          {/* Trail Toggle */}
          <button
            onClick={() => setShowVectorTrails(!showVectorTrails)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              showVectorTrails
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {showVectorTrails && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${showVectorTrails ? 'bg-orange-400' : 'bg-slate-500'}`}></span>
            </span>
            {showVectorTrails ? 'Motion Trails Active' : 'Solid Rendering'}
          </button>
        </div>
      </div>

      {/* Simulation Viewport */}
      <div className="w-full bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="w-full h-auto rounded-xl block bg-slate-950 aspect-[16/10]"
        />
      </div>

      {/* Control Dashboard */}
      <div className="mt-6 p-5 bg-slate-850 rounded-2xl border border-slate-800/80">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Steering Variables
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Separation */}
          <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Separation</span>
              <span className="text-sm font-mono text-orange-400 font-bold">{separation.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.01"
              value={separation}
              onChange={(e) => setSeparation(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-[11px] text-slate-500 leading-normal">
              Steer to avoid crowding or crashing into local flockmates.
            </p>
          </div>

          {/* Alignment */}
          <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alignment</span>
              <span className="text-sm font-mono text-orange-400 font-bold">{alignment.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.1"
              step="0.005"
              value={alignment}
              onChange={(e) => setAlignment(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-[11px] text-slate-500 leading-normal">
              Steer toward the average heading direction of local flockmates.
            </p>
          </div>

          {/* Cohesion */}
          <div className="flex flex-col gap-2 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cohesion</span>
              <span className="text-sm font-mono text-orange-400 font-bold">{cohesion.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.05"
              step="0.001"
              value={cohesion}
              onChange={(e) => setCohesion(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-[11px] text-slate-500 leading-normal">
              Steer toward the average center of mass of local flockmates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
