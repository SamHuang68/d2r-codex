import React, { useState } from 'react';
import { GearSlot, ItemRarity } from '../../types';
import { resolveItemImagePath } from '../../utils/itemImageResolver';
import { MagicArt, artBoxOf } from './MagicArt';

export interface ItemIconProps {
  /** 收藏等按鈕內使用 span，讓所有 HTML 容器保持 phrasing content。 */
  as?: 'div' | 'span';
  name?: string;
  nameEn?: string;
  baseItem?: string;
  slot?: GearSlot | string;
  rarity?: ItemRarity | 'unique' | 'set' | 'runeword' | 'rune' | 'charm' | 'gem' | 'prop' | 'rare' | 'magic' | 'crafted';
  runeNumber?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** natural：依高度縮放、寬度依原圖比例；fill：填滿父層（裝備欄位用），皆保留長寬比 */
  fit?: 'natural' | 'fill';
  className?: string;
  showBorder?: boolean;
  imageUrl?: string;
  /** true：沒有 imageUrl 時不用名稱關鍵字猜圖，直接顯示文字佔位（模擬器目錄用，避免錯圖） */
  noGuess?: boolean;
}

/**
 * 聖休亞瑞暗黑物品真實遊戲立繪圖片渲染元件
 * 採用遊戲原版真實提取物品貼圖（Sprites），結合復古像素銳化渲染與動態品質光暈
 */
