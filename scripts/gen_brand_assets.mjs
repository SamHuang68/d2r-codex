// 產生網站圖標與分享圖（原創向量，沒有任何遊戲素材）：public/icon.svg、icon-192.png、icon-512.png、apple-touch-icon.png、og.png
// 用法：node scripts/gen_brand_assets.mjs   （需要系統的 Chrome；圖示路徑讀 src/components/common/gameIconPaths.ts）
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2brand-')), 'shapes.mjs');
await build({ entryPoints: ['src/components/common/gameIconPaths.ts'], bundle: true, format: 'esm', outfile: tmp, logLevel: 'error' });
const { GAME_ICON_SHAPES: S } = await import(pathToFileURL(tmp).href);

const GOLD = '#cbb87f'; const GOLD_DARK = '#8e7f53'; const FIRE = '#f97316'; const BG = '#060709'; const PANEL = '#0b0d12';
const gate = S.gate.stroke;
// 圖標：深色圓角方塊、金色描邊的傳送門、門心一團橙色火種
const iconSvg = (full = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" ${full ? '' : 'rx="13"'} fill="${PANEL}"/>${full ? '' : `<rect x="1.5" y="1.5" width="61" height="61" rx="11.5" fill="none" stroke="${GOLD_DARK}" stroke-width="2"/>`}<g transform="translate(10 10) scale(1.9)" fill="none" stroke="${GOLD}" stroke-width="1.9" stroke-linejoin="miter" stroke-linecap="square"><path d="${gate[0]}"/><path d="${gate[1]}" fill="${FIRE}" stroke="${FIRE}"/></g></svg>`;

fs.writeFileSync('public/icon.svg', iconSvg());

const ogHtml = `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0}body{width:1200px;height:630px;background:radial-gradient(900px 500px at 25% 45%,#1a1408 0%,${BG} 70%);font-family:"Microsoft JhengHei","Noto Sans TC","PingFang TC",sans-serif;color:${GOLD};display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box;position:relative}
.frame{position:absolute;inset:26px;border:2px solid ${GOLD_DARK};opacity:.55}
.mark{flex:none;width:300px;height:300px;background:${PANEL};border:3px solid ${GOLD_DARK};display:flex;align-items:center;justify-content:center;box-shadow:0 0 80px rgba(203,184,127,.18)}
h1{font-size:76px;margin:0 0 14px;letter-spacing:4px;font-weight:700}
.en{font-size:34px;letter-spacing:6px;color:${GOLD_DARK};margin-bottom:34px;font-family:Georgia,serif;text-transform:uppercase}
.sub{font-size:30px;color:#9ca3af;line-height:1.6}
.chips{display:flex;gap:14px;margin-top:30px}.chip{border:1px solid ${GOLD_DARK};color:${GOLD};padding:6px 16px;font-size:24px}
</style><div class="frame"></div>
<div class="mark"><svg viewBox="0 0 24 24" width="220" height="220" fill="none" stroke="${GOLD}" stroke-width="1.5" stroke-linejoin="miter" stroke-linecap="square"><path d="${gate[0]}"/><path d="${gate[1]}" fill="${FIRE}" stroke="${FIRE}"/></svg></div>
<div><h1>聖休亞瑞典藏中樞</h1><div class="en">D2R Sanctuary Codex</div><div class="sub">暗黑破壞神 II：獄火重生 全資料庫速查<br>符文之語・暗金套裝・方塊配方・斷點・聖杯</div><div class="chips"><span class="chip">繁體中文</span><span class="chip">English</span></div></div>`;

const browser = await chromium.launch({ channel: process.env.SMOKE_CHANNEL || 'chrome' });
const shot = async (html, w, h, file, scale = 1) => {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await p.setContent(html); await p.screenshot({ path: file }); await p.close();
};
const iconPage = (svg, size) => `<body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body>`;
await shot(iconPage(iconSvg(), 192), 192, 192, 'public/icon-192.png');
await shot(iconPage(iconSvg(), 512), 512, 512, 'public/icon-512.png');
await shot(iconPage(iconSvg(true), 180), 180, 180, 'public/apple-touch-icon.png');
await shot(ogHtml, 1200, 630, 'public/og.png');
await browser.close();
console.log('已產生 public/icon.svg、icon-192.png、icon-512.png、apple-touch-icon.png、og.png');
