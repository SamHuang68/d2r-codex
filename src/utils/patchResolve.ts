/**
 * 版本改動清單（data/patchNotes.ts）的名稱解析：用 nameEn 對到現有資料裡的項目，得到中文名、單品網址的分頁與 id。
 * 頁面（PatchNotes）與建置時的靜態頁（staticSummaries）共用；對不上任何項目時直接丟錯，讓建置失敗而不是悄悄少一筆。
 */
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { RUNEWORDS_DATA } from '../data/runewords';
import { PATCH_NOTES, NON_LADDER_NOW, RUNEWORD_ALIASES, type PatchEntry } from '../data/patchNotes';

export interface ResolvedRef { name: string; nameEn: string; tab: 'items' | 'runewords'; id: string }
export interface ResolvedEntry extends ResolvedRef { entry: PatchEntry }

const lookup = new Map<string, ResolvedRef>();
for (const u of UNIQUE_ITEMS_DATA) lookup.set(`unique:${u.nameEn}`, { name: u.name, nameEn: u.nameEn, tab: 'items', id: u.id });
for (const rw of RUNEWORDS_DATA) lookup.set(`runeword:${rw.nameEn}`, { name: rw.name, nameEn: rw.nameEn, tab: 'runewords', id: rw.id });
for (const s of SET_ITEMS_DATA) {
  lookup.set(`set:${s.nameEn}`, { name: s.name, nameEn: s.nameEn, tab: 'items', id: s.id });
  for (const p of s.pieces) lookup.set(`setItem:${p.nameEn}`, { name: p.name, nameEn: p.nameEn, tab: 'items', id: p.id });
}

const must = (key: string): ResolvedRef => {
  const r = lookup.get(key);
  if (!r) throw new Error(`版本改動清單的項目在資料裡找不到：${key}（nameEn 要與資料表一致）`);
  return r;
};

export const resolvedPatchNotes = (): ResolvedEntry[] => PATCH_NOTES.map((entry) => ({ ...must(`${entry.kind}:${entry.nameEn}`), entry }));

/**
 * 「非天梯新增」清單：名稱可能是暗金、套裝或符文之語，依序嘗試。
 * 找不到的（文章列了、但本站資料沒有的項目，例如 Mania、Hysteria）不丟錯，保留英文名並標示 ref 為 undefined，頁面註明「本站尚未收錄」。
 */
export interface NonLadderRef { nameEn: string; ref?: ResolvedRef; aliasNote?: { zh: string; en: string } }
export const resolvedNonLadder = (): { items: NonLadderRef[]; runewords: NonLadderRef[] } => ({
  items: NON_LADDER_NOW.items.map((n) => ({ nameEn: n, ref: lookup.get(`unique:${n}`) ?? lookup.get(`set:${n}`) })),
  runewords: NON_LADDER_NOW.runewords.map((n) => {
    const alias = RUNEWORD_ALIASES[n];
    if (alias) {
      // 別名：對到合併後的那一筆，但顯示文章用的名稱（中文名用遊戲裡該版本的名稱）；對不上就丟錯，避免別名悄悄失效
      const target = must(`runeword:${alias.resolveAs}`);
      return { nameEn: n, ref: { ...target, name: alias.zh, nameEn: n }, aliasNote: { zh: alias.noteZh, en: alias.noteEn } };
    }
    return { nameEn: n, ref: lookup.get(`runeword:${n}`) };
  }),
});
