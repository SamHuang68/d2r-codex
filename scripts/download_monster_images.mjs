import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TARGET_DIR = path.resolve('public/images/monsters');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const MONSTER_IMAGE_SOURCES = {
  // Major Act Bosses & Prime Evils
  'andariel': 'https://static.wikia.nocookie.net/diablo/images/5/5f/Andariel2-D4.jpg',
  'duriel': 'https://static.wikia.nocookie.net/diablo/images/8/88/DurielD4.jpg',
  'mephisto': 'https://static.wikia.nocookie.net/diablo/images/b/bd/Mephisto_AoH.jpg',
  'diablo': 'https://static.wikia.nocookie.net/diablo/images/9/97/Diablo_3D_render2.jpg',
  'baal': 'https://static.wikia.nocookie.net/diablo/images/7/7e/Baal-decades.jpg',
  'lilith': 'https://static.wikia.nocookie.net/diablo/images/5/52/Lilith_DIV_face2.jpg',
  'uberandariel': 'https://static.wikia.nocookie.net/diablo/images/5/52/Lilith_DIV_face2.jpg',
  'uberduriel': 'https://static.wikia.nocookie.net/diablo/images/8/88/DurielD4.jpg',
  'ubermephisto': 'https://static.wikia.nocookie.net/diablo/images/b/bd/Mephisto_AoH.jpg',
  'uberdiablo': 'https://static.wikia.nocookie.net/diablo/images/9/97/Diablo_3D_render2.jpg',
  'diabloclone': 'https://static.wikia.nocookie.net/diablo/images/9/97/Diablo_3D_render2.jpg',
  'uberbaal': 'https://static.wikia.nocookie.net/diablo/images/7/7e/Baal-decades.jpg',
  'baalcrab': 'https://static.wikia.nocookie.net/diablo/images/7/7e/Baal-decades.jpg',
  'baalclone': 'https://static.wikia.nocookie.net/diablo/images/7/7e/Baal-decades.jpg',

  // Key Quest & Superunique Bosses
  'bloodraven': 'https://static.wikia.nocookie.net/diablo/images/0/05/Blood_Raven_Remake_2.jpg',
  'countess': 'https://static.wikia.nocookie.net/diablo/images/5/58/Countess3.jpg',
  'smith': 'https://static.wikia.nocookie.net/diablo/images/a/af/Hephasto.gif',
  'radament': 'https://static.wikia.nocookie.net/diablo/images/8/87/Radament_Unused.png',
  'summoner': 'https://static.wikia.nocookie.net/diablo/images/0/09/Jazreth_D2Resurrected.jpeg',
  'izual': 'https://static.wikia.nocookie.net/diablo/images/d/db/Izual-BoT.jpg',
  'uberizual': 'https://static.wikia.nocookie.net/diablo/images/d/db/Izual-BoT.jpg',
  'hephasto': 'https://static.wikia.nocookie.net/diablo/images/4/48/Hephasto-BoT.jpg',
  'griswold': 'https://static.wikia.nocookie.net/diablo/images/5/50/Griswold-resurrected.jpg',
  'nihlathakboss': 'https://static.wikia.nocookie.net/diablo/images/f/fe/Nihlathak-resurrected.jpg',
  'shenk': 'https://static.wikia.nocookie.net/diablo/images/d/db/Shenk_the_Overseer.jpg',
  'colossal1': 'https://static.wikia.nocookie.net/diablo/images/e/ec/Talic.gif',
  'colossal2': 'https://static.wikia.nocookie.net/diablo/images/2/2a/Madawc_Unused.png',
  'colossal3': 'https://static.wikia.nocookie.net/diablo/images/3/34/Korlic.gif',

  // Core Monster Families & Types
  'skeleton': 'https://static.wikia.nocookie.net/diablo/images/d/d8/Burning_Dead_Mage_%28Cold%29_1.00.jpg',
  'zombie': 'https://static.wikia.nocookie.net/diablo/images/8/88/Zombie_Graphic_Variation.png',
  'fallen': 'https://static.wikia.nocookie.net/diablo/images/4/4f/ShamanD3.jpg',
  'goatman': 'https://static.wikia.nocookie.net/diablo/images/6/68/Goatman-resurrected.jpg',
  'sandmaggot': 'https://static.wikia.nocookie.net/diablo/images/8/85/Sandmaggot.gif',
  'clawviper': 'https://static.wikia.nocookie.net/diablo/images/0/0c/Clawviper.gif',
  'scarab': 'https://static.wikia.nocookie.net/diablo/images/b/be/Scarabdemon.gif',
  'mummy': 'https://static.wikia.nocookie.net/diablo/images/d/d0/Bestow.jpg',
  'unraveler': 'https://static.wikia.nocookie.net/diablo/images/d/d0/Bestow.jpg',
  'fetish': 'https://static.wikia.nocookie.net/diablo/images/c/cc/Painmender.gif',
  'undeadfetish': 'https://static.wikia.nocookie.net/diablo/images/c/cc/Painmender.gif',
  'megademon': 'https://static.wikia.nocookie.net/diablo/images/3/3d/Pit_Lord_%28Diablo_II%29.gif',
  'doomknight': 'https://static.wikia.nocookie.net/diablo/images/a/ac/Megademon-rpg.jpg',
  'willowisp': 'https://static.wikia.nocookie.net/diablo/images/0/05/Willowisp.gif',
  'vampire': 'https://static.wikia.nocookie.net/diablo/images/b/bf/Vampire_D2.gif',
  'blunderbore': 'https://static.wikia.nocookie.net/diablo/images/2/27/Blunderbore-resurrected.jpg',
  'bovine': 'https://static.wikia.nocookie.net/diablo/images/2/25/Hell_Bovine_D3-model.jpg',
  'succubus': 'https://static.wikia.nocookie.net/diablo/images/4/4d/DI_Vile_Temptress.jpg',
  'corruptrogue': 'https://static.wikia.nocookie.net/diablo/images/9/9b/Corrupt_Rogue_Unused_Graphics.png',
  'councilmember': 'https://static.wikia.nocookie.net/diablo/images/6/6f/Councilmember.gif',
  'sandleaper': 'https://static.wikia.nocookie.net/diablo/images/1/11/Sandleaper.gif',
  'vulturedemon': 'https://static.wikia.nocookie.net/diablo/images/6/6e/Vulturedemon.gif',
  'minion': 'https://static.wikia.nocookie.net/diablo/images/4/45/Monster-suicideminion.jpg',
  'overseer': 'https://static.wikia.nocookie.net/diablo/images/d/db/Shenk_the_Overseer.jpg',
  'putriddefiler': 'https://static.wikia.nocookie.net/diablo/images/3/3d/Pit_Lord_%28Diablo_II%29.gif',

  // Kind Fallbacks
  'demon': 'https://static.wikia.nocookie.net/diablo/images/9/97/Diablo_3D_render2.jpg',
  'undead': 'https://static.wikia.nocookie.net/diablo/images/8/88/Zombie_Graphic_Variation.png',
  'insect': 'https://static.wikia.nocookie.net/diablo/images/b/be/Scarabdemon.gif',
  'human': 'https://static.wikia.nocookie.net/diablo/images/0/09/Jazreth_D2Resurrected.jpeg',
  'construct': 'https://static.wikia.nocookie.net/diablo/images/a/af/Hephasto.gif',
  'other': 'https://static.wikia.nocookie.net/diablo/images/2/27/Blunderbore-resurrected.jpg'
};

async function downloadAll() {
  console.log(`Starting download of ${Object.keys(MONSTER_IMAGE_SOURCES).length} monster images...`);
  for (const [key, url] of Object.entries(MONSTER_IMAGE_SOURCES)) {
    const ext = url.endsWith('.gif') ? '.gif' : url.endsWith('.png') ? '.png' : '.webp';
    const filename = `${key}${ext}`;
    const dest = path.join(TARGET_DIR, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✓ ${filename} already exists (${fs.statSync(dest).size} bytes)`);
      continue;
    }

    try {
      execSync(`curl.exe -s -L -H "User-Agent: Mozilla/5.0" "${url}" -o "${dest}"`, { timeout: 10000 });
      const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
      if (size < 1000) {
        console.warn(`⚠ ${filename} downloaded but too small (${size} bytes)`);
      } else {
        console.log(`✓ ${filename} downloaded (${size} bytes)`);
      }
    } catch (err) {
      console.error(`✗ Failed to download ${filename}:`, err.message);
    }
  }
}

downloadAll();
