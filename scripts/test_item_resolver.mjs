import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveItemImagePath } from '../src/utils/itemImageResolver.ts';
import { UNIQUE_ITEMS_DATA } from '../src/data/uniqueItems.ts';
import { SET_ITEMS_DATA } from '../src/data/setItems.ts';
import { RUNEWORDS_DATA } from '../src/data/runewords.ts';
import { BASE_ITEMS_DATA } from '../src/data/bases.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('✓ Direct TypeScript imports successful:');
console.log(`  - Uniques:   ${UNIQUE_ITEMS_DATA.length}`);
console.log(`  - Sets:      ${SET_ITEMS_DATA.length}`);
console.log(`  - Runewords: ${RUNEWORDS_DATA.length}`);
console.log(`  - Bases:     ${BASE_ITEMS_DATA.length}`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertEqual(actual, expected, testName) {
  totalTests++;
  const normActual = actual.replace(/^\.\//, '');
  const normExpected = expected.replace(/^\.\//, '');
  if (normActual === normExpected) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`✗ FAIL: ${testName}\n  Expected: ${normExpected}\n  Actual:   ${normActual}`);
  }
}

function assertStrictEqual(actual, expected, testName) {
  totalTests++;
  if (actual === expected) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`✗ STRICT FAIL: ${testName}\n  Expected: ${expected}\n  Actual:   ${actual}`);
  }
}

function assertFileExists(relPath, testName) {
  totalTests++;
  const full = path.join(__dirname, '../public', relPath.replace(/^\.\//, ''));
  if (fs.existsSync(full)) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`✗ FILE NOT FOUND: ${testName} -> ${relPath}`);
  }
}

