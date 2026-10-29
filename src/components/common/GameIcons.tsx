import React from 'react';
import { GAME_ICON_SHAPES, type GameIconName } from './gameIconPaths';

export interface GameIconProps {
  name: GameIconName;
  className?: string;
}

/** 原創的遊戲風格圖示：顏色跟著文字色（currentColor），大小由 className 決定，和 lucide 圖示的用法相同。 */
export const GameIcon: React.FC<GameIconProps> = ({ name, className }) => {
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
