/**
 * 暗黑破壞神 II：獄火重生 (D2R) 技能協同加成 (Synergies) 深度資料庫與即時計算模型
 * 包含各職業技能的相互協同增傷係數、增益屬性與雙向關聯樹。
 */

export interface SynergyRelation {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  percentPerPoint: number;
  bonusType: string;
  displayText: string;
}

export interface CalculatedSynergyItem {
  skillId: string;
  skillName: string;
  points: number;
  percentPerPoint: number;
  totalPercent: number;
  bonusType: string;
  displayText: string;
}

export interface SkillSynergyProfile {
  incoming: CalculatedSynergyItem[];
  outgoing: CalculatedSynergyItem[];
  totalIncomingPercent: number;
}

/**
 * 全職業經典與重生版本協同加成原始關聯表
 */
export const SYNERGY_RELATIONS: SynergyRelation[] = [
  // ================= 魔法使 (Sorceress) =================
  // 冰霜
  { sourceId: "ice_bolt", sourceName: "冰彈", targetId: "ice_blast", targetName: "冰風暴", percentPerPoint: 8, bonusType: "冰冷傷害", displayText: "+8% 冰冷傷害 / 點" },
  { sourceId: "ice_bolt", sourceName: "冰彈", targetId: "glacial_spike", targetName: "冰尖柱", percentPerPoint: 8, bonusType: "冰冷傷害", displayText: "+8% 冰冷傷害 / 點" },
  { sourceId: "ice_bolt", sourceName: "冰彈", targetId: "blizzard", targetName: "暴風雪", percentPerPoint: 5, bonusType: "冰冷傷害", displayText: "+5% 冰冷傷害 / 點" },
  { sourceId: "ice_bolt", sourceName: "冰彈", targetId: "frozen_orb", targetName: "冰封球", percentPerPoint: 2, bonusType: "冰冷傷害", displayText: "+2% 冰冷傷害 / 點" },

  { sourceId: "ice_blast", sourceName: "冰風暴", targetId: "ice_bolt", targetName: "冰彈", percentPerPoint: 15, bonusType: "冰冷傷害", displayText: "+15% 冰冷傷害 / 點" },
  { sourceId: "ice_blast", sourceName: "冰風暴", targetId: "glacial_spike", targetName: "冰尖柱", percentPerPoint: 5, bonusType: "冰冷傷害", displayText: "+5% 冰冷傷害 / 點" },
  { sourceId: "ice_blast", sourceName: "冰風暴", targetId: "blizzard", targetName: "暴風雪", percentPerPoint: 5, bonusType: "冰冷傷害", displayText: "+5% 冰冷傷害 / 點" },

  { sourceId: "glacial_spike", sourceName: "冰尖柱", targetId: "ice_bolt", targetName: "冰彈", percentPerPoint: 15, bonusType: "冰冷傷害", displayText: "+15% 冰冷傷害 / 點" },
  { sourceId: "glacial_spike", sourceName: "冰尖柱", targetId: "ice_blast", targetName: "冰風暴", percentPerPoint: 10, bonusType: "冰冷傷害", displayText: "+10% 冰冷傷害 / 點" },
  { sourceId: "glacial_spike", sourceName: "冰尖柱", targetId: "blizzard", targetName: "暴風雪", percentPerPoint: 5, bonusType: "冰冷傷害", displayText: "+5% 冰冷傷害 / 點" },

  { sourceId: "frost_nova", sourceName: "霜之新星", targetId: "blizzard", targetName: "暴風雪", percentPerPoint: 10, bonusType: "冰冷傷害", displayText: "+10% 冰冷傷害 / 點 (2.4新)" },

  // 閃電
  { sourceId: "charged_bolt", sourceName: "充能彈", targetId: "lightning", targetName: "閃電", percentPerPoint: 8, bonusType: "閃電傷害", displayText: "+8% 閃電傷害 / 點" },
  { sourceId: "charged_bolt", sourceName: "充能彈", targetId: "chain_lightning", targetName: "連鎖閃電", percentPerPoint: 4, bonusType: "閃電傷害", displayText: "+4% 閃電傷害 / 點" },

  { sourceId: "lightning", sourceName: "閃電", targetId: "charged_bolt", targetName: "充能彈", percentPerPoint: 6, bonusType: "閃電傷害", displayText: "+6% 閃電傷害 / 點" },
  { sourceId: "lightning", sourceName: "閃電", targetId: "chain_lightning", targetName: "連鎖閃電", percentPerPoint: 4, bonusType: "閃電傷害", displayText: "+4% 閃電傷害 / 點" },
  { sourceId: "lightning", sourceName: "閃電", targetId: "nova", targetName: "新星", percentPerPoint: 5, bonusType: "閃電傷害", displayText: "+5% 閃電傷害 / 點 (2.4新)" },

  { sourceId: "chain_lightning", sourceName: "連鎖閃電", targetId: "charged_bolt", targetName: "充能彈", percentPerPoint: 6, bonusType: "閃電傷害", displayText: "+6% 閃電傷害 / 點" },
  { sourceId: "chain_lightning", sourceName: "連鎖閃電", targetId: "lightning", targetName: "閃電", percentPerPoint: 8, bonusType: "閃電傷害", displayText: "+8% 閃電傷害 / 點" },

  { sourceId: "static_field", sourceName: "靜態力場", targetId: "nova", targetName: "新星", percentPerPoint: 5, bonusType: "閃電傷害", displayText: "+5% 閃電傷害 / 點 (2.4新)" },
  { sourceId: "telekinesis", sourceName: "心靈傳動", targetId: "energy_shield", targetName: "能量護盾", percentPerPoint: 6.25, bonusType: "傷害轉換法力損耗減免", displayText: "每點降低 6.25% 法力損耗" },

  // 火焰
  { sourceId: "fire_bolt", sourceName: "火彈", targetId: "fire_ball", targetName: "火球", percentPerPoint: 14, bonusType: "火焰傷害", displayText: "+14% 火焰傷害 / 點" },
  { sourceId: "fire_bolt", sourceName: "火彈", targetId: "meteor", targetName: "隕石", percentPerPoint: 5, bonusType: "火焰傷害", displayText: "+5% 火焰傷害 / 點" },
  { sourceId: "fire_bolt", sourceName: "火彈", targetId: "hydra", targetName: "九頭蛇", percentPerPoint: 3, bonusType: "火焰傷害", displayText: "+3% 火焰傷害 / 點" },

  { sourceId: "fire_ball", sourceName: "火球", targetId: "fire_bolt", targetName: "火彈", percentPerPoint: 16, bonusType: "火焰傷害", displayText: "+16% 火焰傷害 / 點" },
  { sourceId: "fire_ball", sourceName: "火球", targetId: "meteor", targetName: "隕石", percentPerPoint: 5, bonusType: "火焰傷害", displayText: "+5% 火焰傷害 / 點" },
  { sourceId: "fire_ball", sourceName: "火球", targetId: "hydra", targetName: "九頭蛇", percentPerPoint: 3, bonusType: "火焰傷害", displayText: "+3% 火焰傷害 / 點" },

  { sourceId: "inferno", sourceName: "地獄之火", targetId: "meteor", targetName: "隕石", percentPerPoint: 3, bonusType: "地面燃燒傷害", displayText: "+3% 燃燒傷害 / 點" },

  // ================= 聖騎士 (Paladin) =================
  { sourceId: "sacrifice", sourceName: "犧牲", targetId: "zeal", targetName: "熱誠", percentPerPoint: 12, bonusType: "物理傷害", displayText: "+12% 物理傷害 / 點" },
  { sourceId: "sacrifice", sourceName: "犧牲", targetId: "vengeance", targetName: "復仇", percentPerPoint: 8, bonusType: "物理傷害", displayText: "+8% 物理傷害 / 點" },

  { sourceId: "blessed_aim", sourceName: "祝福瞄準", targetId: "blessed_hammer", targetName: "祝福之錘", percentPerPoint: 14, bonusType: "魔法傷害", displayText: "+14% 魔法傷害 / 點" },
  { sourceId: "vigor", sourceName: "活力", targetId: "blessed_hammer", targetName: "祝福之錘", percentPerPoint: 14, bonusType: "魔法傷害", displayText: "+14% 魔法傷害 / 點" },

  { sourceId: "defiance", sourceName: "反抗", targetId: "holy_shield", targetName: "神聖之盾", percentPerPoint: 15, bonusType: "防禦力", displayText: "+15% 防禦力 / 點" },

  { sourceId: "holy_bolt", sourceName: "聖光彈", targetId: "fist_of_the_heavens", targetName: "天堂之拳", percentPerPoint: 15, bonusType: "聖光彈魔法傷害", displayText: "+15% 聖光彈傷害 / 點" },
  { sourceId: "holy_shock", sourceName: "神聖衝擊", targetId: "fist_of_the_heavens", targetName: "天堂之拳", percentPerPoint: 7, bonusType: "單體雷電傷害", displayText: "+7% 閃電傷害 / 點" },

  { sourceId: "resist_fire", sourceName: "抗火", targetId: "holy_fire", targetName: "神聖火焰", percentPerPoint: 18, bonusType: "火焰傷害", displayText: "+18% 火焰傷害 / 點" },
  { sourceId: "resist_fire", sourceName: "抗火", targetId: "vengeance", targetName: "復仇", percentPerPoint: 10, bonusType: "火焰傷害", displayText: "+10% 火焰傷害 / 點" },

  { sourceId: "resist_cold", sourceName: "抗寒", targetId: "holy_freeze", targetName: "神聖冰凍", percentPerPoint: 15, bonusType: "冰冷傷害", displayText: "+15% 冰冷傷害 / 點" },
  { sourceId: "resist_cold", sourceName: "抗寒", targetId: "vengeance", targetName: "復仇", percentPerPoint: 10, bonusType: "冰冷傷害", displayText: "+10% 冰冷傷害 / 點" },

  { sourceId: "resist_lightning", sourceName: "抗電", targetId: "holy_shock", targetName: "神聖衝擊", percentPerPoint: 12, bonusType: "閃電傷害", displayText: "+12% 閃電傷害 / 點" },
  { sourceId: "resist_lightning", sourceName: "抗電", targetId: "vengeance", targetName: "復仇", percentPerPoint: 10, bonusType: "閃電傷害", displayText: "+10% 閃電傷害 / 點" },

  { sourceId: "salvation", sourceName: "救贖靈氣", targetId: "holy_fire", targetName: "神聖火焰", percentPerPoint: 8, bonusType: "火焰傷害", displayText: "+8% 火焰傷害 / 點" },
  { sourceId: "salvation", sourceName: "救贖靈氣", targetId: "holy_freeze", targetName: "神聖冰凍", percentPerPoint: 7, bonusType: "冰冷傷害", displayText: "+7% 冰冷傷害 / 點" },
  { sourceId: "salvation", sourceName: "救贖靈氣", targetId: "holy_shock", targetName: "神聖衝擊", percentPerPoint: 4, bonusType: "閃電傷害", displayText: "+4% 閃電傷害 / 點" },

  // ================= 亞馬遜 (Amazon) =================
  { sourceId: "power_strike", sourceName: "威力一擊", targetId: "charged_strike", targetName: "充能一擊", percentPerPoint: 14, bonusType: "閃電傷害", displayText: "+14% 閃電傷害 / 點" },
  { sourceId: "power_strike", sourceName: "威力一擊", targetId: "lightning_fury", targetName: "閃電之怒", percentPerPoint: 1, bonusType: "閃電傷害", displayText: "+1% 閃電傷害 / 點" },
  { sourceId: "lightning_bolt", sourceName: "閃電球", targetId: "charged_strike", targetName: "充能一擊", percentPerPoint: 14, bonusType: "閃電傷害", displayText: "+14% 閃電傷害 / 點" },
  { sourceId: "lightning_bolt", sourceName: "閃電球", targetId: "lightning_fury", targetName: "閃電之怒", percentPerPoint: 1, bonusType: "閃電傷害", displayText: "+1% 閃電傷害 / 點" },
  { sourceId: "charged_strike", sourceName: "充能一擊", targetId: "lightning_fury", targetName: "閃電之怒", percentPerPoint: 1, bonusType: "閃電傷害", displayText: "+1% 閃電傷害 / 點" },
  { sourceId: "lightning_strike", sourceName: "閃電一擊", targetId: "lightning_fury", targetName: "閃電之怒", percentPerPoint: 1, bonusType: "閃電傷害", displayText: "+1% 閃電傷害 / 點" },

  { sourceId: "poison_javelin", sourceName: "毒標槍", targetId: "plague_javelin", targetName: "瘟疫標槍", percentPerPoint: 10, bonusType: "毒素傷害", displayText: "+10% 毒素傷害 / 點" },
  { sourceId: "plague_javelin", sourceName: "瘟疫標槍", targetId: "poison_javelin", targetName: "毒標槍", percentPerPoint: 12, bonusType: "毒素傷害", displayText: "+12% 毒素傷害 / 點" },

  { sourceId: "cold_arrow", sourceName: "冰箭", targetId: "freezing_arrow", targetName: "凍結箭", percentPerPoint: 12, bonusType: "冰冷傷害", displayText: "+12% 冰冷傷害 / 點" },
  { sourceId: "ice_arrow", sourceName: "碎冰箭", targetId: "freezing_arrow", targetName: "凍結箭", percentPerPoint: 5, bonusType: "凍結時間", displayText: "+5% 凍結秒數 / 點" },

  { sourceId: "fire_arrow", sourceName: "火箭", targetId: "exploding_arrow", targetName: "爆裂箭", percentPerPoint: 12, bonusType: "火焰傷害", displayText: "+12% 火焰傷害 / 點" },
  { sourceId: "fire_arrow", sourceName: "火箭", targetId: "immolation_arrow", targetName: "祭典之箭", percentPerPoint: 10, bonusType: "火焰爆炸傷害", displayText: "+10% 火焰傷害 / 點" },
  { sourceId: "exploding_arrow", sourceName: "爆裂箭", targetId: "immolation_arrow", targetName: "祭典之箭", percentPerPoint: 5, bonusType: "燃燒傷害", displayText: "+5% 燃燒秒傷 / 點" },

  // ================= 死靈法師 (Necromancer) =================
  { sourceId: "skeleton_mastery", sourceName: "骷髏專精", targetId: "raise_skeleton", targetName: "骷髏復生", percentPerPoint: 7, bonusType: "骷髏生命與傷害", displayText: "+7% 生命與傷害 / 點" },
  { sourceId: "skeleton_mastery", sourceName: "骷髏專精", targetId: "raise_skeletal_mage", targetName: "骷髏法師", percentPerPoint: 7, bonusType: "法師魔法傷害", displayText: "+7% 元素傷害 / 點" },

  { sourceId: "bone_wall", sourceName: "骨牆", targetId: "bone_armor", targetName: "白骨裝甲", percentPerPoint: 15, bonusType: "傷害吸收值", displayText: "+15 點傷害吸收 / 點" },
  { sourceId: "bone_prison", sourceName: "骨牢", targetId: "bone_armor", targetName: "白骨裝甲", percentPerPoint: 15, bonusType: "傷害吸收值", displayText: "+15 點傷害吸收 / 點" },

  { sourceId: "teeth", sourceName: "牙", targetId: "bone_spear", targetName: "骨矛", percentPerPoint: 7, bonusType: "魔法傷害", displayText: "+7% 魔法傷害 / 點" },
  { sourceId: "bone_wall", sourceName: "骨牆", targetId: "bone_spear", targetName: "骨矛", percentPerPoint: 7, bonusType: "魔法傷害", displayText: "+7% 魔法傷害 / 點" },
  { sourceId: "bone_prison", sourceName: "骨牢", targetId: "bone_spear", targetName: "骨矛", percentPerPoint: 7, bonusType: "魔法傷害", displayText: "+7% 魔法傷害 / 點" },
  { sourceId: "bone_spirit", sourceName: "骨魂", targetId: "bone_spear", targetName: "骨矛", percentPerPoint: 7, bonusType: "魔法傷害", displayText: "+7% 魔法傷害 / 點" },

  { sourceId: "poison_dagger", sourceName: "劇毒匕首", targetId: "poison_nova", targetName: "劇毒新星", percentPerPoint: 10, bonusType: "毒素傷害", displayText: "+10% 毒素傷害 / 點" },
  { sourceId: "poison_explosion", sourceName: "毒爆", targetId: "poison_nova", targetName: "劇毒新星", percentPerPoint: 10, bonusType: "毒素傷害", displayText: "+10% 毒素傷害 / 點" },

  // ================= 野蠻人 (Barbarian) =================
  { sourceId: "howl", sourceName: "嗥叫", targetId: "war_cry", targetName: "戰吼", percentPerPoint: 6, bonusType: "物理傷害", displayText: "+6% 物理傷害 / 點" },
  { sourceId: "taunt", sourceName: "嘲弄", targetId: "war_cry", targetName: "戰吼", percentPerPoint: 6, bonusType: "物理傷害", displayText: "+6% 物理傷害 / 點" },
  { sourceId: "battle_cry", sourceName: "戰鬥狂嚎", targetId: "war_cry", targetName: "戰吼", percentPerPoint: 6, bonusType: "物理傷害", displayText: "+6% 物理傷害 / 點" },

  { sourceId: "howl", sourceName: "嗥叫", targetId: "berserk", targetName: "狂亂/狂戰士", percentPerPoint: 10, bonusType: "魔法傷害", displayText: "+10% 魔法傷害 / 點" },
  { sourceId: "shout", sourceName: "大叫", targetId: "berserk", targetName: "狂亂/狂戰士", percentPerPoint: 10, bonusType: "魔法傷害", displayText: "+10% 魔法傷害 / 點" },

  { sourceId: "shout", sourceName: "大叫", targetId: "battle_orders", targetName: "戰鬥體質", percentPerPoint: 10, bonusType: "持續時間", displayText: "+10% 持續時間 / 點" },
  { sourceId: "battle_orders", sourceName: "戰鬥體質", targetId: "shout", targetName: "大叫", percentPerPoint: 10, bonusType: "持續時間", displayText: "+10% 持續時間 / 點" },

  // ================= 德魯伊 (Druid) =================
  { sourceId: "twister", sourceName: "龍捲風", targetId: "tornado", targetName: "狂風", percentPerPoint: 9, bonusType: "物理傷害", displayText: "+9% 物理傷害 / 點" },
  { sourceId: "cyclone_armor", sourceName: "旋風裝甲", targetId: "tornado", targetName: "狂風", percentPerPoint: 9, bonusType: "物理傷害", displayText: "+9% 物理傷害 / 點" },
  { sourceId: "hurricane", sourceName: "暴風", targetId: "tornado", targetName: "狂風", percentPerPoint: 9, bonusType: "物理傷害", displayText: "+9% 物理傷害 / 點" },

  { sourceId: "cyclone_armor", sourceName: "旋風裝甲", targetId: "hurricane", targetName: "暴風", percentPerPoint: 9, bonusType: "冰冷傷害", displayText: "+9% 冰冷傷害 / 點" },
  { sourceId: "twister", sourceName: "龍捲風", targetId: "hurricane", targetName: "暴風", percentPerPoint: 9, bonusType: "冰冷傷害", displayText: "+9% 冰冷傷害 / 點" },
  { sourceId: "tornado", sourceName: "狂風", targetId: "hurricane", targetName: "暴風", percentPerPoint: 9, bonusType: "持續時間", displayText: "+2 秒持續時間 / 點" },

  { sourceId: "molten_boulder", sourceName: "滾石", targetId: "fissure", targetName: "火山碎屑", percentPerPoint: 12, bonusType: "火焰傷害", displayText: "+12% 火焰傷害 / 點" },
  { sourceId: "volcano", sourceName: "火山", targetId: "fissure", targetName: "火山碎屑", percentPerPoint: 12, bonusType: "火焰傷害", displayText: "+12% 火焰傷害 / 點" },
  { sourceId: "firestorm", sourceName: "火風暴", targetId: "fissure", targetName: "火山碎屑", percentPerPoint: 12, bonusType: "火焰傷害", displayText: "+12% 火焰傷害 / 點" },

  // ================= 刺客 (Assassin) =================
  { sourceId: "shock_web", sourceName: "電擊網", targetId: "lightning_sentry", targetName: "雷光守衛", percentPerPoint: 12, bonusType: "閃電傷害", displayText: "+12% 閃電傷害 / 點" },
  { sourceId: "charged_bolt_sentry", sourceName: "電能守衛", targetId: "lightning_sentry", targetName: "雷光守衛", percentPerPoint: 12, bonusType: "閃電傷害", displayText: "+12% 閃電傷害 / 點" },
  { sourceId: "death_sentry", sourceName: "亡者守衛", targetId: "lightning_sentry", targetName: "雷光守衛", percentPerPoint: 12, bonusType: "閃電傷害", displayText: "+12% 閃電傷害 / 點" },

  { sourceId: "fire_blast", sourceName: "火焰復甦", targetId: "wake_of_fire", targetName: "火燄甦醒", percentPerPoint: 8, bonusType: "火焰傷害", displayText: "+8% 火焰傷害 / 點" },
  { sourceId: "wake_of_inferno", sourceName: "復甦獄火", targetId: "wake_of_fire", targetName: "火燄甦醒", percentPerPoint: 8, bonusType: "火焰傷害", displayText: "+8% 火焰傷害 / 點" },

  // ================= 術士 (Warlock) =================
  { sourceId: "summon_imp", sourceName: "召喚小鬼", targetId: "imp_swarm", targetName: "小鬼軍團", percentPerPoint: 10, bonusType: "火焰傷害", displayText: "+10% 火焰傷害 / 點" },
  { sourceId: "demonic_pact", sourceName: "惡魔契約", targetId: "summon_imp", targetName: "召喚小鬼", percentPerPoint: 8, bonusType: "生命上限", displayText: "+8% 生命上限 / 點" },
  { sourceId: "void_cleave", sourceName: "虛空順劈", targetId: "chaos_strike", targetName: "混沌打擊", percentPerPoint: 12, bonusType: "物理傷害", displayText: "+12% 物理傷害 / 點" },
  { sourceId: "void_nova", sourceName: "虛空新星", targetId: "shadow_bolt", targetName: "暗影箭", percentPerPoint: 8, bonusType: "暗影傷害", displayText: "+8% 暗影傷害 / 點" },
  { sourceId: "nether_beam", sourceName: "冥界光束", targetId: "shadow_bolt", targetName: "暗影箭", percentPerPoint: 8, bonusType: "暗影傷害", displayText: "+8% 暗影傷害 / 點" },
  { sourceId: "chaos_cataclysm", sourceName: "混沌天災", targetId: "shadow_fissure", targetName: "暗影裂縫", percentPerPoint: 12, bonusType: "暗影傷害", displayText: "+12% 暗影傷害 / 點" },
];

