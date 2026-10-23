// 僅驗證本次三項修復；新建隔離瀏覽器情境，不讀取使用者瀏覽器資料。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (key, fallback) => { const i = args.indexOf(key); return i < 0 ? fallback : args[i + 1]; };
const base = opt('--url', 'http://127.0.0.1:4173/');
const evidence = path.resolve(opt('--evidence', 'dist/review-evidence'));
const observe = args.includes('--observe');
const localHosts = new Set(['127.0.0.1', 'localhost', '[::1]']);
assert.ok(localHosts.has(new URL(base).hostname), '測試只允許本機預覽');
fs.mkdirSync(evidence, { recursive: true });
const trace = [];
const record = (event, data) => {
  const row = { time: new Date().toISOString(), correlationId: observe ? '修正前' : '修正後', event, ...data };
  trace.push(row);
  fs.writeFileSync(path.join(evidence, 'trace.json'), JSON.stringify(trace, null, 2));
  console.log(JSON.stringify(row));
};
const browser = await chromium.launch({ channel: 'chrome', headless: true });
record('瀏覽器', { version: browser.version(), base, observe });
const errors = [];
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route('**/*', route => {
    const url = new URL(route.request().url());
    return localHosts.has(url.hostname) ? route.continue() : route.abort();
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + '#planner', { waitUntil: 'domcontentloaded' });
  await page.locator('.d2sim').waitFor();
  const row = label => page.locator('.d2-row').filter({ has: page.locator('.k', { hasText: new RegExp('^' + label + '$') }) }).locator('.v');
  const life = await row('生命').innerText();
  const res = await row('最低元素抗性').innerText();
  const ehp = await row('有效生命（最弱元素）'.replace(/[（）]/g, '.')).innerText();
  record('配裝預設', { life, res, ehp });
  assert.equal(life, '189 / 189');
  assert.equal(res, '-70%');
  if (!observe) assert.equal(ehp, '111.2');
  await page.getByText('有效生命（最弱元素）', { exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(evidence, 'planner.png') });

  await page.goto(base + '#grail', { waitUntil: 'domcontentloaded' });
  const search = page.getByPlaceholder('搜尋聖杯清單裝備名稱、英文或底材...');
  await search.fill('Biggin');
  const name = page.getByText('畢格因的軟帽', { exact: true });
  await name.waitFor();
  const card = page.locator('div.rounded-2xl').filter({ has: name }).filter({ has: page.getByRole('button', { name: /ETH/ }) }).last();
  const main = card.locator(':scope > :first-child');
  const eth = card.getByRole('button', { name: /ETH/ });
  const semantics = await main.evaluate(el => ({ tag: el.tagName, role: el.getAttribute('role'), tabIndex: el.tabIndex, pressed: el.getAttribute('aria-pressed'), label: el.getAttribute('aria-label') }));
  record('收藏初始語意', semantics);
  await card.screenshot({ path: path.join(evidence, 'grail-initial.png') });
  assert.equal(await page.evaluate(() => localStorage.getItem('d2r_sanctuary_grail_v1')), null, '隔離資料必須為空');
  const storage = () => page.evaluate(() => JSON.parse(localStorage.getItem('d2r_sanctuary_grail_v1')));
  const state = async (event) => { const value = await storage(); record(event, { storage: value }); return value; };
  if (observe) {
    await main.click();
    await state('滑鼠收藏');
    await eth.click();
    await state('滑鼠無形');
    await page.reload();
    await search.fill('Biggin');
    await state('重新載入');
  } else {
    assert.equal(semantics.tag, 'BUTTON');
    assert.equal(semantics.tabIndex, 0);
    assert.equal(semantics.pressed, 'false');
    assert.match(semantics.label, /畢格因的軟帽.*Biggin.*收藏/);
    assert.equal(await eth.getAttribute('aria-pressed'), 'false');
    // 從搜尋框使用真實 Tab，抵達收藏控制；不使用直接 focus 冒充鍵盤可達。
    await search.click();
    let reached = false;
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
      reached = await main.evaluate(el => document.activeElement === el);
      if (reached) break;
    }
    assert.ok(reached, 'Tab 可抵達收藏');
    const focus = await main.evaluate(el => ({ visible: el.matches(':focus-visible'), shadow: getComputedStyle(el).boxShadow, outline: getComputedStyle(el).outlineStyle, opacity: getComputedStyle(el.parentElement).opacity }));
    assert.ok(focus.visible);
    assert.ok(focus.shadow !== 'none' || focus.outline !== 'none', '焦點必須可見');
    record('鍵盤焦點', focus);
    await card.screenshot({ path: path.join(evidence, 'grail-focus.png') });
    await page.keyboard.press('Enter');
    assert.equal(await main.getAttribute('aria-pressed'), 'true');
    let s = await state('Enter 收藏');
    const itemId = Object.keys(s.obtainedItemIds)[0];
    assert.ok(itemId);
    assert.deepEqual(s.etherealItemIds, {});
    await page.keyboard.press('Space');
    assert.equal(await main.getAttribute('aria-pressed'), 'false');
    s = await state('Space 取消收藏');
    assert.deepEqual(s.obtainedItemIds, {});
    await main.click();
    assert.equal(await main.getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Tab');
    assert.ok(await eth.evaluate(el => document.activeElement === el), '收藏後的 Tab 為 ETH');
    await page.keyboard.press('Space');
    assert.equal(await eth.getAttribute('aria-pressed'), 'true');
    s = await state('Space 無形');
    assert.deepEqual(s.obtainedItemIds, { [itemId]: true });
    assert.deepEqual(s.etherealItemIds, { [itemId]: true });
    await page.keyboard.press('Shift+Tab');
    assert.ok(await main.evaluate(el => document.activeElement === el));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await eth.getAttribute('aria-pressed'), 'false');
    await eth.click();
    assert.equal(await eth.getAttribute('aria-pressed'), 'true');
    await page.reload();
    await search.fill('Biggin');
    assert.equal(await main.getAttribute('aria-pressed'), 'true');
    assert.equal(await eth.getAttribute('aria-pressed'), 'true');
    s = await state('重新載入保留兩種收藏');
    assert.deepEqual(s.obtainedItemIds, { [itemId]: true });
    assert.deepEqual(s.etherealItemIds, { [itemId]: true });
    const ax = await card.ariaSnapshot();
    assert.match(ax, /button .*收藏.*\[pressed\]/);
    assert.match(ax, /button .*ETH.*\[pressed\]/);
    record('讀屏語意樹', { snapshot: ax });
    await main.click();
    assert.equal(await eth.getAttribute('aria-pressed'), 'true', '取消一般收藏不能連動 ETH');
    await eth.click();
    await page.reload();
    await search.fill('Biggin');
    assert.equal(await main.getAttribute('aria-pressed'), 'false');
    assert.equal(await eth.getAttribute('aria-pressed'), 'false');
    s = await state('取消收藏持久化');
    assert.deepEqual(s.obtainedItemIds, {});
    assert.deepEqual(s.etherealItemIds, {});
  }

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  const hero = page.locator('section').filter({ has: page.getByRole('heading', { name: /聖休亞瑞的命運/ }) });
  await hero.waitFor();
  const heroText = await hero.innerText();
  record('首頁', { text: heroText });
  await page.screenshot({ path: path.join(evidence, 'home.png') });
  if (!observe) {
    const runewords = JSON.parse(fs.readFileSync('src/data/game/runewords.json', 'utf8'));
    const skills = JSON.parse(fs.readFileSync('src/data/game/skills.json', 'utf8'));
    const classes = new Set(skills.filter(s => s.charClass).map(s => s.charClass));
    const trees = new Set(skills.filter(s => s.charClass && s.page).map(s => s.charClass + '/' + s.page));
    assert.match(heroText, new RegExp(runewords.length + ' 組'));
    assert.match(heroText, new RegExp(trees.size + ' 系技能樹'));
    assert.match(heroText, new RegExp(classes.size + ' 職業技能資料'));
    assert.doesNotMatch(heroText, /80組|80\+ 款|21 系樹|7大職業全技能/);
    await hero.getByRole('button', { name: /符文之語/ }).click();
    await page.getByText(new RegExp('已收錄\\s*' + runewords.length + '\\s*組 • 篩選符合\\s*' + runewords.length + '\\s*組')).waitFor();
    assert.ok(page.url().endsWith('#runewords'));
    record('符文之語導覽', { url: page.url(), count: runewords.length });
    for (const width of [390, 640]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await hero.waitFor();
      let size = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert.ok(size.scrollWidth <= size.width + 1, '首頁不能水平溢位');
      await page.screenshot({ path: path.join(evidence, 'home-' + width + '.png') });
      await page.goto(base + '#grail', { waitUntil: 'domcontentloaded' });
      await search.fill('Biggin');
      await main.waitFor();
      size = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert.ok(size.scrollWidth <= size.width + 1, '聖杯不能水平溢位');
      assert.ok(await main.isVisible());
      assert.ok(await eth.isVisible());
      await main.click();
      assert.equal(await main.getAttribute('aria-pressed'), 'true');
      await main.click();
      await card.screenshot({ path: path.join(evidence, 'grail-' + width + '.png') });
      record('窄螢幕', { ...size, controlsVisible: true });
    }
  }
  assert.deepEqual(errors, []);
  record('完成', { errors, mode: observe ? '修正前重現' : '定點驗收通過' });
  await ctx.close();
} finally {
  await browser.close();
}
