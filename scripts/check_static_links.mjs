// 檢查建置產物（dist）裡每個靜態頁的 <noscript> 連結都指到存在的頁面：
// 單品外殼的 <base> 指向網站根目錄，所以連結都相對於 dist 根目錄（例如 items/tarnhelm/）。
// 用法：node scripts/check_static_links.mjs [dist 目錄]（先 npm run build）
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) { console.error(`找不到 ${dist}/index.html，請先執行 npm run build`); process.exit(2); }

const pages = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'assets' || e.name === 'images' || e.name === 'mirror') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(p);
  }
};
walk(dist);

let links = 0;
const bad = [];
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const ns = html.match(/<noscript>\s*<main>[\s\S]*?<\/noscript>/)?.[0] ?? '';
  const rel = path.relative(dist, path.dirname(file)).split(path.sep).join('/');
  for (const m of ns.matchAll(/href="([^"]+)"/g)) {
    const href = decodeURIComponent(m[1]);
    links++;
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = href.replace(/^\.\//, '');
    if (target.startsWith('../')) { bad.push(`${rel || '/'}：連結 ${href} 用了 ../（會以 <base> 為基準而指錯）`); continue; }
    const dir = path.join(dist, target);
    if (!fs.existsSync(path.join(dir, 'index.html')) && !(target === '' && fs.existsSync(path.join(dist, 'index.html')))) bad.push(`${rel || '/'}：連結 ${href} 沒有對應的頁面`);
  }
  // 每個靜態頁都要在 sitemap.xml 裡
  if (rel && !sitemap.includes(`/${encodeURI(rel)}/</loc>`)) bad.push(`${rel}：不在 sitemap.xml 裡`);
}
if (bad.length) { console.error(`靜態頁連結檢查失敗（${bad.length} 處）：\n- ${bad.slice(0, 20).join('\n- ')}`); process.exit(1); }
console.log(`靜態頁連結檢查通過：${pages.length} 個頁面、${links} 個連結都指到存在的頁面，且都在 sitemap.xml 裡`);
