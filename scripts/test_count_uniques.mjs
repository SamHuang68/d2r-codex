import { decryptEndpoint } from './probe_d2r_world.mjs';

const SUBPAGES = [
  'helms', 'armors', 'shields', 'belts', 'boots', 'gloves',
  'swords', 'daggers', 'axes', 'polearms', 'spears', 'clubs',
  'puremaces', 'hammers', 'scepters', 'staves', 'orbs', 'wands',
  'katars', 'bows', 'crossbows', 'javelins', 'throwings',
  'pal-shields', 'rings', 'amulets', 'charms', 'jewels'
];

async function countAllUniques() {
  let total = 0;
  const summary = {};

  for (const page of SUBPAGES) {
    try {
      const url = `https://d2r.world/zh-TW/info/item/unique/${page}`;
      const data = await decryptEndpoint(url);
      const items = data.pagedata.sections.flatMap(s => s.items);
      summary[page] = items.length;
      total += items.length;
      console.log(`[${page}] items: ${items.length}`);
    } catch (e) {
      console.error(`Error in [${page}]:`, e.message);
    }
  }

  console.log('=== Total Unique Items ===:', total);
}

countAllUniques().catch(console.error);
