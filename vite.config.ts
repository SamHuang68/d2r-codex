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
      const code = `addEventListener('load',function(){var c=navigator.connection;if(c&&(c.saveData||(c.effectiveType&&c.effectiveType!=='4g')))return;setTimeout(function(){performance.mark('prefetch-start');${JSON.stringify(files)}.forEach(function(u){var l=document.createElement('link');l.rel='prefetch';l.as='script';l.crossOrigin='';l.href=u;document.head.appendChild(l)})},2000)})`;
      return [{ tag: 'script', children: code, injectTo: 'head' }];
    },
  },
});

const SITE_TITLE = '聖休亞瑞典藏中樞 | D2R Sanctuary Codex';
const SITE_TITLE_EN = 'Sanctuary Codex | D2R Database';
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
      type L = 'zh' | 'en';
      interface Page { lang: L; key: string; path: string; depth: number; title: string; description: string; summary: string; selfId?: string; ogImage: string; ld: object[] }
      const prefixOf = (l: L) => (l === 'en' ? 'en/' : '');
      const siteTitle = (l: L) => (l === 'en' ? SITE_TITLE_EN : SITE_TITLE);
      const noscript = (pg: Page) => [
        '<noscript>',
        `  <main><h1>${escapeAttr(pg.title)}</h1><p>${escapeAttr(pg.description)}</p><p>${pg.lang === 'en' ? 'This site needs JavaScript for the full interactive experience; below is what this page covers.' : '此網站需要啟用 JavaScript 才能瀏覽完整互動內容；以下是本頁收錄的內容。'}</p>${pg.summary}`,
        '  <nav><ul>' + ROUTES.filter((r) => r.id !== pg.selfId).map((r) => `<li><a href="${r.id === 'overview' ? (pg.lang === 'en' ? 'en/' : './') : `${prefixOf(pg.lang)}${r.id}/`}">${escapeAttr(pg.lang === 'en' ? r.titleEn : r.title)}</a></li>`).join('') + '</ul></nav></main>',
        '</noscript>',
      ].join(nl);
      // 同一頁的兩種語言版本：hreflang 互相指向，x-default 指向中文版
      const altOf = (pg: Page) => {
        const zhUrl = urlOf(pg.key ? `${pg.key}/` : '');
        const enUrl = urlOf(`en/${pg.key ? `${pg.key}/` : ''}`);
        return [{ hreflang: 'zh-Hant', href: zhUrl }, { hreflang: 'en', href: enUrl }, { hreflang: 'x-default', href: zhUrl }];
      };
      const render = (pg: Page) => {
        const t = escapeAttr(pg.title), d = escapeAttr(pg.description), u = urlOf(pg.path);
        const alts = altOf(pg).map((a) => `    <link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`).join(nl);
        let out = home
          .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${u}$2`)
          .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${pg.ogImage}$2`)
          .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${pg.ogImage}$2`)
          .replace(/(<meta property="og:image:height" content="[^"]*" \/>)/, `$1${nl}    <meta property="og:image:alt" content="${t}" />`)
          .replace(/(<meta name="twitter:card" content="[^"]*" \/>)/, `$1${nl}    <meta name="twitter:title" content="${t}" />${nl}    <meta name="twitter:description" content="${d}" />`)
          // 結構化資料（JSON-LD）：< 一律跳脫，避免內容裡的字串提早結束 <script>
          .replace('</head>', `    <link rel="canonical" href="${u}" />${nl}${alts}${nl}    <script type="application/ld+json">${JSON.stringify(pg.ld.length === 1 ? pg.ld[0] : { '@context': 'https://schema.org', '@graph': pg.ld }).replace(/</g, '\\u003c').replace(/^\{/, pg.ld.length === 1 ? '{"@context":"https://schema.org",' : '{')}</script>${nl}  </head>`)
          .replace('<div id="root"></div>', `<div id="root"></div>${nl}    ${noscript(pg)}`);
        if (pg.lang === 'en') out = out.replace('<html lang="zh-TW"', '<html lang="en"').replace(/(<meta property="og:locale" content=")[^"]*(")/, '$1en_US$2');
        if (pg.depth > 0) out = out.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />${nl}    <base href="${'../'.repeat(pg.depth)}" />`);
        return out;
      };
      const siteRef = (l: L) => ({ '@type': 'WebSite', '@id': `${SITE_ORIGIN}/${prefixOf(l)}#website`, name: l === 'en' ? 'Sanctuary Codex' : '聖休亞瑞典藏中樞', alternateName: l === 'en' ? '聖休亞瑞典藏中樞' : 'D2R Sanctuary Codex', url: urlOf(prefixOf(l)), inLanguage: l === 'en' ? 'en' : 'zh-TW' });
      const crumbs = (items: { name: string; path: string }[]) => ({
        '@type': 'BreadcrumbList',
        itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: urlOf(it.path) })),
      });
      const ogFor = (l: L, tab: string) => (tab === 'overview' ? `${SITE_ORIGIN}/og.png` : `${SITE_ORIGIN}/og/${l === 'en' ? 'en/' : ''}${tab}.jpg`);
      const pages: Page[] = [];
      for (const l of ['zh', 'en'] as L[]) {
        const pf = prefixOf(l);
        const lg = l === 'en' ? 'en' : 'zh-TW';
        for (const r of ROUTES) {
          const name = l === 'en' ? r.titleEn : r.title;
          const desc = l === 'en' ? r.descriptionEn : r.description;
          const key = r.id === 'overview' ? '' : r.id;
          const pagePath = `${pf}${key ? `${key}/` : ''}`;
          pages.push({
            lang: l,
            key,
            path: pagePath,
            depth: (l === 'en' ? 1 : 0) + (key ? 1 : 0),
            title: r.id === 'overview' ? siteTitle(l) : `${name} | ${siteTitle(l)}`,
            description: desc,
            summary: staticSummary(r.id, l),
            selfId: r.id,
            ogImage: ogFor(l, r.id),
            ld: r.id === 'overview'
              ? [siteRef(l)]
              : [
                  { '@type': 'WebPage', '@id': urlOf(pagePath), url: urlOf(pagePath), name, description: desc, inLanguage: lg, isPartOf: { '@id': siteRef(l)['@id'] } },
                  crumbs([{ name: l === 'en' ? 'Home' : '首頁', path: pf }, { name, path: pagePath }]),
                ],
          });
        }
      }
      for (const ip of itemPages()) {
        const l = ip.lang as L;
        const pf = prefixOf(l);
        const tabRoute = ROUTES.find((r) => r.id === ip.tab)!;
        const tabTitle = l === 'en' ? tabRoute.titleEn : tabRoute.title;
        const key = `${ip.tab}/${encodeURIComponent(ip.id)}`;
        const pagePath = `${pf}${key}/`;
        pages.push({
          lang: l,
          key,
          path: pagePath,
          depth: (l === 'en' ? 1 : 0) + 2,
          title: `${ip.title} | ${siteTitle(l)}`,
          description: ip.description,
          summary: ip.bodyHtml + `<p><a href="${pf}${ip.tab}/">${escapeAttr(tabTitle)}</a></p>`,
          selfId: undefined,
          ogImage: ogFor(l, ip.tab),
          ld: [
            {
              '@type': 'WebPage',
              '@id': urlOf(pagePath),
              url: urlOf(pagePath),
              name: ip.title,
              description: ip.description,
              inLanguage: l === 'en' ? 'en' : 'zh-TW',
              isPartOf: { '@id': siteRef(l)['@id'] },
              about: { '@type': 'Thing', name: ip.name, alternateName: l === 'en' ? undefined : ip.nameEn },
            },
            crumbs([{ name: l === 'en' ? 'Home' : '首頁', path: pf }, { name: tabTitle, path: `${pf}${ip.tab}/` }, { name: ip.name, path: pagePath }]),
          ],
        });
      }
      for (const pg of pages) {
        const file = pg.path ? path.join(outDir, ...pg.path.split('/').filter(Boolean), 'index.html') : indexPath;
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, render(pg));
      }
      const headersPath = path.join(outDir, '_headers');
      if (fs.existsSync(headersPath)) {
        const extra = [...ROUTES.filter((r) => r.id !== 'overview').map((r) => `/${r.id}/`), ...ITEM_TABS.map((t) => `/${t}/*`), '/en/*'].map((p) => `${p}${nl}  Cache-Control: no-cache${nl}`).join(nl);
        fs.appendFileSync(headersPath, `${nl}# 各分頁的靜態外殼（vite.config.ts 的 staticRoutes 產生）：和首頁一樣每次重新確認${nl}${extra}`);
      }
      const today = new Date().toISOString().slice(0, 10);
      // sitemap：每個網址附上兩種語言的 alternate（xhtml:link），與頁面裡的 hreflang 一致
      const urls = pages.map((pg) => `  <url><loc>${urlOf(pg.path)}</loc><lastmod>${today}</lastmod>${altOf(pg).map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`).join('')}</url>`).join('\n');
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
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
