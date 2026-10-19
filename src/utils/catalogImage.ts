import type { CatalogEntry } from '../engine/catalog';
import imageMap from '../data/catalogImageMap.json';

/**
 * 模擬器目錄項目（引擎的 getCatalog）→ 物品圖片。
 *
 * 對照表 src/data/catalogImageMap.json 以「資料頁的 imageUrl」為準產生（1173 筆全涵蓋）：
 * - 暗金／套裝：以英文名正規化對應；遊戲資料拼字有誤者改用中文名與部位交叉比對
 * - 符文之語／白裝底材：用底材（baseCode）的圖，所以換底材後要重新取
 * 數值為 null 表示確定沒有圖，呼叫端應顯示文字佔位，而不是退回關鍵字猜圖。
 */
type MapShape = { byId: Record<string, string | null>; byBaseCode: Record<string, string | null> };
const MAP = imageMap as MapShape;
const REMOTE_PREFIX = 'https://static.d2r.world/img/items/';

const absolute = (v: string): string => {
  if (v.startsWith('images/')) {
    const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
    return `${env.endsWith('/') ? env : `${env}/`}${v}`;
  }
  return `${REMOTE_PREFIX}${v}`;
};

/** 回傳圖片網址；沒有對應時回傳空字串（呼叫端應顯示佔位，不要再猜） */
export function imageForEntry(e: Pick<CatalogEntry, 'id' | 'kind' | 'baseCode'>): string {
  const byBase = MAP.byBaseCode[e.baseCode];
  const v = e.kind === 'runeword' || e.kind === 'base'
    ? byBase
    : (e.id in MAP.byId ? MAP.byId[e.id] : byBase);
  return v ? absolute(v) : '';
}
