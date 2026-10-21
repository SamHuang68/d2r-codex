import propertiesJson from '../game/properties.json';
import type { CustomAffix, CustomItemDef } from '../../engine/customItem';
import { AFFIXES, AFFIX_KIND_ZH, affixAppliesToType, type Affix } from './magicAffixes';

/**
 * 自訂飾品的「遊戲內有沒有可能長出來」檢查。拿使用者組的詞綴去對遊戲的魔法詞綴表（magicprefix／magicsuffix），
 * 只提供參考，不會擋下穿戴或儲存。
 *
 * 規則：
 *  - 自訂詞綴是單一屬性（例如 +40 生命）；遊戲詞綴可以同時帶好幾條屬性，所以一個遊戲詞綴可以湊出多條自訂詞綴；使用者沒列出的屬性不影響判定。
 *  - 同一個屬性的不同代碼視為同一個（例如 swing1／swing2／swing3 都是攻擊速度，比對遊戲的屬性定義，不比代碼字串）。
 *  - 魔法品質：最多 1 個前綴＋1 個後綴；稀有品質：最多 3＋3，而且只能用「稀有也會出現」的詞綴。護身符只會是魔法品質。
 *  - 同一組（group）的詞綴在同一件物品上只會有一個；所有選用詞綴的物品等級範圍要有交集。
 *  - 不含：底材的詞綴等級加成（magic_lvl）、暗金／套裝／符文之語／工藝與其他來源的屬性；也不判斷詞綴的職業欄位。
 */
export const CUSTOM_BASE_TYPE: Record<string, string> = { rin: 'ring', amu: 'amul', cm1: 'scha', cm2: 'mcha', cm3: 'lcha' };
export type Quality = 'magic' | 'rare';
const CAPS: Record<Quality, { prefix: number; suffix: number }> = { magic: { prefix: 1, suffix: 1 }, rare: { prefix: 3, suffix: 3 } };
const NODE_LIMIT = 200_000;

const props = propertiesJson as unknown as Record<string, { parts?: { stat?: string; val?: number }[] }>;
/** 屬性的比對鍵：只有單一遊戲屬性的代碼用屬性名（含職業編號），其餘用代碼本身 */
export function statKey(code: string): string {
  const parts = props[code]?.parts;
  return parts?.length === 1 && parts[0].stat ? `${parts[0].stat}${parts[0].val !== undefined ? `:${parts[0].val}` : ''}` : code;
}

/** 這個詞綴裡某屬性的數值範圍（沒有這個屬性回傳 undefined） */
const rangeOf = (a: Affix, key: string): [number, number] | undefined => {
  const m = a.mods.find((x) => statKey(x.code) === key);
  return m ? [m.min ?? 0, m.max ?? m.min ?? 0] : undefined;
};
const covers = (a: Affix, key: string, v: number): boolean => { const r = rangeOf(a, key); return !!r && v >= r[0] && v <= r[1]; };

export type LineVerdict = 'ok' | 'absent' | 'value';
export interface LineCheck {
  code: string; value: number; verdict: LineVerdict;
  /** 這種飾品上可以骰出這個值的詞綴（verdict 為 ok 時） */
  rows: Affix[];
  /** 這種飾品上這個屬性可骰到的範圍（由小到大合併） */
  ranges: [number, number][];
}
export interface ItemCheck {
  type: string;
  lines: LineCheck[];
  /** 整件有辦法長出來：最低需要的品質與物品等級範圍，以及用到的詞綴 */
  fit?: { quality: Quality; minIlvl: number; maxIlvl?: number; rows: Affix[] };
  /** 每條單獨都行、湊成一件卻不行時的原因 */
  conflict?: string;
  /** 組合太多、搜尋超過上限而沒有判定 */
  undecided?: boolean;
}

const mergeRanges = (rs: [number, number][]): [number, number][] => {
  const out: [number, number][] = [];
  for (const [lo, hi] of [...rs].sort((a, b) => a[0] - b[0] || a[1] - b[1])) {
    const last = out[out.length - 1];
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi); else out.push([lo, hi]);
  }
  return out;
};

interface SolveOpts { prefix: number; suffix: number; rareOnly: boolean; window: boolean }
interface Solution { rows: Affix[]; lo: number; hi: number }

