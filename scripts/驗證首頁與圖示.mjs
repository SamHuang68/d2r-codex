// 只檢查首頁摘要、三個首頁元件的匯入閉包及收藏圖示 HTML，不建置整個應用程式。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

execFileSync(process.execPath, ['scripts/build_portal_summary.mjs', '--check'], { stdio: 'inherit' });
const summary = JSON.parse(fs.readFileSync('src/data/codex/portalSummary.json', 'utf8'));
const skills = JSON.parse(fs.readFileSync('src/data/game/skills.json', 'utf8'));
const runewords = JSON.parse(fs.readFileSync('src/data/game/runewords.json', 'utf8'));
assert.equal(summary.gearTiles.length, 6);
assert.equal(summary.gearTiles.find(tile => tile.id === 'runewords').count, runewords.length);
assert.deepEqual(summary.skills, {
  classCount: new Set(skills.filter(skill => skill.charClass && skill.page).map(skill => skill.charClass)).size,
  treeCount: new Set(skills.filter(skill => skill.charClass && skill.page).map(skill => `${skill.charClass}/${skill.page}`)).size,
});
console.log('摘要與實際資料一致', { runewords: runewords.length, ...summary.skills });

const entries = ['HeroSection', 'CategoryGrid', 'ClassShowcase'].map(name => `src/components/portal/${name}.tsx`);
const graph = await build({
  entryPoints: entries, bundle: true, write: false, metafile: true, outdir: 'unused-review-output',
  platform: 'browser', format: 'esm', external: ['react', 'lucide-react'], logLevel: 'error',
});
const inputs = Object.keys(graph.metafile.inputs).map(file => file.replaceAll('\\', '/'));
const forbidden = inputs.filter(file => /^src\/data\/(?:game\/|skills(?:\/|\.)|runewords\.)/.test(file));
assert.deepEqual(forbidden, [], '三個首頁元件不能靜態載入符文／技能／遊戲大資料');
assert.ok(inputs.includes('src/data/codex/portalSummary.json'));
console.log('三個首頁元件的有界匯入閉包通過', { entries, inputCount: inputs.length, forbidden });

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'd2r-review-icon-'));
const file = path.join(temp, 'icon.cjs');
try {
  await build({
    stdin: {
      contents: `import React from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';
        import { ItemIcon } from './src/components/common/ItemIcon';
        export { artBoxOf } from './src/components/common/MagicArt';
        export { buildSkillSummary } from './src/data/codex/portalTiles';
        export function renderIcon(props) { return renderToStaticMarkup(React.createElement('button', { type: 'button' }, React.createElement(ItemIcon, props))); }`,
      resolveDir: process.cwd(), loader: 'tsx',
    },
    bundle: true, platform: 'node', format: 'cjs', outfile: file, logLevel: 'error',
    define: { 'import.meta.env.BASE_URL': '"./"' },
  });
  const M = createRequire(import.meta.url)(file);
  assert.deepEqual(M.buildSkillSummary([]), { classCount: 0, treeCount: 0 });
  assert.deepEqual(M.buildSkillSummary([{ trees: [] }, { trees: [{ skills: [] }] }]), { classCount: 0, treeCount: 0 });
  assert.deepEqual(M.buildSkillSummary([
    { trees: [{ skills: [1] }, { skills: [] }, { skills: [2, 3] }] },
    { trees: [{ skills: [] }] },
    { trees: [{ skills: [4] }] },
  ]), { classCount: 2, treeCount: 3 });
  console.log('技能摘要：空資料、空職業／樹、混合非空資料三項通過');

  const knownMagic = 'https://static.d2r.world/img/items/magic/cap_hat_cgrn.jpg';
  assert.ok(M.artBoxOf(knownMagic), '此案例必須走已知 artBox 的 SVG 分支');
  const cases = [
    ['已知魔法圖示 SVG', { imageUrl: knownMagic }, /<svg/],
    ['未知魔法圖示遮罩', { imageUrl: 'https://static.d2r.world/img/items/magic/review-missing.jpg' }, /backdrop-filter/],
    ['一般圖片', { imageUrl: '/review-local.png' }, /<img/],
    ['缺圖佔位', { noGuess: true }, /◇/],
  ];
  for (const [name, props, expected] of cases) {
    const html = M.renderIcon({ ...props, name: '定點圖示', as: 'span' });
    assert.match(html, /<button[^>]*><span/);
    assert.doesNotMatch(html, /<(?:div|p|section|article|ul|li|table)\b/);
    assert.match(html, expected);
    assert.equal((html.match(/<button\b/g) || []).length, 1);
    console.log('圖示 phrasing content 通過：' + name);
  }
  assert.match(M.renderIcon({ noGuess: true }), /<button[^>]*><div/);
  console.log('ItemIcon 預設呼叫維持 div 根節點');
} finally {
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.rmdirSync(temp);
}
