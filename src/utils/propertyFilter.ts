/**
 * 跨裝備（暗金、套裝、符文之語）特殊屬性篩選模組
 * 嚴格遵循單一資料來源原則（Rule 0009 第 12 條），整合現有 UNIQUE_ITEMS_DATA, ALL_SET_PIECES, RUNEWORDS_DATA
 */

import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { RUNEWORDS_DATA } from '../data/runewords';
import type { GearSlot } from '../types';

export type UnifiedItemRarity = 'unique' | 'set' | 'runeword';

/**
 * 統一的跨裝備展示資料介面
 */
export interface UnifiedGearItem {
  id: string;
  name: string;
  nameEn: string;
  nameClassic?: string;
  rarity: UnifiedItemRarity;
  slot: GearSlot | 'multiple' | 'other';
  slotLabel: string;
  slotLabelEn: string;
  applicableSlots: GearSlot[];
  baseItem: string;
  baseItemEn?: string;
  requiredLevel: number;
  requiredStr?: number;
  requiredDex?: number;
  attributes: string[];
  // 特殊類別屬性
  setName?: string;          // 套裝配件專屬
  setNameEn?: string;        // 套裝配件專屬英文名
  runes?: string[];          // 符文之語專屬
  runeNumbers?: number[];    // 符文之語專屬
  sockets?: number;          // 符文之語專屬
  allowedBases?: string[];   // 符文之語專屬
  ladderOnly?: boolean;
  isNewDLC?: boolean;
  classOnly?: string | null;
  grade?: 'normal' | 'exceptional' | 'elite';
  imageUrl?: string;
}

/**
 * 特殊屬性定義介面
 */
export interface SpecialPropertyDef {
  id: string;
  label: string;
  labelEn: string;
  shortLabel: string;
  shortLabelEn: string;
  category: 'core' | 'combat' | 'defense' | 'caster' | 'utility';
  description: string;
  descriptionEn?: string;
  icon?: string;
  match: (attribute: string) => boolean;
}

/**
 * 核心 24 項特殊屬性定義
 */
