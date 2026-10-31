import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { ROUTES, ITEM_TABS, SITE_ORIGIN } from './src/utils/routes';
import { itemPages } from './src/utils/staticItemPages';
import { staticSummary } from './src/utils/staticSummaries';

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

const SITE_TITLE = '聖休亞瑞典藏中樞 | D2R Sanctuary Codex';
const escapeAttr = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * 真路由（/items/、/runewords/…）：
 * - 開發與建置都把 index.html 裡的 __TABS__ 換成分頁名單（網站根目錄推算用）。
 * - 建置後為每個分頁寫一份靜態 HTML 外殼（dist/<分頁>/index.html）：標題、描述、canonical、分享預覽各自獨立，
 *   並寫死 <base href="../"> 讓相對路徑的資源從網站根目錄載入；<noscript> 裡放全站連結，讓不跑 JS 的爬蟲也能順著連結走。
 *   靜態主機（GitHub Pages、Cloudflare Pages）直接回應 /items/ 就是這份檔，不必靠 404 後備。
 * - 同時輸出 sitemap.xml，並把各分頁網址的快取規則補進 _headers。
 */
const staticRoutes = (): Plugin => {
  let outDir = 'dist';
  return {
    name: 'static-routes',
    configResolved(cfg) { outDir = path.resolve(cfg.root, cfg.build.outDir); },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('__TABS__', JSON.stringify(ROUTES.map((r) => r.id))).replace('__ITEM_TABS__', JSON.stringify(ITEM_TABS));
      },
    },
    closeBundle() {
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const home = fs.readFileSync(indexPath, 'utf8');
      const nl = home.includes('\r\n') ? '\r\n' : '\n';
      const urlOf = (pathPart: string) => `${SITE_ORIGIN}/${pathPart}`;
      interface Page { path: string; depth: number; title: string; description: string; summary: string; selfId?: string }
      const noscript = (pg: Page) => [
        '<noscript>',
        `  <main><h1>${escapeAttr(pg.title)}</h1><p>${escapeAttr(pg.description)}</p><p>此網站需要啟用 JavaScript 才能瀏覽完整互動內容；以下是本頁收錄的內容。</p>${pg.summary}`,
        '  <nav><ul>' + ROUTES.filter((r) => r.id !== pg.selfId).map((r) => `<li><a href="${'../'.repeat(pg.depth)}${r.id === 'overview' ? '' : `${r.id}/`}">${escapeAttr(r.title)}</a></li>`).join('') + '</ul></nav></main>',
        '</noscript>',
      ].join(nl);
      const render = (pg: Page) => {
        const t = escapeAttr(pg.title), d = escapeAttr(pg.description), u = urlOf(pg.path);
        let out = home
          .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
          .replace('</head>', `    <link rel="canonical" href="${u}" />${nl}  </head>`)
          .replace('<div id="root"></div>', `<div id="root"></div>${nl}    ${noscript(pg)}`);
        if (pg.depth > 0) out = out.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />${nl}    <base href="${'../'.repeat(pg.depth)}" />`);
        return out;
      };
      const pages: Page[] = ROUTES.map((r) => ({
        path: r.id === 'overview' ? '' : `${r.id}/`,
        depth: r.id === 'overview' ? 0 : 1,
        title: r.id === 'overview' ? SITE_TITLE : `${r.title} | ${SITE_TITLE}`,
        description: r.description,
        summary: staticSummary(r.id),
        selfId: r.id,
      }));
      for (const ip of itemPages()) {
        const tabTitle = ROUTES.find((r) => r.id === ip.tab)!.title;
        pages.push({
          path: `${ip.tab}/${encodeURIComponent(ip.id)}/`,
          depth: 2,
          title: `${ip.title} | ${SITE_TITLE}`,
          description: ip.description,
          summary: ip.bodyHtml + `<p><a href="../">${escapeAttr(tabTitle)}</a></p>`,
          selfId: undefined,
        });
      }
      for (const pg of pages) {
        const file = pg.path ? path.join(outDir, ...pg.path.split('/').filter(Boolean), 'index.html') : indexPath;
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, render(pg));
      }
      const headersPath = path.join(outDir, '_headers');
      if (fs.existsSync(headersPath)) {
        const extra = [...ROUTES.filter((r) => r.id !== 'overview').map((r) => `/${r.id}/`), ...ITEM_TABS.map((t) => `/${t}/*`)].map((p) => `${p}${nl}  Cache-Control: no-cache${nl}`).join(nl);
        fs.appendFileSync(headersPath, `${nl}# 各分頁的靜態外殼（vite.config.ts 的 staticRoutes 產生）：和首頁一樣每次重新確認${nl}${extra}`);
      }
      const today = new Date().toISOString().slice(0, 10);
      const urls = pages.map((pg) => `  <url><loc>${urlOf(pg.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n');
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prefetchDataChunks(), staticRoutes()],
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
