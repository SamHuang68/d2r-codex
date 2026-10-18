import React, { useState } from 'react';
import { SKILLS_DATA, SkillData } from '../../data/skills';
import { SkillTreeCanvas } from '../codex/SkillTreeCanvas';
import { 
  calculateSkillSynergies
} from '../../data/skills/synergies';
import { 
  Sparkles, 
  Zap, 
  Swords, 
  ArrowRight
} from 'lucide-react';

export interface SkillTreeSimulatorProps {
  className: string;
  skillPoints: Record<string, number>;
  onUpdateSkillPoints: (newPoints: Record<string, number>) => void;
  activeSkillId?: string;
  onSetActiveSkillId: (skillId: string) => void;
  allSkillsBonus: number;
}

export const SkillTreeSimulator: React.FC<SkillTreeSimulatorProps> = ({
  className,
  skillPoints,
  onUpdateSkillPoints,
  activeSkillId,
  onSetActiveSkillId,
  allSkillsBonus,
}) => {
  const [activeTreeIndex, setActiveTreeIndex] = useState(0);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const currentClassData = SKILLS_DATA.find(c => c.characterClass === className) || SKILLS_DATA[0];
  const activeTree = currentClassData.trees[activeTreeIndex] || currentClassData.trees[0];

  // 全部當前職業技能
  const allCurrentClassSkills = React.useMemo(() => {
    const list: SkillData[] = [];
    currentClassData.trees.forEach(t => list.push(...t.skills));
    return list;
  }, [currentClassData]);

  // 若尚未選定，預設選取當前技能樹第一招技能
  React.useEffect(() => {
    if (!selectedSkillId && activeTree && activeTree.skills.length > 0) {
      setSelectedSkillId(activeTree.skills[0].id);
    }
  }, [activeTree, selectedSkillId]);

  const currentSelectedSkill = React.useMemo(() => {
    return allCurrentClassSkills.find(s => s.id === selectedSkillId) || activeTree.skills[0] || null;
  }, [allCurrentClassSkills, selectedSkillId, activeTree]);

  // 檢查前置技能是否滿足
  const isPrerequisitesMet = (skill: SkillData): boolean => {
    if (!skill.prerequisites || skill.prerequisites.length === 0) return true;
    return skill.prerequisites.every(preId => (skillPoints[preId] || 0) > 0);
  };

  // 加點
  const handleAddPoint = (skill: SkillData, amount = 1) => {
    const cur = skillPoints[skill.id] || 0;
    const max = skill.maxPoints || 20;
    if (cur >= max) return;
    if (!isPrerequisitesMet(skill)) return;

    onUpdateSkillPoints({
      ...skillPoints,
      [skill.id]: Math.min(max, cur + amount)
    });
  };

  // 減點
  const handleRemovePoint = (skill: SkillData, amount = 1) => {
    const cur = skillPoints[skill.id] || 0;
    if (cur <= 0) return;

    const next = { ...skillPoints };
    const updated = cur - amount;
    if (updated <= 0) {
      delete next[skill.id];
    } else {
      next[skill.id] = updated;
    }
    onUpdateSkillPoints(next);
  };

  // 核心功能：【一鍵點滿相關協同 (One-Click Max Synergies)】
  const handleMaxAllSynergies = () => {
    if (!currentSelectedSkill) return;
    const synProfile = calculateSkillSynergies(currentSelectedSkill.id, skillPoints);
    if (synProfile.incoming.length === 0) {
      alert(`【${currentSelectedSkill.name}】沒有接收協同加成技能。`);
      return;
    }

    const next = { ...skillPoints };
    // 先把自己點滿
    next[currentSelectedSkill.id] = 20;

    // 將所有協同來源技能自動點滿至 20 點
    synProfile.incoming.forEach(item => {
      next[item.skillId] = 20;
    });

    onUpdateSkillPoints(next);
    // 自動設為主力技能
    onSetActiveSkillId(currentSelectedSkill.id);
  };

  // 一鍵清空協同
  const handleResetSynergies = () => {
    if (!currentSelectedSkill) return;
    const synProfile = calculateSkillSynergies(currentSelectedSkill.id, skillPoints);
    const next = { ...skillPoints };
    synProfile.incoming.forEach(item => {
      delete next[item.skillId];
    });
    onUpdateSkillPoints(next);
  };

  // 跨系導航跳轉
  const handleNavigateToSkill = (targetSkillId: string) => {
    for (let i = 0; i < currentClassData.trees.length; i++) {
      const found = currentClassData.trees[i].skills.find(s => s.id === targetSkillId);
      if (found) {
        setActiveTreeIndex(i);
        setSelectedSkillId(targetSkillId);
        return;
      }
    }
  };

  // 協同計算結果
  const synProfile = currentSelectedSkill 
    ? calculateSkillSynergies(currentSelectedSkill.id, skillPoints) 
    : { incoming: [], outgoing: [], totalIncomingPercent: 0 };

  const currentInvested = currentSelectedSkill ? (skillPoints[currentSelectedSkill.id] || 0) : 0;
  const currentTotalLvl = currentInvested + allSkillsBonus;

  return (
    <div className="bg-sanctuary-950/95 rounded-3xl border-2 border-sanctuary-800 shadow-2xl p-5 sm:p-6 space-y-5">
      {/* 標頭與技能樹切換按鈕 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sanctuary-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            1:1 IN-GAME SKILL TREE & SYNERGY ACCELERATOR
          </div>
          <h2 className="text-xl font-diablo font-bold text-sanctuary-100 mt-0.5">
            {className} 6×3 技能樹畫布
          </h2>
        </div>

        {/* 三大系標籤切換 */}
        <div className="flex items-center gap-1.5 bg-sanctuary-900/90 p-1 rounded-xl border border-sanctuary-800 overflow-x-auto">
          {currentClassData.trees.map((tree, idx) => (
            <button
              key={tree.name}
              onClick={() => {
                setActiveTreeIndex(idx);
                if (tree.skills.length > 0) setSelectedSkillId(tree.skills[0].id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                activeTreeIndex === idx
                  ? 'bg-d2-gold text-sanctuary-950 font-bold shadow'
                  : 'text-sanctuary-400 hover:text-white'
              }`}
            >
              {tree.name}
            </button>
          ))}
        </div>
      </div>

      {/* 核心雙屏：左側 6x3 畫布，右側協同加速器 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* 左側：6x3 經典技能樹畫布 */}
        <div className="xl:col-span-6 flex justify-center">
          <SkillTreeCanvas
            skills={activeTree.skills}
            skillPoints={skillPoints}
            selectedSkillId={selectedSkillId}
            hoveredSkillId={hoveredSkillId}
            onSelectSkill={(s) => setSelectedSkillId(s.id)}
            onHoverSkill={setHoveredSkillId}
            onAddPoint={handleAddPoint}
            onRemovePoint={handleRemovePoint}
            isPrerequisitesMet={isPrerequisitesMet}
            remainingPoints={999}
          />
        </div>

        {/* 右側：全息協同控制台與一鍵點滿按鈕 */}
        <div className="xl:col-span-6 bg-sanctuary-900/70 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
          {currentSelectedSkill ? (
            <>
              {/* 當前技能標題與主力標記 */}
              <div className="flex items-center justify-between border-b border-sanctuary-800 pb-3">
                <div>
                  <h3 className="font-diablo text-lg font-bold text-sanctuary-100">
                    {currentSelectedSkill.name}
                  </h3>
                  <div className="text-xs font-mono text-sanctuary-400">
                    {currentSelectedSkill.nameEn} • [{currentSelectedSkill.tree}]
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSetActiveSkillId(currentSelectedSkill.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 border ${
                      activeSkillId === currentSelectedSkill.id
                        ? 'bg-d2-fire text-sanctuary-950 border-d2-fire shadow-md'
                        : 'bg-sanctuary-800 text-sanctuary-300 border-sanctuary-700 hover:text-white'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>{activeSkillId === currentSelectedSkill.id ? '★ 當前主力輸出' : '設為主力'}</span>
                  </button>
                </div>
              </div>

              {/* 等級結算 */}
              <div className="bg-sanctuary-950 p-3 rounded-xl border border-sanctuary-800 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-sanctuary-400">技能等級：</span>
                  <span className="font-bold text-d2-gold text-sm ml-1">
                    Lv {currentTotalLvl}
                  </span>
                  <span className="text-sanctuary-500 text-[10px] ml-1">
                    (投入 {currentInvested} + 裝備加成 +{allSkillsBonus})
                  </span>
                </div>
                <div className="text-cyan-300 font-bold">
                  協同增幅: +{synProfile.totalIncomingPercent}%
                </div>
              </div>

              {/* 核心按鈕：【⚡ 一鍵點滿相關協同 (One-Click Max Synergies)】 */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyan-950/40 to-sanctuary-900 border border-d2-gold/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-d2-gold animate-pulse" />
                    <span>一鍵極限協同測試 (Synergy Maxer)</span>
                  </div>
                </div>
                <p className="text-[11px] text-sanctuary-300 leading-normal">
                  點擊下方按鈕，系統將自動將自身以及所有為【{currentSelectedSkill.name}】提供增傷的協同技能全部點滿至 20 點，並立即在 Tab 1 屬性頁反映極限輸出傷害！
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleMaxAllSynergies}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-d2-gold to-amber-500 hover:brightness-110 text-sanctuary-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30 active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-sanctuary-950 fill-current" />
                    <span>★ 核心功能：【⚡ 一鍵點滿相關協同加成 (Max All)】</span>
                  </button>
                  <button
                    onClick={handleResetSynergies}
                    className="py-2 px-3 rounded-xl bg-sanctuary-850 hover:bg-sanctuary-800 text-sanctuary-300 text-xs font-medium border border-sanctuary-750 transition-colors"
                    title="清空該技能的所有協同投入"
                  >
                    重置協同
                  </button>
                </div>
              </div>

              {/* 協同明細清單 */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono text-sanctuary-400">
                  接收加成明細 (點擊可跳轉至該技能)：
                </div>

                {synProfile.incoming.length > 0 ? (
                  <div className="space-y-1.5">
                    {synProfile.incoming.map(item => (
                      <div
                        key={item.skillId}
                        onClick={() => handleNavigateToSkill(item.skillId)}
                        className="p-2.5 rounded-xl bg-sanctuary-950 hover:bg-sanctuary-850 border border-sanctuary-800 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-diablo font-bold text-sanctuary-200 group-hover:text-d2-gold">
                            {item.skillName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {item.displayText}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className={item.points > 0 ? 'text-d2-gold font-bold' : 'text-sanctuary-500'}>
                            {item.points} / 20 點
                          </span>
                          <ArrowRight className="w-3 h-3 text-sanctuary-500 group-hover:text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-sanctuary-500 font-mono p-3 bg-sanctuary-950 rounded-xl">
                    此技能無接收協同加成。
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-xs text-sanctuary-500 py-12 font-mono">
              請在左側技能樹點選技能
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
