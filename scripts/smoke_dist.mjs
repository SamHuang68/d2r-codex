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
//  - 桌面視窗：首頁與各分頁（裝備寶典、符文之語、技能、底材、聖杯、斷點）有足夠內容；配裝模擬載入後能套用一套流派、物品欄出現裝備
//  - 手機視窗（390 寬）：首頁與配裝模擬沒有橫向捲動
//  - 全程不得有頁面例外（pageerror）與頁面自己的 console 錯誤；第三方資源（字型、遠端圖片）載入失敗不算
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright-core';

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runOnce(base, browser) {
  const failures = [];
  const origin = new URL(base).origin;
  const track = (page, tag) => {
    page.on('pageerror', (e) => failures.push(`[${tag}] 頁面例外：${e.message}`));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const loc = m.location()?.url ?? '';
      // 第三方資源（字型、遠端圖片）載入失敗，或瀏覽器對資源失敗的通用訊息，不算頁面本身的錯誤
      if (/Failed to load resource/i.test(m.text()) || (loc && !loc.startsWith(origin))) return;
      failures.push(`[${tag}] console 錯誤：${m.text().slice(0, 200)}`);
    });
  };
  const withBust = (hash = '') => `${base}${base.includes('?') ? '&' : '?'}smoke=${Date.now()}${hash}`;
  const textLen = (page) => page.evaluate(() => document.body.innerText.length);

  // ── 桌面 ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage(); track(page, '桌面');
    await page.goto(withBust(), { waitUntil: 'load', timeout: 45000 });
    try { await page.waitForFunction(() => document.body.innerText.length > 800, null, { timeout: 15000 }); } catch { /* 下面會回報 */ }
    const home = await textLen(page);
    if (home <= 800) failures.push(`[桌面] 首頁內容不足（${home} 字），可能整頁空白`);
    else if (!(await page.title()).includes('D2R')) failures.push(`[桌面] 首頁標題不對：${await page.title()}`);
    else if (!(await page.evaluate(() => document.body.innerText)).includes('遊戲資料版本')) failures.push('[桌面] 頁尾沒有顯示遊戲資料版本');

    for (const r of ROUTES) {
      await page.evaluate((h) => { location.hash = h; }, r.hash);
      try { await page.waitForFunction((min) => document.body.innerText.length > min, r.min, { timeout: 10000 }); } catch { /* 下面會回報 */ }
      const n = await textLen(page);
      if (n <= r.min) failures.push(`[桌面] ${r.label}（${r.hash}）內容不足：${n} 字，要求超過 ${r.min}`);
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
      const stats = await page.evaluate(() => document.body.innerText);
      if (!/生\s*存\s*力/.test(stats)) failures.push('[桌面] 套用流派後屬性頁沒有出現「生存力」區塊');
    } catch (e) {
      failures.push(`[桌面] 配裝模擬無法載入或套用流派：${String(e.message).split('\n')[0]}`);
    }
    await ctx.close();
  }

  // ── 手機：沒有橫向捲動 ──
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); track(page, '手機');
    for (const hash of ['', '#planner']) {
      await page.goto(withBust(hash), { waitUntil: 'load', timeout: 45000 });
      try { await page.waitForFunction(() => document.body.innerText.length > 800, null, { timeout: 15000 }); } catch { /* 下面會回報 */ }
      await sleep(500);
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
      if (m.sw > m.w + 1) failures.push(`[手機] ${hash || '首頁'} 有橫向捲動：scrollWidth ${m.sw} > ${m.w}`);
    }
    await ctx.close();
  }
  return failures;
}

let local;
const base = liveUrl ?? (local = await serveDist(distDir)).base;
const browser = await chromium.launch(process.env.SMOKE_CHANNEL ? { channel: process.env.SMOKE_CHANNEL } : {});
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
console.log(`冒煙測試通過（${base}）：首頁與 ${ROUTES.length} 個分頁有內容、配裝模擬可套用流派、手機版無橫向捲動、無頁面錯誤`);
