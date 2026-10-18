import assert from 'node:assert/strict';
import { calculateCombatStats } from '../src/utils/combatEngine.ts';
import { buildCatalogItems } from '../src/utils/itemParser.ts';
import { CHARACTER_CLASSES_DATA } from '../src/data/classes.ts';

console.log('🛡️ 開始驗證 Stage P1: 1:1 原生裝備頁 (Paper Doll) 與底部戰鬥狀態條連動...\n');

// 1. 驗證 CatalogItems 具備真實圖片與 slot
const items = buildCatalogItems();
assert.ok(items.length > 500, `目錄物品數量應超過 500 件，目前: ${items.length}`);

const faith = items.find(i => i.id === 'rw_faith');
assert.ok(faith, '應存在信心 (Faith) 符文之語');
assert.equal(faith.itemType, 'runeword');
assert.ok(faith.imageUrl, '信心應有官方立繪 URL');

const shako = items.find(i => i.name.includes('軍帽') || i.name.includes('諧角') || i.nameEn.toLowerCase().includes('harlequin'));
assert.ok(shako, '應存在軍帽 (Harlequin Crest)');
console.log('找到軍帽:', shako.id, shako.name, shako.imageUrl);
console.log('shako raw attributes:', shako.attributes);
assert.equal(shako.slot, 'helm');
assert.ok(shako.imageUrl, '軍帽應有官方立繪 URL');

const findItem = (idOrName) => {
  const clean = idOrName.toLowerCase().replace(/^(unique_|rw_|set_|the_)/, '').replace(/_/g, ' ');
  return items.find(i => 
    i.id === idOrName || 
    i.id.replace(/_/g, ' ') === clean || 
    i.id.replace(/_/g, ' ').includes(clean) || 
    i.name.includes(idOrName) || 
    i.nameEn.toLowerCase().includes(clean)
  );
};

const hoz = findItem('herald_of_zakarum');
assert.ok(hoz, '應存在飾金盾 (Herald of Zakarum)');
assert.equal(hoz.slot, 'shield');

console.log('✅ CatalogItem 官方真實圖片與裝備槽位對齊檢驗通過');

// 2. 驗證戰鬥數值引擎 (生命 BO 後、法力、防禦、滿格擋、地獄抗性)
const paladinClass = CHARACTER_CLASSES_DATA.find(c => c.name === '聖騎士');
assert.ok(paladinClass, '應有聖騎士職業');

const defaultAttributes = {
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

const equipped = {
  helm: shako,
  amulet: findItem("mara's_kaleidoscope") || findItem("maras_kaleidoscope"),
  shield1: hoz,
  weapon1: findItem('heart_of_the_oak'),
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

const skillPoints = {
  blessed_hammer: 20,
  vigor: 20,
  blessed_aim: 20,
  concentration: 20,
  holy_shield: 10
};

const combatStats = calculateCombatStats(
  '聖騎士',
  90,
  defaultAttributes,
  equipped,
  skillPoints,
  'blessed_hammer'
);

console.log('hoz stats:', hoz.stats);
console.log('hoz raw attributes:', hoz.attributes);
console.log('armor stats:', equipped.armor?.name, equipped.armor?.stats);

assert.ok(combatStats.totalLife > 2000, `戰吼(BO)後生命值應 > 2000，目前: ${combatStats.totalLife}`);
assert.ok(combatStats.totalMana > 500, `總法力值應 > 500，目前: ${combatStats.totalMana}`);
assert.ok(combatStats.totalDefense > 5000, `總防禦力應 > 5000，目前: ${combatStats.totalDefense}`);
assert.ok(combatStats.chanceToBlock >= 75, `滿敏+飾金盾格擋率應達成 75% 滿格擋，目前: ${combatStats.chanceToBlock}%`);
assert.ok(combatStats.fireRes >= 70, `地獄火抗應達高抗標準 (>= 70%)，目前: ${combatStats.fireRes}%`);
assert.ok(combatStats.lightningRes >= 70, `地獄電抗應達高抗標準 (>= 70%)，目前: ${combatStats.lightningRes}%`);
assert.ok(combatStats.activeSkillDamageMin > 8000, `祝福之槌最小傷害應 > 8000，目前: ${combatStats.activeSkillDamageMin}`);
assert.ok(combatStats.activeSkillDamageMax > 8000, `祝福之槌最大傷害應 > 8000，目前: ${combatStats.activeSkillDamageMax}`);

console.log('✅ 戰鬥數值引擎即時連動計算檢驗通過 (BO後生命、法力、傷害、防禦、滿格擋、抗性 100% 正常)');
console.log('\n🎉 Stage P1 驗證全數通過！');
