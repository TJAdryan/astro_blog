import React, { useState, useEffect, useCallback, useRef } from 'react';

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
    fighter: 'Sopo (Fighter)',
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
    controlsHint: 'Use Arrow keys or WASD to step/melee. Click an enemy or press Space/F to shoot. Press B/G/P for Ultimate.',
    moveStick: 'MOVE STICK',
    fire: 'FIRE',
    shootNearest: 'SHOOT NEAREST',
    bebiaUltimate: '🇬🇪 Bebia Ultimate',
    bebiaActive: '🔥 Georgia Fire!',
    sopoUltimate: '💍 Proposal Ultimate',
    sopoActive: '❤️ Proposing...',
    sopoProposesLog: "💍 Sopo drops to one knee and proposes to Dominick!",
    sopoVanquishLog: "😭 The love-struck enemies fall to their knees in despair as Sopo vanquishes them!",
    sopoProclamation: "Sopo is unmatched in Beauty or Battle!",
    sopoProclamationSubtitle1: "Dominick, you are my greatest adventure",
    sopoProclamationSubtitle2: "and proposing to you my most glorious victory",
    georgiaDefendedScroll: "Thank you for defending Georgia against the Invaders.",
    replayAnthemBtn: "🎵 Replay 8-Bit Anthem",
    pauseAnthemBtn: "⏸️ Pause Anthem",
    // Logs
    welcomeLog: 'Welcome to the Vault. Find the stairs (S) to descend.',
    enterLog: 'You enter the cold depths of the Vault.',
    ambushLog: (dmg: number) => `An enemy ambushes you for ${dmg} DMG!`,
    hitLog: (dmg: number) => `You hit enemy for ${dmg} DMG.`,
    enemyDefeatedLog: 'Enemy defeated! (+20 pts)',
    enemyStrikeLog: (dmg: number) => `Enemy strikes you for ${dmg} DMG.`,
    bossSpawnLog: "⚠️ WARNING: The Vault Warlord has appeared!",
    bossHitLog: (dmg: number) => `You strike the Vault Warlord for ${dmg} DMG!`,
    bossStrikeLog: (dmg: number) => `👹 The Vault Warlord strikes you with crushing force for ${dmg} DMG!`,
    bossDefeatedLog: "🏆 The Vault Warlord has fallen! (+100 pts) The exit portal is now open!",
    bossExitSealedLog: "🚪 The exit portal is sealed! Defeat the Vault Warlord to escape!",
    goldCollectedLog: (val: number) => `You collected a gold piece! (+${val} pts)`,
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
    controlsHint: 'გამოიყენეთ ისრები ან WASD გადასაადგილებლად. ესროლეთ მონსტრებს Space/F ღილაკით. ძალისთვის დააჭირეთ B/G/P-ს.',
    moveStick: 'მართვის ჯოხი',
    fire: 'სროლა',
    shootNearest: 'უახლოესის სროლა',
    bebiaUltimate: '🇬🇪 ბებიას ძალა',
    bebiaActive: '🔥 ქართული ცეცხლი!',
    sopoUltimate: '💍 სოფოს ძალა (Proposal)',
    sopoActive: '❤️ ხელის თხოვნა...',
    sopoProposesLog: "💍 სოფო მუხლზე იჩოქებს და დომინიკს ხელს სთხოვს!",
    sopoVanquishLog: "😭 სიყვარულით დაზაფრული მტრები მუხლებზე ეცემიან სასოწარკვეთილებაში, როცა სოფო მათ ამარცხებს!",
    sopoProclamation: "სოფო შეუდარებელია სილამაზესა და ბრძოლაში!",
    sopoProclamationSubtitle1: "დომინიკ, შენ ხარ ჩემი უდიდესი თავგადასავალი",
    sopoProclamationSubtitle2: "და შენთვის ხელის თხოვნა – ჩემი ყველაზე დიდებული გამარჯვება.",
    georgiaDefendedScroll: "მადლობა საქართველოს დამპყრობლებისგან დაცვისთვის.",
    replayAnthemBtn: "🎵 ჰიმნის ხელახლა ჩართვა",
    pauseAnthemBtn: "⏸️ ჰიმნის შეჩერება",
    // Logs
    welcomeLog: 'კეთილი იყოს თქვენი მობრძანება ვაულტში. ჩასასვლელად იპოვეთ კიბე (S).',
    enterLog: 'თქვენ შედიხართ ვაულტის ცივ სიღრმეებში.',
    ambushLog: (dmg: number) => `მტერმა მოულოდნელად დაგარტყათ და მოგაყენათ ${dmg} ზიანი!`,
    hitLog: (dmg: number) => `თქვენ დაარტყით მტერს ${dmg} ზიანით.`,
    enemyDefeatedLog: 'მტერი დამარცხებულია! (+20 ქულა)',
    enemyStrikeLog: (dmg: number) => `მტერმა დაგარტყათ და მოგაყენათ ${dmg} ზიანი.`,
    bossSpawnLog: "⚠️ ყურადღება: ვაულტის მბრძანებელი გამოჩნდა!",
    bossHitLog: (dmg: number) => `თქვენ დაარტყით ვაულტის მბრძანებელს ${dmg} ზიანით!`,
    bossStrikeLog: (dmg: number) => `👹 ვაულტის მბრძანებელმა დაგარტყათ გამანადგურებელი ${dmg} ზიანით!`,
    bossDefeatedLog: "🏆 ვაულტის მბრძანებელი დამარცხებულია! (+100 ქულა) გასასვლელი პორტალი გაიხსნა!",
    bossExitSealedLog: "🚪 გასასვლელი პორტალი დაბლოკილია! დაამარცხეთ ბოსი გასაქცევად!",
    goldCollectedLog: (val: number) => `თქვენ შეაგროვეთ ოქრო! (+${val} ქულა)`,
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
  maxHp: number;
  atk: number;
  isBoss?: boolean;
}

