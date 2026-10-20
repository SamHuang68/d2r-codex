import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, ListTree, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { TreeNode, pathTo } from '../../utils/equipTaxonomy';

export type IndexTone = 'unique' | 'set' | 'rune' | 'socket' | 'magic';

const TONE: Record<IndexTone, { text: string; bar: string; bg: string }> = {
  unique: { text: 'text-d2-unique', bar: 'border-d2-unique', bg: 'bg-d2-unique/10' },
  set: { text: 'text-d2-set', bar: 'border-d2-set', bg: 'bg-d2-set/10' },
  rune: { text: 'text-d2-rune', bar: 'border-d2-rune', bg: 'bg-d2-rune/10' },
  socket: { text: 'text-d2-socket', bar: 'border-d2-socket', bg: 'bg-d2-socket/10' },
  magic: { text: 'text-d2-magic', bar: 'border-d2-magic', bg: 'bg-d2-magic/10' },
};

interface TreeIndexProps {
  /** 索引標題，例如「裝備索引」 */
  title: string;
  /** 虛擬根（全部）的名稱與數量 */
  rootLabel: string;
  rootCount: number;
  nodes: TreeNode[];
  activeId: string;
  onSelect: (id: string) => void;
  tone?: IndexTone;
  children: React.ReactNode;
  contentId?: string;
  /** first：第一層預設展開（預設）；none：全部收合，只展開目前選取節點的路徑 */
  initialOpen?: 'first' | 'none';
}

/** 目前選取節點的麵包屑（含根） */
export const crumbsOf = (rootLabel: string, nodes: TreeNode[], activeId: string): { id: string; label: string }[] => [
  { id: 'all', label: rootLabel },
  ...pathTo(nodes, activeId).map((n) => ({ id: n.id, label: n.label })),
];

const collectParents = (nodes: TreeNode[], out: string[] = []): string[] => {
  for (const n of nodes) if (n.children) { out.push(n.id); collectParents(n.children, out); }
  return out;
};

/**
 * 樹狀索引 + 內容區的雙欄版型：
 * 桌機左側為可捲動的固定索引，行動版收成一顆「分類索引」按鈕，點開後選取即自動收起。
 */
