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
  stdin: { contents: "export * from './src/engine/index'; export * from './src/engine/data'; export * from './src/engine/catalog'; export * from './src/engine/describe'; export * from './src/engine/build'; export * from './src/engine/alloc'; export * from './src/data/presetResolver'; export * from './src/data/simulatorPresets'; export * from './src/engine/skills'; export * from './src/engine/calc'; export * from './src/engine/buffs'; export * from './src/engine/skillPlan'; export { itemOwnStats } from './src/engine/character'; export * from './src/engine/magicFind'; export * from './src/engine/survival'; export * from './src/engine/breakpoints'; export * from './src/engine/customItem'; export { itemSkillSeconds } from './src/engine/describe'; export * from './src/components/simulator/v2/equipRules'; export * from './src/components/simulator/v2/engineItems'; export * from './src/data/profileStore'; export * from './src/data/presetState'; export { UNIQUE_ITEMS_DATA } from './src/data/uniqueItems'; export { SET_ITEMS_DATA, ALL_SET_PIECES } from './src/data/setItems'; export { RUNEWORDS_DATA } from './src/data/runewords'; export { BASE_ITEMS_DATA } from './src/data/bases'; export { RUNES_DATA } from './src/data/runes'; export { SKILLS_DATA } from './src/data/skills'; export { SYNERGY_RELATIONS, calculateSkillSynergies } from './src/data/skills/synergies'; export { SKILL_GRID_LAYOUT } from './src/data/skills/layout'; export { overlay as CODEX_OVERLAY } from './src/data/codex/common'; export { normalizeItemQuery } from './src/utils/itemQueryNormalizer'; export { headerLines } from './src/data/codex/itemLines'; export { buildGearTiles } from './src/data/codex/portalTiles'; export * from './src/engine/skillEffects'; export * from './src/engine/mercenary';", resolveDir: process.cwd(), loader: 'ts' },
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
  const { ENGINE_CLASS_BY_CODE, getCatalog, getSocketables, socketCapacity, eligibleBases, withBase, buildEngineItem, autoAllocate, resolvePreset, SIM_PRESETS, computeCharacter: cc } = E;
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
      const items = E.engineItemsOf(r.equipped, r.charms);
      const cs = gameData.charstats.find((c) => c.class === ENGINE_CLASS_BY_CODE[p.classCode]);
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

