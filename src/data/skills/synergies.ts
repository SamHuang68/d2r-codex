/**
 * 技能協同（Synergy）：傷害類協同由遊戲技能表的計算式展開（engine/skills.ts 的 synergySources），
 * 不再手寫對照表。舊百科有、但遊戲表展開式沒有的 24 條，保留並在說明文字標示來源與可信度（覆蓋層 legacySynergies）。
 */
import { ELEMENT_ZH, GAME_SKILLS, synergySources } from "../../engine/skills";
import { overlay } from "../codex/common";

export interface SynergyRelation {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  percentPerPoint: number;
  bonusType: string;
  displayText: string;
  bonusTypeEn?: string;
  displayTextEn?: string;
}

export interface CalculatedSynergyItem {
  skillId: string;
  skillName: string;
  points: number;
  percentPerPoint: number;
  totalPercent: number;
  bonusType: string;
  displayText: string;
  bonusTypeEn?: string;
  displayTextEn?: string;
}

export interface SkillSynergyProfile {
  incoming: CalculatedSynergyItem[];
  outgoing: CalculatedSynergyItem[];
  totalIncomingPercent: number;
}

const nameOf = new Map(GAME_SKILLS.map((s) => [s.id, s.name ?? s.nameEn]));

const ELEMENT_EN: Record<string, string> = {
  fire: "Fire Damage",
  cold: "Cold Damage",
  ltng: "Lightning Damage",
  pois: "Poison Damage",
  mag: "Magic Damage",
  phys: "Physical Damage",
};

const fromGame = (): SynergyRelation[] => {
  const out: SynergyRelation[] = [];
  for (const t of GAME_SKILLS) {
    const bonusType = t.elem ? `${ELEMENT_ZH[t.elem.type] ?? t.elem.type}傷害` : "物理傷害";
    const bonusTypeEn = t.elem ? (ELEMENT_EN[t.elem.type] ?? `${t.elem.type} Damage`) : "Physical Damage";
    for (const x of synergySources(t, {}).sources) {
      out.push({
        sourceId: x.skill.id,
        sourceName: x.skill.name ?? x.skill.nameEn,
        targetId: t.id,
        targetName: t.name ?? t.nameEn,
        percentPerPoint: x.perPoint,
        bonusType,
        displayText: `+${x.perPoint}% ${bonusType} / 點`,
        bonusTypeEn,
        displayTextEn: `+${x.perPoint}% ${bonusTypeEn} / pt`,
      });
    }
  }
  return out;
};

/** 舊百科有、遊戲表展開式沒有的協同：有的在遊戲技能的其他計算式（光環、被動）有引用，其餘遊戲表查無依據 */
const fromLegacy = (): SynergyRelation[] => overlay.legacySynergies.map((r) => ({
  sourceId: r.source,
  sourceName: nameOf.get(r.source) ?? r.source,
  targetId: r.target,
  targetName: nameOf.get(r.target) ?? r.target,
  percentPerPoint: r.percent,
  bonusType: r.type,
  displayText: `${r.text}（舊版資料；${r.gameCalcReferencesSource ? "遊戲表另以光環或被動公式計算，模擬器尚未輸出" : "遊戲表查無此條，未證實"}）`,
  bonusTypeEn: r.type,
  displayTextEn: `+${r.percent}% ${r.type} / pt (Legacy reference)`,
}));

/** 全職業協同關聯表 */
export const SYNERGY_RELATIONS: SynergyRelation[] = [...fromGame(), ...fromLegacy()];

/**
 * 計算指定技能的協同雙向狀態
 */
export function calculateSkillSynergies(
  skillId: string,
  investedPoints: Record<string, number>
): SkillSynergyProfile {
  // 接收的協同加成 (Incoming: 誰加成我)
  const incomingRels = SYNERGY_RELATIONS.filter(r => r.targetId === skillId);
  const incoming: CalculatedSynergyItem[] = incomingRels.map(r => {
    const pts = investedPoints[r.sourceId] || 0;
    return {
      skillId: r.sourceId,
      skillName: r.sourceName,
      points: pts,
      percentPerPoint: r.percentPerPoint,
      totalPercent: pts * r.percentPerPoint,
      bonusType: r.bonusType,
      displayText: r.displayText,
      bonusTypeEn: r.bonusTypeEn,
      displayTextEn: r.displayTextEn,
    };
  });

  // 輸出的協同加成 (Outgoing: 我加成誰)
  const outgoingRels = SYNERGY_RELATIONS.filter(r => r.sourceId === skillId);
  const myPoints = investedPoints[skillId] || 0;
  const outgoing: CalculatedSynergyItem[] = outgoingRels.map(r => {
    return {
      skillId: r.targetId,
      skillName: r.targetName,
      points: myPoints,
      percentPerPoint: r.percentPerPoint,
      totalPercent: myPoints * r.percentPerPoint,
      bonusType: r.bonusType,
      displayText: r.displayText,
      bonusTypeEn: r.bonusTypeEn,
      displayTextEn: r.displayTextEn,
    };
  });

  const totalIncomingPercent = incoming.reduce((acc, item) => acc + item.totalPercent, 0);

  return {
    incoming,
    outgoing,
    totalIncomingPercent,
  };
}

/**
 * 取得與某技能相關的所有協同技能 ID (包含 incoming 與 outgoing)
 */
export function getRelatedSynergySkillIds(skillId: string): string[] {
  const ids = new Set<string>();
  SYNERGY_RELATIONS.forEach(r => {
    if (r.targetId === skillId) ids.add(r.sourceId);
    if (r.sourceId === skillId) ids.add(r.targetId);
  });
  return Array.from(ids);
}
