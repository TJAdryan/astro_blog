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

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Real-time Sliders (Vector Weights) ---
  const [separation, setSeparation] = useState(0.15);
  const [alignment, setAlignment] = useState(0.05);
  const [cohesion, setCohesion] = useState(0.01);

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

    // --- Math Helper: Distance ---
    const distance = (b1: Boid, b2: Boid) => {
      return Math.sqrt((b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2);
    };

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

          const dist = distance(boid, other);

          if (dist < VISUAL_RANGE) {
            // Rule 1: Separation (avoiding immediate neighbors)
            if (dist < MIN_DISTANCE) {
              closeX += boid.x - other.x;
              closeY += boid.y - other.y;
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
        const margin = 50;
        const turnFactor = 0.2;
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
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = '#1e1e2e';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      boids.forEach((boid) => {
        // Calculate heading angle
        const angle = Math.atan2(boid.vy, boid.vx);

        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);

        // Draw Boid (simple triangle pointing in direction of velocity)
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-6, -4);
        ctx.lineTo(-6, 4);
        ctx.closePath();

        ctx.fillStyle = '#89b4fa';
        ctx.fill();
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
  }, [separation, alignment, cohesion]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'block' }}
      />
      
      {/* --- Control Panel --- */}
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(0, 0, 0, 0.08)', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.03)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#1d1d1f' }}>Boid Steering Variables</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Separation: {separation.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.01"
              value={separation}
              onChange={(e) => setSeparation(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Alignment: {alignment.toFixed(3)}
            </label>
            <input
              type="range"
              min="0.0"
              max="0.1"
              step="0.005"
              value={alignment}
              onChange={(e) => setAlignment(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' }}>
              Cohesion: {cohesion.toFixed(3)}
            </label>
            <input
              type="range"
              min="0.0"
              max="0.05"
              step="0.001"
              value={cohesion}
              onChange={(e) => setCohesion(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
