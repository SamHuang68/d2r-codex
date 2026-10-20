import React, { useState, useEffect } from 'react';
import { RUNES_DATA } from '../../data/runes';
import { RUNEWORDS_DATA } from '../../data/runewords';
import { ItemIcon } from '../common/ItemIcon';
import { CategoryTiles, CategoryTile } from '../common/CategoryTiles';
import { PageHeader } from '../common/PageHeader';
import { SectionHead } from '../common/TreeIndex';
import { Layers, ArrowRight, Sparkles, Flame } from 'lucide-react';

export interface RuneCompendiumProps {
  targetRuneNumber?: number;
  onNavigateToRuneword?: (runewordName: string) => void;
}

export const RuneCompendium: React.FC<RuneCompendiumProps> = ({
  targetRuneNumber,
  onNavigateToRuneword,
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  // 若外部指定了目標符文，自動切換至相應階層並平滑滾動至目標卡片
  useEffect(() => {
    if (targetRuneNumber) {
      if (targetRuneNumber <= 10) setTierFilter('low');
      else if (targetRuneNumber <= 21) setTierFilter('mid');
      else setTierFilter('high');

      setTimeout(() => {
        const el = document.getElementById(`rune-${targetRuneNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  }, [targetRuneNumber]);

  const rep = (n: number) => {
    const r = RUNES_DATA.find((x) => x.number === n);
    return { runeNumber: n, name: r?.name, nameEn: r?.nameEn, rarity: 'rune' as const };
  };
  const tierTiles: CategoryTile[] = [
    { id: 'all', label: '全部符文', sub: '1-33#', count: RUNES_DATA.length, icon: rep(30), tone: 'rune' },
    { id: 'low', label: '低階符文', sub: '1-10#', count: RUNES_DATA.filter((r) => r.number <= 10).length, icon: rep(5), tone: 'rune' },
    { id: 'mid', label: '中階符文', sub: '11-21#', count: RUNES_DATA.filter((r) => r.number >= 11 && r.number <= 21).length, icon: rep(15), tone: 'rune' },
    { id: 'high', label: '高階神符', sub: '22-33#', count: RUNES_DATA.filter((r) => r.number >= 22).length, icon: rep(33), tone: 'unique' },
  ];

  const filteredRunes = RUNES_DATA.filter((r) => {
    if (tierFilter === 'low') return r.number <= 10;
    if (tierFilter === 'mid') return r.number >= 11 && r.number <= 21;
    if (tierFilter === 'high') return r.number >= 22;
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        icon={<Layers className="w-6 h-6" />}
        tone="text-d2-rune"
        title="33 枚符文全典藏與熱門符文語互聯"
        desc="從 1# 艾爾 (El) 到 33# 薩德 (Zod)，完整收錄鑲嵌屬性、方塊升級公式，並支援點擊「相關符文之語」直達組成細節。"
      />

      {/* 階層大圖分類磚（全部 / 低階 / 中階 / 高階神符） */}
      <CategoryTiles
        tiles={tierTiles}
        activeId={tierFilter}
        onSelect={(id) => setTierFilter(id as 'all' | 'low' | 'mid' | 'high')}
        iconSize="lg"
        className="grid-cols-2 sm:grid-cols-4"
      />

      {/* 33 枚符文快速跳轉牆 */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
        {RUNES_DATA.map((r) => (
          <button
            key={r.number}
            type="button"
            title={`${r.number}# ${r.name} (${r.nameEn})`}
            onClick={() => {
              setTierFilter(r.number <= 10 ? 'low' : r.number <= 21 ? 'mid' : 'high');
              setTimeout(() => document.getElementById(`rune-${r.number}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
            }}
            className="flex flex-col items-center px-1.5 pt-1.5 pb-1 rounded-lg border border-sanctuary-800 hover:border-d2-rune bg-sanctuary-950 transition-colors"
          >
            <ItemIcon runeNumber={r.number} name={r.name} nameEn={r.nameEn} rarity="rune" size="xs" showBorder={false} />
            <span className="text-[10px] font-mono text-d2-rune leading-none mt-1">{r.number}#</span>
          </button>
        ))}
      </div>

      {/* Runes：依階層分段（低階 → 中階 → 高階神符），每段有標題與數量 */}
      <div className="space-y-9">
        {([
          { id: 'low', label: '低階符文', sub: '1–10#', test: (n: number) => n <= 10 },
          { id: 'mid', label: '中階符文', sub: '11–21#', test: (n: number) => n >= 11 && n <= 21 },
          { id: 'high', label: '高階神符', sub: '22–33#', test: (n: number) => n >= 22 },
        ] as const).map((grp) => {
          const rows = filteredRunes.filter((r) => grp.test(r.number));
          if (rows.length === 0) return null;
          return (
            <section key={grp.id} id={`rune-tier-${grp.id}`} aria-label={grp.label} className="scroll-mt-20">
              <SectionHead title={grp.label} sub={grp.sub} count={rows.length} tone="rune" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rows.map((rune) => {
          const isHighRune = rune.number >= 22;
          const isTarget = targetRuneNumber === rune.number;

          // 找出所有需要使用這顆符文的符文之語
          const relevantRunewords = RUNEWORDS_DATA.filter((rw) =>
            rw.runeNumbers.includes(rune.number)
          );

          return (
            <div
              key={rune.number}
              id={`rune-${rune.number}`}
              className={`p-5 rounded-2xl bg-sanctuary-950 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isTarget
                  ? 'border-d2-rune ring-2 ring-d2-rune/60 shadow-glow-gold'
                  : isHighRune
                  ? 'border-d2-rune/40 hover:border-d2-rune shadow-sm'
                  : 'border-sanctuary-800 hover:border-sanctuary-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-sanctuary-850">
                  <div className="flex items-center gap-3">
                    <ItemIcon
                      runeNumber={rune.number}
                      name={rune.name}
                      nameEn={rune.nameEn}
                      rarity="rune"
                      size="lg"
                    />
                    <div>
                      <h3 className="font-diablo text-base font-bold text-d2-rune flex items-center gap-1.5">
                        {rune.name}
                        {isTarget && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-d2-gold text-sanctuary-950 font-bold font-mono">
                            目標
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-sanctuary-400 font-mono italic">
                        {rune.nameEn}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-sanctuary-400">
                      需求等級: <strong className="text-sanctuary-200">{rune.requiredLevel}</strong>
                    </span>
                    {isHighRune && (
                      <div className="text-[10px] text-d2-unique font-bold flex items-center justify-end gap-1 mt-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> 大號神符
                      </div>
                    )}
                  </div>
                </div>

                {/* Sockets Details */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-sanctuary-400 font-medium">武器鑲嵌：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.weaponEffect}</span>
                  </div>
                  <div>
                    <span className="text-sanctuary-400 font-medium">防具/頭盔：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.armorHelmEffect}</span>
                  </div>
                  <div>
                    <span className="text-sanctuary-400 font-medium">盾牌鑲嵌：</span>
                    <span className="text-sanctuary-200 ml-1">{rune.shieldEffect}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Sections: Cube Recipe & Related Runewords */}
              <div className="space-y-3 pt-2 border-t border-sanctuary-850">
                {/* Cube Upgrade Formula */}
                {rune.cubeRecipe && (
                  <div className="flex items-center justify-between text-[11px] text-d2-magic font-mono bg-sanctuary-900/60 p-2 rounded-xl border border-sanctuary-850">
                    <span className="text-sanctuary-400 flex items-center gap-1 font-sans">
                      <ArrowRight className="w-3 h-3 text-d2-rune shrink-0" /> 升級:
                    </span>
                    <span className="font-semibold text-sanctuary-200 truncate ml-2">
                      {rune.cubeRecipe}
                    </span>
                  </div>
                )}

                {/* Related Runewords Links */}
                {relevantRunewords.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-sanctuary-400 font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-d2-rune" />
                        組成之符文語 ({relevantRunewords.length}組):
                      </span>
                      <span className="text-[9px] text-sanctuary-500">點擊查看配方</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin">
                      {relevantRunewords.map((rw) => (
                        <button
                          key={rw.id}
                          type="button"
                          onClick={() => onNavigateToRuneword?.(rw.name)}
                          className="group/tag px-2 py-0.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-800 border border-sanctuary-750 hover:border-d2-unique text-[11px] font-mono text-d2-unique transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                          title={`點擊跳轉至【${rw.name} (${rw.nameEn})】完整組成細節與屬性`}
                        >
                          <span>{rw.name}</span>
                          <span className="text-[9px] text-d2-unique/60 group-hover/tag:text-d2-unique">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
  );
};
