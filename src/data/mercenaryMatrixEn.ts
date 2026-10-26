import type { MercTierKey } from './mercenaryMatrix';

export interface BuildI18nEntry {
  buildNameEn: string;
  roleEn: string;
  coreProblemEn: string;
  bestMercSummaryEn: string;
  tiers: Record<
    MercTierKey,
    {
      summaryEn: string;
      synergyNoteEn: string;
    }
  >;
}

export const MERC_TYPE_EN: Record<string, string> = {
  '第二章沙漠守衛 · 祈禱靈氣': 'Act 2 Desert Guard · Prayer Aura',
  '第二章沙漠守衛 · 神聖冰凍/力量': 'Act 2 Desert Guard · Holy Freeze / Might',
  '第二章沙漠守衛 · 力量靈氣': 'Act 2 Desert Guard · Might Aura',
  '第二章沙漠守衛 · 神聖冰凍': 'Act 2 Desert Guard · Holy Freeze',
  '第二章沙漠守衛 · 神聖冰凍/祈禱': 'Act 2 Desert Guard · Holy Freeze / Prayer',
  '第五章狂亂野蠻人': 'Act 5 Frenzy Barbarian',
  '第一章俠盜斥候 · 冰箭型': 'Act 1 Rogue Scout · Cold Arrow',
};

export const AURA_EN: Record<string, string> = {
  '冥想靈氣 (無限回魔)': 'Meditation Aura (Infinite Mana)',
  '祈禱靈氣 (生命回復)': 'Prayer Aura (Life Regeneration)',
  '冥想靈氣': 'Meditation Aura',
  '淨化靈氣': 'Cleansing Aura',
  '祈禱靈氣 (三倍超速回血神技)': 'Prayer Aura (3x Rapid Healing)',
  '神聖冰凍靈氣 (大範圍緩速減傷)': 'Holy Freeze Aura (AoE Slow & Safety)',
  '信念靈氣 (降敵抗85%)': 'Conviction Aura (-85% Enemy Res)',
  '信念靈氣 (破免神技)': 'Conviction Aura (Sunder Immunity Piercing)',
  '高階力量靈氣 (增強傷害)': 'High Might Aura (+Enhanced Damage)',
  '神聖冰凍 (大範圍控場減速)': 'Holy Freeze (AoE Crowd Control)',
  '信念靈氣 (降火抗)': 'Conviction Aura (-Fire Resistance)',
  '力量靈氣': 'Might Aura',
  '祈禱靈氣': 'Prayer Aura',
  '淨化靈氣 (三重互乘神技)': 'Cleansing Aura (Triple Synergy)',
  '神聖冰凍 (緩速控場)': 'Holy Freeze (Slow & Control)',
  '力量靈氣 (提升全隊物理傷害)': 'Might Aura (+Party Physical DMG)',
  '專注靈氣 (巨量物理增傷)': 'Concentration Aura (Massive Physical DMG)',
  '神聖冰凍': 'Holy Freeze',
  '信念靈氣 (電抗歸零)': 'Conviction Aura (Zeroes Lightning Res)',
  '信念靈氣 (牛關毀滅核心)': 'Conviction Aura (Cow Level Obliterator)',
  '力量靈氣 (提升箭雨傷害)': 'Might Aura (Boosts Arrow Rain DMG)',
  '庇護所靈氣 (不死生物物抗歸零)': 'Sanctuary Aura (Ignores Undead Phys Res)',
  '狂熱靈氣 (攻速與命中爆發加成)': 'Fanaticism Aura (Attack Speed & AR)',
  '力量靈氣 (骷髏大軍增傷)': 'Might Aura (Skeleton Army Boost)',
  '信念靈氣 (屍爆輸出直接翻倍)': 'Conviction Aura (Doubles Corpse Explosion)',
  '淨化靈氣 (減毒免副作用)': 'Cleansing Aura (Counters Sunder Debuff)',
  '專注靈氣 (巨量物理加成)': 'Concentration Aura (Huge Physical Bonus)',
  '信念靈氣 (陷阱傷害破免)': 'Conviction Aura (Pierces Trap Res)',
  '信念靈氣': 'Conviction Aura',
  '神聖冰凍 (減速聚怪)': 'Holy Freeze (Slow & Cluster Mobs)',
  '信念靈氣 (全元素抗性歸零)': 'Conviction Aura (Zeroes All Elemental Res)',
  '狂亂加速': 'Frenzy Speed',
};