export const TreeIndex: React.FC<TreeIndexProps> = ({
  title, rootLabel, rootCount, nodes, activeId, onSelect, tone = 'unique', children, contentId = 'tree-content', initialOpen = 'first',
}) => {
  const t = TONE[tone];
  const allParents = useMemo(() => collectParents(nodes), [nodes]);
  // 預設只展開第一層，其餘由使用者或選取節點時帶開
  const [open, setOpen] = useState<Set<string>>(() => new Set(initialOpen === 'first' ? nodes.map((n) => n.id) : []));
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  // 選取（或由外部改變）節點時，確保它自己與祖先都展開（只在選取改變時，不會因搜尋重算數量而把使用者收合的節點又打開）
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  useEffect(() => {
    const trail = pathTo(nodesRef.current, activeId).map((n) => n.id);
    if (trail.length === 0) return;
    setOpen((prev) => {
      if (trail.every((id) => prev.has(id))) return prev;
      const next = new Set(prev);
      trail.forEach((id) => next.add(id));
      return next;
    });
  }, [activeId]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  // 點到的控制項被換掉或收起（磚、麵包屑、目錄項目、手機索引）時，焦點會掉到 body；把它交給內容區，鍵盤使用者 Tab 才不會從頁首重來
  const restoreFocus = () => {
    if (typeof document === 'undefined') return;
    const a = document.activeElement as HTMLElement | null;
    if (!a || a === document.body || !a.isConnected || a.offsetParent === null) contentRef.current?.focus({ preventScroll: true });
  };

  const select = (id: string) => {
    onSelect(id);
    setMobileOpen(false);
    requestAnimationFrame(restoreFocus);
  };

  // 選取節點改變（含從磚、麵包屑、目錄跳過來）時，把索引面板捲到目前節點，避免「你在這裡」落在可視範圍外
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      const box = asideRef.current;
      const row = box?.querySelector<HTMLElement>('[role=tree] [aria-current="true"]');
      if (!box || !row || box.scrollHeight <= box.clientHeight) return;
      const b = box.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      if (r.top < b.top) box.scrollTop -= b.top - r.top + 8;
      else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom + 8;
    }));
    return () => cancelAnimationFrame(raf);
  }, [activeId]);

  // 節點改變時（不論從索引、麵包屑、分類磚或目錄點的），若內容區頂端已捲出畫面就帶回來，免得停在上一頁的中段
  const lastActive = useRef(activeId);
  useEffect(() => {
    if (lastActive.current === activeId) return;
    lastActive.current = activeId;
    const el = contentRef.current;
    if (!el || typeof window === 'undefined') return;
    const top = el.getBoundingClientRect().top;
    if (top < 70) window.scrollTo({ top: Math.max(0, window.scrollY + top - 70), behavior: 'auto' });
    restoreFocus();
  }, [activeId]);

  const crumbs = crumbsOf(rootLabel, nodes, activeId);

  // 根（全部）是 level 1 的 treeitem，其下第一層為 level 2；每一層都包在 role=group 裡，符合 ARIA tree 的結構
  const renderNodes = (list: TreeNode[], depth: number): React.ReactNode => (
    <ul role="group" className="space-y-px">
      {list.map((n) => {
        const hasKids = !!n.children?.length;
        const expanded = hasKids && open.has(n.id);
        const active = activeId === n.id;
        const dim = n.count === 0;
        return (
          <li key={n.id} role="treeitem" aria-level={depth + 1} aria-expanded={hasKids ? expanded : undefined} aria-selected={active}>
            <div
              className={`flex items-stretch rounded-md border-l-2 ${active ? `${t.bar} ${t.bg}` : 'border-transparent hover:bg-sanctuary-800/60'} ${dim ? 'opacity-50' : ''}`}
              style={{ paddingLeft: (depth - 1) * 12 }}
            >
              {hasKids ? (
                <button
                  type="button"
                  onClick={() => toggle(n.id)}
                  aria-label={`${expanded ? '收合' : '展開'}${n.label}`}
                  className="w-6 shrink-0 flex items-center justify-center text-sanctuary-500 hover:text-sanctuary-200"
                >
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <span className="w-6 shrink-0 flex items-center justify-center text-sanctuary-700" aria-hidden>
                  <span className="w-1 h-1 rounded-full bg-current" />
                </span>
              )}
              <button
                type="button"
                onClick={() => select(n.id)}
                aria-current={active ? 'true' : undefined}
                title={n.en ? `${n.label}（${n.en}）` : n.label}
                className={`flex-1 min-w-0 flex items-center justify-between gap-2 py-1.5 pr-2 text-left text-[13px] ${
                  active ? `${t.text} font-bold` : depth === 1 ? 'text-sanctuary-100 font-semibold' : 'text-sanctuary-300 hover:text-sanctuary-100'
                }`}
              >
                <span className="truncate">{n.label}</span>
                <span className={`shrink-0 text-[11px] font-mono tabular-nums ${active ? t.text : 'text-sanctuary-400'}`}>{n.count}</span>
              </button>
            </div>
            {expanded && n.children && renderNodes(n.children, depth + 1)}
          </li>
        );
      })}
    </ul>
  );

  const panel = (
    <div className="rounded-xl border border-sanctuary-800 bg-sanctuary-950/80">
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-sanctuary-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sanctuary-200">
          <ListTree className={`w-3.5 h-3.5 ${t.text}`} />
          {title}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setOpen(new Set(allParents))}
            aria-label="全部展開"
            title="全部展開"
            className="p-1 rounded text-sanctuary-400 hover:text-sanctuary-100 hover:bg-sanctuary-800"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const trail = pathTo(nodes, activeId).map((n) => n.id);
              setOpen(new Set(trail.length ? trail : initialOpen === 'first' ? nodes.map((n) => n.id) : []));
            }}
            aria-label="全部收合"
            title="全部收合（只保留目前位置）"
            className="p-1 rounded text-sanctuary-400 hover:text-sanctuary-100 hover:bg-sanctuary-800"
          >
            <ChevronsDownUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <ul role="tree" aria-label={title} className="p-1.5">
        <li role="treeitem" aria-level={1} aria-expanded aria-selected={activeId === 'all'}>
          <button
            type="button"
            onClick={() => select('all')}
            aria-current={activeId === 'all' ? 'true' : undefined}
            className={`w-full flex items-center justify-between gap-2 rounded-md border-l-2 px-2 py-1.5 mb-1 text-left text-[13px] ${
              activeId === 'all' ? `${t.bar} ${t.bg} ${t.text} font-bold` : 'border-transparent text-sanctuary-100 font-semibold hover:bg-sanctuary-800/60'
            }`}
          >
            <span className="truncate">{rootLabel}</span>
            <span className={`shrink-0 text-[11px] font-mono tabular-nums ${activeId === 'all' ? t.text : 'text-sanctuary-400'}`}>{rootCount}</span>
          </button>
          {renderNodes(nodes, 1)}
        </li>
      </ul>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-6 items-start">
      <aside ref={asideRef} aria-label={title} className="mb-4 lg:mb-0 lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto no-scrollbar">
        {/* 行動版：收合成一顆按鈕，顯示目前所在位置 */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          className="lg:hidden w-full flex items-center justify-between gap-2 rounded-xl border border-sanctuary-700 bg-sanctuary-900 px-3.5 py-2.5 text-left"
        >
          <span className="flex items-center gap-2 min-w-0">
            <ListTree className={`w-4 h-4 shrink-0 ${t.text}`} />
            <span className="text-xs text-sanctuary-400 shrink-0">{title}</span>
            <span className="text-sm text-sanctuary-100 font-medium truncate">{crumbs.map((c) => c.label).join(' › ')}</span>
          </span>
          <ChevronRight className={`w-4 h-4 shrink-0 text-sanctuary-400 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
        </button>
        <div className={`${mobileOpen ? 'block mt-2' : 'hidden'} lg:block`}>{panel}</div>
      </aside>
      <div id={contentId} ref={contentRef} tabIndex={-1} className="min-w-0 scroll-mt-16 outline-none">{children}</div>
    </div>
  );
};

/** 內容區的麵包屑：每一層都可點回上一層 */
export const Crumbs: React.FC<{ crumbs: { id: string; label: string }[]; onSelect: (id: string) => void; tone?: IndexTone }> = ({
  crumbs, onSelect, tone = 'unique',
}) => (
  <nav aria-label="目前位置" className="flex flex-wrap items-center gap-1 text-xs text-sanctuary-400">
    {crumbs.map((c, i) => {
      const last = i === crumbs.length - 1;
      return (
        <React.Fragment key={c.id}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-sanctuary-600" aria-hidden />}
          {last ? (
            <span className={`font-bold ${TONE[tone].text}`} aria-current="page">{c.label}</span>
          ) : (
            <button type="button" onClick={() => onSelect(c.id)} className="hover:text-sanctuary-100 hover:underline">{c.label}</button>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

/** 分段標題：標題 + 數量 + 可選的「查看全部」 */
export const SectionHead: React.FC<{
  id?: string;
  title: string;
  sub?: string;
  count: number;
  shown?: number;
  tone?: IndexTone;
  level?: 2 | 3;
  /** 實際輸出的標題標籤；預設分段標題為 h3、子段為 h4（頁面標題為 h2 的頁面）。頁面標題是 h1 時改傳 h2／h3 */
  tag?: 'h2' | 'h3' | 'h4';
  onOpen?: () => void;
  openLabel?: string;
}> = ({ id, title, sub, count, shown, tone = 'unique', level = 2, tag, onOpen, openLabel = '查看全部' }) => {
  const Tag = tag ?? ((level === 2 ? 'h3' : 'h4') as 'h3' | 'h4');
  return (
    <div id={id} className={`flex items-baseline justify-between gap-3 border-b border-sanctuary-800 pb-1.5 mb-3 scroll-mt-20`}>
      <Tag className={`font-diablo font-bold min-w-0 ${level === 2 ? 'text-lg' : 'text-base'} ${TONE[tone].text}`}>
        {title}
        {sub && <span className="ml-2 text-[11px] font-mono font-normal text-sanctuary-400">{sub}</span>}
        <span className="ml-2 text-xs font-mono font-normal text-sanctuary-400">
          {shown !== undefined && shown < count ? `${shown} / ${count}` : count}
        </span>
      </Tag>
      {onOpen && (
        <button type="button" onClick={onOpen} className="shrink-0 text-xs text-sanctuary-300 hover:text-white hover:underline">
          {openLabel} →
        </button>
      )}
    </div>
  );
};

// ------------------------------------------------------------
// 目錄／詳細兩種顯示方式（上層節點預設看目錄，葉節點永遠看詳細）
// ------------------------------------------------------------

export type ViewMode = 'auto' | 'dir' | 'detail';
/** 節點內件數超過這個數字，上層節點預設改看目錄（只列名稱與小圖），避免一次攤開上百張大卡 */
export const DIR_THRESHOLD = 48;

/**
 * 管理目錄／詳細切換，以及「從目錄點某一件 → 進入該分類並捲到那一張卡、短暫標示」的流程。
 * resetKey：任何會讓顯示方式回到預設的條件（例如搜尋字串）。
 */
export function useDirectory(sel: string, resetKey = '') {
  // 顯示方式記下「是在哪個節點／條件下選的」；換節點或條件時直接在 render 當下回到 auto，
  // 不會先用舊的「詳細」模式把新節點的幾百張卡畫出來再重畫一次
  const [choice, setChoice] = useState<{ key: string; view: ViewMode }>({ key: '', view: 'auto' });
  const key = `${sel}|${resetKey}`;
  const view: ViewMode = choice.key === key ? choice.view : 'auto';
  const setView = (v: ViewMode) => setChoice({ key, view: v });
  const [flash, setFlash] = useState('');
  const pending = useRef('');

  useEffect(() => {
    const id = pending.current;
    if (!id) return;
    pending.current = '';
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFlash(id);
    });
    return () => cancelAnimationFrame(raf);
  }, [sel]);
  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(''), 1800);
    return () => window.clearTimeout(t);
  }, [flash]);

  return {
    view,
    setView,
    flash,
    /** 設定進入分類後要捲到的卡片 id，然後切換分類 */
    jump: (anchorId: string, leafId: string, go: (id: string) => void) => { pending.current = anchorId; go(leafId); },
    isDir: (isLeaf: boolean, total: number) => !isLeaf && (view === 'dir' || (view === 'auto' && total > DIR_THRESHOLD)),
  };
}

export const ViewToggle: React.FC<{ dir: boolean; onChange: (v: 'dir' | 'detail') => void }> = ({ dir, onChange }) => (
  <div className="inline-flex rounded-lg border border-sanctuary-700 bg-sanctuary-900 p-0.5 text-xs" role="group" aria-label="顯示方式">
    {([['dir', '目錄'], ['detail', '詳細']] as const).map(([k, label]) => {
      const on = (dir ? 'dir' : 'detail') === k;
      return (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          aria-pressed={on}
          className={`px-3 py-1 rounded-md ${on ? 'bg-sanctuary-700 text-sanctuary-100 font-bold' : 'text-sanctuary-400 hover:text-sanctuary-100'}`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

/** 目錄模式的一個項目：小圖 + 名稱 + 一行重點，整格可點 */
export const DirChip: React.FC<{
  icon: React.ReactNode;
  title: string;
  sub?: string;
  tone?: IndexTone;
  hint?: string;
  onClick: () => void;
}> = ({ icon, title, sub, tone = 'unique', hint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={hint ?? title}
    className={`group flex items-center gap-2.5 p-2 rounded-lg bg-sanctuary-900/60 border border-sanctuary-800 text-left min-w-0 ${
      tone === 'set' ? 'hover:border-d2-set/70' : tone === 'rune' ? 'hover:border-d2-rune/70' : tone === 'socket' ? 'hover:border-d2-socket/70' : 'hover:border-d2-unique/70'
    }`}
  >
    {icon}
    <span className="min-w-0">
      <span className={`block font-diablo font-bold text-sm truncate ${TONE[tone].text}`}>{title}</span>
      {sub && <span className="block text-[11px] text-sanctuary-400 truncate">{sub}</span>}
    </span>
  </button>
);
