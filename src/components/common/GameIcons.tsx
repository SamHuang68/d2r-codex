import React from 'react';
import { GAME_ICON_SHAPES, type GameIconName } from './gameIconPaths';
import { gameIconImageUrl } from './gameIconImages';

export interface GameIconProps {
  name: GameIconName;
  className?: string;
  /** true 時強制使用向量圖示（網站標誌等品牌用途）；預設優先顯示遊戲內圖樣 */
  vector?: boolean;
}

/**
 * 主題圖示：預設顯示對應的遊戲內圖樣（gameIconImages.ts），大小由 className 決定；
 * 沒有對應圖樣或指定 vector 時，顯示跟著文字色（currentColor）的向量圖示。
 */
export const GameIcon: React.FC<GameIconProps> = ({ name, className, vector }) => {
  const img = vector ? undefined : gameIconImageUrl(name);
  if (img) {
    return (
      <img
        src={img}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`object-contain shrink-0 ${className ?? ''}`}
      />
    );
  }
  const shape: { stroke: string[]; fill?: string[] } = GAME_ICON_SHAPES[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinejoin="miter"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {shape.stroke.map((d) => <path key={d} d={d} />)}
      {shape.fill?.map((d) => <path key={d} d={d} fill="currentColor" stroke="none" />)}
    </svg>
  );
};
