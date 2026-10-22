import React from 'react';
import { SkillData } from '../../data/skills';
import { getSkillGridPosition } from '../../data/skills/layout';
import { 
  getRelatedSynergySkillIds, 
  SYNERGY_RELATIONS 
} from '../../data/skills/synergies';
import { 
  Sparkles, 
  Plus, 
  Minus, 
  Lock, 
  Zap, 
  Flame, 
  Snowflake, 
  Shield, 
  Crosshair, 
  Skull, 
  Sword 
} from 'lucide-react';

export interface SkillTreeCanvasProps {
  skills: SkillData[];
  skillPoints: Record<string, number>;
  selectedSkillId: string | null;
  hoveredSkillId: string | null;
  onSelectSkill: (skill: SkillData) => void;
  onHoverSkill: (skillId: string | null) => void;
  onAddPoint: (skill: SkillData, amount?: number) => void;
  onRemovePoint: (skill: SkillData, amount?: number) => void;
  isPrerequisitesMet: (skill: SkillData) => boolean;
  remainingPoints: number;
}

export const SkillTreeCanvas: React.FC<SkillTreeCanvasProps> = ({
  skills,
  skillPoints,
  selectedSkillId,
  hoveredSkillId,
  onSelectSkill,
  onHoverSkill,
  onAddPoint,
  onRemovePoint,
  isPrerequisitesMet,
  remainingPoints,
}) => {
  // 決定當前要突顯協同加成的技能 (hover 優先，次為 selected)
  const activeFocusId = hoveredSkillId || selectedSkillId;
  const activeSynergyIds = React.useMemo(() => {
    return activeFocusId ? getRelatedSynergySkillIds(activeFocusId) : [];
  }, [activeFocusId]);

  // 技能圖示選擇
  const getSkillIcon = (skill: SkillData) => {
    const name = skill.name.toLowerCase();
    const tree = skill.tree.toLowerCase();
    if (name.includes('冰') || name.includes('寒') || name.includes('雪')) return <Snowflake className="w-5 h-5 text-cyan-400" />;
    if (name.includes('火') || name.includes('炎') || name.includes('燃')) return <Flame className="w-5 h-5 text-amber-500" />;
    if (name.includes('電') || name.includes('雷') || name.includes('光') || name.includes('星')) return <Zap className="w-5 h-5 text-yellow-300" />;
    if (name.includes('甲') || name.includes('盾') || name.includes('抗') || tree.includes('防禦')) return <Shield className="w-5 h-5 text-emerald-400" />;
    if (name.includes('箭') || name.includes('瞄準') || name.includes('標槍')) return <Crosshair className="w-5 h-5 text-sky-400" />;
    if (name.includes('毒') || name.includes('骨') || name.includes('詛咒') || tree.includes('召喚')) return <Skull className="w-5 h-5 text-purple-400" />;
    if (name.includes('打擊') || name.includes('熱忱打擊') || name.includes('旋風') || tree.includes('戰鬥')) return <Sword className="w-5 h-5 text-rose-400" />;
    return <Sparkles className="w-5 h-5 text-d2-gold" />;
  };

  // 建立技能位置快取
  const skillPositions = React.useMemo(() => {
    const map = new Map<string, { x: number; y: number; row: number; col: number; skill: SkillData }>();
    skills.forEach((skill, idx) => {
      const pos = getSkillGridPosition(skill.id, skill.requiredLevel, idx);
      // 畫布 viewBox 0 0 300 600, 欄中心 50, 150, 250; 列中心 50, 150, 250, 350, 450, 550
      const x = pos.col * 100 + 50;
      const y = pos.row * 100 + 50;
      map.set(skill.id, { x, y, row: pos.row, col: pos.col, skill });
    });
    return map;
  }, [skills]);

  // 前置連線資料
  const prerequisiteLines = React.useMemo(() => {
    const lines: Array<{
      id: string;
      fromId: string;
      toId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isMet: boolean;
      pathD: string;
    }> = [];

    skills.forEach((skill) => {
      const targetPos = skillPositions.get(skill.id);
      if (!targetPos || !skill.prerequisites) return;

      skill.prerequisites.forEach((preId) => {
        const sourcePos = skillPositions.get(preId);
        // 如果前置技能不在同一棵樹上 (跨系前置)，則略過畫布連線
        if (!sourcePos) return;

        const isMet = (skillPoints[preId] || 0) > 0;
        const x1 = sourcePos.x;
        const y1 = sourcePos.y + 26; // 從圖示底部邊緣出發
        const x2 = targetPos.x;
        const y2 = targetPos.y - 28; // 接到目標頂部箭頭

        let pathD = '';
        if (x1 === x2) {
          // 直線下行
          pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
          // 折線轉折下行 (經典 D2 階梯連線)
          const midY = (y1 + y2) / 2;
          pathD = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }

        lines.push({
          id: `${preId}->${skill.id}`,
          fromId: preId,
          toId: skill.id,
          x1,
          y1,
          x2,
          y2,
          isMet,
          pathD,
        });
      });
    });

    return lines;
  }, [skills, skillPositions, skillPoints]);

  // 動態協同能量弧線資料 (當前選中/懸浮技能與其同樹協同夥伴的連線)
  const activeSynergyArcs = React.useMemo(() => {
    if (!activeFocusId) return [];
    const arcs: Array<{
      id: string;
      fromId: string;
      toId: string;
      pathD: string;
      percent: number;
    }> = [];

    const focusPos = skillPositions.get(activeFocusId);
    if (!focusPos) return [];

    SYNERGY_RELATIONS.forEach((rel) => {
      let otherId = '';
      let isIncoming = false;
      if (rel.targetId === activeFocusId) {
        otherId = rel.sourceId;
        isIncoming = true;
      } else if (rel.sourceId === activeFocusId) {
        otherId = rel.targetId;
      }

      if (!otherId) return;
      const otherPos = skillPositions.get(otherId);
      if (!otherPos) return; // 跨系協同在面板中顯示，同系則在畫布畫出能量弧

      const x1 = focusPos.x;
      const y1 = focusPos.y;
      const x2 = otherPos.x;
      const y2 = otherPos.y;

      // 弧度控制點偏移
      const dx = x2 - x1;
      const dy = y2 - y1;
      const midX = (x1 + x2) / 2 + (dy !== 0 ? 30 : 0);
      const midY = (y1 + y2) / 2 - (dx !== 0 ? 30 : 0);

      arcs.push({
        id: `syn-${rel.sourceId}-${rel.targetId}`,
        fromId: isIncoming ? otherId : activeFocusId,
        toId: isIncoming ? activeFocusId : otherId,
        pathD: `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`,
        percent: rel.percentPerPoint,
      });
    });

    return arcs;
  }, [activeFocusId, skillPositions]);

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none bg-sanctuary-950/90 rounded-3xl border-2 border-sanctuary-800 shadow-2xl overflow-hidden p-3 sm:p-5">
      {/* 經典暗黑古石板背景與魔法陣紋理 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sanctuary-900/60 via-sanctuary-950/95 to-sanctuary-950 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#eab30815_1px,transparent_1px),linear-gradient(to_bottom,#eab30815_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* 等級需求列標示 (左側輔助尺標) */}
      <div className="absolute left-1 sm:left-2 top-0 bottom-0 flex flex-col justify-between py-6 pointer-events-none text-[9px] sm:text-[10px] font-mono text-sanctuary-500 font-bold z-10">
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 1</span>
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 6</span>
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 12</span>
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 18</span>
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 24</span>
        <span className="bg-sanctuary-900/80 px-1 py-0.5 rounded border border-sanctuary-800">Lv 30</span>
      </div>

      {/* 畫布核心容器 (高寬比 1:2，完美對應 3x6 矩陣) */}
      <div className="relative w-full aspect-[3/6] max-h-[700px]">
        {/* SVG 連線層 */}
        <svg
          viewBox="0 0 300 600"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            {/* 前置箭頭定義 (已點亮 vs 未點亮) */}
            <marker
              id="arrow-active"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <polygon points="0 1, 7 4, 0 7, 2 4" fill="#eab308" />
            </marker>
            <marker
              id="arrow-inactive"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <polygon points="0 1, 7 4, 0 7, 2 4" fill="#3f3f46" />
            </marker>

            {/* 協同能量發光濾鏡 */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 前置依賴連線 (暗金色或深鐵灰色) */}
          {prerequisiteLines.map((line) => (
            <path
              key={line.id}
              d={line.pathD}
              fill="none"
              stroke={line.isMet ? '#eab308' : '#3f3f46'}
              strokeWidth={line.isMet ? 3 : 2}
              strokeDasharray={line.isMet ? 'none' : '4,3'}
              markerEnd={line.isMet ? 'url(#arrow-active)' : 'url(#arrow-inactive)'}
              className="transition-colors duration-300"
            />
          ))}

          {/* 協同動態能量弧 (Cyber Arc / Mana Stream) */}
          {activeSynergyArcs.map((arc) => (
            <path
              key={arc.id}
              d={arc.pathD}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={3}
              strokeDasharray="6,4"
              filter="url(#glow-cyan)"
              className="animate-pulse opacity-90 transition-all duration-300"
            />
          ))}
        </svg>

        {/* 技能按鈕節點 (6x3 網格絕對定位) */}
        {skills.map((skill, idx) => {
          const pos = getSkillGridPosition(skill.id, skill.requiredLevel, idx);
          const points = skillPoints[skill.id] || 0;
          const isMax = points >= (skill.maxPoints || 20);
          const isUnlocked = isPrerequisitesMet(skill);
          const isSelected = selectedSkillId === skill.id;
          const isHovered = hoveredSkillId === skill.id;
          const isSynergyPartner = activeSynergyIds.includes(skill.id);

          // 計算節點在百分比坐標下的位置 (寬高均分為 3 欄 6 列)
          const leftPercent = (pos.col * 100) / 3 + 100 / 6; // 欄中心
          const topPercent = (pos.row * 100) / 6 + 100 / 12; // 列中心

          return (
            <div
              key={skill.id}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              onMouseEnter={() => onHoverSkill(skill.id)}
              onMouseLeave={() => onHoverSkill(null)}
              onClick={() => onSelectSkill(skill)}
              onContextMenu={(e) => {
                e.preventDefault();
                onRemovePoint(skill, 1);
              }}
            >
              {/* 協同脈衝光環 (當該技能是當前技能的協同技能時劇烈脈衝) */}
              {isSynergyPartner && (
                <div className="absolute -inset-2 rounded-2xl bg-cyan-500/20 animate-ping pointer-events-none" />
              )}

              {/* 節點主體外框 */}
              <button
                type="button"
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center p-1 border-2 select-none shadow-lg ${
                  isSelected
                    ? 'border-d2-gold ring-4 ring-d2-gold/30 bg-sanctuary-850 scale-110 z-30 shadow-d2-gold/20'
                    : isSynergyPartner
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-sanctuary-900 scale-105 shadow-cyan-500/30'
                    : isMax
                    ? 'border-amber-400/90 bg-sanctuary-900 shadow-amber-400/20'
                    : points > 0
                    ? 'border-d2-gold/70 bg-sanctuary-900 shadow-d2-gold/10'
                    : isUnlocked
                    ? 'border-sanctuary-700 bg-sanctuary-950/90 hover:border-sanctuary-500 hover:scale-105'
                    : 'border-sanctuary-850 bg-sanctuary-950/70 opacity-55 grayscale cursor-not-allowed'
                }`}
              >
                {/* 技能圖示 */}
                <div className="relative">
                  {getSkillIcon(skill)}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                      <Lock className="w-3.5 h-3.5 text-sanctuary-400" />
                    </div>
                  )}
                </div>

                {/* 技能名稱簡稱 */}
                <div className="text-[10px] sm:text-[11px] font-diablo font-bold text-sanctuary-200 truncate max-w-[52px] sm:max-w-[60px] text-center mt-0.5 leading-tight">
                  {skill.name}
                </div>

                {/* 點數計數器方框 (右下角 D2 經典標記) */}
                <div
                  className={`absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border shadow-md transition-colors ${
                    isMax
                      ? 'bg-d2-gold text-sanctuary-950 border-amber-300 font-extrabold'
                      : points > 0
                      ? 'bg-sanctuary-900 text-d2-gold border-d2-gold/60'
                      : 'bg-sanctuary-900 text-sanctuary-400 border-sanctuary-750'
                  }`}
                >
                  {points}
                </div>

                {/* 協同徽章 (當有協同時顯示小閃電) */}
                {skill.synergies && skill.synergies.length > 0 && (
                  <div
                    title={`擁有 ${skill.synergies.length} 項協同關聯`}
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-[9px] text-cyan-300 shadow"
                  >
                    ⚡
                  </div>
                )}
              </button>

              {/* 快速加減微調按鈕群 (懸浮或選中時顯現) */}
              {(isHovered || isSelected) && isUnlocked && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-sanctuary-900/95 px-1.5 py-0.5 rounded-lg border border-sanctuary-750 shadow-xl z-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePoint(skill, 1);
                    }}
                    disabled={points <= 0}
                    className="w-5 h-5 rounded flex items-center justify-center bg-sanctuary-800 hover:bg-sanctuary-700 text-sanctuary-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    title="右鍵或點擊扣除 1 點"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddPoint(skill, 1);
                    }}
                    disabled={isMax || remainingPoints <= 0}
                    className="w-5 h-5 rounded flex items-center justify-center bg-d2-gold text-sanctuary-950 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
                    title="左鍵或點擊增加 1 點"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddPoint(skill, 20);
                    }}
                    disabled={isMax || remainingPoints <= 0}
                    className="px-1 text-[9px] font-mono font-bold rounded bg-sanctuary-800 hover:bg-d2-gold hover:text-sanctuary-950 text-d2-gold disabled:opacity-30 disabled:cursor-not-allowed"
                    title="加滿至 20 點"
                  >
                    MAX
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部操作圖例與快捷提示 */}
      <div className="mt-3 pt-3 border-t border-sanctuary-850 flex flex-wrap items-center justify-between text-[11px] text-sanctuary-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-d2-gold inline-block" />
            <span className="text-sanctuary-300">前置傳遞路徑</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
            <span className="text-cyan-300 font-semibold">協同加成弧線 (Synergy)</span>
          </span>
        </div>
        <div className="text-sanctuary-400 font-mono text-[10px]">
          左鍵加點 / 右鍵減點 / 點擊查看全息協同矩陣
        </div>
      </div>
    </div>
  );
};
