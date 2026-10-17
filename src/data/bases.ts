/**
 * 暗黑破壞神 II：獄火重生 (D2R) 核心頂級底材資料庫
 * 收錄武器、防具、盾牌各主流符文之語畢業底材、孔數、需求與戰術分析
 */

export interface BaseItemData {
  id: string;
  name: string;
  nameEn: string;
  category: "單手武器" | "雙手武器" | "防具鎧甲" | "盾牌" | "頭盔";
  itemType: string;
  qualityTier: "精華" | "進階" | "普通";
  maxSockets: number;
  reqStr: number;
  reqDex: number;
  baseDefense?: string;
  baseDamage?: string;
  attackSpeedModifier: number; // WSM (數值越低越快)
  speedGrade: string;
  isSuperiorValued: boolean; // 超強 15%ED 是否極具身價
  isEthPreferred: boolean; // 是否強烈推薦無形 (Ethereal)
  recommendedRunewords: string[];
  larzukSockets: number; // 地獄難度拉蘇克打孔固定孔數
  dropRecommendation: string;
  tacticalNotes: string;
}

export const BASE_ITEMS_DATA: BaseItemData[] = [
  // ── 武器底材 ──
  {
    id: "phase_blade",
    name: "幻化之刃",
    nameEn: "Phase Blade",
    category: "單手武器",
    itemType: "劍類",
    qualityTier: "精華",
    maxSockets: 6,
    reqStr: 25,
    reqDex: 136,
    baseDamage: "31 - 35",
    attackSpeedModifier: -30,
    speedGrade: "極快 [-30]",
    isSuperiorValued: true,
    isEthPreferred: false, // 幻化之刃無天然無形掉落 (除非水晶劍升級)
    recommendedRunewords: ["悔恨 (Grief)", "最後希望 (Last Wish)", "執法者 (Lawbringer)", "新月 (Crescent Moon)", "沉默 (Silence)"],
    larzukSockets: 6,
    dropRecommendation: "地獄難度全場景 (TC75+)。牛關、崔凡克、混沌避難所掉率極高。",
    tacticalNotes: "【單手物理王者底材】天生具備「無法破壞」特性，攻速基礎值為全劍類最快的 -30。做悔恨 (Grief 5孔) 的第一首選，完全不需要修理費用，盾擊騎與狂熱騎士的核心神兵！"
  },
  {
    id: "berserker_axe",
    name: "狂戰士斧",
    nameEn: "Berserker Axe",
    category: "單手武器",
    itemType: "斧類",
    qualityTier: "精華",
    maxSockets: 6,
    reqStr: 138,
    reqDex: 59,
    baseDamage: "24 - 71 (均傷 47.5)",
    attackSpeedModifier: 0,
    speedGrade: "普通 [0]",
    isSuperiorValued: true,
    isEthPreferred: true, // 做死神或死亡呼吸需無形
    recommendedRunewords: ["悔恨 (Grief)", "野獸 (Beast)", "死神 (Death)", "死亡呼吸 (BOTD)", "末日 (Doom)"],
    larzukSockets: 6,
    dropRecommendation: "地獄 85 級場景 (泰摩高地地穴、古代通道、混沌避難所)。",
    tacticalNotes: "【極限單手傷害天花板】武器攻擊距離高達 3 (比幻化之刃遠 1)，PVP 與純物理狂亂/旋風蠻人的畢業選擇。無形 5 孔做死神 (Death 自帶無法破壞 + 50% CB)，傷害突破天際。"
  },
  {
    id: "colossus_blade",
    name: "巨神之刃",
    nameEn: "Colossus Blade",
    category: "雙手武器",
    itemType: "劍類",
    qualityTier: "精華",
    maxSockets: 6,
    reqStr: 189,
    reqDex: 110,
    baseDamage: "單手 58-115 / 雙手 61-121",
    attackSpeedModifier: 5,
    speedGrade: "一般 [5]",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["死亡呼吸 (Breath of the Dying)", "最後希望 (Last Wish)", "寂靜 (Silence)"],
    larzukSockets: 6,
    dropRecommendation: "地獄高階場景 (TC87)。",
    tacticalNotes: "【雙持旋風蠻人浪漫】野蠻人可單手雙持巨神之刃。無形 6 孔做死亡呼吸 (BOTD)，配合高達 400% ED 與 30 全屬性，雙刀旋風橫掃千軍。"
  },
  {
    id: "colossus_sword",
    name: "巨神之劍",
    nameEn: "Colossus Sword",
    category: "雙手武器",
    itemType: "劍類",
    qualityTier: "精華",
    maxSockets: 5,
    reqStr: 182,
    reqDex: 95,
    baseDamage: "單手 61-121 / 雙手 67-145",
    attackSpeedModifier: 10,
    speedGrade: "慢 [10]",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["死神 (Death)", "誓約 (Oath)"],
    larzukSockets: 5,
    dropRecommendation: "地獄高階場景，拉蘇克打孔固定必出 5 孔！",
    tacticalNotes: "【無形死神最佳保底】巨神之劍最大孔數恰好為 5 孔！只要撿到天然無形白板巨神之劍，送去拉蘇克 100% 必出 5 孔，直接做成無形死神 (Death) 神裝。"
  },
  {
    id: "crystal_sword",
    name: "水晶劍",
    nameEn: "Crystal Sword",
    category: "單手武器",
    itemType: "劍類",
    qualityTier: "普通",
    maxSockets: 6,
    reqStr: 43,
    reqDex: 0,
    baseDamage: "5 - 15",
    attackSpeedModifier: 0,
    speedGrade: "普通 [0]",
    isSuperiorValued: false,
    isEthPreferred: false,
    recommendedRunewords: ["精神 (Spirit)", "戰爭召喚 (Call to Arms / CTA)", "王者的慈悲 (King's Grace)"],
    larzukSockets: 4, // 惡夢/普通牛關掉落拉蘇克出 4 孔
    dropRecommendation: "普通難度秘密母牛關卡掉落的水晶劍，拉蘇克打孔必出 4 孔！",
    tacticalNotes: "【法系拓荒至尊基石】普通牛關掉落的水晶劍物品等級正好在 26-40 之間，拉蘇克必出 4 孔，直接做成「精神劍」保送地獄；後期也是副手 CTA (5孔) 的外觀首選。"
  },
  {
    id: "flail",
    name: "連枷",
    nameEn: "Flail",
    category: "單手武器",
    itemType: "錘棒",
    qualityTier: "普通",
    maxSockets: 5,
    reqStr: 41,
    reqDex: 35,
    baseDamage: "1 - 24",
    attackSpeedModifier: -10,
    speedGrade: "快 [-10]",
    isSuperiorValued: false,
    isEthPreferred: false,
    recommendedRunewords: ["橡樹之心 (Heart of the Oak / HOTO)", "戰爭召喚 (CTA)", "黑色 (Black)"],
    larzukSockets: 5,
    dropRecommendation: "普通/惡夢難度，或地獄難度白板打孔。",
    tacticalNotes: "【全法系畢業主手底材】4 孔連枷做「橡樹之心 (+3技能 / 40 FCR / 40全抗)」力量需求僅 41，幾乎全職業免點力量即可裝備；3 孔連枷可做「黑色」提供 40% CB 早期殺 Boss。"
  },
  {
    id: "eth_thresher",
    name: "無形銳利之斧",
    nameEn: "Ethereal Thresher",
    category: "雙手武器",
    itemType: "長柄武器",
    qualityTier: "精華",
    maxSockets: 5,
    reqStr: 142, // 無形力需減少 10
    reqDex: 108,
    baseDamage: "18 - 211 (無形 27 - 316)",
    attackSpeedModifier: -10,
    speedGrade: "快 [-10]",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["無限 (Infinity)", "眼光 (Insight)", "遵從 (Obedience)"],
    larzukSockets: 5,
    dropRecommendation: "地獄牛關、混沌避難所赫拉迪姆方塊打孔 (1-5 孔隨機賭 4 孔)。",
    tacticalNotes: "【Act 2 傭兵畢業身價最高神兵】基礎攻速 -10 為長柄武器中最快，極容易搭配安達利爾頭盔達到極限攻速檔位 (IAS)，高速觸發壓碎打擊與吸血。無形 4 孔天價交易物！"
  },
  {
    id: "eth_colossus_voulge",
    name: "無形巨神之斧",
    nameEn: "Ethereal Colossus Voulge (CV)",
    category: "雙手武器",
    itemType: "長柄武器",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 200, // 無形需 200 力量
    reqDex: 45,
    baseDamage: "25 - 247 (無形 37 - 370)",
    attackSpeedModifier: 10,
    speedGrade: "慢 [10]",
    isSuperiorValued: false,
    isEthPreferred: true,
    recommendedRunewords: ["眼光 (Insight)", "無限 (Infinity)"],
    larzukSockets: 4, // 必出 4 孔！
    dropRecommendation: "地獄難度全場景，只要掉落無形直接送拉蘇克必出 4 孔！",
    tacticalNotes: "【平民傭兵最快畢業底材】最大孔數固定為 4 孔，拉蘇克絕不翻車！唯一缺點是力量需求高達 200，傭兵需搭配安達利爾頭盔 (+30力量) 或督瑞爾的殼才能提前拿上。"
  },
  {
    id: "eth_mancatcher",
    name: "無形捕人叉",
    nameEn: "Ethereal Mancatcher",
    category: "雙手武器",
    itemType: "長矛類",
    qualityTier: "精華",
    maxSockets: 5,
    reqStr: 122,
    reqDex: 124,
    baseDamage: "63 - 138 (無形)",
    attackSpeedModifier: -20,
    speedGrade: "極快 [-20]",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["無限 (Infinity)"],
    larzukSockets: 5,
    dropRecommendation: "地獄 TC87 場景，方塊打孔賭 4 孔。",
    tacticalNotes: "【2.4 改版無限長矛新霸主】2.4 開放長矛製作無限後，捕人叉以高達 -20 的極速攻速成為刺擊頻率最高的無限底材，快速觸發 40% CB 削血。"
  },
  {
    id: "grand_matron_bow",
    name: "大院長之弓 (+3技能)",
    nameEn: "Grand Matron Bow (GMB)",
    category: "雙手武器",
    itemType: "亞馬遜專用弓",
    qualityTier: "精華",
    maxSockets: 5,
    reqStr: 108,
    reqDex: 152,
    baseDamage: "14 - 72",
    attackSpeedModifier: 10,
    speedGrade: "慢 [10]",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["信心 (Faith)", "冰凍 (Ice)", "狂暴之怒 (Wrath)"],
    larzukSockets: 5,
    dropRecommendation: "地獄牛關、世界之石要塞，必須自帶 +3 弓與十字弓技能！",
    tacticalNotes: "【物理弓馬終極信仰】自帶 +3 弓技能且基礎面板傷害上限極高。做 4 孔「信心 (Faith 狂熱靈氣)」後，搭配合適攻速裝備可打出最暴力的多重箭與掃射群殺傷害。"
  },
  {
    id: "matriarchal_bow",
    name: "女長矛手之弓 (+3技能)",
    nameEn: "Matriarchal Bow (MB)",
    category: "雙手武器",
    itemType: "亞馬遜專用弓",
    qualityTier: "精華",
    maxSockets: 5,
    reqStr: 87,
    reqDex: 187,
    baseDamage: "20 - 47",
    attackSpeedModifier: -10,
    speedGrade: "快 [-10]",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["信心 (Faith)", "冰凍 (Ice)"],
    larzukSockets: 5,
    dropRecommendation: "地獄難度高階地圖，必須自帶 +3 技能。",
    tacticalNotes: "【極速檔位弓馬最愛】基礎攻速為 -10，極其容易湊齊 7 幀極限攻速檔位，配裝靈活性遠超大院長之弓，元素弓馬或無極品裝備支撐時的最佳實用底材。"
  },

  // ── 鎧甲防具底材 ──
  {
    id: "mage_plate",
    name: "法師鎧甲 (MP)",
    nameEn: "Mage Plate",
    category: "防具鎧甲",
    itemType: "輕型鎧甲",
    qualityTier: "進階",
    maxSockets: 3,
    reqStr: 55,
    reqDex: 0,
    baseDefense: "225 - 261 (超強可達 301)",
    attackSpeedModifier: 0,
    speedGrade: "無移速懲罰 [輕甲]",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["謎團 (Enigma)", "背信 (Treachery)", "和平 (Peace)"],
    larzukSockets: 3,
    dropRecommendation: "惡夢 Act 5 至地獄全場景皆有掉落，拉蘇克必出 3 孔！",
    tacticalNotes: "【全遊戲人氣第一謎團底材】力量需求僅僅 55 點！這意味著任何法師、聖騎士或死靈法師穿上一雙戰旅或帶點力量護身符，就能做到完全「0力量投入」穿起謎團，將所有屬性點全部灌入體力！"
  },
  {
    id: "archon_plate",
    name: "執政官鎧甲 (AP)",
    nameEn: "Archon Plate",
    category: "防具鎧甲",
    itemType: "輕型鎧甲",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 103,
    reqDex: 0,
    baseDefense: "410 - 524 (超強 15%ED 可達 603)",
    attackSpeedModifier: 0,
    speedGrade: "無移速懲罰 [輕甲]",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["剛毅 (Fortitude)", "榮耀之鏈 (Chains of Honor / CoH)", "謎團 (Enigma)"],
    larzukSockets: 4,
    dropRecommendation: "地獄高階 85 場景、牛關、巴爾前五隊。",
    tacticalNotes: "【精英輕甲防禦天花板】輕甲中防禦力最高的王者，且完全不降低跑步速度與耐力消耗。4 孔做剛毅 (Fortitude 300% 增傷 / 200% 防禦加成) 是自穿物理系與土豪傭兵的最愛。"
  },
  {
    id: "dusk_shroud",
    name: "暮光偽裝 (DS)",
    nameEn: "Dusk Shroud",
    category: "防具鎧甲",
    itemType: "輕型鎧甲",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 77,
    reqDex: 0,
    baseDefense: "361 - 467",
    attackSpeedModifier: 0,
    speedGrade: "無移速懲罰 [輕甲]",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["謎團 (Enigma)", "榮耀之鏈 (CoH)", "剛毅 (Fortitude)"],
    larzukSockets: 4,
    dropRecommendation: "地獄難度全場景。",
    tacticalNotes: "力量需求僅 77 點，兼顧精華級防禦與低力量門檻，外觀在亞馬遜與刺客身上極為貼身性感。"
  },
  {
    id: "eth_sacred_armor",
    name: "無形神聖鎧甲 (SA)",
    nameEn: "Ethereal Sacred Armor",
    category: "防具鎧甲",
    itemType: "重型鎧甲",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 222, // 無形力需
    reqDex: 0,
    baseDefense: "729 - 900+ (無形神聖打孔防禦破 900)",
    attackSpeedModifier: 0,
    speedGrade: "中甲/重甲懲罰",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["剛毅 (Fortitude)", "石塊 (Stone)", "幽魂 (Gloom)"],
    larzukSockets: 4,
    dropRecommendation: "地獄 TC87 頂級場景掉落無形，拉蘇克必出 4 孔！",
    tacticalNotes: "【Act 2 傭兵極限防禦神話】無形基礎防禦高達 900+，做成剛毅後觸發寒冰甲，傭兵個人防禦力可飆破 25,000 以上！怪物砍傭兵全成MISS，極致硬漢。"
  },

  // ── 盾牌底材 ──
  {
    id: "monarch",
    name: "統治者大盾 (統盾)",
    nameEn: "Monarch",
    category: "盾牌",
    itemType: "輕型盾牌",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 156,
    reqDex: 0,
    baseDefense: "133 - 148",
    attackSpeedModifier: 0,
    speedGrade: "無跑速懲罰",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["精神 (Spirit)", "鳳凰 (Phoenix)"],
    larzukSockets: 4,
    dropRecommendation: "地獄難度全場景 (地獄崔斯特姆、地獄泰摩高地起即可掉落)，拉蘇克必出 4 孔！",
    tacticalNotes: "【全職業通用 4 孔最低力量盾】非聖騎士職業想要裝備 4 孔盾牌 (特別是精神盾 +2技能 / 35 FCR)，統治者大盾是力量需求最低的唯一選擇 (156 力量)。法師、死靈、風德必備。"
  },
  {
    id: "sacred_targe",
    name: "神聖小盾 (+45全抗 / ST)",
    nameEn: "Sacred Targe",
    category: "盾牌",
    itemType: "聖騎士專用盾",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 86,
    reqDex: 0,
    baseDefense: "126 - 158",
    attackSpeedModifier: 0,
    speedGrade: "基礎格擋率 60% (全盾牌最高！)",
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["精神 (Spirit)", "流亡 (Exile - 需無形)", "鳳凰 (Phoenix)"],
    larzukSockets: 4,
    dropRecommendation: "地獄牛關、混沌避難所，必須自帶 +40~45 全抗！",
    tacticalNotes: "【聖騎士畢業盾牌皇冠明珠】擁有全遊戲最高的 60% 原生基礎格擋率與最低的 86 點力量需求！開聖盾後只需極少敏捷即可達到 75% 滿格擋。若自帶 45 全抗做精神盾，四抗直接全滿！"
  },
  {
    id: "eth_vortex_shield",
    name: "無形旋風盾 (+45全抗 / 無形流亡)",
    nameEn: "Ethereal Vortex Shield",
    category: "盾牌",
    itemType: "聖騎士專用盾",
    qualityTier: "精華",
    maxSockets: 4,
    reqStr: 138,
    reqDex: 0,
    baseDefense: "337 - 505 (無形)",
    attackSpeedModifier: 0,
    speedGrade: "重擊傷害極限",
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["流亡 (Exile)"],
    larzukSockets: 4,
    dropRecommendation: "地獄高階場景方塊打孔，或拉蘇克打孔。",
    tacticalNotes: "【盾擊騎流亡終極夢想】基礎防禦高達 500+，做成「流亡 (Exile 自帶自動修復耐久)」後配合反抗靈氣與聖盾，防禦破萬，盾擊重擊傷害上限最高，紅門六王站著嚕。"
  }
];
