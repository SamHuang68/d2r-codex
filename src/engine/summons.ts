import summonsJson from '../data/game/summons.json';
import { auraEffects, passiveEffects, petCount, type GameSkill, type SkillLevels, type StatLine } from './skills';
import { skillEffectText } from './skillEffects';

/**
 * 召喚物。召喚技能在遊戲技能表（skills.txt）裡用 passivestat／aurastat 兩組「屬性＋計算式」描述它給每隻召喚物的加成
 * （生命、固定傷害、傷害強化、命中、防禦、抗性、移動速度、元素傷害…），計算式可能引用別的技能（骷髏專精、魔像專精、協同）、
 * 技能自己的元素傷害（edmn／edmx），或是 stat('…'.accr)——繼承玩家身上的穿透與專精。這裡用同一個求值器算出來。
 * 怪物本身的基礎值（生命、防禦、傷害、命中）來自 monstats.txt（summons.json）。
 *
 * 沒有核對過、所以刻意不做的事：把技能加成與怪物基礎值合併成「最終傷害」。合併規則和召喚物的等級換算沒有可核對的來源，
 * 例如女武神的基礎傷害（地獄 16–41）遠低於遊戲內實際打出的傷害，單純相乘會得到誤導的數字。這裡分開列出各項來源。
 */
export interface SummonMonster {
  id: string; minHP?: number; maxHP?: number;
  ac: (number | undefined)[]; tohit: (number | undefined)[];
  dmg: { min: (number | undefined)[]; max: (number | undefined)[]; tohit: (number | undefined)[] }[];
  res: Record<string, (number | undefined)[]>;
}
export const SUMMON_MONSTERS = summonsJson as unknown as SummonMonster[];
// 技能表的 summon 欄與 monstats 的 Id 大小寫不一定一致（ClayGolem／claygolem）
const monById = new Map(SUMMON_MONSTERS.map((m) => [m.id.toLowerCase(), m]));
export const summonMonsterOf = (s: GameSkill): SummonMonster | undefined => (s.summonId ? monById.get(s.summonId.toLowerCase()) : undefined);

export interface SummonInfo {
  skill: GameSkill; level: number;
  /** 同時存在的最大數量（技能的 petmax 算式） */
  count?: number;
  monster?: SummonMonster;
  /** 技能提供給每隻召喚物的加成（已換算成顯示文字） */
  lines: string[];
  /** 繼承自玩家的屬性（目前玩家身上的值；0 的不列） */
  inherited: string[];
  /** 算不出來的屬性行（遊戲表的計算式用到這個模擬器沒有的變數），明確標示不當成 0 */
  unsupported: string[];
  /** 怪物本身的資料表基礎值（生命、防禦、命中、每種攻擊的傷害；怪物自己的普通／惡夢／地獄值） */
  base: string[];
}

const ELEM: [string, string][] = [['fire', '火焰'], ['cold', '冰寒'], ['light', '閃電'], ['poison', '毒素'], ['magic', '魔法']];
const isInherit = (l: StatLine) => !!l.calc && /stat\('[^']+'\.accr/.test(l.calc);

/** 召喚技能（等級 lvl，硬點＋加成後）給召喚物的內容。owner 是玩家的屬性（繼承用）；difficulty 0／1／2＝普通／惡夢／地獄（怪物基礎值用） */
export function summonInfo(s: GameSkill, lvl: number, levels: SkillLevels, owner: Record<string, number>, difficulty: 0 | 1 | 2 = 2): SummonInfo | undefined {
  if (!s.summonId || lvl <= 0) return undefined;
  const monster = summonMonsterOf(s);
  const rows: { line: StatLine; value?: number; supported: boolean }[] = [];
  const add = (lines: StatLine[] | undefined, eff: { stat: string; value?: number; supported: boolean }[]) => (lines ?? []).forEach((line, i) => rows.push({ line, value: eff[i]?.value, supported: !!eff[i]?.supported }));
  add(s.passiveStats, passiveEffects(s, lvl, levels, { owner }));
  add(s.auraStats, auraEffects(s, lvl, levels, { owner }));

  const sum: Record<string, number> = {}; const inherited: string[] = []; const unsupported: string[] = [];
  for (const r of rows) {
    if (!r.supported || r.value === undefined) { if (r.line.calc) unsupported.push(r.line.stat); continue; }
    if (isInherit(r.line)) { if (r.value) { const t = skillEffectText(r.line.stat, r.value, lvl); if (t) inherited.push(t); } continue; }
    // 生命以 1/256 為單位儲存（屬性定義的 ValShift 8）
    const v = r.line.stat === 'maxhp' || r.line.stat === 'hitpoints' ? r.value / 256 : r.value;
    sum[r.line.stat] = (sum[r.line.stat] ?? 0) + v;
  }

  const lines: string[] = [];
  const done = new Set<string>();
  const hp = (sum.maxhp ?? 0) + (sum.hitpoints ?? 0); if (hp) lines.push(`生命 +${Math.floor(hp)}`);
  done.add('maxhp'); done.add('hitpoints');
  for (const [k, zh] of ELEM) {
    const mn = sum[`${k}mindam`]; const mx = sum[`${k}maxdam`]; done.add(`${k}mindam`); done.add(`${k}maxdam`);
    if (mn !== undefined || mx !== undefined) lines.push(`${zh}傷害 ${Math.floor(mn ?? 0)}–${Math.floor(mx ?? 0)}`);
  }
  for (const [stat, value] of Object.entries(sum)) {
    if (done.has(stat) || !value) continue;
    if (stat === 'velocitypercent') { lines.push(`移動速度 ${value > 0 ? '+' : ''}${value}%`); continue; }
    if (stat === 'coldlength') continue;
    const t = skillEffectText(stat, value, lvl); if (t) lines.push(t); else unsupported.push(stat);
  }

  return { skill: s, level: lvl, count: petCount(s, lvl, levels), monster, lines, inherited, unsupported, base: monsterBase(monster, difficulty) };
}

/** 怪物基礎值的顯示文字 */
export function monsterBase(m: SummonMonster | undefined, difficulty: 0 | 1 | 2 = 2): string[] {
  if (!m) return [];
  const out: string[] = [];
  if (m.maxHP) out.push(m.minHP && m.minHP !== m.maxHP ? `生命 ${m.minHP}–${m.maxHP}` : `生命 ${m.maxHP}`);
  const ac = m.ac[difficulty]; if (ac) out.push(`防禦 ${ac}`);
  m.dmg.forEach((d, i) => {
    const mn = d.min[difficulty] ?? 0; const mx = d.max[difficulty] ?? 0; if (!mx) return;
    // 兩種攻擊的數值完全相同就只列一次
    if (i > 0 && m.dmg[0].min[difficulty] === mn && m.dmg[0].max[difficulty] === mx) return;
    out.push(`${m.dmg.length > 1 ? `攻擊 ${i + 1}：` : '攻擊：'}傷害 ${mn}–${mx}${d.tohit[difficulty] ? `、命中 ${d.tohit[difficulty]}` : ''}`);
  });
  if (!m.dmg.length && m.tohit[difficulty]) out.push(`命中 ${m.tohit[difficulty]}`);
  return out;
}
