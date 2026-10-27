import React, { useEffect, useState } from 'react';
import { BUILDS, PRESET_TIER_ZH, SIM_PRESETS, tierOf, type PresetTier } from '../../../data/simulatorPresets';
import { previewPreset, stateFromPreset } from '../../../data/presetState';
import { ALL_PARTS, exportProfile, fromSavedData, loadProfiles, newProfile, parseProfile, storeProfiles, type ApplyParts, type SavedProfile, type SimSnapshot } from '../../../data/profileStore';
import { CLASS_CODE_ZH, skillByName } from '../../../engine/skills';
import { effectiveMf } from '../../../engine/magicFind';
import { useLanguage } from '../../../context/LanguageContext';

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

const sameItems = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);

const PARTS: { key: keyof ApplyParts; label: string; labelEn: string; hint: string; hintEn: string }[] = [
  { key: 'gear', label: '裝備與咒符', labelEn: 'Gear & Charms', hint: '換掉物品欄與咒符背包', hintEn: 'Replace equipment and charms inventory' },
  { key: 'skills', label: '技能點', labelEn: 'Skill Points', hint: '換掉技能樹的加點與主力技能', hintEn: 'Replace allocated skill points and main skill' },
  { key: 'character', label: '等級、屬性點與任務', labelEn: 'Level, Stats & Quests', hint: '換掉等級、難度、任務與四項屬性配點', hintEn: 'Replace character level, difficulty, quest bonuses, and stats' },
];

const PRESET_TIER_EN: Record<PresetTier, string> = {
  start: 'Starter',
  bis: 'BiS / Endgame',
  mfEff: 'MF (Balanced)',
  mfMax: 'MF (Maximum)',
  tankEff: 'DR (Balanced)',
  tankMax: 'DR (Maximum)',
};

const CLASS_NAME_EN: Record<string, string> = {
  ama: 'Amazon',
  sor: 'Sorceress',
  nec: 'Necromancer',
  pal: 'Paladin',
  bar: 'Barbarian',
  dru: 'Druid',
  ass: 'Assassin',
  asn: 'Assassin',
  war: 'Warlock',
};

const BUILD_NAME_EN: Record<string, string> = {
  'ama-lightning-fury': 'Lightning Fury Javazon',
  'ama-strafe': 'Strafe Bowazon',
  'sor-blizzard': 'Blizzard Sorceress',
  'sor-lightning': 'Lightning Sorceress',
  'sor-fire': 'Fire Sorceress',
  'nec-bone-spear': 'Bone Spear Necromancer',
  'nec-summoner': 'Summoner Necromancer',
  'pal-hammerdin': 'Hammerdin Paladin',
  'pal-zealot': 'Zealot Paladin',
  'bar-whirlwind': 'Whirlwind Barbarian',
  'bar-frenzy': 'Frenzy Barbarian',
  'dru-tornado': 'Tornado Wind Druid',
  'dru-fire': 'Fire Druid',
  'ass-lightning-trap': 'Lightning Trapper Assassin',
  'ass-mosaic': 'Mosaic Martial Assassin',
  'ama-multishot': 'Multiple Shot Bowazon',
  'nec-poison-nova': 'Poison Nova Necromancer',
  'pal-foh': 'Fist of the Heavens Paladin (FoHdin)',
  'bar-berserk': 'Berserk Barbarian (Pit Zerker)',
  'dru-fury': 'Fury Werewolf Druid',
  'ass-blade-fury': 'Blade Fury Assassin',
  'war-demon-enslavement': 'Demon Enslavement Warlock',
  'war-chaos-apocalypse': 'Chaos Apocalypse Warlock',
  'war-eldritch-blade': 'Eldritch Blade Warlock',
};

