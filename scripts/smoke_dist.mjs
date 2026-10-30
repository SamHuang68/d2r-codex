// 正式建置的瀏覽器冒煙測試：真的用瀏覽器載入建置產物，確認各頁有內容、頁面沒有執行期錯誤。
// 為什麼要有這支：上線後整頁空白的問題（chunk 循環匯入，Cannot access 'x' before initialization）在開發伺服器、
// 型別檢查、單元測試、建置都不會出現，只有「在瀏覽器載入正式建置」才看得到。
//
// 用法：
//   npm run build && node scripts/smoke_dist.mjs                       # 本機：用內建的靜態伺服器載入 dist
//   node scripts/smoke_dist.mjs --url https://example.com/path/        # 對線上網址檢查（部署後）
//   選項：--retries N（預設 1；線上檢查可設 3，等部署傳播）、--delay 秒（重試間隔，預設 20）
// 環境變數：SMOKE_CHANNEL=chrome 使用系統安裝的 Chrome（CI 用）；沒設就用 Playwright 內建的 Chromium。
//
// 檢查內容：
//  - 桌面視窗：首頁載入的 JS 不超過預算（百科資料不能綁在首頁）；百科各分頁都有足夠內容；按 Q 能打開搜尋面板；配裝模擬載入後能套用一套流派、物品欄出現裝備
//  - 手機視窗（390 寬）：首頁與配裝模擬沒有橫向捲動
//  - 全程不得有頁面例外（pageerror）與頁面自己的 console 錯誤；第三方資源（字型、遠端圖片）載入失敗不算
import fs from 'node:fs';
import { createRequire } from 'node:module';
import http from 'node:http';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright-core';

// SMOKE_BROWSER=firefox|webkit 可改用其他瀏覽器引擎（CI 的跨瀏覽器檢查用）；沒設就是 Chromium
const ENGINES = { chromium, firefox, webkit };
const browserName = process.env.SMOKE_BROWSER ?? 'chromium';
if (!ENGINES[browserName]) { console.error(`SMOKE_BROWSER 只能是 chromium、firefox、webkit，收到 ${browserName}`); process.exit(2); }

const args = process.argv.slice(2);
const opt = (name, d) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : d; };
const liveUrl = opt('url');
const distDir = opt('dist', 'dist');
const retries = Math.max(1, Number(opt('retries', 1)));
const delaySec = Number(opt('delay', 20));

const ROUTES = [
  { hash: '#items', min: 1500, label: '裝備寶典' },
  { hash: '#runewords', min: 1500, label: '符文之語' },
  { hash: '#skills', min: 600, label: '技能寶典' },
  { hash: '#bases', min: 1500, label: '底材寶典' },
  { hash: '#grail', min: 3000, label: '聖杯打寶' },
  { hash: '#breakpoints', min: 600, label: '機制斷點' },
  // 百科各頁都是進頁面才載入的 lazy chunk，每一頁都要確認載得起來（門檻約為實測字數的一半）
  { hash: '#characters', min: 600, label: '職業圖鑑' },
  { hash: '#props', min: 1200, label: '道具聖物' },
  { hash: '#quests', min: 700, label: '任務' },
  { hash: '#mercenaries', min: 1000, label: '傭兵' },
  { hash: '#valuation', min: 2500, label: '估價' },
  { hash: '#uber', min: 900, label: '暗黑破壞神三兄弟' },
  { hash: '#runes', min: 3000, label: '符文寶庫' },
  { hash: '#cube', min: 3000, label: '赫拉迪克方塊' },
  { hash: '#areas', min: 1600, label: '區域' },
  { hash: '#monsters', min: 4000, label: '怪物圖鑑' },
  { hash: '#affixes', min: 4000, label: '詞綴寶典' },
  { hash: '#shrines', min: 2000, label: '聖壇圖鑑' },
  { hash: '#experience', min: 2500, label: '經驗值表' },
  { hash: '#about', min: 500, label: '資料來源與版權聲明' },
];

// 首頁（含 vendor）載入的 JS 位元組預算。百科資料與各頁是進頁面才載入，首頁不該再把它們帶進來（改版前首頁約 1.8 MB，改版後約 0.3 MB）
const HOME_JS_BUDGET = 700 * 1024;
// 個別分頁「直接開啟」時載入的 JS 預算（kB，約為實測的 1.15 倍）。這幾頁只需要部分資料，預算擋的是「又被不相干的大資料表拖著載入」
// 實測（2026-10）：底材 944、技能 1049、區域 323
const PAGE_JS_BUDGETS = [
  { hash: '#bases', kb: 1100, label: '底材寶典' },
  { hash: '#skills', kb: 1250, label: '技能寶典' },
  { hash: '#areas', kb: 450, label: '區域' },
];

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

