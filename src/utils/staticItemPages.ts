/**
 * 單品網址（/runewords/enigma/）的靜態頁內容：建置時從遊戲資料表產生每個單品的標題、描述與屬性清單，
 * 由 vite.config.ts 的 staticRoutes 寫成各自的靜態 HTML 外殼（不依賴瀏覽器）。
 */
import { RUNEWORDS_DATA } from '../data/runewords';

export interface ItemPage { tab: string; id: string; title: string; description: string; bodyHtml: string }

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export const itemPages = (): ItemPage[] => RUNEWORDS_DATA.map((rw) => {
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
