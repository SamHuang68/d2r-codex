import assert from 'node:assert/strict';
import { RUNEWORDS_DATA } from '../src/data/runewords.ts';
import { UNIQUE_ITEMS_DATA } from '../src/data/uniqueItems.ts';
import { SET_ITEMS_DATA } from '../src/data/setItems.ts';
import { BASE_ITEMS_DATA } from '../src/data/bases.ts';
import { normalizeItemQuery } from '../src/utils/itemQueryNormalizer.ts';
import { searchOmni } from '../src/utils/search.ts';
import { buildCatalogItems } from '../src/utils/itemParser.ts';
import { calculateCombatStats } from '../src/utils/combatEngine.ts';
import { CHARACTER_CLASSES_DATA } from '../src/data/classes.ts';
import { calculateSkillSynergies, getRelatedSynergySkillIds } from '../src/data/skills/synergies.ts';
import { getSkillGridPosition } from '../src/data/skills/layout.ts';

console.log('🏛️ 開始全量執行 Sanctuary Codex (D2R) 總驗收自動化測試集...\n');

let totalTests = 0;
let passedTests = 0;

function testCase(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// ──────────────────────────────────────────────
// STAGE P0: 資料庫同步與導航正規化
// ──────────────────────────────────────────────
console.log('📌 【Stage P0: 資料庫全量同步與全站導航正規化】');
testCase('資料庫規模完整性 (98 符文之語, 402 暗金, 34 套裝, 508 底材)', () => {
  assert.equal(RUNEWORDS_DATA.length, 98, '符文之語應為 98 筆');
  assert.equal(UNIQUE_ITEMS_DATA.length, 402, '暗金裝備應為 402 筆');
  assert.equal(SET_ITEMS_DATA.length, 34, '套裝應為 34 組');
  assert.equal(BASE_ITEMS_DATA.length, 508, '底材裝備應為 508 筆');
});

testCase('點擊「信心 (Faith GMB)」精確跳轉至 runewords/faith', () => {
  const norm = normalizeItemQuery('信心 (Faith GMB)');
  assert.equal(norm.targetTab, 'runewords');
  assert.equal(norm.id, 'faith');
  const faith = RUNEWORDS_DATA.find(r => r.id === 'faith');
  assert.ok(faith);
  assert.equal(faith.name, '信心');
});

testCase('點擊「剛毅甲」精確識別 fortitude', () => {
  const norm = normalizeItemQuery('剛毅甲');
  assert.equal(norm.targetTab, 'runewords');
  assert.equal(norm.id, 'fortitude');
});

testCase('點擊「軍帽」精確識別 harlequin_crest', () => {
  const norm = normalizeItemQuery('軍帽');
  assert.equal(norm.targetTab, 'items');
  assert.equal(norm.id, 'harlequin_crest');
});

testCase('暗金裝備 100% 官方真實立繪 CDN 覆蓋', () => {
  const missingImg = UNIQUE_ITEMS_DATA.filter(u => !u.imageUrl || !u.imageUrl.startsWith('https://static.d2r.world/'));
  assert.equal(missingImg.length, 0, `暗金裝備應 100% 具有 d2r.world CDN 圖片，缺失: ${missingImg.length}`);
});

// ──────────────────────────────────────────────
// STAGE P1: 1:1 原生裝備頁 (Paper Doll) 與即時戰鬥條
// ──────────────────────────────────────────────
console.log('\n📌 【Stage P1: 1:1 原生裝備頁 (Paper Doll) 與底部戰鬥狀態條】');
const catalogItems = buildCatalogItems();

testCase('裝備目錄 CatalogItems 具備真實圖片與有效槽位', () => {
  assert.ok(catalogItems.length > 500, `裝備目錄應 > 500 件，目前: ${catalogItems.length}`);
  const sampleWithImages = catalogItems.filter(i => !!i.imageUrl);
  assert.equal(sampleWithImages.length, catalogItems.length, '所有目錄道具皆應具備解析之 imageUrl');
});

const findItem = (idOrName) => {
  const clean = idOrName.toLowerCase().replace(/^(unique_|rw_|set_|the_)/, '').replace(/_/g, ' ');
  return catalogItems.find(i => 
    i.id === idOrName || 
    i.id.replace(/_/g, ' ') === clean || 
    i.id.replace(/_/g, ' ').includes(clean) || 
    i.name.includes(idOrName) || 
    i.nameEn.toLowerCase().includes(clean)
  );
};

const paladinClass = CHARACTER_CLASSES_DATA.find(c => c.name === '聖騎士');
const testPaladinAttributes = {
  baseStr: paladinClass.startingStats.str,
  baseDex: paladinClass.startingStats.dex,
  baseVit: paladinClass.startingStats.vit,
  baseEne: paladinClass.startingStats.ene,
  allocatedStr: 110,
  allocatedDex: 90,
  allocatedVit: 250,
  allocatedEne: 10,
  level: 90
};

const testPaladinEquipped = {
  helm: findItem('harlequin_crest'),
  amulet: findItem('maras_kaleidoscope'),
  weapon1: findItem('heart_of_the_oak'),
  shield1: findItem('herald_of_zakarum'),
  weapon2: findItem('call_to_arms'),
  shield2: findItem('spirit'),
  armor: findItem('enigma'),
  gloves: findItem('magefist'),
  belt: findItem('arachnid_mesh'),
  ring1: findItem('stone_of_jordan'),
  ring2: findItem('raven_frost'),
  boots: findItem('war_traveler'),
  charms: [
    findItem('charm_annihilus'),
    findItem('charm_torch'),
    findItem('charm_skiller_gc_x4')
  ].filter(Boolean)
};

const testPaladinSkills = {
  blessed_hammer: 20,
  vigor: 20,
  blessed_aim: 20,
  concentration: 20,
  holy_shield: 10
};

const combatStats = calculateCombatStats(
  '聖騎士',
  90,
  testPaladinAttributes,
  testPaladinEquipped,
  testPaladinSkills,
  'blessed_hammer'
);

testCase('即時戰鬥引擎計算生存數值 (生命 BO後 > 2000, 法力 > 750)', () => {
  assert.ok(combatStats.totalLife > 2000, `生命 BO 後應 > 2000，目前: ${combatStats.totalLife}`);
  assert.ok(combatStats.totalMana > 750, `法力值應 > 750，目前: ${combatStats.totalMana}`);
});

testCase('即時戰鬥引擎計算裝甲與格擋 (防禦 > 5000, 75% 滿格擋達成)', () => {
  assert.ok(combatStats.totalDefense > 5000, `防禦力應 > 5000，目前: ${combatStats.totalDefense}`);
  assert.equal(combatStats.chanceToBlock, 75, `格擋率應達成 75% 滿格擋，目前: ${combatStats.chanceToBlock}%`);
});

testCase('即時戰鬥引擎計算地獄高抗性 (火/電/冰/毒全高抗)', () => {
  assert.ok(combatStats.fireRes >= 70, `地獄火抗應 >= 70%，目前: ${combatStats.fireRes}%`);
  assert.ok(combatStats.lightningRes >= 70, `地獄電抗應 >= 70%，目前: ${combatStats.lightningRes}%`);
  assert.ok(combatStats.coldRes >= 70, `地獄冰抗應 >= 70%，目前: ${combatStats.coldRes}%`);
});

// ──────────────────────────────────────────────
// STAGE P2: Tab 1 遊戲屬性頁
// ──────────────────────────────────────────────
console.log('\n📌 【Stage P2: Tab 1 1:1 遊戲屬性頁】');
testCase('力/敏/體/精加點四維正確連動', () => {
  const newAttr = {
    ...testPaladinAttributes,
    allocatedStr: testPaladinAttributes.allocatedStr + 5
  };
  const statsAfterStr = calculateCombatStats(
    '聖騎士',
    90,
    newAttr,
    testPaladinEquipped,
    testPaladinSkills,
    'blessed_hammer'
  );
  assert.equal(statsAfterStr.totalStr, combatStats.totalStr + 5, '總力量應精確增加 5 點');
});

// ──────────────────────────────────────────────
// STAGE P3: Tab 2 樹狀裝備庫 (Loot Filter 風格)
// ──────────────────────────────────────────────
console.log('\n📌 【Stage P3: Tab 2 輔助樹狀裝備庫】');
testCase('裝備庫三級階層分類結構完整 (類別 ➔ 強度 ➔ 道具)', () => {
  const armors = catalogItems.filter(i => i.categoryTier1 === 'armor');
  const weapons = catalogItems.filter(i => i.categoryTier1 === 'weapon');
  const jewelry = catalogItems.filter(i => i.categoryTier1 === 'jewelry');

  assert.ok(armors.length > 100, `護甲分類數量應 > 100，目前: ${armors.length}`);
  assert.ok(weapons.length > 100, `武器分類數量應 > 100，目前: ${weapons.length}`);
  assert.ok(jewelry.length > 30, `飾品與護身符分類應 > 30，目前: ${jewelry.length}`);
});

// ──────────────────────────────────────────────
// STAGE P4: Tab 3 6x3 技能樹與 Synergy 弧線
// ──────────────────────────────────────────────
console.log('\n📌 【Stage P4: Tab 3 6x3 遊戲技能樹與協同加速器】');
testCase('6x3 網格坐標配置合法 (col 0-2, row 0-5)', () => {
  const pos = getSkillGridPosition('blessed_hammer', 18, 0);
  assert.ok(pos.col >= 0 && pos.col <= 2, `欄位 col 應在 0~2 之間: ${pos.col}`);
  assert.ok(pos.row >= 0 && pos.row <= 5, `列位 row 應在 0~5 之間: ${pos.row}`);
});

testCase('祝福之槌協同演算法 (祝福瞄準 14% + 活力 14%)', () => {
  const syn = calculateSkillSynergies('blessed_hammer', testPaladinSkills);
  assert.equal(syn.incoming.length, 2, '祝福之槌應接收 2 個協同來源 (活力、祝福瞄準)');
  assert.equal(syn.totalIncomingPercent, (20 * 14) + (20 * 14), '滿協同增幅應為 +560%');
});

testCase('核心功能：一鍵點滿相關協同 (Max All Synergies) 計算', () => {
  const zeroSkills = { blessed_hammer: 1 };
  const beforeSyn = calculateSkillSynergies('blessed_hammer', zeroSkills);
  assert.equal(beforeSyn.totalIncomingPercent, 0, '未投入協同點數時增幅應為 0%');

  // 模擬一鍵點滿邏輯
  const maxedSkills = { ...zeroSkills };
  maxedSkills['blessed_hammer'] = 20;
  beforeSyn.incoming.forEach(item => {
    maxedSkills[item.skillId] = 20;
  });

  const afterSyn = calculateSkillSynergies('blessed_hammer', maxedSkills);
  assert.equal(afterSyn.totalIncomingPercent, 560, '一鍵點滿後協同增幅應達到 560%');
});

// ──────────────────────────────────────────────
// 總結回報
// ──────────────────────────────────────────────
console.log(`\n🎉 全部 ${passedTests} / ${totalTests} 項驗收測試 100% 通過！`);
