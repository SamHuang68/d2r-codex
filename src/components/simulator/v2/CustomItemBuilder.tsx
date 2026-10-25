import React, { useEffect, useMemo, useState } from 'react';
import type { CatalogEntry } from '../../../engine/catalog';
import type { ItemCheck } from '../../../data/codex/customItemCheck';
import { CUSTOM_AFFIXES, CUSTOM_BASES, MAX_CUSTOM_AFFIXES, MAX_CUSTOM_NAME, customEntry, validateCustomDef, type CustomAffix, type CustomItemDef } from '../../../engine/customItem';
import { describeModifiers } from '../../../engine/describe';
import { useLanguage } from '../../../context/LanguageContext';

interface Props {
  level: number;
  onEquip: (entry: CatalogEntry) => void;
  say: (m: string) => void;
}

const LIB_KEY = 'd2sim.customItems.v1';
const MAX_LIB = 60;

function loadLibrary(): CustomItemDef[] {
  try {
    const arr = JSON.parse(window.localStorage.getItem(LIB_KEY) || '[]'); if (!Array.isArray(arr)) return [];
    return arr.map(validateCustomDef).filter((x): x is CustomItemDef => typeof x !== 'string');
  } catch { return []; }
}
const storeLibrary = (list: CustomItemDef[]): boolean => { try { window.localStorage.setItem(LIB_KEY, JSON.stringify(list)); return true; } catch { return false; } };

const linesOf = (def: CustomItemDef, level: number) => describeModifiers(def.affixes.map((a) => ({ code: a.code, min: a.value, max: a.value })), 1, level).map((l) => l.text);

const KIND_ZH = { prefix: '前綴', suffix: '後綴', auto: '自動' } as const;
const QUALITY_ZH = { magic: '魔法', rare: '稀有' } as const;
const fmtRange = ([lo, hi]: [number, number]) => (lo === hi ? `${lo}` : `${lo}–${hi}`);

/** 「遊戲內檢查」：對照遊戲魔法詞綴表，說明這組詞綴能不能長在這種飾品上（只是參考，不擋穿戴與儲存） */
const GameCheck: React.FC<{ check: ItemCheck; level: number }> = ({ check, level }) => {
  const { isEn } = useLanguage();
  const label = (code: string, value: number) => describeModifiers([{ code, min: value, max: value }], 1, level)[0]?.text ?? code;
  return (
    <div className="d2-tip" aria-label="遊戲內檢查" style={{ textAlign: 'left' }}>
      <div className="nm t-gold">{isEn ? "In-Game Check (Reference)" : "遊戲內檢查（參考）"}</div>
      {check.fit && (
        <div className="mod t-set">
          可以長出來：{QUALITY_ZH[check.fit.quality]}品質{check.fit.quality === 'rare' ? '才行' : '即可'}，物品等級 ≥ {check.fit.minIlvl}{check.fit.maxIlvl ? `（且 ≤ ${check.fit.maxIlvl}）` : ''}；用到 {check.fit.rows.map((r) => `${r.name}（${KIND_ZH[r.kind]}）`).join('、')}
        </div>
      )}
      {check.conflict && <div className="mod t-bad">湊不成一件：{check.conflict}</div>}
      {check.undecided && <div className="mod t-rare">組合太多，沒有判定。</div>}
      {check.lines.map((l, i) => {
        const text = label(l.code, l.value);
        if (l.verdict === 'ok') {
          const names = [...new Set(l.rows.map((r) => r.name))];
          return <div key={i} className="mod">符合：{text}　<span className="t-dim">可由 {names.slice(0, 3).join('、')}{names.length > 3 ? ' 等' : ''} 骰出，物品等級 ≥ {Math.min(...l.rows.map((r) => r.level))}</span></div>;
        }
        if (l.verdict === 'value') return <div key={i} className="mod t-bad">數值超出：{text}　<span className="t-dim">這種飾品上這個屬性只能骰到 {l.ranges.map(fmtRange).join('、')}</span></div>;
        return <div key={i} className="mod t-bad">不會出現：{text}　<span className="t-dim">這種飾品在遊戲詞綴表裡沒有這條屬性</span></div>;
      })}
      <div className="hint">不含底材的詞綴等級加成與其他來源的屬性（暗金、套裝、工藝等）；沒有在遊戲內逐項核對。</div>
    </div>
  );
};

