import { skillByName, skillPointBudget, synergySources, type GameSkill } from './skills';

/** 流派的技能規劃：主力技能、固定加點，其餘依遊戲技能表的協同關係自動分配 */
export interface SkillSpec {
  /** 主力技能（英文名稱），點到滿級並自動補齊前置 */
  main: string;
  /** 先行加點（英文名稱 → 點數），例如傳送、專精、光環；在主力之前扣除預算 */
  extra?: Record<string, number>;
  /** 把主力技能的協同來源依每點加成由高至低點滿（預設 true） */
  synergy?: boolean;
  /** 預算有剩時，依序點滿的技能（英文名稱）；不寫則剩餘點數不分配 */
  fill?: string[];
}

export interface SkillPlan { points: Record<string, number>; mainId: string; used: number; budget: number; notes: string[] }

/**
 * 依規格產生技能點（硬點，不含裝備加成）。
 * 前置技能（prereq）一併補 1 點；等級不足的技能略過並說明；超出預算的部分不加並說明，不會悄悄截斷。
 */
export function planSkills(classCode: string, level: number, spec: SkillSpec, questDifficulties = 3): SkillPlan {
  const budget = skillPointBudget(level, questDifficulties);
  const pts: Record<string, number> = {}; const notes: string[] = [];
  let left = budget;
  const give = (s: GameSkill, want: number, why: string): void => {
    if (s.charClass !== classCode) { notes.push(`「${s.name ?? s.nameEn}」不屬於此職業，已略過`); return; }
    if (s.reqLevel > level) { notes.push(`「${s.name ?? s.nameEn}」需要等級 ${s.reqLevel}，目前 ${level}，已略過（${why}）`); return; }
    const cur = pts[s.id] ?? 0; const target = Math.min(s.maxLvl, Math.max(cur, want));
    // 先補前置（各 1 點），再補本技能
    for (const n of s.prereq) { const p = skillByName(n); if (p && !(pts[p.id] > 0)) give(p, 1, `${s.name ?? s.nameEn} 的前置`); }
    const need = target - (pts[s.id] ?? 0); if (need <= 0) return;
    const add = Math.min(need, left);
    if (add < need && why !== '補滿') notes.push(`技能點不足：「${s.name ?? s.nameEn}」只能加 ${add}／${need} 點`);
    if (add > 0) { pts[s.id] = (pts[s.id] ?? 0) + add; left -= add; }
  };
  for (const [n, v] of Object.entries(spec.extra ?? {})) {
    const s = skillByName(n); if (!s) { notes.push(`找不到技能「${n}」`); continue; } give(s, v, '固定加點');
  }
  const main = skillByName(spec.main);
  if (!main) { notes.push(`找不到主力技能「${spec.main}」`); return { points: pts, mainId: '', used: budget - left, budget, notes }; }
  give(main, main.maxLvl, '主力技能');
  if (spec.synergy !== false) {
    const srcs = synergySources(main, {}).sources.filter((x) => x.skill.charClass === classCode).sort((a, b) => b.perPoint - a.perPoint);
    for (const x of srcs) give(x.skill, x.skill.maxLvl, '協同來源');
  }
  for (const n of spec.fill ?? []) { const s = skillByName(n); if (!s) notes.push(`找不到技能「${n}」`); else if (left > 0) give(s, s.maxLvl, '補滿'); }
  return { points: pts, mainId: main.id, used: budget - left, budget, notes };
}

