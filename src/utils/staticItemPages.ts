/**
 * 單品網址（/runewords/enigma/）的靜態頁內容：建置時從遊戲資料表產生每個單品的標題、描述與屬性清單，
 * 由 vite.config.ts 的 staticRoutes 寫成各自的靜態 HTML 外殼（不依賴瀏覽器）。
 */
import { RUNEWORDS_DATA } from '../data/runewords';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';

/** 連結一律相對於網站根目錄（單品外殼寫死了指向根目錄的 <base>），例如 items/<id>/ */
export interface ItemPage { lang: 'zh' | 'en'; tab: string; id: string; /** 中文名與英文名（結構化資料用） */ name: string; nameEn: string; title: string; description: string; bodyHtml: string }

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const runewordPages = (): ItemPage[] => RUNEWORDS_DATA.map((rw) => {
  const name = `${rw.name}（${rw.nameEn}）`;
  const bases = rw.allowedBases.join('、');
  const runes = rw.runes.join(' + ');
  const facts = `符文組合 ${runes}，${rw.sockets} 孔，需求等級 ${rw.requiredLevel}，可用於${bases}${rw.ladderOnly ? '（天梯限定）' : ''}`;
  const attrs = rw.attributes.filter((a) => !/^【.*】$/.test(a));
  return {
    lang: 'zh',
    tab: 'runewords',
    id: rw.id,
    name: rw.name,
    nameEn: rw.nameEn,
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
    lang: 'zh',
    tab: 'items',
    id: u.id,
    name: u.name,
    nameEn: u.nameEn,
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
    lang: 'zh',
    tab: 'items',
    id: set.id,
    name: set.name,
    nameEn: set.nameEn,
    title: `${setName}套裝`,
    description: clip(`${setName}：共 ${set.pieces.length} 件。${set.pieces.map((p) => p.name).join('、')}。${bonuses.slice(0, 2).join('；')}`, 200),
    bodyHtml: `<section><h2>${esc(setName)}</h2><p>${set.pieces.length} 件套裝</p><h3>部件</h3>${pieceList}<h3>套裝加成</h3>${ul(bonuses)}</section>`,
  };
  const pages = set.pieces.map((p): ItemPage => {
    const name = `${p.name}（${p.nameEn}）`;
    const facts = `${set.name}套裝的${p.baseItem}（${p.baseItemEn}），需求等級 ${p.requiredLevel}`;
    return {
      lang: 'zh',
      tab: 'items',
      id: p.id,
      name: p.name,
      nameEn: p.nameEn,
      title: `${name}套裝裝備－${set.name}`,
      description: clip(`${name}：${facts}。${p.attributes.filter(isStat).slice(0, 4).join('、')}。`, 200),
      bodyHtml: `<section><h2>${esc(name)}</h2><p>${esc(facts)}</p><h3>屬性</h3>${ul(p.attributes)}<p><a href="items/${encodeURIComponent(set.id)}/">${esc(setName)}</a></p></section>`,
    };
  });
  return [setPage, ...pages];
});


/**
 * 英文版單品頁：只放英文事實（名稱、底材、需求等級、符文組合）。屬性文字的英文資料不存在（資料表只有繁體中文的屬性字串），
 * 所以靜態頁不放屬性；互動頁（有 JavaScript）仍會顯示完整內容。
 */
const enFacts = (head: string, facts: string, note = true) => `<section><h2>${esc(head)}</h2><p>${esc(facts)}</p>${note ? '<p>Full stats are shown on the interactive page.</p>' : ''}</section>`;
const kindOf = { runeword: 'Runeword', unique: 'Unique Item', set: 'Set', piece: 'Set Item' };

const runewordPagesEn = (): ItemPage[] => RUNEWORDS_DATA.map((rw) => {
  const facts = `Runeword ${rw.nameEn}: runes ${rw.runes.join(' + ')}, ${rw.sockets} sockets, required level ${rw.requiredLevel}, for ${(rw.allowedBasesEn ?? rw.allowedBases).join(', ')}${rw.ladderOnly ? ' (ladder only)' : ''}.`;
  return { lang: 'en', tab: 'runewords', id: rw.id, name: rw.nameEn, nameEn: rw.nameEn, title: `${rw.nameEn} ${kindOf.runeword}`, description: clip(facts, 200), bodyHtml: enFacts(rw.nameEn, facts) };
});

const uniquePagesEn = (): ItemPage[] => UNIQUE_ITEMS_DATA.map((u) => {
  const facts = `Unique ${u.baseItemEn ?? u.baseItem}, required level ${u.requiredLevel}${u.ladderOnly ? ', ladder only' : ''}.`;
  return { lang: 'en', tab: 'items', id: u.id, name: u.nameEn, nameEn: u.nameEn, title: `${u.nameEn} ${kindOf.unique}`, description: clip(`${u.nameEn}: ${facts}`, 200), bodyHtml: enFacts(u.nameEn, facts) };
});

const setPagesEn = (): ItemPage[] => SET_ITEMS_DATA.flatMap((set) => {
  const setFacts = `${set.nameEn} set, ${set.pieces.length} pieces: ${set.pieces.map((p) => p.nameEn).join(', ')}.`;
  const setPage: ItemPage = {
    lang: 'en', tab: 'items', id: set.id, name: set.nameEn, nameEn: set.nameEn, title: `${set.nameEn} ${kindOf.set}`, description: clip(setFacts, 200),
    bodyHtml: `<section><h2>${esc(set.nameEn)}</h2><p>${esc(setFacts)}</p><ul>${set.pieces.map((p) => `<li><a href="en/items/${encodeURIComponent(p.id)}/">${esc(p.nameEn)}</a></li>`).join('')}</ul></section>`,
  };
  const pieces = set.pieces.map((p): ItemPage => {
    const facts = `${set.nameEn} set ${p.baseItemEn ?? p.baseItem}, required level ${p.requiredLevel}.`;
    return { lang: 'en', tab: 'items', id: p.id, name: p.nameEn, nameEn: p.nameEn, title: `${p.nameEn} ${kindOf.piece} - ${set.nameEn}`, description: clip(`${p.nameEn}: ${facts}`, 200), bodyHtml: enFacts(p.nameEn, facts) };
  });
  return [setPage, ...pieces];
});

export const itemPages = (): ItemPage[] => {
  const all = [...runewordPages(), ...uniquePages(), ...setPages(), ...runewordPagesEn(), ...uniquePagesEn(), ...setPagesEn()];
  const seen = new Set<string>();
  for (const p of all) {
    const key = `${p.lang}/${p.tab}/${p.id}`;
    if (seen.has(key)) throw new Error(`單品網址重複：${key}`);
    seen.add(key);
  }
  return all;
};
