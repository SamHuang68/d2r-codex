/**
 * 遊戲 skills.txt 的計算式（calc）小型求值器。
 * 支援：數字、par1..par9／pa10..pa20、lvl／blvl／clvl、skill('名稱'.lvl|.blvl|.parN|.lnXY|.dmXY)、+ - * / % 與括號、min()/max()、
 * 比較（< > <= >= == !=）與三元運算（條件 ? 甲 : 乙）、stat('屬性'.accr)（擁有者的屬性，召喚物繼承用）、
 * 以及技能自己的衍生數值（edmn、edmx、edln、toht…，由呼叫端算好放進 vars）、
 * 以及 lnXY（線性）與 dmXY（遞減）函式。函式的定義讀自遊戲的 skillcalc.txt（資料管線輸出 skillCalc.json），不自己寫死參數配對。
 * 運算和遊戲一樣用整數：除法往零的方向捨去（遊戲的 dm12 是 ((110*lvl)*(par2-par1))/(100*(lvl+6))+par1，每一步取整）。
 * 遇到不認得的識別字或函式一律丟出 CalcError，呼叫端應視為「無法計算」而不是當成 0。
 */
import skillCalcFns from '../data/game/skillCalc.json';

export class CalcError extends Error {}

/** lnXY、dmXY 的定義（遊戲 skillcalc.txt 的說明欄），例如 dm12 ＝ ((110 * lvl) * (par2 - par1)) / (100 * (lvl + 6)) + par1 */
const FN_DEFS = skillCalcFns as Record<string, string>;

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
  /** 其他技能的 parN（skill('名稱'.par8)、skill('名稱'.ln12) 用） */
  skillParams?: (name: string) => Record<number, number | string | undefined> | undefined;
  /** 擁有者（玩家）的屬性：stat('名稱'.accr)。召喚物繼承玩家的穿透免疫、元素穿透與專精用；沒提供就算不出來 */
  stat?: (name: string) => number | undefined;
  /** 技能自己的衍生數值（元素傷害 edmn／edmx、持續 edln、命中 toht…），由呼叫端依技能資料算好；沒有的識別字照舊視為算不出來 */
  vars?: Record<string, number>;
  /** 別的技能的衍生數值：skill('名稱'.edns) */
  skillVars?: (name: string) => Record<string, number> | undefined;
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
    const two = src.slice(i, i + 2);
    if (['<=', '>=', '==', '!='].includes(two)) { out.push({ t: 'op', v: two }); i += 2; continue; }
    if ('+-*/%(),.<>?:'.includes(c)) { out.push({ t: 'op', v: c }); i++; continue; }
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
      // 遊戲表有一條字串缺右括號（Fire Wall）；只在運算式已到結尾時容忍，其餘仍視為語法錯誤
      if (t.v === '(') { const v = expr(); if (p >= toks.length) return v; need(')'); return v; }
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
        const pr = ctx.skillParams?.(n.v);
        const num = (k: number) => { const v = pr?.[k]; const x = typeof v === 'number' ? v : v === undefined || v === '' ? 0 : Number(v); if (Number.isNaN(x)) throw new CalcError(`技能 ${n.v} 的 par${k} 不是數字`); return x; };
        const pm = /^pa(?:r)?(\d+)$/.exec(f.v); if (pm) return num(Number(pm[1]));
        const sv = ctx.skillVars?.(n.v); if (sv && Object.prototype.hasOwnProperty.call(sv, f.v)) return sv[f.v];
        const fd = FN_DEFS[f.v]; if (fd) return evalCalc(fd, { ...ctx, params: pr ?? {}, lvl: sk.lvl, blvl: sk.blvl }); // 別的技能的 ln／dm：用那個技能的參數與等級
        throw new CalcError(`不支援的技能欄位 ${f.v}`);
      }
      if (id === 'stat') { // stat('屬性'.accr)：擁有者（玩家）的屬性值
        need('('); const n = toks[p++]; if (!n || n.t !== 'str') throw new CalcError('stat() 需要屬性名稱'); need('.');
        const f = toks[p++]; if (!f || f.t !== 'id' || f.v !== 'accr') throw new CalcError('stat() 只支援 accr');
        if (p < toks.length) need(')'); // 遊戲表有一條缺右括號（刀刃哨衛）；只在運算式已到結尾時容忍
        const v = ctx.stat?.(n.v); if (v === undefined) throw new CalcError(`沒有擁有者的屬性 ${n.v}`); return v;
      }
      if (ctx.vars && Object.prototype.hasOwnProperty.call(ctx.vars, id)) return ctx.vars[id];
      if (id === 'min' || id === 'max') { need('('); const a = expr(); need(','); const b = expr(); need(')'); return id === 'min' ? Math.min(a, b) : Math.max(a, b); }
      if (id === 'lvl') { if (ctx.lvl === undefined) throw new CalcError('缺少 lvl'); return ctx.lvl; }
      if (id === 'blvl') { if (ctx.blvl === undefined) throw new CalcError('缺少 blvl'); return ctx.blvl; }
      if (id === 'clvl') { if (ctx.clvl === undefined) throw new CalcError('缺少 clvl'); return ctx.clvl; }
      const fn = FN_DEFS[id]; // lnXY、dmXY：展開成遊戲定義的運算式，用同一組參數與等級求值
      if (fn) {
        if (ctx.lvl === undefined) throw new CalcError('缺少 lvl');
        return evalCalc(fn, ctx);
      }
      const m = /^pa(?:r)?(\d+)$/.exec(id); // pa10 是遊戲表對 par10 的簡寫（Hex Bane）；資料表裡沒填的參數格，遊戲讀成 0
      if (m) { const v = ctx.params[Number(m[1])]; const n = typeof v === 'number' ? v : v === undefined || v === '' ? 0 : Number(v); if (Number.isNaN(n)) throw new CalcError(`${id} 不是數字`); return n; }
      throw new CalcError(`不認得的識別字 ${id}`);
    }
    throw new CalcError('語法錯誤');
  }
  function unary(): number { return primary(); }
  function term(): number {
    let v = primary();
    for (;;) {
      if (eatOp('*')) v *= primary();
      else if (eatOp('/')) { const d = primary(); v = d === 0 ? 0 : Math.trunc(v / d); }
      else if (eatOp('%')) { const d = primary(); v = d === 0 ? 0 : v % d; }
      else return v;
    }
  }
  function sum(): number {
    let v = term();
    for (;;) {
      if (eatOp('+')) v += term();
      else if (eatOp('-')) v -= term();
      else return v;
    }
  }
  function cmp(): number {
    let v = sum();
    for (;;) {
      if (eatOp('<=')) v = v <= sum() ? 1 : 0;
      else if (eatOp('>=')) v = v >= sum() ? 1 : 0;
      else if (eatOp('<')) v = v < sum() ? 1 : 0;
      else if (eatOp('>')) v = v > sum() ? 1 : 0;
      else if (eatOp('==')) v = v === sum() ? 1 : 0;
      else if (eatOp('!=')) v = v !== sum() ? 1 : 0;
      else return v;
    }
  }
  function expr(): number {
    const c = cmp();
    if (!eatOp('?')) return c;
    const a = expr(); need(':'); const b = expr();
    return c !== 0 ? a : b;
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