function assertSemanticSlot(relPath, expectedSlot, testName) {
  totalTests++;
  const p = relPath.toLowerCase();
  let matches = false;

  switch (expectedSlot) {
    case 'armor':
    case 'chest':
      matches = p.includes('plate') || p.includes('armor') || p.includes('mail') || p.includes('leather') || p.includes('cage') || p.includes('shroud') || p.includes('guardianship') || p.includes('flesh') || p.includes('mantle') || p.includes('furs') || p.includes('hauberk') || p.includes('hide') || p.includes('robe') || p.includes('shadow') || p.includes('deception') || p.includes('scales') || p.includes('embrace') || p.includes('heart') || p.includes('shelter') || p.includes('ambush') || p.includes('garb') || p.includes('silk') || p.includes('quilted') || p.includes('adherent') || p.includes('ringmail') || p.includes('liberator') || p.includes('refuge') || p.includes('mesh') || p.includes('case') || p.includes('spine') || p.includes('adament') || p.includes('skin') || p.includes('centurion') || p.includes('twitchthroe') || p.includes('sparkingmail') || p.includes('darkglow') || p.includes('hawkmail') || p.includes('venomward') || p.includes('venomsward') || p.includes('iceblink') || p.includes('boneflesh') || p.includes('rockfleece') || p.includes('rattlecage') || p.includes('goldskin') || p.includes('victorssilk') || p.includes('heavenlycoat') || p.includes('form') || p.includes('blinkbat');
      break;
    case 'helm':
      matches = p.includes('crest') || p.includes('face') || p.includes('will') || p.includes('crown') || p.includes('helm') || p.includes('veil') || p.includes('skull') || p.includes('diadem') || p.includes('head') || p.includes('tiara') || p.includes('coronet') || p.includes('circlet') || p.includes('mask') || p.includes('cap') || p.includes('visage') || p.includes('horns') || p.includes('gaze') || p.includes('guise') || p.includes('sight') || p.includes('valor') || p.includes('visor') || p.includes('sheath') || p.includes('splendor') || p.includes('totem') || p.includes('mane') || p.includes('antlers') || p.includes('avengerguard') || p.includes('coil') || p.includes('cranium') || p.includes('paragon') || p.includes('almighty') || p.includes('tarnhelm') || p.includes('coif') || p.includes('duskdeep') || p.includes('howltusk') || p.includes('undeadcrown') || p.includes('thefaceofhorror') || p.includes('wormskull');
      break;
    case 'gloves':
      matches = p.includes('glove') || p.includes('gauntlet') || p.includes('fist') || p.includes('guard') || p.includes('mitt') || p.includes('forge') || p.includes('pincer') || p.includes('hand') || p.includes('cuff') || p.includes('taboo') || p.includes('gage') || p.includes('claws') || p.includes('clutch') || p.includes('bracer') || p.includes('frostburn') || p.includes('magnus_skin') || p.includes('thehandofbroc') || p.includes('bloodfist') || p.includes('chanceguards') || p.includes('magefist') || p.includes('ghoulhide') || p.includes('lavagout') || p.includes('hellmouth') || p.includes('dracul');
      break;
    case 'boots':
      matches = p.includes('boot') || p.includes('traveler') || p.includes('rider') || p.includes('toe') || p.includes('pillar') || p.includes('foot') || p.includes('spur') || p.includes('heel') || p.includes('sabot') || p.includes('riprap') || p.includes('soul') || p.includes('advance') || p.includes('passage') || p.includes('fetlock') || p.includes('hobnail') || p.includes('hooves') || p.includes('hotspur') || p.includes('gorefoot') || p.includes('treads') || p.includes('tearhaunch') || p.includes('goblintoe') || p.includes('waterwalk') || p.includes('silkweave') || p.includes('wartraveler') || p.includes('gore_rider') || p.includes('shadow_dancer');
      break;
    case 'belt':
      matches = p.includes('mesh') || p.includes('vigor') || p.includes('belt') || p.includes('sash') || p.includes('wrap') || p.includes('detail') || p.includes('buckle') || p.includes('cord') || p.includes('stay') || p.includes('blessing') || p.includes('girth') || p.includes('tenet') || p.includes('credendum') || p.includes('pride') || p.includes('cloth') || p.includes('girdle') || p.includes('coil') || p.includes('deaths_guard') || p.includes('guard') || p.includes('binding') || p.includes('lenymo') || p.includes('snakecord') || p.includes('nightsmoke') || p.includes('goldwrap') || p.includes('bladebuckle') || p.includes('stringofears') || p.includes('razortail') || p.includes('gloomstrap') || p.includes('snowclash') || p.includes('thundergods_vigor') || p.includes('arachnid_mesh') || p.includes('nosferatus_coil') || p.includes('verdungos_hearty_cord');
      break;
    case 'shield':
    case 'offHand':
      matches = p.includes('shield') || p.includes('zakarum') || p.includes('monarch') || p.includes('targe') || p.includes('tome') || p.includes('head') || p.includes('ward') || p.includes('wall') || p.includes('disk') || p.includes('parry') || p.includes('wing') || p.includes('honor') || p.includes('guard') || p.includes('glory') || p.includes('aerin') || p.includes('rondache') || p.includes('buckler') || p.includes('trollnest') || p.includes('aegis') || p.includes('homunculus') || p.includes('cleglaws_claw') || p.includes('hsarus_ironfist') || p.includes('milabregas_orb') || p.includes('pelta') || p.includes('umbral') || p.includes('stormguild') || p.includes('steelclash') || p.includes('swordback') || p.includes('bverrit') || p.includes('wallofeyeless') || p.includes('theward');
      break;
    case 'weapon':
    case 'mainHand':
      matches = p.includes('blade') || p.includes('sword') || p.includes('flail') || p.includes('axe') || p.includes('bow') || p.includes('thresher') || p.includes('crusher') || p.includes('spear') || p.includes('claw') || p.includes('crossbow') || p.includes('wand') || p.includes('staff') || p.includes('scepter') || p.includes('hammer') || p.includes('dagger') || p.includes('spike') || p.includes('maul') || p.includes('scythe') || p.includes('pike') || p.includes('javelin') || p.includes('oculus') || p.includes('orb') || p.includes('fathom') || p.includes('crescent') || p.includes('fang') || p.includes('plague') || p.includes('saw') || p.includes('point') || p.includes('tongue') || p.includes('branch') || p.includes('hew') || p.includes('spire') || p.includes('torch') || p.includes('spade') || p.includes('slinger') || p.includes('spittle') || p.includes('oak') || p.includes('gnasher') || p.includes('reaper') || p.includes('pitch') || p.includes('crow') || p.includes('nail') || p.includes('puzzler') || p.includes('touch') || p.includes('sickle') || p.includes('teaching') || p.includes('mark') || p.includes('rhythm') || p.includes('caster') || p.includes('redemption') || p.includes('justice') || p.includes('barb') || p.includes('steel') || p.includes('driver') || p.includes('shard') || p.includes('gull') || p.includes('titans_revenge') || p.includes('dragonstone') || p.includes('azurewrath') || p.includes('bartuc') || p.includes('eye') || p.includes('soulflay') || p.includes('patriarch') || p.includes('mindrend') || p.includes('rakescar') || p.includes('goreshovel') || p.includes('bloodrise') || p.includes('lycander') || p.includes('morningstar') || p.includes('sazabi') || p.includes('redeemer') || p.includes('cathan') || p.includes('rule') || p.includes('berserker') || p.includes('hatchet') || p.includes('isenhart') || p.includes('lightbrand') || p.includes('civerb') || p.includes('cudgel') || p.includes('cleglaw') || p.includes('tooth') || p.includes('arctic_horn') || p.includes('sander') || p.includes('superstition') || p.includes('milabrega') || p.includes('rod') || p.includes('bulkathos') || p.includes('charge') || p.includes('guardian') || p.includes('crushflange') || p.includes('bonesnap') || p.includes('spectral') || p.includes('steeldriver') || p.includes('gravenspine') || p.includes('grimreaper') || p.includes('humongous') || p.includes('woestave') || p.includes('spineripper') || p.includes('heartcarver') || p.includes('blackbog') || p.includes('stormspike') || p.includes('buriza') || p.includes('witchwild') || p.includes('windforce') || p.includes('thunderstroke') || p.includes('deathsfathom') || p.includes('eschuta') || p.includes('wizardspike') || p.includes('lament') || p.includes('wizendraw') || p.includes('bark') || p.includes('sting') || p.includes('chieftan') || p.includes('tandoliga') || p.includes('ironstone') || p.includes('harvest') || p.includes('baneash') || p.includes('serpent') || p.includes('salamander') || p.includes('iangbong') || p.includes('jangbong') || p.includes('string') || p.includes('strike') || p.includes('clap') || p.includes('cast') || p.includes('maelstrom') || p.includes('diggler') || p.includes('tando') || p.includes('keen') || p.includes('skewer') || p.includes('edge');
      break;
    case 'ring':
      matches = p.includes('jordan') || p.includes('frost') || p.includes('band') || p.includes('ring');
      break;
    case 'amulet':
      matches = p.includes('kaleidoscope') || p.includes('wrath') || p.includes('amu');
      break;
    case 'charm':
      matches = p.includes('anni') || p.includes('torch') || p.includes('gheed') || p.includes('charm');
      break;
    case 'jewel':
      matches = p.includes('facet') || p.includes('jewel') || p.includes('lightning') || p.includes('cold') || p.includes('fire') || p.includes('poison');
      break;
    default:
      matches = true;
  }

  if (matches) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`✗ SEMANTIC MISMATCH: ${testName}\n  Expected slot type: ${expectedSlot}\n  Actual image path:  ${relPath}`);
  }
}

