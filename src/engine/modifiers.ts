import type { Modifier, PropertyDef, StatEntry } from './types';

/** 不產生角色數值的 modifier func（充能、不可破壞、無形、召喚、狀態）。僅記錄，不算「未處理」 */
const NON_STAT_FUNCS = new Set([19, 20, 23, 24]);

export interface ResolveResult {
  entries: StatEntry[];
  /** 此 modifier 為非數值（如不可破壞）或引擎不處理者的說明 */
  note?: string;
  /** 無法解析 */
  unresolved?: string;
}

const pick = (m: Modifier, roll: number, which: 'min' | 'max' | 'roll'): number => {
  const mn = m.min ?? 0;
  const mx = m.max ?? mn;
  if (which === 'min') return mn;
  if (which === 'max') return mx;
  return Math.floor(mn + (mx - mn) * roll);
};

/**
 * 依 properties.txt 的 func 將 modifier 展開成 stat 條目。
 * 規則（來源：遊戲 properties.txt／itemstatcost.txt，3.3.93847）：
 *  func 1/2/3/8=直接加值；5/6/7=一般傷害最小／最大／%；10=技能樹；11=觸發技能；12/22=單一技能；
 *  14=插槽；15/16=傷害下限／上限；17=依等級（值＝par）；21/36=職業或元素技能；其餘見 NON_STAT_FUNCS。
 */
const lowerCache = new WeakMap<object, Map<string, PropertyDef>>();
/** 遊戲表偶有大小寫不一致的屬性代碼（例如 Gethit-skill 對 gethit-skill）；遊戲內不分大小寫，這裡比照 */
function propertyOf(props: Record<string, PropertyDef>, code: string): PropertyDef | undefined {
  if (props[code]) return props[code];
  let m = lowerCache.get(props);
  if (!m) { m = new Map(Object.entries(props).map(([k, v]) => [k.toLowerCase(), v])); lowerCache.set(props, m); }
  return m.get(code.toLowerCase());
}

/** 隨機屬性的決定者：遊戲裡是掉落時骰出來的，模擬器改由使用者／角色決定 */
export interface ResolveContext {
  /** 目前角色的職業編號（CLASS_INDEX）。隨機職業技能（暗黑火炬）依此計算 */
  classIndex?: number;
  /** 使用者為「隨機單一技能」選的技能英文名稱（例如奧姆斯長袍的 +3 隨機魔法使技能） */
  randomSkill?: string;
}

export function resolveModifier(m: Modifier, props: Record<string, PropertyDef>, roll = 1, ctx: ResolveContext = {}): ResolveResult {
  const def = propertyOf(props, m.code);
  if (!def) return { entries: [], unresolved: `未定義屬性 ${m.code}` };
  const code = m.code.toLowerCase();
  // 隨機職業技能（暗黑火炬）：屬性定義的 val 是「加幾級」，min..max 是職業編號的隨機範圍，不是數值。依目前角色的職業計算
  if (code === 'randclassskill') {
    const part = def.parts[0];
    if (ctx.classIndex === undefined) return { entries: [], note: '隨機職業技能：需要指定職業才能計算' };
    return { entries: [{ stat: part.stat ?? 'item_addclassskills', value: part.val ?? 0, param: ctx.classIndex }] };
  }
  // 隨機單一技能（奧姆斯長袍）：par 是「加幾級」，min..max 是技能編號的隨機範圍，不是數值。由使用者選定哪一招
  if (code === 'skill-rand') {
    const part = def.parts[0];
    if (!ctx.randomSkill) return { entries: [], note: '隨機單一技能：尚未選擇技能，未計入' };
    return { entries: [{ stat: part.stat ?? 'item_singleskill', value: typeof m.par === 'number' ? m.par : 0, param: ctx.randomSkill }] };
  }
  const v = pick(m, roll, 'roll');
  const entries: StatEntry[] = [];
  let note: string | undefined;
  for (const part of def.parts) {
    const f = part.func;
    const stat = part.stat;
    switch (f) {
      case 1: case 2: case 3: case 8:
        if (stat) entries.push({ stat, value: v });
        break;
      case 5: entries.push({ stat: 'mindamage', value: v }); break;
      case 6: entries.push({ stat: 'maxdamage', value: v }); break;
      case 7:
        entries.push({ stat: 'item_mindamage_percent', value: pick(m, roll, 'roll') });
        entries.push({ stat: 'item_maxdamage_percent', value: pick(m, roll, 'roll') });
        break;
      case 10: // 技能樹：par=樹編號
        if (stat) entries.push({ stat, value: v, param: m.par });
        break;
      case 11: // 觸發技能：par=技能，min=機率，max=等級
        if (stat) entries.push({ stat, value: m.min ?? 0, param: m.par, level: m.max });
        break;
      case 12: case 22: // 單一技能：par=技能
        if (stat) entries.push({ stat, value: v, param: m.par });
        break;
      case 14: if (stat) entries.push({ stat, value: v }); break;
      case 15: if (stat) entries.push({ stat, value: m.min ?? 0 }); break;
      case 16: if (stat) entries.push({ stat, value: m.max ?? m.min ?? 0 }); break;
      case 17: // 依等級：值為 par（1/8 單位，換算由 stat 的 op 處理）、或持續時間
        if (stat) entries.push({ stat, value: typeof m.par === 'number' ? m.par : v });
        break;
      case 21: case 36: // 職業／元素技能：val 為職業或元素編號
        if (stat) entries.push({ stat, value: v, param: part.val ?? (typeof m.par === 'number' ? m.par : undefined) });
        break;
      default:
        if (f !== undefined && NON_STAT_FUNCS.has(f)) note = `非數值屬性（func ${f}）`;
        else if (stat) { entries.push({ stat, value: v }); note = `未明確支援的 func ${f}，以直接加值處理`; }
        else note = `func ${f} 無 stat`;
    }
  }
  return { entries, note };
}
