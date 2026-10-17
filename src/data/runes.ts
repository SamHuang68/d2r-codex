import { RuneData } from '../types';

export const RUNES_DATA: RuneData[] = [
  {
    number: 1,
    name: "艾爾",
    nameEn: "El",
    weaponEffect: "+50 準確率, +1 照亮範圍",
    armorHelmEffect: "+15 防禦, +1 照亮範圍",
    shieldEffect: "+15 防禦, +1 照亮範圍",
    requiredLevel: 11,
    cubeRecipe: "3x El -> 1x Eld"
  },
  {
    number: 2,
    name: "艾德",
    nameEn: "Eld",
    weaponEffect: "+75% 對不死生物的傷害, +50 對不死生物的準確率",
    armorHelmEffect: "體力消耗減慢 15%",
    shieldEffect: "+7% 格擋率",
    requiredLevel: 11,
    cubeRecipe: "3x Eld -> 1x Tir"
  },
  {
    number: 3,
    name: "特爾",
    nameEn: "Tir",
    weaponEffect: "+2 擊殺後獲得法力 (EK)",
    armorHelmEffect: "+2 擊殺後獲得法力 (EK)",
    shieldEffect: "+2 擊殺後獲得法力 (EK)",
    requiredLevel: 13,
    cubeRecipe: "3x Tir -> 1x Nef"
  },
  {
    number: 4,
    name: "那夫",
    nameEn: "Nef",
    weaponEffect: "擊退 (Knockback)",
    armorHelmEffect: "+30 對遠程攻擊防禦",
    shieldEffect: "+30 對遠程攻擊防禦",
    requiredLevel: 13,
    cubeRecipe: "3x Nef -> 1x Eth"
  },
  {
    number: 5,
    name: "愛斯",
    nameEn: "Eth",
    weaponEffect: "-25% 目標防禦",
    armorHelmEffect: "法力恢復 +15%",
    shieldEffect: "法力恢復 +15%",
    requiredLevel: 15,
    cubeRecipe: "3x Eth -> 1x Ith"
  },
  {
    number: 6,
    name: "伊司",
    nameEn: "Ith",
    weaponEffect: "+9 最大傷害值",
    armorHelmEffect: "15% 受損生命轉移為法力",
    shieldEffect: "15% 受損生命轉移為法力",
    requiredLevel: 15,
    cubeRecipe: "3x Ith -> 1x Tal"
  },
  {
    number: 7,
    name: "塔爾",
    nameEn: "Tal",
    weaponEffect: "+75 毒素傷害，持續 5 秒",
    armorHelmEffect: "抗毒 +30%",
    shieldEffect: "抗毒 +35%",
    requiredLevel: 17,
    cubeRecipe: "3x Tal -> 1x Ral"
  },
  {
    number: 8,
    name: "拉爾",
    nameEn: "Ral",
    weaponEffect: "+(5-30) 火焰傷害",
    armorHelmEffect: "抗火 +30%",
    shieldEffect: "抗火 +35%",
    requiredLevel: 19,
    cubeRecipe: "3x Ral -> 1x Ort"
  },
  {
    number: 9,
    name: "歐特",
    nameEn: "Ort",
    weaponEffect: "+(1-50) 閃電傷害",
    armorHelmEffect: "抗電 +30%",
    shieldEffect: "抗電 +35%",
    requiredLevel: 21,
    cubeRecipe: "3x Ort -> 1x Thul"
  },
  {
    number: 10,
    name: "書爾",
    nameEn: "Thul",
    weaponEffect: "+(3-14) 冰寒傷害，持續 3 秒",
    armorHelmEffect: "抗寒 +30%",
    shieldEffect: "抗寒 +35%",
    requiredLevel: 23,
    cubeRecipe: "3x Thul + 1x 碎裂黃寶石 -> 1x Amn"
  },
  {
    number: 11,
    name: "安姆",
    nameEn: "Amn",
    weaponEffect: "每次命中偷取 7% 生命",
    armorHelmEffect: "攻擊者受到傷害 14",
    shieldEffect: "攻擊者受到傷害 14",
    requiredLevel: 25,
    cubeRecipe: "3x Amn + 1x 碎裂紫寶石 -> 1x Sol"
  },
  {
    number: 12,
    name: "索爾",
    nameEn: "Sol",
    weaponEffect: "+9 最小傷害值",
    armorHelmEffect: "物理傷害減少 7",
    shieldEffect: "物理傷害減少 7",
    requiredLevel: 27,
    cubeRecipe: "3x Sol + 1x 碎裂藍寶石 -> 1x Shael"
  },
  {
    number: 13,
    name: "夏",
    nameEn: "Shael",
    weaponEffect: "提升 20% 攻擊速度 (IAS)",
    armorHelmEffect: "提升 20% 快速打擊恢復 (FHR)",
    shieldEffect: "提升 20% 快速格擋速度 (FBR)",
    requiredLevel: 29,
    cubeRecipe: "3x Shael + 1x 碎裂紅寶石 -> 1x Dol"
  },
  {
    number: 14,
    name: "多爾",
    nameEn: "Dol",
    weaponEffect: "擊中使怪物逃跑 25%",
    armorHelmEffect: "生命恢復 +7",
    shieldEffect: "生命恢復 +7",
    requiredLevel: 31,
    cubeRecipe: "3x Dol + 1x 碎裂綠寶石 -> 1x Hel"
  },
  {
    number: 15,
    name: "海爾",
    nameEn: "Hel",
    weaponEffect: "裝備需求 -20%",
    armorHelmEffect: "裝備需求 -15%",
    shieldEffect: "裝備需求 -15%",
    requiredLevel: 0,
    cubeRecipe: "3x Hel + 1x 碎裂鑽石 -> 1x Io"
  },
  {
    number: 16,
    name: "伊歐",
    nameEn: "Io",
    weaponEffect: "+10 活力",
    armorHelmEffect: "+10 活力",
    shieldEffect: "+10 活力",
    requiredLevel: 35,
    cubeRecipe: "3x Io + 1x 瑕疵黃寶石 -> 1x Lum"
  },
  {
    number: 17,
    name: "盧姆",
    nameEn: "Lum",
    weaponEffect: "+10 精力",
    armorHelmEffect: "+10 精力",
    shieldEffect: "+10 精力",
    requiredLevel: 37,
    cubeRecipe: "3x Lum + 1x 瑕疵紫寶石 -> 1x Ko"
  },
  {
    number: 18,
    name: "科",
    nameEn: "Ko",
    weaponEffect: "+10 敏捷",
    armorHelmEffect: "+10 敏捷",
    shieldEffect: "+10 敏捷",
    requiredLevel: 39,
    cubeRecipe: "3x Ko + 1x 瑕疵藍寶石 -> 1x Fal"
  },
  {
    number: 19,
    name: "法爾",
    nameEn: "Fal",
    weaponEffect: "+10 力量",
    armorHelmEffect: "+10 力量",
    shieldEffect: "+10 力量",
    requiredLevel: 41,
    cubeRecipe: "3x Fal + 1x 瑕疵紅寶石 -> 1x Lem"
  },
  {
    number: 20,
    name: "藍姆",
    nameEn: "Lem",
    weaponEffect: "75% 額外金幣從怪物身上取得 (GF)",
    armorHelmEffect: "50% 額外金幣從怪物身上取得 (GF)",
    shieldEffect: "50% 額外金幣從怪物身上取得 (GF)",
    requiredLevel: 43,
    cubeRecipe: "3x Lem + 1x 瑕疵綠寶石 -> 1x Pul"
  },
  {
    number: 21,
    name: "普爾",
    nameEn: "Pul",
    weaponEffect: "+75% 對惡魔傷害, +100 對惡魔準確率",
    armorHelmEffect: "+30% 強化防禦 (EDef)",
    shieldEffect: "+30% 強化防禦 (EDef)",
    requiredLevel: 45,
    cubeRecipe: "2x Pul + 1x 瑕疵鑽石 -> 1x Um"
  },
  {
    number: 22,
    name: "烏姆",
    nameEn: "Um",
    weaponEffect: "25% 機率造成撕開傷口",
    armorHelmEffect: "所有抗性 +15",
    shieldEffect: "所有抗性 +22",
    requiredLevel: 47,
    cubeRecipe: "2x Um + 1x 黃寶石 -> 1x Mal"
  },
  {
    number: 23,
    name: "馬爾",
    nameEn: "Mal",
    weaponEffect: "防止怪物自療",
    armorHelmEffect: "魔法傷害減少 7",
    shieldEffect: "魔法傷害減少 7",
    requiredLevel: 49,
    cubeRecipe: "2x Mal + 1x 紫寶石 -> 1x Ist"
  },
  {
    number: 24,
    name: "伊司特",
    nameEn: "Ist",
    weaponEffect: "+30% 更佳機會取得魔法裝備 (MF)",
    armorHelmEffect: "+25% 更佳機會取得魔法裝備 (MF)",
    shieldEffect: "+25% 更佳機會取得魔法裝備 (MF)",
    requiredLevel: 51,
    cubeRecipe: "2x Ist + 1x 藍寶石 -> 1x Gul"
  },
  {
    number: 25,
    name: "古爾",
    nameEn: "Gul",
    weaponEffect: "+20% 攻擊準確率加成",
    armorHelmEffect: "+5% 最大抗毒",
    shieldEffect: "+5% 最大抗毒",
    requiredLevel: 53,
    cubeRecipe: "2x Gul + 1x 紅寶石 -> 1x Vex"
  },
  {
    number: 26,
    name: "伐克斯",
    nameEn: "Vex",
    weaponEffect: "每次命中偷取 7% 法力",
    armorHelmEffect: "+5% 最大抗火",
    shieldEffect: "+5% 最大抗火",
    requiredLevel: 55,
    cubeRecipe: "2x Vex + 1x 綠寶石 -> 1x Ohm"
  },
  {
    number: 27,
    name: "歐姆",
    nameEn: "Ohm",
    weaponEffect: "+50% 增強傷害 (ED)",
    armorHelmEffect: "+5% 最大抗寒",
    shieldEffect: "+5% 最大抗寒",
    requiredLevel: 57,
    cubeRecipe: "2x Ohm + 1x 鑽石 -> 1x Lo"
  },
  {
    number: 28,
    name: "羅",
    nameEn: "Lo",
    weaponEffect: "20% 機率造成致命打擊 (DS)",
    armorHelmEffect: "+5% 最大抗電",
    shieldEffect: "+5% 最大抗電",
    requiredLevel: 59,
    cubeRecipe: "2x Lo + 1x 無瑕疵黃寶石 -> 1x Sur"
  },
  {
    number: 29,
    name: "蘇爾",
    nameEn: "Sur",
    weaponEffect: "擊中使目標目盲",
    armorHelmEffect: "提升法力上限 5%",
    shieldEffect: "+50 法力",
    requiredLevel: 61,
    cubeRecipe: "2x Sur + 1x 無瑕疵紫寶石 -> 1x Ber"
  },
  {
    number: 30,
    name: "貝",
    nameEn: "Ber",
    weaponEffect: "20% 機率造成壓碎打擊 (CB)",
    armorHelmEffect: "傷害減少 8% (DR)",
    shieldEffect: "傷害減少 8% (DR)",
    requiredLevel: 63,
    cubeRecipe: "2x Ber + 1x 無瑕疵藍寶石 -> 1x Jah"
  },
  {
    number: 31,
    name: "喬",
    nameEn: "Jah",
    weaponEffect: "忽略目標防禦",
    armorHelmEffect: "增加生命上限 5%",
    shieldEffect: "+50 生命",
    requiredLevel: 65,
    cubeRecipe: "2x Jah + 1x 無瑕疵紅寶石 -> 1x Cham"
  },
  {
    number: 32,
    name: "查姆",
    nameEn: "Cham",
    weaponEffect: "冰凍目標 +3",
    armorHelmEffect: "無法被凍結 (CBF)",
    shieldEffect: "無法被凍結 (CBF)",
    requiredLevel: 67,
    cubeRecipe: "2x Cham + 1x 無瑕疵綠寶石 -> 1x Zod"
  },
  {
    number: 33,
    name: "薩德",
    nameEn: "Zod",
    weaponEffect: "無法破壞 (Indestructible)",
    armorHelmEffect: "無法破壞 (Indestructible)",
    shieldEffect: "無法破壞 (Indestructible)",
    requiredLevel: 69,
    cubeRecipe: "頂級神符，不可再向上合成"
  }
];