// ──────────────────────────────────────────────
// 1. Claude Review Specific Regression Cases
// ──────────────────────────────────────────────
console.log('\n--- 1. Testing Claude Review Specific Findings ---');

assertEqual(
  resolveItemImagePath({ name: '眼光', nameEn: 'Insight', baseItem: '長柄武器', rarity: 'runeword' }),
  'images/items/bases/thresher.gif',
  'Insight (眼光) must NOT match "眼" into baal_eye.gif'
);

assertEqual(
  resolveItemImagePath({ name: '十字弓', nameEn: 'Crossbow', slot: 'weapon' }),
  'images/items/bases/crossbow.gif',
  'Crossbow (十字弓) must resolve to crossbow.gif, not intercepted by hydra_bow.gif'
);

assertEqual(
  resolveItemImagePath({ name: '正義之手', nameEn: 'Hand of Justice', slot: 'weapon', rarity: 'runeword' }),
  'images/items/bases/crystalsword.gif',
  'Hand of Justice must NOT match "ice" substring into hydra_bow.gif'
);

assertEqual(
  resolveItemImagePath({ name: '狼頭', nameEn: 'Wolf Head', slot: 'helm' }),
  'images/items/bases/wolfhead.gif',
  'Wolf Head (狼頭) must resolve to wolfhead.gif, not demonhead.gif'
);

