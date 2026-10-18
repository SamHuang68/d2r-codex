import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { RUNEWORDS_DATA } from '../data/runewords';
import { SET_ITEMS_DATA } from '../data/setItems';
import { CatalogItem, SimulatorItemStats } from '../types/simulator';
import { GearSlot } from '../types';

/**
 * 從字串屬性陣列中精確解析出數值屬性
 */
export function parseItemAttributes(attrs: string[]): SimulatorItemStats {
  const stats: SimulatorItemStats = {};

  attrs.forEach((attr) => {
    // 力量
    const strMatch = attr.match(/\+?(\d+)\s*力量/);
    if (strMatch) stats.strength = (stats.strength || 0) + parseInt(strMatch[1], 10);

    // 敏捷
    const dexMatch = attr.match(/\+?(\d+)\s*敏捷/);
    if (dexMatch) stats.dexterity = (stats.dexterity || 0) + parseInt(dexMatch[1], 10);

    // 體力
    const vitMatch = attr.match(/\+?(\d+)\s*體力/);
    if (vitMatch) stats.vitality = (stats.vitality || 0) + parseInt(vitMatch[1], 10);

    // 精力
    const eneMatch = attr.match(/\+?(\d+)\s*精力/);
    if (eneMatch) stats.energy = (stats.energy || 0) + parseInt(eneMatch[1], 10);

    // 生命
    const lifeMatch = attr.match(/\+?(\d+)\s*(?:點)?生命/);
    if (lifeMatch && !attr.includes('%')) {
      stats.life = (stats.life || 0) + parseInt(lifeMatch[1], 10);
    }

    // 生命 %
    const lifePctMatch = attr.match(/\+?(\d+)%\s*(?:最大)?生命/);
    if (lifePctMatch) {
      stats.lifePercent = (stats.lifePercent || 0) + parseInt(lifePctMatch[1], 10);
    }

    // 法力
    const manaMatch = attr.match(/\+?(\d+)\s*(?:點)?法力/);
    if (manaMatch && !attr.includes('%')) {
      stats.mana = (stats.mana || 0) + parseInt(manaMatch[1], 10);
    }

    // 法力 %
    const manaPctMatch = attr.match(/(?:增加法力上限|法力上限|\+)?\s*(\d+)%\s*法力/);
    if (manaPctMatch) {
      stats.manaPercent = (stats.manaPercent || 0) + parseInt(manaPctMatch[1], 10);
    }

    // 所有技能
    const allSkillsMatch = attr.match(/\+(\d+)\s*(?:至)?所有技能/);
    if (allSkillsMatch) {
      stats.allSkills = (stats.allSkills || 0) + parseInt(allSkillsMatch[1], 10);
    }

    // 職業全技能
    const classSkillMatch = attr.match(/\+(\d+)\s*(?:至)?(聖騎士|魔法使|亞馬遜|死靈法師|野蠻人|德魯伊|刺客|術士)技能/);
    if (classSkillMatch) {
      stats.classSkills = {
        className: classSkillMatch[2],
        bonus: parseInt(classSkillMatch[1], 10)
      };
    }

    // 快速施法速度 (FCR)
    const fcrMatch = attr.match(/\+?(\d+)%\s*(?:快速)?施法速度/);
    if (fcrMatch) {
      stats.fcr = (stats.fcr || 0) + parseInt(fcrMatch[1], 10);
    }

    // 快速打擊恢復 (FHR)
    const fhrMatch = attr.match(/\+?(\d+)%\s*快速打擊恢復/);
    if (fhrMatch) {
      stats.fhr = (stats.fhr || 0) + parseInt(fhrMatch[1], 10);
    }

    // 增加攻擊速度 (IAS)
    const iasMatch = attr.match(/\+?(\d+)%\s*(?:增加)?攻擊速度/);
    if (iasMatch) {
      stats.ias = (stats.ias || 0) + parseInt(iasMatch[1], 10);
    }

    // 快速格擋速度 (FBR)
    const fbrMatch = attr.match(/\+?(\d+)%\s*快速格擋/);
    if (fbrMatch) {
      stats.fbr = (stats.fbr || 0) + parseInt(fbrMatch[1], 10);
    }

    // 格擋率
    const blockMatch = attr.match(/\+?(\d+)%\s*(?:增加)?格擋機率/);
    if (blockMatch) {
      stats.blockChance = (stats.blockChance || 0) + parseInt(blockMatch[1], 10);
    }

    // 全抗性
    const allResMatch = attr.match(/(?:所有抗性|全抗性|全抗)\s*\+(\d+)/);
    if (allResMatch) {
      stats.allRes = (stats.allRes || 0) + parseInt(allResMatch[1], 10);
    }

    // 單抗 (火/電/冰/毒)
    const fireMatch = attr.match(/(?:抗火|火焰抗性)\s*\+?(\d+)%/);
    if (fireMatch) stats.fireRes = (stats.fireRes || 0) + parseInt(fireMatch[1], 10);

    const lightMatch = attr.match(/(?:抗電|閃電抗性)\s*\+?(\d+)%/);
    if (lightMatch) stats.lightningRes = (stats.lightningRes || 0) + parseInt(lightMatch[1], 10);

    const coldMatch = attr.match(/(?:抗寒|冰冷抗性)\s*\+?(\d+)%/);
    if (coldMatch) stats.coldRes = (stats.coldRes || 0) + parseInt(coldMatch[1], 10);

    const psnMatch = attr.match(/(?:抗毒|毒素抗性)\s*\+?(\d+)%/);
    if (psnMatch) stats.poisonRes = (stats.poisonRes || 0) + parseInt(psnMatch[1], 10);

    // 最大抗性上限
    const maxLightMatch = attr.match(/\+(\d+)%\s*閃電抗性上限/);
    if (maxLightMatch) stats.maxLightningRes = (stats.maxLightningRes || 0) + parseInt(maxLightMatch[1], 10);

    // 打寶率 (MF)
    const mfMatch = attr.match(/(\d+)%\s*(?:更佳機會取得魔法裝備|更佳打寶率|打寶率)/);
    if (mfMatch) stats.magicFind = (stats.magicFind || 0) + parseInt(mfMatch[1], 10);

    // 壓碎打擊 (CB)
    const cbMatch = attr.match(/(\d+)%\s*壓碎打擊/);
    if (cbMatch) stats.crushingBlow = (stats.crushingBlow || 0) + parseInt(cbMatch[1], 10);

    // 致命打擊 (DS)
    const dsMatch = attr.match(/(\d+)%\s*致命攻擊/);
    if (dsMatch) stats.deadlyStrike = (stats.deadlyStrike || 0) + parseInt(dsMatch[1], 10);

    // 撕開傷口 (OW)
    const owMatch = attr.match(/(\d+)%\s*撕開傷口/);
    if (owMatch) stats.openWounds = (stats.openWounds || 0) + parseInt(owMatch[1], 10);

    // 傷害減免 (DR%)
    const drMatch = attr.match(/(?:傷害減少|物理傷害減少)\s*(\d+)%/);
    if (drMatch) stats.damageReducedPercent = (stats.damageReducedPercent || 0) + parseInt(drMatch[1], 10);

    // 無法被凍結
    if (attr.includes('無法被凍結')) {
      stats.cannotBeFrozen = true;
    }

    // 防禦值
    const defMatch = attr.match(/\+(\d+)\s*防禦/);
    if (defMatch && !attr.includes('%')) {
      stats.defense = (stats.defense || 0) + parseInt(defMatch[1], 10);
    }
  });

  return stats;
}

