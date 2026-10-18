import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UNIQUE_ITEMS_DATA as uniqueItems } from '../src/data/uniqueItems.ts';
import { resolveItemImagePath } from '../src/utils/itemImageResolver.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

console.log('=== CURRENT UNIQUE ITEMS IMAGE RESOLUTIONS ===\n');

for (const u of uniqueItems) {
  const img = resolveItemImagePath({
    name: u.name,
    nameEn: u.nameEn,
    slot: u.slot,
    baseItem: u.baseItem,
    rarity: 'unique'
  });
  console.log(`[${u.slot}] ${u.name} (${u.nameEn})`);
  console.log(`   Base: ${u.baseItem} | Resolved: ${img}\n`);
}
