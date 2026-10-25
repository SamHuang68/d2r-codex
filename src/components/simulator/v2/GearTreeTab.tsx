import React, { useMemo } from 'react';
import { getCatalog, GROUP_ZH, type CatalogEntry, type Group } from '../../../engine/catalog';
import { CustomItemBuilder } from './CustomItemBuilder';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  open: boolean;
  onOpen: (group?: Group) => void;
  onClose: () => void;
  /** 自訂飾品用：目前等級（詞綴文字）、穿戴、提示訊息 */
  level: number;
  onEquip: (entry: CatalogEntry) => void;
  say: (m: string) => void;
}

const GROUPS: Group[] = ['armor', 'weapon', 'jewelry'];
const GROUP_EN: Record<Group, string> = { armor: 'Armor', weapon: 'Weapons', jewelry: 'Jewelry' };

/** 「樹狀裝備庫」分頁：裝備庫改為浮動視窗（GearPicker），這裡只放入口與說明 */
export const GearTreeTab: React.FC<Props> = ({ open, onOpen, onClose, level, onEquip, say }) => {
  const { isEn } = useLanguage();
  const counts = useMemo(() => {
    const c: Record<Group, number> = { armor: 0, weapon: 0, jewelry: 0 };
    getCatalog().forEach((e) => { c[e.group] += 1; });
    return c;
  }, []);

  return (
    <div className="space-y-4">
      <div className="d2-sub">
        {isEn ? "The Gear Library is a floating window: navigate categories, search, and drag items directly into your inventory slots on the left. You can switch to the Attributes tab while the library is open to preview stat changes in real-time." : "裝備庫改成浮動視窗：一次只顯示目前這一層（類別 → 強度 → 一般／職業專屬 → 物品），視窗固定在畫面上，不會被頁面捲走，隨時可以把物品拖到左側物品欄。開著它也能切到「屬性頁」，邊挑裝備邊看數值變化。"}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="d2-btn" onClick={() => (open ? onClose() : onOpen())}>{open ? (isEn ? 'Close Gear Library Window' : '關閉裝備庫視窗') : (isEn ? 'Open Gear Library Window' : '開啟裝備庫視窗')}</button>
        <span className="d2-sub">{open ? (isEn ? 'Window is open (drag title to move, — to minimize, Esc to close)' : '視窗已開啟（可拖曳標題移動、按 — 收合、Esc 關閉）') : (isEn ? 'Window is closed' : '視窗目前關閉')}</span>
      </div>
      <div>
        <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>{isEn ? "QUICK ACCESS" : "快速進入"}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {GROUPS.map((g) => (
            <button key={g} type="button" className="d2-node" onClick={() => onOpen(g)}>
              <span>{isEn ? GROUP_EN[g] : GROUP_ZH[g]}</span><span className="n">{counts[g]} {isEn ? "items" : "項"}</span><span className="chev">›</span>
            </button>
          ))}
        </div>
      </div>
      <CustomItemBuilder level={level} onEquip={onEquip} say={say} />
    </div>
  );
};
