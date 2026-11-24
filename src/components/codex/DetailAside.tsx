import React from 'react';

export const FactGrid: React.FC<{ rows: { label: string; value: string }[]; accent?: string }> = ({ rows, accent = 'text-d2-unique/80' }) => {
  const shown = rows.filter((row) => row.value.trim());
  if (!shown.length) return null;
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {shown.map((row) => (
        <div key={row.label} className="rounded-lg border border-sanctuary-800 bg-sanctuary-950/80 px-3 py-2">
          <dt className={`text-[11px] tracking-wide ${accent}`}>{row.label}</dt>
          <dd className="text-sm text-sanctuary-100 font-medium break-words tabular-nums">{row.value}</dd>
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
          <li key={link.key}>
            <a
              href={link.href}
              onClick={link.onClick}
              className={`inline-flex items-center min-h-11 px-3 rounded-lg border border-sanctuary-700 bg-sanctuary-900/80 text-sm hover:bg-sanctuary-800 hover:border-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-d2-gold ${link.tone}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
