import React, { useState, useEffect, useCallback } from 'react';

// --- GAME CONFIG & CONSTANTS ---
const GRID_SIZE = 15;
const TOTAL_LEVELS = 5;

type CharacterClass = 'Mage' | 'Fighter' | 'Rogue' | 'Rene' | 'Sandro' | 'Bebia';
type GameState = 'START' | 'SELECT_CHARACTER' | 'PLAYING' | 'VICTORY' | 'DEFEAT';
type Language = 'en' | 'ka';

const TRANSLATIONS = {
  en: {
    backToHome: '← Back to Home',
    title: 'VAULT RUNNER',
    subtitle: 'Select your operative. Reach Level 5 to escape.',
    fighter: 'Fighter',
    mage: 'Mage',
    rogue: 'Rogue',
    rene: 'რენე (Rene)',
    sandro: 'სანდრო (Sandro)',
    bebia: 'ბებია (Bebia)',
    congrats: 'CONGRATULATIONS',
    victoryDesc: 'You successfully ran the Vault and survived with your life.',
    goldCollected: 'Gold Pieces Collected',
    monstersKilled: 'Monsters Defeated',
    finalScore: 'Final Score',
    runAgain: 'Run Again',
    youDied: 'YOU DIED',
    deathDesc: '"Your death has been recorded as another victory for the Vault"',
    levelReached: 'Level Reached',
    tryAgain: 'Try Again',
    level: 'Level',
    hp: 'HP',
    atk: 'ATK',
    def: 'DEF',
    weapon: 'Weapon',
    range: 'Range',
    score: 'Score',
    goldPieces: 'Gold Pieces',
    monstersKilledSidebar: 'Monsters Killed',
    restartGame: 'Restart',
    restartGameSidebar: 'Restart Game',
    controlsHint: 'Use Arrow keys or WASD to step/melee. Click an enemy or press Space/F to shoot. Press B/G for Bebia Ultimate.',
    moveStick: 'MOVE STICK',
    fire: 'FIRE',
    shootNearest: 'SHOOT NEAREST',
    bebiaUltimate: '🇬🇪 Bebia Ultimate',
    bebiaActive: '🔥 Georgia Fire!',
    // Logs
    welcomeLog: 'Welcome to the Vault. Find the stairs (S) to descend.',
    enterLog: 'You enter the cold depths of the Vault.',
    ambushLog: (dmg: number) => `An enemy ambushes you for ${dmg} DMG!`,
    hitLog: (dmg: number) => `You hit enemy for ${dmg} DMG.`,
    enemyDefeatedLog: 'Enemy defeated! (+20 pts)',
    enemyStrikeLog: (dmg: number) => `Enemy strikes you for ${dmg} DMG.`,
    goldCollectedLog: 'You collected a gold piece! (+10 pts)',
    descendLog: (lvl: number) => `Descended to level ${lvl}. Danger grows.`,
    losBlockedLog: 'Line of sight to enemy is blocked by a wall!',
    fireWeaponLog: (weapon: string, dmg: number) => `You fire ${weapon} at enemy for ${dmg} DMG.`,
    noTargetsLog: 'No targets in line of sight.',
    // Weapons
    throwingAxe: 'Throwing Axe',
    recurveBow: 'Recurve Bow',
    georgianSaber: 'Georgian Saber',
    khevsurianSword: 'Khevsurian Sword',
    khachapuri: 'Khachapuri',
    magicBolt: 'Magic Bolt',
    infinity: '∞'
  },
  ka: {
    backToHome: '← მთავარზე დაბრუნება',
    title: 'ვაულტ რანერი',
    subtitle: 'აირჩიეთ თქვენი ოპერატივი. გასაქცევად მიაღწიეთ მე-5 დონეს.',
    fighter: 'სოფო (Sopo)',
    mage: 'ქრისტინე (Christine)',
    rogue: 'ირინკა (Irinka)',
    rene: 'რენე (Rene)',
    sandro: 'სანდრო (Sandro)',
    bebia: 'ბებია (Bebia)',
    congrats: 'გილოცავთ',
    victoryDesc: 'თქვენ წარმატებით გაიარეთ ვაულტი და გადარჩით.',
    goldCollected: 'შეგროვებული ოქრო',
    monstersKilled: 'დამარცხებული მონსტრები',
    finalScore: 'საბოლოო ქულა',
    runAgain: 'თავიდან დაწყება',
    youDied: 'თქვენ გარდაიცვალეთ',
    deathDesc: '"თქვენი სიკვდილი ჩაიწერა როგორც ვაულტის კიდევ ერთი გამარჯვება"',
    levelReached: 'მიღწეული დონე',
    tryAgain: 'კიდევ სცადეთ',
    level: 'დონე',
    hp: 'სიცოცხლე (HP)',
    atk: 'თავდასხმა (ATK)',
    def: 'დაცვა (DEF)',
    weapon: 'იარაღი',
    range: 'მანძილი',
    score: 'ქულა',
    goldPieces: 'ოქროს მონეტები',
    monstersKilledSidebar: 'მოკლული მონსტრები',
    restartGame: 'გადატვირთვა',
    restartGameSidebar: 'თამაშის გადატვირთვა',
    controlsHint: 'გამოიყენეთ ისრები ან WASD გადასაადგილებლად. ესროლეთ მონსტრებს Space/F ღილაკით. ბებიას ძალისთვის დააჭირეთ B/G-ს.',
    moveStick: 'მართვის ჯოხი',
    fire: 'სროლა',
    shootNearest: 'უახლოესის სროლა',
    bebiaUltimate: '🇬🇪 ბებიას ძალა',
    bebiaActive: '🔥 ქართული ცეცხლი!',
    // Logs
    welcomeLog: 'კეთილი იყოს თქვენი მობრძანება ვაულტში. ჩასასვლელად იპოვეთ კიბე (S).',
    enterLog: 'თქვენ შედიხართ ვაულტის ცივ სიღრმეებში.',
    ambushLog: (dmg: number) => `მტერმა მოულოდნელად დაგარტყათ და მოგაყენათ ${dmg} ზიანი!`,
    hitLog: (dmg: number) => `თქვენ დაარტყით მტერს ${dmg} ზიანით.`,
    enemyDefeatedLog: 'მტერი დამარცხებულია! (+20 ქულა)',
    enemyStrikeLog: (dmg: number) => `მტერმა დაგარტყათ და მოგაყენათ ${dmg} ზიანი.`,
    goldCollectedLog: 'თქვენ შეაგროვეთ ოქრო! (+10 ქულა)',
    descendLog: (lvl: number) => `ჩახვედით მე-${lvl} დონეზე. საფრთხე იზრდება.`,
    losBlockedLog: 'ხედვის არე მტერთან დაბლოკილია კედლით!',
    fireWeaponLog: (weapon: string, dmg: number) => `თქვენ ესროლეთ ${weapon} მტერს ${dmg} ზიანით.`,
    noTargetsLog: 'ხედვის არეში მტერი არ არის.',
    // Weapons
    throwingAxe: 'სატყორცნი ცული',
    recurveBow: 'მშვილდი',
    georgianSaber: 'ქართული ხმალი',
    khevsurianSword: 'ხევსურული ფარი-ხმალი',
    khachapuri: 'ხაჭაპური',
    magicBolt: 'მაგიური ნაკადი',
    infinity: '∞'
  }
};

const getWeaponName = (charClass: CharacterClass, lang: Language) => {
  const t = TRANSLATIONS[lang];
  switch (charClass) {
    case 'Fighter': return t.throwingAxe;
    case 'Rogue': return t.recurveBow;
    case 'Rene': return t.georgianSaber;
    case 'Sandro': return t.khevsurianSword;
    case 'Bebia': return t.khachapuri;
    default: return t.magicBolt;
  }
};

