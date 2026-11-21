/**
 * D2R Sanctuary Codex — 輕量離線快取 Service Worker
 * - 頁面導覽（HTML）：Network-First，確保連線時永遠拿到最新版本；離線時退回快取。
 * - 帶雜湊建置檔（/assets/）與遊戲素材圖（/images/）：Cache-First，加速重複載入並支援離線查表。
 * - 只快取同源且 HTTP 200 的正常回應，不攔截跨網域請求，也不快取 404，與既有 chunk 更新自動重整相容。
 */
const CACHE_NAME = 'd2r-codex-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('d2r-codex-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      ),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 1. HTML 導覽：優先走網路，離線才讀快取
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match(new URL('./', self.registration.scope).href)),
        ),
    );
    return;
  }

  // 2. 建置檔（/assets/）：Network-First，連線時走瀏覽器既有 HTTP 快取與 chunk 重整機制；離線時退回 SW 快取
  if (/\/assets\//.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  // 3. 遊戲圖檔（/images/、/mirror/）：Cache-First
  if (/\/(images|mirror)\//.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      }),
    );
  }
});
