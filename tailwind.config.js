/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sanctuary: {
          950: '#060709',
          900: '#0b0d12',
          850: '#11141c',
          800: '#171b26',
          750: '#1e2432',
          700: '#272e3f',
          600: '#384259',
          500: '#4e5b7a',
          400: '#7583a4',
          300: '#9faacc',
          200: '#cad2e5',
          100: '#e7ecf6',
        },
        d2: {
          unique: '#cbb87f',
          'unique-dark': '#8e7f53',
          set: '#22ff55',
          'set-dark': '#139e33',
          rare: '#ffff66',
          'rare-dark': '#a3a339',
          magic: '#8080f3',
          'magic-dark': '#4b4b9b',
          rune: '#ee7a03',
          'rune-dark': '#9f5102',
          crafted: '#ee7a03',
          white: '#ffffff',
          socket: '#9ca3af',
          gold: '#d4af37',
          blood: '#dc2626',
          fire: '#f97316',
          cold: '#38bdf8',
          lightning: '#facc15',
          poison: '#4ade80',
        }
      },
      fontFamily: {
        diablo: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(203, 184, 127, 0.35)',
        'glow-red': '0 0 25px -5px rgba(220, 38, 38, 0.4)',
        'glow-green': '0 0 25px -5px rgba(34, 255, 85, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(128, 128, 243, 0.35)',
        'd2-panel': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(203, 184, 127, 0.15)',
      }
    },
  },
  plugins: [],
}
