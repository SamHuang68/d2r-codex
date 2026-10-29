/**
 * 暗黑破壞神 II：獄火重生 (D2R) 道具、消耗品、寶石、鑰匙與精華全典藏資料庫
 */

export interface GemData {
  id: string;
  name: string;
  nameEn: string;
  type: 'amethyst' | 'topaz' | 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'skull';
  quality: 'chipped' | 'flawed' | 'standard' | 'flawless' | 'perfect';
  qualityName: string;
  requiredLevel: number;
  weaponEffect: string;
  weaponEffectEn?: string;
  armorHelmEffect: string;
  armorHelmEffectEn?: string;
  shieldEffect: string;
  shieldEffectEn?: string;
  cubeRecipe: string;
  craftingUses: string[];
  craftingUsesEn?: string[];
}

export interface UberKeyOrganData {
  id: string;
  name: string;
  nameEn: string;
  type: 'key' | 'organ' | 'trophy';
  dropSource: string;
  dropRate: string;
  location: string;
  act: number;
  description: string;
  usageFormula: string;
  tacticalTips: string;
}

export interface EssenceData {
  id: string;
  name: string;
  nameEn: string;
  bossSource: string;
  act: number;
  location: string;
  dropChance: string;
  colorHex: string;
  description: string;
}

export interface CombatPotionData {
  id: string;
  name: string;
  nameEn: string;
  category: 'potion' | 'elixir' | 'tome' | 'quest_item';
  effect: string;
  hiddenMechanic?: string;
  recipe?: string;
  description: string;
  proTips: string;
}

export interface CharmJewelMeta {
  id: string;
  name: string;
  nameEn: string;
  slot: 'small_charm' | 'large_charm' | 'grand_charm' | 'jewel';
  rarity: 'unique' | 'magic';
  keyAttributes: string[];
  dropSource: string;
  tradeValueTier: 'S+' | 'S' | 'A' | 'B';
  guide: string;
}

