import React from 'react';

/**
 * 清單頁標題的換行單位。較長的放前面，避免短詞先被吃掉。
 * 只保護會在窄螢幕被從中間切開、或單獨掉成一行的專名與詞組。
 */
const ATOMIC = [
  '符文之語',
  '符文語互聯',
  '符文語',
  '世界事件',
  '機制圖解',
  '估價指南',
  '攻略寶典',
  '矩陣模擬器',
  '煉金工坊',
  '赫拉迪姆',
  '裝備寶典',
  '暗金',
  '套裝',
  '世界',
  '終局',
  '寶典',
  '圖解',
  '指南',
  '攻略',
  '典藏',
  '互聯',
  '機制',
  '配裝',
  '矩陣',
  '模擬器',
  '工坊',
  '方塊',
];

const ATOMIC_RE = new RegExp(`(\\([^)]*\\))|(${ATOMIC.join('|')})`, 'g');

/** 不含中點、且不長的括號整組換行（例如「(Cube Recipes)」）。含 · 的長括號仍可在中點處換行。 */
function parentheticalShouldStayTogether(token: string): boolean {
  return !token.includes('·') && token.length <= 24;
}

function renderChunk(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = new RegExp(ATOMIC_RE.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('(')) {
      if (parentheticalShouldStayTogether(token)) {
        out.push(<span key={`${keyPrefix}-p-${i}`} className="whitespace-nowrap">{token}</span>);
      } else {
        out.push('(');
        out.push(...renderChunk(token.slice(1, -1), `${keyPrefix}-${i}`));
        out.push(')');
      }
    } else {
      out.push(<span key={`${keyPrefix}-a-${i}`} className="whitespace-nowrap">{token}</span>);
    }
    last = match.index + token.length;
    i += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * 中點黏在前一個詞後面（不斷在「·」前面），下一行從下一個詞開始。
 * 清單頁 H1／H2：專名不從字中間斷開。較長的 text-3xl 標題另加 text-balance。
 */
export const HeadingText: React.FC<{ text: string }> = ({ text }) => (
  <>{renderChunk(text.replace(/ · /g, '\u00A0· '), 'h')}</>
);
