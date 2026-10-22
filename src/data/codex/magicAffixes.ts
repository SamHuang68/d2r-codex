import affixesJson from '../game/affixes.json';
import itemtypesJson from '../game/itemtypes.json';
import { gameData } from '../../engine/data';
import { CLASS_CODE_ZH } from '../../engine/classes';
import { describeRanges } from '../../engine/describe';
import type { Modifier } from '../../engine/types';
import { EQUIP_DEFS, TYPE_LEAF, type TaxDef } from '../../utils/equipTaxonomy';

/**
 * 魔法詞綴總表。資料來自遊戲 magicprefix.txt／magicsuffix.txt／automagic.txt（資料管線輸出 affixes.json），
 * 稀有物品的前後綴也從同一批詞綴抽，所以「稀有也會出現」只是一個旗標。
 *
 * 判定規則（跟遊戲資料表的欄位一致）：
 *  - 物品等級（alvl）要落在 [level, maxLevel]；maxLevel 沒填表示沒有上限。
 *  - 物品類型要符合 itypes 其中之一，而且不屬於 etypes；類型有繼承關係（例如「大型咒符」也算「咒符」、「長劍」也算「刀劍」「近戰武器」「武器」），
 *    繼承關係用 itemtypes.json 的 equiv。資料表裡不存在的類型代碼（兩處筆誤：staff、「ring 」帶空白）永遠不會符合，跟遊戲讀表的結果一致。
 *  - 同一個 group 的詞綴在同一件物品上只會出現一個。
 *  - frequency 是抽選權重；權重 0 或沒填的列（舊版本殘留）資料管線已經排除，不會被隨機抽到。
 *  - 不含：部分底材的詞綴等級加成（magic_lvl）、遊戲內其他影響抽選的修正，所以「權重占比」只是同條件下的相對機率，不是掉落機率。
 */
export type AffixKind = 'prefix' | 'suffix' | 'auto';
export interface Affix {
  id: string; kind: AffixKind; nameEn: string; name: string;
  /** 物品等級下限 / 上限（上限沒填＝不限） */
  level: number; maxLevel?: number;
  /** 這個詞綴讓物品增加的角色等級需求 */
  levelReq: number;
  /** 資料表 classspecific 欄（前綴、自動詞綴）：職業代碼 */
  classOnly?: string;
  /** 資料表 class／classlevelreq 欄（後綴）：職業代碼與該職業的等級需求 */
  class?: string; classLevelReq?: number;
  frequency: number; group: number; rare?: boolean;
  mods: Modifier[]; itypes: string[]; etypes: string[];
}

/** 遊戲字串表沒有中文名的 7 個詞綴（of Shadows、of Despair、of Nightmares、of Ember、of Cinders、of Flames、of Inferno）改顯示英文名，名稱欄位永遠有值 */
export const AFFIXES: Affix[] = (affixesJson as unknown as (Omit<Affix, 'name'> & { name?: string })[]).map((a) => ({ ...a, name: a.name ?? a.nameEn }));
export const AFFIX_KIND_ZH: Record<AffixKind, string> = { prefix: '前綴', suffix: '後綴', auto: '自動詞綴' };
export const AFFIX_KINDS: AffixKind[] = ['prefix', 'suffix', 'auto'];

// --- 物品類型繼承 ---
const equivOf = new Map<string, string[]>((itemtypesJson as { code: string; equiv: string[] }[]).map((t) => [t.code, t.equiv]));
const ancestryCache = new Map<string, Set<string>>();
/** 物品類型本身加上所有上層類型（例如 lcha → lcha、char、misc） */
export function typeAncestry(code: string): Set<string> {
  let s = ancestryCache.get(code);
  if (s) return s;
  s = new Set<string>();
  const walk = (c: string) => { if (s!.has(c)) return; s!.add(c); (equivOf.get(c) ?? []).forEach(walk); };
  walk(code);
  ancestryCache.set(code, s);
  return s;
}

export const affixAppliesToType = (a: Affix, typeCode: string): boolean => {
  const anc = typeAncestry(typeCode);
  return a.itypes.some((t) => anc.has(t)) && !a.etypes.some((t) => anc.has(t));
};
/** alvl 是否落在詞綴的等級範圍內 */
export const affixAvailableAt = (a: Affix, alvl: number): boolean => alvl >= a.level && (!a.maxLevel || alvl <= a.maxLevel);

/** 指定物品類型（與物品等級）可以出現的詞綴 */
export function affixesFor(typeCode: string, alvl?: number, kind?: AffixKind): Affix[] {
  return AFFIXES.filter((a) => (!kind || a.kind === kind) && affixAppliesToType(a, typeCode) && (alvl === undefined || affixAvailableAt(a, alvl)));
}