// ── 1. 寶石系統 (Gems) ──
export const GEMS_DATA: GemData[] = [
  // 完美紫寶石
  {
    id: "gem_perfect_amethyst",
    name: "完美紫寶石",
    nameEn: "Perfect Amethyst",
    type: "amethyst",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "+150 攻擊準確率 (AR)",
    armorHelmEffect: "+10 力量 (Strength)",
    shieldEffect: "+30 防禦力",
    weaponEffectEn: "+150 Attack Rating (AR)",
    armorHelmEffectEn: "+10 Strength",
    shieldEffectEn: "+30 Defense",
    cubeRecipe: "3顆 無瑕紫寶石 (Flawless Amethyst) 於赫拉迪姆方塊合成",
    craftingUses: [
      "【最熱門手工飾品】橙色施法護身符必備材料 (魔法護身符 + 完美紫寶石 + 8# 拉爾 + 珠寶)",
      "打孔配方：白裝武器隨機打孔 (普通武器 + 8# 拉爾 + 11# 安姆 + 完美紫寶石)",
      "洗大板：3顆任意完美寶石 + 任意特大咒符重置屬性"
    ],
    craftingUsesEn: [
      "【Top Caster Craft】Essential for Caster Amulets (Magic Amulet + P-Amethyst + Ral #8 + Jewel)",
      "Socketing Recipe: Normal weapon sockets (Normal Weapon + Ral #8 + Amn #11 + P-Amethyst)",
      "Reroll Grand Charms: 3 Perfect Gems + any Grand Charm to reroll affixes"
    ]
  },
  // 完美黃寶石
  {
    id: "gem_perfect_topaz",
    name: "完美黃寶石",
    nameEn: "Perfect Topaz",
    type: "topaz",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "增加 1-40 閃電傷害",
    armorHelmEffect: "+24% 更佳的機會取得魔法裝備 (MF / 打寶率)",
    shieldEffect: "+40% 閃電抗性 (Lightning Resist)",
    weaponEffectEn: "Adds 1-40 Lightning Damage",
    armorHelmEffectEn: "+24% Better Chance of Getting Magic Items (MF)",
    shieldEffectEn: "+40% Lightning Resistance",
    cubeRecipe: "3顆 無瑕黃寶石 (Flawless Topaz) 於赫拉迪姆方塊合成",
    craftingUses: [
      "【平民打寶神器】拓荒期頭盔與衣服鑲嵌首選！4孔衣服鑲滿直接獲得 +96% MF",
      "打孔配方：防具衣服隨機打孔 (普通衣服 + 7# 塔爾 + 10# 書爾 + 完美黃寶石)",
      "盾牌鑲嵌：提供高達 40% 閃電抗性，拓荒保命必備"
    ],
    craftingUsesEn: [
      "【Budget MF Standard】Helm & Body Armor budget MF sockets! 4-socket armor gives +96% MF",
      "Socketing Recipe: Normal body armor sockets (Normal Armor + Tal #7 + Thul #10 + P-Topaz)",
      "Shield Socket: Provides +40% Lightning Resistance for budget survivability"
    ]
  },
  // 完美紅寶石
  {
    id: "gem_perfect_ruby",
    name: "完美紅寶石",
    nameEn: "Perfect Ruby",
    type: "ruby",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "增加 15-20 火焰傷害",
    armorHelmEffect: "+38 生命值 (Life)",
    shieldEffect: "+40% 火焰抗性 (Fire Resist)",
    weaponEffectEn: "Adds 15-20 Fire Damage",
    armorHelmEffectEn: "+38 Life",
    shieldEffectEn: "+40% Fire Resistance",
    cubeRecipe: "3顆 無瑕紅寶石 (Flawless Ruby) 於赫拉迪姆方塊合成",
    craftingUses: [
      "【嗜血工藝核心】橙色吸血戒指/手套材料 (魔法戒指 + 完美紅寶石 + 12# 索爾 + 珠寶)",
      "打孔配方：盾牌隨機打孔 (普通盾牌 + 7# 塔爾 + 11# 安姆 + 完美紅寶石)",
      "生存配方：頭盔衣服提供實打實 +38 點純生命加成"
    ],
    craftingUsesEn: [
      "【Blood Craft Core】Blood Rings & Gloves crafting (Magic Ring + P-Ruby + Sol #12 + Jewel)",
      "Socketing Recipe: Normal shield sockets (Normal Shield + Tal #7 + Amn #11 + P-Ruby)",
      "Survivability: Helm/Armor gives +38 raw Life pool boost"
    ]
  },
  // 完美藍寶石
  {
    id: "gem_perfect_sapphire",
    name: "完美藍寶石",
    nameEn: "Perfect Sapphire",
    type: "sapphire",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "增加 10-14 冰寒傷害 (凍結 3 秒)",
    armorHelmEffect: "+38 法力值 (Mana)",
    shieldEffect: "+40% 冰寒抗性 (Cold Resist)",
    weaponEffectEn: "Adds 10-14 Cold Damage (Freezes 3 sec)",
    armorHelmEffectEn: "+38 Mana",
    shieldEffectEn: "+40% Cold Resistance",
    cubeRecipe: "3顆 無瑕藍寶石 (Flawless Sapphire) 於赫拉迪姆方塊合成",
    craftingUses: [
      "打孔配方：頭盔隨機打孔 (普通頭盔 + 8# 拉爾 + 10# 書爾 + 完美藍寶石)",
      "法力擴充：法師前期法力匱乏時鑲嵌於頭盔，提供 +38 巨額法力",
      "抗寒防凍：盾牌鑲嵌提供 +40% 冰寒抗性"
    ],
    craftingUsesEn: [
      "Socketing Recipe: Normal helm sockets (Normal Helm + Ral #8 + Thul #10 + P-Sapphire)",
      "Early Mana Pool: Socket into helms for +38 Mana during leveling",
      "Cold Resists: Shield socket provides +40% Cold Resistance"
    ]
  },
  // 完美綠寶石
  {
    id: "gem_perfect_emerald",
    name: "完美綠寶石",
    nameEn: "Perfect Emerald",
    type: "emerald",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "+100 毒素傷害 (持續 7 秒)",
    armorHelmEffect: "+10 敏捷 (Dexterity)",
    shieldEffect: "+40% 毒素抗性 (Poison Resist)",
    weaponEffectEn: "+100 Poison Damage over 7 seconds",
    armorHelmEffectEn: "+10 Dexterity",
    shieldEffectEn: "+40% Poison Resistance",
    cubeRecipe: "3顆 無瑕綠寶石 (Flawless Emerald) 於赫拉迪姆方塊合成",
    craftingUses: [
      "敏捷配點：鑲嵌防具提供 +10 敏捷，用於湊齊格擋率或裝備敏捷需求",
      "升級配方：卓越暗金武器升級為精英武器 (17# 盧姆 + 21# 普爾 + 完美綠寶石)",
      "毒傷鋪墊：前期武器多孔鑲嵌多顆綠寶石，毒素傷害疊加秒殺小怪"
    ],
    craftingUsesEn: [
      "Dexterity Stacking: Sockets give +10 Dex to hit max block or gear requirements",
      "Upgrade Recipe: Normal Exceptional Unique weapon to Elite (Lum #17 + Pul #21 + P-Emerald)",
      "Early Poison: Multi-socket early weapons stack poison damage to melt mobs"
    ]
  },
  // 完美鑽石
  {
    id: "gem_perfect_diamond",
    name: "完美鑽石",
    nameEn: "Perfect Diamond",
    type: "diamond",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "+68% 對不死生物的傷害",
    armorHelmEffect: "+100 攻擊準確率 (AR)",
    shieldEffect: "+19 全抗性 (All Resistances)",
    weaponEffectEn: "+68% Damage to Undead",
    armorHelmEffectEn: "+100 Attack Rating (AR)",
    shieldEffectEn: "+19 All Resistances",
    cubeRecipe: "3顆 無瑕鑽石 (Flawless Diamond) 於赫拉迪姆方塊合成",
    craftingUses: [
      "【拓荒第一神盾】3孔白盾或聖騎士專用盾鑲 3 顆完美鑽石，瞬間提供 +57% 全抗性！",
      "升級配方：卓越暗金防具升級為精英防具 (18# 科 + 20# 藍姆 + 完美鑽石)",
      "對抗地獄抗性懲罰：地獄難度全抗直接 -100%，完鑽盾牌是平民法師拓荒保命首選"
    ],
    craftingUsesEn: [
      "【Budget God-Shield】3-socket shield with 3 P-Diamonds grants an instant +57% All Resistances!",
      "Upgrade Recipe: Exceptional Unique armor to Elite (Ko #18 + Lem #20 + P-Diamond)",
      "Overcoming Hell Penalty: Counter -100% Hell all res with a triple-diamond shield"
    ]
  },
  // 完美骷髏石
  {
    id: "gem_perfect_skull",
    name: "完美骷髏石",
    nameEn: "Perfect Skull",
    type: "skull",
    quality: "perfect",
    qualityName: "完美 (Perfect)",
    requiredLevel: 18,
    weaponEffect: "偷取 4% 生命 (LL) 與 3% 法力 (LM)",
    armorHelmEffect: "回復生命 +5，法力恢復速度 +19%",
    shieldEffect: "反彈 20 點傷害給近戰攻擊者",
    weaponEffectEn: "4% Life Stolen per hit (LL) & 3% Mana Stolen (LM)",
    armorHelmEffectEn: "Replenish Life +5, Increase Mana Regeneration 19%",
    shieldEffectEn: "Attacker Takes Damage of 20",
    cubeRecipe: "3顆 無瑕骷髏石 (Flawless Skull) 於赫拉迪姆方塊合成",
    craftingUses: [
      "【黃裝洗裝神器】6顆 完美骷髏石 + 1件 黃金稀有裝備 (Rare Item) = 重新隨機生成一件低階（物品等級 40）黃裝！（要高階需改用 1 顆完美骷髏石 + 稀有裝備 + 喬丹之石）",
      "打孔配方：3顆 完美骷髏石 + 1顆 喬丹之石 + 1件 沒有孔的稀有（黃）裝備 = 為該裝備增添 1 孔",
      "雙吸兼顧：鑲嵌於近戰武器提供物理雙吸 (4% LL + 3% LM)"
    ],
    craftingUsesEn: [
      "【Rare Item Rerolls】6 Perfect Skulls + 1 Rare Item = Reroll into a low-level (ilvl 40) rare item!",
      "Add Socket: 3 Perfect Skulls + 1 SOJ + 1 Rare item = Add 1 socket to the item",
      "Dual Leech: Sockets in melee weapons provide physical dual leech (4% LL + 3% LM)"
    ]
  }
];