export const SPECIAL_PROPERTIES: SpecialPropertyDef[] = [
  // --- 核心熱門屬性 (Core Meta) ---
  {
    id: 'indestructible',
    label: '永不毀損 / 無法破壞',
    labelEn: 'Indestructible / Repair Durability',
    shortLabel: '永不毀損',
    shortLabelEn: 'Indestructible',
    descriptionEn: 'Item is indestructible or repairs durability over time. Ideal for ethereal bases.',
    category: 'core',
    description: '裝備無法破壞或具備自動回復耐久度能力，適合無形底材或長久戰鬥。',
    match: (a) => /無法破壞|永不毀損|無法損壞|回復耐久度/i.test(a),
  },
  {
    id: 'all_skills',
    label: '增加所有技能等級',
    labelEn: '+All Skills',
    shortLabel: '+所有技能',
    shortLabelEn: '+All Skills',
    descriptionEn: 'Increases all class skill levels (+1 to +2 to all skills), not restricted to single classes.',
    category: 'core',
    description: '增加全職業所有技能等級（+1~+2 所有技能），不含單一職業限制。',
    match: (a) => /(?:\+|增加).*所有技能|所有技能\s*\+|全部技能/i.test(a),
  },
  {
    id: 'all_res',
    label: '所有抗性 (全抗)',
    labelEn: 'All Resistances',
    shortLabel: '全抗',
    shortLabelEn: 'All Res',
    descriptionEn: 'Simultaneously boosts Fire, Cold, Lightning, and Poison resistances.',
    category: 'core',
    description: '同時提高火焰、冰寒、電擊與毒素四系抗性。',
    match: (a) => /所有抗性|全部抗性/i.test(a),
  },
  {
    id: 'mf',
    label: '尋獲魔法物品機率 (MF)',
    labelEn: 'Better Chance of Getting Magic Items (MF)',
    shortLabel: '尋寶 MF',
    shortLabelEn: 'Magic Find (MF)',
    descriptionEn: 'Increases drop rate of Magic, Rare, Set, and Unique items.',
    category: 'core',
    description: '提高掉落魔法、稀有、套裝與暗金裝備的機率。',
    match: (a) => /尋獲魔法物品機率|尋獲魔法裝備/i.test(a),
  },
  {
    id: 'cannot_be_frozen',
    label: '無法凍結 (CBF)',
    labelEn: 'Cannot Be Frozen (CBF)',
    shortLabel: '無法凍結',
    shortLabelEn: 'Cannot Be Frozen',
    descriptionEn: 'Grants complete immunity to freeze effects that slow movement and attack speed.',
    category: 'core',
    description: '使角色完全免疫冰凍效果造成的移動與攻擊速度減緩。',
    match: (a) => /無法凍結|無法被凍結/i.test(a),
  },

  // --- 施法與輸出 (Caster & Offensive) ---
  {
    id: 'fcr',
    label: '高速施法速度 (FCR)',
    labelEn: 'Faster Cast Rate (FCR)',
    shortLabel: '施法速度 (FCR)',
    shortLabelEn: 'Faster Cast (FCR)',
    descriptionEn: 'Reduces cast animation frame count. Essential core metric for spellcasters.',
    category: 'caster',
    description: '縮短法術施展動作的幀數，法系輸出的核心指標。',
    match: (a) => /施法速度/i.test(a),
  },
  {
    id: 'pierce_res',
    label: '降低敵人抗性 (-Res)',
    labelEn: 'Lower Enemy Resistances (-Res)',
    shortLabel: '降低敵人抗性',
    shortLabelEn: '-Enemy Res',
    descriptionEn: 'Reduces specific enemy elemental resistances, maximizing DPS post-sunder.',
    category: 'caster',
    description: '降低敵人的特定元素抗性，大幅提升破免後的輸出傷害。',
    match: (a) => /敵人.*抗性\s*-\d+%/i.test(a),
  },
  {
    id: 'ias',
    label: '提升攻擊速度 (IAS)',
    labelEn: 'Increased Attack Speed (IAS)',
    shortLabel: '攻擊速度 (IAS)',
    shortLabelEn: 'Attack Speed (IAS)',
    descriptionEn: 'Reduces animation frames for standard attacks and physical combat skills.',
    category: 'combat',
    description: '縮短普通攻擊或物理技能的出手動作幀數。',
    match: (a) => /攻擊速度/i.test(a),
  },
  {
    id: 'cb',
    label: '粉碎打擊 / 壓碎打擊 (CB)',
    labelEn: 'Crushing Blow (CB)',
    shortLabel: '壓碎打擊 (CB)',
    shortLabelEn: 'Crushing Blow (CB)',
    descriptionEn: 'Deals damage equal to a percentage of target current health. Crucial for boss fights.',
    category: 'combat',
    description: '攻擊命中時依怪物當前生命等比例削減，打王必備利器。',
    match: (a) => /粉碎打擊|壓碎打擊/i.test(a),
  },
  {
    id: 'ds',
    label: '致命打擊 (DS)',
    labelEn: 'Deadly Strike (DS)',
    shortLabel: '致命打擊 (DS)',
    shortLabelEn: 'Deadly Strike (DS)',
    descriptionEn: 'Chance to deal double physical damage on hit.',
    category: 'combat',
    description: '攻擊命中時有一定機率造成雙倍物理傷害。',
    match: (a) => /致命打擊|致命攻勢/i.test(a),
  },
  {
    id: 'ow',
    label: '撕裂傷口 (OW)',
    labelEn: 'Open Wounds (OW)',
    shortLabel: '撕裂傷口 (OW)',
    shortLabelEn: 'Open Wounds (OW)',
    descriptionEn: 'Inflicts continuous bleed damage and prevents monster natural health regeneration.',
    category: 'combat',
    description: '造成持續流血傷害並完全阻斷怪物的自然生命回復（防止回血）。',
    match: (a) => /撕裂傷口|造成傷口/i.test(a),
  },
  {
    id: 'll',
    label: '偷取生命 (吸血 / LL)',
    labelEn: 'Life Stolen per Hit (Life Leech / LL)',
    shortLabel: '偷取生命 (LL)',
    shortLabelEn: 'Life Leech (LL)',
    descriptionEn: 'Converts a percentage of physical damage dealt into player health.',
    category: 'combat',
    description: '將造成的物理傷害依比例轉化為自身生命。',
    match: (a) => /(?:擊中|偷取).*生命|生命竊取/i.test(a),
  },
  {
    id: 'ml',
    label: '偷取法力 (吸魔 / ML)',
    labelEn: 'Mana Stolen per Hit (Mana Leech / ML)',
    shortLabel: '偷取法力 (ML)',
    shortLabelEn: 'Mana Leech (ML)',
    descriptionEn: 'Converts a percentage of physical damage dealt into player mana.',
    category: 'combat',
    description: '將造成的物理傷害依比例轉化為自身法力。',
    match: (a) => /(?:擊中|偷取).*法力|法力竊取/i.test(a),
  },
  {
    id: 'aura',
    label: '裝備賦予靈氣 (Aura)',
    labelEn: 'Granted Aura When Equipped',
    shortLabel: '賦予靈氣',
    shortLabelEn: 'Granted Aura',
    descriptionEn: 'Automatically activates a Paladin aura (e.g. Fanaticism, Conviction, Meditation).',
    category: 'combat',
    description: '裝備時自動激活聖騎士或其他強大光環（如狂熱、信念、冥想、審判）。',
    match: (a) => /裝備時賦予等級.*靈氣/i.test(a),
  },

  // --- 防禦與生存 (Defense & Survival) ---
  {
    id: 'fhr',
    label: '快速打擊恢復 (FHR)',
    labelEn: 'Faster Hit Recovery (FHR)',
    shortLabel: '打擊恢復 (FHR)',
    shortLabelEn: 'Hit Recovery (FHR)',
    descriptionEn: 'Reduces recovery animation frames when taking heavy burst damage.',
    category: 'defense',
    description: '縮短受到單次重創時硬直（打擊恢復動作）的時間。',
    match: (a) => /打擊恢復/i.test(a),
  },
  {
    id: 'dr',
    label: '傷害降低 (物理減傷 / DR)',
    labelEn: 'Damage Reduced / Physical DR',
    shortLabel: '物理減傷 (DR)',
    shortLabelEn: 'Damage Reduced (DR)',
    descriptionEn: 'Reduces incoming physical damage by flat points or percentage.',
    category: 'defense',
    description: '直接扣減或以百分比降低受到的物理傷害。',
    match: (a) => /傷害降低|受到的物理傷害降低/i.test(a),
  },
  {
    id: 'absorb',
    label: '元素吸收 (Absorb)',
    labelEn: 'Elemental Absorption',
    shortLabel: '元素吸收',
    shortLabelEn: 'Absorption',
    descriptionEn: 'Absorbs incoming elemental damage and converts it into healing.',
    category: 'defense',
    description: '受到特定元素傷害時吸收傷害並回復自身生命。',
    match: (a) => /(?:火焰|冰寒|電擊|魔法)吸收/i.test(a),
  },
  {
    id: 'max_res',
    label: '最大抗性上限提升 (+Max Res)',
    labelEn: '+Maximum Resistance',
    shortLabel: '最大抗性上限',
    shortLabelEn: '+Max Res',
    descriptionEn: 'Raises default 75% resistance ceiling up to a maximum of 95%.',
    category: 'defense',
    description: '突破 75% 的原生抗性上限，最高可堆疊至 95%。',
    match: (a) => /抗性上限\s*\+\d+%/i.test(a),
  },
  {
    id: 'block',
    label: '格擋機率 / 格擋速度提高',
    labelEn: 'Increased Chance of Blocking / Faster Block',
    shortLabel: '格擋加成',
    shortLabelEn: 'Blocking Bonus',
    descriptionEn: 'Improves shield block chance or speeds up block reset animations.',
    category: 'defense',
    description: '提高盾牌基礎格擋機率或加快格擋復位動作幀數。',
    match: (a) => /格擋率|格擋機率|快速格擋/i.test(a),
  },
  {
    id: 'max_hp_mana',
    label: '生命 / 法力上限百分比提高',
    labelEn: 'Increase Maximum Life / Mana %',
    shortLabel: '生命/法力提高',
    shortLabelEn: '+Max Life/Mana %',
    descriptionEn: 'Substantially increases the overall character health or mana pool by a percentage.',
    category: 'defense',
    description: '以百分比大幅提升人物整體的總生命或總法力池。',
    match: (a) => /(?:生命|法力)上限提高/i.test(a),
  },

  // --- 機能與特殊機制 (Utility & Mechanism) ---
  {
    id: 'laek',
    label: '擊殺恢復生命/法力 (EK / LAEK)',
    labelEn: 'Life / Mana After Each Kill (EK / LAEK)',
    shortLabel: '擊殺恢復 (EK)',
    shortLabelEn: 'After Each Kill (EK)',
    descriptionEn: 'Unconditionally restores flat life or mana upon slaying any monster.',
    category: 'utility',
    description: '每次擊殺怪物立即無條件獲得固定數值的生命或法力。',
    match: (a) => /(?:殺死|每殺死一個).*獲得/i.test(a),
  },
  {
    id: 'frw',
    label: '高速跑步/行走 (FRW)',
    labelEn: 'Faster Run / Walk (FRW)',
    shortLabel: '跑步速度 (FRW)',
    shortLabelEn: 'Run/Walk (FRW)',
    descriptionEn: 'Increases character movement speed for faster clearing and dodging.',
    category: 'utility',
    description: '提高角色的移動速度，大幅優化跑圖與閃避流暢度。',
    match: (a) => /跑步\s*\/\s*行走速度|跑速|行走速度/i.test(a),
  },
  {
    id: 'ctc',
    label: '擊中/被擊中觸發技能 (CTC)',
    labelEn: 'Chance to Cast on Striking / When Struck (CTC)',
    shortLabel: '觸發技能 (CTC)',
    shortLabelEn: 'Chance to Cast (CTC)',
    descriptionEn: 'Chance to trigger spells automatically on hit, when struck, or upon level-up.',
    category: 'combat',
    description: '攻擊命中、被擊中或升級時有機率自動施展特定法術技能。',
    match: (a) => /(?:擊中時有|被擊中時有|升級時有|死亡時有).*機率施展/i.test(a),
  },
  {
    id: 'per_level',
    label: '依角色等級成長屬性',
    labelEn: 'Attributes Based on Character Level',
    shortLabel: '依等級成長',
    shortLabelEn: 'Based on Level',
    descriptionEn: 'Stat values scale dynamically as the character levels up (Life, Mana, MF, AR).',
    category: 'utility',
    description: '該屬性數值隨角色等級提升而動態增加（如生命/法力/MF/準確率）。',
    match: (a) => /依角色等級而定/i.test(a),
  },
];

