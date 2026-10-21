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
          // 資料與引擎合成「同一個」chunk：百科頁的資料層由遊戲資料表即時產生，與引擎彼此共用模組。
          // 以前把 uniqueItems／setItems 與 runewords／bases 切成兩個 chunk，它們互相匯入（循環），
          // 上線後執行順序一錯就整頁空白（Cannot access 'x' before initialization）。合成一個 chunk 就不會有 chunk 之間的環；
          // scripts/check_chunk_cycles.mjs 會在 CI 檢查建置產物沒有循環匯入。
          if (id.includes('/src/data/') || id.includes('/src/engine/')) {
            return 'data';
          }
        }
      }
    }
  }
});