// ── 2. 超級崔斯特姆紅門鑰匙與六王器官 (Keys & Organs) ──
export const UBER_KEYS_ORGANS_DATA: UberKeyOrganData[] = [
  {
    id: "key_of_terror",
    name: "恐懼之鑰",
    nameEn: "Key of Terror",
    type: "key",
    dropSource: "女伯爵 (The Countess)",
    dropRate: "約 1 / 14 (7.1%)",
    location: "第一章：黑色荒地 - 遺忘之塔第 5 層",
    act: 1,
    description: "通體燃燒著猩紅恐懼氣息的生鏽符文鑰匙，是打開超級崔斯特姆傳送門的三把鑰匙之一。",
    usageFormula: "在地獄難度第五章城鎮將【恐懼 + 憎恨 + 毀滅】各 1 把放入方塊合成，隨機開啟【魔母巢穴 / 遺忘沙漠 / 苦痛熔爐】紅門之一！",
    tacticalTips: "女伯爵自帶火冰雙免疫，電法或標馬速刷最為輕鬆；刷鑰匙時女伯爵同時也是中階符文 (最高至 28# 羅) 的最佳出處。"
  },
  {
    id: "key_of_hate",
    name: "憎恨之鑰",
    nameEn: "Key of Hate",
    type: "key",
    dropSource: "召喚師 (The Summoner)",
    dropRate: "約 1 / 11 (8.9%)",
    location: "第二章：魯高因 - 秘法聖殿盡頭",
    act: 2,
    description: "滴落著綠色憎恨黏液的扭曲鑰匙，凝聚著赫拉森幻象的詛咒。",
    usageFormula: "與恐懼之鑰、毀滅之鑰一同於方塊中轉化，需注意在同一遊戲中開啟三個小紅門，以防開啟重複地圖！",
    tacticalTips: "秘法聖殿有 4 條路徑，機率各為 25%。沿途有大量幽靈怪，幽靈死在太空中不會掉落物品，引到平臺擊殺掉落符文機率極高。"
  },
  {
    id: "key_of_destruction",
    name: "毀滅之鑰",
    nameEn: "Key of Destruction",
    type: "key",
    dropSource: "尼拉塞克 (Nihlathak)",
    dropRate: "約 1 / 12 (8.1%)",
    location: "第五章：哈洛加斯 - 沃特之廳 (安亞紅門)",
    act: 5,
    description: "散發著黑紫色毀滅波動的狂暴鑰匙，蘊含著毀滅之王巴爾的賜福印記。",
    usageFormula: "開啟三個小紅門總共需要 9 把鑰匙 (3 組 3+3+3)。",
    tacticalTips: "【極度危險】尼拉塞克擁有極高階的「屍爆 (CE)」技能，周圍小怪死後屍爆可瞬間秒殺 3000 生命的血牛！應對方式：裝備「自然祥和」戒指 (使敵人安息無法屍爆)，或死靈法師搶先炸屍體/超度屍體。"
  },
  {
    id: "mephistos_brain",
    name: "墨菲斯托之腦",
    nameEn: "Mephisto's Brain",
    type: "organ",
    dropSource: "莉莉絲 (Lilith / 超級安達莉爾)",
    dropRate: "100% 必定掉落",
    location: "小紅門：魔母巢穴 (Matron's Den)",
    act: 5,
    description: "散發著刺鼻惡臭與高壓電能的魔神大腦組織，跳動著無盡的憎恨邪念。",
    usageFormula: "在第五章哈洛加斯將【墨菲斯托之腦 + 巴爾之眼 + 迪亞布羅之角】一同放入方塊合成，永久開啟【終極超級崔斯特姆紅門】！",
    tacticalTips: "魔母巢穴地圖巨大，充斥女妖與狂暴女槍手。莉莉絲物理攻擊極為恐怖，毒素傷害瞬間扣血見底，務必常駐「偷取生命 (Life Tap)」並喝解毒藥水提升抗性上限。"
  },
  {
    id: "baals_eye",
    name: "巴爾之眼",
    nameEn: "Baal's Eye",
    type: "organ",
    dropSource: "超級都瑞爾 (Uber Duriel)",
    dropRate: "100% 必定掉落",
    location: "小紅門：遺忘沙漠 (Forgotten Sands)",
    act: 5,
    description: "巨大且充血的毀滅之眼，能看穿一切凡人的恐懼與絕望。",
    usageFormula: "終極六王紅門合成材料之一。",
    tacticalTips: "超級都瑞爾自帶高等級「神聖冰凍 (Holy Freeze)」，任何無法被凍結裝備皆無法免疫其減速！但其攻擊以單體物理為主，盾擊聖騎士配合吸血詛咒可輕鬆貼身擊殺。"
  },
  {
    id: "diablos_horn",
    name: "迪亞布羅之角",
    nameEn: "Diablo's Horn",
    type: "organ",
    dropSource: "超級伊卒爾 (Uber Izual)",
    dropRate: "100% 必定掉落",
    location: "小紅門：苦痛熔爐 (Furnace of Pain)",
    act: 5,
    description: "粗壯且焦黑的恐懼巨角，曾生長於恐懼之王迪亞布羅的額頭。",
    usageFormula: "終極六王紅門合成材料之一。",
    tacticalTips: "場景周圍有大量女妖 (施展詛咒降低防禦與傷害) 與深淵騎士。伊卒爾血量極厚，但傷害威脅相對最小，清理周圍小怪後單挑即可穩操勝券。"
  },
  {
    id: "standard_of_heroes",
    name: "英雄旗幟",
    nameEn: "Standard of Heroes",
    type: "trophy",
    dropSource: "超級崔斯特姆終極三魔神",
    dropRate: "每位在場玩家必定各獲得 1 枚",
    location: "超級崔斯特姆 (Uber Tristram)",
    act: 5,
    description: "純金鑄造的榮譽勳章，象徵著擊破地獄三大魔神聯軍的凡人英雄證明 (需求等級 90)。",
    usageFormula: "作為 D2R 終極成就徽飾，在收藏家眼中極具紀念價值。",
    tacticalTips: "放在背包中展示身份的傳奇道具，隨地獄火炬一同掉落在崔斯特姆的焦土之上。"
  }
];

