// ⚠ 已停用（2026-10-21）：百科頁的 src/data/bases.ts 現在由遊戲資料表（src/data/game/*.json）即時產生，
// 本腳本會用舊的爬取資料覆寫這些模組，等於把第二份資料重新帶回來。要更新資料請改跑 `npm run data:build`，
// 舊 id／標籤／備註等人工維護內容在 src/data/codex/overlay.json。說明見 scripts/data-pipeline/README.md。
console.error('此腳本已停用：src/data/bases.ts 由遊戲資料表產生，請改用 npm run data:build（說明見 scripts/data-pipeline/README.md）。');
process.exit(1);

import fs from 'fs';

// Tactical notes and metadata from old curated bases
const TACTICAL_METADATA = {
  "berserker_axe": {
    itemType: "單手斧",
    qualityTier: "精華",
    speedGrade: "中等 [0]",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["悔恨 (Grief)", "野獸 (Beast)", "死亡呼吸 (BotD)", "末日 (Doom)"],
    larzukSockets: 6,
    dropRecommendation: "地獄牛關、TC87 場景 (世界之石要塞、古代通道)",
    tacticalNotes: "【單手武器傷害天花板】狂戰士之斧具備近戰單手武器中最長攻擊距離 (Range 3) 與極限基礎平均傷害，是野蠻人與近戰物理職業製作「悔恨」與「野獸」的終極畢業底材。"
  },
  "phase_blade": {
    itemType: "單手劍",
    qualityTier: "精華",
    speedGrade: "極快 [-30]",
    attackSpeedModifier: -30,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["悔恨 (Grief)", "最後希望 (Last Wish)", "熱情 (Passion)", "執法者 (Lawbringer)"],
    larzukSockets: 6,
    dropRecommendation: "惡夢 Act 5 後期至地獄全圖皆有掉落，拉蘇克打孔固定 6 孔。",
    tacticalNotes: "【自帶無法破壞 + 極速攻速】永遠不需要修理！基礎攻速高達 -30，攻速極快。製作「悔恨 (Grief +400純傷)」的首選神級底材，盾擊騎打崔斯特姆紅門六王無敵保證。"
  },
  "colossus_blade": {
    itemType: "雙手劍 (野蠻人可單手)",
    qualityTier: "精華",
    speedGrade: "快速 [5]",
    attackSpeedModifier: 5,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["死亡呼吸 (BotD)", "死亡 (Death)"],
    larzukSockets: 6,
    dropRecommendation: "地獄高難度場景，若掉落「無形自帶15%ED」為天價神物！",
    tacticalNotes: "雙手劍中攻速最協調的平衡之王。做無形死亡呼吸 (BotD 6S) 面板攻擊力突破天際，自帶 60% IAS 旋風斬輕鬆觸發極速。"
  },
  "thresher": {
    itemType: "長柄武器",
    qualityTier: "精華",
    speedGrade: "極快 [-10]",
    attackSpeedModifier: -10,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["無限 (Infinity)", "眼光 (Insight)", "遵從 (Obedience)"],
    larzukSockets: 5,
    dropRecommendation: "地獄難度全場景、牛關。無形 4 孔是天梯最硬通貨。",
    tacticalNotes: "【傭兵無限/眼光首選速度底材】攻速達 -10，極速戳擊能夠最頻繁地觸發壓碎打擊 (CB) 與偷血，傭兵站樁生存能力的保證。"
  },
  "giant_thresher": {
    itemType: "長柄武器",
    qualityTier: "精華",
    speedGrade: "極快 [-10]",
    attackSpeedModifier: -10,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["無限 (Infinity)", "眼光 (Insight)"],
    larzukSockets: 6,
    dropRecommendation: "極其稀有！地獄高階 85 場景掉落無形自帶孔數價值連城。",
    tacticalNotes: "【長柄武器皇冠明珠】兼具銳利之斧的 -10 極速與大長柄的更高傷害下限，綜合 DPS 與吸血穩定度第一。"
  },
  "mancatcher": {
    itemType: "長矛 (2.4可做符文語)",
    qualityTier: "精華",
    speedGrade: "極快 [-20]",
    attackSpeedModifier: -20,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["無限 (Infinity)"],
    larzukSockets: 5,
    dropRecommendation: "地獄 TC87 場景，方塊打孔賭 4 孔。",
    tacticalNotes: "【2.4 改版無限長矛新霸主】捕人叉以高達 -20 的極速攻速成為刺擊頻率最高的無限底材，快速觸發 40% CB 削血。"
  },
  "grand_matron_bow": {
    itemType: "亞馬遜專用弓",
    qualityTier: "精華",
    speedGrade: "慢 [10]",
    attackSpeedModifier: 10,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["信心 (Faith)", "冰凍 (Ice)", "狂暴之怒 (Wrath)"],
    larzukSockets: 5,
    dropRecommendation: "地獄牛關、世界之石要塞，必須自帶 +3 弓與十字弓技能！",
    tacticalNotes: "【物理弓馬終極信仰】自帶 +3 弓技能且基礎面板傷害上限極高。做 4 孔「信心 (Faith 狂熱靈氣)」後，搭配合適攻速裝備可打出最暴力的多重箭與掃射群殺傷害。"
  },
  "matriarchal_bow": {
    itemType: "亞馬遜專用弓",
    qualityTier: "精華",
    speedGrade: "快 [-10]",
    attackSpeedModifier: -10,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["信心 (Faith)", "冰凍 (Ice)"],
    larzukSockets: 5,
    dropRecommendation: "地獄難度高階地圖，必須自帶 +3 技能。",
    tacticalNotes: "【極速檔位弓馬最愛】基礎攻速為 -10，極其容易湊齊 7 幀極限攻速檔位，配裝靈活性遠超大院長之弓，元素弓馬或無極品裝備支撐時的最佳實用底材。"
  },
  "mage_plate": {
    itemType: "輕型鎧甲",
    qualityTier: "進階",
    speedGrade: "無移速懲罰 [輕甲]",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["謎團 (Enigma)", "背信 (Treachery)", "和平 (Peace)"],
    larzukSockets: 3,
    dropRecommendation: "惡夢 Act 5 至地獄全場景皆有掉落，拉蘇克必出 3 孔！",
    tacticalNotes: "【全遊戲人氣第一謎團底材】力量需求僅僅 55 點！這意味著任何法師、聖騎士或死靈法師穿上一雙戰旅或帶點力量護身符，就能做到完全「0力量投入」穿起謎團，將所有屬性點全部灌入體力！"
  },
  "archon_plate": {
    itemType: "輕型鎧甲",
    qualityTier: "精華",
    speedGrade: "無移速懲罰 [輕甲]",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["剛毅 (Fortitude)", "榮耀之鏈 (Chains of Honor / CoH)", "謎團 (Enigma)"],
    larzukSockets: 4,
    dropRecommendation: "地獄高階 85 場景、牛關、巴爾前五隊。",
    tacticalNotes: "【菁英輕甲防禦天花板】輕甲中防禦力最高的王者，且完全不降低跑步速度與耐力消耗。4 孔做剛毅 (Fortitude 300% 增傷 / 200% 防禦加成) 是自穿物理系與土豪傭兵的最愛。"
  },
  "dusk_shroud": {
    itemType: "輕型鎧甲",
    qualityTier: "精華",
    speedGrade: "無移速懲罰 [輕甲]",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["謎團 (Enigma)", "榮耀之鏈 (CoH)", "剛毅 (Fortitude)"],
    larzukSockets: 4,
    dropRecommendation: "地獄難度全場景。",
    tacticalNotes: "力量需求僅 77 點，兼顧精華級防禦與低力量門檻，外觀在亞馬遜與刺客身上極為貼身性感。"
  },
  "sacred_armor": {
    itemType: "重型鎧甲",
    qualityTier: "精華",
    speedGrade: "中甲/重甲懲罰",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["剛毅 (Fortitude)", "石塊 (Stone)", "幽魂 (Gloom)"],
    larzukSockets: 4,
    dropRecommendation: "地獄 TC87 頂級場景掉落無形，拉蘇克必出 4 孔！",
    tacticalNotes: "【Act 2 傭兵極限防禦神話】無形基礎防禦高達 900+，做成剛毅後觸發寒冰甲，傭兵個人防禦力可飆破 25,000 以上！怪物砍傭兵全成MISS，極致硬漢。"
  },
  "monarch": {
    itemType: "輕型盾牌",
    qualityTier: "精華",
    speedGrade: "無跑速懲罰",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["精神 (Spirit)", "鳳凰 (Phoenix)"],
    larzukSockets: 4,
    dropRecommendation: "地獄難度全場景 (地獄崔斯特姆、地獄泰摩高地起即可掉落)，拉蘇克必出 4 孔！",
    tacticalNotes: "【全職業通用 4 孔最低力量盾】非聖騎士職業想要裝備 4 孔盾牌 (特別是精神盾 +2技能 / 35 FCR)，統治者大盾是力量需求最低的唯一選擇 (156 力量)。法師、死靈、風德必備。"
  },
  "sacred_targe": {
    itemType: "聖騎士專用盾",
    qualityTier: "精華",
    speedGrade: "基礎格擋率 60% (全盾牌最高！)",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: false,
    recommendedRunewords: ["精神 (Spirit)", "流亡 (Exile - 需無形)", "鳳凰 (Phoenix)"],
    larzukSockets: 4,
    dropRecommendation: "地獄牛關、混沌避難所，必須自帶 +40~45 全抗！",
    tacticalNotes: "【聖騎士畢業盾牌皇冠明珠】擁有全遊戲最高的 60% 原生基礎格擋率與最低的 86 點力量需求！開聖盾後只需極少敏捷即可達到 75% 滿格擋。若自帶 45 全抗做精神盾，四抗直接全滿！"
  },
  "vortex_shield": {
    itemType: "聖騎士專用盾",
    qualityTier: "精華",
    speedGrade: "重擊傷害極限",
    attackSpeedModifier: 0,
    isSuperiorValued: true,
    isEthPreferred: true,
    recommendedRunewords: ["流亡 (Exile)"],
    larzukSockets: 4,
    dropRecommendation: "地獄高階場景方塊打孔，或拉蘇克打孔。",
    tacticalNotes: "【盾擊騎流亡終極夢想】基礎防禦高達 500+，做成「流亡 (Exile 自帶自動修復耐久)」後配合反抗靈氣與聖盾，防禦破萬，盾擊重擊傷害上限最高，紅門六王站著嚕。"
  }
};

