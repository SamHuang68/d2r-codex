import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'd2r-messages-'));
const exports = ['src/data/profileStore.ts', 'src/engine/customItem.ts', 'src/engine/skillPlan.ts', 'src/data/presetResolver.ts', 'src/components/simulator/v2/equipRules.ts', 'src/engine/catalog.ts'];
const contents = exports.map(p => `export * from ${JSON.stringify(path.join(root, p))};`).join('\n');
async function bundle(original) {
  const outfile = path.join(temp, original ? 'baseline.mjs' : 'current.mjs');
  await build({ stdin: { contents, resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile,
    plugins: original ? [{ name: 'baseline', setup(b) { b.onLoad({ filter: /(?:profileStore|customItem|skillPlan|presetResolver|equipRules)\.ts$/ }, args => ({ contents: execFileSync('git', ['show', `f13f74bd9a391d14c5bea735a7ae9203a626e620:${path.relative(root, args.path).replaceAll('\\', '/')}`], { encoding: 'utf8' }), loader: 'ts' })); } }] : [] });
  return import(pathToFileURL(outfile).href);
}
try {
  const old = await bundle(true), current = await bundle(false);
  const valid = () => ({ v: 1, name: '我的配裝 火焰 Ω', savedAt: 1, data: { classCode: 'sor', equipped: {}, charms: [] } });
  const tests = [];
  const add = edit => { const p = valid(); edit(p); tests.push(JSON.stringify(p)); };
  tests.push('{', 'null', '[]', '{}');
  add(p => p.v = 2); add(p => p.name = 2); add(p => p.data = null);
  add(p => p.data.classCode = 'unknown'); add(p => p.data.equipped = []);
  add(p => p.data.equipped.unknown = {});
  for (const location of ['equipped', 'charms', 'merc']) {
    for (const item of [null, { id: 'x', baseCode: 3 }, { id: 'x', sockets: [3] }, { id: 'x', sockets: Array(7).fill('x') }, { id: 'x', randomSkill: 3 }]) {
      add(p => { if (location === 'equipped') p.data.equipped.head = item; else if (location === 'charms') p.data.charms = [item]; else p.data.merc = { equipped: { head: item } }; });
    }
  }
  for (const charms of [{}, Array(41).fill({ id: 'x' })]) add(p => p.data.charms = charms);
  for (const skillPoints of [[], { firebolt: 'x' }]) add(p => p.data.skillPoints = skillPoints);
  for (const buffsOn of [[], { test: 1 }]) add(p => p.data.buffsOn = buffsOn);
  for (const merc of [[], { equipped: [] }, { equipped: { boots: { id: 'x' } } }]) add(p => p.data.merc = merc);
  const custom = { baseCode: 'rin', name: '我的戒指 Ω', affixes: [{ code: 'hp', value: 30 }] };
  const customCases = [null, { ...custom, baseCode: 'unknown' }, { ...custom, name: null }, { ...custom, affixes: {} }, { ...custom, affixes: Array(9).fill({ code: 'hp', value: 1 }) }, { ...custom, affixes: [null] }, { ...custom, affixes: [{ code: 'unknown', value: 1 }] }, { ...custom, affixes: [{ code: 'hp', value: 'x' }] }];
  for (const c of customCases) add(p => p.data.equipped.ring1 = { id: 'custom', custom: c });
  for (const text of tests) {
    assert.equal(current.parseProfile(text), old.parseProfile(text), '繁中錯誤不得改變');
    const en = current.parseProfile(text, true);
    assert.equal(typeof en, 'string'); assert.ok(!/[\u3400-\u9fff]/u.test(en), en);
  }
  const p = valid(); p.data.equipped.ring1 = { id: 'custom', custom };
  const zh = current.parseProfile(JSON.stringify(p));
  const en = current.parseProfile(JSON.stringify(p), true);
  assert.deepEqual(en, zh); assert.deepEqual(en, old.parseProfile(JSON.stringify(p)));
  assert.equal(en.name, p.name); assert.equal(en.data.equipped.ring1.custom.name, custom.name);
  const restored = current.fromSavedData(en.data, true);
  assert.equal(restored.snap.equipped.ring1.entry.nameEn, custom.name);
  assert.equal(current.parseProfile(current.exportProfile(en), true).name, p.name);
  const unnamed = valid(); unnamed.name = '';
  assert.equal(current.parseProfile(JSON.stringify(unnamed), true).name, 'Imported Profile');
  const socketData = current.parseProfile(JSON.stringify(valid())).data;
  socketData.equipped.head = { id: current.getCatalog().find(x => x.slot === 'head').id, sockets: ['missing-socket'] };
  assert.deepEqual(current.fromSavedData(socketData, true).errors, ['Socketable "missing-socket" was not found']);
  const missing = current.parseProfile(JSON.stringify(valid())).data;
  missing.equipped.head = { id: 'missing-item' };
  missing.charms = [{ id: 'custom', custom: { ...custom, baseCode: 'missing' } }];
  const errors = current.fromSavedData(missing, true).errors;
  assert.ok(errors[0].includes('missing-item')); assert.ok(errors[1].includes(custom.name));
  assert.ok(!/[\u3400-\u9fff]/u.test(errors[1].replace(custom.name, '')));
  assert.deepEqual(current.fromSavedData(missing).errors, old.fromSavedData(missing).errors);
  const specs = [{ main: 'missing' }, { main: 'Blizzard', extra: { 'Fire Ball': 20, 'missing': 1 }, fill: ['missing'] }, { main: 'Bash', extra: { 'Frozen Orb': 20 } }];
  for (const spec of specs) {
    const a = current.planSkills('sor', 1, spec, 0), b = current.planSkills('sor', 1, spec, 0, true);
    assert.deepEqual(a, old.planSkills('sor', 1, spec, 0));
    assert.deepEqual({ ...a, notes: [] }, { ...b, notes: [] });
    assert.ok(!/[\u3400-\u9fff]/u.test(b.notes.join('')));
  }
  const entry = current.getCatalog().find(x => x.slot === 'weapon');
  for (const target of ['head', 'shieldI']) {
    const result = current.slotPlacementError(target, { ...entry, twoHanded: true }, {}, 'Barbarian', true);
    assert.equal(typeof result, 'string'); assert.ok(!/[\u3400-\u9fff]/u.test(result));
    assert.equal(current.slotPlacementError(target, entry, {}, 'Sorceress'), old.slotPlacementError(target, entry, {}, 'Sorceress'));
  }
  for (const item of [{ nameEn: 'missing-item' }, { nameEn: entry.nameEn, baseNameEn: 'missing-base' }, { nameEn: entry.nameEn, sockets: ['missing-socket'] }]) {
    const preset = { items: { weaponI: item }, charms: [] };
    const a = current.resolvePreset(preset), b = current.resolvePreset(preset, true);
    assert.deepEqual(a, old.resolvePreset(preset));
    assert.deepEqual({ ...a, errors: [] }, { ...b, errors: [] });
    assert.ok(b.errors.length); assert.ok(!/[\u3400-\u9fff]/u.test(b.errors.join('')));
  }
  console.log(JSON.stringify({ 異常匯入案例: tests.length, 自訂名稱保留: true, 繁中基準相同: true, 技能與穿戴規則保留: true }));
} finally {
  assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(temp).startsWith('d2r-messages-'));
  fs.rmSync(temp, { recursive: true, force: true });
}
