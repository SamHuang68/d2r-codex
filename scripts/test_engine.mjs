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
  stdin: { contents: "export * from './src/engine/index'; export * from './src/engine/data'; export * from './src/engine/catalog'; export * from './src/engine/describe'; export * from './src/engine/build'; export * from './src/engine/alloc'; export * from './src/data/presetResolver'; export * from './src/data/simulatorPresets'; export * from './src/engine/skills'; export * from './src/engine/calc'; export * from './src/engine/buffs';", resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error', loader: { '.json': 'json' },
});
const E = await import(pathToFileURL(out).href);
const { computeCharacter, resolveModifier, gameData, itemFromUnique, itemFromRuneword } = E;
const Cat = await import(pathToFileURL(out).href);
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

// ── 目錄與描述 ──
{
  const { getCatalog, describeModifiers } = E;
  const cat = getCatalog();
  console.log('【目錄與文字描述】');
  t('目錄：每個項目都有部位與群組；暗金＋套裝＋符文之語＋基礎皆有', () => {
    for (const k of ['unique', 'set', 'runeword', 'base']) assert.ok(cat.some((e) => e.kind === k), k);
    assert.ok(cat.every((e) => e.slot && e.group));
    console.log('    目錄筆數', cat.length, JSON.stringify(Object.fromEntries(['unique', 'set', 'runeword', 'base'].map((k) => [k, cat.filter((e) => e.kind === k).length]))));
  });
  t('目錄：符文之語皆找得到合格底材（不可有遺漏）', () => {
    const rw = rd('runewords'); const got = new Set(cat.filter((e) => e.kind === 'runeword').map((e) => e.nameEn + e.id));
    const miss = rw.filter((r) => !cat.some((e) => e.id === `runeword:${r.id}`)).map((r) => r.nameEn);
    assert.equal(miss.length, 0, miss.join(','));
  });
  t('描述：軍帽每一行都能產生繁中文字，且無未知項', () => {
    const h = cat.find((e) => e.nameEn === 'Harlequin Crest');
    const lines = describeModifiers(h.mods, 1);
    console.log('    ', lines.map((l) => l.text).join(' | '));
    assert.ok(lines.every((l) => l.known));
  });
  t('描述：任何文字都不得出現原始屬性代碼（item_／_perlevel）', () => {
    const bad = [];
    for (const e of cat.filter((x) => x.kind !== 'base')) for (const l of describeModifiers(e.mods, 1, 90)) if (l.known && /item_|_perlevel|[a-z]{4,}_[a-z]/.test(l.text)) bad.push(e.nameEn + ': ' + l.text);
    assert.equal(bad.length, 0, bad.slice(0, 5).join(' | '));
  });
  t('描述：全部暗金／套裝／符文之語，無法描述的 modifier 比例（僅統計，供追蹤）', () => {
    let total = 0, unknown = 0;
    for (const e of cat.filter((x) => x.kind !== 'base')) for (const l of describeModifiers(e.mods, 1)) { total++; if (!l.known) unknown++; }
    console.log(`    描述覆蓋 ${total - unknown}/${total}（未知 ${unknown}）`);
    assert.ok(unknown / total < 0.15, `未知比例過高 ${unknown}/${total}`);
  });
}

