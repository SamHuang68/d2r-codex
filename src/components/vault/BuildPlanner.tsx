import React, { useState, useEffect } from 'react';
import { CharacterBuildPlan } from '../../types';
import { loadBuildPlans, saveBuildPlans } from '../../utils/storage';
import { BREAKPOINTS_DATA } from '../../data/breakpoints';
import { PRESET_META_BUILDS } from '../../data/presets';
import { Wrench, Plus, Trash2, CheckCircle2, Zap, Sparkles, BookOpen, X } from 'lucide-react';

export interface BuildPlannerProps {
  onNavigateToSkills?: (className: string) => void;
  onNavigateItem?: (itemName: string) => void;
}

export const BuildPlanner: React.FC<BuildPlannerProps> = ({ onNavigateToSkills, onNavigateItem }) => {
  const [plans, setPlans] = useState<CharacterBuildPlan[]>(loadBuildPlans());
  const [activePlanId, setActivePlanId] = useState<string>('');

  // Default initial plan if none exists
  useEffect(() => {
    if (plans.length === 0) {
      const defaultPlan: CharacterBuildPlan = {
        id: 'plan_sorc_demo',
        characterClass: '魔法使',
        buildName: '純冰暴風雪標配 (Blizzard Sorc)',
        targetLevel: 90,
        gear: {
          helm: '軍帽 (Harlequin Crest) - 鑲 24# 25% MF',
          armor: '謎團 (Enigma) / 蛇皮甲 (Vipermagi)',
          weapon1: '次元碎片 (Death\'s Fathom) +30% 冰傷',
          shield1: '精神統治者大盾 (Spirit Monarch) 35% FCR',
          weapon2: '戰爭召喚 (Call to Arms) 6 BO',
          shield2: '精神盾 (副手 +2 技能喊 BO)',
          gloves: '法師之拳 (Magefist) 20% FCR',
          boots: '戰爭旅者 (War Traveler) 50% MF',
          belt: '蛛網腰帶 (Arachnid Mesh) 20% FCR +1技能',
          amulet: '馬拉的萬花筒 (Mara\'s Kaleidoscope) +2技能 30全抗',
          ring1: '喬丹之石 (Stone of Jordan) +1技能 25%法力',
          ring2: '烏鴉之霜 (Raven Frost) 無法被凍結'
        },
        customStats: {
          fcr: 105,
          fhr: 60,
          allResist: 75,
          magicFind: 350,
          allSkills: 12
        },
        notes: '達標 105% FCR 8 幀施法檔位，兼顧 350% MF 快速高掉寶率。'
      };
      setPlans([defaultPlan]);
      setActivePlanId(defaultPlan.id);
      saveBuildPlans([defaultPlan]);
    } else if (!activePlanId) {
      setActivePlanId(plans[0].id);
    }
  }, [plans, activePlanId]);

  const currentPlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const updateCurrentPlan = (updater: (p: CharacterBuildPlan) => CharacterBuildPlan) => {
    setPlans((prev) => {
      const next = prev.map((p) => (p.id === activePlanId ? updater(p) : p));
      saveBuildPlans(next);
      return next;
    });
  };

  const createNewPlan = () => {
    const newPlan: CharacterBuildPlan = {
      id: `plan_${Date.now()}`,
      characterClass: '聖騎士',
      buildName: '新自訂流派配裝',
      targetLevel: 85,
      gear: {},
      customStats: {
        fcr: 0,
        fhr: 0,
        allResist: 0,
        magicFind: 0,
        allSkills: 0
      }
    };
    const next = [...plans, newPlan];
    setPlans(next);
    setActivePlanId(newPlan.id);
    saveBuildPlans(next);
  };

  const deleteCurrentPlan = () => {
    if (plans.length <= 1) {
      alert('至少需保留一個配裝方案。');
      return;
    }
    const next = plans.filter((p) => p.id !== activePlanId);
    setPlans(next);
    setActivePlanId(next[0].id);
    saveBuildPlans(next);
  };

  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);

  const handleLoadPreset = (preset: Omit<CharacterBuildPlan, 'id'>) => {
    const newPlan: CharacterBuildPlan = {
      ...preset,
      id: `plan_${Date.now()}`
    };
    const next = [...plans, newPlan];
    setPlans(next);
    setActivePlanId(newPlan.id);
    saveBuildPlans(next);
    setIsPresetModalOpen(false);
  };

  // Find class FCR breakpoint
  const classFcrBp = BREAKPOINTS_DATA.find(
    (bp) => bp.characterClass === currentPlan?.characterClass && bp.type === 'FCR'
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-diablo text-2xl sm:text-3xl font-bold text-sanctuary-100 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-d2-unique" />
            <span>角色配裝模擬工坊 (Build Planner)</span>
          </h2>
          <p className="text-xs sm:text-sm text-sanctuary-400 mt-1">
            自由配置 10 大欄位裝備，即時檢視 FCR / FHR 幀數檔位是否踩中核心門檻。
          </p>
        </div>

        {/* Plan Switcher & New Plan */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <select
            value={activePlanId}
            onChange={(e) => setActivePlanId(e.target.value)}
            className="bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-3 py-1.5 text-sanctuary-100 focus:outline-none"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.buildName} ({p.characterClass})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-d2-unique/20 hover:bg-d2-unique/30 border border-d2-unique/50 text-d2-unique transition-colors font-bold shadow-glow-gold shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>S級主流範本</span>
          </button>

          <button
            onClick={createNewPlan}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-750 border border-sanctuary-700 text-sanctuary-200 transition-colors font-medium shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>自訂</span>
          </button>

          <button
            onClick={deleteCurrentPlan}
            className="p-1.5 rounded-lg bg-sanctuary-900 hover:bg-sanctuary-850 border border-sanctuary-800 text-sanctuary-500 hover:text-d2-blood transition-colors"
            title="刪除當前方案"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {currentPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Build Info & Stats Aggregation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-medium">配置名稱</label>
                <input
                  type="text"
                  value={currentPlan.buildName}
                  onChange={(e) =>
                    updateCurrentPlan((p) => ({ ...p, buildName: e.target.value }))
                  }
                  className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-3 py-2 text-sm text-sanctuary-100 font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-sanctuary-400 mb-1 font-medium">職業</label>
                  <select
                    value={currentPlan.characterClass}
                    onChange={(e) =>
                      updateCurrentPlan((p) => ({ ...p, characterClass: e.target.value }))
                    }
                    className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-2.5 py-1.5 text-xs text-sanctuary-200 focus:outline-none"
                  >
                    {['魔法使', '聖騎士', '死靈法師', '術士', '亞馬遜', '野蠻人', '刺客', '德魯伊'].map(
                      (cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-sanctuary-400 mb-1 font-medium">目標等級</label>
                  <input
                    type="number"
                    value={currentPlan.targetLevel}
                    onChange={(e) =>
                      updateCurrentPlan((p) => ({ ...p, targetLevel: Number(e.target.value) }))
                    }
                    className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded-lg px-2.5 py-1.5 text-xs text-sanctuary-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stats Manual / Live Adjustment */}
              <div className="pt-3 border-t border-sanctuary-850 space-y-3">
                <div className="text-xs font-bold text-sanctuary-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-d2-fire" />
                  <span>核心面板屬性加總</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-sanctuary-400">總施法速度 (FCR %)</label>
                    <input
                      type="number"
                      value={currentPlan.customStats.fcr}
                      onChange={(e) =>
                        updateCurrentPlan((p) => ({
                          ...p,
                          customStats: { ...p.customStats, fcr: Number(e.target.value) }
                        }))
                      }
                      className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded px-2.5 py-1.5 text-d2-fire font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sanctuary-400">總打擊恢復 (FHR %)</label>
                    <input
                      type="number"
                      value={currentPlan.customStats.fhr}
                      onChange={(e) =>
                        updateCurrentPlan((p) => ({
                          ...p,
                          customStats: { ...p.customStats, fhr: Number(e.target.value) }
                        }))
                      }
                      className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded px-2.5 py-1.5 text-d2-unique font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sanctuary-400">地獄全抗性 (Resist %)</label>
                    <input
                      type="number"
                      value={currentPlan.customStats.allResist}
                      onChange={(e) =>
                        updateCurrentPlan((p) => ({
                          ...p,
                          customStats: { ...p.customStats, allResist: Number(e.target.value) }
                        }))
                      }
                      className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded px-2.5 py-1.5 text-d2-set font-bold mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sanctuary-400">更佳尋寶率 (MF %)</label>
                    <input
                      type="number"
                      value={currentPlan.customStats.magicFind}
                      onChange={(e) =>
                        updateCurrentPlan((p) => ({
                          ...p,
                          customStats: { ...p.customStats, magicFind: Number(e.target.value) }
                        }))
                      }
                      className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded px-2.5 py-1.5 text-d2-magic font-bold mt-1"
                    />
                  </div>
                </div>

                {/* Breakpoint Status Alert */}
                {classFcrBp && (
                  <div className="p-3 rounded-lg bg-sanctuary-900 border border-sanctuary-800 text-xs text-sanctuary-300">
                    <div className="font-semibold text-d2-unique mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-d2-set" />
                      <span>{currentPlan.characterClass} 施法幀數檢測：</span>
                    </div>
                    <div>
                      當前 {currentPlan.customStats.fcr}% FCR，標準檔位：
                      {classFcrBp.breakpoints.map((bp) => (
                        <span
                          key={bp.frames}
                          className={`inline-block mx-1 px-1.5 py-0.2 rounded text-[11px] ${
                            currentPlan.customStats.fcr >= bp.requiredValue
                              ? 'bg-d2-set/20 text-d2-set font-bold'
                              : 'text-sanctuary-500'
                          }`}
                        >
                          {bp.requiredValue}%({bp.frames}幀)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs text-sanctuary-400 mb-1 font-medium">配置備註與打寶策略</label>
                <textarea
                  value={currentPlan.notes || ''}
                  onChange={(e) =>
                    updateCurrentPlan((p) => ({ ...p, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full bg-sanctuary-900 border border-sanctuary-750 rounded-lg p-2.5 text-xs text-sanctuary-200 focus:outline-none"
                  placeholder="記錄此流派的打寶路線、鑲嵌物或傭兵配置..."
                />
              </div>

              {/* Jump to Skill Tree */}
              {onNavigateToSkills && (
                <button
                  onClick={() => onNavigateToSkills(currentPlan.characterClass)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sanctuary-900 hover:bg-sanctuary-850 border border-d2-gold/50 text-d2-gold text-xs font-bold tracking-wide transition-all shadow-md shadow-d2-gold/5"
                >
                  <Sparkles className="w-4 h-4 text-d2-gold" />
                  <span>進入 {currentPlan.characterClass} 技能加點模擬 (110點)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: 10 Gear Slots Loadout */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-sanctuary-950 border border-sanctuary-800 shadow-xl space-y-4">
              <div className="font-diablo text-base font-bold text-d2-unique flex items-center gap-2 pb-2 border-b border-sanctuary-850">
                <Sparkles className="w-4 h-4" />
                <span>裝備欄位配置 (Gear Slots)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { key: 'helm', label: '頭部 (Helm)' },
                  { key: 'armor', label: '衣服 (Body Armor)' },
                  { key: 'weapon1', label: '正手主武器 (Primary Weapon)' },
                  { key: 'shield1', label: '正手盾牌 (Primary Shield)' },
                  { key: 'weapon2', label: '副手切換 (Swap Weapon - CTA)' },
                  { key: 'shield2', label: '副手盾牌 (Swap Shield - Spirit)' },
                  { key: 'gloves', label: '手套 (Gloves)' },
                  { key: 'boots', label: '靴子 (Boots)' },
                  { key: 'belt', label: '腰帶 (Belt)' },
                  { key: 'amulet', label: '項鍊 (Amulet)' },
                  { key: 'ring1', label: '戒指 1 (Ring 1)' },
                  { key: 'ring2', label: '戒指 2 (Ring 2)' },
                ].map((slot) => {
                  const gearVal = (currentPlan.gear as any)[slot.key] || '';
                  return (
                    <div key={slot.key} className="p-3 rounded-xl bg-sanctuary-900/70 border border-sanctuary-800">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] text-sanctuary-400 font-medium">
                          {slot.label}
                        </label>
                        {gearVal && onNavigateItem && (
                          <button
                            type="button"
                            onClick={() => onNavigateItem(gearVal)}
                            className="text-[10px] text-d2-unique hover:text-amber-300 hover:underline cursor-pointer flex items-center gap-0.5 transition-colors"
                            title={`前往資料庫查閱【${gearVal}】詳細數值`}
                          >
                            <span>查資料庫</span>
                            <span className="text-[9px]">↗</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={gearVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCurrentPlan((p) => ({
                            ...p,
                            gear: { ...p.gear, [slot.key]: val }
                          }));
                        }}
                        placeholder={`點此填寫 ${slot.label}...`}
                        className="w-full bg-sanctuary-950 border border-sanctuary-750 rounded px-2.5 py-1.5 text-xs text-d2-white focus:outline-none focus:border-d2-unique/60"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preset Modal */}
      {isPresetModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsPresetModalOpen(false)}
        >
          <div 
            className="w-full max-w-4xl bg-sanctuary-900 border border-sanctuary-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-sanctuary-800 bg-sanctuary-950">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-d2-unique/20 text-d2-unique border border-d2-unique/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-diablo text-xl font-bold text-sanctuary-100">
                    載入 S 級天梯主流配裝範本 (Meta Presets)
                  </h3>
                  <p className="text-xs text-sanctuary-400">
                    一鍵套用各大職業的終極畢業配裝方案、精確屬性數值與檔位心得。
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-2 text-sanctuary-400 hover:text-sanctuary-100 rounded-xl hover:bg-sanctuary-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Presets Grid */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_META_BUILDS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 hover:border-d2-unique/60 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sanctuary-800 text-d2-unique font-bold">
                          {preset.characterClass}
                        </span>
                        <span className="text-[11px] font-mono text-sanctuary-400">
                          Lv.{preset.targetLevel}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-sanctuary-100 group-hover:text-d2-unique transition-colors mb-2">
                        {preset.buildName}
                      </h4>
                      <p className="text-xs text-sanctuary-400 line-clamp-2 leading-relaxed mb-4">
                        {preset.notes}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sanctuary-800/60 flex items-center justify-between">
                      <div className="flex gap-2 text-[10px] font-mono text-sanctuary-400">
                        {preset.customStats.fcr > 0 && <span>FCR {preset.customStats.fcr}%</span>}
                        {preset.customStats.magicFind > 0 && <span>MF {preset.customStats.magicFind}%</span>}
                      </div>
                      <button
                        onClick={() => handleLoadPreset(preset)}
                        className="px-3 py-1.5 rounded-lg bg-d2-unique/20 hover:bg-d2-unique/30 text-d2-unique border border-d2-unique/40 text-xs font-bold transition-all shadow-glow-gold"
                      >
                        一鍵套用方案
                      </button>
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