function serveDist(dir) {
  const root = path.resolve(dir);
  if (!fs.existsSync(path.join(root, 'index.html'))) { console.error(`找不到 ${root}/index.html，請先執行 npm run build`); process.exit(2); }
  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, base: `http://127.0.0.1:${server.address().port}/` })));
}

// 無障礙自動檢查（axe-core）：嚴重／重大（serious／critical）的違規不能出現。
// 已知的歷史債務先列在這裡，數量不設上限但每次都會印出來，之後逐項清掉再從清單移除：
//  - label-content-name-mismatch：聖杯清單的收藏按鈕，無障礙名稱沒有包含畫面上的全部文字
const AXE_KNOWN_DEBT = new Set(['label-content-name-mismatch']);
const axeSource = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 頁面載入的 JS 位元組（解壓後）。背景預先抓取（link rel=prefetch）的 chunk 不算：它們是閒下來之後才抓、沒有被這一頁用到
const jsBytes = (page) => page.evaluate(() => {
  const pf = new Set([...document.querySelectorAll('link[rel=prefetch]')].map((l) => l.href));
  return performance.getEntriesByType('resource').filter((r) => /\.js(\?|$)/.test(r.name) && !(r.initiatorType === 'link' && pf.has(r.name))).reduce((a, r) => a + r.decodedBodySize, 0);
});

