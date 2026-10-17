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
});
