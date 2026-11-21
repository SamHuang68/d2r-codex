import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 網站改版後，開著舊頁面的人點到「尚未載入」的分頁時，舊的 chunk（檔名帶雜湊）已不在伺服器上，載入失敗會整頁空白。
// 整頁重新整理一次就會拿到新版。用 sessionStorage 記一筆時間，同一分頁 60 秒內只重整一次，真的連不上網時才不會無限重整。
window.addEventListener('vite:preloadError', (event) => {
  try {
    const last = Number(sessionStorage.getItem('chunkReloadAt') || 0);
    if (Date.now() - last < 60_000) return;
    sessionStorage.setItem('chunkReloadAt', String(Date.now()));
  } catch {
    return; // 無法記錄就不重整，寧可不動也不要有無限重整的風險
  }
  event.preventDefault();
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 正式環境註冊輕量離線快取 Service Worker（依 <base> 定位 sw.js，相容自訂網域與子路徑部署）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', document.baseURI).href;
    navigator.serviceWorker.register(swUrl).catch(() => {
      /* 瀏覽器封鎖或非安全來源時靜默略過，不影響正常使用 */
    });
  });
}
