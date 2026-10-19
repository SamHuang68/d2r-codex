import React, { useState } from 'react';
import { 
  GEMS_DATA, 
  UBER_KEYS_ORGANS_DATA, 
  ESSENCES_DATA, 
  COMBAT_POTIONS_DATA, 
  CHARMS_JEWELS_DATA
} from '../../data/props';
import { ItemIcon } from '../common/ItemIcon';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { 
  Gem, 
  Sparkles, 
  FlaskConical, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  Flame, 
  Search,
  CheckCircle2
} from 'lucide-react';

export interface PropCompendiumProps {
  onNavigateToRunes?: () => void;
  onNavigateToCube?: () => void;
  onNavigateToRunewords?: (rwName: string) => void;
}

export const PropCompendium: React.FC<PropCompendiumProps> = ({
  onNavigateToRunes,
  onNavigateToCube,
  onNavigateToRunewords,
}) => {
  const [activeCategory, setActiveCategory] = useState<'gems' | 'keys' | 'essences' | 'potions' | 'charms'>('gems');
  const [gemSearchQuery, setGemSearchQuery] = useState('');
  const [selectedGemType, setSelectedGemType] = useState<string>('all');

  const gemTypes = [
    { id: 'all', label: '全部寶石' },
    { id: 'amethyst', label: '紫水晶 (Amethyst)' },
    { id: 'topaz', label: '黃寶石 (Topaz)' },
    { id: 'ruby', label: '紅寶石 (Ruby)' },
    { id: 'sapphire', label: '藍寶石 (Sapphire)' },
    { id: 'emerald', label: '綠寶石 (Emerald)' },
    { id: 'diamond', label: '鑽石 (Diamond)' },
    { id: 'skull', label: '骷髏 (Skull)' },
  ];

  const propTiles: CategoryTile[] = [
    { id: 'gems', label: '完美寶石與工藝', count: GEMS_DATA.length, tone: 'magic', icon: { name: '完美紫寶石', nameEn: 'Perfect Amethyst', rarity: 'prop' } },
    { id: 'keys', label: '六王鑰匙與器官', count: UBER_KEYS_ORGANS_DATA.length, tone: 'rune', icon: { name: '恐懼之鑰', nameEn: 'Key of Terror', rarity: 'prop' } },
    { id: 'essences', label: '四大精華與洗點徽章', count: ESSENCES_DATA.length, tone: 'unique', icon: { name: '精華', nameEn: 'Essence', rarity: 'prop' } },
    { id: 'potions', label: '戰鬥藥劑與黑科技', count: COMBAT_POTIONS_DATA.length, tone: 'rare', icon: { name: '全面恢復藥劑', nameEn: 'Full Rejuvenation Potion', rarity: 'prop' } },
    { id: 'charms', label: '破免板與頂級珠寶', count: CHARMS_JEWELS_DATA.length, tone: 'set', icon: { name: '地獄火炬', nameEn: 'Hellfire Torch', rarity: 'unique' } },
  ];

  const filteredGems = GEMS_DATA.filter((g) => {
    if (selectedGemType !== 'all' && g.type !== selectedGemType) return false;
    if (gemSearchQuery.trim()) {
      const q = gemSearchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.nameEn.toLowerCase().includes(q) ||
        g.weaponEffect.toLowerCase().includes(q) ||
        g.armorHelmEffect.toLowerCase().includes(q) ||
        g.shieldEffect.toLowerCase().includes(q) ||
        g.craftingUses.some(u => u.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <PageHeader
        icon={<FlaskConical className="w-6 h-6" />}
        tone="text-d2-magic"
        title="道具、寶石與戰鬥聖物全典藏"
        desc="收錄七大完美寶石鑲嵌與手工工藝、崔斯特姆紅門鑰匙與六王器官、四大魔神精華與洗點徽章，以及解毒/解凍抗性黑科技藥劑。"
        right={
          <div className="flex items-center gap-2 flex-wrap self-start">
          {onNavigateToCube && (
            <button
              onClick={onNavigateToCube}
              className="px-3 py-2 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-magic text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>方塊合成工坊</span>
            </button>
          )}
          {onNavigateToRunes && (
            <button
              onClick={onNavigateToRunes}
              className="px-3 py-2 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-rune text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>33枚符文寶庫</span>
            </button>
          )}
          {onNavigateToRunewords && (
            <button
              onClick={() => onNavigateToRunewords('')}
              className="px-3 py-2 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-unique text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>符文之語速查</span>
            </button>
          )}
          </div>
        }
      />

      {/* 大圖分類磚 */}
      <CategoryTiles
        tiles={propTiles}
        activeId={activeCategory}
        onSelect={(id) => setActiveCategory(id as typeof activeCategory)}
        iconSize="lg"
        className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      />

      {/* ── TAB 1: 完美寶石系統 ── */}
      {activeCategory === 'gems' && (
        <div className="space-y-6">
          {/* Visual Schematic Box */}
          <div className="bg-gradient-to-r from-sanctuary-900/90 via-sanctuary-950 to-sanctuary-900/90 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-d2-magic uppercase tracking-wider">
              <Gem className="w-4 h-4 text-d2-magic" />
              <span>寶石鑲嵌與重置工藝核心法則</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="bg-sanctuary-950/90 p-3.5 rounded-xl border border-sanctuary-800">
                <div className="text-d2-gold font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-d2-gold" /> 拓荒防禦之王：完美鑽石
                </div>
                <p className="text-sanctuary-300 leading-relaxed">
                  3孔普通盾牌或聖騎士專用盾鑲嵌 3 顆完美鑽石，直接提供高達 <strong>+57% 全抗性</strong>，平民跨越地獄抗性懲罰第一神器。
                </p>
              </div>
              <div className="bg-sanctuary-950/90 p-3.5 rounded-xl border border-sanctuary-800">
                <div className="text-d2-unique font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-d2-unique" /> 打寶致富首選：完美黃寶石
                </div>
                <p className="text-sanctuary-300 leading-relaxed">
                  頭盔與衣服鑲嵌每顆提供 <strong>+24% MF</strong>。4孔白甲鑲滿直接白嫖 +96% MF，成本極低，是開荒刷墨菲斯托的最佳搭檔。
                </p>
              </div>
              <div className="bg-sanctuary-950/90 p-3.5 rounded-xl border border-sanctuary-800">
                <div className="text-d2-magic font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-d2-magic" /> 洗大板與手工施法：完紫與完骷
                </div>
                <p className="text-sanctuary-300 leading-relaxed">
                  3顆完美寶石 + 巴爾/暗黑超大護身符可洗出 <strong>+1技能 +45生命</strong> 極品板；6顆完美骷髏可無限洗金色裝備。
                </p>
              </div>
            </div>
          </div>

          {/* Gem Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-sanctuary-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={gemSearchQuery}
                onChange={(e) => setGemSearchQuery(e.target.value)}
                placeholder="搜尋寶石名稱、鑲嵌效果或配方..."
                className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded-xl pl-9 pr-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-magic"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 no-scrollbar text-xs">
              {gemTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedGemType(t.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors border ${
                    selectedGemType === t.id
                      ? 'bg-sanctuary-800 text-d2-magic border-d2-magic/60 font-bold'
                      : 'bg-sanctuary-950 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGems.map((gem) => (
              <div
                key={gem.id}
                className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-magic/60 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Gem Title Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-sanctuary-850">
                    <div className="flex items-center gap-3">
                      <ItemIcon name={gem.name} nameEn={gem.nameEn} rarity="gem" size="lg" />
                      <div>
                        <h3 className="font-diablo text-base font-bold text-sanctuary-100">
                          {gem.name}
                        </h3>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {gem.nameEn}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-d2-magic/15 text-d2-magic border border-d2-magic/30 font-medium">
                      需求 Lv {gem.requiredLevel}
                    </span>
                  </div>

                  {/* Sockets Breakdown */}
                  <div className="space-y-2.5 py-4 text-xs font-sans">
                    <div className="flex items-start gap-2">
                      <span className="text-sanctuary-500 font-medium shrink-0 w-16">武器效果：</span>
                      <span className="text-d2-blood font-semibold">{gem.weaponEffect}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sanctuary-500 font-medium shrink-0 w-16">衣服頭盔：</span>
                      <span className="text-d2-gold font-semibold">{gem.armorHelmEffect}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sanctuary-500 font-medium shrink-0 w-16">盾牌效果：</span>
                      <span className="text-d2-set font-semibold">{gem.shieldEffect}</span>
                    </div>
                  </div>
                </div>

                {/* Crafting & Cube Recipes */}
                <div className="pt-3 border-t border-sanctuary-850 space-y-2 text-xs">
                  <div className="text-[11px] font-mono text-sanctuary-400 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-d2-magic" />
                    <span>核心用途與方塊配方：</span>
                  </div>
                  <ul className="space-y-1.5">
                    {gem.craftingUses.map((use, uIdx) => (
                      <li key={uIdx} className="text-[11px] text-sanctuary-300 leading-snug flex items-start gap-1.5">
                        <span className="text-d2-magic font-bold">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: 六王鑰匙與器官 ── */}
      {activeCategory === 'keys' && (
        <div className="space-y-6">
          {/* Process Diagram / Flowchart */}
          <div className="bg-sanctuary-900/60 p-6 rounded-2xl border border-sanctuary-800 space-y-4">
            <h3 className="font-diablo text-base font-bold text-d2-fire flex items-center gap-2">
              <Flame className="w-4 h-4 text-d2-fire" />
              <span>超級崔斯特姆紅門開門步驟全流程圖解</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-d2-fire font-bold mb-1">【步驟一：收集 9 把鑰匙】</div>
                <p className="text-sanctuary-300 font-sans text-[11px]">
                  擊殺女伯爵、召喚者、尼拉塞克，各取得 3 把鑰匙 (合計 3組 恐懼+憎恨+毀滅)。
                </p>
              </div>
              <div className="p-3 rounded-xl bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-d2-fire font-bold mb-1">【步驟二：開啟 3 個小紅門】</div>
                <p className="text-sanctuary-300 font-sans text-[11px]">
                  在 A5 哈洛加斯分 3 次放入方塊合成，分別開啟苦痛熔爐、遺忘沙漠、苦難熔爐。
                </p>
              </div>
              <div className="p-3 rounded-xl bg-sanctuary-950 border border-sanctuary-800">
                <div className="text-d2-fire font-bold mb-1">【步驟三：擊殺王取得 3 大器官】</div>
                <p className="text-sanctuary-300 font-sans text-[11px]">
                  擊殺莉莉絲、超級督瑞爾、超級衣卒爾，100% 掉落大腦、眼睛、暗黑破壞神之角。
                </p>
              </div>
              <div className="p-3 rounded-xl bg-sanctuary-950 border border-d2-gold/50 shadow-glow-gold/10">
                <div className="text-d2-gold font-bold mb-1">【步驟四：決戰超級崔斯特姆】</div>
                <p className="text-sanctuary-300 font-sans text-[11px]">
                  三大器官放入方塊合成，開啟終極紅門，擊破三大魔神斬獲「地獄火炬」！
                </p>
              </div>
            </div>
          </div>

          {/* Keys & Organs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UBER_KEYS_ORGANS_DATA.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-fire/60 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-sanctuary-850">
                    <div className="flex items-center gap-3">
                      <ItemIcon name={item.name} nameEn={item.nameEn} rarity="prop" size="lg" />
                      <div>
                        <h3 className="font-diablo text-base font-bold text-sanctuary-100">
                          {item.name}
                        </h3>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {item.nameEn}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sanctuary-900 border border-sanctuary-750 text-d2-fire font-bold">
                      Act {item.act}
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs font-sans">
                    <div>
                      <span className="text-sanctuary-500">掉落來源：</span>
                      <strong className="text-sanctuary-200">{item.dropSource}</strong>
                      <span className="text-d2-gold font-mono ml-2">({item.dropRate})</span>
                    </div>
                    <div>
                      <span className="text-sanctuary-500">所在場景：</span>
                      <span className="text-sanctuary-300">{item.location}</span>
                    </div>
                    <p className="text-sanctuary-400 text-xs leading-relaxed pt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-sanctuary-850/80 space-y-2 text-xs">
                  <div className="bg-sanctuary-900/60 p-2.5 rounded-xl border border-sanctuary-800 text-[11px] text-sanctuary-300">
                    <span className="text-d2-fire font-bold">💡 實戰要訣：</span>
                    {item.tacticalTips}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: 四大精華與洗點徽章 ── */}
      {activeCategory === 'essences' && (
        <div className="space-y-6">
          <div className="bg-sanctuary-900/70 p-6 rounded-2xl border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <ItemIcon name="赦免徽章" nameEn="Token of Absolution" rarity="unique" size="xl" />
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-d2-gold/15 border border-d2-gold/30 text-xs text-d2-gold font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>無限自由洗點神器</span>
                </div>
                <h3 className="font-diablo text-2xl font-bold text-sanctuary-100">
                  赦免徽章 (Token of Absolution)
                </h3>
                <p className="text-xs text-sanctuary-300 max-w-xl leading-relaxed">
                  在地獄難度擊殺第一至第五幕大 Boss 收集四色精華，於赫拉迪姆方塊中融合即可獲得「赦免徽章」。右鍵使用即可完全重置當前角色所有屬性點與技能樹，隨心轉型！
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sanctuary-950 border border-d2-gold/40 shadow-glow-gold/10 text-center shrink-0 w-full md:w-64">
              <div className="text-xs text-sanctuary-400 font-mono mb-1">方塊合成公式</div>
              <div className="font-bold text-sm text-d2-gold font-diablo">
                4 色精華各 1 顆
              </div>
              <div className="text-[11px] text-sanctuary-400 mt-1">
                藍 + 黃 + 紅 + 綠 ➔ 赦免徽章
              </div>
            </div>
          </div>

          {/* Essences Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ESSENCES_DATA.map((ess) => (
              <div
                key={ess.id}
                className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-850 hover:border-sanctuary-700 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <ItemIcon name={ess.name} nameEn={ess.nameEn} rarity="prop" size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: ess.colorHex }}
                        />
                        <span className="text-[10px] font-mono text-sanctuary-400 font-bold">
                          Act {ess.act} 精華
                        </span>
                      </div>
                      <h4 className="font-diablo text-base font-bold text-sanctuary-100">
                        {ess.name}
                      </h4>
                      <div className="text-[11px] text-sanctuary-400 font-mono italic">
                        {ess.nameEn}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-sanctuary-300">
                    <div>
                      <span className="text-sanctuary-500">來源魔王：</span>
                      <strong className="text-sanctuary-200">{ess.bossSource}</strong>
                    </div>
                    <div>
                      <span className="text-sanctuary-500">掉落幾率：</span>
                      <span className="text-d2-gold font-mono">{ess.dropChance}</span>
                    </div>
                    <div className="text-[11px] text-sanctuary-400 pt-1">
                      {ess.location}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-sanctuary-400 italic pt-3 border-t border-sanctuary-850">
                  {ess.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: 戰鬥藥劑與黑科技 ── */}
      {activeCategory === 'potions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMBAT_POTIONS_DATA.map((pot) => (
              <div
                key={pot.id}
                className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-unique/50 shadow-xl transition-all duration-150 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-850">
                    <div className="flex items-center gap-3">
                      <ItemIcon name={pot.name} nameEn={pot.nameEn} rarity="prop" size="lg" />
                      <div>
                        <h3 className="font-diablo text-base font-bold text-d2-unique">
                          {pot.name}
                        </h3>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {pot.nameEn}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sanctuary-900 border border-sanctuary-800 text-sanctuary-300 font-medium">
                      {pot.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs font-sans">
                    <div className="p-2.5 rounded-xl bg-sanctuary-900/80 border border-sanctuary-800 text-sanctuary-200 leading-snug">
                      <strong className="text-d2-gold">效果：</strong>{pot.effect}
                    </div>

                    {pot.hiddenMechanic && (
                      <div className="p-2.5 rounded-xl bg-d2-magic/10 border border-d2-magic/30 text-sanctuary-300 text-xs leading-relaxed">
                        <strong className="text-d2-magic">⚡ 隱藏機制：</strong>{pot.hiddenMechanic}
                      </div>
                    )}

                    {pot.recipe && (
                      <div className="text-[11px] text-sanctuary-400 font-mono">
                        <span className="text-sanctuary-500">合成/取得：</span>{pot.recipe}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-sanctuary-850 text-xs text-sanctuary-400">
                  <span className="text-d2-gold font-bold">💡 專家提示：</span>{pot.proTips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: 破免護身符與頂級珠寶 ── */}
      {activeCategory === 'charms' && (
        <div className="space-y-6">
          <div className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-2">
            <h3 className="font-diablo text-base font-bold text-d2-set flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-d2-set" />
              <span>D2R 2.5 破免機制 (Sunder Charms) 與終局配置</span>
            </h3>
            <p className="text-xs text-sanctuary-300 leading-relaxed">
              破免護身符將怪物的抗性<strong>強制壓制為 95%</strong>（不再免疫），但自身對應抗性會大幅降低。此時再搭配裝備上的減抗屬性（如獅鷲之眼、死亡之網、格里斯瓦德之杖、彩虹刻面珠寶、無限審判靈氣），可對原免疫怪物打出毀滅性全額傷害！
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHARMS_JEWELS_DATA.map((charm) => (
              <div
                key={charm.id}
                className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-set/60 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-sanctuary-850">
                    <div className="flex items-center gap-2.5">
                      <ItemIcon 
                        name={charm.name} 
                        nameEn={charm.nameEn} 
                        slot={charm.slot === 'jewel' ? 'jewel' : 'charm'} 
                        rarity="unique" 
                        size="lg" 
                      />
                      <div>
                        <h4 className="font-diablo text-sm font-bold text-d2-unique">
                          {charm.name}
                        </h4>
                        <div className="text-[11px] text-sanctuary-400 font-mono italic">
                          {charm.nameEn}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-d2-gold/20 text-d2-gold border border-d2-gold/40 shrink-0">
                      階級 {charm.tradeValueTier}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-d2-magic">
                    {charm.keyAttributes.map((attr, aIdx) => (
                      <div key={aIdx} className="leading-snug">• {attr}</div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-sanctuary-850 text-xs">
                  <div className="text-[11px] text-sanctuary-400 mb-1">
                    <span className="text-sanctuary-500">來源：</span>{charm.dropSource}
                  </div>
                  <div className="text-[11px] text-sanctuary-300 leading-relaxed bg-sanctuary-900/50 p-2 rounded-lg">
                    {charm.guide}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

