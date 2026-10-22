import React, { useState } from 'react';
import { CHARACTER_CLASSES_DATA } from '../../data/classes';
import { 
  Users, 
  Shield, 
  Swords, 
  Sparkles, 
  Compass, 
  Flame, 
  Zap, 
  Crosshair, 
  Skull, 
  Snowflake, 
  Sword 
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
  const [selectedClassId, setSelectedClassId] = useState<string>('sorceress');

  const currentClass = CHARACTER_CLASSES_DATA.find((c) => c.id === selectedClassId) || CHARACTER_CLASSES_DATA[0];

  const getClassIcon = (id: string) => {
    switch (id) {
      case 'sorceress': return <Flame className="w-4 h-4 text-d2-fire" />;
      case 'paladin': return <Shield className="w-4 h-4 text-d2-gold" />;
      case 'amazon': return <Crosshair className="w-4 h-4 text-d2-rare" />;
      case 'necromancer': return <Skull className="w-4 h-4 text-d2-poison" />;
      case 'barbarian': return <Sword className="w-4 h-4 text-d2-blood" />;
      case 'druid': return <Snowflake className="w-4 h-4 text-d2-cold" />;
      case 'assassin': return <Zap className="w-4 h-4 text-d2-lightning" />;
      case 'warlock': return <Flame className="w-4 h-4 text-d2-unique" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  // Class-specific base weapon and armor mechanics
  const classSpecificGear: Record<string, { title: string; desc: string; topBases: string[] }> = {
    sorceress: {
      title: "魔法使專用單手寶珠 (Sorceress Orbs)",
      desc: "次元碎片、怪異之球、艾斯屈塔。原生可帶有 +3 單系技能與 +3 暴風雪/連鎖閃電等神級底材技能。",
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
      topBases: ["破隱法杖 (死亡之網 -50%毒抗)", "魔胎 (Homunculus)", "白骨盾牌 (+3衰老 +3骨矛)"]
    },
    barbarian: {
      title: "野蠻人專用頭盔 (Barbarian Primal Helms)",
      desc: "亞瑞特的面容 (神頭)；原生帶有 +3 戰鬥狂嗥、+3 戰鬥命令 (BO喊血) 的野蠻人專用頭盔是極品副手與主手。",
      topBases: ["亞瑞特的面容 (Arreat's Face)", "惡魔頭角 (+3戰鬥命令 3孔治癒頭底材)", "殺手護盔"]
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

  const gearInfo = classSpecificGear[currentClass.id] || classSpecificGear.sorceress;

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
            八大英雄角色寶典與機制圖解
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-3xl">
            收錄全職業屬性成長曲線、加點黃金律、專屬底材與裝備分析、幀數斷點基底，以及終局主流流派圖解。
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
              <span>技能樹模擬器</span>
            </button>
          )}
          {onNavigateToBreakpoints && (
            <button
              onClick={() => onNavigateToBreakpoints(currentClass.name)}
              className="px-3.5 py-2 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-750 text-d2-unique text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>檔位斷點表</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-sanctuary-850 no-scrollbar">
        {CHARACTER_CLASSES_DATA.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-sanctuary-800 text-d2-unique border-d2-unique/60 shadow-md shadow-d2-unique/10 font-bold'
                  : 'bg-sanctuary-950/80 text-sanctuary-400 border-sanctuary-800 hover:text-sanctuary-200'
              }`}
            >
              <span>{getClassIcon(cls.id)}</span>
              <span>{cls.name}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-d2-unique uppercase tracking-widest">
                {currentClass.nameEn}
              </span>
              <span className="text-xs text-sanctuary-500">•</span>
              <span className="text-xs text-sanctuary-300 font-semibold">
                {currentClass.title}
              </span>
            </div>
            <h2 className="font-diablo text-3xl sm:text-4xl font-extrabold text-sanctuary-100">
              {currentClass.name}
            </h2>
            <p className="text-sm text-sanctuary-300 font-sans leading-relaxed">
              {currentClass.description}
            </p>

            {/* Golden Rule for Stat Points */}
            <div className="p-4 rounded-2xl bg-sanctuary-950/80 border border-d2-gold/30 text-xs space-y-1.5">
              <div className="text-d2-gold font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-d2-gold" />
                <span>暗黑 II 角色屬性點分配「黃金守則」：</span>
              </div>
              <p className="text-sanctuary-300 leading-relaxed pl-5 font-sans">
                • <strong>力量 (Str)</strong>：點到剛好能穿戴核心裝備即可（通常以統盾 156 力量或謎團加成後為基準）。<br />
                • <strong>敏捷 (Dex)</strong>：格擋流點到滿 75% 格擋率，其餘流派點到裝備需求即可。<br />
                • <strong>精力 (Ene)</strong>：原則上一點都不點！後期裝備與靈光冥想靈氣可徹底解決法力問題。<br />
                • <strong>活力 (Vit)</strong>：所有剩餘點數全部投入活力，最大化生命值抵禦猝死！
              </p>
            </div>
          </div>

          {/* Right Stat Growth Dashboard */}
          <div className="lg:col-span-4 bg-sanctuary-950 p-5 rounded-2xl border border-sanctuary-800 space-y-4 shadow-xl">
            <div className="text-xs font-mono text-sanctuary-400 font-bold uppercase tracking-wider pb-2 border-b border-sanctuary-850 flex items-center justify-between">
              <span>每點屬性增量成長</span>
              <Shield className="w-3.5 h-3.5 text-d2-unique" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">每點活力 ➔ 生命</span>
                <span className="text-d2-blood font-bold font-mono text-sm">
                  +{currentClass.statGains.lifePerVit} Life
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">每點精力 ➔ 法力</span>
                <span className="text-d2-magic font-bold font-mono text-sm">
                  +{currentClass.statGains.manaPerEne} Mana
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800/80">
                <span className="text-sanctuary-400">每點活力 ➔ 體力</span>
                <span className="text-d2-set font-bold font-mono text-sm">
                  +{currentClass.statGains.staminaPerVit} Stamina
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-sanctuary-500 font-mono">
              初始數值：生命 {currentClass.startingStats.life} | 法力 {currentClass.startingStats.mana} | 力 {currentClass.startingStats.str} | 敏 {currentClass.startingStats.dex}
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
              <span>{currentClass.name} 專屬裝備與極品底材</span>
            </h3>
            <p className="text-xs text-sanctuary-300 leading-relaxed">
              {gearInfo.desc}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono text-sanctuary-400">代表性指標底材與神裝：</div>
              <div className="space-y-2">
                {gearInfo.topBases.map((base, idx) => (
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
                      <span>查裝備</span>
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
              <span>{currentClass.name} 天梯主流終局流派 (Meta Builds)</span>
            </h3>

            <div className="space-y-4">
              {currentClass.popularBuilds.map((b, bIdx) => (
                <div
                  key={bIdx}
                  className="p-4 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800 hover:border-d2-gold/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-diablo text-base font-bold text-sanctuary-100 flex items-center gap-2">
                      <span>{b.name}</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-d2-gold/20 text-d2-gold border border-d2-gold/40">
                      TIER {b.tier}
                    </span>
                  </div>

                  <div className="text-xs font-sans space-y-1">
                    <div>
                      <span className="text-sanctuary-500 font-medium">核心技能組合：</span>
                      <span className="text-sanctuary-200">{b.coreSkills}</span>
                    </div>
                    <div>
                      <span className="text-sanctuary-500 font-medium">代表性配裝：</span>
                      <span className="text-d2-unique font-medium">
                        {b.gearSummary.split('+').map((gearItem, gIdx, arr) => {
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
                                      title={`前往查詢【${trimmedSub}】`}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
