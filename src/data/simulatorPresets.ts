import type { DollSlot } from '../components/simulator/v2/types';
import type { SkillSpec } from '../engine/skillPlan';

/**
 * 流派範本：每個職業的主流技能流派，各有「入門」與「頂裝」兩個檔位。
 * 物品以遊戲資料中的英文名稱對應目錄，載入時逐項解析，找不到會明確回報。
 * 範本僅為社群常見的物品組合示意：屬性由遊戲資料計算，未逐件與遊戲內比對，也不代表唯一解；
 * 魔法／稀有裝備與珠寶的隨機詞綴尚未支援，因此沒有放進範本。
 * 技能點由主力技能與遊戲技能表的協同關係自動分配（見 engine/skillPlan.ts）；配點採規則（滿足裝備需求 → 格擋目標 → 其餘投入指定屬性）。
 */
export interface PresetItem {
  nameEn: string;
  /** 符文之語更換底材（英文名稱） */
  baseNameEn?: string;
  /** 鑲嵌物英文名稱（寶石／符文），依序填入 */
  sockets?: string[];
  ethereal?: boolean;
  /** 白裝底材的孔數 */
  socketCount?: number;
}

export type PresetTier = 'start' | 'bis' | 'mfEff' | 'mfMax' | 'tankEff' | 'tankMax';
export const PRESET_TIER_ZH: Record<PresetTier, string> = { start: '入門', bis: '頂裝', mfEff: '效率 MF', mfMax: '極致 MF', tankEff: '平衡減傷', tankMax: '極致減傷' };
/** 流派裡明確寫出的兩檔；MF 兩檔由 deriveMf 依規則推導 */
export type CoreTier = 'start' | 'bis';

type ClassCode = 'ama' | 'sor' | 'nec' | 'pal' | 'bar' | 'dru' | 'ass' | 'war';
type Items = Partial<Record<DollSlot, PresetItem>>;

export interface SimPreset {
  id: string;
  name: string;
  classCode: ClassCode;
  level: number;
  items: Items;
  charms: PresetItem[];
  blockTarget?: number;
  rest?: 'str' | 'dex' | 'vit' | 'ene';
  notes: string;
  /** 所屬流派（同流派的入門與頂裝檔共用） */
  build: string;
  buildName: string;
  tier: PresetTier;
  skill: SkillSpec;
}

interface Tier { level: number; items: Items; charms?: PresetItem[]; notes: string; /** 此檔位自己的格擋目標（優先於流派的設定） */ blockTarget?: number }

/** 一個流派：說明、技能規劃與兩個裝備檔位 */
export interface BuildDef {
  id: string;
  name: string;
  classCode: ClassCode;
  /** 一句話說明這個流派怎麼玩 */
  summary: string;
  skill: SkillSpec;
  rest?: 'str' | 'dex' | 'vit' | 'ene';
  blockTarget?: number;
  start: Tier;
  bis: Tier;
  /** 效率 MF：這些欄位保留頂裝的核心件，不換成 MF 件（例如傷害來源、+技能的專屬頭盔） */
  mfKeep?: DollSlot[];
  /** 極致 MF／極致減傷是否保留頂裝的武器與盾（技能綁定武器類型時用，例如弓、標槍、爪） */
  weaponBound?: boolean;
}

const n = (nameEn: string, baseNameEn?: string): PresetItem => (baseNameEn ? { nameEn, baseNameEn } : { nameEn });
const CTA: Items = { weaponII: n('Call to Arms'), shieldII: n('Spirit', 'Monarch') };
const CHARMS_BIS: PresetItem[] = [n('Annihilus'), n('Hellfire Torch'), n("Gheed's Fortune")];
const CHARMS_START: PresetItem[] = [n('Annihilus')];

