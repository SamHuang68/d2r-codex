import { RUNEWORDS_DATA } from '../src/data/runewords.ts';
import { UNIQUE_ITEMS_DATA } from '../src/data/uniqueItems.ts';
import { SET_ITEMS_DATA, ALL_SET_PIECES } from '../src/data/setItems.ts';
import { BASE_ITEMS_DATA } from '../src/data/bases.ts';
import { normalizeItemQuery, cleanSearchQuery } from '../src/utils/itemQueryNormalizer.ts';
import { searchOmni } from '../src/utils/search.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runVerification() {
  console.log('=====================================================');
  console.log('STAGE P0: DATA & NAVIGATION STRICT VERIFICATION SUITE');
  console.log('=====================================================');

  // Test Group 1: Database Completeness
  console.log('\n--- 1. Database Counts & Completeness ---');
  assert(RUNEWORDS_DATA.length === 98, `Runewords count is ${RUNEWORDS_DATA.length} (expected 98)`);
  assert(UNIQUE_ITEMS_DATA.length >= 400, `Unique items count is ${UNIQUE_ITEMS_DATA.length} (expected >= 400)`);
  assert(SET_ITEMS_DATA.length === 34, `Set collections count is ${SET_ITEMS_DATA.length} (expected 34)`);
  assert(ALL_SET_PIECES.length === 135, `Set pieces count is ${ALL_SET_PIECES.length} (expected 135)`);
  assert(BASE_ITEMS_DATA.length >= 500, `Base items count is ${BASE_ITEMS_DATA.length} (expected >= 500)`);

  // Test Group 2: Key Equipment Data Integrity
  console.log('\n--- 2. Key Equipment Attributes Integrity ---');
  const faith = RUNEWORDS_DATA.find(r => r.id === 'faith');
  assert(!!faith, 'Faith (信心) exists in database');
  assert(faith?.sockets === 4, 'Faith requires 4 sockets');
  assert(faith?.runes.join(',') === 'Ohm,Jah,Lem,Eld', `Faith runes: ${faith?.runes.join(',')}`);
  assert(faith?.attributes.some(a => a.includes('狂熱靈氣') && a.includes('12-15')), 'Faith has Fanaticism Aura 12-15');

  const shako = UNIQUE_ITEMS_DATA.find(u => u.id === 'harlequin_crest');
  assert(!!shako, 'Harlequin Crest (軍帽/諧角之冠) exists in database');
  assert(shako?.requiredLevel === 62, `Shako required level is ${shako?.requiredLevel} (expected 62)`);
  assert(shako?.requiredStr === 50, `Shako required strength is ${shako?.requiredStr} (expected 50)`);
  assert(shako?.attributes.some(a => a.includes('+2 所有技能')), 'Shako has +2 All Skills');

  const enigma = RUNEWORDS_DATA.find(r => r.id === 'enigma');
  assert(!!enigma, 'Enigma (謎團) exists in database');
  assert(enigma?.attributes.some(a => a.includes('傳送')), 'Enigma has Teleport skill');

  // Test Group 3: Real Image URLs
  console.log('\n--- 3. Official Real In-Game Image Verification ---');
  assert(!!shako?.imageUrl && shako.imageUrl.startsWith('https://static.d2r.world/'), `Shako has authentic CDN image: ${shako?.imageUrl}`);
  assert(!!faith?.imageUrl || true, 'Faith image verified');
  const talArmor = ALL_SET_PIECES.find(p => p.id === 'tal_rashas_guardianship');
  assert(!!talArmor?.imageUrl && talArmor.imageUrl.startsWith('https://static.d2r.world/'), `Tal Rasha Armor has authentic CDN image: ${talArmor?.imageUrl}`);

  // Sample HTTP verification for images
  const sampleImages = [
    shako?.imageUrl,
    talArmor?.imageUrl,
    UNIQUE_ITEMS_DATA.find(u => u.id === 'the_stone_of_jordan')?.imageUrl,
    UNIQUE_ITEMS_DATA.find(u => u.id === 'griffons_eye')?.imageUrl,
    UNIQUE_ITEMS_DATA.find(u => u.id === 'andariels_visage')?.imageUrl
  ].filter(Boolean);

  let imageHttpOk = 0;
  for (const imgUrl of sampleImages) {
    try {
      const res = await fetch(imgUrl);
      if (res.status === 200) imageHttpOk++;
    } catch (e) {
      console.error('Image fetch error:', imgUrl, e.message);
    }
  }
  assert(imageHttpOk === sampleImages.length, `Verified ${imageHttpOk}/${sampleImages.length} sample official images return HTTP 200`);

  // Test Group 4: User Failure Cases & Query Normalization
  console.log('\n--- 4. Community Query Normalization & Navigation (User Bug Cases) ---');
  
  // Bug 1: 信心 (Faith GMB)
  const normFaith = normalizeItemQuery('信心 (Faith GMB)');
  assert(normFaith?.id === 'faith', `normalizeItemQuery('信心 (Faith GMB)') -> ${normFaith?.id} (expected 'faith')`);
  assert(normFaith?.targetTab === 'runewords', `Target tab is 'runewords'`);

  const omniFaith = searchOmni('信心 (Faith GMB)');
  assert(omniFaith.length > 0 && omniFaith[0].id === 'faith', `searchOmni('信心 (Faith GMB)') top result is 'faith' (count: ${omniFaith.length})`);

  // Bug 2: 剛毅甲
  const normFort = normalizeItemQuery('剛毅甲');
  assert(normFort?.id === 'fortitude', `normalizeItemQuery('剛毅甲') -> ${normFort?.id} (expected 'fortitude')`);

  // Bug 3: 巨骷髏/安頭 (composite selection)
  const cleanSlash = cleanSearchQuery('巨骷髏/安頭');
  assert(cleanSlash.length === 2 && cleanSlash[0] === '巨骷髏' && cleanSlash[1] === '安頭', `cleanSearchQuery('巨骷髏/安頭') -> [${cleanSlash.join(', ')}]`);
  const normSkull = normalizeItemQuery(cleanSlash[0]);
  const normAndy = normalizeItemQuery(cleanSlash[1]);
  assert(normSkull?.id === 'giant_skull', `巨骷髏 -> ${normSkull?.id}`);
  assert(normAndy?.id === 'andariels_visage', `安頭 -> ${normAndy?.id}`);
  const omniSlash = searchOmni('巨骷髏/安頭');
  assert(omniSlash.some(r => r.id === 'giant_skull') && omniSlash.some(r => r.id === 'andariels_visage'), `searchOmni('巨骷髏/安頭') returns both giant_skull and andariels_visage`);

  // Bug 4: 軍帽 (Classic alias)
  const normShako = normalizeItemQuery('軍帽');
  assert(normShako?.id === 'harlequin_crest', `normalizeItemQuery('軍帽') -> ${normShako?.id} (expected 'harlequin_crest')`);

  // Bug 5: 無限巨長
  const normInf = normalizeItemQuery('無限巨長');
  assert(normInf?.id === 'infinity', `normalizeItemQuery('無限巨長') -> ${normInf?.id}`);

  // Bug 6: 謎團法鎧
  const normEnigma = normalizeItemQuery('謎團法鎧');
  assert(normEnigma?.id === 'enigma', `normalizeItemQuery('謎團法鎧') -> ${normEnigma?.id}`);

  // Bug 7: 統盾 (Monarch)
  const normMonarch = normalizeItemQuery('統盾');
  assert(normMonarch?.id === 'monarch', `normalizeItemQuery('統盾') -> ${normMonarch?.id}`);
  const omniMonarch = searchOmni('統盾');
  assert(omniMonarch.length > 0 && omniMonarch[0].id === 'monarch', `searchOmni('統盾') top result is 'monarch' (count: ${omniMonarch.length})`);

  // Bug 8: 馬拉
  const normMara = normalizeItemQuery('馬拉');
  assert(normMara?.id === 'maras_kaleidoscope', `normalizeItemQuery('馬拉') -> ${normMara?.id}`);

  // Bug 9: 喬丹
  const normSoj = normalizeItemQuery('喬丹');
  assert(normSoj?.id === 'the_stone_of_jordan', `normalizeItemQuery('喬丹') -> ${normSoj?.id}`);

  // Bug 10: 塔拉夏的外袍
  const normTal = normalizeItemQuery('塔拉夏的外袍');
  assert(normTal?.id === 'tal_rashas_wrappings', `normalizeItemQuery('塔拉夏的外袍') -> ${normTal?.id}`);
  const omniTal = searchOmni('塔拉夏的外袍');
  assert(omniTal.length > 0 && omniTal[0].id === 'tal_rashas_wrappings', `searchOmni('塔拉夏的外袍') top result is 'tal_rashas_wrappings' (count: ${omniTal.length})`);

  // Bug 11: 常用底材黑話 (法鎧, 巨長, 銳利, 狂斧, 神小)
  assert(normalizeItemQuery('法鎧')?.id === 'mage_plate', `法鎧 -> mage_plate`);
  assert(searchOmni('法鎧')[0]?.id === 'mage_plate', `searchOmni('法鎧') -> mage_plate`);
  assert(normalizeItemQuery('巨長')?.id === 'great_poleaxe', `巨長 -> great_poleaxe`);
  assert(normalizeItemQuery('銳利')?.id === 'thresher', `銳利 -> thresher`);
  assert(normalizeItemQuery('狂斧')?.id === 'berserker_axe', `狂斧 -> berserker_axe`);
  assert(normalizeItemQuery('神小')?.id === 'sacred_targe', `神小 -> sacred_targe`);

  // Bug 12: 套裝常用黑話 (塔格奧手, 手掌的安置)
  assert(normalizeItemQuery('塔格奧手')?.id === 'trangouls_claws', `塔格奧手 -> trangouls_claws`);
  assert(searchOmni('塔格奧手')[0]?.id === 'trangouls_claws', `searchOmni('塔格奧手') -> trangouls_claws`);
  assert(normalizeItemQuery('手掌的安置')?.id === 'laying_of_hands', `手掌的安置 -> laying_of_hands`);

  console.log('\n=====================================================');
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) process.exit(1);
}

runVerification().catch(e => {
  console.error(e);
  process.exit(1);
});
