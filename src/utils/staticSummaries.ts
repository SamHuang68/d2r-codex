/**
 * 建置時產生的靜態內容摘要：放進各分頁靜態外殼的 <noscript>，讓不執行 JavaScript 的爬蟲也看得到各頁的實際內容
 * （名稱、基本資料）。只讀遊戲資料表 JSON，不依賴瀏覽器，所以任何建置環境都能跑（vite.config.ts 的 staticRoutes 呼叫）。
 * 名稱與畫面一致：畫面上的名稱同樣來自這些資料表。
 */
import uniquesJson from '../data/game/uniques.json';
import setItemsJson from '../data/game/setItems.json';
import runewordsJson from '../data/game/runewords.json';
import basesJson from '../data/game/bases.json';
import overlayJson from '../data/codex/overlay.json';

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface Unique { id: string; nameEn: string; nameEnUS?: string; name: string; baseName?: string; levelReq?: number; spawnable?: boolean }
interface SetItem { id: string; nameEn: string; nameEnUS?: string; name: string; set: string; setNameEn?: string; baseName?: string }
interface Runeword { id: string; nameEn: string; nameEnUS?: string; name: string; itypes: string[]; runes: string[]; runeNamesEn: string[]; sockets: number }
interface Base { code: string; type?: string; name: string; nameEn: string; nameEnUS?: string; levelReq?: number }

/** 任務物品：不是掉落裝備，百科頁也不列（與 src/data/uniqueItems.ts 同一規則） */
const QUEST_ITEMS = new Set(['Amulet of the Viper', 'Staff of Kings', 'Horadric Staff', 'Hell Forge Hammer', 'KhalimFlail', 'SuperKhalimFlail']);
const overlay = overlayJson as unknown as { uniques: Record<string, { id?: string }> };

const ITYPE_ZH: Record<string, string> = {
  weap: '武器', mele: '近戰武器', miss: '弓或弩', swor: '刀劍', axe: '斧', mace: '釘鎚', club: '短棒', hamm: '重槌', scep: '權杖',
  pole: '長柄武器', spea: '長矛', staf: '法杖', wand: '魔杖', knif: '匕首', h2h: '爪或拳刃',
  tors: '護甲', helm: '頭盔', shld: '盾牌', pala: '聖騎士盾牌', ashd: '聖騎士盾牌', head: '巫毒頭顱', grim: '魔典',
};

const section = (title: string, items: string[]) => `<section><h2>${esc(title)}（${items.length}）</h2><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></section>`;

function uniques(): string {
  const rows = (uniquesJson as unknown as Unique[]).filter((r) => !!overlay.uniques[r.id]?.id || (!QUEST_ITEMS.has(r.nameEn) && r.spawnable !== false));
  return section('暗金裝備', rows.map((r) => `${esc(r.name)}（${esc(r.nameEnUS ?? r.nameEn)}）${r.baseName ? `－${esc(r.baseName)}` : ''}${r.levelReq ? `，需求等級 ${r.levelReq}` : ''}`));
}

function sets(): string {
  const bySet = new Map<string, SetItem[]>();
  for (const r of setItemsJson as unknown as SetItem[]) (bySet.get(r.set) ?? bySet.set(r.set, []).get(r.set)!).push(r);
  const rows = [...bySet.entries()].map(([name, pieces]) => `${esc(name)}${pieces[0].setNameEn ? `（${esc(pieces[0].setNameEn)}）` : ''}：${pieces.map((p) => `${esc(p.name)}（${esc(p.nameEnUS ?? p.nameEn)}）`).join('、')}`);
  return section('套裝裝備', rows);
}

function runewords(): string {
  const rows = (runewordsJson as unknown as Runeword[]).filter((r) => r.id !== 'hustle_weapon_172').map((r) => {
    const types = [...new Set(r.itypes.map((t) => ITYPE_ZH[t]).filter(Boolean))].join('、');
    return `${esc(r.name)}（${esc(r.nameEnUS ?? r.nameEn)}）：${r.runeNamesEn.map((n) => esc(n.replace(/ Rune$/, ''))).join(' + ')}，${r.sockets} 孔${types ? `，${esc(types)}` : ''}`;
  });
  return section('符文之語', rows);
}

function runes(): string {
  const rows = (basesJson as unknown as Base[]).filter((b) => b.type === 'rune').map((b) => ({ b, n: Number(b.code.replace(/\D/g, '')) })).sort((x, y) => x.n - y.n)
    .map(({ b, n }) => `${n}. ${esc(b.name.replace(/^符文[：:]/, ''))}（${esc((b.nameEnUS ?? b.nameEn).replace(/ Rune$/, ''))}）${b.levelReq ? `，需求等級 ${b.levelReq}` : ''}`);
  return section('符文', rows);
}

/** 分頁 id → 該頁的靜態內容摘要（HTML 片段）；沒有列出的分頁沒有摘要 */
export const staticSummary = (id: string): string => {
  switch (id) {
    case 'items': return uniques() + sets();
    case 'runewords': return runewords();
    case 'runes': return runes();
    default: return '';
  }
};
