import React from 'react';

export const FactGrid: React.FC<{ rows: { label: string; value: string }[]; accent?: string }> = ({ rows, accent = 'text-d2-unique/80' }) => {
  const shown = rows.filter((row) => row.value.trim());
  if (!shown.length) return null;
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {shown.map((row) => (
        <div key={row.label} className="min-w-0 rounded-lg border border-sanctuary-800 bg-sanctuary-950/80 px-3 py-2">
          {/* 標籤固定一行（窄格以 ellipsis 截斷，title 顯示全文）；數值維持 14px 可換行，但不在詞中間斷 */}
          <dt className={`text-[11px] tracking-wide truncate ${accent}`} title={row.label}>{row.label}</dt>
          <dd className="text-sm text-sanctuary-100 font-medium break-words [text-wrap:pretty] tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export interface RelatedLink {
  key: string;
  href: string;
  label: string;
  tone: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** 單品頁的相關連結。沒有資料就不渲染。 */
export const RelatedLinks: React.FC<{ title: string; links: RelatedLink[] }> = ({ title, links }) => {
  if (!links.length) return null;
  return (
    <div>
      <h2 className="text-xs font-semibold text-sanctuary-300 mb-1.5">{title}</h2>
      <ul className="flex flex-wrap gap-1.5">
        {links.map((link) => (
          <li key={link.key} className="max-w-full min-w-0">
            <a
              href={link.href}
              onClick={link.onClick}
              title={link.label}
              className={`inline-flex items-center max-w-full min-h-11 px-3 rounded-lg border border-sanctuary-700 bg-sanctuary-900/80 text-sm hover:bg-sanctuary-800 hover:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold ${link.tone}`}
            >
              {/* 連結名稱為一個單位，不在詞中間斷；過長時 ellipsis（title 顯示全文） */}
              <span className="min-w-0 truncate whitespace-nowrap">{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