/**
 * 頂部快速篩選常用的精選屬性
 */
export const POPULAR_SPECIAL_PROPERTIES = [
  'indestructible',
  'all_skills',
  'all_res',
  'mf',
  'cannot_be_frozen',
  'fcr',
  'fhr',
  'ias',
  'cb',
  'ds',
  'dr',
  'll',
  'aura',
  'pierce_res',
];

/**
 * 部位中文標籤對照表
 */
export const SLOT_LABELS: Record<string, string> = {
  all: '全部部位',
  weapon: '武器',
  helm: '頭盔',
  armor: '護甲',
  shield: '盾牌',
  gloves: '手套',
  boots: '靴子',
  belt: '腰帶',
  ring: '戒指',
  amulet: '護身符',
  charm: '咒符',
  jewel: '珠寶',
  multiple: '多部位適用',
};

export const SLOT_LABELS_EN: Record<string, string> = {
  all: 'All Slots',
  weapon: 'Weapon',
  helm: 'Helm',
  armor: 'Body Armor',
  shield: 'Shield',
  gloves: 'Gloves',
  boots: 'Boots',
  belt: 'Belt',
  ring: 'Ring',
  amulet: 'Amulet',
  charm: 'Charm',
  jewel: 'Jewel',
  multiple: 'Multi-slot',
};

