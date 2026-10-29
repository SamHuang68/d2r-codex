import React, { useState } from 'react';
import { ItemIcon } from '../common/ItemIcon';
import { Sparkles, ArrowRight, Dices, ChevronDown, ChevronUp, Flame, Award, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface CubeCraftShowcaseProps {
  onNavigateToRune?: (runeNumber: number) => void;
  onScrollToRecipe?: (recipeId: string) => void;
}

interface CraftSpotlight {
  id: string;
  name: string;
  nameEn: string;
  category: 'craft' | 'upgrade' | 'socket';
  badge: string;
  badgeEn: string;
  tagline: string;
  taglineEn: string;
  inputs: { name: string; nameEn?: string; runeNum?: number; isGem?: boolean; isBase?: boolean }[];
  output: string;
  outputEn: string;
  inherentAffixes: string[];
  inherentAffixesEn: string[];
  ggRoll: string[];
  ggRollEn: string[];
  tacticalTip: string;
  tacticalTipEn: string;
  accent: 'purple' | 'red' | 'gold' | 'cyan';
}

const CRAFT_ITEMS: CraftSpotlight[] = [
  {
    id: 'craft_caster_amulet',
    name: '施法者手工項鍊',
    nameEn: 'Caster Amulet',
    category: 'craft',
    badge: '2/20 天花板',
    badgeEn: '+2/20% FCR Ceiling',
    tagline: '突破全法系 FCR 檔位的神級存在',
    taglineEn: 'The godly conduit for breaking top-tier FCR breakpoints',
    inputs: [
      { name: '魔法項鍊 (藍色)', nameEn: 'Magic Amulet (Blue)', isBase: true },
      { name: '8# 拉爾 (Ral)', nameEn: '#8 Ral', runeNum: 8 },
      { name: '完美紫寶石', nameEn: 'Perfect Amethyst', isGem: true },
      { name: '任意珠寶 (Jewel)', nameEn: 'Any Jewel' },
    ],
    output: '手工施法項鍊 (Caster Amulet)',
    outputEn: 'Crafted Caster Amulet',
    inherentAffixes: [
      '+5% 至 +10% 快速施法速度 (FCR)',
      '法力回復速度提高 +4% 至 +10%',
      '+10 至 +20 點法力',
    ],
    inherentAffixesEn: [
      '+5% to +10% Faster Cast Rate (FCR)',
      'Regenerate Mana +4% to +10%',
      '+10 to +20 Mana',
    ],
    ggRoll: [
      '+2 職業技能 (如魔法使 / 聖騎士 / 死靈)',
      '+10% 快速施法 (累計高達 +20% FCR 封頂)',
      '+20~30 點力量 或 +15~20 點敏捷',
      '所有抗性 +15~20% (或單抗 +30~40%)',
      '+40~60 點生命',
    ],
    ggRollEn: [
      '+2 Class Skills (Sorceress / Paladin / Necromancer)',
      '+10% FCR roll (stacking to maximum +20% FCR cap)',
      '+20~30 Strength or +15~20 Dexterity',
      'All Resistances +15~20% (or Single Res +30~40%)',
      '+40~60 Life',
    ],
    tacticalTip: '人物等級 93 級以上進行項鍊賭博，保證產出的項鍊 ilvl ≥ 88，方塊合成必出 +2 全職業技能與 20% FCR 的頂級池！',
    tacticalTipEn: 'Gamble amulets at character level 93+ to guarantee ilvl ≥ 88; crafted outputs will always be capable of rolling +2 Class Skills and 20% FCR!',
    accent: 'purple',
  },
  {
    id: 'craft_blood_gloves',
    name: '吸血鬼血腥手套',
    nameEn: 'Blood Gloves',
    category: 'craft',
    badge: '10% 壓碎手套',
    badgeEn: '10% Crushing Blow Gloves',
    tagline: '近戰雙熱與標馬打王頂級手部裝備',
    taglineEn: 'Top-tier gloves for Smiter, Zealot, and Javazon boss hunting',
    inputs: [
      { name: '魔法厚皮手套/鯊皮手套/吸血鬼骸骨手套', nameEn: 'Heavy/Sharkskin/Vampirebone Gloves', isBase: true },
      { name: '4# 奈夫 (Nef)', nameEn: '#4 Nef', runeNum: 4 },
      { name: '完美紅寶石', nameEn: 'Perfect Ruby', isGem: true },
      { name: '任意珠寶', nameEn: 'Any Jewel' },
    ],
    output: '手工血腥手套 (Blood Gloves)',
    outputEn: 'Crafted Blood Gloves',
    inherentAffixes: [
      '5% 至 10% 機率造成壓碎打擊 (CB)',
      '每次命中偷取 1% 至 3% 生命 (LL)',
      '+10 至 +20 點生命',
    ],
    inherentAffixesEn: [
      '5% to 10% Chance of Crushing Blow (CB)',
      '1% to 3% Life Stolen per Hit (LL)',
      '+10 to +20 Life',
    ],
    ggRoll: [
      '+2 標槍與長矛技能 (或弓弩/武學技能)',
      '+20% 增加攻擊速度 (IAS)',
      '10% 壓碎打擊 (CB 頂數值)',
      '+10~15 點力量 或 敏捷',
      '抗電抗火 +20~30%',
    ],
    ggRollEn: [
      '+2 Javelin & Spear Skills (or Bow/Martial Arts)',
      '+20% Increased Attack Speed (IAS)',
      '10% Crushing Blow (Max roll)',
      '+10~15 Strength or Dexterity',
      'Lightning or Fire Resistance +20~30%',
    ],
    tacticalTip: '標馬與雙熱近戰首選！自帶 10% 壓碎打擊與吸血，能同時洗出 +2 技能與 20% 攻速，打紅門六王神物。',
    tacticalTipEn: 'Prime pick for Javazons and Zealots! Innate 10% CB and Life Leech combined with +2 Skills and 20% IAS creates the ultimate Uber Tristram glove.',
    accent: 'red',
  },
  {
    id: 'craft_blood_ring',
    name: '血腥雙吸力量戒指',
    nameEn: 'Blood Ring',
    category: 'craft',
    badge: '力血雙吸神戒',
    badgeEn: 'Dual Leech Str Ring',
    tagline: '物理系野蠻人與近戰職業的終極戒指',
    taglineEn: 'The endgame ring for physical Barbarians and melee warriors',
    inputs: [
      { name: '魔法戒指 (藍色)', nameEn: 'Magic Ring (Blue)', isBase: true },
      { name: '12# 索爾 (Sol)', nameEn: '#12 Sol', runeNum: 12 },
      { name: '完美紅寶石', nameEn: 'Perfect Ruby', isGem: true },
      { name: '任意珠寶', nameEn: 'Any Jewel' },
    ],
    output: '手工血腥戒指 (Blood Ring)',
    outputEn: 'Crafted Blood Ring',
    inherentAffixes: [
      '+1 至 +5 點力量 (固定疊加)',
      '每次命中偷取 1% 至 3% 生命',
      '+10 至 +20 點生命',
    ],
    inherentAffixesEn: [
      '+1 to +5 Strength (Innate stack)',
      '1% to 3% Life Stolen per Hit',
      '+10 to +20 Life',
    ],
    ggRoll: [
      '每次命中偷取 6% 法力 (雙吸達成)',
      '+15~20 點額外力量 (累計最高 +25 力量)',
      '+10~15 點敏捷',
      '+30~40 點額外生命 (累計達 60 生命)',
      '所有抗性 +10~11%',
    ],
    ggRollEn: [
      '6% Mana Stolen per Hit (Dual Leech achieved)',
      '+15~20 Extra Strength (up to +25 Str total)',
      '+10~15 Dexterity',
      '+30~40 Extra Life (up to 60 Life total)',
      'All Resistances +10~11%',
    ],
    tacticalTip: '狂熱物理職業的最愛！固有力量生命與隨機雙吸屬性結合，是超越暗金戒指的終極畢業選擇。',
    tacticalTipEn: 'Favored by physical melee builds! Guaranteed Strength and Life combined with random Dual Leech outclasses unique rings in the endgame.',
    accent: 'gold',
  },
  {
    id: 'craft_caster_belt',
    name: '施法者手工腰帶',
    nameEn: 'Caster Belt',
    category: 'craft',
    badge: '10% FCR 腰帶',
    badgeEn: '10% FCR Belt',
    tagline: '少數提供 FCR 的腰帶（蜘蛛之網、基德的賭注等）',
    taglineEn: 'One of the few belts that grant Faster Cast Rate, such as Arachnid Mesh and Gheed\'s Wager',
    inputs: [
      { name: '魔法輕腰帶/鯊皮腰帶/吸血鬼牙腰帶', nameEn: 'Light/Sharkskin/Vampirefang Belt', isBase: true },
      { name: '6# 伊蘇 (Ith)', nameEn: '#6 Ith', runeNum: 6 },
      { name: '完美紫寶石', nameEn: 'Perfect Amethyst', isGem: true },
      { name: '任意珠寶', nameEn: 'Any Jewel' },
    ],
    output: '手工施法腰帶 (Caster Belt)',
    outputEn: 'Crafted Caster Belt',
    inherentAffixes: [
      '+5% 至 +10% 快速施法速度 (FCR)',
      '法力回復速度提高 +4% 至 +10%',
      '+10 至 +20 點法力',
    ],
    inherentAffixesEn: [
      '+5% to +10% Faster Cast Rate (FCR)',
      'Regenerate Mana +4% to +10%',
      '+10 to +20 Mana',
    ],
    ggRoll: [
      '+10% 快速施法速度 (FCR 頂值)',
      '+24% 快速打擊恢復 (FHR)',
      '+20~30 點力量',
      '+40~60 點生命',
      '單抗 +25~30%',
    ],
    ggRollEn: [
      '+10% Faster Cast Rate (10% FCR cap)',
      '+24% Faster Hit Recovery (FHR)',
      '+20~30 Strength',
      '+40~60 Life',
      'Single Resistance +25~30%',
    ],
    tacticalTip: '當配裝需要撐 105 或 200 FCR 極速檔位，但頭盔或戒指無法提供時，施法腰帶是不可或缺的救命關鍵。',
    tacticalTipEn: 'Crucial for hitting 105 or 200 FCR breakpoints when circlet or ring slots cannot sacrifice other essential mods.',
    accent: 'cyan',
  },
];

interface UpgradeSpotlight {
  id: string;
  targetRecipeId: string;
  name: string;
  nameEn: string;
  beforeItem: string;
  beforeItemEn: string;
  afterItem: string;
  afterItemEn: string;
  tierChange: string;
  tierChangeEn: string;
  formulaZh: string;
  formulaEn: string;
  formulaRunes: number[];
  gemZh: string;
  gemEn: string;
  benefits: string[];
  benefitsEn: string[];
  whyUpgrade: string;
  whyUpgradeEn: string;
}

const UPGRADE_ITEMS: UpgradeSpotlight[] = [
  {
    id: 'upgrade_unique_armor_excep_to_elite_viper',
    targetRecipeId: 'upgrade_unique_armor_excep_to_elite',
    name: '蛇魔法師之皮 ➔ 龍皮甲',
    nameEn: 'Skin of the Vipermagi ➔ Wyrmhide',
    beforeItem: '蛇魔法師之皮 (卓越)',
    beforeItemEn: 'Skin of the Vipermagi (Excep)',
    afterItem: '龍皮甲 (精英)',
    afterItemEn: 'Wyrmhide (Elite)',
    tierChange: '卓越階級 ➔ 精英階級',
    tierChangeEn: 'Exceptional ➔ Elite',
    formulaZh: '18# 科 (Ko) + 20# 藍姆 (Lem) + 完美鑽石 + 蛇魔法師之皮',
    formulaEn: '#18 Ko + #20 Lem + Perfect Diamond + Vipermagi',
    formulaRunes: [18, 20],
    gemZh: '完美鑽石',
    gemEn: 'Perfect Diamond',
    benefits: [
      '防禦力從 244 ~ 277 暴增至 800 ~ 1034 點！',
      '完整保留 +1 所有技能、30% 快速施法與 20~35 全抗',
      '需求力量僅需 84 點，法師與全法系皆可輕鬆穿戴',
    ],
    benefitsEn: [
      'Defense skyrockets from 279 to 800 ~ 1034!',
      'Fully retains +1 All Skills, 35% FCR, and +35 All Resistances.',
      'Only requires 84 Strength, easily wearable by any caster.',
    ],
    whyUpgrade: '全暗黑性價比第一的神甲升級。只需 18#+20#，立刻將卓越蛇魔法師之皮升級為防禦突破千點的精英神裝。',
    whyUpgradeEn: 'Best value armor upgrade in D2R. For just Ko + Lem, transforms Vipermagi into an elite defense body armor over 1000 Def.',
  },
  {
    id: 'upgrade_unique_armor_excep_to_elite_hoz',
    targetRecipeId: 'upgrade_unique_armor_excep_to_elite',
    name: '撒卡蘭姆使者 ➔ 撒卡蘭姆盾',
    nameEn: 'Herald of Zakarum ➔ Zakarum Shield',
    beforeItem: '金紋盾 (卓越)',
    beforeItemEn: 'Gilded Shield (Excep)',
    afterItem: '撒卡蘭姆盾 (精英)',
    afterItemEn: 'Zakarum Shield (Elite)',
    tierChange: '卓越階級 ➔ 精英階級',
    tierChangeEn: 'Exceptional ➔ Elite',
    formulaZh: '18# 科 (Ko) + 20# 藍姆 (Lem) + 完美鑽石 + 撒卡蘭姆使者',
    formulaEn: '#18 Ko + #20 Lem + Perfect Diamond + HoZ',
    formulaRunes: [18, 20],
    gemZh: '完美鑽石',
    gemEn: 'Perfect Diamond',
    benefits: [
      '基礎防禦力飆升至 507 點！',
      '盾牌重擊 (Smite) 基礎傷害從 20-28 暴增至 46-46 (翻倍以上)',
      '聖盾加成後物理輸出與格擋能力大幅提升',
    ],
    benefitsEn: [
      'Base defense surges to 507!',
      'Smite base damage jumps from 20-28 to 46-46 (more than double!)',
      'Dramatically elevates Smiter physical DPS against Uber Tristram bosses.',
    ],
    whyUpgrade: '近戰盾擊聖騎打紅門超級六王必備！重擊技能完全依賴盾牌基礎傷害，升級後每一下盾擊傷害直接翻倍。',
    whyUpgradeEn: 'Essential for Smiter Paladins tackling Uber Tristram! Smite scales off shield base damage; upgrading more than doubles your smiting punch.',
  },
  {
    id: 'upgrade_unique_weapon_excep_to_elite_titans',
    targetRecipeId: 'upgrade_unique_weapon_excep_to_elite',
    name: '泰坦的復仇 ➔ 女傑標槍',
    nameEn: "Titan's Revenge ➔ Matriarchal Javelin",
    beforeItem: '儀禮標槍 (卓越)',
    beforeItemEn: 'Ceremonial Javelin (Excep)',
    afterItem: '女傑標槍 (精英)',
    afterItemEn: 'Matriarchal Javelin (Elite)',
    tierChange: '卓越階級 ➔ 精英階級',
    tierChangeEn: 'Exceptional ➔ Elite',
    formulaZh: '17# 盧姆 (Lum) + 21# 普爾 (Pul) + 完美綠寶石 + 泰坦的復仇',
    formulaEn: '#17 Lum + #21 Pul + Perfect Emerald + Titan\'s Revenge',
    formulaRunes: [17, 21],
    gemZh: '完美綠寶石',
    gemEn: 'Perfect Emerald',
    benefits: [
      '投擲與近戰物理白字傷害大幅躍升',
      '物理吸血與法力偷取效益顯著增長',
      '無形自回版本升級後，近戰戳刺傷害極其可觀',
    ],
    benefitsEn: [
      'Greatly increases base physical throw and melee jab damage.',
      'Noticeably improves Life Leech and Mana Leech sustainability.',
      'Upgraded Ethereal self-replenishing Titans deals massive physical damage.',
    ],
    whyUpgrade: '標馬頂規標配。提升白字物理攻擊力，大幅加強面對電免怪物時使用物理攻擊偷血偷魔的續航生存力。',
    whyUpgradeEn: 'Endgame staple for Javazons. Amplifies physical damage to leech life and mana through lightning immune packs with ease.',
  },
  {
    id: 'upgrade_unique_armor_norm_to_excep_magefist',
    targetRecipeId: 'upgrade_unique_armor_norm_to_excep',
    name: '法師之拳 ➔ 戰鬥護手',
    nameEn: 'Magefist ➔ Battle Gauntlets',
    beforeItem: '輕型護手 (普通)',
    beforeItemEn: 'Light Gauntlets (Normal)',
    afterItem: '戰鬥護手 (卓越)',
    afterItemEn: 'Battle Gauntlets (Excep)',
    tierChange: '普通階級 ➔ 卓越階級',
    tierChangeEn: 'Normal ➔ Exceptional',
    formulaZh: '7# 塔爾 (Tal) + 13# 夏 (Shael) + 完美鑽石 + 法師之拳',
    formulaEn: '#7 Tal + #13 Shael + Perfect Diamond + Magefist',
    formulaRunes: [7, 13],
    gemZh: '完美鑽石',
    gemEn: 'Perfect Diamond',
    benefits: [
      '防禦力從 25 左右翻近三倍至 70 點以上',
      '僅需低階 7#+13# 符文，造價極其平民',
      '需求力量僅 88 點，施法職業開荒也能穿戴',
    ],
    benefitsEn: [
      'Nearly triples defense from 25 to 70+.',
      'Extremely cheap early ladder cost (Tal + Shael).',
      'Requires only 58 Strength, easily wearable by any caster.',
    ],
    whyUpgrade: '法系開荒最便宜的高收益升級。微小的符文代價換取穩定的基礎防禦強化，無損任何施法屬性。',
    whyUpgradeEn: 'Cheapest high-yield caster upgrade for early ladders. Free extra defense for negligible low rune costs with zero downside.',
  },
];

interface SocketRoulette {
  type: string;
  typeEn: string;
  runes: { num: number; name: string; nameEn: string }[];
  gem: string;
  gemEn: string;
  maxSockets: number;
  rollDetails: string;
  rollDetailsEn: string;
  bestUse: string;
  bestUseEn: string;
}

const SOCKET_ROULETTE: SocketRoulette[] = [
  {
    type: '武器打孔',
    typeEn: 'Weapon Socketing',
    runes: [
      { num: 8, name: '拉爾 Ral', nameEn: 'Ral (#8)' },
      { num: 11, name: '安姆 Amn', nameEn: 'Amn (#11)' },
    ],
    gem: '完美紫寶石',
    gemEn: 'Perfect Amethyst',
    maxSockets: 6,
    rollDetails: '隨機擲骰 1~6 點。若骰出點數大於該武器天然孔數上限，則自動截斷為最大孔數 (1/6 各等分機率)。',
    rollDetailsEn: 'Rolls randomly 1-6. If the roll exceeds the item\'s natural maximum sockets, it is capped at maximum (1/6 equal odds).',
    bestUse: '無形斬鐮 (搏 4 孔做無限/靈光)、無形狂戰斧 (搏 5 孔做死神)。',
    bestUseEn: 'Eth Thresher (hunting 4s for Infinity/Insight), Eth Berserker Axe (hunting 5s for Death).',
  },
  {
    type: '護甲打孔',
    typeEn: 'Body Armor Socketing',
    runes: [
      { num: 7, name: '塔爾 Tal', nameEn: 'Tal (#7)' },
      { num: 10, name: '書爾 Thul', nameEn: 'Thul (#10)' },
    ],
    gem: '完美黃寶石',
    gemEn: 'Perfect Topaz',
    maxSockets: 4,
    rollDetails: '隨機擲骰 1~6 點。大於 4 點均截斷為 4 孔（因此 4 孔機率高達 3/6 = 50%！3 孔為 1/6 約 16.7%）。',
    rollDetailsEn: 'Rolls randomly 1-6. Rolls of 4, 5, and 6 are capped at 4 sockets (granting a huge 50% chance for 4 sockets; 16.7% for 3s).',
    bestUse: '無形神聖戰甲/漆護鎧甲 (搏 4 孔做剛毅/石塊)、法師鎧甲 (搏 3 孔做謎團)。',
    bestUseEn: 'Eth Sacred Armor/Lacquered Plate (hunting 4s for Fortitude/Stone), Mage Plate (hunting 3s for Enigma).',
  },
  {
    type: '頭盔打孔',
    typeEn: 'Helm Socketing',
    runes: [
      { num: 8, name: '拉爾 Ral', nameEn: 'Ral (#8)' },
      { num: 10, name: '書爾 Thul', nameEn: 'Thul (#10)' },
    ],
    gem: '完美藍寶石',
    gemEn: 'Perfect Sapphire',
    maxSockets: 3,
    rollDetails: '隨機擲骰 1~6 點。大於 3 點均截斷為 3 孔（因此 3 孔機率高達 4/6 = 66.7%！2 孔為 1/6 約 16.7%）。',
    rollDetailsEn: 'Rolls randomly 1-6. Rolls of 3, 4, 5, and 6 are capped at 3 sockets (granting a massive 66.7% chance for 3 sockets).',
    bestUse: '權冠/頭飾 (搏 3 孔做夢境/迪勒瑞姆)、野蠻人專用頭盔 (搏 3 孔做精神錯亂)。',
    bestUseEn: 'Diadems/Tiara (hunting 3s for Dream/Delirium), Barbarian Helms (+3 BO hunting 3s).',
  },
  {
    type: '盾牌打孔',
    typeEn: 'Shield Socketing',
    runes: [
      { num: 7, name: '塔爾 Tal', nameEn: 'Tal (#7)' },
      { num: 11, name: '安姆 Amn', nameEn: 'Amn (#11)' },
    ],
    gem: '完美紅寶石',
    gemEn: 'Perfect Ruby',
    maxSockets: 4,
    rollDetails: '隨機擲骰 1~6 點。4、5、6 點皆截斷為 4 孔（因此 4 孔機率高達 50%！）。',
    rollDetailsEn: 'Rolls randomly 1-6. Rolls of 4, 5, and 6 are capped at 4 sockets (granting a 50% chance for 4 sockets).',
    bestUse: '君主盾 (搏 4 孔做精神盾)、聖騎士高全抗專用盾 (神聖小盾搏 4 孔)。',
    bestUseEn: 'Monarch (hunting 4s for Spirit), Paladin high All-Res shields (Sacred Targe hunting 4s).',
  },
];

export const CubeCraftShowcase: React.FC<CubeCraftShowcaseProps> = ({
  onNavigateToRune,
  onScrollToRecipe,
}) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'crafts' | 'upgrades' | 'roulette'>('crafts');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getAccentStyles = (accent: CraftSpotlight['accent']) => {
    switch (accent) {
      case 'purple':
        return {
          border: 'border-purple-600/40 hover:border-purple-400/80',
          badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-600/50',
          titleColor: 'text-purple-300',
          halo: 'from-purple-950/30 to-sanctuary-950',
        };
      case 'red':
        return {
          border: 'border-red-600/40 hover:border-red-400/80',
          badgeBg: 'bg-red-950/70 text-red-300 border-red-600/50',
          titleColor: 'text-red-300',
          halo: 'from-red-950/30 to-sanctuary-950',
        };
      case 'gold':
        return {
          border: 'border-amber-600/40 hover:border-amber-400/80',
          badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-600/50',
          titleColor: 'text-amber-300',
          halo: 'from-amber-950/30 to-sanctuary-950',
        };
      case 'cyan':
      default:
        return {
          border: 'border-cyan-600/40 hover:border-cyan-400/80',
          badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-600/50',
          titleColor: 'text-cyan-300',
          halo: 'from-cyan-950/30 to-sanctuary-950',
        };
    }
  };

  return (
    <div className="mb-8 rounded-3xl bg-sanctuary-900/80 border border-sanctuary-800 shadow-2xl overflow-hidden transition-all duration-300">
      {/* 展廳頂部導航列 */}
      <div className="p-4 sm:p-5 border-b border-sanctuary-800/80 bg-gradient-to-r from-sanctuary-950 via-sanctuary-900 to-sanctuary-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-d2-magic/10 border border-d2-magic/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(105,105,255,0.25)]">
            <Sparkles className="w-5 h-5 text-d2-magic animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-diablo text-lg sm:text-xl font-bold text-sanctuary-100 flex items-center gap-2">
                <span>{isEn ? 'Horadric Transmutation Master Hall' : '方塊煉金極品工藝與跨階升級展廳'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-d2-magic/20 text-d2-magic border border-d2-magic/40 font-mono font-bold">
                  MASTER ALCHEMY
                </span>
              </h2>
            </div>
            <p className="text-xs text-sanctuary-400 mt-0.5">
              {isEn
                ? 'Spotlight on GG Crafted Item rolls, iconic Unique upgrades, and Base Socketing odds.'
                : '四大極品手工神裝追求、經典暗金裝備跨階升級效益，以及白色底材打孔博弈輪盤精確機率。'}
            </p>
          </div>
        </div>

        {/* 分頁切換與展開收合控制項 */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="inline-flex rounded-xl border border-sanctuary-750 bg-sanctuary-950 p-1 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'crafts'}
              onClick={() => setActiveTab('crafts')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'crafts'
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-600/50 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isEn ? 'GG Crafts (4)' : '四大手工神裝 (4)'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'upgrades'}
              onClick={() => setActiveTab('upgrades')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'upgrades'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-d2-fire" />
              <span>{isEn ? 'Unique Upgrades (4)' : '經典暗金升級 (4)'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'roulette'}
              onClick={() => setActiveTab('roulette')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'roulette'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? 'Socket Roulette' : '打孔博弈輪盤'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-sanctuary-950 border border-sanctuary-750 text-sanctuary-400 hover:text-white transition-colors"
            title={isExpanded ? (isEn ? 'Collapse' : '收合展廳') : (isEn ? 'Expand' : '展開展廳')}
            aria-label={isExpanded ? (isEn ? 'Collapse showcase' : '收合展廳') : (isEn ? 'Expand showcase' : '展開展廳')}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 展廳內容主體 */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-sanctuary-950/50">
          {/* Tab 1: 四大極品手工神裝 (GG Crafts) */}
          {activeTab === 'crafts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {CRAFT_ITEMS.map((item) => {
                const styles = getAccentStyles(item.accent);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl bg-gradient-to-b ${styles.halo} border ${styles.border} p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl`}
                  >
                    <div>
                      {/* 卡片標題與榮譽標籤 */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-800">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className={`font-diablo text-lg font-bold ${styles.titleColor}`}>
                              {isEn ? item.nameEn : item.name}
                            </h3>
                            {!isEn && item.nameEn && (
                              <span className="text-xs text-sanctuary-400 font-mono italic">
                                ({item.nameEn})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-sanctuary-300 font-mono mt-0.5">
                            {isEn ? item.taglineEn : item.tagline}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold shrink-0 ${styles.badgeBg}`}>
                          {isEn ? item.badgeEn : item.badge}
                        </span>
                      </div>

                      {/* 投入材料插槽視覺化 (Input Ingredients) */}
                      <div className="my-3 p-2.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800/80 shadow-inner">
                        <div className="text-[10px] text-sanctuary-400 font-mono mb-2 flex items-center justify-between">
                          <span>{isEn ? 'Required Ingredients:' : '方塊煉金材料：'}</span>
                          <span className="text-[9px] text-d2-magic">{isEn ? 'All 4 Required' : '4件齊全'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.inputs.map((inp, idx) => (
                            <React.Fragment key={idx}>
                              {idx > 0 && <Plus className="w-3 h-3 text-sanctuary-500 shrink-0" />}
                              {inp.runeNum ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigateToRune?.(inp.runeNum!);
                                  }}
                                  className="group/rune flex items-center gap-1 px-2 py-1 rounded-lg bg-sanctuary-900 border border-d2-rune/40 hover:border-d2-rune text-[11px] text-d2-rune hover:text-white font-mono transition-all cursor-pointer shadow-sm"
                                  title={isEn ? `View Rune #${inp.runeNum}` : `點擊查看 ${inp.runeNum}# 符文`}
                                >
                                  <ItemIcon runeNumber={inp.runeNum} size="xs" showBorder={false} />
                                  <span>{isEn && inp.nameEn ? inp.nameEn : inp.name}</span>
                                </button>
                              ) : (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200 font-mono">
                                  <ItemIcon name={inp.name} size="xs" showBorder={false} />
                                  <span className="truncate max-w-[120px]">{isEn && inp.nameEn ? inp.nameEn : inp.name}</span>
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* 固定詞綴與畢業天花板詞綴 */}
                      <div className="space-y-3 my-3">
                        <div className="p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850">
                          <div className="text-[10px] font-mono text-sanctuary-400 font-bold mb-1">
                            {isEn ? 'Inherent Base Affixes (Guaranteed):' : '✨ 方塊固有詞綴 (每次必出)：'}
                          </div>
                          {(isEn ? item.inherentAffixesEn : item.inherentAffixes).map((aff, aIdx) => (
                            <div key={aIdx} className="text-[11px] text-sanctuary-200 leading-snug flex items-center gap-1">
                              <span className="text-d2-magic font-bold">•</span>
                              <span>{aff}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-sanctuary-900/80 border border-amber-600/30">
                          <div className="text-[10px] font-mono text-d2-gold font-bold mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-d2-gold" />
                            <span>{isEn ? 'GG Roll Goals (Trophy Cap):' : '🏆 頂級天價畢業詞綴 (GG Roll)：'}</span>
                          </div>
                          {(isEn ? item.ggRollEn : item.ggRoll).map((gg, gIdx) => (
                            <div key={gIdx} className="text-[11px] text-amber-200/90 leading-snug flex items-center gap-1">
                              <span className="text-d2-unique font-bold">★</span>
                              <span>{gg}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 專家戰略提示 */}
                      <p className="text-[11px] text-sanctuary-400 italic bg-sanctuary-900/40 p-2 rounded-lg border border-sanctuary-850/60 leading-relaxed mb-4">
                        💡 {isEn ? item.tacticalTipEn : item.tacticalTip}
                      </p>
                    </div>

                    {/* 底部跳轉按鈕 */}
                    <button
                      type="button"
                      onClick={() => onScrollToRecipe?.(item.id)}
                      className="w-full py-1.5 px-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-d2-magic text-xs text-d2-magic font-medium flex items-center justify-center gap-1.5 transition-all shadow group/btn"
                    >
                      <span>{isEn ? 'Jump to Recipe Details' : '定位配方詳細說明'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: 經典暗金跨階升級 (Iconic Unique Upgrades) */}
          {activeTab === 'upgrades' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {UPGRADE_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-gradient-to-b from-amber-950/30 to-sanctuary-950 border border-amber-600/40 hover:border-amber-400/80 p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
                >
                  <div>
                    {/* 標題與階層跨越標籤 */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-800">
                      <div>
                        <h3 className="font-diablo text-lg font-bold text-amber-300">
                          {isEn ? item.nameEn : item.name}
                        </h3>
                        {!isEn && item.nameEn && (
                          <div className="text-[11px] text-sanctuary-400 font-mono italic">
                            {item.nameEn}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50 font-mono font-bold shrink-0">
                        {isEn ? item.tierChangeEn : item.tierChange}
                      </span>
                    </div>

                    {/* 前後底材對照徽章 */}
                    <div className="my-3 p-3 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800 flex items-center justify-between text-xs">
                      <div className="text-center space-y-1">
                        <div className="text-[10px] text-sanctuary-400 font-mono">{isEn ? 'Original Base' : '原版底材'}</div>
                        <div className="text-sanctuary-200 font-bold">{isEn ? item.beforeItemEn : item.beforeItem}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-center space-y-1">
                        <div className="text-[10px] text-amber-400 font-mono">{isEn ? 'Upgraded Base' : '升級後底材'}</div>
                        <div className="text-d2-unique font-bold">{isEn ? item.afterItemEn : item.afterItem}</div>
                      </div>
                    </div>

                    {/* 升級公式原料圖騰 */}
                    <div className="my-3 p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 text-xs">
                      <div className="text-[10px] text-sanctuary-400 font-mono mb-1.5">
                        {isEn ? 'Upgrade Formula:' : '升級所需材料：'}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 font-mono">
                        {item.formulaRunes.map((rNum) => (
                          <button
                            key={rNum}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToRune?.(rNum);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-d2-rune/40 hover:border-d2-rune text-[11px] text-d2-rune hover:text-white"
                            title={isEn ? `View Rune #${rNum}` : `查看 ${rNum}# 符文`}
                          >
                            <ItemIcon runeNumber={rNum} size="xs" showBorder={false} />
                            <span>{rNum}#</span>
                          </button>
                        ))}
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200">
                          <ItemIcon name={item.gemZh} size="xs" showBorder={false} />
                          <span>{isEn ? item.gemEn : item.gemZh}</span>
                        </span>
                      </div>
                    </div>

                    {/* 升級核心增益 */}
                    <div className="space-y-1.5 my-3 p-2.5 rounded-xl bg-sanctuary-900/40 border border-sanctuary-850">
                      <div className="text-[10px] font-mono text-sanctuary-400 font-bold mb-1">
                        {isEn ? 'Key Upgrade Benefits:' : '升級核心增益：'}
                      </div>
                      {(isEn ? item.benefitsEn : item.benefits).map((benefit, bIdx) => (
                        <div key={bIdx} className="text-[11px] text-sanctuary-200 leading-snug flex items-center gap-1">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* 為何值得升級 */}
                    <p className="text-[11px] text-sanctuary-400 italic bg-sanctuary-900/40 p-2 rounded-lg border border-sanctuary-850/60 leading-relaxed mb-4">
                      💡 <strong>{isEn ? 'Why Upgrade: ' : '為何值得升級：'}</strong>{isEn ? item.whyUpgradeEn : item.whyUpgrade}
                    </p>
                  </div>

                  {/* 底部跳轉按鈕 */}
                  <button
                    type="button"
                    onClick={() => onScrollToRecipe?.(item.targetRecipeId)}
                    className="w-full py-1.5 px-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-amber-400/80 text-xs text-amber-300 font-medium flex items-center justify-center gap-1.5 transition-all shadow group/btn"
                  >
                    <span>{isEn ? 'View Recipe in Table' : '定位配方詳細說明'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: 底材打孔博弈輪盤 (Socketing Roulette) */}
          {activeTab === 'roulette' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {SOCKET_ROULETTE.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-gradient-to-b from-emerald-950/20 to-sanctuary-950 border border-emerald-600/40 hover:border-emerald-400/80 p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
                >
                  <div>
                    {/* 標題與類型 */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-800">
                      <div>
                        <h3 className="font-diablo text-lg font-bold text-emerald-300 flex items-center gap-1.5">
                          <Dices className="w-4 h-4 text-emerald-400" />
                          <span>{isEn ? item.typeEn : item.type}</span>
                        </h3>
                        {!isEn && item.typeEn && (
                          <div className="text-[11px] text-sanctuary-400 font-mono italic">
                            {item.typeEn}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-mono font-bold shrink-0">
                        {isEn ? `Max ${item.maxSockets} Sockets` : `最大 ${item.maxSockets} 孔`}
                      </span>
                    </div>

                    {/* 打孔公式材料 */}
                    <div className="my-3 p-2.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800/80">
                      <div className="text-[10px] text-sanctuary-400 font-mono mb-1.5">
                        {isEn ? 'Socketing Ingredients:' : '打孔固定材料：'}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 font-mono">
                        {item.runes.map((r) => (
                          <button
                            key={r.num}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToRune?.(r.num);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-d2-rune/40 hover:border-d2-rune text-[11px] text-d2-rune hover:text-white"
                            title={isEn ? `View Rune #${r.num}` : `查看 ${r.num}# 符文`}
                          >
                            <ItemIcon runeNumber={r.num} size="xs" showBorder={false} />
                            <span>{isEn ? r.nameEn : r.name}</span>
                          </button>
                        ))}
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200">
                          <ItemIcon name={item.gem} size="xs" showBorder={false} />
                          <span>{isEn ? item.gemEn : item.gem}</span>
                        </span>
                      </div>
                    </div>

                    {/* 機率與規則 */}
                    <div className="p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 text-xs space-y-1.5 my-3">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        {isEn ? '🎲 Rolling & Cap Mechanics:' : '🎲 擲骰與截斷機制：'}
                      </div>
                      <p className="text-[11px] text-sanctuary-200 leading-relaxed">
                        {isEn ? item.rollDetailsEn : item.rollDetails}
                      </p>
                    </div>

                    {/* 最佳底材用途 */}
                    <div className="p-2.5 rounded-xl bg-sanctuary-900/40 border border-sanctuary-850 text-xs space-y-1 my-3">
                      <div className="text-[10px] font-mono text-sanctuary-400 font-bold">
                        {isEn ? '🎯 Premier Targets:' : '🎯 最常打孔目標：'}
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
                        {isEn ? item.bestUseEn : item.bestUse}
                      </p>
                    </div>
                  </div>

                  {/* 提示備註 */}
                  <div className="text-[10px] text-sanctuary-500 font-mono pt-2 border-t border-sanctuary-850">
                    {isEn
                      ? '⚠ Normal & Eth plain bases only (Superior cannot be cube-socketed, use Larzuk)'
                      : '⚠ 僅限白色普通與無形白裝（特等 Superior 無法方塊打孔，需找第五章拉蘇克）'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
