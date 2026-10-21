import { getCatalog, type CatalogEntry } from './catalog';
import type { Modifier } from './types';

/**
 * 自訂飾品：魔法／稀有的戒指、項鍊、護身符。它們的詞綴是隨機的，遊戲資料表沒有「某個物品」可選，所以由使用者自己組。
 * 詞綴只從下面的清單選（每一項都是引擎看得懂、能計入數值的屬性代碼），數值上限只是防呆，
 * 不是遊戲裡各種飾品實際能骰到的範圍；這裡不擋、也不驗證能不能在遊戲中出現，
 * 能不能長出來由 data/codex/customItemCheck.ts 對照遊戲詞綴表提示（只是參考，建構器背景載入）。
 */
export interface CustomAffix { code: string; value: number }
export interface CustomItemDef {
  /** 底材代碼：rin 戒指、amu 項鍊、cm1／cm2／cm3 小／大／特大護身符 */
  baseCode: string;
  name: string;
  affixes: CustomAffix[];
}

export const CUSTOM_BASES: { code: string; label: string }[] = [
  { code: 'rin', label: '戒指' }, { code: 'amu', label: '項鍊' },
  { code: 'cm1', label: '小型護身符' }, { code: 'cm2', label: '大型護身符' }, { code: 'cm3', label: '特大護身符' },
];

/** 可選詞綴（屬性代碼）與防呆上限 */
export const CUSTOM_AFFIXES: { code: string; max: number }[] = [
  { code: 'hp', max: 300 }, { code: 'mana', max: 300 }, { code: 'str', max: 60 }, { code: 'dex', max: 60 }, { code: 'vit', max: 60 }, { code: 'enr', max: 60 },
  { code: 'res-fire', max: 75 }, { code: 'res-cold', max: 75 }, { code: 'res-ltng', max: 75 }, { code: 'res-pois', max: 75 }, { code: 'res-all', max: 60 },
  { code: 'mag%', max: 200 }, { code: 'gold%', max: 400 },
  { code: 'cast2', max: 60 }, { code: 'swing2', max: 60 }, { code: 'balance2', max: 60 }, { code: 'block2', max: 60 }, { code: 'move2', max: 60 },
  { code: 'allskills', max: 5 }, { code: 'ama', max: 3 }, { code: 'sor', max: 3 }, { code: 'nec', max: 3 }, { code: 'pal', max: 3 }, { code: 'bar', max: 3 }, { code: 'dru', max: 3 }, { code: 'ass', max: 3 }, { code: 'war', max: 3 },
  { code: 'ac', max: 500 }, { code: 'ac%', max: 300 }, { code: 'dmg%', max: 300 }, { code: 'att', max: 500 }, { code: 'att%', max: 300 },
  { code: 'dmg-min', max: 100 }, { code: 'dmg-max', max: 200 },
  { code: 'lifesteal', max: 30 }, { code: 'manasteal', max: 30 }, { code: 'red-dmg', max: 50 }, { code: 'red-mag', max: 50 }, { code: 'red-dmg%', max: 50 },
  { code: 'crush', max: 100 }, { code: 'deadly', max: 100 }, { code: 'openwounds', max: 100 }, { code: 'regen', max: 100 }, { code: 'regen-mana', max: 100 }, { code: 'stam', max: 200 },
];
const AFFIX_CAP = new Map(CUSTOM_AFFIXES.map((a) => [a.code, a.max]));

export const MAX_CUSTOM_AFFIXES = 8;
export const MAX_CUSTOM_NAME = 30;

/** 檢查外部（匯入、儲存的）自訂物品定義。結構不對回傳原因；通過就回傳整理過的內容 */
export function validateCustomDef(v: unknown): CustomItemDef | string {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return '自訂物品不是物件';
  const o = v as Record<string, unknown>;
  if (typeof o.baseCode !== 'string' || !CUSTOM_BASES.some((b) => b.code === o.baseCode)) return '自訂物品的底材不認得';
  if (typeof o.name !== 'string') return '自訂物品缺少名稱';
  if (!Array.isArray(o.affixes) || o.affixes.length > MAX_CUSTOM_AFFIXES) return `自訂物品的詞綴不合法（最多 ${MAX_CUSTOM_AFFIXES} 條）`;
  const affixes: CustomAffix[] = [];
  for (const a of o.affixes) {
    if (!a || typeof a !== 'object') return '自訂詞綴不是物件';
    const { code, value } = a as Record<string, unknown>;
    if (typeof code !== 'string' || !AFFIX_CAP.has(code)) return `不認得的詞綴「${String(code)}」`;
    if (typeof value !== 'number' || !Number.isFinite(value)) return `詞綴「${code}」的數值不是數字`;
    affixes.push({ code, value: Math.max(1, Math.min(AFFIX_CAP.get(code)!, Math.round(value))) });
  }
  return { baseCode: o.baseCode, name: o.name.trim().slice(0, MAX_CUSTOM_NAME), affixes };
}

let seq = 0;
/** 自訂定義 → 目錄項目（可穿戴、計入數值、存進 Profile）。底材取自目錄的白色底材項目 */
export function customEntry(def: CustomItemDef): CatalogEntry | undefined {
  const tpl = getCatalog().find((e) => e.id === `base:${def.baseCode}`); if (!tpl) return undefined;
  const mods: Modifier[] = def.affixes.map((a) => ({ code: a.code, min: a.value, max: a.value }));
  const label = CUSTOM_BASES.find((b) => b.code === def.baseCode)?.label ?? tpl.name;
  return { ...tpl, id: `custom:${def.baseCode}:${(seq++).toString(36)}`, name: def.name || `自訂${label}`, nameEn: 'Custom', mods, custom: def };
}
