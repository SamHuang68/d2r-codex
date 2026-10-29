import { BreakpointData } from '../types';

export const BREAKPOINTS_DATA: BreakpointData[] = [
  // ── 魔法使 (Sorceress) ──
  {
    characterClass: "魔法使",
    classNameEn: "Sorceress",
    type: "FCR",
    variant: "標準法術 (冰風暴/暴風雪/火球術/隕石術/傳送術)",
    variantEn: "Standard Spells (Glacial Spike / Blizzard / Fire Ball / Meteor / Teleport)",
    notes: "最核心門檻為 63% (過渡) 與 105% (終局標配)；極限衝刺 200% 可達 7 幀極速傳送。",
    notesEn: "Key milestones are 63% (midgame) and 105% (endgame standard); 200% reaches the legendary 7-frame teleport cap.",
    breakpoints: [
      { frames: 13, requiredValue: 0 },
      { frames: 12, requiredValue: 9 },
      { frames: 11, requiredValue: 20 },
      { frames: 10, requiredValue: 37 },
      { frames: 9, requiredValue: 63 },
      { frames: 8, requiredValue: 105 },
      { frames: 7, requiredValue: 200 }
    ]
  },
  {
    characterClass: "魔法使",
    classNameEn: "Sorceress",
    type: "FCR",
    variant: "閃電箭 / 連鎖閃電 (Lightning / Chain Lightning)",
    variantEn: "Lightning / Chain Lightning",
    notes: "閃電系具有獨立施法動作，關鍵檔位為 78% 與 117% (電法畢業標配)。",
    notesEn: "Lightning skills use unique casting animations. Crucial breakpoints are 78% and 117% (endgame light sorc standard).",
    breakpoints: [
      { frames: 19, requiredValue: 0 },
      { frames: 18, requiredValue: 7 },
      { frames: 17, requiredValue: 15 },
      { frames: 16, requiredValue: 23 },
      { frames: 15, requiredValue: 35 },
      { frames: 14, requiredValue: 52 },
      { frames: 13, requiredValue: 78 },
      { frames: 12, requiredValue: 117 },
      { frames: 11, requiredValue: 194 }
    ]
  },
  {
    characterClass: "魔法使",
    classNameEn: "Sorceress",
    type: "FHR",
    notes: "法師常規推薦 42% (9 幀) 或精神盾提供的 55% (仍為 9 幀，60% FHR 檔位需補 5% 才達 8 幀) 或 86% (7 幀)。",
    notesEn: "Common recommendations are 42% (9 frames), 55% from Spirit (needs +5% to hit the 60% 8-frame breakpoint), or 86% (7 frames).",
    breakpoints: [
      { frames: 15, requiredValue: 0 },
      { frames: 14, requiredValue: 5 },
      { frames: 13, requiredValue: 9 },
      { frames: 12, requiredValue: 14 },
      { frames: 11, requiredValue: 20 },
      { frames: 10, requiredValue: 30 },
      { frames: 9, requiredValue: 42 },
      { frames: 8, requiredValue: 60 },
      { frames: 7, requiredValue: 86 },
      { frames: 6, requiredValue: 142 }
    ]
  },

  // ── 聖騎士 (Paladin) ──
  {
    characterClass: "聖騎士",
    classNameEn: "Paladin",
    type: "FCR",
    variant: "祝福之鎚 / 天堂之拳 / 傳送術",
    variantEn: "Blessed Hammer / Fist of the Heavens / Teleport",
    notes: "祝槌騎 (Hammerdin) 推薦 75% (10 幀) 或 125% (9 幀畢業速度)。",
    notesEn: "Hammerdins recommend 75% (10 frames) or 125% (9 frames, endgame BIS standard).",
    breakpoints: [
      { frames: 15, requiredValue: 0 },
      { frames: 14, requiredValue: 9 },
      { frames: 13, requiredValue: 18 },
      { frames: 12, requiredValue: 30 },
      { frames: 11, requiredValue: 48 },
      { frames: 10, requiredValue: 75 },
      { frames: 9, requiredValue: 125 }
    ]
  },
  {
    characterClass: "聖騎士",
    classNameEn: "Paladin",
    type: "FHR",
    notes: "通常依靠精神盾 (55% FHR) 即可輕鬆踏過 48% (5 幀) 甚至搭配小符上 86% (4 幀)。",
    notesEn: "Spirit Shield alone provides 55% FHR, easily surpassing the 48% (5 frames) breakpoint; 86% reaches 4 frames.",
    breakpoints: [
      { frames: 9, requiredValue: 0 },
      { frames: 8, requiredValue: 7 },
      { frames: 7, requiredValue: 15 },
      { frames: 6, requiredValue: 27 },
      { frames: 5, requiredValue: 48 },
      { frames: 4, requiredValue: 86 },
      { frames: 3, requiredValue: 200 }
    ]
  },
  {
    characterClass: "聖騎士",
    classNameEn: "Paladin",
    type: "FBR",
    variant: "開啟神聖之盾 (Holy Shield)",
    variantEn: "With Holy Shield Active",
    notes: "開神聖之盾後天生只要 2 幀格擋速度！達到 86% FBR 更是達到 1 幀極速格擋。",
    notesEn: "With Holy Shield active, base block is an ultra-fast 2 frames! Reaching 86% FBR hits the legendary 1-frame instant block.",
    breakpoints: [
      { frames: 2, requiredValue: 0 },
      { frames: 1, requiredValue: 86 }
    ]
  },

  // ── 死靈法師 (Necromancer) ──
  {
    characterClass: "死靈法師",
    classNameEn: "Necromancer",
    type: "FCR",
    variant: "人型形態 (骨矛/屍爆/傳送術)",
    variantEn: "Human Form (Bone Spear / Corpse Explosion / Teleport)",
    notes: "骨系與毒系普遍標配 75% (10 幀) 或極致 125% (9 幀)。",
    notesEn: "Bone and Poison Necros commonly target 75% (10 frames) or the ultimate 125% (9 frames).",
    breakpoints: [
      { frames: 15, requiredValue: 0 },
      { frames: 14, requiredValue: 9 },
      { frames: 13, requiredValue: 18 },
      { frames: 12, requiredValue: 30 },
      { frames: 11, requiredValue: 48 },
      { frames: 10, requiredValue: 75 },
      { frames: 9, requiredValue: 125 }
    ]
  },
  {
    characterClass: "死靈法師",
    classNameEn: "Necromancer",
    type: "FHR",
    notes: "推薦至少達成 56% (7 幀) 或 86% (6 幀)。",
    notesEn: "Recommend reaching at least 56% (7 frames) or 86% (6 frames).",
    breakpoints: [
      { frames: 13, requiredValue: 0 },
      { frames: 12, requiredValue: 5 },
      { frames: 11, requiredValue: 10 },
      { frames: 10, requiredValue: 16 },
      { frames: 9, requiredValue: 26 },
      { frames: 8, requiredValue: 39 },
      { frames: 7, requiredValue: 56 },
      { frames: 6, requiredValue: 86 },
      { frames: 5, requiredValue: 152 }
    ]
  },

  // ── 術士 (Warlock - RotW DLC) ──
  {
    characterClass: "術士",
    classNameEn: "Warlock",
    type: "FCR",
    variant: "惡魔引導 / 混沌咒語",
    variantEn: "Demonic Channeling / Chaos Invocations",
    notes: "《術士軍臨》DLC 全新職業，終局混沌法術爆發建議維持在 68% 或 110% 檔位。",
    notesEn: "RotW new class. Recommended to maintain 68% (10 frames) or 110% (9 frames) for smooth endgame casting.",
    breakpoints: [
      { frames: 14, requiredValue: 0 },
      { frames: 13, requiredValue: 10 },
      { frames: 12, requiredValue: 22 },
      { frames: 11, requiredValue: 38 },
      { frames: 10, requiredValue: 68 },
      { frames: 9, requiredValue: 110 },
      { frames: 8, requiredValue: 190 }
    ]
  },

  // ── 亞馬遜 (Amazon) ──
  {
    characterClass: "亞馬遜",
    classNameEn: "Amazon",
    type: "FCR",
    notes: "亞馬遜天生施法前搖極慢，謎團傳送術推薦至少 68% (13 幀) 或 99% (12 幀)。",
    notesEn: "Amazons have naturally slow casting animations. For Enigma Teleport, target at least 68% (13 frames) or 99% (12 frames).",
    breakpoints: [
      { frames: 19, requiredValue: 0 },
      { frames: 18, requiredValue: 7 },
      { frames: 17, requiredValue: 14 },
      { frames: 16, requiredValue: 22 },
      { frames: 15, requiredValue: 32 },
      { frames: 14, requiredValue: 48 },
      { frames: 13, requiredValue: 68 },
      { frames: 12, requiredValue: 99 },
      { frames: 11, requiredValue: 152 }
    ]
  },
  {
    characterClass: "亞馬遜",
    classNameEn: "Amazon",
    type: "FHR",
    notes: "標馬與弓馬普遍推薦 52% (6 幀) 或 86% (5 幀)。",
    notesEn: "Javazon and Bowazons generally recommend 52% (6 frames) or 86% (5 frames).",
    breakpoints: [
      { frames: 11, requiredValue: 0 },
      { frames: 10, requiredValue: 6 },
      { frames: 9, requiredValue: 13 },
      { frames: 8, requiredValue: 20 },
      { frames: 7, requiredValue: 32 },
      { frames: 6, requiredValue: 52 },
      { frames: 5, requiredValue: 86 },
      { frames: 4, requiredValue: 174 }
    ]
  },

  // ── 野蠻人 (Barbarian) ──
  {
    characterClass: "野蠻人",
    classNameEn: "Barbarian",
    type: "FCR",
    notes: "野蠻人擁有全遊戲最快施法動作（同法師）！持雙精神或雙自殺支撐即可達 105% 甚至 200% 極速吼叫打寶。",
    notesEn: "Barbarians share the fastest casting frames in D2 with Sorceresses! Dual Spirit weapon swap hits 105% (8 frames).",
    breakpoints: [
      { frames: 13, requiredValue: 0 },
      { frames: 12, requiredValue: 9 },
      { frames: 11, requiredValue: 20 },
      { frames: 10, requiredValue: 37 },
      { frames: 9, requiredValue: 63 },
      { frames: 8, requiredValue: 105 },
      { frames: 7, requiredValue: 200 }
    ]
  },

  // ── 刺客 (Assassin) ──
  {
    characterClass: "刺客",
    classNameEn: "Assassin",
    type: "FCR",
    notes: "心靈震爆與傳送術檔位，陷阱擺放速度則取決於攻擊速度 (IAS) 而非施法速度 (FCR)。",
    notesEn: "Applies to Mind Blast and Teleport. Note: Trap laying speed is determined by Attack Speed (IAS), not FCR!",
    breakpoints: [
      { frames: 16, requiredValue: 0 },
      { frames: 15, requiredValue: 8 },
      { frames: 14, requiredValue: 16 },
      { frames: 13, requiredValue: 27 },
      { frames: 12, requiredValue: 42 },
      { frames: 11, requiredValue: 65 },
      { frames: 10, requiredValue: 102 },
      { frames: 9, requiredValue: 174 }
    ]
  },

  // ── 德魯伊 (Druid) ──
  {
    characterClass: "德魯伊",
    classNameEn: "Druid",
    type: "FCR",
    variant: "人型形態 (風德/火德/召喚)",
    variantEn: "Human Form (Wind / Fire / Summoner)",
    notes: "風德畢業檔位為 99% (11 幀) 或超極速 163% (10 幀)。",
    notesEn: "Wind Druid endgame target is 99% (11 frames) or extreme 163% (10 frames).",
    breakpoints: [
      { frames: 18, requiredValue: 0 },
      { frames: 17, requiredValue: 4 },
      { frames: 16, requiredValue: 10 },
      { frames: 15, requiredValue: 19 },
      { frames: 14, requiredValue: 30 },
      { frames: 13, requiredValue: 46 },
      { frames: 12, requiredValue: 68 },
      { frames: 11, requiredValue: 99 },
      { frames: 10, requiredValue: 163 }
    ]
  }
];
