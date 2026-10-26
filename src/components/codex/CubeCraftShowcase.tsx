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
  tagline: string;
  inputs: { name: string; runeNum?: number; isGem?: boolean; isBase?: boolean }[];
  output: string;
  inherentAffixes: string[];
  ggRoll: string[];
  tacticalTip: string;
  accent: 'purple' | 'red' | 'gold' | 'cyan';
}

const CRAFT_ITEMS: CraftSpotlight[] = [
  {
    id: 'craft_caster_amulet',
    name: '施法者手工項鍊',
    nameEn: 'Caster Amulet',
    category: 'craft',
    badge: '2/20 天花板',
    tagline: '突破全法系 FCR 檔位的神級存在',
    inputs: [
      { name: '魔法項鍊 (藍色)', isBase: true },
      { name: '8# 拉爾 (Ral)', runeNum: 8 },
      { name: '完美紫寶石', isGem: true },
      { name: '任意珠寶 (Jewel)' },
    ],
    output: '手工施法項鍊 (Caster Amulet)',
    inherentAffixes: [
      '+5% 至 +10% 快速施法速度 (FCR)',
      '法力回復速度提高 +4% 至 +10%',
      '+10 至 +20 點法力',
    ],
    ggRoll: [
      '+2 職業技能 (如魔法使 / 聖騎士 / 死靈)',
      '+10% 快速施法 (累計高達 +20% FCR 封頂)',
      '+20~30 點力量 或 +15~20 點敏捷',
      '所有抗性 +15~20% (或單抗 +30~40%)',
      '+40~60 點生命',
    ],
    tacticalTip: '人物等級 93 級以上進行項鍊賭博，保證產出的項鍊 ilvl ≥ 88，方塊合成必出 +2 全職業技能與 20% FCR 的頂級池！',
    accent: 'purple',
  },
  {
    id: 'craft_blood_gloves',
    name: '吸血鬼血腥手套',
    nameEn: 'Blood Gloves',
    category: 'craft',
    badge: '10% 壓碎手套',
    tagline: '近戰雙熱與標馬打王頂級手部裝備',
    inputs: [
      { name: '魔法厚皮手套/鯊皮手套/吸血鬼骸骨手套', isBase: true },
      { name: '4# 奈夫 (Nef)', runeNum: 4 },
      { name: '完美紅寶石', isGem: true },
      { name: '任意珠寶' },
    ],
    output: '手工血腥手套 (Blood Gloves)',
    inherentAffixes: [
      '5% 至 10% 機率造成壓碎打擊 (CB)',
      '每次命中偷取 1% 至 3% 生命 (LL)',
      '+10 至 +20 點生命',
    ],
    ggRoll: [
      '+2 標槍與長矛技能 (或弓弩/武學技能)',
      '+20% 增加攻擊速度 (IAS)',
      '10% 壓碎打擊 (CB 頂數值)',
      '+10~15 點力量 或 敏捷',
      '抗電抗火 +20~30%',
    ],
    tacticalTip: '標馬與雙熱近戰首選！自帶 10% 壓碎打擊與吸血，能同時洗出 +2 技能與 20% 攻速，打紅門六王神物。',
    accent: 'red',
  },
  {
    id: 'craft_blood_ring',
    name: '血腥雙吸力量戒指',
    nameEn: 'Blood Ring',
    category: 'craft',
    badge: '力血雙吸神戒',
    tagline: '物理系野蠻人與近戰職業的終極戒指',
    inputs: [
      { name: '魔法戒指 (藍色)', isBase: true },
      { name: '12# 索爾 (Sol)', runeNum: 12 },
      { name: '完美紅寶石', isGem: true },
      { name: '任意珠寶' },
    ],
    output: '手工血腥戒指 (Blood Ring)',
    inherentAffixes: [
      '+1 至 +5 點力量 (固定疊加)',
      '每次命中偷取 1% 至 3% 生命',
      '+10 至 +20 點生命',
    ],
    ggRoll: [
      '每次命中偷取 6% 法力 (雙吸達成)',
      '+15~20 點額外力量 (累計最高 +25 力量)',
      '+10~15 點敏捷',
      '+30~40 點額外生命 (累計達 60 生命)',
      '所有抗性 +10~11%',
    ],
    tacticalTip: '狂熱物理職業的最愛！固有力量生命與隨機雙吸屬性結合，是超越暗金戒指的終極畢業選擇。',
    accent: 'gold',
  },
  {
    id: 'craft_caster_belt',
    name: '施法者手工腰帶',
    nameEn: 'Caster Belt',
    category: 'craft',
    badge: '10% FCR 腰帶',
    tagline: '除蜘蛛之網外全遊戲唯一提供 FCR 的腰帶',
    inputs: [
      { name: '魔法輕腰帶/鯊皮腰帶/吸血鬼牙腰帶', isBase: true },
      { name: '6# 伊蘇 (Ith)', runeNum: 6 },
      { name: '完美紫寶石', isGem: true },
      { name: '任意珠寶' },
    ],
    output: '手工施法腰帶 (Caster Belt)',
    inherentAffixes: [
      '+5% 至 +10% 快速施法速度 (FCR)',
      '法力回復速度提高 +4% 至 +10%',
      '+10 至 +20 點法力',
    ],
    ggRoll: [
      '+10% 快速施法速度 (FCR 頂值)',
      '+24% 快速打擊恢復 (FHR)',
      '+20~30 點力量',
      '+40~60 點生命',
      '單抗 +25~30%',
    ],
    tacticalTip: '當配裝需要撐 105 或 200 FCR 極速檔位，但頭盔或戒指無法提供時，施法腰帶是不可或缺的救命關鍵。',
    accent: 'cyan',
  },
];

