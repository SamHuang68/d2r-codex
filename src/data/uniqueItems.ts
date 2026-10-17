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
  }
];


