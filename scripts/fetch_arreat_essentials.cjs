const http = require('http');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${res.statusCode} on ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const items = [
    { url: 'http://classic.battle.net/diablo2exp/images/items/uniques/harlequincrest.gif', name: 'harlequin_crest.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/horadric-cube.gif', name: 'horadric_cube.gif', folder: 'props' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/elite/crownofages.gif', name: 'crown_of_ages.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/elite/nightwingsveil.gif', name: 'nightwings_veil.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/elite/giantskull.gif', name: 'giant_skull.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/ra/ring1.gif', name: 'the_stone_of_jordan.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/ra/ring2.gif', name: 'raven_frost.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/ra/ring3.gif', name: 'bul_kathos_wedding_band.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/ra/amu1.gif', name: 'maras_kaleidoscope.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/ra/amu2.gif', name: 'highlords_wrath.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/boots.gif', name: 'war_traveler.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/heavyboots.gif', name: 'gore_rider.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/belt.gif', name: 'arachnid_mesh.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/heavybelt.gif', name: 'thundergods_vigor.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/gloves.gif', name: 'magefist.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/targe.gif', name: 'herald_of_zakarum.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/monarch.gif', name: 'stormshield.gif', folder: 'uniques' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/monarch.gif', name: 'monarch.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/archonplate.gif', name: 'archon_plate.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/phaseblade.gif', name: 'phase_blade.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/flail.gif', name: 'flail.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/berserkeraxe.gif', name: 'berserker_axe.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/colossusblade.gif', name: 'colossus_blade.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/thresher.gif', name: 'thresher.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/weapons/hydrabow.gif', name: 'hydra_bow.gif', folder: 'bases' },
    { url: 'http://classic.battle.net/diablo2exp/images/items/armor/sacredtarge.gif', name: 'sacred_targe.gif', folder: 'bases' }
  ];

  for (const item of items) {
    const dest = path.join(__dirname, '../public/images/items', item.folder, item.name);
    try {
      await download(item.url, dest);
      console.log(`Downloaded ${item.name}`);
    } catch (e) {
      console.log(`Could not get ${item.name} from ${item.url}: ${e.message}`);
    }
  }
}

main();
