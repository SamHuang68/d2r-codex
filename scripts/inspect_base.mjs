import { decryptEndpoint } from './probe_d2r_world.mjs';

async function main() {
  const base = await decryptEndpoint('https://d2r.world/zh-TW/info/item/base');
  console.log('Base keys:', Object.keys(base));
  console.log('Base root keys:', Object.keys(base.root));
  console.log('Base subpages:', base.subpages ? base.subpages.map(s => s.gid || s.title) : 'none');
  if (base.pagedata) {
    console.log('Base pagedata keys:', Object.keys(base.pagedata));
  }
}

main().catch(console.error);