// ── 3. 四大精華與赦免徽章 (Essences & Token of Absolution) ──
export const ESSENCES_DATA: EssenceData[] = [
  {
    id: "essence_suffering",
    name: "扭曲的苦怨精華",
    nameEn: "Twisted Essence of Suffering",
    bossSource: "安達莉爾 (Andariel) / 都瑞爾 (Duriel)",
    act: 1,
    location: "第一章：地下墓穴第四層 / 第二章：塔拉夏的古墓",
    dropChance: "約 1 / 14 (地獄難度)",
    colorHex: "#3b82f6", // 藍色
    description: "由受苦靈魂與劇毒凝縮而成的湛藍結晶，散發著痛苦的哀鳴。"
  },
  {
    id: "essence_hatred",
    name: "充盈的憎恨精華",
    nameEn: "Charged Essence of Hatred",
    bossSource: "墨菲斯托 (Mephisto)",
    act: 3,
    location: "第三章：憎恨囚牢第三層",
    dropChance: "約 1 / 14 (地獄難度)",
    colorHex: "#eab308", // 黃色
    description: "充滿高壓憎恨雷光的金黃結晶，任何接觸者都會陷入復仇的瘋狂。"
  },
  {
    id: "essence_terror",
    name: "燃燒的恐懼精華",
    nameEn: "Burning Essence of Terror",
    bossSource: "迪亞布羅 (Diablo)",
    act: 4,
    location: "第四章：混沌魔殿 (Chaos Sanctuary)",
    dropChance: "約 1 / 14 (地獄難度)",
    colorHex: "#ef4444", // 紅色
    description: "燃燒著地獄烈火的赤紅結晶，象徵著不可名狀的永恆恐懼。"
  },
  {
    id: "essence_destruction",
    name: "潰爛的毀滅精華",
    nameEn: "Festering Essence of Destruction",
    bossSource: "巴爾 (Baal)",
    act: 5,
    location: "第五章：世界之石大殿 (Worldstone Chamber)",
    dropChance: "約 1 / 14 (地獄難度)",
    colorHex: "#10b981", // 綠色
    description: "由世界之石碎片與毀滅腐化凝結的翠綠結晶，具有重塑因果的神力。"
  }
];

