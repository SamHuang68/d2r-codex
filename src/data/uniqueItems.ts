import type { UniqueItemData } from '../types';

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
  },
  // ── 更多核心暗金武器 (More Unique Weapons) ──
  {
    id: "azurewrath",
    name: "碧藍怒火 (青色憤怒)",
    nameEn: "Azurewrath",
    baseItem: "幻化之刃 (Phase Blade)",
    baseItemEn: "Phase Blade",
    slot: "weapon",
    requiredLevel: 85,
    requiredDex: 136,
    requiredStr: 25,
    tags: ["Sanctuary Aura", "Magic & Cold Damage", "All Skills +1", "IAS 30%"],
    flavorText: "大天使泰瑞爾失落的神劍，自帶等級 10-13 庇護所靈氣，專克不死生物與物理免疫怪。",
    attributes: [
      "+1 所有技能",
      "裝備時賦予等級 10-13 庇護所靈氣 (Sanctuary Aura) (變動)",
      "+30% 攻擊速度 (IAS)",
      "+230-270% 增強傷害 (ED) (變動)",
      "增加 250-500 魔法傷害",
      "增加 250-500 冰寒傷害，持續 3 秒",
      "+5 所有屬性",
      "+3 照亮範圍"
    ]
  },
  {
    id: "wizardspike",
    name: "巫師之刺 (小怪刺)",
    nameEn: "Wizardspike",
    baseItem: "骸骨小刀 (Bone Knife)",
    baseItemEn: "Bone Knife",
    slot: "weapon",
    requiredLevel: 61,
    requiredDex: 75,
    requiredStr: 38,
    tags: ["FCR 50%", "All Resist 75", "Mana Regen", "Caster Budget God"],
    flavorText: "法系角色生存與施法的平民究極神器！驚人的 50% 快速施法速度與 +75 全抗性。",
    attributes: [
      "+50% 快速施法速度 (FCR)",
      "+(2 每等級) 法力 (依角色等級增加，2-198)",
      "法力恢復 +15%",
      "增加法力上限 15%",
      "所有抗性 +75",
      "無法破壞 (Indestructible)"
    ]
  },
  {
    id: "blade_of_ali_baba",
    name: "阿里巴巴之刃",
    nameEn: "Blade of Ali Baba",
    baseItem: "圓月彎刀 (Tulwar)",
    baseItemEn: "Tulwar",
    slot: "weapon",
    requiredLevel: 35,
    requiredDex: 42,
    requiredStr: 56,
    tags: ["Magic Find", "Gold Find", "2 Sockets", "Barbarian Horker BIS"],
    flavorText: "打寶與打錢野蠻人 (Horker) 的副手標配，依等級提供海量 MF 與金幣掉落加成，並自帶 2 鑲孔 (通常鑲嵌 24# 符文)。",
    attributes: [
      "+60-120% 增強傷害 (ED) (變動)",
      "+5-15 敏捷 (變動)",
      "+15 法力",
      "+(1 每等級) +1-99% 更佳機會取得魔法裝備 (MF)",
      "+(2.5 每等級) +2.5-247.5% 額外金幣從怪物身上取得 (GF)",
      "鑲孔 (2)"
    ]
  },
  {
    id: "gull",
    name: "海鷗匕首",
    nameEn: "Gull",
    baseItem: "匕首 (Dagger)",
    baseItemEn: "Dagger",
    slot: "weapon",
    requiredLevel: 4,
    tags: ["Magic Find 100%", "Early Game MF Starter"],
    flavorText: "等級 4 即可裝備的傳奇打寶匕首，在第一章賭博即可入手，固定提供高達 100% MF！",
    attributes: [
      "+100% 更佳機會取得魔法裝備 (MF)",
      "-5 法力",
      "增加 1-15 傷害"
    ]
  },
  {
    id: "the_grandfather",
    name: "祖父 (GF / 巨神之刃)",
    nameEn: "The Grandfather",
    baseItem: "巨神之刃 (Colossus Blade)",
    baseItemEn: "Colossus Blade",
    slot: "weapon",
    requiredLevel: 81,
    requiredDex: 110,
    requiredStr: 189,
    tags: ["Max Damage", "Life 80", "All Attributes", "Classic Trophy"],
    flavorText: "暗黑破壞神二代 1.09 時代的天下第一神劍，高面板增傷與大量生命屬性加成。",
    attributes: [
      "+150-250% 增強傷害 (ED) (變動)",
      "+(2.5 每等級) 最大傷害值 (依角色等級增加，2.5-247.5)",
      "+50% 攻擊準確率加成",
      "+80 生命",
      "+20 所有屬性",
      "無法破壞 (Indestructible)"
    ]
  },
  {
    id: "ribcracker",
    name: "肋骨粉碎者 (敲肋棒)",
    nameEn: "Ribcracker",
    baseItem: "四門棍 (Quarterstaff)",
    baseItemEn: "Quarterstaff",
    slot: "weapon",
    requiredLevel: 31,
    requiredStr: 25,
    tags: ["Crushing Blow 50%", "FHR 50%", "IAS 50%", "Fury Wolf BIS"],
    flavorText: "變形狂怒狼德升級為精英階級後的終極物理木棍，50% 攻速、50% FHR 與 50% 壓碎打擊完美合一。",
    attributes: [
      "+50% 攻擊速度 (IAS)",
      "+50% 快速打擊恢復 (FHR)",
      "+200-300% 增強傷害 (ED) (變動)",
      "增加 30-65 傷害",
      "50% 機率造成壓碎打擊 (CB)",
      "+100% 強化防禦",
      "+100 防禦",
      "+15 敏捷"
    ]
  },
  {
    id: "tomb_reaver",
    name: "盜墓者",
    nameEn: "Tomb Reaver",
    baseItem: "神秘之斧 (Cryptic Axe)",
    baseItemEn: "Cryptic Axe",
    slot: "weapon",
    requiredLevel: 84,
    requiredDex: 103,
    requiredStr: 165,
    tags: ["3 Sockets", "All Resist 50", "Magic Find", "Fury Druid BIS"],
    flavorText: "狼德或米山傭兵的頂級長柄，若隨機為無形且帶有 3 鑲孔，價值極度驚人。",
    attributes: [
      "+60% 攻擊速度 (IAS)",
      "+200-280% 增強傷害 (ED) (變動)",
      "+150-230% 對不死生物的傷害",
      "+250-350 對不死生物的準確率",
      "所有抗性 +30-50 (變動)",
      "10% 重生為被復 raw 者",
      "+50-80% 更佳機會取得魔法裝備 (MF) (變動)",
      "+10-14 擊殺後獲得生命",
      "鑲孔 (1-3) (變動)"
    ]
  },
  {
    id: "eschutas_temper",
    name: "艾斯屈塔的脾氣 (怪異之球)",
    nameEn: "Eschuta's Temper",
    baseItem: "怪異之球 (Eldritch Orb)",
    baseItemEn: "Eldritch Orb",
    slot: "weapon",
    requiredLevel: 72,
    tags: ["All Skills +3", "FCR 40%", "Fire & Lightning Damage"],
    flavorText: "電法與火法除了橡樹與眼光外的純輸出選擇，自帶 40% FCR 與雙元素百分比增傷。",
    attributes: [
      "+1-3 魔法使技能 (變動)",
      "+40% 快速施法速度 (FCR)",
      "+(10-20)% 閃電技能傷害 (變動)",
      "+(10-20)% 火焰技能傷害 (變動)",
      "+20-30 精力 (變動)"
    ]
  },
  {
    id: "arm_of_king_leoric",
    name: "李奧瑞克王的武器 (李奧瑞克法杖)",
    nameEn: "Arm of King Leoric",
    baseItem: "古墓魔杖 (Tomb Wand)",
    baseItemEn: "Tomb Wand",
    slot: "weapon",
    requiredLevel: 36,
    tags: ["Summoner Necro +5", "Skeleton Mastery", "Raise Skeleton"],
    flavorText: "召喚死靈法師的傳統圖騰，對骷髏復甦、骷髏支配與法師骷髏提供無與倫比的高額技能加乘。",
    attributes: [
      "+2 死靈法師技能",
      "+2 召喚技能 (死靈法師專用)",
      "+3 骷髏復甦 (Raise Skeleton)",
      "+3 骷髏支配 (Skeleton Mastery)",
      "+2 召喚骷髏法師",
      "+2 恐懼",
      "+10% 快速施法速度 (FCR)",
      "+(1.25 每等級) 法力 (依角色等級增加)"
    ]
  },

  // ── 更多核心暗金防具與頭盔 (More Unique Helms & Armors) ──
  {
    id: "kiras_guardian",
    name: "奇拉的守護 (奇拉圈)",
    nameEn: "Kira's Guardian",
    baseItem: "三重冠 (Tiara)",
    baseItemEn: "Tiara",
    slot: "helm",
    requiredLevel: 77,
    tags: ["All Resist 70", "Cannot Be Frozen", "FHR 20%"],
    flavorText: "抗性匱乏時的救世之冠，提供全抗最高 +70 與無法被凍結，米山傭兵配守護天使時能達到 90 全抗性極致抗打。",
    attributes: [
      "+20% 快速打擊恢復 (FHR)",
      "+50-120 防禦 (變動)",
      "所有抗性 +50-70 (變動)",
      "無法被凍結 (CBF)"
    ]
  },
  {
    id: "jalals_mane",
    name: "加爾的長髮 (加爾頭)",
    nameEn: "Jalal's Mane",
    baseItem: "圖騰狼頭面甲 (Totemic Mask)",
    baseItemEn: "Totemic Mask",
    slot: "helm",
    requiredLevel: 42,
    requiredStr: 65,
    tags: ["Druid Skills +2", "Shape Shifting +2", "FHR 30%", "All Resist 30"],
    flavorText: "變形與風德皆愛不釋手的德魯伊專屬頭盔，屬性極度均衡且攻守兼備。",
    attributes: [
      "+2 德魯伊技能",
      "+2 變形技能 (德魯伊專用)",
      "+30% 快速打擊恢復 (FHR)",
      "+20% 攻擊準確率加成",
      "+150-200% 強化防禦 (變動)",
      "+20 力量",
      "+20 精力",
      "所有抗性 +30",
      "+5 擊殺後獲得法力 (EK)"
    ]
  },
  {
    id: "nightwings_veil",
    name: "夜翼面紗 (冰頭)",
    nameEn: "Nightwing's Veil",
    baseItem: "螺旋頭盔 (Spired Helm)",
    baseItemEn: "Spired Helm",
    slot: "helm",
    requiredLevel: 67,
    requiredStr: 96,
    tags: ["Cold Skill Damage +15%", "All Skills +2", "Dexterity"],
    flavorText: "純冰魔法使追求最高極限傷害的畢業頭盔，提供最高 +15% 冰寒技能傷害加成。",
    attributes: [
      "+2 所有技能",
      "+(8-15)% 冰寒技能傷害 (變動)",
      "+90-120% 強化防禦 (變動)",
      "+10-20 敏捷 (變動)",
      "+5-9 冰寒吸收 (變動)",
      "冰凍時間減半",
      "裝備需求 -50%"
    ]
  },
  {
    id: "guardian_angel",
    name: "守護天使 (GA甲)",
    nameEn: "Guardian Angel",
    baseItem: "聖堂武士聖衣 (Templar Coat)",
    baseItemEn: "Templar Coat",
    slot: "armor",
    requiredLevel: 45,
    requiredStr: 118,
    tags: ["Max All Resist 15%", "Block Chance 20%", "Mercenary Survival"],
    flavorText: "全遊戲唯一提升全部四系「最大抗性上限 +15%」的神甲，使角色或傭兵元素抗性上限達到恐怖的 90%！",
    attributes: [
      "+1 聖騎士技能",
      "+20% 增加格擋機率",
      "+30% 快速格擋速度 (FBR)",
      "+(2.5 每等級) 對惡魔防禦",
      "+180-200% 強化防禦 (變動)",
      "+15% 最大抗寒",
      "+15% 最大抗火",
      "+15% 最大抗電",
      "+15% 最大抗毒"
    ]
  },
  {
    id: "shaftstop",
    name: "謝夫特斯坦布 (物免甲)",
    nameEn: "Shaftstop",
    baseItem: "織網甲 (Mesh Armor)",
    baseItemEn: "Mesh Armor",
    slot: "armor",
    requiredLevel: 38,
    requiredStr: 92,
    tags: ["Damage Reduction 30%", "Life 60", "Hardcore BIS"],
    flavorText: "開荒期傭兵與近戰角色最強物理減傷甲，提供整整 30% 物理傷害減免 (DR)。",
    attributes: [
      "傷害減少 30% (DR)",
      "+160-220% 強化防禦 (變動)",
      "+250 對遠程攻擊防禦",
      "+60 生命"
    ]
  },
  {
    id: "ormus_robes",
    name: "奧瑪斯的長袍",
    nameEn: "Ormus' Robes",
    baseItem: "灰暮罩衣 (Dusk Shroud)",
    baseItemEn: "Dusk Shroud",
    slot: "armor",
    requiredLevel: 75,
    requiredStr: 77,
    tags: ["FCR 20%", "Skill Specific +3", "Fire/Cold/Light +15%"],
    flavorText: "極致法系傷害甲，隨機出各系 +15% 技能傷害與隨機一項 +3 特定法師技能（如 +3 暴風雪或 +3 閃電）。",
    attributes: [
      "+20% 快速施法速度 (FCR)",
      "+(10-15)% 冰寒技能傷害 (變動)",
      "+(10-15)% 火焰技能傷害 (變動)",
      "+(10-15)% 閃電技能傷害 (變動)",
      "+3 隨機魔法使技能 (變動)",
      "法力恢復 +10-15% (變動)"
    ]
  },
  {
    id: "skullders_ire",
    name: "詩寇蒂的憤怒 (MF甲)",
    nameEn: "Skullder's Ire",
    baseItem: "羅瑟戰甲 (Russet Armor)",
    baseItemEn: "Russet Armor",
    slot: "armor",
    requiredLevel: 42,
    requiredStr: 97,
    tags: ["All Skills +1", "Magic Find (Per Level)", "Auto Repair Ethereal"],
    flavorText: "經典打寶甲之王，耐久度自動修復使得無形 (Ethereal) 版本防禦破千，依等級增加高達 100%+ MF。",
    attributes: [
      "+1 所有技能",
      "+(1.25 每等級) +1.25-123.75% 更佳機會取得魔法裝備 (MF)",
      "+160-200% 強化防禦 (變動)",
      "魔法傷害減少 10",
      "耐久度每 5 秒自動修復 1 點"
    ]
  },

  // ── 更多核心手套、靴子、腰帶 (More Gloves, Boots, Belts) ──
  {
    id: "draculs_grasp",
    name: "卓古拉之握 (卓古拉)",
    nameEn: "Dracul's Grasp",
    baseItem: "吸血鬼骸骨手套 (Vampirebone Gloves)",
    baseItemEn: "Vampirebone Gloves",
    slot: "gloves",
    requiredLevel: 76,
    requiredStr: 50,
    tags: ["Life Tap 5%", "Open Wounds 25%", "Life Leech 10%", "Uber Boss BIS"],
    flavorText: "打紅門超級 Boss 的不二神器！打擊時 5% 施展等級 10 偷取生命 (Life Tap)，近戰角色一刀吸滿血量。",
    attributes: [
      "打擊時有 5% 機率施展等級 10 偷取生命 (Life Tap)",
      "每次命中偷取 7-10% 生命 (變動)",
      "25% 機率造成撕開傷口",
      "+90-120% 強化防禦 (變動)",
      "+10-15 力量 (變動)",
      "+5-10 擊殺後獲得生命 (變動)"
    ]
  },
  {
    id: "chance_guards",
    name: "運氣守護 (運氣手套)",
    nameEn: "Chance Guards",
    baseItem: "鎖鏈手套 (Chain Gloves)",
    baseItemEn: "Chain Gloves",
    slot: "gloves",
    requiredLevel: 15,
    requiredStr: 25,
    tags: ["Magic Find 40%", "Gold Find 200%", "Pure MF BIS"],
    flavorText: "純打寶與打錢流派的手套天花板，提供最高 +40% 魔法尋獲率與 +200% 額外金幣獲取。",
    attributes: [
      "+25 攻擊準確率",
      "+20-30% 強化防禦 (變動)",
      "+15 防禦",
      "+200% 額外金幣從怪物身上取得 (GF)",
      "+25-40% 更佳機會取得魔法裝備 (MF) (變動)",
      "+2 照亮範圍"
    ]
  },
  {
    id: "waterwalk",
    name: "水上飄",
    nameEn: "Waterwalk",
    baseItem: "鯊皮之靴 (Sharkskin Boots)",
    baseItemEn: "Sharkskin Boots",
    slot: "boots",
    requiredLevel: 32,
    requiredStr: 47,
    tags: ["Life 65", "Max Fire Res 5%", "Faster Run Walk 20%"],
    flavorText: "法系角色（如風德、祝槌丁）極度偏愛的防禦之靴，提供高達 +65 原始生命與 +5% 最大抗火。",
    attributes: [
      "+20% 跑步/步行速度",
      "+180-210% 強化防禦 (變動)",
      "+100 對遠程攻擊防禦",
      "+15 敏捷",
      "+45-65 生命 (變動)",
      "+40 最大體力",
      "體力消耗減慢 50%",
      "+5% 最大火焰抗性"
    ]
  },
  {
    id: "sandstorm_trek",
    name: "沙暴之旅 (沙暴靴)",
    nameEn: "Sandstorm Trek",
    baseItem: "食人魔之靴 (Scarabshell Boots)",
    baseItemEn: "Scarabshell Boots",
    slot: "boots",
    requiredLevel: 64,
    requiredStr: 91,
    tags: ["FHR 20%", "Strength 15", "Vitality 15", "Poison Resist 70%"],
    flavorText: "自帶自動修復耐久度，因此無形版本 (Eth Trek) 廣受追捧，提供 20% FHR、大量雙屬性與高達 70% 毒抗。",
    attributes: [
      "+20% 跑步/步行速度",
      "+20% 快速打擊恢復 (FHR)",
      "+140-170% 強化防禦 (變動)",
      "+10-15 力量 (變動)",
      "+10-15 活力 (變動)",
      "+(1 每等級) 最大體力",
      "體力消耗減慢 50%",
      "抗毒 +40-70% (變動)",
      "耐久度每 20 秒自動修復 1 點"
    ]
  },
  {
    id: "thundergods_vigor",
    name: "雷神之力 (雷神腰帶)",
    nameEn: "Thundergod's Vigor",
    baseItem: "巨戰腰帶 (War Belt)",
    baseItemEn: "War Belt",
    slot: "belt",
    requiredLevel: 47,
    requiredStr: 110,
    tags: ["Lightning Absorb 20", "Max Light Res 10%", "Strength 20", "Vitality 20"],
    flavorText: "黑魂 (Black Souls) 與電鬼的噩夢！提供 +10% 最大抗電與 +20 閃電吸收，讓電鬼攻擊反而為你補血。",
    attributes: [
      "被擊中時有 5% 機率施展等級 7 狂怒撕裂",
      "+1-2 閃電打擊 (亞馬遜專用) (變動)",
      "+1-2 閃電狂怒 (亞馬遜專用) (變動)",
      "+160-200% 強化防禦 (變動)",
      "+20 力量",
      "+20 活力",
      "+10% 最大閃電抗性",
      "+20 閃電吸收"
    ]
  },
  {
    id: "verdungos_hearty_cord",
    name: "維爾戈登的雲之束帶 (心結腰帶)",
    nameEn: "Verdungo's Hearty Cord",
    baseItem: "秘儀腰帶 (Mithril Coil)",
    baseItemEn: "Mithril Coil",
    slot: "belt",
    requiredLevel: 63,
    requiredStr: 106,
    tags: ["Damage Reduction 15%", "Vitality 40", "FHR 10%", "Survival Belt BIS"],
    flavorText: "近戰與專家級模式的最佳防禦腰帶，高達 +40 體力與 15% 物理傷害減免 (DR)。",
    attributes: [
      "+10% 快速打擊恢復 (FHR)",
      "+90-140% 強化防禦 (變動)",
      "+30-40 活力 (變動)",
      "生命恢復 +10-13 (變動)",
      "+100-120 最大體力 (變動)",
      "傷害減少 10-15% (DR) (變動)"
    ]
  },
  {
    id: "razortail",
    name: "穿刺腰帶 (穿心)",
    nameEn: "Razortail",
    baseItem: "鯊皮腰帶 (Sharkskin Belt)",
    baseItemEn: "Sharkskin Belt",
    slot: "belt",
    requiredLevel: 32,
    requiredStr: 20,
    tags: ["Piercing Attack 33%", "Max Damage +10", "Bowazon / Javazon BIS"],
    flavorText: "標馬與弓馬輸出翻倍的秘密！提供 +33% 穿刺機率，配合被動技能輕鬆達成 100% 穿透彈幕。",
    attributes: [
      "+33% 穿刺攻擊 (Piercing Attack)",
      "+120-150% 強化防禦 (變動)",
      "+15 防禦",
      "+10 最大傷害值",
      "+15 敏捷"
    ]
  },

  // ── 更多首飾 (More Rings & Amulets) ──
  {
    id: "highlords_wrath",
    name: "大君之怒 (大君)",
    nameEn: "Highlord's Wrath",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 65,
    tags: ["All Skills +1", "IAS 20%", "Deadly Strike (Per Level)", "Physical BIS"],
    flavorText: "所有物理近戰與遠程角色的畢業神鍊！提供 20% 攻速與依角色等級成長的高達 37% 致命打擊 (DS)。",
    attributes: [
      "+1 所有技能",
      "+20% 攻擊速度 (IAS)",
      "+(0.375 每等級) 機率造成致命打擊 (DS) (依角色等級增加，0.375-37.125%)",
      "+1-30 閃電傷害",
      "抗電 +35%",
      "攻擊者受到閃電傷害 15"
    ]
  },
  {
    id: "the_cats_eye",
    name: "貓眼",
    nameEn: "The Cat's Eye",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 50,
    tags: ["Faster Run Walk 30%", "IAS 20%", "Dexterity 25"],
    flavorText: "兼具極速跑圖與攻速的敏捷項鍊，弓馬與野蠻人競速首選。",
    attributes: [
      "+30% 跑步/步行速度",
      "+20% 攻擊速度 (IAS)",
      "+100 對遠程攻擊防禦",
      "+100 防禦",
      "+25 敏捷"
    ]
  },
  {
    id: "nagelring",
    name: "拿各的戒指 (拿各)",
    nameEn: "Nagelring",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 7,
    tags: ["Magic Find 30%", "Attack Rating", "Early Game MF Ring"],
    flavorText: "最親民純粹的打寶戒指，最高可隨機出現 30% MF。",
    attributes: [
      "攻擊者受到傷害 3",
      "+50-75 攻擊準確率 (變動)",
      "魔法傷害減少 3",
      "+15-30% 更佳機會取得魔法裝備 (MF) (變動)"
    ]
  },
  {
    id: "dwarf_star",
    name: "矮人之星 (矮人)",
    nameEn: "Dwarf Star",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 45,
    tags: ["Fire Absorb 15%", "Life 40", "Gold Find 100%"],
    flavorText: "火吸保命與打錢必備戒指，打崔凡克瘸子議會或地獄熔爐時必備。",
    attributes: [
      "火焰吸收 15%",
      "+40 生命",
      "+40 最大體力",
      "體力消耗減慢 100%",
      "魔法傷害減少 12-15 (變動)",
      "+100% 額外金幣從怪物身上取得 (GF)"
    ]
  },
  {
    id: "bul_kathos_wedding_band",
    name: "布爾凱索的結婚戒指 (婚戒 / BK)",
    nameEn: "Bul-Kathos' Wedding Band",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 58,
    tags: ["All Skills +1", "Life Leech 5%", "Life (Per Level)"],
    flavorText: "物理近戰唯一加全技能的戒指，兼顧生命成長與偷取生命。",
    attributes: [
      "+1 所有技能",
      "+(0.5 每等級) 生命 (依角色等級增加，0.5-49.5)",
      "每次命中偷取 3-5% 生命 (變動)",
      "+50 最大體力"
    ]
  },
  {
    id: "gheeds_fortune",
    name: "基德的運氣 (基德超大護身符)",
    nameEn: "Gheed's Fortune",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 62,
    tags: ["Magic Find 40%", "Gold Find 160%", "Vendor Discount 15%"],
    flavorText: "全遊戲唯一可裝備的暗金超大護身符，降低商人售價與極高 MF 加成，打寶必備一個。",
    attributes: [
      "+80-160% 額外金幣從怪物身上取得 (GF) (變動)",
      "降低所有商人價格 10-15% (變動)",
      "+20-40% 更佳機會取得魔法裝備 (MF) (變動)"
    ]
  },

  // ── 2.5 天梯破免護身符 (Sunder Charms) ──
  {
    id: "cold_rupture",
    name: "寒冰裂隙 (破冰護身符)",
    nameEn: "Cold Rupture",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Cold Immune", "Cold Sorc Revolution"],
    flavorText: "直接破除怪物的冰寒免疫抗性，將其抗性強制壓制為 95%，但自身抗寒受到削弱。",
    attributes: [
      "怪物的冰寒免疫無效化 (強制降為 95% 抗性)",
      "冰寒抗性 -(70-90)% (變動)"
    ]
  },
  {
    id: "flame_rift",
    name: "火焰裂痕 (破火護身符)",
    nameEn: "Flame Rift",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Fire Immune", "Fire Druid / Fire Sorc"],
    flavorText: "使怪物的火焰免疫無效化，常搭配搖曳焰火頭盔抵銷抗火負面效果。",
    attributes: [
      "怪物的火焰免疫無效化 (強制降為 95% 抗性)",
      "火焰抗性 -(70-90)% (變動)"
    ]
  },
  {
    id: "crack_of_the_heavens",
    name: "天破之擊 (破電護身符)",
    nameEn: "Crack of the Heavens",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Lightning Immune", "Lightning Sorc / Javazon"],
    flavorText: "破除怪物閃電免疫，搭配獅鷲之眼與無限靈氣，令電系彈幕輸出所向披靡。",
    attributes: [
      "怪物的閃電免疫無效化 (強制降為 95% 抗性)",
      "閃電抗性 -(70-90)% (變動)"
    ]
  },
  {
    id: "rotting_fissure",
    name: "腐敗裂痕 (破毒護身符)",
    nameEn: "Rotting Fissure",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Poison Immune", "Poison Necro"],
    flavorText: "使地獄怪物的毒素免疫無效化，毒死靈法師暢行恐懼區域利器。",
    attributes: [
      "怪物的毒素免疫無效化 (強制降為 95% 抗性)",
      "毒素抗性 -(70-90)% (變動)"
    ]
  },
  {
    id: "bone_break",
    name: "分筋裂骨 (破物護身符)",
    nameEn: "Bone Break",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Physical Immune", "Barbarian / Bowazon / Zealot"],
    flavorText: "徹底破解物理免疫 (PI) 怪物，近戰角色無需依靠魔法傷害即可平砍斬殺幽靈。",
    attributes: [
      "怪物的物理免疫無效化 (強制降為 95% 物理抗性)",
      "受到額外物理傷害 +(10-30)% (變動)"
    ]
  },
  {
    id: "black_cleft",
    name: "漆黑裂口 (破魔護身符)",
    nameEn: "Black Cleft",
    baseItem: "超大護身符 (Grand Charm)",
    baseItemEn: "Grand Charm",
    slot: "charm",
    requiredLevel: 75,
    ladderOnly: true,
    tags: ["Sunder Magic Immune", "Hammerdin / Bone Necro"],
    flavorText: "使怪物的魔法傷害免疫無效化，祝槌騎士擊潰魔法免疫木乃伊。",
    attributes: [
      "怪物的魔法免疫無效化 (強制降為 95% 抗性)",
      "魔法抗性 -(45-65)% (變動)"
    ]
  },

  // ── 更多 RotW DLC 暗金裝備 ──
  {
    id: "ars_tor_baalos",
    name: "托巴爾羅斯學術",
    nameEn: "Ars Tor'Baalos",
    baseItem: "術士魔典 (Warlock Tome)",
    baseItemEn: "Warlock Tome",
    slot: "shield",
    requiredLevel: 78,
    isNewDLC: true,
    tags: ["RotW", "Warlock", "Destruction", "All Skills"],
    flavorText: "刻印著毀滅之王巴爾之怨恨的魔典，能召喚毀滅觸鬚穿刺大地。",
    attributes: [
      "+2 術士所有技能",
      "+25% 快速施法速度 (FCR)",
      "增加 150-300 冰寒與混沌傷害",
      "敵人混沌抗性降低 15%",
      "所有抗性 +35",
      "施法時有 10% 機率召喚巴爾毀滅之手"
    ]
  },
  {
    id: "dreadfang",
    name: "懼牙",
    nameEn: "Dreadfang",
    baseItem: "幻化之刃 (Phase Blade)",
    baseItemEn: "Phase Blade",
    slot: "weapon",
    requiredLevel: 80,
    isNewDLC: true,
    tags: ["RotW", "Chaos DPS", "Fast Attack"],
    flavorText: "由地獄恐懼之核鑄造的單手魔劍，每次揮砍都在虛空中撕開恐懼裂口。",
    attributes: [
      "+40% 攻擊速度 (IAS)",
      "+300-350% 增強傷害 (ED) (變動)",
      "忽略目標防禦",
      "+150-280 暗影混沌傷害",
      "30% 機率造成致命打擊 (DS)",
      "擊中使怪物陷入深度恐懼逃竄 40%"
    ]
  },
  {
    id: "wraithstep",
    name: "怨靈步伐",
    nameEn: "Wraithstep",
    baseItem: "巨戰之靴 (War Boots)",
    baseItemEn: "War Boots",
    slot: "boots",
    requiredLevel: 70,
    isNewDLC: true,
    tags: ["RotW", "Phase Walk", "Run Walk 35%"],
    flavorText: "《術士軍臨》DLC 探索地獄深淵獲得的幽靈長靴，允許穿透怪物阻擋穿行。",
    attributes: [
      "+35% 跑步/步行速度",
      "允許穿透怪物移動 (Phasing)",
      "+20% 快速打擊恢復 (FHR)",
      "+15 敏捷",
      "所有抗性 +15",
      "被擊中時 10% 進入幽靈隱匿形態"
    ]
  },
  {
    id: "crown_of_ages",
    name: "歲月之冠 (年紀之冠)",
    nameEn: "Crown of Ages (COA)",
    baseItem: "頭冠 (Corona)",
    baseItemEn: "Corona",
    slot: "helm",
    requiredLevel: 82,
    tags: ["Damage Reduction 10-15%", "All Resist 20-30", "Socketed 1-2", "Cannot Be Frozen"],
    flavorText: "無數紀元興衰交替，歲月沉澱於冠冕之上，散發出不可撼動的厚重光輝。",
    attributes: [
      "+1 所有技能",
      "+30% 快速打擊恢復 (FHR)",
      "+100-150 防禦 (變動)",
      "傷害減少 10-15% (DR) (變動)",
      "所有抗性 +20-30 (變動)",
      "無法被凍結 (CBF)",
      "凹槽 (1-2) (變動)"
    ]
  },
  {
    id: "vampire_gaze",
    name: "吸血鬼的凝視",
    nameEn: "Vampire Gaze",
    baseItem: "殘酷頭盔 (Grim Helm)",
    baseItemEn: "Grim Helm",
    slot: "helm",
    requiredLevel: 41,
    tags: ["Dual Leech", "Damage Reduction 15-20%", "Merc BIS Helm"],
    flavorText: "面具下凝視著飢渴的暗紅眼眸，從敵人的痛苦與哀鳴中汲取生機。",
    attributes: [
      "每次命中偷取 6-8% 法力 (變動)",
      "每次命中偷取 6-8% 生命 (變動)",
      "傷害減少 15-20% (DR) (變動)",
      "魔法傷害減少 10-15 (MDR) (變動)",
      "增加 6-22 冰寒傷害，持續 4 秒",
      "+100% 強化防禦",
      "減緩耐力消耗 15%"
    ]
  },
  {
    id: "crown_of_thieves",
    name: "盜賊皇冠",
    nameEn: "Crown of Thieves",
    baseItem: "大皇冠 (Grand Crown)",
    baseItemEn: "Grand Crown",
    slot: "helm",
    requiredLevel: 49,
    tags: ["Life Steal 9-12%", "Gold Find 80-100%", "Merc Gold Find"],
    flavorText: "曾屬於庇護之地最臭名昭彰的珠寶巨盜，穿戴它的人總能順手牽羊搜刮金幣。",
    attributes: [
      "每次命中偷取 9-12% 生命 (變動)",
      "+160-200% 強化防禦 (變動)",
      "+50 生命",
      "+35 精力",
      "+25 敏捷",
      "抗寒 +33%",
      "80-100% 額外金幣尋獲 (GF) (變動)"
    ]
  },
  {
    id: "giant_skull",
    name: "巨骷髏",
    nameEn: "Giant Skull",
    baseItem: "骸骨面罩 (Bone Visage)",
    baseItemEn: "Bone Visage",
    slot: "helm",
    requiredLevel: 65,
    tags: ["Knockback", "Crushing Blow 10%", "Socketed 1-2", "Bowazon Helm"],
    flavorText: "巨大遠古巨獸的頭骨製成的面罩，任何被其凝視的獵物都會被強大衝擊震退。",
    attributes: [
      "10% 機率造成壓碎打擊 (CB)",
      "擊退 (Knockback)",
      "+250-320 防禦 (變動)",
      "+25-35 力量 (變動)",
      "凹槽 (1-2) (變動)"
    ]
  },
  {
    id: "duriels_shell",
    name: "督瑞爾的殼",
    nameEn: "Duriel's Shell",
    baseItem: "護胸甲 (Cuirass)",
    baseItemEn: "Cuirass",
    slot: "armor",
    requiredLevel: 41,
    tags: ["Cannot Be Frozen", "Life Per Level", "Merc Defense Armor"],
    flavorText: "痛苦之王督瑞爾堅韌甲殼褪下的外皮，冰霜與痛苦無法滲透其分毫。",
    attributes: [
      "+160-200% 強化防禦 (變動)",
      "+(1.25 每等級) 防禦 (依角色等級增加)",
      "+(1 每等級) 生命 (依角色等級增加)",
      "抗火 +20%",
      "抗電 +20%",
      "抗毒 +20%",
      "抗寒 +50%",
      "無法被凍結 (CBF)",
      "+15 力量"
    ]
  },
  {
    id: "the_gladiators_bane",
    name: "角鬥士的禍害",
    nameEn: "The Gladiator's Bane",
    baseItem: "鋼絲絨甲 (Wire Fleece)",
    baseItemEn: "Wire Fleece",
    slot: "armor",
    requiredLevel: 85,
    tags: ["Damage Reduction 15-20", "Magic Damage Reduction 15-20", "Cannot Be Frozen"],
    flavorText: "這具沾滿角鬥場鮮血的戰甲曾抵擋過數千柄利劍與魔法飛彈的洗禮。",
    attributes: [
      "+150-200% 強化防禦 (變動)",
      "+50 防禦",
      "傷害減少 15-20 (DR) (變動)",
      "魔法傷害減少 15-20 (MDR) (變動)",
      "無法被凍結 (CBF)",
      "+30% 快速打擊恢復 (FHR)",
      "毒素持續時間縮短 50%"
    ]
  },
  {
    id: "templars_might",
    name: "聖堂武士的力量",
    nameEn: "Templar's Might",
    baseItem: "神聖盔甲 (Sacred Armor)",
    baseItemEn: "Sacred Armor",
    slot: "armor",
    requiredLevel: 74,
    tags: ["Holy Bolt Aura", "Holy Grail Meme", "Offensive Auras"],
    flavorText: "「又是神聖盔甲！難道是泰瑞爾？……噢不，是聖堂武士！」——無數聖杯冒險者的哀嚎。",
    attributes: [
      "+1-2 聖騎士攻擊靈氣 (變動)",
      "+170-220% 強化防禦 (變動)",
      "+250-300 對遠程攻擊防禦 (變動)",
      "+10-15 力量 (變動)",
      "+10-15 活力 (變動)",
      "+20% 快速打擊恢復 (FHR)",
      "+40-50 最大耐力 (變動)"
    ]
  },
  {
    id: "leviathan",
    name: "海王利維坦",
    nameEn: "Leviathan",
    baseItem: "海妖殼甲 (Kraken Shell)",
    baseItemEn: "Kraken Shell",
    slot: "armor",
    requiredLevel: 65,
    tags: ["Damage Reduction 15-25%", "Strength +40-50", "High Defense Armor"],
    flavorText: "源自深海利維坦巨獸的覆甲，給予穿戴者近乎堅不可摧的物理抗性。",
    attributes: [
      "+170-200% 強化防禦 (變動)",
      "+100-150 防禦 (變動)",
      "+40-50 力量 (變動)",
      "傷害減少 15-25% (DR) (變動)",
      "無法破壞"
    ]
  },
  {
    id: "steelrend",
    name: "鋼鐵手甲",
    nameEn: "Steelrend",
    baseItem: "食人魔鐵手套 (Ogre Gauntlets)",
    baseItemEn: "Ogre Gauntlets",
    slot: "gloves",
    requiredLevel: 70,
    tags: ["Enhanced Damage 30-60%", "Crushing Blow 10%", "Heavy Melee Gloves"],
    flavorText: "以地心玄鐵重鑄的重型拳鎧，一擊便能擊碎巨龍的顱骨。",
    attributes: [
      "+30-60% 增強傷害 (ED) (變動)",
      "10% 機率造成壓碎打擊 (CB)",
      "+170-210 防禦 (變動)",
      "+15-20 力量 (變動)"
    ]
  },
  {
    id: "frostburn",
    name: "霜燃",
    nameEn: "Frostburn",
    baseItem: "鐵手套 (Gauntlets)",
    baseItemEn: "Gauntlets",
    slot: "gloves",
    requiredLevel: 15,
    tags: ["Maximum Mana 40%", "Energy Shield BIS", "Cold Damage"],
    flavorText: "觸感如霜雪般刺骨，但能激發施法者體內最極致的法力潛能。",
    attributes: [
      "增加法力上限 40%",
      "增加 1-6 冰寒傷害，持續 2 秒",
      "+10-20% 強化防禦 (變動)",
      "+30 防禦",
      "+5% 增強傷害"
    ]
  },
  {
    id: "hotspur",
    name: "熱刺靴",
    nameEn: "Hotspur",
    baseItem: "靴子 (Boots)",
    baseItemEn: "Boots",
    slot: "boots",
    requiredLevel: 5,
    tags: ["Max Fire Res +15%", "Fire Res 45%", "Diablo/Uber Fire Immunity"],
    flavorText: "雖然外表只是一雙不起眼的小皮靴，但踏過烈焰熔岩時猶如走在春日草地。",
    attributes: [
      "+15% 最大火焰抗性",
      "抗火 +45%",
      "+10-20% 強化防禦 (變動)",
      "+6 防禦",
      "+15 生命"
    ]
  },
  {
    id: "infernostride",
    name: "地獄闊步",
    nameEn: "Infernostride",
    baseItem: "惡魔皮靴 (Demonhide Boots)",
    baseItemEn: "Demonhide Boots",
    slot: "boots",
    requiredLevel: 32,
    tags: ["Max Fire Res +10%", "Gold Find 40-70%", "Gold Farm Boots"],
    flavorText: "每一步都在地面留下燃燒的硫磺烈焰，崔凡克打錢野蠻人的必備戰靴。",
    attributes: [
      "+20% 跑步/步行速度",
      "+10% 最大火焰抗性",
      "抗火 +30%",
      "40-70% 額外金幣尋獲 (GF) (變動)",
      "+120-150% 強化防禦 (變動)",
      "+15 防禦",
      "被擊中時 5% 機率施展等級 8 烈火之徑"
    ]
  },
  {
    id: "shadow_dancer",
    name: "影舞者",
    nameEn: "Shadow Dancer",
    baseItem: "蛛網靴 (Myrmidon Greaves)",
    baseItemEn: "Myrmidon Greaves",
    slot: "boots",
    requiredLevel: 88,
    tags: ["Shadow Disciplines +1-2", "FHR 30%", "Dexterity +15-25", "Kicksin Boots"],
    flavorText: "極致的陰影殺手踏足無聲，其腳尖附著致命暗影毒刃，是踢腿刺客的最高踢技傷害來源。",
    attributes: [
      "+1-2 刺客暗影訓練技能 (變動)",
      "+30% 快速打擊恢復 (FHR)",
      "+30% 跑步/步行速度",
      "+15-25 敏捷 (變動)",
      "+70-100% 強化防禦 (變動)",
      "需求 -20%"
    ]
  },
  {
    id: "string_of_ears",
    name: "長串之耳 (物免腰帶)",
    nameEn: "String of Ears",
    baseItem: "魔皮腰帶 (Demonhide Sash)",
    baseItemEn: "Demonhide Sash",
    slot: "belt",
    requiredLevel: 29,
    tags: ["Damage Reduction 10-15%", "Life Steal 6-8%", "Melee Survival Belt"],
    flavorText: "串著數十隻不同受害者耳朵的恐怖腰帶，為近戰戰士提供堅實的物理與法術減傷。",
    attributes: [
      "每次命中偷取 6-8% 生命 (變動)",
      "傷害減少 10-15% (DR) (變動)",
      "魔法傷害減少 10-15 (MDR) (變動)",
      "+150-180% 強化防禦 (變動)",
      "+15 防禦"
    ]
  },
  {
    id: "nosferatus_coil",
    name: "吸血聖王之圈",
    nameEn: "Nosferatu's Coil",
    baseItem: "吸血鬼獠牙腰帶 (Vampirefang Belt)",
    baseItemEn: "Vampirefang Belt",
    slot: "belt",
    requiredLevel: 51,
    tags: ["IAS 10%", "Slows Target 10%", "Life Steal 5-7%", "Strength +15"],
    flavorText: "吸血鬼始祖諾斯費拉圖的束帶，能大幅提升出手攻速並減緩被咬噬獵物的動作。",
    attributes: [
      "+10% 攻擊速度 (IAS)",
      "每次命中偷取 5-7% 生命 (變動)",
      "使目標減速 10%",
      "+15 力量",
      "+2 擊殺後獲得法力 (EK)",
      "-3 照亮範圍"
    ]
  },
  {
    id: "snowclash",
    name: "雪之衝突",
    nameEn: "Snowclash",
    baseItem: "戰鬥腰帶 (Battle Belt)",
    baseItemEn: "Battle Belt",
    slot: "belt",
    requiredLevel: 42,
    tags: ["Blizzard +2", "Max Cold Res +15%", "Cold Absorb 15", "Blizzard Sorc Belt"],
    flavorText: "覆蓋著極地永凍冰霜的腰帶，徹底免疫冰系法術並強化暴風雪的極寒暴威。",
    attributes: [
      "+2 暴風雪 (Blizzard) (法師專用)",
      "+3 冰風暴 (Glacial Spike) (法師專用)",
      "+2 冰甲 (Chilling Armor) (法師專用)",
      "+15% 最大冰寒抗性",
      "吸收冰寒 +15",
      "+130-170% 強化防禦 (變動)",
      "被擊中時 5% 機率施展等級 7-20 暴風雪"
    ]
  },
  {
    id: "thunderstroke",
    name: "雷擊",
    nameEn: "Thunderstroke",
    baseItem: "女長槍 (Matriarchal Javelin)",
    baseItemEn: "Matriarchal Javelin",
    slot: "weapon",
    requiredLevel: 69,
    tags: ["Minus Enemy Light Res 15%", "IAS 15%", "Lightning Fury +2-4", "Boss Javazon"],
    flavorText: "純粹的雷電能量凝結而成的長槍，專為瞬間重創單體巨型 Boss 而生。",
    attributes: [
      "+2-4 標槍與長矛技能 (亞馬遜專用) (變動)",
      "+15% 攻擊速度 (IAS)",
      "-15% 敵人閃電抗性",
      "增加 1-511 閃電傷害",
      "打擊時有 20% 機率施展等級 14 連鎖閃電",
      "+150-200% 增強傷害 (ED) (變動)"
    ]
  },
  {
    id: "lightsabre",
    name: "光之軍刀",
    nameEn: "Lightsabre",
    baseItem: "幻化之刃 (Phase Blade)",
    baseItemEn: "Phase Blade",
    slot: "weapon",
    requiredLevel: 58,
    tags: ["Lightning Absorb 25%", "IAS 20%", "Ignore Target Defense", "Classic Lightsaber"],
    flavorText: "劍刃由純粹光芒凝聚而成，發出嗡嗡震鳴，砍穿惡魔鎧甲如切薄紙。",
    attributes: [
      "+20% 攻擊速度 (IAS)",
      "+150-200% 增強傷害 (ED) (變動)",
      "增加 10-30 傷害",
      "忽略目標防禦",
      "增加 60-120 魔法傷害",
      "增加 1-200 閃電傷害",
      "每次命中偷取 5-7% 法力 (變動)",
      "吸收閃電 25%",
      "打擊時有 5% 機率施展等級 14-20 連鎖閃電 (變動)"
    ]
  },
  {
    id: "stormlash",
    name: "暴風之結",
    nameEn: "Stormlash",
    baseItem: "天罰之錘 (Scourge)",
    baseItemEn: "Scourge",
    slot: "weapon",
    requiredLevel: 82,
    tags: ["Crushing Blow 33%", "Static Field on Striking", "IAS 30%", "Windforce Sentry"],
    flavorText: "纏繞著狂暴雷霆風暴的重枷，每一下重擊都能將 Boss 的生命百分比直接撕碎。",
    attributes: [
      "打擊時有 15% 機率施展等級 10 靜態力場 (Static Field)",
      "+30% 攻擊速度 (IAS)",
      "+240-300% 增強傷害 (ED) (變動)",
      "增加 1-473 閃電傷害",
      "33% 機率造成壓碎打擊 (CB)",
      "吸收閃電 +3-9 (變動)",
      "打擊時有 20% 機率施展等級 18 龍捲風"
    ]
  },
  {
    id: "heavens_light",
    name: "天堂之光",
    nameEn: "Heaven's Light",
    baseItem: "強威權杖 (Mighty Scepter)",
    baseItemEn: "Mighty Scepter",
    slot: "weapon",
    requiredLevel: 61,
    tags: ["Paladin Skills +2-3", "Crushing Blow 33%", "Socketed 1-2", "Smiter Scepter"],
    flavorText: "神聖光芒凝結於權杖頂端，是聖騎士討伐紅門三大魔神的破魔重器。",
    attributes: [
      "+2-3 聖騎士技能等級 (變動)",
      "+20% 攻擊速度 (IAS)",
      "+250-300% 增強傷害 (ED) (變動)",
      "-33% 目標防禦",
      "33% 機率造成壓碎打擊 (CB)",
      "+15-20 擊殺後獲得生命 (變動)",
      "凹槽 (1-2) (變動)"
    ]
  },
  {
    id: "hone_sundan",
    name: "宏森丹",
    nameEn: "Hone Sundan",
    baseItem: "幽靈長矛 (Yari)",
    baseItemEn: "Yari",
    slot: "weapon",
    requiredLevel: 37,
    tags: ["Crushing Blow 45%", "Socketed 3", "Self Repair", "Budget Boss Killer"],
    flavorText: "擁有 3 個凹槽與恐怖的 45% 壓碎打擊，升級為鬼魂之矛後鑲嵌愛斯或夏符文，是平民傭兵殺 Boss 最快的神槍。",
    attributes: [
      "45% 機率造成壓碎打擊 (CB)",
      "+160-200% 增強傷害 (ED) (變動)",
      "增加 20-40 傷害",
      "自動修復耐久度 (每 10 秒修復 1 點)",
      "凹槽 (3)"
    ]
  },
  {
    id: "bonehew",
    name: "破骨",
    nameEn: "Bonehew",
    baseItem: "食人魔之斧 (Ogre Axe)",
    baseItemEn: "Ogre Axe",
    slot: "weapon",
    requiredLevel: 64,
    tags: ["IAS 30%", "Socketed 2", "Bone Spear on Striking", "Merc Heavy Axe"],
    flavorText: "沉重鋒利的雙刃巨斧，打擊時會狂暴召喚出穿透敵陣的白骨之矛。",
    attributes: [
      "打擊時有 50% 機率施展等級 16 白骨之矛",
      "+30% 攻擊速度 (IAS)",
      "+270-320% 增強傷害 (ED) (變動)",
      "防止怪物自療",
      "等級 30 屍體爆炸 (30 次聚氣)",
      "凹槽 (2)"
    ]
  },
  {
    id: "natures_peace",
    name: "自然的和平",
    nameEn: "Nature's Peace",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 69,
    tags: ["Rest in Peace", "Prevent Monster Heal", "Oak Sage Charges", "Nihlathak Key BIS"],
    flavorText: "「殺死怪物安息」的絕對安寧之戒。擊殺的任何魔物無法被復活、也無法被尼拉塞克屍爆！",
    attributes: [
      "殺死怪物後平息 (Slain Monsters Rest in Peace) (防屍爆神技)",
      "防止怪物自療",
      "傷害減少 7-11 (DR) (變動)",
      "抗毒 +20-30% (變動)",
      "等級 5 橡樹智者 (Oak Sage) (27 次聚氣)"
    ]
  },
  {
    id: "wisp_projector",
    name: "鬼火投射者",
    nameEn: "Wisp Projector",
    baseItem: "戒指 (Ring)",
    baseItemEn: "Ring",
    slot: "ring",
    requiredLevel: 76,
    tags: ["Lightning Absorb 10-20%", "Magic Find 10-20%", "Spirit Charges"],
    flavorText: "散發出跳躍電弧的精靈戒指，將迎面襲來的毀滅閃電化為滋潤血量的甘泉。",
    attributes: [
      "吸收閃電 10-20% (變動)",
      "+10-20% 更佳機會取得魔法裝備 (MF) (變動)",
      "打擊時有 10% 機率施展等級 16 閃電",
      "等級 7 橡樹智者 (11 次聚氣)",
      "等級 5 狼獾之心 (13 次聚氣)",
      "等級 2 狂靈之心 (15 次聚氣)"
    ]
  },
  {
    id: "the_rising_sun",
    name: "旭日東昇",
    nameEn: "The Rising Sun",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 65,
    tags: ["Fire Absorb Per Level", "Fire Skills +2", "Travincal Immortal Amulet"],
    flavorText: "依角色等級每級提供 0.75 點火焰吸收。90 級時吸火近 70 點，崔凡克瘸子的九頭海蛇火球直接變成加血溫泉！",
    attributes: [
      "+2 火焰技能",
      "+(0.75 每等級) 吸收火焰 (依角色等級增加，0.75-74.25)",
      "被擊中時有 2% 機率施展等級 13-19 隕石 (變動)",
      "增加 24-48 火焰傷害",
      "生命恢復 +10",
      "+4 照亮範圍"
    ]
  },
  {
    id: "metalgrid",
    name: "金屬網格",
    nameEn: "Metalgrid",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 81,
    tags: ["Attack Rating 400-450", "All Resist 25-35", "Iron Golem Charges"],
    flavorText: "交織著金屬電路的古老墜飾，不僅提供極高的防禦與抗性，還能讓任何職業隨時召喚鋼鐵石魔。",
    attributes: [
      "+400-450 攻擊準確率 (變動)",
      "+300-350 防禦 (變動)",
      "所有抗性 +25-35 (變動)",
      "等級 22 召喚鋼鐵石魔 (Iron Golem) (11 次聚氣)",
      "等級 12 鋼鐵傀儡 (20 次聚氣)"
    ]
  },
  {
    id: "lidless_wall",
    name: "警戒之牆",
    nameEn: "Lidless Wall",
    baseItem: "殘酷之盾 (Grim Shield)",
    baseItemEn: "Grim Shield",
    slot: "shield",
    requiredLevel: 41,
    tags: ["All Skills +1", "FCR 20%", "Mana After Kill +3-5", "Budget Caster Shield"],
    flavorText: "一面永遠不閉闔的骨雕巨盾，為年輕的施法者提供寶貴的施法速度與法力源泉。",
    attributes: [
      "+1 所有技能",
      "+20% 快速施法速度 (FCR)",
      "+80-130% 強化防禦 (變動)",
      "+3-5 擊殺後獲得法力 (EK) (變動)",
      "增加法力上限 10%",
      "+10 精力",
      "+1 照亮範圍"
    ]
  },
  {
    id: "head_hunters_glory",
    name: "獵頭者的榮耀",
    nameEn: "Head Hunter's Glory",
    baseItem: "巨魔巢穴骨盾 (Troll Nest)",
    baseItemEn: "Troll Nest",
    slot: "shield",
    requiredLevel: 75,
    tags: ["Socketed 1-3", "Fire Res 20-30%", "Poison Res 30-40%", "Custom Jewel Shield"],
    flavorText: "懸掛著各色惡魔顱骨的巨魔巢穴骨盾，其天然的 3 個孔洞是鑲嵌各系彩虹刻面的頂級基座。",
    attributes: [
      "+320-420 防禦 (變動)",
      "+300-350 對遠程攻擊防禦 (變動)",
      "抗火 +20-30% (變動)",
      "抗毒 +30-40% (變動)",
      "+5-7 擊殺後獲得生命 (變動)",
      "凹槽 (1-3) (變動)"
    ]
  },
  {
    id: "the_oculus",
    name: "眼球 (渦流水晶)",
    nameEn: "The Oculus",
    baseItem: "渦流水晶 (Swirling Crystal)",
    baseItemEn: "Swirling Crystal",
    slot: "weapon",
    requiredLevel: 42,
    tags: ["Sorceress Skills +3", "FCR 20%", "Magic Find 50%", "All Resist 20", "Teleport on Struck"],
    flavorText: "法師開荒與打寶不可或缺的標誌性魔杖！滿溢的魔力讓施法速度狂飆，但受到攻擊時隨機瞬移的特性也讓無數法師又愛又恨。",
    attributes: [
      "+3 魔法使技能等級",
      "+20% 快速施法速度 (FCR)",
      "+20 體力",
      "+20 精力",
      "所有抗性 +20",
      "+50% 更佳機會取得魔法裝備 (MF)",
      "+5 擊殺後獲得法力 (EK)",
      "被擊中時有 25% 機率施展等級 15 傳送 (Teleport)"
    ]
  },
  {
    id: "bartucs_cut_throat",
    name: "巴特克的咽喉 (巴爪)",
    nameEn: "Bartuc's Cut-Throat",
    baseItem: "巨鷹爪 (Greater Talon)",
    baseItemEn: "Greater Talon",
    slot: "weapon",
    requiredLevel: 42,
    tags: ["Assassin Skills +2", "Martial Arts +1", "FHR 30%", "Strength +20", "Dexterity +20"],
    flavorText: "染滿血腥的古老異端雙爪，提供刺客最均衡的屬性加成、高速打擊恢復與高額吸血。",
    attributes: [
      "+2 刺客技能等級",
      "+1 武學藝術技能 (刺客專用)",
      "+30% 快速打擊恢復 (FHR)",
      "+150-200% 增強傷害 (ED) (變動)",
      "每次命中偷取 5-9% 生命 (變動)",
      "+20 力量",
      "+20 敏捷"
    ]
  },
  {
    id: "death_cleaver",
    name: "死亡之刀",
    nameEn: "Death Cleaver",
    baseItem: "狂戰士斧 (Berserker Axe)",
    baseItemEn: "Berserker Axe",
    slot: "weapon",
    requiredLevel: 70,
    tags: ["Deadly Strike 66%", "IAS 40%", "Minus Target Defense 33%"],
    flavorText: "狂暴近戰野蠻人的純物理兇刃！高達 66% 致命一擊配合狂戰士狂砍，刀刀烈火見骨。",
    attributes: [
      "+40% 攻擊速度 (IAS)",
      "+230-280% 增強傷害 (ED) (變動)",
      "-33% 目標防禦",
      "66% 機率造成致命打擊 (DS) (極致致命爆發)",
      "+6-9 擊殺後獲得生命 (變動)"
    ]
  },
  {
    id: "suicide_branch",
    name: "自殺支系",
    nameEn: "Suicide Branch",
    baseItem: "焦黑之杖 (Burnt Wand)",
    baseItemEn: "Burnt Wand",
    slot: "weapon",
    requiredLevel: 33,
    tags: ["FCR 50%", "All Skills +1", "Life +40", "Extreme FCR Wand"],
    flavorText: "提供全暗黑單手武器中最高額的 50% 快速施法速度！是風德、電法衝擊 163% 甚至 200% FCR 檔位的神級突破杖。",
    attributes: [
      "+1 所有技能",
      "+50% 快速施法速度 (FCR) (全手持武器最高)",
      "增加法力上限 10%",
      "所有抗性 +10",
      "+40 生命",
      "受到攻擊者受到傷害 25"
    ]
  },
  {
    id: "buriza_do_kyanon",
    name: "布理撒·多·凱南 (大砲)",
    nameEn: "Buriza-Do Kyanon",
    baseItem: "弩弓 (Ballista)",
    baseItemEn: "Ballista",
    slot: "weapon",
    requiredLevel: 41,
    tags: ["IAS 80%", "Pierce 100%", "Freeze Target", "Bowazon Classic"],
    flavorText: "老玩家記憶中最經典的「大砲」！自帶 80% 攻速與 100% 絕對穿刺，射出一根巨弩直接洞穿整列惡魔大軍。",
    attributes: [
      "+80% 攻擊速度 (IAS)",
      "+150-200% 增強傷害 (ED) (變動)",
      "+(2.5 每等級) 最大傷害 (依角色等級增加)",
      "穿透攻擊 (100% 絕對穿刺)",
      "增加 32-196 冰寒傷害，持續 8 秒",
      "凍結目標 +3",
      "+35 敏捷"
    ]
  },
  {
    id: "witchwild_string",
    name: "狂野之弦",
    nameEn: "Witchwild String",
    baseItem: "短戰鬥弓 (Short Siege Bow)",
    baseItemEn: "Short Siege Bow",
    slot: "weapon",
    requiredLevel: 39,
    tags: ["Amplify Damage on Striking", "Socketed 2", "Deadly Strike Per Level", "All Resist 40"],
    flavorText: "自帶 2 個凹槽與 40 點全抗性！打擊時觸發高等級「傷害加深」詛咒使物理傷害翻倍，升級為鑽石弓後威力無窮。",
    attributes: [
      "打擊時有 2% 機率施展等級 5 傷害加深 (Amplify Damage 破除物理免疫)",
      "+150-170% 增強傷害 (ED) (變動)",
      "+(1 每等級) 致命打擊 (依角色等級增加，1-99%)",
      "所有抗性 +40",
      "魔法箭 (射出不耗箭矢的魔法箭矢)",
      "凹槽 (2)"
    ]
  },
  {
    id: "kelpie_snare",
    name: "水魔陷阱",
    nameEn: "Kelpie Snare",
    baseItem: "膨脹長柄斧 (Fuscina)",
    baseItemEn: "Fuscina",
    slot: "weapon",
    requiredLevel: 33,
    tags: ["Slows Target 75%", "Life +50", "Fire Res 50%", "Boss Neutralizer"],
    flavorText: "打 Boss 的最強神槍！只要刺中巴爾或迪亞布羅，高達 75% 的減速效果會讓 Boss 變成連技能都放不出的慢動作木樁！",
    attributes: [
      "使目標減速 75% (Boss 克星特效)",
      "+140-180% 增強傷害 (ED) (變動)",
      "+30-50 傷害",
      "+50 生命",
      "抗火 +50%",
      "+(1.25 每等級) 防禦 (依角色等級增加)"
    ]
  },
  {
    id: "blackhorns_face",
    name: "黑角面具",
    nameEn: "Blackhorn's Face",
    baseItem: "死亡面具 (Death Mask)",
    baseItemEn: "Death Mask",
    slot: "helm",
    requiredLevel: 41,
    tags: ["Slows Target 20%", "Prevent Monster Heal", "Lightning Absorb +20"],
    flavorText: "減速 20%、防止怪物自療外加吸收閃電，傭兵對抗古代人與紅門首領的絕佳控場頭具。",
    attributes: [
      "使目標減速 20%",
      "防止怪物自療",
      "吸收閃電 +20",
      "抗電 +20%",
      "打擊使目標致盲",
      "+180-220% 強化防禦 (變動)"
    ]
  },
  {
    id: "ravenlore",
    name: "烏鴉之王",
    nameEn: "Ravenlore",
    baseItem: "天球 (Sky Spirit)",
    baseItemEn: "Sky Spirit",
    slot: "helm",
    requiredLevel: 74,
    tags: ["Druid Elemental +3", "Minus Enemy Fire Res 10-20%", "Fire Druid BIS"],
    flavorText: "火德魯伊的終極畢業神器！提供 +3 元素技能與極其珍貴的 -(10-20)% 敵人火焰抗性，大幅提升末日餘波與毀天滅地的破壞力。",
    attributes: [
      "+3 德魯伊元素技能等級",
      "-(10-20)% 敵人火焰抗性 (變動) (火德破防神器)",
      "+120-150% 強化防禦 (變動)",
      "+20-30 精力 (變動)",
      "所有抗性 +15-25 (變動)",
      "+7 烏鴉 (Raven)"
    ]
  },
  {
    id: "darkforce_spawn",
    name: "暗影精靈 (血王之骨)",
    nameEn: "Darkforce Spawn",
    baseItem: "血王之骨 (Bloodlord Skull)",
    baseItemEn: "Bloodlord Skull",
    slot: "shield",
    requiredLevel: 65,
    tags: ["Necromancer Skills +1-3", "FCR 30%", "Caster Necro Shield"],
    flavorText: "提供高達 30% 快速施法速度的死靈法師專用骨盾，骨毒法師追求極限施法檔位的核心裝備。",
    attributes: [
      "+1-3 詛咒技能 (死靈專用) (變動)",
      "+1-3 毒素與白骨技能 (死靈專用) (變動)",
      "+1-3 召喚技能 (死靈專用) (變動)",
      "+30% 快速施法速度 (FCR)",
      "+140-180% 強化防禦 (變動)",
      "法力恢復 10%"
    ]
  },
  {
    id: "goldwrap",
    name: "金色包袱",
    nameEn: "Goldwrap",
    baseItem: "重扣帶 (Heavy Belt)",
    baseItemEn: "Heavy Belt",
    slot: "belt",
    requiredLevel: 27,
    tags: ["Magic Find 30%", "Gold Find 50-80%", "IAS 10%", "Farming Belt"],
    flavorText: "全遊戲最著名的打寶腰帶！提供 30% MF、高達 80% 的打錢加成與 10% 攻擊速度，升級為戰鬥腰帶後擁有 4 排藥水欄位。",
    attributes: [
      "+10% 攻擊速度 (IAS)",
      "+30% 更佳機會取得魔法裝備 (MF)",
      "50-80% 額外金幣尋獲 (GF) (變動)",
      "+40-60% 強化防禦 (變動)",
      "+25 防禦",
      "+2 照亮範圍"
    ]
  },
  {
    id: "silkweave",
    name: "紗織",
    nameEn: "Silkweave",
    baseItem: "網格之靴 (Mesh Boots)",
    baseItemEn: "Mesh Boots",
    slot: "boots",
    requiredLevel: 36,
    tags: ["Mana After Kill +5", "Increase Max Mana 10%", "Run Walk 30%", "Javazon Boots"],
    flavorText: "標槍亞馬遜與元素刺客的最愛！每擊殺一隻怪物立即回魔 +5 點，配合群怪收割讓法力球永遠處於滿溢狀態。",
    attributes: [
      "+30% 跑步/步行速度",
      "+5 擊殺後獲得法力 (EK) (群刷永動回魔神技)",
      "增加法力上限 10%",
      "+150-190% 強化防禦 (變動)",
      "+200 對遠程攻擊防禦"
    ]
  },
  {
    id: "goblin_toe",
    name: "哥布林腳趾",
    nameEn: "Goblin Toe",
    baseItem: "輕型金屬靴 (Light Plated Boots)",
    baseItemEn: "Light Plated Boots",
    slot: "boots",
    requiredLevel: 22,
    tags: ["Crushing Blow 25%", "Budget Boss Killer Boots"],
    flavorText: "雖然外型簡陋，但鞋尖附著高達 25% 的壓碎打擊！是盾擊騎士與近戰打紅門三魔神極高性價比的殺戮利器。",
    attributes: [
      "25% 機率造成壓碎打擊 (CB) (近戰打王核心特效)",
      "+50-60% 強化防禦 (變動)",
      "+15 防禦",
      "魔法傷害減少 1",
      "傷害減少 1",
      "-1 照亮範圍"
    ]
  },
  {
    id: "lava_gout",
    name: "熔岩角羊",
    nameEn: "Lava Gout",
    baseItem: "十字軍鐵手套 (Battle Gauntlets)",
    baseItemEn: "Battle Gauntlets",
    slot: "gloves",
    requiredLevel: 42,
    tags: ["IAS 20%", "Enchant on Striking", "Fire Res 24%"],
    flavorText: "打擊時觸發等級 10 強化 (Enchant)，為自身武器注入滾滾烈焰，大幅增加攻擊準確率 (AR) 與火焰附加傷害。",
    attributes: [
      "打擊時有 2% 機率施展等級 10 強化 (Enchant 巨幅提升 AR 與火焰傷害)",
      "+20% 攻擊速度 (IAS)",
      "+150-200% 強化防禦 (變動)",
      "增加 13-46 火焰傷害",
      "抗火 +24%",
      "半減冰凍時間"
    ]
  },
  {
    id: "saracens_chance",
    name: "薩拉森的機會",
    nameEn: "Saracen's Chance",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 47,
    tags: ["All Attributes +12", "All Resist 15-25", "Iron Maiden on Struck"],
    flavorText: "鐫刻著神秘古紋的護符，為冒險者帶來全屬性 +12 點與滿滿的抗性防護。",
    attributes: [
      "+12 所有屬性 (力量、敏捷、體力、精力全加)",
      "所有抗性 +15-25 (變動)",
      "被擊中時有 10% 機率施展等級 2 鐵處女 (Iron Maiden)"
    ]
  },
  {
    id: "the_eye_of_etlich",
    name: "艾利屈之眼",
    nameEn: "The Eye of Etlich",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 15,
    tags: ["All Skills +1", "Life Steal 3-7%", "Cold Duration", "Level 15 Starter"],
    flavorText: "15 級即可裝備的平民神鍊！提供 +1 全技能、生命偷取與隱藏的超長冰寒減速時間，通關開荒無比愜意。",
    attributes: [
      "+1 所有技能等級",
      "每次命中偷取 3-7% 生命 (變動)",
      "增加 1-2 至 3-5 冰寒傷害 (附帶 2-10 秒超長減速)",
      "+1-5 照亮範圍 (變動)",
      "+10-40 對遠程攻擊防禦 (變動)"
    ]
  },
  {
    id: "nokozan_relic",
    name: "諾科藍遺物",
    nameEn: "Nokozan Relic",
    baseItem: "項鍊 (Amulet)",
    baseItemEn: "Amulet",
    slot: "amulet",
    requiredLevel: 10,
    tags: ["Max Fire Res +10%", "Fire Res 50%", "FHR 20%", "Level 10 Starter"],
    flavorText: "10 級即可穿戴的火抗聖物！直接提供 +10% 最大抗火、50% 抗火與 20% FHR，對抗大菠蘿火風暴與崔凡克火球的神物。",
    attributes: [
      "+10% 最大火焰抗性",
      "抗火 +50%",
      "+20% 快速打擊恢復 (FHR)",
      "增加 3-6 火焰傷害",
      "+3 照亮範圍"
    ]
  },
  {
    id: "rainbow_facet_light",
    name: "彩虹刻面 (閃電珠寶)",
    nameEn: "Rainbow Facet (Lightning)",
    baseItem: "珠寶 (Jewel)",
    baseItemEn: "Jewel",
    slot: "jewel",
    requiredLevel: 49,
    tags: ["Minus Enemy Light Res 3-5%", "Light Skill Damage 3-5%", "Die/Level-up Proc"],
    flavorText: "法系電法、標馬與陷阱刺客鑲嵌的唯一真理！分為死亡施展與升級施展兩種形態，完美數值為 +5/-5。",
    attributes: [
      "+3-5% 閃電技能傷害 (變動)",
      "-(3-5)% 敵人閃電抗性 (變動) (極致破防輸出)",
      "死亡時有 100% 機率施展等級 41 連鎖閃電 (或升級施展等級 47 連鎖閃電)",
      "增加 1-74 閃電傷害"
    ]
  },
  {
    id: "rainbow_facet_fire",
    name: "彩虹刻面 (火焰珠寶)",
    nameEn: "Rainbow Facet (Fire)",
    baseItem: "珠寶 (Jewel)",
    baseItemEn: "Jewel",
    slot: "jewel",
    requiredLevel: 49,
    tags: ["Minus Enemy Fire Res 3-5%", "Fire Skill Damage 3-5%", "Die/Level-up Proc"],
    flavorText: "火法、火德與刺客火焰陷阱鑲嵌的畢業寶石！注入狂暴地心烈焰，大幅削弱目標火抗。",
    attributes: [
      "+3-5% 火焰技能傷害 (變動)",
      "-(3-5)% 敵人火焰抗性 (變動)",
      "死亡時有 100% 機率施展等級 31 隕石 (或升級施展等級 43 火焰之球)",
      "增加 17-45 火焰傷害"
    ]
  },
  {
    id: "rainbow_facet_cold",
    name: "彩虹刻面 (冰寒珠寶)",
    nameEn: "Rainbow Facet (Cold)",
    baseItem: "珠寶 (Jewel)",
    baseItemEn: "Jewel",
    slot: "jewel",
    requiredLevel: 49,
    tags: ["Minus Enemy Cold Res 3-5%", "Cold Skill Damage 3-5%", "Die/Level-up Proc"],
    flavorText: "冰法、亞馬遜冰箭手與冰風德的至寶，讓刺骨極寒突破惡魔的抗性防線。",
    attributes: [
      "+3-5% 冰寒技能傷害 (變動)",
      "-(3-5)% 敵人冰寒抗性 (變動)",
      "死亡時有 100% 機率施展等級 37 暴風雪 (或升級施展等級 43 冰封球)",
      "增加 24-38 冰寒傷害"
    ]
  },
  {
    id: "rainbow_facet_poison",
    name: "彩虹刻面 (毒素珠寶)",
    nameEn: "Rainbow Facet (Poison)",
    baseItem: "珠寶 (Jewel)",
    baseItemEn: "Jewel",
    slot: "jewel",
    requiredLevel: 49,
    tags: ["Minus Enemy Poison Res 3-5%", "Poison Skill Damage 3-5%", "Die/Level-up Proc"],
    flavorText: "劇毒死靈法師與狂犬病德魯伊鑲嵌首選，將致命瘟疫滲透至骨髓之中。",
    attributes: [
      "+3-5% 毒素技能傷害 (變動)",
      "-(3-5)% 敵人毒素抗性 (變動)",
      "死亡時有 100% 機率施展等級 51 劇毒新星 (或升級施展等級 23 劇毒新星)",
      "+100 毒素傷害，持續 4 秒"
    ]
  }