// 施法職業共用件
const CASTER_BIS: Items = { neck: n("Mara's Kaleidoscope"), gloves: n('Magefist'), belt: n('Arachnid Mesh'), boots: n('Wartraveler'), ring1: n('The Stone of Jordan'), ring2: n('Raven Frost'), ...CTA };
const CASTER_START: Items = { neck: n("Mara's Kaleidoscope"), gloves: n('Frostburn'), belt: n('Arachnid Mesh'), boots: n('Wartraveler'), ring1: n('The Stone of Jordan'), ring2: n('Dwarf Star'), ...CTA };
// 物理近戰共用件
const MELEE_BIS: Items = { neck: n("Mara's Kaleidoscope"), gloves: n("Dracul's Grasp"), belt: n("Verdugo's Hearty Cord"), boots: n('Wartraveler'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Raven Frost'), ...CTA };
const MELEE_START: Items = { neck: n("Mara's Kaleidoscope"), gloves: n("Dracul's Grasp"), belt: n("Verdugo's Hearty Cord"), boots: n('Wartraveler'), ring1: n("Bul Katho's Wedding Band"), ring2: n('The Stone of Jordan'), ...CTA };

const SPIRIT_SET: Items = { weaponI: n('Spirit', 'Crystal Sword'), shieldI: n('Spirit', 'Monarch') };
const SHAKO_ENIGMA: Items = { head: n('Harlequin Crest'), body: n('Enigma', 'Dusk Shroud') };

export const BUILDS: BuildDef[] = [
  // ── 亞馬遜 ──
  {
    id: 'ama-lightning-fury', name: '閃電烈怒標槍', classCode: 'ama', rest: 'vit', weaponBound: true,
    summary: '擲出標槍後在命中點爆開閃電。主點閃電烈怒與標槍協同技能，靠裝備加技能與攻速。',
    skill: { main: 'Lightning Fury' },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Chains of Honor', 'Dusk Shroud'), weaponI: n('Thunderstroke'), shieldI: n('Spirit', 'Monarch') }, charms: CHARMS_START, notes: '標槍用雷霆之擊（Thunderstroke），頭盔與盔甲先用較平價的選擇。' },
    bis: { level: 92, items: { ...MELEE_BIS, ...SHAKO_ENIGMA, weaponI: n("Titan's Revenge"), shieldI: n('Spirit', 'Monarch') }, charms: CHARMS_BIS, notes: '標槍用泰坦的復仇，搭配謎團與軍帽。' },
  },
  {
    id: 'ama-strafe', name: '掃射弓亞馬遜', classCode: 'ama', rest: 'dex', mfKeep: ['body'], weaponBound: true,
    summary: '用弓連續掃射多個目標。依賴攻速與物理傷害，技能點集中在掃射與前置技能。',
    skill: { main: 'Strafe', extra: { 'Critical Strike': 1 }, fill: ['Critical Strike', 'Penetrate', 'Pierce', 'Valkyrie'] },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Chains of Honor', 'Dusk Shroud'), weaponI: n('Faith', 'Grand Matron Bow') }, charms: CHARMS_START, notes: '先以信心（Faith）符文之語弓起步。' },
    bis: { level: 92, items: { ...MELEE_BIS, head: n('Harlequin Crest'), body: n('Fortitude', 'Archon Plate'), weaponI: n('Windforce') }, charms: CHARMS_BIS, notes: '風之力（Windforce）搭配剛毅護甲。' },
  },
  // ── 魔法使 ──
  {
    id: 'sor-blizzard', name: '冰暴魔法使', classCode: 'sor', rest: 'vit',
    summary: '施放暴風雪，冰系範圍傷害。以冰寒專精與傳送術機動，需要冰抗穿透與快速施法。',
    skill: { main: 'Blizzard', extra: { Teleport: 1, 'Cold Mastery': 1 }, fill: ['Frozen Orb', 'Cold Mastery'] },
    start: { level: 80, items: { ...CASTER_START, head: n("Tal Rasha's Horadric Crest"), body: n('Skin of the Vipermagi'), ...SPIRIT_SET }, charms: CHARMS_START, notes: '精神劍盾與蛇魔法師之皮的平價配置。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, weaponI: n('Fathom'), shieldI: n('Spirit', 'Monarch') }, charms: CHARMS_BIS, notes: '常見的冰暴風雪配置：軍帽＋謎團＋死亡深度。副手欄為戰爭召喚（CTA）＋精神盾。' },
  },
  {
    id: 'sor-lightning', name: '閃電魔法使', classCode: 'sor', rest: 'vit', mfKeep: ['head'],
    summary: '連鎖閃電與閃電箭，雷系單體與連鎖傷害，閃電專精提高傷害。頂裝以無限降低敵人電抗。',
    skill: { main: 'Chain Lightning', extra: { Teleport: 1, 'Lightning Mastery': 20 } },
    start: { level: 80, items: { ...CASTER_START, head: n("Griffon's Eye"), body: n('Skin of the Vipermagi'), ...SPIRIT_SET }, charms: CHARMS_START, notes: '獅鷲之眼提高閃電傷害，先用精神劍盾。' },
    bis: { level: 94, items: { ...CASTER_BIS, head: n("Griffon's Eye"), body: n('Skin of the Vipermagi'), weaponI: n('Infinity', 'Thresher'), boots: n('Sandstorm Trek') }, charms: CHARMS_BIS, notes: '雙手長柄武器自持無限，不使用盾牌。' },
  },
  {
    id: 'sor-fire', name: '火焰魔法使', classCode: 'sor', rest: 'vit',
    summary: '隕石術與火球術，火系範圍傷害。靠火焰專精與火焰穿透。',
    skill: { main: 'Meteor', extra: { Teleport: 1, 'Fire Mastery': 1 }, fill: ['Fire Mastery'] },
    start: { level: 80, items: { ...CASTER_START, head: n("Tal Rasha's Horadric Crest"), body: n('Skin of the Vipermagi'), ...SPIRIT_SET }, charms: CHARMS_START, notes: '先用精神劍盾，之後換火焰專精裝備。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, ...SPIRIT_SET }, charms: CHARMS_BIS, notes: '軍帽與謎團；未放入火焰專屬裝備，可自行替換。' },
  },
  // ── 死靈法師 ──
  {
    id: 'nec-bone-spear', name: '骨矛死靈法師', classCode: 'nec', rest: 'vit',
    summary: '骨矛穿透多個目標，搭配剔骨之牙與骸骨之魂等協同技能；常配合削弱類詛咒。',
    skill: { main: 'Bone Spear', extra: { 'Bone Armor': 1 } },
    start: { level: 80, items: { ...CASTER_START, head: n("Tal Rasha's Horadric Crest"), body: n('Skin of the Vipermagi'), weaponI: n("Deaths's Web"), shieldI: n('Homunculus') }, charms: CHARMS_START, notes: '死亡之網是死靈法師常用的加技能法杖。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, weaponI: n("Deaths's Web"), shieldI: n('Homunculus') }, charms: CHARMS_BIS, notes: '軍帽、謎團與死亡之網。' },
  },
  {
    id: 'nec-summoner', name: '召喚死靈法師', classCode: 'nec', rest: 'vit',
    summary: '以骷髏戰士、骷髏法師與魔像為主，輸出來自召喚物。技能點集中在召喚與精通。',
    skill: { main: 'Raise Skeleton', extra: { 'Skeleton Mastery': 20, 'Raise Skeletal Mage': 20, 'Golem Mastery': 1 }, synergy: false, fill: ['Golem Mastery', 'Revive', 'Raise Skeleton'] },
    start: { level: 80, items: { ...CASTER_START, head: n("Tal Rasha's Horadric Crest"), body: n('Skin of the Vipermagi'), weaponI: n("Deaths's Web"), shieldI: n('Homunculus') }, charms: CHARMS_START, notes: '召喚物的傷害不在此模擬，僅顯示角色本體的生命、防禦與抗性。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, weaponI: n("Deaths's Web"), shieldI: n('Homunculus') }, charms: CHARMS_BIS, notes: '召喚物的傷害不在此模擬，僅顯示角色本體的生命、防禦與抗性。' },
  },
  // ── 聖騎士 ──
  {
    id: 'pal-hammerdin', name: '祝福之鎚聖騎士', classCode: 'pal', rest: 'vit', blockTarget: 75,
    summary: '祝福之鎚配合專注光環，魔法傷害不吃物理免疫。格擋目標 75%，其餘灌體能。',
    skill: { main: 'Blessed Hammer', extra: { Concentration: 20, Vigor: 20, 'Holy Shield': 20 } },
    start: { level: 85, items: { ...CASTER_START, head: n("Andariel's Visage"), body: n('Chains of Honor', 'Dusk Shroud'), weaponI: n('Heart of the Oak', 'Scourge'), shieldI: n('Herald of Zakarum') }, charms: CHARMS_START, notes: '格擋目標 75%：先滿足需求，再加敏捷到滿格擋，其餘全灌體能。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, weaponI: n('Heart of the Oak', 'Scourge'), shieldI: n('Herald of Zakarum') }, charms: CHARMS_BIS, notes: '格擋目標 75%：先滿足需求，再加敏捷到滿格擋，其餘全灌體能。' },
  },
  {
    id: 'pal-zealot', name: '狂熱聖騎士', classCode: 'pal', rest: 'vit', blockTarget: 75,
    summary: '熱忱打擊連擊多段攻擊，搭配狂熱光環。吃武器傷害與攻速，物理流派。',
    skill: { main: 'Zeal', extra: { Fanaticism: 20, Vigor: 1, 'Holy Shield': 20 }, fill: ['Vigor'] },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Chains of Honor', 'Dusk Shroud'), weaponI: n('Grief'), shieldI: n('Herald of Zakarum') }, charms: CHARMS_START, notes: '悔恨搭配聖騎士盾。' },
    bis: { level: 92, items: { ...MELEE_BIS, ...SHAKO_ENIGMA, weaponI: n('Grief'), shieldI: n('Herald of Zakarum') }, charms: CHARMS_BIS, notes: '悔恨、謎團、軍帽。' },
  },
  // ── 野蠻人 ──
  {
    id: 'bar-whirlwind', name: '旋風斬野蠻人', classCode: 'bar', rest: 'vit',
    summary: '旋風斬衝入敵群，物理傷害為主，靠武器與攻速。常見悔恨搭配剛毅。',
    skill: { main: 'Whirlwind', extra: { 'Iron Skin': 1, 'Natural Resistance': 1, 'Increased Speed': 1 }, fill: ['Blade Mastery', 'Iron Skin', 'Natural Resistance', 'Increased Speed', 'Shout', 'Battle Orders'] },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Fortitude', 'Archon Plate'), weaponI: n('Grief') }, charms: CHARMS_START, notes: '悔恨起手，副手欄空出，可自行放第二把武器。' },
    bis: { level: 90, items: { ...MELEE_BIS, ...SHAKO_ENIGMA, belt: n("Nosferatu's Coil"), weaponI: n('Grief'), shieldI: n('Spirit', 'Monarch') }, charms: CHARMS_BIS, notes: '示意配置，數值僅反映裝備屬性與等級。' },
  },
  {
    id: 'bar-frenzy', name: '狂暴野蠻人', classCode: 'bar', rest: 'vit',
    summary: '雙持武器的狂亂連擊，攻擊越快越強；主手與副手各放一把武器。',
    skill: { main: 'Frenzy', extra: { 'Iron Skin': 1, 'Natural Resistance': 1, 'Increased Speed': 1 }, fill: ['Blade Mastery', 'Iron Skin', 'Natural Resistance', 'Increased Speed', 'Shout', 'Battle Orders'] },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Fortitude', 'Archon Plate'), weaponI: n('Grief'), shieldI: n('Breath of the Dying') }, charms: CHARMS_START, notes: '主手與副手欄各放一把武器。' },
    bis: { level: 90, items: { ...MELEE_BIS, ...SHAKO_ENIGMA, weaponI: n('Grief'), shieldI: n('Breath of the Dying') }, charms: CHARMS_BIS, notes: '悔恨搭配死亡呼吸雙持。' },
  },
  // ── 德魯伊 ──
  {
    id: 'dru-tornado', name: '龍捲風德魯伊', classCode: 'dru', rest: 'vit', mfKeep: ['head'],
    summary: '龍捲風與颶風術，風系範圍傷害。需要抗性與生命，靠加技能的裝備。',
    skill: { main: 'Tornado', extra: { 'Cyclone Armor': 1, Hurricane: 1, 'Oak Sage': 1 }, fill: ['Oak Sage'] },
    start: { level: 80, items: { ...CASTER_START, head: n("Jalal's Mane"), body: n('Skin of the Vipermagi'), weaponI: n('Heart of the Oak', 'Archon Staff') }, charms: CHARMS_START, notes: '德魯伊頭飾加全技能，搭配雙手法杖版的橡樹之心，副手不放盾（雙手武器不能搭配盾牌）。' },
    bis: { level: 92, items: { ...CASTER_BIS, head: n("Jalal's Mane"), body: n('Enigma', 'Dusk Shroud'), weaponI: n('Heart of the Oak', 'Archon Staff') }, charms: CHARMS_BIS, notes: '加技能優先的施法配置；橡樹之心是雙手法杖，副手不放盾。' },
  },
  {
    id: 'dru-fire', name: '地裂火德魯伊', classCode: 'dru', rest: 'vit', mfKeep: ['head'],
    summary: '裂地之火與火山噴發，火系範圍傷害，靠火系的協同技能。',
    skill: { main: 'Eruption', extra: { 'Oak Sage': 1 }, fill: ['Armageddon', 'Molten Boulder'] },
    start: { level: 80, items: { ...CASTER_START, head: n("Jalal's Mane"), body: n('Skin of the Vipermagi'), weaponI: n('Heart of the Oak', 'Archon Staff') }, charms: CHARMS_START, notes: '先用加技能的施法裝備；橡樹之心是雙手法杖，副手不放盾。' },
    bis: { level: 92, items: { ...CASTER_BIS, head: n("Jalal's Mane"), body: n('Enigma', 'Dusk Shroud'), weaponI: n('Heart of the Oak', 'Archon Staff') }, charms: CHARMS_BIS, notes: '加技能優先的施法配置；橡樹之心是雙手法杖，副手不放盾。' },
  },
  // ── 刺客 ──
  {
    id: 'ass-lightning-trap', name: '閃電陷阱刺客', classCode: 'ass', rest: 'vit',
    summary: '放置雷光衛哨與死亡衛哨，陷阱自動攻擊。重視加技能與快速施放。',
    skill: { main: 'Lightning Sentry', extra: { 'Shadow Master': 1, Fade: 1 }, fill: ['Death Sentry'] },
    start: { level: 85, items: { ...CASTER_START, head: n("Andariel's Visage"), body: n('Skin of the Vipermagi'), ...SPIRIT_SET }, charms: CHARMS_START, notes: '先用精神劍盾。' },
    bis: { level: 92, items: { ...CASTER_BIS, ...SHAKO_ENIGMA, ...SPIRIT_SET }, charms: CHARMS_BIS, notes: '加技能優先；陷阱技能可再用「+陷阱技能」裝備提高。' },
  },
  {
    id: 'ass-mosaic', name: '嵌飾武學刺客', classCode: 'ass', rest: 'vit', weaponBound: true,
    summary: '用武學連擊疊出嵌飾效果，靠爪與武學技能連續出招。',
    skill: { main: 'Royal Strike', extra: { 'Claw Mastery': 20, Fade: 1 }, fill: ['Tiger Strike', 'Cobra Strike', 'Claws of Thunder', 'Blades of Ice', 'Fists of Fire', 'Dragon Claw'] },
    start: { level: 85, items: { ...MELEE_START, head: n("Andariel's Visage"), body: n('Chains of Honor', 'Dusk Shroud'), weaponI: n('Mosaic') }, charms: CHARMS_START, notes: '嵌飾為爪類符文之語。' },
    bis: { level: 92, items: { ...MELEE_BIS, ...SHAKO_ENIGMA, weaponI: n('Mosaic') }, charms: CHARMS_BIS, notes: '副手 I 欄未放置（雙持第二把爪需自行選擇）。' },
  },
];

// ── 頂裝的抗性修正 ──
// 原本的頂裝沒有針對地獄難度（−100 抗性）調整，多數流派最低抗性只有 0～40%。這份修正由 scripts/optimize_defense.mjs --resist 產生：
// 只動頭盔、護身符、護甲、手套、腰帶、戒指、鞋子，不動武器與盾；全技能／職業／技能樹／單項技能（含傳送術）加成與攻擊速度不能比原本低，
// 快速施法與快速打擊恢復的「影格數」不能比原本差（百分比可以降，只要停在同一個斷點，見 engine/breakpoints.ts）；目標是先推高最低抗性，再比有效生命。
// 結果只改了手套、腰帶、戒指、鞋子，部分流派（例如魔法使、刺客）仍達不到 75%：要補滿得動頭盔、護甲、武器或盾，那就不是原本的流派了。
const BIS_RESIST_FIX: Record<string, Items> = {
  'ama-lightning-fury': { gloves: n('Laying of Hands'), belt: n('Credendum'), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'ama-strafe': { neck: n("Saracen's Chance"), body: n('Chains of Honor', 'Dusk Shroud'), gloves: n('Bloodfist'), belt: n("Gheed's Wager"), ring2: n('Manald Heal'), boots: n('Waterwalk') },
  'sor-blizzard': { gloves: n('Bloodfist'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'sor-lightning': { head: n('Crown of Ages'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Manald Heal'), boots: n('Tearhaunch') },
  'sor-fire': { ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n("Aldur's Advance") },
  'nec-bone-spear': { gloves: n('Bloodfist'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'nec-summoner': { gloves: n('Bloodfist'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'pal-hammerdin': { ring1: n("Bul Katho's Wedding Band"), boots: n('Waterwalk') },
  'pal-zealot': { gloves: n("Horazon's Hold"), belt: n("Gheed's Wager"), boots: n('Tearhaunch') },
  'bar-whirlwind': { gloves: n('Laying of Hands'), belt: n('Credendum'), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'bar-frenzy': { gloves: n("Horazon's Hold"), belt: n("Gheed's Wager"), ring2: n('Opalvein'), boots: n('Tearhaunch') },
  'dru-tornado': { gloves: n('Bloodfist'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n('Waterwalk') },
  'dru-fire': { gloves: n('Bloodfist'), ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n('Waterwalk') },
  'ass-lightning-trap': { ring1: n("Bul Katho's Wedding Band"), ring2: n('Opalvein'), boots: n("Aldur's Advance") },
  'ass-mosaic': { gloves: n("Horazon's Hold"), belt: n("Gheed's Wager"), ring2: n('Opalvein'), boots: n('Tearhaunch') },
};
BUILDS.forEach((b) => {
  const fix = BIS_RESIST_FIX[b.id]; if (!fix) return;
  b.bis = { ...b.bis, items: { ...b.bis.items, ...fix }, notes: `${b.bis.notes} 已依地獄難度的抗性調整手套、腰帶、戒指、鞋子（技能加成、攻速、施法與受擊恢復影格不降）。` };
});

// ── 尋寶（MF）檔位 ──
// MF 數值來自遊戲資料（item_magicbonus，含依等級成長的部分），以 scripts/test_engine.mjs 逐一核對；
// 掉落受 MF 遞減（見 engine/magicFind.ts）。這裡只決定「換哪些欄位」：
//  - 效率：保留流派核心，只把頭、身、鞋、右戒指、咒符換成 MF 件，輸出幾乎不受影響
//  - 極致：全身換成 MF 最高的可取得裝備，主手改為「阿里巴巴之刃」、副手「聲韻（Rhyme）」，不顧輸出與生存
const MF_EFF: Items = { head: n('Harlequin Crest'), body: n('Enigma', 'Dusk Shroud'), boots: n('Wartraveler'), ring2: n('Nagelring') };
const MF_MAX: Items = {
  head: n('Harlequin Crest'), body: n("Skullder's Ire"), gloves: n('Chance Guards'), belt: n('Goldwrap'), boots: n('Wartraveler'),
  ring1: n('Nagelring'), ring2: n('Nagelring'), weaponI: n('Blade of Ali Baba'), shieldI: n('Rhyme', 'Monarch'),
};

function deriveMf(b: BuildDef, mode: 'mfEff' | 'mfMax'): Tier {
  const bis = b.bis;
  const items: Items = { ...bis.items };
  if (mode === 'mfEff') {
    (Object.keys(MF_EFF) as DollSlot[]).forEach((k) => { if (!b.mfKeep?.includes(k)) items[k] = MF_EFF[k]; });
    return { level: bis.level, items, charms: CHARMS_BIS, notes: `保留流派核心裝備${b.mfKeep?.length ? '（頭盔等核心欄位不換）' : ''}，把頭盔、護甲、鞋子、右戒指、咒符換成 MF 件。這是「兼顧擊殺速度」的折衷：輸出與施法／攻速斷點沒有模擬，實際清怪速度請自行評估。` };
  }
  (Object.keys(MF_MAX) as DollSlot[]).forEach((k) => { if (b.weaponBound && (k === 'weaponI' || k === 'shieldI')) return; items[k] = MF_MAX[k]; });
  return { level: 95, items, charms: CHARMS_BIS, notes: `全身換成 MF 最高的件，不顧輸出與生存${b.weaponBound ? '；此流派的技能綁定武器類型，主手與副手保留頂裝的設定' : ''}。護甲需要 97 力量，屬性點會被需求吃掉，生命會偏低。` };
}

// ── 減傷檔位 ──
// 平衡減傷：保留武器、盾、頭盔、護甲與施法／攻速來源，只換手套、腰帶、戒指、鞋子。每個流派的換法由 scripts/optimize_defense.mjs 依引擎數值搜尋（頂裝已先做過一次抗性修正，所以多數流派這一檔與頂裝相同）；
//   條件是全技能／本職業／技能樹／單項技能（含傳送術）加成、快速施法與攻擊速度都不低於頂裝，裝備需求要滿足；評分是「有效生命」（見 engine/survival.ts）。
// 極致減傷：全身換成生存力最高的組合（同一套搜尋的結果，各職業收斂到幾乎相同的件），不顧輸出與技能：
//   暴風之盾（35% 物理減免、格擋）＋長串之耳／維爾杜戈（15%）達到 50% 物理減免上限，咒符與全抗件把四項抗性推到上限，守護天使再把最大抗性提高。
const TANK_EFF: Record<string, Items> = {
  'ama-lightning-fury': { belt: n("Verdugo's Hearty Cord") },
  'pal-hammerdin': { ring2: n('Dwarf Star') },
  'pal-zealot': { ring2: n('Dwarf Star') },
  'bar-whirlwind': { belt: n("Verdugo's Hearty Cord") },
};
const TANK_MAX: Items = {
  head: n("Natalya's Totem"), neck: n("Saracen's Chance"), body: n('Guardian Angel'), gloves: n("Horazon's Hold"), belt: n("Verdugo's Hearty Cord"),
  ring1: n('Dwarf Star'), ring2: n('Dwarf Star'), boots: n('Waterwalk'), weaponI: n('Wizardspike'), shieldI: n('Stormshield'),
};
// 技能綁定武器的流派（弓、標槍、爪）：武器與盾保持不動，只在其餘欄位搜尋（scripts/optimize_defense.mjs --max）
const TANK_MAX_BOUND: Record<string, Items> = {
  'ama-lightning-fury': { head: n('Vampiregaze'), neck: n('Metalgrid'), body: n('Shaftstop'), ring1: n('Dwarf Star') },
  'ama-strafe': { neck: n("Mara's Kaleidoscope"), belt: n("Verdugo's Hearty Cord"), ring1: n('Dwarf Star'), ring2: n('Dwarf Star'), boots: n('Tearhaunch') },
  'ass-mosaic': { head: n("Kira's Guardian"), neck: n("Saracen's Chance"), body: n('Shaftstop'), belt: n("Verdugo's Hearty Cord"), ring1: n('Dwarf Star'), ring2: n('Dwarf Star') },
};
const CHARMS_TANK: PresetItem[] = [n('Annihilus'), n('Hellfire Torch')];

function deriveTank(b: BuildDef, mode: 'tankEff' | 'tankMax'): Tier {
  const bis = b.bis;
  if (mode === 'tankEff') {
    return { level: bis.level, items: { ...bis.items, ...(TANK_EFF[b.id] ?? {}) }, charms: bis.charms, notes: '保留武器、盾、頭盔、護甲與施法／攻速來源，只換手套、腰帶、戒指、鞋子；全技能、傳送術、快速施法、攻擊速度都不低於頂裝。換法由引擎數值搜尋得出，不是社群公認配裝。' };
  }
  if (b.weaponBound) {
    return { level: bis.level, items: { ...bis.items, ...(TANK_MAX_BOUND[b.id] ?? {}) }, charms: CHARMS_TANK, notes: '此流派的技能綁定武器類型，主手與副手保留頂裝的設定，其餘欄位換成生存力最高的組合（不顧技能加成）；沒有暴風之盾，物理減免達不到上限。' };
  }
  const items: Items = { ...bis.items, ...TANK_MAX };
  return { level: bis.level, items, charms: CHARMS_TANK, blockTarget: 75, notes: '全身換成生存力最高的組合，不顧輸出與技能；武器為單手的「巫師之刺」（全抗 +75），副手暴風之盾（35% 物理減免、格擋）。雙手武器不能搭配盾，所以此檔不用雙手武器。' };
}

export const tierOf = (b: BuildDef, t: PresetTier): Tier => (t === 'mfEff' || t === 'mfMax' ? deriveMf(b, t) : t === 'tankEff' || t === 'tankMax' ? deriveTank(b, t) : b[t]);
export const PRESET_TIERS: PresetTier[] = ['start', 'bis', 'mfEff', 'mfMax', 'tankEff', 'tankMax'];

export const SIM_PRESETS: SimPreset[] = BUILDS.flatMap((b) => PRESET_TIERS.map((t): SimPreset => {
  const x = tierOf(b, t);
  return { id: `${b.id}:${t}`, name: `${b.name}（${PRESET_TIER_ZH[t]}）`, classCode: b.classCode, level: x.level, items: x.items, charms: x.charms ?? [],
    blockTarget: x.blockTarget ?? b.blockTarget, rest: b.rest, notes: x.notes, build: b.id, buildName: b.name, tier: t, skill: b.skill };
}));
