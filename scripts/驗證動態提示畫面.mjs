import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://127.0.0.1:4178/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(new URL('en/planner/', base).href, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^Profiles/ }).click();
  await page.getByRole('button', { name: 'Import', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'Import Profile Text' });
  const status = page.getByRole('status');
  for (const [text, expected] of [['{', 'Import failed: Invalid JSON'], ['{}', 'Import failed: Invalid format: this is not a profile exported by this simulator'], [JSON.stringify({ v: 1, name: '我的配裝', data: { classCode: 'sor', equipped: { ring1: { id: 'custom', custom: { baseCode: 'rin', name: '我的戒指', affixes: [{ code: 'hp', value: 'bad' }] } } } } }), 'Value for affix "hp" must be a finite number']]) {
    await input.fill(text);
    await page.getByRole('button', { name: 'Import This Profile', exact: true }).click();
    await page.waitForFunction(expected => document.querySelector('[role="status"]')?.textContent.includes(expected), expected);
    assert.ok(!/[\u3400-\u9fff]/u.test(await status.innerText()));
  }
  const name = '我的配裝 Ω', itemName = '我的戒指 火焰';
  const profile = { v: 1, name, data: { classCode: 'sor', equipped: { ring1: { id: 'custom', custom: { baseCode: 'rin', name: itemName, affixes: [{ code: 'hp', value: 30 }] } } }, charms: [] } };
  await input.fill(JSON.stringify(profile));
  await page.getByRole('button', { name: 'Import This Profile', exact: true }).click();
  await page.waitForFunction(name => document.querySelector('[role="status"]')?.textContent === `Imported "${name}"`, name);
  const row = page.locator('li.d2-build').filter({ hasText: name });
  await row.getByRole('button', { name: 'Apply', exact: true }).click();
  assert.equal(await status.innerText(), `Applied: ${name}`);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('d2sim.profiles.v1')));
  assert.equal(saved[0].name, name); assert.equal(saved[0].data.equipped.ring1.custom.name, itemName);
  await page.getByRole('button', { name: /Switch to Traditional Chinese/ }).first().click();
  await page.getByRole('button', { name: '匯入', exact: true }).click();
  await page.getByRole('textbox', { name: '匯入 Profile', exact: true }).fill('{');
  await page.getByRole('button', { name: '匯入這份 Profile', exact: true }).click();
  assert.equal(await status.innerText(), '匯入失敗：不是有效的 JSON');
  assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('d2sim.profiles.v1'))))[0].name, name);
  await page.goto(new URL('en/grail/', base).href, { waitUntil: 'networkidle' });
  for (const [payload, expected] of [['{}', 'Restore failed: invalid file format.'], [JSON.stringify({ grail: {} }), 'Grail progress restored successfully!']]) {
    const received = page.waitForEvent('dialog');
    await page.locator('input[type="file"]').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
    const dialog = await received; assert.equal(dialog.message(), expected); await dialog.accept();
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ 網址: base, 異常匯入: 3, 繁中錯誤保留: true, 名稱與存檔保留: true, 聖杯還原提示: 2, 頁面例外: errors }));
} finally { await browser.close(); }
