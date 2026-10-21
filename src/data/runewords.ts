/**
 * 百科頁的符文之語資料：由遊戲資料表（game/runewords.json）即時產生，不再另存一份。
 * 屬性行＝符文之語本身的屬性＋符文鑲嵌後的效果（依可用底材類型：武器／防具／盾牌），與遊戲內完成後的提示框一致。
 * 標籤、天梯標示、舊 id、舊譯名來自覆蓋層 codex/overlay.json。
 */
import type { RunewordData } from '../types';
import runewordsJson from './game/runewords.json';
import { gameData } from '../engine/data';
import type { Modifier } from '../engine/types';
import { overlay, slug, uniqueId } from './codex/common';
import { modLines } from './codex/itemLines';

interface Row { id: string; nameEn: string; nameEnUS?: string; name: string; patch?: string; itypes: string[]; etypes: string[]; runes: string[]; runeNamesEn: string[]; sockets: number; mods: Modifier[] }
const rows = runewordsJson as unknown as Row[];

/** 遊戲物品類型代碼 → 百科頁的「可用底材」中文名 */
const ITYPE_ZH: Record<string, string> = {
  weap: '武器', mele: '近戰武器', miss: '弓或弩', swor: '刀劍', axe: '斧', mace: '釘鎚', club: '短棒', hamm: '重槌', scep: '權杖',
  pole: '長柄武器', spea: '長矛', staf: '法杖', wand: '魔杖', knif: '匕首', h2h: '爪或拳刃',
  tors: '護甲', helm: '頭盔', shld: '盾牌', pala: '聖騎士盾牌', ashd: '聖騎士盾牌', head: '巫毒頭顱', grim: '魔典',
};

type Cat = 'weapon' | 'armor' | 'shield';
/** 物品類型代碼可鑲在哪一類底材（符文效果分武器／護甲／盾牌三種）：由遊戲底材的類型階層推得 */
const catOfType = new Map<string, Set<Cat>>();
for (const b of gameData.bases) {
  if (b.kind === 'misc') continue;
  const cat: Cat = b.kind === 'weapon' ? 'weapon' : b.ancestors.includes('shld') ? 'shield' : 'armor';
  for (const t of b.ancestors) (catOfType.get(t) ?? catOfType.set(t, new Set()).get(t)!).add(cat);
}
const gemByCode = new Map(gameData.gems.map((g) => [g.code, g]));
const runeLevel = new Map(gameData.bases.filter((b) => b.type === 'rune').map((b) => [b.code, b.levelReq ?? 0]));

const used = new Set<string>(Object.values(overlay.runewords).map((o) => o.id as string));

export const RUNEWORDS_DATA: RunewordData[] = rows.map((r) => {
  const o = overlay.runewords[r.id];
  const cats = new Set<Cat>(); r.itypes.forEach((t) => catOfType.get(t)?.forEach((c) => cats.add(c)));
  // 符文鑲嵌效果：武器效果一律列出；護甲與盾牌都可鑲時，兩邊效果相同者只列一次，不同者各自標註「（只限…）」
  const eff = (code: string, c: Cat) => gemByCode.get(code)?.[c] ?? [];
  const common: Modifier[] = [...r.mods];
  const tagged: Record<string, Modifier[]> = {};
  const armorLabel = r.itypes.includes('tors') ? '護甲' : r.itypes.includes('helm') ? '頭盔' : '護甲';
  for (const code of r.runes) {
    if (cats.has('weapon')) common.push(...eff(code, 'weapon'));
    if (cats.has('armor') && cats.has('shield')) {
      const a = eff(code, 'armor'); const s = eff(code, 'shield');
      if (JSON.stringify(a) === JSON.stringify(s)) common.push(...a);
      else { (tagged[armorLabel] ??= []).push(...a); (tagged['盾牌'] ??= []).push(...s); }
    } else {
      if (cats.has('armor')) common.push(...eff(code, 'armor'));
      if (cats.has('shield')) common.push(...eff(code, 'shield'));
    }
  }
  const attributes = [...modLines(common), ...Object.entries(tagged).flatMap(([tag, ms]) => modLines(ms).map((l) => `${l} （只限${tag}）`))];
  return {
    id: o?.id ?? uniqueId(slug(r.nameEnUS ?? r.nameEn), used, r.id),
    name: r.name,
    nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
    nameClassic: o?.nameClassic,
    runes: r.runeNamesEn.map((n) => n.replace(/ Rune$/, '')),
    runeNumbers: r.runes.map((c) => Number(c.replace(/\D/g, ''))),
    sockets: r.sockets,
    allowedBases: [...new Set(r.itypes.map((t) => ITYPE_ZH[t] ?? t))],
    requiredLevel: Math.max(0, ...r.runes.map((c) => runeLevel.get(c) ?? 0)),
    ladderOnly: o?.ladderOnly ?? false,
    isNewDLC: o?.isNewDLC,
    attributes,
    tags: o?.tags ?? [],
    recommendedBases: o?.recommendedBases,
    description: o?.description,
  };
});
