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
  Shield,
  Sparkles
} from 'lucide-react';

export const UberBossGuide: React.FC = () => {
  const { t, isEn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tristram' | 'dclone'>('tristram');

  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = env.endsWith('/') ? env : `${env}/`;

  // Image Asset Paths
  const imgCountess = `${baseUrl}images/monsters/countess.webp`;
  const imgSummoner = `${baseUrl}images/monsters/summoner.webp`;
  const imgNihlathak = `${baseUrl}images/monsters/nihlathakboss.webp`;
  const imgUberKey = `${baseUrl}images/items/props/uber_key.gif`;
  const imgCube = `${baseUrl}images/items/props/horadric_cube.gif`;

  const imgLilith = `${baseUrl}images/monsters/lilith.webp`;
  const imgUberDuriel = `${baseUrl}images/monsters/uberduriel.webp`;
  const imgUberIzual = `${baseUrl}images/monsters/uberizual.webp`;
  const imgBaalEye = `${baseUrl}images/items/props/baal_eye.gif`;
  const imgDiabloHorn = `${baseUrl}images/items/props/diablo_horn.gif`;
  const imgMephistoBrain = `${baseUrl}images/items/props/mephisto_brain.gif`;

  const imgUberMephisto = `${baseUrl}images/monsters/ubermephisto.webp`;
  const imgUberBaal = `${baseUrl}images/monsters/uberbaal.webp`;
  const imgUberDiablo = `${baseUrl}images/monsters/uberdiablo.webp`;
  const imgTorch = `${baseUrl}images/items/charms/torch.jpg`;

  const imgDiabloClone = `${baseUrl}images/monsters/diabloclone.webp`;
  const imgAnni = `${baseUrl}images/items/charms/anni.gif`;
  const imgPaladin = `${baseUrl}images/classes/paladin.webp`;

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
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
          {/* Progression Overview Visual Pipeline */}
          <div className="bg-gradient-to-r from-sanctuary-900/80 via-sanctuary-950/90 to-sanctuary-900/80 p-4 sm:p-5 rounded-3xl border border-sanctuary-800/90 space-y-3">
            <div className="flex items-center justify-between text-xs text-sanctuary-400 font-mono">
              <span className="flex items-center gap-1.5 text-d2-unique font-bold">
                <Sparkles className="w-4 h-4 text-d2-fire animate-pulse" />
                {isEn ? 'PANDEMONIUM EVENT PROGRESSION ROADMAP' : '紅門六王終極事件通關全景圖解'}
              </span>
              <span className="hidden sm:inline text-sanctuary-500">
                {isEn ? 'Hell Difficulty Only · Act V Town' : '限地獄難度 · 第五章城鎮開門'}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Step 1 Visual */}
              <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-d2-gold/40 bg-sanctuary-900 flex items-center justify-center">
                  <img src={imgUberKey} alt="Keys" className="w-8 h-8 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-d2-gold font-bold">{isEn ? 'Step 1' : '第 1 階段'}</div>
                  <div className="text-xs font-bold text-sanctuary-100 truncate">{isEn ? '9 Keys' : '收集 9 把鑰匙'}</div>
                  <div className="text-[10px] text-sanctuary-400 truncate">{isEn ? '3x Terror, Hate, Destr.' : '3色鑰匙各3把'}</div>
                </div>
              </div>

              {/* Step 2 Visual */}
              <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-d2-fire/40 bg-sanctuary-900 flex items-center justify-center">
                  <img src={imgCube} alt="Cube" className="w-8 h-8 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-d2-fire font-bold">{isEn ? 'Step 2' : '第 2 階段'}</div>
                  <div className="text-xs font-bold text-sanctuary-100 truncate">{isEn ? '3 Red Portals' : '開啟三紅門'}</div>
                  <div className="text-[10px] text-sanctuary-400 truncate">{isEn ? 'Lilith, Duriel, Izual' : '莉莉絲/督瑞爾/衣卒爾'}</div>
                </div>
              </div>

              {/* Step 3 Visual */}
              <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-500/40 bg-sanctuary-900 flex items-center justify-center">
                  <img src={imgMephistoBrain} alt="Organs" className="w-8 h-8 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-purple-400 font-bold">{isEn ? 'Step 3' : '第 3 階段'}</div>
                  <div className="text-xs font-bold text-sanctuary-100 truncate">{isEn ? '3 Organs' : '三大魔神器官'}</div>
                  <div className="text-[10px] text-sanctuary-400 truncate">{isEn ? 'Eye, Brain, Horn' : '眼球、大腦、魔角'}</div>
                </div>
              </div>

              {/* Step 4 Visual */}
              <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-d2-unique/60 bg-gradient-to-br from-sanctuary-950 to-d2-unique/10 flex items-center gap-3 shadow-[0_0_15px_rgba(200,165,100,0.15)]">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-d2-unique bg-sanctuary-900 flex items-center justify-center">
                  <img src={imgTorch} alt="Hellfire Torch" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-d2-unique font-bold">{isEn ? 'Goal' : '終極目標'}</div>
                  <div className="text-xs font-bold text-d2-unique truncate">{isEn ? 'Hellfire Torch' : '地獄火炬 (+3技能)'}</div>
                  <div className="text-[10px] text-sanctuary-300 truncate">{isEn ? '+ Standard of Heroes' : '+ 英雄旗幟'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Steps Detailed Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-diablo font-bold text-sanctuary-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-d2-gold" />
              {isEn ? '3-Stage Progression: Keys ➔ Organs ➔ Uber Tristram' : '三大攻略階段：鑰匙 ➔ 器官 ➔ 超級崔斯特姆'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── Stage 1: Key Farming ── */}
              <div className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-3xl p-6 flex flex-col justify-between hover:border-d2-gold/50 transition-all group space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-d2-gold/15 text-d2-gold border border-d2-gold/30 font-diablo font-bold text-base flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-mono text-sanctuary-400">
                      {UBER_TRISTRAM_GUIDE.steps[0].boss}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-gold transition-colors">
                    {UBER_TRISTRAM_GUIDE.steps[0].title}
                  </h4>

                  {/* Stage 1 Visual Gallery: 3 Key Keepers & Keys */}
                  <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 space-y-2">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase flex items-center justify-between">
                      <span>{isEn ? 'Key Guardians & Drop Items:' : '三大鑰匙守護者與產出：'}</span>
                      <span className="text-d2-gold font-bold">Rate ~1/14</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Countess */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgCountess} alt="The Countess" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Countess' : '女伯爵'}</span>
                        <span className="text-[10px] text-d2-gold font-mono">{isEn ? 'Terror Key' : '恐懼之鑰'}</span>
                      </div>

                      {/* Summoner */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgSummoner} alt="The Summoner" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Summoner' : '召喚者'}</span>
                        <span className="text-[10px] text-d2-gold font-mono">{isEn ? 'Hate Key' : '憎恨之鑰'}</span>
                      </div>

                      {/* Nihlathak */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgNihlathak} alt="Nihlathak" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Nihlathak' : '尼拉塞克'}</span>
                        <span className="text-[10px] text-d2-gold font-mono">{isEn ? 'Destr. Key' : '毀滅之鑰'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1.5 bg-sanctuary-950/70 p-3.5 rounded-2xl border border-sanctuary-800/80">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase">
                      {isEn ? 'Requirements & Conditions:' : '所需材料與條件：'}
                    </div>
                    {UBER_TRISTRAM_GUIDE.steps[0].requirements.map((req, rIdx) => (
                      <div key={rIdx} className="text-xs text-sanctuary-200 flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-d2-gold shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="text-xs bg-sanctuary-900/60 p-3 rounded-xl border border-sanctuary-800 text-sanctuary-300 flex items-center gap-2">
                    <img src={imgUberKey} alt="Key" className="w-5 h-5 object-contain shrink-0" />
                    <div>
                      <span className="text-d2-gold font-bold font-mono">{isEn ? "Stage Rewards: " : "階段收穫："}</span>
                      {UBER_TRISTRAM_GUIDE.steps[0].rewards}
                    </div>
                  </div>

                  {/* Strategy */}
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    <span className="text-sanctuary-200 font-bold">{isEn ? "Tactical Tips: " : "戰術秘訣："}</span>
                    {UBER_TRISTRAM_GUIDE.steps[0].strategy}
                  </p>
                </div>
              </div>

              {/* ── Stage 2: Three Mini-Ubers ── */}
              <div className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-3xl p-6 flex flex-col justify-between hover:border-d2-fire/50 transition-all group space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-d2-fire/15 text-d2-fire border border-d2-fire/30 font-diablo font-bold text-base flex items-center justify-center">
                      2
                    </span>
                    <span className="text-xs font-mono text-sanctuary-400">
                      {UBER_TRISTRAM_GUIDE.steps[1].boss}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-fire transition-colors">
                    {UBER_TRISTRAM_GUIDE.steps[1].title}
                  </h4>

                  {/* Stage 2 Visual Gallery: 3 Mini Bosses & 3 Organs */}
                  <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 space-y-2">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase flex items-center justify-between">
                      <span>{isEn ? 'Mini-Uber Bosses & Organs:' : '三大紅門魔首與對應器官：'}</span>
                      <span className="text-d2-fire font-bold">100% Drop</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Lilith -> Eye */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgLilith} alt="Lilith" className="w-full h-full object-cover object-top" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl bg-sanctuary-950/90 flex items-center justify-center p-0.5 border-t border-l border-sanctuary-700">
                            <img src={imgBaalEye} alt="Baal's Eye" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Lilith' : '莉莉絲'}</span>
                        <span className="text-[10px] text-purple-400 font-mono">{isEn ? "Baal's Eye" : '巴爾之眼'}</span>
                      </div>

                      {/* Uber Duriel -> Brain */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgUberDuriel} alt="Uber Duriel" className="w-full h-full object-cover object-top" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl bg-sanctuary-950/90 flex items-center justify-center p-0.5 border-t border-l border-sanctuary-700">
                            <img src={imgMephistoBrain} alt="Mephisto's Brain" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Uber Duriel' : '超級都瑞爾'}</span>
                        <span className="text-[10px] text-purple-400 font-mono">{isEn ? 'Meph Brain' : '墨菲之腦'}</span>
                      </div>

                      {/* Uber Izual -> Horn */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgUberIzual} alt="Uber Izual" className="w-full h-full object-cover object-top" />
                          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl bg-sanctuary-950/90 flex items-center justify-center p-0.5 border-t border-l border-sanctuary-700">
                            <img src={imgDiabloHorn} alt="Diablo's Horn" className="w-full h-full object-contain" />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Uber Izual' : '超級伊卒爾'}</span>
                        <span className="text-[10px] text-purple-400 font-mono">{isEn ? 'Diablo Horn' : '菠蘿之角'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1.5 bg-sanctuary-950/70 p-3.5 rounded-2xl border border-sanctuary-800/80">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase">
                      {isEn ? 'Requirements & Conditions:' : '所需材料與條件：'}
                    </div>
                    {UBER_TRISTRAM_GUIDE.steps[1].requirements.map((req, rIdx) => (
                      <div key={rIdx} className="text-xs text-sanctuary-200 flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-d2-fire shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="text-xs bg-sanctuary-900/60 p-3 rounded-xl border border-sanctuary-800 text-sanctuary-300 flex items-center gap-2">
                    <div className="flex -space-x-1 shrink-0">
                      <img src={imgBaalEye} alt="Eye" className="w-4 h-4 object-contain" />
                      <img src={imgMephistoBrain} alt="Brain" className="w-4 h-4 object-contain" />
                      <img src={imgDiabloHorn} alt="Horn" className="w-4 h-4 object-contain" />
                    </div>
                    <div>
                      <span className="text-d2-fire font-bold font-mono">{isEn ? "Stage Rewards: " : "階段收穫："}</span>
                      {UBER_TRISTRAM_GUIDE.steps[1].rewards}
                    </div>
                  </div>

                  {/* Strategy */}
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    <span className="text-sanctuary-200 font-bold">{isEn ? "Tactical Tips: " : "戰術秘訣："}</span>
                    {UBER_TRISTRAM_GUIDE.steps[1].strategy}
                  </p>
                </div>
              </div>

              {/* ── Stage 3: Uber Tristram ── */}
              <div className="bg-sanctuary-900/40 border border-sanctuary-800 rounded-3xl p-6 flex flex-col justify-between hover:border-d2-unique/60 transition-all group space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-diablo font-bold text-base flex items-center justify-center">
                      3
                    </span>
                    <span className="text-xs font-mono text-sanctuary-400">
                      {UBER_TRISTRAM_GUIDE.steps[2].boss}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-sanctuary-100 group-hover:text-d2-unique transition-colors">
                    {UBER_TRISTRAM_GUIDE.steps[2].title}
                  </h4>

                  {/* Stage 3 Visual Gallery: 3 Prime Evils & Torch */}
                  <div className="p-3 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800/80 space-y-2">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase flex items-center justify-between">
                      <span>{isEn ? 'The Three Prime Evils:' : '超級崔斯特姆三巨頭：'}</span>
                      <span className="text-d2-unique font-bold">Torch Goal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Uber Mephisto */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgUberMephisto} alt="Uber Mephisto" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Uber Mephisto' : '超級墨菲'}</span>
                        <span className="text-[10px] text-d2-fire font-mono">{isEn ? 'Lv20 Aura' : '20級信念'}</span>
                      </div>

                      {/* Uber Baal */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgUberBaal} alt="Uber Baal" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Uber Baal' : '超級巴爾'}</span>
                        <span className="text-[10px] text-sanctuary-400 font-mono">{isEn ? 'Mana Burn' : '法力燃燒'}</span>
                      </div>

                      {/* Uber Diablo */}
                      <div className="flex flex-col items-center text-center p-2 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-sanctuary-700 bg-sanctuary-950 mb-1">
                          <img src={imgUberDiablo} alt="Uber Diablo" className="w-full h-full object-cover object-top" />
                        </div>
                        <span className="text-[11px] font-bold text-sanctuary-200 truncate w-full">{isEn ? 'Uber Diablo' : '超級菠蘿'}</span>
                        <span className="text-[10px] text-d2-fire font-mono">{isEn ? 'Armageddon' : '毀天滅地'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1.5 bg-sanctuary-950/70 p-3.5 rounded-2xl border border-sanctuary-800/80">
                    <div className="text-[10px] font-mono font-bold text-sanctuary-500 uppercase">
                      {isEn ? 'Requirements & Conditions:' : '所需材料與條件：'}
                    </div>
                    {UBER_TRISTRAM_GUIDE.steps[2].requirements.map((req, rIdx) => (
                      <div key={rIdx} className="text-xs text-sanctuary-200 flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-d2-unique shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="text-xs bg-sanctuary-900/60 p-3 rounded-xl border border-d2-unique/40 text-sanctuary-300 flex items-center gap-3 bg-d2-unique/5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-d2-unique bg-sanctuary-950 shadow">
                      <img src={imgTorch} alt="Torch" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-d2-unique font-bold font-mono">{isEn ? "Stage Rewards: " : "階段收穫："}</span>
                      {UBER_TRISTRAM_GUIDE.steps[2].rewards}
                    </div>
                  </div>

                  {/* Strategy */}
                  <p className="text-xs text-sanctuary-400 leading-relaxed">
                    <span className="text-sanctuary-200 font-bold">{isEn ? "Tactical Tips: " : "戰術秘訣："}</span>
                    {UBER_TRISTRAM_GUIDE.steps[2].strategy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Smiter Rules Callout with Paladin Portrait */}
          <div className="bg-sanctuary-900/50 border border-sanctuary-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-d2-gold/50 bg-sanctuary-950 shadow-lg shadow-d2-gold/10">
                <img src={imgPaladin} alt="Paladin Smiter" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 border border-d2-gold/30 rounded-2xl pointer-events-none" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-d2-gold font-mono text-xs font-bold uppercase">
                  <Shield className="w-4 h-4 text-d2-gold" />
                  {isEn ? 'THE UNDISPUTED PANDEMONIUM KING' : '紅門無冕之王 · 最強單挑流派'}
                </div>
                <h3 className="text-xl sm:text-2xl font-diablo font-bold text-sanctuary-100 mt-0.5">
                  {isEn ? "Smiter Paladin: 5 Essential Gear Rules" : "盾擊聖騎士 (Smiter) 必勝五大配裝鐵律"}
                </h3>
                <p className="text-xs text-sanctuary-400 mt-1">
                  {isEn ? "Why is Smiter the most reliable and affordable class for Pandemonium Event? Master these 5 mechanics for an easy solo clear." : "為何盾擊騎是通關紅門最穩、造價最低的職業？掌握以下五條核心機制即可輕鬆單刷。"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {UBER_TRISTRAM_GUIDE.smiterRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-sanctuary-950/80 p-4 rounded-2xl border border-sanctuary-800 space-y-1.5 hover:border-sanctuary-700 transition-colors"
                >
                  <div className="flex items-center gap-2 text-d2-fire font-bold text-sm">
                    <Zap className="w-4 h-4 shrink-0 text-d2-gold" />
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
        <div className="space-y-6">
          {/* Diablo Clone Visual Showcase Hero Card */}
          <div className="bg-gradient-to-r from-d2-blood/20 via-sanctuary-900/80 to-sanctuary-950 border border-d2-blood/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_25px_rgba(180,40,40,0.15)]">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-d2-blood/60 bg-sanctuary-950 shadow-[0_0_20px_rgba(200,40,40,0.3)]">
                <img src={imgDiabloClone} alt="Diablo Clone" className="w-full h-full object-cover object-top" />
                <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-d2-blood text-white text-[9px] font-bold font-mono tracking-wider">
                  CLONE
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-d2-blood text-xs font-mono font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-d2-fire animate-pulse" />
                  {isEn ? 'WORLD EVENT INVASION' : '世界事件 · 喬丹之石售出祭儀'}
                </div>
                <h3 className="text-2xl sm:text-3xl font-diablo font-bold text-sanctuary-100">
                  {UBER_TRISTRAM_GUIDE.dcloneGuide.title}
                </h3>
                <p className="text-xs text-sanctuary-400 max-w-xl">
                  {isEn ? "Special world event to obtain the essential Unique Small Charm: Annihilus." : "獲取全職業必備暗金小型咒符【滅絕小型咒符 (Annihilus / 毀符)】的特殊世界事件。"}
                </p>
              </div>
            </div>

            {/* Annihilus Charm Showcase Box */}
            <div className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-sanctuary-950/90 border border-d2-unique/60 shadow-[0_0_15px_rgba(200,165,100,0.2)] shrink-0">
              <div className="w-12 h-12 rounded-xl bg-sanctuary-900 border border-d2-unique/40 flex items-center justify-center p-1">
                <img src={imgAnni} alt="Annihilus" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-d2-unique font-bold">{isEn ? 'Unique Small Charm' : '暗金小型咒符'}</div>
                <div className="text-sm font-bold text-d2-unique">{isEn ? 'Annihilus' : '滅絕 (毀滅小符)'}</div>
                <div className="text-[10px] text-sanctuary-400 font-mono">+1 All Skills · +10-20 Stats/Res</div>
              </div>
            </div>
          </div>

          {/* 3 Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2.5 hover:border-sanctuary-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-d2-gold uppercase">
                <span className="w-5 h-5 rounded-md bg-d2-gold/20 text-d2-gold border border-d2-gold/40 flex items-center justify-center text-xs">1</span>
                {isEn ? "SOJ Counter Trigger" : "觸發機制 (SOJ Counter)"}
              </div>
              <p className="text-xs text-sanctuary-300 leading-relaxed">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.mechanics}
              </p>
            </div>

            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2.5 hover:border-sanctuary-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-d2-fire uppercase">
                <span className="w-5 h-5 rounded-md bg-d2-fire/20 text-d2-fire border border-d2-fire/40 flex items-center justify-center text-xs">2</span>
                {isEn ? "Spawn Location" : "降臨地點 (Spawn Location)"}
              </div>
              <p className="text-xs text-sanctuary-300 leading-relaxed">
                {UBER_TRISTRAM_GUIDE.dcloneGuide.spawnRule}
              </p>
            </div>

            <div className="bg-sanctuary-950/80 p-5 rounded-2xl border border-sanctuary-800 space-y-2.5 hover:border-sanctuary-700 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-d2-unique uppercase">
                <span className="w-5 h-5 rounded-md bg-d2-unique/20 text-d2-unique border border-d2-unique/40 flex items-center justify-center text-xs">3</span>
                {isEn ? "Guaranteed Reward" : "擊殺必掉 (Guaranteed Reward)"}
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