// ── 流派範本與 Profile ──
{
  const { BUILDS, planSkills, stateFromPreset, toSavedData, fromSavedData, parseProfile, exportProfile, newProfile, skillByName, skillById } = E;
  console.log('【流派範本與 Profile】');
  t('流派：每個職業至少一個流派（術士除外），入門與頂裝都存在，主力技能名稱可在技能表找到', () => {
    for (const c of ['ama', 'sor', 'nec', 'pal', 'bar', 'dru', 'ass']) assert.ok(BUILDS.some((b) => b.classCode === c), c);
    for (const b of BUILDS) { assert.ok(b.start && b.bis, b.id); assert.ok(skillByName(b.skill.main), `${b.id} 主力技能「${b.skill.main}」`); assert.equal(skillByName(b.skill.main).charClass, b.classCode, b.id); }
    assert.equal(new Set(BUILDS.map((b) => b.id)).size, BUILDS.length);
  });
  for (const b of BUILDS) {
    t(`技能規劃「${b.name}」：不超過預算與滿級、前置齊全、等級足夠、沒有找不到的技能`, () => {
      const lvl = b.bis.level; const plan = planSkills(b.classCode, lvl, b.skill, 3);
      assert.ok(plan.used <= plan.budget, `${plan.used}/${plan.budget}`);
      assert.equal(plan.points[plan.mainId], 20, '主力技能應點滿');
      assert.deepEqual(plan.notes.filter((x) => x.includes('找不到') || x.includes('略過')), []);
      for (const [id, v] of Object.entries(plan.points)) {
        const sk = skillById(id); assert.ok(v >= 1 && v <= sk.maxLvl, `${sk.nameEn} ${v}/${sk.maxLvl}`); assert.ok(sk.reqLevel <= lvl, `${sk.nameEn} 需要等級 ${sk.reqLevel}`);
        for (const pre of sk.prereq) { const ps = skillByName(pre); if (ps) assert.ok(plan.points[ps.id] > 0, `${sk.nameEn} 缺前置 ${pre}`); }
      }
      assert.equal(Object.values(plan.points).reduce((a, b2) => a + b2, 0), plan.used);
    });
  }
  t('範本 → 狀態：裝備、技能點、配點齊備且無錯誤備註；總配點等於可用點數', () => {
    for (const p of E.SIM_PRESETS) {
      const { snap, notes } = stateFromPreset(p); assert.deepEqual(notes.filter((x) => !x.includes('技能點不足')), [], p.id);
      assert.equal(snap.alloc.str + snap.alloc.dex + snap.alloc.vit + snap.alloc.ene, (p.level - 1) * 5 + 15, p.id);
      assert.ok(Object.keys(snap.equipped).length >= 5 && Object.keys(snap.skillPoints).length >= 3, p.id);
    }
  });
  t('物品提示框數值：逐件防禦加總＋敏捷/4＝整體防禦；主手武器傷害與整體計算一致', () => {
    const { itemOwnStats, buildEngineItem: bei } = E;
    for (const id of ['sor-blizzard:bis', 'pal-hammerdin:bis', 'bar-whirlwind:bis', 'ama-lightning-fury:bis']) {
      const p = E.SIM_PRESETS.find((x) => x.id === id); const { snap } = stateFromPreset(p);
      const items = E.engineItemsOf(snap.equipped, snap.charms);
      const res = E.computeCharacter(gameData, { className: E.ENGINE_CLASS_BY_CODE[p.classCode], level: p.level, allocated: snap.alloc, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } });
      const a = res.attributes; let sum = 0;
      for (const it of items) { const o = itemOwnStats(gameData, it, p.level, { str: a.str, dex: a.dex }); sum += o.defense ?? 0; }
      // 提示框只含該件自身的屬性；套裝加成（含套裝的固定防禦）不屬於任何一件，所以拿「去掉套裝資訊」的整體數值比對
      const noSet = E.computeCharacter(gameData, { className: E.ENGINE_CLASS_BY_CODE[p.classCode], level: p.level, allocated: snap.alloc, items: items.map((i) => ({ ...i, setId: undefined, setBonus: undefined })), difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } });
      assert.equal(sum + Math.floor(noSet.attributes.dex / 4), noSet.defense, `${id} 防禦`);
      // 武器傷害：提示框只含該武器自身屬性（遊戲提示框同），整體計算還含其他裝備的固定傷害，所以只拿單件比對
      const w = items.find((i) => i.slot === 'weapon');
      if (w) { const solo = E.computeCharacter(gameData, { className: E.ENGINE_CLASS_BY_CODE[p.classCode], level: p.level, allocated: snap.alloc, items: [w], difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } });
        const o = itemOwnStats(gameData, w, p.level, { str: solo.attributes.str, dex: solo.attributes.dex });
        if (solo.weaponDamage) { assert.ok(o.damage, id); assert.equal(o.damage.min, solo.weaponDamage.min, `${id} 最小傷害`); assert.equal(o.damage.max, solo.weaponDamage.max, `${id} 最大傷害`); } }
    }
  });
  t('MF 遞減公式：100% MF → 暗金 71、套裝 83、稀有 85（與社群表一致）；魔法物品無遞減；單調且邊際遞減', () => {
    const { effectiveMf, mfSummary, marginalUnique } = E;
    assert.equal(Math.floor(effectiveMf(100, 'unique')), 71); assert.equal(Math.floor(effectiveMf(100, 'set')), 83); assert.equal(Math.floor(effectiveMf(100, 'rare')), 85);
    assert.equal(effectiveMf(300, 'magic'), 300); assert.equal(effectiveMf(0, 'unique'), 0);
    assert.ok(effectiveMf(500, 'unique') < 250, '暗金有效 MF 永遠小於係數 250');
    assert.ok(marginalUnique(100) > marginalUnique(300) && marginalUnique(300) > marginalUnique(600));
    const sm = mfSummary(100); assert.equal(sm.length, 4); assert.ok(sm.every((l) => l.multiplier >= 1));
  });
  t('MF 數值與社群公認值一致：Wartraveler 50、Chance Guards 40、Nagelring 30、Gheed 40、Shako 50、Tarnhelm 50；Skullder 為每等級 1.25', () => {
    const mfOf = (nm, lvl = 90) => { const e = E.getCatalog().find((x) => x.nameEn === nm && x.kind !== 'base'); const r = E.computeCharacter(gameData, { className: 'Paladin', level: lvl, allocated: none, items: [E.buildEngineItem({ entry: e }, e.slot, true)] }); return r.stats.item_magicbonus ?? 0; };
    assert.equal(mfOf('Wartraveler'), 50); assert.equal(mfOf('Chance Guards'), 40); assert.equal(mfOf('Nagelring'), 30);
    assert.equal(mfOf("Gheed's Fortune"), 40); assert.equal(mfOf('Harlequin Crest'), 50); assert.equal(mfOf('Tarnhelm'), 50);
    assert.equal(mfOf("Skullder's Ire", 90), 112); assert.equal(mfOf("Skullder's Ire", 80), 100);
  });
  t('MF 檔位：每個流派 極致 ≥ 效率 ≥ 頂裝（MF 只增不減），極致 MF 至少 350', () => {
    const { previewPreset } = E;
    for (const b of E.BUILDS) {
      const mf = (t) => previewPreset(E.SIM_PRESETS.find((x) => x.id === `${b.id}:${t}`)).mf;
      const bis = mf('bis'); const eff = mf('mfEff'); const max = mf('mfMax');
      assert.ok(eff >= bis, `${b.id} 效率 ${eff} < 頂裝 ${bis}`); assert.ok(max >= eff, `${b.id} 極致 ${max} < 效率 ${eff}`); assert.ok(max >= 350, `${b.id} 極致 ${max}`);
    }
  });
  t('MF 檔位：效率檔只動指定欄位（保留核心件），極致檔在技能綁武器的流派保留武器', () => {
    for (const b of E.BUILDS) {
      const bis = b.bis.items; const eff = E.tierOf(b, 'mfEff').items; const max = E.tierOf(b, 'mfMax').items;
      for (const k of ['gloves', 'belt', 'weaponI', 'shieldI', 'neck', 'ring1']) assert.deepEqual(eff[k], bis[k], `${b.id} 效率檔不應動 ${k}`);
      for (const k of b.mfKeep ?? []) assert.deepEqual(eff[k], bis[k], `${b.id} mfKeep ${k}`);
      if (b.weaponBound) { assert.deepEqual(max.weaponI, bis.weaponI, b.id); assert.deepEqual(max.shieldI, bis.shieldI, b.id); } else assert.equal(max.weaponI.nameEn, 'Blade of Ali Baba');
    }
  });
  t('生存力：物理減免套 50% 上限，有效生命＝生命÷(1−減免)；抗性取最低一項', () => {
    const { survivalSummary, PDR_CAP } = E;
    assert.equal(PDR_CAP, 50);
    const mk = (stats, resist, life = 1000) => ({ life, stats, resist, blockChance: 10 });
    const a = survivalSummary(mk({ damageresist: 80 }, { fire: 75, cold: 60, lightning: 75, poison: 75 }));
    assert.equal(a.pdr, 50); assert.equal(a.pdrRaw, 80); assert.equal(a.ehpPhys, 2000); assert.equal(a.minRes, 60); assert.equal(a.ehpElem, 2500);
    const b = survivalSummary(mk({}, { fire: -30, cold: 0, lightning: 0, poison: 0 })); assert.equal(b.pdr, 0); assert.equal(b.ehpElem, 1000, '負抗性不讓有效生命低於生命');
  });
  t('減傷資料與社群公認值一致：暴風盾 35%、亡者之耳 15%、維爾杜戈 15%、哈利昆之冠 10%', () => {
    const pdrOf = (nm) => { const e = E.getCatalog().find((x) => x.nameEn === nm && x.kind !== 'base'); const r = E.computeCharacter(gameData, { className: 'Paladin', level: 90, allocated: none, items: [E.buildEngineItem({ entry: e }, e.slot, true)] }); return r.stats.damageresist ?? 0; };
    assert.equal(pdrOf('Stormshield'), 35); assert.equal(pdrOf('String of Ears'), 15); assert.equal(pdrOf("Verdugo's Hearty Cord"), 15); assert.equal(pdrOf('Harlequin Crest'), 10);
  });
  t('平衡減傷：每個流派都滿足需求、全技能／職業／技能樹／單項技能加成與 FCR／IAS 都不低於頂裝，且有效生命不低於頂裝', () => {
    const { BUILDS, SIM_PRESETS, resolvePreset, buildEngineItem: bei, toEquipped, autoAllocate: aa, computeCharacter: cc2, survivalSummary } = E;
    const run = (p) => {
      const r = resolvePreset(p); const items = E.engineItemsOf(r.equipped, r.charms);
      const reqs = { str: Math.max(0, ...items.map((i) => gameData.bases.find((b) => b.code === i.baseCode)?.reqStr ?? 0)), dex: Math.max(0, ...items.map((i) => gameData.bases.find((b) => b.code === i.baseCode)?.reqDex ?? 0)) };
      const base = { className: E.ENGINE_CLASS_BY_CODE[p.classCode], level: p.level, items, difficulty: 'hell', anyaScrolls: 3, quests: { lifePotions: 3 } };
      const alloc = aa(gameData, base, { totalPoints: (p.level - 1) * 5 + 15, blockTarget: p.blockTarget, rest: p.rest }, reqs);
      return cc2(gameData, { ...base, allocated: alloc });
    };
    for (const b of BUILDS) {
      const bis = run(SIM_PRESETS.find((x) => x.id === `${b.id}:bis`)); const eff = run(SIM_PRESETS.find((x) => x.id === `${b.id}:tankEff`));
      assert.deepEqual(eff.requirementsUnmet, [], b.id);
      assert.ok(eff.skills.all >= bis.skills.all, `${b.id} 全技能`);
      for (const [k, v] of Object.entries(bis.skills.byClass)) assert.ok((eff.skills.byClass[k] ?? 0) >= v, `${b.id} 職業技能`);
      for (const [k, v] of Object.entries(bis.skills.byTab)) assert.ok((eff.skills.byTab[k] ?? 0) >= v, `${b.id} 技能樹`);
      for (const [k, v] of Object.entries(bis.skills.single)) assert.ok((eff.skills.single[k] ?? 0) >= v, `${b.id} 單項技能 ${k}`);
      assert.ok((eff.stats.item_fastercastrate ?? 0) >= (bis.stats.item_fastercastrate ?? 0), `${b.id} FCR`);
      assert.ok((eff.stats.item_fasterattackrate ?? 0) >= (bis.stats.item_fasterattackrate ?? 0), `${b.id} IAS`);
      const sb = survivalSummary(bis); const se = survivalSummary(eff);
      // 平衡版以「物理與元素有效生命的調和平均」為目標：整體要不低於頂裝，單一方向不能掉太多（不低於原本的 65%）
      const hm = (x) => 2 / (1 / x.ehpPhys + 1 / x.ehpElem);
      // 搜尋的評分另外加了魔法傷害減免與固定傷害減免的小量加權，所以調和平均可以略低（最多 2%）
      assert.ok(hm(se) >= hm(sb) * 0.98, `${b.id} 有效生命調和平均 ${se.ehpPhys}/${se.ehpElem} 低於頂裝 ${sb.ehpPhys}/${sb.ehpElem}`);
      assert.ok(se.ehpPhys >= sb.ehpPhys * 0.65 && se.ehpElem >= sb.ehpElem * 0.65, `${b.id} 某一方向掉太多`);
    }
  });
  t('極致減傷：未被武器綁定的流派物理減免達 50% 上限，每個流派有效生命（物理與元素的調和平均）都高於頂裝', () => {
    const { previewPreset } = E;
    for (const b of E.BUILDS) {
      const bis = previewPreset(E.SIM_PRESETS.find((x) => x.id === `${b.id}:bis`)).survival; const mx = previewPreset(E.SIM_PRESETS.find((x) => x.id === `${b.id}:tankMax`)).survival;
      if (!b.weaponBound) { assert.equal(mx.pdr, 50, `${b.id} 物理減免 ${mx.pdr}`); assert.equal(mx.block, 75, `${b.id} 格擋`); }
      const harm = (x) => 2 / (1 / x.ehpPhys + 1 / x.ehpElem);
      assert.ok(harm(mx) > harm(bis), `${b.id} 極致減傷 ${mx.ehpPhys}/${mx.ehpElem} 的調和平均未高於頂裝 ${bis.ehpPhys}/${bis.ehpElem}`);
      if (!b.weaponBound) assert.ok(mx.ehpPhys > bis.ehpPhys && mx.ehpElem > bis.ehpElem, `${b.id} 兩項有效生命都應高於頂裝`);
      assert.ok(mx.minRes >= (b.weaponBound ? 70 : 75), `${b.id} 最低抗性 ${mx.minRes}`);
    }
  });
  t('範本合法性：每個範本的每個槽位都通過介面同一套裝備規則（槽位種類、職業專屬、雙手武器不配盾、雙持限制）', () => {
    const { SIM_PRESETS, resolvePreset, equippedErrors } = E;
    for (const p of SIM_PRESETS) {
      const r = resolvePreset(p); assert.deepEqual(r.errors, [], p.id);
      assert.deepEqual(equippedErrors(r.equipped, E.ENGINE_CLASS_BY_CODE[p.classCode]), [], `${p.id} 有不合法的裝備組合`);
    }
  });
  t('裝備規則：雙手武器不能配盾、他職專屬不能穿、刺客雙持只能用爪、野蠻人可雙持（反向對照，確認規則真的會擋）', () => {
    const { slotPlacementError, resolvePreset } = E;
    const item = (nameEn, baseNameEn) => resolvePreset({ id: 't', name: 't', classCode: 'sor', level: 90, items: { head: { nameEn, baseNameEn } }, charms: [], notes: '', build: 't', buildName: 't', tier: 'bis', skill: { main: 'Blizzard' } }).equipped.head.entry;
    const staff = item('Heart of the Oak', 'Archon Staff'); const spirit = item('Spirit', 'Monarch'); const claw = item('Mosaic'); const sword = item('Grief');
    assert.equal(staff.twoHanded, true);
    assert.match(slotPlacementError('shieldI', spirit, { weaponI: { entry: staff } }, 'Druid') ?? '', /雙手武器無法搭配盾牌/);
    assert.equal(slotPlacementError('shieldI', spirit, { weaponI: { entry: sword } }, 'Paladin'), null);
    assert.match(slotPlacementError('weaponI', item('Herald of Zakarum'), {}, 'Sorceress') ?? '', /是盾牌，不能放在/);
    assert.match(slotPlacementError('head', item('Jalal\'s Mane'), {}, 'Sorceress') ?? '', /只有德魯伊能使用/);
    assert.match(slotPlacementError('shieldI', sword, { weaponI: { entry: sword } }, 'Assassin') ?? '', /只能使用爪類武器/);
    assert.equal(slotPlacementError('shieldI', claw, { weaponI: { entry: claw } }, 'Assassin'), null);
    assert.equal(slotPlacementError('shieldI', sword, { weaponI: { entry: sword } }, 'Barbarian'), null);
    assert.match(slotPlacementError('shieldI', sword, { weaponI: { entry: sword } }, 'Sorceress') ?? '', /是武器，不能放在/);
  });
  t('Profile 驗證：結構不對的匯入內容一律拒絕（不丟例外）；數值欄位夾進合理範圍；通過的內容還原時不會丟例外', () => {
    const { parseProfile, fromSavedData, exportProfile, newProfile, SIM_PRESETS, stateFromPreset, skillByName } = E;
    const snap = stateFromPreset(SIM_PRESETS.find((x) => x.id === 'sor-blizzard:bis')).snap;
    const base = JSON.parse(exportProfile(newProfile('x', snap)));
    const mut = (fn) => { const d = JSON.parse(JSON.stringify(base)); fn(d); return JSON.stringify(d); };
    const reject = {
      'charms 含 null': (d) => { d.data.charms = [null]; }, 'charms 不是陣列': (d) => { d.data.charms = 'x'; }, 'charms 太多': (d) => { d.data.charms = Array.from({ length: 41 }, () => ({ id: 'a' })); },
      'equipped 值為 null': (d) => { d.data.equipped.head = null; }, 'equipped 值為字串': (d) => { d.data.equipped.head = 'abc'; }, 'equipped 缺 id': (d) => { d.data.equipped.head = { baseCode: 'x' }; },
      'sockets 不是陣列': (d) => { d.data.equipped.head.sockets = 'x'; }, 'sockets 含非文字': (d) => { d.data.equipped.head.sockets = [1]; },
      '未知槽位': (d) => { d.data.equipped.nonsense = { id: 'a' }; }, '職業代碼不存在': (d) => { d.data.classCode = 'zzz'; }, '職業代碼非字串': (d) => { d.data.classCode = 5; },
      '技能點值為字串': (d) => { d.data.skillPoints = { magic_arrow: 'abc' }; }, '技能點不是物件': (d) => { d.data.skillPoints = [1]; }, '增益值非布林': (d) => { d.data.buffsOn = { a: 'yes' }; },
    };
    for (const [name, fn] of Object.entries(reject)) assert.equal(typeof parseProfile(mut(fn)), 'string', `應拒絕：${name}`);
    const big = parseProfile(mut((d) => { d.data.skillPoints = { fire_bolt: 9999, ice_bolt: -5 }; d.data.level = 'abc'; d.data.alloc = { str: -5, dex: 1e9 }; d.data.targetRes = 999; d.name = '   '; }));
    assert.equal(typeof big, 'object'); assert.equal(big.data.skillPoints.fire_bolt, skillByName('Fire Bolt').maxLvl); assert.equal(big.data.skillPoints.ice_bolt, undefined);
    assert.equal(big.data.level, 90); assert.equal(big.data.alloc.str, 0); assert.equal(big.data.alloc.dex, 999); assert.equal(big.data.targetRes, 100); assert.equal(big.name, '匯入的 Profile');
    assert.doesNotThrow(() => fromSavedData(big.data));
    const html = parseProfile(mut((d) => { d.name = '<img src=x onerror=alert(1)>'; })); assert.equal(html.name, '<img src=x onerror=alert(1)>', '名稱原樣保留（畫面以文字顯示，不當 HTML）');
  });
  t('自訂飾品：定義檢查（拒絕不認得的底材與詞綴、非數字；數值夾進範圍）、建立目錄項目、詞綴確實計入數值', () => {
    const { validateCustomDef, customEntry, CUSTOM_AFFIXES, computeCharacter: c2, buildEngineItem: bei2 } = E;
    for (const bad of [null, [], { baseCode: 'zzz', name: 'x', affixes: [] }, { baseCode: 'rin', name: 5, affixes: [] }, { baseCode: 'rin', name: 'x', affixes: 'a' }, { baseCode: 'rin', name: 'x', affixes: [null] },
      { baseCode: 'rin', name: 'x', affixes: [{ code: 'nonsense', value: 1 }] }, { baseCode: 'rin', name: 'x', affixes: [{ code: 'hp', value: '5' }] }, { baseCode: 'rin', name: 'x', affixes: Array.from({ length: 9 }, () => ({ code: 'hp', value: 1 })) }])
      assert.equal(typeof validateCustomDef(bad), 'string', JSON.stringify(bad));
    const ok = validateCustomDef({ baseCode: 'cm1', name: '  幸運小符  ', affixes: [{ code: 'mag%', value: 9999 }, { code: 'hp', value: -3 }] });
    assert.equal(ok.name, '幸運小符'); assert.equal(ok.affixes[0].value, CUSTOM_AFFIXES.find((a) => a.code === 'mag%').max); assert.equal(ok.affixes[1].value, 1);
    const e = customEntry({ baseCode: 'cm1', name: '幸運小符', affixes: [{ code: 'mag%', value: 7 }, { code: 'hp', value: 20 }, { code: 'res-all', value: 5 }] });
    assert.equal(e.slot, 'charm'); assert.equal(e.name, '幸運小符'); assert.ok(e.id.startsWith('custom:')); assert.equal(e.custom.affixes.length, 3);
    const base = c2(gameData, { className: 'Paladin', level: 90, allocated: none, items: [], difficulty: 'normal' });
    const withIt = c2(gameData, { className: 'Paladin', level: 90, allocated: none, items: [bei2({ entry: e }, 'charm0')], difficulty: 'normal' });
    assert.equal((withIt.stats.item_magicbonus ?? 0) - (base.stats.item_magicbonus ?? 0), 7); assert.equal(withIt.life - base.life, 20);
    assert.equal(withIt.rawResist.fire - base.rawResist.fire, 5); assert.deepEqual(withIt.unhandled, []);
    const ring = customEntry({ baseCode: 'rin', name: '', affixes: [] }); assert.equal(ring.slot, 'ring'); assert.equal(ring.name, '自訂戒指');
    for (const a of CUSTOM_AFFIXES) { const r = c2(gameData, { className: 'Paladin', level: 90, allocated: none, items: [bei2({ entry: customEntry({ baseCode: 'amu', name: 'x', affixes: [{ code: a.code, value: 1 }] }) }, 'neck')], difficulty: 'normal' }); assert.deepEqual(r.unhandled, [], `詞綴 ${a.code} 引擎看不懂`); }
  });
  t('自訂飾品隨 Profile 與暫存存取：護身符與戒指存檔→還原後詞綴相同；結構不對的自訂物品被拒絕', () => {
    const { customEntry, toSavedData, fromSavedData, parseProfile, exportProfile, newProfile, SIM_PRESETS, stateFromPreset } = E;
    const snap = stateFromPreset(SIM_PRESETS.find((x) => x.id === 'sor-blizzard:bis')).snap;
    const charm = customEntry({ baseCode: 'cm2', name: '抗性大符', affixes: [{ code: 'res-fire', value: 11 }, { code: 'res-cold', value: 11 }] });
    const ring = customEntry({ baseCode: 'rin', name: '稀有戒', affixes: [{ code: 'cast2', value: 10 }, { code: 'hp', value: 30 }] });
    const withCustom = { ...snap, charms: [...snap.charms, charm], equipped: { ...snap.equipped, ring2: { entry: ring } } };
    const saved = JSON.parse(JSON.stringify(toSavedData(withCustom))); const back = fromSavedData(saved);
    assert.deepEqual(back.errors, []);
    assert.deepEqual(back.snap.equipped.ring2.entry.custom, ring.custom); assert.equal(back.snap.equipped.ring2.entry.slot, 'ring');
    assert.deepEqual(back.snap.charms.at(-1).custom, charm.custom); assert.equal(back.snap.charms.length, snap.charms.length + 1);
    const prof = JSON.parse(exportProfile(newProfile('x', withCustom)));
    prof.data.equipped.ring2.custom = { baseCode: 'zzz', name: 'x', affixes: [] }; assert.equal(typeof parseProfile(JSON.stringify(prof)), 'string');
    prof.data.equipped.ring2.custom = { baseCode: 'rin', name: 'x', affixes: [{ code: 'hp', value: 'a' }] }; assert.equal(typeof parseProfile(JSON.stringify(prof)), 'string');
    const okProf = JSON.parse(exportProfile(newProfile('x', withCustom))); assert.equal(typeof parseProfile(JSON.stringify(okProf)), 'object');
  });
  t('暫存：存進去再讀出來配裝完全相同；損壞或舊版的暫存當作沒有；寫入失敗不丟例外', () => {
    const { saveDraft, loadDraft, fromSavedData, SIM_PRESETS, stateFromPreset } = E;
    const snap = stateFromPreset(SIM_PRESETS.find((x) => x.id === 'pal-hammerdin:bis')).snap;
    const store = {}; const win = { localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = v; } } };
    const old = globalThis.window; globalThis.window = win;
    try {
      assert.equal(loadDraft(), null);
      saveDraft(snap); const d = loadDraft(); assert.ok(d); const back = fromSavedData(d);
      assert.deepEqual(back.errors, []); assert.equal(back.snap.classCode, 'pal'); assert.deepEqual(back.snap.alloc, snap.alloc);
      assert.deepEqual(Object.keys(back.snap.equipped).sort(), Object.keys(snap.equipped).sort()); assert.deepEqual(back.snap.skillPoints, snap.skillPoints);
      store['d2sim.draft.v1'] = '{壞掉'; assert.equal(loadDraft(), null);
      store['d2sim.draft.v1'] = JSON.stringify({ v: 1, name: 'x', data: { classCode: 'sor', equipped: { head: null } } }); assert.equal(loadDraft(), null);
      globalThis.window = { localStorage: { getItem: () => null, setItem: () => { throw new Error('quota'); } } };
      assert.doesNotThrow(() => saveDraft(snap));
    } finally { globalThis.window = old; }
  });
  t('Profile 讀取：瀏覽器存檔中格式損壞的項目被略過並回報數量，其餘照常載入', () => {
    const { loadProfiles, exportProfile, newProfile, SIM_PRESETS, stateFromPreset } = E;
    const good = JSON.parse(exportProfile(newProfile('好的', stateFromPreset(SIM_PRESETS.find((x) => x.id === 'pal-hammerdin:bis')).snap)));
    const withStore = (v, fn) => { const old = globalThis.window; globalThis.window = { localStorage: { getItem: () => v } }; try { return fn(); } finally { globalThis.window = old; } };
    const r = withStore(JSON.stringify([good, { junk: 1 }, null, { ...good, data: { ...good.data, charms: [null] } }]), () => loadProfiles());
    assert.equal(r.list.length, 1); assert.equal(r.rejected, 3); assert.equal(r.list[0].name, '好的');
    assert.deepEqual(withStore('{壞掉', () => loadProfiles()), { list: [], rejected: 1 });
    assert.deepEqual(withStore(null, () => loadProfiles()), { list: [], rejected: 0 });
  });
  t('Profile：存檔→還原往返後裝備（含換底材、鑲嵌、無形）、護身符、技能點、配點完全相同', () => {
    const p = E.SIM_PRESETS.find((x) => x.id === 'sor-blizzard:bis'); const { snap } = stateFromPreset(p);
    const withSock = { ...snap, equipped: { ...snap.equipped, head: { ...snap.equipped.head, ethereal: true } } };
    const saved = toSavedData(withSock); const back = fromSavedData(JSON.parse(JSON.stringify(saved)));
    assert.deepEqual(back.errors, []);
    for (const k of Object.keys(snap.equipped)) { assert.equal(back.snap.equipped[k].entry.id, snap.equipped[k].entry.id, k); assert.equal(back.snap.equipped[k].entry.baseCode, snap.equipped[k].entry.baseCode, k); }
    assert.equal(back.snap.equipped.head.ethereal, true);
    assert.deepEqual(back.snap.charms.map((c) => c.id), snap.charms.map((c) => c.id));
    assert.deepEqual(back.snap.skillPoints, snap.skillPoints); assert.deepEqual(back.snap.alloc, snap.alloc); assert.equal(back.snap.activeSkillId, snap.activeSkillId);
  });
  t('Profile：物品不存在時列為錯誤、不丟其他件；匯入拒絕格式不符的內容', () => {
    const p = E.SIM_PRESETS.find((x) => x.id === 'sor-blizzard:bis'); const { snap } = stateFromPreset(p);
    const saved = JSON.parse(JSON.stringify(toSavedData(snap))); saved.equipped.head.id = 'unique:不存在的物品';
    const r = fromSavedData(saved); assert.equal(r.errors.length, 1); assert.ok(r.snap.equipped.body);
    assert.equal(typeof parseProfile('{壞掉'), 'string'); assert.equal(typeof parseProfile('{"v":2}'), 'string'); assert.equal(typeof parseProfile('null'), 'string');
    const ok = parseProfile(exportProfile(newProfile('測試', snap))); assert.equal(typeof ok, 'object'); assert.equal(ok.name, '測試'); assert.equal(ok.data.level, snap.level);
    const evil = parseProfile(JSON.stringify({ v: 1, name: 'x', data: { classCode: 'sor', equipped: {}, level: 'abc', alloc: { str: -5 } } }));
    assert.equal(evil.data.level, 90); assert.equal(evil.data.alloc.str, 0);
  });
}