// ── 鑲嵌與範本 ──
{
  const { getCatalog, getSocketables, socketCapacity, eligibleBases, withBase, buildEngineItem, autoAllocate, resolvePreset, SIM_PRESETS, computeCharacter: cc } = E;
  console.log('【鑲嵌與範本】');
  t('鑲嵌：寶石與符文依部位取得不同效果（塔爾：武器＝毒素傷害、護甲＝毒抗 30、盾牌＝毒抗 35）', () => {
    const sk = getSocketables().find((s) => s.nameEn === 'Tal Rune');
    const entry = (n) => getCatalog().find((e) => e.id === n);
    const mk = (kind, base, slot) => ({ entry: { ...getCatalog().find((e) => e.kind === 'base' && e.slot === kind), baseCode: base }, sockets: [sk.id], slot });
    const armor = cc(gameData, { className: 'Paladin', level: 90, allocated: none, items: [buildEngineItem({ entry: getCatalog().find((e) => e.kind === 'base' && e.slot === 'body'), sockets: [sk.id] }, 'body')] });
    assert.equal(armor.stats.poisonresist, 30);
    const weap = cc(gameData, { className: 'Paladin', level: 90, allocated: none, items: [buildEngineItem({ entry: getCatalog().find((e) => e.kind === 'base' && e.slot === 'weapon'), sockets: [sk.id] }, 'weapon')] });
    assert.equal(weap.stats.poisonmaxdam, 154); void entry; void mk;
    const sh = cc(gameData, { className: 'Paladin', level: 90, allocated: none, items: [buildEngineItem({ entry: getCatalog().find((e) => e.kind === 'base' && e.slot === 'shield' && !e.classCode), sockets: [sk.id] }, 'shield')] });
    assert.equal(sh.stats.poisonresist, 35);
  });
  t('鑲嵌：暗金珠寶（彩虹刻面）只有 8 種，且 mods 直接生效', () => {
    const jw = getSocketables().filter((s) => s.kind === 'jewel'); assert.equal(jw.length, 8);
    const j = jw.find((s) => /Blizzard/.test(JSON.stringify(s.jewelMods)));
    const r = cc(gameData, { className: 'Sorceress', level: 90, allocated: none, items: [buildEngineItem({ entry: getCatalog().find((e) => e.kind === 'base' && e.slot === 'head'), sockets: [j.id] }, 'head')] });
    assert.ok((r.stats.coldmaxdam ?? 0) > 0);
  });
  t('孔數：符文之語＝符文數；暗金依「插槽」屬性；白裝由底材上限決定', () => {
    const rw = getCatalog().find((e) => e.kind === 'runeword' && e.nameEn === 'Enigma'); assert.deepEqual([socketCapacity(rw).fixed, socketCapacity(rw).count], [true, 3]);
    const sc = getCatalog().find((e) => e.nameEn === "Immortal King's Stone Crusher"); assert.equal(socketCapacity(sc).count, 2);
    const wb = getCatalog().find((e) => e.kind === 'base' && e.slot === 'body'); assert.equal(socketCapacity(wb).fixed, false); assert.ok(socketCapacity(wb).max >= 1);
  });
  t('符文之語換底材：Enigma 可選多種護甲，且預設底材不會是職業專屬', () => {
    const rw = getCatalog().find((e) => e.kind === 'runeword' && e.nameEn === 'Enigma');
    assert.ok(eligibleBases(rw).length > 5); assert.equal(rw.classCode, undefined);
    const inf = getCatalog().find((e) => e.kind === 'runeword' && e.nameEn === 'Infinity'); assert.equal(inf.classCode, undefined, '無限預設底材不應是亞馬遜長矛');
    assert.notEqual(withBase(rw, eligibleBases(rw)[1].code).baseCode, rw.baseCode);
  });
  for (const p of SIM_PRESETS) {
    t(`範本「${p.name}」：所有物品與鑲嵌皆可解析、無未處理屬性、滿足需求`, () => {
      const r = resolvePreset(p); assert.deepEqual(r.errors, []);
      const items = []; for (const [k, eq] of Object.entries(r.equipped)) { if (k.endsWith('II')) continue; items.push(buildEngineItem(eq, eq.entry.slot === 'weapon' ? (k.startsWith('shield') ? 'weapon2' : 'weapon') : eq.entry.slot === 'shield' ? 'shield' : k)); }
      r.charms.forEach((c, i) => items.push(buildEngineItem({ entry: c }, 'charm' + i)));
      const cs = gameData.charstats.find((c) => c.class === ({ sor: 'Sorceress', pal: 'Paladin', ass: 'Assassin', bar: 'Barbarian' })[p.classCode]);
      const reqs = { str: Math.max(0, ...items.map((i) => gameData.bases.find((b) => b.code === i.baseCode)?.reqStr ?? 0)), dex: Math.max(0, ...items.map((i) => gameData.bases.find((b) => b.code === i.baseCode)?.reqDex ?? 0)) };
      const base = { className: cs.class, level: p.level, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } };
      const alloc = autoAllocate(gameData, base, { totalPoints: (p.level - 1) * 5 + 15, blockTarget: p.blockTarget, rest: p.rest }, reqs);
      assert.equal(alloc.str + alloc.dex + alloc.vit + alloc.ene, (p.level - 1) * 5 + 15);
      const res = cc(gameData, { ...base, allocated: alloc });
      console.log(`    ${p.name}: 生命${res.life} 法力${res.mana} 防禦${res.defense} 格擋${res.blockChance}% 抗${res.resist.fire}/${res.resist.cold}/${res.resist.lightning}/${res.resist.poison} 配點${JSON.stringify(alloc)}`);
      assert.deepEqual(res.unhandled.filter((x) => !KNOWN_UNDEFINED.has(x.code)), []);
      assert.deepEqual(res.requirementsUnmet, [], JSON.stringify(res.requirementsUnmet));
      if (p.blockTarget) assert.ok(res.blockChance >= 75 || alloc.dex > 0);
    });
  }
}

