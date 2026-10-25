import React from 'react';
import { SkillData } from '../../data/skills';
import { 
  calculateSkillSynergies, 
  SkillSynergyProfile 
} from '../../data/skills/synergies';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Plus, 
  Minus, 
  BookOpen, 
  AlertCircle 
} from 'lucide-react';

export interface SkillSynergyPanelProps {
  skill: SkillData | null;
  skillPoints: Record<string, number>;
  allSkills: SkillData[];
  onAddPoint: (skill: SkillData, amount?: number) => void;
  onRemovePoint: (skill: SkillData, amount?: number) => void;
  onNavigateToSkill: (targetSkillId: string) => void;
  isPrerequisitesMet: (skill: SkillData) => boolean;
  remainingPoints: number;
}

export const SkillSynergyPanel: React.FC<SkillSynergyPanelProps> = ({
  skill,
  skillPoints,
  allSkills,
  onAddPoint,
  onRemovePoint,
  onNavigateToSkill,
  isPrerequisitesMet,
  remainingPoints,
}) => {
  const { isEn } = useLanguage();

  if (!skill) {
    return (
      <div className="bg-sanctuary-900/60 rounded-3xl border border-sanctuary-800 p-6 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-d2-gold mx-auto opacity-40 animate-pulse" />
        <h3 className="font-diablo text-lg text-sanctuary-300">
          {isEn ? 'Select a skill to view the synergy matrix' : '請選取技能以檢視全息協同矩陣'}
        </h3>
        <p className="text-xs text-sanctuary-500 max-w-sm mx-auto">
          {isEn
            ? 'Click any skill in the skill tree to view real-time synergy formulas, scaling percentages, prerequisites, and tactical guides.'
            : '在左側遊戲技能樹點擊任一技能，即可立即查看即時協同公式、雙向增傷百分比、前置路徑與實戰戰術圖說。'}
        </p>
      </div>
    );
  }

  const points = skillPoints[skill.id] || 0;
  const isMax = points >= (skill.maxPoints || 20);
  const isUnlocked = isPrerequisitesMet(skill);
  const synergyProfile: SkillSynergyProfile = calculateSkillSynergies(skill.id, skillPoints);

  // 前置技能清單
  const prereqSkills = skill.prerequisites
    ?.map(id => allSkills.find(s => s.id === id))
    .filter(Boolean) as SkillData[];

  return (
    <div className="bg-sanctuary-950/90 rounded-3xl border-2 border-sanctuary-800/90 shadow-2xl p-5 sm:p-6 space-y-6">
      {/* 技能標題與基本資訊 */}
      <div className="border-b border-sanctuary-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sanctuary-800 text-d2-gold border border-sanctuary-700">
              {skill.tree}
            </span>
            <span className="text-xs font-mono text-sanctuary-400">
              {isEn ? `Required Level: Lv ${skill.requiredLevel}` : `需求等級: Lv ${skill.requiredLevel}`}
            </span>
          </div>
          <h2 className="text-2xl font-diablo font-bold text-sanctuary-100 mt-1 flex items-center gap-2">
            {isEn ? (skill.nameEn || skill.name) : skill.name}
            <span className="text-xs font-mono font-normal text-sanctuary-400">
              ({isEn ? skill.name : skill.nameEn})
            </span>
          </h2>
        </div>

        {/* 點數控制器 */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-sanctuary-900 px-3 py-1.5 rounded-2xl border border-sanctuary-750">
          <button
            onClick={() => onRemovePoint(skill, 1)}
            disabled={points <= 0}
            className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 text-sanctuary-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            title={isEn ? "Remove 1 point" : "扣除 1 點"}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="px-2 text-center min-w-[54px]">
            <span className={`text-base font-bold font-mono ${isMax ? 'text-amber-400' : points > 0 ? 'text-d2-gold' : 'text-sanctuary-400'}`}>
              {points}
            </span>
            <span className="text-[11px] font-mono text-sanctuary-500"> / {skill.maxPoints || 20}</span>
          </div>

          <button
            onClick={() => onAddPoint(skill, 1)}
            disabled={!isUnlocked || isMax || remainingPoints <= 0}
            className="w-7 h-7 rounded-lg bg-d2-gold text-sanctuary-950 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-bold"
            title={isEn ? "Add 1 point" : "增加 1 點"}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onAddPoint(skill, 20)}
            disabled={!isUnlocked || isMax || remainingPoints <= 0}
            className="px-2 py-1 text-[10px] font-mono font-bold rounded-lg bg-d2-gold/20 text-d2-gold hover:bg-d2-gold/30 disabled:opacity-30 disabled:cursor-not-allowed border border-d2-gold/30"
            title={isEn ? "Max out to 20 points" : "加滿至 20 點"}
          >
            MAX
          </button>
        </div>
      </div>

      {/* 技能描述 */}
      <div className="space-y-2">
        <p className="text-sm text-sanctuary-200 leading-relaxed">
          {skill.description}
        </p>

        {/* 前置條件警示 */}
        {!isUnlocked && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-d2-blood/10 border border-d2-blood/30 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-d2-blood" />
            <span>
              {isEn
                ? 'Locked! You must allocate at least 1 point into all prerequisites above.'
                : '尚未解鎖！必須先在上方所有前置技能各投入至少 1 點數。'}
            </span>
          </div>
        )}

        {/* 前置列表 */}
        {prereqSkills.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-sanctuary-400 font-mono">{isEn ? 'Prerequisites:' : '前置依賴:'}</span>
            {prereqSkills.map(pre => {
              const prePoints = skillPoints[pre.id] || 0;
              const met = prePoints > 0;
              return (
                <button
                  key={pre.id}
                  onClick={() => onNavigateToSkill(pre.id)}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] border transition-all flex items-center gap-1 ${
                    met
                      ? 'bg-sanctuary-900 border-sanctuary-700 text-sanctuary-300'
                      : 'bg-d2-blood/15 border-d2-blood/40 text-rose-300 hover:bg-d2-blood/25'
                  }`}
                >
                  <span>{isEn && pre.nameEn ? pre.nameEn : pre.name}</span>
                  <span className="text-[10px] opacity-75">({prePoints}/20)</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 協同效應全息解析矩陣 (Synergy Matrix) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-sanctuary-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-diablo font-bold text-sm text-cyan-300">
              {isEn ? 'Synergy Scaling' : '協同效應全息矩陣 (Synergy Scaling)'}
            </span>
          </div>
          {synergyProfile.totalIncomingPercent > 0 && (
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
              {isEn
                ? `+${synergyProfile.totalIncomingPercent}% Total Synergy Bonus`
                : `已累積 +${synergyProfile.totalIncomingPercent}% 協同增幅`}
            </span>
          )}
        </div>

        {/* 1. 接收協同 (Incoming: 誰提供我增傷) */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-sanctuary-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span>
              {isEn
                ? `Receiving Bonus (Investing in skills below boosts [${skill.nameEn || skill.name}]):`
                : `接收加成（投資以下技能可增強【${skill.name}】）：`}
            </span>
          </div>

          {synergyProfile.incoming.length > 0 ? (
            <div className="space-y-2">
              {synergyProfile.incoming.map(item => {
                const targetObj = allSkills.find(s => s.id === item.skillId);
                const maxPercent = 20 * item.percentPerPoint;
                const ratio = maxPercent > 0 ? Math.min(100, (item.totalPercent / maxPercent) * 100) : 0;

                return (
                  <div
                    key={item.skillId}
                    className="bg-sanctuary-900/80 p-3 rounded-2xl border border-sanctuary-800 hover:border-cyan-500/50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-diablo font-bold text-sm text-sanctuary-100">
                          {isEn && targetObj?.nameEn ? targetObj.nameEn : item.skillName}
                        </span>
                        {targetObj && (
                          <span className="text-[10px] font-mono text-sanctuary-500">
                            [{targetObj.tree}]
                          </span>
                        )}
                        <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800">
                          {item.displayText}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigateToSkill(item.skillId)}
                        className="text-[11px] text-sanctuary-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      >
                        <span>{isEn ? 'Invest Points' : '前往加點'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* 即時加成進度條 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-sanctuary-400">
                          {isEn
                            ? `Invested ${item.points} pts × ${item.percentPerPoint}%`
                            : `已投資 ${item.points} 點 × ${item.percentPerPoint}%`}
                        </span>
                        <span className="text-cyan-300 font-bold">
                          +{item.totalPercent}% {item.bonusType}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-sanctuary-950 rounded-full overflow-hidden border border-sanctuary-800">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-sanctuary-900/40 border border-sanctuary-800/60 text-xs text-sanctuary-400">
              {isEn
                ? 'This skill receives no synergy bonuses (damage scales purely with its own level).'
                : '此技能無接收協同加成（基礎傷害完全隨技能自身等級成長，單修即可達到上限）。'}
            </div>
          )}
        </div>

        {/* 2. 輸出協同 (Outgoing: 我為誰提供增益) */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono text-sanctuary-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-d2-gold inline-block" />
            <span>
              {isEn
                ? `Outgoing Bonus (Investing in [${skill.nameEn || skill.name}] boosts the following):`
                : `輸出加成（投資【${skill.name}】可增益以下技能）：`}
            </span>
          </div>

          {synergyProfile.outgoing.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {synergyProfile.outgoing.map(item => {
                const outgoingObj = allSkills.find(s => s.id === item.skillId);
                return (
                  <button
                    key={item.skillId}
                    onClick={() => onNavigateToSkill(item.skillId)}
                    className="text-left bg-sanctuary-900/50 hover:bg-sanctuary-850 p-2.5 rounded-xl border border-sanctuary-800/80 hover:border-d2-gold/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-diablo font-bold text-xs text-sanctuary-200 group-hover:text-d2-gold">
                        {isEn && outgoingObj?.nameEn ? outgoingObj.nameEn : item.skillName}
                      </span>
                      <span className="text-[10px] font-mono text-d2-gold font-bold">
                        +{item.totalPercent}%
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-sanctuary-400 mt-0.5">
                      {isEn ? `Per Point: ${item.displayText}` : `每點提供: ${item.displayText}`}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-sanctuary-900/40 border border-sanctuary-800/60 text-xs text-sanctuary-400">
              {isEn
                ? 'Investing in this skill does not provide synergy bonuses to other skills.'
                : '投資此技能不為其他技能提供額外數值加成。'}
            </div>
          )}
        </div>
      </div>

      {/* 戰術圖說與 2.4/2.6 重生解析 */}
      <div className="bg-sanctuary-900/70 p-4 rounded-2xl border border-sanctuary-800 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-mono text-d2-gold font-bold">
          <BookOpen className="w-3.5 h-3.5 text-d2-gold" />
          <span>{isEn ? 'Tactical Guide & Mechanics' : '天梯實戰圖說與機制解析'}</span>
        </div>
        <p className="text-xs text-sanctuary-300 leading-relaxed">
          {skill.details}
        </p>
      </div>
    </div>
  );
};
