import React, { useState } from 'react';
import { MERCENARIES_DATA } from '../../data/mercenaries';
import { MercenaryStats } from './MercenaryStats';
import { MercenaryMatrix } from './MercenaryMatrix';
import type { MercTierBuild } from '../../data/mercenaryMatrix';
import { useLanguage } from '../../context/LanguageContext';
import { getMercenaryVisual } from '../../utils/mercenaryImages';
import { ItemIcon } from '../common/ItemIcon';
import { 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Sword, 
  Award, 
  Zap, 
  Info, 
  Grid3X3, 
  BookOpen,
  MapPin,
  Shield
} from 'lucide-react';

export interface MercenaryGuideProps {
  onNavigateItem?: (itemName: string) => void;
  onNavigateToSimulator?: (tier: MercTierBuild, classCode?: string) => void;
}

export const MercenaryGuide: React.FC<MercenaryGuideProps> = ({ onNavigateItem, onNavigateToSimulator }) => {
  const { t, isEn } = useLanguage();
  const [viewMode, setViewMode] = useState<'matrix' | 'act_guide'>('matrix');
  const [selectedActId, setSelectedActId] = useState<string>('act2_desert');

  const currentMerc = MERCENARIES_DATA.find((m) => m.id === selectedActId) || MERCENARIES_DATA[0];
  const currentVisual = getMercenaryVisual(currentMerc.id);

  const renderParsedItemLinks = (rawText: string, colorClass: string, slot?: string) => {
    if (rawText.includes('【') && rawText.includes('】')) {
      const parts = rawText.split(/(【[^】]+】)/g);
      return (
        <span className="flex items-center gap-1.5 flex-wrap justify-end">
          {parts.map((part, idx) => {
            if (part.startsWith('【') && part.endsWith('】')) {
              const itemName = part.slice(1, -1);
              return (
                <span key={idx} className="inline-flex items-center gap-1">
                  <ItemIcon name={itemName} slot={slot} size="xs" showBorder={false} />
                  <button
                    type="button"
                    onClick={() => onNavigateItem?.(itemName)}
                    className={`${colorClass} hover:underline font-bold cursor-pointer inline-flex items-center gap-0.5 transition-colors`}
                    title={`點擊查看【${itemName}】詳細屬性`}
                  >
                    <span>【{itemName}】</span>
                    <span className="text-[9px] opacity-70">↗</span>
                  </button>
                </span>
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
      <span className="inline-flex items-center gap-1">
        <ItemIcon name={rawText} slot={slot} size="xs" showBorder={false} />
        <button
          type="button"
          onClick={() => onNavigateItem?.(rawText)}
          className={`${colorClass} font-bold hover:underline cursor-pointer transition-colors flex items-center gap-1`}
          title={`點擊跳轉查看【${rawText}】詳細屬性`}
        >
          <span>{rawText}</span>
          <span className="text-[9px] opacity-70">↗</span>
        </button>
      </span>
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
            {t('傭兵搭配矩陣與終局配裝', 'Mercenary Matrix & Meta Builds')}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            {t(
              '提供全職業主流流派 Matrix 矩陣對照（全裝成形 / 打寶專精 / 頂規畢業三段配置、一鍵帶入配裝模擬器），並完整收錄第一章至第五章傭兵百科數據與 Patch 2.4 改版機制。',
              'Comprehensive class-by-class mercenary build matrix with Starter, Magic Find, and BiS setups, 1-click armory export, and Patch 2.4 act compendiums.'
            )}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-sanctuary-900 border border-sanctuary-800 self-start md:self-end">
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-diablo transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-sanctuary-950 font-bold shadow-lg shadow-amber-950/40'
                : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>{t('📊 職業搭配矩陣 (Matrix)', '📊 Build Matrix')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('act_guide')}
            className={`px-4 py-2 rounded-xl text-xs font-diablo transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'act_guide'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-sanctuary-950 font-bold shadow-lg shadow-amber-950/40'
                : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('🛡️ 各章傭兵百科 (Act Guide)', '🛡️ Act Guide')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {viewMode === 'matrix' ? (
        <MercenaryMatrix
          onNavigateItem={onNavigateItem}
          onNavigateToSimulator={onNavigateToSimulator}
        />
      ) : (
        <div className="space-y-6">
          {/* Act Selection Tabs with Mercenary Portraits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MERCENARIES_DATA.map((merc) => {
              const isSelected = merc.id === selectedActId;
              const visual = getMercenaryVisual(merc.id);

              return (
                <button
                  key={merc.id}
                  onClick={() => setSelectedActId(merc.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-sanctuary-900 border-d2-fire shadow-glow-gold ring-1 ring-d2-fire/50'
                      : 'bg-sanctuary-900/40 border-sanctuary-800/80 hover:border-sanctuary-700 hover:bg-sanctuary-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-d2-fire text-sanctuary-950' : 'bg-sanctuary-800 text-sanctuary-400'
                    }`}>
                      Act {merc.act}
                    </span>
                    {merc.id === 'act2_desert' && (
                      <span className="text-[10px] text-d2-gold font-mono flex items-center gap-0.5 font-bold">
                        <Award className="w-3 h-3" /> {isEn ? 'Top Pick' : '最熱門'}
                      </span>
                    )}
                    {merc.id === 'act5_barbarian' && (
                      <span className="text-[10px] text-d2-unique font-mono flex items-center gap-0.5 font-bold">
                        <Zap className="w-3 h-3" /> {isEn ? 'Patch 2.4' : '2.4戰神'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-sanctuary-700/80 bg-sanctuary-950 shadow-inner">
                      <img
                        src={visual.image}
                        alt={merc.name}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-bold text-sm sm:text-base truncate transition-colors ${isSelected ? 'text-d2-fire' : 'text-sanctuary-100 group-hover:text-white'}`}>
                        {isEn ? merc.nameEn : merc.name}
                      </h3>
                      <p className="text-xs text-sanctuary-400 line-clamp-1 mt-0.5 font-mono">
                        {isEn ? visual.roleTagEn : merc.type}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed View of Current Mercenary */}
          <div className="space-y-6">
            {/* Overview Banner with Large Mercenary Portrait & Badges */}
            <div className="bg-gradient-to-r from-sanctuary-900/90 via-sanctuary-950/95 to-sanctuary-900/90 border border-sanctuary-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Large Portrait Card */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-d2-fire/50 bg-sanctuary-950 shadow-[0_0_20px_rgba(255,100,50,0.2)]">
                  <img
                    src={currentVisual.image}
                    alt={currentMerc.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-d2-fire text-sanctuary-950 text-[9px] font-bold font-mono tracking-wider">
                    ACT {currentMerc.act}
                  </div>
                </div>

                {/* Info Block */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-d2-fire font-bold">
                      {isEn ? `Act ${currentMerc.act} · ${currentMerc.nameEn}` : `第 ${currentMerc.act} 章 · ${currentMerc.nameEn}`}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-sanctuary-800/90 text-sanctuary-300 border border-sanctuary-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-d2-gold" />
                      {isEn ? `Recruit from: ${currentVisual.captainEn}` : `招募長官：${currentVisual.captainZh}`}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-diablo font-bold text-sanctuary-100">
                    {isEn ? currentMerc.nameEn : currentMerc.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-d2-gold font-bold">
                      {isEn ? "Role: " : "戰術定位："}{isEn ? currentVisual.roleTagEn : currentMerc.type}
                    </span>
                    <span className="text-sanctuary-600">·</span>
                    <span className="text-sanctuary-300">
                      {isEn ? "Equip: " : "可穿戴："}{currentMerc.equipmentTypes.join('、')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-sanctuary-300 leading-relaxed border-t border-sanctuary-800/80 pt-4 font-sans">
                {currentMerc.description}
              </p>

              {/* 2.4 Patch highlights */}
              <div className="bg-sanctuary-950/80 border border-d2-gold/30 rounded-2xl p-4 flex gap-3 items-start">
                <Info className="w-5 h-5 text-d2-gold shrink-0 mt-0.5" />
                <div className="text-xs text-sanctuary-300 leading-relaxed">
                  <span className="font-bold text-d2-gold font-mono">{isEn ? "[Patch 2.4 Resurrected Highlights]: " : "【Patch 2.4 重生改版亮點】："}</span>
                  {currentMerc.patch24Updates}
                </div>
              </div>

              {/* Native skills/auras list */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-sanctuary-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-d2-fire" />
                  {isEn ? "Native Skills & Granted Auras:" : "原生技能與光環靈氣："}
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

            {/* 資料表數值：每個難度雇得到的類型、傭兵等級對應的數值與技能 */}
            <MercenaryStats key={currentMerc.act} act={currentMerc.act} />

            {/* Recommended Meta Builds */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sword className="w-5 h-5 text-d2-fire" />
                <h3 className="text-xl font-diablo font-bold text-sanctuary-100">
                  {isEn ? "Recommended S-Tier Meta Builds" : "主流 S 級畢業配裝配置 (Meta Builds)"}
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
                          {isEn ? `Build Setup #${idx + 1}` : `推薦配置 #${idx + 1}`}
                        </span>
                        <span className="text-xs font-mono text-sanctuary-400">
                          {build.role}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors mb-3">
                        {build.name}
                      </h4>

                      {/* Gear Slots with Item Icons */}
                      <div className="space-y-2 bg-sanctuary-950/70 p-3.5 rounded-xl border border-sanctuary-800/80 mb-4 text-xs font-mono">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sanctuary-500 shrink-0">{isEn ? "Weapon: " : "武器："}</span>
                          {renderParsedItemLinks(build.weapon, 'text-d2-unique hover:text-amber-300', 'weapon')}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sanctuary-500 shrink-0">{isEn ? "Helm: " : "頭盔："}</span>
                          {renderParsedItemLinks(build.helm, 'text-d2-set hover:text-green-300', 'head')}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sanctuary-500 shrink-0">{isEn ? "Armor: " : "盔甲："}</span>
                          {renderParsedItemLinks(build.armor, 'text-d2-rune hover:text-orange-300', 'body')}
                        </div>
                      </div>

                      <p className="text-xs text-sanctuary-300 leading-relaxed mb-4">
                        {build.description}
                      </p>
                    </div>

                    {/* Strengths tags */}
                    <div className="border-t border-sanctuary-800/80 pt-3">
                      <div className="text-[10px] font-mono text-sanctuary-500 mb-1.5">{isEn ? "Key Strengths:" : "核心優勢："}</div>
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
      )}
    </div>
  );
};