async function runOnce(base, browser) {
  const failures = [];
  const origin = new URL(base).origin;
  const track = (page, tag) => {
    page.on('pageerror', (e) => failures.push(`[${tag}] 頁面例外：${e.message}`));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const loc = m.location()?.url ?? '';
      // 第三方資源（字型、遠端圖片）載入失敗，或瀏覽器對資源失敗的通用訊息，不算頁面本身的錯誤
      // Firefox 在換頁中途中止字型下載時會印 "downloadable font: download failed"（沒有來源網址），同樣屬於第三方字型
      if (/Failed to load resource|downloadable font/i.test(m.text()) || (loc && !loc.startsWith(origin))) return;
      failures.push(`[${tag}] console 錯誤：${m.text().slice(0, 200)}`);
    });
    // 同網域的 /assets/*.js 一定要是 JavaScript：網址不存在時主機會回傳首頁 HTML（SPA 後備），CDN 一旦把它依 /assets/* 的長期快取規則
    // 存下來，那個網址就會一直拿到 HTML（頁面的重新載入重試會用別的網址繞過去，所以只看頁面內容抓不到）
    const seen = new Set();
    page.on('response', (res) => {
      const u = res.url();
      if (!u.startsWith(origin) || !/\/assets\/[^?]*\.js(\?|$)/.test(u) || seen.has(u)) return;
      seen.add(u);
      const ct = res.headers()['content-type'] ?? '';
      if (!/javascript/i.test(ct)) failures.push(`[${tag}] 程式檔 ${u.split('/').pop().split('?')[0]} 的內容類型不是 JavaScript（${ct || '沒有 content-type'}，HTTP ${res.status()}）：可能是 CDN 把找不到檔案時的首頁快取在這個網址上`);
    });
  };
  const withBust = (hash = '') => `${base}${base.includes('?') ? '&' : '?'}smoke=${Date.now()}${hash}`;
  const textLen = (page) => page.evaluate(() => (document.body?.innerText ?? "").length);

  // 不存在的檔案要回 404（不是 SPA 後備的 200 首頁），而且 404 回應不能帶長期快取，否則 CDN 會把「找不到」快取很久。
  // 用固定的假網址（沒有任何頁面會引用），線上重複執行也只會留下同一筆快取
  try {
    const res = await fetch(new URL('assets/__smoke-not-found__.js', base), { redirect: 'manual' });
    const cc = res.headers.get('cache-control') ?? '';
    const maxAge = Number((/max-age=(\d+)/i.exec(cc) ?? [0, 0])[1]);
    if (res.status !== 404) failures.push(`[404] 不存在的檔案回 HTTP ${res.status}（應為 404；200 代表主機把首頁當後備回應，CDN 可能把它快取在不存在的網址上）`);
    else if (/immutable/i.test(cc) || maxAge >= 86400) failures.push(`[404] 不存在的檔案的 404 回應帶了長期快取（Cache-Control: ${cc}），CDN 會把「找不到」快取很久`);
  } catch (e) {
    failures.push(`[404] 無法檢查不存在檔案的回應：${String(e.message).split('\n')[0]}`);
  }

  // ── 桌面 ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage(); track(page, '桌面');
    await page.goto(withBust(), { waitUntil: 'load', timeout: 45000 });
    try { await page.waitForFunction(() => (document.body?.innerText ?? "").length > 800, null, { timeout: 15000 }); } catch { /* 下面會回報 */ }
    const home = await textLen(page);
    if (home <= 800) failures.push(`[桌面] 首頁內容不足（${home} 字），可能整頁空白`);
    else if (!(await page.title()).includes('D2R')) failures.push(`[桌面] 首頁標題不對：${await page.title()}`);
    else if (!(await page.evaluate(() => (document.body?.innerText ?? ""))).includes('遊戲資料版本')) failures.push('[桌面] 頁尾沒有顯示遊戲資料版本');

    const homeJs = await jsBytes(page);
    if (homeJs > HOME_JS_BUDGET) failures.push(`[桌面] 首頁載入了 ${(homeJs / 1024).toFixed(0)} kB 的 JS，超過 ${HOME_JS_BUDGET / 1024} kB 預算（百科資料可能又被綁回首頁）`);
    // 首頁閒下來之後，背景預先抓取百科共用的大資料 chunk（vite.config.ts 的 prefetchDataChunks）：點進百科頁時才不必等下載
    try {
      await page.waitForFunction(() => document.querySelectorAll('link[rel=prefetch]').length >= 6, null, { timeout: 8000 });
    } catch {
      failures.push('[桌面] 首頁閒下來之後沒有預先抓取百科資料 chunk（vite.config.ts 的 chunk 名單可能和建置產物對不上）');
    }

    for (const r of ROUTES) {
      await page.evaluate((h) => { location.hash = h; }, r.hash);
      try { await page.waitForFunction((min) => (document.body?.innerText ?? "").length > min, r.min, { timeout: 10000 }); } catch { /* 下面會回報 */ }
      const n = await textLen(page);
      if (n <= r.min) failures.push(`[桌面] ${r.label}（${r.hash}）內容不足：${n} 字，要求超過 ${r.min}`);
    }

    // 個別分頁直接開啟時的 JS 量：每頁開新頁籤，才不會把前面分頁已載入的算進來
    for (const b of PAGE_JS_BUDGETS) {
      const pg = await ctx.newPage(); track(pg, `桌面·${b.label}`);
      try {
        await pg.goto(withBust(b.hash), { waitUntil: 'load', timeout: 45000 });
        await pg.waitForFunction(() => (document.body?.innerText ?? "").length > 800 && !(document.body?.innerText ?? "").includes('載入中'), null, { timeout: 15000 });
        const kb = (await jsBytes(pg)) / 1024;
        if (kb > b.kb) failures.push(`[桌面] ${b.label}（${b.hash}）直接開啟載入了 ${kb.toFixed(0)} kB 的 JS，超過 ${b.kb} kB 預算（可能又被不相干的大資料表拖著載入）`);
      } catch (e) {
        failures.push(`[桌面] ${b.label}（${b.hash}）直接開啟失敗：${String(e.message).split('\n')[0]}`);
      }
      await pg.close();
    }

    // 真路由：每個分頁都有自己的網址與靜態外殼（標題、canonical 各自獨立），直接開啟深層網址要能載入；舊的 #分頁 網址要自動轉成新路徑
    {
      const rp = await ctx.newPage(); track(rp, '桌面·路由');
      try {
        const root = new URL('.', base).pathname;
        for (const id of ['items', 'planner', 'about']) {
          const res = await rp.goto(new URL(`${id}/`, base).href, { waitUntil: 'load', timeout: 45000 });
          if (!res || res.status() !== 200) { failures.push(`[路由] /${id}/ 回 HTTP ${res?.status()}（靜態外殼不存在？）`); continue; }
          const meta = await rp.evaluate(() => ({ canonical: document.querySelector('link[rel=canonical]')?.href ?? '', title: document.title, desc: document.querySelector('meta[name=description]')?.content ?? '' }));
          if (!meta.canonical.endsWith(`/${id}/`)) failures.push(`[路由] /${id}/ 的 canonical 不對：${meta.canonical}`);
          await rp.waitForFunction(() => (document.body?.innerText ?? '').length > 500, null, { timeout: 15000 });
          if (new URL(rp.url()).pathname !== `${root}${id}/`) failures.push(`[路由] /${id}/ 載入後網址被改掉：${rp.url()}`);
        }
        // 靜態 HTML（不執行 JS）就要有各分頁自己的標題與描述，爬蟲才分得出頁面
        const raw = await (await fetch(new URL('items/', base))).text();
        if (!/<title>裝備寶典 \|/.test(raw) || !/rel="canonical" href="[^"]*\/items\/"/.test(raw)) failures.push('[路由] /items/ 的靜態 HTML 沒有自己的標題或 canonical');
        const rb = await fetch(new URL('robots.txt', base));
        if (rb.status !== 200 || !/^Sitemap:\s*\S+\/sitemap\.xml/im.test(await rb.text())) failures.push('[路由] robots.txt 不存在或沒有 Sitemap 行');
        const sm = await fetch(new URL('sitemap.xml', base));
        if (sm.status !== 200 || !(await sm.text()).includes('/items/</loc>')) failures.push('[路由] sitemap.xml 不存在或缺少分頁');
        await rp.goto(new URL('?legacy=1#runewords', base).href, { waitUntil: 'load', timeout: 45000 });
        await rp.waitForFunction((r) => location.pathname === `${r}runewords/`, root, { timeout: 15000 });
      } catch (e) {
        failures.push(`[路由] 深層網址或舊 #網址轉址失敗：${String(e.message).split('\n')[0]}`);
      }
      await rp.close();
    }

    // 瀏覽器上一頁／下一頁：每次點進另一頁都是一筆歷史紀錄（同一頁連點不重複），上一頁回到前一個分頁而不是離開網站
    {
      const hp = await ctx.newPage(); track(hp, '桌面·歷史');
      try {
        await hp.goto(withBust(), { waitUntil: 'load', timeout: 45000 });
        await hp.waitForFunction(() => (document.body?.innerText ?? "").length > 800, null, { timeout: 15000 });
        const len0 = await hp.evaluate(() => history.length);
        const side = (label) => hp.locator('aside, nav').getByRole('link', { name: new RegExp(label) }).first();
        await side('裝備寶典').click(); await hp.waitForFunction(() => location.pathname.endsWith('/items/'), null, { timeout: 10000 });
        await side('符文寶庫').click(); await hp.waitForFunction(() => location.pathname.endsWith('/runes/'), null, { timeout: 10000 });
        await side('符文寶庫').click(); await sleep(300);
        if ((await hp.evaluate(() => history.length)) - len0 !== 2) failures.push('[桌面] 同一個分頁連點，歷史紀錄多了重複的一筆');
        await hp.goBack(); await hp.waitForFunction(() => location.pathname.endsWith('/items/'), null, { timeout: 10000 });
        await hp.waitForFunction(() => /暗金/.test((document.body?.innerText ?? "")) && !(document.body?.innerText ?? "").includes('載入中'), null, { timeout: 15000 });
        if (!(await hp.title()).includes('裝備寶典')) failures.push(`[桌面] 分頁標題沒有跟著分頁變：${await hp.title()}`);
        await hp.goBack(); await hp.waitForFunction(() => (document.body?.innerText ?? "").includes('遊戲資料版本') && !location.pathname.endsWith('/items/'), null, { timeout: 10000 });
        await hp.goForward(); await hp.waitForFunction(() => location.pathname.endsWith('/items/'), null, { timeout: 10000 });
      } catch (e) {
        failures.push(`[桌面] 瀏覽器上一頁／下一頁沒有在分頁之間切換：${String(e.message).split('\n')[0]}`);
      }
      await hp.close();
    }

    // 傭兵寶典的資料表數值：預設第二幕地獄，列出傭兵數值與技能；切到普通難度後類型變成三種光環傭兵
    await page.evaluate(() => { location.hash = '#mercenaries'; });
    try {
      const actGuideBtn = page.getByRole('button', { name: /各[章幕]傭兵百科|Act Guide/ }).first();
      await actGuideBtn.waitFor({ state: 'visible', timeout: 15000 });
      await actGuideBtn.click();
      await page.waitForFunction(() => /生命/.test(document.querySelector('[aria-label="傭兵基礎數值"]')?.innerText ?? '') && /戳刺/.test(document.querySelector('[aria-label="傭兵技能"]')?.innerText ?? ''), null, { timeout: 15000 });
      const hell = await page.locator('[aria-label="傭兵類型"] button').count();
      await page.locator('[aria-label="難度"]').getByRole('button', { name: '普通' }).click();
      await page.waitForFunction(() => document.querySelectorAll('[aria-label="傭兵類型"] button').length === 3, null, { timeout: 10000 });
      if (hell !== 6) failures.push(`[桌面] 傭兵寶典第二幕地獄難度的類型應有 6 種，實際 ${hell}`);
    } catch (e) {
      failures.push(`[桌面] 傭兵寶典的資料表數值沒有出現或切換難度沒有反應：${String(e.message).split('\n')[0]}`);
    }

    // 跨頁連結（傭兵頁的物品名）：點了才載入比對用的資料表，再跳到對應分頁
    await page.evaluate(() => { location.hash = '#mercenaries'; });
    try {
      const link = page.locator('button[title*="在百科中查看【"], button[title*="View "], button[title^="點擊查看【"], button[title^="點擊跳轉查看【"]').first();
      await link.waitFor({ timeout: 10000 });
      await link.click();
      await page.waitForFunction(() => /\/(items|runewords|bases|runes|props)\/$/.test(location.pathname), null, { timeout: 10000 });
    } catch (e) {
      failures.push(`[桌面] 傭兵頁的物品連結點了沒有跳轉到對應分頁：${String(e.message).split('\n')[0]}`);
    }

    // 改版後舊頁面載入不到舊 chunk：第一次載入分頁的 chunk 失敗時，應自動整頁重整一次並恢復（模擬：中止第一次 QuestGuide chunk 請求）
    // 用「同一個檔名失敗一次」模擬：WebKit／Firefox 會記住同網址的失敗，重整後仍失敗，和真實改版（新頁面用新檔名）不同，
    // 所以這項只在 Chromium 驗證；真實改版情境已用兩份不同雜湊的建置在三種引擎上實測過
    if (browserName === 'chromium') {
      const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p2 = await ctx2.newPage();
      // 失敗當下那個「即將被重整掉」的頁面一定會丟出載入錯誤，不算；重整之後（第 2 次 load 起）出現的錯誤才算
      let loads = 0; p2.on('load', () => { loads++; });
      p2.on('pageerror', (e) => { if (loads >= 2) failures.push(`[桌面·重整後] 頁面例外：${e.message}`); });
      let aborted = 0;
      await p2.route(/\/assets\/QuestGuide-[^/]*\.js(\?.*)?$/, (route) => { if (aborted === 0) { aborted++; route.abort(); } else route.continue(); });
      await p2.goto(withBust(), { waitUntil: 'load', timeout: 45000 });
      try {
        await p2.waitForFunction(() => (document.body?.innerText ?? "").length > 800, null, { timeout: 15000 });
        await p2.evaluate(() => { window.__notReloaded = true; }); // 整頁重整後這個標記會消失
        await p2.evaluate(() => { location.hash = '#quests'; });
        await p2.waitForFunction(() => (document.body?.innerText ?? "").includes('全章節任務寶典'), null, { timeout: 20000 });
        const reloaded = await p2.evaluate(() => window.__notReloaded !== true);
        if (aborted !== 1) failures.push('[桌面] 模擬 chunk 載入失敗沒有觸發（測試本身有問題）');
        else if (!reloaded) failures.push('[桌面] chunk 載入失敗後沒有整頁重整（頁面是怎麼恢復的？）');
      } catch (e) {
        failures.push(`[桌面] chunk 載入失敗後沒有自動重整並恢復：${String(e.message).split('\n')[0]}`);
      }
      await ctx2.close();
    }

    // 網站圖標、分享圖與安裝資訊都要真的存在：缺檔時 SPA 會回後備首頁（text/html）而不是 404，所以也檢查內容類型
    for (const f of ['icon.svg', 'icon-192.png', 'apple-touch-icon.png', 'manifest.webmanifest', 'og.png']) {
      const r = await page.request.get(new URL(f, base).href);
      const ct = r.headers()['content-type'] ?? '';
      if (!r.ok() || ct.includes('text/html')) failures.push(`[桌面] 網站圖標或分享圖缺檔：${f}（HTTP ${r.status()}，${ct}）`);
    }
    // Firefox 的無頭模式在沒有音效裝置的 CI 主機上，AudioContext.resume() 永遠不會完成，音樂開關無法驗證，只在 Chromium／WebKit 檢查
    if (browserName !== 'firefox') {
    // 背景音樂：預設關閉；打開面板、按開關後引擎才載入並開始播放（aria-checked），再按一次關掉；不能有頁面錯誤
    try {
      await page.evaluate(() => { location.hash = '#overview'; });
      const musicBtn = page.getByRole('button', { name: /^(音樂|Music)$/ });
      await musicBtn.waitFor({ state: 'visible', timeout: 10000 });
      await musicBtn.click();
      const sw = page.getByRole('switch', { name: /播放背景音樂|Play background music/ });
      await sw.waitFor({ state: 'visible', timeout: 5000 });
      if ((await sw.getAttribute('aria-checked')) !== 'false') failures.push('[桌面] 背景音樂預設應該是關閉');
      await sw.click();
      await page.waitForFunction(() => document.querySelector('[role="switch"]')?.getAttribute('aria-checked') === 'true', null, { timeout: 10000 });
      await sw.click();
      await page.waitForFunction(() => document.querySelector('[role="switch"]')?.getAttribute('aria-checked') === 'false', null, { timeout: 5000 });
      await page.keyboard.press('Escape');
    } catch (e) {
      failures.push(`[桌面] 背景音樂開關無法開啟／關閉：${String(e.message).split('\n')[0]}`);
    }
    // 音樂「依章節自動切換」：開著自動切換並播放時，到任務頁按第三章，音樂面板的章節要跟著變成第三章
    try {
      await page.evaluate(() => { location.hash = '#overview'; });
      await page.getByRole('button', { name: /^(音樂|Music)$/ }).click();
      await page.getByRole('checkbox', { name: /自動切換|Follow the act/ }).check();
      await page.getByRole('switch', { name: /播放背景音樂|Play background music/ }).click();
      await page.waitForFunction(() => document.querySelector('[role="switch"]')?.getAttribute('aria-checked') === 'true', null, { timeout: 10000 });
      await page.keyboard.press('Escape');
      await page.evaluate(() => { location.hash = '#quests'; });
      await page.getByRole('button', { name: /^第三章/ }).first().click({ timeout: 10000 });
      await page.getByRole('button', { name: /^(音樂|Music)$/ }).click();
      await page.waitForFunction(() => [...document.querySelectorAll('[role="radio"]')].some((r) => r.textContent.includes('第三章') && r.getAttribute('aria-checked') === 'true'), null, { timeout: 5000 });
      await page.getByRole('switch', { name: /播放背景音樂|Play background music/ }).click();
      await page.keyboard.press('Escape');
    } catch (e) {
      failures.push(`[桌面] 音樂沒有依章節自動切換：${String(e.message).split('\n')[0]}`);
    }
    }
    // 無障礙：每個分頁跑 axe；嚴重／重大違規（已知債務除外）一律算失敗。只在 Chromium 跑（三種引擎結果相同，省時間）
    if (browserName === 'chromium') {
      const debt = {};
      for (const hash of [...ROUTES.map((r) => r.hash), '#overview', '#planner']) {
        try {
          await page.evaluate((h) => { location.hash = h; }, hash);
          await sleep(900);
          await page.evaluate(axeSource);
          const found = await page.evaluate(async () => {
            const res = await window.axe.run(document, { resultTypes: ['violations'] });
            return res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => ({ id: v.id, n: v.nodes.length, sample: (v.nodes[0]?.html ?? '').slice(0, 120) }));
          });
          for (const v of found) {
            if (AXE_KNOWN_DEBT.has(v.id)) debt[v.id] = Math.max(debt[v.id] ?? 0, v.n);
            else failures.push(`[無障礙] ${hash} ${v.id}（${v.n} 處）例：${v.sample}`);
          }
        } catch (e) {
          failures.push(`[無障礙] ${hash} axe 執行失敗：${String(e.message).split('\n')[0]}`);
        }
      }
      const debtText = Object.entries(debt).map(([k, n]) => `${k} 最多 ${n} 處`).join('、');
      if (debtText) console.log(`（無障礙已知債務，尚未清除：${debtText}）`);
    }
    // 樹狀索引的方向鍵操作（WAI-ARIA tree）：上下移動、右鍵展開／進入子節點、左鍵收合／回上一層
    try {
      await page.evaluate(() => { location.hash = '#items'; });
      await page.waitForSelector('[data-node-id="all"]', { timeout: 15000 });
      const cur = () => page.evaluate(() => document.activeElement?.dataset?.nodeId ?? document.activeElement?.tagName);
      await page.locator('[data-node-id="all"]').focus();
      await page.keyboard.press('ArrowDown');
      if ((await cur()) !== 'u') failures.push('[桌面] 樹狀索引：根節點按下方向鍵沒有移到第一個節點');
      await page.locator('[data-node-id="s"]').focus();
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      if ((await cur()) !== 's/class') failures.push('[桌面] 樹狀索引：右鍵沒有展開並移到第一個子節點');
      await page.keyboard.press('ArrowLeft');
      if ((await cur()) !== 's') failures.push('[桌面] 樹狀索引：左鍵沒有回到上一層');
    } catch (e) {
      failures.push(`[桌面] 樹狀索引方向鍵檢查失敗：${String(e.message).split('\n')[0]}`);
    }
    // 「詳細」模式分批：底材寶典的根節點（508 款）切到詳細，一次只能畫出一批（48 張）並出現「顯示更多」，按一下再加一批
    try {
      await page.evaluate(() => { location.hash = '#bases'; });
      await page.waitForSelector('[data-node-id="all"]', { timeout: 15000 });
      await page.locator('[data-node-id="all"]').click();
      await page.getByRole('button', { name: /^詳細$|^Detailed$/ }).click();
      await sleep(800);
      const first = await page.locator('[id^="base-"]').count();
      if (first < 1 || first > 60) failures.push(`[桌面] 底材寶典根節點詳細模式一次畫了 ${first} 張卡（應為第一批 48 張）`);
      await page.getByRole('button', { name: /顯示更多|Show more/ }).first().click();
      await sleep(500);
      const second = await page.locator('[id^="base-"]').count();
      if (second <= first) failures.push('[桌面] 底材寶典「顯示更多」按了沒有多出卡片');
    } catch (e) {
      failures.push(`[桌面] 詳細模式分批檢查失敗：${String(e.message).split('\n')[0]}`);
    }
    // 搜尋面板也是第一次按 Q 才載入的 lazy chunk
    await page.evaluate(() => { location.hash = '#overview'; });
    try {
      await page.waitForFunction(() => (document.body?.innerText ?? "").length > 800, null, { timeout: 10000 });
      await page.keyboard.press('q');
      await page.waitForSelector('input[placeholder*="搜尋符文之語"]', { timeout: 10000 });
      await page.keyboard.press('Escape');
    } catch (e) {
      failures.push(`[桌面] 按 Q 打不開搜尋面板：${String(e.message).split('\n')[0]}`);
    }
    // 全域搜尋也要找得到怪物（輸入之後才動態載入的第二批資料）：點結果會跳到怪物圖鑑，並把名稱帶進該頁的搜尋框
    try {
      await page.keyboard.press('q');
      const box = page.locator('input[placeholder*="搜尋符文之語"]');
      await box.waitFor({ timeout: 10000 });
      await box.fill('安達莉爾');
      const hit = page.getByText('怪物圖鑑 ·').first();
      await hit.waitFor({ timeout: 10000 });
      await hit.click();
      await page.waitForFunction(() => location.pathname.endsWith('/monsters/') && [...document.querySelectorAll('input[type=search]')].some((i) => i.value === '安達莉爾'), null, { timeout: 10000 });
    } catch (e) {
      failures.push(`[桌面] 全域搜尋找不到怪物或點了沒有跳到怪物圖鑑：${String(e.message).split('\n')[0]}`);
    }

    // 配裝模擬：延遲載入的 chunk、引擎、遊戲資料都要在正式建置裡跑得起來（區塊標題是字距放大的「生 存 力」，所以比對允許空白）
    await page.evaluate(() => { location.hash = '#planner'; });
    try {
      await page.waitForSelector('.d2sim', { timeout: 15000 });
      const classes = await page.locator('.d2sim .d2-class').count();
      if (classes < 8) failures.push(`[桌面] 配裝模擬的職業分頁只有 ${classes} 個（應有 8 個）`);
      await page.getByRole('button', { name: /流派與 Profile/ }).first().click();
      const card = page.locator('.d2-build', { hasText: '冰暴魔法使' }).first();
      await card.getByRole('button', { name: /套用頂裝/ }).click();
      await page.waitForFunction(() => [...document.querySelectorAll('.d2-slot')].filter((s) => (s.getAttribute('aria-label') ?? '').includes('：')).length >= 8, null, { timeout: 15000 });
      const stats = await page.evaluate(() => (document.body?.innerText ?? ""));
      if (!/生\s*存\s*力/.test(stats)) failures.push('[桌面] 套用流派後屬性頁沒有出現「生存力」區塊');
      // 傭兵分頁：顯示傭兵數值；開啟「計入傭兵」後，傭兵的原生光環（預設是地獄力量傭兵）成為屬性頁增益面板裡恆啟用的一列
      await page.getByRole('tab', { name: '傭兵' }).click();
      await page.waitForFunction(() => /傭\s*兵\s*數\s*值/.test((document.body?.innerText ?? "")), null, { timeout: 10000 });
      await page.getByLabel('計入傭兵').check();
      await page.getByRole('tab', { name: '屬性頁' }).click();
      await page.waitForFunction(() => /傭兵/.test(document.querySelector('.d2sim')?.innerText ?? '') && /力量/.test(document.querySelector('.d2sim')?.innerText ?? ''), null, { timeout: 10000 });
    } catch (e) {
      failures.push(`[桌面] 配裝模擬無法載入、套用流派或開啟傭兵分頁：${String(e.message).split('\n')[0]}`);
    }
    // 召喚物：死靈法師的復生骷髏加到滿，技能詳情出現召喚物區塊（數量與技能加成）
    try {
      await page.locator('.d2sim .d2-class', { hasText: '死靈法師' }).first().click();
      await page.getByRole('tab', { name: '技能樹' }).click();
      await page.locator('.d2-skill', { hasText: '復生骷髏' }).first().click();
      await page.getByRole('button', { name: 'MAX' }).first().click();
      await page.waitForFunction(() => /最多\s*\d+\s*隻/.test(document.querySelector('[aria-label="召喚物"]')?.innerText ?? ''), null, { timeout: 10000 });
    } catch (e) {
      failures.push(`[桌面] 召喚技能的召喚物區塊沒有出現：${String(e.message).split('\n')[0]}`);
    }
    // 自訂飾品：詞綴表是背景載入的 chunk，載入後預設的小型護身符（+7% 魔法物品）要出現「遊戲內檢查」並判定可以長出來
    try {
      await page.getByRole('tab', { name: '樹狀裝備庫' }).click();
      await page.waitForFunction(() => /可以長出來/.test(document.querySelector('[aria-label="遊戲內檢查"]')?.innerText ?? ''), null, { timeout: 15000 });
    } catch (e) {
      failures.push(`[桌面] 自訂飾品的遊戲內檢查沒有出現：${String(e.message).split('\n')[0]}`);
    }
    await ctx.close();
  }

  // ── 手機：沒有橫向捲動 ──
  {
    // Firefox 不支援 isMobile 選項，只用 390 寬的視窗與觸控
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, ...(browserName === 'firefox' ? {} : { isMobile: true }) });
    const page = await ctx.newPage(); track(page, '手機');
    for (const hash of ['', '#planner']) {
      await page.goto(withBust(hash), { waitUntil: 'load', timeout: 45000 });
      try { await page.waitForFunction(() => (document.body?.innerText ?? "").length > 800, null, { timeout: 15000 }); } catch { /* 下面會回報 */ }
      await sleep(500);
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
      if (m.sw > m.w + 1) failures.push(`[手機] ${hash || '首頁'} 有橫向捲動：scrollWidth ${m.sw} > ${m.w}`);
      // 頂部列的按鈕不能被擠出畫面。手機模式下內容太寬時瀏覽器會把版面視窗撐寬（innerWidth 跟著變大），
      // 上面用 innerWidth 的檢查就看不出來；要和使用者實際看到的視覺視窗（visualViewport，390）比
      const clipped = await page.evaluate(() => [...document.querySelectorAll('header button, header a')].filter((el) => { const r = el.getBoundingClientRect(); const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth; return r.width > 0 && (r.right > vw + 0.5 || r.left < -0.5); }).map((el) => (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 20)));
      if (clipped.length) failures.push(`[手機] ${hash || '首頁'} 頂部列有按鈕被擠出畫面：${clipped.join('、')}`);
      if (hash === '#planner') {
        try {
          await page.getByRole('tab', { name: '傭兵' }).click(); await sleep(500);
          const m2 = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
          if (m2.sw > m2.w + 1) failures.push(`[手機] 傭兵分頁有橫向捲動：scrollWidth ${m2.sw} > ${m2.w}`);
        } catch (e) { failures.push(`[手機] 傭兵分頁打不開：${String(e.message).split('\n')[0]}`); }
      }
    }
    await ctx.close();
  }
  return failures;
}

