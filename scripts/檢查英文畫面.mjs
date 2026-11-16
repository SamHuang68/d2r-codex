import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const out = 'C:/Users/Sam/AI-Workspace/docs/d2r-codex/英文顯示修復';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const route of ['en/', 'en/items/harlequin_crest/', 'en/items/tal_rashas_wrappings/', 'en/runewords/hustle/', 'en/planner/']) {
    await page.goto(`http://127.0.0.1:4178/${route}`, { waitUntil: 'networkidle' });
    const residual = await page.evaluate(() => {
      const rows = [];
      for (const e of document.body.querySelectorAll('*')) {
        if (!e.getClientRects().length || ['SCRIPT', 'STYLE'].includes(e.tagName)) continue;
        for (const n of e.childNodes) if (n.nodeType === Node.TEXT_NODE && /[\u3400-\u9fff]/u.test(n.textContent)) rows.push({ tag: e.tagName, text: n.textContent.trim() });
        for (const attr of ['title', 'alt', 'aria-label', 'placeholder']) if (/[\u3400-\u9fff]/u.test(e.getAttribute(attr) ?? '')) rows.push({ tag: e.tagName, attr, text: e.getAttribute(attr) });
      }
      return rows;
    });
    report.push({ route, residual });
    await page.screenshot({ path: `${out}/${route.replaceAll('/', '-')}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['en/', 'en/planner/', 'en/props/']) {
    await page.goto(`http://127.0.0.1:4178/${route}`, { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} 手機不得橫向溢位`);
    await page.screenshot({ path: `${out}/手機-${route.replaceAll('/', '-')}.png`, fullPage: false });
  }
  fs.writeFileSync(`${out}/畫面殘留.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