// ── 套裝加成 ──
{
  const { getCatalog, buildEngineItem: bei, computeCharacter: cc } = E;
  const sets = rd('sets'); const setItems = rd('setItems').filter((x) => !x.disabled);
  console.log('【套裝加成】');
  const mk = (names) => names.map((n) => bei({ entry: getCatalog().find((e) => e.kind === 'set' && e.nameEn === n) }, getCatalog().find((e) => e.kind === 'set' && e.nameEn === n).slot, true));
  const run = (items) => cc(gameData, { className: 'Sorceress', level: 90, allocated: none, items, difficulty: 'normal' });
  /** 套裝帶來的差額＝整組數值 − 各件單獨數值的加總（只看某個 stat） */
  const delta = (names, stat) => { const items = mk(names); return (run(items).stats[stat] ?? 0) - items.reduce((a, it) => a + (run([it]).stats[stat] ?? 0), 0); };
  /** 從遊戲資料直接算出預期值：套裝層級（≤件數）加上各件層級（件數≥pieces）的某些屬性代碼 */
  const expected = (setId, names, codes, full) => {
    const set = sets.find((x) => x.id === setId); const n = names.length; let v = 0;
    for (const m of set.partial) if (m.pieces <= n && codes.includes(m.code)) v += m.max;
    if (full) for (const m of set.full) if (codes.includes(m.code)) v += m.max;
    for (const it of setItems.filter((x) => names.includes(x.nameEn))) for (const b of it.setBonusByCount) if (b.slot + 1 <= n && codes.includes(b.code)) v += b.max;
    return v;
  };
  const TAL = ["Tal Rasha's Horadric Crest", "Tal Rasha's Howling Wind", "Tal Rasha's Fire-Spun Cloth", "Tal Rasha's Adjudication"];

  t('套裝資料完整：每個套裝的件數＝資料中的套裝件數，partial 與各件加成的件數門檻都不超過全套件數', () => {
    assert.equal(gameData.sets.length, sets.length);
    for (const d of gameData.sets) {
      const n = setItems.filter((x) => x.set === d.id).length; assert.equal(d.size, n, d.nameEn); assert.ok(n >= 2, d.nameEn);
      for (const p of d.partial) assert.ok(p.pieces <= d.size, `${d.nameEn} partial ${p.pieces}`);
    }
    // 各件加成的門檻是「第 N 組＝N+1 件」。資料裡唯一超出全套件數的是赫拉森之領的第 5 組（要 6 件，但套裝只有 5 件），永遠不會生效，與遊戲資料一致
    const over = setItems.flatMap((it) => it.setBonusByCount.filter((b) => b.slot + 1 > gameData.sets.find((x) => x.id === it.set).size).map((b) => `${it.nameEn}#${b.slot}`));
    assert.deepEqual(over, ["Horazon's Dominion#5"]);
  });
  t('塔拉夏套裝：3 件才有 +65% MF（2 件沒有）；審判項鍊的 +10% 快速施法要 4 件才生效（兩個社群來源一致）', () => {
    assert.equal(delta(TAL.slice(0, 2), 'item_magicbonus'), 0);
    assert.equal(delta(TAL.slice(0, 3), 'item_magicbonus'), 65);
    assert.equal(expected('tal_rasha_s_wrappings', TAL.slice(0, 3), ['mag%']), 65);
    assert.equal(delta([TAL[0], TAL[1], TAL[3]], 'item_fastercastrate'), expected('tal_rasha_s_wrappings', [TAL[0], TAL[1], TAL[3]], ['cast1', 'cast2', 'cast3']));
    assert.equal(delta(TAL, 'item_fastercastrate'), expected('tal_rasha_s_wrappings', TAL, ['cast1', 'cast2', 'cast3']));
    assert.ok(delta(TAL, 'item_fastercastrate') >= 10, '4 件時審判項鍊的快速施法生效');
    assert.ok(delta(TAL, 'item_fastercastrate') > delta([TAL[0], TAL[1], TAL[3]], 'item_fastercastrate'));
  });
  t('全套加成：希弗柏全套（3 件）力量＋15、電抗＋25；缺一件不生效；摘要顯示 3/3', () => {
    const CIV = ["Civerb's Ward", "Civerb's Icon", "Civerb's Cudgel"];
    assert.equal(delta(CIV, 'strength'), expected('civerb_s_vestments', CIV, ['str'], true));
    assert.equal(delta(CIV, 'strength'), 15);
    assert.equal(delta(CIV.slice(0, 2), 'strength'), 0);
    const r = run(mk(CIV)); assert.deepEqual(r.sets.map((x) => [x.id, x.count, x.size, x.full]), [['civerb_s_vestments', 3, 3, true]]);
    const r2 = run(mk(CIV.slice(0, 2))); assert.equal(r2.sets[0].full, false); assert.deepEqual(r2.sets[0].activePieces, [2]);
  });
  t('套裝加成：同一件穿兩次只算一件；不同套裝各算各的；非套裝物品不受影響', () => {
    const one = mk(["Tal Rasha's Horadric Crest"]);
    assert.equal(run([...one, ...one]).sets[0].count, 1);
    assert.equal((run([...one, ...one]).stats.item_magicbonus ?? 0), 2 * (run(one).stats.item_magicbonus ?? 0), '重複件只有自身屬性相加，沒有套裝加成');
    const mixed = run(mk(["Tal Rasha's Horadric Crest", "Civerb's Ward"])); assert.equal(mixed.sets.length, 2); assert.ok(mixed.sets.every((x) => x.count === 1 && x.activePieces.length === 0));
    assert.deepEqual(run([]).sets, []);
  });
  t('套裝全穿：每個套裝穿滿後沒有新的未處理屬性，且套裝固定防禦有加進防禦', () => {
    for (const d of gameData.sets) {
      const names = setItems.filter((x) => x.set === d.id).map((x) => x.nameEn); const items = mk(names);
      const r = run(items); assert.equal(r.sets[0].full, true, d.nameEn);
      assert.deepEqual(r.unhandled.filter((x) => !KNOWN_UNDEFINED.has(x.code) && x.slot.startsWith('套裝：')), [], d.nameEn);
    }
    const WRAP = [...TAL, "Tal Rasha's Lidless Eye"];
    const items = mk(WRAP); const noSet = items.map((it) => ({ ...it, setId: undefined, setBonus: undefined }));
    assert.equal(run(items).defense - run(noSet).defense, expected('tal_rasha_s_wrappings', WRAP, ['ac'], true), '全套固定防禦 150 ＋ 各件在 2～5 件時的固定防禦');
    assert.ok(expected('tal_rasha_s_wrappings', WRAP, ['ac'], true) >= 150);
  });
}

