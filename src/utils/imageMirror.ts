/**
 * 物品圖的自家鏡像：資料裡的圖片網址仍寫原站網址（static.d2r.world/img/items/…），
 * 顯示時先改用同網域下 public/mirror/d2rw/ 的備份，備份載入失敗才退回原站網址。
 * 這樣原站掛掉、改網址或限流，物品圖仍然正常；資料與對照表不用改。
 * 備份清單由 scripts/sync_item_image_mirror.mjs 依程式與資料裡出現過的網址產生並檢查。
 */
const ORIGIN_PREFIX = 'https://static.d2r.world/img/items/';

const baseUrl = (): string => {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  return env.endsWith('/') ? env : `${env}/`;
};

/** 原站網址 → 自家鏡像網址；不是原站圖（本機圖、其他網址）回傳 undefined */
export function mirrorUrl(src: string): string | undefined {
  return src.startsWith(ORIGIN_PREFIX) ? `${baseUrl()}mirror/d2rw/img/items/${src.slice(ORIGIN_PREFIX.length)}` : undefined;
}
