/**
 * 聖壇視覺資產解析模組 (Shrine Visual Assets Resolver)
 * 提供遊戲內全部 22 種聖壇與神聖之井的原版動畫圖標、增益光環與立柱圖檔。
 */

export interface ShrineVisualInfo {
  icon: string;
  pillar: string;
  accentColor: string;
  glowColor: string;
}

const SHRINE_VISUAL_MAP: Record<number, { icon: string; accentColor: string; glowColor: string }> = {
  // 1: 回復聖壇 (Refilling)
  1: { icon: 'images/shrines/fullrejuvination.gif', accentColor: 'text-purple-400', glowColor: 'border-purple-500/50 bg-purple-500/10' },
  // 2: 生命聖壇 (Health)
  2: { icon: 'images/items/props/super_healing.gif', accentColor: 'text-red-400', glowColor: 'border-red-500/50 bg-red-500/10' },
  // 3: 法力聖壇 (Mana)
  3: { icon: 'images/items/props/super_mana.gif', accentColor: 'text-blue-400', glowColor: 'border-blue-500/50 bg-blue-500/10' },
  // 4: 生命交換聖壇 (Health Exchange - 未使用)
  4: { icon: 'images/items/props/super_mana.gif', accentColor: 'text-rose-400', glowColor: 'border-rose-500/40 bg-rose-500/10' },
  // 5: 法力交換聖壇 (Mana Exchange - 未使用)
  5: { icon: 'images/items/props/super_healing.gif', accentColor: 'text-sky-400', glowColor: 'border-sky-500/40 bg-sky-500/10' },
  // 6: 護甲聖壇 (Armor)
  6: { icon: 'images/shrines/armor_bonus.gif', accentColor: 'text-amber-300', glowColor: 'border-amber-500/50 bg-amber-500/10' },
  // 7: 作戰聖壇 (Combat)
  7: { icon: 'images/shrines/combat_bonus.gif', accentColor: 'text-orange-400', glowColor: 'border-orange-500/50 bg-orange-500/10' },
  // 8: 抗火聖壇 (Resist Fire)
  8: { icon: 'images/shrines/resistfire.gif', accentColor: 'text-d2-fire', glowColor: 'border-d2-fire/50 bg-d2-fire/10' },
  // 9: 抗寒聖壇 (Resist Cold)
  9: { icon: 'images/shrines/resistcold.gif', accentColor: 'text-d2-cold', glowColor: 'border-d2-cold/50 bg-d2-cold/10' },
  // 10: 抗電聖壇 (Resist Lightning)
  10: { icon: 'images/shrines/resistlightning.gif', accentColor: 'text-yellow-300', glowColor: 'border-yellow-500/50 bg-yellow-500/10' },
  // 11: 抗毒聖壇 (Resist Poison)
  11: { icon: 'images/shrines/resistpoison.gif', accentColor: 'text-d2-poison', glowColor: 'border-d2-poison/50 bg-d2-poison/10' },
  // 12: 技能聖壇 (Skill)
  12: { icon: 'images/shrines/skill_bonus.gif', accentColor: 'text-d2-gold', glowColor: 'border-d2-gold/50 bg-d2-gold/10' },
  // 13: 法力恢復聖壇 (Mana Recharge)
  13: { icon: 'images/shrines/manarecharge.gif', accentColor: 'text-cyan-400', glowColor: 'border-cyan-500/50 bg-cyan-500/10' },
  // 14: 精力聖壇 (Stamina)
  14: { icon: 'images/shrines/stamina_bonus.gif', accentColor: 'text-emerald-400', glowColor: 'border-emerald-500/50 bg-emerald-500/10' },
  // 15: 經驗聖壇 (Experience)
  15: { icon: 'images/shrines/experience_bonus.gif', accentColor: 'text-d2-magic', glowColor: 'border-d2-magic/60 bg-d2-magic/15 shadow-[0_0_15px_rgba(105,105,255,0.25)]' },
  // 16: 壇聖聖壇 (Enirhs - 未使用)
  16: { icon: 'images/shrines/shrine-used.png', accentColor: 'text-sanctuary-400', glowColor: 'border-sanctuary-700 bg-sanctuary-900/60' },
  // 17: 傳送聖壇 (Portal)
  17: { icon: 'images/shrines/portal.gif', accentColor: 'text-blue-400', glowColor: 'border-blue-500/50 bg-blue-500/10' },
  // 18: 寶石聖壇 (Gem)
  18: { icon: 'images/shrines/gem_bonus.gif', accentColor: 'text-fuchsia-400', glowColor: 'border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]' },
  // 19: 火焰聖壇 (Fire)
  19: { icon: 'images/shrines/fire_ball.gif', accentColor: 'text-red-500', glowColor: 'border-red-600/50 bg-red-600/10' },
  // 20: 怪物聖壇 (Monster)
  20: { icon: 'images/shrines/tainted.gif', accentColor: 'text-d2-unique', glowColor: 'border-d2-unique/50 bg-d2-unique/10' },
  // 21: 爆炸聖壇 (Exploding)
  21: { icon: 'images/shrines/explodingpotion.gif', accentColor: 'text-orange-500', glowColor: 'border-orange-500/50 bg-orange-500/10' },
  // 22: 劇毒聖壇 (Poison)
  22: { icon: 'images/shrines/chokinggaspotion.gif', accentColor: 'text-lime-400', glowColor: 'border-lime-500/50 bg-lime-500/10' },
};

/**
 * 取得聖壇的視覺圖標、立柱背景與主題樣式
 */
export function getShrineVisual(code: number): ShrineVisualInfo {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;

  const item = SHRINE_VISUAL_MAP[code] || {
    icon: 'images/shrines/shrine.gif',
    accentColor: 'text-sanctuary-200',
    glowColor: 'border-sanctuary-800 bg-sanctuary-900/40',
  };

  return {
    icon: `${baseUrl}${item.icon}`,
    pillar: `${baseUrl}images/shrines/shrine.gif`,
    accentColor: item.accentColor,
    glowColor: item.glowColor,
  };
}
