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
  // 結構化資料（JSON-LD）要能解析且含 schema.org 型別；分享預覽圖（og:image、twitter:image）要指到存在的檔案
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!ld) bad.push(`${rel || '/'}：沒有結構化資料（JSON-LD）`);
  else {
    try {
      const j = JSON.parse(ld);
      if (!String(j['@context'] ?? '').includes('schema.org') || !(j['@type'] || j['@graph'])) bad.push(`${rel || '/'}：JSON-LD 缺少 @context 或型別`);
    } catch (e) { bad.push(`${rel || '/'}：JSON-LD 不是合法 JSON（${e.message}）`); }
  }
  for (const prop of ['og:image', 'twitter:image']) {
    const img = html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]+)"`))?.[1];
    if (!img) { bad.push(`${rel || '/'}：沒有 ${prop}`); continue; }
    const m = img.match(/^https:\/\/d2r\.samhuang68\.org\/(.+)$/);
    if (!m || !fs.existsSync(path.join(dist, m[1]))) bad.push(`${rel || '/'}：${prop} 指到不存在的檔案（${img}）`);
  }
  // 每個靜態頁都要在 sitemap.xml 裡
  if (rel && !sitemap.includes(`/${encodeURI(rel)}/</loc>`)) bad.push(`${rel}：不在 sitemap.xml 裡`);
}
if (bad.length) { console.error(`靜態頁連結檢查失敗（${bad.length} 處）：\n- ${bad.slice(0, 20).join('\n- ')}`); process.exit(1); }
console.log(`靜態頁連結檢查通過：${pages.length} 個頁面、${links} 個連結都指到存在的頁面，都在 sitemap.xml 裡，且都有可解析的結構化資料與存在的分享預覽圖`);
