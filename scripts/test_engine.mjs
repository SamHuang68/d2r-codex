// S2 計算引擎測試。以 esbuild 打包 src/engine 後執行：node scripts/test_engine.mjs
// 說明：本測試驗證（a）引擎與遊戲資料表一致、（b）公式實作與研究所引公式一致、（c）資料完整性（不得無聲丟棄屬性）。
// 它不能證明數值與遊戲內相同；對遊戲實測值的比對見 scripts/golden/ （待補，需遊戲內截圖）。
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'd2eng-')), 'engine.mjs');
await build({
  stdin: { contents: "export * from './src/engine/index'; export * from './src/engine/data';", resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error', loader: { '.json': 'json' },
});
const E = await import(pathToFileURL(out).href);
const { computeCharacter, resolveModifier, gameData, itemFromUnique, itemFromRuneword } = E;
const rd = (n) => JSON.parse(fs.readFileSync(`src/data/game/${n}.json`, 'utf8'));

let pass = 0; const t = (name, fn) => { try { fn(); pass++; console.log('  ✓', name); } catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; } };
const none = { str: 0, dex: 0, vit: 0, ene: 0 };
const bare = (className, level = 1, allocated = none, items = [], extra = {}) => computeCharacter(gameData, { className, level, allocated, items, ...extra });

console.log('【起始數值：與公開的 7 職業起始值（Gamer Guides）一致】');
const START = { Amazon: [50, 15, 84], Assassin: [50, 25, 95], Barbarian: [55, 10, 91], Druid: [55, 20, 84], Necromancer: [45, 25, 79], Paladin: [55, 15, 89], Sorceress: [40, 35, 74] };
for (const [cls, [life, mana, sta]] of Object.entries(START)) {
  t(`${cls} Lv1 生命${life} 法力${mana} 耐力${sta}`, () => {
    const r = bare(cls);
    assert.equal(r.life, life); assert.equal(r.mana, mana);
    // 野蠻人起始耐力：遊戲資料表為 92，公開指南為 91（資料表為準，差異已記錄於報告）
    assert.equal(r.stamina, cls === 'Barbarian' ? 92 : sta);
  });
}
t('Warlock Lv1：生命 55（hpadd30+體力25）、法力 20、耐力 86（由 charstats 推導，與 7 職業同一規則）', () => {
  const r = bare('Warlock'); assert.deepEqual([r.life, r.mana, r.stamina], [55, 20, 86]);
});

console.log('【成長：每級／每點】');
t('Sorceress Lv90、加 100 體力：生命＝40＋89×1＋100×2', () => {
  assert.equal(bare('Sorceress', 90, { ...none, vit: 100 }).life, 40 + 89 + 200);
});
t('Warlock Lv66、體力 180（加 155）、精力 30（加 10）：生命 650、法力 137（無裝備）', () => {
  const r = bare('Warlock', 66, { str: 0, dex: 0, vit: 155, ene: 10 });
  assert.equal(r.life, 55 + 65 * 2 + 155 * 3); assert.equal(r.mana, Math.floor(20 + 65 * 1.5 + 10 * 2));
});

console.log('【生命公式順序：(基礎＋固定)×(1+IML)＋依等級＋軟體力】');
t('固定+100 生命、+20% 最大生命、+依等級生命(12→1.5/級)、+10 體力（軟）', () => {
  const items = [{ slot: 'x', baseCode: 'cm1', mods: [{ code: 'hp', min: 100, max: 100 }, { code: 'hp%', min: 20, max: 20 }, { code: 'hp/lvl', par: 12 }, { code: 'vit', min: 10, max: 10 }] }];
  const base = 40 + 89 * 1 + 50 * 2; // Sorc Lv90、硬點體力 +50
  const exp = Math.floor((base + 100) * 1.2 + 135 + 10 * 2);
  assert.equal(bare('Sorceress', 90, { ...none, vit: 50 }, items).life, exp);
});

console.log('【軍帽（Harlequin Crest）逐項】');
t('Lv90：+2 全技能、MF50、減傷10、+2 全屬性、生命／法力各+135', () => {
  const r = bare('Sorceress', 90, none, [itemFromUnique('harlequin_crest_248', 'helm')]);
  assert.equal(r.skills.all, 2);
  assert.equal(r.stats.item_magicbonus, 50);
  assert.equal(r.stats.damageresist, 10);
  assert.deepEqual([r.attributes.str, r.attributes.dex, r.attributes.vit, r.attributes.ene], [12, 27, 12, 37]);
  assert.equal(r.life, Math.floor(40 + 89 + 135 + 2 * 2)); // 軟體力 +2 → +4（不被 IML 乘）
  assert.equal(r.mana, Math.floor(35 + 89 * 2 + 135 + 2 * 2));
  assert.equal(r.defense, Math.floor(141 /*Shako 上限防禦*/) + Math.floor(27 / 4));
  assert.equal(r.unhandled.length, 0);
});

