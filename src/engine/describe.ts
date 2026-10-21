import properties from '../data/game/properties.json';
import stats from '../data/game/stats.json';
import statStrings from '../data/game/statStrings.zhTW.json';
import skillNamesJson from '../data/game/skillNames.json';
import itemSkillRows from '../data/game/itemSkills.json';
import { resolveModifier } from './modifiers';
import type { Modifier, PropertyDef, StatDef, StatEntry } from './types';
import { CLASS_INDEX } from './character';
import { CLASS_CODE_ZH, tabName } from './classes';

/** 沒有職業的物品技能（熊人／狼人印記等）的持續秒數，來自遊戲資料表（auralencalc 影格數 ÷ 25） */
const itemSkillSecs = new Map(Object.entries(itemSkillRows as Record<string, { seconds: number }>).map(([k, v]) => [k.toLowerCase(), v.seconds]));
export const itemSkillSeconds = (name: string): number | undefined => itemSkillSecs.get(name.toLowerCase());

const CLASS_ZH_BY_INDEX = ['亞馬遜', '魔法使', '死靈法師', '聖騎士', '野蠻人', '德魯伊', '刺客', '術士'];
const props = properties as unknown as Record<string, PropertyDef>;
type StatRow = StatDef & { descstrpos?: string; descfunc?: number; descpriority?: number };
const statDefs = stats as unknown as Record<string, StatRow>;
const strs = statStrings as Record<string, string>;

interface SkillRow { gameId: number; nameEn: string; name?: string; charClass: string }
/** 全部技能的名稱（含道具專用、怪物技能；觸發技能與充能的技能參數可能是這些），class 欄只有職業技能才有（資料管線已把職業放進這張表，不必載入整份技能表） */
const allSkills: SkillRow[] = (skillNamesJson as { gameId: number; nameEn: string; name?: string; charClass?: string }[]).map((s) => ({ ...s, charClass: s.charClass ?? '' }));
const skillByGameId = new Map<number, SkillRow>(allSkills.map((s) => [s.gameId, s]));
const skillByNameEn = new Map<string, SkillRow>(allSkills.map((s) => [s.nameEn.toLowerCase(), s]));
/** modifier 的技能參數：遊戲表有時是技能 id（數字），有時是英文名（大小寫不一定一致） */
const skillOf = (p?: number | string): SkillRow | undefined => {
  if (p === undefined || p === '') return undefined;
  if (typeof p === 'number' || /^\d+$/.test(p)) return skillByGameId.get(Number(p));
  return skillByNameEn.get(p.toLowerCase());
};
const skillName = (p?: number | string): string => skillOf(p)?.name ?? (p === undefined ? '' : typeof p === 'number' ? `技能 #${p}` : p);
const skillClassZh = (p?: number | string): string | undefined => { const c = skillOf(p)?.charClass; return c ? CLASS_CODE_ZH[c] : undefined; };

/** 遊戲字串範本的 sprintf：%+d、%d、%s 依序取值，%0～%9 取指定位置，%% 為百分號。值可為字串（區間文字，例如「(1-148)」） */
export function sprintf(tpl: string, args: (number | string)[]): string {
  let i = 0;
  return tpl.replace(/%(\+d|d|s|%|\d)/g, (_m, t: string) => {
    if (t === '%') return '%';
    if (/^\d$/.test(t)) return String(args[Number(t)] ?? '');
    const a = args[i++];
    if (a === undefined) return '';
    if (t === '+d') return typeof a === 'number' ? (a >= 0 ? `+${a}` : String(a)) : (a.startsWith('-') ? a : `+${a}`);
    return String(a);
  });
}
const sign = (v: number) => (v >= 0 ? `+${v}` : String(v));
const trimNum = (n: number) => String(Math.round(n * 1000) / 1000);

/**
 * 依遊戲 itemstatcost 的 descstr 範本產生單行繁中描述；無法對映者回傳 undefined（呼叫端以 fallback 顯示，不隱藏）。
 * formula=true 時，「依角色等級」類屬性改寫成百科用的算式（區間＋每級係數），否則依 level 換算成數值。
 */