/** 這個詞綴在「同種類、同物品類型、同 alvl」的候選詞綴裡的權重占比（0~1）；候選池空或權重為 0 時回傳 undefined */
export function weightShare(a: Affix, typeCode: string, alvl: number): number | undefined {
  const pool = affixesFor(typeCode, alvl, a.kind);
  const total = pool.reduce((s, x) => s + x.frequency, 0);
  return total > 0 && pool.includes(a) ? a.frequency / total : undefined;
}

// --- 類型的中文名稱 ---
/** 上層（分組用）類型代碼的中文名稱；具體類型的名稱沿用裝備分類（equipTaxonomy）與底材資料，不另外維護 */
const GROUP_TYPE_ZH: Record<string, string> = {
  armo: '所有防具', weap: '所有武器', mele: '近戰武器', miss: '遠程武器（弓與弩）', thro: '投擲武器', blun: '鈍器', rod: '杖類（法杖、魔杖、權杖）',
  shld: '所有盾牌', sppl: '長柄與長矛', amaz: '亞馬遜專用', char: '咒符', misc: '雜項',
};
const leafLabels = new Map<string, string>();
const collectLeaves = (defs: TaxDef[]) => defs.forEach((d) => (d.children ? collectLeaves(d.children) : leafLabels.set(d.id, d.label)));
collectLeaves(EQUIP_DEFS);
const baseTypeName = (code: string): string | undefined => gameData.bases.find((b) => b.type === code)?.name;
const typeNameOf = new Map((itemtypesJson as { code: string; name: string }[]).map((t) => [t.code, t.name]));

export function itemTypeLabel(code: string): string {
  const leaf = TYPE_LEAF[code];
  return GROUP_TYPE_ZH[code] ?? (leaf ? leafLabels.get(leaf) : undefined) ?? baseTypeName(code) ?? (typeNameOf.has(code) ? typeNameOf.get(code)! : `${code.trim()}（資料表筆誤）`);
}
/** 資料表裡不存在的類型代碼（筆誤），永遠不會符合任何物品 */
export const isUnknownType = (code: string): boolean => !equivOf.has(code);

export interface ItemTypeOption { code: string; label: string }
export interface ItemTypeGroup { label: string; options: ItemTypeOption[] }
/** 篩選用的具體物品類型，依裝備分類的順序排列；飾品（戒指、護身符、三種咒符、珠寶）接在最後 */
export const ITEM_TYPE_GROUPS: ItemTypeGroup[] = (() => {
  const codeOfLeaf = new Map<string, string>();
  for (const [code, leaf] of Object.entries(TYPE_LEAF)) if (!codeOfLeaf.has(leaf)) codeOfLeaf.set(leaf, code);
  const leaves = (d: TaxDef): ItemTypeOption[] => (d.children ? d.children.flatMap(leaves) : codeOfLeaf.has(d.id) ? [{ code: codeOfLeaf.get(d.id)!, label: d.label }] : []);
  const groups: ItemTypeGroup[] = EQUIP_DEFS.map((d) => ({ label: d.label, options: leaves(d) }));
  groups.push({ label: '飾品', options: ['ring', 'amul', 'scha', 'mcha', 'lcha', 'jewl'].map((code) => ({ code, label: baseTypeName(code) ?? code })) });
  return groups;
})();

// --- 屬性說明（套用既有的屬性描述器，數值以範圍呈現） ---
const lineCache = new Map<string, string[]>();
export function affixLines(a: Affix): string[] {
  let l = lineCache.get(a.id);
  if (!l) { l = describeRanges(a.mods).map((x) => x.text); lineCache.set(a.id, l); }
  return l;
}

/**
 * 資料表裡有 112 個後綴（職業專用的「某某箭之」「某某術之」等）的充能技能等級與次數都是負數（例如 −30～−10）。
 * 這種寫法在遊戲內會產生什麼效果尚未驗證，所以頁面照資料列出並標示，不替它們解讀成正常的充能技能。
 */
export const hasNegativeCharges = (a: Affix): boolean => a.mods.some((m) => m.code === 'charged' && ((m.min ?? 0) < 0 || (m.max ?? 0) < 0));

export const classZh = (code: string): string => CLASS_CODE_ZH[code] ?? code;
/** 這個詞綴限定的職業（前綴與自動詞綴看 classspecific，後綴看 class） */
export const affixClass = (a: Affix): string | undefined => a.classOnly ?? a.class;
