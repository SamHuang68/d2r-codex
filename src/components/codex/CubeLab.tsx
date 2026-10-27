import React, { useState } from 'react';
import { CUBE_RECIPES_DATA } from '../../data/cubeRecipes';
import { ItemIcon } from '../common/ItemIcon';
import { BookOpen, Plus, ArrowRight, Sparkles, Flame } from 'lucide-react';
import { CubeRecipeData } from '../../types';
import { SectionHead } from '../common/TreeIndex';
import { useLanguage } from '../../context/LanguageContext';
import { CubeCraftShowcase } from './CubeCraftShowcase';

export interface CubeLabProps {
  onNavigateToRune?: (runeNumber: number) => void;
}

export const CubeLab: React.FC<CubeLabProps> = ({ onNavigateToRune }) => {
  const { t, isEn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | CubeRecipeData['category']>('all');

  const categories = [
    { id: 'all', label: isEn ? 'All Recipes' : '全部配方' },
    { id: 'socket', label: isEn ? 'Socketing' : '裝備打孔' },
    { id: 'upgrade', label: isEn ? 'Item Upgrades' : '裝備階級升級' },
    { id: 'craft', label: isEn ? 'Crafted Items' : '手工神裝工藝' },
    { id: 'repair', label: isEn ? 'Repairs & Recharging' : '免錢修理充能' },
    { id: 'misc', label: isEn ? 'Rerolling & Respec' : '洗裝與洗點' },
  ];

  const filteredRecipes = CUBE_RECIPES_DATA.filter((recipe) => {
    if (activeCategory !== 'all' && recipe.category !== activeCategory) {
      return false;
    }
    return true;
  });

  const handleScrollToRecipe = (recipeId: string) => {
    // 若特定配方被類別篩選隱藏，先還原至全部配方
    if (activeCategory !== 'all') {
      setActiveCategory('all');
    }

    setTimeout(() => {
      const el = document.getElementById(`recipe-${recipeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-d2-magic', 'border-d2-magic');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-d2-magic', 'border-d2-magic');
        }, 2000);
      }
    }, 120);
  };

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;
  const imgCube = `${baseUrl}images/items/props/horadric_cube.gif`;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-magic flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-d2-magic" />
            <span>{t('赫拉迪姆方塊煉金工坊 (Cube Recipes)', 'Horadric Cube Alchemy Lab')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            {t(
              '白裝打孔隨機公式、暗金防具/武器底材升級、施法/血腥手工飾品與赦免徽章洗點全收錄。',
              'Comprehensive recipes for socketing white bases, upgrading Unique armor/weapons, Blood & Caster crafts, and Token of Absolution respecs.'
            )}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar self-start md:self-auto text-xs">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-sanctuary-800 text-d2-magic border-d2-magic/50 shadow'
                    : 'bg-sanctuary-950 text-sanctuary-400 border-sanctuary-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 赫拉迪姆方塊原版圖解橫幅 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sanctuary-950 via-sanctuary-900 to-sanctuary-950 border border-sanctuary-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-sanctuary-950/90 border border-d2-magic/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(105,105,255,0.2)] shrink-0">
            <img src={imgCube} alt="Horadric Cube" className="w-12 h-12 object-contain" />
            <div className="absolute -bottom-1 -right-1 px-1 rounded bg-d2-magic/20 text-[9px] font-mono text-d2-magic border border-d2-magic/40">
              {isEn ? '4 Slots' : '4格'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-sanctuary-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-d2-magic" />
              <span>{isEn ? 'Horadric Transmutation Principles' : '赫拉迪姆古代賢者轉化秘義'}</span>
            </div>
            <p className="text-xs text-sanctuary-400 max-w-2xl leading-relaxed">
              {isEn
                ? 'The Horadric Cube transmutes matter. Socket white bases for runewords, upgrade Unique armor defenses and weapon bases without losing variable rolls, and craft GG 2/20 amulets.'
                : '轉化萬物、賦予神力的赫拉迪姆神器。白裝打孔博取隨機洞數（符文之語必備）、暗金裝備跨階級底材升級（保留變動數值並大幅提升防禦/傷害）、施法手工飾品追尋 2/20 天價項鍊。'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Total Recipes' : '總配方數'}</div>
            <div className="text-d2-magic font-bold font-mono text-sm">
              {CUBE_RECIPES_DATA.length} {isEn ? 'Sets' : '條'}
            </div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-center">
            <div className="text-sanctuary-400 text-[10px]">{isEn ? 'Craft Level' : '工藝機制'}</div>
            <div className="text-d2-gold font-bold text-xs flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-d2-fire" />
              <span>{isEn ? 'ilvl=0.5+0.5' : '等級公式'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 展廳：四大極品手工藝神裝、經典暗金跨階升級與打孔博弈輪盤 */}
      <CubeCraftShowcase
        onNavigateToRune={onNavigateToRune}
        onScrollToRecipe={handleScrollToRecipe}
      />

      {/* Recipes Cards：依配方類別分段，每段有標題與數量 */}
      <div className="space-y-9">
        {categories
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const rows = filteredRecipes.filter((r) => r.category === cat.id);
            if (rows.length === 0) return null;
            return (
              <section key={cat.id} id={`cube-${cat.id}`} aria-label={cat.label} className="scroll-mt-20">
                <SectionHead title={cat.label} count={rows.length} tone="magic" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rows.map((recipe) => (
                    <div
                      key={recipe.id}
                      id={`recipe-${recipe.id}`}
                      className="p-5 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-magic/50 shadow-xl transition-all duration-200 flex flex-col justify-between group scroll-mt-24"
                    >
                      <div>
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-850">
                          <div>
                            <h3 className="font-diablo text-base font-bold text-d2-magic group-hover:text-blue-300 transition-colors">
                              {isEn && recipe.titleEn ? recipe.titleEn : recipe.title}
                            </h3>
                            {!isEn && recipe.titleEn && (
                              <div className="text-[11px] text-sanctuary-400 font-mono italic">
                                {recipe.titleEn}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-d2-magic/10 text-d2-magic border border-d2-magic/30 font-medium font-mono">
                            {recipe.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Recipe Formula Visualizer: 升級為立體轉化槽位 */}
                        <div className="py-4 space-y-3">
                          <div className="text-xs text-sanctuary-400 font-medium flex items-center justify-between">
                            <span>{isEn ? 'Transmutation Inputs:' : '方塊投入材料 (Inputs)：'}</span>
                            <span className="text-[10px] text-sanctuary-500 font-mono">
                              {isEn ? `${(isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).length} Items` : `${recipe.inputs.length} 件材料`}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-850 shadow-inner">
                            {(isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).map((inp, idx) => {
                              const runeMatch = inp.match(/(\d+)#/);
                              const runeNum = runeMatch ? parseInt(runeMatch[1], 10) : null;

                              return (
                                <React.Fragment key={idx}>
                                  {runeNum && onNavigateToRune ? (
                                    <button
                                      type="button"
                                      onClick={() => onNavigateToRune(runeNum)}
                                      className="px-2.5 py-1.5 rounded-lg bg-sanctuary-950 hover:bg-d2-rune/20 border border-d2-rune/40 hover:border-d2-rune text-xs text-d2-rune hover:text-white font-mono font-medium transition-all cursor-pointer shadow-sm flex items-center gap-1.5 group/rune"
                                      title={
                                        isEn
                                          ? `View Rune #${runeNum} details & upgrade recipe`
                                          : `點擊查看 ${runeNum}# 符文詳細屬性與升級配方`
                                      }
                                    >
                                      <ItemIcon runeNumber={runeNum} size="sm" showBorder={false} />
                                      <span>{inp}</span>
                                      <span className="text-[9px] opacity-60 group-hover/rune:opacity-100">↗</span>
                                    </button>
                                  ) : (
                                    <span className="px-2.5 py-1.5 rounded-lg bg-sanctuary-950 border border-sanctuary-800 text-xs text-sanctuary-200 font-medium flex items-center gap-1.5 shadow-sm">
                                      <ItemIcon name={inp} size="sm" showBorder={false} />
                                      <span className="truncate max-w-[160px]">{inp}</span>
                                    </span>
                                  )}
                                  {idx < (isEn && recipe.inputsEn ? recipe.inputsEn : recipe.inputs).length - 1 && (
                                    <Plus className="w-3.5 h-3.5 text-sanctuary-500 shrink-0" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>

                          {/* 產出成果槽位 */}
                          <div className="pt-2 flex items-center gap-2.5 text-xs font-semibold text-sanctuary-300">
                            <ArrowRight className="w-4 h-4 text-d2-unique shrink-0 animate-pulse" />
                            <span className="shrink-0">{isEn ? 'Transmuted Output: ' : '煉金轉化產出：'}</span>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sanctuary-900/90 border border-d2-unique/40 shadow-sm text-d2-unique font-bold flex-wrap">
                              <ItemIcon name={recipe.output} size="sm" showBorder={false} />
                              <span>{isEn && recipe.outputEn ? recipe.outputEn : recipe.output}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recipe Notes */}
                      {(isEn && recipe.notesEn ? recipe.notesEn : recipe.notes) && (
                        <div className="mt-3 pt-3 border-t border-sanctuary-850/80 text-xs text-sanctuary-400 italic bg-sanctuary-900/40 p-2.5 rounded-lg leading-relaxed">
                          💡 <span className="text-sanctuary-300">{isEn && recipe.notesEn ? recipe.notesEn : recipe.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
};
