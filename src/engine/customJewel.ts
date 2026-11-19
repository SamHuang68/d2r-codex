import type { Modifier } from './types';
import type { Socketable } from './catalog';

/** 魔法／稀有珠寶可選的常見詞綴定義（數值上限依遊戲內魔法／稀有珠寶規則設定） */
export interface CustomJewelAffixDef {
  code: string;
  label: string;
  labelEn: string;
  min: number;
  max: number;
  defaultVal: number;
  unit?: string;
}

export const CUSTOM_JEWEL_AFFIXES: CustomJewelAffixDef[] = [
  { code: 'swing2', label: '攻擊速度 (IAS)', labelEn: 'IAS', min: 15, max: 15, defaultVal: 15, unit: '%' },
  { code: 'dmg%', label: '傷害強化 (ED)', labelEn: 'Enhanced Damage', min: 1, max: 40, defaultVal: 40, unit: '%' },
  { code: 'res-all', label: '所有抗性', labelEn: 'All Resistances', min: 1, max: 15, defaultVal: 15, unit: '%' },
  { code: 'res-fire', label: '火焰抗性', labelEn: 'Fire Resist', min: 1, max: 30, defaultVal: 30, unit: '%' },
  { code: 'res-cold', label: '冰寒抗性', labelEn: 'Cold Resist', min: 1, max: 30, defaultVal: 30, unit: '%' },
  { code: 'res-ltng', label: '閃電抗性', labelEn: 'Lightning Resist', min: 1, max: 30, defaultVal: 30, unit: '%' },
  { code: 'res-pois', label: '毒素抗性', labelEn: 'Poison Resist', min: 1, max: 30, defaultVal: 30, unit: '%' },
  { code: 'ease', label: '需求降低', labelEn: 'Requirements', min: -15, max: -15, defaultVal: -15, unit: '%' },
  { code: 'dmg-max', label: '最大傷害', labelEn: 'Max Damage', min: 1, max: 30, defaultVal: 15 },
  { code: 'dmg-min', label: '最小傷害', labelEn: 'Min Damage', min: 1, max: 18, defaultVal: 10 },
  { code: 'balance2', label: '快速打擊恢復 (FHR)', labelEn: 'FHR', min: 7, max: 7, defaultVal: 7, unit: '%' },
  { code: 'str', label: '力量', labelEn: 'Strength', min: 1, max: 9, defaultVal: 9 },
  { code: 'dex', label: '敏捷', labelEn: 'Dexterity', min: 1, max: 9, defaultVal: 9 },
  { code: 'hp', label: '生命', labelEn: 'Life', min: 1, max: 20, defaultVal: 20 },
  { code: 'mag%', label: '尋獲魔法物品 (MF)', labelEn: 'Magic Find', min: 1, max: 17, defaultVal: 10, unit: '%' },
];

const AFFIX_BY_CODE = new Map(CUSTOM_JEWEL_AFFIXES.map((a) => [a.code, a]));

export interface CustomJewelAffixEntry {
  code: string;
  value: number;
}

export const CUSTOM_JEWEL_PREFIX = 'cjewel:';
export const MAX_CUSTOM_JEWEL_AFFIXES = 4;

/** 常見終局魔法／稀有珠寶快捷範本 */
export interface CustomJewelPreset {
  id: string;
  name: string;
  nameEn: string;
}

export const CUSTOM_JEWEL_PRESETS: CustomJewelPreset[] = [
  { id: 'cjewel:swing2=15,dmg%=40', name: '紅白珠寶 (15% IAS / 40% ED)', nameEn: '15% IAS / 40% ED Jewel' },
  { id: 'cjewel:swing2=15,res-all=15', name: '15% IAS / 15 全抗 珠寶', nameEn: '15% IAS / 15 All Res Jewel' },
  { id: 'cjewel:swing2=15,res-fire=30', name: '15% IAS / 30% 火抗 珠寶', nameEn: '15% IAS / 30% Fire Res Jewel' },
  { id: 'cjewel:swing2=15,dmg-max=15', name: '15% IAS / +15 大傷 珠寶', nameEn: '15% IAS / +15 Max Dmg Jewel' },
  { id: 'cjewel:dmg%=40,ease=-15', name: '40% ED / -15% 需求 珠寶', nameEn: '40% ED / -15% Req Jewel' },
  { id: 'cjewel:res-all=15,ease=-15', name: '15 全抗 / -15% 需求 珠寶', nameEn: '15 All Res / -15% Req Jewel' },
  { id: 'cjewel:balance2=7,res-all=15', name: '7% FHR / 15 全抗 珠寶', nameEn: '7% FHR / 15 All Res Jewel' },
];

