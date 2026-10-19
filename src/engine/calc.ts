/**
 * 遊戲 skills.txt 的計算式（calc）小型求值器。
 * 支援：數字、par1..par20、lvl／blvl／clvl、skill('名稱'.lvl|.blvl)、+ - * / % 與括號、min()/max()。
 * 遇到不認得的識別字或函式一律丟出 CalcError，呼叫端應視為「無法計算」而不是當成 0。
 */
export class CalcError extends Error {}

export interface CalcContext {
  /** 本技能的 parN（以 N 為鍵） */
  params: Record<number, number | string | undefined>;
  /** 本技能目前的有效等級（含 +技能） */
  lvl?: number;
  /** 本技能的硬點數 */
  blvl?: number;
  clvl?: number;
  /** 其他技能：名稱 → {lvl, blvl} */
  skill: (name: string) => { lvl: number; blvl: number } | undefined;
}

type Tok = { t: 'num'; v: number } | { t: 'id'; v: string } | { t: 'str'; v: string } | { t: 'op'; v: string };

function tokenize(src: string): Tok[] {
  const out: Tok[] = []; let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) { let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++; out.push({ t: 'num', v: parseFloat(src.slice(i, j)) }); i = j; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++; out.push({ t: 'id', v: src.slice(i, j) }); i = j; continue; }
    if (c === "'") { const j = src.indexOf("'", i + 1); if (j < 0) throw new CalcError('未結束的字串'); out.push({ t: 'str', v: src.slice(i + 1, j) }); i = j + 1; continue; }
    if ('+-*/%(),.'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
    throw new CalcError(`不認得的字元 ${c}`);
  }
  return out;
}

export function evalCalc(src: string, ctx: CalcContext): number {
  const toks = tokenize(src); let p = 0;
  const peek = () => toks[p];
  const eatOp = (v: string) => { const t = toks[p]; if (t && t.t === 'op' && t.v === v) { p++; return true; } return false; };
  const need = (v: string) => { if (!eatOp(v)) throw new CalcError(`缺少 ${v}`); };

  function primary(): number {
    const t = toks[p++];
    if (!t) throw new CalcError('運算式不完整');
    if (t.t === 'num') return t.v;
    if (t.t === 'op') {
      if (t.v === '(') { const v = expr(); need(')'); return v; }
      if (t.v === '-') return -unary();
      if (t.v === '+') return unary();
      throw new CalcError(`意外的 ${t.v}`);
    }
    if (t.t === 'id') {
      const id = t.v;
      if (id === 'skill') { // skill('名稱'.lvl)
        need('('); const n = toks[p++]; if (!n || n.t !== 'str') throw new CalcError('skill() 需要名稱'); need('.');
        const f = toks[p++]; if (!f || f.t !== 'id') throw new CalcError('skill() 需要欄位'); need(')');
        const sk = ctx.skill(n.v); if (!sk) throw new CalcError(`未知技能 ${n.v}`);
        if (f.v === 'lvl') return sk.lvl; if (f.v === 'blvl') return sk.blvl;
        throw new CalcError(`不支援的技能欄位 ${f.v}`);
      }
      if (id === 'min' || id === 'max') { need('('); const a = expr(); need(','); const b = expr(); need(')'); return id === 'min' ? Math.min(a, b) : Math.max(a, b); }
      if (id === 'lvl') { if (ctx.lvl === undefined) throw new CalcError('缺少 lvl'); return ctx.lvl; }
      if (id === 'blvl') { if (ctx.blvl === undefined) throw new CalcError('缺少 blvl'); return ctx.blvl; }
      if (id === 'clvl') { if (ctx.clvl === undefined) throw new CalcError('缺少 clvl'); return ctx.clvl; }
      const m = /^par(\d+)$/.exec(id);
      if (m) { const v = ctx.params[Number(m[1])]; const n = typeof v === 'number' ? v : v === undefined || v === '' ? NaN : Number(v); if (Number.isNaN(n)) throw new CalcError(`未定義 ${id}`); return n; }
      throw new CalcError(`不認得的識別字 ${id}`);
    }
    throw new CalcError('語法錯誤');
  }
  function unary(): number { return primary(); }
  function term(): number {
    let v = primary();
    for (;;) {
      if (eatOp('*')) v *= primary();
      else if (eatOp('/')) { const d = primary(); v = d === 0 ? 0 : v / d; }
      else if (eatOp('%')) { const d = primary(); v = d === 0 ? 0 : v % d; }
      else return v;
    }
  }
  function expr(): number {
    let v = term();
    for (;;) {
      if (eatOp('+')) v += term();
      else if (eatOp('-')) v -= term();
      else return v;
    }
  }
  const r = expr();
  if (peek()) throw new CalcError('運算式後有多餘內容');
  return r;
}

/** 運算式中引用到的技能名稱（供協同來源列舉） */
export function referencedSkills(src: string | undefined): string[] {
  if (!src) return [];
  const out = new Set<string>();
  const re = /skill\('([^']+)'\./g; let m: RegExpExecArray | null;
  while ((m = re.exec(src))) out.add(m[1]);
  return [...out];
}
