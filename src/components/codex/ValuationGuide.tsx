import React, { useState } from 'react';
import { VALUATION_ITEMS_DATA } from '../../data/affixes';
import { SectionHead } from '../common/TreeIndex';
import { ItemIcon } from '../common/ItemIcon';
import { 
  Gem, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Scale,
  Award,
  BookOpen,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

/** 天價神物的部位分類（依序分段顯示） */
const VAL_CATS = [
  { id: 'all', label: '全部神物' },
  { id: 'shield', label: '盾牌 (JMoD)' },
  { id: 'charm', label: '咒符 (板子)' },
  { id: 'helm', label: '頭飾/權冠' },
  { id: 'ring', label: '戒指' },
  { id: 'gloves', label: '手套' },
  { id: 'boots', label: '鞋子 (三抗鞋)' },
  { id: 'amulet', label: '護身符 (2/20)' },
  { id: 'weapon', label: '武器 (自修爪)' },
  { id: 'jewel', label: '珠寶 (40/15)' },
];

export const ValuationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'showcase' | 'appraiser'>('showcase');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ── 互動鑑寶模擬器狀態 ──
  const [appraiseSlot, setAppraiseSlot] = useState<'ring' | 'amulet' | 'helm' | 'boots' | 'gloves' | 'shield'>('ring');
  const [selectedAffixes, setSelectedAffixes] = useState<Record<string, boolean>>({});

  // 各部位常見高價值詞綴清單
  const slotAffixOptions: Record<string, { id: string; label: string; score: number; isCrucial?: boolean }[]> = {
    ring: [
      { id: 'fcr', label: '+10% 快速施法速度 (FCR)', score: 35, isCrucial: true },
      { id: 'dual_leech', label: '雙吸 (吸血 5-6% + 吸魔 5-6%)', score: 30 },
      { id: 'strength', label: '+15-20 高力量', score: 20 },
      { id: 'dexterity', label: '+12-15 高敏捷', score: 18 },
      { id: 'life', label: '+30-40 高生命', score: 20 },
      { id: 'mana', label: '+60-90 高法力', score: 15 },
      { id: 'all_res', label: '所有抗性 +10-11%', score: 25 },
      { id: 'single_res', label: '單抗 +25-30% (火或電)', score: 15 },
      { id: 'ar', label: '+100-120 攻擊準確率 (AR)', score: 12 },
    ],
    amulet: [
      { id: 'plus_2_skill', label: '+2 職業全技能等級', score: 40, isCrucial: true },
      { id: 'fcr_15_20', label: '+15-20% 快速施法速度 (手工專屬)', score: 40, isCrucial: true },
      { id: 'fcr_10', label: '+10% 快速施法速度 (黃色普通)', score: 20 },
      { id: 'strength', label: '+20-30 高力量', score: 25 },
      { id: 'dexterity', label: '+15-20 高敏捷', score: 20 },
      { id: 'life', label: '+40-60 高生命', score: 20 },
      { id: 'mana', label: '+80-110 高法力', score: 15 },
      { id: 'all_res', label: '全抗性 +15-20%', score: 25 },
    ],
    helm: [
      { id: 'plus_2_skill', label: '+2 職業全技能等級', score: 35, isCrucial: true },
      { id: 'fcr_20', label: '+20% 快速施法速度 (FCR)', score: 35, isCrucial: true },
      { id: 'frw_30', label: '+30% 高速跑步/步行 (FRW)', score: 25 },
      { id: 'sockets_2', label: '天然 2 鑲孔 (2 Sockets)', score: 30, isCrucial: true },
      { id: 'strength', label: '+20-30 力量', score: 18 },
      { id: 'dexterity', label: '+15-20 敏捷', score: 18 },
      { id: 'all_res', label: '全抗性 +15-20%', score: 20 },
    ],
    boots: [
      { id: 'frw_30', label: '+30% 高速跑步/步行 (FRW 滿變)', score: 35, isCrucial: true },
      { id: 'fhr_10', label: '+10% 快速打擊恢復 (FHR 滿變)', score: 25 },
      { id: 'res_fire_35', label: '抗火 +35-40%', score: 30, isCrucial: true },
      { id: 'res_light_35', label: '抗電 +35-40%', score: 30, isCrucial: true },
      { id: 'res_poison_or_cold', label: '抗毒或抗寒 +35-40%', score: 25 },
      { id: 'mf_plr', label: '打寶率 (MF) 或 較低毒素持續時間 (PLR)', score: 15 },
    ],
    gloves: [
      { id: 'plus_2_skill', label: '+2 標槍與長矛或武學技藝技能', score: 35, isCrucial: true },
      { id: 'ias_20', label: '+20% 攻擊速度 (IAS)', score: 35, isCrucial: true },
      { id: 'strength', label: '+10-15 力量', score: 18 },
      { id: 'dexterity', label: '+10-15 敏捷', score: 18 },
      { id: 'res_fire_or_light', label: '抗火或抗電 +20-30%', score: 20 },
      { id: 'leech', label: '每次命中偷取 3% 生命', score: 12 },
    ],
    shield: [
      { id: 'jewelers_4s', label: '天然 4 鑲孔 (Jeweler\'s 珠寶匠)', score: 45, isCrucial: true },
      { id: 'deflecting', label: '偏折 (30% FBR + 20% 格擋率)', score: 45, isCrucial: true },
      { id: 'eth_rep', label: '無形 + 自動修復耐久度', score: 35 },
      { id: 'life_60', label: '+50-60 生命 (巨鯨詞綴)', score: 25 },
    ]
  };

  const currentAffixes = slotAffixOptions[appraiseSlot] || slotAffixOptions.ring;

  const toggleAffix = (id: string) => {
    setSelectedAffixes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 估價評分計算
  const calculatedScore = Object.keys(selectedAffixes).reduce((sum, id) => {
    if (selectedAffixes[id]) {
      const option = currentAffixes.find(o => o.id === id);
      return sum + (option?.score || 0);
    }
    return sum;
  }, 0);

  // 判定評級
  let appraisalGrade: {
    tier: string;
    label: string;
    color: string;
    borderColor: string;
    estValue: string;
    advice: string;
  };

  if (calculatedScore >= 85) {
    appraisalGrade = {
      tier: "GG TIER (超越想像神物)",
      label: "👑 拍賣行頂級傳世珍品 (GG Tier)",
      color: "text-amber-300",
      borderColor: "border-amber-400 shadow-amber-400/20",
      estValue: "身價 50 ~ 150+ 顆貝符文 (Ber / Jah)！",
      advice: "命中全套核心滿變詞綴！在 JSP 或頂級拍賣行屬於天價競標品，請勿急於一口價出售，建議開標讓買家公開競價。"
    };
  } else if (calculatedScore >= 60) {
    appraisalGrade = {
      tier: "TROPHY TIER (極品硬通貨)",
      label: "💎 極品硬通貨 (Trophy Tier)",
      color: "text-d2-fire",
      borderColor: "border-d2-fire/70 shadow-d2-fire/20",
      estValue: "身價 10 ~ 40 顆貝符文！",
      advice: "核心關鍵詞綴齊全，能完美超越絕大多數暗金過渡裝備，天梯中後期大熱流通神物。"
    };
  } else if (calculatedScore >= 40) {
    appraisalGrade = {
      tier: "HIGH TIER (天梯實用良品)",
      label: "⚔️ 天梯實用良品 (High Tier)",
      color: "text-d2-unique",
      borderColor: "border-d2-unique/60",
      estValue: "身價 1 ~ 5 顆中高階符文 (Vex ~ Lo)！",
      advice: "具備核心關鍵屬性，非常適合主流配裝（如補抗性或過渡檔位），能換取不錯的自用符文。"
    };
  } else if (calculatedScore >= 20) {
    appraisalGrade = {
      tier: "MID TIER (拓荒過渡好物)",
      label: "🪙 拓荒過渡好物 (Mid Tier)",
      color: "text-d2-magic",
      borderColor: "border-d2-magic/50",
      estValue: "身價約為數顆 20-24 號符文 (Pul ~ Ist) 或自用。",
      advice: "有 1-2 條可用屬性，開荒期自用很舒服，但在畢業交易市場競爭力有限。"
    };
  } else {
    appraisalGrade = {
      tier: "CHARSI FOOD (無交易價值)",
      label: "🗑️ 丟恰西回收 / 缺乏核心詞綴 (Charsi Food)",
      color: "text-sanctuary-400",
      borderColor: "border-sanctuary-800",
      estValue: "無流通交易價值 (金幣 35,000)。",
      advice: "缺少該部位最關鍵的質變詞綴（如 FCR、技能、30FRW 或三抗），建議直接賣給 NPC 換錢或餵給赫拉迪姆方塊。"
    };
  }

  // 篩選展示神裝
  const filteredItems = VALUATION_ITEMS_DATA.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(term);
      const matchNameEn = item.nameEn.toLowerCase().includes(term);
      const matchStats = item.idealStats.some(s => s.toLowerCase().includes(term));
      const matchDesc = item.description.toLowerCase().includes(term);
      if (!matchName && !matchNameEn && !matchStats && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Gem className="w-4 h-4 text-d2-fire animate-pulse" />
            Trophy Item Price & Affix Valuation Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            極品藍黃詞綴與鑑寶估價指南
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            「丟商店還是天價賣出？」收錄 JMoD 偏向盾、3/20/20、45血大板、2/20/30 極品頭、三抗鞋等破百貝神物，內建互動式線上鑑寶評級器。
          </p>
        </div>

        {/* View Switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sanctuary-900 border border-sanctuary-800 shrink-0">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'showcase'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>天價神物圖鑑</span>
          </button>
          <button
            onClick={() => setActiveTab('appraiser')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'appraiser'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow'
                : 'text-sanctuary-400 hover:text-sanctuary-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>互動鑑寶鑑定器</span>
          </button>
        </div>
      </div>

      {activeTab === 'showcase' ? (
        /* ── Tab 1: 天價神物圖鑑 ── */
        <div className="space-y-6">
          {/* Quick Search & Category Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto">
              {VAL_CATS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-d2-fire text-sanctuary-950 font-bold shadow'
                      : 'bg-sanctuary-900/60 text-sanctuary-300 hover:text-sanctuary-100 border border-sanctuary-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-sanctuary-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜尋神裝詞綴 (如 3/20/20)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-sanctuary-900 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50"
              />
            </div>
          </div>

          {/* Valuation Cards Grid */}
          <div className="space-y-9">
            {VAL_CATS.filter((c) => c.id !== 'all').map((cat) => {
              const rows = filteredItems.filter((i) => i.category === cat.id);
              if (rows.length === 0) return null;
              return (
                <section key={cat.id} id={`val-${cat.id}`} aria-label={cat.label} className="scroll-mt-20">
                  <SectionHead title={cat.label} count={rows.length} tone="unique" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rows.map((item) => {
              const isMagic = item.rarity === 'magic';
              const rarityBorder = isMagic ? 'border-d2-magic/40 hover:border-d2-magic' : 'border-d2-rare/40 hover:border-d2-rare';
              const rarityColor = isMagic ? 'text-d2-magic' : 'text-d2-rare';
              const rarityBadge = isMagic ? 'bg-d2-magic/15 text-d2-magic' : 'bg-d2-rare/15 text-d2-rare';

              return (
                <div
                  key={item.id}
                  className={`bg-sanctuary-900/50 rounded-3xl border ${rarityBorder} p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group shadow-lg`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <ItemIcon
                          name={item.name}
                          nameEn={item.nameEn}
                          baseItem={item.itemType}
                          rarity={item.category === 'magic' ? 'magic' : 'rare'}
                          size="lg"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${rarityBadge}`}>
                              {isMagic ? '藍色魔法極品' : '亮黃稀有極品'}
                            </span>
                            <span className="text-xs font-mono text-sanctuary-400">
                              {item.itemType}
                            </span>
                          </div>
                          <h3 className={`text-xl sm:text-2xl font-bold ${rarityColor} group-hover:brightness-125 transition-all`}>
                            {item.name}
                          </h3>
                        <div className="text-xs font-mono text-sanctuary-400 mt-0.5">
                          {item.nameEn}
                        </div>
                      </div>
                    </div>
                    </div>

                    {/* Market Value Badge */}
                    <div className="bg-sanctuary-950/80 p-3.5 rounded-2xl border border-d2-gold/30 flex items-center gap-3">
                      <Coins className="w-5 h-5 text-d2-gold shrink-0" />
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-sanctuary-400">
                          拍賣行估價 (Market Price)
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-d2-gold mt-0.5">
                          {item.estimatedValue}
                        </div>
                      </div>
                    </div>

                    {/* Ideal Affixes */}
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-sanctuary-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-d2-gold" />
                        頂級詞綴組合 (Ideal Stats)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {item.idealStats.map((stat, sIdx) => (
                          <div
                            key={sIdx}
                            className="bg-sanctuary-950/60 px-3 py-1.5 rounded-xl border border-sanctuary-800 text-xs text-sanctuary-200 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-d2-gold shrink-0" />
                            <span>{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-sanctuary-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Rules */}
                  <div className="mt-6 pt-4 border-t border-sanctuary-800/80 space-y-2">
                    <div className="text-xs text-sanctuary-400 flex items-start gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sanctuary-500 shrink-0 mt-0.5" />
                      <span><strong>獲取途徑：</strong>{item.farmingSources}</span>
                    </div>
                    <div className="text-xs text-amber-300/90 flex items-start gap-1.5 bg-amber-950/20 p-2.5 rounded-xl border border-amber-800/40">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>鑑寶鐵律：</strong>{item.keyRule}</span>
                    </div>
                  </div>
                </div>
              );
            })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Tab 2: 互動鑑寶鑑定器 ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左側: 部位與詞綴勾選器 */}
          <div className="lg:col-span-7 bg-sanctuary-950/90 p-6 rounded-3xl border border-sanctuary-800 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
                <Scale className="w-5 h-5 text-d2-fire" />
                <span>步驟 1：選擇裝備部位</span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                {[
                  { id: 'ring', label: '黃戒指' },
                  { id: 'amulet', label: '手工護身符' },
                  { id: 'helm', label: '黃頭飾' },
                  { id: 'boots', label: '三抗鞋' },
                  { id: 'gloves', label: '黃手套' },
                  { id: 'shield', label: '藍盾牌' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setAppraiseSlot(s.id as any);
                      setSelectedAffixes({});
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                      appraiseSlot === s.id
                        ? 'bg-d2-fire text-sanctuary-950 font-bold border-d2-fire shadow-md'
                        : 'bg-sanctuary-900 text-sanctuary-300 border-sanctuary-800 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-d2-gold" />
                <span>步驟 2：勾選實際開出的詞綴</span>
              </h2>
              <p className="text-xs text-sanctuary-400 mt-1">
                請根據您撿到的亮黃色/魔法裝備屬性，點選有出現的詞綴項目：
              </p>

              <div className="space-y-2 mt-4">
                {currentAffixes.map(affix => {
                  const isChecked = Boolean(selectedAffixes[affix.id]);
                  return (
                    <button
                      key={affix.id}
                      onClick={() => toggleAffix(affix.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-sanctuary-850 border-d2-gold/80 text-sanctuary-100 shadow-sm ring-1 ring-d2-gold/30'
                          : 'bg-sanctuary-900/60 border-sanctuary-800 text-sanctuary-400 hover:border-sanctuary-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-d2-gold text-sanctuary-950 border-amber-300 font-bold' : 'border-sanctuary-700 bg-sanctuary-950'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'text-sanctuary-100 font-bold' : 'text-sanctuary-300'}`}>
                          {affix.label}
                        </span>
                      </div>

                      {affix.isCrucial && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-d2-fire/15 text-d2-fire border border-d2-fire/30 shrink-0">
                          關鍵質變
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右側: 鑑定專家即時估價報告 */}
          <div className={`lg:col-span-5 bg-sanctuary-950 p-6 rounded-3xl border-2 ${appraisalGrade.borderColor} shadow-2xl space-y-6 transition-all duration-300 sticky top-24`}>
            <div className="border-b border-sanctuary-800 pb-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-sanctuary-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-d2-gold" />
                DIABLO II EXPERT APPRAISAL VERDICT
              </div>
              <h3 className={`text-2xl font-diablo font-bold mt-1 ${appraisalGrade.color}`}>
                {appraisalGrade.label}
              </h3>
            </div>

            {/* 綜合評分進度條 */}
            <div className="space-y-1.5 bg-sanctuary-900/80 p-4 rounded-2xl border border-sanctuary-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-sanctuary-400">詞綴純度評分：</span>
                <span className="font-bold text-d2-gold">{calculatedScore} / 100 分</span>
              </div>
              <div className="w-full h-2.5 bg-sanctuary-950 rounded-full overflow-hidden border border-sanctuary-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-d2-fire to-rose-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, calculatedScore)}%` }}
                />
              </div>
            </div>

            {/* 預估身價 */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-sanctuary-400 flex items-center gap-1">
                <Coins className="w-4 h-4 text-d2-gold" />
                預估交易身價：
              </div>
              <div className="text-lg font-bold text-d2-gold font-mono bg-sanctuary-900/60 p-3 rounded-xl border border-sanctuary-800">
                {appraisalGrade.estValue}
              </div>
            </div>

            {/* 專家診斷解析 */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-sanctuary-400 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-sanctuary-400" />
                鑑定師專業解析：
              </div>
              <p className="text-xs sm:text-sm text-sanctuary-200 leading-relaxed bg-sanctuary-900/40 p-4 rounded-2xl border border-sanctuary-800">
                {appraisalGrade.advice}
              </p>
            </div>

            {/* 一鍵重置 */}
            <button
              onClick={() => setSelectedAffixes({})}
              className="w-full py-2.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-800 text-xs font-medium text-sanctuary-400 hover:text-sanctuary-200 transition-colors border border-sanctuary-800"
            >
              清空詞綴並重新鑑定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
