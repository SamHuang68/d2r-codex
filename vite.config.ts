import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