export function describeEntry(e: StatEntry, level = 90, formula = false): string | undefined {
  const d0 = statDefs[e.stat] as (StatRow & { op?: number; op_param?: number }) | undefined;
  if (d0 && d0.op && [2, 3, 4, 5].includes(d0.op) && d0.op_stat1) {
    const rate = e.value / 2 ** (d0.op_param ?? 0);
    // 沿用該「依等級」屬性自己的字串範本（例如「%+d 生命」「%+d%% 最大傷害強化」），沒有時才退回目標屬性的範本
    const tpl = d0.descstrpos ? strs[d0.descstrpos] : undefined;
    const label = (v: number | string) => (tpl ? sprintf(tpl, [v]) : (statDefs[d0.op_stat1 as string]?.descstrpos ? sprintf(strs[statDefs[d0.op_stat1 as string].descstrpos as string], [v]) : `${v} ${d0.op_stat1}`));
    if (formula) return `${label(`(${Math.floor(rate)}-${Math.floor(rate * 99)})`)} （依角色等級而定） [${trimNum(rate)} * clvl]`;
    return `${label(Math.floor(rate * level))}（依角色等級 ${level}）`;
  }
  if (e.stat === 'item_allskills') return `${sign(e.value)} 所有技能`;
  if (e.stat === 'item_addclassskills') return `${sign(e.value)} ${CLASS_ZH_BY_INDEX[Number(e.param)] ?? CLASS_INDEX[Number(e.param)] ?? ''}技能等級`;
  if (e.stat === 'item_addskill_tab') {
    const id = Number(e.param); const tn = tabName(id); const cn = CLASS_ZH_BY_INDEX[Math.floor(id / 3)] ?? '';
    return `${sign(e.value)} ${tn ?? `技能樹 #${id % 3 + 1}`}（只限${cn}）`;
  }
  if (e.stat === 'mindamage') return `${sign(e.value)} 最小傷害`;
  if (e.stat === 'maxdamage') return `${sign(e.value)} 最大傷害`;
  if (e.stat === 'item_mindamage_percent') return undefined; // 與最大傷害％合併成一行
  if (e.stat === 'item_maxdamage_percent') return `${sign(e.value)}% 傷害強化`;
  const d = statDefs[e.stat];
  const tpl = d?.descstrpos ? strs[d.descstrpos] : undefined;
  if (!tpl) return undefined;
  if (e.stat === 'item_singleskill') { const c = skillClassZh(e.param); return sprintf(tpl, [e.value, skillName(e.param), c ? `（只限${c}）` : '']).trim(); }
  if (e.stat === 'item_nonclassskill') return sprintf(tpl, [e.value, skillName(e.param)]);
  if (e.stat === 'item_explosivearrow' || e.stat === 'item_magicarrow') return `${tpl} 等級 ${e.value}`;
  if (e.stat === 'item_freeze' || e.stat === 'item_stupidity') return `${tpl} +${e.value}`;
  if (e.stat === 'item_extra_stack') return `${tpl} ${e.value}`; // 範本沒有數值欄位，遊戲提示框是「凍結目標 +N」
  // 每 N 幀的速率換算成秒：遊戲以 100／值 秒表示一次
  if (e.stat === 'item_replenish_durability') return `每 ${Math.floor(100 / e.value)} 秒修復 1 點耐久度`;
  if (e.stat === 'item_replenish_quantity') return `${tpl}：每 ${Math.floor(100 / e.value)} 秒 1 個`;
  const mark = String(e.param).toLowerCase() === 'mark of the bear' ? '熊人變化' : String(e.param).toLowerCase() === 'mark of the wolf' ? '狼人變化' : undefined;
  if (mark && d.descfunc === 15) { const secs = itemSkillSeconds(String(e.param)); return secs !== undefined ? `${mark}的攻擊會賦予印記，持續 ${secs} 秒` : `${mark}的攻擊會賦予印記`; }
  if (d.descfunc === 15 && e.level !== undefined) return sprintf(tpl, [e.value, e.level, skillName(e.param)]); // 觸發技能：機率、等級、技能
  if (d.descfunc === 16) return sprintf(tpl, [e.value, skillName(e.param)]); // 靈氣：等級、技能
  // descfunc 5：遊戲以 128 為 100% 儲存（怪物逃跑％）
  const v = d.descfunc === 5 ? Math.floor((e.value * 100) / 128) : e.value;
  return sprintf(tpl, [v, e.param !== undefined ? skillName(e.param) : '']);
}

