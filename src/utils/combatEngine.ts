import { 
  CharacterAttributes, 
  EquippedSlots, 
  CalculatedCombatStats 
} from '../types/simulator';
import { CHARACTER_CLASSES_DATA } from '../data/classes';
import { BREAKPOINTS_DATA } from '../data/breakpoints';
import { calculateSkillSynergies } from '../data/skills/synergies';

/**
 * 全息戰鬥數值計算引擎
 */
export function calculateCombatStats(
  className: string,
  level: number,
  attributes: CharacterAttributes,
  equipped: EquippedSlots,
  skillPoints: Record<string, number>,
  activeSkillId?: string
): CalculatedCombatStats {
  const classData = CHARACTER_CLASSES_DATA.find(c => c.name === className) || CHARACTER_CLASSES_DATA[0];

  // 1. 彙總所有已穿戴裝備的數值總和
  const gearItems = [
    equipped.helm,
    equipped.amulet,
    equipped.weapon1,
    equipped.shield1,
    equipped.armor,
    equipped.gloves,
    equipped.ring1,
    equipped.belt,
    equipped.ring2,
    equipped.boots,
    ...(equipped.charms || [])
  ].filter(Boolean);

  let gearStr = 0;
  let gearDex = 0;
  let gearVit = 0;
  let gearEne = 0;
  let gearLife = 0;
  let gearMana = 0;
  let gearLifePct = 0;
  let gearManaPct = 0;
  let gearAllSkills = 0;
  let gearClassSkills = 0;
  let gearDef = 0;
  let gearBlockChance = 0;
  let gearAllRes = 0;
  let gearFireRes = 0;
  let gearColdRes = 0;
  let gearLightRes = 0;
  let gearPsnRes = 0;
  let gearMaxLight = 0;
  let gearMaxFire = 0;
  let gearMaxCold = 0;
  let gearMaxPsn = 0;
  let gearFcr = 0;
  let gearFhr = 0;
  let gearIas = 0;
  let gearFbr = 0;
  let gearMf = 0;
  let gearCb = 0;
  let gearDs = 0;
  let gearOw = 0;
  let gearLl = 0;
  let gearMl = 0;
  let gearDr = 0;
  let cannotBeFrozen = false;

  gearItems.forEach(item => {
    if (!item) return;
    const s = item.stats;
    if (s.strength) gearStr += s.strength;
    if (s.dexterity) gearDex += s.dexterity;
    if (s.vitality) gearVit += s.vitality;
    if (s.energy) gearEne += s.energy;
    if (s.life) gearLife += s.life;
    if (s.mana) gearMana += s.mana;
    if (s.lifePercent) gearLifePct += s.lifePercent;
    if (s.manaPercent) gearManaPct += s.manaPercent;
    if (s.allSkills) gearAllSkills += s.allSkills;
    if (s.classSkills && s.classSkills.className === className) gearClassSkills += s.classSkills.bonus;
    if (s.defense) gearDef += s.defense;
    if (s.blockChance) gearBlockChance = Math.max(gearBlockChance, s.blockChance);
    if (s.allRes) gearAllRes += s.allRes;
    if (s.fireRes) gearFireRes += s.fireRes;
    if (s.coldRes) gearColdRes += s.coldRes;
    if (s.lightningRes) gearLightRes += s.lightningRes;
    if (s.poisonRes) gearPsnRes += s.poisonRes;
    if (s.maxLightningRes) gearMaxLight += s.maxLightningRes;
    if (s.maxFireRes) gearMaxFire += s.maxFireRes;
    if (s.maxColdRes) gearMaxCold += s.maxColdRes;
    if (s.maxPoisonRes) gearMaxPsn += s.maxPoisonRes;
    if (s.fcr) gearFcr += s.fcr;
    if (s.fhr) gearFhr += s.fhr;
    if (s.ias) gearIas += s.ias;
    if (s.fbr) gearFbr += s.fbr;
    if (s.magicFind) gearMf += s.magicFind;
    if (s.crushingBlow) gearCb += s.crushingBlow;
    if (s.deadlyStrike) gearDs += s.deadlyStrike;
    if (s.openWounds) gearOw += s.openWounds;
    if (s.damageReducedPercent) gearDr += s.damageReducedPercent;
    if (s.cannotBeFrozen) cannotBeFrozen = true;
  });

  // 2. 四維屬性結算
  const totalStr = attributes.baseStr + attributes.allocatedStr + gearStr;
  const totalDex = attributes.baseDex + attributes.allocatedDex + gearDex;
  const totalVit = attributes.baseVit + attributes.allocatedVit + gearVit;
  const totalEne = attributes.baseEne + attributes.allocatedEne + gearEne;

  // 3. 生命與法力計算
  const lifePerVit = classData.statGains?.lifePerVit || 2;
  const manaPerEne = classData.statGains?.manaPerEne || 1.5;
  const baseLife = (classData.startingStats?.life || 50) + (level - 1) * 2 + (totalVit * lifePerVit) + gearLife;
  const baseMana = (classData.startingStats?.mana || 20) + (level - 1) * 1.5 + (totalEne * manaPerEne) + gearMana;

  // 假定標配戰爭召喚 (CTA BO喊血): +60% 生命與法力加成 (如果武器副手或技能有配)
  const isBOMultiplied = equipped.weapon2?.name.includes('召喚') || (skillPoints['battle_orders'] || 0) > 0;
  const boPercent = isBOMultiplied ? 65 : 0;

  const totalLife = Math.round(baseLife * (1 + (gearLifePct + boPercent) / 100));
  const totalMana = Math.round(baseMana * (1 + (gearManaPct + (isBOMultiplied ? 35 : 0)) / 100));
  const totalStamina = 100 + (level * 1.2) + (totalVit * (classData.statGains?.staminaPerVit || 1.2));

  // 4. 防禦與格擋率計算
  // 聖騎士神聖之盾加成
  const holyShieldLvl = (skillPoints['holy_shield'] || 0) + (gearAllSkills + gearClassSkills);
  const holyShieldDefBonus = holyShieldLvl > 0 ? 100 + holyShieldLvl * 15 : 0;
  const holyShieldBlockBonus = holyShieldLvl > 0 ? Math.min(36, 14 + holyShieldLvl * 1) : 0;

  const totalDefense = Math.round((gearDef + Math.floor(totalDex / 4)) * (1 + holyShieldDefBonus / 100));

  // 格擋率計算公式: Block% = min(75, floor( (盾牌總格擋率 * (Dex - 15)) / (Level * 2) ))
  let chanceToBlock = 0;
  if (equipped.shield1) {
    const shieldTotalBlock = Math.min(75, gearBlockChance + holyShieldBlockBonus);
    if (shieldTotalBlock > 0 && totalDex > 15) {
      chanceToBlock = Math.min(75, Math.floor((shieldTotalBlock * (totalDex - 15)) / (level * 2)));
    }
  }

  // 5. 抗性計算 (地獄難度扣 100，三難度安亞任務全通 +30)
  const hellBaseRes = -70; // -100 + 30
  const maxFireRes = 75 + gearMaxFire;
  const maxColdRes = 75 + gearMaxCold;
  const maxLightningRes = 75 + gearMaxLight;
  const maxPoisonRes = 75 + gearMaxPsn;

  const fireRes = Math.min(maxFireRes, hellBaseRes + gearAllRes + gearFireRes);
  const coldRes = Math.min(maxColdRes, hellBaseRes + gearAllRes + gearColdRes);
  const lightningRes = Math.min(maxLightningRes, hellBaseRes + gearAllRes + gearLightRes);
  const poisonRes = Math.min(maxPoisonRes, hellBaseRes + gearAllRes + gearPsnRes);

  // 6. 機制幀數計算 (FCR / FHR)
  const classFcrData = BREAKPOINTS_DATA.find(bp => bp.characterClass === className && bp.type === 'FCR');
  let fcrFrame = 12;
  if (classFcrData) {
    const sorted = [...classFcrData.breakpoints].sort((a, b) => a.requiredValue - b.requiredValue);
    sorted.forEach(bp => {
      if (gearFcr >= bp.requiredValue) fcrFrame = bp.frames;
    });
  }

  const classFhrData = BREAKPOINTS_DATA.find(bp => bp.characterClass === className && bp.type === 'FHR');
  let fhrFrame = 8;
  if (classFhrData) {
    const sorted = [...classFhrData.breakpoints].sort((a, b) => a.requiredValue - b.requiredValue);
    sorted.forEach(bp => {
      if (gearFhr >= bp.requiredValue) fhrFrame = bp.frames;
    });
  }

  // 7. 主力技能即時傷害運算
  const totalSkillsBonus = gearAllSkills + gearClassSkills;
  let activeSkillName = "普通物理打擊";
  let activeSkillLevel = 1;
  let activeSkillDamageMin = 150 + Math.round(totalStr * 1.5);
  let activeSkillDamageMax = 320 + Math.round(totalStr * 2.2);
  let activeSkillDamageType = "物理傷害";

  // 若使用者選定了主力法術技能
  if (activeSkillId) {
    const basePts = skillPoints[activeSkillId] || 0;
    const finalLvl = basePts + totalSkillsBonus;
    activeSkillLevel = finalLvl;

    const synProfile = calculateSkillSynergies(activeSkillId, skillPoints);
    const synMultiplier = 1 + (synProfile.totalIncomingPercent / 100);

    if (activeSkillId === 'blessed_hammer') {
      activeSkillName = "祝福之槌 (Blessed Hammer)";
      activeSkillDamageType = "純魔法傷害";
      // D2R 祝槌傷害成長模型
      const baseDmg = 200 + finalLvl * 85;
      activeSkillDamageMin = Math.round(baseDmg * synMultiplier);
      activeSkillDamageMax = Math.round((baseDmg + 80) * synMultiplier);
    } else if (activeSkillId === 'blizzard') {
      activeSkillName = "暴風雪 (Blizzard)";
      activeSkillDamageType = "冰冷傷害";
      const baseDmg = 450 + finalLvl * 120;
      activeSkillDamageMin = Math.round(baseDmg * synMultiplier);
      activeSkillDamageMax = Math.round((baseDmg + 200) * synMultiplier);
    } else if (activeSkillId === 'lightning') {
      activeSkillName = "閃電 (Lightning)";
      activeSkillDamageType = "閃電傷害";
      activeSkillDamageMin = 1;
      activeSkillDamageMax = Math.round((600 + finalLvl * 280) * synMultiplier);
    } else if (activeSkillId === 'lightning_sentry') {
      activeSkillName = "雷光守衛 (Lightning Sentry)";
      activeSkillDamageType = "閃電陷阱傷害";
      activeSkillDamageMin = 1;
      activeSkillDamageMax = Math.round((450 + finalLvl * 180) * synMultiplier);
    } else if (activeSkillId === 'bone_spear') {
      activeSkillName = "骨矛 (Bone Spear)";
      activeSkillDamageType = "魔法傷害";
      const baseDmg = 280 + finalLvl * 90;
      activeSkillDamageMin = Math.round(baseDmg * synMultiplier);
      activeSkillDamageMax = Math.round((baseDmg + 50) * synMultiplier);
    } else {
      activeSkillName = activeSkillId;
      activeSkillDamageMin = Math.round((200 + finalLvl * 50) * synMultiplier);
      activeSkillDamageMax = Math.round((350 + finalLvl * 75) * synMultiplier);
    }
  }

  return {
    totalStr,
    totalDex,
    totalVit,
    totalEne,
    totalLife,
    totalMana,
    totalStamina,
    totalDefense,
    chanceToBlock,
    fireRes,
    coldRes,
    lightningRes,
    poisonRes,
    maxFireRes,
    maxColdRes,
    maxLightningRes,
    maxPoisonRes,
    fcr: gearFcr,
    fcrFrame,
    fhr: gearFhr,
    fhrFrame,
    ias: gearIas,
    fbr: gearFbr,
    magicFind: gearMf,
    crushingBlow: gearCb,
    deadlyStrike: gearDs,
    openWounds: gearOw,
    lifeLeech: gearLl,
    manaLeech: gearMl,
    damageReducedPercent: gearDr,
    cannotBeFrozen,
    allSkillsBonus: gearAllSkills,
    classSkillsBonus: gearClassSkills,
    activeSkillId,
    activeSkillName,
    activeSkillLevel,
    activeSkillDamageMin,
    activeSkillDamageMax,
    activeSkillDamageType,
    attackRating: 1500 + totalDex * 5
  };
}
