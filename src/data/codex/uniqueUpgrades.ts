import uniquesJson from '../game/uniques.json';
import basesJson from '../game/bases.json';
import cubeJson from '../game/cube.json';
import { BUILDS } from '../simulatorPresets';
import type { BaseItem } from '../../engine/types';

/**
 * 暗金升級：用赫拉迪克方塊把一般／擴充底材的暗金，換成擴充／傳奇底材的同一件暗金。
 * - 配方（符文、寶石、需求等級增加）來自遊戲資料表 cubemain.txt（cube.json 第 131～134 列）；
 * - 暗金本身的屬性不變，變的是底材：防禦或傷害、力量需求、腰帶格數；
 * - 防禦／傷害只算底材與暗金自己的「增強防禦／增強傷害」與固定加成，不含每等級加成、元素傷害、鑲嵌與詞綴，所以是比較用的數字，不是遊戲內角色面板；
 * - 無形：底材防禦／傷害 +50%、力量與敏捷需求 −10、耐久減半且不能修理；裝備在傭兵身上不損耗耐久（GamerGuides「Ethereal Items」、Maxroll「Mercenary」）。
 *   升級配方可以用在無形裝備上，升級後仍是無形（社群說法，D2R 沒有在遊戲內逐項實測）。
 * 「值得升級」的判準寫在 upgradeLevel：只看升級帶來的防禦／傷害／腰帶格提升幅度，不判斷這件暗金本身強不強。
 */
interface RawMod { code: string; min?: number; max?: number }
interface RawUnique { id: string; nameEn: string; nameEnUS?: string; name?: string; code: string; type: string; levelReq: number; class?: string; spawnable?: boolean; mods?: RawMod[] }

/** 底材的升級對照：normcode／ubercode／ultracode 是同一系列的普通／擴充／傳奇底材代碼 */
type UpBase = BaseItem & { ubercode?: string; ultracode?: string };
const UNIQUES = uniquesJson as unknown as RawUnique[];
const BASES = basesJson as unknown as UpBase[];
const baseByCode = new Map(BASES.map((b) => [b.code, b]));

export const ETH_MULT = 1.5;
/** 提升幅度分級：防禦（防具）或平均傷害（武器）提升的絕對值；腰帶多出的格數另算 */
export const LEVEL_HIGH = 100;
export const LEVEL_MID = 50;
export const BELT_SLOTS_HIGH = 4;

export type UpgradeTier = 'normal' | 'exceptional';
export type UpgradeLevel = 'high' | 'mid' | 'low';
export interface Range { min: number; max: number }

export interface UpgradeRow {
  id: string; /** uniques.json 的 nameEn（內部名稱，例如 Vampiregaze） */ key: string; nameEn: string; name: string;
  kind: 'armor' | 'weapon'; type: string; cls?: string;
  fromTier: UpgradeTier; from: UpBase; to: UpBase;
  /** 防具是防禦、武器是傷害（不含每等級加成、元素傷害、鑲嵌與詞綴） */
  now: Range; after: Range; nowEth: Range; afterEth: Range;
  levelReq: number; levelReqAfter: number;
  reqStr: [number, number];
  /** 普通底材也可以只升一階到擴充底材：力量需求低很多，提升也小一些 */
  oneStep?: { base: UpBase; after: Range; reqStr: number; levelReqAfter: number };
  beltSlots?: [number, number];
  /** 暗金本身不可摧毀 */
  indestructible: boolean;
  level: UpgradeLevel;
  /** 這一級的依據（顯示用，中英） */
  reason: { zh: string; en: string };
}

const mod = (u: RawUnique, code: string): RawMod | undefined => u.mods?.find((m) => m.code === code);
const lo = (m?: RawMod): number => m?.min ?? 0;
const hi = (m?: RawMod): number => m?.max ?? m?.min ?? 0;