,
  // ── 經典與拓荒傳奇暗金裝備 (Classic & Leveling Prominent Uniques) ──
  // 頭盔 (Helms)
  {
    id: "tarnhelm",
    name: "塔恩頭盔",
    nameEn: "Tarnhelm",
    baseItem: "帽子 (Cap)",
    baseItemEn: "Cap",
    slot: "helm",
    requiredLevel: 15,
    tags: ["All Skills +1", "Magic Find 50%", "Classic MF BIS"],
    flavorText: "經典時期所有開荒角色夢寐以求的打寶神帽，提供 +1 技能與高達 50% MF。",
    attributes: [
      "+1 所有技能",
      "+25-50% 更佳機會取得魔法裝備 (MF) (變動)",
      "+75% 額外金幣尋獲 (GF)"
    ]
  },
  {
    id: "coifofglory",
    name: "榮耀頭巾",
    nameEn: "Coif of Glory",
    baseItem: "頭巾 (Helm)",
    baseItemEn: "Helm",
    slot: "helm",
    requiredLevel: 14,
    tags: ["Blind Target", "Lightning Resist", "Mana Leech"],
    flavorText: "戰士在早期壓制遠程弓箭手與法系小怪的利器，擊中可直接使目標目盲。",
    attributes: [
      "擊中使目標目盲",
      "抗閃電 +15%",
      "每次命中偷取 3% 法力",
      "攻擊者受到傷害 7",
      "+10 防禦"
    ]
  },
  {
    id: "duskdeep",
    name: "暮光深處",
    nameEn: "Duskdeep",
    baseItem: "全罩式頭盔 (Full Helm)",
    baseItemEn: "Full Helm",
    slot: "helm",
    requiredLevel: 17,
    tags: ["All Resist 15", "Damage Reduction 7", "Leveling Defense"],
    flavorText: "普通難度前中期的鐵壁護首，提供全抗性 +15 與珍貴的 7 點物理減傷。",
    attributes: [
      "+30-50% 強化防禦 (變動)",
      "+10-20 最大防禦",
      "所有抗性 +15",
      "傷害減少 7",
      "-2 照亮範圍"
    ]
  },
  {
    id: "howltusk",
    name: "狼嚎長牙",
    nameEn: "Howltusk",
    baseItem: "巨型頭盔 (Great Helm)",
    baseItemEn: "Great Helm",
    slot: "helm",
    requiredLevel: 25,
    tags: ["Monster Flee", "Knockback", "Damage Taken to Mana"],
    flavorText: "將恐懼散播至惡魔軍團的野蠻重盔，擊中擊退並使怪物驚駭逃竄。",
    attributes: [
      "擊退目標 (Knockback)",
      "擊中使怪物逃跑 25%",
      "受損生命 35% 轉為法力",
      "魔法傷害減少 2"
    ]
  },
  {
    id: "undeadcrown",
    name: "不死皇冠",
    nameEn: "Undead Crown",
    baseItem: "皇冠 (Crown)",
    baseItemEn: "Crown",
    slot: "helm",
    requiredLevel: 29,
    tags: ["Life Leech 5%", "Damage to Undead", "Necromancer"],
    flavorText: "灌注亡靈憎恨的漆黑王冠，賦予對不死怪物的毀滅性打擊與生命偷取。",
    attributes: [
      "+3 骷髏復生 (死靈法師專用)",
      "每次命中偷取 5% 生命",
      "+50% 對不死生物的傷害",
      "+100 對不死生物的準確率",
      "+40-60 防禦 (變動)",
      "抗毒 +50%"
    ]
  },
  {
    id: "wormskull",
    name: "蠕蟲頭骨",
    nameEn: "Wormskull",
    baseItem: "骨盔 (Bone Helm)",
    baseItemEn: "Bone Helm",
    slot: "helm",
    requiredLevel: 21,
    tags: ["Necromancer Skills +1", "Life Leech 5%", "Poison Damage"],
    flavorText: "雕刻著蠕蟲圖騰的死靈巫師頭骨面具，早期毒骨系與召喚系極佳過渡裝。",
    attributes: [
      "+1 死靈法師技能",
      "+80 毒素傷害，持續 8 秒",
      "每次命中偷取 5% 生命",
      "+10 生命",
      "抗毒 +25%"
    ]
  },

  // 護甲 (Armors)
  {
    id: "goldskin",
    name: "黃金之皮",
    nameEn: "Goldskin",
    baseItem: "全鎧甲 (Full Plate Mail)",
    baseItemEn: "Full Plate Mail",
    slot: "armor",
    requiredLevel: 28,
    tags: ["All Resist 35", "Gold Find 100%", "Classic All Resist"],
    flavorText: "通體純金鍛造的厚重鎧甲，提供高達 +35 全抗性與翻倍的金幣掉落。",
    attributes: [
      "+120-150% 強化防禦 (變動)",
      "所有抗性 +35",
      "+100% 額外金幣尋獲 (GF)",
      "攻擊者受到傷害 10",
      "+2 照亮範圍"
    ]
  },
  {
    id: "iceblink",
    name: "冰雪眨眼",
    nameEn: "Iceblink",
    baseItem: "夾式甲 (Splint Mail)",
    baseItemEn: "Splint Mail",
    slot: "armor",
    requiredLevel: 22,
    tags: ["Freezes Target", "Cold Resist", "Classic Crowd Control"],
    flavorText: "近戰控場傳奇！任何物理打擊均能將非免疫怪物直接完全凍結成冰雕。",
    attributes: [
      "凍結目標 (Freezes Target)",
      "+70-80% 強化防禦 (變動)",
      "抗寒 +30%",
      "魔法傷害減少 1",
      "+4 照亮範圍"
    ]
  },
  {
    id: "rattlecage",
    name: "震動籠牢",
    nameEn: "Rattlecage",
    baseItem: "哥德甲 (Gothic Plate)",
    baseItemEn: "Gothic Plate",
    slot: "armor",
    requiredLevel: 29,
    tags: ["Crushing Blow 25%", "Monster Flee", "Budget Boss Killer"],
    flavorText: "自帶 25% 壓碎打擊的拓荒打 Boss 神甲，打擊時伴隨金屬震顫聲令群魔奔逃。",
    attributes: [
      "25% 機率造成壓碎打擊 (CB)",
      "擊中使怪物逃跑 40%",
      "+200 防禦",
      "+45 攻擊準確率"
    ]
  },
  {
    id: "hawkmail",
    name: "鷹爪甲",
    nameEn: "Hawkmail",
    baseItem: "鱗甲 (Scale Mail)",
    baseItemEn: "Scale Mail",
    slot: "armor",
    requiredLevel: 15,
    tags: ["Cannot Be Frozen", "Run Walk 10%", "Max Cold Resist"],
    flavorText: "15 級即可裝備的無法被凍結神甲！早期對抗都瑞爾與冰凍怪物的最堅實後盾。",
    attributes: [
      "無法被凍結 (Cannot Be Frozen)",
      "+10% 跑步/步行速度",
      "+80-100% 強化防禦 (變動)",
      "抗寒 +15%",
      "+15% 最大抗寒上限"
    ]
  },
  {
    id: "rockfleece",
    name: "岩石羊毛",
    nameEn: "Rockfleece",
    baseItem: "戰場裝甲 (Field Plate)",
    baseItemEn: "Field Plate",
    slot: "armor",
    requiredLevel: 28,
    tags: ["Damage Reduction 10%", "Physical Wall", "Strength"],
    flavorText: "厚如山岩的減傷甲，提供 10% 物理減傷與高額防禦，極大減輕近戰承傷。",
    attributes: [
      "傷害減少 10% (DR)",
      "+100-130% 強化防禦 (變動)",
      "物理傷害減少 5",
      "+5 力量",
      "需求 -10%"
    ]
  },
  {
    id: "twitchthroe",
    name: "抽動的掙扎",
    nameEn: "Twitchthroe",
    baseItem: "鑲嵌甲 (Studded Leather)",
    baseItemEn: "Studded Leather",
    slot: "armor",
    requiredLevel: 16,
    tags: ["IAS 20%", "FHR 20%", "Block Chance 25%", "Classic God Armor"],
    flavorText: "暗黑二代最傳奇的低等級全能甲！攻速、打擊恢復、格擋機率與雙屬性完美集於一身。",
    attributes: [
      "+20% 攻擊速度 (IAS)",
      "+20% 快速打擊恢復 (FHR)",
      "+25% 增加格擋機率",
      "+25 防禦",
      "+10 力量",
      "+10 敏捷"
    ]
  },
  {
    id: "blinkbatsform",
    name: "閃爍蝙蝠的外貌",
    nameEn: "Blinkbat's Form",
    baseItem: "皮甲 (Leather Armor)",
    baseItemEn: "Leather Armor",
    slot: "armor",
    requiredLevel: 12,
    tags: ["Run Walk 40%", "FHR 40%", "Lightweight"],
    flavorText: "極致敏捷的輕甲，高達 40% 跑速與 40% FHR 讓佩戴者如蝙蝠般在陰影穿梭。",
    attributes: [
      "+40% 跑步/步行速度",
      "+40% 快速打擊恢復 (FHR)",
      "+25 防禦",
      "+50 對遠程攻擊防禦"
    ]
  },
  {
    id: "boneflesh",
    name: "白骨之肉",
    nameEn: "Boneflesh",
    baseItem: "板甲 (Plate Mail)",
    baseItemEn: "Plate Mail",
    slot: "armor",
    requiredLevel: 26,
    tags: ["Open Wounds 25%", "Life Leech 5%", "Physical Leveling"],
    flavorText: "白骨倒刺交錯的肉搏戰甲，附加 25% 撕開傷口阻止怪物自療。",
    attributes: [
      "25% 機率造成撕開傷口",
      "每次命中偷取 5% 生命",
      "+100-120% 強化防禦 (變動)",
      "+35 防禦"
    ]
  },
  {
    id: "darkglow",
    name: "暗黑之光",
    nameEn: "Darkglow",
    baseItem: "環甲 (Ring Mail)",
    baseItemEn: "Ring Mail",
    slot: "armor",
    requiredLevel: 14,
    tags: ["All Resist 10", "Max All Resist +5%", "Leveling All Resist"],
    flavorText: "散發微弱晦光的古老環甲，突破常規提升全元素抗性上限 5%。",
    attributes: [
      "所有抗性 +10",
      "+5% 最大抗火 / 抗寒 / 抗電 / 抗毒上限",
      "+70-100% 強化防禦 (變動)",
      "+50 攻擊準確率",
      "+3 照亮範圍"
    ]
  },
  {
    id: "greyform",
    name: "灰色形態",
    nameEn: "Greyform",
    baseItem: "布甲 (Quilted Armor)",
    baseItemEn: "Quilted Armor",
    slot: "armor",
    requiredLevel: 7,
    tags: ["Fire Resist 20%", "Cold Resist 20%", "Life Leech 5%", "Level 7 Starter BIS"],
    flavorText: "7 級即可穿戴的開荒神衣！提供火冰雙抗 +20% 與 5% 生命偷取，伴隨新手平穩度過第一章。",
    attributes: [
      "抗火 +20%",
      "抗寒 +20%",
      "每次命中偷取 5% 生命",
      "+20 防禦",
      "+10 敏捷",
      "魔法傷害減少 3"
    ]
  },
  {
    id: "heavenlygarb",
    name: "天堂法衣",
    nameEn: "Heavenly Garb",
    baseItem: "輕型裝甲 (Light Plate)",
    baseItemEn: "Light Plate",
    slot: "armor",
    requiredLevel: 29,
    tags: ["All Resist 10", "Mana Regen 25%", "Undead Defense"],
    flavorText: "大天使祝福過的聖潔長袍，顯著提升法力恢復並免疫不死生物毒害。",
    attributes: [
      "所有抗性 +10",
      "法力恢復 +25%",
      "+100% 強化防禦",
      "+(1.5 每等級) 對不死生物防禦",
      "+15 活力"
    ]
  },
  {
    id: "sparklingmail",
    name: "閃光之甲",
    nameEn: "Sparkling Mail",
    baseItem: "鎖子甲 (Chain Mail)",
    baseItemEn: "Chain Mail",
    slot: "armor",
    requiredLevel: 17,
    tags: ["Lightning Resist 30%", "Attacker Takes Lightning Damage"],
    flavorText: "雷光躍動的鎖子甲，提供 30% 抗電並向攻擊者反彈狂暴電弧。",
    attributes: [
      "+75-85% 強化防禦 (變動)",
      "增加 1-20 閃電傷害",
      "抗閃電 +30%",
      "攻擊者受到閃電傷害 10-14"
    ]
  },
  {
    id: "thecenturion",
    name: "百夫長",
    nameEn: "The Centurion",
    baseItem: "硬皮甲 (Hard Leather Armor)",
    baseItemEn: "Hard Leather Armor",
    slot: "armor",
    requiredLevel: 14,
    tags: ["Life 50", "Mana 50", "Stamina"],
    flavorText: "羅馬軍團百夫長的榮譽戰衣，大幅充實佩戴者的生命、法力與體力儲備。",
    attributes: [
      "+50 生命",
      "+50 法力",
      "+15 最大體力",
      "體力消耗減慢 40%",
      "物理傷害減少 2"
    ]
  },
  {
    id: "venomsward",
    name: "毒液防禦",
    nameEn: "Venomsward",
    baseItem: "胸甲 (Breast Plate)",
    baseItemEn: "Breast Plate",
    slot: "armor",
    requiredLevel: 20,
    tags: ["Poison Resist 90%", "Max Poison Resist +15%", "Anti-Poison BIS"],
    flavorText: "抗毒天花板！將佩戴者的抗毒上限推至 90%，安達利爾毒液宛如拂面微風。",
    attributes: [
      "抗毒 +90%",
      "+15% 最大抗毒上限 (達到 90% 抗毒！)",
      "毒素持續時間縮短 50%",
      "+60-100% 強化防禦 (變動)",
      "+2 照亮範圍"
    ]
  },
  {
    id: "victorssilk",
    name: "勝利之絲",
    nameEn: "Victors Silk",
    baseItem: "古代裝甲 (Ancient Armor)",
    baseItemEn: "Ancient Armor",
    slot: "armor",
    requiredLevel: 28,
    tags: ["All Skills +1", "Mana Leech 5%", "Classic Skills BIS"],
    flavorText: "經典時代法系與物理雙修戰甲，罕見地在古代裝甲上提供 +1 所有技能與偷法。",
    attributes: [
      "+1 所有技能",
      "每次命中偷取 5% 法力",
      "+100-120% 強化防禦 (變動)",
      "+35 防禦"
    ]
  },

  // 盾牌 (Shields)
  {
    id: "steelclash",
    name: "鋼鐵碰撞",
    nameEn: "Steelclash",
    baseItem: "輕盾 (Kite Shield)",
    baseItemEn: "Kite Shield",
    slot: "shield",
    requiredLevel: 17,
    tags: ["Paladin Skills +1", "All Resist 15", "Block Chance 25%"],
    flavorText: "聖騎士早期無可挑剔的攻防一體聖盾，兼顧技能、格擋與全抗性。",
    attributes: [
      "+1 聖騎士技能",
      "+25% 增加格擋機率",
      "+20% 快速格擋速度 (FBR)",
      "所有抗性 +15",
      "+60-100% 強化防禦 (變動)",
      "+3 照亮範圍"
    ]
  },
  {
    id: "theward",
    name: "守衛",
    nameEn: "The Ward",
    baseItem: "哥德盾 (Gothic Shield)",
    baseItemEn: "Gothic Shield",
    slot: "shield",
    requiredLevel: 26,
    tags: ["All Resist 30-50", "Block Chance", "Classic Tank Shield"],
    flavorText: "全抗高達 30-50 的重裝防禦大盾，經典模式拓荒防禦核心。",
    attributes: [
      "所有抗性 +30-50 (變動)",
      "+10% 增加格擋機率",
      "+100% 強化防禦",
      "+40 防禦",
      "魔法傷害減少 2"
    ]
  },
  {
    id: "walloftheeyeless",
    name: "無眼之牆",
    nameEn: "Wall of the Eyeless",
    baseItem: "骨盾 (Bone Shield)",
    baseItemEn: "Bone Shield",
    slot: "shield",
    requiredLevel: 20,
    tags: ["FCR 20%", "Mana After Each Kill +5", "Classic Caster BIS"],
    flavorText: "法系角色經典畢業副手盾牌，20% FCR 搭配擊殺回藍是早期流暢刷怪的保證。",
    attributes: [
      "+20% 快速施法速度 (FCR)",
      "+5 擊殺後獲得法力 (EK)",
      "+30-40% 強化防禦 (變動)",
      "+10 防禦",
      "毒素持續時間縮短 50%"
    ]
  },
  {
    id: "bverritkeep",
    name: "布維利特要塞",
    nameEn: "Bverrit Keep",
    baseItem: "塔盾 (Tower Shield)",
    baseItemEn: "Tower Shield",
    slot: "shield",
    requiredLevel: 19,
    tags: ["Fire Resist 75%", "Strength 5", "Heavy Defense"],
    flavorText: "火焰絕緣要塞！提供驚人的 75% 抗火，任何火系法術與吐息皆難傷分毫。",
    attributes: [
      "抗火 +75%",
      "+80-120% 強化防禦 (變動)",
      "+30 防禦",
      "+5 力量",
      "魔法傷害減少 5"
    ]
  },
  {
    id: "peltalunata",
    name: "佩爾塔盧納塔",
    nameEn: "Pelta Lunata",
    baseItem: "圓盾 (Buckler)",
    baseItemEn: "Buckler",
    slot: "shield",
    requiredLevel: 2,
    tags: ["Level 2 Starter Shield", "Block Rate 40%", "Vitality 10"],
    flavorText: "2 級即可裝備的新手守護小盾，擁有極高的 40% 格擋速度加成。",
    attributes: [
      "+40% 快速格擋速度 (FBR)",
      "+20% 增加格擋機率",
      "+10 活力",
      "+2 力量",
      "+30-40% 強化防禦 (變動)"
    ]
  },
  {
    id: "stormguild",
    name: "暴風公會",
    nameEn: "Stormguild",
    baseItem: "大盾 (Large Shield)",
    baseItemEn: "Large Shield",
    slot: "shield",
    requiredLevel: 13,
    tags: ["Lightning Resist 25%", "Block Rate", "Magic Damage Reduction"],
    flavorText: "抗擊風暴的輕便金屬盾，強化格擋並反彈閃電衝擊。",
    attributes: [
      "+30% 快速格擋速度 (FBR)",
      "+25% 增加格擋機率",
      "抗閃電 +25%",
      "魔法傷害減少 1",
      "攻擊者受到閃電傷害 1-6"
    ]
  },
  {
    id: "swordbackhold",
    name: "劍背堡壘",
    nameEn: "Swordback Hold",
    baseItem: "長盾 (Spiked Shield)",
    baseItemEn: "Spiked Shield",
    slot: "shield",
    requiredLevel: 15,
    tags: ["Open Wounds 50%", "Block Chance", "Damage Return"],
    flavorText: "盾面嵌滿尖銳刀刃的攻擊型盾牌，高達 50% 機率讓敵人傷口大開血流不止。",
    attributes: [
      "50% 機率造成撕開傷口",
      "+20% 增加格擋機率",
      "+30-60% 強化防禦 (變動)",
      "+10 防禦",
      "攻擊者受到傷害 10"
    ]
  },
  {
    id: "umbraldisk",
    name: "陰影之盤",
    nameEn: "Umbral Disk",
    baseItem: "小圓盾 (Small Shield)",
    baseItemEn: "Small Shield",
    slot: "shield",
    requiredLevel: 12,
    tags: ["Blind Target", "Life 20", "Fast Block"],
    flavorText: "漆黑吸光的刺客小盾，格擋敏捷且能令貼身近戰之敵目盲失去目標。",
    attributes: [
      "擊中使目標目盲",
      "+30% 快速格擋速度 (FBR)",
      "+10-15 敏捷 (變動)",
      "+20 生命",
      "+40-50% 強化防禦 (變動)"
    ]
  },

  // 腰帶 (Belts)
  {
    id: "bladebuckle",
    name: "刀鋒扣帶",
    nameEn: "Bladebuckle",
    baseItem: "鐵線腰帶 (Plated Belt)",
    baseItemEn: "Plated Belt",
    slot: "belt",
    requiredLevel: 29,
    tags: ["FHR 30%", "Strength 5", "Dexterity 10"],
    flavorText: "暗藏防身利刃的金屬腰帶，提供 30% 快速打擊恢復與力量敏捷雙加成。",
    attributes: [
      "+30% 快速打擊恢復 (FHR)",
      "+5 力量",
      "+10 敏捷",
      "物理傷害減少 3",
      "攻擊者受到傷害 8"
    ]
  },
  {
    id: "nightsmoke",
    name: "夜煙",
    nameEn: "Nightsmoke",
    baseItem: "腰帶 (Belt)",
    baseItemEn: "Belt",
    slot: "belt",
    requiredLevel: 20,
    tags: ["All Resist 10", "Damage to Mana 50%", "Caster Leveling"],
    flavorText: "受損生命 50% 轉化為法力，法系角色被圍毆時續航不竭的救命腰帶。",
    attributes: [
      "所有抗性 +10",
      "受損生命 50% 轉為法力",
      "+20 法力",
      "物理傷害減少 2",
      "+30-50% 強化防禦 (變動)"
    ]
  },
  {
    id: "snakecord",
    name: "蛇繩",
    nameEn: "Snakecord",
    baseItem: "輕扣帶 (Light Belt)",
    baseItemEn: "Light Belt",
    slot: "belt",
    requiredLevel: 12,
    tags: ["Poison Resist 25%", "Poison Length Reduced", "Life Replenish"],
    flavorText: "由劇毒水蛇皮鞣製的柔軟輕帶，顯著化解初期惡毒的持續腐蝕。",
    attributes: [
      "抗毒 +25%",
      "毒素持續時間縮短 50%",
      "增加 12 毒素傷害，持續 3 秒",
      "生命恢復 +5",
      "+20-30% 強化防禦 (變動)"
    ]
  },

  // 手套與靴子 (Gloves & Boots)
  {
    id: "bloodfist",
    name: "血拳",
    nameEn: "Bloodfist",
    baseItem: "重手套 (Heavy Gloves)",
    baseItemEn: "Heavy Gloves",
    slot: "gloves",
    requiredLevel: 9,
    tags: ["FHR 30%", "IAS 10%", "Life 40", "Level 9 PVP/PVE God"],
    flavorText: "全遊戲性價比最高的手套之一！僅需 9 級即可提供 30% FHR、10% IAS 與 40 點高額生命。",
    attributes: [
      "+30% 快速打擊恢復 (FHR)",
      "+10% 攻擊速度 (IAS)",
      "+40 生命",
      "+5 最小傷害",
      "+10-20% 強化防禦 (變動)"
    ]
  },
  {
    id: "thehandofbroc",
    name: "布洛克之手",
    nameEn: "The Hand of Broc",
    baseItem: "皮手套 (Leather Gloves)",
    baseItemEn: "Leather Gloves",
    slot: "gloves",
    requiredLevel: 5,
    tags: ["Dual Leech 3%", "Mana 20", "Level 5 Starter"],
    flavorText: "5 級雙吸手套！每次命中偷取 3% 生命與法力，物理拓荒前期無價之寶。",
    attributes: [
      "每次命中偷取 3% 生命",
      "每次命中偷取 3% 法力",
      "+20 法力",
      "抗毒 +10%",
      "+10-20% 強化防禦 (變動)"
    ]
  },
  {
    id: "gorefoot",
    name: "血腳",
    nameEn: "Gorefoot",
    baseItem: "重靴 (Heavy Boots)",
    baseItemEn: "Heavy Boots",
    slot: "boots",
    requiredLevel: 9,
    tags: ["Run Walk 20%", "Mana Leech 2%", "Leap Skills"],
    flavorText: "浸染鮮血的堅韌戰靴，賦予跑速與偷法，並額外提升野蠻人的跳躍能力。",
    attributes: [
      "+20% 跑步/步行速度",
      "每次命中偷取 2% 法力",
      "+2 跳躍 (野蠻人專用)",
      "+20-30% 強化防禦 (變動)",
      "攻擊者受到傷害 2"
    ]
  },
  {
    id: "tearhaunch",
    name: "淚之臀",
    nameEn: "Tearhaunch",
    baseItem: "護脛 (Greaves)",
    baseItemEn: "Greaves",
    slot: "boots",
    requiredLevel: 29,
    tags: ["All Resist 10", "Run Walk 20%", "Strength 10", "Dexterity 10"],
    flavorText: "力敏雙加各 10 點，並附帶 10 全抗性與 20% 跑速的扎實防護金屬脛甲。",
    attributes: [
      "+20% 跑步/步行速度",
      "所有抗性 +10",
      "+10 力量",
      "+10 敏捷",
      "+2 活力靈氣 (聖騎士專用)",
      "+60-80% 強化防禦 (變動)"
    ]
  },
  {
    id: "treadsofcthon",
    name: "庫頓之趾",
    nameEn: "Treads of Cthon",
    baseItem: "鎖子靴 (Chain Boots)",
    baseItemEn: "Chain Boots",
    slot: "boots",
    requiredLevel: 15,
    tags: ["Run Walk 30%", "Stamina Drain", "Missile Defense"],
    flavorText: "奔馳如風的輕量鎖子靴，提供 30% 跑速並大幅減少長途疾跑的體力損耗。",
    attributes: [
      "+30% 跑步/步行速度",
      "+50 對遠程攻擊防禦",
      "體力消耗減慢 50%",
      "+50 體力上限",
      "+30-40% 強化防禦 (變動)"
    ]
  },

  // 武器 (Weapons)
  {
    id: "spectralshard",
    name: "幽靈碎片",
    nameEn: "Spectral Shard",
    baseItem: "刀刃 (Blade)",
    baseItemEn: "Blade",
    slot: "weapon",
    requiredLevel: 25,
    tags: ["FCR 50%", "All Resist 10", "Mana 50", "Classic Caster Weapon BIS"],
    flavorText: "經典時代法系終極畢業匕首！驚人的 50% FCR 施法速度搭配 50 法力與全抗。",
    attributes: [
      "+50% 快速施法速度 (FCR)",
      "所有抗性 +10",
      "+50 法力",
      "+55 攻擊準確率"
    ]
  },
  {
    id: "bonesnap",
    name: "碎骨",
    nameEn: "Bonesnap",
    baseItem: "大木槌 (Maul)",
    baseItemEn: "Maul",
    slot: "weapon",
    requiredLevel: 24,
    tags: ["Crushing Blow 40%", "Enhanced Damage 300%", "Classic Melee Boss Killer"],
    flavorText: "物理近戰經典終極核彈大槌！高達 40% 壓碎打擊與最高 300% ED，敲碎一切 Boss 骨骸。",
    attributes: [
      "40% 機率造成壓碎打擊 (CB)",
      "+200-300% 增強傷害 (ED) (變動)",
      "抗火 +30%",
      "抗寒 +30%"
    ]
  },
  {
    id: "steeldriver",
    name: "鋼鐵驅馳",
    nameEn: "Steeldriver",
    baseItem: "巨鐵槌 (Great Maul)",
    baseItemEn: "Great Maul",
    slot: "weapon",
    requiredLevel: 29,
    tags: ["IAS 40%", "Enhanced Damage 250%", "Req -50%", "Leveling God Hammer"],
    flavorText: "需求直降 50% 的高速巨槌，自帶 40% 攻速，升級至菁英底材後威力無比驚人。",
    attributes: [
      "+40% 攻擊速度 (IAS)",
      "+150-250% 增強傷害 (ED) (變動)",
      "體力消耗減慢 25%",
      "生命恢復 +5",
      "裝備需求 -50%"
    ]
  },
  {
    id: "culwenspoint",
    name: "庫爾文的焦點",
    nameEn: "Culwen's Point",
    baseItem: "巨劍 (War Sword)",
    baseItemEn: "War Sword",
    slot: "weapon",
    requiredLevel: 29,
    tags: ["All Skills +1", "FHR 20%", "IAS 20%", "Classic Sword"],
    flavorText: "鍛造均勻的純鋼戰劍，罕見附帶 +1 全技能、20% 攻速與 20% 打擊恢復。",
    attributes: [
      "+1 所有技能",
      "+20% 攻擊速度 (IAS)",
      "+20% 快速打擊恢復 (FHR)",
      "+70-80% 增強傷害 (變動)",
      "+60 攻擊準確率",
      "毒素持續時間縮短 50%"
    ]
  },
  {
    id: "hellplague",
    name: "地獄瘟疫",
    nameEn: "Hellplague",
    baseItem: "長劍 (Long Sword)",
    baseItemEn: "Long Sword",
    slot: "weapon",
    requiredLevel: 22,
    tags: ["Dual Leech 5%", "Fire/Poison Damage", "Leveling Sword"],
    flavorText: "燃燒毒火的地獄闊刃，每次打擊雙吸 5% 並注入大量火毒雙重痛苦。",
    attributes: [
      "每次命中偷取 5% 生命",
      "每次命中偷取 5% 法力",
      "增加 25-75 火焰傷害",
      "+28-56 毒素傷害，持續 6 秒"
    ]
  },
  {
    id: "thegnasher",
    name: "磨齒者",
    nameEn: "The Gnasher",
    baseItem: "手斧 (Hand Axe)",
    baseItemEn: "Hand Axe",
    slot: "weapon",
    requiredLevel: 5,
    tags: ["Crushing Blow 20%", "Open Wounds 50%", "Level 5 Starter Axe"],
    flavorText: "5 級即可持有的壓碎打擊小斧，自帶 50% 撕開傷口，讓初期頭目迅速崩解。",
    attributes: [
      "20% 機率造成壓碎打擊 (CB)",
      "50% 機率造成撕開傷口",
      "+60-70% 增強傷害 (變動)"
    ]
  },
  {
    id: "torchofiro",
    name: "艾羅之火炬",
    nameEn: "Torch of Iro",
    baseItem: "魔杖 (Wand)",
    baseItemEn: "Wand",
    slot: "weapon",
    requiredLevel: 5,
    tags: ["Necromancer Skills +1", "Fire Damage", "Life Replenish"],
    flavorText: "死靈法師 5 級可用之引魂神杖，頂端燃燒幽冥烈火，提供 +1 死靈技能。",
    attributes: [
      "+1 死靈法師技能",
      "增加 5-9 火焰傷害",
      "每次命中偷取 6% 生命",
      "生命恢復 +10",
      "+3 照亮範圍"
    ]
  },
  {
    id: "woestave",
    name: "悲慘之杖",
    nameEn: "Woestave",
    baseItem: "斧槍 (Halberd)",
    baseItemEn: "Halberd",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["Slows Target 50%", "Prevent Monster Heal", "Open Wounds 50%", "Boss Debuff King"],
    flavorText: "全遊戲最強減益傭兵武器之一！50% 減速、致盲、凍結、撕開傷口並防止怪物自療。",
    attributes: [
      "擊中使目標減速 50%",
      "擊中使目標目盲",
      "凍結目標 +1",
      "50% 機率造成撕開傷口",
      "防止怪物自療",
      "-50 怪物防禦"
    ]
  },
  {
    id: "umeslament",
    name: "尤姆的悲嘆",
    nameEn: "Ume's Lament",
    baseItem: "殘酷之杖 (Grim Wand)",
    baseItemEn: "Grim Wand",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["Necromancer Skills +2", "FCR 20%", "Decrepify"],
    flavorText: "經典死靈 +2 技能魔杖，賦予 20% 施法速度與衰老詛咒強化。",
    attributes: [
      "+2 死靈法師技能",
      "+20% 快速施法速度 (FCR)",
      "+2 衰老 (死靈法師專用)",
      "+3 恐懼 (死靈法師專用)",
      "+40 法力"
    ]
  },
  {
    id: "wizendraw",
    name: "凋零",
    nameEn: "Wizendraw",
    baseItem: "長弓 (Long Bow)",
    baseItemEn: "Long Bow",
    slot: "weapon",
    requiredLevel: 26,
    tags: ["Minus Enemy Cold Resist 35%", "Fires Magic Arrows", "Cold Bow"],
    flavorText: "元素弓馬拓荒利器！自帶最高 -35% 敵人冰寒抗性，大幅提升冰箭殺傷力。",
    attributes: [
      "發射魔法箭矢 (無需消耗箭袋)",
      "-(20-35)% 敵人冰寒抗性 (變動)",
      "+70-80% 增強傷害 (變動)",
      "+50-100 攻擊準確率",
      "+15 能量",
      "+30 法力"
    ]
  },
  {
    id: "ravensclaw",
    name: "烏鴉之爪",
    nameEn: "Raven's Claw",
    baseItem: "長弓 (Long Bow)",
    baseItemEn: "Long Bow",
    slot: "weapon",
    requiredLevel: 15,
    tags: ["Fires Explosive Arrows", "Leveling AOE Bow"],
    flavorText: "射出等級 3 爆破箭的速刷拓荒神弓，群怪成片炸裂倒下。",
    attributes: [
      "發射爆裂箭矢 (等級 3 Explosive Arrows)",
      "+60-70% 增強傷害 (變動)",
      "+(3 每等級) 攻擊準確率",
      "+3 力量",
      "+3 敏捷"
    ]
  },
  {
    id: "blastbark",
    name: "爆裂吠叫",
    nameEn: "Blastbark",
    baseItem: "巨戰之弓 (War Bow)",
    baseItemEn: "War Bow",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["Bow Skills +1", "Mana Leech 5%", "Leveling Bow"],
    flavorText: "射擊沉重有力的硬木戰弓，每次命中偷取 5% 法力以維持多重箭射擊。",
    attributes: [
      "+1 弓與十字弓技能 (亞馬遜專用)",
      "+70-130% 增強傷害 (變動)",
      "每次命中偷取 5% 法力",
      "+5 力量"
    ]
  },
  {
    id: "leadcrow",
    name: "鉛烏鴉",
    nameEn: "Leadcrow",
    baseItem: "輕十字弓 (Light Crossbow)",
    baseItemEn: "Light Crossbow",
    slot: "weapon",
    requiredLevel: 9,
    tags: ["Deadly Strike 25%", "Level 9 Crossbow"],
    flavorText: "鉛製箭槽的重實輕弩，賦予 25% 致命打擊造成翻倍物理傷害。",
    attributes: [
      "25% 機率造成致命打擊 (DS)",
      "+40 攻擊準確率",
      "+70% 增強傷害",
      "+10 敏捷",
      "毒素持續時間縮短 25%"
    ]
  },
  {
    id: "ichorsting",
    name: "膿汁之刺",
    nameEn: "Ichorsting",
    baseItem: "十字弓 (Crossbow)",
    baseItemEn: "Crossbow",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["Pierce 50%", "Poison Damage", "Crossbow"],
    flavorText: "浸泡劇毒膿汁的連發弩，穿透攻擊達 50% 貫穿整列魔潮。",
    attributes: [
      "貫穿攻擊 (Piercing Attack 50%)",
      "+50 毒素傷害，持續 5 秒",
      "+50% 增強傷害",
      "+20 敏捷",
      "+20 體力上限"
    ]
  },
  {
    id: "chieftain",
    name: "酋長",
    nameEn: "The Chieftain",
    baseItem: "戰斧 (Battle Axe)",
    baseItemEn: "Battle Axe",
    slot: "weapon",
    requiredLevel: 19,
    tags: ["All Resist 10-20", "Mana After Each Kill", "Two-Handed Axe"],
    flavorText: "部落頭目代代傳承的重斧，擊殺怪物獲得法力並提供難得的全抗性。",
    attributes: [
      "所有抗性 +10-20 (變動)",
      "+10% 攻擊速度 (IAS)",
      "+100% 增強傷害",
      "+6 擊殺後獲得法力 (EK)",
      "增加 1-40 火焰傷害"
    ]
  },
  {
    id: "brainhew",
    name: "斷腦者",
    nameEn: "Brainhew",
    baseItem: "大斧 (Great Axe)",
    baseItemEn: "Great Axe",
    slot: "weapon",
    requiredLevel: 25,
    tags: ["Mana Leech 10-13%", "Mana 25", "Two-Handed Axe"],
    flavorText: "兇悍的劈砍巨斧，巨額偷取 10-13% 法力，確保旋風狂斬不斷檔。",
    attributes: [
      "每次命中偷取 10-13% 法力 (變動)",
      "+50-80% 增強傷害 (變動)",
      "+25 法力",
      "+14 照亮範圍"
    ]
  },
  {
    id: "thehumongous",
    name: "龐大之斧",
    nameEn: "The Humongous",
    baseItem: "巨型斬斧 (Giant Axe)",
    baseItemEn: "Giant Axe",
    slot: "weapon",
    requiredLevel: 29,
    tags: ["Crushing Blow 33%", "Strength 25", "Huge Damage"],
    flavorText: "粗獷沉重的超規格巨斧，附加 33% 壓碎打擊與 25 點額外力量。",
    attributes: [
      "33% 機率造成壓碎打擊 (CB)",
      "+80-120% 增強傷害 (變動)",
      "+25 力量",
      "裝備需求 +20%"
    ]
  },
  {
    id: "crushflange",
    name: "碎骨凸緣",
    nameEn: "Crushflange",
    baseItem: "狼牙棒 (Mace)",
    baseItemEn: "Mace",
    slot: "weapon",
    requiredLevel: 9,
    tags: ["Crushing Blow 33%", "Fire Resist 50%", "Level 9 Boss Smiter"],
    flavorText: "9 級持有的終極重擊鈍器！33% 壓碎打擊配合 50% 抗火，重擊聖騎士拓荒必備。",
    attributes: [
      "33% 機率造成壓碎打擊 (CB)",
      "抗火 +50%",
      "+50-60% 增強傷害 (變動)",
      "+15 力量",
      "+2 照亮範圍"
    ]
  },
  {
    id: "thegeneralstandoliga",
    name: "坦杜里加將軍",
    nameEn: "The General's Tan Do Li Ga",
    baseItem: "長連枷 (Flail)",
    baseItemEn: "Flail",
    slot: "weapon",
    requiredLevel: 21,
    tags: ["Slows Target 50%", "IAS 20%", "Life Leech 5%"],
    flavorText: "揮擊速度極快且自帶 50% 減速的長連枷，讓強悍敵人動彈不得。",
    attributes: [
      "擊中使目標減速 50%",
      "+20% 攻擊速度 (IAS)",
      "每次命中偷取 5% 生命",
      "+50-60% 增強傷害 (變動)",
      "+25 最大防禦"
    ]
  },
  {
    id: "ironstone",
    name: "鐵石",
    nameEn: "Ironstone",
    baseItem: "戰錘 (War Hammer)",
    baseItemEn: "War Hammer",
    slot: "weapon",
    requiredLevel: 27,
    tags: ["Crushing Blow", "Attack Rating", "High Damage"],
    flavorText: "整塊玄鐵一體成型的沉重戰錘，附帶強大準確率加成擊碎防線。",
    attributes: [
      "+100-150 攻擊準確率",
      "+100-140% 增強傷害 (變動)",
      "+10 力量",
      "增加 1-10 閃電傷害"
    ]
  },
  {
    id: "dimoakshew",
    name: "迪莫克的砍刀",
    nameEn: "Dimoak's Hew",
    baseItem: "鉤鐮 (Bardiche)",
    baseItemEn: "Bardiche",
    slot: "weapon",
    requiredLevel: 8,
    tags: ["Enhanced Damage 100%", "Level 8 Mercenary Polearm"],
    flavorText: "第一章與第二章傭兵的早期殺神大刀，8 級即達 100% 增強傷害。",
    attributes: [
      "+100% 增強傷害",
      "+15 敏捷",
      "防禦力 -8"
    ]
  },
  {
    id: "steelgoad",
    name: "鋼鐵刺棒",
    nameEn: "Steelgoad",
    baseItem: "長矛 (Voulge)",
    baseItemEn: "Voulge",
    slot: "weapon",
    requiredLevel: 19,
    tags: ["Deadly Strike 30%", "Monster Flee", "Polearm"],
    flavorText: "尖端如棘刺般銳利的鐵矛，高達 30% 致命打擊撕裂敵人軀體。",
    attributes: [
      "30% 機率造成致命打擊 (DS)",
      "擊中使怪物逃跑 75%",
      "+60-80% 增強傷害 (變動)",
      "+30 攻擊準確率"
    ]
  },
  {
    id: "soulharvest",
    name: "靈魂收割者",
    nameEn: "Soul Harvest",
    baseItem: "長鎌 (Scythe)",
    baseItemEn: "Scythe",
    slot: "weapon",
    requiredLevel: 19,
    tags: ["Dual Leech 5%", "Open Wounds 30%", "All Resist 20"],
    flavorText: "收割生靈魂魄的漆黑鐮刀，提供全抗性 +20 與雙吸生命法力。",
    attributes: [
      "所有抗性 +20",
      "每次命中偷取 5% 生命",
      "每次命中偷取 5% 法力",
      "30% 機率造成撕開傷口",
      "+50-90% 增強傷害 (變動)"
    ]
  },
  {
    id: "battlebranch",
    name: "戰役之枝",
    nameEn: "The Battlebranch",
    baseItem: "長柄斧 (Poleaxe)",
    baseItemEn: "Poleaxe",
    slot: "weapon",
    requiredLevel: 25,
    tags: ["IAS 30%", "Life Leech 7%", "Polearm"],
    flavorText: "兼具 30% 揮舞速度與 7% 生命偷取的均衡長柄斧，傭兵過渡良伴。",
    attributes: [
      "+30% 攻擊速度 (IAS)",
      "每次命中偷取 7% 生命",
      "+50-70% 增強傷害 (變動)",
      "+50-100 攻擊準確率"
    ]
  },
  {
    id: "thegrimreaper",
    name: "嚴酷收割者",
    nameEn: "The Grim Reaper",
    baseItem: "巨戰鐮刀 (War Scythe)",
    baseItemEn: "War Scythe",
    slot: "weapon",
    requiredLevel: 29,
    tags: ["Deadly Strike 100%", "Prevent Monster Heal", "Classic Polearm"],
    flavorText: "死神本尊的揮斬之鐮！每一擊皆是 100% 致命打擊，造成必然的翻倍傷害。",
    attributes: [
      "100% 機率造成致命打擊 (DS - 刀刀暴擊！)",
      "防止怪物自療",
      "+15 致命攻擊",
      "每次命中偷取 5% 法力"
    ]
  },
  {
    id: "baneash",
    name: "災難之灰",
    nameEn: "Bane Ash",
    baseItem: "短杖 (Short Staff)",
    baseItemEn: "Short Staff",
    slot: "weapon",
    requiredLevel: 5,
    tags: ["Sorceress Skills +1", "Fire Skills", "Mana 30", "Level 5 Staff"],
    flavorText: "魔法使 5 級開荒法杖，自帶火焰彈、熱情靈氣加成與法力儲備。",
    attributes: [
      "+1 魔法使技能",
      "+2 暖氣 (魔法使專用)",
      "+4 火焰彈 (魔法使專用)",
      "增加 4-40 火焰傷害",
      "+30 法力"
    ]
  },
  {
    id: "serpentlord",
    name: "蛇王",
    nameEn: "Serpent Lord",
    baseItem: "長杖 (Long Staff)",
    baseItemEn: "Long Staff",
    slot: "weapon",
    requiredLevel: 9,
    tags: ["Mana Leech 100%", "Target Defense -50%", "Staff"],
    flavorText: "蛇眼閃爍的巫毒法杖，擁有高達 100% 的偷取法力，敲擊即回滿魔泉。",
    attributes: [
      "每次命中偷取 100% 法力",
      "-50% 目標防禦",
      "+30-40% 增強傷害 (變動)",
      "抗毒 +50%"
    ]
  },
  {
    id: "spireoflazarus",
    name: "拉薩路之尖頂",
    nameEn: "Spire of Lazarus",
    baseItem: "粗糙法杖 (Gnarled Staff)",
    baseItemEn: "Gnarled Staff",
    slot: "weapon",
    requiredLevel: 18,
    tags: ["Sorceress Skills +1", "Lightning Skills", "Damage Taken to Mana"],
    flavorText: "大主教拉薩路失落的奧術尖杖，大幅強化閃電法術威力與靜態力場。",
    attributes: [
      "+1 魔法使技能",
      "+2 靜態力場 (魔法使專用)",
      "+1 閃電 (魔法使專用)",
      "+2 連鎖閃電 (魔法使專用)",
      "受損生命 40% 轉為法力"
    ]
  },
  {
    id: "thesalamander",
    name: "沙羅曼達",
    nameEn: "The Salamander",
    baseItem: "戰斧杖 (Battle Staff)",
    baseItemEn: "Battle Staff",
    slot: "weapon",
    requiredLevel: 21,
    tags: ["Fire Skills +2", "Fireball +3", "Fire Resist 30%"],
    flavorText: "火蜥蜴精魂附體的赤紅烈杖，讓火球與火牆威力昇華至全新境界。",
    attributes: [
      "+2 火焰技能 (魔法使專用)",
      "+3 火球 (魔法使專用)",
      "+2 火牆 (魔法使專用)",
      "+1 暖氣 (魔法使專用)",
      "抗火 +30%"
    ]
  },
  {
    id: "theironiangbong",
    name: "鐵棒",
    nameEn: "The Iron Jang Bong",
    baseItem: "巨戰法杖 (War Staff)",
    baseItemEn: "War Staff",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["Sorceress Skills +2", "FCR 20%", "Frost Nova +3"],
    flavorText: "玄鐵包裹的沉重法杖，提供 20% 施法速度與全方位的冰火電法術加成。",
    attributes: [
      "+2 魔法使技能",
      "+20% 快速施法速度 (FCR)",
      "+3 霜之新星 (魔法使專用)",
      "+2 閃電新星 (魔法使專用)",
      "+50 防禦"
    ]
  },
  {
    id: "pluckeye",
    name: "拔眼",
    nameEn: "Pluckeye",
    baseItem: "短弓 (Short Bow)",
    baseItemEn: "Short Bow",
    slot: "weapon",
    requiredLevel: 7,
    tags: ["Mana Leech 3%", "Life 10", "Level 7 Bow"],
    flavorText: "7 級弓箭手極品過渡短弓，提供生命偷取與視野優勢。",
    attributes: [
      "每次命中偷取 3% 法力",
      "+10 生命",
      "+100 增強傷害",
      "+2 照亮範圍",
      "+28 攻擊準確率"
    ]
  },
  {
    id: "witherstring",
    name: "枯萎之弦",
    nameEn: "Witherstring",
    baseItem: "獵弓 (Hunter's Bow)",
    baseItemEn: "Hunter's Bow",
    slot: "weapon",
    requiredLevel: 13,
    tags: ["Fires Magic Arrows", "Enhanced Damage", "Leveling Bow"],
    flavorText: "枯枝纏繞的輕巧獵弓，自帶魔法箭矢，免除隨身攜帶箭袋的負擔。",
    attributes: [
      "發射魔法箭矢 (等級 3 Magic Arrows)",
      "+40-50% 增強傷害 (變動)",
      "+30 攻擊準確率",
      "增加 1-3 物理傷害"
    ]
  },
  {
    id: "roguesbow",
    name: "蘿格之弓",
    nameEn: "Rogue's Bow",
    baseItem: "複合弓 (Composite Bow)",
    baseItemEn: "Composite Bow",
    slot: "weapon",
    requiredLevel: 20,
    tags: ["IAS 30%", "Deadly Strike 100%", "Fast Bow"],
    flavorText: "蘿格盲眼姐妹會神箭手佩弓，自帶 30% 攻速與驚人的 100% 致命打擊！",
    attributes: [
      "+30% 攻擊速度 (IAS)",
      "100% 機率造成致命打擊 (DS - 暴擊神弓！)",
      "+40-60% 增強傷害 (變動)",
      "+60 攻擊準確率"
    ]
  },
  {
    id: "stormstrike",
    name: "暴風打擊",
    nameEn: "Stormstrike",
    baseItem: "短戰鬥弓 (Short Battle Bow)",
    baseItemEn: "Short Battle Bow",
    slot: "weapon",
    requiredLevel: 25,
    tags: ["Piercing Attack 25%", "Lightning Damage", "Bow"],
    flavorText: "召喚狂暴雷暴的戰鬥弓，附加穿透打擊與閃電穿心效果。",
    attributes: [
      "貫穿攻擊 (Piercing Attack 25%)",
      "增加 1-30 閃電傷害",
      "+70-90% 增強傷害 (變動)",
      "+28 攻擊準確率",
      "抗閃電 +25%"
    ]
  },
  {
    id: "hellclap",
    name: "地獄拍擊",
    nameEn: "Hellclap",
    baseItem: "短巨戰之弓 (Short War Bow)",
    baseItemEn: "Short War Bow",
    slot: "weapon",
    requiredLevel: 27,
    tags: ["Fire Skills +1", "Fire Damage", "Fire Resist 40%"],
    flavorText: "拍擊產生爆轟烈焰的巨弓，大幅加成火焰箭與爆炸箭的威力。",
    attributes: [
      "+1 火焰技能",
      "+70-90% 增強傷害 (變動)",
      "增加 15-30 火焰傷害",
      "抗火 +40%",
      "+12 敏捷"
    ]
  },
  {
    id: "hellcast",
    name: "地獄投擲",
    nameEn: "Hellcast",
    baseItem: "重十字弓 (Heavy Crossbow)",
    baseItemEn: "Heavy Crossbow",
    slot: "weapon",
    requiredLevel: 27,
    tags: ["Explosive Bolts", "Fire Damage", "Crossbow"],
    flavorText: "射出爆炸重箭的烈焰弩砲，對密集怪群造成恐怖的範圍清場效果。",
    attributes: [
      "發射爆裂弩箭 (等級 5 Explosive Bolts)",
      "+70-80% 增強傷害 (變動)",
      "增加 15-35 火焰傷害",
      "抗火 +15%",
      "+20% 攻擊速度 (IAS)"
    ]
  },
  {
    id: "doomslinger",
    name: "末日彈弓",
    nameEn: "Doomslinger",
    baseItem: "連發十字弓 (Repeating Crossbow)",
    baseItemEn: "Repeating Crossbow",
    slot: "weapon",
    requiredLevel: 28,
    tags: ["All Skills +1", "Piercing Attack 35%", "Fast Crossbow"],
    flavorText: "高速連射的末日輕弩，提供難得的 +1 全技能與 35% 穿透打擊。",
    attributes: [
      "+1 所有技能",
      "貫穿攻擊 (Piercing Attack 35%)",
      "+60-100% 增強傷害 (變動)",
      "+30% 攻擊速度 (IAS)"
    ]
  },
  {
    id: "maelstrom",
    name: "漩渦",
    nameEn: "Maelstrom",
    baseItem: "紫杉魔杖 (Yew Wand)",
    baseItemEn: "Yew Wand",
    slot: "weapon",
    requiredLevel: 14,
    tags: ["Necromancer Skills +1", "Lightning Resist 40%", "Iron Maiden"],
    flavorText: "雷光渦流環繞的巫毒魔杖，提供 40% 閃電抗性與鐵魔咒法術強化。",
    attributes: [
      "+1 死靈法師技能",
      "+3 鋼鐵石魔 (死靈法師專用)",
      "+2 鐵處女 (死靈法師專用)",
      "抗閃電 +40%",
      "受損生命 30% 轉為法力"
    ]
  },
  {
    id: "gravenspine",
    name: "雕骨",
    nameEn: "Gravenspine",
    baseItem: "骨杖 (Bone Wand)",
    baseItemEn: "Bone Wand",
    slot: "weapon",
    requiredLevel: 20,
    tags: ["Necromancer Skills +2", "Mana 25-50", "Classic Wand"],
    flavorText: "刻滿符文的脊骨法杖，罕見地在 20 級即提供 +2 死靈法師全技能。",
    attributes: [
      "+2 死靈法師技能",
      "每次命中偷取 5% 法力",
      "+25-50 法力 (變動)",
      "+10 敏捷",
      "+10 力量"
    ]
  },
  {
    id: "thediggler",
    name: "掘墓者",
    nameEn: "The Diggler",
    baseItem: "短匕首 (Dirk)",
    baseItemEn: "Dirk",
    slot: "weapon",
    requiredLevel: 11,
    tags: ["IAS 30%", "All Resist 10", "Fast Dagger"],
    flavorText: "盜墓賊開棺專用的鋒利掘錐，攻速高達 30% 並附帶全抗性。",
    attributes: [
      "+30% 攻擊速度 (IAS)",
      "所有抗性 +10",
      "+10 敏捷",
      "+50% 增強傷害"
    ]
  },
  {
    id: "thejadetando",
    name: "翠玉短劍",
    nameEn: "The Jade Tan Do",
    baseItem: "匕首 (Kris)",
    baseItemEn: "Kris",
    slot: "weapon",
    requiredLevel: 19,
    tags: ["Poison Resist 95%", "Cannot Be Frozen", "Poison Knife"],
    flavorText: "浸滿翠綠玉毒的刺客匕首，提供抗毒 95% 與無法被凍結。",
    attributes: [
      "抗毒 +95%",
      "+20% 最大抗毒上限 (達到 95% 極限抗毒！)",
      "無法被凍結 (Cannot Be Frozen)",
      "+180 毒素傷害，持續 4 秒",
      "+100-150 攻擊準確率"
    ]
  },
  {
    id: "rixotskeen",
    name: "銳克特的尖銳",
    nameEn: "Rixot's Keen",
    baseItem: "短劍 (Short Sword)",
    baseItemEn: "Short Sword",
    slot: "weapon",
    requiredLevel: 2,
    tags: ["Crushing Blow 25%", "Level 2 Starter Sword BIS"],
    flavorText: "全遊戲最低等級壓碎打擊武器！2 級即可手持 25% CB 利刃痛擊惡魔。",
    attributes: [
      "25% 機率造成壓碎打擊 (CB)",
      "+100% 增強傷害",
      "+20% 增加格擋機率",
      "+25 防禦",
      "+2 照亮範圍"
    ]
  },
  {
    id: "bloodcrescent",
    name: "血月",
    nameEn: "Blood Crescent",
    baseItem: "彎刀 (Scimitar)",
    baseItemEn: "Scimitar",
    slot: "weapon",
    requiredLevel: 7,
    tags: ["Life Leech 15%", "IAS 15%", "All Resist 15", "Level 7 Sword"],
    flavorText: "鮮血凝結的月牙彎刀，驚人的 15% 命偷、15% 攻速與 15 全抗性。",
    attributes: [
      "每次命中偷取 15% 生命 (海量吸血！)",
      "+15% 攻擊速度 (IAS)",
      "所有抗性 +15",
      "+60-80% 增強傷害 (變動)",
      "+15 生命"
    ]
  },
  {
    id: "skewerofkrintiz",
    name: "克林茲之串",
    nameEn: "Skewer of Krintiz",
    baseItem: "闊劍 (Broad Sword)",
    baseItemEn: "Broad Sword",
    slot: "weapon",
    requiredLevel: 10,
    tags: ["Mana Leech 7%", "Ignore Target Defense", "Level 10 Sword"],
    flavorText: "忽略目標防禦的突刺長劍，刀刀必中且巨額偷取 7% 法力。",
    attributes: [
      "忽略目標防禦 (Ignore Target's Defense)",
      "每次命中偷取 7% 法力",
      "+50% 增強傷害",
      "+10 敏捷"
    ]
  },
  {
    id: "gleamscythe",
    name: "亮光之鐮",
    nameEn: "Gleamscythe",
    baseItem: "彎刀 (Falchion)",
    baseItemEn: "Falchion",
    slot: "weapon",
    requiredLevel: 13,
    tags: ["IAS 20%", "Cold Damage", "Defense 30"],
    flavorText: "鋒面流轉寒冰亮光的利刃，附加 20% 揮擊速度與冰凍傷害。",
    attributes: [
      "+20% 攻擊速度 (IAS)",
      "增加 1-10 冰寒傷害，持續 3 秒",
      "+60-70% 增強傷害 (變動)",
      "+30 防禦",
      "+3 照亮範圍"
    ]
  },
  {
    id: "griswoldsedge",
    name: "格里斯瓦德之刃",
    nameEn: "Griswold's Edge",
    baseItem: "闊劍 (Broad Sword)",
    baseItemEn: "Broad Sword",
    slot: "weapon",
    requiredLevel: 17,
    tags: ["Knockback", "Fire Damage", "IAS 10%", "崔斯特姆鐵匠紀念"],
    flavorText: "崔斯特姆傳奇鐵匠生前親手熔鑄的名刃，打擊伴隨烈焰並擊退邪祟。",
    attributes: [
      "擊退目標 (Knockback)",
      "增加 10-12 火焰傷害",
      "+10-12 最小與最大傷害",
      "+10% 攻擊速度 (IAS)",
      "+80-120% 增強傷害 (變動)"
    ]
  },
  {
    id: "shadowfang",
    name: "暗影之牙",
    nameEn: "Shadowfang",
    baseItem: "雙手劍 (Two-Handed Sword)",
    baseItemEn: "Two-Handed Sword",
    slot: "weapon",
    requiredLevel: 12,
    tags: ["Dual Leech 9%", "Cold Damage", "Level 12 Two-Handed"],
    flavorText: "漆黑深淵中鍛造的雙手重劍，揮砍時雙吸 9% 生命與法力。",
    attributes: [
      "每次命中偷取 9% 生命",
      "每次命中偷取 9% 法力",
      "增加 10-30 冰寒傷害",
      "+100% 增強傷害",
      "-2 照亮範圍"
    ]
  },
  {
    id: "soulflay",
    name: "靈魂剝離",
    nameEn: "Soulflay",
    baseItem: "大劍 (Claymore)",
    baseItemEn: "Claymore",
    slot: "weapon",
    requiredLevel: 19,
    tags: ["Dual Leech 10%", "All Resist 5", "Two-Handed Sword"],
    flavorText: "專注於剝奪敵人靈魂的大劍，雙吸達 10% 並附帶全抗性。",
    attributes: [
      "每次命中偷取 10% 生命",
      "每次命中偷取 4% 法力",
      "所有抗性 +5",
      "+70-100% 增強傷害 (變動)"
    ]
  },
  {
    id: "kinemilsawl",
    name: "基尼米爾之錐",
    nameEn: "Kinemil's Awl",
    baseItem: "巨劍 (Giant Sword)",
    baseItemEn: "Giant Sword",
    slot: "weapon",
    requiredLevel: 23,
    tags: ["Paladin Holy Fire +6", "Attack Rating +100-150%", "Huge AR"],
    flavorText: "聖火聖騎士早期神劍！狂暴提供 +6 神聖之火與 +100-150% 驚天準確率加成。",
    attributes: [
      "+6 神聖之火 (聖騎士專用)",
      "+(100-150)% 攻擊準確率加成 (變動)",
      "增加 6-150 火焰傷害",
      "+80-100% 增強傷害 (變動)"
    ]
  },
  {
    id: "blacktongue",
    name: "黑舌",
    nameEn: "Blacktongue",
    baseItem: "混種大劍 (Bastard Sword)",
    baseItemEn: "Bastard Sword",
    slot: "weapon",
    requiredLevel: 26,
    tags: ["Prevent Monster Heal", "Poison Damage 113", "Sword"],
    flavorText: "塗抹黑巫術劇毒的長劍，附加 113 點巨毒並永久阻止怪物自癒。",
    attributes: [
      "防止怪物自療",
      "+113 毒素傷害，持續 6 秒",
      "+50-60% 增強傷害 (變動)",
      "抗毒 +50%"
    ]
  },
  {
    id: "ripsaw",
    name: "撕裂鋸",
    nameEn: "Ripsaw",
    baseItem: "雙刃大劍 (Flamberge)",
    baseItemEn: "Flamberge",
    slot: "weapon",
    requiredLevel: 26,
    tags: ["Open Wounds 80%", "IAS 20%", "Bleed Sword"],
    flavorText: "布滿倒刺鋸齒的兇殘闊劍，高達 80% 撕開傷口讓魔怪血崩不止。",
    attributes: [
      "80% 機率造成撕開傷口",
      "+20% 攻擊速度 (IAS)",
      "+80-100% 增強傷害 (變動)",
      "+15 最大傷害"
    ]
  },
  {
    id: "thepatriarch",
    name: "族長",
    nameEn: "The Patriarch",
    baseItem: "巨型巨劍 (Great Sword)",
    baseItemEn: "Great Sword",
    slot: "weapon",
    requiredLevel: 29,
    tags: ["Blind Target", "Damage Reduction 3", "Two-Handed Sword"],
    flavorText: "古代部落首領的沉重雙手劍，揮擊時令敵人盲目並帶來物理傷害減免。",
    attributes: [
      "擊中使目標目盲",
      "物理傷害減少 3",
      "+100-120% 增強傷害 (變動)",
      "+50 防禦",
      "+100% 額外金幣尋獲 (GF)"
    ]
  },
  {
    id: "deathspade",
    name: "死亡鐵鏟",
    nameEn: "Deathspade",
    baseItem: "斧 (Axe)",
    baseItemEn: "Axe",
    slot: "weapon",
    requiredLevel: 9,
    tags: ["Mana After Each Kill +4", "Enhanced Damage", "Starter Axe"],
    flavorText: "葬儀人揮舞的鋒利鐵鏟，擊殺怪物後立即掠奪 4 點法力。",
    attributes: [
      "+4 擊殺後獲得法力 (EK)",
      "+60-70% 增強傷害 (變動)",
      "+8 最小傷害",
      "+15% 額外金幣尋獲"
    ]
  },
  {
    id: "bladebone",
    name: "刀鋒之骨",
    nameEn: "Bladebone",
    baseItem: "雙刃斧 (Double Axe)",
    baseItemEn: "Double Axe",
    slot: "weapon",
    requiredLevel: 15,
    tags: ["IAS 20%", "Damage to Undead 100%", "Undead Slayer"],
    flavorText: "由白骨拼接而成的雙手雙刃斧，專門劈砍不死生物並附加 20% 攻速。",
    attributes: [
      "+20% 攻擊速度 (IAS)",
      "+100% 對不死生物的傷害",
      "+40 對不死生物的準確率",
      "+30-50% 增強傷害 (變動)"
    ]
  },
  {
    id: "mindrend",
    name: "心靈撕裂",
    nameEn: "Mindrend",
    baseItem: "巨戰斧 (War Axe)",
    baseItemEn: "War Axe",
    slot: "weapon",
    requiredLevel: 21,
    tags: ["Mana Leech 4%", "Cold Damage", "Axe"],
    flavorText: "震撼心靈的狂暴戰斧，撕裂獵物的法力並凍結其意志。",
    attributes: [
      "每次命中偷取 4% 法力",
      "增加 5-15 冰寒傷害，持續 3 秒",
      "+60-100% 增強傷害 (變動)",
      "+15 致命打擊"
    ]
  },
  {
    id: "rakescar",
    name: "耙痕",
    nameEn: "Rakescar",
    baseItem: "軍用鎬 (Military Pick)",
    baseItemEn: "Military Pick",
    slot: "weapon",
    requiredLevel: 27,
    tags: ["IAS 30%", "Poison Damage", "Fast Pick"],
    flavorText: "30% 揮舞極速的破甲軍用鎬，在敵人身上留下潰爛的毒傷耙痕。",
    attributes: [
      "+30% 攻擊速度 (IAS)",
      "+38 毒素傷害，持續 3 秒",
      "+75-100% 增強傷害 (變動)",
      "+50 攻擊準確率"
    ]
  },
  {
    id: "axeoffechmar",
    name: "費克馬之斧",
    nameEn: "Axe of Fechmar",
    baseItem: "大型斧 (Large Axe)",
    baseItemEn: "Large Axe",
    slot: "weapon",
    requiredLevel: 8,
    tags: ["Freezes Target +3", "Cold Resist 50%", "Level 8 Freezer"],
    flavorText: "8 級即可裝備的冰凍神斧，打擊直接凍結目標長達 3 秒。",
    attributes: [
      "凍結目標 +3 (直接冰凍！)",
      "抗寒 +50%",
      "+70-90% 增強傷害 (變動)",
      "+2 照亮範圍"
    ]
  },
  {
    id: "goreshovel",
    name: "凝血鏟",
    nameEn: "Goreshovel",
    baseItem: "闊斧 (Broad Axe)",
    baseItemEn: "Broad Axe",
    slot: "weapon",
    requiredLevel: 14,
    tags: ["Open Wounds 60%", "Strength 25", "Heavy Bleed"],
    flavorText: "巨大鏟面重劈撕裂出 60% 撕開傷口，並大幅提升 25 點力量。",
    attributes: [
      "60% 機率造成撕開傷口",
      "+25 力量",
      "+40-50% 增強傷害 (變動)",
      "+9 最小傷害"
    ]
  },
  {
    id: "felloak",
    name: "伐木橡木",
    nameEn: "Felloak",
    baseItem: "木棒 (Club)",
    baseItemEn: "Club",
    slot: "weapon",
    requiredLevel: 3,
    tags: ["Knockback", "Lightning Resist 60%", "Level 3 Starter"],
    flavorText: "3 級可用擊退木棒，提供驚人的 60% 閃電抗性抵禦第一章電鬼。",
    attributes: [
      "擊退目標 (Knockback)",
      "抗閃電 +60%",
      "抗火 +20%",
      "+70-80% 增強傷害 (變動)"
    ]
  },
  {
    id: "stoutnail",
    name: "粗釘",
    nameEn: "Stoutnail",
    baseItem: "狼牙棒 (Spiked Club)",
    baseItemEn: "Spiked Club",
    slot: "weapon",
    requiredLevel: 5,
    tags: ["Damage Reduction 2", "Attacker Takes Damage", "Level 5 Starter"],
    flavorText: "密布粗大鐵釘的重型狼牙棒，兼顧傷害減免與物理反震。",
    attributes: [
      "物理傷害減少 2",
      "攻擊者受到傷害 10",
      "+100% 增強傷害",
      "+7 活力"
    ]
  },
  {
    id: "bloodrise",
    name: "血升",
    nameEn: "Bloodrise",
    baseItem: "流星錘 (Morning Star)",
    baseItemEn: "Morning Star",
    slot: "weapon",
    requiredLevel: 15,
    tags: ["Life Leech 5%", "Open Wounds 50%", "Level 15 Mace"],
    flavorText: "每一次錘擊都帶起漫天血霧，附帶 50% 撕開傷口與生命偷取。",
    attributes: [
      "50% 機率造成撕開傷口",
      "每次命中偷取 5% 生命",
      "+110-120% 增強傷害 (變動)",
      "+2 照亮範圍"
    ]
  },
  {
    id: "lycanders_aim",
    name: "萊坎德的瞄準",
    nameEn: "Lycander's Aim",
    baseItem: "祭典之弓 (Ceremonial Bow)",
    baseItemEn: "Ceremonial Bow",
    slot: "weapon",
    requiredLevel: 42,
    tags: ["Amazon Skills +2", "Bow Skills +2", "Mana Leech 5-8%", "Mid-Game Bow BIS"],
    flavorText: "亞馬遜中期最強物理與元素兩用神弓！高達 +4 弓系技能加成與 20% 攻速。",
    attributes: [
      "+2 亞馬遜技能",
      "+2 弓與十字弓技能 (亞馬遜專用)",
      "+20% 攻擊速度 (IAS)",
      "+150-200% 增強傷害 (ED) (變動)",
      "每次命中偷取 5-8% 法力 (變動)",
      "+20 敏捷",
      "+20 能量",
      "+20% 強化防禦"
    ]
  },
  {
    id: "lycanders_flank",
    name: "萊坎德的側翼",
    nameEn: "Lycander's Flank",
    baseItem: "祭典長矛 (Ceremonial Pike)",
    baseItemEn: "Ceremonial Pike",
    slot: "weapon",
    requiredLevel: 42,
    tags: ["Amazon Skills +2", "Spear Skills +2", "Life Leech 5-9%", "Mid-Game Spear BIS"],
    flavorText: "矛系亞馬遜中期的中流砥柱！高達 +4 長矛技能加成與厚實的生命防禦加持。",
    attributes: [
      "+2 亞馬遜技能",
      "+2 標槍與長矛技能 (亞馬遜專用)",
      "+30% 攻擊速度 (IAS)",
      "+130-170% 增強傷害 (ED) (變動)",
      "每次命中偷取 5-9% 生命 (變動)",
      "+20 力量",
      "+20 活力",
      "+20% 強化防禦"
    ]
  },
  {
    id: "baranars_star",
    name: "巴拉那之星",
    nameEn: "Baranar's Star",
    baseItem: "惡魔之星 (Devil Star)",
    baseItemEn: "Devil Star",
    slot: "weapon",
    requiredLevel: 65,
    tags: ["Elemental Damage 600", "IAS 50%", "Attack Rating 200%", "Physical/Elemental BIS"],
    flavorText: "冰火電三修物理鈍器巔峰！高達 50% 攻速、200% 準確率加成與 600 點混元傷害。",
    attributes: [
      "+50% 攻擊速度 (IAS)",
      "+200% 增強傷害 (ED)",
      "+200% 攻擊準確率加成",
      "增加 1-200 火焰傷害",
      "增加 1-200 閃電傷害",
      "增加 1-200 冰寒傷害",
      "+15 敏捷",
      "+15 力量"
    ]
  },
  {
    id: "schaefers_hammer",
    name: "謝夫之錘",
    nameEn: "Schaefer's Hammer",
    baseItem: "傳說之錘 (Legendary Mallet)",
    baseItemEn: "Legendary Mallet",
    slot: "weapon",
    requiredLevel: 79,
    tags: ["Static Field 20%", "Max Damage per Level", "Lightning Resist 75%", "Zealot BIS"],
    flavorText: "熱誠狂熱聖騎士的終極重器之一！擊中時 20% 觸發靜態力場，巨幅血條瞬間瓦解。",
    attributes: [
      "打擊時有 20% 機率施展等級 10 靜態力場",
      "+(2 每等級) 最大傷害 (依角色等級增加，2-198)",
      "+100-130% 增強傷害 (ED) (變動)",
      "+(8 每等級) 攻擊準確率",
      "增加 50-200 閃電傷害",
      "+50 生命",
      "抗閃電 +75%",
      "+1 照亮範圍"
    ]
  },
  {
    id: "doombringer",
    name: "毀滅之刃",
    nameEn: "Doombringer",
    baseItem: "冠軍之劍 (Champion Sword)",
    baseItemEn: "Champion Sword",
    slot: "weapon",
    requiredLevel: 69,
    tags: ["Life 20%", "Weaken 8%", "Life Leech 5-7%", "Endgame Sword"],
    flavorText: "傳奇雙手巨劍，提供驚人的 +20% 生命上限提升，打擊時使周圍敵人陷入虛弱。",
    attributes: [
      "打擊時有 8% 機率施展等級 3 虛弱",
      "+180-250% 增強傷害 (ED) (變動)",
      "增加生命上限 20%",
      "每次命中偷取 5-7% 生命 (變動)",
      "+30-250 攻擊準確率加成",
      "物理傷害減少 39",
      "+30-100 額外命中率"
    ]
  }
];