const getEnemyGlyph = (lvl: number, id: string, isBoss?: boolean) => {
  if (isBoss) return '👹';
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

const getEnemyName = (lvl: number, lang: Language, isBoss?: boolean) => {
  if (isBoss) {
    return lang === 'en' ? "Vault Warlord (BOSS)" : "ვაულტის მბრძანებელი (ბოსი)";
  }
  const names = {
    en: {
      1: "Roman Legionnaire",
      2: "Persian Immortal",
      3: "Mongol Raider",
      4: "Soviet / Russian Invader",
      5: "Elite Vault Guard"
    },
    ka: {
      1: "რომაელი ლეგიონერი",
      2: "სპარსელი მეომარი",
      3: "მონღოლი მხედარი",
      4: "რუსი დამპყრობელი",
      5: "ელიტური მცველი"
    }
  };
  return names[lang][lvl as 1|2|3|4|5] || names[lang][5];
};

const getLevelObjective = (lvl: number, lang: Language) => {
  const objectives = {
    en: {
      1: "Defend against the Roman invaders to advance.",
      2: "Defend against the Persian invaders to advance.",
      3: "Defend against the Mongolian invaders to advance.",
      4: "Defend against the Russian invaders to advance.",
      5: "Defeat the Vault Warlord to escape the dungeon!"
    },
    ka: {
      1: "გაუძელით რომაელ დამპყრობლებს წინსვლისთვის.",
      2: "გაუძელით სპარსელ დამპყრობლებს წინსვლისთვის.",
      3: "გაუძელით მონღოლ დამპყრობლებს წინსვლისთვის.",
      4: "გაუძელით რუს დამპყრობლებს წინსვლისთვის.",
      5: "დაამარცხეთ ვაულტის მბრძანებელი დუნჯიდან გასაქცევად!"
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

// --- 8-BIT GEORGIAN ANTHEM ("TAVISUPLEBA") CHIPTUNE SYNTHESIZER ---
const NOTE_FREQS: Record<string, number> = {
  'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

// [leadNote, beats, harmonyNote?, bassNote?]
const ANTHEM_SCORE: [string, number, string?, string?][] = [
  // --- VERSE 1: "ჩემი ხატია სამშობლო" ---
  // Pickup: "ჩე-"
  ['F4', 0.8, 'D4', 'Bb2'],
  // "-მი ხა-ტი-ა"
  ['Bb4', 1.2, 'F4', 'Bb2'],
  ['C5', 0.6, 'G4', 'C3'],
  ['D5', 1.6, 'Bb4', 'D3'],
  // "სამ-შობ-"
  ['C5', 0.8, 'A4', 'F3'],
  ['Bb4', 0.8, 'G4', 'G2'],
  // "-ლო"
  ['A4', 1.8, 'F4', 'F2'],

  // "სახატე მთელი ქვეყანა"
  // "სა-ხა-"
  ['Bb4', 0.8, 'F4', 'Bb2'],
  ['C5', 0.8, 'G4', 'C3'],
  // "-ტე მთე-ლი"
  ['D5', 1.2, 'Bb4', 'D3'],
  ['Eb5', 0.6, 'C5', 'Eb3'],
  // "ქვე-ყა-"
  ['D5', 0.9, 'Bb4', 'Bb2'],
  ['C5', 0.9, 'A4', 'F3'],
  // "-ნა"
  ['Bb4', 2.0, 'F4', 'Bb2'],

  // --- VERSE 2: "განათებული მთა-ბარი" ---
  // "გა-ნა-თე-"
  ['F5', 1.0, 'D5', 'Bb3'],
  ['D5', 1.2, 'Bb4', 'Bb2'],
  ['Eb5', 0.6, 'C5', 'C3'],
  ['F5', 1.6, 'D5', 'D3'],
  // "-ბუ-ლი მთა-"
  ['G5', 0.8, 'Eb5', 'Eb3'],
  ['F5', 0.8, 'D5', 'Bb2'],
  // "-ბა-რი"
  ['Eb5', 1.8, 'C5', 'F3'],

  // "წილნაყარია ღმერთთანა"
  // "წილ-ნა-ყა-"
  ['F5', 0.8, 'D5', 'Bb2'],
  ['Eb5', 0.8, 'C5', 'A2'],
  ['D5', 0.8, 'Bb4', 'G2'],
  ['C5', 0.8, 'A4', 'F2'],
  // "-რი-ა ღმერთ-თა-"
  ['D5', 1.4, 'Bb4', 'Bb2'],
  ['C5', 1.2, 'A4', 'F3'],
  // "-ნა"
  ['Bb4', 2.2, 'F4', 'Bb2'],

  // --- CHORUS (CLIMAX FROM DAISI): "თავისუფლება დღეს ჩვენი" ---
  // "თა-ვი-სუფ-ლე-ბა"
  ['F5', 1.2, 'D5', 'Bb3'],
  ['D5', 0.6, 'Bb4', 'Bb2'],
  ['F5', 0.8, 'D5', 'D3'],
  ['Bb5', 1.6, 'F5', 'Bb3'],
  // "დღეს ჩვე-ნი"
  ['A5', 0.8, 'F5', 'F3'],
  ['G5', 0.8, 'Eb5', 'Eb3'],
  ['F5', 1.8, 'D5', 'Bb2'],

  // "მომავალს უმღერს დიდებას"
  // "მო-მა-ვალს"
  ['Eb5', 1.2, 'C5', 'C3'],
  ['C5', 0.6, 'A4', 'F2'],
  ['Eb5', 0.8, 'C5', 'Eb3'],
  ['G5', 1.6, 'Eb5', 'Eb3'],
  // "უმ-ღერს დი-დე-"
  ['F5', 0.8, 'D5', 'Bb2'],
  ['Eb5', 0.8, 'C5', 'F3'],
  // "-ბას"
  ['D5', 1.8, 'Bb4', 'Bb2'],

  // "ცისკრის ვარსკვლავი ამოდის"
  // "ცის-კრის ვარს-კვლა-ვი"
  ['D5', 0.8, 'Bb4', 'G2'],
  ['D5', 0.8, 'Bb4', 'F#2'],
  ['D5', 1.2, 'Bb4', 'G2'],
  ['Eb5', 0.6, 'C5', 'A2'],
  // "ა-მო-დის"
  ['F5', 1.4, 'D5', 'Bb2'],
  ['G5', 1.4, 'Eb5', 'Eb3'],

  // "ამოდის და ორ ზღვას შუა ბრწყინდება"
  // "ა-მო-დის და"
  ['F5', 0.8, 'D5', 'Bb2'],
  ['Eb5', 0.8, 'C5', 'C3'],
  ['D5', 0.8, 'Bb4', 'D3'],
  ['C5', 0.8, 'A4', 'F2'],
  // "ორ ზღვას შუ-ა ბრწყინ-დე-ბა"
  ['Bb4', 0.9, 'F4', 'G2'],
  ['C5', 0.9, 'G4', 'A2'],
  ['D5', 1.8, 'Bb4', 'Bb2'],

  // "და დიდება თავისუფლებას"
  // "და დი-დე-ბა"
  ['Eb5', 0.8, 'C5', 'Eb3'],
  ['F5', 0.8, 'D5', 'F3'],
  ['G5', 1.2, 'Eb5', 'Eb3'],
  ['F5', 0.6, 'D5', 'D3'],
  // "თა-ვი-სუფ-ლე-"
  ['Eb5', 1.2, 'C5', 'C3'],
  ['D5', 1.2, 'Bb4', 'Bb2'],

  // --- FINAL TRIUMPH: "თავისუფლებას დიდება!" ---
  // "თა-ვი-სუფ-ლე-ბას"
  ['C5', 1.2, 'A4', 'F2'],
  ['D5', 0.6, 'Bb4', 'G2'],
  ['Eb5', 0.9, 'C5', 'A2'],
  ['C5', 0.9, 'A4', 'F3'],
  // "დი-დე-ბა!"
  ['Bb4', 3.2, 'F4', 'Bb2'],

  // Grand Orchestral Resolution Flourish
  ['F5', 0.8, 'D5', 'Bb3'],
  ['G5', 0.6, 'Eb5', 'Eb3'],
  ['F5', 0.8, 'D5', 'F3'],
  ['D5', 0.8, 'Bb4', 'D3'],
  ['Bb4', 3.6, 'F4', 'Bb2']
];

function play8BitGeorgianAnthem(): () => void {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return () => {};
    const ctx = new AudioContext();
    const now = ctx.currentTime + 0.06;
    const tempo = 0.46; // Solemn & majestic anthem pace

    let noteTime = now;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, ctx.currentTime);
    masterGain.connect(ctx.destination);

    ANTHEM_SCORE.forEach(([leadNote, beats, harmonyNote, bassNote]) => {
      const dur = beats * tempo;
      const leadFreq = NOTE_FREQS[leadNote];

      // 1. Lead Melody (NES Square Pulse 1)
      if (leadFreq) {
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadFreq, noteTime);

        // Expressive retro envelope with slight vibrato on long notes
        if (beats >= 1.5) {
          leadOsc.frequency.setValueAtTime(leadFreq, noteTime);
          leadOsc.frequency.setValueAtTime(leadFreq, noteTime + dur * 0.35);
          // subtle vibrato
          leadOsc.frequency.linearRampToValueAtTime(leadFreq * 1.008, noteTime + dur * 0.55);
          leadOsc.frequency.linearRampToValueAtTime(leadFreq * 0.993, noteTime + dur * 0.75);
          leadOsc.frequency.linearRampToValueAtTime(leadFreq, noteTime + dur * 0.95);
        }

        leadGain.gain.setValueAtTime(0.001, noteTime);
        leadGain.gain.linearRampToValueAtTime(0.22, noteTime + 0.02);
        leadGain.gain.exponentialRampToValueAtTime(0.15, noteTime + dur * 0.75);
        leadGain.gain.linearRampToValueAtTime(0.001, noteTime + dur * 0.96);

        leadOsc.connect(leadGain);
        leadGain.connect(masterGain);

        leadOsc.start(noteTime);
        leadOsc.stop(noteTime + dur * 0.97);
      }

      // 2. Choral Harmony (NES Square Pulse 2)
      if (harmonyNote) {
        const harmFreq = NOTE_FREQS[harmonyNote];
        if (harmFreq) {
          const harmOsc = ctx.createOscillator();
          const harmGain = ctx.createGain();
          harmOsc.type = 'square';
          harmOsc.frequency.setValueAtTime(harmFreq, noteTime);

          harmGain.gain.setValueAtTime(0.001, noteTime);
          harmGain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
          harmGain.gain.exponentialRampToValueAtTime(0.08, noteTime + dur * 0.75);
          harmGain.gain.linearRampToValueAtTime(0.001, noteTime + dur * 0.96);

          harmOsc.connect(harmGain);
          harmGain.connect(masterGain);

          harmOsc.start(noteTime);
          harmOsc.stop(noteTime + dur * 0.97);
        }
      }

      // 3. Bass Counterpoint (NES Triangle Bass)
      if (bassNote) {
        const bassFreq = NOTE_FREQS[bassNote];
        if (bassFreq) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'triangle';
          bassOsc.frequency.setValueAtTime(bassFreq, noteTime);

          bassGain.gain.setValueAtTime(0.001, noteTime);
          bassGain.gain.linearRampToValueAtTime(0.28, noteTime + 0.03);
          bassGain.gain.exponentialRampToValueAtTime(0.16, noteTime + dur * 0.85);
          bassGain.gain.linearRampToValueAtTime(0.001, noteTime + dur * 0.98);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);

          bassOsc.start(noteTime);
          bassOsc.stop(noteTime + dur * 0.99);
        }
      }

      noteTime += dur;
    });

    return () => {
      try {
        ctx.close();
      } catch (e) {
        // already closed
      }
    };
  } catch (err) {
    console.warn("Could not initialize 8-bit audio anthem:", err);
    return () => {};
  }
}

interface GeorgianHillVictorySceneProps {
  charClass: CharacterClass;
  lang: Language;
}