interface UpgradeSpotlight {
  id: string;
  targetRecipeId: string;
  name: string;
  nameEn: string;
  beforeItem: string;
  afterItem: string;
  tierChange: string;
  formulaZh: string;
  formulaRunes: number[];
  gemZh: string;
  benefits: string[];
  whyUpgrade: string;
}

const UPGRADE_ITEMS: UpgradeSpotlight[] = [
  {
    id: 'upgrade_unique_armor_excep_to_elite_viper',
    targetRecipeId: 'upgrade_unique_armor_excep_to_elite',
    name: '蛇魔法師之皮 ➔ 龍皮甲',
    nameEn: 'Skin of the Vipermagi ➔ Wyrmhide',
    beforeItem: '蛇魔法師之皮 (卓越)',
    afterItem: '龍皮甲 (精英)',
    tierChange: '卓越階級 ➔ 精英階級',
    formulaZh: '18# 科 (Ko) + 20# 藍姆 (Lem) + 完美鑽石 + 蛇魔法師之皮',
    formulaRunes: [18, 20],
    gemZh: '完美鑽石',
    benefits: [
      '防禦力從 279 暴增至 800 ~ 1034 點！',
      '完整保留 +1 所有技能、35% 快速施法與 35 全抗',
      '需求力量僅需 84 點，法師與全法系皆可輕鬆穿戴',
    ],
    whyUpgrade: '全暗黑性價比第一的神甲升級。只需 18#+20#，立刻將卓越蛇魔法師之皮升級為防禦突破千點的精英神裝。',
  },
  {
    id: 'upgrade_unique_armor_excep_to_elite_hoz',
    targetRecipeId: 'upgrade_unique_armor_excep_to_elite',
    name: '撒卡蘭姆使者 ➔ 撒卡蘭姆盾',
    nameEn: 'Herald of Zakarum ➔ Zakarum Shield',
    beforeItem: '金紋盾 (卓越)',
    afterItem: '撒卡蘭姆盾 (精英)',
    tierChange: '卓越階級 ➔ 精英階級',
    formulaZh: '18# 科 (Ko) + 20# 藍姆 (Lem) + 完美鑽石 + 撒卡蘭姆使者',
    formulaRunes: [18, 20],
    gemZh: '完美鑽石',
    benefits: [
      '基礎防禦力飆升至 507 點！',
      '盾牌重擊 (Smite) 基礎傷害從 20-28 暴增至 46-46 (翻倍以上)',
      '聖盾加成後物理輸出與格擋能力大幅提升',
    ],
    whyUpgrade: '近戰盾擊聖騎打紅門超級六王必備！重擊技能完全依賴盾牌基礎傷害，升級後每一下盾擊傷害直接翻倍。',
  },
  {
    id: 'upgrade_unique_weapon_excep_to_elite_titans',
    targetRecipeId: 'upgrade_unique_weapon_excep_to_elite',
    name: '泰坦的復仇 ➔ 女傑標槍',
    nameEn: "Titan's Revenge ➔ Matriarchal Javelin",
    beforeItem: '儀禮標槍 (卓越)',
    afterItem: '女傑標槍 (精英)',
    tierChange: '卓越階級 ➔ 精英階級',
    formulaZh: '17# 盧姆 (Lum) + 21# 普爾 (Pul) + 完美綠寶石 + 泰坦的復仇',
    formulaRunes: [17, 21],
    gemZh: '完美綠寶石',
    benefits: [
      '投擲與近戰物理白字傷害大幅躍升',
      '物理吸血與法力偷取效益顯著增長',
      '無形自回版本升級後，近戰戳刺傷害極其可觀',
    ],
    whyUpgrade: '標馬頂規標配。提升白字物理攻擊力，大幅加強面對電免怪物時使用物理攻擊偷血偷魔的續航生存力。',
  },
  {
    id: 'upgrade_unique_armor_norm_to_excep_magefist',
    targetRecipeId: 'upgrade_unique_armor_norm_to_excep',
    name: '法師之拳 ➔ 戰鬥護手',
    nameEn: 'Magefist ➔ Battle Gauntlets',
    beforeItem: '輕型護手 (普通)',
    afterItem: '戰鬥護手 (卓越)',
    tierChange: '普通階級 ➔ 卓越階級',
    formulaZh: '7# 塔爾 (Tal) + 13# 夏 (Shael) + 完美鑽石 + 法師之拳',
    formulaRunes: [7, 13],
    gemZh: '完美鑽石',
    benefits: [
      '防禦力從 25 左右翻近三倍至 70 點以上',
      '僅需低階 7#+13# 符文，造價極其平民',
      '需求力量僅 58 點，任何職業開荒隨手可升',
    ],
    whyUpgrade: '法系開荒最便宜的高收益升級。微小的符文代價換取穩定的基礎防禦強化，無損任何施法屬性。',
  },
];

