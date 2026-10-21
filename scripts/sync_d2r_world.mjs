// ⚠ 已停用（2026-10-21）：百科頁的 src/data/runewords.ts、uniqueItems.ts、setItems.ts 現在由遊戲資料表（src/data/game/*.json）即時產生，
// 本腳本會用舊的爬取資料覆寫這些模組，等於把第二份資料重新帶回來。要更新資料請改跑 `npm run data:build`，
// 舊 id／標籤／備註等人工維護內容在 src/data/codex/overlay.json。說明見 scripts/data-pipeline/README.md。
console.error('此腳本已停用：src/data/runewords.ts、uniqueItems.ts、setItems.ts 由遊戲資料表產生，請改用 npm run data:build（說明見 scripts/data-pipeline/README.md）。');
process.exit(1);

import fs from 'fs';
import path from 'path';
import { decryptEndpoint } from './probe_d2r_world.mjs';
import { decodeText, decodeItemStats, parseReqs, mapSlot } from './d2r_helpers.mjs';

const UNIQUE_SUBPAGES = [
  'helms', 'armors', 'shields', 'belts', 'boots', 'gloves',
  'swords', 'daggers', 'axes', 'polearms', 'spears', 'clubs',
  'puremaces', 'hammers', 'scepters', 'staves', 'orbs', 'wands',
  'katars', 'bows', 'crossbows', 'javelins', 'throwings',
  'pal-shields', 'rings', 'amulets', 'charms', 'jewels'
];

const BASE_SUBPAGES = [
  'helms', 'armors', 'shields', 'belts', 'boots', 'gloves',
  'swords', 'daggers', 'axes', 'polearms', 'spears', 'clubs',
  'puremaces', 'hammers', 'scepters', 'staves', 'orbs', 'wands',
  'katars', 'bows', 'crossbows', 'javelins', 'throwings',
  'pal-shields'
];

function decodeBonusList(entries) {
  if (!entries || !Array.isArray(entries)) return [];
  const lines = [];
  for (const entry of entries) {
    if (!entry.ts) continue;
    const text = entry.ts.map(part => decodeText(part.t)).join('').trim();
    if (text) lines.push(text);
  }
  return lines;
}

async function syncRunewords() {
  console.log('Fetching Runewords from d2r.world...');
  const data = await decryptEndpoint('https://d2r.world/zh-TW/info/item/runewords');
  const items = data.root.runewords_items;
  console.log(`Fetched ${items.length} runewords.`);

  const runewords = items.map(item => {
    const runes = (item.runes || []).map(r => r.ename);
    const runeNumbers = (item.runes || []).map(r => r.code);
    const allowedBases = (item.allowitems || []).map(a => a.name);
    const attributes = decodeItemStats(item.cli_attrs);

    // derive common tags
    const tags = [];
    const fullText = attributes.join(' ');
    if (fullText.includes('所有技能') || fullText.includes('技能等級')) tags.push('All Skills');
    if (fullText.includes('施法速度') || fullText.includes('FCR')) tags.push('FCR');
    if (fullText.includes('打擊恢復') || fullText.includes('FHR')) tags.push('FHR');
    if (fullText.includes('抗性') || fullText.includes('抗寒') || fullText.includes('抗電')) tags.push('Resistances');
    if (fullText.includes('生命') || fullText.includes('體力')) tags.push('Life');
    if (fullText.includes('法力')) tags.push('Mana');
    if (fullText.includes('傳送')) tags.push('Teleport');
    if (fullText.includes('壓碎打擊') || fullText.includes('粉碎打擊')) tags.push('CB');
    if (fullText.includes('致命攻擊')) tags.push('DS');
    if (fullText.includes('尋獲魔法裝備') || fullText.includes('更佳機會')) tags.push('Magic Find');
    if (fullText.includes('靈氣')) tags.push('Aura');

    return {
      id: item.id,
      name: item.name,
      nameEn: item.ename,
      nameClassic: item.lname || undefined,
      runes,
      runeNumbers,
      sockets: item.sockets,
      allowedBases,
      requiredLevel: item.lv || 1,
      ladderOnly: !!item.ladderonly,
      attributes,
      tags: tags.length > 0 ? tags : ['Runeword'],
      imageUrl: item.img ? `https://static.d2r.world${item.img}` : undefined
    };
  });

  const content = `import type { RunewordData } from '../types';\n\nexport const RUNEWORDS_DATA: RunewordData[] = ${JSON.stringify(runewords, null, 2)};\n`;
  fs.writeFileSync('src/data/runewords.ts', content, 'utf-8');
  console.log('Saved src/data/runewords.ts successfully!');
  return runewords;
}