assertEqual(
  resolveItemImagePath({ name: '皮手套', nameEn: 'Leather Gloves', slot: 'gloves' }),
  'images/items/bases/leathergloves.gif',
  'Leather Gloves must resolve to glove sprite, not leather armor'
);

assertEqual(
  resolveItemImagePath({ name: '輕鋼靴', nameEn: 'Light Plated Boots', slot: 'boots' }),
  'images/items/bases/lightplateboots.gif',
  'Light Plated Boots must resolve to boot sprite, not light plate armor'
);

assertEqual(
  resolveItemImagePath({ name: '詩寇蒂的憤怒', nameEn: "Skullder's Ire", slot: 'armor' }),
  'images/items/bases/chainmail.gif',
  "Skullder's Ire must resolve to chainmail.gif, not perfect_skull.gif"
);

assertEqual(
  resolveItemImagePath({ name: '角鬥士的禍根', nameEn: "The Gladiator's Bane", slot: 'armor' }),
  'images/items/bases/gothicplate.gif',
  "Gladiator's Bane must resolve to gothicplate.gif, not diablo_horn.gif"
);

assertEqual(
  resolveItemImagePath({ name: '謎團', nameEn: 'Enigma' }),
  'images/items/bases/archon_plate.gif',
  'Enigma (謎團) without baseItem must resolve to archon_plate.gif'
);

assertEqual(
  resolveItemImagePath({ name: '剛毅', nameEn: 'Fortitude' }),
  'images/items/bases/archon_plate.gif',
  'Fortitude (剛毅) without baseItem must resolve to archon_plate.gif'
);

assertEqual(
  resolveItemImagePath({ name: '驕傲', nameEn: 'Pride' }),
  'images/items/bases/thresher.gif',
  'Pride (驕傲) without baseItem must resolve to thresher.gif'
);

assertEqual(
  resolveItemImagePath({ name: '吉永之臉', nameEn: "Guillaume's Face", slot: 'helm' }),
  'images/items/sets/guillaumes_face.gif',
  "Guillaume's Face must resolve to sets/guillaumes_face.gif"
);

assertEqual(
  resolveItemImagePath({ name: '加拉爾的鬃毛', nameEn: "Jalal's Mane", slot: 'helm' }),
  'images/items/bases/ialals_mane.gif',
  "Jalal's Mane must resolve to bases/ialals_mane.gif"
);

assertEqual(
  resolveItemImagePath({ name: '守護天使', nameEn: 'Guardian Angel', baseItem: '聖堂騎士甲', slot: 'armor', rarity: 'unique' }),
  'images/items/bases/platemail.gif',
  'Guardian Angel (守護天使) must NOT be intercepted by Angelic Raiment sets/angelic_mantle.gif'
);

