import React, { useMemo } from 'react';
import { getCatalog, GROUP_ZH, type Group } from '../../../engine/catalog';

interface Props {
  open: boolean;
  onOpen: (group?: Group) => void;
  onClose: () => void;
}

const GROUPS: Group[] = ['armor', 'weapon', 'jewelry'];

/** 「樹狀裝備庫」分頁：裝備庫改為浮動視窗（GearPicker），這裡只放入口與說明 */
export const GearTreeTab: React.FC<Props> = ({ open, onOpen, onClose }) => {
  const counts = useMemo(() => {
    const c: Record<Group, number> = { armor: 0, weapon: 0, jewelry: 0 };
    getCatalog().forEach((e) => { c[e.group] += 1; });
    return c;
  }, []);

  return (
    <div className="space-y-4">
      <div className="d2-sub">
        裝備庫改成浮動視窗：一次只顯示目前這一層（類別 → 強度 → 一般／職業專屬 → 物品），視窗固定在畫面上，不會被頁面捲走，隨時可以把物品拖到左側物品欄。開著它也能切到「屬性頁」，邊挑裝備邊看數值變化。
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="d2-btn" onClick={() => (open ? onClose() : onOpen())}>{open ? '關閉裝備庫視窗' : '開啟裝備庫視窗'}</button>
        <span className="d2-sub">{open ? '視窗已開啟（可拖曳標題移動、按 — 收合、Esc 關閉）' : '視窗目前關閉'}</span>
      </div>
      <div>
        <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>快速進入</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {GROUPS.map((g) => (
            <button key={g} type="button" className="d2-node" onClick={() => onOpen(g)}>
              <span>{GROUP_ZH[g]}</span><span className="n">{counts[g]} 項</span><span className="chev">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
