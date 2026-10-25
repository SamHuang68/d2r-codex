/**
 * 怪物圖鑑典藏圖像解析模組 (Monster Images & Boss Spotlight Resolver)
 * 提供 552 種怪物、各大章節首領 (Act Bosses) 與超級暗黑怪物之高解析度美術圖像路徑。
 */

import type { Monster } from '../data/codex/monsters';

/** 實際本機存在於 public/images/monsters/ 之圖檔路徑 */
const MONSTER_IMAGE_FILES: Record<string, string> = {
  // Major Act Bosses & Prime Evils
  andariel: 'images/monsters/andariel.webp',
  duriel: 'images/monsters/duriel.webp',
  mephisto: 'images/monsters/mephisto.webp',
  diablo: 'images/monsters/diablo.webp',
  baal: 'images/monsters/baal.webp',
  baalcrab: 'images/monsters/baalcrab.webp',
  baalclone: 'images/monsters/baalclone.webp',
  lilith: 'images/monsters/lilith.webp',
  uberandariel: 'images/monsters/uberandariel.webp',
  uberduriel: 'images/monsters/uberduriel.webp',
  ubermephisto: 'images/monsters/ubermephisto.webp',
  uberdiablo: 'images/monsters/uberdiablo.webp',
  diabloclone: 'images/monsters/diabloclone.webp',
  uberbaal: 'images/monsters/uberbaal.webp',

  // Key Quest & Superunique Bosses
  bloodraven: 'images/monsters/bloodraven.webp',
  countess: 'images/monsters/countess.webp',
  smith: 'images/monsters/smith.gif',
  radament: 'images/monsters/radament.png',
  summoner: 'images/monsters/summoner.webp',
  izual: 'images/monsters/izual.webp',
  uberizual: 'images/monsters/uberizual.webp',
  hephasto: 'images/monsters/hephasto.webp',
  griswold: 'images/monsters/griswold.webp',
  nihlathakboss: 'images/monsters/nihlathakboss.webp',
  shenk: 'images/monsters/shenk.webp',
  colossal1: 'images/monsters/colossal1.gif',
  colossal2: 'images/monsters/colossal2.png',
  colossal3: 'images/monsters/colossal3.gif',

  // Core Monster Families & Types
  skeleton: 'images/monsters/skeleton.webp',
  zombie: 'images/monsters/zombie.png',
  fallen: 'images/monsters/fallen.webp',
  goatman: 'images/monsters/goatman.webp',
  sandmaggot: 'images/monsters/sandmaggot.gif',
  clawviper: 'images/monsters/clawviper.gif',
  scarab: 'images/monsters/scarab.gif',
  mummy: 'images/monsters/mummy.webp',
  unraveler: 'images/monsters/unraveler.webp',
  fetish: 'images/monsters/fetish.gif',
  undeadfetish: 'images/monsters/undeadfetish.gif',
  megademon: 'images/monsters/megademon.gif',
  doomknight: 'images/monsters/doomknight.webp',
  willowisp: 'images/monsters/willowisp.gif',
  vampire: 'images/monsters/vampire.gif',
  blunderbore: 'images/monsters/blunderbore.webp',
  bovine: 'images/monsters/bovine.webp',
  succubus: 'images/monsters/succubus.webp',
  corruptrogue: 'images/monsters/corruptrogue.png',
  councilmember: 'images/monsters/councilmember.gif',
  sandleaper: 'images/monsters/sandleaper.gif',
  vulturedemon: 'images/monsters/vulturedemon.gif',
  minion: 'images/monsters/minion.webp',
  overseer: 'images/monsters/overseer.webp',
  putriddefiler: 'images/monsters/putriddefiler.gif',

  // Category Kind Fallbacks
  demon: 'images/monsters/demon.webp',
  undead: 'images/monsters/undead.png',
  insect: 'images/monsters/insect.gif',
  human: 'images/monsters/human.webp',
  construct: 'images/monsters/construct.gif',
  other: 'images/monsters/other.webp',
};