export interface DescribedLine { text: string; known: boolean }
interface Line extends DescribedLine { pri: number }

/** 只影響外觀、不該顯示的屬性：血跡、冰凍持續時間（附屬於冰寒傷害） */
const HIDDEN_CODES = new Set(['bloody', 'cold-len', 'roguesbow-affix1']);
const HIDDEN_STATS = new Set(['coldlength']);
const MONSTER_ZH: Record<string, string> = { '1': '返世亡靈' };

const pickRoll = (m: Modifier, roll: number): number => { const mn = m.min ?? 0; const mx = m.max ?? mn; return Math.floor(mn + (mx - mn) * roll); };
const prio = (stat: string) => statDefs[stat]?.descpriority ?? 0;
const unknownLine = (m: Modifier): Line => ({ text: `${m.code}${m.min !== undefined ? ` ${m.min}${m.max !== undefined && m.max !== m.min ? `–${m.max}` : ''}` : ''}`, known: false, pri: -1 });

/** 不經過 stat 條目、需要整條 modifier 才能描述的屬性（參數意義與一般屬性不同） */
function specialLines(m: Modifier, roll: number): Line[] | undefined {
  switch (m.code) {
    case 'dmg-min': return [{ text: `${sign(pickRoll(m, roll))} 最小傷害`, known: true, pri: prio('mindamage') }];
    case 'dmg-max': return [{ text: `${sign(pickRoll(m, roll))} 最大傷害`, known: true, pri: prio('maxdamage') }];
    // 套裝全套的外觀效果（遊戲狀態）：光環、吸血鬼造型
    case 'state': return [{ text: m.par === 'monsterset' ? '角色變成吸血鬼造型' : m.par === 'fullsetgeneric' ? '角色顯示光環效果' : `角色狀態：${m.par}`, known: true, pri: 0 }];
    case 'fade': return [{ text: '角色顯示虛影效果', known: true, pri: 0 }];
    case 'sock': return [{ text: `鑲孔（${m.par !== undefined ? m.par : pickRoll(m, roll)}）`, known: true, pri: 0 }];
    case 'ethereal': return [{ text: '無形（無法修復）', known: true, pri: 1 }];
    case 'indestruct': return [{ text: '永不毀損', known: true, pri: 1 }];
    case 'dur': return [{ text: `${sign(pickRoll(m, roll))} 耐久度`, known: true, pri: 1 }];
    // 充能：par＝技能、min＝次數、max＝等級（地獄火炬：等級 30 多頭蛇，10 次）
    case 'charged': { const lv = m.max ?? 1; const n = m.min ?? 1; return [{ text: `等級 ${lv} ${skillName(m.par)}（${n} 次）`, known: true, pri: 1 + lv / 1000 }]; }
    case 'reanimate': return [{ text: sprintf(strs.Moditemreanimas, [pickRoll(m, roll), MONSTER_ZH[String(m.par)] ?? `怪物 #${m.par}`]), known: true, pri: prio('item_reanimate') }];
    // 隨機職業技能：par＝加成值，min～max＝技能編號範圍（決定職業）
    case 'skill-rand': { const c = skillClassZh(m.min); const v = Number(m.par ?? 0); return [{ text: `${sign(v)} ${c ?? ''}隨機技能等級${c ? ` （只限${c}）` : ''}`, known: true, pri: prio('item_singleskill') }]; }
    // 隨機職業技能（所有職業）：加成值在屬性定義的 val
    case 'randclassskill': { const v = props.randclassskill?.parts[0]?.val ?? 0; return [{ text: `${sign(v)} 職業技能等級（暗黑火炬：模擬器依目前職業計算）`, known: true, pri: prio('item_addclassskills') }]; }
    // 術士三棵技能樹全加（properties 沒定義，屬性表有的是 skilltab 編號 21～23）
    case 'skilltab-war': return [0, 1, 2].map((i) => ({ text: describeEntry({ stat: 'item_addskill_tab', value: pickRoll(m, roll), param: 21 + i }) as string, known: true, pri: prio('item_addskill_tab') - i * 0.001 }));
    default: return undefined;
  }
}