/**
 * 解析符文之語所允許的裝備槽位
 */
function parseRunewordSlots(allowedBases: string[]): {
  primarySlot: GearSlot | 'multiple' | 'other';
  primaryLabel: string;
  slots: GearSlot[];
} {
  const slots = new Set<GearSlot>();

  for (const b of allowedBases) {
    if (b.includes('護甲')) slots.add('armor');
    if (b.includes('頭盔')) slots.add('helm');
    if (b.includes('盾牌')) slots.add('shield');
    if (
      b.includes('武器') ||
      b.includes('刀劍') ||
      b.includes('斧') ||
      b.includes('釘鎚') ||
      b.includes('重槌') ||
      b.includes('法杖') ||
      b.includes('魔杖') ||
      b.includes('弓') ||
      b.includes('長柄') ||
      b.includes('長矛') ||
      b.includes('爪') ||
      b.includes('匕首') ||
      b.includes('權杖') ||
      b.includes('短棒')
    ) {
      slots.add('weapon');
    }
  }

  const slotList = Array.from(slots);

  if (slotList.length === 1) {
    const s = slotList[0];
    return {
      primarySlot: s,
      primaryLabel: SLOT_LABELS[s] || s,
      slots: slotList,
    };
  }

  if (slotList.length > 1) {
    const labels = slotList.map((s) => SLOT_LABELS[s] || s).join(' / ');
    return {
      primarySlot: 'multiple',
      primaryLabel: labels,
      slots: slotList,
    };
  }

  return {
    primarySlot: 'other',
    primaryLabel: allowedBases.join(' / ') || '特殊底材',
    slots: [],
  };
}

