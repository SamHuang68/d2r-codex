import React, { useState } from 'react';
import { ItemIcon } from '../common/ItemIcon';
import { BASE_ITEMS_DATA } from '../../data/bases';
import { Crown, ShieldCheck, Sparkles, ArrowRight, ChevronDown, ChevronUp, Zap, Flame, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface RunewordShowcaseProps {
  onSelectRuneword: (runewordId: string, sockets: number) => void;
  onNavigateToRune?: (runeNumber: number) => void;
  onNavigateToBase?: (baseName: string) => void;
}

interface ShowcaseItem {
  id: string;
  name: string;
  nameEn: string;
  alias?: string;
  category: 'iconic' | 'starter';
  sockets: number;
  runes: { num: number; nameZh: string; nameEn: string }[];
  allowedBasesZh: string;
  reqLevel: number;
  highlightTag: string;
  quote: string;
  keyAffixes: string[];
  recommendedBase: string;
  baseRepEn: string;
  accentColor: 'gold' | 'emerald' | 'cyan' | 'purple';
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  // 四大終極信仰神裝 (Iconic Endgame)
  {
    id: 'enigma',
    name: '謎團',
    nameEn: 'Enigma',
    category: 'iconic',
    sockets: 3,
    runes: [
      { num: 31, nameZh: '喬', nameEn: 'Jah' },
      { num: 6, nameZh: '伊蘇', nameEn: 'Ith' },
      { num: 30, nameZh: '貝', nameEn: 'Ber' },
    ],
    allowedBasesZh: '護甲 (3 孔)',
    reqLevel: 65,
    highlightTag: '全職業自由傳送・刷怪質變天花板',
    quote: '賦予所有職業法師專屬的傳送術，改寫暗黑破壞神二代生態的無上神甲。',
    keyAffixes: [
      '+1 傳送 (Teleport)',
      '+2 所有技能',
      '+0.75 力量 (依角色等級)',
      '受到的物理傷害降低 8%',
      '尋獲魔法物品機率提高 1% 每級 (MF)',
    ],
    recommendedBase: '法師鎧甲 / 統御者鎧甲',
    baseRepEn: 'Archon Plate',
    accentColor: 'gold',
  },
  {
    id: 'infinity',
    name: '無限',
    nameEn: 'Infinity',
    category: 'iconic',
    sockets: 4,
    runes: [
      { num: 30, nameZh: '貝', nameEn: 'Ber' },
      { num: 23, nameZh: '馬爾', nameEn: 'Mal' },
      { num: 30, nameZh: '貝', nameEn: 'Ber' },
      { num: 24, nameZh: '伊斯特', nameEn: 'Ist' },
    ],
    allowedBasesZh: '長柄武器 / 長矛 (4 孔)',
    reqLevel: 63,
    highlightTag: '12 級審判靈氣・元素破免終極神兵',
    quote: '法系純電與元素流派的絕對終點，極大化傭兵輸出與全屏破抗能力。',
    keyAffixes: [
      '裝備時賦予 12 級審判靈氣 (降低敵人抗性與防禦)',
      '-45% 至 -55% 敵人電擊抗性',
      '40% 機率造成壓碎打擊 (CB)',
      '+35% 高速跑步 / 行走',
      '+255-325% 強化傷害',
    ],
    recommendedBase: '無形斬鐮 / 無形巨長斧',
    baseRepEn: 'Thresher',
    accentColor: 'purple',
  },
  {
    id: 'grief',
    name: '悔恨',
    nameEn: 'Grief',
    category: 'iconic',
    sockets: 5,
    runes: [
      { num: 5, nameZh: '愛斯', nameEn: 'Eth' },
      { num: 3, nameZh: '特爾', nameEn: 'Tir' },
      { num: 28, nameZh: '羅', nameEn: 'Lo' },
      { num: 23, nameZh: '馬爾', nameEn: 'Mal' },
      { num: 14, nameZh: '多爾', nameEn: 'Dol' },
    ],
    allowedBasesZh: '刀劍 / 斧 (5 孔)',
    reqLevel: 59,
    highlightTag: '近戰白字直傷之神・熱誠狂熱雙天花板',
    quote: '直接賦予高達 +400 點絕對傷害疊加，近戰物理系無可爭議的唯一頂級神器。',
    keyAffixes: [
      '傷害 +340 到 +400 (白字實傷直接疊加)',
      '+30% 到 +40% 攻擊速度 (IAS)',
      '無視目標防禦',
      '20% 機率造成致命打擊 (DS)',
      '-25% 目標防禦',
    ],
    recommendedBase: '幻化之刃 / 狂戰斧',
    baseRepEn: 'Phase Blade',
    accentColor: 'emerald',
  },
  {
    id: 'fortitude',
    name: '剛毅',
    nameEn: 'Fortitude',
    category: 'iconic',
    sockets: 4,
    runes: [
      { num: 1, nameZh: '艾爾', nameEn: 'El' },
      { num: 12, nameZh: '索爾', nameEn: 'Sol' },
      { num: 14, nameZh: '多爾', nameEn: 'Dol' },
      { num: 28, nameZh: '羅', nameEn: 'Lo' },
    ],
    allowedBasesZh: '武器 / 護甲 (4 孔)',
    reqLevel: 59,
    highlightTag: '+300% 強化傷害・近戰與傭兵不敗堡壘',
    quote: '無可比擬的 300% 強化傷害、巨額全抗與寒冰裝甲，兼顧極致輸出與鋼鐵生存。',
    keyAffixes: [
      '+300% 強化傷害 (ED)',
      '全屬性抗性 +25 到 +30',
      '受擊時 20% 機率施展 15 級寒冰裝甲',
      '+1 到 1.5 生命 (依角色等級)',
      '+200% 防禦強化',
    ],
    recommendedBase: '無形神聖鎧甲 / 統御者鎧甲',
    baseRepEn: 'Archon Plate',
    accentColor: 'cyan',
  },

  // 四大平民拓荒神器 (Starter MVPs)
  {
    id: 'spirit',
    name: '精神',
    nameEn: 'Spirit',
    category: 'starter',
    sockets: 4,
    runes: [
      { num: 7, nameZh: '塔爾', nameEn: 'Tal' },
      { num: 10, nameZh: '書爾', nameEn: 'Thul' },
      { num: 9, nameZh: '歐特', nameEn: 'Ort' },
      { num: 11, nameZh: '安姆', nameEn: 'Amn' },
    ],
    allowedBasesZh: '刀劍 / 盾牌 (4 孔)',
    reqLevel: 25,
    highlightTag: '雙精神成形質變・全法系拓荒無冕之王',
    quote: '25 級即可裝備，超平民符文卻擁有媲美頂級暗金的 +2 全技能與巨額施法速度。',
    keyAffixes: [
      '+2 所有技能',
      '+25% 到 +35% 快速施法速度 (FCR)',
      '+55% 快速打擊恢復 (FHR)',
      '+89 到 +112 法力',
      '盾牌版：電/冰/毒抗各 +35% (劍版含物理吸血與元素傷)',
    ],
    recommendedBase: '水晶劍 (4孔) / 君主盾',
    baseRepEn: 'Monarch',
    accentColor: 'cyan',
  },
  {
    id: 'insight',
    name: '靈光',
    nameEn: 'Insight',
    alias: '眼光',
    category: 'starter',
    sockets: 4,
    runes: [
      { num: 8, nameZh: '拉爾', nameEn: 'Ral' },
      { num: 3, nameZh: '特爾', nameEn: 'Tir' },
      { num: 7, nameZh: '塔爾', nameEn: 'Tal' },
      { num: 12, nameZh: '索爾', nameEn: 'Sol' },
    ],
    allowedBasesZh: '長柄武器 / 法杖 / 弓 (4 孔)',
    reqLevel: 27,
    highlightTag: '冥想靈氣無限泉湧・拓荒必備永動機',
    quote: '讓米山傭兵為全隊提供每秒巨額法力回復，徹底告別拓荒回魔焦慮。',
    keyAffixes: [
      '裝備時賦予 12 到 17 級冥想靈氣 (法力回復 +575~700%)',
      '+200% 到 +260% 強化傷害 (ED)',
      '+1 到 +6 雙熱 / 致命攻勢',
      '+35% 快速施法速度 (FCR)',
      '23% 尋獲魔法物品機率提高 (MF)',
    ],
    recommendedBase: '巨神之斧 / 戰鬥長柄武器 / 巨神之弩',
    baseRepEn: 'Thresher',
    accentColor: 'emerald',
  },
  {
    id: 'smoke',
    name: '煙霧',
    nameEn: 'Smoke',
    category: 'starter',
    sockets: 2,
    runes: [
      { num: 4, nameZh: '奈夫', nameEn: 'Nef' },
      { num: 17, nameZh: '盧姆', nameEn: 'Lum' },
    ],
    allowedBasesZh: '護甲 (2 孔)',
    reqLevel: 37,
    highlightTag: '+50 全抗救急・進軍地獄首選防暴斃甲',
    quote: '僅需一顆 17 號中階符文，立即補足進入地獄難度時急缺的 50 點全屬性抗性。',
    keyAffixes: [
      '所有屬性抗性 +50',
      '+20% 快速打擊恢復 (FHR)',
      '+280 對遠程攻擊防禦',
      '+10 活力',
      '-1 照亮範圍 (弱化受敵視距)',
    ],
    recommendedBase: '法師鎧甲 / 幽靈之鎧 / 統御者鎧甲',
    baseRepEn: 'Archon Plate',
    accentColor: 'gold',
  },
  {
    id: 'treachery',
    name: '背信',
    nameEn: 'Treachery',
    alias: '背叛',
    category: 'starter',
    sockets: 3,
    runes: [
      { num: 13, nameZh: '夏', nameEn: 'Shael' },
      { num: 10, nameZh: '書爾', nameEn: 'Thul' },
      { num: 20, nameZh: '藍姆', nameEn: 'Lem' },
    ],
    allowedBasesZh: '護甲 (3 孔)',
    reqLevel: 43,
    highlightTag: '45% 攻速狂飆・受擊觸發影散',
    quote: '受擊時 5% 觸發 15 級影散，提供高達 15% 物理減傷與 60 點全抗，傭兵終極戰甲。',
    keyAffixes: [
      '受擊時 5% 機率施展 15 級影散 (Fade)',
      '【消解效果】+60 全抗性、15% 物理減傷、縮短詛咒時間 79%',
      '+45% 增加攻擊速度 (IAS)',
      '+20% 快速打擊恢復 (FHR)',
      '+2 刺客技能',
    ],
    recommendedBase: '無形漆甲 / 灰暮罩衣 / 法師鎧甲',
    baseRepEn: 'Archon Plate',
    accentColor: 'purple',
  },
];

export const RunewordShowcase: React.FC<RunewordShowcaseProps> = ({
  onSelectRuneword,
  onNavigateToRune,
  onNavigateToBase,
}) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'iconic' | 'starter'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const filteredItems = SHOWCASE_ITEMS.filter((item) => {
    if (activeTab === 'iconic') return item.category === 'iconic';
    if (activeTab === 'starter') return item.category === 'starter';
    return true;
  });

  const baseImg = (nameEn: string) => {
    const b = BASE_ITEMS_DATA.find((i) => i.nameEn === nameEn);
    return { name: b?.name, nameEn: b?.nameEn, baseItem: b?.name, rarity: 'normal' as const, imageUrl: b?.imageUrl };
  };

  const getAccentStyles = (accent: ShowcaseItem['accentColor']) => {
    switch (accent) {
      case 'gold':
        return {
          border: 'border-amber-600/40 hover:border-amber-400/80',
          badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-600/50',
          titleColor: 'text-amber-300',
          halo: 'from-amber-950/30 to-sanctuary-950',
          slotBorder: 'border-amber-700/50',
          arrowColor: 'text-amber-400',
        };
      case 'emerald':
        return {
          border: 'border-emerald-600/40 hover:border-emerald-400/80',
          badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/50',
          titleColor: 'text-emerald-300',
          halo: 'from-emerald-950/30 to-sanctuary-950',
          slotBorder: 'border-emerald-700/50',
          arrowColor: 'text-emerald-400',
        };
      case 'purple':
        return {
          border: 'border-purple-600/40 hover:border-purple-400/80',
          badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-600/50',
          titleColor: 'text-purple-300',
          halo: 'from-purple-950/30 to-sanctuary-950',
          slotBorder: 'border-purple-700/50',
          arrowColor: 'text-purple-400',
        };
      case 'cyan':
      default:
        return {
          border: 'border-cyan-600/40 hover:border-cyan-400/80',
          badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-600/50',
          titleColor: 'text-cyan-300',
          halo: 'from-cyan-950/30 to-sanctuary-950',
          slotBorder: 'border-cyan-700/50',
          arrowColor: 'text-cyan-400',
        };
    }
  };

  return (
    <div className="mb-8 rounded-2xl bg-sanctuary-900/80 border border-sanctuary-800 shadow-2xl overflow-hidden transition-all duration-300">
      {/* 展廳頂部導航列與狀態切換 */}
      <div className="p-4 sm:p-5 border-b border-sanctuary-800/80 bg-gradient-to-r from-sanctuary-950 via-sanctuary-900 to-sanctuary-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-glow-gold/20">
            <Crown className="w-5 h-5 text-d2-gold animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-diablo text-lg sm:text-xl font-bold text-sanctuary-100 flex items-center gap-2">
                <span>{isEn ? 'Legendary Runewords Hall of Fame' : '符文之語信仰與開荒名人堂'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-d2-gold/20 text-d2-gold border border-d2-gold/40 font-mono font-bold">
                  TOP 8 ICONIC
                </span>
              </h2>
            </div>
            <p className="text-xs text-sanctuary-400 mt-0.5">
              {isEn
                ? 'Iconic Big Four endgame runewords & MVP starter gears. Inscription sockets order visualized.'
                : '四大終極信仰神裝與四大平民拓荒神器全貌，依序標註符文插槽順序與核心戰略價值。'}
            </p>
          </div>
        </div>

        {/* 控制項：分類切換分頁與展開/收合按鈕 */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="inline-flex rounded-xl border border-sanctuary-750 bg-sanctuary-950 p-1 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-sanctuary-800 text-d2-unique font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'All (8)' : '全部展廳 (8)'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'iconic'}
              onClick={() => setActiveTab('iconic')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'iconic'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-d2-gold" />
              <span>{isEn ? 'Endgame Big 4' : '四大終極信仰'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'starter'}
              onClick={() => setActiveTab('starter')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'starter'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-sanctuary-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? 'Starter MVPs' : '四大平民拓荒'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-sanctuary-950 border border-sanctuary-750 text-sanctuary-400 hover:text-white transition-colors"
            title={isExpanded ? (isEn ? 'Collapse Showcase' : '收合展廳') : (isEn ? 'Expand Showcase' : '展開展廳')}
            aria-label={isExpanded ? '收合展廳' : '展開展廳'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 展廳內容主體 */}
      {isExpanded && (
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 bg-sanctuary-950/50">
          {filteredItems.map((item) => {
            const styles = getAccentStyles(item.accentColor);
            return (
              <div
                key={item.id}
                className={`group rounded-2xl bg-gradient-to-b ${styles.halo} border ${styles.border} p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl relative overflow-hidden`}
              >
                {/* 頂部裝飾背景光暈 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-d2-gold/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* 卡片標題與代表裝備圖標 */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-sanctuary-800">
                    <div className="flex items-center gap-3">
                      <ItemIcon
                        {...baseImg(item.baseRepEn)}
                        rarity="runeword"
                        size="md"
                        showBorder={true}
                        className="shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className={`font-diablo text-xl font-bold ${styles.titleColor} tracking-wide`}>
                            {item.name}
                          </h3>
                          <span className="text-xs text-sanctuary-400 font-mono italic">
                            ({item.nameEn})
                          </span>
                          {item.alias && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sanctuary-800 text-sanctuary-300 font-medium">
                              俗稱 {item.alias}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-sanctuary-400 font-mono mt-0.5">
                          {item.allowedBasesZh} • Lv {item.reqLevel}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold shrink-0 ${styles.badgeBg}`}>
                      {item.category === 'iconic' ? (isEn ? 'ENDGAME' : '終極神裝') : (isEn ? 'STARTER' : '平民神器')}
                    </span>
                  </div>

                  {/* 特色亮點標籤與引言 */}
                  <div className="my-3">
                    <div className="text-xs font-bold text-sanctuary-200 flex items-center gap-1.5 bg-sanctuary-900/80 px-2.5 py-1.5 rounded-lg border border-sanctuary-800">
                      {item.category === 'iconic' ? (
                        <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate">{item.highlightTag}</span>
                    </div>
                    <p className="text-[11px] text-sanctuary-400 italic mt-1.5 px-0.5 leading-relaxed line-clamp-2">
                      「{item.quote}」
                    </p>
                  </div>

                  {/* 符文鑲嵌先後順序槽位視覺化 (Socket Slots Sequence) */}
                  <div className="my-3 p-2.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800/80 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-sanctuary-400 font-mono mb-2">
                      <span className="flex items-center gap-1 text-d2-rune font-bold">
                        <Award className="w-3 h-3 text-d2-rune" />
                        {isEn ? 'Socket Inscription Order' : '符文鑲嵌嚴格順序'}
                      </span>
                      <span className="text-[9px] text-sanctuary-500">⚠ 順序不可錯</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {item.runes.map((rune, rIdx) => (
                        <React.Fragment key={rune.num}>
                          {rIdx > 0 && (
                            <ArrowRight className={`w-3.5 h-3.5 ${styles.arrowColor} shrink-0 opacity-70`} />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToRune?.(rune.num);
                            }}
                            className={`group/slot flex flex-col items-center justify-center p-1.5 rounded-lg bg-sanctuary-900/90 border ${styles.slotBorder} hover:border-d2-rune hover:bg-sanctuary-800 transition-all cursor-pointer min-w-[50px] shadow-sm`}
                            title={`點擊跳轉至 ${rune.num}# ${rune.nameZh} (${rune.nameEn}) 符文寶庫屬性`}
                          >
                            <span className="text-[9px] font-mono text-sanctuary-500 leading-none mb-1 group-hover/slot:text-amber-300">
                              #{rIdx + 1}
                            </span>
                            <ItemIcon runeNumber={rune.num} size="xs" showBorder={false} />
                            <span className="text-[10px] font-mono font-bold text-d2-rune group-hover/slot:text-white leading-none mt-1">
                              {rune.num}# {rune.nameZh}
                            </span>
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* 核心詞綴清單 */}
                  <div className="space-y-1 text-xs text-d2-magic font-sans pt-1 mb-4">
                    <div className="text-[11px] font-mono text-sanctuary-400 font-semibold mb-1">
                      {isEn ? 'Core Affixes:' : '核心質變屬性：'}
                    </div>
                    {item.keyAffixes.map((affix, aIdx) => (
                      <div key={aIdx} className="leading-snug text-[11px] flex items-start gap-1">
                        <span className="text-sanctuary-500 shrink-0">•</span>
                        <span>{affix}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部動作列：推薦底材與跳轉按鈕 */}
                <div className="pt-3 border-t border-sanctuary-850 flex flex-col gap-2">
                  <div className="text-[10px] text-sanctuary-400 flex items-center justify-between">
                    <span>{isEn ? 'Best Base:' : '推薦底材：'}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToBase?.(item.recommendedBase.split(' / ')[0].replace(/^無形/, ''));
                      }}
                      className="text-sanctuary-200 hover:text-d2-socket hover:underline font-mono font-medium truncate max-w-[170px] cursor-pointer text-right"
                      title={`點擊查看【${item.recommendedBase}】頂級底材指南`}
                    >
                      {item.recommendedBase}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectRuneword(item.id, item.sockets)}
                    className="w-full py-1.5 px-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-d2-unique text-xs text-d2-unique font-medium flex items-center justify-center gap-1.5 transition-all shadow group/btn"
                  >
                    <span>{isEn ? 'View Full Attributes & Recipes' : '查看完整配方與全詞綴'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
