import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

// 僅驗首頁受影響操作；使用獨立瀏覽器，不接觸使用者收藏或設定。
const output = 'C:/Users/Sam/AI-Workspace/docs/d2r-codex/首頁優化';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = { baseline: {}, candidate: {}, checks: [] };
const labels = async (page) => page.locator('main section').nth(1).locator('h3').allTextContents();
const entries = async (page) => page.locator('main section').nth(1).locator('button, a').allTextContents();
const clean = (list) => list.map(s => s.replace(/\s+/g, ' ').trim()).sort();
try {
  for (const [kind, base] of [['baseline', 'https://d2r.samhuang68.org/'], ['candidate', 'http://127.0.0.1:4178/']]) {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    // 外嵌影片播放不在本次驗證範圍；保留 iframe，單獨驗證視窗操作。
    await context.route('https://www.youtube-nocookie.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>影片測試框</body></html>' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { level: 1 }).waitFor();
      await page.screenshot({ path: path.join(output, `${kind}-${width}.png`), fullPage: true });
      const metrics = await page.evaluate(() => {
        const section = document.querySelectorAll('main section')[1];
        return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, categoriesHeight: Math.round(section.getBoundingClientRect().height), entries: section.querySelectorAll('button,a').length };
      });
      results[kind][width] = { ...metrics, groups: clean(await labels(page)), entriesText: clean(await entries(page)) };
      if (kind === 'candidate') {
        assert.ok(metrics.scrollWidth <= width, `${width} 像素不應溢位`);
        assert.deepEqual(results.candidate[width].groups, results.baseline[width].groups, '分類必須完整保留');
        assert.deepEqual(results.candidate[width].entriesText, results.baseline[width].entriesText, '入口標題與完整說明必須保留');
      }
      if (width === 320) {
        const dock = page.locator('div.safe-area-pb');
        const boxes = await dock.locator('a,button').evaluateAll(nodes => nodes.map(n => { const r=n.getBoundingClientRect(); return { x:r.x, right:r.right, height:r.height }; }));
        if (kind === 'candidate') assert.ok(boxes.every(b => b.x >= 0 && b.right <= width && b.height >= 44), '手機底列全部按鈕在視窗內且高度至少44像素');
      }
    }
    if (kind === 'candidate') {
      await page.setViewportSize({width:1440,height:900});
      await page.goto(base, {waitUntil:'networkidle'});
      const heroSearch = page.locator('main').getByRole('button', { name: /搜尋資料庫/ });
      await heroSearch.click();
      const input = page.getByPlaceholder(/搜尋符文之語/);
      await input.fill('謎團');
      await page.getByText('謎團', {exact:true}).first().waitFor();
      await page.keyboard.press('Escape');
      await input.waitFor({state:'hidden'});
      results.checks.push('首頁搜尋沿用既有面板，謎團查詢有結果且可關閉');
      const trailer = page.getByRole('button',{name:'宣傳影片',exact:true});
      await trailer.click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      assert.equal(await page.evaluate(() => document.querySelector('dialog').matches(':modal')),true);
      assert.equal(await page.getByRole('button',{name:'關閉影片'}).evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement===document.body || !!document.activeElement?.closest('dialog')),true,'焦點不可進入背景操作');
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'});
      assert.equal(await trailer.evaluate(el=>el===document.activeElement),true,'焦點返回開啟按鈕');
      assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
      await trailer.click();
      await page.getByRole('button',{name:'關閉影片'}).click();
      await dialog.waitFor({state:'hidden'});
      results.checks.push('影片原生模態、開啟焦點、Escape、關閉按鈕與焦點返回');
      const category = page.locator('main section').nth(1);
      const patchLink = category.getByRole('link',{name:/版本改動/});
      assert.ok((await patchLink.getAttribute('href')).includes('patches/'));
      await patchLink.click();
      await page.waitForURL('**/patches/');
      await page.getByRole('heading').first().waitFor();
      await page.goBack({waitUntil:'networkidle'});
      await page.locator('main').getByRole('heading',{level:1}).waitFor();
      results.checks.push('分類原生連結、換頁及瀏覽器上一頁');
      await page.setViewportSize({width:320,height:900});
      await page.getByRole('button',{name:'全站功能',exact:true}).click();
      assert.ok(await page.locator('a:visible').count() >= 25);
      await page.getByRole('button',{name:'關閉選單'}).click();
      results.checks.push('手機全部功能選單可開啟及關閉');
      await page.goto(base+'en/',{waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.ok(await page.locator('main').getByRole('button',{name:/Search Database/}).isVisible());
      assert.ok(await page.locator('main').getByRole('link',{name:/Patch Changes/}).isVisible());
      await page.screenshot({path:path.join(output,'candidate-en-320.png'),fullPage:true});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      results.checks.push('英文版搜尋、分類入口與320像素版面保留');
      assert.deepEqual(errors,[],'候選不得新增頁面例外');
    }
    await context.close();
  }
  fs.writeFileSync(path.join(output,'畫面與操作結果.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({結果:'通過',檢查:results.checks,桌面分類高度:{原版:results.baseline[1440].categoriesHeight,新版:results.candidate[1440].categoriesHeight},入口數:results.candidate[1440].entries},null,2));
} finally { fs.writeFileSync(path.join(output,'畫面與操作結果.json'),JSON.stringify(results,null,2)); await browser.close(); }