/**
 * 依據裝備類別分類為 Tier 1 (護甲 / 武器 / 飾品)
 */
function getCategoryTier1(slot: GearSlot): 'armor' | 'weapon' | 'jewelry' {
  if (['helm', 'armor', 'shield', 'gloves', 'boots', 'belt'].includes(slot)) {
    return 'armor';
  }
  if (slot === 'weapon') {
    return 'weapon';
  }
  return 'jewelry';
}

/**
 * 依據物品等級與底材推算 Tier 2 強度階級
 */
function getCategoryTier2(baseItem: string, reqLvl: number): string {
  const isClassSpecific = 
    baseItem.includes('神聖小盾') || 
    baseItem.includes('庫拉斯特') || 
    baseItem.includes('飾金') || 
    baseItem.includes('殺戮者') || 
    baseItem.includes('面容') || 
    baseItem.includes('狼頭') || 
    baseItem.includes('利爪') || 
    baseItem.includes('標槍') || 
    baseItem.includes('魔杖') || 
    baseItem.includes('魔典');

  if (isClassSpecific) {
    return '職業專屬 (Class-Specific)';
  }

  if (reqLvl >= 60 || baseItem.includes('統治者') || baseItem.includes('執政官') || baseItem.includes('神聖') || baseItem.includes('巨神') || baseItem.includes('幻化')) {
    return '菁英 (Elite)';
  }
  if (reqLvl >= 30) {
    return '卓越 (Exceptional)';
  }
  return '普通 (Normal)';
}