/**
 * 自訂飾品：魔法／稀有的戒指、護身符、咒符的詞綴是隨機的，遊戲資料裡沒有現成物品可選，所以讓使用者自己組。
 * 詞綴從清單選、數值自填；數值上限只是防呆。「遊戲內檢查」會對照遊戲詞綴表提示能不能長出來，但只是參考，不擋穿戴與儲存。
 */
export const CustomItemBuilder: React.FC<Props> = ({ level, onEquip, say }) => {
  const { isEn } = useLanguage();
  const [baseCode, setBaseCode] = useState('cm1');
  const [name, setName] = useState('');
  const [affixes, setAffixes] = useState<CustomAffix[]>([{ code: 'mag%', value: 7 }]);
  const [library, setLibrary] = useState<CustomItemDef[]>(() => loadLibrary());

  // 詞綴選單的文字：用遊戲的屬性描述範本，把數字換成 N（例如「+N 生命」）
  const labels = useMemo(() => {
    const m = new Map<string, string>();
    CUSTOM_AFFIXES.forEach((a) => { const t = describeModifiers([{ code: a.code, min: 1, max: 1 }], 1, level)[0]?.text ?? a.code; m.set(a.code, t.replace(/\d+(\.\d+)?/g, 'N')); });
    return m;
  }, [level]);

  const def: CustomItemDef = { baseCode, name, affixes };
  const check = validateCustomDef(def);
  const clean = typeof check === 'string' ? undefined : check;
  const lines = clean ? linesOf(clean, level) : [];

  // 詞綴表較大，背景載入（不拖慢配裝頁首次顯示）；載入失敗就不顯示檢查
  const [checker, setChecker] = useState<typeof import('../../../data/codex/customItemCheck') | null>(null);
  useEffect(() => {
    let alive = true;
    import('../../../data/codex/customItemCheck').then((m) => { if (alive) setChecker(m); }).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  const cleanKey = clean ? JSON.stringify([clean.baseCode, clean.affixes]) : '';
  const gameCheck = useMemo(() => (checker && clean && clean.affixes.length ? checker.checkCustomItem(clean) : undefined), [checker, cleanKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAffix = (i: number, patch: Partial<CustomAffix>) => setAffixes((l) => l.map((a, k) => (k === i ? { ...a, ...patch } : a)));
  const equip = (d: CustomItemDef) => { const e = customEntry(d); if (e) onEquip(e); else say('無法建立這件自訂飾品'); };
  const save = () => {
    if (!clean) return;
    const label = clean.name || CUSTOM_BASES.find((b) => b.code === clean.baseCode)?.label || '自訂';
    const next = [{ ...clean, name: label }, ...library.filter((x) => x.name !== label)].slice(0, MAX_LIB);
    if (storeLibrary(next)) { setLibrary(next); say(`已存入「${label}」`); } else say('無法儲存：瀏覽器封鎖了本機儲存（無痕模式或容量已滿）');
  };
  const remove = (d: CustomItemDef) => { const next = library.filter((x) => x !== d); if (storeLibrary(next)) setLibrary(next); else say('無法儲存：瀏覽器封鎖了本機儲存'); };
  const load = (d: CustomItemDef) => { setBaseCode(d.baseCode); setName(d.name); setAffixes(d.affixes.length ? d.affixes : [{ code: 'hp', value: 1 }]); };

  return (
    <section aria-label="自訂飾品" className="d2-panel" style={{ marginTop: 12 }}>
      <div className="d2-title">{isEn ? "CUSTOM ITEM BUILDER" : "自 訂 飾 品"}</div>
      <div className="d2-panel-body space-y-3">
        <div className="d2-sub">{isEn ? "Craft custom magic or rare jewelry/charms by picking affixes from the game database. The In-Game Check validates rolls against the affix tables for reference." : "魔法或稀有的戒指、護身符、咒符，詞綴是隨機的，遊戲資料裡沒有現成物品可選，所以由你自己組。詞綴從清單選、數值自己填；數值上限只是防呆。下方的「遊戲內檢查」會對照遊戲的詞綴表，提示這組詞綴能不能長出來，只是參考，不會擋下穿戴或儲存。"}</div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="d2-field">{isEn ? "Type" : "種類"}
            <select value={baseCode} onChange={(e) => setBaseCode(e.target.value)} className="d2-select" aria-label="自訂飾品種類">
              {CUSTOM_BASES.map((b) => <option key={b.code} value={b.code}>{b.label}</option>)}
            </select>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={MAX_CUSTOM_NAME} placeholder={isEn ? "Name (optional), e.g. Lucky Small Charm" : "名稱（選填），例如：幸運小符"} aria-label="自訂飾品名稱" className="d2-input flex-1" style={{ minWidth: 160 }} />
        </div>
        <ul className="space-y-1.5">
          {affixes.map((a, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <select value={a.code} onChange={(e) => setAffix(i, { code: e.target.value })} className="d2-select flex-1" style={{ minWidth: 160 }} aria-label={`第 ${i + 1} 條詞綴`}>
                {CUSTOM_AFFIXES.map((x) => <option key={x.code} value={x.code}>{labels.get(x.code)}</option>)}
              </select>
              <input type="number" min={1} max={CUSTOM_AFFIXES.find((x) => x.code === a.code)?.max} value={a.value} onChange={(e) => setAffix(i, { value: Number(e.target.value) || 1 })} className="d2-input" style={{ width: 80 }} aria-label={`第 ${i + 1} 條詞綴的數值`} />
              <button type="button" className="d2-btn is-danger" onClick={() => setAffixes((l) => l.filter((_, k) => k !== i))} aria-label={`移除第 ${i + 1} 條詞綴`}>{isEn ? "Remove" : "移除"}</button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="d2-btn is-quiet" disabled={affixes.length >= MAX_CUSTOM_AFFIXES} onClick={() => setAffixes((l) => [...l, { code: 'hp', value: 1 }])}>{isEn ? "+ Add Modifier" : "＋ 加一條詞綴"}</button>
          <span className="d2-sub">{isEn ? `Up to ${MAX_CUSTOM_AFFIXES} mods` : `最多 ${MAX_CUSTOM_AFFIXES} 條`}</span>
        </div>
        {clean && (
          <div className="d2-tip" aria-label="自訂飾品預覽">
            <div className="nm t-magic">{clean.name || `自訂${CUSTOM_BASES.find((b) => b.code === clean.baseCode)?.label}`}</div>
            {lines.map((t, i) => <div key={i} className="mod">{t}</div>)}
            {lines.length === 0 && <div className="hint">還沒有詞綴</div>}
          </div>
        )}
        {gameCheck && <GameCheck check={gameCheck} level={level} />}
        {typeof check === 'string' && <div className="d2-sub" style={{ color: 'var(--bad)' }}>{check}</div>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="d2-btn" disabled={!clean} onClick={() => clean && equip(clean)}>{isEn ? "Equip" : "穿戴"}</button>
          <button type="button" className="d2-btn is-quiet" disabled={!clean} onClick={save}>{isEn ? "Save to Library" : "存入我的自訂飾品"}</button>
        </div>

        <div style={{ borderTop: '1px solid #2e271c', paddingTop: 10 }}>
          <div className="t-gold text-sm tracking-[.2em] mb-1.5" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>{isEn ? "MY CUSTOM ITEMS" : "我的自訂飾品"}</div>
          {library.length === 0 ? <div className="d2-empty">{isEn ? "No custom items saved yet." : "還沒有存過。"}</div> : (
            <ul className="space-y-1.5">
              {library.map((d, i) => (
                <li key={`${d.name}-${i}`} className="d2-build flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="min-w-0 flex-1">
                    <b className="t-magic break-all">{d.name}</b>
                    <div className="d2-sub">{CUSTOM_BASES.find((b) => b.code === d.baseCode)?.label}・{linesOf(d, level).join('，') || '沒有詞綴'}</div>
                  </div>
                  <button type="button" className="d2-btn" onClick={() => equip(d)}>{isEn ? "Equip" : "穿戴"}</button>
                  <button type="button" className="d2-btn is-quiet" onClick={() => load(d)}>{isEn ? "Edit" : "載入編輯"}</button>
                  <button type="button" className="d2-btn is-danger" onClick={() => remove(d)}>{isEn ? "Delete" : "刪除"}</button>
                </li>
              ))}
            </ul>
          )}
          <div className="d2-sub mt-1">只存在這個瀏覽器；戴上後的自訂飾品會隨配裝一起存進 Profile 與自動暫存。</div>
        </div>
      </div>
    </section>
  );
};
