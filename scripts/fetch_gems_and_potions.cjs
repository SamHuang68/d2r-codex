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
  const assets = [
    // Gems
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectruby.gif', name: 'perfect_ruby.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectsaphire.gif', name: 'perfect_sapphire.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfecttopaz.gif', name: 'perfect_topaz.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectemerald.gif', name: 'perfect_emerald.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectdiamond.gif', name: 'perfect_diamond.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectamethyst.gif', name: 'perfect_amethyst.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/gems/perfectskull.gif', name: 'perfect_skull.gif' },

    // Potions
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/superhealing.gif', name: 'super_healing.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/supermana.gif', name: 'super_mana.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/fullrejuv.gif', name: 'full_rejuvenation.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/rejuv.gif', name: 'rejuvenation.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/antidote.gif', name: 'antidote.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/thawing.gif', name: 'thawing.gif' },
    { url: 'http://classic.battle.net/images/battle/diablo2exp/images/potions/stamina.gif', name: 'stamina.gif' },
  ];

  for (const a of assets) {
    const dest = path.join(__dirname, '../public/images/items/props', a.name);
    try {
      await download(a.url, dest);
      console.log(`Downloaded ${a.name}`);
    } catch (e) {
      console.error(`Error on ${a.name}:`, e.message);
    }
  }
}

main();