// ── 4. 戰鬥藥劑、卷軸與功能道具 (Combat Potions & Utilities) ──
export const COMBAT_POTIONS_DATA: CombatPotionData[] = [
  {
    id: "full_rejuv_potion",
    name: "全效活力藥水 (大紫水)",
    nameEn: "Full Rejuvenation Potion",
    category: "potion",
    effect: "瞬間 100% 補滿生命值 (Life) 與法力值 (Mana)",
    hiddenMechanic: "零延遲瞬發！無視任何吸血懲罰與減療狀態，危急時刻挽救生命的絕對神水。",
    recipe: "3瓶 小紫水 ➔ 1瓶 大紫水；或 3瓶 生命藥水 + 3瓶 法力藥水 + 1顆 標準寶石（非碎裂寶石）於方塊合成",
    description: "全暗黑破壞神二代最珍貴的戰鬥藥劑，高難度專家級 (HC) 模式下活命的終極底牌。",
    proTips: "腰帶快捷鍵 1~4 必留至少一整排大紫水，應對電鬼齊射與娃娃死後自爆。"
  },
  {
    id: "antidote_potion",
    name: "解毒藥水 (隱藏抗毒黑科技)",
    nameEn: "Antidote Potion",
    category: "potion",
    effect: "立即解除劇毒狀態；並在 30 秒內賦予【+50% 毒素抗性】與【+10% 最大毒素抗性】！",
    hiddenMechanic: "【時效可無上限疊加！】連喝 5 瓶即可獲得長達 150 秒的 +50 毒抗與 85% 毒抗上限！",
    recipe: "各大城鎮阿卡拉、卓格南、奧瑪斯處花費 30 金幣隨意購買",
    description: "打安達莉爾 (Andariel) 或地獄女妖時的神級廉價藥劑，喝滿 6 瓶直接讓安姐的毒霧形同刮痧。",
    proTips: "進安達莉爾房前連喝 6 瓶，傭兵也灌 6 瓶，抗毒直接飆升至 85% 滿額，拓荒無傷平推！"
  },
  {
    id: "thawing_potion",
    name: "融冰藥水 (隱藏抗寒黑科技)",
    nameEn: "Thawing Potion",
    category: "potion",
    effect: "立即解除冰凍狀態；並在 30 秒內賦予【+50% 冰寒抗性】與【+10% 最大冰寒抗性】！",
    hiddenMechanic: "【時效同樣可無限疊加！】連喝 6 瓶獲得 180 秒的 +50 冰抗與 85% 冰抗上限！",
    recipe: "各城鎮藥水商人處 30 金幣無限購買",
    description: "第二章古墓決戰「都瑞爾 (Duriel)」時的致勝關鍵道具！",
    proTips: "進都瑞爾蟲洞前自己喝 6 瓶，給米山傭兵灌 6 瓶，神聖冰凍傷害暴降 80%，站樁狂砍。"
  },
  {
    id: "stamina_potion",
    name: "精力藥水",
    nameEn: "Stamina Potion",
    category: "potion",
    effect: "立即回滿體力，並在 30 秒內跑步完全不消耗任何體力耐力值。",
    hiddenMechanic: "時效同樣可疊加，連喝 10 瓶可享受 5 分鐘無限奔馳跑圖。",
    recipe: "城鎮商人購買 (20 金幣)",
    description: "普通難度 Act 1 ~ Act 2 新建角色體力條極短，精力藥水是跑速狂飆必備。",
    proTips: "出營地前連灌 5 瓶，前期無需在跑步與走路間停頓切換。"
  },
  {
    id: "tome_of_town_portal",
    name: "城鎮傳送之書 (TP 書)",
    nameEn: "Tome of Town Portal",
    category: "tome",
    effect: "可容納最多 20 張城鎮傳送卷軸，右鍵點擊立即開啟返回當前幕營地的鮮藍傳送門。",
    hiddenMechanic: "通關後在第一章營地放入方塊中，與「維特的腿」一同合成即可永久開啟【秘密乳牛關】！",
    recipe: "城鎮商人處購買空的傳送書，並裝填 20 張傳送卷軸",
    description: "所有冒險者背包內永不離身的核心道具。",
    proTips: "隨時保持滿 20 張卷軸狀態；進入未知危險地圖先手開門防猝死翻車。"
  },
  {
    id: "token_of_absolution",
    name: "赦免徽章 (洗點洗屬性神器)",
    nameEn: "Token of Absolution",
    category: "quest_item",
    effect: "右鍵使用後，立即將當前角色的【全部技能點數】與【全部屬性點數】完整歸還重置！",
    hiddenMechanic: "使用次數無上限！只要有足夠的四大精華，隨時可以隨意切換轉型流派。",
    recipe: "方塊合成：扭曲的苦怨精華 + 充盈的憎恨精華 + 燃燒的恐懼精華 + 潰爛的毀滅精華",
    description: "D2R 天梯中後期最硬通貨之一，讓玩家自由在純冰、火法、電法或盾牌重擊、狂熱間切換。",
    proTips: "換流派或收穫謎團/無限等關鍵神裝後，使用赦免徽章精確配點，力量只要點到剛好穿裝即可。"
  }
];