let local;
const base = liveUrl ?? (local = await serveDist(distDir)).base;
async function launchBrowser() {
  if (browserName !== 'chromium') return ENGINES[browserName].launch({});
  if (process.env.SMOKE_CHANNEL) return chromium.launch({ channel: process.env.SMOKE_CHANNEL });
  try {
    return await chromium.launch({});
  } catch (err) {
    if (err.message && err.message.includes("Executable doesn't exist")) {
      for (const ch of ['msedge', 'chrome']) {
        try { return await chromium.launch({ channel: ch }); } catch {}
      }
    }
    throw err;
  }
}
const browser = await launchBrowser();
let failures = [];
try {
  for (let attempt = 1; attempt <= retries; attempt++) {
    failures = await runOnce(base, browser);
    if (!failures.length) break;
    console.error(`第 ${attempt}/${retries} 次檢查失敗：\n  ${failures.join('\n  ')}`);
    if (attempt < retries) { console.error(`${delaySec} 秒後重試…`); await sleep(delaySec * 1000); }
  }
} finally {
  await browser.close();
  local?.server.close();
}
if (failures.length) { console.error(`\n冒煙測試失敗（${base}）`); process.exit(1); }
console.log(`冒煙測試通過（${base}）：首頁與個別分頁 JS 在預算內、首頁閒下來後預先抓取百科資料、瀏覽器上一頁／下一頁可在分頁間切換、${ROUTES.length} 個分頁有內容、跨頁物品連結可跳轉、chunk 載入失敗會自動重整、搜尋面板可開啟、配裝模擬可套用流派、傭兵分頁可開啟並計入光環、召喚技能顯示召喚物、手機版無橫向捲動、無頁面錯誤`);