// ── 斷點 ──
{
  const { BREAKPOINTS, bpStatus } = E;
  console.log('【FCR／FHR／FBR 斷點（社群表）】');
  const get = (kind, cls, id) => BREAKPOINTS[kind][cls].find((x) => (id ? x.id === id : true));
  t('斷點表結構：從 0% 開始、百分比嚴格遞增、影格不增加、兩個陣列等長；沒有術士資料', () => {
    for (const [kind, byClass] of Object.entries(BREAKPOINTS)) for (const [cls, tables] of Object.entries(byClass)) for (const tb of tables) {
      const id = `${kind}/${cls}/${tb.id}`;
      assert.equal(tb.thresholds[0], 0, id); assert.equal(tb.thresholds.length, tb.frames.length, id);
      for (let i = 1; i < tb.thresholds.length; i++) { assert.ok(tb.thresholds[i] > tb.thresholds[i - 1], `${id} 百分比`); assert.ok(tb.frames[i] <= tb.frames[i - 1] && tb.frames[i - 1] - tb.frames[i] <= 1, `${id} 影格`); }
    }
    for (const kind of ['fcr', 'fhr', 'fbr']) assert.equal(BREAKPOINTS[kind].war, undefined);
    assert.deepEqual(Object.keys(BREAKPOINTS.fcr).sort(), ['ama', 'ass', 'bar', 'dru', 'nec', 'pal', 'sor']);
  });
  t('斷點計算：魔法使一般法術 8%→13 影格、9%→12、62%→10、63%→9、105%→8、200%→7；下一格與差距正確；超過最高仍是最高', () => {
    const sor = get('fcr', 'sor', 'regular');
    for (const [v, f] of [[0, 13], [8, 13], [9, 12], [19, 12], [20, 11], [62, 10], [63, 9], [104, 9], [105, 8], [200, 7], [999, 7], [-5, 13]]) assert.equal(bpStatus(sor, v).frames, f, `FCR ${v}`);
    assert.deepEqual(bpStatus(sor, 95).next, { threshold: 105, frames: 8, missing: 10 });
    assert.equal(bpStatus(sor, 200).next, undefined);
    assert.equal(bpStatus(sor, 95.9).current, 63, '小數捨去');
  });
  t('斷點與 DiabloBytes 的常用目標一致：魔法使 63%＝9 影格、死靈法師 125%＝9、聖騎士 75%＝10 與 125%＝9、野蠻人 63%＝9、刺客 102%＝10', () => {
    assert.equal(bpStatus(get('fcr', 'sor', 'regular'), 63).frames, 9); assert.equal(bpStatus(get('fcr', 'nec', 'normal'), 125).frames, 9);
    assert.equal(bpStatus(get('fcr', 'pal'), 75).frames, 10); assert.equal(bpStatus(get('fcr', 'pal'), 125).frames, 9);
    assert.equal(bpStatus(get('fcr', 'bar'), 63).frames, 9); assert.equal(bpStatus(get('fcr', 'ass'), 102).frames, 10);
  });
  t('其他斷點：魔法使 FHR 142%→6 影格；狼人 FHR 86%→3；人形德魯伊 FBR 52%→6；來源缺漏補上的最後一格有標示', () => {
    assert.equal(bpStatus(get('fhr', 'sor'), 142).frames, 6); assert.equal(bpStatus(get('fhr', 'dru', 'wolf'), 86).frames, 3); assert.equal(bpStatus(get('fbr', 'dru', 'human'), 52).frames, 6);
    const inferred = ['fhr/dru/other', 'fhr/nec/normal', 'fhr/pal/spear'];
    for (const id of inferred) { const [k, c, i] = id.split('/'); assert.equal(get(k, c, i).inferredLast, true, id); assert.equal(get(k, c, i).frames.at(-1), 4, id); }
  });
}

