import LZString from 'lz-string';
import { exportProfile, parseProfile, type SavedProfile } from './profileStore';

/** 網址查詢參數鍵名（例：/planner/?build=...） */
export const SHARE_QUERY_KEY = 'build';

/** 將 Profile 壓縮成可放入網址查詢參數的字串 */
export function encodeSharePayload(profile: SavedProfile): string {
  return LZString.compressToEncodedURIComponent(exportProfile(profile));
}

/** 產生包含目前配裝的完整分享網址 */
export function buildShareUrl(profile: SavedProfile, href?: string): string {
  const base = href ?? (typeof window !== 'undefined' ? window.location.href : 'https://d2r.samhuang68.org/planner/');
  const u = new URL(base);
  u.searchParams.set(SHARE_QUERY_KEY, encodeSharePayload(profile));
  return u.toString();
}

/** 解碼網址查詢參數內的壓縮字串並以既有 parseProfile 規則驗證 */
export function parseSharePayload(encoded: string, isEn = false): SavedProfile | string {
  const trimmed = encoded.trim();
  if (!trimmed) return isEn ? 'Empty share link payload' : '分享連結內容為空';
  const json = LZString.decompressFromEncodedURIComponent(trimmed);
  if (!json) return isEn ? 'Corrupted or unreadable share link' : '分享連結格式損壞或無法解碼';
  return parseProfile(json, isEn);
}

/**
 * 同時接受原始 JSON 匯出文字或完整分享網址（含 ?build=...）。
 * 讓使用者在「匯入」欄位直接貼上分享網址也能匯入。
 */
export function parseProfileOrShareUrl(input: string, isEn = false): SavedProfile | string {
  const trimmed = input.trim();
  if (!trimmed) return isEn ? 'Empty input' : '匯入內容為空';
  if (/^https?:\/\//i.test(trimmed) || trimmed.includes(`${SHARE_QUERY_KEY}=`)) {
    try {
      const u = new URL(trimmed.startsWith('http') ? trimmed : `https://example.invalid/?${trimmed.replace(/^\?/, '')}`);
      const payload = u.searchParams.get(SHARE_QUERY_KEY);
      if (payload) return parseSharePayload(payload, isEn);
    } catch {
      /* 無法當作 URL 解析時退回一般 JSON 檢查 */
    }
  }
  return parseProfile(trimmed, isEn);
}
