import React, { useMemo, useState } from 'react';
import type { CatalogEntry } from '../../../engine/catalog';
import { CUSTOM_AFFIXES, CUSTOM_BASES, MAX_CUSTOM_AFFIXES, MAX_CUSTOM_NAME, customEntry, validateCustomDef, type CustomAffix, type CustomItemDef } from '../../../engine/customItem';
import { describeModifiers } from '../../../engine/describe';

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

/**
 * 自訂飾品：魔法／稀有的戒指、項鍊、護身符的詞綴是隨機的，遊戲資料裡沒有現成物品可選，所以讓使用者自己組。
 * 詞綴從清單選、數值自填；數值上限只是防呆，模擬器不驗證能不能在遊戲裡骰出來。
 */
export const CustomItemBuilder: React.FC<Props> = ({ level, onEquip, say }) => {
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
      <div className="d2-title">自 訂 飾 品</div>
      <div className="d2-panel-body space-y-3">
        <div className="d2-sub">魔法或稀有的戒指、項鍊、護身符，詞綴是隨機的，遊戲資料裡沒有現成物品可選，所以由你自己組。詞綴從清單選、數值自己填；數值上限只是防呆，<b>模擬器不驗證能不能在遊戲裡骰出來</b>。</div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="d2-field">種類
            <select value={baseCode} onChange={(e) => setBaseCode(e.target.value)} className="d2-select" aria-label="自訂飾品種類">
              {CUSTOM_BASES.map((b) => <option key={b.code} value={b.code}>{b.label}</option>)}
            </select>
          </label>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={MAX_CUSTOM_NAME} placeholder="名稱（選填），例如：幸運小符" aria-label="自訂飾品名稱" className="d2-input flex-1" style={{ minWidth: 160 }} />
        </div>
        <ul className="space-y-1.5">
          {affixes.map((a, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2">
              <select value={a.code} onChange={(e) => setAffix(i, { code: e.target.value })} className="d2-select flex-1" style={{ minWidth: 160 }} aria-label={`第 ${i + 1} 條詞綴`}>
                {CUSTOM_AFFIXES.map((x) => <option key={x.code} value={x.code}>{labels.get(x.code)}</option>)}
              </select>
              <input type="number" min={1} max={CUSTOM_AFFIXES.find((x) => x.code === a.code)?.max} value={a.value} onChange={(e) => setAffix(i, { value: Number(e.target.value) || 1 })} className="d2-input" style={{ width: 80 }} aria-label={`第 ${i + 1} 條詞綴的數值`} />
              <button type="button" className="d2-btn is-danger" onClick={() => setAffixes((l) => l.filter((_, k) => k !== i))} aria-label={`移除第 ${i + 1} 條詞綴`}>移除</button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="d2-btn is-quiet" disabled={affixes.length >= MAX_CUSTOM_AFFIXES} onClick={() => setAffixes((l) => [...l, { code: 'hp', value: 1 }])}>＋ 加一條詞綴</button>
          <span className="d2-sub">最多 {MAX_CUSTOM_AFFIXES} 條</span>
        </div>
        {clean && (
          <div className="d2-tip" aria-label="自訂飾品預覽">
            <div className="nm t-magic">{clean.name || `自訂${CUSTOM_BASES.find((b) => b.code === clean.baseCode)?.label}`}</div>
            {lines.map((t, i) => <div key={i} className="mod">{t}</div>)}
            {lines.length === 0 && <div className="hint">還沒有詞綴</div>}
          </div>
        )}
        {typeof check === 'string' && <div className="d2-sub" style={{ color: 'var(--bad)' }}>{check}</div>}
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="d2-btn" disabled={!clean} onClick={() => clean && equip(clean)}>穿戴</button>
          <button type="button" className="d2-btn is-quiet" disabled={!clean} onClick={save}>存入我的自訂飾品</button>
        </div>

        <div style={{ borderTop: '1px solid #2e271c', paddingTop: 10 }}>
          <div className="t-gold text-sm tracking-[.2em] mb-1.5" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>我的自訂飾品</div>
          {library.length === 0 ? <div className="d2-empty">還沒有存過。</div> : (
            <ul className="space-y-1.5">
              {library.map((d, i) => (
                <li key={`${d.name}-${i}`} className="d2-build flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="min-w-0 flex-1">
                    <b className="t-magic break-all">{d.name}</b>
                    <div className="d2-sub">{CUSTOM_BASES.find((b) => b.code === d.baseCode)?.label}・{linesOf(d, level).join('，') || '沒有詞綴'}</div>
                  </div>
                  <button type="button" className="d2-btn" onClick={() => equip(d)}>穿戴</button>
                  <button type="button" className="d2-btn is-quiet" onClick={() => load(d)}>載入編輯</button>
                  <button type="button" className="d2-btn is-danger" onClick={() => remove(d)}>刪除</button>
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
