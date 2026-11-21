import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface GearSummaryLinksProps {
  /** 以「 + 」與「/」串接的代表性配裝文字（例如「橡樹之心 + 謎團 + 撒卡蘭姆使者/精神盾」） */
  gearSummary: string;
  /** 點擊任一裝備名稱時的導覽回呼 */
  onSelect?: (itemName: string) => void;
  /** 連結文字樣式類別 */
  linkClassName?: string;
}

/**
 * 將流派配裝摘要（gearSummary）安全拆分成可點擊的裝備／符文組／底材超連結。
 * 僅以兩側含空白的「 + 」拆分，避免誤切「(+3陷阱)」或「Dual +3 Trap」內的加號。
 */
export const GearSummaryLinks: React.FC<GearSummaryLinksProps> = ({
  gearSummary,
  onSelect,
  linkClassName = 'hover:underline hover:text-amber-300 cursor-pointer',
}) => {
  const { isEn } = useLanguage();
  const parts = gearSummary.split(/\s+\+\s+/);

  return (
    <>
      {parts.map((gearItem, gIdx) => {
        const cleanItem = gearItem.trim();
        const subItems = cleanItem.includes('/') ? cleanItem.split('/') : [cleanItem];
        return (
          <React.Fragment key={gIdx}>
            {subItems.map((sub, sIdx) => {
              const trimmedSub = sub.trim();
              return (
                <React.Fragment key={sIdx}>
                  {onSelect ? (
                    <button
                      type="button"
                      onClick={() => onSelect(trimmedSub)}
                      className={linkClassName}
                      title={isEn ? `Search gear "${trimmedSub}"` : `前往查詢【${trimmedSub}】`}
                    >
                      {trimmedSub}
                    </button>
                  ) : (
                    <span>{trimmedSub}</span>
                  )}
                  {sIdx < subItems.length - 1 && <span className="text-sanctuary-400 mx-0.5">/</span>}
                </React.Fragment>
              );
            })}
            {gIdx < parts.length - 1 && <span className="text-sanctuary-500 mx-1">+</span>}
          </React.Fragment>
        );
      })}
    </>
  );
};