// ── 技能（遊戲技能表）──
{
  const { GAME_SKILLS, treesOf, skillByName, skillDamage, manaCost, synergySources, effectiveLevel, tabName, tabId, evalCalc, bracketValue, CLASS_CODES } = E;
  console.log('【技能：由遊戲技能表建立】');
  t('計算式求值：四則、par、skill()、min/max', () => {
    const ctx = { params: { 8: 5 }, lvl: 10, blvl: 8, skill: (n) => (n === 'A' ? { lvl: 3, blvl: 2 } : undefined) };
    assert.equal(evalCalc("(skill('A'.blvl)+skill('A'.lvl))*par8", ctx), 25);
    assert.equal(evalCalc('min(lvl,5)+max(1,2)*3', ctx), 11);
    assert.throws(() => evalCalc("skill('Zzz'.lvl)", ctx)); assert.throws(() => evalCalc('foo+1', ctx));
  });
  t('8 職業×3 樹×10 招，格位不重複，前置技能都存在且在同一職業', () => {
    for (const c of CLASS_CODES) {
      const trees = treesOf(c); assert.equal(trees.length, 3);
      for (const tr of trees) { assert.equal(tr.skills.length, 10, `${c}/${tr.page}`); assert.ok(tr.name && !/技能樹 \d/.test(tr.name), `${c} 樹名`);
        assert.equal(new Set(tr.skills.map((x) => `${x.row},${x.col}`)).size, 10); }
    }
    for (const s of GAME_SKILLS) for (const p of s.prereq) { const q = skillByName(p); assert.ok(q && q.charClass === s.charClass, `${s.nameEn}←${p}`); }
  });
  t('樹名與內容一致：術士（左→右）混沌、邪異、惡魔；魔法使 冰寒、閃電、火焰（寒冰彈在冰寒）', () => {
    assert.deepEqual(treesOf('war').map((x) => x.name), ['混沌', '邪異', '惡魔']); assert.deepEqual(treesOf('sor').map((x) => x.name), ['冰寒法術', '閃電法術', '火焰法術']);
    const nm = (c, i) => treesOf(c)[i].skills.map((x) => x.nameEn);
    assert.ok(nm('war', 0).includes('Miasma Bolt') && nm('war', 2).includes('Summon Goatman') && nm('sor', 0).includes('Blizzard') && nm('sor', 2).includes('Fire Bolt') && nm('pal', 2).includes('Smite') && nm('ama', 2).includes('Magic Arrow'));
  });
  t('裝備「技能樹」編號：撒卡蘭姆使者的 skilltab 9 ＝ 遊戲提示框「戰鬥技能（只限聖騎士）」；描述文字與截圖一致', () => {
    assert.equal(tabName(9), '戰鬥技能'); assert.equal(tabId('pal', 1), 9); assert.equal(tabName(tabId('sor', 1)), '火焰法術'); assert.equal(tabName(tabId('war', 3)), '混沌');
    const { describeModifiers } = E; const h = E.getCatalog().find((x) => x.nameEn === 'Herald of Zakarum');
    assert.ok(describeModifiers(h.mods, 1, 90).some((l) => l.text === '+2 戰鬥技能（只限聖騎士）'), describeModifiers(h.mods, 1, 90).map((l) => l.text).join('|'));
  });
  t('所有技能的傷害協同計算式都能求值（不得出現無法計算）', () => {
    const bad = [];
    for (const s of GAME_SKILLS) { const r = synergySources(s, {}); const syn = s.elem?.syn ?? s.phys?.syn; if (syn && Number.isNaN(r.totalPct)) bad.push(s.nameEn); }
    assert.deepEqual(bad, []);
  });
  // 術士傷害表（DiabloBytes，第三方單一來源；與遊戲表推導值逐級比對）
  const TBL = {
    'Miasma Bolt': ['1-2 2-3 3-4 4-5 5-6 6-7 7-8 8-9 9-10 10-11 11-12 12-13 13-14 14-15 15-16 16-17 17-19 19-21 20-23 22-25'],
    'Ring of Fire': ['6-10 12-17 18-24 24-31 30-38 36-45 42-52 48-59 56-68 64-77 72-86 80-95 88-104 96-113 104-122 112-131 122-142 132-153 142-164 152-175'],
    'Flame Wave': ['13-17 21-26 29-35 37-44 45-53 53-62 61-71 69-80 81-94 93-108 105-122 117-136 129-150 141-164 153-178 165-192 182-210 199-228 216-246 233-264'],
    'Abyss': ['20-40 23-44 26-48 29-52 32-56 35-60 38-64 41-68 47-76 53-84 59-92 65-100 71-108 77-116 83-124 89-132 98-144 107-156 116-168 125-180'],
  };
  for (const [name, [row]] of Object.entries(TBL)) {
    t(`${name} 第 1–20 級傷害與遊戲表推導值一致（無協同）`, () => {
      const sk = skillByName(name); const got = [];
      for (let L = 1; L <= 20; L++) { const d = skillDamage(sk, L, {}); got.push(`${d.min}-${d.max}`); }
      assert.equal(got.join(' '), row);
    });
  }
  t('Miasma Chain 傷害表（第 1、8、9、20 級）與魔力消耗（Miasma Bolt 第 1 級 2、第 20 級 11.5）', () => {
    const ch = skillByName('Miasma Chains'); const f = (L) => { const d = skillDamage(ch, L, {}); return `${d.min}-${d.max}`; };
    assert.deepEqual([f(1), f(8), f(9), f(20)], ['6-9', '20-23', '23-26', '56-59']);
    const mb = skillByName('Miasma Bolt'); assert.deepEqual([manaCost(mb, 1), manaCost(mb, 20)], [2, 11.5]);
  });
  t('協同：暴風雪（冰彈／冰風暴／冰尖柱各 20 點）＝ +300%，傷害依此放大', () => {
    const bl = skillByName('Blizzard'); const pts = { ice_bolt: 20, ice_blast: 20, glacial_spike: 20, blizzard: 20 };
    const r = synergySources(bl, pts); assert.equal(r.totalPct, 300); assert.equal(r.sources.length, 3);
    const lv = {}; for (const s of GAME_SKILLS) if (pts[s.id]) lv[s.nameEn] = { lvl: pts[s.id], blvl: pts[s.id] };
    const base = skillDamage(bl, 20, {}); const withSyn = skillDamage(bl, 20, lv);
    assert.equal(withSyn.min, Math.floor(bracketValue(bl.elem.min, 20) * 4)); assert.ok(withSyn.min > base.min * 3.9);
  });
  t('有效等級：只有至少 1 點硬點才吃裝備加成；協同不吃軟點', () => {
    const bl = skillByName('Blizzard'); const b = { all: 2, byClass: 1, byTab: { [tabId('sor', 3)]: 3 }, single: {} };
    assert.equal(effectiveLevel(bl, 0, b), 0); assert.equal(effectiveLevel(bl, 10, b), 16);
  });
}