const DAMAGE_GROUPS: { min: string; max: string; label: string }[] = [
  { min: 'firemindam', max: 'firemaxdam', label: '火焰傷害' },
  { min: 'coldmindam', max: 'coldmaxdam', label: '冰寒傷害' },
  { min: 'lightmindam', max: 'lightmaxdam', label: '電擊傷害' },
  { min: 'magicmindam', max: 'magicmaxdam', label: '魔法傷害' },
  { min: 'mindamage', max: 'maxdamage', label: '傷害' },
];
const RESIST_STATS = ['fireresist', 'lightresist', 'coldresist', 'poisonresist'];
const ATTR_STATS = ['strength', 'dexterity', 'vitality', 'energy'];

export interface DescribeRangeOptions {
  /** 冰寒傷害附上冰凍持續時間（符文效果頁用；物品提示框不顯示） */
  coldLength?: boolean;
}

function buildLines(mods: Modifier[], roll: number, level: number, formula: boolean, opts: DescribeRangeOptions = {}): Line[] {
  const lines: Line[] = [];
  const merged = new Map<string, { e: StatEntry; src: Modifier; n: number }>();
  for (const m of mods) {
    if (HIDDEN_CODES.has(m.code)) continue;
    const sp = specialLines(m, roll);
    if (sp) { lines.push(...sp); continue; }
    const r = resolveModifier(m, props, roll);
    if (r.unresolved) { lines.push(unknownLine(m)); continue; }
    if (r.entries.length === 0) { lines.push({ text: r.note ?? m.code, known: true, pri: -1 }); continue; }
    // 遊戲內同一個 stat 的多條屬性會合併成一行（例如兩條「攻擊者反傷 5」顯示為 10）
    for (const e of r.entries) {
      const k = `${e.stat}|${e.param ?? ''}|${e.level ?? ''}`;
      const cur = merged.get(k);
      if (cur) { cur.e = { ...cur.e, value: cur.e.value + e.value }; cur.n++; } else merged.set(k, { e: { ...e }, src: m, n: 1 });
    }
  }
  const take = (stat: string): number | undefined => { const k = `${stat}||`; const x = merged.get(k); if (!x) return undefined; merged.delete(k); return x.e.value; };
  // 多個來源的毒素傷害：每幀傷害相加，持續時間取各來源的平均（遊戲提示框的合併方式）
  const takeAvg = (stat: string): number | undefined => { const k = `${stat}||`; const x = merged.get(k); if (!x) return undefined; merged.delete(k); return x.e.value / x.n; };
  const has = (stat: string) => merged.has(`${stat}||`);

  // 傷害：最小／最大成對時合併為「附加 a - b X傷害」
  for (const g of DAMAGE_GROUPS) {
    if (!has(g.min) || !has(g.max)) continue;
    const a = take(g.min) as number; const b = take(g.max) as number;
    const cold = g.min === 'coldmindam' && opts.coldLength && has('coldlength') ? `，持續 ${Math.round((take('coldlength') as number) / 25)} 秒` : '';
    lines.push({ text: `${a === b ? `+${a} ${g.label}` : `附加 ${a} - ${b} ${g.label}`}${cold}`, known: true, pri: prio(g.min) });
  }
  // 毒素：傷害（每幀）× 持續幀數 ÷ 256 ＝ 總傷害；持續時間 ÷ 25 ＝ 秒
  if (has('poisonmindam') && has('poisonmaxdam') && has('poisonlength')) {
    const len = takeAvg('poisonlength') as number; const lo = Math.round(((take('poisonmindam') as number) * len) / 256); const hi = Math.round(((take('poisonmaxdam') as number) * len) / 256);
    lines.push({ text: `${lo === hi ? `+${lo}` : `附加 ${lo} - ${hi}`} 毒素傷害，時效 ${Math.round(len / 25)} 秒`, known: true, pri: prio('poisonmindam') });
  }
  // 四項抗性、四項屬性相同時，遊戲合併顯示
  const allEqual = (list: string[]) => list.every((s) => has(s)) && new Set(list.map((s) => merged.get(`${s}||`)!.e.value)).size === 1;
  if (allEqual(RESIST_STATS)) { const v = RESIST_STATS.map(take)[0] as number; lines.push({ text: sprintf(strs.strModAllResistances, [v]), known: true, pri: prio('fireresist') }); }
  if (allEqual(ATTR_STATS)) { const v = ATTR_STATS.map(take)[0] as number; lines.push({ text: sprintf(strs.Moditem2allattrib, [v]), known: true, pri: prio('strength') }); }

  for (const { e, src } of merged.values()) {
    if (HIDDEN_STATS.has(e.stat)) continue;
    if (e.stat === 'item_mindamage_percent') continue;
    const text = describeEntry(e, level, formula);
    lines.push(text ? { text, known: true, pri: prio(e.stat) } : unknownLine(src));
  }
  return lines;
}

