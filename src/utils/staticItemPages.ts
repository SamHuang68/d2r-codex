/**
 * 單品網址（/runewords/enigma/）的靜態頁內容：建置時從遊戲資料表產生每個單品的標題、描述與屬性清單，
 * 由 vite.config.ts 的 staticRoutes 寫成各自的靜態 HTML 外殼（不依賴瀏覽器）。
 */
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';

/** 連結一律相對於網站根目錄（單品外殼寫死了指向根目錄的 <base>），例如 items/<id>/ */
export interface ItemPage { tab: string; id: string; title: string; description: string; bodyHtml: string }

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const runewordPages = (): ItemPage[] => RUNEWORDS_DATA.map((rw) => {
  const name = `${rw.name}（${rw.nameEn}）`;
  const bases = rw.allowedBases.join('、');
  const runes = rw.runes.join(' + ');
  const facts = `符文組合 ${runes}，${rw.sockets} 孔，需求等級 ${rw.requiredLevel}，可用於${bases}${rw.ladderOnly ? '（天梯限定）' : ''}`;
  const attrs = rw.attributes.filter((a) => !/^【.*】$/.test(a));
  return {
    tab: 'runewords',
    id: rw.id,
    title: `${name}符文之語配方`,
    description: clip(`${name}：${facts}。${attrs.slice(0, 4).join('、')}。`, 200),
    bodyHtml: `<section><h2>${esc(name)}</h2><p>${esc(facts)}</p><h3>屬性</h3><ul>${rw.attributes.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></section>`,
  };
});

const ul = (lines: string[]) => `<ul>${lines.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>`;
/** 需求／耐久這類基底行不放進描述，只留實際屬性 */
const isStat = (a: string) => !/^(單手傷害|雙手傷害|需要|耐久度|範圍|武器基本速度|防禦|格擋率|可使用)/.test(a) && !/^【.*】$/.test(a);

const uniquePages = (): ItemPage[] => UNIQUE_ITEMS_DATA.map((u) => {
  const name = `${u.name}（${u.nameEn}）`;
  const facts = `暗金${u.baseItem}（${u.baseItemEn}），需求等級 ${u.requiredLevel}${u.ladderOnly ? '，天梯限定' : ''}`;
  const stats = u.attributes.filter(isStat);
  return {
    tab: 'items',
    id: u.id,
    title: `${name}暗金裝備`,
    description: clip(`${name}：${facts}。${stats.slice(0, 4).join('、')}。`, 200),
    bodyHtml: `<section><h2>${esc(name)}</h2><p>${esc(facts)}</p><h3>屬性</h3>${ul(u.attributes)}${u.flavorText ? `<p>${esc(u.flavorText)}</p>` : ''}</section>`,
  };
});

const setPages = (): ItemPage[] => SET_ITEMS_DATA.flatMap((set) => {
  const setName = `${set.name}（${set.nameEn}）`;
  const pieceList = `<ul>${set.pieces.map((p) => `<li><a href="items/${encodeURIComponent(p.id)}/">${esc(p.name)}（${esc(p.nameEn)}）</a></li>`).join('')}</ul>`;
  const bonuses = [
    ...(set.partialBonuses ?? []).map((b) => `${b.count} 件：${b.bonus}`),
    ...(set.fullBonuses?.length ? [`全套：${set.fullBonuses.join('、')}`] : []),
  ];
  const setPage: ItemPage = {
    tab: 'items',
    id: set.id,
    title: `${setName}套裝`,
    description: clip(`${setName}：共 ${set.pieces.length} 件。${set.pieces.map((p) => p.name).join('、')}。${bonuses.slice(0, 2).join('；')}`, 200),
    bodyHtml: `<section><h2>${esc(setName)}</h2><p>${set.pieces.length} 件套裝</p><h3>部件</h3>${pieceList}<h3>套裝加成</h3>${ul(bonuses)}</section>`,
  };
  const pages = set.pieces.map((p): ItemPage => {
    const name = `${p.name}（${p.nameEn}）`;
    const facts = `${set.name}套裝的${p.baseItem}（${p.baseItemEn}），需求等級 ${p.requiredLevel}`;
    return {
      tab: 'items',
      id: p.id,
      title: `${name}套裝裝備－${set.name}`,
      description: clip(`${name}：${facts}。${p.attributes.filter(isStat).slice(0, 4).join('、')}。`, 200),
      bodyHtml: `<section><h2>${esc(name)}</h2><p>${esc(facts)}</p><h3>屬性</h3>${ul(p.attributes)}<p><a href="items/${encodeURIComponent(set.id)}/">${esc(setName)}</a></p></section>`,
    };
  });
  return [setPage, ...pages];
});

export const itemPages = (): ItemPage[] => {
  const all = [...runewordPages(), ...uniquePages(), ...setPages()];
  const seen = new Set<string>();
  for (const p of all) {
    const key = `${p.tab}/${p.id}`;
    if (seen.has(key)) throw new Error(`單品網址重複：${key}`);
    seen.add(key);
  }
  return all;
};