export const GEAR_NOTE_EN: Record<string, string> = {
  '12-17級冥想靈氣，法力無盡循環': 'Lvl 12-17 Meditation Aura, infinite mana cycle',
  '10%生命偷取 + 15全抗': '10% Life Stolen + 15 All Res',
  '無法凍結 + 巨量生命與抗性': 'Cannot Be Frozen + massive life & res',
  '極速出手回魔兼吸血': 'Fast attack speed for rapid mana & leech',
  '1級淨化靈氣，中毒/詛咒時間縮短75-80%': 'Lvl 1 Cleansing Aura, -75-80% poison/curse duration',
  '45%攻速 + 被擊中觸發15級影散(60全抗/15%物免)': '45% IAS + 15% ctc Fade (60 All Res / 15% DR)',
  '33%施展衰老詛咒，控場降速並破除物免': '33% ctc Decrepify, slows & breaks Physical Immunity',
  '+2技能/20攻速/吸血 (鑲Ral或攻速火抗珠寶)': '+2 Skills / 20% IAS / Life Leech (Socket Ral or 15/30 jewel)',
  '300%增強傷害 + 高防禦全抗': '300% Enhanced Damage + massive defense & All Res',
  '回魔續航必備': 'Essential for continuous mana sustain',
  '吸血與全抗': 'Life Leech and All Resistances',
  '50全抗 + 高防禦': '50 All Res + high defense',
  '12級信念靈氣，降抗85%破除99%電免': 'Lvl 12 Conviction Aura, -85% res breaks 99% light immunes',
  '淨化靈氣極速解毒，安全刷牛關與紅門': 'Cleansing Aura purges poison fast, safe for Cows & Ubers',
  '45% IAS 讓傭兵快速觸發壓碎打擊': '45% IAS for rapid Crushing Blow procs',
  '極速攻速底材，12級信念靈氣破免': 'High speed base, Lvl 12 Conviction Aura breaks immunity',
  '+2技能讓傭兵原生力量靈氣再+2級，吸血高攻速': '+2 Skills boosts Might by +2 levels, Life Leech & IAS',
  '300%增傷，傭兵單發平砍破萬': '300% ED, merc hits for 10,000+ per strike',
  '源源不絕的火球魔力': 'Endless mana sustain for Fireball spam',
  '雙吸血吸魔 + 20%物理減傷': 'Dual Leech + 20% Damage Reduction',
  '高攻速 + 影散抗性': 'High IAS + Fade resistance boost',
  '高攻速回魔': 'High IAS mana regen',
  '解毒抗詛咒': 'Purges poison and curses',
  '防凍回血': 'Cannot Be Frozen & life regeneration',
  '12級信念靈氣降抗': 'Lvl 12 Conviction Aura reduces resistances',
  '攻速吸血': 'IAS and Life Leech',
  '300%傷害加成': '300% Enhanced Damage bonus',
  '提供冥想回魔': 'Provides Meditation mana regen',
  '偷取生命與全抗': 'Life Leech and All Res',
  '50全抗防暴斃': '50 All Res prevents burst deaths',
  '冥想靈氣': 'Meditation Aura',
  '淨化靈氣，消除衰老詛咒神技': 'Cleansing Aura, instantly cleanses Decrepify',
  '45%攻速 + 15%物免': '45% IAS + 15% Damage Reduction',
  '高攻速回血吸血': 'High IAS with Life Leech sustain',
  '解除詛咒，保持施法幀數': 'Removes curses, maintaining cast frame rate',
  '巨額防禦與抗性': 'Massive defense and resistances',
  '40%粉碎打擊 + 巨額傷害與全抗': '40% Crushing Blow + high damage & All Res',
  '35%粉碎打擊 + 15%致命打擊': '35% Crushing Blow + 15% Deadly Strike',
  '45%攻速加快輸出': '45% IAS for faster output',
  '33%施展衰老詛咒破物免': '33% ctc Decrepify breaks Physical Immunity',
  '高爆擊與壓碎打擊': 'High critical strike & Crushing Blow',
  '45%攻速更快打出衰老': '45% IAS for faster Decrepify procs',
  '16-20級專注靈氣，物理增傷近300%': 'Lvl 16-20 Concentration, ~300% physical damage boost',
  '吸血與攻速': 'Life Leech and IAS',
  '超高防禦': 'Massive defense',
  '40% CB': '40% Crushing Blow',
  '35% CB': '35% Crushing Blow',
  '無法凍結': 'Cannot Be Frozen',
  '衰老減速控場': 'Decrepify slow & crowd control',
  '物理減傷20%': '20% Physical Damage Reduction',
  '觸發影散+15%物免/60全抗': 'Fade proc gives +15% DR / 60 All Res',
  '衰老詛咒壓制六王攻擊': 'Decrepify suppresses Uber Boss damage & speed',
  '配合重擊丁秒殺王': 'Synergizes with Smiter to melt bosses',
  '極限防禦抗性': 'Maximum defense and resistances',
  '冥想靈氣支撐標槍高耗魔': 'Meditation supports Javazon high mana cost',
  '吸血與抗性': 'Life Leech and resistances',
  '12級信念降抗85%': 'Lvl 12 Conviction reduces resistances by 85%',
  '淨化靈氣極速解毒': 'Cleansing Aura purges poison rapidly',
  '45%攻速快速吸血': '45% IAS for rapid life leech',
  '極速底材無形無限': 'Fastest ethereal Infinity base',
  '攻速吸血 (鑲15攻速30火抗珠寶)': 'IAS & Life Leech (Socket 15 IAS / 30 Fire Res jewel)',
  '300%增傷超硬神盾': '300% ED with impenetrable armor',
  '衰老詛咒破物免': 'Decrepify breaks Physical Immunity',
  '高爆發': 'High burst damage',
  '45%攻速快速出刀': '45% IAS for rapid strikes',
  '庇護所靈氣破不死物免 + 衰老詛咒': 'Sanctuary breaks Undead Phys Res + Decrepify',
  '巨額平傷秒怪': 'Massive flat damage melts mobs',
  '全抗吸血野蠻人專用': 'All Res & Life Leech for Barbarian',
  '攻速與減傷': 'IAS and Damage Reduction',
  '12-15級狂熱靈氣 + +1-2全技能': 'Lvl 12-15 Fanaticism Aura + +1-2 All Skills',
  '20%攻速': '20% Attack Speed',
  '40% CB 快速產出第一具屍體': '40% CB quickly generates the first corpse',
  '45%攻速': '45% IAS',
  '源源不絕的屍體爆炸魔力': 'Endless mana pool for Corpse Explosion spam',
  '解毒解詛咒': 'Cleanses poison and curses',
  '防凍高抗': 'Cannot Be Frozen & high resistances',
  '信念靈氣降抗，屍爆50%火傷傷害倍增': 'Conviction reduces res, doubling CE 50% fire damage',
  '35% CB + 15% DS': '35% Crushing Blow + 15% Deadly Strike',
  '300%增傷超強秒怪': '300% ED for monster-melting power',
  '冥想回魔': 'Meditation mana regen',
  '50全抗': '50 All Res',
  '回魔續航': 'Mana sustain',
  '淨化靈氣大幅降低破毒板的自身毒傷': 'Cleansing mitigates self-poison from Sunder charm',
  '觸發影散': 'Fade proc',
  '被擊中施展降抗詛咒 + 淨化靈氣': 'ctc Lower Resist when struck + Cleansing Aura',
  '高平傷快速收殘血': 'High flat damage to execute low-health foes',
  '野蠻人專用神盔': 'Endgame Barbarian-only helm',
  '高防禦減傷': 'High defense and damage reduction',
  '40% CB，不含冰冷傷害保護屍體': '40% CB with no cold damage to preserve corpses',
  '高傷秒怪不碎屍': 'High damage without shattering corpses',
  '50% MF + 10%攻速 + 吸血吸魔': '50% MF + 10% IAS + Dual Leech',
  '300%額外金幣 + 100%尋寶機率': '300% Extra Gold + 100% Better Magic Find',
  '巨額物理高傷無冰冷': 'Huge physical damage with zero cold element',
  '20%物理減傷 + 魔法傷害降低15 (鑲火抗珠寶)': '20% Physical DR + MDR 15 (Socket Fire Res jewel)',
  '300%增傷秒殺議員': '300% ED to shred Council members',
  '33%衰老破除物免': '33% Decrepify breaks Physical Immunity',
  '爆擊與壓碎': 'Critical strike and Crushing Blow',
  '高攻速': 'High Attack Speed',
  '20級專注靈氣提升近300%傷害': 'Lvl 20 Concentration boosts damage by ~300%',
  '300%增傷超硬鋼甲': '300% ED indestructible armor',
  '12-17級冥想靈氣，龍捲風連發無憂': 'Lvl 12-17 Meditation, endless Tornado spam',
  '衰老破免 + 颶風雙重緩速': 'Decrepify breaks phys immunes + Hurricane slow',
  '極速衰老破除物免神槍': 'Fastest Decrepify proc weapon to break immunes',
  '頂級防禦與抗性': 'Top-tier defense and resistances',
  '冥想靈氣保證連放5座雷光衛哨': 'Meditation guarantees continuous 5-trap placement',
  '信念降抗讓陷阱傷害直接破免翻倍': 'Conviction pierces immunity and doubles trap DPS',
  '頂配急速信念神兵': 'Best-in-slot fast Conviction weapon',
  '神聖冰凍大範圍減速聚怪': 'Holy Freeze AoE slows and clusters mobs',
  '淨化靈氣消除衰老詛咒，確保踢擊不卡幀': 'Cleansing removes Decrepify to maintain kick frames',
  '信念光環讓火冰電全屏煙火秒殺全場': 'Conviction lets fire/cold/light fireworks obliterate all',
  '高額物理平傷 + 忽視目標防禦': 'Massive flat physical damage + Ignores Target Defense',
  '力量靈氣大幅提升全隊輸出': 'Might Aura greatly boosts total party output',
  '雙吸血與高防禦': 'Dual Leech & high defense',
};