// ── 屬性描述完整性 ──
{
  const { getCatalog, describeModifiers } = E;
  console.log('【屬性描述】');
  t('所有暗金／套裝／符文之語的屬性都有繁中描述（只有已知未定義的 3 個代碼例外），耐久度與鑲孔不再顯示成紅色未知行', () => {
    const bad = new Map();
    for (const e of getCatalog()) { if (e.kind === 'base') continue; for (const l of describeModifiers(e.mods, 1, 90)) if (!l.known) bad.set(l.text.split(' ')[0], (bad.get(l.text.split(' ')[0]) ?? 0) + 1); }
    assert.deepEqual([...bad.keys()].filter((k) => !KNOWN_UNDEFINED.has(k)), [], '未知描述：' + JSON.stringify([...bad]));
    const rake = getCatalog().find((x) => x.nameEn === 'Rakescar'); assert.ok(describeModifiers(rake.mods, 1, 90).some((l) => l.text === '+38 毒素傷害，時效 3 秒'), '毒素傷害＝每幀傷害×持續幀數÷256（128×75÷256≈38），持續 75 幀＝3 秒');
    const withSock = getCatalog().find((x) => x.kind === 'unique' && x.mods.some((m) => m.code === 'sock')); assert.ok(withSock, '資料裡有帶鑲孔的暗金');
    assert.ok(!describeModifiers(withSock.mods, 1, 90).some((l) => /sock/.test(l.text)));
  });
}

// ── 屬性描述：百科頁共用的轉譯（區間、合併、特殊屬性）──
{
  const { getCatalog, describeModifiers, describeRanges, describeEntry, evalCalc, GAME_SKILLS, synergySources } = E;
  const cat = getCatalog(); const by = (n) => cat.find((x) => x.nameEn === n);
  const txt = (e, ranged = false) => (ranged ? describeRanges(e.mods) : describeModifiers(e.mods, 1, 90)).map((l) => l.text);
  console.log('【屬性描述：百科用】');
  t('怪物逃跑％依 descfunc 5 換算（遊戲以 128 為 100%）：怒號長牙 33→25%、鐵刺棒 96→75%', () => {
    assert.ok(txt(by('Howltusk')).includes('+25% 機率擊中使怪物逃跑'));
    assert.ok(txt(by('Steelgoad')).includes('+75% 機率擊中使怪物逃跑'));
  });
  t('技能參數為技能 id 時顯示技能名稱：不死皇冠 +3 骷髏專精、地獄火炬觸發火焰風暴', () => {
    assert.ok(txt(by('Undead Crown')).some((l) => l === '+3 至骷髏專精 （只限死靈法師）'), txt(by('Undead Crown')).join('|'));
    assert.ok(txt(by('Hellfire Torch')).some((l) => /等級 10 火焰風暴/.test(l)), txt(by('Hellfire Torch')).join('|'));
  });
  t('觸發技能、充能、靈氣、鑲孔、永不毀損、無形：不得出現 %d、代碼或「非數值屬性」', () => {
    for (const e of cat.filter((x) => x.kind !== 'base')) for (const l of describeModifiers(e.mods, 1, 90)) {
      if (!l.known) continue;
      assert.ok(!/%d|%s|非數值屬性|^[a-z-]+ \d|[+]\d+ \d+$/.test(l.text), e.nameEn + '：' + l.text);
    }
    assert.ok(txt(by('Spellsteel')).includes('等級 1 傳送術（20 次）'));
    assert.ok(txt(by('Crown of Ages')).includes('永不毀損') && txt(by('Crown of Ages')).includes('鑲孔（2）'));
  });
  t('最小／最大傷害成對合併；相同時寫成「+N」；四抗、四圍相同時合併', () => {
    assert.ok(txt(by('Stormspike')).includes('附加 1 - 120 電擊傷害'));
    assert.ok(txt(by('Coldkill')).includes('+40 冰寒傷害'));
    assert.ok(txt(by('Veil of Steel')).includes('所有抗性 +50'));
    assert.ok(txt(by('Harlequin Crest')).includes('+2 所有屬性'));
  });
  t('百科用區間：下限～上限；依等級的屬性寫成算式（不假設角色等級）', () => {
    const r = txt(by('Tomb Reaver'), true);
    assert.ok(r.includes('+200-280% 傷害強化') && r.includes('鑲孔（1-3）') && r.includes('所有抗性 +30-50'), r.join('|'));
    assert.ok(txt(by('Harlequin Crest'), true).includes('+(1-148) 生命 （依角色等級而定） [1.5 * clvl]'));
  });
  t('多個來源的毒素傷害：每幀傷害相加、持續時間取平均（劇毒 273 點／6 秒）', () => {
    const rw = cat.find((x) => x.kind === 'runeword' && x.nameEn === 'Venom');
    const gem = E.gameData.gems; const mods = [...rw.mods, ...rw.sockets.flatMap((c) => gem.find((g) => g.code === c).weapon)];
    assert.ok(describeRanges(mods).some((l) => l.text === '+273 毒素傷害，時效 6 秒'), describeRanges(mods).map((l) => l.text).join('|'));
  });
  t('屬性代碼不分大小寫（Gethit-skill）；套裝全套的外觀狀態有文字', () => {
    const d = rd('uniques').find((x) => x.nameEn === "Defender's Bile"); assert.ok(d, '遊戲表有防禦者的膽汁'); const lines = describeModifiers(d.mods, 1, 90).map((l) => l.text);
    assert.ok(lines.some((l) => /被擊中時有 1% 機率施展等級 25 骸骨護甲/.test(l)), lines.join('|'));
    assert.equal(describeModifiers([{ code: 'state', par: 'fullsetgeneric', min: 1, max: 1 }]).map((l) => l.text)[0], '角色顯示光環效果');
  });
  t('計算式：結尾缺右括號、skill(名稱.parN／.lnXY)、pa10 簡寫；遊戲表所有協同式都能求值', () => {
    const ctx = { params: { 8: 4, 10: 3 }, lvl: 5, blvl: 5, skill: () => ({ lvl: 2, blvl: 2 }), skillParams: () => ({ 1: 10, 2: 5, 8: 6 }) };
    assert.equal(evalCalc("(skill('A'.blvl)*par8+skill('B'.blvl)*par8", ctx), 16);
    assert.equal(evalCalc("skill('A'.ln12)", ctx), 15); assert.equal(evalCalc("skill('A'.par8)", ctx), 6); assert.equal(evalCalc('pa10*2', ctx), 6);
    for (const g of GAME_SKILLS) for (const x of synergySources(g, {}).sources) assert.ok(!Number.isNaN(x.perPoint), `${x.skill.nameEn}→${g.nameEn}`);
  });
}

