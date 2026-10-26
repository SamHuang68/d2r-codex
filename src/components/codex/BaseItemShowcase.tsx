import React, { useState } from 'react';
import { 
  Swords, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Weight, 
  Info,
  ChevronRight,
  Gem
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface BaseItemShowcaseProps {
  onNavigateToRuneword?: (runewordName: string) => void;
  onScrollToBase?: (baseId: string) => void;
}

interface BiSMatchup {
  id: string;
  runewordName: string;
  runewordNameEn: string;
  category: 'armor' | 'polearm' | 'shield' | 'weapon';
  badge: string;
  title: string;
  subtitle: string;
  comparison: {
    name: string;
    nameEn: string;
    baseId: string;
    type: string;
    weightClass: 'light' | 'medium' | 'heavy';
    reqStr: number;
    speedOrDef: string;
    pros: string[];
    cons: string[];
    isRecommended?: boolean;
    recommendationTag?: string;
  }[];
  tacticalVerdict: string;
}

const BIS_MATCHUPS: BiSMatchup[] = [
  {
    id: 'enigma_armor',
    runewordName: '謎團',
    runewordNameEn: 'Enigma',
    category: 'armor',
    badge: '全職業畢業神甲',
    title: '謎團底材世紀對決：法師鎧甲 vs 統御者鎧甲 vs 灰暮罩衣',
    subtitle: '自穿謎團首重「力量點數效益」與「0% 移速懲罰」，防禦力為次要考量',
    comparison: [
      {
        name: '法師鎧甲',
        nameEn: 'Mage Plate',
        baseId: 'mage_plate',
        type: '卓越輕甲',
        weightClass: 'light',
        reqStr: 55,
        speedOrDef: '防禦 225-261 (無跑速懲罰)',
        pros: [
          '僅需 55 力量！全職業穿上戰旅或帶點護身符即可「0力量加點」穿戴',
          '省下的力量點數全部投入體力，換取極致血量與生存容錯',
          '第五章拉蘇克打孔任務必定獲得 3 孔，底材極易取得與製作',
          '特等的 15ED 耐久修理費遠低於精英甲，性價比之王',
        ],
        cons: [
          '面板防禦力略低於精英甲約 200~250 點（但在謎團巨大力量與跑速面前可忽略）',
        ],
        isRecommended: true,
        recommendationTag: '全職業泛用首選 No.1',
      },
      {
        name: '統御者鎧甲',
        nameEn: 'Archon Plate',
        baseId: 'archon_plate',
        type: '精英輕甲',
        weightClass: 'light',
        reqStr: 103,
        speedOrDef: '防禦 410-524 (輕甲防禦天花板)',
        pros: [
          '輕甲中防禦力最高的王者，且完全不降低跑步速度與耐力消耗',
          '造型在野蠻人與聖騎士身上極具厚重霸氣的金屬盔甲質感',
        ],
        cons: [
          '力量需求 103 點較高，法師/死靈穿戴需額外投資 48 點力量（換算少近百點生命）',
          '拉蘇克打孔會給 4 孔，天然 3 孔底材極其稀有昂貴',
        ],
        recommendationTag: '高力量職業或極限防禦追求',
      },
      {
        name: '灰暮罩衣',
        nameEn: 'Dusk Shroud',
        baseId: 'dusk_shroud',
        type: '精英輕甲',
        weightClass: 'light',
        reqStr: 77,
        speedOrDef: '防禦 361-467 (低力精英輕甲)',
        pros: [
          '力量需求僅需 77 點，在精英級別中力量門檻最低',
          '基礎防禦大幅超越法師鎧甲，力量負擔較統御者鎧甲輕很多',
        ],
        cons: [
          '外觀為貼身皮革布料（被玩家戲稱為「抹布衣」），部分職業外觀視覺不討喜',
          '耐久度僅 20 點偏低，需較常修理；天然 3 孔掉落機率低',
        ],
        recommendationTag: '兼顧精英防禦與低力需',
      },
    ],
    tacticalVerdict: '【實戰權威總結】法系職業（法師、死靈、風德、陷阱刺客、聖騎）自穿謎團首推「法師鎧甲 (Mage Plate)」，55 力量讓謎團提供的「+依等級力量 (最高+74)」完全回饋給暴風之盾、君主盾或雷神腰帶，實現全體質加點！若為野蠻人或熱愛金屬重甲造型者，則選用「統御者鎧甲」。',
  },
  {
    id: 'infinity_insight_polearm',
    runewordName: '無限 / 靈光',
    runewordNameEn: 'Infinity / Insight',
    category: 'polearm',
    badge: '傭兵畢業神兵',
    title: '傭兵長柄/長矛首選：斬鐮 vs 巨型斬鐮 vs 巨神長柄斧',
    subtitle: '傭兵輸出與保命的核心在於「攻擊頻率」——攻速越快，壓碎打擊 (CB) 與偷血 (LL) 觸發越頻繁',
    comparison: [
      {
        name: '斬鐮',
        nameEn: 'Thresher',
        baseId: 'thresher',
        type: '精英長柄武器',
        weightClass: 'light',
        reqStr: 152,
        speedOrDef: '基礎攻速 [-10] 極速 (均傷 76.5)',
        pros: [
          '[-10] 極速基準！配合安達莉爾的面貌與攻速珠寶極易衝破極限攻速檔位',
          '極速戳刺能在打 Boss 時以最高頻率觸發 40% 壓碎打擊 (CB) 瞬間削血',
          '高頻攻擊保證傭兵在危急時刻穩定吸血 (Life Leech)，生存率最高',
        ],
        cons: [
          '單發白字最高傷害略低於巨型斬鐮',
        ],
        isRecommended: true,
        recommendationTag: '性價比與手感首推',
      },
      {
        name: '巨型斬鐮',
        nameEn: 'Giant Thresher',
        baseId: 'giant_thresher',
        type: '精英長柄武器',
        weightClass: 'light',
        reqStr: 188,
        speedOrDef: '基礎攻速 [-10] 極速 (均傷 77.0)',
        pros: [
          '長柄武器的皇冠明珠！兼具 [-10] 極速攻速與最平衡的最高最小傷害範圍',
          '純物理期望 DPS 位於長柄類最高水準，交易市場上的終極硬通貨',
        ],
        cons: [
          '掉落機率極低，天然無形 4 孔的拍賣行造價極其昂貴',
          '敏捷需求 140 點稍高，米山等級不足時需靠裝備補足敏捷',
        ],
        recommendationTag: '土豪大後期終極畢業',
      },
      {
        name: '巨神長柄斧',
        nameEn: 'Colossus Voulge',
        baseId: 'colossus_voulge',
        type: '精英長柄武器',
        weightClass: 'heavy',
        reqStr: 210,
        speedOrDef: '基礎攻速 [10] 慢速 (均傷 91.0)',
        pros: [
          '開荒期第一神器！拉蘇克打孔任務「必定出 4 孔」，取得成本最低',
          '單發大傷極高（最大傷害高達 165），一擊秒殺普通小怪',
        ],
        cons: [
          '力量需求高達 210（無形版仍需 200），米山未達 80 級以上很難拿得起',
          '[10] 攻速極慢，在面對硬怪時吸血不及容易暴斃；打王觸發 CB 效率較差',
        ],
        recommendationTag: '開荒期必 4 孔過渡神器',
      },
    ],
    tacticalVerdict: '【實戰權威總結】無限與靈光強烈建議使用「無形 (Ethereal)」底材，傭兵使用不損耗耐久度，且白字傷害天然暴增 50% 並降低 10 點力需！首選「無形斬鐮」或「無形巨型斬鐮」；開荒期打到白板無形「巨神長柄斧」可直接找拉蘇克打 4 孔無痛過渡。',
  },
  {
    id: 'spirit_shield',
    runewordName: '精神',
    runewordNameEn: 'Spirit',
    category: 'shield',
    badge: '法系神級盾牌',
    title: '精神盾首選底材聖典：君主盾 vs 聖騎專用神聖小盾',
    subtitle: '精神盾具備 +2 技能、35% 快速施法與高抗性，但全職業非聖騎面臨 156 力量門檻',
    comparison: [
      {
        name: '君主盾',
        nameEn: 'Monarch',
        baseId: 'monarch',
        type: '精英輕型盾牌',
        weightClass: 'light',
        reqStr: 156,
        speedOrDef: '防禦 133-148 (42% 格擋率)',
        pros: [
          '非聖騎士全職業（法師、死靈、風德、陷阱刺客）唯一 4 孔且力量最低的選擇',
          '輕型盾牌，完全沒有移動速度與耐力消耗懲罰',
          '在地獄難度崔斯特姆、泰摩高地起即可掉落，拉蘇克打孔保證 4 孔',
        ],
        cons: [
          '力量需求 156 點對全敏捷/全體力法系偏重（通常透過謎團或軍帽/抗性裝湊足）',
          '格擋率僅 42%，法系通常不強求滿格擋，專注於生命池',
        ],
        isRecommended: true,
        recommendationTag: '非聖騎士職業唯一解答',
      },
      {
        name: '神聖小盾',
        nameEn: 'Sacred Targe',
        baseId: 'sacred_targe',
        type: '聖騎士專用盾',
        weightClass: 'light',
        reqStr: 86,
        speedOrDef: '防禦 126-158 (60% 原生最高格擋！)',
        pros: [
          '全遊戲所有盾牌中最高原生基礎格擋率 (60%)！',
          '搭配聖騎士神聖之盾技能，只需投資極少量敏捷即可輕鬆達成 75% 滿格擋',
          '力量需求僅需 86 點，極其輕盈',
          '可天然帶有「+40~45 全抗性」原生詞綴，加上精神的抗性直接使地獄抗性全部爆滿',
        ],
        cons: [
          '限定聖騎士專屬，其他職業無法使用',
          '自帶 45 全抗的天然 4 孔神聖小盾極其罕見珍貴',
        ],
        isRecommended: true,
        recommendationTag: '聖騎士畢業終極明珠',
      },
    ],
    tacticalVerdict: '【實戰權威總結】法系職業在進入地獄後首要目標就是入手「君主盾」，做成精神盾後立即突破檔位；而聖騎士有其專屬神盾優勢，切記「神聖小盾 (ST)」因其 60% 傲視全場的原生格擋率，是比渦旋盾 (防禦高但格擋差且需 148 力量) 更優秀的格擋型畢業首選！',
  },
  {
    id: 'grief_weapon',
    runewordName: '悔恨',
    runewordNameEn: 'Grief',
    category: 'weapon',
    badge: '近戰物理天花板',
    title: '悔恨單手神兵對決：幻化之刃 vs 狂戰斧',
    subtitle: '悔恨具備 +340~400 固定純物理傷害，底材物理白字被大幅稀釋，攻速與耐久度成為關鍵',
    comparison: [
      {
        name: '幻化之刃',
        nameEn: 'Phase Blade',
        baseId: 'phase_blade',
        type: '精英單手劍',
        weightClass: 'light',
        reqStr: 25,
        speedOrDef: '基礎攻速 [-30] 極速 (無損耗/無法破壞)',
        pros: [
          '自帶無法破壞屬性！永遠不需要花費任何金幣或符文修理，刷怪流暢無阻',
          '[-30] 極速基礎攻速，聖騎士狂熱光環下白卷也能輕鬆達到極速盾擊 (Smite)',
          '力量需求僅 25 點，敏捷需求 136 點剛好與格擋型聖騎敏捷點數完美重疊',
          '打崔斯特姆紅門超級六王最強核心神器',
        ],
        cons: [
          '近戰攻擊距離為 Range 2，在狂戰士野蠻人旋風斬或 PvP 時手感略遜狂戰斧',
        ],
        isRecommended: true,
        recommendationTag: 'PvE 盾擊/熱誠聖騎唯一真神',
      },
      {
        name: '狂戰斧',
        nameEn: 'Berserker Axe',
        baseId: 'berserker_axe',
        type: '精英單手斧',
        weightClass: 'light',
        reqStr: 138,
        speedOrDef: '基礎攻速 [0] 中等 (攻擊距離 Range 3)',
        pros: [
          '具備單手武器中最長攻擊距離 (Range 3)，旋風野蠻人與 PvP 追擊核心優勢',
          '武器基礎白字面板高，能受雙手斧精通等被動全額放大',
          '雙持野蠻人外觀極具狂戰士野性美感',
        ],
        cons: [
          '耐久度僅 26 點，旋風斬刷怪幾分鐘就紅損一次，修理費高昂且極其繁瑣',
          '基礎攻速 [0]，需要悔恨滾出 34% 以上 IAS 才能達成旋風斬極限檔位',
        ],
        recommendationTag: 'PvP 與極限距離玩家選擇',
      },
    ],
    tacticalVerdict: '【實戰權威總結】PvE 刷圖與紅門超級六王 100% 堅定選擇「幻化之刃」！悔恨的 +400 純物理傷害會直接加在盾牌重擊 (Smite) 與武器打擊上，幻化之刃的無法破壞特質與 -30 極限攻速無可取代；狂戰斧僅適合極限追求 PvP 射程的野蠻人高手。',
  },
];

interface ArmorWeightPenalty {
  tier: 'light' | 'medium' | 'heavy';
  nameZh: string;
  nameEn: string;
  speedPenalty: string;
  staminaDrain: string;
  examples: string[];
  tacticalTip: string;
  color: string;
}

const ARMOR_WEIGHT_DATA: ArmorWeightPenalty[] = [
  {
    tier: 'light',
    nameZh: '輕甲 (Light Armor)',
    nameEn: 'Zero Penalty',
    speedPenalty: '0% (無任何跑速懲罰)',
    staminaDrain: '無額外耐力消耗 (1.0x)',
    examples: ['法師鎧甲', '灰暮罩衣', '統御者鎧甲', '聖甲蟲殼皮甲', '龍皮甲', '鱗鎧胸甲', '君主盾', '神聖小盾'],
    tacticalTip: '玩家本體角色自穿護甲絕大多數優先選擇輕甲！保持 100% 機動力與最長奔跑續航，拉扯與走位流暢度最佳。',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
  },
  {
    tier: 'medium',
    nameZh: '中甲 (Medium Armor)',
    nameEn: 'Medium Penalty',
    speedPenalty: '-5% 移動速度懲罰',
    staminaDrain: '+50% 耐力消耗增加 (1.5x)',
    examples: ['護胸甲', '鐵網戰甲', '骸骨網甲', '綴鱗戰甲', '大盾', '防禦盾'],
    tacticalTip: '角色移動時會略微感覺鈍重，自穿效益較低；若給傭兵穿戴則無所謂（傭兵不受跑速懲罰與耐力限制）。',
    color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
  },
  {
    tier: 'heavy',
    nameZh: '重甲 (Heavy Armor)',
    nameEn: 'Heavy Penalty',
    speedPenalty: '-10% 移動速度懲罰',
    staminaDrain: '+100% 耐力消耗增加 (2.0x 翻倍！)',
    examples: ['漆護鎧甲', '海怪之殼', '神聖戰甲', '暗影鎧甲', '撒卡蘭姆盾', '庇護盾'],
    tacticalTip: '自穿會嚴重減速並極速耗盡體力耐力；但防禦力上限極高，極度適合「傭兵」穿戴（如無形剛毅神聖戰甲防禦破 2000+）！',
    color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
  },
];

export const BaseItemShowcase: React.FC<BaseItemShowcaseProps> = ({
  onNavigateToRuneword,
  onScrollToBase,
}) => {
  const { isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'bis' | 'weight' | 'eth'>('bis');

  return (
    <div className="rounded-3xl bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-950 border border-sanctuary-750 p-6 md:p-8 shadow-2xl space-y-6">
      {/* 標題與切換 Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-sanctuary-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-d2-socket uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-d2-socket" />
            <span>{isEn ? 'BiS Base Strategy & Mechanics' : '頂級符文之語底材權威展廳'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-diablo font-bold text-sanctuary-100 flex items-center gap-3">
            <span>{isEn ? 'Hall of Elite Bases & Armory Science' : '四大符文之語底材首選與護甲重量科學'}</span>
          </h2>
          <p className="text-xs text-sanctuary-400">
            {isEn
              ? 'Deep-dive tactical comparison of Enigma, Infinity, Spirit, Grief bases and armor speed penalty mechanics.'
              : '深入解析謎團、無限/靈光、精神盾、悔恨的首選底材博弈，以及輕/中/重甲移速懲罰與無形增益。'}
          </p>
        </div>

        {/* 控制切換頁簽 */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-sanctuary-900 border border-sanctuary-800 self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('bis')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bis'
                ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>{isEn ? 'BiS Runeword Bases' : '四大首選底材對決'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weight')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'weight'
                ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
            }`}
          >
            <Weight className="w-3.5 h-3.5" />
            <span>{isEn ? 'Armor Speed Penalty' : '護甲重量與跑速懲罰'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eth')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'eth'
                ? 'bg-d2-socket text-sanctuary-950 font-bold shadow-md shadow-d2-socket/20'
                : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? 'Ethereal & Superior' : '無形與特等的價值聖典'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 四大首選底材對決 (BiS Matchups) */}
      {activeTab === 'bis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {BIS_MATCHUPS.map((matchup) => (
              <div
                key={matchup.id}
                className="rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 hover:border-sanctuary-700 p-5 md:p-6 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
              >
                <div>
                  {/* 頭部標題與目標符文之語 */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-sanctuary-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-sanctuary-800 text-[10px] font-mono text-d2-gold font-bold border border-d2-gold/30">
                          {matchup.badge}
                        </span>
                        <h3 className="text-base md:text-lg font-diablo font-bold text-sanctuary-100 group-hover:text-d2-socket transition-colors">
                          {matchup.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-sanctuary-400 mt-1 leading-relaxed">
                        {matchup.subtitle}
                      </p>
                    </div>

                    {/* 符文之語跳轉按鈕 */}
                    <button
                      type="button"
                      onClick={() => onNavigateToRuneword?.(matchup.runewordName)}
                      className="shrink-0 px-2.5 py-1.5 rounded-xl bg-d2-gold/10 hover:bg-d2-gold/20 border border-d2-gold/40 text-xs text-d2-gold font-mono font-bold flex items-center gap-1.5 transition-all shadow group/rw"
                      title={isEn ? `View Runeword ${matchup.runewordNameEn}` : `點擊查看【${matchup.runewordName}】配方`}
                    >
                      <Layers className="w-3 h-3 text-d2-gold" />
                      <span>{matchup.runewordName}</span>
                      <ArrowRight className="w-3 h-3 group-hover/rw:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  {/* 比較候選清單 */}
                  <div className="space-y-3 my-4">
                    {matchup.comparison.map((cand) => (
                      <div
                        key={cand.name}
                        className={`p-3.5 rounded-xl border transition-all ${
                          cand.isRecommended
                            ? 'bg-sanctuary-900/90 border-d2-socket/60 shadow-lg shadow-d2-socket/5'
                            : 'bg-sanctuary-900/40 border-sanctuary-850 hover:border-sanctuary-800'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-sanctuary-100">
                              {cand.name}
                            </span>
                            <span className="text-xs font-mono text-sanctuary-500">
                              ({cand.nameEn})
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sanctuary-800 text-sanctuary-400">
                              {cand.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {cand.recommendationTag && (
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                                  cand.isRecommended
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-sanctuary-800 text-sanctuary-400'
                                }`}
                              >
                                {cand.recommendationTag}
                              </span>
                            )}

                            {/* 跳轉到底材卡片 */}
                            <button
                              type="button"
                              onClick={() => onScrollToBase?.(cand.baseId)}
                              className="text-[10px] text-d2-socket hover:underline flex items-center gap-0.5"
                              title="在下方寶典中定位此底材"
                            >
                              <span>{isEn ? 'Inspect' : '查看底材'}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* 數值速覽 */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-sanctuary-950/60 p-2 rounded-lg border border-sanctuary-850 mb-2">
                          <div>
                            <span className="text-sanctuary-500">力量需求: </span>
                            <span className="font-bold text-amber-200">{cand.reqStr} 點</span>
                          </div>
                          <div>
                            <span className="text-sanctuary-500">指標數值: </span>
                            <span className="font-bold text-sky-200">{cand.speedOrDef}</span>
                          </div>
                        </div>

                        {/* 優缺點分析 */}
                        <div className="space-y-1 text-xs">
                          {cand.pros.map((pro, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-sanctuary-300 text-[11px] leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pro}</span>
                            </div>
                          ))}
                          {cand.cons.map((con, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1.5 text-sanctuary-400 text-[11px] leading-relaxed">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 戰術定論評析 */}
                <div className="p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800 text-xs text-sanctuary-300 leading-relaxed font-mono">
                  {matchup.tacticalVerdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 護甲重量與跑速懲罰 (Armor Weight Mechanics) */}
      {activeTab === 'weight' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ARMOR_WEIGHT_DATA.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-2xl p-5 border shadow-xl flex flex-col justify-between space-y-4 ${tier.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-diablo">{tier.nameZh}</h3>
                    <Weight className="w-4 h-4 opacity-80" />
                  </div>

                  <div className="space-y-2 bg-sanctuary-950/70 p-3 rounded-xl border border-sanctuary-850 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-sanctuary-400">移動速度懲罰:</span>
                      <span className="font-bold">{tier.speedPenalty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sanctuary-400">體力耐力消耗:</span>
                      <span className="font-bold">{tier.staminaDrain}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-sanctuary-400 mb-1 font-bold">
                      代表性常見底材：
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tier.examples.map((ex) => (
                        <span
                          key={ex}
                          className="px-2 py-0.5 rounded-md bg-sanctuary-900/80 border border-sanctuary-800 text-[11px] text-sanctuary-200 font-mono"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-sanctuary-800/80 text-[11px] text-sanctuary-300 leading-relaxed">
                  💡 {tier.tacticalTip}
                </div>
              </div>
            ))}
          </div>

          {/* 深度機制說明卡片 */}
          <div className="p-5 rounded-2xl bg-sanctuary-900/40 border border-sanctuary-800 text-xs text-sanctuary-300 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-d2-socket font-bold font-mono text-sm">
              <Info className="w-4 h-4" />
              <span>為什麼重甲跑速懲罰如此致命？</span>
            </div>
            <p>
              在暗黑破壞神 II 遊戲底層機制中，裝甲與盾牌的重量懲罰會<strong>直接從角色的基礎移動速度中扣減（Flat Reduction）</strong>，而非簡單的百分比縮放。
              這意味著若角色同時裝備重甲 (-10%) 與重盾 (-10%)，角色的有效跑速會瞬間損失 20%，甚至導致鞋子提供的 30% 高速跑步被大幅抵銷！
              此外，耐力消耗翻倍會使拓荒與刷圖時耐力條快速見底。因此，除非是完全不計耐力與移速懲罰的<strong>僱傭兵（米山）</strong>，否則玩家本體製作謎團或剛毅時，一律以<strong>輕甲</strong>為第一優先！
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: 無形 (Ethereal) 與特等的 (Superior) 價值聖典 */}
      {activeTab === 'eth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 無形神話 */}
          <div className="rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sanctuary-800">
              <Sparkles className="w-5 h-5 text-d2-cold" />
              <h3 className="text-lg font-diablo font-bold text-sanctuary-100">
                無形 (Ethereal) 底材價值奧秘
              </h3>
            </div>

            <div className="space-y-3 text-xs text-sanctuary-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 space-y-1.5 font-mono">
                <div className="text-d2-cold font-bold text-sm">無形屬性天然加成：</div>
                <div>⚔ 武器：基礎物理傷害 +50%、力量/敏捷需求各降低 10 點</div>
                <div>🛡 防具：基礎防禦力 +50%、力量需求降低 10 點</div>
                <div>⚠ 限制：無法修理，耐久度歸零即損壞（傭兵穿戴不損耐久）</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-amber-200">最佳無形應用場景：</h4>
                <ul className="list-disc list-inside space-y-1 text-sanctuary-400">
                  <li><strong>第二章僱傭兵武器</strong>：無限 (斬鐮/巨型斬鐮)、靈光、遵從。傭兵穿戴永久不損耐久，+50% 白字使吸血與輸出質變。</li>
                  <li><strong>僱傭兵防具</strong>：剛毅 (無形神聖戰甲防禦直逼 2500~3000)、背信 (無形漆護鎧甲/海怪之殼)。</li>
                  <li><strong>自帶無法破壞符文之語</strong>：死亡呼吸 (BotD)、死神 (Death)、誓約 (Oath)。底材必須選用無形狂戰斧或巨神刃！</li>
                  <li><strong>流亡盾牌 (Exile)</strong>：自帶每 4 秒自動修復 1 點耐久，聖騎士必做於無形神聖小盾或渦旋盾上！</li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-sanctuary-900/40 border border-sanctuary-800 text-[11px] text-sanctuary-400">
                💡 <strong>D2R 重製版 eBug 修正說明</strong>：舊版 1.14 以前存在「方塊打孔使無形防禦二次乘算 1.5 倍 (俗稱 eBug)」的機制。D2R 官方已修正此 bug，現在無論是拉蘇克打孔還是方塊打孔，無形防具均統一只享有一次天然 +50% 防禦加成，公平性與透明度大幅提升。
              </div>
            </div>
          </div>

          {/* 特等的 (Superior) 天價標誌 */}
          <div className="rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-sanctuary-800">
              <Gem className="w-5 h-5 text-d2-gold" />
              <h3 className="text-lg font-diablo font-bold text-sanctuary-100">
                特等的 (Superior) 15%ED 天價傳奇
              </h3>
            </div>

            <div className="space-y-3 text-xs text-sanctuary-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 space-y-1.5 font-mono">
                <div className="text-d2-gold font-bold text-sm">特等的屬性池極限：</div>
                <div>⚔ 武器：最高 +15% 增加傷害 (ED) 以及 +3 命中率 (AR)</div>
                <div>🛡 防具：最高 +15% 增加防禦力 (ED) 以及 +15% 增加耐久度上限</div>
                <div>⚠ 警語：特等的底材「無法放入方塊進行打孔」，只能找拉蘇克打孔</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-amber-200">特等的底材修理費陷阱與解法：</h4>
                <p className="text-sanctuary-400">
                  裝備帶有「增加耐久度上限」的特等的護甲（如 15ED/15耐久 法師鎧甲謎團），鐵匠鋪金幣修理費會暴增數十倍，修一次可能高達數十萬至百萬金幣！
                </p>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 font-mono text-[11px]">
                  🔧 <strong>赫拉迪姆方塊免錢修理公式</strong>：<br />
                  • 護甲修理：<strong>方塊 + 8# 拉爾 (Ral) + 任意受損護甲 = 瞬間全滿耐久度</strong><br />
                  • 武器修理：<strong>方塊 + 9# 歐特 (Ort) + 任意受損武器 = 瞬間全滿耐久度</strong><br />
                  平時隨手撿 8# 放在倉庫，即可零金幣秒修頂級特等的謎團！
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
