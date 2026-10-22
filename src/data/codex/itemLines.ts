/**
 * 百科頁物品卡片的「屬性行」：由遊戲資料表即時產生，格式沿用舊百科資料（表頭行＋屬性行）。
 * 表頭行（防禦／傷害／格擋／需求／耐久／速度）由底材與屬性算出；屬性行用 engine/describe 的 describeRanges（含數值區間）。
 */
import { gameData } from '../../engine/data';
import { resolveModifier } from '../../engine/modifiers';
import { describeRanges, type DescribeRangeOptions } from '../../engine/describe';
import type { BaseItem, Modifier, StatEntry } from '../../engine/types';

const entriesAt = (mods: Modifier[], roll: number): StatEntry[] => mods.flatMap((m) => resolveModifier(m, gameData.properties, roll).entries);
const sumOf = (es: StatEntry[], stat: string) => es.filter((e) => e.stat === stat && e.param === undefined).reduce((a, e) => a + e.value, 0);
const range = (lo: number, hi: number) => (lo === hi ? `${lo}` : `${lo}-${hi}`);
const part = (lo: number, hi: number) => (lo === hi ? `${lo}` : `(${lo}-${hi})`);

/** 各職業的格擋係數（charstats.BlockFactor）：遊戲內提示框依職業分組顯示格擋機率 */
const blockFactor = (className: string) => gameData.charstats.find((c) => c.class === className)?.BlockFactor ?? 0;
const BLOCK_GROUPS: { tag: string; factor: number }[] = [
  { tag: 'Pal', factor: blockFactor('Paladin') },
  { tag: 'Ama/Asn/Bar/War', factor: blockFactor('Amazon') },
  { tag: 'Dru/Nec/Sor', factor: blockFactor('Sorceress') },
];
const CLASS_NAME_BY_CODE: Record<string, string> = { ama: 'Amazon', sor: 'Sorceress', nec: 'Necromancer', pal: 'Paladin', bar: 'Barbarian', dru: 'Druid', ass: 'Assassin', war: 'Warlock' };

export interface HeaderOptions {
  /** 物品自身的需求等級（暗金／套裝件） */
  levelReq?: number;
  /** 遊戲表沒有可用資料的屬性（未定義的屬性、觸發技能等級 0）：略過這些 modifier（以索引指定），改附舊百科的文字行 */
  dropMods?: number[];
  extraLines?: string[];
  /** 底材防禦範圍覆寫（min, max）：只有改採參考網站數值的暗金，見 engine/referenceOverrides.ts */
  baseAc?: [number, number];
}

/** 表頭行：防禦／傷害、格擋、重擊／踢擊、需求、耐久度、範圍、速度 */
/** 力量、敏捷需求：底材需求依「需求 −N%」屬性縮減（進位），無形物品再減 10 */
export function scaledRequirements(base: BaseItem | undefined, mods: Modifier[]): { str: number; dex: number } {
  const ease = sumOf(entriesAt(mods, 0), 'item_req_percent');
  const eth = mods.some((m) => m.code === 'ethereal');
  const scale = (n: number) => { const v = ease ? Math.ceil(n * (1 + ease / 100)) : n; return n && eth ? Math.max(0, v - 10) : v; };
  return { str: scale(base?.reqStr ?? 0), dex: scale(base?.reqDex ?? 0) };
}