interface SocketRoulette {
  type: string;
  typeEn: string;
  runes: { num: number; name: string }[];
  gem: string;
  maxSockets: number;
  rollDetails: string;
  bestUse: string;
}

const SOCKET_ROULETTE: SocketRoulette[] = [
  {
    type: '武器打孔',
    typeEn: 'Weapon Socketing',
    runes: [
      { num: 8, name: '拉爾 Ral' },
      { num: 11, name: '安姆 Amn' },
    ],
    gem: '完美紫寶石',
    maxSockets: 6,
    rollDetails: '隨機擲骰 1 至 6 孔 (均等機率；若超過底材孔數上限則截斷為最大孔)',
    bestUse: '水晶劍洗 4 孔 (精神)、長柄/長矛洗 4 孔 (眼光/無限)、幻化之刃洗 5 孔 (悔恨)',
  },
  {
    type: '胸甲打孔',
    typeEn: 'Body Armor Socketing',
    runes: [
      { num: 7, name: '塔爾 Tal' },
      { num: 10, name: '書爾 Thul' },
    ],
    gem: '完美黃寶石',
    maxSockets: 4,
    rollDetails: '隨機擲骰 1 至 4 孔 (均等 1/4 機率)',
    bestUse: '無形精英鎧甲洗 4 孔 (剛毅/石塊) 或 3 孔 (背信/謎團)',
  },
  {
    type: '盾牌打孔',
    typeEn: 'Shield Socketing',
    runes: [
      { num: 7, name: '塔爾 Tal' },
      { num: 11, name: '安姆 Amn' },
    ],
    gem: '完美紅寶石',
    maxSockets: 4,
    rollDetails: '隨機擲骰 1 至 6 孔；因盾牌上限大多為 4 孔，擲出 4/5/6 皆判定為 4 孔 (高達 50% 成功率！)',
    bestUse: '君主盾 (精神盾) 洗 4 孔 (50% 命中率！)、聖騎士專用盾 (高全抗底材) 洗孔',
  },
  {
    type: '頭盔打孔',
    typeEn: 'Helm Socketing',
    runes: [
      { num: 8, name: '拉爾 Ral' },
      { num: 10, name: '書爾 Thul' },
    ],
    gem: '完美藍寶石',
    maxSockets: 3,
    rollDetails: '隨機擲骰 1 至 6 孔；擲出 3/4/5/6 皆判定為 3 孔 (高達 66.7% 獲得 3 孔！)',
    bestUse: '惡魔頭蓋骨面具/權冠洗 3 孔 (閃爍火焰/治癒/夢境底材)',
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
            aria-label={isExpanded ? '收合展廳' : '展開展廳'}
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
                              {item.name}
                            </h3>
                            <span className="text-xs text-sanctuary-400 font-mono italic">
                              ({item.nameEn})
                            </span>
                          </div>
                          <div className="text-[11px] text-sanctuary-300 font-mono mt-0.5">
                            {item.tagline}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold shrink-0 ${styles.badgeBg}`}>
                          {item.badge}
                        </span>
                      </div>

                      {/* 投入材料插槽視覺化 (Input Ingredients) */}
                      <div className="my-3 p-2.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800/80 shadow-inner">
                        <div className="text-[10px] text-sanctuary-400 font-mono mb-2 flex items-center justify-between">
                          <span>{isEn ? 'Required Ingredients:' : '方塊煉金材料：'}</span>
                          <span className="text-[9px] text-d2-magic">4件齊全</span>
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
                                  title={`點擊查看 ${inp.runeNum}# 符文`}
                                >
                                  <ItemIcon runeNumber={inp.runeNum} size="xs" showBorder={false} />
                                  <span>{inp.name}</span>
                                </button>
                              ) : (
                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200 font-mono">
                                  <ItemIcon name={inp.name} size="xs" showBorder={false} />
                                  <span className="truncate max-w-[120px]">{inp.name}</span>
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
                            {isEn ? 'Inherent Base Affixes:' : '✨ 方塊固有詞綴 (每次必出)：'}
                          </div>
                          {item.inherentAffixes.map((aff, aIdx) => (
                            <div key={aIdx} className="text-[11px] text-sanctuary-200 leading-snug flex items-center gap-1">
                              <span className="text-d2-magic font-bold">•</span>
                              <span>{aff}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-2.5 rounded-xl bg-sanctuary-900/80 border border-amber-600/30">
                          <div className="text-[10px] font-mono text-d2-gold font-bold mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-d2-gold" />
                            <span>{isEn ? 'GG Roll Goals:' : '🏆 頂級天價畢業詞綴 (GG Roll)：'}</span>
                          </div>
                          {item.ggRoll.map((gg, gIdx) => (
                            <div key={gIdx} className="text-[11px] text-amber-200/90 leading-snug flex items-center gap-1">
                              <span className="text-d2-unique font-bold">★</span>
                              <span>{gg}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 專家戰略提示 */}
                      <p className="text-[11px] text-sanctuary-400 italic bg-sanctuary-900/40 p-2 rounded-lg border border-sanctuary-850/60 leading-relaxed mb-4">
                        💡 {item.tacticalTip}
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
                          {item.name}
                        </h3>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {item.nameEn}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/50 font-mono font-bold shrink-0">
                        {item.tierChange}
                      </span>
                    </div>

                    {/* 前後底材對照徽章 */}
                    <div className="my-3 p-3 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800 flex items-center justify-between text-xs">
                      <div className="text-center space-y-1">
                        <div className="text-[10px] text-sanctuary-400 font-mono">原版底材</div>
                        <div className="text-sanctuary-200 font-bold">{item.beforeItem}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-center space-y-1">
                        <div className="text-[10px] text-amber-400 font-mono">升級後底材</div>
                        <div className="text-d2-unique font-bold">{item.afterItem}</div>
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
                            title={`查看 ${rNum}# 符文`}
                          >
                            <ItemIcon runeNumber={rNum} size="xs" showBorder={false} />
                            <span>{rNum}#</span>
                          </button>
                        ))}
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200">
                          <ItemIcon name={item.gemZh} size="xs" showBorder={false} />
                          <span>{item.gemZh}</span>
                        </span>
                      </div>
                    </div>

                    {/* 升級實質效益清單 */}
                    <div className="space-y-1.5 my-3 p-2.5 rounded-xl bg-sanctuary-900/40 border border-sanctuary-850">
                      <div className="text-[10px] font-mono text-amber-300 font-bold mb-1">
                        ⚡ 實戰質變收益：
                      </div>
                      {item.benefits.map((ben, bIdx) => (
                        <div key={bIdx} className="text-[11px] text-sanctuary-200 leading-snug flex items-start gap-1">
                          <span className="text-amber-400 shrink-0">•</span>
                          <span>{ben}</span>
                        </div>
                      ))}
                    </div>

                    {/* 戰略理由引言 */}
                    <p className="text-[11px] text-sanctuary-400 italic bg-sanctuary-900/40 p-2 rounded-lg border border-sanctuary-850/60 leading-relaxed mb-4">
                      💡 {item.whyUpgrade}
                    </p>
                  </div>

                  {/* 底部按鈕 */}
                  <button
                    type="button"
                    onClick={() => onScrollToRecipe?.(item.targetRecipeId)}
                    className="w-full py-1.5 px-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-amber-400 text-xs text-amber-300 font-medium flex items-center justify-center gap-1.5 transition-all shadow group/btn"
                  >
                    <span>{isEn ? 'View Formula Details' : '查看完整配方細節'}</span>
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
                          <span>{item.type}</span>
                        </h3>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {item.typeEn}
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-mono font-bold shrink-0">
                        最大 {item.maxSockets} 孔
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
                            title={`查看 ${r.num}# 符文`}
                          >
                            <ItemIcon runeNumber={r.num} size="xs" showBorder={false} />
                            <span>{r.name}</span>
                          </button>
                        ))}
                        <span className="flex items-center gap-1 px-2 py-1 rounded bg-sanctuary-900 border border-sanctuary-750 text-[11px] text-sanctuary-200">
                          <ItemIcon name={item.gem} size="xs" showBorder={false} />
                          <span>{item.gem}</span>
                        </span>
                      </div>
                    </div>

                    {/* 機率與規則 */}
                    <div className="p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 text-xs space-y-1.5 my-3">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold">
                        🎲 擲骰與截斷機制：
                      </div>
                      <p className="text-[11px] text-sanctuary-200 leading-relaxed">
                        {item.rollDetails}
                      </p>
                    </div>

                    {/* 最佳底材用途 */}
                    <div className="p-2.5 rounded-xl bg-sanctuary-900/40 border border-sanctuary-850 text-xs space-y-1 my-3">
                      <div className="text-[10px] font-mono text-sanctuary-400 font-bold">
                        🎯 最常打孔目標：
                      </div>
                      <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
                        {item.bestUse}
                      </p>
                    </div>
                  </div>

                  {/* 提示備註 */}
                  <div className="text-[10px] text-sanctuary-500 font-mono pt-2 border-t border-sanctuary-850">
                    ⚠ 僅限白色普通與無形白裝（特等 Superior 無法方塊打孔，需找第五章拉蘇克）
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
