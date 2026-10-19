import properties from '../data/game/properties.json';
import stats from '../data/game/stats.json';
import statStrings from '../data/game/statStrings.zhTW.json';
import skills from '../data/game/skills.json';
import { resolveModifier } from './modifiers';
import type { Modifier, PropertyDef, StatDef, StatEntry } from './types';
import { CLASS_INDEX } from './character';
import { tabName } from './skills';

const CLASS_ZH_BY_INDEX = ['亞馬遜', '魔法使', '死靈法師', '聖騎士', '野蠻人', '德魯伊', '刺客', '術士'];
const props = properties as unknown as Record<string, PropertyDef>;
const statDefs = stats as unknown as Record<string, StatDef & { descstrpos?: string; descfunc?: number }>;
const strs = statStrings as Record<string, string>;
const skillZh = new Map<string, string>((skills as { nameEn: string; name?: string }[]).filter((s) => s.name).map((s) => [s.nameEn, s.name as string]));

const fmt = (tpl: string, value: number, param?: string): string => {
  let t = tpl;
  t = t.replace(/%\+d/, value >= 0 ? `+${value}` : String(value)).replace(/%d/, String(value)).replace(/%s/, param ?? '').replace(/%%/g, '%');
  return t;
};

/** 依遊戲 itemstatcost 的 descstr 範本產生單行繁中描述；無法對映者回傳 undefined（呼叫端以 fallback 顯示，不隱藏） */
export function describeEntry(e: StatEntry, level = 90): string | undefined {
  const d0 = statDefs[e.stat] as (StatDef & { op?: number; op_param?: number }) | undefined;
  if (d0 && d0.op && [2, 3, 4].includes(d0.op) && d0.op_stat1) {
    const v = Math.floor((e.value * level) / 2 ** (d0.op_param ?? 0));
    const target = d0.op_stat1;
    const nm: Record<string, string> = { maxhp: '生命', maxmana: '法力', strength: '力量', dexterity: '敏捷', vitality: '體能', energy: '能量', armorclass: '防禦', tohit: '準確率', maxdamage: '最大傷害' };
    if (nm[target]) return `+${v} ${nm[target]}（依角色等級 ${level}）`;
    // 其他目標屬性（例如尋獲魔法物品）：套用該屬性自己的描述範本
    const tpl = statDefs[target]?.descstrpos ? strs[statDefs[target].descstrpos as string] : undefined;
    return tpl ? `${fmt(tpl, v)}（依角色等級 ${level}）` : `+${v} ${target}（依角色等級 ${level}）`;
  }
  if (e.stat === 'item_allskills') return `${e.value >= 0 ? '+' : ''}${e.value} 所有技能`;
  if (e.stat === 'item_addclassskills') return `${e.value >= 0 ? '+' : ''}${e.value} ${CLASS_ZH_BY_INDEX[Number(e.param)] ?? CLASS_INDEX[Number(e.param)] ?? ''}技能等級`;
  if (e.stat === 'item_addskill_tab') {
    const id = Number(e.param); const tn = tabName(id); const cn = CLASS_ZH_BY_INDEX[Math.floor(id / 3)] ?? '';
    return `${e.value >= 0 ? '+' : ''}${e.value} ${tn ? `${tn}${/技能$|法術$/.test(tn) ? '' : '技能'}` : `技能樹 #${id % 3 + 1}`}（只限${cn}）`;
  }
  if (e.stat === 'item_singleskill' || e.stat === 'item_nonclassskill') { const n = skillZh.get(String(e.param)) ?? String(e.param); return `${e.value >= 0 ? '+' : ''}${e.value} ${n}`; }
  if (e.stat === 'mindamage') return `+${e.value} 最小傷害`;
  if (e.stat === 'maxdamage') return `+${e.value} 最大傷害`;
  if (e.stat === 'item_mindamage_percent') return undefined; // 與最大傷害％合併成一行
  if (e.stat === 'item_maxdamage_percent') return `+${e.value}% 傷害強化`;
  const d = statDefs[e.stat];
  const tpl = d?.descstrpos ? strs[d.descstrpos] : undefined;
  if (!tpl) return undefined;
  return fmt(tpl, e.value, e.param !== undefined ? skillZh.get(String(e.param)) ?? String(e.param) : undefined);
}

export interface DescribedLine { text: string; known: boolean }

/** 一組 modifier → 顯示行。無法描述者以「屬性代碼：數值」顯示（known=false），絕不隱藏 */
export function describeModifiers(mods: Modifier[], roll = 1, level = 90): DescribedLine[] {
  const out: DescribedLine[] = [];
  for (const m of mods) {
    const r = resolveModifier(m, props, roll);
    const lines = r.entries.map((e) => describeEntry(e, level)).filter((x): x is string => !!x);
    if (lines.length) lines.forEach((text) => out.push({ text, known: true }));
    else if (r.entries.length === 0 && !r.unresolved) out.push({ text: r.note ?? m.code, known: true });
    else out.push({ text: `${m.code}${m.min !== undefined ? ` ${m.min}${m.max !== undefined && m.max !== m.min ? `–${m.max}` : ''}` : ''}`, known: false });
  }
  return groupAllStats(out);
}

/** 遊戲將四項屬性相同加成合併顯示為「所有屬性」 */
function groupAllStats(lines: DescribedLine[]): DescribedLine[] {
  const re = (n: string) => new RegExp('^[+](\\d+) ' + n + '$');
  const kinds = ['力量', '敏捷', '體能', '能量'];
  const names = kinds.map((n) => lines.findIndex((l) => re(n).test(l.text)));
  if (names.some((i) => i < 0)) return lines;
  const vals = kinds.map((n, k) => lines[names[k]].text.match(re(n))![1]);
  if (new Set(vals).size !== 1) return lines;
  const first = Math.min(...names);
  return lines.flatMap((l, i) => (i === first ? [{ text: `+${vals[0]} 所有屬性`, known: true }] : names.includes(i) ? [] : [l]));
}
