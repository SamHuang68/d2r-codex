import { UniqueItemData } from '../types';

export const UNIQUE_ITEMS_DATA: UniqueItemData[] = [
  // ── 頭盔 (Helms) ──
  {
    id: "harlequin_crest",
    name: "軍帽 (諧角之冠)",
    nameEn: "Harlequin Crest (Shako)",
    baseItem: "軍帽 (Shako)",
    baseItemEn: "Shako",
    slot: "helm",
    requiredLevel: 62,
    requiredStr: 50,
    tags: ["All Skills", "Magic Find", "Life", "Mana", "Damage Reduction", "God Tier"],
    flavorText: "無數冒險者夢寐以求的綠色皮帽，是幾乎所有法系與打寶角色的標配。",
    attributes: [
      "+2 所有技能",
      "+(1.5 每等級) 生命 (依角色等級增加，1-148.5)",
      "+(1.5 每等級) 法力 (依角色等級增加，1-148.5)",
      "傷害減少 10% (DR)",
      "+2 所有屬性",
      "+50% 更佳機會取得魔法裝備 (MF)"
    ]
  },
  {
    id: "griffons_eye",
    name: "獅鷲之眼",
    nameEn: "Griffon's Eye",
    baseItem: "權冠 (Diadem)",
    baseItemEn: "Diadem",
    slot: "helm",
    requiredLevel: 76,
    requiredStr: 0,
    tags: ["Lightning", "FCR", "Minus Res", "Sorc / Javazon BIS"],
    flavorText: "電系角色的至尊寶冠，擁有降低敵方電抗與提升電系傷害的致命組合。",
    attributes: [
      "+1 所有技能",
      "+25% 快速施法速度 (FCR)",
      "+100-200 防禦 (變動)",
      "+(10-15)% 閃電技能傷害 (變動)",
      "-(15-20)% 敵人閃電抗性 (變動)"
    ]
  },
  {
    id: "andariels_visage",
    name: "安達利爾的面容",
    nameEn: "Andariel's Visage",
    baseItem: "惡魔頭蓋骨面具 (Demonhead)",
    baseItemEn: "Demonhead",
    slot: "helm",
    requiredLevel: 83,
    requiredStr: 102,
    tags: ["IAS", "Strength", "Life Leech", "Mercenary BIS"],
    flavorText: "傭兵米山頭部最頂級的選擇，通常鑲嵌拉爾符文以抵銷 -30% 火抗懲罰。",
    attributes: [
      "被擊中時有 15% 機率施展等級 15 劇毒新星",
      "+2 所有技能",
      "+20% 攻擊速度 (IAS)",
      "每次命中偷取 8-10% 生命 (變動)",
      "+100-150% 強化防禦 (變動)",
      "+25-30 力量 (變動)",
      "+10% 最大毒素抗性",
      "抗毒 +70%",
      "抗火 -30%"
    ]
  },
  {
    id: "arreats_face",
    name: "亞瑞特的面容",
    nameEn: "Arreat's Face",
    baseItem: "殺手防護面甲 (Slayer Guard)",
    baseItemEn: "Slayer Guard",
    slot: "helm",
    requiredLevel: 42,
    requiredStr: 118,
    tags: ["Barbarian BIS", "All Skills", "Life Leech", "All Resist", "FHR"],
    flavorText: "野蠻人無可爭議的本命頭盔，攻守兼備的極致象徵。",
    attributes: [
      "+2 野蠻人技能",
      "+2 戰鬥技能 (野蠻人專用)",
      "+30% 快速打擊恢復 (FHR)",
      "+20% 攻擊準確率加成",
      "每次命中偷取 3-6% 生命 (變動)",
      "+150-200% 強化防禦 (變動)",
      "+20 力量",
      "+20 敏捷",
      "所有抗性 +30"
    ]
  },
  {
    id: "guillaumes_face",
    name: "吉永之臉",
    nameEn: "Guillaume's Face",
    baseItem: "翼盔 (Winged Helm)",
    baseItemEn: "Winged Helm",
    slot: "helm",
    requiredLevel: 34,
    requiredStr: 115,
    tags: ["Crushing Blow", "Deadly Strike", "FHR", "Uber Tristram"],
    flavorText: "擊殺超大型 Boss 與打紅門崔斯特姆的最佳物理頭盔，帶有 35% 壓碎打擊。",
    attributes: [
      "+30% 快速打擊恢復 (FHR)",
      "35% 機率造成壓碎打擊 (CB)",
      "15% 機率造成致命打擊 (DS)",
      "+120% 強化防禦",
      "+15 力量"
    ]
  },

  // ── 武器 (Weapons) ──
  {
    id: "titans_revenge",
    name: "泰坦的復仇",
    nameEn: "Titan's Revenge",
    baseItem: "祭典標槍 (Ceremonial Javelin)",
    baseItemEn: "Ceremonial Javelin",
    slot: "weapon",
    requiredLevel: 42,
    requiredDex: 109,
    requiredStr: 25,
    tags: ["Javazon BIS", "Auto Replenish", "Skills", "Run Walk"],
    flavorText: "標槍亞馬遜的經典畢業武器，自動補充數量且無形版本物理傷害極高。",
    attributes: [
      "+2 亞馬遜技能",
      "+2 標槍與長矛技能 (亞馬遜專用)",
      "+30% 跑步/步行速度",
      "+150-200% 增強傷害 (ED) (變動)",
      "增加 25-50 傷害",
      "每次命中偷取 5-9% 生命 (變動)",
      "+20 力量",
      "+20 敏捷",
      "自動補充數量 (每 3 秒補充 1 支)"
    ]
  },
  {
    id: "deaths_web",
    name: "破隱法杖 (死亡之網)",
    nameEn: "Death's Web",
    baseItem: "破隱法杖 (Unearthed Wand)",
    baseItemEn: "Unearthed Wand",
    slot: "weapon",
    requiredLevel: 66,
    requiredStr: 25,
    tags: ["Poison Necro BIS", "Minus Poison Res", "Mana After Kill"],
    flavorText: "劇毒新星死靈法師的唯一神話，高達 -50% 敵方毒抗令毒素傷害倍增。",
    attributes: [
      "+1-2 所有技能 (變動)",
      "+1-2 毒素與白骨技能 (死靈法師專用) (變動)",
      "-(40-50)% 敵人毒素抗性 (變動)",
      "+7-12 擊殺後獲得法力 (EK) (變動)",
      "+7-12 擊殺後獲得生命 (變動)"
    ]
  },
  {
    id: "deaths_fathom",
    name: "次元碎片",
    nameEn: "Death's Fathom",
    baseItem: "次元碎片 (Dimensional Shard)",
    baseItemEn: "Dimensional Shard",
    slot: "weapon",
    requiredLevel: 73,
    tags: ["Cold Sorc BIS", "Cold Skill Damage", "FCR", "Resistances"],
    flavorText: "純冰魔法使的畢業天花板，提供最高 +30% 寒冰技能傷害。",
    attributes: [
      "+3 魔法使技能",
      "+20% 快速施法速度 (FCR)",
      "+(15-30)% 冰寒技能傷害 (變動)",
      "抗電 +25-40% (變動)",
      "抗火 +25-40% (變動)"
    ]
  },
  {
    id: "windforce",
    name: "風之力",
    nameEn: "Windforce",
    baseItem: "九頭蛇弓 (Hydra Bow)",
    baseItemEn: "Hydra Bow",
    slot: "weapon",
    requiredLevel: 73,
    requiredDex: 167,
    requiredStr: 134,
    tags: ["Bowazon", "Knockback", "Max Damage", "Classic Trophy"],
    flavorText: "暗黑破壞神二代歷史最悠久的傳奇神器之一，擁有極致的物理大傷與擊退效果。",
    attributes: [
      "+20% 攻擊速度 (IAS)",
      "+250% 增強傷害 (ED)",
      "+(3.125 每等級) 最大傷害值 (依角色等級增加，3-309)",
      "每次命中偷取 6-8% 法力 (變動)",
      "回復體力 30%",
      "+10 力量",
      "+5 敏捷",
      "擊退 (Knockback)"
    ]
  },
  {
    id: "the_reapers_toll",
    name: "死神的喪鐘",
    nameEn: "The Reaper's Toll",
    baseItem: "斬鐮 (Thresher)",
    baseItemEn: "Thresher",
    slot: "weapon",
    requiredLevel: 75,
    requiredDex: 89,
    requiredStr: 114,
    tags: ["Decrepify", "Mercenary BIS", "Ignore Defense", "Life Leech"],
    flavorText: "打擊時高頻率觸發衰老詛咒 (Decrepify)，破除怪物物免並減緩 Boss 攻速移速。",
    attributes: [
      "打擊時有 33% 機率施展等級 1-3 衰老 (Decrepify) (變動)",
      "+190-240% 增強傷害 (ED) (變動)",
      "忽略目標防禦",
      "+4-44 冰寒傷害",
      "每次命中偷取 11-15% 生命 (變動)",
      "33% 機率造成致命打擊 (DS)"
    ]
  },

  // ── 衣服 (Body Armor) ──
  {
    id: "skin_of_the_vipermagi",
    name: "蝮蛇法師之皮 (蛇皮)",
    nameEn: "Skin of the Vipermagi",
    baseItem: "蛇皮甲 (Serpentskin Armor)",
    baseItemEn: "Serpentskin Armor",
    slot: "armor",
    requiredLevel: 29,
    requiredStr: 43,
    tags: ["FCR", "All Skills", "All Resist", "Early to Endgame Caster"],
    flavorText: "法系拓荒至中後期的首選，+1 全技能、30 FCR 與高達 35 的全抗性。",
    attributes: [
      "+1 所有技能",
      "+30% 快速施法速度 (FCR)",
      "+120% 強化防禦",
      "所有抗性 +20-35 (變動)",
      "魔法傷害減少 9-13 (變動)"
    ]
  },
  {
    id: "tyraels_might",
    name: "泰瑞爾的力量",
    nameEn: "Tyrael's Might",
    baseItem: "神聖盔甲 (Sacred Armor)",
    baseItemEn: "Sacred Armor",
    slot: "armor",
    requiredLevel: 84,
    requiredStr: 0,
    tags: ["Holy Grail Ultra Rare", "Cannot Be Frozen", "Slain Rest In Peace"],
    flavorText: "聖杯挑戰中最難掉落的三大神物之一！需求力量為 0，且使殺死的怪物安息防爆屍。",
    attributes: [
      "+20% 跑步/步行速度",
      "+50-100% 對惡魔傷害 (變動)",
      "+50-100% 對不死生物傷害 (變動)",
      "消滅怪物使之安息 (Slain Monsters Rest in Peace)",
      "+120-150% 強化防禦 (變動)",
      "+20-30 力量 (變動)",
      "所有抗性 +20-30 (變動)",
      "無法被凍結 (CBF)",
      "裝備需求 -100%"
    ]
  },

  // ── 盾牌 (Shields) ──
  {
    id: "herald_of_zakarum",
    name: "飾金盾牌 (薩卡蘭姆使者)",
    nameEn: "Herald of Zakarum (HOZ)",
    baseItem: "飾金盾 (Gilded Shield)",
    baseItemEn: "Gilded Shield",
    slot: "shield",
    requiredLevel: 42,
    requiredStr: 89,
    tags: ["Paladin BIS", "All Skills", "Block Rate", "All Resist", "Strength"],
    flavorText: "聖騎士的終極專用盾，賦予高達 +4 作戰技能、超高格擋率與 50 全抗性。",
    attributes: [
      "+2 聖騎士技能",
      "+2 作戰技能 (聖騎士專用)",
      "+30% 快速格擋速度 (FBR)",
      "+30% 增加格擋機率",
      "+150-200% 強化防禦 (變動)",
      "+20 力量",
      "+20 活力",
      "所有抗性 +50"
    ]
  },
  {
    id: "stormshield",
    name: "暴風之盾 (統治者大盾 / 物免盾)",
    nameEn: "Stormshield",
    baseItem: "統治者大盾 (Monarch)",
    baseItemEn: "Monarch",
    slot: "shield",
    requiredLevel: 73,
    requiredStr: 156,
    tags: ["Damage Reduction 35%", "Block Rate", "Hardcore BIS"],
    flavorText: "專家級硬核 (Hardcore) 模式的保命神盾，高達 35% 物理傷害減免。",
    attributes: [
      "+35% 快速格擋速度 (FBR)",
      "+25% 增加格擋機率",
      "+(3.75 每等級) 防禦 (依角色等級增加)",
      "+30 力量",
      "抗寒 +60%",
      "抗電 +25%",
      "傷害減少 35% (DR)",
      "無法被破壞"
    ]
  },
  {
    id: "homunculus",
    name: "侏儒 (荷曼庫魯斯)",
    nameEn: "Homunculus",
    baseItem: "領頭羊之首 (Hierophant Trophy)",
    baseItemEn: "Hierophant Trophy",
    slot: "shield",
    requiredLevel: 42,
    requiredStr: 58,
    tags: ["Necromancer BIS", "All Skills", "Mana Regen", "All Resist"],
    flavorText: "死靈法師首屈一指的全面盾牌，法力回充、高全抗與強大格擋屬性。",
    attributes: [
      "+2 死靈法師技能",
      "+2 詛咒技能 (死靈法師專用)",
      "+30% 快速格擋速度 (FBR)",
      "+40% 增加格擋機率",
      "+150-200% 強化防禦 (變動)",
      "+20 精力",
      "法力恢復 +33%",
      "所有抗性 +40",
      "+5 擊殺後獲得法力 (EK)"
    ]
  },

  // ── 腰帶、手套、鞋子 (Belts, Gloves, Boots) ──
  {
    id: "arachnid_mesh",
    name: "蛛網腰帶 (技能腰帶)",
    nameEn: "Arachnid Mesh",
    baseItem: "蛛網腰帶 (Spiderweb Sash)",
    baseItemEn: "Spiderweb Sash",
    slot: "belt",
    requiredLevel: 80,
    requiredStr: 50,
    tags: ["All Skills", "FCR", "Caster BIS"],
    flavorText: "全遊戲唯一加技能等級與施法速度的腰帶，法系職業無可替代的畢業組件。",
    attributes: [
      "+1 所有技能",
      "+20% 快速施法速度 (FCR)",
      "減慢目標 10%",
      "+90-120% 強化防禦 (變動)",
      "增加法力上限 5%",
      "等級 3 毒素新星 (11 次聚氣)"
    ]
  },
  {
    id: "magefist",
    name: "法師之拳 (法拳)",
    nameEn: "Magefist",
    baseItem: "輕型鐵手套 (Light Gauntlets)",
    baseItemEn: "Light Gauntlets",
    slot: "gloves",
    requiredLevel: 23,
    requiredStr: 45,
    tags: ["FCR 20%", "Fire Skills", "Mana Regen", "Caster Standard"],
    flavorText: "提供 20% 施法速度與 25% 法力回充，對火系技能更有 +1 額外強化。",
    attributes: [
      "+1 火焰技能",
      "+20% 快速施法速度 (FCR)",
      "增加 1-6 火焰傷害",
      "+20-30% 強化防禦 (變動)",
      "+10 防禦",
      "法力恢復 +25%"
    ]
  },
  {
    id: "war_traveler",
    name: "戰爭旅者 (戰旅)",
    nameEn: "War Traveler",
    baseItem: "戰場之靴 (Battle Boots)",
    baseItemEn: "Battle Boots",
    slot: "boots",
    requiredLevel: 42,
    requiredStr: 95,
    tags: ["Magic Find 50%", "Run Walk", "Physical Damage", "MF Boots BIS"],
    flavorText: "打寶獵人的夢想之靴，最高可達 50% 魔法尋獲率，並附帶 15-25 物理白字傷害。",
    attributes: [
      "+25% 跑步/步行速度",
      "+150-190% 強化防禦 (變動)",
      "+10 力量",
      "+10 活力",
      "增加 15-25 傷害",
      "體力消耗減慢 40%",
      "攻擊者受到傷害 5-10",
      "+30-50% 更佳機會取得魔法裝備 (MF) (變動)"
    ]
  },
  {
    id: "gore_rider",
    name: "蝕肉騎士",
    nameEn: "Gore Rider",
    baseItem: "巨戰之靴 (War Boots)",
    baseItemEn: "War Boots",
    slot: "boots",
    requiredLevel: 47,
    requiredStr: 94,
    tags: ["Crushing Blow", "Deadly Strike", "Open Wounds", "Physical BIS"],
    flavorText: "近戰物理角色的三斬神靴，壓碎打擊、致命一擊與撕開傷口一次滿足。",
    attributes: [
      "+30% 跑步/步行速度",
      "15% 機率造成壓碎打擊 (CB)",
      "15% 機率造成致命打擊 (DS)",
      "10% 機率造成撕開傷口",
      "+160-200% 強化防禦 (變動)",
      "+20 體力上限",
      "需求 -25%"
    ]
  },

  // ── 首飾與護身符 (Rings, Amulets, Charms) ──
  {
    id: "stone_of_jordan",
    name: "喬丹之石 (SOJ)",
    nameEn: "Stone of Jordan",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 29,
    tags: ["All Skills", "Mana 25%", "Classic Currency", "Diablo Clone Trigger"],
    flavorText: "暗黑二代的傳奇代名詞，賣出大量喬丹之石即可觸發地獄黑毛克隆暗黑破壞神。",
    attributes: [
      "+1 所有技能",
      "增加 1-12 閃電傷害",
      "+20 法力",
      "增加法力上限 25%"
    ]
  },
  {
    id: "raven_frost",
    name: "烏鴉之霜",
    nameEn: "Raven Frost",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 45,
    tags: ["Cannot Be Frozen", "Dexterity", "Attack Rating", "Cold Absorb"],
    flavorText: "物理角色必備一枚，防止冰凍並給予大量敏捷與準確率加成。",
    attributes: [
      "+150-250 準確率 (變動)",
      "+15-45 冰寒傷害，持續 4 秒",
      "+15-20 敏捷 (變動)",
      "+40 法力",
      "冰寒吸收 20%",
      "無法被凍結 (CBF)"
    ]
  },
  {
    id: "maras_kaleidoscope",
    name: "馬拉的萬花筒 (馬拉)",
    nameEn: "Mara's Kaleidoscope",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 67,
    tags: ["All Skills", "All Resist 30", "Attributes", "Amulet Standard"],
    flavorText: "+2 全技能、全屬性 +5 與最高 +30 全抗性，最穩定強大的全能項鍊。",
    attributes: [
      "+2 所有技能",
      "+5 所有屬性",
      "所有抗性 +20-30 (變動)"
    ]
  },
  {
    id: "annihilus",
    name: "毀滅小護身符 (暗黑小符 / USC)",
    nameEn: "Annihilus",
    baseItem: "小護身符 (Small Charm)",
    baseItemEn: "Small Charm",
    slot: "charm",
    requiredLevel: 70,
    tags: ["All Skills", "All Resist 20", "Attributes 20", "Experience Gain"],
    flavorText: "擊殺世界事件地獄黑毛 (Uber Diablo) 的專屬掉落物，每位角色僅能攜帶一個。",
    attributes: [
      "+1 所有技能",
      "+10-20 所有屬性 (變動)",
      "所有抗性 +10-20 (變動)",
      "+5-10% 獲得經驗值 (變動)"
    ]
  },
  {
    id: "hellfire_torch",
    name: "地獄火炬 (大型護身符 / ULC)",
    nameEn: "Hellfire Torch",
    baseItem: "大型護身符 (Large Charm)",
    baseItemEn: "Large Charm",
    slot: "charm",
    requiredLevel: 75,
    tags: ["Class Skills +3", "All Resist 20", "Attributes 20", "Uber Tristram Reward"],
    flavorText: "擊破崔斯特姆三大魔神掉落的終極聖物，給予特定職業 +3 技能與巨額抗性。",
    attributes: [
      "打擊時有 5% 機率施展等級 10 滅絕暴風 (Firestorm)",
      "+3 隨機職業技能",
      "+10-20 所有屬性 (變動)",
      "所有抗性 +10-20 (變動)",
      "+8 照亮範圍",
      "等級 30 刺針靈氣 (10 次聚氣)"
    ]
  },

  // ── RotW DLC 新增裝備 ──
  {
    id: "ars_al_diabolos",
    name: "艾迪亞布羅斯學術",
    nameEn: "Ars Al'Diabolos",
    baseItem: "術士魔典 (Warlock Tome)",
    baseItemEn: "Warlock Tome",
    slot: "shield",
    requiredLevel: 78,
    isNewDLC: true,
    tags: ["RotW", "Warlock", "Demonfire", "All Skills"],
    flavorText: "記載著迪亞布羅真名咒語的漆黑魔典，釋放來自恐懼深淵的烈焰。",
    attributes: [
      "+2 術士技能",
      "+20% 快速施法速度 (FCR)",
      "+(15-25)% 混亂火焰傷害 (變動)",
      "所有抗性 +30-40 (變動)",
      "惡魔使役生命上限提高 25%",
      "被擊中時 10% 施展恐懼咆哮"
    ]
  },
  {
    id: "hellwardens_will",
    name: "地獄刑長的意志",
    nameEn: "Hellwarden's Will",
    baseItem: "角盔 (Horned Helm)",
    baseItemEn: "Horned Helm",
    slot: "helm",
    requiredLevel: 81,
    isNewDLC: true,
    tags: ["RotW", "Chaos Magic", "Damage Reduction", "FHR"],
    flavorText: "統治罪惡深淵刑長的戰盔，凝視它的人將被虛空陰影吞噬心智。",
    attributes: [
      "+2 所有技能",
      "+30% 快速打擊恢復 (FHR)",
      "傷害減少 12%",
      "+25 活力",
      "所有抗性 +25",
      "敵人物理與暗影抗性降低 15%"
    ]
  }
];