const BUILD_SUMMARY_EN: Record<string, string> = {
  'ama-lightning-fury': 'Throws javelins that release charged bolts on impact. Focuses on Lightning Fury and synergies with high attack speed and +skills.',
  'ama-strafe': 'Rapid-fires a barrage of physical arrows at surrounding enemies. Relies on attack speed, physical damage, and bow mastery.',
  'sor-blizzard': 'Casts Blizzard for massive area-of-effect cold damage. Utilizes Cold Mastery and Teleport mobility with high FCR.',
  'sor-lightning': 'Chains lightning bolts across enemies with extreme burst potential. Lightning Mastery scales damage; Endgame uses Infinity for conviction.',
  'sor-fire': 'Unleashes Meteor and Fire Ball for devastating explosive fire damage, scaling with Fire Mastery and synergies.',
  'nec-bone-spear': 'Pierces dense monster packs with magic damage Bone Spears, supported by Corpse Explosion and curses.',
  'nec-summoner': 'Commands an army of Skeleton Warriors, Skeletal Mages, and Golems to swarm enemies, finished off with Amplify Damage and Corpse Explosion.',
  'pal-hammerdin': 'Spins magical Blessed Hammers under the Concentration aura. Bypasses most immunities; capped with 75% max block.',
  'pal-zealot': 'Unleashes a rapid series of melee strikes powered by Fanaticism aura. Relies on raw weapon damage, crushing blow, and high attack speed.',
  'bar-whirlwind': 'Spins through enemy ranks dealing continuous physical weapon damage. Uses Grief paired with Fortitude armor.',
  'bar-frenzy': 'Dual-wields weapons to build up blinding movement and attack speed with each consecutive melee hit.',
  'dru-tornado': 'Casts swirling physical Tornados wrapped in an elemental Hurricane aura with Cyclone Armor survivability.',
  'dru-fire': 'Calls down Fissures and Volcanoes to create fields of fire and molten rock across the battlefield.',
  'ass-lightning-trap': 'Lays automated Lightning Sentries and Death Sentries that fire bolts and detonate corpses from safe distances.',
  'ass-mosaic': 'Charges martial arts finishing moves that never expire thanks to dual Mosaic runewords, unleashing permanent elemental fireworks.',
  'ama-multishot': 'Fires a wide cone of arrows across the entire screen, utilizing Critical Strike and Pierce for massive physical area clear.',
  'nec-poison-nova': 'Releases expanding rings of lethal toxic clouds, combined with Lower Resist curses and Corpse Explosion to rapidly melt packs.',
  'pal-foh': 'Calls down divine lightning bolts that shatter into waves of holy bolts against undead and demon hordes.',
  'bar-berserk': 'Channels pure magical damage strikes that bypass all physical immunities, ideal for sniping elite champions and magic finding.',
  'dru-fury': 'Transforms into a ferocious werewolf delivering blazing fast multi-hit claw attacks with massive life leech.',
  'ass-blade-fury': 'Rapidly channels flying blades that carry weapon damage, deadly strikes, and crushing blow effects from a safe distance.',
  'war-demon-enslavement': 'Binds formidable greater demons and summons defilers to overwhelm battlefields while supporting with curses and blood rites.',
  'war-chaos-apocalypse': 'Rains apocalyptic hellfire and tear reality with abyssal rifts, devastating wide battlefields with high cast rate chaos spells.',
  'war-eldritch-blade': 'Empowers melee weapons with eldritch void energy and psychic shielding to slice through demonic legions with deadly cleaved strikes.',
};