export const BUILD_I18N: Record<string, BuildI18nEntry> = {
  'sor-blizzard': {
    buildNameEn: 'Blizzard Sorceress',
    roleEn: 'Top Starter · Ranged AoE Cold DPS',
    coreProblemEn: 'Heavily reliant on rapid mana spam, handling cold immunes, and elemental survival',
    bestMercSummaryEn: 'Act 2 Prayer Merc (Triple Aura Tank) or Might Reaper’s Toll (breaks cold immunes)',
    tiers: {
      start: {
        summaryEn: 'Budget · Meditation Mana + Frozen Resistance & Regen',
        synergyNoteEn: 'Prayer and Meditation synergize for accelerated life regen, allowing uninterrupted Blizzard casting.',
      },
      mf: {
        summaryEn: 'Max Survival Tank · Cure Anti-Poison + Safe Magic Finding',
        synergyNoteEn: 'Cure + Insight + Prayer forms the legendary Triple Aura, nullifying poison and curses in Ancient Tunnels.',
      },
      bis: {
        summaryEn: 'Endgame Sunder Obliterator · Conviction Sunder + Fortitude Critical Hit',
        synergyNoteEn: 'The Reaper’s Toll Decrepify cripples sundered cold immunes while the merc solos elite bosses.',
      },
    },
  },
  'sor-lightning': {
    buildNameEn: 'Lightning / Chain Lightning Sorceress',
    roleEn: 'King of Speed Clears · Screen-Wide Lightning Annihilation',
    coreProblemEn: 'Desperate for enemy lightning res reduction; requires Conviction to break almost all immunes',
    bestMercSummaryEn: 'Act 2 Might Merc wielding "Infinity" — the absolute core of Lightning specs',
    tiers: {
      start: {
        summaryEn: 'Transitional Insight · Obedience Polearm for early Crushing Blow',
        synergyNoteEn: 'Before Infinity, Insight sustains heavy Chain Lightning mana drain for safe early wealth farming.',
      },
      mf: {
        summaryEn: 'Top MF Lightning · Cure cleanses curses + Infinity pierces immunes',
        synergyNoteEn: 'Infinity Conviction lets Chain Lightning one-shot Cow herds and Baal minion waves with zero immune bottlenecks.',
      },
      bis: {
        summaryEn: 'Absolute Pinnacle · Eth Infinity + Fortitude + Andariel’s Visage',
        synergyNoteEn: 'Infinity -85% res combined with merc 10k+ Fortitude hits steamrolls all Hell difficulty content.',
      },
    },
  },
  'sor-meteor-fire': {
    buildNameEn: 'Meteor / Fireball Sorceress',
    roleEn: 'High Burst Fire · Premier Boss Slayer',
    coreProblemEn: 'Abundant Fire Immunes in Hell; needs Conviction or strong crowd-control tanks',
    bestMercSummaryEn: 'Act 2 Might / Holy Freeze Infinity, or Act 5 Dual-Plague Frenzy Barbarian',
    tiers: {
      start: {
        summaryEn: 'Insight Meditation · Obedience 40% CB helps fight fire immunes',
        synergyNoteEn: 'Provides the deep mana pool required for Fireball spam to safely farm Andariel and Mephisto.',
      },
      mf: {
        summaryEn: 'Cure Cleansing Tank · Stable farming for Duriel and Travincal Council',
        synergyNoteEn: 'Holy Freeze slows incoming rushes, giving the Sorceress ample space to drop devastating Meteors.',
      },
      bis: {
        summaryEn: 'Infinity Fire God · Conviction pierces fire res + Flickering Flame burn',
        synergyNoteEn: 'Combined with Fire Sunder and Infinity, Hell Fire Res drops to 0%, dealing tens of thousands of damage per impact.',
      },
    },
  },
  'pal-hammerdin': {
    buildNameEn: 'Blessed Hammer Paladin (Hammerdin)',
    roleEn: 'All-Terrain Legend · Pure Magic Damage Ceiling',
    coreProblemEn: 'Runs Concentration aura; needs early mana regen or late-game indestructible frontline tank',
    bestMercSummaryEn: 'Act 2 Prayer Triple-Aura Cure Tank (Immortal Battery) or Holy Freeze',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen · Cast Blessed Hammer without mana pot anxiety',
        synergyNoteEn: 'Cannot run Meditation alongside Concentration; Insight merc is the quintessential early partner.',
      },
      mf: {
        summaryEn: 'Cure Triple-Aura Battery · Unkillable face-tanking in Chaos Sanctuary',
        synergyNoteEn: 'Oblivion Knight Decrepify is purged within 1s; Meditation and Prayer heal continuously through danger.',
      },
      bis: {
        summaryEn: 'Endgame Immortal Juggernaut · Eth Insight / Fortitude + Cure Helm',
        synergyNoteEn: 'Fully geared Hammerdin cleanses Players 8 Chaos Sanctuary and Worldstone with zero mercenary deaths.',
      },
    },
  },
  'pal-zealot': {
    buildNameEn: 'Zeal Paladin (Zealot)',
    roleEn: 'Lightning-Fast Berserker · Apex Melee Combat',
    coreProblemEn: 'Pure physical damage suffers against Physical Immunes; requires Decrepify and damage auras',
    bestMercSummaryEn: 'Act 2 The Reaper’s Toll (breaks Physical Immunity) or Pride Concentration',
    tiers: {
      start: {
        summaryEn: 'Obedience High CB · Rapidly executes elite packs and bosses',
        synergyNoteEn: 'Dual Crushing Blow from Paladin and mercenary melts Hell bosses during progression.',
      },
      mf: {
        summaryEn: 'The Reaper’s Toll Decrepify · Top choice for Travincal and Pits',
        synergyNoteEn: 'Decrepify strips Physical Immunity immediately, enabling 5-hit Zeal sequences to shred targets.',
      },
      bis: {
        summaryEn: 'Pride Concentration Aura · Might + Fanaticism + Concentration triple multiplier',
        synergyNoteEn: 'Own Fanaticism + merc Might + Pride Concentration stacks physical damage multipliers beyond limits.',
      },
    },
  },
  'pal-smiter': {
    buildNameEn: 'Smite Paladin (Smiter)',
    roleEn: 'Pandemonium Event & Uber Tristram Specialist',
    coreProblemEn: 'Uber Bosses cast lethal elemental auras and summons; merc dies easily without extreme defenses',
    bestMercSummaryEn: 'Treachery + Life Leech + Gladiator’s Bane heavy DR setup, or Act 5 Frenzy Taunt Tank',
    tiers: {
      start: {
        summaryEn: 'Obedience + Duriel’s Shell Cannot Be Frozen',
        synergyNoteEn: 'Cleanses surrounding minions and slows mobs, carving out space for the Smiter to 1v1 bosses.',
      },
      mf: {
        summaryEn: 'Treachery Fade Proc · 60 All Res counters Mephisto’s Conviction',
        synergyNoteEn: 'Pre-buff Fade in fire before entering Tristram, dramatically boosting mercenary survival.',
      },
      bis: {
        summaryEn: 'The Reaper’s Toll Decrepify + Fortitude Heavy Armor',
        synergyNoteEn: 'Decrepify pins Baal and Diablo in place, allowing Smite to melt Uber Bosses in under 10 seconds.',
      },
    },
  },
  'ama-javazon': {
    buildNameEn: 'Lightning Fury Javazon',
    roleEn: 'Secret Cow Level Sovereign · Screen-Clearing Lightning',
    coreProblemEn: 'Urgent need for enemy lightning resistance reduction (Conviction) and a frontline aggro magnet',
    bestMercSummaryEn: 'Act 2 Might Merc with Infinity (-85% Enemy Res, Cow Level Destroyer)',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen · Sustains non-stop Lightning Fury throws',
        synergyNoteEn: 'Lightning Fury drains huge mana pools; Insight is the optimal early Cow farming energy source.',
      },
      mf: {
        summaryEn: 'Infinity Pierce Starter · Cure helm counters Cow King poison shocks',
        synergyNoteEn: 'Once Conviction activates, entire Cow packs drop in a single throw, raining high runes and bases.',
      },
      bis: {
        summaryEn: 'Ultimate Infinity Wrath · Eth Infinity + Fortitude + Andariel’s Visage',
        synergyNoteEn: 'Glides through Players 8 Cow Level and Terror Zones, discharging millions of combined lightning damage.',
      },
    },
  },
  'ama-bowazon': {
    buildNameEn: 'Physical Strafe / Multishot Bowazon',
    roleEn: 'Physical Arrow Storm · Super Long-Range Screen Clearance',
    coreProblemEn: 'Desperately seeks Fanaticism aura to reach the 7-frame IAS breakpoint and break Phys Immunes',
    bestMercSummaryEn: 'Act 1 Rogue Scout wielding "Faith" or Act 2 The Reaper’s Toll',
    tiers: {
      start: {
        summaryEn: 'Act 2 Might Reaper’s Toll · Decrepify breaks physical immunes',
        synergyNoteEn: 'Decrepify curse allows the Bowazon to reliably pierce through Hell Physical Immunes.',
      },
      mf: {
        summaryEn: 'Act 5 Dual-Wield Frenzy Barb · Lawbringer Sanctuary strips undead immunity',
        synergyNoteEn: 'Frenzy Barbarian charges ahead to tank, keeping the backline Bowazon completely safe.',
      },
      bis: {
        summaryEn: 'Act 1 Rogue with "Faith" · Lvl 15 Fanaticism hits max 7-frame attack speed',
        synergyNoteEn: 'Bowazon with Windforce or Grand Matron Bow hits the ultimate IAS frame rate under Faith aura.',
      },
    },
  },
  'nec-summoner': {
    buildNameEn: 'Fishymancer (Summoner Necromancer)',
    roleEn: 'Safest Starter · Skeleton Army + Corpse Explosion',
    coreProblemEn: 'Army requires physical damage auras, and relies on the merc to create the crucial 1st corpse',
    bestMercSummaryEn: 'Act 2 Might Merc (Infinity / Pride / Reaper’s) — primary hitter of the skeleton legion',
    tiers: {
      start: {
        summaryEn: 'Obedience High CB generates 1st corpse · Might aura buffs skeletons',
        synergyNoteEn: 'Amplify Damage curse + 3 hits from merc creates the first corpse, triggering instant CE cascades.',
      },
      mf: {
        summaryEn: 'Insight Mana Regen for continuous CE · Cure helm clears curses',
        synergyNoteEn: 'Corpse Explosion consumes heavy mana; Insight eliminates potion reliance during screen clearing.',
      },
      bis: {
        summaryEn: 'Infinity Pierce doubles CE fire damage · Conviction + Might + Pride Iron Golem',
        synergyNoteEn: 'CE deals 50% physical + 50% fire; Amplify Damage strips phys res while Conviction cuts fire res.',
      },
    },
  },
  'nec-poison': {
    buildNameEn: 'Poison Nova Necromancer',
    roleEn: 'Screen-Wide Toxic Cloud · Persistent Corrosive Area Clear',
    coreProblemEn: 'Numerous poison immunes in Hell; requires Sunder charm and rapid execution to trigger CE',
    bestMercSummaryEn: 'Act 2 Infinity / Insight or Act 5 Dual-Plague Frenzy Barbarian',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen supports Poison Nova and Corpse Explosion',
        synergyNoteEn: 'Poison Nova drains mana rapidly; Insight keeps farming rhythms smooth and fluid.',
      },
      mf: {
        summaryEn: 'Cure Helm negates Poison Sunder debuff · Safely farms Cows & Bosses',
        synergyNoteEn: 'Poison Sunder lowers player poison resistance; Cure’s Cleansing aura neutralizes this penalty.',
      },
      bis: {
        summaryEn: 'Act 5 Dual-Plague Frenzy Berserker · Cleansing Aura + Lower Resist proc',
        synergyNoteEn: 'Merc gets struck to proc Lower Resist, stacking with Poison Nova and Death’s Web to dissolve foes.',
      },
    },
  },
  'bar-goldfind': {
    buildNameEn: 'Goldfind / Travincal Horker Barbarian',
    roleEn: 'Travincal High Council ATM · Find Item Body Horker',
    coreProblemEn: 'Must NEVER shatter corpses (zero cold damage); merc must withstand Council Hydra fire rain',
    bestMercSummaryEn: 'Act 2 Blessed Aim / Might Merc (zero cold damage gear, fireproof setup)',
    tiers: {
      start: {
        summaryEn: 'Obedience (Fire DMG preserves corpses) + Duriel’s Shell Cannot Be Frozen',
        synergyNoteEn: 'Never equip any cold damage gear (like Reaper’s Toll) so every Council corpse remains intact.',
      },
      mf: {
        summaryEn: 'Wealth Armor + Blade of Ali Baba · Astronomical gold & MF output',
        synergyNoteEn: 'Let the mercenary land the killing blow to reap maximum Extra Gold and Magic Find bonuses.',
      },
      bis: {
        summaryEn: 'Indestructible Travincal Tank · Gladiator’s Bane (negates Hydra burst) + Obedience',
        synergyNoteEn: 'Massive Flat Magic/Fire DR neutralizes Hydra rapid-fire bolts, letting merc stand freely in fire.',
      },
    },
  },
  'bar-whirlwind': {
    buildNameEn: 'Whirlwind Barbarian',
    roleEn: 'Battlefield Meat Grinder · Physical AoE Cyclone',
    coreProblemEn: 'Requires Decrepify to break Physical Immunity, plus Attack Rating and damage multipliers',
    bestMercSummaryEn: 'Act 2 The Reaper’s Toll (breaks Phys Immunes) or Pride Concentration Aura',
    tiers: {
      start: {
        summaryEn: 'Obedience High Damage + Duriel’s Shell Cannot Be Frozen',
        synergyNoteEn: 'Might aura directly scales damage with every rotation of Whirlwind.',
      },
      mf: {
        summaryEn: 'The Reaper’s Toll Decrepify · Indispensable for Chaos Sanctuary',
        synergyNoteEn: 'Decrepify cuts enemy physical resistance and defense in half, leaving nothing standing.',
      },
      bis: {
        summaryEn: 'Pride Concentration Aura · Might + Concentration dual aura damage stack',
        synergyNoteEn: 'Barbarian Grief flat damage paired with Pride Concentration multiplies Whirlwind DPS tremendously.',
      },
    },
  },
  'dru-wind': {
    buildNameEn: 'Wind Druid (Tornado / Hurricane)',
    roleEn: 'Physical & Cold Hybrid · Ranged Gale Bombardment',
    coreProblemEn: 'Tornado is pure physical damage; critically requires Decrepify to break physical immunity',
    bestMercSummaryEn: 'Act 2 The Reaper’s Toll Merc (Soulmate for breaking physical immunity)',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen · Non-stop Tornado casting without drought',
        synergyNoteEn: 'Tornado consumes massive mana; Insight provides the required fluid casting rhythm.',
      },
      mf: {
        summaryEn: 'The Reaper’s Toll Decrepify · Dual crowd-control with Hurricane chill',
        synergyNoteEn: 'Tornado is pure physical damage; Decrepify strips physical immunity for effortless clears.',
      },
      bis: {
        summaryEn: 'Eth Best-in-Slot The Reaper’s Toll + Fortitude + Cure Helm',
        synergyNoteEn: 'Decrepify 50% slow stacks with Hurricane chill, freezing monsters in place to be shredded by Tornados.',
      },
    },
  },
  'ass-trapper': {
    buildNameEn: 'Lightning Sentry Trapper Assassin',
    roleEn: 'Safe & Methodical · Automated Lightning and Corpse Explosion',
    coreProblemEn: 'Many lightning immunes in Hell; needs Conviction to pierce res, and early Insight for trap setup',
    bestMercSummaryEn: 'Act 2 Might Infinity Merc (pierces immunities, doubles trap DPS)',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen · Rapidly places full battery of 5 Lightning Sentries',
        synergyNoteEn: 'Laying traps and summoning Shadow Master demands steady mana; Insight provides seamless casting.',
      },
      mf: {
        summaryEn: 'Infinity Pierce Starter · Cure helm safely farms Cows and Countess',
        synergyNoteEn: 'Conviction aura doubles Lightning Sentry damage while Death Sentry clears remnant packs.',
      },
      bis: {
        summaryEn: 'Infinity + Fortitude + Andariel’s Visage · Melts Players 8 Cow Level',
        synergyNoteEn: 'Endgame setup: once Conviction strips immunities, 5 overlapping Sentries kill targets instantly.',
      },
    },
  },
  'ass-mosaic': {
    buildNameEn: 'Mosaic Martial Arts Assassin',
    roleEn: 'Patch 2.6 God-Tier Build · Screen-Filling Elemental Fireworks',
    coreProblemEn: 'Inherently possesses apocalyptic fire/cold/light/phys damage; primarily needs mob clustering & leech',
    bestMercSummaryEn: 'Act 2 Holy Freeze (clusters mobs together) or Act 5 Frenzy Berserker',
    tiers: {
      start: {
        summaryEn: 'Obedience High CB melts bosses · Duriel’s Shell Cannot Be Frozen',
        synergyNoteEn: 'Holy Freeze AoE slows mobs, letting the Assassin effortlessly build charges and release kicks.',
      },
      mf: {
        summaryEn: 'Cure Helm counters curses · Ensures kick attack frames are never delayed',
        synergyNoteEn: 'Decrepify impairs kick frame rates; Cure’s Cleansing aura guarantees butter-smooth kick chains.',
      },
      bis: {
        summaryEn: 'Infinity Conviction · Tri-elemental fireworks vaporize Players 8 Hell',
        synergyNoteEn: 'Infinity Conviction multiplies all 3 charges (Claws of Thunder, Blades of Ice, Fists of Fire) simultaneously.',
      },
    },
  },
  'war-abyssal': {
    buildNameEn: 'Abyssal Chaos Warlock',
    roleEn: 'Shadow Magic & Void Curses · AoE Shadow Corruption',
    coreProblemEn: 'High-frequency casting drains mana; requires frontline tank to absorb aggro and crowd-control',
    bestMercSummaryEn: 'Act 2 Prayer Triple-Aura Tank, or Act 5 Dual-Wield Frenzy Juggernaut',
    tiers: {
      start: {
        summaryEn: 'Insight Mana Regen · Sustains continuous Void and Shadow spell rotation',
        synergyNoteEn: 'Meditation mana replenishment fuels the Warlock’s high-tier abyssal burst windows.',
      },
      mf: {
        summaryEn: 'Cure Triple-Aura · Cleansing aura negates self-backlash curses',
        synergyNoteEn: 'Triple Aura provides near-immortal sustain for comfortably conquering high-level Terror Zones.',
      },
      bis: {
        summaryEn: 'Act 5 Dual-Wield Frenzy · Grief + Last Wish max Might aura stack',
        synergyNoteEn: 'Frenzy Barbarian barrels into enemy frontlines holding all aggro while Warlock casts annihilation spells.',
      },
    },
  },
};