const getClassName = (cls: CharacterClass, lang: Language) => {
  const t = TRANSLATIONS[lang];
  switch (cls) {
    case 'Fighter': return t.fighter;
    case 'Mage': return t.mage;
    case 'Rogue': return t.rogue;
    case 'Rene': return t.rene;
    case 'Sandro': return t.sandro;
    case 'Bebia': return t.bebia;
    default: return cls;
  }
};

const getClassEmoji = (cls: CharacterClass) => {
  switch (cls) {
    case 'Fighter': return '👑';
    case 'Mage': return '📖';
    case 'Rogue': return '📸';
    case 'Rene': return '🦊';
    case 'Sandro': return '🛡️';
    case 'Bebia': return '🇬🇪';
    default: return '';
  }
};

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

const getEnemyGlyph = (lvl: number, id: string) => {
  const levelIcons: Record<number, string> = {
    1: '🏛️', // Roman Column (Antiquity, Pompey's campaign in 65 BC)
    2: '🦁', // Persian Lion (Late Antiquity / Safavid Empire 3rd-18th c.)
    3: '🐴', // Horse Face (Medieval nomadic cavalry, Seljuks/Mongols 11th-13th c.)
    4: '🪆', // Nesting Doll (Modern annexation and Soviet era 19th-20th c.)
  };
  if (lvl >= 1 && lvl <= 4) {
    return levelIcons[lvl] || 'E';
  }
  const allIcons = ['🏛️', '🦁', '🐴', '🪆'];
  const parts = id.split('-');
  const idx = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  const finalIndex = isNaN(idx) ? 0 : idx;
  return allIcons[finalIndex % allIcons.length];
};

const getLevelObjective = (lvl: number, lang: Language) => {
  const objectives = {
    en: {
      1: "Defend against the Roman invaders to advance.",
      2: "Defend against the Persian invaders to advance.",
      3: "Defend against the Mongolian invaders to advance.",
      4: "Defend against the Russian invaders to advance.",
      5: "Defeat all the invaders to escape the dungeon!"
    },
    ka: {
      1: "გაუძელით რომაელ დამპყრობლებს წინსვლისთვის.",
      2: "გაუძელით სპარსელ დამპყრობლებს წინსვლისთვის.",
      3: "გაუძელით მონღოლ დამპყრობლებს წინსვლისთვის.",
      4: "გაუძელით რუს დამპყრობლებს წინსვლისთვის.",
      5: "დაამარცხეთ ყველა დამპყრობელი დუნჯიდან გასაქცევად!"
    }
  };
  return objectives[lang][lvl as 1|2|3|4|5] || objectives[lang][5];
};

// --- CLASS BALANCING ---
const CLASS_PRESETS: Record<CharacterClass, Omit<PlayerStats, 'class'>> = {
  Fighter: { hp: 120, maxHp: 120, atk: 15, def: 5 },  // High mitigation, steady damage
  Mage:    { hp: 80,  maxHp: 80,  atk: 25, def: 2 },  // Glass cannon, high offense variance
  Rogue:   { hp: 100, maxHp: 100, atk: 18, def: 3 },  // Balanced skirmisher
  Rene:    { hp: 90,  maxHp: 90,  atk: 22, def: 4 },  // Custom preset for Rene (Girl)
  Sandro:  { hp: 110, maxHp: 110, atk: 16, def: 4 },  // Custom preset for Sandro (Boy)
  Bebia:   { hp: 100, maxHp: 100, atk: 999, def: 5 }, // Turns monsters to gold in one shot!
};