async function syncUniques() {
  console.log('Fetching Uniques from d2r.world...');
  const allUniques = [];
  const seenIds = new Set();

  for (const page of UNIQUE_SUBPAGES) {
    try {
      const url = `https://d2r.world/zh-TW/info/item/unique/${page}`;
      const data = await decryptEndpoint(url);
      const items = data.pagedata.sections.flatMap(s => s.items);
      console.log(`[Unique] ${page}: ${items.length} items`);

      for (const item of items) {
        if (seenIds.has(item.id)) continue;
        seenIds.add(item.id);

        const reqs = parseReqs(item.cli_attrs);
        const slot = mapSlot(item.itemclass, page);
        const attributes = decodeItemStats(item.cli_attrs);

        allUniques.push({
          id: item.id,
          name: item.name,
          nameEn: item.ename,
          nameClassic: item.lname || undefined,
          baseItem: item.bname,
          baseItemId: item.bid || undefined,
          slot,
          grade: item.grade || 'normal',
          requiredLevel: reqs.requiredLevel,
          requiredStr: reqs.requiredStr > 0 ? reqs.requiredStr : undefined,
          requiredDex: reqs.requiredDex > 0 ? reqs.requiredDex : undefined,
          ladderOnly: !!item.ladderonly,
          classOnly: item.classonly || null,
          tc: item.TC !== '-' ? item.TC : undefined,
          qlvl: item.Qlvl || undefined,
          attributes,
          imageUrl: item.img ? `https://static.d2r.world${item.img}` : undefined
        });
      }
    } catch (e) {
      console.error(`Error in unique subpage ${page}:`, e.message);
    }
  }

  console.log(`Total unique items collected: ${allUniques.length}`);
  const content = `import type { UniqueItemData } from '../types';\n\nexport const UNIQUE_ITEMS_DATA: UniqueItemData[] = ${JSON.stringify(allUniques, null, 2)};\n`;
  fs.writeFileSync('src/data/uniqueItems.ts', content, 'utf-8');
  console.log('Saved src/data/uniqueItems.ts successfully!');
  return allUniques;
}

async function syncSets() {
  console.log('Fetching Sets from d2r.world...');
  const rootSets = await decryptEndpoint('https://d2r.world/zh-TW/info/item/sets');
  const setPages = rootSets.subpages.filter(p => p.isSetPage);
  console.log(`Found ${setPages.length} set collections`);

  const collections = [];
  const allPieces = [];

  for (const sp of setPages) {
    try {
      const url = `https://d2r.world/zh-TW/info/item/sets/${sp.gid}`;
      const data = await decryptEndpoint(url);
      const items = data.pagedata.sections ? data.pagedata.sections.flatMap(s => s.items) : (data.pagedata.items || []);

      const pieces = items.map(piece => {
        const reqs = parseReqs(piece.cli_attrs);
        const slot = mapSlot(piece.itemclass, '');
        const attributes = decodeItemStats(piece.cli_attrs);

        const pieceObj = {
          id: piece.id,
          name: piece.name,
          nameEn: piece.ename,
          nameClassic: piece.lname || undefined,
          baseItem: piece.bname,
          baseItemId: piece.bid || undefined,
          slot,
          grade: piece.grade || 'normal',
          requiredLevel: reqs.requiredLevel,
          requiredStr: reqs.requiredStr > 0 ? reqs.requiredStr : undefined,
          requiredDex: reqs.requiredDex > 0 ? reqs.requiredDex : undefined,
          classOnly: piece.classonly || null,
          tc: piece.TC !== '-' ? piece.TC : undefined,
          qlvl: piece.Qlvl || undefined,
          attributes,
          imageUrl: piece.img ? `https://static.d2r.world${piece.img}` : undefined
        };
        allPieces.push(pieceObj);
        return pieceObj;
      });

      const partialBonuses = [];
      const rawPartial = data.pagedata.cli_gsetitem_attrs ? data.pagedata.cli_gsetitem_attrs['Partial Set Bonus'] : [];
      if (rawPartial && Array.isArray(rawPartial)) {
        rawPartial.forEach((entry, idx) => {
          if (!entry.ts) return;
          const text = entry.ts.map(p => decodeText(p.t)).join('').trim();
          if (text) partialBonuses.push({ count: idx + 2, bonus: text });
        });
      }

      const fullBonuses = data.pagedata.cli_gsetitem_attrs
        ? decodeBonusList(data.pagedata.cli_gsetitem_attrs['Complete Set Bonus'])
        : [];

      collections.push({
        id: sp.gid,
        name: sp.title,
        nameEn: sp.etitle,
        isClassSet: sp.isClassSet,
        class: sp.class || null,
        pieces,
        partialBonuses,
        fullBonuses,
        imageUrl: pieces[0] ? pieces[0].imageUrl : undefined
      });
      console.log(`[Set] ${sp.title}: ${pieces.length} pieces`);
    } catch (e) {
      console.error(`Error in set ${sp.gid}:`, e.message);
    }
  }

  console.log(`Total set collections: ${collections.length}, total pieces: ${allPieces.length}`);
  const content = `import type { SetItemCollection, SetPiece } from '../types';\n\nexport const SET_ITEMS_DATA: SetItemCollection[] = ${JSON.stringify(collections, null, 2)};\n\nexport const ALL_SET_PIECES: SetPiece[] = ${JSON.stringify(allPieces, null, 2)};\n`;
  fs.writeFileSync('src/data/setItems.ts', content, 'utf-8');
  console.log('Saved src/data/setItems.ts successfully!');
  return { collections, allPieces };
}