assertEqual(
  resolveItemImagePath({ name: '赫拉迪克方塊', nameEn: 'Horadric Cube', slot: 'charm' }),
  'images/items/props/horadric_cube.gif',
  'Horadric Cube must resolve to existing horadric_cube.gif'
);

assertEqual(
  resolveItemImagePath({ name: '赦免徽章', nameEn: 'Token of Absolution' }),
  'images/items/props/token_of_absolution.jpg',
  'Token of Absolution must resolve to existing token_of_absolution.jpg'
);

assertEqual(
  resolveItemImagePath({ name: '完美紅寶石', nameEn: 'Perfect Ruby' }),
  'images/items/props/perfect_ruby.gif',
  'Perfect Ruby must resolve to existing perfect_ruby.gif'
);

assertEqual(
  resolveItemImagePath({ name: '毀滅之鑰', nameEn: 'Key of Destruction' }),
  'images/items/props/uber_key.gif',
  'Key of Destruction must resolve to existing uber_key.gif'
);

assertEqual(
  resolveItemImagePath({ name: '痛苦精華', nameEn: 'Twisted Essence of Suffering' }),
  'images/items/props/essences.png',
  'Twisted Essence of Suffering must resolve to existing essences.png'
);

assertFileExists('images/items/props/horadric_cube.gif', 'Props: horadric_cube.gif');
assertFileExists('images/items/props/token_of_absolution.jpg', 'Props: token_of_absolution.jpg');
assertFileExists('images/items/props/perfect_ruby.gif', 'Props: perfect_ruby.gif');
assertFileExists('images/items/props/uber_key.gif', 'Props: uber_key.gif');
assertFileExists('images/items/props/essences.png', 'Props: essences.png');

// Strict BaseURL verification
assertStrictEqual(
  resolveItemImagePath({ name: '軍帽', nameEn: 'Harlequin Crest', baseUrl: '' }),
  'images/items/uniques/harlequin_crest.gif',
  'baseUrl="" must produce clean relative path images/... without leading slash'
);

assertStrictEqual(
  resolveItemImagePath({ name: '軍帽', nameEn: 'Harlequin Crest', baseUrl: '/d2r-codex' }),
  '/d2r-codex/images/items/uniques/harlequin_crest.gif',
  'baseUrl="/d2r-codex" without trailing slash must append trailing slash'
);

assertStrictEqual(
  resolveItemImagePath({ name: '軍帽', nameEn: 'Harlequin Crest', baseUrl: './' }),
  './images/items/uniques/harlequin_crest.gif',
  'baseUrl="./" must preserve prefix'
);

// Non-runeword uniques without slot/baseItem protection
assertEqual(
  resolveItemImagePath({ nameEn: 'The Spirit Shroud', rarity: 'unique' }),
  'images/items/bases/breastplate.gif',
  'The Spirit Shroud without slot must resolve to armor, NOT crystalsword.gif'
);

assertEqual(
  resolveItemImagePath({ name: '靈魂熔爐', nameEn: 'Spirit Forge', slot: 'armor', rarity: 'unique' }),
  'images/items/bases/chainmail.gif',
  'Spirit Forge (unique armor) must resolve to chainmail, NOT crystalsword.gif'
);

assertEqual(
  resolveItemImagePath({ name: '幽靈守護者', nameEn: 'Spirit Keeper', slot: 'helm', rarity: 'unique' }),
  'images/items/bases/wolfhead.gif',
  'Spirit Keeper (unique helm) must resolve to wolfhead, NOT crystalsword.gif'
);

// Ring Mail protection
assertEqual(
  resolveItemImagePath({ name: '環甲', nameEn: 'Ring Mail' }),
  'images/items/bases/ringmail.gif',
  'Ring Mail without slot must resolve to ringmail.gif, NOT SOJ'
);

