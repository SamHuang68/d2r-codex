import React, { useState } from 'react';
import { CHARACTER_CLASSES_DATA } from '../../data/classes';
import { Sparkles, Shield, Swords, Compass, Flame } from 'lucide-react';

interface ClassShowcaseProps {
  onCheckBreakpoints: (className: string) => void;
  onExploreSkills?: (className: string) => void;
  onExploreBuilds?: () => void;
}

export const ClassShowcase: React.FC<ClassShowcaseProps> = ({ 
  onCheckBreakpoints, 
  onExploreSkills, 
  onExploreBuilds 
}) => {
  const [selectedClassId, setSelectedClassId] = useState(CHARACTER_CLASSES_DATA[0].id);

  const currentClass = CHARACTER_CLASSES_DATA.find((c) => c.id === selectedClassId) || CHARACTER_CLASSES_DATA[0];

  return (
    <section className="py-16 bg-sanctuary-900/40 border-b border-sanctuary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-d2-fire/10 border border-d2-fire/30 text-xs text-d2-fire font-semibold uppercase tracking-wider mb-3">
            <Swords className="w-3.5 h-3.5" />
            <span>英雄殿堂 • {CHARACTER_CLASSES_DATA.length} 大職業深度解析</span>
          </div>
          <h2 className="font-diablo text-3xl sm:text-4xl font-bold text-sanctuary-100">
            選擇你的救世者或毀滅之源
          </h2>
          <p className="mt-2 text-sm text-sanctuary-400">
            從駕馭地獄禁術的全新術士，到執掌暴風雪的純冰法師，探索各職業專屬技能樹、屬性成長與終局流派。
          </p>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CHARACTER_CLASSES_DATA.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 shrink-0 border ${
                  isSelected
                    ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/60 shadow-glow-gold/20'
                    : 'bg-sanctuary-950/80 text-sanctuary-300 border-sanctuary-800 hover:border-sanctuary-700 hover:text-sanctuary-100'
                }`}
              >
                {cls.isDLC && (
                  <span className="px-1.5 py-0.2 text-[9px] font-mono bg-d2-fire/20 text-d2-fire rounded border border-d2-fire/40">
                    RotW
                  </span>
                )}
                <span>{cls.name}</span>
                <span className="text-[11px] text-sanctuary-400 font-mono hidden sm:inline">
                  ({cls.nameEn})
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Class Showcase Card */}
        <div className="bg-sanctuary-950 border border-sanctuary-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-d2-unique/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Lore & Stats */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-d2-unique tracking-widest uppercase">
                    {currentClass.nameEn}
                  </span>
                  {currentClass.isDLC && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-d2-fire/20 text-d2-fire border border-d2-fire/40 font-bold">
                      全新 DLC 職業
                    </span>
                  )}
                </div>
                <h3 className="font-diablo text-3xl font-extrabold text-sanctuary-100">
                  {currentClass.name}
                  <span className="text-lg font-normal text-d2-unique ml-3">
                    • {currentClass.title}
                  </span>
                </h3>
                <p className="mt-3 text-sm text-sanctuary-300 font-sans leading-relaxed">
                  {currentClass.description}
                </p>
              </div>

              {/* Stat Growths */}
              <div className="p-4 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                <div className="text-xs text-sanctuary-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-d2-unique" />
                  <span>核心屬性成長倍率</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-sanctuary-950 border border-sanctuary-800">
                    <div className="text-sanctuary-400 text-[11px]">每點活力 (Vit)</div>
                    <div className="text-d2-blood font-bold text-sm mt-0.5">+{currentClass.statGains.lifePerVit} 生命</div>
                  </div>
                  <div className="p-2 rounded bg-sanctuary-950 border border-sanctuary-800">
                    <div className="text-sanctuary-400 text-[11px]">每點精力 (Ene)</div>
                    <div className="text-d2-magic font-bold text-sm mt-0.5">+{currentClass.statGains.manaPerEne} 法力</div>
                  </div>
                  <div className="p-2 rounded bg-sanctuary-950 border border-sanctuary-800">
                    <div className="text-sanctuary-400 text-[11px]">每點活力 (Vit)</div>
                    <div className="text-d2-set font-bold text-sm mt-0.5">+{currentClass.statGains.staminaPerVit} 體力</div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Buttons */}
              <div className="space-y-2">
                {onExploreSkills && (
                  <button
                    onClick={() => onExploreSkills(currentClass.name)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-d2-gold text-sanctuary-950 font-bold text-xs tracking-wide hover:bg-amber-400 shadow-lg shadow-d2-gold/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-sanctuary-950" />
                    <span>開啟 {currentClass.name} 完整技能樹與加點模擬器</span>
                  </button>
                )}

                <button
                  onClick={() => onCheckBreakpoints(currentClass.name)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-unique text-xs font-semibold tracking-wide transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>檢視 {currentClass.name} 施法速度 (FCR) 與打擊恢復 (FHR) 斷點</span>
                </button>
              </div>
            </div>

            {/* Right Column: Skill Trees & Popular Builds */}
            <div className="lg:col-span-7 space-y-6">
              {/* Skill Trees */}
              <div>
                <h4 className="text-xs font-bold text-sanctuary-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-d2-fire" />
                  三大技能系別 (Skill Trees)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentClass.skillTrees.map((tree, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-sanctuary-900/70 border border-sanctuary-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-sanctuary-200">
                          {tree.name}
                        </div>
                        <div className="text-[11px] text-sanctuary-400 mt-1 leading-snug">
                          {tree.description}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-sanctuary-800 text-[10px] text-d2-unique font-medium">
                        代表技能: {tree.keySkills.slice(0, 2).join('、')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Endgame Builds */}
              <div>
                <h4 className="text-xs font-bold text-sanctuary-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-d2-unique" />
                  終局主流流派推薦 (Popular Builds)
                </h4>
                <div className="space-y-3">
                  {currentClass.popularBuilds.map((build, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-sanctuary-900 border border-sanctuary-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-mono">
                            {build.tier} 階
                          </span>
                          <span className="font-diablo text-sm font-bold text-sanctuary-100">
                            {build.name}
                          </span>
                        </div>
                        <div className="text-xs text-sanctuary-400">
                          <strong className="text-sanctuary-300">核心技能：</strong>{build.coreSkills}
                        </div>
                        <div className="text-xs text-d2-magic">
                          <strong className="text-sanctuary-300">畢業配裝：</strong>{build.gearSummary}
                        </div>
                      </div>

                      {onExploreBuilds && (
                        <button
                          onClick={onExploreBuilds}
                          className="px-3 py-1.5 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-750 text-d2-unique border border-sanctuary-700 text-xs font-mono shrink-0 transition-colors flex items-center gap-1 self-end sm:self-center"
                        >
                          <span>載入配裝</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
