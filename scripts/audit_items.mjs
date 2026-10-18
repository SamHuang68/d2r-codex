import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UNIQUE_ITEMS_DATA as uniqueItems } from '../src/data/uniqueItems.ts';
import { SET_ITEMS_DATA as itemSets } from '../src/data/setItems.ts';
import { RUNEWORDS_DATA as runewords } from '../src/data/runewords.ts';
import { BASE_ITEMS_DATA } from '../src/data/bases.ts';
import { resolveItemImagePath } from '../src/utils/itemImageResolver.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

console.log('=== D2R CODEX ITEM & IMAGE AUDIT ===\n');

// 1. Audit Uniques
console.log(`Auditing ${uniqueItems.length} Unique items in database...`);
const uniqueImageFiles = fs.readdirSync(path.join(publicDir, 'images/items/uniques'));
const baseImageFiles = fs.readdirSync(path.join(publicDir, 'images/items/bases'));
const setImageFiles = fs.readdirSync(path.join(publicDir, 'images/items/sets'));

const resolvedUniques = [];
for (const u of uniqueItems) {
  const img = resolveItemImagePath({
    name: u.name,
    nameEn: u.nameEn,
    slot: u.slot,
    baseItem: u.baseItem,
    rarity: 'unique'
  });
  const relPath = img.replace(/^\//, '');
  const exists = fs.existsSync(path.join(publicDir, relPath));
  resolvedUniques.push({ id: u.id, name: u.name, nameEn: u.nameEn, slot: u.slot, img, exists });
}

const missingImages = resolvedUniques.filter(r => !r.exists);
console.log(`Uniques with non-existent image paths: ${missingImages.length}`);
if (missingImages.length > 0) {
  console.log(missingImages);
}

// 2. Check Uniques mapped to generic base or Shako fallback when a dedicated unique image exists!
console.log('\nChecking if any Uniques have dedicated unique images on disk but are not mapped to them:');
for (const u of uniqueItems) {
  const current = resolveItemImagePath({
    name: u.name,
    nameEn: u.nameEn,
    slot: u.slot,
    baseItem: u.baseItem,
    rarity: 'unique'
  });
  
  // Look in uniqueImageFiles for potential matches
  const enClean = (u.nameEn || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const f of uniqueImageFiles) {
    const fClean = f.replace(/\.gif$/, '').replace(/[^a-z0-9]/g, '');
    if (fClean.length >= 4 && (enClean.includes(fClean) || fClean.includes(enClean))) {
      const ideal = `images/items/uniques/${f}`;
      if (!current.includes(f)) {
        console.log(`Potential dedicated match: "${u.name}" (${u.nameEn})`);
        console.log(`   Current: ${current}`);
        console.log(`   Found in uniques folder: ${ideal}\n`);
      }
    }
  }
}

// 3. Audit Set Items
console.log(`\nAuditing ${itemSets.length} Sets in database...`);
for (const set of itemSets) {
  for (const p of set.pieces) {
    const img = resolveItemImagePath({
      name: p.name,
      nameEn: p.nameEn,
      slot: p.slot,
      baseItem: p.baseItem,
      rarity: 'set'
    });
    const relPath = img.replace(/^\//, '');
    const exists = fs.existsSync(path.join(publicDir, relPath));
    if (!exists) {
      console.log(`Set piece missing image: ${set.name} -> ${p.name} (${p.nameEn}) => ${img}`);
    }
  }
}

// 4. Check available set images on disk that are NOT in setItems.ts!
console.log('\nChecking set images on disk vs what sets exist in setItems.ts:');
const setNamesEn = itemSets.map(s => s.nameEn.toLowerCase());
const pieceNamesEn = itemSets.flatMap(s => s.pieces.map(p => p.nameEn.toLowerCase()));
const unusedSetImages = [];
for (const f of setImageFiles) {
  const fClean = f.replace(/\.gif$/, '').toLowerCase();
  const foundInPieces = pieceNamesEn.some(p => p.includes(fClean.replace(/_/g, ' ')) || fClean.replace(/_/g, '').includes(p.replace(/[^a-z0-9]/g, '')));
  if (!foundInPieces) {
    unusedSetImages.push(f);
  }
}
console.log(`Unused set images on disk: ${unusedSetImages.length}`);
console.log(unusedSetImages.slice(0, 30));

// 5. Check unique images on disk not in uniqueItems.ts
console.log('\nChecking unique images on disk not mapped to any unique item:');
const uniqueNamesEn = uniqueItems.map(u => (u.nameEn || '').toLowerCase());
const unusedUniqueImages = [];
for (const f of uniqueImageFiles) {
  const fClean = f.replace(/\.gif$/, '').toLowerCase();
  const found = uniqueNamesEn.some(u => u.includes(fClean.replace(/_/g, ' ')) || fClean.replace(/_/g, '').includes(u.replace(/[^a-z0-9]/g, '')));
  if (!found) {
    unusedUniqueImages.push(f);
  }
}
console.log(`Unused unique images on disk: ${unusedUniqueImages.length}`);
console.log(unusedUniqueImages);