/**
 * 建構完整的可檢索與拖曳的裝備清單
 */
export function buildCatalogItems(): CatalogItem[] {
  const items: CatalogItem[] = [];

  // 1. 暗金裝備
  UNIQUE_ITEMS_DATA.forEach((u) => {
    const stats = parseItemAttributes(u.attributes);
    // 預設基礎防禦估算
    if (['helm', 'armor', 'shield'].includes(u.slot) && !stats.defense) {
      stats.defense = u.slot === 'armor' ? 500 : u.slot === 'shield' ? 150 : 120;
    }
    // 盾牌預設格擋
    if (u.slot === 'shield' && !stats.blockChance) {
      stats.blockChance = u.name.includes('暴風') ? 67 : u.name.includes('飾金') ? 82 : 60;
    }

    items.push({
      id: u.id,
      name: u.name,
      nameEn: u.nameEn,
      slot: u.slot,
      itemType: 'unique',
      categoryTier1: getCategoryTier1(u.slot),
      categoryTier2: getCategoryTier2(u.baseItem, u.requiredLevel),
      baseItem: u.baseItem,
      requiredLevel: u.requiredLevel,
      requiredStr: u.requiredStr,
      requiredDex: u.requiredDex,
      attributes: u.attributes,
      stats,
    });
  });

  // 2. 符文之語 (轉化為對應 Slot 道具)
  RUNEWORDS_DATA.forEach((rw) => {
    let slot: GearSlot = 'weapon';
    const baseStr = rw.allowedBases.join(' / ');
    if (baseStr.includes('裝甲') || baseStr.includes('胸甲') || baseStr.includes('衣服')) {
      slot = 'armor';
    } else if (baseStr.includes('盾牌') || baseStr.includes('聖騎士盾')) {
      slot = 'shield';
    } else if (baseStr.includes('頭盔') || baseStr.includes('面甲')) {
      slot = 'helm';
    }

    const stats = parseItemAttributes(rw.attributes);
    if (slot === 'armor') stats.defense = (stats.defense || 0) + 750;
    if (slot === 'shield') {
      stats.defense = (stats.defense || 0) + 160;
      stats.blockChance = (stats.blockChance || 0) + 60;
    }

    items.push({
      id: `rw_${rw.id}`,
      name: `【符文語】${rw.name}`,
      nameEn: rw.nameEn,
      slot,
      itemType: 'runeword',
      categoryTier1: getCategoryTier1(slot),
      categoryTier2: rw.requiredLevel >= 60 ? '菁英 (Elite)' : '卓越 (Exceptional)',
      baseItem: rw.recommendedBases || rw.allowedBases[0] || '符文底材',
      requiredLevel: rw.requiredLevel,
      attributes: rw.attributes,
      stats,
    });
  });

  // 3. 套裝裝備
  SET_ITEMS_DATA.forEach((set) => {
    set.pieces.forEach((piece) => {
      const stats = parseItemAttributes(piece.attributes);
      items.push({
        id: `set_${piece.id}`,
        name: `【套裝】${piece.name}`,
        nameEn: piece.nameEn,
        slot: piece.slot,
        itemType: 'set',
        categoryTier1: getCategoryTier1(piece.slot),
        categoryTier2: getCategoryTier2(piece.baseItem, piece.requiredLevel),
        baseItem: piece.baseItem,
        requiredLevel: piece.requiredLevel,
        attributes: piece.attributes,
        stats,
      });
    });
  });

  // 4. 傳奇聖物護身符 (Charms)
  const holyCharms: CatalogItem[] = [
    {
      id: "charm_annihilus",
      name: "毀滅小護身符 (Annihilus 20/20/10)",
      nameEn: "Annihilus Small Charm",
      slot: "charm",
      itemType: "charm",
      categoryTier1: "jewelry",
      categoryTier2: "傳奇聖物護身符",
      baseItem: "小護身符",
      requiredLevel: 70,
      attributes: [
        "+1 所有技能等級",
        "+20 所有屬性 (力量、敏捷、體力、精力)",
        "所有抗性 +20",
        "+10% 獲得經驗值"
      ],
      stats: {
        allSkills: 1,
        strength: 20,
        dexterity: 20,
        vitality: 20,
        energy: 20,
        allRes: 20
      }
    },
    {
      id: "charm_torch",
      name: "地獄火炬 (Hellfire Torch +3技能 20/20)",
      nameEn: "Hellfire Torch Large Charm",
      slot: "charm",
      itemType: "charm",
      categoryTier1: "jewelry",
      categoryTier2: "傳奇聖物護身符",
      baseItem: "大型護身符",
      requiredLevel: 75,
      attributes: [
        "+3 職業全技能等級",
        "+20 所有屬性 (力量、敏捷、體力、精力)",
        "所有抗性 +20",
        "+8 照亮範圍",
        "打擊時 5% 機率施放 10 級火風暴"
      ],
      stats: {
        allSkills: 3,
        strength: 20,
        dexterity: 20,
        vitality: 20,
        energy: 20,
        allRes: 20
      }
    },
    {
      id: "charm_sunder_cold",
      name: "冷裂之破免板 (Cold Sunder)",
      nameEn: "Cold Sunder Grand Charm",
      slot: "charm",
      itemType: "charm",
      categoryTier1: "jewelry",
      categoryTier2: "傳奇聖物護身符",
      baseItem: "超大護身符",
      requiredLevel: 75,
      attributes: [
        "怪物的冰冷免疫被完全破除 (抗性降至 95%)",
        "自身冰冷抗性 -70%"
      ],
      stats: {
        coldRes: -70
      }
    },
    {
      id: "charm_sunder_light",
      name: "裂電之破免板 (Lightning Sunder)",
      nameEn: "Crack of the Heavens Grand Charm",
      slot: "charm",
      itemType: "charm",
      categoryTier1: "jewelry",
      categoryTier2: "傳奇聖物護身符",
      baseItem: "超大護身符",
      requiredLevel: 75,
      attributes: [
        "怪物的閃電免疫被完全破除 (抗性降至 95%)",
        "自身閃電抗性 -70%"
      ],
      stats: {
        lightningRes: -70
      }
    },
    {
      id: "charm_skiller_gc_x4",
      name: "+1 職業核心技能超大板 x4 (+4 技能 / +160 生命)",
      nameEn: "4x Skillers Grand Charms with 40 Life",
      slot: "charm",
      itemType: "charm",
      categoryTier1: "jewelry",
      categoryTier2: "傳奇聖物護身符",
      baseItem: "超大護身符 x4",
      requiredLevel: 42,
      attributes: [
        "+4 核心單系技能等級",
        "+160 額外生命值"
      ],
      stats: {
        allSkills: 4,
        life: 160
      }
    }
  ];

  items.push(...holyCharms);

  return items;
}
