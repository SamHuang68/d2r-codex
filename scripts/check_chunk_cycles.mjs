// 檢查建置產物（dist/assets/*.js）的 chunk 之間有沒有「循環匯入」。
// 為什麼要有這支：循環匯入在開發伺服器不會出事、建置也會過，但上線後瀏覽器依載入順序執行 chunk，
// 會在某個 chunk 讀到還沒初始化的變數，出現 "Cannot access 'x' before initialization" 而整頁空白。
// 用法：npm run build && node scripts/check_chunk_cycles.mjs [dist 目錄]
// 只看靜態匯入（import … from './x.js'、export … from './x.js'）與 modulepreload；動態 import() 不會造成初始化順序問題，不計入。
import fs from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] || 'dist';
const dir = path.join(dist, 'assets');
if (!fs.existsSync(dir)) { console.error(`找不到 ${dir}，請先執行 npm run build`); process.exit(2); }

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
const graph = new Map();
// 靜態匯入：import{a as b}from"./x.js"、import"./x.js"、export{a}from"./x.js"、export*from"./x.js"（壓縮後 from 前後沒有空白）；
// import("./x.js") 是動態匯入，括號擋住了這個樣式，不會被算進來
const staticRe = /(?:from|import)\s*["']\.\/([^"']+\.js)["']/g;
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const deps = new Set();
  for (const m of src.matchAll(staticRe)) { if (files.includes(m[1]) && m[1] !== f) deps.add(m[1]); }
  graph.set(f, deps);
}

// 找環（深度優先）
const cycles = []; const state = new Map(); const stack = [];
const visit = (n) => {
  state.set(n, 1); stack.push(n);
  for (const d of graph.get(n) ?? []) {
    if (state.get(d) === 1) cycles.push([...stack.slice(stack.indexOf(d)), d]);
    else if (!state.has(d)) visit(d);
  }
  stack.pop(); state.set(n, 2);
};
for (const f of files) if (!state.has(f)) visit(f);

const short = (f) => f.replace(/-[A-Za-z0-9_]{8}\.js$/, '');
console.log(`chunk ${files.length} 個；靜態匯入邊 ${[...graph.values()].reduce((a, s) => a + s.size, 0)} 條`);
if (cycles.length) {
  console.error(`\n發現 ${cycles.length} 個循環匯入（上線後可能整頁空白）：`);
  cycles.forEach((c) => console.error('  ' + c.map(short).join(' → ')));
  process.exit(1);
}
console.log('沒有循環匯入');
