import React from 'react';
import type { UnifiedGearItem, SpecialPropertyDef } from '../../utils/propertyFilter';
import { ItemIcon } from '../common/ItemIcon';

export interface CrossItemCardProps {
  item: UnifiedGearItem;
  activePropertyDefs?: SpecialPropertyDef[];
  onNavigateToBase?: (baseName: string) => void;
  onNavigateToRune?: (runeNumber: number) => void;
}

export const CrossItemCard: React.FC<CrossItemCardProps> = ({
  item,
  activePropertyDefs = [],
  onNavigateToBase,
  onNavigateToRune,
}) => {
  // 檢查某條屬性是否匹配任何目前已選取的特殊屬性
  const isAttrHighlighted = (attrText: string): boolean => {
    if (activePropertyDefs.length === 0) return false;
    return activePropertyDefs.some((def) => def.match(attrText));
  };

  // 1. 暗金裝備卡片 (Unique)
  if (item.rarity === 'unique') {
    return (
      <div className="bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-unique/60 rounded-xl p-4 sm:p-5 shadow-lg transition-all flex flex-col justify-between group">
        <div>
          {/* 標題列 */}
          <div className="flex items-start justify-between gap-3 border-b border-sanctuary-850 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <ItemIcon
                name={item.name}
                nameEn={item.nameEn}
                baseItem={item.baseItem}
                slot={item.slot as any}
                rarity="unique"
                size="md"
                imageUrl={item.imageUrl}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-diablo text-base font-bold text-d2-unique group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-mono">
                    暗金
                  </span>
                </div>
                <div className="text-xs text-sanctuary-400 font-mono italic">
                  {item.nameEn}
                  {item.nameClassic && item.nameClassic !== item.name && (
                    <span className="text-sanctuary-500 font-sans ml-1">
                      (舊譯: {item.nameClassic})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 標籤 Badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {item.isNewDLC && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-d2-fire/20 text-d2-fire border border-d2-fire/40 font-bold font-mono">
                  RotW DLC
                </span>
              )}
              {item.ladderOnly && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-medium">
                  天梯限定
                </span>
              )}
              {item.classOnly && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-sanctuary-900 text-d2-magic border border-d2-magic/30 font-medium">
                  {item.classOnly}專用
                </span>
              )}
            </div>
          </div>

          {/* 底材與需求等級 */}
          <div className="text-xs text-sanctuary-400 mb-3 flex items-center gap-2 flex-wrap font-medium">
            <span className="text-sanctuary-300 font-semibold">{item.slotLabel}</span>
            <span>•</span>
            {onNavigateToBase ? (
              <button
                type="button"
                onClick={() => onNavigateToBase(item.baseItem)}
                className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5"
                title={`查看【${item.baseItem}】底材資料`}
              >
                <span>{item.baseItem}</span>
                <span className="text-[9px] text-d2-socket">↗</span>
              </button>
            ) : (
              <span>{item.baseItem}</span>
            )}
            <span>•</span>
            <span>
              需求等級: <strong className="text-sanctuary-100">{item.requiredLevel}</strong>
            </span>
            {item.requiredStr ? (
              <span>力量: <strong className="text-sanctuary-200">{item.requiredStr}</strong></span>
            ) : null}
            {item.requiredDex ? (
              <span>敏捷: <strong className="text-sanctuary-200">{item.requiredDex}</strong></span>
            ) : null}
          </div>

          {/* 屬性清單 */}
          <div className="space-y-1 text-xs">
            {item.attributes.map((attr, idx) => {
              const highlighted = isAttrHighlighted(attr);
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-1.5 transition-colors ${
                    highlighted
                      ? 'text-amber-200 font-semibold bg-d2-unique/10 px-1.5 py-0.5 rounded border border-d2-unique/30'
                      : 'text-d2-magic'
                  }`}
                >
                  <span className={highlighted ? 'text-d2-unique' : 'text-sanctuary-500'}>
                    •
                  </span>
                  <span>{attr}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 2. 套裝配件卡片 (Set)
  if (item.rarity === 'set') {
    return (
      <div className="bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-set/60 rounded-xl p-4 sm:p-5 shadow-lg transition-all flex flex-col justify-between group">
        <div>
          {/* 標題列 */}
          <div className="flex items-start justify-between gap-3 border-b border-sanctuary-850 pb-3 mb-3">
            <div className="flex items-center gap-3">
              <ItemIcon
                name={item.name}
                nameEn={item.nameEn}
                baseItem={item.baseItem}
                slot={item.slot as any}
                rarity="set"
                size="md"
                imageUrl={item.imageUrl}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-diablo text-base font-bold text-d2-set group-hover:text-green-300 transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-d2-set/20 text-d2-set border border-d2-set/40 font-mono">
                    套裝配件
                  </span>
                </div>
                <div className="text-xs text-sanctuary-400 font-mono italic">
                  {item.nameEn}
                  {item.setName && (
                    <span className="text-d2-set/80 font-sans ml-1.5 font-medium">
                      [{item.setName}]
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 專用標籤 */}
            {item.classOnly && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-sanctuary-900 text-d2-set border border-d2-set/30 font-medium">
                {item.classOnly}專用
              </span>
            )}
          </div>

          {/* 底材與需求等級 */}
          <div className="text-xs text-sanctuary-400 mb-3 flex items-center gap-2 flex-wrap font-medium">
            <span className="text-sanctuary-300 font-semibold">{item.slotLabel}</span>
            <span>•</span>
            {onNavigateToBase ? (
              <button
                type="button"
                onClick={() => onNavigateToBase(item.baseItem)}
                className="hover:text-d2-socket hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5"
                title={`查看【${item.baseItem}】底材資料`}
              >
                <span>{item.baseItem}</span>
                <span className="text-[9px] text-d2-socket">↗</span>
              </button>
            ) : (
              <span>{item.baseItem}</span>
            )}
            <span>•</span>
            <span>
              需求等級: <strong className="text-sanctuary-100">{item.requiredLevel}</strong>
            </span>
            {item.requiredStr ? (
              <span>力量: <strong className="text-sanctuary-200">{item.requiredStr}</strong></span>
            ) : null}
            {item.requiredDex ? (
              <span>敏捷: <strong className="text-sanctuary-200">{item.requiredDex}</strong></span>
            ) : null}
          </div>

          {/* 屬性清單 */}
          <div className="space-y-1 text-xs">
            {item.attributes.map((attr, idx) => {
              const highlighted = isAttrHighlighted(attr);
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-1.5 transition-colors ${
                    highlighted
                      ? 'text-green-200 font-semibold bg-d2-set/10 px-1.5 py-0.5 rounded border border-d2-set/30'
                      : 'text-d2-magic'
                  }`}
                >
                  <span className={highlighted ? 'text-d2-set' : 'text-sanctuary-500'}>
                    •
                  </span>
                  <span>{attr}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. 符文之語卡片 (Runeword)
  return (
    <div className="bg-sanctuary-950 border border-sanctuary-800 hover:border-d2-rune/60 rounded-xl p-4 sm:p-5 shadow-lg transition-all flex flex-col justify-between group">
      <div>
        {/* 標題列 */}
        <div className="flex items-start justify-between gap-3 border-b border-sanctuary-850 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <ItemIcon
              name={item.name}
              nameEn={item.nameEn}
              slot={item.slot === 'multiple' ? 'weapon' : (item.slot as any)}
              rarity="unique"
              size="md"
              imageUrl={item.imageUrl}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-diablo text-base font-bold text-d2-unique group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-d2-rune/20 text-d2-rune border border-d2-rune/40 font-mono font-semibold">
                  符文之語 ({item.sockets} 孔)
                </span>
              </div>
              <div className="text-xs text-sanctuary-400 font-mono italic">
                {item.nameEn}
                {item.nameClassic && item.nameClassic !== item.name && (
                  <span className="text-sanctuary-500 font-sans ml-1">
                    (舊譯: {item.nameClassic})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 標籤 Badge */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            {item.isNewDLC && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-d2-fire/20 text-d2-fire border border-d2-fire/40 font-bold font-mono">
                RotW DLC
              </span>
            )}
            {item.ladderOnly && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-d2-unique/20 text-d2-unique border border-d2-unique/40 font-medium">
                天梯限定
              </span>
            )}
          </div>
        </div>

        {/* 底材需求與適用槽位 */}
        <div className="text-xs text-sanctuary-400 mb-2 flex items-center gap-2 flex-wrap font-medium">
          <span className="text-d2-rune font-semibold">{item.slotLabel}</span>
          <span>•</span>
          <span>
            需求等級: <strong className="text-sanctuary-100">{item.requiredLevel}</strong>
          </span>
          <span>•</span>
          <span className="text-sanctuary-300">適用底材: {item.baseItem}</span>
        </div>

        {/* 符文鑲嵌清單 */}
        {item.runes && item.runeNumbers && (
          <div className="py-2.5 mb-3 flex items-center gap-1.5 flex-wrap border-y border-sanctuary-850/60">
            <span className="text-[11px] text-sanctuary-400 font-medium mr-1">鑲嵌順序:</span>
            {item.runes.map((runeName, i) => {
              const runeNum = item.runeNumbers?.[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => runeNum && onNavigateToRune?.(runeNum)}
                  className="px-2 py-1 rounded bg-d2-rune/10 hover:bg-d2-rune/20 border border-d2-rune/30 hover:border-d2-rune text-[11px] font-mono text-d2-rune hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  title={runeNum ? `查看 ${runeNum}# 符文` : undefined}
                >
                  <span className="font-bold">{runeNum}#</span>
                  <span>{runeName}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 屬性清單 */}
        <div className="space-y-1 text-xs">
          {item.attributes.map((attr, idx) => {
            const highlighted = isAttrHighlighted(attr);
            return (
              <div
                key={idx}
                className={`flex items-start gap-1.5 transition-colors ${
                  highlighted
                    ? 'text-amber-200 font-semibold bg-d2-unique/10 px-1.5 py-0.5 rounded border border-d2-unique/30'
                    : 'text-d2-magic'
                }`}
              >
                <span className={highlighted ? 'text-d2-unique' : 'text-sanctuary-500'}>
                  •
                </span>
                <span>{attr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