/** 一個底材在這件暗金上的防禦或傷害範圍；eth＝無形（底材先 ×1.5 取整，再套增強） */
function statRange(b: UpBase, u: RawUnique, eth: boolean): Range {
  const k = (v: number): number => (eth ? Math.floor(v * ETH_MULT) : v);
  if (b.kind === 'armor') {
    const ed = mod(u, 'ac%'); const flat = mod(u, 'ac');
    return { min: Math.floor(k(b.minAc ?? 0) * (1 + lo(ed) / 100)) + lo(flat), max: Math.floor(k(b.maxAc ?? 0) * (1 + hi(ed) / 100)) + hi(flat) };
  }
  const two = b.twoHanded && b.minDam2h != null;
  const ed = mod(u, 'dmg%');
  return {
    min: Math.floor(k((two ? b.minDam2h : b.minDam) ?? 0) * (1 + lo(ed) / 100)) + lo(mod(u, 'dmg-min')),
    max: Math.floor(k((two ? b.maxDam2h : b.maxDam) ?? 0) * (1 + hi(ed) / 100)) + hi(mod(u, 'dmg-max')),
  };
}
const avg = (r: Range): number => (r.min + r.max) / 2;

export function upgradeLevel(r: Pick<UpgradeRow, 'kind' | 'now' | 'after' | 'beltSlots'>): { level: UpgradeLevel; reason: { zh: string; en: string } } {
  const gain = Math.round(avg(r.after) - avg(r.now));
  const slots = r.beltSlots ? r.beltSlots[1] - r.beltSlots[0] : 0;
  const stat = r.kind === 'armor' ? { zh: '防禦', en: 'Defense' } : { zh: '平均傷害', en: 'Avg damage' };
  const why = { zh: `${stat.zh} +${gain}${slots > 0 ? `、腰帶 +${slots} 格` : ''}`, en: `${stat.en} +${gain}${slots > 0 ? `, belt +${slots} slots` : ''}` };
  if (gain >= LEVEL_HIGH || slots >= BELT_SLOTS_HIGH) return { level: 'high', reason: why };
  if (gain >= LEVEL_MID) return { level: 'mid', reason: why };
  return { level: 'low', reason: why };
}

function buildRow(u: RawUnique): UpgradeRow | undefined {
  const from = baseByCode.get(u.code);
  if (!from || (from.tier !== 'normal' && from.tier !== 'exceptional') || (from.kind !== 'armor' && from.kind !== 'weapon')) return undefined;
  const exc = from.tier === 'normal' ? baseByCode.get(from.ubercode ?? '') : from;
  const to = exc && baseByCode.get(exc.ultracode ?? '');
  if (!exc || !to || to.tier !== 'elite') return undefined;
  const base = { now: statRange(from, u, false), after: statRange(to, u, false), beltSlots: from.beltSlots != null && to.beltSlots != null ? ([from.beltSlots, to.beltSlots] as [number, number]) : undefined };
  const rest = { kind: from.kind, ...base };
  return {
    id: u.id, key: u.nameEn, nameEn: u.nameEnUS ?? u.nameEn, name: u.name ?? u.nameEn,
    kind: from.kind, type: u.type, cls: u.class,
    fromTier: from.tier, from, to,
    now: base.now, after: base.after, nowEth: statRange(from, u, true), afterEth: statRange(to, u, true),
    levelReq: u.levelReq, levelReqAfter: u.levelReq + (from.tier === 'normal' ? 5 + 7 : 7),
    reqStr: [from.reqStr ?? 0, to.reqStr ?? 0],
    oneStep: from.tier === 'normal' ? { base: exc, after: statRange(exc, u, false), reqStr: exc.reqStr ?? 0, levelReqAfter: u.levelReq + 5 } : undefined,
    beltSlots: base.beltSlots && base.beltSlots[1] !== base.beltSlots[0] ? base.beltSlots : undefined,
    indestructible: !!mod(u, 'indestruct'),
    ...upgradeLevel(rest),
  };
}

