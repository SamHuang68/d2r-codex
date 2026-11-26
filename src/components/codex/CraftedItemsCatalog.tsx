import React, { useEffect, useMemo, useState } from 'react';
import { Calculator, Search, Sparkles, X } from 'lucide-react';
import {
  CRAFT_FAMILIES,
  CRAFT_SLOTS,
  affixRollChances,
  calcCraftedIlvl,
  getAllCraftedRecipes,
  type CraftFamilyId,
  type CraftSlotId,
} from '../../data/codex/craftedItems';
import { useLanguage } from '../../context/LanguageContext';

export interface CraftedItemsCatalogProps {
  onNavigateToRune?: (runeNumber: number) => void;
  /** 從全站搜尋帶進來的手工裝名稱：預先填入大全的搜尋框 */
  initialQuery?: string;
}

const FAMILY_META = new Map(CRAFT_FAMILIES.map((f) => [f.id, f]));

/**
 * 完整手工合成物品大全（4 大系列 × 9 部位 = 36 條完整配方）
 * 全部底材名稱、符文、寶石與固定數值皆由遊戲資料表 cube.json / bases.json / gems.json 動態產生。
 */
export const CraftedItemsCatalog: React.FC<CraftedItemsCatalogProps> = ({ onNavigateToRune, initialQuery }) => {
  const { t, isEn } = useLanguage();
  const allRecipes = useMemo(() => getAllCraftedRecipes(), []);

  const [family, setFamily] = useState<'all' | CraftFamilyId>('all');
  const [slot, setSlot] = useState<'all' | CraftSlotId>('all');
  const [onlyMeta, setOnlyMeta] = useState(false);
  const [query, setQuery] = useState(initialQuery ?? '');
  // 搜尋帶入另一件手工裝時更新搜尋框（並清掉會把它濾掉的篩選）
  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
    setFamily('all');
    setSlot('all');
    setOnlyMeta(false);
  }, [initialQuery]);

  // 互動式手工 ilvl 計算器
  const [clvl, setClvl] = useState(93);
  const [inputIlvl, setInputIlvl] = useState(88);
  const craftedIlvl = calcCraftedIlvl(clvl, inputIlvl);
  const rollInfo = affixRollChances(craftedIlvl);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRecipes.filter((r) => {
      if (family !== 'all' && r.family !== family) return false;
      if (slot !== 'all' && r.slot !== slot) return false;
      if (onlyMeta && !r.highlight) return false;
      if (q) {
        const hay = [
          r.name,
          r.nameEn,
          r.runeName,
          r.runeNameEn,
          r.gemName,
          r.gemNameEn,
          ...r.bases,
          ...r.basesEn,
          ...r.fixedMods,
          ...r.fixedModsEn,
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allRecipes, family, slot, onlyMeta, query]);

  const metaCount = useMemo(() => allRecipes.filter((r) => Boolean(r.highlight)).length, [allRecipes]);

  return (
    <section
      id="crafted-compendium"
      aria-label={t('手工合成物品完整 36 配方', 'Complete 36 Crafted Item Recipes')}
      className="rounded-3xl bg-sanctuary-950/90 border border-orange-500/30 p-5 sm:p-6 shadow-2xl space-y-6"
    >
      {/* 標題列 */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-sanctuary-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{t('橙色手工藝品全典藏（4 大系列 × 9 部位）', 'Complete Crafted Items Compendium (4 Families × 9 Slots)')}</span>
          </div>
          <h3 className="font-diablo text-xl sm:text-2xl font-bold text-orange-300">
            {t('手工合成物品全 36 條配方與 ilvl 機制', 'All 36 Crafted Recipes & ilvl Mechanics')}
          </h3>
          <p className="text-xs text-sanctuary-400 max-w-3xl leading-relaxed">
            {t(
              '投入「指定魔法（藍）底材 ＋ 對應符文 ＋ 對應完美寶石 ＋ 任意珠寶」即可合成橙色手工裝。一般、進階與菁英三階底材皆可合成，成品除了固定手工詞綴外，還會依成品 ilvl 額外骰出 1～4 條隨機詞綴（最多 3 前綴／3 後綴）。',
              'Combine a specific Magic (blue) base + Rune + Perfect Gem + any Jewel to craft an orange item. Normal, Exceptional, and Elite versions of listed armor/shield bases all work. In addition to fixed mods, the output rolls 1–4 random affixes based on crafted ilvl.',
            )}
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-300 shrink-0 self-start">
          {isEn ? `Showing ${filtered.length} / ${allRecipes.length} recipes` : `顯示 ${filtered.length} / ${allRecipes.length} 條配方`}
        </div>
      </div>

      {/* 手工機制與互動式 ilvl 計算器 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 p-4 rounded-2xl bg-sanctuary-900/70 border border-sanctuary-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
            <Calculator className="w-4 h-4" />
            <span>{t('手工成品 ilvl 與詞綴數即時試算', 'Crafted ilvl & Random Affix Calculator')}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end text-xs">
            <label className="space-y-1">
              <span className="block text-sanctuary-400">{t('角色等級 (clvl)', 'Char Level (clvl)')}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={clvl}
                onChange={(e) => setClvl(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                className="w-full rounded-lg bg-sanctuary-950 border border-sanctuary-750 px-2.5 py-1.5 font-mono text-sanctuary-100"
              />
            </label>
            <label className="space-y-1">
              <span className="block text-sanctuary-400">{t('底材物品等級 (ilvl)', 'Base ilvl')}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={inputIlvl}
                onChange={(e) => setInputIlvl(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                className="w-full rounded-lg bg-sanctuary-950 border border-sanctuary-750 px-2.5 py-1.5 font-mono text-sanctuary-100"
              />
            </label>
            <div className="p-2 rounded-xl bg-sanctuary-950 border border-orange-500/30 text-center">
              <div className="text-[10px] text-sanctuary-400">{t('成品 ilvl', 'Crafted ilvl')}</div>
              <div className="text-lg font-mono font-bold text-orange-300">{craftedIlvl}</div>
            </div>
            <div className="p-2 rounded-xl bg-sanctuary-950 border border-sanctuary-800 text-center">
              <div className="text-[10px] text-sanctuary-400">{t('項鍊 +2 職業技能', 'Amulet +2 Skills')}</div>
              <div className={`text-xs font-bold mt-1 ${craftedIlvl >= 90 ? 'text-emerald-400' : 'text-sanctuary-400'}`}>
                {craftedIlvl >= 90 ? t('✓ 已達標 (≥ 90)', '✓ Eligible (≥ 90)') : t(`尚差 ${90 - craftedIlvl} 級`, `Need +${90 - craftedIlvl}`)}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sanctuary-300">
            <span className="font-mono text-sanctuary-400">
              ilvl = ⌊clvl/2⌋ + ⌊{t('底材 ilvl', 'base ilvl')}/2⌋
            </span>
            <span>
              {t('隨機詞綴數：', 'Random affixes: ')}
              <strong className="text-d2-magic">
                {rollInfo.chances.map((c) => (isEn ? `${c.count} (${c.pct}%)` : `${c.count} 條 (${c.pct}%)`)).join(' / ')}
              </strong>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-4 rounded-2xl bg-sanctuary-900/70 border border-sanctuary-800 text-xs space-y-2">
          <div className="font-bold text-sanctuary-200">{t('手工裝備必知規則', 'Key Crafting Rules')}</div>
          <ul className="space-y-1 text-[11px] text-sanctuary-300 leading-relaxed list-disc pl-4">
            <li>
              {t(
                '隨機詞綴門檻：ilvl 1–30 出 1–4 條、31–50 至少 2 條、51–70 至少 3 條、ilvl ≥ 71 必出滿 4 條。',
                'Affix count: ilvl 1–30 rolls 1–4, 31–50 min 2, 51–70 min 3, and ilvl ≥ 71 always rolls 4 random affixes.',
              )}
            </li>
            <li>
              {t(
                '需求等級公式：rlvl = 最高詞綴需求等級 + 10 + 3 × 隨機詞綴數（最高封頂 98 級，例如 2/20 項鍊常見需求 89 級）。',
                'Required level: rlvl = highest affix rlvl + 10 + 3 × random affixes (e.g. +2/20 amulets commonly require Lv 89).',
              )}
            </li>
            <li>
              {t(
                '珠寶品質不影響結果：任意藍色、黃色或暗金珠寶皆可投入，原屬性會完全覆蓋。',
                'Jewel stats do not carry over: any magic, rare, or unique jewel works identically.',
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* 四大系列篩選列 + 部位篩選 + 搜尋 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFamily('all')}
            aria-pressed={family === 'all'}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              family === 'all'
                ? 'bg-orange-950/60 border-orange-400 text-orange-200'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-300 hover:text-white'
            }`}
          >
            {t(`全部系列 (${allRecipes.length})`, `All Families (${allRecipes.length})`)}
          </button>
          {CRAFT_FAMILIES.map((f) => {
            const active = family === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFamily(f.id)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  active ? f.badgeCls : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-300 hover:text-white'
                }`}
              >
                {isEn ? `${f.labelEn} · ${f.gemNameEn} (9)` : `${f.label}・${f.gemName} (9)`}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setOnlyMeta((v) => !v)}
            aria-pressed={onlyMeta}
            className={`ml-auto px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
              onlyMeta
                ? 'bg-amber-950/70 border-d2-gold text-d2-gold'
                : 'bg-sanctuary-900 border-sanctuary-800 text-sanctuary-300 hover:border-d2-gold/50'
            }`}
          >
            {t(`★ 只看終局熱門 (${metaCount})`, `★ Meta Crafts (${metaCount})`)}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 text-xs">
          <select
            aria-label={t('依部位篩選', 'Filter by slot')}
            value={slot}
            onChange={(e) => setSlot(e.target.value as 'all' | CraftSlotId)}
            className="sm:w-44 rounded-lg bg-sanctuary-900 border border-sanctuary-750 px-3 py-2 text-sanctuary-100"
          >
            <option value="all">{t('全部 9 個部位', 'All 9 Slots')}</option>
            {CRAFT_SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {isEn ? s.labelEn : s.label}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-sanctuary-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('搜尋手工配方、底材、符文或固定屬性（如：壓碎、擊退、格擋、吸血鬼骸骨手套、Ral…）', 'Search crafted recipes, bases, runes, or fixed stats (e.g. Crushing Blow, Knockback, Block, Ral...)')}
              className="w-full rounded-lg bg-sanctuary-900 border border-sanctuary-750 pl-9 pr-8 py-2 text-sanctuary-100 placeholder-sanctuary-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('清除搜尋', 'Clear search')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sanctuary-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 配方卡片網格 */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center text-sm text-sanctuary-400 border border-dashed border-sanctuary-800 rounded-2xl">
          {t('找不到符合條件的手工合成配方。', 'No crafted recipes match the current filter.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const fam = FAMILY_META.get(r.family)!;
            const mods = isEn ? r.fixedModsEn : r.fixedMods;
            const bases = isEn ? r.basesEn : r.bases;
            return (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-sanctuary-900/60 border border-sanctuary-800 hover:border-orange-500/50 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  {/* 卡片標題與系列標籤 */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-sanctuary-800/80">
                    <div>
                      <h4 className="font-diablo text-sm font-bold text-orange-300">
                        {isEn ? r.nameEn : r.name}
                      </h4>
                      {!isEn && <div className="text-[11px] font-mono text-sanctuary-400 italic">{r.nameEn}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${fam.badgeCls}`}>
                        {isEn ? fam.labelEn : fam.label}
                      </span>
                      {r.highlight && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/70 text-d2-gold border border-d2-gold/40 font-semibold">
                          ★ {isEn ? r.highlight.tagEn : r.highlight.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 材料清單 */}
                  <div className="space-y-1.5 text-xs">
                    <div className="text-[11px] text-sanctuary-300">
                      <span className="text-sanctuary-500">{t('魔法底材：', 'Magic Base: ')}</span>
                      <span className="text-d2-magic font-medium">
                        {bases.join(isEn ? ' / ' : ' ／ ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      {onNavigateToRune && r.runeNumber > 0 ? (
                        <button
                          type="button"
                          onClick={() => onNavigateToRune(r.runeNumber)}
                          className="px-2 py-0.5 rounded bg-d2-rune/15 hover:bg-d2-rune/25 text-d2-rune border border-d2-rune/40 font-mono font-semibold cursor-pointer transition-colors"
                          title={t(`點擊查看 ${r.runeNumber}# 符文`, `View Rune #${r.runeNumber}`)}
                        >
                          {r.runeNumber}# {isEn ? r.runeNameEn : r.runeName}
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-d2-rune/15 text-d2-rune border border-d2-rune/40 font-mono">
                          {r.runeNumber}# {isEn ? r.runeNameEn : r.runeName}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded border ${fam.badgeCls}`}>
                        {isEn ? r.gemNameEn : r.gemName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sanctuary-950 text-sanctuary-300 border border-sanctuary-800">
                        {t('任意珠寶', 'Any Jewel')}
                      </span>
                    </div>
                  </div>

                  {/* 固定手工屬性 */}
                  <div className="p-2.5 rounded-xl bg-sanctuary-950/90 border border-sanctuary-800/80 space-y-1 text-xs">
                    {mods.map((line, i) => (
                      <div key={i} className="text-orange-200 leading-snug">
                        • {line}
                      </div>
                    ))}
                    <div className="text-[11px] text-d2-magic/90 pt-0.5">
                      • {t('+ 1～4 條隨機詞綴（ilvl ≥ 71 必出 4 條）', '+ 1–4 random affixes (4 guaranteed at ilvl ≥ 71)')}
                    </div>
                  </div>
                </div>

                {r.highlight && (
                  <p className="text-[11px] text-sanctuary-300 bg-amber-950/20 border border-d2-gold/20 rounded-lg px-2.5 py-2 leading-relaxed">
                    {isEn ? r.highlight.tipEn : r.highlight.tip}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
