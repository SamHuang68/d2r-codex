// 產生各分頁的分享卡（1200×630，沿用 public/og.png 的風格，原創向量，沒有任何遊戲素材）：public/og/<分頁 id>.jpg（中文）、public/og/en/<分頁 id>.jpg（英文）
// 分享連結到 Discord、LINE、FB 等時顯示的預覽圖；單品頁（/items/<id>/、/runewords/<id>/）使用所屬分頁的卡。
// 用法：node scripts/gen_og_cards.mjs   （需要 Chrome／Chromium：SMOKE_CHANNEL=chrome，或 CHROME_PATH=可執行檔路徑）
// 分頁名稱與描述來自 src/utils/routes.ts；改了那邊的文字之後重新執行並一併提交產生的圖片。
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2og-')), 'mods.mjs');
await build({
  stdin: { contents: "export { ROUTES } from './src/utils/routes'; export { GAME_ICON_SHAPES } from './src/components/common/gameIconPaths';", resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, format: 'esm', outfile: tmp, logLevel: 'error',
});
const { ROUTES, GAME_ICON_SHAPES: S } = await import(pathToFileURL(tmp).href);

const GOLD = '#cbb87f'; const GOLD_DARK = '#8e7f53'; const BG = '#060709'; const PANEL = '#0b0d12';
const gate = S.gate.stroke;
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

const card = (r, lang = 'zh') => `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0}body{width:1200px;height:630px;background:radial-gradient(900px 500px at 25% 45%,#1a1408 0%,${BG} 70%);font-family:"Microsoft JhengHei","Noto Sans TC","PingFang TC","WenQuanYi Zen Hei",sans-serif;color:${GOLD};position:relative;overflow:hidden;display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box}
.frame{position:absolute;inset:26px;border:2px solid ${GOLD_DARK};opacity:.55}
.mark{flex:none;width:210px;height:210px;background:${PANEL};border:3px solid ${GOLD_DARK};display:flex;align-items:center;justify-content:center;box-shadow:0 0 80px rgba(203,184,127,.18)}
.site{font-size:26px;letter-spacing:5px;color:${GOLD_DARK};margin-bottom:26px;font-family:Georgia,serif;text-transform:uppercase}
h1{font-size:92px;margin:0 0 10px;letter-spacing:4px;font-weight:700;line-height:1.15}
.en{font-size:38px;letter-spacing:5px;color:${GOLD_DARK};margin-bottom:34px;font-family:Georgia,serif;text-transform:uppercase}
.sub{font-size:30px;color:#9ca3af;line-height:1.6;max-width:760px}
</style><div class="frame"></div>
<div class="mark"><svg viewBox="0 0 24 24" width="150" height="150" fill="none" stroke="${GOLD}" stroke-width="1.5" stroke-linejoin="miter" stroke-linecap="square"><path d="${gate[0]}"/><path d="${gate[1]}" fill="#f97316" stroke="#f97316"/></svg></div>
<div><div class="site">D2R Sanctuary Codex</div>${lang === 'en'
  ? `<h1 style="font-family:Georgia,serif;font-size:80px;letter-spacing:2px">${esc(r.titleEn)}</h1><div class="en">${esc(r.title)}</div><div class="sub">${esc(clip(r.descriptionEn.replace(/[。.]$/, ''), 96))}</div>`
  : `<h1>${esc(r.title)}</h1><div class="en">${esc(r.titleEn)}</div><div class="sub">${esc(clip(r.description.replace(/[。.]$/, ''), 44))}</div>`}</div>`;

const exe = process.env.CHROME_PATH;
const browser = await chromium.launch(exe ? { executablePath: exe } : { channel: process.env.SMOKE_CHANNEL || 'chrome' });
fs.mkdirSync('public/og/en', { recursive: true });
let n = 0;
for (const lang of ['zh', 'en']) {
  for (const r of ROUTES) {
    if (r.id === 'overview') continue; // 首頁（兩種語言）用 public/og.png
    const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await p.setContent(card(r, lang));
    await p.screenshot({ path: `public/og/${lang === 'en' ? 'en/' : ''}${r.id}.jpg`, type: 'jpeg', quality: 88 });
    await p.close();
    n++;
  }
}
await browser.close();
console.log(`已產生 ${n} 張分享卡到 public/og/（含 en/）`);