export const ItemIcon: React.FC<ItemIconProps> = ({
  as: Container = 'div',
  name = '',
  nameEn = '',
  baseItem = '',
  slot = '',
  rarity = 'unique',
  runeNumber,
  size = 'md',
  fit = 'natural',
  className = '',
  showBorder = true,
  imageUrl,
  noGuess = false,
}) => {
  // 以「失敗／已平滑的圖片網址」記錄狀態：換圖時不需要 effect 重置，也不會在換圖的那一次 render 閃出舊的失敗狀態
  const [failedSrc, setFailedSrc] = useState('');
  const [smoothSrc, setSmoothSrc] = useState('');
  const n = `${name} ${nameEn} ${baseItem}`.toLowerCase();
  const envBase = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || './';
  const baseUrl = envBase.endsWith('/') ? envBase : `${envBase}/`;

  // 1. 決定尺寸（依高度，寬度依圖片原始比例，不拉伸）
  const heightMap: Record<string, number> = { xs: 36, sm: 56, md: 96, lg: 128, xl: 176 };
  const px = heightMap[size] ?? heightMap.md;

  // 2. 決定稀有度光暈色彩
  const getColors = () => {
    if (
      rarity === 'set' ||
      n.includes('套裝') ||
      n.includes('tal rasha') ||
      n.includes('immortal king') ||
      n.includes('natalya') ||
      n.includes('guillaume') ||
      n.includes('aldur') ||
      n.includes('trang-oul') ||
      n.includes('m\'avina') ||
      n.includes('griswold') ||
      n.includes('sigon')
    ) {
      return {
        border: 'border-emerald-500/60 hover:border-emerald-400',
        bg: 'bg-emerald-950/40',
        glow: 'shadow-emerald-950/40',
        accent: '#10b981',
      };
    }
    if (
      rarity === 'rune' ||
      runeNumber !== undefined ||
      n.includes('符文') ||
      n.includes('runeword') ||
      rarity === 'runeword'
    ) {
      return {
        border: 'border-amber-500/70 hover:border-amber-400',
        bg: 'bg-amber-950/40',
        glow: 'shadow-amber-950/40',
        accent: '#f59e0b',
      };
    }
    if (rarity === 'magic' || n.includes('魔法') || n.includes('藍色')) {
      return {
        border: 'border-sky-500/60 hover:border-sky-400',
        bg: 'bg-sky-950/40',
        glow: 'shadow-sky-950/40',
        accent: '#38bdf8',
      };
    }
    if (rarity === 'rare' || n.includes('亮金')) {
      return {
        border: 'border-yellow-400/70 hover:border-yellow-300',
        bg: 'bg-yellow-950/40',
        glow: 'shadow-yellow-950/40',
        accent: '#facc15',
      };
    }
    // 預設暗金 (Unique)
    return {
      border: 'border-amber-600/70 hover:border-d2-unique',
      bg: 'bg-stone-950/60',
      glow: 'shadow-amber-900/30',
      accent: '#c79b32',
    };
  };

  const colorConfig = getColors();

  // 3. 呼叫專屬模組解析真實遊戲立繪圖片路徑
  const imageSrc = noGuess && !(imageUrl && imageUrl.trim()) ? '' : resolveItemImagePath({
    name,
    nameEn,
    baseItem,
    slot,
    rarity,
    runeNumber,
    baseUrl,
    imageUrl,
  });

  const imgError = failedSrc === imageSrc;
  const smooth = smoothSrc === imageSrc;
  const setImgError = (_failed: boolean) => setFailedSrc(imageSrc);
  const setSmooth = (_on: boolean) => setSmoothSrc(imageSrc);

  // 只有 /img/items/magic/（暗金、套裝）的圖是 1:2（寬:高）畫布且底部帶有站名浮水印；
  // base/、misc/ 與本機圖都沒有浮水印，必須完整顯示（不裁切、保留長寬比）
  const isMagicRemote = /static\.d2r\.world\/img\/items\/magic\//.test(imageSrc);
  const isRemote = /^https?:/.test(imageSrc);
  const artBox = isMagicRemote ? artBoxOf(imageSrc) : undefined;
  const fill = fit === 'fill';
  const boxStyle: React.CSSProperties = fill
    ? {}
    : { height: px, minWidth: Math.round(px * 0.6), maxWidth: `min(100%, ${px}px)` };
  const alt = name || nameEn || 'Item';

  return (
    <Container
      className={`relative flex items-center justify-center rounded transition-all duration-200 select-none overflow-hidden ${
        fill ? 'w-full h-full' : 'shrink-0'
      } ${showBorder ? `border ${colorConfig.border} ${colorConfig.bg} ${colorConfig.glow} shadow-sm` : ''} ${className}`}
      style={boxStyle}
      title={alt}
    >
      <Container className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      {!imgError && imageSrc ? (
        isMagicRemote && artBox ? (
          <MagicArt src={imageSrc} alt={alt} box={artBox} fill={fill} onError={() => setImgError(true)} />
        ) : isMagicRemote ? (
          // 沒有預先算好的物品範圍（資料新增的圖）：完整顯示整張 1:2 畫布，底部以模糊遮罩淡化浮水印
          <Container className="block relative z-10 overflow-hidden max-w-full max-h-full" style={{ height: '100%', aspectRatio: '1 / 2' }}>
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
            <Container
              aria-hidden
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '31%',
                backdropFilter: 'blur(9px)',
                WebkitBackdropFilter: 'blur(9px)',
                background: 'linear-gradient(to bottom, transparent, rgba(8,6,4,.78))',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 22%)',
                maskImage: 'linear-gradient(to bottom, transparent, #000 22%)',
              }}
            />
          </Container>
        ) : (
          <img
            src={imageSrc}
            alt={alt}
            referrerPolicy={isRemote ? 'no-referrer' : undefined}
            onLoad={(e) => {
              // 小尺寸本機 sprite 放大超過 2.5 倍時改用平滑縮放，避免大面積馬賽克
              const el = e.currentTarget;
              if (!isRemote && !fill && el.naturalHeight > 0 && px / el.naturalHeight > 2.5) setSmooth(true);
            }}
            className={`relative z-10 object-contain p-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
              isRemote || smooth ? '' : '[image-rendering:pixelated]'
            } ${
              fill ? 'w-full h-full' : 'h-full w-auto max-w-full'
            }`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )
      ) : (
        <span className="relative z-10 font-bold font-serif text-amber-300/80 uppercase" style={{ fontSize: fill ? 11 : Math.max(10, px / 4) }}>
          <span aria-hidden>◇</span>
        </span>
      )}
    </Container>
  );
};
