import React, { useState } from 'react';
import { VALUATION_ITEMS_DATA } from '../../data/affixes';
import { 
  Gem, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Search
} from 'lucide-react';

export const ValuationGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
            極品藍黃詞綴與打寶估價指南
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            「丟商店還是天價賣出？」收錄 JMoD 偏向統治者、3/20/20、20/5、45血技能大板、2/20/30 極品頭冠等全遊戲身價破百貝的夢幻詞綴組合與鑑寶鑑定法則。
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-sanctuary-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋神裝名稱、詞綴 (如 3/20/20)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sanctuary-900 border border-sanctuary-800 rounded-xl text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-fire/50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-sanctuary-400 font-mono mr-1">部位分類：</span>
        {[
          { id: 'all', label: '全部神物' },
          { id: 'shield', label: '盾牌 (JMoD)' },
          { id: 'charm', label: '護身符 (板子)' },
          { id: 'helm', label: '頭飾/權冠' },
          { id: 'ring', label: '戒指' },
          { id: 'gloves', label: '手套' },
        ].map((cat) => (
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

      {/* Valuation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isMagic = item.rarity === 'magic';
          const rarityBorder = isMagic ? 'border-d2-magic/40 hover:border-d2-magic' : 'border-d2-rare/40 hover:border-d2-rare';
          const rarityColor = isMagic ? 'text-d2-magic' : 'text-d2-rare';
          const rarityBadge = isMagic ? 'bg-d2-magic/15 text-d2-magic' : 'bg-d2-rare/15 text-d2-rare';

          return (
            <div
              key={item.id}
              className={`bg-sanctuary-900/50 rounded-3xl border ${rarityBorder} p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
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

                {/* Market Value Badge */}
                <div className="bg-sanctuary-950/80 p-3.5 rounded-2xl border border-d2-gold/30 flex items-center gap-3">
                  <Coins className="w-5 h-5 text-d2-gold shrink-0" />
                  <div className="text-xs">
                    <span className="text-sanctuary-400 font-mono">市場預估身價：</span>
                    <div className="text-d2-gold font-bold font-mono text-sm mt-0.5">
                      {item.estimatedValue}
                    </div>
                  </div>
                </div>

                {/* Ideal Affixes Box */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-sanctuary-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-d2-fire" />
                    必備極品詞綴 (滿變標準)：
                  </div>
                  <div className="bg-sanctuary-950/60 p-3 rounded-xl border border-sanctuary-800/80 space-y-1">
                    {item.idealStats.map((stat, sIdx) => (
                      <div key={sIdx} className="text-xs text-sanctuary-200 flex items-center gap-2 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-d2-gold shrink-0" />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-sanctuary-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Farming Sources */}
                <div className="text-xs text-sanctuary-400 bg-sanctuary-950/40 p-2.5 rounded-xl border border-sanctuary-800/60">
                  <span className="text-sanctuary-300 font-bold font-mono">獲取與洗法途徑：</span> {item.farmingSources}
                </div>
              </div>

              {/* Key Evaluation Rule Callout */}
              <div className="mt-4 pt-3 border-t border-sanctuary-800/80 flex items-start gap-2 text-xs text-d2-fire">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-mono">
                  <span className="font-bold">鑑定鐵律：</span> {item.keyRule}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