export const ProfilePanel: React.FC<Props> = ({ classCode, capture, apply, canUndo, onUndo, say }) => {
  const { isEn } = useLanguage();
  const [parts, setParts] = useState<ApplyParts>(ALL_PARTS);
  const [stored] = useState(() => loadProfiles());
  const [profiles, setProfiles] = useState<SavedProfile[]>(stored.list);
  const [name, setName] = useState('');
  const [importText, setImportText] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const none = !parts.gear && !parts.skills && !parts.character;

  const builds = BUILDS.filter((b) => b.classCode === classCode);
  // 各檔位套用後的數值：一次算一個、算完讓出主執行緒，避免面板一打開就卡住（聖騎士 10 個範本約 0.4 秒）
  const [previews, setPreviews] = useState<Record<string, ReturnType<typeof previewPreset>>>({});
  useEffect(() => {
    const todo = SIM_PRESETS.filter((p) => p.classCode === classCode);
    let i = 0; let cancelled = false; let timer = 0;
    setPreviews({});
    const step = () => {
      if (cancelled || i >= todo.length) return;
      const p = todo[i++]; const pv = previewPreset(p);
      setPreviews((m) => ({ ...m, [p.id]: pv }));
      timer = window.setTimeout(step, 0);
    };
    timer = window.setTimeout(step, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [classCode]);

  const applyTemplate = (buildId: string, tier: PresetTier) => {
    const p = SIM_PRESETS.find((x) => x.build === buildId && x.tier === tier); if (!p) return;
    const { snap, notes } = stateFromPreset(p);
    apply(snap, parts, `${p.name}`);
    if (notes.length) {
      say(isEn ? `Applied "${p.name}" with ${notes.length} notes: ${notes.join('; ')}` : `已套用「${p.name}」，但有 ${notes.length} 項需注意：${notes.join('；')}`);
    }
  };

  const commit = (list: SavedProfile[], okMsg: string) => {
    if (storeProfiles(list)) {
      setProfiles([...list].sort((a, b) => b.savedAt - a.savedAt));
      say(okMsg);
    } else {
      say(isEn ? 'Unable to save: Local storage is blocked or full. Try Exporting to clipboard.' : '無法儲存：瀏覽器封鎖了本機儲存（無痕模式或容量已滿）。可先用「匯出」把內容複製起來。');
    }
  };

  const save = () => {
    const nm = name.trim();
    if (!nm) {
      say(isEn ? 'Please enter a profile name first' : '請先輸入 Profile 名稱');
      return;
    }
    const p = newProfile(nm, capture());
    const same = profiles.find((x) => x.name === nm);
    commit(
      [p, ...profiles.filter((x) => x.id !== same?.id)],
      same
        ? (isEn ? `Overwrote "${nm}"` : `已覆蓋「${nm}」`)
        : (isEn ? `Saved "${nm}"` : `已儲存「${nm}」`)
    );
    setName('');
  };

  const applyProfile = (p: SavedProfile) => {
    const { snap, errors } = fromSavedData(p.data);
    apply(snap, parts, p.name);
    if (errors.length) {
      say(isEn ? `Applied "${p.name}", but ${errors.length} items could not be restored: ${errors.join('; ')}` : `已套用「${p.name}」，但有 ${errors.length} 項無法還原：${errors.join('；')}`);
    }
  };

  const copy = (p: SavedProfile) => {
    navigator.clipboard?.writeText(exportProfile(p)).then(
      () => say(isEn ? `Copied export text for "${p.name}" to clipboard` : `已複製「${p.name}」的匯出文字，可貼給他人或存檔`),
      () => say(isEn ? 'Clipboard access denied' : '無法複製（瀏覽器未授權）')
    );
  };

  const doImport = () => {
    const r = parseProfile(importText.trim());
    if (typeof r === 'string') {
      say(isEn ? `Import failed: ${r}` : `匯入失敗：${r}`);
      return;
    }
    const nm = r.name || (isEn ? 'Imported Profile' : '匯入的 Profile');
    const same = profiles.find((x) => x.name === nm);
    commit(
      [{ ...r, id: newProfile(nm, capture()).id, name: nm, savedAt: Date.now() }, ...profiles.filter((x) => x.id !== same?.id)],
      same
        ? (isEn ? `Imported and overwrote "${nm}"` : `已匯入並覆蓋「${nm}」`)
        : (isEn ? `Imported "${nm}"` : `已匯入「${nm}」`)
    );
    setImportText('');
    setImportOpen(false);
  };

  const remove = (p: SavedProfile) => {
    if (confirmDel !== p.id) {
      setConfirmDel(p.id);
      return;
    }
    setConfirmDel(null);
    commit(profiles.filter((x) => x.id !== p.id), isEn ? `Deleted "${p.name}"` : `已刪除「${p.name}」`);
  };

  const classNameDisplay = isEn ? (CLASS_NAME_EN[classCode] ?? classCode) : (CLASS_CODE_ZH[classCode] ?? classCode);

  return (
    <div className="d2-panel" aria-label={isEn ? 'Builds & Profiles' : '流派與 Profile'}>
      <div className="d2-title">{isEn ? 'BUILDS & PROFILES' : '流 派 與 配 裝 Profile'}</div>
      <div className="d2-panel-body space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="d2-sub" style={{ letterSpacing: '.2em' }}>{isEn ? 'SCOPE' : '套用範圍'}</span>
          {PARTS.map((p) => (
            <label key={p.key} className="d2-field" title={isEn ? p.hintEn : p.hint}>
              <input
                type="checkbox"
                className="d2-check"
                checked={parts[p.key]}
                onChange={(e) => setParts((o) => ({ ...o, [p.key]: e.target.checked }))}
              />
              {isEn ? p.labelEn : p.label}
            </label>
          ))}
          <span className="flex-1" />
          <button
            type="button"
            className="d2-btn is-quiet"
            disabled={!canUndo}
            onClick={onUndo}
            title={isEn ? 'Revert to state before last apply' : '回到上一次套用之前的狀態'}
          >
            {isEn ? 'Undo Last Apply' : '復原上一次套用'}
          </button>
        </div>
        {none && (
          <div className="d2-sub" style={{ color: 'var(--bad)' }}>
            {isEn ? 'No options selected. Applying will not modify anything.' : '三項都沒勾選，套用不會改變任何東西。'}
          </div>
        )}

        <section aria-label={isEn ? 'Recommended Builds' : '職業流派建議'}>
          <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>
            {isEn ? `Popular ${classNameDisplay} Builds` : `${classNameDisplay}的主流流派`}
          </div>
          {builds.length === 0 ? (
            <div className="d2-empty">
              {isEn ? 'Warlock is a custom class. No community builds yet. You can create and save your own profile.' : '術士是新職業，目前還沒有足夠的社群共識流派可以收錄。可以自己配好之後存成 Profile。'}
            </div>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {builds.map((b) => {
                const main = skillByName(b.skill.main);
                const buildTitle = isEn && BUILD_NAME_EN[b.id] ? `${BUILD_NAME_EN[b.id]} (${b.name})` : b.name;
                const mainSkillName = main ? (isEn && (main as any).nameEn ? (main as any).nameEn : main.name) : b.skill.main;
                const summaryText = isEn && BUILD_SUMMARY_EN[b.id] ? BUILD_SUMMARY_EN[b.id] : b.summary;

                return (
                  <li key={b.id} className="d2-build">
                    <div className="flex items-baseline justify-between gap-2">
                      <b className="t-unique">{buildTitle}</b>
                      <span className="d2-sub">{isEn ? 'Main: ' : '主力：'}{mainSkillName}</span>
                    </div>
                    <div className="d2-sub" style={{ margin: '4px 0 8px' }}>{summaryText}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="d2-sub" style={{ width: 36 }}>{isEn ? 'Gear' : '裝備'}</span>
                      {(['start', 'bis'] as PresetTier[]).map((t) => {
                        const tierLabel = isEn ? PRESET_TIER_EN[t] : PRESET_TIER_ZH[t];
                        const btnText = isEn ? `Apply ${tierLabel} (Lv${tierOf(b, t).level})` : `套用${tierLabel}（Lv${tierOf(b, t).level}）`;
                        return (
                          <button
                            key={t}
                            type="button"
                            className={`d2-btn ${t === 'bis' ? '' : 'is-quiet'}`}
                            disabled={none}
                            onClick={() => applyTemplate(b.id, t)}
                            title={tierOf(b, t).notes}
                          >
                            {btnText}
                          </button>
                        );
                      })}
                      {(() => {
                        const pv = previews[`${b.id}:bis`];
                        if (!pv || pv.survival.minRes >= 75) return null;
                        const same = sameItems(tierOf(b, 'tankEff').items, tierOf(b, 'bis').items);
                        return (
                          <span
                            className="d2-sub"
                            style={{ color: 'var(--bad)' }}
                            title={isEn ? 'Hell penalty is -100 all resists. Gloves, belt, rings and boots are already optimized. Modifying helm, armor or weapons would compromise build identity.' : '地獄難度有 −100 抗性懲罰。頂裝已在不降技能加成與施法／攻速的條件下調整過手套、腰帶、戒指、鞋子；要再補得動頭盔、護甲、武器或盾，那就不是原本的流派了'}
                          >
                            {isEn
                              ? `BiS minimum Hell resist is ${pv.survival.minRes}%, ${same ? 'consider Maximum DR' : 'consider Balanced DR'}`
                              : `頂裝在地獄的最低抗性只有 ${pv.survival.minRes}%，${same ? '可試「極致減傷」' : '可試「平衡減傷」'}`}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="d2-sub" style={{ width: 36 }}>{isEn ? 'MF' : '尋寶'}</span>
                      {(['mfEff', 'mfMax'] as PresetTier[]).map((t) => {
                        const pv = previews[`${b.id}:${t}`];
                        const tierLabel = isEn ? PRESET_TIER_EN[t] : PRESET_TIER_ZH[t];
                        const statText = pv
                          ? (isEn
                            ? ` | MF ${pv.mf}% (Unique Eff. ${Math.floor(effectiveMf(pv.mf, 'unique'))}%) - Life ${pv.life.toLocaleString()}`
                            : `　MF ${pv.mf}%（暗金有效 ${Math.floor(effectiveMf(pv.mf, 'unique'))}%）・生命 ${pv.life.toLocaleString()}`)
                          : '';
                        return (
                          <button
                            key={t}
                            type="button"
                            className="d2-btn is-quiet"
                            disabled={none}
                            onClick={() => applyTemplate(b.id, t)}
                            title={tierOf(b, t).notes}
                          >
                            {tierLabel}{statText}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="d2-sub" style={{ width: 36 }}>{isEn ? 'DR' : '減傷'}</span>
                      {(['tankEff', 'tankMax'] as PresetTier[]).map((t) => {
                        const pv = previews[`${b.id}:${t}`];
                        // 頂裝已先依抗性修正過，平衡減傷在多數流派沒有更多可換的（會和頂裝一樣）：不放重複的按鈕
                        if (t === 'tankEff' && sameItems(tierOf(b, 'tankEff').items, tierOf(b, 'bis').items)) {
                          return (
                            <span
                              key={t}
                              className="d2-sub"
                              title={isEn ? 'No better gloves, belt, rings, or boots exist without sacrificing skill levels or FCR/IAS breakpoints' : '在不降技能加成與施法／攻擊速度的條件下，沒有比頂裝更好的手套、腰帶、戒指、鞋子'}
                            >
                              {isEn ? 'Balanced DR: Same as BiS (optimal under constraints)' : '平衡減傷：同頂裝（頂裝已是此條件下的上限）'}
                            </span>
                          );
                        }
                        const tierLabel = isEn ? PRESET_TIER_EN[t] : PRESET_TIER_ZH[t];
                        const statText = pv
                          ? (isEn
                            ? ` | DR ${pv.survival.pdr}% - Min Res ${pv.survival.minRes}% - EHP ${pv.survival.ehpPhys.toLocaleString()}`
                            : `　物減 ${pv.survival.pdr}%・最低抗性 ${pv.survival.minRes}%・有效生命 ${pv.survival.ehpPhys.toLocaleString()}`)
                          : '';
                        return (
                          <button
                            key={t}
                            type="button"
                            className="d2-btn is-quiet"
                            disabled={none}
                            onClick={() => applyTemplate(b.id, t)}
                            title={tierOf(b, t).notes}
                          >
                            {tierLabel}{statText}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="d2-sub mt-2">
            {isEn
              ? 'Presets represent popular community configurations calculated directly from game data. You can tweak and save them as your own profiles. MF and DR tiers recalculate automatically upon application. EHP combines maximum life and physical damage reduction for comparison.'
              : '範本是社群常見組合的示意，數值由遊戲資料計算，未逐件與遊戲內比對。套用後可以直接調整再存成自己的 Profile。「尋寶」「減傷」各兩檔的數字是套用後的計算值：效率／平衡檔保留流派核心、只換少數欄位；極致檔全身換成該目標最高的組合，輸出會大幅下降。有效生命只把生命與百分比減傷合成一個數字，方便比較，不是實際能吃幾下。'}
          </div>
        </section>

        <section aria-label={isEn ? 'My Saved Profiles' : '我的 Profile'} style={{ borderTop: '1px solid #2e271c', paddingTop: 12 }}>
          <div className="t-gold text-sm tracking-[.2em] mb-2" style={{ fontFamily: '"Noto Serif TC", "PMingLiU", serif', fontWeight: 700 }}>
            {isEn ? 'My Saved Profiles' : '我的 Profile'}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
              maxLength={40}
              placeholder={isEn ? 'Profile name, e.g. Blizzard Sorc Lv90' : 'Profile 名稱，例如：我的冰暴 Lv90'}
              aria-label={isEn ? 'Profile Name' : 'Profile 名稱'}
              className="d2-input flex-1"
              style={{ minWidth: 180 }}
            />
            <button type="button" className="d2-btn" onClick={save}>
              {profiles.some((p) => p.name === name.trim()) && name.trim()
                ? (isEn ? 'Overwrite' : '覆蓋儲存')
                : (isEn ? 'Save Current Setup' : '儲存目前配置')}
            </button>
            <button
              type="button"
              className="d2-btn is-quiet"
              aria-expanded={importOpen}
              onClick={() => setImportOpen((v) => !v)}
            >
              {isEn ? 'Import' : '匯入'}
            </button>
          </div>
          <div className="d2-sub mt-1">
            {isEn
              ? 'Saves current class, equipped gear, sockets, charms, skill points, level, attributes, and quest bonuses. Stored locally in this browser. Please export to backup before clearing browser data.'
              : '會儲存目前的職業、裝備與鑲嵌、咒符、技能點、等級、屬性點與任務。只存在這個瀏覽器，換瀏覽器或清除網站資料前請先「匯出」備份。'}
          </div>
          {importOpen && (
            <div className="mt-2 space-y-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={4}
                placeholder={isEn ? 'Paste exported profile JSON/text here' : '貼上匯出的 Profile 文字'}
                aria-label={isEn ? 'Import Profile Text' : '匯入 Profile'}
                className="d2-input w-full"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
              <button
                type="button"
                className="d2-btn"
                disabled={!importText.trim()}
                onClick={doImport}
              >
                {isEn ? 'Import This Profile' : '匯入這份 Profile'}
              </button>
            </div>
          )}
          {stored.rejected > 0 && (
            <div className="d2-sub mt-1" style={{ color: 'var(--bad)' }}>
              {isEn
                ? `Found ${stored.rejected} corrupted profiles in browser storage; skipped. They will be cleaned on next write.`
                : `瀏覽器裡有 ${stored.rejected} 份存檔格式損壞，已略過；下次儲存、刪除或匯入 Profile 時會一併清除。`}
            </div>
          )}
          {profiles.length === 0 ? (
            <div className="d2-empty mt-2">{isEn ? 'No saved profiles yet.' : '還沒有儲存的 Profile。'}</div>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {profiles.map((p) => {
                const pClassName = isEn ? (CLASS_NAME_EN[p.data.classCode] ?? p.data.classCode) : (CLASS_CODE_ZH[p.data.classCode] ?? p.data.classCode);
                const itemsCountText = isEn ? `${Object.keys(p.data.equipped).length} items` : `${Object.keys(p.data.equipped).length} 件裝備`;
                const dateText = new Date(p.savedAt).toLocaleDateString(isEn ? 'en-US' : 'zh-TW');

                return (
                  <li key={p.id} className="d2-build flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="min-w-0 flex-1">
                      <b className="t-unique break-all">{p.name}</b>
                      <div className="d2-sub">
                        {pClassName} | Lv{p.data.level} | {itemsCountText} | {dateText}
                      </div>
                    </div>
                    <button type="button" className="d2-btn" disabled={none} onClick={() => applyProfile(p)}>
                      {isEn ? 'Apply' : '套用'}
                    </button>
                    <button type="button" className="d2-btn is-quiet" onClick={() => copy(p)}>
                      {isEn ? 'Export' : '匯出'}
                    </button>
                    <button
                      type="button"
                      className="d2-btn is-danger"
                      onClick={() => remove(p)}
                      onBlur={() => setConfirmDel((c) => (c === p.id ? null : c))}
                    >
                      {confirmDel === p.id ? (isEn ? 'Confirm Delete' : '再按一次刪除') : (isEn ? 'Delete' : '刪除')}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
