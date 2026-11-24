/**
 * 職業角色圖像管理模組 (Character Class Images & Profiles)
 * 提供 8 大職業之官方規格高解析度角色形象立繪與頭像路徑。
 */

const CLASS_NORMALIZATION_MAP: Record<string, string> = {
  // IDs & English
  warlock: 'warlock',
  sorceress: 'sorceress',
  paladin: 'paladin',
  amazon: 'amazon',
  necromancer: 'necromancer',
  barbarian: 'barbarian',
  druid: 'druid',
  assassin: 'assassin',

  // Codes
  war: 'warlock',
  sor: 'sorceress',
  pal: 'paladin',
  ama: 'amazon',
  nec: 'necromancer',
  bar: 'barbarian',
  dru: 'druid',
  ass: 'assassin',

  // Chinese Names
  '術士': 'warlock',
  '魔法使': 'sorceress',
  '法師': 'sorceress',
  '聖騎士': 'paladin',
  '亞馬遜': 'amazon',
  '死靈法師': 'necromancer',
  '野蠻人': 'barbarian',
  '德魯伊': 'druid',
  '刺客': 'assassin',

  // Capitalized English
  Warlock: 'warlock',
  Sorceress: 'sorceress',
  Paladin: 'paladin',
  Amazon: 'amazon',
  Necromancer: 'necromancer',
  Barbarian: 'barbarian',
  Druid: 'druid',
  Assassin: 'assassin',
};

function resolveClassBase(idOrName: string): { prefix: string; id: string } | null {
  if (!idOrName) return null;
  const key = idOrName.toLowerCase().trim();
  const id = CLASS_NORMALIZATION_MAP[idOrName] || CLASS_NORMALIZATION_MAP[key] || 'sorceress';

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const prefix = env.endsWith('/') ? env : `${env}/`;
  return { prefix, id };
}

/**
 * 取得指定職業之立繪/形象圖 (Profile / Spotlight Image)
 * 資源置於 public/images/classes/{id}.webp，為 834x470 高解析度官方/高階美術立繪。
 */
export function getClassImage(idOrName: string): string {
  const resolved = resolveClassBase(idOrName);
  if (!resolved) return '';
  return `${resolved.prefix}images/classes/${resolved.id}.webp`;
}

/**
 * 取得職業立繪之響應式 srcset（160w 頭像縮圖、420w 行動版、640w 桌機卡片、834w 原圖）。
 */
export function getClassImageSrcSet(idOrName: string): string {
  const resolved = resolveClassBase(idOrName);
  if (!resolved) return '';
  const { prefix, id } = resolved;
  return [
    `${prefix}images/classes/${id}-160.webp 160w`,
    `${prefix}images/classes/${id}-420.webp 420w`,
    `${prefix}images/classes/${id}-640.webp 640w`,
    `${prefix}images/classes/${id}.webp 834w`,
  ].join(', ');
}