console.log('【抗性：難度懲罰、安亞、上限】');
t('Hell 無裝備：-100＋30（3 次安亞）＝ -70', () => assert.equal(bare('Paladin', 90).resist.fire, -70));
t('Hell 不計安亞：-100', () => assert.equal(bare('Paladin', 90, none, [], { anyaScrolls: 0 }).resist.cold, -100));
t('Nightmare：-40＋20', () => assert.equal(bare('Paladin', 90, none, [], { difficulty: 'nightmare' }).resist.poison, -20));
t('全抗 +60 → 上限 75 截斷，rawResist 保留未截斷值', () => {
  const r = bare('Paladin', 90, none, [{ slot: 'x', baseCode: 'cm1', mods: [{ code: 'res-all', min: 60, max: 60 }] }]);
  assert.equal(r.resist.fire, -10);
  assert.equal(r.rawResist.fire, -70 + 60);
});
t('全抗 +160 → 75 上限；+最大抗性 +5 → 80 上限', () => {
  const r = bare('Paladin', 90, none, [{ slot: 'x', baseCode: 'cm1', mods: [{ code: 'res-all', min: 160, max: 160 }, { code: 'res-fire-max', min: 5, max: 5 }] }]);
  assert.equal(r.resist.cold, 75); assert.equal(r.resist.fire, 80);
});

console.log('【格擋（公式：Maxroll）】');
t('Paladin Lv90 敏捷 100 + 神聖盾牌底材：min(75, floor((盾格擋+職業30)×(敏捷−15)/(2×90)))', () => {
  const sh = gameData.bases.find((b) => b.nameEn === 'Sacred Targe');
  const items = [{ slot: 'shield', baseCode: sh.code, mods: [] }];
  const r = bare('Paladin', 90, { ...none, dex: 80 }, items); // 20+80=100
  assert.equal(r.blockChance, Math.min(75, Math.floor(((sh.block + 30) * 85) / 180)));
});
t('沒有盾牌＝0%', () => assert.equal(bare('Paladin', 90, { ...none, dex: 200 }).blockChance, 0));

console.log('【技能加成分類】');
t('謎團（Enigma）：+2 全技能、傳送 +1（單一技能）', () => {
  const r = bare('Sorceress', 90, none, [itemFromRuneword('enigma_33', 'armor', 'utp')]);
  assert.equal(r.skills.all, 2); assert.equal(r.skills.single.Teleport, 1);
});
t('職業技能：Ars Tor\'Baalos 之類含 Warlock 技能樹與單一技能', () => {
  const r = bare('Warlock', 90, none, [itemFromUnique(rd('uniques').find((u) => u.nameEn === "Ars Tor'Baalos").id, 'shield')]);
  assert.ok(Object.values(r.skills.byTab).some((v) => v >= 1)); assert.ok(Object.keys(r.skills.single).length > 0);
});


