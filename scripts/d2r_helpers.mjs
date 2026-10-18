import fs from 'fs';

const map = JSON.parse(fs.readFileSync('scripts/d2rw_map.json', 'utf-8'));

export function decodeText(str) {
  if (!str) return '';
  let res = '';
  for (const ch of str) {
    if (map[ch] !== undefined) {
      res += map[ch];
    } else {
      res += ch;
    }
  }
  return res;
}

export function decodeItemStats(cli_attrs) {
  const lines = [];
  if (!cli_attrs) return lines;
  
  for (const [sectionKey, entries] of Object.entries(cli_attrs)) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry.ts) continue;
      const line = entry.ts.map(part => decodeText(part.t)).join('');
      if (line.trim()) lines.push(line.trim());
    }
  }
  return lines;
}

export function parseReqs(cli_attrs) {
  let requiredLevel = 0;
  let requiredStr = 0;
  let requiredDex = 0;

  if (!cli_attrs || !cli_attrs.general) return { requiredLevel, requiredStr, requiredDex };

  for (const entry of cli_attrs.general) {
    if (!entry.ts) continue;
    const line = entry.ts.map(part => decodeText(part.t)).join('');
    if (line.includes('需要等級：')) {
      const match = line.match(/需要等級：\s*(\d+)/);
      if (match) requiredLevel = parseInt(match[1], 10);
    }
    if (line.includes('需要力量：')) {
      const match = line.match(/需要力量：\s*(\d+)/);
      if (match) requiredStr = parseInt(match[1], 10);
    }
    if (line.includes('需要敏捷：')) {
      const match = line.match(/需要敏捷：\s*(\d+)/);
      if (match) requiredDex = parseInt(match[1], 10);
    }
  }

  return { requiredLevel, requiredStr, requiredDex };
}

export function mapSlot(itemclass, subpage) {
  const c = (itemclass || subpage || '').toLowerCase();
  if (c.includes('helm') || c.includes('circlet') || c.includes('pelt')) return 'helm';
  if (c.includes('armor') || c.includes('body')) return 'armor';
  if (c.includes('shield') || c.includes('pal-shield') || c.includes('head')) return 'shield';
  if (c.includes('glove')) return 'gloves';
  if (c.includes('boot')) return 'boots';
  if (c.includes('belt')) return 'belt';
  if (c.includes('ring')) return 'ring';
  if (c.includes('amulet')) return 'amulet';
  if (c.includes('charm')) return 'charm';
  if (c.includes('jewel')) return 'jewel';
  return 'weapon';
}
