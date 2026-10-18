import { decryptEndpoint } from './probe_d2r_world.mjs';

async function testSets() {
  const rootSets = await decryptEndpoint('https://d2r.world/zh-TW/info/item/sets');
  const setPages = rootSets.subpages.filter(p => p.isSetPage);
  console.log(`Found ${setPages.length} set collections`);

  let totalPieces = 0;
  for (const sp of setPages) {
    const url = `https://d2r.world/zh-TW/info/item/sets/${sp.gid}`;
    try {
      const data = await decryptEndpoint(url);
      const items = data.pagedata.sections ? data.pagedata.sections.flatMap(s => s.items) : (data.pagedata.items || []);
      totalPieces += items.length;
      console.log(`Set [${sp.title} (${sp.etitle})]: ${items.length} pieces, has pagedata.set_attrs: ${!!data.pagedata.set_attrs}`);
    } catch (e) {
      console.error(`Error fetching set ${sp.gid}:`, e.message);
    }
  }
  console.log(`Total set pieces: ${totalPieces}`);
}

testSets().catch(console.error);
