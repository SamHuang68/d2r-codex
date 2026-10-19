import React from 'react';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  right?: React.ReactNode;
  tone?: string;
}

/** 各分頁統一標題列 */
export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, desc, right, tone = 'text-d2-unique' }) => (
  <div className="mb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
    <div className="min-w-0">
      <h2 className={`font-diablo text-2xl sm:text-3xl font-bold flex items-center gap-2 ${tone}`}>
        {icon}
        <span>{title}</span>
      </h2>
      {desc && <p className="text-xs sm:text-sm text-sanctuary-400 mt-1 max-w-3xl">{desc}</p>}
    </div>
    {right}
  </div>
);