export default function VaultRunner() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [playerClass, setPlayerClass] = useState<CharacterClass>('Fighter');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ class: 'Fighter', ...CLASS_PRESETS.Fighter });
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 1, y: 1 });
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [grid, setGrid] = useState<string[][]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const enemiesRef = React.useRef<Enemy[]>(enemies);
  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);
  const [lang, setLang] = useState<Language>('en');
  const [log, setLog] = useState<string[]>([]);
  const [goldCollected, setGoldCollected] = useState<number>(0);
  const [monstersKilled, setMonstersKilled] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (gameState === 'START' || gameState === 'SELECT_CHARACTER') {
      setLog([TRANSLATIONS[lang].welcomeLog]);
    }
  }, [lang, gameState]);
  
  // --- PROJECTILE VISUALS STATE ---
  const [projectilePath, setProjectilePath] = useState<Position[]>([]);
  const [projectileColor, setProjectileColor] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [explosionPositions, setExplosionPositions] = useState<Position[]>([]);

  const [isBebiaActive, setIsBebiaActive] = useState<boolean>(false);
  const [ultimatePhase, setUltimatePhase] = useState<'NONE' | 'FRIGHTENED' | 'CHASING' | 'FLAG'>('NONE');
  const [bebiaRunnerPos, setBebiaRunnerPos] = useState<Position | null>(null);
  const audioBebiaUltimateRef = React.useRef<HTMLAudioElement | null>(null);
  const audioSopoWinsRef = React.useRef<HTMLAudioElement | null>(null);
  const [isSopoAudioPlaying, setIsSopoAudioPlaying] = useState<boolean>(false);

  const voiceToggleRef = React.useRef<boolean>(false);
  const audioGeorgiaRef = React.useRef<HTMLAudioElement | null>(null);
  const audioKhachapuriRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioGeorgiaRef.current = new Audio('/audio/bebia_georgia.mp3');
      audioGeorgiaRef.current.load();
      audioKhachapuriRef.current = new Audio('/audio/bebia_khachapuri.mp3');
      audioKhachapuriRef.current.load();
      audioBebiaUltimateRef.current = new Audio('/audio/khachapuri_fire.mp3');
      audioBebiaUltimateRef.current.load();
      audioSopoWinsRef.current = new Audio('/audio/Sopo_Wins.mp3');
      audioSopoWinsRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (gameState === 'VICTORY' && playerClass === 'Fighter') {
      if (audioSopoWinsRef.current) {
        audioSopoWinsRef.current.currentTime = 0;
        audioSopoWinsRef.current.play()
          .then(() => setIsSopoAudioPlaying(true))
          .catch(err => {
            console.error('Failed to play Sopo victory audio:', err);
          });
        audioSopoWinsRef.current.onended = () => {
          setIsSopoAudioPlaying(false);
        };
      }
    } else {
      if (audioSopoWinsRef.current) {
        audioSopoWinsRef.current.pause();
        audioSopoWinsRef.current.currentTime = 0;
        setIsSopoAudioPlaying(false);
      }
    }
  }, [gameState, playerClass]);

  const toggleSopoWinsAudio = () => {
    if (audioSopoWinsRef.current) {
      if (isSopoAudioPlaying) {
        audioSopoWinsRef.current.pause();
        setIsSopoAudioPlaying(false);
      } else {
        audioSopoWinsRef.current.currentTime = 0;
        audioSopoWinsRef.current.play()
          .then(() => setIsSopoAudioPlaying(true))
          .catch(err => console.error('Failed to play victory audio:', err));
        
        audioSopoWinsRef.current.onended = () => {
          setIsSopoAudioPlaying(false);
        };
      }
    }
  };

  const playLaserSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Web Audio failed", e);
    }
  }, []);

  const playBebiaVoice = useCallback(() => {
    const isGeorgia = voiceToggleRef.current;
    voiceToggleRef.current = !voiceToggleRef.current;
    
    // Add to game log so it is visual
    const displayPhrase = isGeorgia ? 'საქართველოსთვის!' : 'ხაჭაპური, ცეცხლი!';
    setLog(prev => [`Bebia: "${displayPhrase}"`, ...prev.slice(0, 4)]);

    try {
      const audio = isGeorgia ? audioGeorgiaRef.current : audioKhachapuriRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn("Failed to play audio file:", e));
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }, []);

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
      if ((curX !== x1 || curY !== y1) && (curX !== x2 || curY !== y2)) {
        if (currentGrid[curY] && currentGrid[curY][curX] === '#') {
          return false;
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

  // --- GET BRESENHAM LINE PATH ---
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

  const triggerBebiaUltimate = useCallback(() => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;
    if (enemies.length === 0) {
      setLog(prev => [lang === 'en' ? "No enemies to destroy!" : "დასამარცხებელი მტერი არ არის!", ...prev.slice(0, 4)]);
      return;
    }

    setIsBebiaActive(true);
    setUltimatePhase('FRIGHTENED');
    setLog(prev => [lang === 'en' ? "🔥 Bebia Ultimate Activated! 🇬🇪" : "🔥 ბებიას ძალა გააქტიურებულია! 🇬🇪", ...prev.slice(0, 4)]);
    setLog(prev => [lang === 'en' ? "😱 Monsters are terrified! They run frantically!" : "😱 მონსტრები შეშინდნენ! ისინი გიჟივით დარბიან!", ...prev.slice(0, 4)]);

    try {
      if (audioBebiaUltimateRef.current) {
        audioBebiaUltimateRef.current.currentTime = 0;
        audioBebiaUltimateRef.current.play().catch(e => console.warn("Failed to play Bebia ultimate sound:", e));
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }

    // Start frantic random movement interval
    const intervalId = setInterval(() => {
      setEnemies(prevEnemies => 
        prevEnemies.map(e => {
          const dirs = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
          ];
          const shuffled = dirs.sort(() => Math.random() - 0.5);
          for (const d of shuffled) {
            const nx = e.x + d.dx;
            const ny = e.y + d.dy;
            if (grid[ny] && grid[ny][nx] !== '#' && !(nx === playerPosition.x && ny === playerPosition.y)) {
              return { ...e, x: nx, y: ny };
            }
          }
          return e;
        })
      );
    }, 150);

    // After 1.8 seconds of frantic running, proceed to the Georgian flag chasing/explosion phase
    setTimeout(() => {
      clearInterval(intervalId);

      const currentEnemies = enemiesRef.current;
      if (currentEnemies.length === 0) {
        setIsBebiaActive(false);
        setUltimatePhase('NONE');
        return;
      }

      setUltimatePhase('CHASING');

      // Sort targets using nearest neighbor starting from playerPosition
      let currentLoc = { ...playerPosition };
      const orderedTargets: Enemy[] = [];
      const remainingTargets = [...currentEnemies];
      while (remainingTargets.length > 0) {
        let closestIdx = 0;
        let minDistance = Infinity;
        for (let i = 0; i < remainingTargets.length; i++) {
          const t = remainingTargets[i];
          const dist = Math.abs(t.x - currentLoc.x) + Math.abs(t.y - currentLoc.y);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }
        const closest = remainingTargets.splice(closestIdx, 1)[0];
        orderedTargets.push(closest);
        currentLoc = { x: closest.x, y: closest.y };
      }

      // Build step-by-step path visiting all enemies
      let pathSteps: Position[] = [];
      let lastPos = { ...playerPosition };
      orderedTargets.forEach(target => {
        const segment = getBresenhamPath(lastPos.x, lastPos.y, target.x, target.y);
        pathSteps = [...pathSteps, ...segment, { x: target.x, y: target.y }];
        lastPos = { x: target.x, y: target.y };
      });

      let currentStepIndex = 0;
      setBebiaRunnerPos(playerPosition);
      let remainingEnemies = [...currentEnemies];

      const stepInterval = setInterval(() => {
        if (currentStepIndex >= pathSteps.length) {
          clearInterval(stepInterval);
          setBebiaRunnerPos(null);
          setUltimatePhase('FLAG');

          // Flag cover phase runs for 2 seconds, then ultimate ends
          setTimeout(() => {
            setIsBebiaActive(false);
            setUltimatePhase('NONE');
            setLog(prev => [lang === 'en' ? "✨ Golden dust settles. Gold spawned where enemies fell!" : "✨ ოქრო გაჩნდა იქ, სადაც მტრები დაეცნენ!", ...prev.slice(0, 4)]);
          }, 2000);
          return;
        }

        const nextPos = pathSteps[currentStepIndex];
        setBebiaRunnerPos(nextPos);

        const hitEnemyIdx = remainingEnemies.findIndex(e => e.x === nextPos.x && e.y === nextPos.y);
        if (hitEnemyIdx !== -1) {
          const enemy = remainingEnemies[hitEnemyIdx];
          remainingEnemies.splice(hitEnemyIdx, 1);

          // Trigger explosion
          setExplosionPositions(prev => [...prev, { x: enemy.x, y: enemy.y }]);
          setTimeout(() => {
            setExplosionPositions(prev => prev.filter(pos => !(pos.x === enemy.x && pos.y === enemy.y)));
          }, 250);

          // Change cell to gold
          setGrid(prevGrid => {
            const newGrid = prevGrid.map((row, y) =>
              row.map((cell, x) => (x === enemy.x && y === enemy.y ? 'G' : cell))
            );
            return newGrid;
          });

          // Play audio voice
          playBebiaVoice();

          // Update game score/kills and logs
          setMonstersKilled(prev => prev + 1);
          setScore(prev => prev + 20);
          setLog(prev => [lang === 'en' ? "💥 Exploded enemy into gold!" : "💥 მტერი ოქროდ იქცა!", ...prev.slice(0, 4)]);

          // Remove enemy from state
          setEnemies(prev => prev.filter(e => e.id !== enemy.id));
        }

        currentStepIndex++;
      }, 180);
    }, 2800);
  }, [gameState, isAnimating, isBebiaActive, enemies, lang, grid, playerPosition, getBresenhamPath, playBebiaVoice]);



  // --- BFS PATHFINDING VALIDATION ---
  const hasValidPath = useCallback((testGrid: string[][], startX: number, startY: number, targetX: number, targetY: number) => {
    const visited = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    const queue: Position[] = [{ x: startX, y: startY }];
    visited[startY][startX] = true;

    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.x === targetX && curr.y === targetY) return true;

      for (const d of dirs) {
        const nx = curr.x + d.x;
        const ny = curr.y + d.y;

        if (
          nx >= 0 && nx < GRID_SIZE &&
          ny >= 0 && ny < GRID_SIZE &&
          !visited[ny][nx] &&
          testGrid[ny][nx] !== '#'
        ) {
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny });
        }
      }
    }

    return false;
  }, []);

  // --- PROCEDURAL LEVEL GENERATION ---
  const generateLevel = useCallback((level: number, pClass: CharacterClass) => {
    let newGrid: string[][] = [];
    let exitX = GRID_SIZE - 2;
    let exitY = GRID_SIZE - 2;
    let validLayout = false;
    let layoutAttempts = 0;

    while (!validLayout && layoutAttempts < 200) {
      layoutAttempts++;
      newGrid = Array(GRID_SIZE).fill(null).map((_, y) =>
        Array(GRID_SIZE).fill(null).map((_, x) =>
          x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1 ? '#' : '.'
        )
      );

      for (let i = 0; i < 28; i++) {
        const rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        const ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        if (rx !== 1 || ry !== 1) {
          newGrid[ry][rx] = '#';
        }
      }

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

      if (hasValidPath(newGrid, 1, 1, exitX, exitY)) {
        validLayout = true;
      }
    }

    const enemyCount = 3 + level;
    const newEnemies: Enemy[] = [];
    for (let i = 0; i < enemyCount; i++) {
      let ex, ey;
      let eAttempts = 0;
      do {
        ex = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        ey = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        eAttempts++;
      } while (
        (newGrid[ey][ex] !== '.' ||
          (ex === 1 && ey === 1) ||
          (ex === exitX && ey === exitY) ||
          !hasValidPath(newGrid, 1, 1, ex, ey)) &&
        eAttempts < 100
      );

      newEnemies.push({
        id: `${level}-${i}`,
        x: ex,
        y: ey,
        hp: 20 + level * 8,
        atk: 6 + level * 2,
      });
    }

    // Spawn gold pieces
    const goldCount = 4 + level;
    for (let i = 0; i < goldCount; i++) {
      let gx, gy;
      let gAttempts = 0;
      do {
        gx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        gy = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        gAttempts++;
      } while (
        (newGrid[gy][gx] !== '.' ||
          (gx === 1 && gy === 1) ||
          (gx === exitX && gy === exitY) ||
          !hasValidPath(newGrid, 1, 1, gx, gy)) &&
        gAttempts < 100
      );
      if (newGrid[gy][gx] === '.') {
        newGrid[gy][gx] = 'G';
      }
    }

    setGrid(newGrid);
    setEnemies(newEnemies);
    setPlayerPosition({ x: 1, y: 1 });
  }, [hasValidPath]);

  // --- START GAME ---
  const startGame = (selectedClass: CharacterClass) => {
    setPlayerClass(selectedClass);
    setPlayerStats({ class: selectedClass, ...CLASS_PRESETS[selectedClass] });
    setCurrentLevel(1);
    setGoldCollected(0);
    setMonstersKilled(0);
    setScore(0);
    setLog([TRANSLATIONS[lang].enterLog]);
    setGameState('PLAYING');
    generateLevel(1, selectedClass);
  };

  // --- ENEMY AI TURN ---
  const processEnemyTurns = useCallback((pX: number, pY: number, currentEnemiesList: Enemy[]) => {
    let currentHp = playerStats.hp;
    const nextLogs: string[] = [];
    const currentT = TRANSLATIONS[lang];

    const updatedEnemies = currentEnemiesList.map(enemy => {
      const dx = pX - enemy.x;
      const dy = pY - enemy.y;
      const distance = Math.abs(dx) + Math.abs(dy);

      // 1. Melee attack if adjacent
      if (distance === 1) {
        const dmg = Math.max(1, enemy.atk - playerStats.def);
        currentHp = Math.max(0, currentHp - dmg);
        nextLogs.push(currentT.ambushLog(dmg));
        return enemy;
      }

      // 2. Chase player if within range
      if (distance <= 5) {
        const moveX = dx !== 0 ? Math.sign(dx) : 0;
        const moveY = dy !== 0 ? Math.sign(dy) : 0;
        
        const nextX = enemy.x + moveX;
        const nextY = enemy.y + (moveX === 0 ? moveY : 0);

        const occupied = currentEnemiesList.some(e => e.id !== enemy.id && e.x === nextX && e.y === nextY);

        if (grid[nextY] && (grid[nextY][nextX] === '.' || grid[nextY][nextX] === 'S' || grid[nextY][nextX] === 'G') && !(nextX === pX && nextY === pY) && !occupied) {
          return { ...enemy, x: nextX, y: nextY };
        }
      }

      // 3. Roam randomly if out of range or blocked
      const possibleDirs = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 }
      ];

      const shuffled = [...possibleDirs].sort(() => Math.random() - 0.5);

      for (const d of shuffled) {
        if (d.x === 0 && d.y === 0) break;

        const roamX = enemy.x + d.x;
        const roamY = enemy.y + d.y;

        const occupied = currentEnemiesList.some(e => e.id !== enemy.id && e.x === roamX && e.y === roamY);

        if (
          grid[roamY] &&
          (grid[roamY][roamX] === '.' || grid[roamY][roamX] === 'S' || grid[roamY][roamX] === 'G') &&
          !(roamX === pX && roamY === pY) &&
          !occupied
        ) {
          return { ...enemy, x: roamX, y: roamY };
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
  }, [playerStats.hp, playerStats.def, grid, lang]);

  // --- COMBAT RESOLUTION (Melee Collision) ---
  const resolveCombat = (index: number) => {
    const updatedEnemies = [...enemies];
    const target = updatedEnemies[index];

    const playerDamage = Math.max(1, playerStats.atk - Math.floor(Math.random() * 4));
    target.hp -= playerDamage;
    let nextLog = [t.hitLog(playerDamage)];

    if (target.hp <= 0) {
      nextLog.unshift(t.enemyDefeatedLog);
      updatedEnemies.splice(index, 1);
      setMonstersKilled(prev => prev + 1);
      setScore(prev => prev + 20);

      // Bebia turns monsters to gold!
      if (playerStats.class === 'Bebia') {
        setGrid(prevGrid => prevGrid.map((row, y) =>
          row.map((cell, x) => (x === target.x && y === target.y ? 'G' : cell))
        ));
      }
    } else {
      const enemyDamage = Math.max(1, target.atk - playerStats.def);
      const newHp = Math.max(0, playerStats.hp - enemyDamage);
      playerStats.hp = newHp;
      nextLog.unshift(t.enemyStrikeLog(enemyDamage));

      if (newHp <= 0) {
        setGameState('DEFEAT');
      }
    }

    setEnemies(updatedEnemies);
    setPlayerStats({ ...playerStats });
    setLog(prev => [...nextLog, ...prev.slice(0, 4)]);
  };

  // --- TURN ENGINE & MOVEMENT ---
  const [isAnimatingStateDummy, setIsAnimatingStateDummy] = useState<boolean>(false); // dummy to help avoid replace mismatches
  const handleMove = (dx: number, dy: number) => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;

    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (grid[newY] && grid[newY][newX] === '#') return;

    const enemyIndex = enemies.findIndex(e => e.x === newX && e.y === newY);
    if (enemyIndex !== -1) {
      resolveCombat(enemyIndex);
      return;
    }

    let nextGrid = grid;
    if (grid[newY] && grid[newY][newX] === 'G') {
      setGoldCollected(prev => prev + 1);
      setScore(prev => prev + 10);
      setLog(prev => [t.goldCollectedLog, ...prev.slice(0, 4)]);
      nextGrid = grid.map((row, y) =>
        row.map((cell, x) => (x === newX && y === newY ? '.' : cell))
      );
      setGrid(nextGrid);
    }

    if (nextGrid[newY] && nextGrid[newY][newX] === 'S') {
      if (currentLevel === TOTAL_LEVELS) {
        setGameState('VICTORY');
      } else {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setLog(prev => [t.descendLog(nextLevel), ...prev]);
        generateLevel(nextLevel, playerClass);
      }
      return;
    }

    setPlayerPosition({ x: newX, y: newY });
    processEnemyTurns(newX, newY, enemies);
  };

  // --- RANGED COMBAT RESOLUTION ---
  const handleRangedAttack = useCallback((targetEnemy: Enemy) => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;

    if (!hasLineOfSight(playerPosition.x, playerPosition.y, targetEnemy.x, targetEnemy.y, grid)) {
      setLog(prev => [t.losBlockedLog, ...prev.slice(0, 4)]);
      return;
    }

    const enemyIndex = enemies.findIndex(e => e.id === targetEnemy.id);
    if (enemyIndex === -1) return;

    const path = getBresenhamPath(playerPosition.x, playerPosition.y, targetEnemy.x, targetEnemy.y);
    if (path.length === 0) return;

    setIsAnimating(true);
    playLaserSound();

    const isBebia = playerStats.class === 'Bebia';
    if (isBebia) {
      playBebiaVoice();
    }
    const speed = isBebia ? 150 : 60; // Slower speed for Bebia's kachapuri

    const color = playerStats.class === 'Mage'
      ? '#00e5ff'
      : playerStats.class === 'Rogue'
      ? '#00e676'
      : playerStats.class === 'Rene'
      ? '#e040fb'
      : playerStats.class === 'Sandro'
      ? '#ffeb3b'
      : playerStats.class === 'Bebia'
      ? '#ffd700'
      : '#ff1744';

    setProjectileColor(color);
    let step = 0;
    const animate = () => {
      if (step < path.length) {
        setProjectilePath([path[step]]);
        step++;
        setTimeout(animate, speed);
      } else {
        setProjectilePath([]);
        setExplosionPositions([{ x: targetEnemy.x, y: targetEnemy.y }]);

        setTimeout(() => {
          setExplosionPositions([]);

          const latestEnemiesList = [...enemies];
          const currEnemyIndex = latestEnemiesList.findIndex(e => e.id === targetEnemy.id);
          if (currEnemyIndex !== -1) {
            const target = latestEnemiesList[currEnemyIndex];

            const damageModifier = playerStats.class === 'Fighter'
              ? 0.8
              : playerStats.class === 'Rogue'
              ? 0.9
              : playerStats.class === 'Rene'
              ? 1.0
              : playerStats.class === 'Sandro'
              ? 0.85
              : 1.0;
            const baseDamage = playerStats.class === 'Bebia' ? 999 : playerStats.atk;
            const playerDamage = Math.max(1, Math.floor(baseDamage * damageModifier) - Math.floor(Math.random() * 4));
            target.hp -= playerDamage;
            const currentWeaponName = getWeaponName(playerStats.class, lang);
            let nextLog = [t.fireWeaponLog(currentWeaponName, playerDamage)];

            if (target.hp <= 0) {
              nextLog.unshift(t.enemyDefeatedLog);
              latestEnemiesList.splice(currEnemyIndex, 1);
              setMonstersKilled(prev => prev + 1);
              setScore(prev => prev + 20);

              // Bebia turns monsters to gold!
              if (playerStats.class === 'Bebia') {
                setGrid(prevGrid => prevGrid.map((row, y) =>
                  row.map((cell, x) => (x === target.x && y === target.y ? 'G' : cell))
                ));
              }
            }

            setEnemies(latestEnemiesList);
            setLog(prev => [...nextLog, ...prev.slice(0, 4)]);
            processEnemyTurns(playerPosition.x, playerPosition.y, latestEnemiesList);
          }

          setIsAnimating(false);
          setProjectileColor('');
        }, 150);
      }
    };
    animate();
  }, [gameState, playerStats.class, playerStats.atk, playerPosition, grid, enemies, hasLineOfSight, getBresenhamPath, processEnemyTurns, lang, isAnimating, playLaserSound, playBebiaVoice]);

  // --- AUTO TARGET NEAREST ---
  const fireAtNearest = useCallback(() => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;

    const validEnemies = enemies.filter(enemy => {
      return hasLineOfSight(playerPosition.x, playerPosition.y, enemy.x, enemy.y, grid);
    });

    if (validEnemies.length === 0) {
      setLog(prev => [t.noTargetsLog, ...prev.slice(0, 4)]);
      return;
    }

    if (playerStats.class === 'Bebia') {
      setIsAnimating(true);
      playLaserSound();
      playBebiaVoice();

      const paths = validEnemies.map(enemy => 
        getBresenhamPath(playerPosition.x, playerPosition.y, enemy.x, enemy.y)
      );
      
      const maxSteps = Math.max(...paths.map(p => p.length), 0);
      setProjectileColor('#ffd700');

      let step = 0;
      const speed = 150; // Slower speed for Bebia's kachapuri

      const animate = () => {
        if (step < maxSteps) {
          const activeCells = paths
            .map(p => p[step])
            .filter(cell => cell !== undefined);
          setProjectilePath(activeCells);
          step++;
          setTimeout(animate, speed);
        } else {
          setProjectilePath([]);
          
          const targets = validEnemies.map(enemy => ({ x: enemy.x, y: enemy.y }));
          setExplosionPositions(targets);

          setTimeout(() => {
            setExplosionPositions([]);

            const updatedEnemies = [...enemies];
            const nextLogEntries: string[] = [];
            let currentGrid = grid;

            validEnemies.forEach(enemy => {
              const enemyIndex = updatedEnemies.findIndex(e => e.id === enemy.id);
              if (enemyIndex === -1) return;

              const target = updatedEnemies[enemyIndex];
              const ex = target.x;
              const ey = target.y;

              // Turn to gold
              currentGrid = currentGrid.map((row, y) =>
                row.map((cell, x) => (x === ex && y === ey ? 'G' : cell))
              );

              nextLogEntries.push(t.fireWeaponLog(getWeaponName('Bebia', lang), 999));
              nextLogEntries.push(t.enemyDefeatedLog);

              updatedEnemies.splice(enemyIndex, 1);
              setMonstersKilled(prev => prev + 1);
              setScore(prev => prev + 20);
            });

            setGrid(currentGrid);
            setEnemies(updatedEnemies);
            setLog(prev => [...nextLogEntries, ...prev.slice(0, 4)]);
            processEnemyTurns(playerPosition.x, playerPosition.y, updatedEnemies);

            setIsAnimating(false);
            setProjectileColor('');
          }, 150);
        }
      };
      animate();
      return;
    }

    validEnemies.sort((a, b) => {
      const distA = Math.sqrt((a.x - playerPosition.x) ** 2 + (a.y - playerPosition.y) ** 2);
      const distB = Math.sqrt((b.x - playerPosition.x) ** 2 + (b.y - playerPosition.y) ** 2);
      return distA - distB;
    });

    handleRangedAttack(validEnemies[0]);
  }, [gameState, enemies, playerPosition, grid, hasLineOfSight, handleRangedAttack, lang, playerStats.class, getBresenhamPath, processEnemyTurns, isAnimating, playLaserSound, playBebiaVoice]);

  // --- CLICK INTERACTION ---
  const handleCellClick = (x: number, y: number) => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;
    const clickedEnemy = enemies.find(e => e.x === x && e.y === y);
    if (clickedEnemy) {
      handleRangedAttack(clickedEnemy);
    }
  };

  // Keyboard navigation mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;
      switch (e.key) {
        case 'ArrowUp':    case 'w': handleMove(0, -1); break;
        case 'ArrowDown':  case 's': handleMove(0, 1);  break;
        case 'ArrowLeft':  case 'a': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': handleMove(1, 0);  break;
        case 'f':          case ' ': e.preventDefault(); fireAtNearest(); break;
        case 'b':          case 'g': triggerBebiaUltimate(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, gameState, enemies, grid, playerStats, fireAtNearest, isAnimating, isBebiaActive, triggerBebiaUltimate]);

  // Weapon meta calculations
  const weaponName = getWeaponName(playerStats.class, lang);

  // --- RENDERING VIEWS ---
  if (gameState === 'START') {
    return (
      <div style={styles.container}>
        <div style={styles.backLinkAbsolute}>
          <a href="/" style={styles.navLink}>
            {t.backToHome}
          </a>
        </div>
        <h1 style={{ ...styles.title, marginBottom: '20px', fontSize: '2.5rem', textAlign: 'center' }}>
          CHOOSE LANGUAGE / აირჩიეთ ენა
        </h1>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%', maxWidth: '500px', marginTop: '20px' }}>
          <button 
            onClick={() => { setLang('en'); setGameState('SELECT_CHARACTER'); }} 
            style={{ ...styles.btn, fontSize: '1.2rem', padding: '20px 40px', borderColor: '#ffd700', color: '#ffd700' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffd700'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#ffd700'; }}
          >
            🇬🇧 English
          </button>
          <button 
            onClick={() => { setLang('ka'); setGameState('SELECT_CHARACTER'); }} 
            style={{ ...styles.btn, fontSize: '1.2rem', padding: '20px 40px', borderColor: '#ffd700', color: '#ffd700' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffd700'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#ffd700'; }}
          >
            🇬🇪 ქართული (Georgian)
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'SELECT_CHARACTER') {
    return (
      <div style={styles.container}>
        <div style={styles.backLinkAbsolute}>
          <button 
            onClick={() => setGameState('START')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#00e5ff', 
              cursor: 'pointer', 
              fontFamily: 'monospace', 
              fontSize: '14px',
              fontWeight: 'bold',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {lang === 'en' ? '← Back to Languages' : '← უკან ენის არჩევაზე'}
          </button>
        </div>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
        <div style={styles.selectionZone}>
          {(['Fighter', 'Mage', 'Rogue', 'Rene', 'Sandro', 'Bebia'] as CharacterClass[]).map(cls => (
            <button key={cls} onClick={() => startGame(cls)} style={styles.btn}>
              {getClassEmoji(cls)} {getClassName(cls, lang)} <br />
              <span style={{ fontSize: '12px', opacity: 0.8 }}>
                {t.hp}: {CLASS_PRESETS[cls].hp} | {t.atk}: {CLASS_PRESETS[cls].atk}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameState === 'VICTORY') {
    return (
      <div style={styles.container}>
        <div style={styles.backLinkAbsolute}>
          <a href="/" style={styles.navLink}>
            {t.backToHome}
          </a>
        </div>
        <button
          onClick={() => setLang(prev => prev === 'en' ? 'ka' : 'en')}
          className="lang-toggle-btn"
          style={styles.langBtn}
        >
          {lang === 'en' ? '🌐 English' : '🌐 ქართული'}
        </button>
        <h1 style={{ ...styles.title, color: '#4caf50' }}>{t.congrats} {getClassName(playerClass, lang).toUpperCase()}</h1>
        <p style={styles.subtitle}>{t.victoryDesc}</p>
        <div style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
          <div style={{ color: '#ffd700' }}>{t.goldCollected}: <strong>{goldCollected}</strong> (+{goldCollected * 10} pts)</div>
          <div style={{ color: '#ff1744' }}>{t.monstersKilled}: <strong>{monstersKilled}</strong> (+{monstersKilled * 20} pts)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
            {t.finalScore}: <span style={{ color: '#ffd700' }}>{score}</span>
          </div>
        </div>
        <button onClick={() => setGameState('START')} style={styles.btn}>{t.runAgain}</button>
      </div>
    );
  }

  if (gameState === 'DEFEAT') {
    return (
      <div style={styles.container}>
        <div style={styles.backLinkAbsolute}>
          <a href="/" style={styles.navLink}>
            {t.backToHome}
          </a>
        </div>
        <button
          onClick={() => setLang(prev => prev === 'en' ? 'ka' : 'en')}
          className="lang-toggle-btn"
          style={styles.langBtn}
        >
          {lang === 'en' ? '🌐 English' : '🌐 ქართული'}
        </button>
        <h1 style={{ ...styles.title, color: '#f44336' }}>{t.youDied}</h1>
        <p style={{ ...styles.subtitle, fontStyle: 'italic' }}>
          {t.deathDesc}
        </p>
        <div style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
          <div>{t.levelReached}: <strong>{currentLevel}</strong></div>
          <div style={{ color: '#ffd700' }}>{t.goldCollected}: <strong>{goldCollected}</strong> (+{goldCollected * 10} pts)</div>
          <div style={{ color: '#ff1744' }}>{t.monstersKilled}: <strong>{monstersKilled}</strong> (+{monstersKilled * 20} pts)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px' }}>
            {t.finalScore}: <span style={{ color: '#ffd700' }}>{score}</span>
          </div>
        </div>
        <button onClick={() => setGameState('START')} style={styles.btn}>{t.tryAgain}</button>
      </div>
    );
  }

  return (
    <div className="game-view" style={styles.gameView}>
      <style dangerouslySetInnerHTML={{__html: `
        .lang-toggle-btn:hover {
          background-color: #222 !important;
          border-color: #00e5ff !important;
          color: #00e5ff !important;
        }
        @keyframes bebia-shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes bebia-flash {
          0% { background-color: rgba(255, 23, 68, 0.4); }
          50% { background-color: rgba(255, 255, 255, 0.4); }
          100% { background-color: rgba(255, 23, 68, 0.4); }
        }
        @keyframes flag-zoom {
          0% { transform: scale(0.1); opacity: 0; }
          15% { transform: scale(1.1); opacity: 1; }
          20% { transform: scale(1); opacity: 1; }
          75% { transform: scale(1); opacity: 1; }
          90% { transform: scale(15); opacity: 1; }
          100% { transform: scale(25); opacity: 0; }
        }
        @keyframes pulsate {
          0% { box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); border-color: #00e5ff; }
          50% { box-shadow: 0 0 16px rgba(0, 229, 255, 0.8), 0 0 20px rgba(255, 23, 68, 0.4); border-color: #ff1744; }
          100% { box-shadow: 0 0 8px rgba(0, 229, 255, 0.4); border-color: #00e5ff; }
        }
        .bebia-crashing-grid {
          animation: bebia-shake 0.15s infinite !important;
          position: relative !important;
        }
        .bebia-overlay-flash {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          animation: bebia-flash 0.5s infinite !important;
          pointer-events: none !important;
          z-index: 10 !important;
        }
        .bebia-flag-container {
          position: absolute !important;
          top: 10% !important;
          left: 10% !important;
          width: 80% !important;
          height: 80% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 15 !important;
          pointer-events: none !important;
          animation: flag-zoom 2s forwards !important;
          filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.6)) !important;
        }
        @media (max-width: 768px) {
          .game-view {
            flex-direction: column !important;
            align-items: center !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            padding-bottom: 120px !important; /* space for mobile controls */
            height: auto !important;
            min-height: 100vh;
          }
          .desktop-only-sidebar {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .grid-container {
            padding: 10px 0 !important;
            flex: none !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .game-cell {
            width: 20px !important;
            height: 20px !important;
            font-size: 11px !important;
          }
          .controls-hint {
            display: none !important;
          }
          .mobile-controls-bar {
            display: flex !important;
          }
          .desktop-only-log-box {
            display: none !important;
          }
        }
      `}} />

      {/* Mobile Top Header (Visible only on mobile) */}
      <div 
        className="mobile-header"
        style={{
          display: 'none',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #222',
          padding: '8px 12px',
          gap: '4px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={styles.navLink}>{t.backToHome}</a>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00e5ff' }}>
            {getClassName(playerStats.class, lang).toUpperCase()} <span style={{ color: '#aaa' }}>({t.level} {currentLevel}/{TOTAL_LEVELS})</span>
          </span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <button
              onClick={() => setLang(prev => prev === 'en' ? 'ka' : 'en')}
              className="lang-toggle-btn"
              style={{
                padding: '3px 6px',
                fontSize: '11px',
                backgroundColor: '#111',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {lang === 'en' ? '🌐 EN' : '🌐 ქარ'}
            </button>
            <button 
              onClick={() => setGameState('START')} 
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                backgroundColor: '#111',
                color: '#ff1744',
                border: '1px solid #ff1744',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {t.restartGame}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ccc', backgroundColor: '#111', padding: '4px 8px', borderRadius: '4px' }}>
          <span>{t.hp}: <strong style={{ color: '#4caf50' }}>{playerStats.hp}/{playerStats.maxHp}</strong></span>
          <span>{t.score}: <strong style={{ color: '#ffd700' }}>{score}</strong> ({t.goldPieces}: {goldCollected})</span>
          <span>{t.level}: <strong>{currentLevel}</strong></span>
        </div>

        {log.length > 0 && (
          <div style={{ fontSize: '11px', color: '#00e5ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: '#050505', padding: '3px 6px', borderRadius: '3px', border: '1px solid #1a1a1a' }}>
            ▶ {log[0]}
          </div>
        )}
      </div>

      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className="desktop-only-sidebar" style={styles.sidebar}>
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={styles.navLink}>
            {t.backToHome}
          </a>
          <button
            onClick={() => setLang(prev => prev === 'en' ? 'ka' : 'en')}
            className="lang-toggle-btn"
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              backgroundColor: '#111',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {lang === 'en' ? '🌐 EN' : '🌐 ქარ'}
          </button>
        </div>
        <h2>{getClassName(playerStats.class, lang)}</h2>
        <p>{t.level}: <strong>{currentLevel} / {TOTAL_LEVELS}</strong></p>
        <p>{t.hp}: <strong>{playerStats.hp} / {playerStats.maxHp}</strong></p>
        <p>{t.atk}: <strong>{playerStats.atk}</strong> | {t.def}: <strong>{playerStats.def}</strong></p>
        <p>{t.weapon}: <strong>{weaponName}</strong> ({t.range}: {t.infinity})</p>
        <p style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
          {t.score}: <strong style={{ color: '#ffd700', fontSize: '1.25rem' }}>{score}</strong>
        </p>
        <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>
          {t.goldPieces}: <strong style={{ color: '#ffd700' }}>{goldCollected}</strong> (+{goldCollected * 10} pts) <br />
          {t.monstersKilledSidebar}: <strong style={{ color: '#ff1744' }}>{monstersKilled}</strong> (+{monstersKilled * 20} pts)
        </p>

        <p className="controls-hint" style={styles.controlsHint}>{t.controlsHint}</p>
        
        {playerClass === 'Bebia' && (
          <button
            onClick={triggerBebiaUltimate}
            disabled={isBebiaActive || enemies.length === 0}
            className="bebia-ultimate-btn"
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: isBebiaActive ? '#ff1744' : '#111',
              color: isBebiaActive ? '#fff' : '#00e5ff',
              border: '2px solid #00e5ff',
              borderRadius: '6px',
              cursor: (isBebiaActive || enemies.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginTop: '15px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0,229,255,0.3)',
              animation: (isBebiaActive || enemies.length === 0) ? 'none' : 'pulsate 2s infinite',
              opacity: enemies.length === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              fontFamily: 'monospace',
            }}
          >
            {isBebiaActive ? t.bebiaActive : t.bebiaUltimate}
          </button>
        )}

        {playerClass === 'Fighter' && (
          <button
            onClick={toggleSopoWinsAudio}
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: isSopoAudioPlaying ? '#ffd700' : '#111',
              color: isSopoAudioPlaying ? '#000' : '#ffd700',
              border: '2px solid #ffd700',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '15px',
              width: '100%',
              textAlign: 'center',
              boxShadow: isSopoAudioPlaying ? '0 0 15px rgba(255,215,0,0.6)' : '0 0 10px rgba(255,215,0,0.2)',
              transition: 'all 0.3s ease',
              fontFamily: 'monospace',
            }}
          >
            {isSopoAudioPlaying 
              ? (lang === 'en' ? '⏸️ Pause Sopo Song' : '⏸️ შეჩერება') 
              : (lang === 'en' ? '👑 Play Sopo Wins' : '👑 ჩართე სოფოს სიმღერა')}
          </button>
        )}

        <button 
          onClick={() => setGameState('START')} 
          style={styles.restartBtn}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff1744'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#fff'; }}
        >
          {t.restartGameSidebar}
        </button>
      </div>

      <div 
        className={`grid-container ${isBebiaActive ? 'bebia-crashing-grid' : ''}`} 
        style={{
          ...styles.gridContainer,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scroll Objective Banner */}
        <div 
          className="scroll-banner"
          style={{
            background: 'linear-gradient(to right, #f4e2bb, #fff8e7, #f4e2bb)',
            color: '#3e2723',
            border: '2px solid #8d6e63',
            borderRadius: '4px',
            padding: '8px 16px',
            marginBottom: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.6), inset 0 0 10px rgba(141,110,99,0.3)',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '13px',
            letterSpacing: '0.5px',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '90%',
            maxWidth: '460px',
            textTransform: 'uppercase',
            borderLeftWidth: '10px',
            borderRightWidth: '10px',
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '15px' }}>📜</span>
          <span>{getLevelObjective(currentLevel, lang)}</span>
          <span style={{ fontSize: '15px' }}>📜</span>
        </div>

        {isBebiaActive && (
          <>
            <div className="bebia-overlay-flash" />
            {ultimatePhase === 'FLAG' && (
              <div className="bebia-flag-container">
                <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                  <rect width="300" height="200" fill="#ffffff" rx="10" />
                  <path d="M135 0h30v200h-30zM0 85h300v30H0z" fill="#ff0000" />
                  <path d="M65 42 c1.5,3.5 1.5,5.5 5,5.5 c3.5,0 3.5,1.5 3.5,3.5 c0,2 0,3.5 -3.5,3.5 c-3.5,0 -3.5,2 -5,5.5 c-1.5,-3.5 -1.5,-5.5 -5,-5.5 c-3.5,0 -3.5,-1.5 -3.5,-3.5 c0,-2 0,-3.5 3.5,-3.5 c3.5,0 3.5,-2 5,-5.5 z" fill="#ff0000" />
                  <path d="M235 42 c1.5,3.5 1.5,5.5 5,5.5 c3.5,0 3.5,1.5 3.5,3.5 c0,2 0,3.5 -3.5,3.5 c-3.5,0 -3.5,2 -5,5.5 c-1.5,-3.5 -1.5,-5.5 -5,-5.5 c-3.5,0 -3.5,-1.5 -3.5,-3.5 c0,-2 0,-3.5 3.5,-3.5 c3.5,0 3.5,-2 5,-5.5 z" fill="#ff0000" />
                  <path d="M65 158 c1.5,3.5 1.5,5.5 5,5.5 c3.5,0 3.5,1.5 3.5,3.5 c0,2 0,3.5 -3.5,3.5 c-3.5,0 -3.5,2 -5,5.5 c-1.5,-3.5 -1.5,-5.5 -5,-5.5 c-3.5,0 -3.5,-1.5 -3.5,-3.5 c0,-2 0,-3.5 3.5,-3.5 c3.5,0 3.5,-2 5,-5.5 z" fill="#ff0000" />
                  <path d="M235 158 c1.5,3.5 1.5,5.5 5,5.5 c3.5,0 3.5,1.5 3.5,3.5 c0,2 0,3.5 -3.5,3.5 c-3.5,0 -3.5,2 -5,5.5 c-1.5,-3.5 -1.5,-5.5 -5,-5.5 c-3.5,0 -3.5,-1.5 -3.5,-3.5 c0,-2 0,-3.5 3.5,-3.5 c3.5,0 3.5,-2 5,-5.5 z" fill="#ff0000" />
                </svg>
              </div>
            )}
          </>
        )}
        {grid.map((row, y) => (
          <div key={y} style={styles.row}>
            {row.map((cell, x) => {
              let glyph = cell;
              let color = '#444';
              let cursor = 'default';
              let bg = cell === '#' ? '#222' : '#0a0a0a';

              const inPath = projectilePath.some(p => p.x === x && p.y === y);

              const isRunner = bebiaRunnerPos && bebiaRunnerPos.x === x && bebiaRunnerPos.y === y;

              if (isRunner) {
                glyph = '🇬🇪';
                color = '#ffd700';
              } else if (x === playerPosition.x && y === playerPosition.y) {
                if (playerClass === 'Bebia' && (ultimatePhase === 'CHASING' || ultimatePhase === 'FLAG')) {
                  glyph = '.';
                  color = '#222';
                } else {
                  if (playerClass === 'Rene') {
                    glyph = isAnimating ? '🗡️' : '🦊';
                  } else if (playerClass === 'Sandro') {
                    glyph = isAnimating ? '🪓' : '🛡️';
                  } else if (playerClass === 'Bebia') {
                    glyph = '🇬🇪';
                  } else if (playerClass === 'Fighter') {
                    glyph = '👑';
                  } else if (playerClass === 'Mage') {
                    glyph = '📖';
                  } else if (playerClass === 'Rogue') {
                    glyph = '📸';
                  } else {
                    glyph = '@';
                  }
                  color = '#00e5ff';
                }
              } else {
                const hasEnemy = enemies.find(e => e.x === x && e.y === y);
                if (hasEnemy) {
                  glyph = ultimatePhase === 'FRIGHTENED' ? '😱' : getEnemyGlyph(currentLevel, hasEnemy.id);
                  color = ultimatePhase === 'FRIGHTENED' ? '#ffea00' : '#ff1744';
                  cursor = 'pointer';
                } else if (cell === 'S') {
                  color = '#ffea00';
                } else if (cell === 'G') {
                  glyph = '*';
                  color = '#ffd700';
                } else if (cell === '#') {
                  color = '#888';
                } else {
                  color = '#222';
                }

                if (inPath && !hasEnemy) {
                  if (playerClass === 'Bebia') {
                    glyph = '🫓';
                  } else {
                    const dx = x - playerPosition.x;
                    const dy = y - playerPosition.y;
                    let arrow = '→';
                    if (dx === 0 && dy < 0) arrow = '↑';
                    else if (dx === 0 && dy > 0) arrow = '↓';
                    else if (dx < 0 && dy === 0) arrow = '←';
                    else if (dx > 0 && dy === 0) arrow = '→';
                    else if (Math.abs(dx) > 0 && Math.abs(dy) > 0) {
                      if (dx > 0 && dy < 0) arrow = '↗';
                      else if (dx < 0 && dy < 0) arrow = '↖';
                      else if (dx > 0 && dy > 0) arrow = '↘';
                      else if (dx < 0 && dy > 0) arrow = '↙';
                    }
                    glyph = arrow;
                  }
                  color = projectileColor;
                  bg = projectileColor + '22';
                }
              }

              const isExplosion = explosionPositions.some(p => p.x === x && p.y === y);
              if (isExplosion) {
                glyph = '💥';
                color = '#ff1744';
              }

              return (
                <div 
                  key={x} 
                  onClick={() => handleCellClick(x, y)}
                  className="game-cell"
                  style={{ ...styles.cell, color, cursor, backgroundColor: bg }}
                >
                  {glyph}
                </div>
              );
            })}
          </div>
        ))}

        {/* Desktop-only Dungeon Messages under the grid */}
        <div 
          className="desktop-only-log-box" 
          style={{
            width: '100%',
            maxWidth: '500px',
            marginTop: '20px',
            height: '130px',
            overflowY: 'auto',
            fontSize: '13px',
            color: '#ccc',
            border: '1px solid #333',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: '#050505',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
            textAlign: 'left',
          }}
        >
          {log.map((entry, idx) => (
            <div key={idx} style={styles.logEntry}>
              {entry}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Controls Overlay */}
      <div 
        className="mobile-controls-bar"
        style={{
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          padding: '12px 10px',
          boxSizing: 'border-box',
          backgroundColor: '#050505',
          borderTop: '1px solid #222',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 100,
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Joystick onMove={handleMove} />
          <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{t.moveStick}</span>
        </div>

        {playerClass === 'Bebia' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button 
              onTouchStart={(e) => { e.preventDefault(); triggerBebiaUltimate(); }}
              onClick={(e) => { e.preventDefault(); triggerBebiaUltimate(); }}
              disabled={isBebiaActive || enemies.length === 0}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isBebiaActive ? '#ff1744' : '#111',
                border: '2px solid #00e5ff',
                color: isBebiaActive ? '#fff' : '#00e5ff',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: isBebiaActive ? '0 0 15px #ff1744' : '0 0 8px rgba(0,229,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                userSelect: 'none',
                cursor: (isBebiaActive || enemies.length === 0) ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace',
                opacity: enemies.length === 0 ? 0.5 : 1,
                animation: (isBebiaActive || enemies.length === 0) ? 'none' : 'pulsate 2s infinite',
              }}
            >
              🇬🇪 Ultimate
            </button>
            <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>Bebia</span>
          </div>
        )}

        {playerClass === 'Fighter' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button 
              onTouchStart={(e) => { e.preventDefault(); toggleSopoWinsAudio(); }}
              onClick={(e) => { e.preventDefault(); toggleSopoWinsAudio(); }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isSopoAudioPlaying ? '#ffd700' : '#111',
                border: '2px solid #ffd700',
                color: isSopoAudioPlaying ? '#000' : '#ffd700',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: isSopoAudioPlaying ? '0 0 15px #ffd700' : '0 0 8px rgba(255,215,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'none',
                userSelect: 'none',
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              {isSopoAudioPlaying ? '⏸️' : '👑'}
            </button>
            <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{isSopoAudioPlaying ? (lang === 'en' ? 'Pause' : 'შეჩერება') : (lang === 'en' ? 'Play Sopo' : 'სოფო')}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button 
            onTouchStart={(e) => { e.preventDefault(); fireAtNearest(); }}
            onClick={(e) => { e.preventDefault(); fireAtNearest(); }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ff1744',
              border: '2px solid #ff5252',
              color: '#000',
              fontSize: '15px',
              fontWeight: 'bold',
              boxShadow: '0 0 12px rgba(255,23,68,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              userSelect: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
          >
            {t.fire}
          </button>
          <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{t.shootNearest}</span>
        </div>
      </div>
    </div>
  );
}

// --- JOYSTICK COMPONENT FOR MOBILE ---
interface JoystickProps {
  onMove: (dx: number, dy: number) => void;
}

function Joystick({ onMove }: JoystickProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const activeDirection = React.useRef<{ x: number; y: number } | null>(null);
  const moveInterval = React.useRef<any>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const touch = e.touches[0];

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 30; // max knob travel

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setKnobPos({ x: dx, y: dy });

    if (distance > 12) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      let dirX = 0;
      let dirY = 0;

      if (angle >= -45 && angle < 45) {
        dirX = 1;
      } else if (angle >= 45 && angle < 135) {
        dirY = 1;
      } else if (angle >= -135 && angle < -45) {
        dirY = -1;
      } else {
        dirX = -1;
      }

      if (!activeDirection.current || activeDirection.current.x !== dirX || activeDirection.current.y !== dirY) {
        activeDirection.current = { x: dirX, y: dirY };
        onMove(dirX, dirY);

        if (moveInterval.current) clearInterval(moveInterval.current);
        moveInterval.current = setInterval(() => {
          if (activeDirection.current) {
            onMove(activeDirection.current.x, activeDirection.current.y);
          }
        }, 220);
      }
    } else {
      activeDirection.current = null;
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
        moveInterval.current = null;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    activeDirection.current = null;
    if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        position: 'relative',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#00e5ff',
          boxShadow: '0 0 8px #00e5ff',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease',
          pointerEvents: 'none',
        }}
      />
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
  selectionZone: { display: 'flex', gap: '20px', flexWrap: 'wrap' as const, justifyContent: 'center' as const },
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
    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 'bold' as const, border: '1px solid #111', transition: 'background-color 0.1s ease'
  },
  logBox: { flex: 1, overflowY: 'auto' as const, fontSize: '13px', color: '#ccc' },
  logEntry: { marginBottom: '8px', borderBottom: '1px solid #151515', paddingBottom: '4px' },
  controlsHint: { fontSize: '11px', color: '#666', marginTop: 'auto' },
  backLinkAbsolute: { position: 'absolute' as const, top: '20px', left: '20px' },
  navLink: { color: '#00e5ff', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' as const },
  restartBtn: {
    padding: '8px 12px',
    fontSize: '12px',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #ff1744',
    cursor: 'pointer',
    fontFamily: 'monospace',
    borderRadius: '4px',
    marginTop: '15px',
    width: '100%',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    transition: 'background-color 0.2s ease',
  },
  langBtn: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#111',
    color: '#fff',
    border: '1px solid #444',
    cursor: 'pointer',
    fontFamily: 'monospace',
    borderRadius: '4px',
    zIndex: 1000,
    fontWeight: 'bold' as const,
    transition: 'all 0.2s ease',
  }
};
