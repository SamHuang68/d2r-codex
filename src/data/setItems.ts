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
  }
];
