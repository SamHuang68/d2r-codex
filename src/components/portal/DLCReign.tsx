import React from 'react';
import { Flame, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DLCReignProps {
  onExploreDLCItems: () => void;
  onNavigateToRuneword?: (name: string) => void;
  onNavigateItem?: (name: string) => void;
}

export const DLCReign: React.FC<DLCReignProps> = ({
  onExploreDLCItems,
  onNavigateToRuneword,
  onNavigateItem,
}) => {
  const { t, isEn } = useLanguage();

  const comparisonRows = [
    {
      feature: t('《暗黑破壞神 II：獄火重生》基礎七大經典職業', 'D2R Base 7 Classic Character Classes'),
      base: true,
      dlc: true,
    },
    {
      feature: t('《術士軍臨》全新術士 (Warlock) 職業', 'Reign of the Warlock: All-New Warlock Class'),
      base: false,
      dlc: true,
    },
    {
      feature: t('最新 DLC 專屬符文之語 (權威 / 巫師會 / 虛無)', 'Latest DLC Runewords (Authority / Coven / Void)'),
      base: false,
      dlc: true,
    },
    {
      feature: t('動態邪惡威脅區域 (Terror Zones) 與 85 級場景', 'Dynamic Terror Zones & Level 85 Area Scaling'),
      base: true,
      dlc: true,
    },
    {
      feature: t('自訂拾取過濾器 (Loot Filter QoL)', 'Custom In-Game Loot Filter QoL'),
      base: true,
      dlc: true,
    },
    {
      feature: t('符文與材料專屬儲物箱分頁', 'Dedicated Rune & Gem Stash Tabs'),
      base: true,
      dlc: true,
    },
    {
      feature: t('《暗黑破壞神 IV》跨遊戲寵物與禁忌繫鏈戰利品', 'Diablo IV Cross-Game Pet & Trophy Rewards'),
      base: false,
      dlc: true,
    },
    {
      feature: t('《魔獸世界》赫拉迪姆方塊房屋擺設裝飾', 'World of Warcraft Horadric Cube Housing Decor'),
      base: false,
      dlc: true,
    },
  ];

  return (
    <section className="py-16 bg-sanctuary-950 border-b border-sanctuary-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-d2-fire/15 border border-d2-fire/30 text-xs text-d2-fire font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{t('最新 DLC 重磅改版', 'Latest DLC Expansion')}</span>
            </div>
            <h2 className="font-diablo text-3xl sm:text-5xl font-extrabold text-sanctuary-100 tracking-wide leading-tight">
              {t('《術士軍臨》', 'REIGN OF THE WARLOCK')}
              <br />
              <span className="bg-gradient-to-r from-d2-fire to-amber-400 bg-clip-text text-transparent">
                REIGN OF THE WARLOCK
              </span>
            </h2>
            <p className="text-sm text-sanctuary-300 font-sans leading-relaxed">
              {t(
                '邪惡再次現身於聖休亞瑞。駕馭禁忌魔法、使役地獄原生僕從，並迎來全面升級的現代化遊戲體驗，包括自訂拾取過濾器、專屬材料倉庫與動態邪惡威脅區域。',
                'Evil stirs once more across Sanctuary. Command forbidden magic, bind native demons, and experience modern QoL enhancements including custom loot filters, dedicated stash tabs, and dynamic Terror Zones.'
              )}
            </p>

            <div className="space-y-2.5 text-xs text-sanctuary-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-d2-set shrink-0" />
                <span>
                  {isEn ? (
                    <>All-New 8th Class: <strong>Warlock</strong> — Demon Enslavement, Eldritch Infusion, and Chaos Magic</>
                  ) : (
                    <>全新第 8 職業：<strong>術士 (Warlock)</strong> — 惡魔使役、邪異武裝、混沌暗影三大專精</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Check className="w-4 h-4 text-d2-set shrink-0" />
                <span>
                  {t('新增 DLC 獨特暗金與套裝：', 'New DLC Unique & Set Items: ')}
                  <button
                    type="button"
                    onClick={() => onNavigateItem?.('艾迪亞布羅斯學術')}
                    className="text-d2-set hover:underline font-bold mx-1 cursor-pointer"
                    title={isEn ? "View Lore of Idiabolos" : "點擊查看【艾迪亞布羅斯學術】"}
                  >
                    {isEn ? "Lore of Idiabolos ↗" : "艾迪亞布羅斯學術 ↗"}
                  </button>
                  {isEn ? ', ' : '、'}
                  <button
                    type="button"
                    onClick={() => onNavigateItem?.('貝恩的衣裝')}
                    className="text-d2-set hover:underline font-bold mx-1 cursor-pointer"
                    title={isEn ? "View Bane's Raiment" : "點擊查看【貝恩的衣裝】"}
                  >
                    {isEn ? "Bane's Raiment ↗" : "貝恩的衣裝 ↗"}
                  </button>
                  {t('等頂階裝備', 'and other endgame trophies')}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Check className="w-4 h-4 text-d2-set shrink-0" />
                <span>
                  {t('新增終局符文之語：', 'New Endgame Runewords: ')}
                  <button
                    type="button"
                    onClick={() => onNavigateToRuneword?.('權威')}
                    className="text-d2-unique hover:underline font-bold mx-1 cursor-pointer"
                    title={isEn ? "View runeword Authority" : "點擊查看符文之語【權威】組成細節"}
                  >
                    {isEn ? "Authority ↗" : "權威 (Authority) ↗"}
                  </button>
                  {isEn ? ', ' : '、'}
                  <button
                    type="button"
                    onClick={() => onNavigateToRuneword?.('巫師會')}
                    className="text-d2-unique hover:underline font-bold mx-1 cursor-pointer"
                    title={isEn ? "View runeword Coven" : "點擊查看符文之語【巫師會】組成細節"}
                  >
                    {isEn ? "Coven ↗" : "巫師會 (Coven) ↗"}
                  </button>
                  {isEn ? ', ' : '、'}
                  <button
                    type="button"
                    onClick={() => onNavigateToRuneword?.('虛無')}
                    className="text-d2-unique hover:underline font-bold mx-1 cursor-pointer"
                    title={isEn ? "View runeword Void" : "點擊查看符文之語【虛無】組成細節"}
                  >
                    {isEn ? "Void ↗" : "虛無 (Void) ↗"}
                  </button>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-d2-set shrink-0" />
                <span>
                  {t(
                    '現代化品質改善：自訂拾取過濾器 (Loot Filters) 與符文/寶石專屬儲物箱',
                    'Modern QoL: Built-in Loot Filters & Dedicated Rune/Gem Stash Tabs'
                  )}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onExploreDLCItems}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-d2-fire/50 text-d2-fire font-bold text-xs tracking-wide transition-all shadow-glow-red/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('立即檢索《術士軍臨》新增裝備與符文語', 'Explore Reign of the Warlock Gear & Runewords')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Comparison Matrix Card */}
          <div className="lg:col-span-6 bg-sanctuary-900/60 border border-sanctuary-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="font-diablo text-base font-bold text-d2-unique flex items-center gap-2 pb-2 border-b border-sanctuary-800">
              <Shield className="w-4 h-4" />
              <span>{t('版本功能與獎勵對照表', 'Version Features & Rewards Comparison')}</span>
            </h3>

            <div className="space-y-3 text-xs">
              {comparisonRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-sanctuary-950 border border-sanctuary-850"
                >
                  <span className="text-sanctuary-200">{row.feature}</span>
                  <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                    <span className={row.base ? 'text-d2-set font-bold' : 'text-sanctuary-500'}>
                      {row.base ? t('✓ 包含', '✓ Included') : '—'}
                    </span>
                    <span className="text-d2-fire font-bold">{t('✓ 包含', '✓ Included')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