/** 依遊戲提示框的順序（descpriority 由大到小）排序；同優先序維持原順序 */
const ordered = (lines: Line[]): DescribedLine[] => lines.map((l, i) => ({ l, i })).sort((a, b) => b.l.pri - a.l.pri || a.i - b.i).map(({ l }) => ({ text: l.text, known: l.known }));

/** 一組 modifier → 顯示行（單一 roll：0＝全取下限、1＝全取上限）。無法描述者以「屬性代碼：數值」顯示（known=false），絕不隱藏 */
export function describeModifiers(mods: Modifier[], roll = 1, level = 90): DescribedLine[] {
  return ordered(buildLines(mods, roll, level, false));
}

/** 兩段文字中數字不同處改成區間：只有一處不同寫成「a-b」，多處不同寫成「(a-b)」 */
function mergeRange(lo: string, hi: string): string {
  if (lo === hi) return hi;
  const re = /\d+(?:\.\d+)?/g;
  const a = [...lo.matchAll(re)]; const b = [...hi.matchAll(re)];
  if (a.length !== b.length) return hi;
  const diff = a.map((x, i) => x[0] !== b[i][0]);
  const n = diff.filter(Boolean).length;
  if (n === 0) return hi;
  let out = ''; let last = 0;
  b.forEach((m, i) => {
    out += hi.slice(last, m.index); last = (m.index as number) + m[0].length;
    out += diff[i] ? (n === 1 ? `${a[i][0]}-${m[0]}` : `(${a[i][0]}-${m[0]})`) : m[0];
  });
  return out + hi.slice(last);
}

/**
 * 百科用：一組 modifier → 含數值區間的顯示行（下限～上限）。
 * 依等級增加的屬性寫成算式（「+(1-148) 生命 （依角色等級而定） [1.5 * clvl]」），不假設角色等級。
 */
export function describeRanges(mods: Modifier[], opts: DescribeRangeOptions = {}): DescribedLine[] {
  const lo = buildLines(mods, 0, 99, true, opts); const hi = buildLines(mods, 1, 99, true, opts);
  if (lo.length !== hi.length) return ordered(hi);
  return ordered(hi.map((h, i) => ({ ...h, text: mergePerLevel(lo[i].text, h.text) ?? mergeRange(lo[i].text, h.text) })));
}

/** 依等級的算式行（「+(1-99) 生命 （依角色等級而定） [1 * clvl]」）：下限取低 roll 的 1 級值、上限取高 roll 的 99 級值，係數寫成範圍 */
function mergePerLevel(lo: string, hi: string): string | undefined {
  const re = /^(.*)\((-?\d+)-(-?\d+)\)(.*)\[([\d.]+) \* clvl\]$/;
  const a = re.exec(lo); const b = re.exec(hi);
  if (!a || !b || a[1] !== b[1] || a[4] !== b[4]) return undefined;
  const rate = a[5] === b[5] ? b[5] : `${a[5]}-${b[5]}`;
  return `${b[1]}(${a[2]}-${b[3]})${b[4]}[${rate} * clvl]`;
}