/** 快取的全裝備記憶清單 */
let cachedUnifiedItems: UnifiedGearItem[] | null = null;

/**
 * 取得完整彙整的跨裝備清單 (暗金 + 套裝 + 符文之語)
 */
export function getAllUnifiedItems(): UnifiedGearItem[] {
  if (cachedUnifiedItems) return cachedUnifiedItems;

  const list: UnifiedGearItem[] = [];

  // 1. 暗金裝備 (409 筆)
  for (const u of UNIQUE_ITEMS_DATA) {
    list.push({
      id: `u-${u.id}`,
      name: u.name,
      nameEn: u.nameEn,
      nameClassic: u.nameClassic,
      rarity: 'unique',
      slot: u.slot,
      slotLabel: SLOT_LABELS[u.slot] || u.slot,
      slotLabelEn: SLOT_LABELS_EN[u.slot] || u.slot,
      applicableSlots: [u.slot],
      baseItem: u.baseItem,
      baseItemEn: u.baseItemEn,
      requiredLevel: u.requiredLevel,
      requiredStr: u.requiredStr,
      requiredDex: u.requiredDex,
      attributes: u.attributes,
      ladderOnly: u.ladderOnly,
      isNewDLC: u.isNewDLC,
      classOnly: u.classOnly,
      grade: u.grade,
      imageUrl: u.imageUrl,
    });
  }

  // 2. 套裝配件 (140 筆)
  for (const s of SET_ITEMS_DATA) {
    for (const piece of s.pieces) {
      list.push({
        id: `s-${piece.id}`,
        name: piece.name,
        nameEn: piece.nameEn,
        nameClassic: piece.nameClassic,
        rarity: 'set',
        slot: piece.slot,
        slotLabel: SLOT_LABELS[piece.slot] || piece.slot,
        slotLabelEn: SLOT_LABELS_EN[piece.slot] || piece.slot,
        applicableSlots: [piece.slot],
        baseItem: piece.baseItem,
        requiredLevel: piece.requiredLevel,
        requiredStr: piece.requiredStr,
        requiredDex: piece.requiredDex,
        attributes: piece.attributes,
        setName: s.name,
        setNameEn: s.nameEn,
        classOnly: piece.classOnly,
        grade: piece.grade,
        imageUrl: piece.imageUrl,
      });
    }
  }

  // 3. 符文之語 (98 筆)
  for (const r of RUNEWORDS_DATA) {
    const { primarySlot, primaryLabel, slots } = parseRunewordSlots(r.allowedBases);
    list.push({
      id: `rw-${r.id}`,
      name: r.name,
      nameEn: r.nameEn,
      nameClassic: r.nameClassic,
      rarity: 'runeword',
      slot: primarySlot,
      slotLabel: primaryLabel,
      slotLabelEn: SLOT_LABELS_EN[primarySlot] || primaryLabel,
      applicableSlots: slots,
      baseItem: r.allowedBases.join(' · '),
      requiredLevel: r.requiredLevel,
      attributes: r.attributes,
      runes: r.runes,
      runeNumbers: r.runeNumbers,
      sockets: r.sockets,
      allowedBases: r.allowedBases,
      ladderOnly: r.ladderOnly,
      isNewDLC: r.isNewDLC,
      imageUrl: r.imageUrl,
    });
  }

  cachedUnifiedItems = list;
  return list;
}

