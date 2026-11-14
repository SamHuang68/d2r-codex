import type { GameIconName } from './gameIconPaths';

/**
 * 各主題圖示對應的遊戲內圖樣（皆為站內 public/images 既有的遊戲素材，不另行繪製）。
 * 路徑相對於 public/images；沒有列在這裡的名稱會退回向量圖示。
 */
export const GAME_ICON_IMAGES: Partial<Record<GameIconName, string>> = {
  gate: 'shrines/portal.gif', // 主頁：城鎮傳送門
  patch: 'items/jewels/fire.gif', // 版本改動：彩虹刻面珠寶
  helm: 'items/bases/arreats_face.gif', // 角色：亞瑞特的面容（職業頭盔）
  tree: 'shrines/skill_bonus.gif', // 技能：技能聖壇
  anvil: 'items/bases/archon_plate.gif', // 配裝模擬：統御者鎧甲
  steps: 'shrines/stamina_bonus.gif', // 機制斷點：耐力聖壇
  levelup: 'shrines/experience_bonus.gif', // 經驗值表：經驗聖壇
  flag: 'shrines/well.gif', // 練等場景：泉水
  swords: 'mercenaries/act1_rogue.jpg', // 傭兵：第一章俠盜斥候
  sword: 'items/uniques/harlequin_crest.gif', // 裝備寶典：軍帽
  upgrade: 'items/bases/colossus_blade.gif', // 暗金升級：巨神刃
  rune: 'items/runes/ber.png', // 符文之語：Ber 符文
  shield: 'items/bases/monarch.gif', // 底材：君主盾
  stone: 'items/runes/el.png', // 符文寶庫：El 符文
  flask: 'items/props/full_rejuvenation.gif', // 道具：全效回復藥劑
  cube: 'items/props/horadric_cube.gif', // 方塊：赫拉迪克方塊
  tag: 'items/charms/grand_charm.gif', // 詞綴：超大型護身符
  gem: 'items/props/perfect_diamond.gif', // 估價：完美的鑽石
  grail: 'items/uniques/the_stone_of_jordan.gif', // 聖杯：喬丹之石
  scroll: 'monsters/radament.png', // 任務：拉達曼特
  map: 'shrines/tainted.gif', // 場景恐區：受污染聖壇
  chest: 'items/charms/gheeds.gif', // 打寶：基德的財富
  demon: 'items/bases/demonhead.gif', // 怪物：惡魔頭蓋骨
  altar: 'shrines/shrine.gif', // 聖壇
  skull: 'items/charms/torch.jpg', // 紅門：地獄火炬
};

/**
 * 取得主題圖示的遊戲圖樣網址（支援 Vite BASE_URL）。
 * @param name 圖示名稱
 * @returns 圖片網址；沒有對應圖樣時回傳 undefined
 */
export function gameIconImageUrl(name: GameIconName): string | undefined {
  const rel = GAME_ICON_IMAGES[name];
  if (!rel) return undefined;
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const prefix = env.endsWith('/') ? env : `${env}/`;
  return `${prefix}images/${rel}`;
}