// ── 專精、光環、技能點預算 ──
{
  const { skillByName, passiveMods, auraEffects, skillDamage, buffCandidates, applyBuffs, skillPointBudget, computeCharacter: cc, gameData: gd, itemFromRuneword: irw } = E;
  console.log('【專精、增益、技能點】');
  const zero = { all: 0, byClass: 0, byTab: {}, single: {} };
  t('專精（lnXY 線性）：火焰專精 1 級 30%、20 級 163%；閃電專精 20 級 278%；冰寒專精為穿透 20＋5/級', () => {
    const at = (id, n) => passiveMods({ [id]: n }, zero);
    assert.equal(at('fire_mastery', 1).mastery.fire, 30); assert.equal(at('fire_mastery', 20).mastery.fire, 163);
    assert.equal(at('lightning_mastery', 20).mastery.ltng, 278); assert.equal(at('cold_mastery', 20).pierce.cold, 115);
  });
  t('光環（lnXY）：Might 1 級 +40%、20 級 +230% 傷害；Concentration 20 級 +345%；Battle Orders 依資料 35＋3/級', () => {
    const v = (n, L, stat) => auraEffects(skillByName(n), L).find((e) => e.stat === stat).value;
    assert.equal(v('Might', 1, 'damagepercent'), 40); assert.equal(v('Might', 20, 'damagepercent'), 230);
    assert.equal(v('Concentration', 20, 'damagepercent'), 345); assert.equal(v('Battle Orders', 20, 'item_maxhp_percent'), 35 + 3 * 19);
  });
  t('dm（衰減）公式未支援：標示為不支援，不當成 0', () => {
    const l = auraEffects(skillByName('Holy Freeze'), 10); assert.ok(l.some((x) => !x.supported));
  });
  t('增益套用：Might 疊進武器傷害；Conviction 降低敵人抗性且取最大不疊加；戰爭召喚的 Battle Orders 計入生命', () => {
    const hard = { might: 20 }; const b = { all: 0, byClass: 0, byTab: {}, single: {} };
    const cands = buffCandidates('pal', { ...hard, conviction: 20 }, b, {});
    const might = cands.find((c) => c.skill.nameEn === 'Might'); const conv = cands.find((c) => c.skill.nameEn === 'Conviction');
    const ap = applyBuffs([might, conv]);
    assert.equal(ap.self.find((e) => e.stat === 'item_maxdamage_percent').value, 230);
    assert.ok(ap.enemyResReduction.fire > 0 && ap.enemyResReduction.cold === ap.enemyResReduction.fire);
    // 戰爭召喚（符文之語）給外職業的 Battle Orders：魔法使可勾選，並提高生命
    const entry = E.getCatalog().find((x) => x.nameEn === 'Call to Arms'); const item = E.buildEngineItem({ entry }, 'weapon');
    const r = cc(gd, { className: 'Sorceress', level: 90, allocated: { str: 0, dex: 0, vit: 0, ene: 0 }, items: [item] });
    const bo = buffCandidates('sor', {}, { all: r.skills.all, byClass: 0, byTab: {}, single: r.skills.single }, r.stats).find((c) => c.skill.nameEn === 'Battle Orders');
    assert.ok(bo && bo.level >= 1, 'CTA 應提供 Battle Orders');
    const ap2 = applyBuffs([bo]); const r2 = cc(gd, { className: 'Sorceress', level: 90, allocated: { str: 0, dex: 0, vit: 0, ene: 0 }, items: [item], extraStats: ap2.self });
    assert.ok(r2.life > r.life, `BO 後生命 ${r.life}→${r2.life}`);
  });
  t('技能點預算：等級−1＋每難度任務 4 點（魔物巢穴 1、拉瑪達 1、伊祖爾 2）', () => { assert.equal(skillPointBudget(90, 3), 89 + 12); assert.equal(skillPointBudget(1, 0), 0); });
  t('對目標抗性：傷害×(1−(抗性−穿透)/100)，抗性可被穿透壓到負值，上下限 ±100', () => {
    const bl = skillByName('Blizzard'); const base = skillDamage(bl, 20, {}, { targetRes: 50 }).target; const full = skillDamage(bl, 20, {}, { targetRes: 0 });
    assert.equal(base.min, Math.floor(full.min * 0.5)); const pierced = skillDamage(bl, 20, {}, { targetRes: 50, pierce: 70 }).target; assert.equal(pierced.res, -20);
    assert.equal(skillDamage(bl, 20, {}, { targetRes: 100 }).target.min, 0);
    assert.equal(skillDamage(bl, 20, {}, { masteryPct: 100 }).min, full.min * 2);
  });
}
