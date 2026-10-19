import { getCatalog, eligibleBases, withBase, getSocketables, type CatalogEntry } from '../engine/catalog';
import type { Equipped, EquippedMap, DollSlot } from '../components/simulator/v2/types';
import type { PresetItem, SimPreset } from './simulatorPresets';

export interface ResolvedPreset { equipped: EquippedMap; charms: CatalogEntry[]; errors: string[] }

const norm = (s: string) => s.toLowerCase();

function resolveItem(it: PresetItem, errors: string[]): Equipped | undefined {
  const cat = getCatalog();
  const cands = cat.filter((e) => norm(e.nameEn) === norm(it.nameEn));
  let entry = cands.find((e) => e.kind !== 'base') ?? cands[0];
  if (!entry) { errors.push(`找不到物品「${it.nameEn}」`); return undefined; }
  if (it.baseNameEn) {
    const b = eligibleBases(entry).find((x) => norm(x.nameEn) === norm(it.baseNameEn!));
    if (!b) { errors.push(`「${it.nameEn}」不能使用底材「${it.baseNameEn}」`); return undefined; }
    entry = withBase(entry, b.code);
  }
  const socks: string[] = [];
  for (const n of it.sockets ?? []) {
    const s = getSocketables().find((x) => norm(x.nameEn) === norm(n));
    if (!s) errors.push(`找不到鑲嵌物「${n}」`); else socks.push(s.id);
  }
  return { entry, ethereal: it.ethereal, sockets: socks.length ? socks : undefined, socketCount: it.socketCount };
}

export function resolvePreset(p: SimPreset): ResolvedPreset {
  const errors: string[] = []; const equipped: EquippedMap = {};
  (Object.keys(p.items) as DollSlot[]).forEach((k) => { const r = resolveItem(p.items[k]!, errors); if (r) equipped[k] = r; });
  const charms: CatalogEntry[] = [];
  p.charms.forEach((c) => { const r = resolveItem(c, errors); if (r) charms.push(r.entry); });
  return { equipped, charms, errors };
}