async function syncBases() {
  console.log('Fetching Base Items from d2r.world...');
  const allBases = [];
  const seenIds = new Set();

  for (const page of BASE_SUBPAGES) {
    try {
      const url = `https://d2r.world/zh-TW/info/item/base/${page}`;
      const data = await decryptEndpoint(url);
      const sections = data.pagedata.sections || [];
      const slot = mapSlot(data.pagedata.category || page, page);

      for (const sec of sections) {
        const tbls = sec.itemtbls || [];
        for (const tbl of tbls) {
          const names = tbl.name || [];
          const enames = tbl.ename || [];
          const grades = tbl.grade || [];
          const ids = tbl.id || [];
          const attrs = tbl.attrs || {};
          const img = tbl.img ? `https://static.d2r.world${tbl.img}` : undefined;

          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (!id || seenIds.has(id)) continue;
            seenIds.add(id);

            const name = names[i] || id;
            const nameEn = enames[i] || id;
            const grade = grades[i] || 'normal';

            // Parse reqs and stats
            const reqLvlStr = attrs['需要等級'] ? attrs['需要等級'][i] : '-';
            const reqStrStr = attrs['需要力量'] ? attrs['需要力量'][i] : '-';
            const reqDexStr = attrs['需要敏捷'] ? attrs['需要敏捷'][i] : '-';

            const requiredLevel = reqLvlStr && reqLvlStr !== '-' ? parseInt(reqLvlStr, 10) || 1 : 1;
            const requiredStr = reqStrStr && reqStrStr !== '-' ? parseInt(reqStrStr, 10) || 0 : 0;
            const requiredDex = reqDexStr && reqDexStr !== '-' ? parseInt(reqDexStr, 10) || 0 : 0;

            // Sockets
            let maxSockets = 0;
            if (attrs['最大凹洞數']) {
              const s = attrs['最大凹洞數'][i];
              maxSockets = parseInt(s, 10) || 0;
            } else if (attrs['鑲孔']) {
              const s = attrs['鑲孔'][i];
              if (typeof s === 'object' && s.txt) {
                maxSockets = parseInt(s.txt, 10) || 0;
              } else if (typeof s === 'string') {
                maxSockets = parseInt(s, 10) || 0;
              }
            }

            // Defense / Damage
            const defStr = attrs['防禦'] ? attrs['防禦'][i] : undefined;
            const dmg1hStr = attrs['單手傷害'] ? attrs['單手傷害'][i] : undefined;
            const dmg2hStr = attrs['雙手傷害'] ? attrs['雙手傷害'][i] : undefined;

            allBases.push({
              id,
              name,
              nameEn,
              category: slot,
              grade,
              maxSockets,
              requiredLevel,
              requiredStr,
              requiredDex,
              defense: defStr,
              damage1h: dmg1hStr,
              damage2h: dmg2hStr,
              imageUrl: img
            });
          }
        }
      }
      console.log(`[Base] ${page}: processed successfully`);
    } catch (e) {
      console.error(`Error in base subpage ${page}:`, e.message);
    }
  }

  console.log(`Total base items collected: ${allBases.length}`);
  const content = `export interface BaseEquipmentData {\n  id: string;\n  name: string;\n  nameEn: string;\n  nameClassic?: string;\n  category: string;\n  grade: string;\n  maxSockets: number;\n  requiredLevel: number;\n  requiredStr: number;\n  requiredDex: number;\n  defense?: string;\n  damage1h?: string;\n  damage2h?: string;\n  imageUrl?: string;\n}\n\nexport const BASE_ITEMS_DATA: BaseEquipmentData[] = ${JSON.stringify(allBases, null, 2)};\n`;
  fs.writeFileSync('src/data/bases.ts', content, 'utf-8');
  console.log('Saved src/data/bases.ts successfully!');
  return allBases;
}

async function main() {
  console.log('==============================================');
  console.log('STARTING D2R.WORLD DATABASE FULL SYNC');
  console.log('==============================================');

  const runewords = await syncRunewords();
  const uniques = await syncUniques();
  const sets = await syncSets();
  const bases = await syncBases();

  console.log('==============================================');
  console.log('D2R.WORLD DATABASE SYNC COMPLETE!');
  console.log(`- Runewords: ${runewords.length}`);
  console.log(`- Uniques: ${uniques.length}`);
  console.log(`- Sets: ${sets.collections.length} sets (${sets.allPieces.length} pieces)`);
  console.log(`- Bases: ${bases.length}`);
  console.log('==============================================');
}

main().catch(console.error);