// ── 百科頁資料層：由遊戲資料表產生，且舊 id 不得失效 ──
{
  const { UNIQUE_ITEMS_DATA, SET_ITEMS_DATA, ALL_SET_PIECES, RUNEWORDS_DATA, BASE_ITEMS_DATA, RUNES_DATA, SKILLS_DATA, SYNERGY_RELATIONS, calculateSkillSynergies, SKILL_GRID_LAYOUT, CODEX_OVERLAY, normalizeItemQuery, GAME_SKILLS } = E;
  console.log('【百科頁資料層】');
  const ids = (a) => a.map((x) => x.id);
  t('各類 id 在類別內不重複；覆蓋層記錄的舊 id（聖杯存檔、社群別名使用）全部仍在資料裡', () => {
    for (const [label, list] of [['暗金', UNIQUE_ITEMS_DATA], ['套裝', SET_ITEMS_DATA], ['套裝件', ALL_SET_PIECES], ['符文之語', RUNEWORDS_DATA], ['底材', BASE_ITEMS_DATA]]) assert.equal(new Set(ids(list)).size, list.length, label + ' id 重複');
    const has = (list, o) => Object.values(o).filter((v) => v.id).every((v) => ids(list).includes(v.id));
    assert.ok(has(UNIQUE_ITEMS_DATA, CODEX_OVERLAY.uniques), '暗金舊 id'); assert.ok(has(ALL_SET_PIECES, CODEX_OVERLAY.setItems), '套裝件舊 id');
    assert.ok(has(SET_ITEMS_DATA, CODEX_OVERLAY.sets), '套裝舊 id'); assert.ok(has(RUNEWORDS_DATA, CODEX_OVERLAY.runewords), '符文之語舊 id'); assert.ok(has(BASE_ITEMS_DATA, CODEX_OVERLAY.bases), '底材舊 id');
    console.log(`    舊 id 對照：暗金 ${Object.keys(CODEX_OVERLAY.uniques).length}、套裝件 ${Object.keys(CODEX_OVERLAY.setItems).length}、套裝 ${Object.keys(CODEX_OVERLAY.sets).length}、符文之語 ${Object.keys(CODEX_OVERLAY.runewords).length}、底材 ${Object.keys(CODEX_OVERLAY.bases).length}`);
  });
  t('資料筆數：遊戲表全部掉落暗金／套裝／符文之語都收錄（排除任務物品與不掉落者）', () => {
    const gu = rd('uniques'); const quest = new Set(['Amulet of the Viper', 'Staff of Kings', 'Horadric Staff', 'Hell Forge Hammer', 'KhalimFlail', 'SuperKhalimFlail']);
    const expect = gu.filter((u) => CODEX_OVERLAY.uniques[u.id]?.id || (!quest.has(u.nameEn) && u.spawnable !== false)).length;
    assert.equal(UNIQUE_ITEMS_DATA.length, expect); assert.equal(ALL_SET_PIECES.length, rd('setItems').length); assert.equal(SET_ITEMS_DATA.length, rd('sets').length); assert.equal(RUNEWORDS_DATA.length, rd('runewords').length);
    console.log(`    暗金 ${UNIQUE_ITEMS_DATA.length}、套裝 ${SET_ITEMS_DATA.length} 套／${ALL_SET_PIECES.length} 件、符文之語 ${RUNEWORDS_DATA.length}、底材 ${BASE_ITEMS_DATA.length}、符文 ${RUNES_DATA.length}`);
  });
  t('部位：底材類型屬珠寶系（含 Rainbow Facet 變體用的 cjw）的暗金一律歸在 jewel，不得落到預設的 weapon', () => {
    const jewels = UNIQUE_ITEMS_DATA.filter((u) => /Facet|Defender's|Guardian's|Protector's/.test(u.nameEn));
    assert.ok(jewels.length >= 14, '珠寶類暗金筆數 ' + jewels.length);
    assert.deepEqual(jewels.filter((u) => u.slot !== 'jewel').map((u) => u.nameEn), []);
  });
  t('符文之語：符文序列與孔數取自遊戲表，屬性含符文鑲嵌總計；Hustle 武器版與護甲版分開', () => {
    const rw = (n) => RUNEWORDS_DATA.find((r) => r.nameEn === n);
    assert.deepEqual(rw("Ancients' Pledge").attributes.filter((l) => /抗性/.test(l)).sort(), ['冰寒抗性 +43%', '毒素抗性 +48%', '火焰抗性 +48%', '電擊抗性 +48%'].sort());
    assert.deepEqual(rw('Spirit').runes, ['Tal', 'Thul', 'Ort', 'Amn']);
    assert.ok(RUNEWORDS_DATA.some((r) => r.name === '狂躁') && RUNEWORDS_DATA.some((r) => r.name === '歇斯底里'));
  });
  t('表頭行：防禦區間、無形物品 ×1.5 與需求 −10、盾牌依職業分組的格擋、投擲武器堆疊', () => {
    const u = (n) => UNIQUE_ITEMS_DATA.find((x) => x.nameEn === n).attributes;
    assert.ok(u('Duskdeep').includes('防禦：39-59'), u('Duskdeep').join('|'));
    assert.ok(u('Ghostflame').some((l) => /需要力量：55/.test(l)));
    assert.ok(u('Herald of Zakarum').some((l) => /^格擋機率：\d+%$/.test(l)), '職業專屬盾牌只列該職業的格擋');
    assert.ok(u('The Ward').filter((l) => /^格擋機率：/.test(l)).length === 3);
    assert.ok(u("Demon's Arch").some((l) => /^最大堆疊：/.test(l)) && !u("Demon's Arch").some((l) => /^耐久度/.test(l)));
  });
  t('舊 BuildPlanner／搜尋的社群別名全部對得到資料（目標 id 不得失效）', () => {
    const src = fs.readFileSync('src/utils/itemQueryNormalizer.ts', 'utf8'); const m = [...src.matchAll(/'([^']+)':\s*'([a-z0-9_]+)'/g)];
    const all = new Set([...ids(UNIQUE_ITEMS_DATA), ...ids(SET_ITEMS_DATA), ...ids(ALL_SET_PIECES), ...ids(RUNEWORDS_DATA), ...ids(BASE_ITEMS_DATA)]);
    assert.ok(m.length > 100, '別名表筆數'); assert.deepEqual([...new Set(m.map((x) => x[2]))].filter((id) => !all.has(id)), []);
    for (const [q, id] of [['軍帽', 'harlequin_crest'], ['soj', 'the_stone_of_jordan'], ['謎團', 'enigma']]) assert.equal(normalizeItemQuery(q)?.id, id, q);
  });
  t('技能：8 職業×3 樹×10 招；格位在 6×3 內且不重複；前置都能解析；協同端點存在；110 點預算＝引擎預算', () => {
    assert.equal(SKILLS_DATA.length, 8);
    const all = SKILLS_DATA.flatMap((c) => c.trees.map((tr) => { assert.equal(tr.skills.length, 10, c.characterClass + tr.name); return tr; }));
    assert.equal(all.length, 24); const sid = new Set(all.flatMap((tr) => tr.skills.map((s) => s.id))); assert.equal(sid.size, 240);
    for (const tr of all) { const seen = new Set(); for (const s of tr.skills) { const p = SKILL_GRID_LAYOUT[s.id]; assert.ok(p && p.row >= 0 && p.row <= 5 && p.col >= 0 && p.col <= 2, s.id); const k = p.row * 3 + p.col; assert.ok(!seen.has(k), '格位重複 ' + s.id); seen.add(k); for (const pre of s.prerequisites) assert.ok(sid.has(pre), s.id + '←' + pre); } }
    for (const r of SYNERGY_RELATIONS) assert.ok(sid.has(r.sourceId) && sid.has(r.targetId), r.sourceId + '→' + r.targetId);
    assert.equal(E.skillPointBudget(99, 3), 110);
    const fb = SKILLS_DATA.flatMap((c) => c.trees.flatMap((tr) => tr.skills)).find((s) => s.nameEn === 'Fire Ball'); const prof = calculateSkillSynergies(fb.id, { fire_bolt: 10 });
    assert.ok(prof.incoming.some((i) => i.skillId === 'fire_bolt' && i.percentPerPoint === 14 && i.totalPercent === 140), JSON.stringify(prof.incoming));
  });
  t('技能：每個舊技能（名稱、俗稱）仍能被搜尋到；遊戲表沒有依據的舊協同保留並標示', () => {
    const all = SKILLS_DATA.flatMap((c) => c.trees.flatMap((tr) => tr.skills));
    assert.ok(all.some((s) => (s.aliases ?? []).includes('冰彈')) && all.some((s) => (s.aliases ?? []).some((a) => /BO/.test(a))));
    assert.ok(all.filter((s) => s.details).length >= 200, '戰術解析');
    const legacy = SYNERGY_RELATIONS.filter((r) => /舊版資料/.test(r.displayText)); assert.equal(legacy.length, CODEX_OVERLAY.legacySynergies.length);
    assert.equal(GAME_SKILLS.length, 240);
  });
}

// ── 隨機屬性（暗黑火炬、奧姆斯長袍）與物品技能持續時間 ──
{
  const { getCatalog, buildEngineItem: bei, computeCharacter: cc, describeEntry, itemSkillSeconds } = E;
  console.log('【隨機屬性與物品技能】');
  const find = (nm) => getCatalog().find((e) => e.nameEn === nm && e.kind !== 'base');
  const run = (className, items) => cc(gameData, { className, level: 90, allocated: none, items, difficulty: 'normal' });
  t('暗黑火炬：+3 職業技能依目前職業計算（原本把職業編號當成數值、再加給聖騎士）', () => {
    const torch = bei({ entry: find('Hellfire Torch') }, 'charm0');
    for (const cls of ['Amazon', 'Sorceress', 'Paladin', 'Barbarian', 'Druid', 'Assassin']) {
      const r = run(cls, [torch]);
      assert.equal(r.skills.byClass[cls], 3, `${cls} 應 +3`);
      assert.deepEqual(Object.keys(r.skills.byClass), [cls], `${cls} 不應有其他職業的加成`);
    }
    assert.deepEqual(run('Sorceress', [bei({ entry: find('Annihilus') }, 'charm0')]).skills.byClass, {}, '殲滅小符沒有職業技能');
    assert.equal(run('Paladin', [torch]).unhandled.length, 0);
  });
  t('奧姆斯長袍：+3 隨機魔法使技能由使用者選；沒選就不計入（原本把技能編號當成 +60 級加給不存在的技能）', () => {
    const robe = find("Ormus' Robes");
    const none0 = run('Sorceress', [bei({ entry: robe }, 'body')]); assert.deepEqual(none0.skills.single, {}, '沒選技能不加');
    const pick = run('Sorceress', [bei({ entry: robe, randomSkill: 'Blizzard' }, 'body')]); assert.deepEqual(pick.skills.single, { Blizzard: 3 });
    const mod = robe.mods.find((m) => m.code === 'skill-rand'); assert.ok(mod.min <= 36 && mod.max >= 60);
    const ids = new Set(E.GAME_SKILLS.filter((x) => x.gameId >= mod.min && x.gameId <= mod.max).map((x) => x.charClass)); assert.deepEqual([...ids], ['sor'], '範圍內只有魔法使技能');
    assert.ok(E.GAME_SKILLS.some((x) => x.nameEn === 'Blizzard' && x.gameId >= mod.min && x.gameId <= mod.max));
  });
  t('隨機技能隨 Profile 存取（含驗證）', () => {
    const { toSavedData, fromSavedData, parseProfile, exportProfile, newProfile, SIM_PRESETS, stateFromPreset } = E;
    const snap = stateFromPreset(SIM_PRESETS.find((x) => x.id === 'sor-blizzard:bis')).snap;
    const withRobe = { ...snap, equipped: { ...snap.equipped, body: { entry: find("Ormus' Robes"), randomSkill: 'Blizzard' } } };
    const back = fromSavedData(JSON.parse(JSON.stringify(toSavedData(withRobe)))); assert.deepEqual(back.errors, []); assert.equal(back.snap.equipped.body.randomSkill, 'Blizzard');
    const bad = JSON.parse(exportProfile(newProfile('x', withRobe))); bad.data.equipped.body.randomSkill = 5; assert.equal(typeof parseProfile(JSON.stringify(bad)), 'string');
    const unknown = JSON.parse(exportProfile(newProfile('x', withRobe))); unknown.data.equipped.body.randomSkill = 'No Such Skill';
    assert.equal(fromSavedData(parseProfile(JSON.stringify(unknown)).data).snap.equipped.body.randomSkill, undefined, '不認得的技能名稱不還原');
  });
  t('熊人／狼人印記的持續時間來自遊戲資料表（4500 影格 ÷ 25 ＝ 180 秒），不再寫死', () => {
    assert.equal(itemSkillSeconds('Mark of the Bear'), 180); assert.equal(itemSkillSeconds('mark of the wolf'), 180); assert.equal(itemSkillSeconds('Health Link'), 20);
    assert.equal(itemSkillSeconds('Nonexistent'), undefined);
    const raw = rd('itemSkills'); for (const [nm, v] of Object.entries(raw)) assert.equal(v.seconds, v.frames / 25, nm);
    const line = describeEntry({ stat: 'item_skillonattack', value: 10, level: 5, param: 'Mark of the Bear' }, 90);
    assert.match(line, /熊人變化的攻擊會賦予印記，持續 180 秒/);
  });
}

// ── 百科搜尋：帶說明文字的裝備名 ──
{
  const { normalizeItemQuery } = E;
  console.log('【百科搜尋：帶說明文字的裝備名】');
  t('裝備名後面接說明文字、括號在句中、有全形括號或【】時，仍能找到物品（原本只有「名稱 (英文)」結尾剛好是括號才行）', () => {
    const rf = (q) => normalizeItemQuery(q)?.id;
    for (const q of ['烏鴉之霜', 'Raven Frost', '烏鴉之霜 (Raven Frost)', '烏鴉之霜 (Raven Frost) 無法被凍結', '烏鴉之霜  (Raven Frost) 魔法屬性', '烏鴉之霜（Raven Frost）無法凍結', '烏鴉之霜 無法被凍結', '【烏鴉之霜】', '烏鴉之霜 (Raven Frost)\n⬩+150-250 準確率'])
      assert.equal(rf(q), 'raven_frost', JSON.stringify(q));
    assert.equal(rf('戰爭召喚 (Call to Arms) +1 全部技能'), 'call_to_arms'); assert.equal(rf('精神 (Spirit) 符文之語'), 'spirit');
    assert.equal(rf('巨骷髏/安頭')?.length > 0, true, '斜線二選一照舊');
    assert.equal(normalizeItemQuery('這不是任何物品的名字 (Not An Item)'), null);
    assert.equal(normalizeItemQuery(''), null);
  });
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
  t('dm（遞減）公式：依遊戲 skillcalc 的定義、整數運算。閃躲 1 級 18%、20 級 56%；致命攻勢 20 級 68%；自然抵抗 20 級 67%；神聖之盾 20 級格擋 +35%；救贖 20 級全抗 +109', () => {
    const pe = (n, L, stat) => E.passiveEffects(skillByName(n), L).find((e) => e.stat === stat).value;
    const ae = (n, L, stat) => auraEffects(skillByName(n), L).find((e) => e.stat === stat).value;
    assert.equal(pe('Dodge', 1, 'passive_dodge'), 18); assert.equal(pe('Dodge', 20, 'passive_dodge'), 56);
    assert.equal(pe('Critical Strike', 20, 'passive_critical_strike'), 68); assert.equal(pe('Natural Resistance', 20, 'fireresist'), 67);
    assert.equal(ae('Holy Shield', 20, 'toblock'), 35); assert.equal(ae('Salvation', 20, 'fireresist'), 109);
  });
  t('遊戲定義的函式：技能表裡出現的每個 lnXY／dmXY 都有定義（skillCalc.json 來自遊戲 skillcalc.txt）', () => {
    const defs = rd('skillCalc'); const used = new Set();
    const scan = (v) => { if (typeof v === 'string') for (const m of v.matchAll(/\b(ln|dm)\d\d\b/g)) used.add(m[0]); else if (v && typeof v === 'object') Object.values(v).forEach(scan); };
    rd('skills').forEach(scan);
    assert.ok(used.size >= 8, `用到的函式 ${[...used].join(',')}`);
    for (const k of used) assert.ok(defs[k], `skillCalc.json 缺少 ${k}`);
  });
  t('ln91／ln21／dm91 不是字面上的第 9／1、第 2／1 個參數，而是 par9／par10 與 par11／par12（遊戲定義）', () => {
    const ctx = (params, lvl) => ({ params, lvl, skill: () => undefined });
    assert.equal(E.evalCalc('ln91', ctx({ 9: 100, 10: 20, 1: 7 }, 5)), 100 + 4 * 20);
    assert.equal(E.evalCalc('ln21', ctx({ 11: 5, 12: 3, 1: 99, 2: 99 }, 3)), 5 + 2 * 3);
    assert.equal(E.evalCalc('dm91', ctx({ 9: 0, 10: 66 }, 20)), Math.trunc((110 * 20 * 66) / (100 * 26)));
  });
  t('整數運算：除法往零的方向捨去（7/2＝3、−7/2＝−3），和遊戲的計算式一致', () => {
    const ctx = { params: {}, skill: () => undefined };
    assert.equal(E.evalCalc('7/2', ctx), 3); assert.equal(E.evalCalc('-7/2', ctx), -3); assert.equal(E.evalCalc('10/4*4', ctx), 8);
  });
  t('別的技能的 dm：skill(\'X\'.dm34) 用那個技能的參數與等級', () => {
    const ctx = { params: {}, lvl: 1, skill: () => ({ lvl: 20, blvl: 20 }), skillParams: () => ({ 3: 0, 4: 40 }) };
    assert.equal(E.evalCalc("skill('Golem Mastery'.dm34)", ctx), Math.trunc((110 * 20 * 40) / (100 * 26)));
  });
  t('抗火被動：最大火焰抗性＝抗火硬點÷2（取整），公式引用自己的硬點', () => {
    const lv = E.skillLevelsFrom({ resist_fire: 5 }, zero);
    assert.equal(E.passiveEffects(skillByName('Resist Fire'), 5, lv).find((x) => x.stat === 'maxfireresist').value, 2);
    assert.equal(E.passiveEffects(skillByName('Resist Fire'), 20, E.skillLevelsFrom({ resist_fire: 20 }, zero)).find((x) => x.stat === 'maxfireresist').value, 10);
  });
  t('被動技能：自然抵抗計入四種抗性、抗火被動計入最大火焰抗性、提高速度計入技能跑速；閃躲只列出不計入', () => {
    const hard = { natural_resistance: 20, dodge: 20, resist_fire: 5, increased_speed: 20 };
    const ps = E.passiveSummary(hard, zero, E.skillLevelsFrom(hard, zero));
    const sum = (stat) => ps.self.filter((e) => e.stat === stat).reduce((a, e) => a + e.value, 0);
    for (const st of ['fireresist', 'coldresist', 'lightresist', 'poisonresist']) assert.equal(sum(st), 67, st);
    assert.equal(sum('maxfireresist'), 2); assert.equal(sum('skill_frw'), 43);
    const dodge = ps.lines.find((l) => l.stat === 'passive_dodge');
    assert.ok(dodge && dodge.applied === false && dodge.value === 56 && /閃躲近戰/.test(dodge.text), JSON.stringify(dodge));
    assert.ok(ps.lines.filter((l) => l.applied).every((l) => ['fireresist', 'coldresist', 'lightresist', 'poisonresist', 'maxfireresist', 'velocitypercent'].includes(l.stat)));
  });
  t('光環套用：神聖之盾→格擋、狂熱→技能攻速、活力→技能跑速、救贖→元素抗性', () => {
    const hard = { holy_shield: 20, fanaticism: 20, vigor: 20, salvation: 20 };
    const ap = applyBuffs(buffCandidates('pal', hard, zero, {}), E.skillLevelsFrom(hard, zero));
    const v = (stat) => ap.self.filter((e) => e.stat === stat).reduce((a, e) => a + e.value, 0);
    assert.equal(v('toblock'), 35); assert.equal(v('skill_ias'), 35); assert.equal(v('skill_frw'), 43); assert.equal(v('fireresist'), 109);
  });
  t('神聖之盾計入格擋：同一面盾牌，開啟神聖之盾後格擋機率提高', () => {
    const sh = gd.bases.find((b) => b.nameEn === 'Sacred Targe');
    const items = [{ slot: 'shield', baseCode: sh.code, mods: [] }];
    const base = { className: 'Paladin', level: 90, allocated: { str: 0, dex: 80, vit: 0, ene: 0 }, items };
    const off = cc(gd, base);
    const on = cc(gd, { ...base, extraStats: [{ stat: 'toblock', value: 35 }] });
    assert.ok(on.blockChance > off.blockChance, `${off.blockChance}→${on.blockChance}`);
    assert.equal(on.blockChance, Math.min(75, Math.floor(((sh.block + 35 + 30) * 85) / 180)));
  });
  t('自然抵抗進入角色抗性：開啟前後差 67 點（未截斷的值）', () => {
    const base = { className: 'Barbarian', level: 90, allocated: { str: 0, dex: 0, vit: 0, ene: 0 }, items: [] };
    const off = cc(gd, base); const on = cc(gd, { ...base, extraStats: [{ stat: 'fireresist', value: 67 }] });
    assert.equal(on.rawResist.fire - off.rawResist.fire, 67);
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

console.log('【首頁分類磚：預先算好的小檔要和現在的資料一致】');
t('portalSummary.json 與 buildGearTiles(現在的資料) 一致（資料更新後要重跑 npm run data:portal）', () => {
  const fresh = JSON.parse(JSON.stringify(E.buildGearTiles({ uniques: E.UNIQUE_ITEMS_DATA, sets: E.SET_ITEMS_DATA, bases: E.BASE_ITEMS_DATA, runewords: E.RUNEWORDS_DATA, runes: E.RUNES_DATA })));
  const saved = JSON.parse(fs.readFileSync('src/data/codex/portalSummary.json', 'utf8'));
  assert.deepEqual(saved, fresh);
});
t('首頁分類磚的筆數就是資料筆數（暗金／套裝／符文之語／底材／符文）', () => {
  const saved = JSON.parse(fs.readFileSync('src/data/codex/portalSummary.json', 'utf8'));
  const count = (id) => saved.find((x) => x.id === id).count;
  assert.equal(count('items'), E.UNIQUE_ITEMS_DATA.length); assert.equal(count('sets'), E.SET_ITEMS_DATA.length);
  assert.equal(count('runewords'), E.RUNEWORDS_DATA.length); assert.equal(count('bases'), E.BASE_ITEMS_DATA.length); assert.equal(count('runes'), E.RUNES_DATA.length);
});

console.log('【物品描述不載入整份技能表：技能名稱表自帶職業】');
t('skillNames.json 的 charClass 與 skills.json 一致（職業技能 240 個都有，其餘沒有）', () => {
  const names = rd('skillNames'); const skills = rd('skills');
  const classOf = new Map(skills.map((x) => [x.gameId, x.charClass]));
  for (const n of names) assert.equal(n.charClass, classOf.get(n.gameId), `${n.nameEn} (#${n.gameId})`);
  for (const sk of skills) assert.ok(names.some((n) => n.gameId === sk.gameId), `skillNames 缺少職業技能 ${sk.nameEn}`);
});

console.log('【武器傷害：只有雙手欄位的武器】');
t('所有有傷害的武器底材都算得出武器傷害（含只有雙手欄位的 119 種：弓、弩、長柄、矛、大斧、錘、法杖）', () => {
  const miss = []; let n = 0; let only2h = 0;
  for (const b of gameData.bases.filter((x) => x.kind === 'weapon' && (x.maxDam !== undefined || x.maxDam2h !== undefined))) {
    n++; if (b.maxDam === undefined) only2h++;
    const r = bare('Barbarian', 90, none, [{ slot: 'weapon', baseCode: b.code, mods: [] }]);
    if (!r.weaponDamage || !(r.weaponDamage.max > 0)) miss.push(b.nameEn);
  }
  assert.deepEqual(miss, []); assert.ok(n >= 250 && only2h >= 100, `武器 ${n} 種，其中只有雙手欄位 ${only2h} 種`);
});
t('槍斧（只有雙手欄位 6–21）：傷害＝雙手值 ×（1＋力量加成%）', () => {
  const v = gameData.bases.find((b) => b.nameEn === 'Voulge');
  const r = bare('Barbarian', 90, none, [{ slot: 'weapon', baseCode: v.code, mods: [] }]);
  const pct = (v.strBonus * r.attributes.str + (v.dexBonus ?? 0) * r.attributes.dex) / 100;
  assert.equal(r.weaponDamage.min, Math.floor(v.minDam2h * (1 + pct / 100))); assert.equal(r.weaponDamage.max, Math.floor(v.maxDam2h * (1 + pct / 100)));
});

console.log('【傭兵（hireling.txt）】');
{
  const { HIRELINGS, hirelingById, mercBaseAt, mercBaseFromRow, computeMercenary, clampMercLevel, hirelingMinLevel, getCatalog, withBase, eligibleBases, toEquipped, buffCandidates, applyBuffs, skillByName, skillLevelsFrom, auraEffects } = E;
  const gd = E.gameData; const zero = { all: 0, byClass: 0, byTab: {}, single: {} };
  const merc = (id, level, items = []) => computeMercenary(gd, { hireling: hirelingById(id), level, items });
  t('資料：36 組傭兵（第一幕 6、第二幕 15、第三幕 9、第五幕 6），每組至少一個等級檢查點，Id 都查得到', () => {
    assert.equal(HIRELINGS.length, 36);
    const byAct = {}; for (const h of HIRELINGS) byAct[h.act] = (byAct[h.act] ?? 0) + 1;
    assert.deepEqual(byAct, { 1: 6, 2: 15, 3: 9, 5: 6 });
    for (const h of HIRELINGS) { assert.ok(h.rows.length >= 1); for (const id of h.ids) assert.equal(hirelingById(id), h); }
    assert.deepEqual(hirelingById(25), hirelingById(24)); // 兩個完全相同的雙手劍野蠻人合併成一組
  });
  t('每級成長的單位由相鄰檢查點驗證：生命、命中、力量、敏捷、傷害從前一個檢查點外推，正好等於下一個檢查點', () => {
    let n = 0;
    for (const h of HIRELINGS) for (let i = 0; i + 1 < h.rows.length; i++) {
      const a = h.rows[i]; const b = h.rows[i + 1]; const x = mercBaseFromRow(a, b.level); n++;
      const where = `${h.subType} ${a.level}→${b.level}`;
      assert.equal(x.life, b.hp, `生命 ${where}`); assert.equal(x.ar, b.ar, `命中 ${where}`);
      assert.equal(x.str, b.str, `力量 ${where}`); assert.equal(x.dex, b.dex, `敏捷 ${where}`);
      assert.equal(x.damage.min, b.dmgMin, `最小傷害 ${where}`); assert.equal(x.damage.max, b.dmgMax, `最大傷害 ${where}`);
      // 防禦與抗性在檢查點之間有幾點不連續（資料表本身如此），只要求落在合理範圍內
      assert.ok(Math.abs(x.defense - b.def) / b.def < 0.1, `防禦 ${where}：${x.defense} vs ${b.def}`);
      for (const k of ['fire', 'cold', 'lightning', 'poison']) assert.ok(Math.abs(x.resist[k] - b.res[k][0]) <= 2, `抗性 ${k} ${where}`);
    }
    assert.ok(n >= 30, `比對了 ${n} 組相鄰檢查點`);
  });
  t('傭兵等級不能低於該難度的第一個檢查點；超過檢查點用每級成長外推', () => {
    const h = hirelingById(13); // 第二幕 地獄 反抗（檢查點只有 75）
    assert.equal(hirelingMinLevel(h), 75); assert.equal(clampMercLevel(h, 1), 75); assert.equal(clampMercLevel(h, 500), 99);
    const b75 = mercBaseAt(h, 75); const b85 = mercBaseAt(h, 85);
    assert.equal(b85.life, b75.life + 10 * h.rows[0].hpLvl); assert.equal(b85.rowLevel, 75);
    assert.deepEqual(mercBaseAt(h, 3), b75);
  });
  t('地獄 第二幕 反抗傭兵 75 級：原生光環是反抗，等級來自資料表', () => {
    const r = merc(13, 75); const expect = hirelingById(13).rows[0].skills.find((x) => x.nameEn === 'Defiance').level;
    const a = r.auras.find((x) => x.skill.nameEn === 'Defiance'); assert.ok(a && a.source === 'native' && a.level === expect, JSON.stringify(a && a.level));
    assert.ok(!r.auras.some((x) => x.skill.nameEn === 'Jab'));
  });
  t('裝備數值：+生命、+抗性、+防禦%、強化傷害都依公式計入；沒有裝備時等於基礎值', () => {
    const none = merc(35, 80); assert.equal(none.life, none.base.life); assert.equal(none.defense, none.base.defense);
    const helm = gd.bases.find((b) => b.nameEn === 'Shako' || b.nameEn === 'Cap');
    const item = { slot: 'head', baseCode: helm.code, mods: [{ code: 'hp', min: 50, max: 50 }, { code: 'res-all', min: 20, max: 20 }, { code: 'str', min: 10, max: 10 }] };
    const r = merc(35, 80, [item]);
    assert.equal(r.life, none.life + 50); assert.equal(r.rawResist.fire, none.rawResist.fire + 20); assert.equal(r.rawResist.poison, none.rawResist.poison + 20);
    assert.equal(r.str, none.str + 10);
    const own = E.itemOwnStats(gd, item, 80, { str: r.str, dex: r.dex });
    assert.equal(r.defense, none.defense + own.defense, '防禦＝基礎＋該件自身防禦（和玩家共用公式）');
  });
  t('抗性上限 75（加上最大抗性）；生命% 作用在（基礎＋固定加成）上', () => {
    const none = merc(35, 80);
    const cap = merc(35, 80, [{ slot: 'head', baseCode: 'cap', mods: [{ code: 'res-all', min: 200, max: 200 }] }]);
    assert.equal(cap.resist.fire, 75); assert.ok(cap.rawResist.fire > 75);
    const pct = merc(35, 80, [{ slot: 'body', baseCode: 'qui', mods: [{ code: 'hp', min: 100, max: 100 }, { code: 'hp%', min: 10, max: 10 }] }]);
    assert.equal(pct.life, Math.floor((none.base.life + 100) * 1.1));
  });
  t('武器傷害：用傭兵的力量與敏捷，無裝備武器時沒有；傭兵本身傷害另列', () => {
    const w = gd.bases.find((b) => b.nameEn === 'Voulge');
    const r = merc(35, 80, [{ slot: 'weapon', baseCode: w.code, mods: [{ code: 'dmg%', min: 100, max: 100 }] }]);
    assert.ok(r.weaponDamage && r.weaponDamage.min > 0 && r.weaponDamage.max >= r.weaponDamage.min);
    const statPct = ((w.strBonus ?? 0) * r.str + (w.dexBonus ?? 0) * r.dex) / 100;
    const maxBase = w.twoHanded && w.minDam2h !== undefined ? w.maxDam2h : w.maxDam; // 長柄武器的傷害在 maxDam；單手也能雙手持的才有 2h 欄位
    assert.equal(r.weaponDamage.max, Math.floor(maxBase * (1 + (100 + statPct) / 100)));
    assert.equal(merc(35, 80).weaponDamage, undefined); assert.ok(r.base.damage.max > 0);
  });
  t('無限（符文之語）裝在長柄武器上：傭兵得到信念光環 12 級；原生的力量光環也在', () => {
    const inf = getCatalog().find((e) => e.kind === 'runeword' && e.nameEn === 'Infinity');
    const base = eligibleBases(inf).find((b) => b.ancestors.includes('pole'));
    const item = toEquipped(withBase(inf, base.code), 'weapon', { roll: 1 });
    const r = merc(35, 85, [item]);
    const conv = r.auras.find((a) => a.skill.nameEn === 'Conviction'); assert.ok(conv && conv.source === 'item' && conv.level === 12, JSON.stringify(conv && conv.level));
    assert.ok(r.auras.some((a) => a.skill.nameEn === 'Might' && a.source === 'native'));
  });
  t('傭兵光環成為玩家的增益：恆啟用、獨立一列；同種光環取最高等級不疊加（信念降低敵人抗性取最大）', () => {
    const conv = skillByName('Conviction'); const might = skillByName('Might');
    const hard = { conviction: 20 };
    const cands = buffCandidates('pal', hard, zero, {}, [{ skill: conv, level: 12 }, { skill: might, level: 15 }]);
    const mc = cands.find((c) => c.rowId === 'merc:conviction'); const own = cands.find((c) => c.rowId === 'conviction');
    assert.ok(mc && mc.alwaysOn && mc.source === 'mercenary' && own && !own.alwaysOn, JSON.stringify(cands.map((c) => c.rowId)));
    const lv = skillLevelsFrom(hard, zero);
    const only = applyBuffs([mc], lv); const both = applyBuffs([mc, { ...own, alwaysOn: true }], lv); const mightOnly = applyBuffs([cands.find((c) => c.rowId === 'merc:might')], lv);
    assert.ok(both.enemyResReduction.fire > only.enemyResReduction.fire, '自己 20 級比傭兵 12 級高，取高者');
    const ownOnly = applyBuffs([{ ...own, alwaysOn: true }], lv);
    assert.deepEqual(both.enemyResReduction, ownOnly.enemyResReduction);
    assert.ok(mightOnly.self.some((e) => e.stat === 'item_maxdamage_percent'), '力量光環的傷害加成進入玩家數值');
  });
  t('存檔：傭兵狀態可存可還原；舊存檔沒有傭兵欄位照常載入；傭兵穿不合法的格子會被拒絕', () => {
    const ent = getCatalog().find((e) => e.kind === 'unique' && e.slot === 'head' && !e.classCode);
    const snap = { classCode: 'pal', level: 90, difficulty: 'hell', quests: { lifePotions: 3, anya: 3, lamEsen: 3, skillPts: 3 }, alloc: { str: 0, dex: 0, vit: 0, ene: 0 }, equipped: {}, charms: [], swap: 'I', skillPoints: {}, activeSkillId: '', buffsOn: {}, targetRes: 0, rollMax: true, merc: { on: true, id: 13, level: 80, equipped: { head: { entry: ent } } } };
    const text = E.exportProfile(E.newProfile('傭兵測試', snap));
    const back = E.parseProfile(text); assert.equal(typeof back, 'object', String(back));
    const re = E.fromSavedData(back.data); assert.deepEqual(re.errors, []);
    assert.ok(re.snap.merc.on && re.snap.merc.id === 13 && re.snap.merc.level === 80 && re.snap.merc.equipped.head.entry.id === ent.id);
    const { merc: _m, ...old } = snap; const oldText = E.exportProfile(E.newProfile('舊存檔', old));
    const oldBack = E.parseProfile(oldText); assert.equal(typeof oldBack, 'object'); assert.equal(E.fromSavedData(oldBack.data).snap.merc, undefined);
    const bad = JSON.parse(text); bad.data.merc.equipped = { ring1: bad.data.merc.equipped.head };
    assert.match(String(E.parseProfile(JSON.stringify(bad))), /傭兵不能穿戴/);
  });
}