/** 找出能涵蓋所有條目、物品等級最低的詞綴組合；回傳 'budget' 表示超過搜尋上限 */
function solve(keys: { key: string; value: number; cands: Affix[] }[], o: SolveOpts): Solution | undefined | 'budget' {
  const order = [...keys].sort((a, b) => a.cands.length - b.cands.length);
  let best: Solution | undefined; let nodes = 0; let over = false;
  const rec = (i: number, chosen: Affix[], lo: number, hi: number, p: number, s: number): void => {
    if (over) return;
    if (++nodes > NODE_LIMIT) { over = true; return; }
    if (i === order.length) { if (!best || lo < best.lo) best = { rows: chosen, lo, hi }; return; }
    const ln = order[i];
    if (chosen.some((r) => covers(r, ln.key, ln.value))) { rec(i + 1, chosen, lo, hi, p, s); return; }
    const tried = new Set<string>();
    for (const r of ln.cands) {
      if (o.rareOnly && !r.rare) continue;
      if (chosen.some((c) => c.group === r.group)) continue;
      if (r.kind === 'prefix' ? p + 1 > o.prefix : r.kind === 'suffix' ? s + 1 > o.suffix : true) continue;
      const nlo = o.window ? Math.max(lo, r.level) : lo; const nhi = o.window ? Math.min(hi, r.maxLevel ?? Infinity) : hi;
      if (nlo > nhi) continue;
      const sig = `${r.kind}|${r.group}|${r.level}|${r.maxLevel ?? ''}|${r.mods.map((m) => `${statKey(m.code)}:${m.min}-${m.max}`).join(',')}`;
      if (tried.has(sig)) continue; tried.add(sig);
      rec(i + 1, [...chosen, r], nlo, nhi, p + (r.kind === 'prefix' ? 1 : 0), s + (r.kind === 'suffix' ? 1 : 0));
    }
  };
  rec(0, [], 1, Infinity, 0, 0);
  return over ? 'budget' : best;
}

export function checkCustomItem(def: Pick<CustomItemDef, 'baseCode' | 'affixes'>): ItemCheck {
  const type = CUSTOM_BASE_TYPE[def.baseCode] ?? 'ring';
  const pool = AFFIXES.filter((a) => (a.kind === 'prefix' || a.kind === 'suffix') && affixAppliesToType(a, type));
  const lines: LineCheck[] = def.affixes.map((a: CustomAffix) => {
    const key = statKey(a.code);
    const have = pool.filter((r) => rangeOf(r, key));
    const rows = have.filter((r) => covers(r, key, a.value));
    return {
      code: a.code, value: a.value, rows,
      verdict: have.length === 0 ? 'absent' : rows.length ? 'ok' : 'value',
      ranges: mergeRanges(have.map((r) => rangeOf(r, key)!)),
    };
  });
  const res: ItemCheck = { type, lines };
  if (lines.some((l) => l.verdict !== 'ok')) return res;
  if (!lines.length) return res;

  const keys = lines.map((l) => ({ key: statKey(l.code), value: l.value, cands: l.rows }));
  const qualities: Quality[] = type === 'ring' || type === 'amul' ? ['magic', 'rare'] : ['magic'];
  for (const q of qualities) {
    const s = solve(keys, { ...CAPS[q], rareOnly: q === 'rare', window: true });
    if (s === 'budget') { res.undecided = true; return res; }
    if (s) { res.fit = { quality: q, minIlvl: s.lo, maxIlvl: Number.isFinite(s.hi) ? s.hi : undefined, rows: s.rows }; return res; }
  }
  // 找不到：判斷是哪一種限制擋住
  const maxQ = CAPS[qualities[qualities.length - 1]];
  const noGroup = solve(keys, { prefix: 99, suffix: 99, rareOnly: false, window: false });
  if (noGroup === 'budget') { res.undecided = true; return res; }
  if (!noGroup) { res.conflict = '其中有詞綴屬於同一組，同一件物品上只會出現一個，不能同時有。'; return res; }
  const noCap = solve(keys, { prefix: 99, suffix: 99, rareOnly: false, window: true });
  if (noCap === 'budget') { res.undecided = true; return res; }
  if (!noCap) { res.conflict = '這些詞綴要求的物品等級範圍沒有交集，同一件物品湊不出來。'; return res; }
  const eg = noCap.rows.map((r) => `${r.name}（${AFFIX_KIND_ZH[r.kind]}）`).join('、');
  res.conflict = type === 'ring' || type === 'amul'
    ? `需要的詞綴個數超過上限：魔法品質最多 ${CAPS.magic.prefix} 個前綴＋${CAPS.magic.suffix} 個後綴，稀有品質最多 ${maxQ.prefix}＋${maxQ.suffix}（稀有只能用「稀有也會出現」的詞綴）。例如這組要靠 ${eg}。`
    : `護身符只會是魔法品質，最多 ${CAPS.magic.prefix} 個前綴＋${CAPS.magic.suffix} 個後綴，放不進同一個護身符。例如這組要靠 ${eg}。`;
  return res;
}
