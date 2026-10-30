import React, { useState, useMemo, useEffect } from 'react';
import { SKILLS_DATA, SkillData } from '../../data/skills';
import { SkillTreeCanvas } from './SkillTreeCanvas';
import { useLanguage } from '../../context/LanguageContext';
import { getClassImage } from '../../utils/classImages';
import { CLASS_ZH_TO_EN } from '../../engine/slots';
import { SkillSynergyPanel } from './SkillSynergyPanel';
import { 
  RotateCcw, 
  Search, 
  Plus, 
  Minus, 
  BookOpen, 
  Copy, 
  Check, 
  AlertCircle,
  Zap,
  LayoutGrid,
  Network
} from 'lucide-react';
import { GameIcon } from '../common/GameIcons';


const MAX_TOTAL_POINTS = 110; // 98 (等級 2-99) + 12 (任務獎勵)
const MAX_SKILL_POINTS = 20;

export interface SkillPlannerProps {
  initialClass?: string;
}

export const SkillPlanner: React.FC<SkillPlannerProps> = ({ initialClass = "魔法使" }) => {
  const { t, isEn } = useLanguage();
  const [selectedClass, setSelectedClass] = useState<string>(initialClass);
  const [activeTreeIndex, setActiveTreeIndex] = useState<number>(0);
  const [skillPoints, setSkillPoints] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  // 同步 initialClass 屬性變更
  useEffect(() => {
    if (initialClass && SKILLS_DATA.some(c => c.characterClass === initialClass)) {
      setSelectedClass(initialClass);
      setActiveTreeIndex(0);
      setSelectedSkillId(null);
    }
  }, [initialClass]);

  // 獲取當前選中職業的資料
  const currentClassData = useMemo(() => {
    return SKILLS_DATA.find(c => c.characterClass === selectedClass) || SKILLS_DATA[0];
  }, [selectedClass]);

  // 當前選中的技能樹
  const activeTree = currentClassData.trees[activeTreeIndex] || currentClassData.trees[0];

  // 當前職業的所有技能平鋪列表
  const allCurrentClassSkills = useMemo(() => {
    const list: SkillData[] = [];
    currentClassData.trees.forEach(t => {
      list.push(...t.skills);
    });
    return list;
  }, [currentClassData]);

  // 若尚未選取任何技能，預設選取當前技能樹的第一招技能
  useEffect(() => {
    if (!selectedSkillId && activeTree && activeTree.skills.length > 0) {
      setSelectedSkillId(activeTree.skills[0].id);
    }
  }, [activeTree, selectedSkillId]);

  // 已分配總點數
  const usedPoints = useMemo(() => {
    let sum = 0;
    allCurrentClassSkills.forEach(s => {
      sum += (skillPoints[s.id] || 0);
    });
    return sum;
  }, [skillPoints, allCurrentClassSkills]);

  const remainingPoints = MAX_TOTAL_POINTS - usedPoints;

  // 各技能樹已投資點數
  const treePoints = useMemo(() => {
    return currentClassData.trees.map(tree => {
      return tree.skills.reduce((acc, s) => acc + (skillPoints[s.id] || 0), 0);
    });
  }, [currentClassData, skillPoints]);

  // 檢查某技能的前置條件是否滿足
  const isPrerequisitesMet = (skill: SkillData): boolean => {
    if (!skill.prerequisites || skill.prerequisites.length === 0) return true;
    return skill.prerequisites.every(preId => (skillPoints[preId] || 0) > 0);
  };

  // 點擊加點
  const addPoint = (skill: SkillData, amount = 1) => {
    const current = skillPoints[skill.id] || 0;
    const max = skill.maxPoints || MAX_SKILL_POINTS;
    if (current >= max) return;
    if (remainingPoints <= 0) return;

    // 前置檢查
    if (!isPrerequisitesMet(skill)) return;

    const actualAdd = Math.min(amount, max - current, remainingPoints);
    setSkillPoints(prev => ({
      ...prev,
      [skill.id]: current + actualAdd
    }));
  };

  // 點擊扣點 (扣點需檢查是否有後續技能依賴它)
  const removePoint = (skill: SkillData, amount = 1) => {
    const current = skillPoints[skill.id] || 0;
    if (current <= 0) return;

    // 若要扣至 0，檢查是否有後續已加點技能將其作為前置
    if (current - amount <= 0) {
      const dependents = allCurrentClassSkills.filter(s => 
        s.prerequisites && s.prerequisites.includes(skill.id) && (skillPoints[s.id] || 0) > 0
      );
      if (dependents.length > 0) {
        alert(`無法降為 0 點！後續技能「${dependents.map(d => d.name).join("、")}」需要此技能作為前置。`);
        return;
      }
    }

    const actualRemove = Math.min(amount, current);
    setSkillPoints(prev => {
      const next = { ...prev };
      const updated = current - actualRemove;
      if (updated <= 0) {
        delete next[skill.id];
      } else {
        next[skill.id] = updated;
      }
      return next;
    });
  };

  // 重置目前職業點數
  const handleReset = () => {
    setSkillPoints(prev => {
      const next = { ...prev };
      allCurrentClassSkills.forEach(s => {
        delete next[s.id];
      });
      return next;
    });
  };

  // 複製當前加點配置文字
  const handleCopyBuild = () => {
    const lines: string[] = [
      `=== 暗黑破壞神 II：獄火重生 (D2R) - ${selectedClass} 技能加點方案 ===`,
      `總耗費點數: ${usedPoints} / ${MAX_TOTAL_POINTS} | 剩餘點數: ${remainingPoints}`,
      ""
    ];

    currentClassData.trees.forEach((tree, idx) => {
      const p = treePoints[idx];
      lines.push(`【${isEn && tree.nameEn ? tree.nameEn : tree.name}】(${p} 點):`);
      const allocated = tree.skills.filter(s => (skillPoints[s.id] || 0) > 0);
      if (allocated.length === 0) {
        lines.push("  (無投資點數)");
      } else {
        allocated.forEach(s => {
          lines.push(`  - ${s.name} (${s.nameEn}): ${skillPoints[s.id]} 點`);
        });
      }
      lines.push("");
    });

    lines.push("由 Sanctuary Codex 典藏資料庫生成");
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 跨系協同導航跳轉
  const handleNavigateToSkill = (targetSkillId: string) => {
    for (let i = 0; i < currentClassData.trees.length; i++) {
      const targetSkill = currentClassData.trees[i].skills.find(s => s.id === targetSkillId);
      if (targetSkill) {
        setActiveTreeIndex(i);
        setSelectedSkillId(targetSkillId);
        return;
      }
    }
  };

  // 職業切換時重設活動分頁
  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setActiveTreeIndex(0);
    setSelectedSkillId(null);
  };

  // 搜尋過濾技能
  const displayedSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeTree.skills;
    }
    const q = searchQuery.toLowerCase().trim();
    return allCurrentClassSkills.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.nameEn.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.details.toLowerCase().includes(q)
    );
  }, [activeTree, searchQuery, allCurrentClassSkills]);

  // 目前選中的技能物件
  const activeSelectedSkill = useMemo(() => {
    return allCurrentClassSkills.find(s => s.id === selectedSkillId) || activeTree.skills[0] || null;
  }, [allCurrentClassSkills, selectedSkillId, activeTree]);

  // 職業圖示映射

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 頁頭說明 */}
      <div className="border-b border-sanctuary-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-d2-gold text-xs font-mono tracking-widest uppercase">
            <GameIcon name="tree" className="w-4 h-4 text-d2-gold animate-pulse" />
            Authentic In-Game Skill Tree & Synergy Matrix
          </div>
          <h1 className="text-3xl sm:text-4xl font-diablo font-bold text-sanctuary-100 mt-1">
            {t('八大職業全技能樹與協同矩陣模擬器', 'Skill Trees & Synergy Matrix Planner')}
          </h1>
          <p className="text-sanctuary-400 text-sm mt-1 max-w-3xl">
            {isEn
              ? "Faithfully reproduces the classic 6x3 Diablo II skill tree canvas and prerequisites, seamlessly integrating bidirectional synergy calculations, 110-point allocation simulation, tactical guidance, and build exports."
              : "100% 復刻暗黑破壞神遊戲內經典 6x3 技能樹畫布與前置連線，全息整合雙向協同加成（Synergy）即時算力模型，支援 110 點加點模擬、天梯戰術圖說與配點匯出。"}
          </p>
        </div>

        {/* 點數面板與操作按鈕 */}
        <div className="flex items-center gap-3 bg-sanctuary-900/90 p-3 rounded-2xl border border-sanctuary-800 shadow-xl shrink-0">
          <div className="text-right pr-3 border-r border-sanctuary-800">
            <div className="text-[11px] text-sanctuary-400 font-mono">{isEn ? 'Remaining Skill Points' : '剩餘可用技能點數'}</div>
            <div className="flex items-baseline justify-end gap-1.5">
              <span className={`text-2xl font-bold font-mono ${remainingPoints < 10 ? 'text-red-400' : 'text-d2-gold'}`}>
                {remainingPoints}
              </span>
              <span className="text-xs text-sanctuary-500 font-mono">/ {MAX_TOTAL_POINTS}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title={isEn ? "Reset all skill points for this class" : "重置當前職業所有點數"}
              className="px-3 py-2 bg-sanctuary-800/80 hover:bg-sanctuary-750 text-sanctuary-300 hover:text-sanctuary-100 rounded-xl text-xs font-medium border border-sanctuary-700/60 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('清空重置', 'Reset')}
            </button>
            <button
              onClick={handleCopyBuild}
              title={isEn ? "Copy build plan text" : "複製加點文字方案"}
              className="px-3 py-2 bg-d2-gold text-sanctuary-950 font-bold hover:bg-amber-400 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-d2-gold/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? (isEn ? "Copied!" : "已複製！") : (isEn ? "Export Build" : "匯出配點")}
            </button>
          </div>
        </div>
      </div>

      {/* 職業選擇標籤列 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {SKILLS_DATA.map(cls => {
          const isSelected = cls.characterClass === selectedClass;
          return (
            <button
              key={cls.characterClass}
              onClick={() => handleClassChange(cls.characterClass)}
              className={`px-4 py-2.5 rounded-xl text-sm font-diablo font-bold transition-all flex items-center gap-2 shrink-0 border ${
                isSelected
                  ? 'bg-sanctuary-800 border-d2-gold/60 text-d2-gold shadow-lg shadow-d2-gold/10'
                  : 'bg-sanctuary-900/60 border-sanctuary-800/80 text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-850'
              }`}
            >
              <img src={getClassImage(cls.characterClass)} alt="" className={`w-5 h-5 rounded-full object-cover object-[75%_15%] border transition-transform ${isSelected ? 'border-d2-gold scale-110 shadow-sm' : 'border-sanctuary-700/60 opacity-80'}`} />
              {isEn ? (CLASS_ZH_TO_EN[cls.characterClass] || cls.characterClass) : cls.characterClass}
            </button>
          );
        })}
      </div>

      {/* 視圖切換、技能樹分頁與搜尋列 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* 三大技能樹切換按鈕 */}
        <div className="flex items-center gap-2 bg-sanctuary-900/80 p-1.5 rounded-2xl border border-sanctuary-800 shrink-0 max-w-full overflow-x-auto">
          {currentClassData.trees.map((tree, idx) => {
            const isActive = activeTreeIndex === idx && !searchQuery.trim();
            const points = treePoints[idx];
            return (
              <button
                key={isEn && tree.nameEn ? tree.nameEn : tree.name}
                onClick={() => {
                  setActiveTreeIndex(idx);
                  setSearchQuery("");
                  if (tree.skills.length > 0) {
                    setSelectedSkillId(tree.skills[0].id);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-d2-gold text-sanctuary-950 font-bold shadow-md shadow-d2-gold/20'
                    : 'text-sanctuary-400 hover:text-sanctuary-200 hover:bg-sanctuary-800/60'
                }`}
              >
                <span>{isEn && tree.nameEn ? tree.nameEn : tree.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-sanctuary-950 text-d2-gold' : 'bg-sanctuary-800 text-sanctuary-300'
                }`}>
                  {points} {isEn ? 'pts' : '點'}
                </span>
              </button>
            );
          })}
        </div>

        {/* 模式切換與搜尋 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 視圖切換器 (遊戲樹狀模式 vs 詳細卡片模式) */}
          <div className="flex items-center bg-sanctuary-900 p-1 rounded-xl border border-sanctuary-800 shrink-0">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'tree'
                  ? 'bg-sanctuary-800 text-d2-gold shadow-sm font-bold'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>{isEn ? 'Skill Tree' : '遊戲技能樹'}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-sanctuary-800 text-d2-gold shadow-sm font-bold'
                  : 'text-sanctuary-400 hover:text-sanctuary-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{isEn ? 'Detailed List' : '詳解清單'}</span>
            </button>
          </div>

          {/* 搜尋欄 */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sanctuary-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? `Search ${CLASS_ZH_TO_EN[selectedClass] || selectedClass} skills...` : `搜尋 ${selectedClass} 技能...`}
              className="w-full bg-sanctuary-900 border border-sanctuary-800 rounded-xl pl-9 pr-4 py-2 text-xs text-sanctuary-100 placeholder-sanctuary-500 focus:outline-none focus:border-d2-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sanctuary-500 hover:text-sanctuary-300 text-xs"
              >
                清除
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 技能樹說明橫條 */}
      {!searchQuery && (
        <div className="bg-sanctuary-900/40 border border-sanctuary-800/60 rounded-xl p-4 flex items-center gap-3 text-xs text-sanctuary-300">
          <BookOpen className="w-5 h-5 text-d2-gold shrink-0" />
          <div>
            <span className="font-bold text-sanctuary-100 mr-2">{isEn ? activeTree.nameEn : `${activeTree.name} (${activeTree.nameEn})`}：</span>
            <span>{isEn ? (activeTree.descriptionEn || activeTree.nameEn) : activeTree.description}</span>
          </div>
        </div>
      )}

      {/* 核心內容呈現區：依據 viewMode 渲染 */}
      {viewMode === 'tree' && !searchQuery ? (
        /* ⚔️ 遊戲技能樹與協同解析雙面板 (左: 遊戲畫布, 右: 協同全息面板) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <SkillTreeCanvas
              skills={activeTree.skills}
              skillPoints={skillPoints}
              selectedSkillId={selectedSkillId}
              hoveredSkillId={hoveredSkillId}
              onSelectSkill={(skill) => setSelectedSkillId(skill.id)}
              onHoverSkill={setHoveredSkillId}
              onAddPoint={addPoint}
              onRemovePoint={removePoint}
              isPrerequisitesMet={isPrerequisitesMet}
              remainingPoints={remainingPoints}
            />
          </div>

          <div className="lg:col-span-6 xl:col-span-7">
            <SkillSynergyPanel
              skill={activeSelectedSkill}
              skillPoints={skillPoints}
              allSkills={allCurrentClassSkills}
              onAddPoint={addPoint}
              onRemovePoint={removePoint}
              onNavigateToSkill={handleNavigateToSkill}
              isPrerequisitesMet={isPrerequisitesMet}
              remainingPoints={remainingPoints}
            />
          </div>
        </div>
      ) : (
        /* 📋 全域詳解卡片網格 (保全所有既有能力與搜尋結果) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedSkills.map((skill) => {
            const points = skillPoints[skill.id] || 0;
            const isMax = points >= (skill.maxPoints || MAX_SKILL_POINTS);
            const isUnlocked = isPrerequisitesMet(skill);
            const hasPoints = points > 0;

            const prereqSkills = skill.prerequisites
              ?.map(id => allCurrentClassSkills.find(s => s.id === id)?.name)
              .filter(Boolean);

            return (
              <div
                key={skill.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  hasPoints
                    ? 'bg-sanctuary-900/90 border-d2-gold/50 shadow-lg shadow-d2-gold/5 ring-1 ring-d2-gold/30'
                    : isUnlocked
                    ? 'bg-sanctuary-900/50 border-sanctuary-800/90 hover:border-sanctuary-700'
                    : 'bg-sanctuary-950/60 border-sanctuary-900/80 opacity-70'
                }`}
              >
                {/* 卡片頭部 */}
                <div className="p-4 border-b border-sanctuary-800/60 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-diablo font-bold text-base text-sanctuary-100">
                          {isEn ? (skill.nameEn || skill.name) : skill.name}
                        </span>
                        {!isEn && skill.nameEn && (
                          <span className="text-[11px] font-mono text-sanctuary-400">
                            {skill.nameEn}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-sanctuary-500 font-mono mt-0.5">
                        {isEn ? `Required Level: Lv ${skill.requiredLevel}` : `需求等級: Lv ${skill.requiredLevel}`}
                      </div>
                    </div>

                    {/* 點數計數器徽章 */}
                    <div className={`px-2.5 py-1 rounded-xl font-mono text-xs font-bold border transition-all ${
                      isMax
                        ? 'bg-d2-gold text-sanctuary-950 border-amber-300 shadow-sm shadow-d2-gold/30'
                        : hasPoints
                        ? 'bg-sanctuary-800 text-d2-gold border-d2-gold/40'
                        : 'bg-sanctuary-850 text-sanctuary-400 border-sanctuary-750'
                    }`}>
                      {points} / {skill.maxPoints || MAX_SKILL_POINTS}
                    </div>
                  </div>

                  {/* 前置與協同標籤 */}
                  <div className="space-y-1 pt-1">
                    {prereqSkills && prereqSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-sanctuary-400 font-mono">{isEn ? "Prereqs:" : "前置:"}</span>
                        <div className="flex flex-wrap gap-1">
                          {prereqSkills.map(name => {
                            const preSkill = allCurrentClassSkills.find(s => s.name === name);
                            const isMet = preSkill && (skillPoints[preSkill.id] || 0) > 0;
                            return (
                              <span
                                key={name}
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                                  isMet
                                    ? 'bg-sanctuary-800 text-sanctuary-300'
                                    : 'bg-d2-blood/20 text-red-300 border border-d2-blood/30'
                                }`}
                              >
                                {name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {skill.synergies && skill.synergies.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-sanctuary-400 font-mono">{isEn ? "Synergies:" : "協同:"}</span>
                        <div className="flex flex-wrap gap-1">
                          {skill.synergies.map(syn => (
                            <span key={syn} className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/80">
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 卡片主體說明 */}
                <div className="p-4 space-y-3 text-xs flex-1">
                  <p className="text-sanctuary-300 leading-relaxed">
                    {isEn ? (skill.descriptionEn || skill.description) : skill.description}
                  </p>

                  {/* 戰術圖說與 2.4/2.6 重生解析 */}
                  <div className="bg-sanctuary-950/70 p-2.5 rounded-xl border border-sanctuary-800/80 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-d2-gold font-bold">
                      <Zap className="w-3 h-3 text-d2-gold" />
                      {isEn ? "Tactical Guide & Mechanics" : "戰術解析與實戰圖說"}
                    </div>
                    <p className="text-[11px] text-sanctuary-300 leading-normal">
                      {isEn ? (skill.detailsEn || skill.details) : skill.details}
                    </p>
                  </div>

                  {!isUnlocked && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-mono bg-d2-blood/10 p-2 rounded-lg border border-d2-blood/20">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {isEn ? "Must allocate at least 1 point into all prerequisites" : "需先點亮上方所有前置技能各至少 1 點"}
                    </div>
                  )}
                </div>

                {/* 卡片底端加減點控制器 */}
                <div className="p-3 bg-sanctuary-950/90 border-t border-sanctuary-800/60 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-sanctuary-400 font-mono">
                    {isEn ? (points === 0 ? "Unallocated" : isMax ? "★ MAX" : `Lv ${points}`) : (points === 0 ? "未投資" : isMax ? "★ 滿級" : `已點 ${points} 級`)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => removePoint(skill, 1)}
                      disabled={points <= 0}
                      className="w-7 h-7 rounded-lg bg-sanctuary-850 hover:bg-sanctuary-750 disabled:opacity-40 disabled:cursor-not-allowed border border-sanctuary-750 text-sanctuary-300 hover:text-sanctuary-100 flex items-center justify-center transition-colors"
                      title={isEn ? "Remove 1 pt" : "扣除 1 點"}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => addPoint(skill, 1)}
                      disabled={!isUnlocked || isMax || remainingPoints <= 0}
                      className="w-7 h-7 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-700 disabled:opacity-40 disabled:cursor-not-allowed border border-sanctuary-700 text-d2-gold hover:text-white flex items-center justify-center transition-colors font-bold"
                      title={isEn ? "Add 1 pt" : "增加 1 點"}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => addPoint(skill, 20)}
                      disabled={!isUnlocked || isMax || remainingPoints <= 0}
                      className="px-2 py-1 rounded-lg bg-d2-gold/20 hover:bg-d2-gold/30 disabled:opacity-40 disabled:cursor-not-allowed border border-d2-gold/30 text-d2-gold text-[10px] font-mono font-bold transition-colors"
                      title={isEn ? "Max out to 20 pts" : "直接加滿至 20 點"}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