/** 將詞綴陣列編碼成可存入 Profile / URL 的字串 ID（最多 4 條不重複詞綴） */
export function encodeCustomJewel(entries: CustomJewelAffixEntry[]): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const e of entries) {
    if (parts.length >= MAX_CUSTOM_JEWEL_AFFIXES) break;
    const def = AFFIX_BY_CODE.get(e.code);
    if (!def || seen.has(e.code)) continue;
    const v = Math.max(def.min, Math.min(def.max, Math.round(e.value)));
    if (v === 0) continue;
    seen.add(e.code);
    parts.push(`${e.code}=${v}`);
  }
  return parts.length > 0 ? `${CUSTOM_JEWEL_PREFIX}${parts.join(',')}` : '';
}

/** 解碼自訂珠寶 ID 為詞綴清單；無效字串回傳空陣列 */
export function decodeCustomJewelAffixes(id: string): CustomJewelAffixEntry[] {
  if (!id.startsWith(CUSTOM_JEWEL_PREFIX)) return [];
  const body = id.slice(CUSTOM_JEWEL_PREFIX.length);
  if (!body) return [];
  const rawParts = body.split(',');
  if (rawParts.length === 0 || rawParts.length > MAX_CUSTOM_JEWEL_AFFIXES) return [];
  const seen = new Set<string>();
  const out: CustomJewelAffixEntry[] = [];
  for (const part of rawParts) {
    const eq = part.indexOf('=');
    if (eq <= 0) return [];
    const code = part.slice(0, eq);
    const valStr = part.slice(eq + 1);
    if (!/^-?\d+$/.test(valStr)) return [];
    const def = AFFIX_BY_CODE.get(code);
    if (!def || seen.has(code)) return [];
    const val = Number(valStr);
    if (val < def.min || val > def.max || val === 0) return [];
    seen.add(code);
    out.push({ code, value: val });
  }
  return out;
}

/** 判斷是否為合法的自訂珠寶 ID */
export function isCustomJewelId(id: string): boolean {
  return decodeCustomJewelAffixes(id).length > 0;
}

/** 將自訂珠寶 ID 轉為引擎可用的 Socketable 物件；無效則回傳 undefined */
export function parseCustomJewel(id: string): Socketable | undefined {
  const entries = decodeCustomJewelAffixes(id);
  if (entries.length === 0) return undefined;
  const preset = CUSTOM_JEWEL_PRESETS.find((p) => p.id === id);
  const jewelMods: Modifier[] = entries.map((e) => ({ code: e.code, min: e.value, max: e.value }));
  const fmtPart = (e: CustomJewelAffixEntry, en: boolean) => {
    const def = AFFIX_BY_CODE.get(e.code)!;
    const sign = e.value > 0 ? '+' : '';
    return `${sign}${e.value}${def.unit ?? ''} ${en ? def.labelEn : def.label}`;
  };
  const label = entries.length <= 2 ? '魔法珠寶' : '稀有珠寶';
  const labelEn = entries.length <= 2 ? 'Magic Jewel' : 'Rare Jewel';
  return {
    id,
    kind: 'jewel',
    name: preset ? preset.name : `${label}（${entries.map((e) => fmtPart(e, false)).join(' / ')}）`,
    nameEn: preset ? preset.nameEn : `${labelEn} (${entries.map((e) => fmtPart(e, true)).join(' / ')})`,
    jewelMods,
  };
}
