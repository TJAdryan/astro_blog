import React, { useState, useEffect, useCallback } from 'react';

// --- GAME CONFIG & CONSTANTS ---
const GRID_SIZE = 15;
const TOTAL_LEVELS = 5;

type CharacterClass = 'Mage' | 'Fighter' | 'Rogue';
type GameState = 'START' | 'PLAYING' | 'VICTORY' | 'DEFEAT';

interface Position {
  x: number;
  y: number;
}

interface PlayerStats {
  class: CharacterClass;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  hp: number;
  atk: number;
}

// --- CLASS BALANCING ---
const CLASS_PRESETS: Record<CharacterClass, Omit<PlayerStats, 'class'>> = {
  Fighter: { hp: 120, maxHp: 120, atk: 15, def: 5 },  // High mitigation, steady damage
  Mage:    { hp: 80,  maxHp: 80,  atk: 25, def: 2 },  // Glass cannon, high offense variance
  Rogue:   { hp: 100, maxHp: 100, atk: 18, def: 3 },  // Balanced skirmisher
};

export default function VaultRunner() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerClass, setPlayerClass] = useState<CharacterClass>('Fighter');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ class: 'Fighter', ...CLASS_PRESETS.Fighter });
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 1, y: 1 });
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [grid, setGrid] = useState<string[][]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [log, setLog] = useState<string[]>(['Welcome to the Vault. Find the stairs (S) to descend.']);
  
  // --- PROJECTILE VISUALS STATE ---
  const [projectilePath, setProjectilePath] = useState<Position[]>([]);
  const [projectileColor, setProjectileColor] = useState<string>('');

  // --- LINE OF SIGHT CHECK (Bresenham's Line Algorithm) ---
  const hasLineOfSight = useCallback((x1: number, y1: number, x2: number, y2: number, currentGrid: string[][]) => {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let curX = x1;
    let curY = y1;

    while (true) {
      if (curX === x2 && curY === y2) return true;
      // Check if current cell is a wall, but ignore starting and ending cells
      if ((curX !== x1 || curY !== y1) && (curX !== x2 || curY !== y2)) {
        if (currentGrid[curY] && currentGrid[curY][curX] === '#') {
          return false; // Blocked by a wall
        }
      }

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        curX += sx;
      }
      if (e2 < dx) {
        err += dx;
        curY += sy;
      }
    }
  }, []);

  // --- GET BRESENHAM LINE PATH (For rendering projectile trail) ---
  const getBresenhamPath = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const path: Position[] = [];
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    let curX = x1;
    let curY = y1;

    while (true) {
      if (curX === x2 && curY === y2) break;
      if (curX !== x1 || curY !== y1) {
        path.push({ x: curX, y: curY });
      }

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        curX += sx;
      }
      if (e2 < dx) {
        err += dx;
        curY += sy;
      }
    }
    return path;
  }, []);

  // --- PROCEDURAL LEVEL GENERATION ---
  const generateLevel = useCallback((level: number, pClass: CharacterClass) => {
    // Initialize blank map with outer walls
    const newGrid = Array(GRID_SIZE).fill(null).map((_, y) =>
      Array(GRID_SIZE).fill(null).map((_, x) =>
        x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1 ? '#' : '.'
      )
    );

    // Add random internal wall structures (Rogue/Gauntlet style obstacles)
    for (let i = 0; i < 25; i++) {
      const rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      const ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      if ((rx !== 1 || ry !== 1)) {
        newGrid[ry][rx] = '#';
      }
    }

    // Set Random Exit stairs
    let exitX = GRID_SIZE - 2;
    let exitY = GRID_SIZE - 2;
    let attempts = 0;
    do {
      exitX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      exitY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      attempts++;
    } while (
      (newGrid[exitY][exitX] !== '.' || (Math.abs(exitX - 1) + Math.abs(exitY - 1) < 6)) &&
      attempts < 100
    );
    newGrid[exitY][exitX] = 'S';

    // Generate Scaled Enemies
    const enemyCount = 3 + level;
    const newEnemies: Enemy[] = [];
    for (let i = 0; i < enemyCount; i++) {
      let ex, ey;
      do {
        ex = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        ey = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      } while (newGrid[ey][ex] !== '.' || (ex === 1 && ey === 1) || (ex === exitX && ey === exitY));

      newEnemies.push({
        id: `${level}-${i}`,
        x: ex,
        y: ey,
        hp: 20 + level * 8,
        atk: 6 + level * 2,
      });
    }

    setGrid(newGrid);
    setEnemies(newEnemies);
    setPlayerPosition({ x: 1, y: 1 });
  }, []);

  // --- START GAME ---
  const startGame = (selectedClass: CharacterClass) => {
    setPlayerClass(selectedClass);
    setPlayerStats({ class: selectedClass, ...CLASS_PRESETS[selectedClass] });
    setCurrentLevel(1);
    setLog(['You enter the cold depths of the Vault.']);
    setGameState('PLAYING');
    generateLevel(1, selectedClass);
  };

  // --- ENEMY AI TURN ---
  const processEnemyTurns = useCallback((pX: number, pY: number, currentEnemiesList: Enemy[]) => {
    let currentHp = playerStats.hp;
    const nextLogs: string[] = [];

    const updatedEnemies = currentEnemiesList.map(enemy => {
      const dx = pX - enemy.x;
      const dy = pY - enemy.y;
      const distance = Math.abs(dx) + Math.abs(dy);

      // Attack if adjacent
      if (distance === 1) {
        const dmg = Math.max(1, enemy.atk - playerStats.def);
        currentHp = Math.max(0, currentHp - dmg);
        nextLogs.push(`An enemy ambushes you for ${dmg} DMG!`);
        return enemy;
      }

      // Move closer toward player if within line of sight (5 tiles)
      if (distance <= 5) {
        const moveX = dx !== 0 ? Math.sign(dx) : 0;
        const moveY = dy !== 0 ? Math.sign(dy) : 0;
        
        const nextX = enemy.x + moveX;
        const nextY = enemy.y + (moveX === 0 ? moveY : 0);

        if (grid[nextY] && grid[nextY][nextX] === '.' && !(nextX === pX && nextY === pY)) {
          return { ...enemy, x: nextX, y: nextY };
        }
      }
      return enemy;
    });

    if (currentHp <= 0) {
      setGameState('DEFEAT');
    }

    setEnemies(updatedEnemies);
    setPlayerStats(prev => ({ ...prev, hp: currentHp }));
    if (nextLogs.length > 0) {
      setLog(prev => [...nextLogs, ...prev.slice(0, 4)]);
    }
  }, [playerStats.hp, playerStats.def, grid]);

  // --- COMBAT RESOLUTION (Melee Collision) ---
  const resolveCombat = (index: number) => {
    const updatedEnemies = [...enemies];
    const target = updatedEnemies[index];

    const playerDamage = Math.max(1, playerStats.atk - Math.floor(Math.random() * 4));
    target.hp -= playerDamage;
    let nextLog = [`You hit enemy for ${playerDamage} DMG.`];

    if (target.hp <= 0) {
      nextLog.unshift(`Enemy defeated!`);
      updatedEnemies.splice(index, 1);
    } else {
      const enemyDamage = Math.max(1, target.atk - playerStats.def);
      const newHp = Math.max(0, playerStats.hp - enemyDamage);
      playerStats.hp = newHp;
      nextLog.unshift(`Enemy strikes you for ${enemyDamage} DMG.`);

      if (newHp <= 0) {
        setGameState('DEFEAT');
      }
    }

    setEnemies(updatedEnemies);
    setPlayerStats({ ...playerStats });
    setLog(prev => [...nextLog, ...prev.slice(0, 4)]);
  };

  // --- TURN ENGINE & MOVEMENT ---
  const handleMove = (dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (grid[newY] && grid[newY][newX] === '#') return;

    const enemyIndex = enemies.findIndex(e => e.x === newX && e.y === newY);
    if (enemyIndex !== -1) {
      resolveCombat(enemyIndex);
      return;
    }

    if (grid[newY] && grid[newY][newX] === 'S') {
      if (currentLevel === TOTAL_LEVELS) {
        setGameState('VICTORY');
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setLog(prev => [`Descended to level ${nextLevel}. Danger grows.`, ...prev]);
        generateLevel(nextLevel, playerClass);
      }
      return;
    }

    setPlayerPosition({ x: newX, y: newY });
    processEnemyTurns(newX, newY, enemies);
  };

  // --- RANGED COMBAT RESOLUTION (Infinite range, visible trail) ---
  const handleRangedAttack = useCallback((targetEnemy: Enemy) => {
    if (gameState !== 'PLAYING') return;

    const weaponName = playerStats.class === 'Fighter' ? 'Throwing Axe' : playerStats.class === 'Rogue' ? 'Recurve Bow' : 'Magic Bolt';
    
    // Check Line of Sight
    if (!hasLineOfSight(playerPosition.x, playerPosition.y, targetEnemy.x, targetEnemy.y, grid)) {
      setLog(prev => [`Line of sight to enemy is blocked by a wall!`, ...prev.slice(0, 4)]);
      return;
    }

    const enemyIndex = enemies.findIndex(e => e.id === targetEnemy.id);
    if (enemyIndex === -1) return;

    const updatedEnemies = [...enemies];
    const target = updatedEnemies[enemyIndex];

    // Calculate damage based on class
    const damageModifier = playerStats.class === 'Fighter' ? 0.8 : playerStats.class === 'Rogue' ? 0.9 : 1.0;
    const playerDamage = Math.max(1, Math.floor(playerStats.atk * damageModifier) - Math.floor(Math.random() * 4));
    target.hp -= playerDamage;
    let nextLog = [`You fire ${weaponName} at enemy for ${playerDamage} DMG.`];

    if (target.hp <= 0) {
      nextLog.unshift(`Enemy defeated!`);
      updatedEnemies.splice(enemyIndex, 1);
    }

    // Set visible projectile path trail
    const path = getBresenhamPath(playerPosition.x, playerPosition.y, targetEnemy.x, targetEnemy.y);
    const color = playerStats.class === 'Mage' ? '#00e5ff' : playerStats.class === 'Rogue' ? '#00e676' : '#ff1744'; // blue, green, red
    setProjectilePath(path);
    setProjectileColor(color);

    // Clear visible path after short delay
    setTimeout(() => {
      setProjectilePath([]);
      setProjectileColor('');
    }, 200);

    setLog(prev => [...nextLog, ...prev.slice(0, 4)]);
    processEnemyTurns(playerPosition.x, playerPosition.y, updatedEnemies);
  }, [gameState, playerStats.class, playerStats.atk, playerPosition, grid, enemies, hasLineOfSight, getBresenhamPath, processEnemyTurns]);

  // --- AUTO TARGET NEAREST ---
  const fireAtNearest = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // Filter enemies in Line of Sight
    const validEnemies = enemies.filter(enemy => {
      return hasLineOfSight(playerPosition.x, playerPosition.y, enemy.x, enemy.y, grid);
    });

    if (validEnemies.length === 0) {
      setLog(prev => ["No targets in line of sight.", ...prev.slice(0, 4)]);
      return;
    }

    // Sort by distance (closest first)
    validEnemies.sort((a, b) => {
      const distA = Math.sqrt((a.x - playerPosition.x) ** 2 + (a.y - playerPosition.y) ** 2);
      const distB = Math.sqrt((b.x - playerPosition.x) ** 2 + (b.y - playerPosition.y) ** 2);
      return distA - distB;
    });

    handleRangedAttack(validEnemies[0]);
  }, [gameState, enemies, playerPosition, grid, hasLineOfSight, handleRangedAttack]);

  // --- CLICK INTERACTION ---
  const handleCellClick = (x: number, y: number) => {
    if (gameState !== 'PLAYING') return;
    const clickedEnemy = enemies.find(e => e.x === x && e.y === y);
    if (clickedEnemy) {
      handleRangedAttack(clickedEnemy);
    }
  };

  // Keyboard navigation mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;
      switch (e.key) {
        case 'ArrowUp':    case 'w': handleMove(0, -1); break;
        case 'ArrowDown':  case 's': handleMove(0, 1);  break;
        case 'ArrowLeft':  case 'a': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': handleMove(1, 0);  break;
        case 'f':          case ' ': e.preventDefault(); fireAtNearest(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, gameState, enemies, grid, playerStats, fireAtNearest]);

  // Weapon meta calculations
  const weaponName = playerStats.class === 'Fighter' ? 'Throwing Axe' : playerStats.class === 'Rogue' ? 'Recurve Bow' : 'Magic Bolt';

  return (
    <div style={styles.gameView}>
      <div style={styles.sidebar}>
        <div style={{ marginBottom: '15px' }}>
          <a href="/" style={styles.navLink}>
            ← Back to Home
          </a>
        </div>
        <h2>{playerStats.class}</h2>
        <p>Level: <strong>{currentLevel} / {TOTAL_LEVELS}</strong></p>
        <p>HP: <strong>{playerStats.hp} / {playerStats.maxHp}</strong></p>
        <p>ATK: <strong>{playerStats.atk}</strong> | DEF: <strong>{playerStats.def}</strong></p>
        <p>Weapon: <strong>{weaponName}</strong> (Range: ∞)</p>
        <hr style={{ borderColor: '#333' }} />
        <div style={styles.logBox}>
          {log.map((entry, idx) => <div key={idx} style={styles.logEntry}>{entry}</div>)}
        </div>
        <p style={styles.controlsHint}>Use Arrow keys or WASD to step/melee. Click an enemy or press Space/F to shoot.</p>
      </div>

      <div style={styles.gridContainer}>
        {grid.map((row, y) => (
          <div key={y} style={styles.row}>
            {row.map((cell, x) => {
              let glyph = cell;
              let color = '#444';
              let cursor = 'default';
              let bg = cell === '#' ? '#222' : '#0a0a0a';

              const inPath = projectilePath.some(p => p.x === x && p.y === y);

              if (x === playerPosition.x && y === playerPosition.y) {
                glyph = '@';
                color = '#00e5ff';
              } else {
                const hasEnemy = enemies.find(e => e.x === x && e.y === y);
                if (hasEnemy) {
                  glyph = 'E';
                  color = '#ff1744';
                  cursor = 'pointer';
                } else if (cell === 'S') {
                  color = '#ffea00';
                } else if (cell === '#') {
                  color = '#888';
                } else {
                  color = '#222';
                }

                // If this coordinate is in the firing path and doesn't contain an active enemy
                if (inPath && !hasEnemy) {
                  glyph = '*';
                  color = projectileColor;
                  bg = projectileColor + '22'; // hex transparency tint
                }
              }

              return (
                <div 
                  key={x} 
                  onClick={() => handleCellClick(x, y)}
                  style={{ ...styles.cell, color, cursor, backgroundColor: bg }}
                >
                  {glyph}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MINIMAL INLINE CSS-IN-JS ---
const styles = {
  container: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
    height: '100vh', backgroundColor: '#050505', color: '#fff', fontFamily: 'monospace'
  },
  title: { fontSize: '3rem', letterSpacing: '4px', margin: '0 0 10px 0' },
  subtitle: { fontSize: '1.2rem', color: '#aaa', marginBottom: '30px', textAlign: 'center' as const },
  selectionZone: { display: 'flex', gap: '20px' },
  btn: {
    padding: '15px 25px', fontSize: '1rem', backgroundColor: '#111', color: '#fff',
    border: '1px solid #444', cursor: 'pointer', fontFamily: 'monospace', borderRadius: '4px'
  },
  gameView: {
    display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'monospace'
  },
  sidebar: {
    width: '300px', padding: '20px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' as const
  },
  gridContainer: {
    flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020202'
  },
  row: { display: 'flex' },
  cell: {
    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 'bold' as const, border: '1px solid #111', transition: 'background-color 0.1s ease'
  },
  logBox: { flex: 1, overflowY: 'auto' as const, fontSize: '13px', color: '#ccc' },
  logEntry: { marginBottom: '8px', borderBottom: '1px solid #151515', paddingBottom: '4px' },
  controlsHint: { fontSize: '11px', color: '#666', marginTop: 'auto' },
  backLinkAbsolute: { position: 'absolute' as const, top: '20px', left: '20px' },
  navLink: { color: '#00e5ff', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const }
};
