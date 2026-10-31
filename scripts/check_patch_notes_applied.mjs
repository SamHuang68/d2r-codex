// 檢查「版本改動」清單（src/data/patchNotes.ts）裡每一筆改動，是否已經反映在本站的基本資料（src/data/game/*.json 產生的單品資料）裡。
// 用途：更新遊戲資料（node scripts/data-pipeline/build_game_data.mjs …）之後跑它，就知道 3.4 的改動進來了幾筆；
//   全部進來之後，「版本改動」頁就可以改成歷史紀錄，不必再保留「尚未套用」的說明。
// 做法：每筆改動有 expect（套用後資料裡應出現的字串，本站資料自己的中文寫法）；項目的資料文字包含這些字串就算已套用。
// 用法：node scripts/check_patch_notes_applied.mjs [--strict]   （--strict：只要有任何一筆還沒反映就以非零結束）
import { build } from 'esbuild';

const bundle = await build({
  stdin: {
    contents: `
      export { PATCH_NOTES } from './src/data/patchNotes';
      export { UNIQUE_ITEMS_DATA } from './src/data/uniqueItems';
      export { SET_ITEMS_DATA } from './src/data/setItems';
      export { RUNEWORDS_DATA } from './src/data/runewords';`,
    resolveDir: process.cwd(), loader: 'ts',
  },
  bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'error',
  define: { 'import.meta.env': '{}' }, loader: { '.json': 'json' },
});
const { PATCH_NOTES, UNIQUE_ITEMS_DATA, SET_ITEMS_DATA, RUNEWORDS_DATA } = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);

const setText = (s) => [...(s.partialBonuses ?? []).map((b) => b.bonus), ...(s.fullBonuses ?? [])].join('\n');
const textOf = (e) => {
  if (e.kind === 'unique') { const u = UNIQUE_ITEMS_DATA.find((x) => x.nameEn === e.nameEn); return u && [u.attributes.join('\n'), `需要等級：${u.requiredLevel}`].join('\n'); }
  if (e.kind === 'runeword') { const r = RUNEWORDS_DATA.find((x) => x.nameEn === e.nameEn); return r && [r.attributes.join('\n'), r.allowedBases.join('、')].join('\n'); }
  if (e.kind === 'set') { const s = SET_ITEMS_DATA.find((x) => x.nameEn === e.nameEn); return s && setText(s); }
  // 套裝部件：預設只看部件自己的屬性（全套加成裡本來就有的字串不能算數）；兩件套、全套的加成寫在套裝上時（expectInSet）才連套裝一起看
  const s = SET_ITEMS_DATA.find((x) => x.nameEn === e.parentSet);
  const p = s?.pieces.find((x) => x.nameEn === e.nameEn);
  return p && (e.expectInSet ? `${p.attributes.join('\n')}\n${setText(s)}` : p.attributes.join('\n'));
};

const rows = PATCH_NOTES.map((e) => {
  const text = textOf(e);
  if (text === undefined) return { e, status: '找不到' };
  const missing = e.expect.filter((t) => !text.includes(t));
  return { e, status: missing.length ? '未套用' : '已套用', missing };
});

for (const v of ['3.4', '3.3']) {
  const list = rows.filter((r) => r.e.version === v);
  const applied = list.filter((r) => r.status === '已套用').length;
  console.log(`\nPatch ${v}：${applied}／${list.length} 筆已反映在基本資料`);
  for (const r of list) console.log(`  ${r.status === '已套用' ? '✓' : r.status === '找不到' ? '?' : '✗'} ${r.e.nameEn}${r.status === '未套用' ? `（資料裡還沒有：${r.missing.join('、')}）` : r.status === '找不到' ? '（資料裡找不到這個項目）' : ''}`);
}
const pending = rows.filter((r) => r.status !== '已套用').length;
console.log(`\n合計 ${rows.length - pending}／${rows.length} 筆已套用。`);
if (process.argv.includes('--strict') && pending) process.exit(1);
