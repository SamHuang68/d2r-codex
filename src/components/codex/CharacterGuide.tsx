import React, { useState } from 'react';
import { CHARACTER_CLASSES_DATA } from '../../data/classes';
import { CLASS_TRANSLATIONS } from '../../data/classTranslations';
import { useLanguage } from '../../context/LanguageContext';
import { getClassImage } from '../../utils/classImages';
import { 
  Shield, 
  Swords, 
  Sparkles, 
  Compass,
  Flame 
} from 'lucide-react';

export interface CharacterGuideProps {
  onNavigateToSkills?: (className: string) => void;
  onNavigateToBreakpoints?: (className: string) => void;
  onNavigateToRunewords?: (rwName: string) => void;
  onNavigateToItems?: (itemName: string) => void;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  onNavigateToSkills,
  onNavigateToBreakpoints,
  onNavigateToRunewords,
  onNavigateToItems,
}) => {
  const { t, isEn } = useLanguage();
  const [selectedClassId, setSelectedClassId] = useState<string>('sorceress');

  const currentClass = CHARACTER_CLASSES_DATA.find((c) => c.id === selectedClassId) || CHARACTER_CLASSES_DATA[0];
  const classTr = CLASS_TRANSLATIONS[currentClass.id];


  // Class-specific base weapon and armor mechanics
  const classSpecificGear: Record<string, { title: string; desc: string; topBases: string[] }> = {
    sorceress: {
      title: "魔法使專用單手法珠 (Sorceress Orbs)",
      desc: "次元法珠、異能法珠、艾斯屈塔。原生可帶有 +3 單系技能與 +3 暴風雪/連鎖閃電等神級底材技能。",
      topBases: ["死亡深度 (Death's Fathom)", "艾斯屈塔的憤怒 (Eschuta's Temper)", "核瞳 (The Oculus)"]
    },
    paladin: {
      title: "聖騎士專用重盾 (Paladin Shields)",
      desc: "原生附帶高達 +45 全抗性 (All Res) 或 +65% 增傷 +121 命中率！4孔神聖小盾是製作符文之語【精神】或【流亡】的最頂級底材。",
      topBases: ["神聖小盾 (Sacred Targe 60%高格擋)", "撒卡蘭姆使者 (Herald of Zakarum)", "庫拉斯特盾"]
    },
    amazon: {
      title: "亞馬遜專用神聖弓與標槍 (Amazon Weapons)",
      desc: "主母之弓與女傑之弓，原生可自帶 +3 弓與弩技能；泰坦的復仇與雷霆之擊標槍提供極速投擲彈幕。",
      topBases: ["泰坦的復仇 (Titan's Revenge)", "雷霆之擊 (Thunderstroke)", "主母之弓 (+3技能 4孔信心底材)"]
    },
    necromancer: {
      title: "死靈法師魔杖與專用頭骨盾 (Wands & Shrunken Heads)",
      desc: "魔胎 (Homunculus) 與骨焰；頂級白魔杖可帶有 +3 劇毒新星與衰老詛咒，是製作符文之語【骸骨】的最佳基底。",
      topBases: ["埋骨魔杖 (死亡之網 -50%毒抗)", "魔胎 (Homunculus)", "骨盾 (+3衰老 +3骨矛)"]
    },
    barbarian: {
      title: "野蠻人專用頭盔 (Barbarian Primal Helms)",
      desc: "亞瑞特的面容 (神頭，+2 野蠻人技能、+2 技能樹)；海拉柏德的國度原生帶有 +1~2 戰鬥命令 (BO)、+1~2 戰鬥指揮，兩頂都是野蠻人專用頭盔的極品。",
      topBases: ["亞瑞特的面容 (Arreat's Face)", "惡魔角尖 (Demonhorn's Edge)", "殺手護盔"]
    },
    druid: {
      title: "德魯伊專用狼頭與鹿頭 (Druid Pelts)",
      desc: "加爾的鬃毛；原生附帶 +3 龍捲風 (Tornado)、+3 狂怒 (Fury) 或 +3 毀天滅地的高級自然頭冠。",
      topBases: ["加爾的鬃毛 (Jalal's Mane)", "地獄犬之咬 (Cerebus' Bite)", "地土靈獸帽 (+3龍捲風 3孔變化底材)"]
    },
    assassin: {
      title: "刺客專用拳劍與爪 (Assassin Katars)",
      desc: "霸圖克的割喉爪；原生附帶 +3 陷阱、+3 雷光衛哨與武器格擋 (Weapon Block) 的雙持利爪。",
      topBases: ["霸圖克的割喉爪 (Bartuc's Cut-Throat)", "符紋爪 (+3雷光衛哨 3孔混沌底材)", "近身刃"]
    },
    warlock: {
      title: "術士專用禁忌魔典與邪異匕首 (Warlock Grimoires)",
      desc: "艾迪亞布羅斯學術；副手魔典可提供深淵僕從強化與混沌抗性穿透，是終局惡魔大軍核心。",
      topBases: ["權威魔典 (Grimoire of Authority)", "巫師會儀式匕首", "深淵支配之印"]
    }
  };

  const gearInfoZh = classSpecificGear[currentClass.id] || classSpecificGear.sorceress;
  const gearTitle = isEn && classTr ? classTr.gearInfo.title : gearInfoZh.title;
  const gearDesc = isEn && classTr ? classTr.gearInfo.desc : gearInfoZh.desc;
  const topBases = isEn && classTr ? classTr.gearInfo.topBases : gearInfoZh.topBases;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-fire text-xs font-mono tracking-widest uppercase">
            <Swords className="w-4 h-4 text-d2-fire animate-pulse" />
            Character Classes & Mechanics Compendium
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {t('八大英雄角色寶典與機制圖解', 'Character Classes & Mechanics Compendium')}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-3xl">
            {t('收錄全職業屬性成長曲線、加點黃金律、專屬底材與裝備分析、幀數斷點基底，以及終局主流流派圖解。', 'Stat progression curves, stat allocation rules, class-specific gear mechanics, and frame breakpoints.')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onNavigateToSkills && (
            <button
              onClick={() => onNavigateToSkills(currentClass.name)}
              className="px-3.5 py-2 rounded-xl bg-d2-gold text-sanctuary-950 font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5 transition-all shadow-md shadow-d2-gold/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-sanctuary-950" />
              <span>{t('技能樹模擬器', 'Skill Tree Simulator')}</span>
            </button>
          )}
          {onNavigateToBreakpoints && (
            <button
              onClick={() => onNavigateToBreakpoints(currentClass.name)}
              className="px-3.5 py-2 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-unique text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('檔位斷點表', 'Breakpoints Table')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Selector Tabs with Avatars */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-sanctuary-850 no-scrollbar">
        {CHARACTER_CLASSES_DATA.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/60 shadow-md shadow-d2-unique/10 font-bold'
                  : 'bg-sanctuary-950/80 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
              }`}
            >
              <img
                src={getClassImage(cls.id)}
                alt=""
                className={`w-6 h-6 rounded-full object-cover object-[75%_15%] border transition-transform ${
                  isSelected ? 'border-d2-unique scale-110 shadow-sm' : 'border-sanctuary-700/60 opacity-80'
                }`}
              />
              <span>{isEn && cls.nameEn ? cls.nameEn : cls.name}</span>
              {cls.isDLC && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-d2-fire/20 text-d2-fire font-mono font-bold">
                  RotW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Spotlight Banner */}
      <div className="bg-gradient-to-br from-sanctuary-900 via-sanctuary-950 to-sanctuary-900 p-6 sm:p-8 rounded-3xl border border-sanctuary-800 shadow-2xl relative overflow-hidden">
        {/* Character Profile Artwork Showcase */}
        <div className="relative group rounded-2xl overflow-hidden border border-sanctuary-750/90 bg-sanctuary-950 shadow-2xl mb-8">
          <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-sanctuary-950">
            <img
              src={getClassImage(currentClass.id)}
              alt={currentClass.nameEn}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Atmospheric Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-sanctuary-950 via-sanctuary-950/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-sanctuary-950/80 via-transparent to-sanctuary-950/60" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 sm:left-6 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-sanctuary-950/90 border border-sanctuary-700 text-xs font-mono font-bold text-d2-unique shadow-lg backdrop-blur-md">
                {currentClass.nameEn.toUpperCase()}
              </span>
              {currentClass.isDLC && (
                <span className="px-2 py-0.5 rounded-md bg-d2-fire/30 border border-d2-fire/60 text-[10px] font-bold text-d2-fire shadow-lg backdrop-blur-md">
                  {isEn ? 'RotW DLC Expansion' : '全新 DLC 擴充職業'}
                </span>
              )}
            </div>

            {/* Bottom Title Bar Overlay */}
            <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono text-sanctuary-400 uppercase tracking-widest">
                  {isEn ? 'OFFICIAL CLASS DOSSIER' : '官方典藏角色檔案'}
                </div>
                <div className="font-diablo text-xl sm:text-2xl font-extrabold text-sanctuary-100 drop-shadow-md">
                  {isEn && classTr ? classTr.title : currentClass.title}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-d2-unique uppercase tracking-widest">
                {currentClass.nameEn}
              </span>
              <span className="text-xs text-sanctuary-500">•</span>
              <span className="text-xs text-sanctuary-300 font-semibold">
                {isEn && classTr ? classTr.title : currentClass.title}
              </span>
            </div>
            <h2 className="font-diablo text-3xl sm:text-4xl font-extrabold text-sanctuary-100">
              {isEn && currentClass.nameEn ? currentClass.nameEn : currentClass.name}
            </h2>
            <p className="text-sm text-sanctuary-300 font-sans leading-relaxed">
              {isEn && classTr ? classTr.description : currentClass.description}
            </p>

            {/* Golden Rule for Stat Points */}
            <div className="p-4 rounded-2xl bg-sanctuary-950/80 border border-d2-gold/30 text-xs space-y-1.5">
              <div className="text-d2-gold font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-d2-gold" />
                <span>{isEn ? 'Diablo II Stat Points Allocation "Golden Rules":' : '暗黑 II 角色屬性點分配「黃金守則」：'}</span>
              </div>
              <p className="text-sanctuary-300 leading-relaxed pl-5 font-sans">
                {isEn ? (
                  <>
                    • <strong>Strength (Str)</strong>: Invest just enough to meet equipment requirements (typically 156 Str for Monarch or post-Enigma).<br />
                    • <strong>Dexterity (Dex)</strong>: Invest to reach 75% Max Block for shield builds, otherwise just enough for gear.<br />
                    • <strong>Energy (Ene)</strong>: Zero points invested! End-game gear and Insight Meditation aura completely solve mana.<br />
                    • <strong>Vitality (Vit)</strong>: Dump all remaining points here to maximize life and survive lethal bursts!
                  </>
                ) : (
                  <>
                    • <strong>力量 (Str)</strong>：點到剛好能穿戴核心裝備即可（通常以統盾 156 力量或謎團加成後為基準）。<br />
                    • <strong>敏捷 (Dex)</strong>：格擋流點到滿 75% 格擋率，其餘流派點到裝備需求即可。<br />
                    • <strong>精力 (Ene)</strong>：原則上一點都不點！後期裝備與靈光冥想靈氣可徹底解決法力問題。<br />
                    • <strong>活力 (Vit)</strong>：所有剩餘點數全部投入活力，最大化生命值抵禦猝死！
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Right Stat Growth Dashboard */}
          <div className="lg:col-span-4 bg-sanctuary-950 p-5 rounded-2xl border border-sanctuary-800 space-y-4 shadow-xl">
            <div className="text-xs font-mono text-sanctuary-400 font-bold uppercase tracking-wider pb-2 border-b border-sanctuary-850 flex items-center justify-between">
              <span>{isEn ? "Stat Gain per Point" : "每點屬性增量成長"}</span>
              <Shield className="w-3.5 h-3.5 text-d2-unique" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">{isEn ? "Vitality ➔ Life" : "每點活力 ➔ 生命"}</span>
                <span className="text-d2-blood font-bold font-mono text-sm">
                  +{currentClass.statGains.lifePerVit} {isEn ? "Life" : "生命"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">{isEn ? "Energy ➔ Mana" : "每點精力 ➔ 法力"}</span>
                <span className="text-d2-magic font-bold font-mono text-sm">
                  +{currentClass.statGains.manaPerEne} {isEn ? "Mana" : "法力"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">{isEn ? "Vitality ➔ Stamina" : "每點活力 ➔ 體力"}</span>
                <span className="text-d2-set font-bold font-mono text-sm">
                  +{currentClass.statGains.staminaPerVit} {isEn ? "Stamina" : "體力"}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-sanctuary-500 font-mono">
              {isEn ? `Base: Life ${currentClass.startingStats.life} | Mana ${currentClass.startingStats.mana} | Str ${currentClass.startingStats.str} | Dex ${currentClass.startingStats.dex}` : `初始數值：生命 ${currentClass.startingStats.life} | 法力 ${currentClass.startingStats.mana} | 力 ${currentClass.startingStats.str} | 敏 ${currentClass.startingStats.dex}`}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Exclusive Gear & S-Tier Builds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Class Exclusive Base Gear */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 space-y-4">
            <h3 className="font-diablo text-lg font-bold text-d2-unique flex items-center gap-2">
              <Shield className="w-4 h-4 text-d2-unique" />
              <span>{gearTitle}</span>
            </h3>
            <p className="text-xs text-sanctuary-300 leading-relaxed">
              {gearDesc}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono text-sanctuary-400">{isEn ? "Signature Bases & Trophies:" : "代表性指標底材與神裝："}</div>
              <div className="space-y-2">
                {topBases.map((base, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-sanctuary-900/70 border border-sanctuary-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-sanctuary-200 font-semibold">{base}</span>
                    <button
                      type="button"
                      onClick={() => onNavigateToItems?.(base.split(' ')[0])}
                      className="text-d2-unique hover:text-amber-300 text-[11px] font-mono flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{isEn ? "View" : "查裝備"}</span>
                      <span>↗</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Meta Builds Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 space-y-4">
            <h3 className="font-diablo text-lg font-bold text-d2-gold flex items-center gap-2">
              <Flame className="w-4 h-4 text-d2-gold" />
              <span>{isEn ? `${currentClass.nameEn || currentClass.name} Ladder Meta Builds` : `${currentClass.name} 天梯主流終局流派 (Meta Builds)`}</span>
            </h3>

            <div className="space-y-4">
              {currentClass.popularBuilds.map((b, bIdx) => {
                const buildTr = classTr?.popularBuilds[bIdx];
                const buildName = isEn && buildTr ? buildTr.name : b.name;
                const coreSkills = isEn && buildTr ? buildTr.coreSkills : b.coreSkills;
                const gearSummary = isEn && buildTr ? buildTr.gearSummary : b.gearSummary;

                return (
                  <div
                    key={bIdx}
                    className="p-4 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800 hover:border-d2-gold/50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-diablo text-base font-bold text-sanctuary-100 flex items-center gap-2">
                        <span>{buildName}</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-d2-gold/20 text-d2-gold border border-d2-gold/40">
                        TIER {b.tier}
                      </span>
                    </div>

                    <div className="text-xs font-sans space-y-1">
                      <div>
                        <span className="text-sanctuary-500 font-medium">{isEn ? "Core Skills: " : "核心技能組合："}</span>
                        <span className="text-sanctuary-200">{coreSkills}</span>
                      </div>
                      <div>
                        <span className="text-sanctuary-500 font-medium">{isEn ? "Signature Gear: " : "代表性配裝："}</span>
                        <span className="text-d2-unique font-medium">
                          {gearSummary.split('+').map((gearItem, gIdx, arr) => {
                            const cleanItem = gearItem.trim();
                            const subItems = cleanItem.includes('/') ? cleanItem.split('/') : [cleanItem];
                            return (
                              <React.Fragment key={gIdx}>
                                {subItems.map((sub, sIdx) => {
                                  const trimmedSub = sub.trim();
                                  return (
                                    <React.Fragment key={sIdx}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (onNavigateToItems) {
                                            onNavigateToItems(trimmedSub);
                                          } else {
                                            onNavigateToRunewords?.(trimmedSub);
                                          }
                                        }}
                                        className="hover:underline hover:text-amber-300 cursor-pointer"
                                        title={isEn ? `Search gear "${trimmedSub}"` : `前往查詢【${trimmedSub}】`}
                                      >
                                        {trimmedSub}
                                      </button>
                                      {sIdx < subItems.length - 1 && <span className="text-sanctuary-400 mx-0.5">/</span>}
                                    </React.Fragment>
                                  );
                                })}
                                {gIdx < arr.length - 1 && <span className="text-sanctuary-500 mx-1">+</span>}
                              </React.Fragment>
                            );
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