/** 全部可升級的暗金（取得不了的、沒有名稱的不列） */
export const UPGRADE_ROWS: UpgradeRow[] = UNIQUES.filter((u) => u.spawnable !== false && u.name).flatMap((u) => { const r = buildRow(u); return r ? [r] : []; });
const rowByKey = new Map(UPGRADE_ROWS.map((r) => [r.key, r]));
export const upgradeRowOf = (key: string): UpgradeRow | undefined => rowByKey.get(key);

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const rowsByNorm = new Map(UPGRADE_ROWS.map((r) => [norm(r.nameEn), r]));

/** 本站流派範本（入門與頂裝檔）用到的暗金：名稱 → 用到它的流派 */
export interface BuildRef { id: string; name: string; classCode: string; /** 主力技能（英文，英文版顯示用） */ main: string }
export function buildsUsing(): Map<string, BuildRef[]> {
  const out = new Map<string, BuildRef[]>();
  for (const b of BUILDS) {
    for (const tier of [b.start, b.bis]) {
      for (const it of Object.values(tier.items)) {
        const r = it && rowsByNorm.get(norm(it.nameEn));
        if (!r) continue;
        const list = out.get(r.id) ?? out.set(r.id, []).get(r.id)!;
        if (!list.some((x) => x.id === b.id)) list.push({ id: b.id, name: b.name, classCode: b.classCode, main: b.skill.main });
      }
    }
  }
  return out;
}

/**
 * 傭兵的暗金推薦（只取頭盔與身體護甲，所有傭兵都能穿）：來自 Maxroll「Mercenary」與 InvenGlobal「How to keep your mercenaries alive」。
 * 兩份來源都有的標 both；底材已是傳奇的（安達莉爾的面貌、格鬥士之禍等）沒有升級可談，不列。
 */
export const MERC_PICKS: { nameEn: string; source: 'maxroll' | 'inven' | 'both' }[] = [
  { nameEn: 'Vampiregaze', source: 'both' }, { nameEn: 'Shaftstop', source: 'both' }, { nameEn: "Duriel's Shell", source: 'inven' },
  { nameEn: 'Crown of Thieves', source: 'inven' }, { nameEn: 'Undead Crown', source: 'inven' }, { nameEn: 'Stealskull', source: 'inven' },
];

/** 無形建議：角色（耐久減半且不能修理，除非本身不可摧毀）與傭兵（裝備不損耗耐久）不同。note 只在有例外要說明時才有 */
export function etherealAdvice(r: Pick<UpgradeRow, 'indestructible'>, who: 'player' | 'merc'): { ok: boolean; note?: { zh: string; en: string } } {
  if (who === 'merc') return { ok: true };
  if (r.indestructible) return { ok: true, note: { zh: '本身不可摧毀，沒有耐久問題', en: 'Indestructible, so durability is no issue' } };
  return { ok: false };
}

export interface UpgradeRecipe { row: number; kind: 'weapon' | 'armor'; step: 'exceptional' | 'elite'; inputs: { code: string; nameEn: string; name: string }[]; levelReq: number }
const RECIPE_ROWS = [131, 132, 133, 134];
const itemName = (code: string): { nameEn: string; name: string } => { const b = baseByCode.get(code); return { nameEn: b?.nameEnUS ?? b?.nameEn ?? code, name: b?.name ?? b?.nameEnUS ?? code }; };
/** 四條升級配方（普通→擴充、擴充→傳奇，武器與防具各一）。第一個輸入是要升級的那件暗金，其餘是材料 */
export const UPGRADE_RECIPES: UpgradeRecipe[] = (Object.values(cubeJson) as { row: number; inputs: string[]; mods: { code: string; min: number }[] }[])
  .filter((r) => RECIPE_ROWS.includes(r.row))
  .map((r) => ({
    row: r.row,
    kind: r.inputs[0].startsWith('"weap') ? 'weapon' : 'armor',
    step: r.inputs[0].includes(',exc,') ? 'elite' : 'exceptional',
    inputs: r.inputs.slice(1).map((c) => ({ code: c, ...itemName(c) })),
    levelReq: r.mods.find((m) => m.code === 'levelreq')?.min ?? 0,
  }));
