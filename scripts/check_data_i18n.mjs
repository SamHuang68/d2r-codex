// 資料欄位的英文覆蓋檢查：職業流派、傭兵搭配的每一筆中文都要有英文對照。
// 為什麼要有這支：畫面文字的掃描（find_hardcoded_chinese_jsx.mjs）看不到寫在資料檔裡的字串，
// 新增流派或傭兵搭配時漏補英文，英文模式就會出現中文殘留。
// 用法：node scripts/check_data_i18n.mjs（失敗時離開碼為 1）
import { build } from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-check-'));
const entry = path.join(tmp, 'entry.ts');
fs.writeFileSync(entry, `
export * from ${JSON.stringify(path.join(root, 'src/data/classes'))};
export * as TR from ${JSON.stringify(path.join(root, 'src/data/classTranslations'))};
export * as MM from ${JSON.stringify(path.join(root, 'src/data/mercenaryMatrix'))};
export * as MMEN from ${JSON.stringify(path.join(root, 'src/data/mercenaryMatrixEn'))};
`);
const out = path.join(tmp, 'out.mjs');
await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error' });
const m = await import(pathToFileURL(out).href);

const problems = [];
const tr = m.TR.CLASS_TRANSLATIONS;
for (const c of m.CHARACTER_CLASSES_DATA) {
  const t = tr[c.id];
  if (!t) { problems.push(`職業 ${c.id} 沒有英文翻譯`); continue; }
  if ((t.popularBuilds?.length ?? 0) !== c.popularBuilds.length) problems.push(`職業 ${c.id}：流派 ${c.popularBuilds.length} 筆，英文只有 ${t.popularBuilds?.length ?? 0} 筆`);
}
const list = Object.values(m.MM).find((v) => Array.isArray(v) && v[0]?.tiers) ?? [];
const { GEAR_NOTE_EN, AURA_EN, MERC_TYPE_EN, BASE_NAME_EN, BUILD_I18N } = m.MMEN;
for (const e of list) {
  if (!BUILD_I18N[e.id]) problems.push(`傭兵搭配 ${e.id} 沒有 BUILD_I18N`);
  for (const t of Object.values(e.tiers)) {
    for (const g of ['weapon', 'helm', 'armor', 'shield', 'boots', 'gloves', 'belt', 'amulet', 'ring1', 'ring2']) {
      const x = t[g];
      if (x?.note && !GEAR_NOTE_EN[x.note]) problems.push(`傭兵裝備說明缺英文：${x.note}`);
      if (x?.baseName && !BASE_NAME_EN[x.baseName]) problems.push(`傭兵底材名缺英文：${x.baseName}`);
    }
    for (const a of t.keyAuras ?? []) if (!AURA_EN[a]) problems.push(`光環缺英文：${a}`);
    if (t.mercTypeZh && !MERC_TYPE_EN[t.mercTypeZh]) problems.push(`傭兵類型缺英文：${t.mercTypeZh}`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
const uniq = [...new Set(problems)];
if (uniq.length) { console.error(`英文對照不完整（${uniq.length} 項）：\n  ${uniq.join('\n  ')}`); process.exit(1); }
console.log('資料欄位英文對照完整');
