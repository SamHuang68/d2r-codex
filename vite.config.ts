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
          if (id.includes('src/data/skills')) {
            return 'data-skills';
          }
          if (id.includes('src/data/uniqueItems') || id.includes('src/data/setItems')) {
            return 'data-items';
          }
          if (id.includes('src/data/runewords') || id.includes('src/data/bases')) {
            return 'data-gear-bases';
          }
          if (id.includes('src/data/quests') || id.includes('src/data/areaLevels')) {
            return 'data-world';
          }
        }
      }
    }
  }
});
