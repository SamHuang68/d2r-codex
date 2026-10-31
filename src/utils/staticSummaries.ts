/**
 * 建置時產生的靜態內容摘要：放進各分頁靜態外殼的 <noscript>，讓不執行 JavaScript 的爬蟲也看得到各頁的實際內容
 * （名稱、基本資料），並用連結指向每個單品頁。只讀網站本身的資料模組，不依賴瀏覽器，所以任何建置環境都能跑（vite.config.ts 的 staticRoutes 呼叫）。
 * 名稱與畫面一致：畫面上的名稱同樣來自這些資料。
 */
import basesJson from '../data/game/bases.json';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { RUNEWORDS_DATA } from '../data/runewords';

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface Base { code: string; type?: string; name: string; nameEn: string; nameEnUS?: string; levelReq?: number }

const section = (title: string, items: string[]) => `<section><h2>${esc(title)}（${items.length}）</h2><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></section>`;

/** 清單裡每一項都連到單品網址（相對網站根目錄：頁面的 <base> 指向根目錄，所以寫 items/<id>/），讓爬蟲順著連結就能走到每個單品頁 */
const link = (tab: string, id: string, label: string) => `<a href="${tab}/${encodeURIComponent(id)}/">${esc(label)}</a>`;

function uniques(): string {
  return section('暗金裝備', UNIQUE_ITEMS_DATA.map((u) => `${link('items', u.id, `${u.name}（${u.nameEn}）`)}－${esc(u.baseItem)}${u.requiredLevel ? `，需求等級 ${u.requiredLevel}` : ''}`));
}

function sets(): string {
  return section('套裝裝備', SET_ITEMS_DATA.map((set) => `${link('items', set.id, `${set.name}（${set.nameEn}）`)}：${set.pieces.map((p) => link('items', p.id, `${p.name}（${p.nameEn}）`)).join('、')}`));
}

function runewords(): string {
  return section('符文之語', RUNEWORDS_DATA.map((rw) => `${link('runewords', rw.id, `${rw.name}（${rw.nameEn}）`)}：${rw.runes.map(esc).join(' + ')}，${rw.sockets} 孔${rw.allowedBases.length ? `，${esc(rw.allowedBases.join('、'))}` : ''}`));
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
