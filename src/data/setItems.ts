import { SetItemCollection } from '../types';

export const SET_ITEMS_DATA: SetItemCollection[] = [
  {
    id: "tal_rasha",
    name: "塔拉夏的法衣",
    nameEn: "Tal Rasha's Wrappings",
    pieces: [
      {
        id: "tal_helm",
        name: "塔拉夏的赫拉迪姆紋章",
        nameEn: "Tal Rasha's Horadric Crest",
        baseItem: "死亡面具 (Death Mask)",
        slot: "helm",
        requiredLevel: 66,
        attributes: [
          "每次命中偷取 10% 生命",
          "每次命中偷取 10% 法力",
          "所有抗性 +15",
          "+45 防禦",
          "+60 生命",
          "+30 法力"
        ]
      },
      {
        id: "tal_armor",
        name: "塔拉夏的守護",
        nameEn: "Tal Rasha's Guardianship",
        baseItem: "漆甲 (Lacquered Plate)",
        slot: "armor",
        requiredLevel: 71,
        attributes: [
          "+400 防禦",
          "抗寒 +40%",
          "抗火 +40%",
          "抗電 +40%",
          "魔法傷害減少 15",
          "+88% 更佳機會取得魔法裝備 (MF)"
        ]
      },
      {
        id: "tal_weapon",
        name: "塔拉夏的警惕之眼",
        nameEn: "Tal Rasha's Lidless Eye",
        baseItem: "渦流水晶 (Swirling Crystal)",
        slot: "weapon",
        requiredLevel: 65,
        attributes: [
          "+20% 快速施法速度 (FCR)",
          "+1-2 閃電專精 (法師專用) (變動)",
          "+1-2 火焰專精 (法師專用) (變動)",
          "+1-2 冰凍專精 (法師專用) (變動)",
          "+10 活力",
          "+57 生命",
          "+77 法力"
        ]
      },
      {
        id: "tal_belt",
        name: "塔拉夏的細緻衣服",
        nameEn: "Tal Rasha's Fine-Spun Cloth",
        baseItem: "織網腰帶 (Mesh Belt)",
        slot: "belt",
        requiredLevel: 53,
        attributes: [
          "裝備需求 -20%",
          "37% 受損生命轉移為法力",
          "+30 法力",
          "+20 敏捷",
          "+10-15% 更佳機會取得魔法裝備 (MF) (變動)"
        ]
      },
      {
        id: "tal_amulet",
        name: "塔拉夏的審判",
        nameEn: "Tal Rasha's Adjudication",
        baseItem: "項鍊 (Amulet)",
        slot: "amulet",
        requiredLevel: 67,
        attributes: [
          "+2 魔法使技能",
          "抗電 +33%",
          "增加 3-32 閃電傷害",
          "+50 生命",
          "+42 法力"
        ]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+3 重新恢復生命" },
      { count: 3, bonus: "+65% 更佳機會取得魔法裝備 (MF)" },
      { count: 4, bonus: "+25% 快速打擊恢復 (FHR)" }
    ],
    fullBonuses: [
      "+3 魔法使技能",
      "+50% 快速施法速度 (FCR)",
      "+150 生命",
      "所有抗性 +50",
      "+50 防禦對遠程攻擊",
      "角色散發純金色光環"
    ]
  },
  {
    id: "trang_oul",
    name: "塔格奧的化身",
    nameEn: "Trang-Oul's Avatar",
    pieces: [
      {
        id: "trang_helm",
        name: "塔格奧之容",
        nameEn: "Trang-Oul's Guise",
        baseItem: "骨面罩 (Bone Visage)",
        slot: "helm",
        requiredLevel: 65,
        attributes: ["+25% 快速打擊恢復 (FHR)", "+80-100 防禦", "+5 法力恢復", "+100 生命"]
      },
      {
        id: "trang_armor",
        name: "塔格奧之鱗",
        nameEn: "Trang-Oul's Scales",
        baseItem: "混沌戰甲 (Chaos Armor)",
        slot: "armor",
        requiredLevel: 49,
        attributes: ["+2 召喚技能 (死靈專用)", "+40% 跑速", "裝備需求 -40%", "抗毒 +40%"]
      },
      {
        id: "trang_gloves",
        name: "塔格奧之爪",
        nameEn: "Trang-Oul's Claws",
        baseItem: "重型手鐲 (Heavy Bracers)",
        slot: "gloves",
        requiredLevel: 45,
        attributes: ["+20% 快速施法速度 (FCR)", "+25% 毒素技能傷害", "抗寒 +30%"]
      },
      {
        id: "trang_belt",
        name: "塔格奧之束帶",
        nameEn: "Trang-Oul's Girth",
        baseItem: "洞穴巨魔腰帶 (Troll Belt)",
        slot: "belt",
        requiredLevel: 62,
        attributes: ["無法被凍結 (CBF)", "+66 生命", "+25-50 法力", "+30 最大體力"]
      },
      {
        id: "trang_shield",
        name: "塔格奧之翼",
        nameEn: "Trang-Oul's Wing",
        baseItem: "領頭羊之首 (Cantor Trophy)",
        slot: "shield",
        requiredLevel: 54,
        attributes: ["+2 毒素與白骨技能", "+30% 快速格擋速度", "抗火 +38-45%", "抗毒 +40%"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+18 火球 (Fire Ball)" },
      { count: 3, bonus: "+13 火焰壁 (Fire Wall)" }
    ],
    fullBonuses: [
      "+3 死靈法師技能",
      "+20% 生命偷取",
      "所有抗性 +50",
      "-25% 敵人毒素抗性",
      "變身為吸血鬼巫妖形態 (Vampire Form)"
    ]
  },
  {
    id: "immortal_king",
    name: "不朽之王 (IK)",
    nameEn: "Immortal King",
    pieces: [
      {
        id: "ik_helm",
        name: "不朽之王的意志",
        nameEn: "Immortal King's Will",
        baseItem: "復仇者防護面甲 (Avenger Guard)",
        slot: "helm",
        requiredLevel: 47,
        attributes: ["+2 戰吼技能 (野蠻人專用)", "+37% 更佳機會取得魔法裝備 (MF)", "+125 防禦", "鑲孔 (2)"]
      },
      {
        id: "ik_armor",
        name: "不朽之王的靈魂牢籠",
        nameEn: "Immortal King's Soul Cage",
        baseItem: "神聖盔甲 (Sacred Armor)",
        slot: "armor",
        requiredLevel: 76,
        attributes: ["+2 戰鬥技能 (野蠻人專用)", "+400 防禦", "抗毒 +50%", "+25% 快速打擊恢復 (FHR)"]
      },
      {
        id: "ik_weapon",
        name: "不朽之王的碎石者",
        nameEn: "Immortal King's Stone Crusher",
        baseItem: "食人魔鐵槌 (Ogre Maul)",
        slot: "weapon",
        requiredLevel: 76,
        attributes: ["+40% 攻擊速度 (IAS)", "35-40% 壓碎打擊 (CB)", "+200% 增強傷害", "鑲孔 (2)"]
      },
      {
        id: "ik_gloves",
        name: "不朽之王的融爐",
        nameEn: "Immortal King's Forge",
        baseItem: "巨型手套 (War Gauntlets)",
        slot: "gloves",
        requiredLevel: 30,
        attributes: ["+20 力量", "+20 敏捷", "+65 防禦"]
      },
      {
        id: "ik_boots",
        name: "不朽之王之柱",
        nameEn: "Immortal King's Pillar",
        baseItem: "巨戰之靴 (War Boots)",
        slot: "boots",
        requiredLevel: 31,
        attributes: ["+40% 跑步/步行速度", "+110 準確率", "+44 生命"]
      },
      {
        id: "ik_belt",
        name: "不朽之王的細節",
        nameEn: "Immortal King's Detail",
        baseItem: "巨戰腰帶 (War Belt)",
        slot: "belt",
        requiredLevel: 29,
        attributes: ["+25 力量", "抗火 +28%", "抗電 +31%"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+50 攻擊準確率" },
      { count: 3, bonus: "+75 防禦" },
      { count: 4, bonus: "+25% 快速打擊恢復 (FHR)" }
    ],
    fullBonuses: [
      "+3 野蠻人技能",
      "+450 攻擊準確率",
      "+150 生命",
      "所有抗性 +50",
      "傷害減少 20%",
      "碎石者附加高達 +250-360 冰火電毒全元素傷害"
    ]
  },
  {
    id: "banes_garments",
    name: "貝恩的衣裝",
    nameEn: "Bane's Garments",
    pieces: [
      {
        id: "bane_hood",
        name: "貝恩的恐懼風帽",
        nameEn: "Bane's Hood",
        baseItem: "術士風帽 (Warlock Hood)",
        slot: "helm",
        requiredLevel: 72,
        attributes: ["+2 混沌法術技能", "+20% 快速打擊恢復", "所有抗性 +15"]
      },
      {
        id: "bane_robe",
        name: "貝恩的暗影法袍",
        nameEn: "Bane's Shadow Robe",
        baseItem: "惡魔織袍 (Demon Robe)",
        slot: "armor",
        requiredLevel: 75,
        attributes: ["+2 術士技能", "+30% 跑步/步行速度", "傷害減少 10%"]
      },
      {
        id: "bane_grimoire",
        name: "貝恩的禁忌之書",
        nameEn: "Bane's Grimoire",
        baseItem: "術士魔典 (Tome)",
        slot: "shield",
        requiredLevel: 74,
        attributes: ["+20% 快速施法速度 (FCR)", "-15% 敵人暗影抗性", "+40 法力"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+15% 快速施法速度 (FCR)" }
    ],
    fullBonuses: [
      "+3 術士所有技能",
      "+25% 混亂法術傷害",
      "所有抗性 +35",
      "召喚惡魔僕從攻擊時附加虛空裂隙爆發"
    ]
  },
  {
    id: "the_disciple",
    name: "門徒",
    nameEn: "The Disciple",
    pieces: [
      {
        id: "laying_of_hands",
        name: "安置手套",
        nameEn: "Laying of Hands",
        baseItem: "荊棘連指手套 (Bramble Mitts)",
        slot: "gloves",
        requiredLevel: 63,
        attributes: [
          "+20% 攻擊速度 (IAS)",
          "+350% 對惡魔的傷害 (Damage to Demons)",
          "+25 防禦",
          "抗火 +50%",
          "打擊時有 10% 機率施展等級 3 神聖之火"
        ]
      },
      {
        id: "telling_of_beads",
        name: "述說之珠",
        nameEn: "Telling of Beads",
        baseItem: "項鍊 (Amulet)",
        slot: "amulet",
        requiredLevel: 30,
        attributes: ["+1 所有技能", "抗毒 +35-50% (變動)", "抗寒 +18%", "攻擊者受到傷害 8-10"]
      },
      {
        id: "rite_of_passage",
        name: "儀式之靴",
        nameEn: "Rite of Passage",
        baseItem: "惡魔皮靴 (Demonhide Boots)",
        slot: "boots",
        requiredLevel: 29,
        attributes: ["+30% 跑步/步行速度", "+25 防禦", "冰凍時間減半", "+15-25 最大體力"]
      },
      {
        id: "dark_adherent",
        name: "黑暗信徒",
        nameEn: "Dark Adherent",
        baseItem: "幽暮罩衣 (Dusk Shroud)",
        slot: "armor",
        requiredLevel: 49,
        attributes: ["被擊中時 25% 施展等級 3 微暗靈視", "+305-415 防禦", "抗火 +24%"]
      },
      {
        id: "credendum",
        name: "信徒腰帶",
        nameEn: "Credendum",
        baseItem: "秘儀腰帶 (Mithril Coil)",
        slot: "belt",
        requiredLevel: 65,
        attributes: ["所有抗性 +15", "+10 力量", "+10 敏捷", "+50 防禦"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+150 防禦" },
      { count: 3, bonus: "+22 毒素傷害，持續 3 秒" },
      { count: 4, bonus: "+10 生命恢復" }
    ],
    fullBonuses: [
      "+3 所有技能",
      "+100 力量",
      "+100 法力",
      "所有抗性 +50",
      "+50% 快速打擊恢復 (FHR)"
    ]
  },
  {
    id: "orphans_call",
    name: "孤兒的呼喚",
    nameEn: "Orphan's Call",
    pieces: [
      {
        id: "guillaumes_face_set",
        name: "吉永之臉",
        nameEn: "Guillaume's Face",
        baseItem: "翼盔 (Winged Helm)",
        slot: "helm",
        requiredLevel: 34,
        attributes: [
          "+30% 快速打擊恢復 (FHR)",
          "35% 機率造成壓碎打擊 (CB)",
          "15% 機率造成致命打擊 (DS)",
          "+120% 強化防禦",
          "+15 力量"
        ]
      },
      {
        id: "whitstans_guard",
        name: "白星",
        nameEn: "Whitstan's Guard",
        baseItem: "圓盾 (Round Shield)",
        slot: "shield",
        requiredLevel: 29,
        attributes: ["+55% 增加格擋機率", "+40% 快速格擋速度 (FBR)", "+175 強化防禦", "冰凍時間減半"]
      },
      {
        id: "magnus_skin",
        name: "瑪格那斯之皮",
        nameEn: "Magnus' Skin",
        baseItem: "鯊皮手套 (Sharkskin Gloves)",
        slot: "gloves",
        requiredLevel: 37,
        attributes: ["+20% 攻擊速度 (IAS)", "+100 攻擊準確率", "抗火 +15%", "+35 防禦"]
      },
      {
        id: "wilhelms_pride",
        name: "威廉的自尊",
        nameEn: "Wilhelm's Pride",
        baseItem: "戰鬥腰帶 (Battle Belt)",
        slot: "belt",
        requiredLevel: 42,
        attributes: ["每次命中偷取 5% 生命", "每次命中偷取 5% 法力", "抗寒 +10%", "+75% 強化防禦"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+35 生命" },
      { count: 3, bonus: "+100 攻擊準確率" }
    ],
    fullBonuses: [
      "+100 防禦",
      "+20 敏捷",
      "+20 力量",
      "所有抗性 +35",
      "每次命中偷取 5% 生命",
      "85% 額外金幣從怪物身上取得"
    ]
  },
  {
    id: "angelic_raiment",
    name: "天使的衣著",
    nameEn: "Angelic Raiment",
    pieces: [
      {
        id: "angelic_wings",
        name: "天使之翼",
        nameEn: "Angelic Wings",
        baseItem: "項鍊 (Amulet)",
        slot: "amulet",
        requiredLevel: 12,
        attributes: ["20% 受損生命轉移為法力", "+3 照亮範圍", "【套裝加成】：+75 生命，+1 所有技能 (配雙戒)"]
      },
      {
        id: "angelic_halo",
        name: "天使之暈",
        nameEn: "Angelic Halo",
        baseItem: "戒指 (Ring)",
        slot: "ring",
        requiredLevel: 12,
        attributes: ["生命恢復 +6", "+20 生命", "【套裝加成】：+(12 每等級) 攻擊準確率 (AR)"]
      },
      {
        id: "angelic_mantle",
        name: "天使披風",
        nameEn: "Angelic Mantle",
        baseItem: "鎖子甲 (Ring Mail)",
        slot: "armor",
        requiredLevel: 12,
        attributes: ["+40% 強化防禦", "傷害減少 3", "【套裝加成】：+150 防禦，抗火 +50%"]
      },
      {
        id: "angelic_sickle",
        name: "天使鐮刀",
        nameEn: "Angelic Sickle",
        baseItem: "彎刀 (Sabre)",
        slot: "weapon",
        requiredLevel: 12,
        attributes: ["+75 攻擊準確率", "+250% 對不死生物傷害", "【套裝加成】：+30% 攻擊速度"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+10 敏捷" },
      { count: 3, bonus: "+50 法力" }
    ],
    fullBonuses: [
      "所有抗性 +25",
      "+40% 快速打擊恢復 (FHR)",
      "無法被凍結 (CBF)",
      "+50% 更佳機會取得魔法裝備 (MF)"
    ]
  },
  {
    id: "sigons_complete_steel",
    name: "西剛的全套鋼甲",
    nameEn: "Sigon's Complete Steel",
    pieces: [
      {
        id: "sigon_visor",
        name: "西剛的面甲",
        nameEn: "Sigon's Visor",
        baseItem: "大金屬頭盔 (Great Helm)",
        slot: "helm",
        requiredLevel: 6,
        attributes: ["+25 防禦", "+30 法力", "【套裝加成】：+(8 每等級) 攻擊準確率 (AR)"]
      },
      {
        id: "sigon_shelter",
        name: "西剛的守護者",
        nameEn: "Sigon's Shelter",
        baseItem: "哥德戰甲 (Gothic Plate)",
        slot: "armor",
        requiredLevel: 6,
        attributes: ["+25% 強化防禦", "抗電 +30%", "攻擊者受到傷害 20"]
      },
      {
        id: "sigon_guard",
        name: "西剛的守衛",
        nameEn: "Sigon's Guard",
        baseItem: "塔盾 (Tower Shield)",
        slot: "shield",
        requiredLevel: 6,
        attributes: ["+1 所有技能", "+20% 增加格擋機率"]
      },
      {
        id: "sigon_gage",
        name: "西剛的挑戰",
        nameEn: "Sigon's Gage",
        baseItem: "鐵手套 (Gauntlets)",
        slot: "gloves",
        requiredLevel: 6,
        attributes: ["+20 攻擊準確率", "+10 力量", "【套裝加成】：+30% 攻擊速度 (IAS)"]
      },
      {
        id: "sigon_sabot",
        name: "西剛的木屐",
        nameEn: "Sigon's Sabot",
        baseItem: "重靴 (Greaves)",
        slot: "boots",
        requiredLevel: 6,
        attributes: ["+20% 跑步/步行速度", "抗寒 +40%", "【套裝加成】：+50 攻擊準確率，+50% MF"]
      },
      {
        id: "sigon_wrap",
        name: "西剛的披肩",
        nameEn: "Sigon's Wrap",
        baseItem: "金屬扣帶 (Plated Belt)",
        slot: "belt",
        requiredLevel: 6,
        attributes: ["抗火 +20%", "+20 生命", "【套裝加成】：+(2 每等級) 防禦"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "每次命中偷取 10% 生命" },
      { count: 3, bonus: "+100 防禦" }
    ],
    fullBonuses: [
      "+12 傷害減少",
      "+24 火焰傷害",
      "+50% 更佳機會取得魔法裝備 (MF)",
      "所有抗性 +12"
    ]
  },
  {
    id: "mavinas_battle_hymn",
    name: "馬維娜的教條",
    nameEn: "M'avina's Battle Hymn",
    pieces: [
      {
        id: "mavina_true_sight",
        name: "馬維娜的真實之眼",
        nameEn: "M'avina's True Sight",
        baseItem: "權冠 (Diadem)",
        slot: "helm",
        requiredLevel: 64,
        attributes: ["+30% 攻擊速度 (IAS)", "+150 防禦", "法力恢復 +15%"]
      },
      {
        id: "mavina_caster",
        name: "馬維娜的施展符",
        nameEn: "M'avina's Caster",
        baseItem: "大院長之弓 (Grand Matron Bow)",
        slot: "weapon",
        requiredLevel: 70,
        attributes: ["+40% 攻擊速度 (IAS)", "+188% 增強傷害", "+50 攻擊準確率", "發射魔法箭矢"]
      },
      {
        id: "mavina_embrace",
        name: "馬維娜的擁抱",
        nameEn: "M'avina's Embrace",
        baseItem: "海妖殼甲 (Kraken Shell)",
        slot: "armor",
        requiredLevel: 70,
        attributes: ["+2 被動與魔法技能 (亞馬遜專用)", "裝備需求 -30%", "魔法傷害減少 5-12", "防禦力 +(4 每等級)"]
      },
      {
        id: "mavina_icy_clutch",
        name: "馬維娜的冰冷之握",
        nameEn: "M'avina's Icy Clutch",
        baseItem: "戰場手套 (Battle Gauntlets)",
        slot: "gloves",
        requiredLevel: 32,
        attributes: ["+45-50 防禦", "+6-18 冰寒傷害", "冰凍時間減半", "56% 額外金幣 (GF)"]
      },
      {
        id: "mavina_tenet",
        name: "馬維娜的信條",
        nameEn: "M'avina's Tenet",
        baseItem: "鯊皮腰帶 (Sharkskin Belt)",
        slot: "belt",
        requiredLevel: 45,
        attributes: ["+20% 跑步/步行速度", "+5 每次命中偷取法力", "+50 防禦"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+20 力量" },
      { count: 3, bonus: "+30 敏捷" },
      { count: 4, bonus: "所有抗性 +25" }
    ],
    fullBonuses: [
      "+3 亞馬遜技能",
      "+100% 攻擊準確率加成",
      "+20% 冰冷技能傷害",
      "所有抗性 +50",
      "+100 防禦",
      "角色散發純白神聖光暈"
    ]
  },
  {
    id: "griswolds_legacy",
    name: "格里斯瓦德的遺產",
    nameEn: "Griswold's Legacy",
    pieces: [
      {
        id: "griswold_redemption",
        name: "格里斯瓦德的救贖",
        nameEn: "Griswold's Redemption",
        baseItem: "卡帝納爾權杖 (Caduceus)",
        slot: "weapon",
        requiredLevel: 66,
        attributes: ["+40% 攻擊速度 (IAS)", "+200-240% 增強傷害", "鑲孔 (3-4) (變動)"]
      },
      {
        id: "griswold_valor",
        name: "格里斯瓦德的勇氣",
        nameEn: "Griswold's Valor",
        baseItem: "頭飾頭盔 (Corona)",
        slot: "helm",
        requiredLevel: 69,
        attributes: ["+50-75% 強化防禦", "所有抗性 +5", "傷害減少 20-30%", "鑲孔 (2)"]
      },
      {
        id: "griswold_heart",
        name: "格里斯瓦德的心臟",
        nameEn: "Griswold's Heart",
        baseItem: "裝甲胸甲 (Ornate Plate)",
        slot: "armor",
        requiredLevel: 45,
        attributes: ["+2 防禦靈氣 (聖騎士專用)", "+500 防禦", "+20 力量", "裝備需求 -80%", "鑲孔 (3)"]
      },
      {
        id: "griswold_honor",
        name: "格里斯瓦德的榮譽",
        nameEn: "Griswold's Honor",
        baseItem: "旋風盾 (Vortex Shield)",
        slot: "shield",
        requiredLevel: 68,
        attributes: ["+20% 快速格擋速度 (FBR)", "+65% 增加格擋機率", "所有抗性 +45", "鑲孔 (3)"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+20 力量" },
      { count: 3, bonus: "+30 敏捷" }
    ],
    fullBonuses: [
      "+3 聖騎士技能",
      "+200 攻擊準確率",
      "+150 生命",
      "所有抗性 +50",
      "+30% 快速打擊恢復 (FHR)",
      "合計擁有高達 12 個鑲孔可自由打造極限客製化"
    ]
  },
  {
    id: "horazons_splendor",
    name: "赫拉森的輝煌",
    nameEn: "Horazon's Splendor",
    pieces: [
      {
        id: "horazon_diadem",
        name: "赫拉森的神秘冠冕",
        nameEn: "Horazon's Mystic Diadem",
        baseItem: "術士頭飾 (Tiara)",
        slot: "helm",
        requiredLevel: 76,
        attributes: ["+2 術士技能", "+20% 快速施法速度 (FCR)", "法力恢復 +25%"]
      },
      {
        id: "horazon_shroud",
        name: "赫拉森的虛空裹屍布",
        nameEn: "Horazon's Void Shroud",
        baseItem: "灰暮罩衣 (Dusk Shroud)",
        slot: "armor",
        requiredLevel: 78,
        attributes: ["+2 邪異武裝技能", "傷害減少 10%", "所有抗性 +25"]
      },
      {
        id: "horazon_focus",
        name: "赫拉森的奧術聚焦核心",
        nameEn: "Horazon's Arcane Focus",
        baseItem: "術士魔典 (Grimoire)",
        slot: "shield",
        requiredLevel: 77,
        attributes: ["+30% 快速格擋速度", "-20% 敵人混沌抗性", "+50 生命"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+20% 快速施法速度 (FCR)" }
    ],
    fullBonuses: [
      "+3 術士所有技能",
      "+30% 混亂法術傷害",
      "所有抗性 +40",
      "使役惡魔僕從死亡時觸發黑洞吞噬波"
    ]
  },
  {
    id: "natalyas_odium",
    name: "娜塔亞的非難",
    nameEn: "Natalya's Odium",
    pieces: [
      {
        id: "natalya_totem",
        name: "娜塔亞的圖騰",
        nameEn: "Natalya's Totem",
        baseItem: "殘酷頭盔 (Grim Helm)",
        slot: "helm",
        requiredLevel: 59,
        attributes: ["所有抗性 +10-20 (變動)", "+20-30 敏捷 (變動)", "+10-20 力量 (變動)", "魔法傷害減少 3"]
      },
      {
        id: "natalya_mark",
        name: "娜塔亞的標記",
        nameEn: "Natalya's Mark",
        baseItem: "近身刃 (Scissors Suwayyah)",
        slot: "weapon",
        requiredLevel: 79,
        attributes: ["+40% 攻擊速度 (IAS)", "+200% 增強傷害", "忽略目標防禦", "增加 12-17 冰寒傷害", "+200% 對不死生物傷害"]
      },
      {
        id: "natalya_shadow",
        name: "娜塔亞的影子",
        nameEn: "Natalya's Shadow",
        baseItem: "甲殼鎧甲 (Loricated Mail)",
        slot: "armor",
        requiredLevel: 73,
        attributes: ["+2 刺客暗影訓練", "+150-225 防禦 (變動)", "抗毒 +25%", "毒素持續時間縮短 75%", "凹槽 (1-3) (變動)"]
      },
      {
        id: "natalya_soul",
        name: "娜塔亞的靈魂",
        nameEn: "Natalya's Soul",
        baseItem: "網格之靴 (Mesh Boots)",
        slot: "boots",
        requiredLevel: 25,
        attributes: ["+40% 跑步/步行速度", "抗寒 +15-25% (變動)", "抗電 +15-25% (變動)", "+75-125 防禦 (變動)"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "魔法傷害減少 15" },
      { count: 3, bonus: "+200 防禦" }
    ],
    fullBonuses: [
      "+3 刺客技能",
      "傷害減少 30% (DR)",
      "所有抗性 +50",
      "每次命中偷取 14% 生命",
      "每次命中偷取 14% 法力",
      "角色外觀呈現完全半透明陰影形態 (鬼魅潛行)"
    ]
  },
  {
    id: "aldurs_watchtower",
    name: "艾爾多的守衛",
    nameEn: "Aldur's Watchtower",
    pieces: [
      {
        id: "aldur_stony_gaze",
        name: "艾爾多的律動之眼",
        nameEn: "Aldur's Stony Gaze",
        baseItem: "獵人的偽裝 (Hunter's Guise)",
        slot: "helm",
        requiredLevel: 36,
        attributes: ["+25% 快速打擊恢復 (FHR)", "抗寒 +40-50% (變動)", "法力恢復 +17%", "凹槽 (2)"]
      },
      {
        id: "aldur_rhythm",
        name: "艾爾多的節奏",
        nameEn: "Aldur's Rhythm",
        baseItem: "鋸齒之星 (Jagged Star)",
        slot: "weapon",
        requiredLevel: 42,
        attributes: ["+30% 攻擊速度 (IAS)", "+200% 對惡魔傷害", "每次命中偷取 10% 生命", "每次命中偷取 5% 法力", "凹槽 (2-3) (變動)"]
      },
      {
        id: "aldur_deception",
        name: "艾爾多的石壁",
        nameEn: "Aldur's Deception",
        baseItem: "陰影鎧甲 (Shadow Plate)",
        slot: "armor",
        requiredLevel: 76,
        attributes: ["+1 德魯伊元素技能", "+1 德魯伊變形技能", "+300 防禦", "抗電 +40-50% (變動)", "需求 -50%"]
      },
      {
        id: "aldur_advance",
        name: "艾爾多的成長 (進擊之靴)",
        nameEn: "Aldur's Advance",
        baseItem: "戰鬥之靴 (Battle Boots)",
        slot: "boots",
        requiredLevel: 45,
        attributes: ["+40% 跑步/步行速度", "+50 生命", "抗火 +40-50% (變動)", "10% 受損生命轉移為法力"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+150 攻擊準確率" },
      { count: 3, bonus: "+50 防禦" }
    ],
    fullBonuses: [
      "+3 德魯伊技能",
      "+350% 增強傷害 (ED)",
      "+150 法力",
      "所有抗性 +50",
      "+15 力量",
      "+15 敏捷",
      "角色散發狂野自然橙金光暈"
    ]
  },
  {
    id: "sazabis_grand_tribute",
    name: "沙薩比的雄偉貢獻",
    nameEn: "Sazabi's Grand Tribute",
    pieces: [
      {
        id: "sazabi_mental_sheath",
        name: "沙薩比的精神之鞘",
        nameEn: "Sazabi's Mental Sheath",
        baseItem: "淺樓頭盔 (Basinet)",
        slot: "helm",
        requiredLevel: 43,
        attributes: ["+1 所有技能", "抗閃電 +15-20% (變動)", "抗火 +15-20% (變動)", "+100 防禦"]
      },
      {
        id: "sazabi_ghost_liberator",
        name: "沙薩比的幽靈釋放者",
        nameEn: "Sazabi's Ghost Liberator",
        baseItem: "炎魔皮板甲 (Balrog Skin)",
        slot: "armor",
        requiredLevel: 67,
        attributes: ["+30% 快速打擊恢復 (FHR)", "+400 防禦", "+50-75 生命 (變動)", "+25 力量"]
      },
      {
        id: "sazabi_cobalt_redeemer",
        name: "沙薩比的鈷藍救贖者",
        nameEn: "Sazabi's Cobalt Redeemer",
        baseItem: "神秘之劍 (Cryptic Sword)",
        slot: "weapon",
        requiredLevel: 73,
        attributes: ["+40% 攻擊速度 (IAS)", "+150% 增強傷害", "+318% 對惡魔傷害", "增加 25-35 冰寒傷害"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+175 防禦" }
    ],
    fullBonuses: [
      "+1 所有技能",
      "+27% 增加生命上限",
      "每次命中偷取 16% 生命 (極致吸血)",
      "所有抗性 +30",
      "傷害減少 16% (DR)",
      "2.4/2.6 第五幕野蠻人傭兵最強生存畢業套裝！"
    ]
  },
  {
    id: "hwanins_majesty",
    name: "華寧的威嚴",
    nameEn: "Hwanin's Majesty",
    pieces: [
      {
        id: "hwanin_splendor",
        name: "華寧的光輝",
        nameEn: "Hwanin's Splendor",
        baseItem: "大皇冠 (Grand Crown)",
        slot: "helm",
        requiredLevel: 45,
        attributes: ["法力恢復 12%", "生命恢復 +20", "無法被凍結 (CBF)", "魔法傷害減少 10"]
      },
      {
        id: "hwanin_justice",
        name: "華寧的正義",
        nameEn: "Hwanin's Justice",
        baseItem: "比爾長柄斧 (Bill)",
        slot: "weapon",
        requiredLevel: 28,
        attributes: ["+40% 攻擊速度 (IAS)", "+200% 增強傷害", "+330 攻擊準確率", "打擊時 10% 機率施展等級 3 冰風暴"]
      },
      {
        id: "hwanin_refuge",
        name: "華寧的庇護",
        nameEn: "Hwanin's Refuge",
        baseItem: "提格列特戰甲 (Tigulated Mail)",
        slot: "armor",
        requiredLevel: 30,
        attributes: ["被擊中時 10% 機率施展等級 3 靜態力場", "+200 防禦", "抗毒 +27%"]
      },
      {
        id: "hwanin_blessing",
        name: "華寧的祝福",
        nameEn: "Hwanin's Blessing",
        baseItem: "飾帶 (Belt)",
        slot: "belt",
        requiredLevel: 35,
        attributes: ["防止怪物自療", "+3-33 閃電傷害", "傷害減少 10% (DR)"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+100 防禦" },
      { count: 3, bonus: "+200 防禦" }
    ],
    fullBonuses: [
      "+2 所有技能",
      "+30% 快速打擊恢復 (FHR)",
      "每次命中偷取 20% 生命",
      "所有抗性 +30",
      "角色散發金色微光"
    ]
  },
  {
    id: "cathans_traps",
    name: "卡珊的陷阱",
    nameEn: "Cathan's Traps",
    pieces: [
      {
        id: "cathan_seal",
        name: "卡珊的印記 (開荒神戒)",
        nameEn: "Cathan's Seal",
        baseItem: "戒指 (Ring)",
        slot: "ring",
        requiredLevel: 11,
        attributes: ["每次命中偷取 6% 生命", "物理傷害減少 2"]
      },
      {
        id: "cathan_visage",
        name: "卡珊的面容",
        nameEn: "Cathan's Visage",
        baseItem: "面具 (Mask)",
        slot: "helm",
        requiredLevel: 11,
        attributes: ["抗寒 +25%", "+20 法力"]
      },
      {
        id: "cathan_mesh",
        name: "卡珊的織網",
        nameEn: "Cathan's Mesh",
        baseItem: "鎖子甲 (Chain Mail)",
        slot: "armor",
        requiredLevel: 11,
        attributes: ["需求 -50%", "+15 基礎防禦"]
      },
      {
        id: "cathan_rule",
        name: "卡珊的統治",
        nameEn: "Cathan's Rule",
        baseItem: "戰鬥法杖 (Battle Staff)",
        slot: "weapon",
        requiredLevel: 11,
        attributes: ["+1 火焰技能", "+10 最大法力", "+50 生命"]
      },
      {
        id: "cathan_sigil",
        name: "卡珊的符號",
        nameEn: "Cathan's Sigil",
        baseItem: "項鍊 (Amulet)",
        slot: "amulet",
        requiredLevel: 11,
        attributes: ["+10% 快速打擊恢復 (FHR)", "攻擊者受到傷害 5"]
      }
    ],
    partialBonuses: [
      { count: 2, bonus: "+15-20 火焰傷害" },
      { count: 3, bonus: "抗閃電 +25%" }
    ],
    fullBonuses: [
      "+1 所有技能",
      "+20 敏捷",
      "+20 活力",
      "所有抗性 +25",
      "暗黑破壞神老玩家無人不曉的經典新手神器"
    ]
  }
];


