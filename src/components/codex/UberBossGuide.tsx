import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { UBER_TRISTRAM_GUIDE } from '../../data/uberBosses';
import { 
  Skull, 
  Flame, 
  Key, 
  Trophy, 
  CheckCircle2, 
  Zap,
  Target
} from 'lucide-react';

export const UberBossGuide: React.FC = () => {
  const { t, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tristram' | 'dclone'>('tristram');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Skull className="w-4 h-4 text-d2-fire animate-pulse" />
            Endgame Uber Tristram & Diablo Clone Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {t('紅門六王與地表暗黑攻略寶典', 'Uber Tristram & Diablo Clone Guide')}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-2xl">
            {t('收錄地獄火炬 (Hellfire Torch) 9把鑰匙三紅門合成流程、盾擊聖騎士單挑六大魔神核心鐵律，以及超級迪亞布羅 (DClone 毀符) 刷新機制。', 'Complete endgame guide for Hellfire Torch (Key farming, Organs, Uber Tristram Smiter strategy) and Diablo Clone (Annihilus charm) spawning mechanics.')}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-sanctuary-900/80 p-1 rounded-xl border border-sanctuary-800 shrink-0">
          <button
            onClick={() => setActiveTab('tristram')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'tristram'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            {isEn ? 'Uber Tristram (Torch)' : '超級崔斯特姆 (火炬)'}
          </button>
          <button
            onClick={() => setActiveTab('dclone')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'dclone'
                ? 'bg-d2-fire text-sanctuary-950 font-bold shadow-lg shadow-d2-fire/20'
                : 'text-sanctuary-300 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'
            }`}
          >
            <Flame className="w-4 h-4" />
            {isEn ? 'Diablo Clone (Anni)' : '地表大菠蘿 (毀符)'}
          </button>
        </div>
      </div>

      {/* ── SubTab 1: 超級崔斯特姆 (Uber Tristram) ── */}
      {activeTab === 'tristram' && (
        <div className="space-y-8">
          {/* 3 Steps Pipeline Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-d2-gold" />
              {isEn ? '3-Stage Progression: Keys ➔ Organs ➔ Uber Tristram' : '三大攻略階段：鑰匙 ➔ 器官 ➔ 超級崔斯特姆'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {UBER_TRISTRAM_GUIDE.steps.map((st) => (
                <div
                  key={st.step}
                  className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-3xl p-6 flex flex-col justify-between hover:border-d2-gold/50 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-d2-gold/15 text-d2-gold border border-d2-gold/30 font-diablo font-bold text-base flex items-center justify-center">
                        {st.step}
                      </span>
                      <span className="text-xs font-mono text-sanctuary-400">
                        {st.boss}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-gold transition-colors">
                      {st.title}
                    </h4>

                    {/* Requirements */}
                    <div className="space-y-1.5 bg-sanctuary-950/70 p-3.5 rounded-2xl border border-sanctuary-800/80">
                      <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase">
                        {isEn ? 'Requirements & Conditions:' : '所需材料與條件：'}
                      </div>
                      {st.requirements.map((req, rIdx) => (
                        <div key={rIdx} className="text-xs text-sanctuary-200 flex items-start gap-1.5 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-d2-gold shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rewards */}
                    <div className="text-xs bg-sanctuary-900/60 p-3 rounded-xl border border-sanctuary-800 text-sanctuary-300">
                      <span className="text-d2-gold font-bold font-mono">{isEn ? "Stage Rewards: " : "階段收穫："}</span> {st.rewards}
                    </div>

                    {/* Strategy */}
                    <p className="text-xs text-sanctuary-400 leading-relaxed">
                      <span className="text-sanctuary-200 font-bold">{isEn ? "Tactical Tips: " : "戰術秘訣："}</span> {st.strategy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smiter Rules Callout */}
          <div className="bg-sanctuary-900/50 border border-sanctuary-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-d2-fire/15 text-d2-fire border border-d2-fire/30">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-diablo font-bold text-sanctuary-100">
                  {isEn ? "Smiter Paladin: 5 Essential Gear Rules" : "盾擊聖騎士 (Smiter) 必勝五大配裝鐵律"}
                </h3>
                <p className="text-xs text-sanctuary-400">
                  {isEn ? "Why is Smiter the most reliable and affordable class for Pandemonium Event? Master these 5 mechanics for an easy solo clear." : "為何盾擊騎是通關紅門最穩、造價最低的職業？掌握以下五條核心機制即可輕鬆單刷。"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {UBER_TRISTRAM_GUIDE.smiterRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-sanctuary-950/80 p-4 rounded-2xl border border-sanctuary-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-d2-fire font-bold text-sm">
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>{rule.name}</span>
                  </div>
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SubTab 2: 地表大菠蘿 (Diablo Clone) ── */}
      {activeTab === 'dclone' && (
        <div className="bg-sanctuary-900/50 border border-sanctuary-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-d2-blood/20 text-d2-blood border border-d2-blood/30">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-diablo font-bold text-sanctuary-100">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.title}
              </h3>
              <p className="text-xs text-sanctuary-400">
                {isEn ? "Special world event to obtain the essential Unique Small Charm: Annihilus." : "獲取全職業必備暗金小型咒符【滅絕小型咒符 (Annihilus)】的特殊世界事件。"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2">
              <div className="text-xs font-mono font-bold text-d2-gold uppercase">
                {isEn ? "① SOJ Counter Trigger" : "① 觸發機制 (SOJ Counter)"}
              </div>
              <p className="text-xs text-sanctuary-300 leading-relaxed">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.mechanics}
              </p>
            </div>

            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2">
              <div className="text-xs font-mono font-bold text-d2-fire uppercase">
                {isEn ? "② Spawn Location" : "② 降臨地點 (Spawn Location)"}
              </div>
              <p className="text-xs text-sanctuary-300 leading-relaxed">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.spawnRule}
              </p>
            </div>

            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2">
              <div className="text-xs font-mono font-bold text-d2-unique uppercase">
                {isEn ? "③ Guaranteed Reward" : "③ 擊殺必掉 (Guaranteed Reward)"}
              </div>
              <p className="text-xs text-sanctuary-300 leading-relaxed">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.dropReward}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
