import React, { useState } from 'react';
import { CUBE_RECIPES_DATA } from '../../data/cubeRecipes';
import { ItemIcon } from '../common/ItemIcon';
import { BookOpen, Plus, ArrowRight } from 'lucide-react';
import { CubeRecipeData } from '../../types';

export interface CubeLabProps {
  onNavigateToRune?: (runeNumber: number) => void;
}

export const CubeLab: React.FC<CubeLabProps> = ({ onNavigateToRune }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | CubeRecipeData['category']>('all');

  const categories = [
    { id: 'all', label: '全部配方' },
    { id: 'socket', label: '裝備打孔' },
    { id: 'upgrade', label: '裝備階級升級' },
    { id: 'craft', label: '手工神裝工藝' },
    { id: 'repair', label: '免錢修理充能' },
    { id: 'misc', label: '洗裝與洗點' },
  ];

  const filteredRecipes = CUBE_RECIPES_DATA.filter((recipe) => {
    if (activeCategory !== 'all' && recipe.category !== activeCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-d2-magic flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-d2-magic" />
            <span>赫拉迪姆方塊煉金工坊 (Cube Recipes)</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            白裝打孔隨機公式、暗金防具/武器底材升級、施法/血腥手工飾品與赦免徽章洗點全收錄。
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar self-start md:self-auto text-xs">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors border ${
                  isActive
                    ? 'bg-sanctuary-800 text-d2-magic border-d2-magic/50'
                    : 'bg-sanctuary-950 text-sanctuary-400 border-sanctuary-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="p-5 rounded-xl bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-magic/40 shadow-xl transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              {/* Title & Badge */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-sanctuary-850">
                <div>
                  <h3 className="font-diablo text-base font-bold text-d2-magic">
                    {recipe.title}
                  </h3>
                  <div className="text-[11px] text-sanctuary-400 font-mono italic">
                    {recipe.titleEn}
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-d2-magic/10 text-d2-magic border border-d2-magic/30 font-medium">
                  {recipe.category.toUpperCase()}
                </span>
              </div>

              {/* Recipe Formula Visualizer */}
              <div className="py-4 space-y-3">
                <div className="text-xs text-sanctuary-400 font-medium">投入材料 (Inputs)：</div>
                <div className="flex flex-wrap items-center gap-2">
                  {recipe.inputs.map((inp, idx) => {
                    const runeMatch = inp.match(/(\d+)#/);
                    const runeNum = runeMatch ? parseInt(runeMatch[1], 10) : null;

                    return (
                      <React.Fragment key={idx}>
                        {runeNum && onNavigateToRune ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToRune(runeNum)}
                            className="px-2.5 py-1 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 border border-d2-rune/40 hover:border-d2-rune text-xs text-d2-rune hover:text-white font-mono font-medium transition-all cursor-pointer shadow-sm flex items-center gap-1.5 group/rune"
                            title={`點擊查看 ${runeNum}# 符文詳細屬性與升級配方`}
                          >
                            <ItemIcon runeNumber={runeNum} size="xs" showBorder={false} />
                            <span>{inp}</span>
                            <span className="text-[9px] opacity-60 group-hover/rune:opacity-100">↗</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-xs text-sanctuary-200 font-medium flex items-center gap-1.5">
                            <ItemIcon name={inp} size="xs" showBorder={false} />
                            <span>{inp}</span>
                          </span>
                        )}
                        {idx < recipe.inputs.length - 1 && (
                          <Plus className="w-3 h-3 text-sanctuary-500" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-sanctuary-300">
                  <ArrowRight className="w-4 h-4 text-d2-unique shrink-0" />
                  <span>轉化產出：</span>
                  <div className="flex items-center gap-1.5">
                    <ItemIcon name={recipe.output} size="xs" showBorder={false} />
                    <span className="text-d2-unique font-bold">{recipe.output}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Notes */}
            {recipe.notes && (
              <div className="mt-3 pt-3 border-t border-sanctuary-850/80 text-xs text-sanctuary-400 italic bg-sanctuary-900/40 p-2.5 rounded-lg">
                💡 <span className="text-sanctuary-300">{recipe.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