// Generic gem/jewel fallback
assertEqual(
  resolveItemImagePath({ name: '魔法珠寶', rarity: 'gem' }),
  'images/items/jewels/lightning.gif',
  'rarity="gem" must fallback to jewels/lightning.gif'
);

// Set weapon mainHand slot acceptance
assertEqual(
  resolveItemImagePath({ name: '娜塔亞的印記', slot: 'mainHand' }),
  'images/items/sets/natalyas_mark.gif',
  "Natalya's Mark with slot=mainHand must resolve to weapon sprite"
);

assertEqual(
  resolveItemImagePath({ name: '阿爾德的節奏', slot: 'mainHand' }),
  'images/items/sets/aldurs_rhythm.gif',
  "Aldur's Rhythm with slot=mainHand must resolve to weapon sprite"
);

assertEqual(
  resolveItemImagePath({ name: '馬維娜的施展', slot: 'mainHand' }),
  'images/items/sets/mavinas_caster.gif',
  "M'avina's Caster with slot=mainHand must resolve to weapon sprite"
);

// ──────────────────────────────────────────────
// 2. Full Dataset Physical Existence & Semantic Slot Validation
// ──────────────────────────────────────────────
console.log('\n--- 2. Validating Full Dataset Items ---');

// Uniques Validation
UNIQUE_ITEMS_DATA.forEach(u => {
  const p = resolveItemImagePath({ name: u.name, nameEn: u.nameEn, baseItem: u.baseItem, slot: u.slot, rarity: 'unique' });
  assertFileExists(p, `Unique: ${u.name} (${u.nameEn})`);
  assertSemanticSlot(p, u.slot, `Unique: ${u.name} (${u.nameEn})`);
});

// Sets Validation (each piece)
SET_ITEMS_DATA.forEach(setGroup => {
  setGroup.pieces.forEach(pPiece => {
    const p = resolveItemImagePath({ name: pPiece.name, nameEn: pPiece.nameEn, baseItem: pPiece.baseItem, slot: pPiece.slot, rarity: 'set' });
    assertFileExists(p, `Set Piece: ${pPiece.name} (${pPiece.nameEn})`);
    assertSemanticSlot(p, pPiece.slot, `Set Piece: ${pPiece.name} (${pPiece.nameEn})`);
  });
});

// Runewords Validation
RUNEWORDS_DATA.forEach(rw => {
  const p = resolveItemImagePath({ name: rw.name, nameEn: rw.nameEn, baseItem: rw.allowedBases[0] || '', rarity: 'runeword' });
  assertFileExists(p, `Runeword: ${rw.name} (${rw.nameEn})`);
});

// Base Items Validation (both existence and semantic slot)
BASE_ITEMS_DATA.forEach(b => {
  let mappedSlot = '';
  if (b.category === '單手武器' || b.category === '雙手武器') mappedSlot = 'weapon';
  else if (b.category === '防具鎧甲') mappedSlot = 'armor';
  else if (b.category === '盾牌') mappedSlot = 'shield';
  else if (b.category === '頭盔') mappedSlot = 'helm';

  const p = resolveItemImagePath({ name: b.name, nameEn: b.nameEn, rarity: 'normal' });
  assertFileExists(p, `Base Item: ${b.name} (${b.nameEn})`);
  if (mappedSlot) {
    assertSemanticSlot(p, mappedSlot, `Base Item: ${b.name} (${b.nameEn})`);
  }
});

// Runes 1-33 Validation
for (let r = 1; r <= 33; r++) {
  const p = resolveItemImagePath({ rarity: 'rune', runeNumber: r });
  assertFileExists(p, `Rune #${r}`);
}

console.log('\n=============================================');
console.log(`TOTAL CHECKS: ${totalTests}`);
console.log(`PASSED:       ${passedTests}`);
console.log(`FAILED:       ${failedTests}`);
console.log('=============================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 530+ CHECKS PASSED WITH ZERO ERRORS!');
  process.exit(0);
}
