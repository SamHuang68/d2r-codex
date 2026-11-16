import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const out = 'C:/Users/Sam/AI-Workspace/docs/d2r-codex/英文顯示修復';
const routes = [...fs.readFileSync('src/utils/routes.ts', 'utf8').matchAll(/\{ id: '([^']+)', title:/g)].map(m => m[1]);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const base = process.env.LANGUAGE_CHECK_URL ?? 'http://127.0.0.1:4178/';
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const record = async name => {
    const residual = await page.evaluate(() => {
      const rows = [];
      for (const e of document.body.querySelectorAll('*')) {
        if ((!e.getClientRects().length && !(e.tagName === 'OPTION' && e.closest('select')?.getClientRects().length)) || ['SCRIPT', 'STYLE'].includes(e.tagName) || e.closest('[aria-label*="Switch to"]')) continue;
        for (const n of e.childNodes) if (n.nodeType === Node.TEXT_NODE && /[\u3400-\u9fff]/u.test(n.textContent)) rows.push({ tag: e.tagName, text: n.textContent.trim() });
        for (const attr of ['title', 'alt', 'aria-label', 'placeholder', ...(e.tagName === 'OPTGROUP' ? ['label'] : [])]) if (/[\u3400-\u9fff]/u.test(e.getAttribute(attr) ?? '')) rows.push({ tag: e.tagName, attr, text: e.getAttribute(attr) });
      }
      return rows;
    });
    report.push({ name, url: page.url(), residual });
    fs.writeFileSync(`${out}/全站語系掃描.json`, JSON.stringify({ report, errors }, null, 2));
  };
  for (const route of routes) {
    const suffix = route === 'overview' ? '' : `${route}/`;
    await page.goto(`${base}en/${suffix}`, { waitUntil: 'networkidle' });
    await record(route);
    const initial = await page.locator('main').innerText();
    await page.getByRole('button', { name: /Switch to Traditional Chinese/ }).first().click();
    await page.waitForFunction(() => document.documentElement.lang !== 'en');
    assert.ok(!new URL(page.url()).pathname.includes('/en/'), `${route} 切換網址`);
    await page.getByRole('button', { name: /Switch to English/ }).first().click();
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    assert.equal(await page.locator('main').innerText(), initial, `${route} 切換來回不得遺失內容或狀態`);
  }
  await page.goto(`${base}en/planner/`, { waitUntil: 'networkidle' });
  await page.getByRole('tab', { name: 'Gear Library', exact: true }).click();
  await record('planner-gear');
  await page.getByRole('textbox', { name: 'Search Gear', exact: true }).fill('Harlequin');
  await page.waitForTimeout(200);
  await record('planner-gear-search');
  await page.getByRole('button', { name: 'Close Gear Library', exact: true }).click();
  await page.getByRole('tab', { name: 'Skill Trees', exact: true }).click();
  await record('planner-skills');
  await page.getByRole('button', { name: 'Add 1 point', exact: true }).click();
  await record('planner-skill-invested');
  await page.getByRole('tab', { name: 'Mercenary', exact: true }).click();
  await record('planner-mercenary');
  await page.getByRole('button', { name: /^Profiles/ }).click();
  await record('planner-profiles');
  await page.getByRole('button', { name: /^Apply Starter/ }).first().click();
  await record('planner-preset-applied');
  await page.goto(`${base}en/props/`, { waitUntil: 'networkidle' });
  for (const label of ['Uber Keys & Organs', '4 Essences & Respec Token', 'Combat Potions & Elixirs', 'Sunder Charms & Top Jewels']) {
    await page.getByRole('button', { name: new RegExp(label.replaceAll('&', '\&')) }).click();
    await record(`props-${label}`);
  }
  await page.goto(`${base}en/mercenaries/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Act Guide/ }).click();
  await record('mercenaries-guide');
  assert.equal(report.reduce((n, r) => n + r.residual.length, 0), 0, '英文畫面不得殘留中文');
  assert.deepEqual(errors, [], '頁面不得發生執行錯誤');
  console.log(JSON.stringify({ pages: routes.length, states: report.length, residual: report.map(r => ({ name: r.name, count: r.residual.length })), errors }));
} finally { await browser.close(); }