const GeorgianHillVictoryScene: React.FC<GeorgianHillVictorySceneProps> = ({ charClass, lang }) => {
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(true);
  const stopAnthemRef = useRef<(() => void) | null>(null);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const stopFn = play8BitGeorgianAnthem();
    stopAnthemRef.current = stopFn;
    setIsPlayingAnthem(true);

    return () => {
      if (stopAnthemRef.current) {
        stopAnthemRef.current();
        stopAnthemRef.current = null;
      }
    };
  }, []);

  const handleToggleAnthem = () => {
    if (isPlayingAnthem) {
      if (stopAnthemRef.current) {
        stopAnthemRef.current();
        stopAnthemRef.current = null;
      }
      setIsPlayingAnthem(false);
    } else {
      if (stopAnthemRef.current) {
        stopAnthemRef.current();
      }
      stopAnthemRef.current = play8BitGeorgianAnthem();
      setIsPlayingAnthem(true);
    }
  };

  return (
    <div className="georgian-victory-wrapper" style={{ width: '100%', maxWidth: '520px', margin: '0 auto 24px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pixel-twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes hero-climb {
          0% { transform: translate(20px, 160px); }
          25% { transform: translate(110px, 125px); }
          50% { transform: translate(190px, 95px); }
          75% { transform: translate(270px, 65px); }
          100% { transform: translate(320px, 45px); }
        }
        @keyframes hero-bob {
          0%, 100% { margin-top: 0px; }
          50% { margin-top: -3px; }
        }
        @keyframes flag-raise {
          0%, 75% { transform: scale(0); opacity: 0; }
          85% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes flag-wave-8bit {
          0% { transform: skewY(0deg) scaleX(1); }
          25% { transform: skewY(2deg) scaleX(0.97); }
          50% { transform: skewY(0deg) scaleX(1.02); }
          75% { transform: skewY(-2deg) scaleX(0.97); }
          100% { transform: skewY(0deg) scaleX(1); }
        }
        @keyframes scroll-unfurl {
          0% { opacity: 0; transform: translateY(-15px) scaleY(0.6); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes spark-float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-20px) rotate(90deg); opacity: 0; }
        }
      `}} />

      {/* Decorative 8-bit Scroll Banner */}
      <div
        className="scroll-proclamation"
        style={{
          animation: 'scroll-unfurl 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          background: 'linear-gradient(to right, #f4e2bb, #fffdf2, #f4e2bb)',
          color: '#3e2723',
          border: '3px solid #8d6e63',
          borderRadius: '4px',
          padding: '10px 18px',
          marginBottom: '14px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(141,110,99,0.35)',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '13px',
          letterSpacing: '0.5px',
          fontFamily: 'monospace',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          boxSizing: 'border-box',
          borderLeftWidth: '12px',
          borderRightWidth: '12px',
          lineHeight: '1.4'
        }}
      >
        <span style={{ fontSize: '18px' }}>📜</span>
        <span>{t.georgiaDefendedScroll}</span>
        <span style={{ fontSize: '18px' }}>📜</span>
      </div>

      {/* 8-Bit Pixel Art Scene Frame */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#0a1128',
          border: '4px solid #333',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.9), 0 0 15px rgba(0,229,255,0.2)'
        }}
      >
        <svg
          viewBox="0 0 460 240"
          style={{ width: '100%', height: '100%', display: 'block', shapeRendering: 'crispEdges' }}
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050a18" />
              <stop offset="60%" stopColor="#1c2541" />
              <stop offset="100%" stopColor="#3a506b" />
            </linearGradient>
            <filter id="pixelGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffd700" floodOpacity="0.8" />
            </filter>
          </defs>
          <rect width="460" height="240" fill="url(#skyGrad)" />

          {/* Twinkling Pixel Stars */}
          <rect x="30" y="20" width="3" height="3" fill="#ffffff" style={{ animation: 'pixel-twinkle 2s infinite ease-in-out' }} />
          <rect x="80" y="45" width="2" height="2" fill="#ffe066" style={{ animation: 'pixel-twinkle 2.5s infinite ease-in-out 0.5s' }} />
          <rect x="140" y="15" width="3" height="3" fill="#ffffff" style={{ animation: 'pixel-twinkle 1.8s infinite ease-in-out 0.2s' }} />
          <rect x="200" y="35" width="2" height="2" fill="#ffe066" style={{ animation: 'pixel-twinkle 2.2s infinite ease-in-out 0.8s' }} />
          <rect x="260" y="22" width="3" height="3" fill="#ffffff" style={{ animation: 'pixel-twinkle 3s infinite ease-in-out 1.2s' }} />
          <rect x="330" y="40" width="2" height="2" fill="#ffe066" style={{ animation: 'pixel-twinkle 2.1s infinite ease-in-out 0.3s' }} />
          <rect x="410" y="18" width="3" height="3" fill="#ffffff" style={{ animation: 'pixel-twinkle 1.9s infinite ease-in-out 0.7s' }} />
          <rect x="390" y="55" width="2" height="2" fill="#ffffff" style={{ animation: 'pixel-twinkle 2.4s infinite ease-in-out 1.5s' }} />

          {/* Distant Caucasus Mountain Peaks */}
          <polygon points="40,180 110,90 180,180" fill="#202c39" />
          <polygon points="100,105 110,90 120,105" fill="#e0e1dd" />

          <polygon points="140,180 230,70 320,180" fill="#1b263b" />
          <polygon points="215,92 230,70 245,92" fill="#ffffff" />

          <polygon points="280,180 370,85 460,180" fill="#202c39" />
          <polygon points="355,102 370,85 385,102" fill="#e0e1dd" />

          {/* Stepped 8-Bit Rolling Green Hill */}
          <path
            d="
              M 0 240 
              L 0 195 
              L 40 195 L 40 180 
              L 80 180 L 80 165 
              L 125 165 L 125 150 
              L 170 150 L 170 135 
              L 215 135 L 215 120 
              L 260 120 L 260 105 
              L 305 105 L 305 95 
              L 360 95 L 360 110 
              L 405 110 L 405 130 
              L 460 130 L 460 240 Z
            "
            fill="#2d6a4f"
          />
          <path
            d="
              M 0 195 L 40 195 
              M 40 180 L 80 180 
              M 80 165 L 125 165 
              M 125 150 L 170 150 
              M 170 135 L 215 135 
              M 215 120 L 260 120 
              M 260 105 L 305 105 
              M 305 95 L 360 95 
              M 360 110 L 405 110 
              M 405 130 L 460 130
            "
            stroke="#52b788"
            strokeWidth="4"
          />
          <rect x="0" y="210" width="460" height="30" fill="#1b4332" />

          {/* Flagpole on Summit */}
          <g style={{ animation: 'flag-raise 4.2s ease-out forwards', transformOrigin: '355px 95px' }}>
            <rect x="355" y="32" width="4" height="65" fill="#ffd700" />
            <circle cx="357" cy="32" r="4" fill="#ffeb3b" filter="url(#pixelGlow)" />

            {/* Georgian 5-Cross Flag */}
            <g style={{ animation: 'flag-wave-8bit 2.4s infinite ease-in-out', transformOrigin: '359px 34px' }}>
              <rect x="359" y="34" width="54" height="36" fill="#ffffff" rx="1" stroke="#ccc" strokeWidth="0.5" />
              <rect x="359" y="49" width="54" height="6" fill="#ff0000" />
              <rect x="382" y="34" width="8" height="36" fill="#ff0000" />
              
              <rect x="367" y="39" width="6" height="2" fill="#ff0000" />
              <rect x="369" y="37" width="2" height="6" fill="#ff0000" />
              <rect x="397" y="39" width="6" height="2" fill="#ff0000" />
              <rect x="399" y="37" width="2" height="6" fill="#ff0000" />
              <rect x="367" y="61" width="6" height="2" fill="#ff0000" />
              <rect x="369" y="59" width="2" height="6" fill="#ff0000" />
              <rect x="397" y="61" width="6" height="2" fill="#ff0000" />
              <rect x="399" y="59" width="2" height="6" fill="#ff0000" />
            </g>

            {/* Sparkles / Confetti */}
            <rect x="345" y="24" width="4" height="4" fill="#ffd700" style={{ animation: 'spark-float 1.8s infinite linear 0.1s' }} />
            <rect x="385" y="18" width="3" height="3" fill="#ffffff" style={{ animation: 'spark-float 2.1s infinite linear 0.4s' }} />
            <rect x="420" y="28" width="4" height="4" fill="#ff1744" style={{ animation: 'spark-float 1.6s infinite linear 0.8s' }} />
            <rect x="330" y="40" width="3" height="3" fill="#ffd700" style={{ animation: 'spark-float 2.3s infinite linear 1.2s' }} />
          </g>

          {/* 8-Bit Climbing Character Sprite */}
          <g style={{ animation: 'hero-climb 3.8s ease-in-out forwards' }}>
            <g style={{ animation: 'hero-bob 0.28s infinite ease-in-out' }}>
              {/* Sandro */}
              {charClass === 'Sandro' && (
                <g>
                  <rect x="0" y="0" width="16" height="12" fill="#cfd8dc" />
                  <rect x="3" y="4" width="10" height="3" fill="#263238" />
                  <rect x="6" y="-3" width="4" height="4" fill="#ff1744" />
                  <rect x="2" y="12" width="12" height="14" fill="#1976d2" />
                  <rect x="5" y="14" width="6" height="6" fill="#ffd700" />
                  <circle cx="18" cy="18" r="8" fill="#78909c" stroke="#cfd8dc" strokeWidth="2" />
                  <rect x="16" y="13" width="4" height="10" fill="#d32f2f" />
                  <rect x="13" y="16" width="10" height="4" fill="#d32f2f" />
                  <rect x="3" y="26" width="4" height="8" fill="#37474f" />
                  <rect x="9" y="26" width="4" height="8" fill="#37474f" />
                </g>
              )}

              {/* Rene */}
              {charClass === 'Rene' && (
                <g>
                  <rect x="2" y="0" width="14" height="12" fill="#e65100" />
                  <polygon points="2,0 5,-4 7,0" fill="#e65100" />
                  <polygon points="11,0 13,-4 16,0" fill="#e65100" />
                  <rect x="5" y="4" width="8" height="4" fill="#212121" />
                  <rect x="6" y="5" width="2" height="2" fill="#00e5ff" />
                  <rect x="2" y="12" width="12" height="14" fill="#2e7d32" />
                  <rect x="16" y="8" width="3" height="18" fill="#eceff1" />
                  <rect x="14" y="22" width="7" height="3" fill="#ffd700" />
                  <rect x="3" y="26" width="4" height="8" fill="#b71c1c" />
                  <rect x="9" y="26" width="4" height="8" fill="#b71c1c" />
                </g>
              )}

              {/* Bebia */}
              {charClass === 'Bebia' && (
                <g>
                  <rect x="1" y="-2" width="16" height="14" fill="#f5f5f5" rx="2" />
                  <rect x="4" y="3" width="10" height="8" fill="#ffcc80" />
                  <rect x="5" y="5" width="2" height="2" fill="#212121" />
                  <rect x="11" y="5" width="2" height="2" fill="#212121" />
                  <rect x="7" y="8" width="4" height="2" fill="#e57373" />
                  <rect x="2" y="12" width="14" height="16" fill="#880e4f" />
                  <rect x="5" y="14" width="8" height="14" fill="#ffffff" />
                  <ellipse cx="18" cy="18" rx="7" ry="4" fill="#ffd54f" stroke="#ff9800" strokeWidth="1" />
                  <ellipse cx="18" cy="18" rx="3" ry="2" fill="#fff9c4" />
                  <circle cx="18" cy="18" r="1.5" fill="#ff6f00" />
                  <rect x="4" y="28" width="4" height="6" fill="#424242" />
                  <rect x="10" y="28" width="4" height="6" fill="#424242" />
                </g>
              )}

              {/* Fighter / Sopo */}
              {charClass === 'Fighter' && (
                <g>
                  <polygon points="2,0 4,-5 6,0 9,-6 12,0 14,-5 16,0" fill="#ffd700" />
                  <circle cx="9" cy="-3" r="1.5" fill="#ff1744" />
                  <rect x="2" y="0" width="14" height="12" fill="#3e2723" />
                  <rect x="4" y="2" width="10" height="9" fill="#ffcc80" />
                  <rect x="5" y="4" width="2" height="2" fill="#ff4081" />
                  <rect x="11" y="4" width="2" height="2" fill="#ff4081" />
                  <rect x="7" y="8" width="4" height="1" fill="#e91e63" />
                  <rect x="2" y="12" width="14" height="16" fill="#e91e63" />
                  <polygon points="0,28 18,28 14,14 4,14" fill="#ad1457" />
                  <rect x="5" y="14" width="8" height="3" fill="#ffd700" />
                  <polygon points="19,10 23,10 25,14 21,18 17,14" fill="#00e5ff" filter="url(#pixelGlow)" />
                  <circle cx="21" cy="13" r="2" fill="#ffffff" />
                  <rect x="4" y="28" width="4" height="6" fill="#880e4f" />
                  <rect x="10" y="28" width="4" height="6" fill="#880e4f" />
                </g>
              )}

              {/* Mage */}
              {charClass === 'Mage' && (
                <g>
                  <polygon points="0,2 9,-8 18,2" fill="#4a148c" />
                  <rect x="0" y="0" width="18" height="3" fill="#7b1fa2" />
                  <rect x="7" y="0" width="4" height="3" fill="#ffd700" />
                  <rect x="4" y="3" width="10" height="8" fill="#ffcc80" />
                  <rect x="6" y="5" width="2" height="2" fill="#00e5ff" />
                  <rect x="10" y="5" width="2" height="2" fill="#00e5ff" />
                  <polygon points="4,9 9,16 14,9" fill="#e0e0e0" />
                  <rect x="2" y="12" width="14" height="16" fill="#311b92" />
                  <rect x="6" y="15" width="6" height="13" fill="#512da8" />
                  <rect x="17" y="6" width="3" height="22" fill="#795548" />
                  <circle cx="18.5" cy="5" r="4" fill="#00e5ff" filter="url(#pixelGlow)" />
                  <rect x="17" y="14" width="6" height="8" fill="#ffd700" />
                  <rect x="18" y="15" width="4" height="6" fill="#1a237e" />
                  <rect x="3" y="28" width="4" height="6" fill="#1a237e" />
                  <rect x="11" y="28" width="4" height="6" fill="#1a237e" />
                </g>
              )}

              {/* Rogue */}
              {charClass === 'Rogue' && (
                <g>
                  <rect x="1" y="-1" width="16" height="13" fill="#263238" rx="2" />
                  <rect x="4" y="4" width="10" height="4" fill="#ffcc80" />
                  <rect x="5" y="4" width="3" height="2" fill="#00e5ff" />
                  <rect x="10" y="4" width="3" height="2" fill="#00e5ff" />
                  <rect x="4" y="7" width="10" height="4" fill="#37474f" />
                  <rect x="2" y="12" width="14" height="14" fill="#37474f" />
                  <rect x="3" y="15" width="12" height="3" fill="#8d6e63" />
                  <rect x="7" y="15" width="4" height="3" fill="#ffd700" />
                  <rect x="15" y="14" width="8" height="6" fill="#424242" stroke="#212121" strokeWidth="0.5" />
                  <circle cx="19" cy="17" r="2" fill="#ffd700" />
                  <circle cx="19" cy="17" r="1" fill="#00e5ff" />
                  <rect x="16" y="12" width="3" height="2" fill="#9e9e9e" />
                  <rect x="3" y="26" width="4" height="8" fill="#212121" />
                  <rect x="9" y="26" width="4" height="8" fill="#212121" />
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* 8-Bit Anthem Control Button */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleToggleAnthem}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            backgroundColor: isPlayingAnthem ? '#1b4332' : '#222',
            border: '1px solid #52b788',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#52b788'; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isPlayingAnthem ? '#1b4332' : '#222'; e.currentTarget.style.color = '#fff'; }}
        >
          {isPlayingAnthem ? t.pauseAnthemBtn : t.replayAnthemBtn}
        </button>
      </div>
    </div>
  );
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
  const [goldValues, setGoldValues] = useState<Record<string, number>>({});
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

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
  const [isSopoActive, setIsSopoActive] = useState<boolean>(false);
  const [ultimatePhase, setUltimatePhase] = useState<'NONE' | 'FRIGHTENED' | 'PROPOSING' | 'VANQUISHING' | 'CHASING' | 'FLAG'>('NONE');
  const [bebiaRunnerPos, setBebiaRunnerPos] = useState<Position | null>(null);
  const [sopoRunnerPos, setSopoRunnerPos] = useState<Position | null>(null);
  const [dominickPosition, setDominickPosition] = useState<Position | null>(null);
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
    setLog(prev => [`Bebia: "${displayPhrase}"`, ...prev]);

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
      setLog(prev => [lang === 'en' ? "No enemies to destroy!" : "დასამარცხებელი მტერი არ არის!", ...prev]);
      return;
    }

    setIsBebiaActive(true);
    setUltimatePhase('FRIGHTENED');
    setLog(prev => [lang === 'en' ? "🔥 Bebia Ultimate Activated! 🇬🇪" : "🔥 ბებიას ძალა გააქტიურებულია! 🇬🇪", ...prev]);
    setLog(prev => [lang === 'en' ? "😱 Monsters are terrified! They run frantically!" : "😱 მონსტრები შეშინდნენ! ისინი გიჟივით დარბიან!", ...prev]);

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
            setLog(prev => [lang === 'en' ? "✨ Golden dust settles. Gold spawned where enemies fell!" : "✨ ოქრო გაჩნდა იქ, სადაც მტრები დაეცნენ!", ...prev]);
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
          const isBoss = enemy.isBoss;
          setGoldValues(prev => ({
            ...prev,
            [`${enemy.x},${enemy.y}`]: isBoss ? 50 : Math.floor(Math.random() * 16) + (10 + currentLevel * 2)
          }));

          // Play audio voice
          playBebiaVoice();

          // Update game score/kills and logs
          setMonstersKilled(prev => prev + 1);
          setScore(prev => prev + (isBoss ? 100 : 20));
          if (isBoss) {
            setLog(prev => [
              lang === 'en'
                ? "🏆 The Vault Warlord was pulverized by Bebia's supreme power! (+100 pts) Exit unlocked!"
                : "🏆 ვაულტის მბრძანებელი განადგურდა ბებიას უზენაესი ძალით! (+100 ქულა) გასასვლელი ღიაა!",
              ...prev
            ]);
          } else {
            setLog(prev => [lang === 'en' ? "💥 Exploded enemy into gold!" : "💥 მტერი ოქროდ იქცა!", ...prev]);
          }

          // Remove enemy from state
          setEnemies(prev => prev.filter(e => e.id !== enemy.id));
        }

        currentStepIndex++;
      }, 180);
    }, 2800);
  }, [gameState, isAnimating, isBebiaActive, enemies, lang, grid, playerPosition, getBresenhamPath, playBebiaVoice]);

  const triggerSopoUltimate = useCallback(() => {
    if (gameState !== 'PLAYING' || isAnimating || isSopoActive) return;
    if (enemies.length === 0) {
      setLog(prev => [lang === 'en' ? "No targets to propose to!" : "მოსახიბლი მტერი არ არის!", ...prev]);
      return;
    }

    setIsSopoActive(true);
    setUltimatePhase('FRIGHTENED');
    setLog(prev => [
      lang === 'en' 
        ? "💍 Sopo Proposal Ultimate Activated! 💖" 
        : "💍 სოფოს ძალა გააქტიურებულია! 💖", 
      ...prev
    ]);
    setLog(prev => [
      lang === 'en' 
        ? "😍 Monsters are charmed by Sopo's beauty and grace! They wander in awe!" 
        : "😍 მონსტრები მოიხიბლნენ სოფოს სილამაზითა და მადლით! ისინი გაოცებულები დადიან!", 
      ...prev
    ]);

    try {
      if (audioSopoWinsRef.current) {
        audioSopoWinsRef.current.currentTime = 0;
        audioSopoWinsRef.current.play()
          .then(() => setIsSopoAudioPlaying(true))
          .catch(e => console.warn("Failed to play Sopo ultimate sound:", e));
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }

    // Spawn Dominick 🤵 at closest open cell to center (7,7)
    let domX = 7, domY = 7;
    let foundCell = false;
    const queue: Position[] = [{ x: 7, y: 7 }];
    const visited = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    visited[7][7] = true;
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (
        grid[curr.y] &&
        grid[curr.y][curr.x] === '.' &&
        !(curr.x === playerPosition.x && curr.y === playerPosition.y) &&
        !enemies.some(e => e.x === curr.x && e.y === curr.y)
      ) {
        domX = curr.x;
        domY = curr.y;
        foundCell = true;
        break;
      }
      const neighbors = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x - 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 }
      ];
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && !visited[n.y][n.x]) {
          visited[n.y][n.x] = true;
          queue.push(n);
        }
      }
    }
    const domPos = foundCell ? { x: domX, y: domY } : { x: 7, y: 7 };
    setDominickPosition(domPos);

    // Start charmed sway movement interval
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
            if (grid[ny] && grid[ny][nx] !== '#' && !(nx === playerPosition.x && ny === playerPosition.y) && !(nx === domPos.x && ny === domPos.y)) {
              return { ...e, x: nx, y: ny };
            }
          }
          return e;
        })
      );
    }, 200);

    // After 2.8 seconds of charmed walking, proceed to proposing phase
    setTimeout(() => {
      clearInterval(intervalId);
      setUltimatePhase('PROPOSING');

      // Calculate path from Sopo's current position to Dominick's position
      const segmentToDom = getBresenhamPath(playerPosition.x, playerPosition.y, domPos.x, domPos.y);
      const pathToDom = [...segmentToDom];
      // Pop last step if it exactly lands on Dominick so Sopo stops adjacent to him
      if (pathToDom.length > 0 && pathToDom[pathToDom.length - 1].x === domPos.x && pathToDom[pathToDom.length - 1].y === domPos.y) {
        pathToDom.pop();
      }

      let stepIdx = 0;
      setSopoRunnerPos(playerPosition);

      const runToDomInterval = setInterval(() => {
        if (stepIdx >= pathToDom.length) {
          clearInterval(runToDomInterval);
          
          // Reach proposal spot: kneel and propose!
          setLog(prev => [
            lang === 'en' 
              ? "💍 Sopo drops to one knee and proposes to Dominick!" 
              : "💍 სოფო მუხლზე იჩოქებს და დომინიკს ხელს სთხოვს!", 
            ...prev
          ]);
          playLaserSound(); // chime sound

          // Wait 1.5 seconds in proposal stance, then transition to vanquishing!
          setTimeout(() => {
            // Transition to Phase 3: Vanquishing!
            setUltimatePhase('VANQUISHING');
            setLog(prev => [
              lang === 'en' 
                ? "😭 The love-struck enemies fall to their knees in despair as Sopo vanquishes them!" 
                : "😭 სიყვარულით დაზაფრული მტრები მუხლებზე ეცემიან სასოწარკვეთილებაში, როცა სოფო მათ ამარცხებს!", 
              ...prev
            ]);

            const currentEnemies = enemiesRef.current;
            if (currentEnemies.length === 0) {
              setIsSopoActive(false);
              setUltimatePhase('NONE');
              setDominickPosition(null);
              return;
            }

            // Path starting from current proposal position (end of pathToDom or playerPosition)
            const finalProposalPos = pathToDom.length > 0 ? pathToDom[pathToDom.length - 1] : playerPosition;
            let currentLoc = { ...finalProposalPos };
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

            // Build path visiting all enemies
            let pathSteps: Position[] = [];
            let lastPos = { ...finalProposalPos };
            orderedTargets.forEach(target => {
              const segment = getBresenhamPath(lastPos.x, lastPos.y, target.x, target.y);
              pathSteps = [...pathSteps, ...segment, { x: target.x, y: target.y }];
              lastPos = { x: target.x, y: target.y };
            });

            let currentStepIndex = 0;
            let remainingEnemies = [...currentEnemies];

            const stepInterval = setInterval(() => {
              if (currentStepIndex >= pathSteps.length) {
                clearInterval(stepInterval);
                setSopoRunnerPos(null);
                setDominickPosition(null);
                setUltimatePhase('FLAG');

                const minCardDisplayMs = 10000;
                const cardShowTime = Date.now();
                let hasEnded = false;
                const endUltimate = () => {
                  if (hasEnded) return;
                  hasEnded = true;
                  if (audioSopoWinsRef.current) {
                    audioSopoWinsRef.current.onended = null;
                  }
                  setIsSopoActive(false);
                  setUltimatePhase('NONE');
                  setIsSopoAudioPlaying(false);
                  
                  const elapsed = Date.now() - cardShowTime;
                  setLog(prev => [
                    lang === 'en' 
                      ? `✨ Sopo is unmatched in Beauty or Battle! (Card shown for ${(elapsed / 1000).toFixed(1)}s)` 
                      : `✨ სოფო შეუდარებელია სილამაზესა და ბრძოლაში! (ბარათი გამოჩნდა ${(elapsed / 1000).toFixed(1)}წმ)`, 
                    ...prev
                  ]);
                };

                const tryDismiss = () => {
                  const elapsed = Date.now() - cardShowTime;
                  if (elapsed >= minCardDisplayMs) {
                    endUltimate();
                  } else {
                    setTimeout(endUltimate, minCardDisplayMs - elapsed);
                  }
                };

                if (audioSopoWinsRef.current && !audioSopoWinsRef.current.paused && !audioSopoWinsRef.current.ended) {
                  audioSopoWinsRef.current.onended = () => {
                    tryDismiss();
                  };
                  // Safety timer to prevent ultimate getting stuck in case of event loss
                  setTimeout(tryDismiss, 30000);
                } else {
                  // Fallback if audio is muted or blocked: show card for exactly 10 seconds
                  setTimeout(endUltimate, minCardDisplayMs);
                }
                return;
              }

              const nextPos = pathSteps[currentStepIndex];
              setSopoRunnerPos(nextPos);

              const hitEnemyIdx = remainingEnemies.findIndex(e => e.x === nextPos.x && e.y === nextPos.y);
              if (hitEnemyIdx !== -1) {
                const enemy = remainingEnemies[hitEnemyIdx];
                remainingEnemies.splice(hitEnemyIdx, 1);

                // Trigger heart explosion
                setExplosionPositions(prev => [...prev, { x: enemy.x, y: enemy.y }]);
                setTimeout(() => {
                  setExplosionPositions(prev => prev.filter(pos => !(pos.x === enemy.x && pos.y === enemy.y)));
                }, 250);

                // Turn enemy spot to heart G
                setGrid(prevGrid => {
                  const newGrid = prevGrid.map((row, y) =>
                    row.map((cell, x) => (x === enemy.x && y === enemy.y ? 'G' : cell))
                  );
                  return newGrid;
                });
                const isBoss = enemy.isBoss;
                setGoldValues(prev => ({
                  ...prev,
                  [`${enemy.x},${enemy.y}`]: isBoss ? 50 : Math.floor(Math.random() * 16) + (10 + currentLevel * 2)
                }));

                // Play sound
                playLaserSound();

                // Update score & log
                setMonstersKilled(prev => prev + 1);
                setScore(prev => prev + (isBoss ? 100 : 20));
                if (isBoss) {
                  setLog(prev => [
                    lang === 'en'
                      ? "🏆 The Vault Warlord was overwhelmed by Sopo's love & grace! (+100 pts) Exit unlocked!"
                      : "🏆 ვაულტის მბრძანებელი მოიხიბლა სოფოს სიყვარულით და დაეცა! (+100 ქულა) გასასვლელი ღიაა!",
                    ...prev
                  ]);
                } else {
                  setLog(prev => [
                    lang === 'en' 
                      ? "💥 Invader vanquished by Sopo's unmatched grace! (+20 pts)" 
                      : "💥 დამპყრობელი განადგურდა სოფოს შეუდარებელი მადლით! (+20 ქულა)", 
                    ...prev
                  ]);
                }

                // Remove enemy
                setEnemies(prev => prev.filter(e => e.id !== enemy.id));
              }

              currentStepIndex++;
            }, 180);

          }, 1500);
          return;
        }

        setSopoRunnerPos(pathToDom[stepIdx]);
        stepIdx++;
      }, 180);

    }, 2800);
  }, [gameState, isAnimating, isSopoActive, enemies, lang, grid, playerPosition, getBresenhamPath, playLaserSound, audioSopoWinsRef, setIsSopoAudioPlaying]);



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

    const newEnemies: Enemy[] = [];
    if (level === TOTAL_LEVELS) {
      // Spawn Level 5 Boss (Vault Warlord)
      let bx = GRID_SIZE - 2;
      let by = GRID_SIZE - 2;
      let bAttempts = 0;
      do {
        bx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        by = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
        bAttempts++;
      } while (
        (newGrid[by][bx] !== '.' ||
          (bx === 1 && by === 1) ||
          (bx === exitX && by === exitY) ||
          Math.abs(bx - 1) + Math.abs(by - 1) < 6 ||
          !hasValidPath(newGrid, 1, 1, bx, by)) &&
        bAttempts < 100
      );

      newEnemies.push({
        id: 'boss-5',
        x: bx,
        y: by,
        hp: 180,
        maxHp: 180,
        atk: 18,
        isBoss: true,
      });

      // Spawn 2 Elite Guards
      for (let i = 0; i < 2; i++) {
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
            (ex === bx && ey === by) ||
            !hasValidPath(newGrid, 1, 1, ex, ey)) &&
          eAttempts < 100
        );

        newEnemies.push({
          id: `${level}-guard-${i}`,
          x: ex,
          y: ey,
          hp: 35,
          maxHp: 35,
          atk: 10,
          isBoss: false,
        });
      }
    } else {
      // Standard enemies for levels 1-4
      const enemyCount = 3 + level;
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

        const baseHp = 20 + level * 8;
        const hpVariance = Math.floor(Math.random() * (level * 4 + 7)) - Math.floor(level * 2);
        const randomizedHp = Math.max(12, baseHp + hpVariance);

        const baseAtk = 6 + level * 2;
        const atkVariance = Math.floor(Math.random() * 5) - 2;
        const randomizedAtk = Math.max(3, baseAtk + atkVariance);

        newEnemies.push({
          id: `${level}-${i}`,
          x: ex,
          y: ey,
          hp: randomizedHp,
          maxHp: randomizedHp,
          atk: randomizedAtk,
          isBoss: false,
        });
      }
    }

    // Spawn gold pieces
    const goldCount = 4 + level;
    const newGoldValues: Record<string, number> = {};
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
        newGoldValues[`${gx},${gy}`] = Math.floor(Math.random() * 16) + (8 + level * 2);
      }
    }

    setGrid(newGrid);
    setEnemies(newEnemies);
    setGoldValues(newGoldValues);
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
      const isAdjacent = Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0);

      // 1. Melee attack if adjacent (either cardinally or diagonally)
      if (isAdjacent) {
        const dmg = Math.max(1, enemy.atk - playerStats.def);
        currentHp = Math.max(0, currentHp - dmg);
        nextLogs.push(enemy.isBoss ? currentT.bossStrikeLog(dmg) : currentT.ambushLog(dmg));
        return enemy;
      }

      // 2. Chase player if within range (Chebyshev distance <= 5, or 8 for Boss)
      const chebyshevDist = Math.max(Math.abs(dx), Math.abs(dy));
      const maxDetectRange = enemy.isBoss ? 8 : 5;
      if (chebyshevDist <= maxDetectRange) {
        const moveX = dx !== 0 ? Math.sign(dx) : 0;
        const moveY = dy !== 0 ? Math.sign(dy) : 0;
        
        // Try the direct diagonal step first
        const nextX = enemy.x + moveX;
        const nextY = enemy.y + moveY;

        const occupied = currentEnemiesList.some(e => e.id !== enemy.id && e.x === nextX && e.y === nextY);

        if (grid[nextY] && (grid[nextY][nextX] === '.' || grid[nextY][nextX] === 'S' || grid[nextY][nextX] === 'G') && !(nextX === pX && nextY === pY) && !occupied) {
          return { ...enemy, x: nextX, y: nextY };
        } else {
          // If the diagonal move is blocked, try cardinal movements as alternative steps (X first, then Y)
          const altX = enemy.x + moveX;
          const altY = enemy.y;
          const altOccupied1 = currentEnemiesList.some(e => e.id !== enemy.id && e.x === altX && e.y === altY);
          if (grid[altY] && (grid[altY][altX] === '.' || grid[altY][altX] === 'S' || grid[altY][altX] === 'G') && !(altX === pX && altY === pY) && !altOccupied1) {
            return { ...enemy, x: altX, y: altY };
          }

          const altX2 = enemy.x;
          const altY2 = enemy.y + moveY;
          const altOccupied2 = currentEnemiesList.some(e => e.id !== enemy.id && e.x === altX2 && e.y === altY2);
          if (grid[altY2] && (grid[altY2][altX2] === '.' || grid[altY2][altX2] === 'S' || grid[altY2][altX2] === 'G') && !(altX2 === pX && altY2 === pY) && !altOccupied2) {
            return { ...enemy, x: altX2, y: altY2 };
          }
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
      setLog(prev => [...nextLogs, ...prev]);
    }
  }, [playerStats.hp, playerStats.def, grid, lang]);

  // --- COMBAT RESOLUTION (Melee Collision) ---
  const resolveCombat = (index: number) => {
    const updatedEnemies = [...enemies];
    const target = updatedEnemies[index];

    const playerDamage = Math.max(1, playerStats.atk - Math.floor(Math.random() * 4));
    target.hp -= playerDamage;
    let nextLog = [target.isBoss ? t.bossHitLog(playerDamage) : t.hitLog(playerDamage)];

    if (target.hp <= 0) {
      if (target.isBoss) {
        nextLog.unshift(t.bossDefeatedLog);
        setScore(prev => prev + 100);

        // Spawn 4 high-value gold drops in surrounding adjacent floor tiles
        const adjacentDeltas = [
          [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
        ];
        const lootTiles: [number, number][] = [];
        for (const [dx, dy] of adjacentDeltas) {
          const lx = target.x + dx;
          const ly = target.y + dy;
          if (grid[ly] && grid[ly][lx] === '.') {
            lootTiles.push([lx, ly]);
            if (lootTiles.length >= 4) break;
          }
        }
        if (lootTiles.length > 0) {
          setGrid(prevGrid => prevGrid.map((row, y) =>
            row.map((cell, x) => (lootTiles.some(([lx, ly]) => lx === x && ly === y) ? 'G' : cell))
          ));
          setGoldValues(prev => {
            const added: Record<string, number> = {};
            lootTiles.forEach(([lx, ly]) => {
              added[`${lx},${ly}`] = Math.floor(Math.random() * 20) + 25;
            });
            return { ...prev, ...added };
          });
        }
      } else {
        nextLog.unshift(t.enemyDefeatedLog);
        setScore(prev => prev + 20);
      }

      updatedEnemies.splice(index, 1);
      setMonstersKilled(prev => prev + 1);

      // Bebia turns monsters to gold!
      if (playerStats.class === 'Bebia' && !target.isBoss) {
        setGrid(prevGrid => prevGrid.map((row, y) =>
          row.map((cell, x) => (x === target.x && y === target.y ? 'G' : cell))
        ));
        setGoldValues(prev => ({
          ...prev,
          [`${target.x},${target.y}`]: Math.floor(Math.random() * 16) + (10 + currentLevel * 2)
        }));
      }
    } else {
      const enemyDamage = Math.max(1, target.atk - playerStats.def);
      const newHp = Math.max(0, playerStats.hp - enemyDamage);
      playerStats.hp = newHp;
      nextLog.unshift(target.isBoss ? t.bossStrikeLog(enemyDamage) : t.enemyStrikeLog(enemyDamage));

      if (newHp <= 0) {
        setGameState('DEFEAT');
      }
    }

    setEnemies(updatedEnemies);
    setPlayerStats({ ...playerStats });
    setLog(prev => [...nextLog, ...prev]);
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
      const gKey = `${newX},${newY}`;
      const gVal = goldValues[gKey] || (10 + currentLevel * 2);
      setGoldCollected(prev => prev + 1);
      setScore(prev => prev + gVal);
      setLog(prev => [t.goldCollectedLog(gVal), ...prev]);
      setGoldValues(prev => {
        const copy = { ...prev };
        delete copy[gKey];
        return copy;
      });
      nextGrid = grid.map((row, y) =>
        row.map((cell, x) => (x === newX && y === newY ? '.' : cell))
      );
      setGrid(nextGrid);
    }

    if (nextGrid[newY] && nextGrid[newY][newX] === 'S') {
      const isBossAlive = enemies.some(e => e.isBoss);
      if (currentLevel === TOTAL_LEVELS && isBossAlive) {
        setLog(prev => [t.bossExitSealedLog, ...prev]);
        return;
      }
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
      setLog(prev => [t.losBlockedLog, ...prev]);
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
              if (target.isBoss) {
                nextLog.unshift(t.bossDefeatedLog);
                setScore(prev => prev + 100);

                const adjacentDeltas = [
                  [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
                ];
                const lootTiles: [number, number][] = [];
                for (const [dx, dy] of adjacentDeltas) {
                  const lx = target.x + dx;
                  const ly = target.y + dy;
                  if (grid[ly] && grid[ly][lx] === '.') {
                    lootTiles.push([lx, ly]);
                    if (lootTiles.length >= 4) break;
                  }
                }
                if (lootTiles.length > 0) {
                  setGrid(prevGrid => prevGrid.map((row, y) =>
                    row.map((cell, x) => (lootTiles.some(([lx, ly]) => lx === x && ly === y) ? 'G' : cell))
                  ));
                  setGoldValues(prev => {
                    const added: Record<string, number> = {};
                    lootTiles.forEach(([lx, ly]) => {
                      added[`${lx},${ly}`] = Math.floor(Math.random() * 20) + 25;
                    });
                    return { ...prev, ...added };
                  });
                }
              } else {
                nextLog.unshift(t.enemyDefeatedLog);
                setScore(prev => prev + 20);
              }

              latestEnemiesList.splice(currEnemyIndex, 1);
              setMonstersKilled(prev => prev + 1);

              // Bebia turns monsters to gold!
              if (playerStats.class === 'Bebia' && !target.isBoss) {
                setGrid(prevGrid => prevGrid.map((row, y) =>
                  row.map((cell, x) => (x === target.x && y === target.y ? 'G' : cell))
                ));
                setGoldValues(prev => ({
                  ...prev,
                  [`${target.x},${target.y}`]: Math.floor(Math.random() * 16) + (10 + currentLevel * 2)
                }));
              }
            }

            setEnemies(latestEnemiesList);
            setLog(prev => [...nextLog, ...prev]);
            processEnemyTurns(playerPosition.x, playerPosition.y, latestEnemiesList);
          }

          setIsAnimating(false);
          setProjectileColor('');
        }, 150);
      }
    };
    animate();
  }, [gameState, playerStats.class, playerStats.atk, playerPosition, grid, enemies, hasLineOfSight, getBresenhamPath, processEnemyTurns, lang, isAnimating, playLaserSound, playBebiaVoice, currentLevel]);

  // --- AUTO TARGET NEAREST ---
  const fireAtNearest = useCallback(() => {
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive) return;

    const validEnemies = enemies.filter(enemy => {
      return hasLineOfSight(playerPosition.x, playerPosition.y, enemy.x, enemy.y, grid);
    });

    if (validEnemies.length === 0) {
      setLog(prev => [t.noTargetsLog, ...prev]);
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
              if (target.isBoss) {
                nextLogEntries.push(t.bossDefeatedLog);
                setScore(prev => prev + 100);
              } else {
                nextLogEntries.push(t.enemyDefeatedLog);
                setScore(prev => prev + 20);
              }

              updatedEnemies.splice(enemyIndex, 1);
              setMonstersKilled(prev => prev + 1);
            });

            setGrid(currentGrid);
            setEnemies(updatedEnemies);
            setGoldValues(prev => {
              const updated = { ...prev };
              for (const enemy of validEnemies) {
                updated[`${enemy.x},${enemy.y}`] = enemy.isBoss ? 50 : Math.floor(Math.random() * 16) + (10 + currentLevel * 2);
              }
              return updated;
            });
            setLog(prev => [...nextLogEntries, ...prev]);
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
    if (gameState !== 'PLAYING' || isAnimating || isBebiaActive || isSopoActive) return;
    const clickedEnemy = enemies.find(e => e.x === x && e.y === y);
    if (clickedEnemy) {
      handleRangedAttack(clickedEnemy);
    }
  };

  // --- CELL HOVER TOOLTIP HELPER ---
  const getCellTooltip = (x: number, y: number) => {
    // 1. Player check
    if (x === playerPosition.x && y === playerPosition.y) {
      const pName = getClassName(playerStats.class, lang);
      const wName = getWeaponName(playerStats.class, lang);
      if (lang === 'en') {
        return {
          title: `${getClassEmoji(playerStats.class)} ${pName}`,
          subtitle: `Player Character`,
          stats: `HP: ${playerStats.hp}/${playerStats.maxHp} | ATK: ${playerStats.atk} | DEF: ${playerStats.def}`,
          extra: `Weapon: ${wName}`,
          accent: '#00e5ff'
        };
      } else {
        return {
          title: `${getClassEmoji(playerStats.class)} ${pName}`,
          subtitle: `მოთამაშე`,
          stats: `სიცოცხლე: ${playerStats.hp}/${playerStats.maxHp} | შეტევა: ${playerStats.atk} | დაცვა: ${playerStats.def}`,
          extra: `იარაღი: ${wName}`,
          accent: '#00e5ff'
        };
      }
    }

    // 2. Enemy check
    const enemy = enemies.find(e => e.x === x && e.y === y);
    if (enemy) {
      const glyph = getEnemyGlyph(currentLevel, enemy.id, enemy.isBoss);
      const enemyName = getEnemyName(currentLevel, lang, enemy.isBoss);
      if (lang === 'en') {
        return {
          title: `${glyph} ${enemyName}`,
          subtitle: enemy.isBoss ? `Final Dungeon Master` : (currentLevel === TOTAL_LEVELS ? `Elite Minion` : `Invader`),
          stats: `HP: ${enemy.hp}/${enemy.maxHp || enemy.hp} | ATK: ${enemy.atk}`,
          extra: enemy.isBoss ? `Defeat to unlock the exit portal!` : `Click or press Space/F to attack`,
          accent: enemy.isBoss ? '#ff0055' : '#ff1744'
        };
      } else {
        return {
          title: `${glyph} ${enemyName}`,
          subtitle: enemy.isBoss ? `მთავარი ბოსი` : (currentLevel === TOTAL_LEVELS ? `ელიტური მცველი` : `დამპყრობელი`),
          stats: `სიცოცხლე: ${enemy.hp}/${enemy.maxHp || enemy.hp} | შეტევა: ${enemy.atk}`,
          extra: enemy.isBoss ? `დაამარცხეთ გასასვლელის გასახსნელად!` : `დააჭირეთ ან გამოიყენეთ Space/F შეტევისთვის`,
          accent: enemy.isBoss ? '#ff0055' : '#ff1744'
        };
      }
    }

    // 3. Dominick (during Sopo proposal sequence)
    if (dominickPosition && dominickPosition.x === x && dominickPosition.y === y) {
      return {
        title: `🤵 Dominick`,
        subtitle: lang === 'en' ? `Sopo's Groom` : `სოფოს რჩეული`,
        stats: lang === 'en' ? `The greatest adventure` : `უდიდესი თავგადასავალი`,
        extra: lang === 'en' ? `Destined for ultimate victory` : `საბოლოო გამარჯვება`,
        accent: '#ff69b4'
      };
    }

    // 4. Gold / Heart drop check
    const cell = grid[y] ? grid[y][x] : '';
    if (cell === 'G') {
      const gVal = goldValues[`${x},${y}`] || (10 + currentLevel * 2);
      const isHeart = playerStats.class === 'Fighter';
      if (lang === 'en') {
        return {
          title: isHeart ? `❤️ Heart Token` : `💰 Gold Treasure`,
          subtitle: isHeart ? `Love Token` : `Dungeon Loot`,
          stats: `Value: +${gVal} pts`,
          extra: isHeart ? `Step to collect love & points` : `Step here to collect gold`,
          accent: isHeart ? '#ff69b4' : '#ffd700'
        };
      } else {
        return {
          title: isHeart ? `❤️ სიყვარულის სიმბოლო` : `💰 ოქროს განძი`,
          subtitle: isHeart ? `სიყვარულის ძალა` : `დუნჯის ნადავლი`,
          stats: `ღირებულება: +${gVal} ქულა`,
          extra: `დაადექით შესაგროვებლად`,
          accent: isHeart ? '#ff69b4' : '#ffd700'
        };
      }
    }

    // 5. Stairs check
    if (cell === 'S') {
      const isVictory = currentLevel === TOTAL_LEVELS;
      const isBossAlive = enemies.some(e => e.isBoss);
      if (isVictory && isBossAlive) {
        if (lang === 'en') {
          return {
            title: `🔒 Sealed Portal`,
            subtitle: `Blocked by dark magic`,
            stats: `Requirement: Slay Vault Warlord`,
            extra: `Defeat the Boss to break the seal!`,
            accent: '#ff1744'
          };
        } else {
          return {
            title: `🔒 დაბლოკილი პორტალი`,
            subtitle: `შებოჭილია ბნელი მაგიით`,
            stats: `მოთხოვნა: ბოსის განადგურება`,
            extra: `დაამარცხეთ ბოსი ბეჭდის გასატეხად!`,
            accent: '#ff1744'
          };
        }
      }
      if (lang === 'en') {
        return {
          title: isVictory ? `🏆 Vault Exit` : `🚪 Dungeon Stairs`,
          subtitle: isVictory ? `Escape the dungeon!` : `Descend deeper`,
          stats: isVictory ? `Goal: Victory!` : `Target: Level ${currentLevel + 1}`,
          extra: `Step here to proceed`,
          accent: '#ffea00'
        };
      } else {
        return {
          title: isVictory ? `🏆 გასასვლელი` : `🚪 ვაულტის კიბე`,
          subtitle: isVictory ? `გაქცევა ვაულტიდან!` : `ჩასვლა სიღრმეში`,
          stats: isVictory ? `მიზანი: გამარჯვება!` : `მიზანი: დონე ${currentLevel + 1}`,
          extra: `დაადექით გასაგრძელებლად`,
          accent: '#ffea00'
        };
      }
    }

    // 6. Wall check
    if (cell === '#') {
      return {
        title: lang === 'en' ? `🧱 Stone Wall` : `🧱 ქვის კედელი`,
        subtitle: lang === 'en' ? `Obstacle` : `დაბრკოლება`,
        stats: lang === 'en' ? `Impassable` : `გაუვალი`,
        extra: lang === 'en' ? `Blocks movement & line of sight` : `ბლოკავს მოძრაობას და ხედვას`,
        accent: '#888888'
      };
    }

    return null;
  };

  // Keyboard navigation mappings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || isAnimating || isBebiaActive || isSopoActive) return;
      switch (e.key) {
        case 'ArrowUp':    case 'w': case '8': handleMove(0, -1); break;
        case 'ArrowDown':  case 's': case '2': handleMove(0, 1);  break;
        case 'ArrowLeft':  case 'a': case '4': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': case '6': handleMove(1, 0);  break;
        case 'q':          case '7': handleMove(-1, -1); break;
        case 'e':          case '9': handleMove(1, -1);  break;
        case 'z':          case '1': handleMove(-1, 1);  break;
        case 'c':          case '3': handleMove(1, 1);   break;
        case 'f':          case ' ': e.preventDefault(); fireAtNearest(); break;
        case 'b':          case 'g':          case 'p':
          if (playerStats.class === 'Bebia' || playerStats.class === 'Rene' || playerStats.class === 'Sandro') triggerBebiaUltimate();
          else if (playerStats.class === 'Fighter') triggerSopoUltimate();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, gameState, enemies, grid, playerStats, fireAtNearest, isAnimating, isBebiaActive, isSopoActive, triggerBebiaUltimate, triggerSopoUltimate]);

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

        <h1 style={{ ...styles.title, color: '#4caf50', marginBottom: '8px' }}>
          {t.congrats} {getClassName(playerClass, lang).toUpperCase()}
        </h1>

        <GeorgianHillVictoryScene charClass={playerClass} lang={lang} />

        <div style={{ fontSize: '1.2rem', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
          <div style={{ color: '#ffd700' }}>{t.goldCollected}: <strong>{goldCollected}</strong></div>
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
          <div style={{ color: '#ffd700' }}>{t.goldCollected}: <strong>{goldCollected}</strong></div>
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
        @keyframes card-zoom-in {
          0% { transform: scale(0.1); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
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
        @keyframes sopo-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes sopo-flash {
          0% { background-color: rgba(255, 105, 180, 0.35); }
          50% { background-color: rgba(255, 255, 255, 0.35); }
          100% { background-color: rgba(255, 105, 180, 0.35); }
        }
        .sopo-loving-grid {
          animation: sopo-pulse 1s infinite ease-in-out !important;
          position: relative !important;
        }
        .sopo-overlay-flash {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          animation: sopo-flash 0.5s infinite !important;
          pointer-events: none !important;
          z-index: 10 !important;
        }
        .sopo-proposal-container {
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
          animation: card-zoom-in 0.5s ease-out forwards !important;
          filter: drop-shadow(0 0 20px rgba(255, 105, 180, 0.6)) !important;
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
        
        {(playerClass === 'Bebia' || playerClass === 'Rene' || playerClass === 'Sandro' || playerClass === 'Fighter') && (
          <button
            onClick={playerClass === 'Fighter' ? triggerSopoUltimate : triggerBebiaUltimate}
            disabled={(playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0}
            className="bebia-ultimate-btn"
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: (playerClass === 'Fighter' ? isSopoActive : isBebiaActive) ? '#ff1744' : '#111',
              color: (playerClass === 'Fighter' ? isSopoActive : isBebiaActive) ? '#fff' : (playerClass === 'Fighter' ? '#ff69b4' : '#00e5ff'),
              border: playerClass === 'Fighter' ? '2px solid #ff69b4' : '2px solid #00e5ff',
              borderRadius: '6px',
              cursor: ((playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginTop: '15px',
              width: '100%',
              textAlign: 'center',
              boxShadow: playerClass === 'Fighter' ? '0 0 10px rgba(255,105,180,0.3)' : '0 0 10px rgba(0,229,255,0.3)',
              animation: ((playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0) ? 'none' : 'pulsate 2s infinite',
              opacity: enemies.length === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              fontFamily: 'monospace',
            }}
          >
            {playerClass === 'Fighter' 
              ? (isSopoActive ? t.sopoActive : t.sopoUltimate) 
              : (isBebiaActive ? t.bebiaActive : t.bebiaUltimate)}
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
        className={`grid-container ${isBebiaActive ? 'bebia-crashing-grid' : isSopoActive ? 'sopo-loving-grid' : ''}`} 
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

        {/* Boss Health Bar Banner (Level 5) */}
        {currentLevel === TOTAL_LEVELS && (() => {
          const boss = enemies.find(e => e.isBoss);
          if (!boss) {
            return (
              <div
                style={{
                  background: 'rgba(76, 175, 80, 0.15)',
                  border: '1px solid #4caf50',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  marginBottom: '14px',
                  color: '#4caf50',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(76, 175, 80, 0.3)'
                }}
              >
                <span>✨</span>
                <span>{lang === 'en' ? '🏆 BOSS DEFEATED — EXIT PORTAL UNLOCKED!' : '🏆 ბოსი დამარცხებულია — პორტალი ღიაა!'}</span>
                <span>✨</span>
              </div>
            );
          }

          const hpPct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));

          return (
            <div
              style={{
                width: '90%',
                maxWidth: '460px',
                background: 'rgba(20, 0, 0, 0.85)',
                border: '2px solid #ff1744',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '14px',
                boxShadow: '0 0 20px rgba(255, 23, 68, 0.4), inset 0 0 10px rgba(255, 23, 68, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                fontFamily: 'monospace',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', color: '#ff5252' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px' }}>👹</span>
                  <span>{lang === 'en' ? 'VAULT WARLORD' : 'ვაულტის მბრძანებელი'}</span>
                </span>
                <span style={{ color: '#fff' }}>{boss.hp} / {boss.maxHp} HP</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#330000', borderRadius: '5px', overflow: 'hidden', border: '1px solid #ff1744' }}>
                <div
                  style={{
                    width: `${hpPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff1744, #ff5252, #ffd700)',
                    transition: 'width 0.25s ease-out'
                  }}
                />
              </div>
            </div>
          );
        })()}

        {(isBebiaActive || isSopoActive) && (
          <>
            <div className={isBebiaActive ? "bebia-overlay-flash" : "sopo-overlay-flash"} />
            {ultimatePhase === 'FLAG' && (
              isBebiaActive ? (
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
              ) : (
                <div className="sopo-proposal-container">
                  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                    <defs>
                      <radialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff0f5" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ffe4e1" stopOpacity="0.95" />
                      </radialGradient>
                    </defs>
                    <rect width="300" height="200" fill="url(#heartGrad)" rx="15" stroke="#ff69b4" strokeWidth="3" />
                    <path d="M150 140 C110 95, 80 65, 80 40 C80 20, 95 5, 115 5 C130 5, 142 15, 150 25 C158 15, 170 5, 185 5 C205 5, 220 20, 220 40 C220 65, 190 95, 150 140 Z" fill="#ffb6c1" opacity="0.3" />
                    <circle cx="130" cy="75" r="24" stroke="#ffd700" strokeWidth="6" fill="none" filter="drop-shadow(0 0 3px rgba(255,215,0,0.8))" />
                    <rect x="124" y="46" width="12" height="7" rx="2" fill="#00e5ff" filter="drop-shadow(0 0 4px #00e5ff)" />
                    <circle cx="170" cy="75" r="24" stroke="#ffa500" strokeWidth="6" fill="none" filter="drop-shadow(0 0 3px rgba(255,165,0,0.8))" />
                    <text x="110" y="82" fontSize="22" textAnchor="middle">👑</text>
                    <text x="190" y="82" fontSize="22" textAnchor="middle">🤵</text>
                    <text x="150" y="82" fontSize="20" textAnchor="middle">💖</text>
                    <text x="150" y="140" fill="#d6336c" fontSize="12" fontWeight="bold" fontFamily="Georgia, serif" textAnchor="middle">
                      {t.sopoProclamation}
                    </text>
                    <text x="150" y="160" fill="#4a4a4a" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      {t.sopoProclamationSubtitle1}
                    </text>
                    <text x="150" y="176" fill="#4a4a4a" fontSize="8" fontFamily="monospace" textAnchor="middle">
                      {t.sopoProclamationSubtitle2}
                    </text>
                  </svg>
                </div>
              )
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
              const isSopoRunner = sopoRunnerPos && sopoRunnerPos.x === x && sopoRunnerPos.y === y;
              const isDominick = dominickPosition && dominickPosition.x === x && dominickPosition.y === y;

              if (isRunner) {
                glyph = '🇬🇪';
                color = '#ffd700';
              } else if (isSopoRunner) {
                glyph = ultimatePhase === 'PROPOSING' ? '🧎‍♀️' : '💍';
                color = '#ff69b4';
              } else if (isDominick) {
                glyph = '🤵';
                color = '#00e5ff';
              } else if (x === playerPosition.x && y === playerPosition.y) {
                if ((playerClass === 'Bebia' || playerClass === 'Rene' || playerClass === 'Sandro' || playerClass === 'Fighter') && (ultimatePhase === 'CHASING' || ultimatePhase === 'PROPOSING' || ultimatePhase === 'VANQUISHING' || ultimatePhase === 'FLAG')) {
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
                  if (playerClass === 'Fighter') {
                    if (ultimatePhase === 'FRIGHTENED' || ultimatePhase === 'PROPOSING') {
                      glyph = '😍';
                      color = '#ff69b4';
                    } else if (ultimatePhase === 'VANQUISHING') {
                      glyph = '🧎';
                      color = '#ff69b4';
                    } else {
                      glyph = getEnemyGlyph(currentLevel, hasEnemy.id, hasEnemy.isBoss);
                      color = hasEnemy.isBoss ? '#ff0055' : '#ff1744';
                    }
                  } else {
                    glyph = ultimatePhase === 'FRIGHTENED' ? '😱' : getEnemyGlyph(currentLevel, hasEnemy.id, hasEnemy.isBoss);
                    color = ultimatePhase === 'FRIGHTENED' ? '#ffea00' : (hasEnemy.isBoss ? '#ff0055' : '#ff1744');
                  }
                  cursor = 'pointer';
                  if (hasEnemy.isBoss) {
                    bg = 'rgba(255, 0, 85, 0.18)';
                  }
                } else if (cell === 'S') {
                  const isBossAlive = enemies.some(e => e.isBoss);
                  if (currentLevel === TOTAL_LEVELS && isBossAlive) {
                    glyph = '🔒';
                    color = '#ff1744';
                  } else if (currentLevel === TOTAL_LEVELS) {
                    glyph = '🏆';
                    color = '#ffd700';
                  } else {
                    glyph = 'S';
                    color = '#ffea00';
                  }
                } else if (cell === 'G') {
                  glyph = playerClass === 'Fighter' ? '❤️' : '*';
                  color = playerClass === 'Fighter' ? '#ff1744' : '#ffd700';
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
                glyph = playerClass === 'Fighter' ? '💖' : '💥';
                color = playerClass === 'Fighter' ? '#ff69b4' : '#ff1744';
              }

              const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;

              return (
                <div 
                  key={x} 
                  onClick={() => handleCellClick(x, y)}
                  onMouseEnter={() => setHoveredCell({ x, y })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="game-cell"
                  style={{ ...styles.cell, color, cursor, backgroundColor: bg, position: 'relative' }}
                >
                  {glyph}
                  {isHovered && !isAnimating && !isBebiaActive && !isSopoActive && (() => {
                    const info = getCellTooltip(x, y);
                    if (!info) return null;
                    const isTopRow = y <= 2;
                    const isLeftEdge = x <= 2;
                    const isRightEdge = x >= GRID_SIZE - 3;
                    let transform = 'translateX(-50%)';
                    let leftVal = '50%';
                    if (isLeftEdge) {
                      transform = 'translateX(0)';
                      leftVal = '0%';
                    } else if (isRightEdge) {
                      transform = 'translateX(-100%)';
                      leftVal = '100%';
                    }

                    return (
                      <div
                        className="cell-tooltip"
                        style={{
                          position: 'absolute',
                          [isTopRow ? 'top' : 'bottom']: '115%',
                          left: leftVal,
                          transform,
                          backgroundColor: 'rgba(10, 10, 10, 0.95)',
                          border: `1px solid ${info.accent}`,
                          backdropFilter: 'blur(6px)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          boxShadow: `0 6px 20px rgba(0,0,0,0.9), 0 0 12px ${info.accent}44`,
                          zIndex: 300,
                          pointerEvents: 'none',
                          whiteSpace: 'nowrap',
                          textAlign: 'left',
                          fontFamily: 'monospace',
                          minWidth: '130px'
                        }}
                      >
                        <div style={{ color: info.accent, fontWeight: 'bold', fontSize: '12px', borderBottom: '1px solid #222', paddingBottom: '2px', marginBottom: '3px' }}>
                          {info.title}
                        </div>
                        <div style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                          {info.stats}
                        </div>
                        {info.extra && (
                          <div style={{ color: '#888', fontSize: '10px', marginTop: '2px' }}>
                            {info.extra}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <button 
            onTouchStart={(e) => { e.preventDefault(); if (playerClass === 'Fighter') triggerSopoUltimate(); else if (playerClass === 'Bebia' || playerClass === 'Rene' || playerClass === 'Sandro') triggerBebiaUltimate(); }}
            onClick={(e) => { e.preventDefault(); if (playerClass === 'Fighter') triggerSopoUltimate(); else if (playerClass === 'Bebia' || playerClass === 'Rene' || playerClass === 'Sandro') triggerBebiaUltimate(); }}
            disabled={(playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0 || (playerClass !== 'Bebia' && playerClass !== 'Fighter' && playerClass !== 'Rene' && playerClass !== 'Sandro')}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: (playerClass === 'Fighter' ? isSopoActive : isBebiaActive) ? '#ff1744' : '#111',
              border: playerClass === 'Fighter' ? '2px solid #ff69b4' : '2px solid #00e5ff',
              color: (playerClass === 'Fighter' ? isSopoActive : isBebiaActive) ? '#fff' : (playerClass === 'Fighter' ? '#ff69b4' : '#00e5ff'),
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: (playerClass === 'Fighter' ? isSopoActive : isBebiaActive) ? '0 0 15px #ff1744' : (playerClass === 'Fighter' ? '0 0 8px rgba(255,105,180,0.4)' : '0 0 8px rgba(0,229,255,0.4)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              touchAction: 'none',
              userSelect: 'none',
              cursor: ((playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0 || (playerClass !== 'Bebia' && playerClass !== 'Fighter' && playerClass !== 'Rene' && playerClass !== 'Sandro')) ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace',
              opacity: (enemies.length === 0 || (playerClass !== 'Bebia' && playerClass !== 'Fighter' && playerClass !== 'Rene' && playerClass !== 'Sandro')) ? 0.5 : 1,
              animation: ((playerClass === 'Fighter' ? isSopoActive : isBebiaActive) || enemies.length === 0 || (playerClass !== 'Bebia' && playerClass !== 'Fighter' && playerClass !== 'Rene' && playerClass !== 'Sandro')) ? 'none' : 'pulsate 2s infinite',
            }}
          >
            {playerClass === 'Fighter' ? '💍 Ultimate' : '🇬🇪 Ultimate'}
          </button>
          <span style={{ fontSize: '10px', color: '#666', fontFamily: 'monospace' }}>{playerClass === 'Fighter' ? 'Sopo' : (playerClass === 'Rene' ? 'Rene' : playerClass === 'Sandro' ? 'Sandro' : 'Bebia')}</span>
        </div>

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

      if (angle >= -22.5 && angle < 22.5) {
        dirX = 1;
      } else if (angle >= 22.5 && angle < 67.5) {
        dirX = 1;
        dirY = 1;
      } else if (angle >= 67.5 && angle < 112.5) {
        dirY = 1;
      } else if (angle >= 112.5 && angle < 157.5) {
        dirX = -1;
        dirY = 1;
      } else if (angle >= -67.5 && angle < -22.5) {
        dirX = 1;
        dirY = -1;
      } else if (angle >= -112.5 && angle < -67.5) {
        dirY = -1;
      } else if (angle >= -157.5 && angle < -112.5) {
        dirX = -1;
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
    fontSize: '22px', fontWeight: 'bold' as const, border: '1px solid #111', transition: 'background-color 0.1s ease',
    position: 'relative' as const
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