// ── 5. 神級咒符與暗金珠寶 (Charms & Jewels Codex) ──
export const CHARMS_JEWELS_DATA: CharmJewelMeta[] = [
  {
    id: "sunder_cold",
    name: "冰寒裂縫 (破冰咒符)",
    nameEn: "Cold Rupture",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的冰寒免疫抗性直接被強制壓制為 95%",
      "自身的冰寒抗性降低 -(70-90)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (Terror Zones / TZ) 精英與暗金精英怪物",
    tradeValueTier: "S+",
    guide: "冰法女王必備！搭配冰寒專精 (Cold Mastery) 的被動減抗，瞬間讓所有地獄冰免怪物脆如薄紙。"
  },
  {
    id: "sunder_lightning",
    name: "天堂裂擊 (破電咒符)",
    nameEn: "Crack of the Heavens",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的閃電免疫抗性直接被強制壓制為 95%",
      "自身的閃電抗性降低 -(70-90)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (TZ)",
    tradeValueTier: "S+",
    guide: "電法、標馬與陷阱刺客的最強質變神器！搭配獅鷲之眼與傭兵無限靈氣，全螢幕電系彈幕秒天秒地。"
  },
  {
    id: "sunder_fire",
    name: "火焰裂隙 (破火咒符)",
    nameEn: "Flame Rift",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的火焰免疫抗性強制壓制為 95%",
      "自身的火焰抗性降低 -(70-90)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (TZ)",
    tradeValueTier: "S",
    guide: "讓火法、火德與火陷阱刺客走出自閉！徹底破除第四章混沌魔殿全場火免騎士的防線。"
  },
  {
    id: "sunder_poison",
    name: "腐敗裂痕 (破毒咒符)",
    nameEn: "Rotting Fissure",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的毒素免疫抗性強制壓制為 95%",
      "自身的毒素抗性降低 -(70-90)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (TZ)",
    tradeValueTier: "A",
    guide: "毒死靈 (劇毒新星) 與狂犬病德魯伊專屬神器，配合死亡之網與塔格奧三件套降抗效果爆炸。"
  },
  {
    id: "sunder_physical",
    name: "分筋裂骨 (破物咒符)",
    nameEn: "Bone Break",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的物理免疫 (PI) 抗性強制壓制為 95%",
      "自身受到的物理傷害增加 +(10-20)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (TZ)",
    tradeValueTier: "A",
    guide: "旋風野蠻人、弓馬與狂熱騎必備，不用依靠衰老或傷害加深即可平砍破物免幽靈怪。"
  },
  {
    id: "sunder_magic",
    name: "漆黑裂口 (破魔咒符)",
    nameEn: "Black Cleft",
    slot: "grand_charm",
    rarity: "unique",
    keyAttributes: [
      "怪物的魔法免疫抗性強制壓制為 95%",
      "自身的魔法抗性降低 -(45-65)%"
    ],
    dropSource: "地獄難度邪惡威脅區域 (TZ)",
    tradeValueTier: "B",
    guide: "專屬祝福之鎚聖騎士 (Hammerdin) 或骨系死靈，破除巴爾第二波木乃伊的原生魔免。"
  },
  {
    id: "rainbow_facet",
    name: "彩虹刻面 (暗金珠寶)",
    nameEn: "Rainbow Facet",
    slot: "jewel",
    rarity: "unique",
    keyAttributes: [
      "+(3-5)% 元素技能傷害 (冰/火/電/毒)",
      "-(3-5)% 敵人對應元素抗性",
      "死後 (Die) 或升級時 (Level-Up) 施展 100% 機率的元素技能 (死亡：連鎖閃電 47 級／暴風雪 37 級／隕石術 31 級／毒素新星 51 級；升級：新星 41 級／霜之新星 43 級／烈焰 29 級／劇毒 23 級)"
    ],
    dropSource: "地獄難度高階場景暗金怪與 Boss",
    tradeValueTier: "S+",
    guide: "終極畢業鑲嵌物！死刻 (Die 觸發) 價值高於升級刻面，5/5 電珠寶為全遊戲最高身價珠寶之一。"
  },
  {
    id: "skill_grand_charms",
    name: "8大職業頂級技能特大咒符 (技能板)",
    nameEn: "Skill Grand Charms",
    slot: "grand_charm",
    rarity: "magic",
    keyAttributes: [
      "+1 特定單一技能樹 (例如：+1 閃電技能 / +1 聖騎士戰鬥技能 / +1 毒素與骸骨技能)",
      "極品後綴：+45 生命 (45 Life，僅 91 級以上怪物/巴爾/迪亞布羅/尼拉塞克掉落之大板能洗出)"
    ],
    dropSource: "地獄難度怪物，使用 3 顆完美寶石重置洗板",
    tradeValueTier: "S+",
    guide: "背包填滿 7-8 塊技能板是任何職業技能面板傷害飆升的絕對關鍵！價值最高者為電板、聖騎戰鬥板與毒骨板。"
  }
];