/**
 * 跨裝備多維度過濾條件
 */
export interface UnifiedFilterOptions {
  selectedPropertyIds?: string[];
  rarity?: 'all' | UnifiedItemRarity;
  slot?: 'all' | GearSlot | 'multiple';
  searchQuery?: string;
}

/**
 * 執行多維度跨裝備過濾
 */
export function filterUnifiedItems(
  items: UnifiedGearItem[],
  options: UnifiedFilterOptions
): UnifiedGearItem[] {
  const {
    selectedPropertyIds = [],
    rarity = 'all',
    slot = 'all',
    searchQuery = '',
  } = options;

  const activeDefs = SPECIAL_PROPERTIES.filter((p) =>
    selectedPropertyIds.includes(p.id)
  );

  const cleanQuery = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    // 1. 品質過濾
    if (rarity !== 'all' && item.rarity !== rarity) {
      return false;
    }

    // 2. 部位過濾
    if (slot !== 'all') {
      if (slot === 'multiple') {
        if (item.slot !== 'multiple') return false;
      } else {
        if (!item.applicableSlots.includes(slot as GearSlot)) {
          return false;
        }
      }
    }

    // 3. 特殊屬性篩選 (必須滿足所有選取的屬性 - AND 邏輯)
    if (activeDefs.length > 0) {
      const matchAll = activeDefs.every((def) =>
        item.attributes.some((attr) => def.match(attr))
      );
      if (!matchAll) return false;
    }

    // 4. 文字搜尋 (名稱、英文名、舊譯名、底材、屬性、套裝名、符文)
    if (cleanQuery) {
      const matchName =
        item.name.toLowerCase().includes(cleanQuery) ||
        item.nameEn.toLowerCase().includes(cleanQuery) ||
        (item.nameClassic ? item.nameClassic.toLowerCase().includes(cleanQuery) : false);

      const matchBase =
        item.baseItem.toLowerCase().includes(cleanQuery) ||
        (item.baseItemEn ? item.baseItemEn.toLowerCase().includes(cleanQuery) : false);

      const matchSet = item.setName ? item.setName.toLowerCase().includes(cleanQuery) : false;

      const matchRunes = item.runes
        ? item.runes.some((r) => r.toLowerCase().includes(cleanQuery))
        : false;

      const matchAttrs = item.attributes.some((a) =>
        a.toLowerCase().includes(cleanQuery)
      );

      if (!matchName && !matchBase && !matchSet && !matchRunes && !matchAttrs) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 計算各特殊屬性在特定清單下的命中數量
 */
export function getPropertyHitCounts(
  items: UnifiedGearItem[]
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const def of SPECIAL_PROPERTIES) {
    let count = 0;
    for (const item of items) {
      if (item.attributes.some((attr) => def.match(attr))) {
        count++;
      }
    }
    counts[def.id] = count;
  }

  return counts;
}
