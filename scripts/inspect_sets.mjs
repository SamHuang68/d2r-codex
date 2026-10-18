import { decryptEndpoint } from './probe_d2r_world.mjs';

async function main() {
  const sets = await decryptEndpoint('https://d2r.world/zh-TW/info/item/sets');
  console.log('Sets keys:', Object.keys(sets));
  console.log('Sets root keys:', Object.keys(sets.root || {}));
  console.log('Sets subpages:', sets.subpages);
  if (sets.root && sets.root.grades) {
    console.log('Sets grades:', sets.root.grades);
  }
}

main().catch(console.error);