/** 遊戲 54 種 type 映射至最佳視覺形象圖檔之規則表 */
const TYPE_FALLBACK_MAP: Record<string, string> = {
  arach: 'insect',
  baboon: 'goatman',
  batdemon: 'vulturedemon',
  bighead: 'fetish',
  bloodlord: 'megademon',
  blunderbore: 'blunderbore',
  bovine: 'bovine',
  brute: 'blunderbore',
  clawviper: 'clawviper',
  construct: 'construct',
  corruptrogue: 'corruptrogue',
  councilmember: 'councilmember',
  deathmauler: 'demon',
  demon: 'demon',
  doomknight: 'doomknight',
  fallen: 'fallen',
  fetish: 'fetish',
  fingermage: 'undead',
  foulcrow: 'vulturedemon',
  frogdemon: 'demon',
  frozenhorror: 'zombie',
  goatman: 'goatman',
  human: 'human',
  imp: 'fetish',
  megademon: 'megademon',
  minion: 'minion',
  mosquito: 'insect',
  mummy: 'mummy',
  overseer: 'overseer',
  pantherwoman: 'corruptrogue',
  putriddefiler: 'putriddefiler',
  quillrat: 'insect',
  regurgitator: 'blunderbore',
  sandleaper: 'sandleaper',
  sandmaggot: 'sandmaggot',
  sandraider: 'human',
  scarab: 'scarab',
  siegebeast: 'blunderbore',
  skeleton: 'skeleton',
  snowyeti: 'blunderbore',
  succubus: 'succubus',
  swarm: 'insect',
  tentacle: 'demon',
  thornhulk: 'blunderbore',
  undead: 'undead',
  undeadfetish: 'undeadfetish',
  unraveler: 'unraveler',
  vampire: 'vampire',
  vilekind: 'goatman',
  vulture: 'vulturedemon',
  willowisp: 'willowisp',
  wraith: 'willowisp',
  zakarum: 'councilmember',
  zombie: 'zombie',
};

/**
 * 取得怪物/首領之圖像網址（支援 Vite BASE_URL 動態適配）
 */
export function getMonsterImage(m: Pick<Monster, 'id' | 'type' | 'kind' | 'boss'> | { id: string; type?: string; kind?: string; boss?: boolean }): string {
  if (!m || !m.id) return '';
  const idKey = m.id.toLowerCase().trim();

  // 1. 優先以怪物的專屬 ID 查核（如 andariel, diablo, mephisto 等）
  let assetPath = MONSTER_IMAGE_FILES[idKey];

  // 2. 若無專屬 ID，以怪物種族家族 type 查核
  if (!assetPath && m.type) {
    const typeKey = m.type.toLowerCase().trim();
    const mappedKey = TYPE_FALLBACK_MAP[typeKey] || typeKey;
    assetPath = MONSTER_IMAGE_FILES[mappedKey];
  }

  // 3. 若仍無對應，以怪物大類 kind 查核
  if (!assetPath && m.kind) {
    const kindKey = m.kind.toLowerCase().trim();
    assetPath = MONSTER_IMAGE_FILES[kindKey];
  }

  // 4. 最後退回預設形象
  if (!assetPath) {
    assetPath = m.boss ? MONSTER_IMAGE_FILES.demon : MONSTER_IMAGE_FILES.other;
  }

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const prefix = env.endsWith('/') ? env : `${env}/`;
  return `${prefix}${assetPath}`;
}

/** 六大核心 Act Boss 與終極首領精選列表（提供怪物圖鑑頂部快速聚焦導航） */
export interface BossSpotlightItem {
  id: string;
  name: string;
  nameEn: string;
  act: number;
  title: string;
  titleEn: string;
}

export const MAJOR_BOSS_SPOTLIGHT: BossSpotlightItem[] = [
  { id: 'andariel', name: '安達莉爾', nameEn: 'Andariel', act: 1, title: '苦痛女王 (Act I)', titleEn: 'Maiden of Anguish' },
  { id: 'duriel', name: '都瑞爾', nameEn: 'Duriel', act: 2, title: '痛苦之王 (Act II)', titleEn: 'Lord of Pain' },
  { id: 'mephisto', name: '墨菲斯托', nameEn: 'Mephisto', act: 3, title: '憎恨之王 (Act III)', titleEn: 'Lord of Hatred' },
  { id: 'diablo', name: '迪亞布羅', nameEn: 'Diablo', act: 4, title: '恐懼之王 (Act IV)', titleEn: 'Lord of Terror' },
  { id: 'baalcrab', name: '巴爾', nameEn: 'Baal', act: 5, title: '毀滅之王 (Act V)', titleEn: 'Lord of Destruction' },
  { id: 'uberandariel', name: '莉莉絲', nameEn: 'Lilith', act: 5, title: '超級紅門女魔 (Lilith)', titleEn: 'Matron of Anguish' },
];
