import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 首頁載完、閒下來之後，在背景預先抓好「百科各頁共用的大資料 chunk」（遊戲資料、暗金、符文之語、技能、描述…），
 * 使用者點進百科或配裝模擬時直接從快取取，不必等下載（節流慢速網路下進頁約 2.5～2.9 秒 → 只剩執行與繪製）。
 * 只抓、不執行（<link rel=prefetch>，最低優先權）；使用者開了省流量模式或連線不是 4g 就不抓。
 * 這些 chunk 的名字來自模組名稱（data.ts、uniques.json…），改名時 scripts/smoke_dist.mjs 會因找不到預先抓取連結而失敗。
 */
const PREFETCH_CHUNKS = ['data', 'uniques', 'runewords', 'skills', 'describe', 'catalogImage', 'common', 'setItems'];
const prefetchDataChunks = (): Plugin => ({
  name: 'prefetch-data-chunks',
  transformIndexHtml: {
    order: 'post',
    handler(_html, ctx) {
      if (!ctx.bundle) return undefined;
      const files = Object.values(ctx.bundle)
        .filter((c) => c.type === 'chunk' && !c.isEntry && PREFETCH_CHUNKS.includes(c.name))
        .map((c) => `./${c.fileName}`);
      if (!files.length) return undefined;
      const code = `addEventListener('load',function(){var c=navigator.connection;if(c&&(c.saveData||(c.effectiveType&&c.effectiveType!=='4g')))return;setTimeout(function(){${JSON.stringify(files)}.forEach(function(u){var l=document.createElement('link');l.rel='prefetch';l.as='script';l.crossOrigin='';l.href=u;document.head.appendChild(l)})},2000)})`;
      return [{ tag: 'script', children: code, injectTo: 'head' }];
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prefetchDataChunks()],
  base: './', // relative base for versatile static hosting
  server: {
    port: 3000,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          // 資料與引擎不手動分 chunk：百科各頁與搜尋面板已改為進頁面才載入（React.lazy），Rollup 會依匯入關係自動切。
          // 以前手動切成 data-items／data-gear-bases 會互相匯入（循環），上線後整頁空白；後來合成單一 data chunk 雖然沒有環，
          // 但只要首頁有一個元件匯入其中一個模組，1.3 MB 就整包跟著首頁載入。
          // scripts/check_chunk_cycles.mjs 與 scripts/smoke_dist.mjs 會在 CI 檢查建置產物沒有循環且能載入。
        }
      }
    }
  }
});