// Read current generated bases
const rawContent = fs.readFileSync('src/data/bases.ts', 'utf-8');
const match = rawContent.match(/export const BASE_ITEMS_DATA: BaseEquipmentData\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error('Cannot parse BASE_ITEMS_DATA');
  process.exit(1);
}

const bases = JSON.parse(match[1]);

// Enrich each base item
const enriched = bases.map(b => {
  const extra = TACTICAL_METADATA[b.id] || {};
  const qualityTierMap = { 'normal': '一般', 'exceptional': '進階', 'elite': '菁英' };
  const qTier = extra.qualityTier || qualityTierMap[b.grade] || '一般';

  return {
    id: b.id,
    name: b.name,
    nameEn: b.nameEn,
    nameClassic: b.nameClassic,
    category: b.category,
    itemType: extra.itemType || (b.category === 'armor' ? '鎧甲防具' : b.category === 'shield' ? '盾牌' : b.category === 'helm' ? '頭盔' : '武器鑲材'),
    grade: b.grade,
    qualityTier: qTier,
    maxSockets: b.maxSockets,
    requiredLevel: b.requiredLevel,
    reqStr: b.requiredStr,
    reqDex: b.requiredDex,
    requiredStr: b.requiredStr,
    requiredDex: b.requiredDex,
    baseDamage: b.damage1h || b.damage2h || extra.baseDamage,
    baseDefense: b.defense || extra.baseDefense,
    defense: b.defense,
    damage1h: b.damage1h,
    damage2h: b.damage2h,
    speedGrade: extra.speedGrade || '-',
    attackSpeedModifier: extra.attackSpeedModifier ?? 0,
    larzukSockets: extra.larzukSockets || b.maxSockets,
    recommendedRunewords: extra.recommendedRunewords || [],
    tacticalNotes: extra.tacticalNotes,
    dropRecommendation: extra.dropRecommendation,
    isSuperiorValued: extra.isSuperiorValued ?? false,
    isEthPreferred: extra.isEthPreferred ?? false,
    imageUrl: b.imageUrl
  };
});

const tsContent = `export interface BaseItemData {
  id: string;
  name: string;
  nameEn: string;
  nameClassic?: string;
  category: string;
  itemType?: string;
  grade?: string;
  qualityTier?: string;
  maxSockets: number;
  requiredLevel: number;
  reqStr: number;
  reqDex: number;
  requiredStr?: number;
  requiredDex?: number;
  baseDamage?: string;
  baseDefense?: string;
  defense?: string;
  damage1h?: string;
  damage2h?: string;
  speedGrade?: string;
  attackSpeedModifier?: number;
  larzukSockets?: number;
  recommendedRunewords?: string[];
  tacticalNotes?: string;
  dropRecommendation?: string;
  isSuperiorValued?: boolean;
  isEthPreferred?: boolean;
  imageUrl?: string;
}

export type BaseEquipmentData = BaseItemData;

export const BASE_ITEMS_DATA: BaseItemData[] = ${JSON.stringify(enriched, null, 2)};
`;

fs.writeFileSync('src/data/bases.ts', tsContent, 'utf-8');
console.log(`Saved enhanced src/data/bases.ts with ${enriched.length} items!`);
