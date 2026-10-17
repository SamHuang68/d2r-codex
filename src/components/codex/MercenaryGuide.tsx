import React, { useState } from 'react';
import { MERCENARIES_DATA } from '../../data/mercenaries';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Sword, 
  Award,
  Zap,
  Info
} from 'lucide-react';

export interface MercenaryGuideProps {
  onNavigateItem?: (itemName: string) => void;
}

export const MercenaryGuide: React.FC<MercenaryGuideProps> = ({ onNavigateItem }) => {
  const [selectedActId, setSelectedActId] = useState<string>('act2_desert');

  const currentMerc = MERCENARIES_DATA.find((m) => m.id === selectedActId) || MERCENARIES_DATA[0];

  const renderParsedItemLinks = (rawText: string, colorClass: string) => {
    if (rawText.includes('【') && rawText.includes('】')) {
      const parts = rawText.split(/(【[^】]+】)/g);
      return (
        <span className="flex items-center gap-1 flex-wrap justify-end">
          {parts.map((part, idx) => {
            if (part.startsWith('【') && part.endsWith('】')) {
              const itemName = part.slice(1, -1);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onNavigateItem?.(itemName)}
                  className={`${colorClass} hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5 transition-colors`}
                  title={`點擊查看【${itemName}】詳細屬性`}
                >
                  <span>【{itemName}】</span>
                  <span className="text-[9px] opacity-70">↗</span>
                </button>
              );
            }
            return (
              <span key={idx} className="text-sanctuary-400 font-normal">
                {part}
              </span>
            );
          })}
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onNavigateItem?.(rawText)}
        className={`${colorClass} font-bold hover:underline cursor-pointer transition-colors flex items-center gap-1`}
        title={`點擊跳轉查看【${rawText}】詳細屬性`}
      >
        <span>{rawText}</span>
        <span className="text-[9px] opacity-70">↗</span>
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Users className="w-4 h-4 text-d2-fire animate-pulse" />
            Mercenaries Compendium & Meta Builds
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            傭兵寶典與終局配裝
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            收錄第一幕至第五幕全部僱傭兵原生靈氣技能、Patch 2.4 重生改版機制、以及 S 級終極神裝（治癒三靈氣、無限破免、死神喪鐘、雙持狂亂狂戰士等）。
          </p>
        </div>
      </div>

      {/* Act Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MERCENARIES_DATA.map((merc) => {
          const isSelected = merc.id === selectedActId;
          return (
            <button
              key={merc.id}
              onClick={() => setSelectedActId(merc.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-sanctuary-900 border-d2-fire/80 shadow-glow-gold'
                  : 'bg-sanctuary-900/40 border-sanctuary-800/80 hover:border-sanctuary-700 hover:bg-sanctuary-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isSelected ? 'bg-d2-fire text-sanctuary-950' : 'bg-sanctuary-800 text-sanctuary-400'
                }`}>
                  Act {merc.act}
                </span>
                {merc.id === 'act2_desert' && (
                  <span className="text-[10px] text-d2-gold font-mono flex items-center gap-0.5">
                    <Award className="w-3 h-3" /> 最熱門
                  </span>
                )}
                {merc.id === 'act5_barbarian' && (
                  <span className="text-[10px] text-d2-unique font-mono flex items-center gap-0.5">
                    <Zap className="w-3 h-3" /> 2.4戰神
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-sm sm:text-base ${isSelected ? 'text-d2-fire' : 'text-sanctuary-100'}`}>
                  {merc.name}
                </h3>
                <p className="text-xs text-sanctuary-400 line-clamp-1 mt-0.5 font-mono">
                  {merc.type}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed View of Current Mercenary */}
      <div className="space-y-6">
        {/* Overview Banner */}
        <div className="bg-sanctuary-900/60 border border-sanctuary-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-d2-fire">
                第 {currentMerc.act} 章 · {currentMerc.nameEn}
              </div>
              <h2 className="text-2xl sm:text-3xl font-diablo font-bold text-sanctuary-100 mt-1">
                {currentMerc.name}
              </h2>
              <div className="text-xs text-d2-gold font-mono mt-0.5">
                定位：{currentMerc.type}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-sanctuary-950 border border-sanctuary-800 text-sanctuary-300">
                可穿戴：{currentMerc.equipmentTypes.join('、')}
              </span>
            </div>
          </div>

          <p className="text-sm text-sanctuary-300 leading-relaxed border-t border-sanctuary-800/80 pt-4">
            {currentMerc.description}
          </p>

          {/* 2.4 Patch highlights */}
          <div className="bg-sanctuary-950/80 border border-d2-gold/30 rounded-2xl p-4 flex gap-3 items-start">
            <Info className="w-5 h-5 text-d2-gold shrink-0 mt-0.5" />
            <div className="text-xs text-sanctuary-300 leading-relaxed">
              <span className="font-bold text-d2-gold font-mono">【Patch 2.4 重生改版亮點】：</span>
              {currentMerc.patch24Updates}
            </div>
          </div>

          {/* Native skills/auras list */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-sanctuary-400 uppercase tracking-wider">
              原生技能與光環靈氣：
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentMerc.nativeAurasOrSkills.map((sk, idx) => (
                <div 
                  key={idx}
                  className="bg-sanctuary-950/60 border border-sanctuary-800/80 rounded-xl p-3 text-xs text-sanctuary-200 flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-d2-fire shrink-0 mt-0.5" />
                  <span>{sk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Meta Builds */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-d2-fire" />
            <h3 className="text-xl font-diablo font-bold text-sanctuary-100">
              主流 S 級畢業配裝配置 (Meta Builds)
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentMerc.builds.map((build, idx) => (
              <div
                key={idx}
                className="bg-sanctuary-900/40 border border-sanctuary-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-sanctuary-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-d2-fire/15 text-d2-fire border border-d2-fire/30 font-bold">
                      推薦配置 #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-sanctuary-400">
                      {build.role}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors mb-3">
                    {build.name}
                  </h4>

                  {/* Gear Slots */}
                  <div className="space-y-2 bg-sanctuary-950/70 p-3.5 rounded-xl border border-sanctuary-800/80 mb-4 text-xs font-mono">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sanctuary-500 shrink-0">武器：</span>
                      {renderParsedItemLinks(build.weapon, 'text-d2-unique hover:text-amber-300')}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sanctuary-500 shrink-0">頭盔：</span>
                      {renderParsedItemLinks(build.helm, 'text-d2-set hover:text-green-300')}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sanctuary-500 shrink-0">盔甲：</span>
                      {renderParsedItemLinks(build.armor, 'text-d2-rune hover:text-orange-300')}
                    </div>
                  </div>

                  <p className="text-xs text-sanctuary-300 leading-relaxed mb-4">
                    {build.description}
                  </p>
                </div>

                {/* Strengths tags */}
                <div className="border-t border-sanctuary-800/80 pt-3">
                  <div className="text-[10px] font-mono text-sanctuary-500 mb-1.5">核心優勢：</div>
                  <div className="flex flex-wrap gap-1.5">
                    {build.strengths.map((str, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sanctuary-800/80 text-sanctuary-300 border border-sanctuary-700 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-d2-gold" />
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
