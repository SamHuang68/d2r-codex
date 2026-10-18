import { decryptEndpoint } from './probe_d2r_world.mjs';

async function main() {
  const helms = await decryptEndpoint('https://d2r.world/zh-TW/info/item/unique/helms');
  const items = helms.pagedata.sections.flatMap(s => s.items);
  for (const item of items.slice(0, 15)) {
    console.log(`${item.id} | ${item.name} (${item.ename}) | img: ${item.img}`);
  }
}

main().catch(console.error);
