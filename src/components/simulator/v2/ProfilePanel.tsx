import React, { useMemo, useState } from 'react';
import { BUILDS, PRESET_TIER_ZH, SIM_PRESETS, tierOf, type PresetTier } from '../../../data/simulatorPresets';
import { previewPreset, stateFromPreset } from '../../../data/presetState';
import { ALL_PARTS, exportProfile, fromSavedData, loadProfiles, newProfile, parseProfile, storeProfiles, type ApplyParts, type SavedProfile, type SimSnapshot } from '../../../data/profileStore';
import { CLASS_CODE_ZH, skillByName } from '../../../engine/skills';
import { effectiveMf } from '../../../engine/magicFind';

interface Props {
  classCode: string;
  /** 取得目前畫面上的完整狀態（儲存 Profile、套用前備份用） */
  capture: () => SimSnapshot;
  /** 把狀態套用到畫面；回傳套用後的說明文字由呼叫端顯示 */
  apply: (snap: SimSnapshot, parts: ApplyParts, label: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  say: (m: string) => void;
}

const PARTS: { key: keyof ApplyParts; label: string; hint: string }[] = [
  { key: 'gear', label: '裝備與護身符', hint: '換掉物品欄與護身符背包' },
  { key: 'skills', label: '技能點', hint: '換掉技能樹的加點與主力技能' },
  { key: 'character', label: '等級、屬性點與任務', hint: '換掉等級、難度、任務與四項屬性配點' },
];

export const ProfilePanel: React.FC<Props> = ({ classCode, capture, apply, canUndo, onUndo, say }) => {
  const [parts, setParts] = useState<ApplyParts>(ALL_PARTS);
  const [profiles, setProfiles] = useState<SavedProfile[]>(() => loadProfiles());
  const [name, setName] = useState('');
  const [importText, setImportText] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const none = !parts.gear && !parts.skills && !parts.character;

  const builds = BUILDS.filter((b) => b.classCode === classCode);
  // 各檔位套用後的數值（只算一次，切換職業才重算）
  const previews = useMemo(() => {
    const m: Record<string, ReturnType<typeof previewPreset>> = {};
    SIM_PRESETS.filter((p) => p.classCode === classCode && p.tier !== 'start').forEach((p) => { m[p.id] = previewPreset(p); });
    return m;
  }, [classCode]);

  const applyTemplate = (buildId: string, tier: PresetTier) => {
    const p = SIM_PRESETS.find((x) => x.build === buildId && x.tier === tier); if (!p) return;
    const { snap, notes } = stateFromPreset(p);
    apply(snap, parts, `${p.name}`);
    if (notes.length) say(`已套用「${p.name}」，但有 ${notes.length} 項需注意：${notes.join('；')}`);
  };

  const commit = (list: SavedProfile[], okMsg: string) => {
    if (storeProfiles(list)) { setProfiles([...list].sort((a, b) => b.savedAt - a.savedAt)); say(okMsg); }
    else say('無法儲存：瀏覽器封鎖了本機儲存（無痕模式或容量已滿）。可先用「匯出」把內容複製起來。');
  };

  const save = () => {
    const nm = name.trim(); if (!nm) { say('請先輸入 Profile 名稱'); return; }
    const p = newProfile(nm, capture());
    const same = profiles.find((x) => x.name === nm);
    commit([p, ...profiles.filter((x) => x.id !== same?.id)], same ? `已覆蓋「${nm}」` : `已儲存「${nm}」`);
    setName('');
  };

  const applyProfile = (p: SavedProfile) => {
    const { snap, errors } = fromSavedData(p.data);
    apply(snap, parts, p.name);
    if (errors.length) say(`已套用「${p.name}」，但有 ${errors.length} 項無法還原：${errors.join('；')}`);
  };

  const copy = (p: SavedProfile) => navigator.clipboard?.writeText(exportProfile(p)).then(() => say(`已複製「${p.name}」的匯出文字，可貼給他人或存檔`), () => say('無法複製（瀏覽器未授權）'));

  const doImport = () => {
    const r = parseProfile(importText.trim());
    if (typeof r === 'string') { say(`匯入失敗：${r}`); return; }
    const nm = r.name || '匯入的 Profile'; const same = profiles.find((x) => x.name === nm);
    commit([{ ...r, id: newProfile(nm, capture()).id, name: nm, savedAt: Date.now() }, ...profiles.filter((x) => x.id !== same?.id)], same ? `已匯入並覆蓋「${nm}」` : `已匯入「${nm}」`);
    setImportText(''); setImportOpen(false);
  };

  const remove = (p: SavedProfile) => {
    if (confirmDel !== p.id) { setConfirmDel(p.id); return; }
    setConfirmDel(null); commit(profiles.filter((x) => x.id !== p.id), `已刪除「${p.name}」`);
  };

  return (
    <div className="d2-panel" aria-label="流派與 Profile">
      <div className="d2-title">流 派 與 配 裝 Profile</div>
      <div className="d2-panel-body space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="d2-sub" style={{ letterSpacing: '.2em' }}>套用範圍</span>
          {PARTS.map((p) => (
            <label key={p.key} className="d2-field" title={p.hint}>
              <input type="checkbox" className="d2-check" checked={parts[p.key]} onChange={(e) => setParts((o) => ({ ...o, [p.key]: e.target.checked }))} />{p.label}
            </label>
          ))}
          <span className="flex-1" />
          <button type="button" className="d2-btn is-quiet" disabled={!canUndo} onClick={onUndo} title="回到上一次套用之前的狀態">復原上一次套用</button>
        </div>
        {none && <div className="d2-sub" style={{ color: 'var(--bad)' }}>三項都沒勾選，套用不會改變任何東西。</div>}

        <section aria-label="職業流派建議">
          <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>{CLASS_CODE_ZH[classCode] ?? classCode}的主流流派</div>
          {builds.length === 0 ? (
            <div className="d2-empty">術士是新職業，目前還沒有足夠的社群共識流派可以收錄。可以自己配好之後存成 Profile。</div>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {builds.map((b) => {
                const main = skillByName(b.skill.main);
                return (
                  <li key={b.id} className="d2-build">
                    <div className="flex items-baseline justify-between gap-2">
                      <b className="t-unique">{b.name}</b>
                      <span className="d2-sub">主力：{main?.name ?? b.skill.main}</span>
                    </div>
                    <div className="d2-sub" style={{ margin: '4px 0 8px' }}>{b.summary}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="d2-sub" style={{ width: 36 }}>裝備</span>
                      {(['start', 'bis'] as PresetTier[]).map((t) => (
                        <button key={t} type="button" className={`d2-btn ${t === 'bis' ? '' : 'is-quiet'}`} disabled={none} onClick={() => applyTemplate(b.id, t)} title={tierOf(b, t).notes}>
                          套用{PRESET_TIER_ZH[t]}（Lv{tierOf(b, t).level}）
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="d2-sub" style={{ width: 36 }}>尋寶</span>
                      {(['mfEff', 'mfMax'] as PresetTier[]).map((t) => {
                        const pv = previews[`${b.id}:${t}`];
                        return (
                          <button key={t} type="button" className="d2-btn is-quiet" disabled={none} onClick={() => applyTemplate(b.id, t)} title={tierOf(b, t).notes}>
                            {PRESET_TIER_ZH[t]}{pv ? `　MF ${pv.mf}%（暗金有效 ${Math.floor(effectiveMf(pv.mf, 'unique'))}%）・生命 ${pv.life.toLocaleString()}` : ''}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="d2-sub" style={{ width: 36 }}>減傷</span>
                      {(['tankEff', 'tankMax'] as PresetTier[]).map((t) => {
                        const pv = previews[`${b.id}:${t}`];
                        return (
                          <button key={t} type="button" className="d2-btn is-quiet" disabled={none} onClick={() => applyTemplate(b.id, t)} title={tierOf(b, t).notes}>
                            {PRESET_TIER_ZH[t]}{pv ? `　物減 ${pv.survival.pdr}%・最低抗性 ${pv.survival.minRes}%・有效生命 ${pv.survival.ehpPhys.toLocaleString()}` : ''}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="d2-sub mt-2">範本是社群常見組合的示意，數值由遊戲資料計算，未逐件與遊戲內比對。套用後可以直接調整再存成自己的 Profile。「尋寶」「減傷」各兩檔的數字是套用後的計算值：效率／平衡檔保留流派核心、只換少數欄位；極致檔全身換成該目標最高的組合，輸出會大幅下降。有效生命只把生命與百分比減傷合成一個數字，方便比較，不是實際能吃幾下。</div>
        </section>

        <section aria-label="我的 Profile" style={{ borderTop: '1px solid #2e271c', paddingTop: 12 }}>
          <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>我的 Profile</div>
          <div className="flex flex-wrap items-center gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); }} maxLength={40} placeholder="Profile 名稱，例如：我的冰暴 Lv90" aria-label="Profile 名稱" className="d2-input flex-1" style={{ minWidth: 180 }} />
            <button type="button" className="d2-btn" onClick={save}>{profiles.some((p) => p.name === name.trim()) && name.trim() ? '覆蓋儲存' : '儲存目前配置'}</button>
            <button type="button" className="d2-btn is-quiet" aria-expanded={importOpen} onClick={() => setImportOpen((v) => !v)}>匯入</button>
          </div>
          <div className="d2-sub mt-1">會儲存目前的職業、裝備與鑲嵌、護身符、技能點、等級、屬性點與任務。只存在這個瀏覽器，換瀏覽器或清除網站資料前請先「匯出」備份。</div>
          {importOpen && (
            <div className="mt-2 space-y-2">
              <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={4} placeholder="貼上匯出的 Profile 文字" aria-label="匯入 Profile" className="d2-input w-full" style={{ fontFamily: 'monospace', fontSize: 12 }} />
              <button type="button" className="d2-btn" disabled={!importText.trim()} onClick={doImport}>匯入這份 Profile</button>
            </div>
          )}
          {profiles.length === 0 ? (
            <div className="d2-empty mt-2">還沒有儲存的 Profile。</div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {profiles.map((p) => (
                <li key={p.id} className="d2-build flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="min-w-0 flex-1">
                    <b className="t-unique break-all">{p.name}</b>
                    <div className="d2-sub">{CLASS_CODE_ZH[p.data.classCode] ?? p.data.classCode}・Lv{p.data.level}・{Object.keys(p.data.equipped).length} 件裝備・{new Date(p.savedAt).toLocaleDateString('zh-TW')}</div>
                  </div>
                  <button type="button" className="d2-btn" disabled={none} onClick={() => applyProfile(p)}>套用</button>
                  <button type="button" className="d2-btn is-quiet" onClick={() => copy(p)}>匯出</button>
                  <button type="button" className="d2-btn is-danger" onClick={() => remove(p)} onBlur={() => setConfirmDel((c) => (c === p.id ? null : c))}>{confirmDel === p.id ? '再按一次刪除' : '刪除'}</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
