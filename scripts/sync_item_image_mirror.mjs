// 物品圖自家鏡像（public/mirror/d2rw/img/items/…）的清單檢查與補抓。
// 來源：程式與資料裡出現過的 static.d2r.world/img/items/… 網址，加上 src/data/catalogImageMap.json 的對照值。
// 用法：
//   node scripts/sync_item_image_mirror.mjs            # 檢查：有網址沒備份就失敗（CI 用）
//   node scripts/sync_item_image_mirror.mjs --download # 把缺的備份從原站抓下來（新增物品圖時執行）
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const mirrorDir = path.join(root, 'public/mirror/d2rw');
const download = process.argv.includes('--download');

const walk = (d, out = []) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|json)$/.test(f.name)) out.push(p);
  }
  return out;
};

const paths = new Set();
const re = /(?:static\.d2r\.world\/)?(img\/items\/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|gif))/g;
for (const f of walk(path.join(root, 'src'))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(re)) paths.add(m[1]);
}
const map = JSON.parse(fs.readFileSync(path.join(root, 'src/data/catalogImageMap.json'), 'utf8'));
for (const sec of Object.values(map)) for (const v of Object.values(sec)) if (v && !v.startsWith('images/')) paths.add(`img/items/${v}`);

const missing = [...paths].filter((p) => !fs.existsSync(path.join(mirrorDir, p)) || fs.statSync(path.join(mirrorDir, p)).size < 200).sort();
if (!missing.length) { console.log(`物品圖鏡像完整（${paths.size} 張）`); process.exit(0); }
if (!download) {
  console.error(`缺少 ${missing.length} 張物品圖鏡像，請執行 node scripts/sync_item_image_mirror.mjs --download：\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
let failed = 0;
for (const p of missing) {
  const res = await fetch(`https://static.d2r.world/${p}`);
  if (!res.ok || !(res.headers.get('content-type') ?? '').startsWith('image/')) { console.error(`下載失敗 ${res.status} ${p}`); failed++; continue; }
  const dest = path.join(mirrorDir, p);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}
console.log(`已補 ${missing.length - failed} 張，失敗 ${failed} 張`);
process.exit(failed ? 1 : 0);