/**
 * 計算指定技能的協同雙向狀態
 */
export function calculateSkillSynergies(
  skillId: string,
  investedPoints: Record<string, number>
): SkillSynergyProfile {
  // 接收的協同加成 (Incoming: 誰加成我)
  const incomingRels = SYNERGY_RELATIONS.filter(r => r.targetId === skillId);
  const incoming: CalculatedSynergyItem[] = incomingRels.map(r => {
    const pts = investedPoints[r.sourceId] || 0;
    return {
      skillId: r.sourceId,
      skillName: r.sourceName,
      points: pts,
      percentPerPoint: r.percentPerPoint,
      totalPercent: pts * r.percentPerPoint,
      bonusType: r.bonusType,
      displayText: r.displayText,
    };
  });

  // 輸出的協同加成 (Outgoing: 我加成誰)
  const outgoingRels = SYNERGY_RELATIONS.filter(r => r.sourceId === skillId);
  const myPoints = investedPoints[skillId] || 0;
  const outgoing: CalculatedSynergyItem[] = outgoingRels.map(r => {
    return {
      skillId: r.targetId,
      skillName: r.targetName,
      points: myPoints,
      percentPerPoint: r.percentPerPoint,
      totalPercent: myPoints * r.percentPerPoint,
      bonusType: r.bonusType,
      displayText: r.displayText,
    };
  });

  const totalIncomingPercent = incoming.reduce((acc, item) => acc + item.totalPercent, 0);

  return {
    incoming,
    outgoing,
    totalIncomingPercent,
  };
}

/**
 * 取得與某技能相關的所有協同技能 ID (包含 incoming 與 outgoing)
 */
export function getRelatedSynergySkillIds(skillId: string): string[] {
  const ids = new Set<string>();
  SYNERGY_RELATIONS.forEach(r => {
    if (r.targetId === skillId) ids.add(r.sourceId);
    if (r.sourceId === skillId) ids.add(r.targetId);
  });
  return Array.from(ids);
}
