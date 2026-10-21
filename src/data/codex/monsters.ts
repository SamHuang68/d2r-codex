import monstersJson from '../game/monsters.json';
import areasJson from '../game/areas.json';

/**
 * 怪物圖鑑與場景免疫。資料來自遊戲 monstats.txt（怪物的等級與抗性）與 levels.txt（每個場景在各難度出現的怪物），
 * 由資料管線輸出 monsters.json／areas.json。
 *
 * 規則與限制：
 *  - 三個難度（普通、惡夢、地獄）各有一組等級與抗性。資料表沒填的抗性格是 0；抗性 ≥100 是免疫、負值是弱點。
 *  - 吸取效率（生命／法力偷取對這隻怪的效果 %）與等級資料表沒填就是 null（JSON 裡沒有 undefined），不當成 0。
 *  - 不含：精英、冠軍、首領詞綴（例如火焰附魔）帶來的額外抗性；遊戲內再依等級換算的生命；首領出沒的場景。
 */
export type ElemKey = 'physical' | 'magic' | 'fire' | 'lightning' | 'cold' | 'poison';
export type Diff = 0 | 1 | 2;
export const ELEMS: ElemKey[] = ['physical', 'magic', 'fire', 'lightning', 'cold', 'poison'];
export const ELEM_ZH: Record<ElemKey, string> = { physical: '物理', magic: '魔法', fire: '火焰', lightning: '閃電', cold: '冰寒', poison: '毒素' };
export const DIFF_ZH = ['普通', '惡夢', '地獄'] as const;
export type MonsterKind = 'undead' | 'demon' | 'insect' | 'construct' | 'human';
export const KIND_ZH: Record<MonsterKind | 'other', string> = { undead: '亡靈', demon: '惡魔', insect: '昆蟲', construct: '傀儡', human: '人形', other: '其他' };

export interface Monster {
  id: string; nameEn: string; name: string; type?: string; kind?: MonsterKind; boss?: boolean; primeEvil?: boolean;
  /** 普通、惡夢、地獄的等級（資料表沒填為 null） */
  levels: (number | null)[];
  res: Record<ElemKey, number[]>;
  drain: (number | null)[];
}
export interface Area { id: number; nameEn: string; name?: string; act: number; mlvl: (number | null)[]; mon: string[][] }

export const MONSTERS = monstersJson as unknown as Monster[];
export const AREAS = areasJson as unknown as Area[];
const byId = new Map(MONSTERS.map((m) => [m.id, m]));
export const monsterById = (id: string): Monster | undefined => byId.get(id);

export const isImmune = (v: number): boolean => v >= 100;
export const resistOf = (m: Monster, e: ElemKey, d: Diff): number => m.res[e][d] ?? 0;
export const immunitiesOf = (m: Monster, d: Diff): ElemKey[] => ELEMS.filter((e) => isImmune(resistOf(m, e, d)));

/** 怪物出現在哪些場景（以及哪些難度） */
const areasByMonster = new Map<string, { area: Area; diffs: Diff[] }[]>();
for (const a of AREAS) {
  const seen = new Map<string, Diff[]>();
  a.mon.forEach((ids, d) => ids.forEach((id) => { const l = seen.get(id) ?? seen.set(id, []).get(id)!; l.push(d as Diff); }));
  for (const [id, diffs] of seen) { const l = areasByMonster.get(id) ?? areasByMonster.set(id, []).get(id)!; l.push({ area: a, diffs }); }
}
export const areasOfMonster = (id: string): { area: Area; diffs: Diff[] }[] => areasByMonster.get(id) ?? [];

export interface AreaImmunity {
  /** 該難度此場景出現的怪物（有在怪物表裡的） */
  monsters: Monster[];
  /** 各元素免疫的怪物數 */
  immuneCount: Record<ElemKey, number>;
  /** 至少有一種怪物免疫的元素 */
  immune: ElemKey[];
  /** 沒有任何怪物免疫的元素（這個場景可以放心使用） */
  safe: ElemKey[];
}
export function areaImmunity(a: Area, d: Diff): AreaImmunity {
  const monsters = (a.mon[d] ?? []).map((id) => byId.get(id)).filter((m): m is Monster => !!m);
  const immuneCount = Object.fromEntries(ELEMS.map((e) => [e, monsters.filter((m) => isImmune(resistOf(m, e, d))).length])) as Record<ElemKey, number>;
  return { monsters, immuneCount, immune: ELEMS.filter((e) => immuneCount[e] > 0), safe: ELEMS.filter((e) => immuneCount[e] === 0) };
}
export const areaLevel = (a: Area, d: Diff): number | null => a.mlvl[d];