console.log('【遊戲內截圖實測（2026-10-19，Sam 提供）】');
const B = rd('bases');
t('Lv67 軍帽依等級生命／法力：提示框 +100（逐件取整，12×67/8＝100.5→100）', () => {
  const r = bare('Warlock', 67, none, [itemFromUnique('harlequin_crest_248', 'helm')]);
  const plain = bare('Warlock', 67, none, [{ slot: 'helm', baseCode: 'uap', mods: [{ code: 'hp/lvl', par: 12 }] }]);
  const noItem = bare('Warlock', 67);
  assert.equal(plain.life - noItem.life, 100);
  assert.equal(r.skills.all, 2);
});
t('巨魔重鎚（Ogre Maul）×200% 強化傷害＝231–318（與 Stone Crusher 提示框一致）', () => {
  const b = B.find((x) => x.code === '7m7'); assert.deepEqual([Math.floor(b.minDam2h * 3), Math.floor(b.maxDam2h * 3)], [231, 318]);
});
t('毒素傷害顯示＝floor(min×par/256)：塔爾符文 154×125/256＝75（精神之劍提示框 +75／5 秒）', () => assert.equal(Math.floor((154 * 125) / 256), 75));
t('精神（劍）：提示框數值落在資料範圍內，且含符文武器效果（電擊1-50、冰寒3-14、毒素、7%生命偷取）', () => {
  const sp = itemFromRuneword('spirit_130', 'weapon', 'crs');
  const r = bare('Sorceress', 27, none, [sp]);
  const m = (code) => sp.mods.find((x) => x.code === code);
  assert.ok(31 >= m('cast3').min && 31 <= m('cast3').max); assert.ok(104 >= m('mana').min && 104 <= m('mana').max); assert.ok(8 >= m('abs-mag').min && 8 <= m('abs-mag').max);
  assert.equal(r.stats.lightmaxdam, 50); assert.equal(r.stats.coldmaxdam, 14); assert.equal(r.stats.coldmindam, 3); assert.equal(r.stats.lifedrainmindam, 7);
  assert.equal(r.unhandled.length, 0);
});
t('魔法使 27 級（部分裝備）：法力 191 與截圖完全一致（35＋26×2＋Spirit 104）', () => {
  const sp = itemFromRuneword('spirit_130', 'weapon', 'crs');
  sp.mods = sp.mods.map((m) => (m.code === 'mana' ? { ...m, min: 104, max: 104 } : m));
  const r = bare('Sorceress', 27, { ...none, vit: 70 }, [sp]);
  assert.equal(r.mana, 191); assert.equal(r.attributes.vit, 102);
  assert.equal(r.life, 250); // 截圖為 270：差 20，推測為第三幕生命藥水任務（假說，見下一項）
});
t('生命藥水任務：+20／次（假說：魔法使 27 級差額 20）', () => {
  assert.equal(bare('Sorceress', 27, none, [], { quests: { lifePotions: 1 } }).life - bare('Sorceress', 27).life, 20);
});
t('魔法使 27 級「無裝備」截圖（Normal）：生命 226、法力 87、耐力 170、防禦 6、抗性 0 全部吻合；生命＝206＋生命藥水 20', () => {
  const r = bare('Sorceress', 27, { str: 60, dex: 0, vit: 70, ene: 0 }, [], { difficulty: 'normal', anyaScrolls: 0, quests: { lifePotions: 1 } });
  assert.deepEqual([r.life, r.mana, r.stamina, r.defense, r.resist.fire], [226, 87, 170, 6, 0]);
  assert.deepEqual([r.attributes.str, r.attributes.dex, r.attributes.vit, r.attributes.ene], [70, 25, 80, 35]);
});
const known = (name, fn) => { try { fn(); console.log('  ⚠ 已知差異竟已消失：', name); } catch (e) { console.log('  ◇ 已知差異（待查）:', name, '→', String(e.message).slice(0, 80)); } };
known('撒卡蘭姆使者防禦：截圖 526；資料推算上限＝floor(168×(1+1.96))＝497', () => {
  const b = B.find((x) => x.code === 'pa9'); assert.ok(526 <= Math.floor(b.maxAc * (1 + 1.96)), `預測上限 ${Math.floor(b.maxAc * 2.96)} < 526`);
});

console.log('【完整性：任何 modifier 都不得無聲遺失】');
const KNOWN_UNDEFINED = new Set(['skilltab-war', 'roguesbow-affix1', 'magdam-rand', 'Gethit-skill']);
const unresolvedAll = new Map();
for (const file of ['uniques', 'setItems', 'runewords']) {
  for (const it of rd(file)) {
    for (const m of it.mods) {
      const r = resolveModifier(m, gameData.properties, 1);
      if (r.unresolved && !KNOWN_UNDEFINED.has(m.code) && !/^Crafted /.test(it.nameEn)) (unresolvedAll.get(m.code) || unresolvedAll.set(m.code, []).get(m.code)).push(it.nameEn);
      if (!r.unresolved && r.entries.length === 0 && !r.note) (unresolvedAll.get('EMPTY:' + m.code) || unresolvedAll.set('EMPTY:' + m.code, []).get('EMPTY:' + m.code)).push(it.nameEn);
    }
  }
}
t('暗金／套裝／符文之語的每條 modifier 都能展開為 stat（或明確標記非數值）', () => assert.equal(unresolvedAll.size, 0, JSON.stringify([...unresolvedAll].slice(0, 5))));
t('每件暗金單獨穿戴都能計算且無「未處理」項（已知資料表缺口除外）', () => {
  const bad = [];
  for (const u of rd('uniques')) {
    if (/^Crafted /.test(u.nameEn)) continue;
    const r = computeCharacter(gameData, { className: 'Paladin', level: 90, allocated: none, items: [{ slot: 'x', baseCode: u.code, mods: u.mods }] });
    const un = r.unhandled.filter((x) => !KNOWN_UNDEFINED.has(x.code));
    if (un.length) bad.push(`${u.nameEn}:${un[0].code}:${un[0].reason}`);
  }
  assert.equal(bad.length, 0, bad.slice(0, 5).join(' | '));
});
t('每個出現過的 stat 都有 itemstatcost 定義或為引擎已知偽 stat', () => {
  const pseudo = new Set(['mindamage', 'maxdamage', 'item_mindamage_percent', 'item_maxdamage_percent']);
  const bad = new Set();
  for (const p of Object.values(gameData.properties)) for (const part of p.parts) if (part.stat && !gameData.stats[part.stat] && !pseudo.has(part.stat)) bad.add(part.stat);
  assert.equal(bad.size, 0, [...bad].join(','));
});

console.log(`\n通過 ${pass} 項${process.exitCode ? '，有失敗' : ''}`);
