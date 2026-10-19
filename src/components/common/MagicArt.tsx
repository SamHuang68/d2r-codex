import React, { useEffect, useId, useRef, useState } from 'react';
import boxes from '../../data/magicArtBox.json';

/**
 * 暗金／套裝圖（static.d2r.world/img/items/magic/）的裁切與浮水印處理。
 *
 * 這些圖是 1:2 的畫布（196×392 或 98×196），物品只佔其中一部分，底部 77%～93% 帶有站名浮水印。
 * 離線以「同尺寸畫布的逐像素中位數」估出背景加浮水印，再從原圖扣掉它，得到每張圖物品的實際範圍
 * （src/data/magicArtBox.json，正規化座標 [x0, y0, x1, y1]，已含 2% 邊距）。
 *
 * 渲染時用 SVG viewBox 裁到該範圍，並以 preserveAspectRatio="meet" 置中縮放到容器內：
 * 任何容器（窄槽位、寬形腰帶、卡片）都不變形、物品盡量放大。
 * 只有物品本身延伸進浮水印區帶時（長柄、弓、盾…），才對該區帶做模糊＋變暗，不再硬裁掉下端。
 */
type Box = [number, number, number, number];
const BOXES = boxes as unknown as Record<string, Box>;
const CW = 196;
const CH = 392;
/** 浮水印區帶起點（實測約 76.8%，保守取 74%） */
const WM_TOP = 0.74;

export const artBoxOf = (src: string): Box | undefined => BOXES[src.slice(src.lastIndexOf('/') + 1)];

/** SVG <image> 沒有 loading="lazy"，改用 IntersectionObserver，避免長清單（如聖杯 537 列）一次載入全部圖 */
function useSeen<T extends Element>(ref: React.RefObject<T>, rootMargin = '240px'): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, ref, rootMargin]);
  return seen;
}

interface Props {
  src: string;
  alt: string;
  box: Box;
  /** 填滿容器（裝備欄、清單格）或依高度自然寬度（卡片） */
  fill: boolean;
  onError: () => void;
}

export const MagicArt: React.FC<Props> = ({ src, alt, box, fill, onError }) => {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useSeen(ref);
  const uid = useId().replace(/:/g, '');
  const [nx0, ny0, nx1, ny1] = box;
  const x = nx0 * CW; const y = ny0 * CH; const w = (nx1 - nx0) * CW; const h = (ny1 - ny0) * CH;
  const band = ny1 > WM_TOP;
  const by = Math.max(y, WM_TOP * CH); const bh = y + h - by;

  return (
    <svg
      ref={ref}
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={alt}
      className={`relative z-10 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${fill ? 'w-full h-full' : 'h-full w-auto max-w-full'}`}
    >
      <defs>
        <clipPath id={`c${uid}`}><rect x={x} y={y} width={w} height={h} /></clipPath>
        {band && (
          <>
            <filter id={`f${uid}`} x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="8" /></filter>
            <linearGradient id={`d${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#080604" stopOpacity="0" />
              <stop offset="1" stopColor="#080604" stopOpacity=".8" />
            </linearGradient>
            <linearGradient id={`m${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" />
              <stop offset=".3" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
            <mask id={`k${uid}`} maskUnits="userSpaceOnUse" x={x} y={by} width={w} height={bh}>
              <rect x={x} y={by} width={w} height={bh} fill={`url(#m${uid})`} />
            </mask>
          </>
        )}
      </defs>
      {seen && (
        <g clipPath={`url(#c${uid})`}>
          <image href={src} x={0} y={0} width={CW} height={CH} preserveAspectRatio="none" onError={onError} />
          {band && (
            <g mask={`url(#k${uid})`}>
              <image href={src} x={0} y={0} width={CW} height={CH} preserveAspectRatio="none" filter={`url(#f${uid})`} />
              <rect x={x} y={by} width={w} height={bh} fill={`url(#d${uid})`} />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};