export function headerLines(base: BaseItem | undefined, mods: Modifier[], opts: HeaderOptions = {}): string[] {
  const lines: string[] = [];
  const e0 = entriesAt(mods, 0); const e1 = entriesAt(mods, 1);
  // 無形物品：底材防禦與傷害 ×1.5（取整）
  const eth = mods.some((m) => m.code === 'ethereal');
  const ethScale = (n: number) => (eth ? Math.floor(n * 1.5) : n);
  const req = scaledRequirements(base, mods);
  const lv = Math.max(base?.levelReq ?? 0, opts.levelReq ?? 0);
  const indestructible = mods.some((m) => m.code === 'indestruct');

  if (base?.kind === 'armor' && base.minAc !== undefined && base.maxAc !== undefined) {
    const calc = (b: number, es: StatEntry[]) => Math.floor(ethScale(b) * (1 + sumOf(es, 'item_armor_percent') / 100)) + sumOf(es, 'armorclass');
    const [acMin, acMax] = opts.baseAc ?? [base.minAc, base.maxAc];
    const lo = calc(acMin, e0); const hi = calc(acMax, e1);
    lines.push(`防禦：${range(lo, hi)}`);
    const r0 = sumOf(e0, 'item_armor_perlevel') / 8; const r1 = sumOf(e1, 'item_armor_perlevel') / 8;
    if (r0 || r1) lines.push(`防禦：(${lo + Math.floor(r0)}-${lo + Math.floor(r0 * 99)})-(${hi + Math.floor(r1)}-${hi + Math.floor(r1 * 99)})`);
  }
  if (base?.kind === 'weapon') {
    const dmg = (label: string, mn: number, mx: number) => {
      // 依等級增加的最大傷害（固定值與強化％）：最大傷害的下限算 1 級、上限算 99 級
      const side = (b: number, pct: string, flat: string, es: StatEntry[], lvl: number, perLvlFlat?: string, perLvlPct?: string) => Math.floor(ethScale(b) * (1 + (sumOf(es, pct) + (perLvlPct ? Math.floor((sumOf(es, perLvlPct) / 8) * lvl) : 0)) / 100)) + sumOf(es, flat) + (perLvlFlat ? Math.floor((sumOf(es, perLvlFlat) / 8) * lvl) : 0);
      const a = side(mn, 'item_mindamage_percent', 'mindamage', e0, 1); const b = side(mn, 'item_mindamage_percent', 'mindamage', e1, 99);
      const c = side(mx, 'item_maxdamage_percent', 'maxdamage', e0, 1, 'item_maxdamage_perlevel', 'item_maxdamage_percent_perlevel'); const d = side(mx, 'item_maxdamage_percent', 'maxdamage', e1, 99, 'item_maxdamage_perlevel', 'item_maxdamage_percent_perlevel');
      lines.push(`${label}：${part(a, b)} - ${part(c, d)} 點`);
    };
    if (base.minDam !== undefined && base.maxDam !== undefined) dmg('單手傷害', base.minDam, base.maxDam);
    if (base.minDam2h !== undefined && base.maxDam2h !== undefined) dmg('雙手傷害', base.minDam2h, base.maxDam2h);
    if (base.minMisDam !== undefined && base.maxMisDam !== undefined) dmg('投擲傷害', base.minMisDam, base.maxMisDam);
  }
  if (base?.ancestors.includes('shld')) {
    const total = (cf: number, es: StatEntry[]) => (base.block ?? 0) + sumOf(es, 'toblock') + cf;
    if (base.class) {
      const cf = blockFactor(CLASS_NAME_BY_CODE[base.class] ?? '');
      lines.push(`格擋機率：${range(total(cf, e0), total(cf, e1))}%`);
    } else {
      for (const g of BLOCK_GROUPS) lines.push(`格擋機率：${range(total(g.factor, e0), total(g.factor, e1))}% (${g.tag})`);
    }
    if (base.smiteMax) lines.push(`重擊傷害：${base.smiteMin ?? 0} - ${base.smiteMax} 點`);
  }
  if (base?.kickMax) lines.push(`踢擊傷害：${base.kickMin ?? 0} - ${base.kickMax} 點`);
  if (lv > 0) lines.push(`需要等級：${lv}`);
  if (req.str) lines.push(`需要力量：${req.str}`);
  if (req.dex) lines.push(`需要敏捷：${req.dex}`);
  if (base?.maxStack) lines.push(`最大堆疊：${base.maxStack + sumOf(e1, 'item_extra_stack')}`); // 投擲武器顯示堆疊數量，不顯示耐久度
  else if (base && base.kind !== 'misc' && (base.durability ?? 0) > 0 && !indestructible) lines.push(`耐久度：${range((base.durability ?? 0) + sumOf(e0, 'maxdurability'), (base.durability ?? 0) + sumOf(e1, 'maxdurability'))}`);
  if (base?.beltSlots) lines.push(`腰帶空間：+${base.beltSlots - 4} 格`);
  if (base?.kind === 'weapon') {
    // 近戰武器的攻擊範圍＝1＋底材的 rangeAdder；速度欄位省略代表 0
    if (base.ancestors.includes('mele')) lines.push(`範圍: ${1 + (base.rangeAdder ?? 0)}`);
    lines.push(`武器基本速度：[${base.speed ?? 0}]`);
  }
  return lines;
}

/**
 * 屬性行（含區間）。耐久度已併入表頭，不重複列出。
 * 鈍器（權杖、錘、釘錘、棍、法杖…，遊戲物品類型 blun）天生對不死怪物 +50% 傷害，遊戲提示框會列出，與物品自己的同類屬性合併。
 */
export function modLines(mods: Modifier[], base?: BaseItem, opts: DescribeRangeOptions = {}): string[] {
  const blunt: Modifier[] = base?.ancestors.includes('blun') ? [{ code: 'dmg-undead', min: 50, max: 50 }] : [];
  return describeRanges([...mods.filter((m) => m.code !== 'dur'), ...blunt], opts).map((l) => l.text);
}

/** 完整屬性行：表頭＋屬性；範本類（Rift 咒符，遊戲表只有詞綴範本）改用覆蓋層保留的舊屬性行 */
export function itemAttributes(base: BaseItem | undefined, mods: Modifier[], opts: HeaderOptions & { staticLines?: string[] } = {}): string[] {
  const used = opts.dropMods?.length ? mods.filter((_, i) => !opts.dropMods?.includes(i)) : mods;
  const head = headerLines(base, opts.staticLines ? [] : used, opts);
  return [...head, ...(opts.staticLines ?? [...modLines(used, base), ...(opts.extraLines ?? [])])];
}
