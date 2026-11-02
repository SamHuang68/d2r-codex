import React, { useMemo, useState } from 'react';
import { GameIcon } from '../common/GameIcons';
import { PageHeader } from '../common/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { CLASS_CODE_EN, CLASS_CODE_ZH } from '../../engine/classes';
import {
  MERC_PICKS, UPGRADE_RECIPES, UPGRADE_ROWS, buildsUsing, etherealAdvice, upgradeRowOf,
  type BuildRef, type Range, type UpgradeLevel, type UpgradeRow,
} from '../../data/codex/uniqueUpgrades';

type TabId = 'player' | 'merc' | 'all';
const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 focus:outline-none focus:border-d2-gold/50 max-w-full';
const btnCls = (on: boolean): string => `px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${on ? 'bg-d2-gold text-sanctuary-950 font-bold border-d2-gold' : 'text-sanctuary-300 border-sanctuary-800 hover:text-sanctuary-100 hover:bg-sanctuary-800/50'}`;

/** 部位／武器種類的顯示名（zh, en） */
const SLOT: Record<string, [string, string]> = {
  tors: ['身體護甲', 'Body armor'], helm: ['頭盔', 'Helm'], head: ['巫毒頭顱', 'Voodoo head'], pelt: ['德魯伊頭盔', 'Pelt'], phlm: ['原始頭盔', 'Primal helm'], circ: ['頭冠', 'Circlet'],
  glov: ['手套', 'Gloves'], boot: ['靴子', 'Boots'], belt: ['腰帶', 'Belt'], shie: ['盾牌', 'Shield'], ashd: ['聖騎士盾牌', 'Auric shield'],
  swor: ['劍', 'Sword'], axe: ['斧', 'Axe'], mace: ['釘鎚', 'Mace'], hamm: ['重槌', 'Hammer'], club: ['短棒', 'Club'], scep: ['權杖', 'Scepter'], wand: ['魔杖', 'Wand'], knif: ['匕首', 'Knife'],
  spea: ['矛', 'Spear'], pole: ['長柄武器', 'Polearm'], staf: ['法杖', 'Staff'], bow: ['弓', 'Bow'], xbow: ['弩', 'Crossbow'], orb: ['法珠', 'Orb'],
  abow: ['亞馬遜弓', 'Amazon bow'], ajav: ['亞馬遜標槍', 'Amazon javelin'], aspe: ['亞馬遜矛', 'Amazon spear'], grim: ['魔導書', 'Grimoire'], tkni: ['投擲匕首', 'Throwing knife'], taxe: ['投擲斧', 'Throwing axe'], h2h2: ['雙持爪', 'Claw (dual)'],
};
const LEVEL_TONE: Record<UpgradeLevel, string> = { high: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10', mid: 'text-d2-gold border-d2-gold/40 bg-d2-gold/10', low: 'text-sanctuary-400 border-sanctuary-700 bg-sanctuary-800/40' };
const LEVEL_ORDER: Record<UpgradeLevel, number> = { high: 0, mid: 1, low: 2 };
/** 升級後力量需求達到這個值就標紅：多數角色與傭兵很難達到 */
const HIGH_STR = 150;
const SOURCE_LABEL = { maxroll: 'Maxroll', inven: 'InvenGlobal', both: 'Maxroll + InvenGlobal' } as const;

/** 把用到這件暗金的流派依職業分組（滑鼠移上去看流派名稱） */
const byClass = (list: BuildRef[]): [string, BuildRef[]][] => { const m = new Map<string, BuildRef[]>(); for (const b of list) (m.get(b.classCode) ?? m.set(b.classCode, []).get(b.classCode)!).push(b); return [...m]; };
const fmt = (r: Range): string => (r.min === r.max ? String(r.min) : `${r.min}–${r.max}`);
const gainOf = (r: UpgradeRow): number => (r.after.min + r.after.max - r.now.min - r.now.max) / 2;
const byGain = (a: UpgradeRow, b: UpgradeRow): number => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || gainOf(b) - gainOf(a) || a.nameEn.localeCompare(b.nameEn);

const LEVEL_LABEL: Record<UpgradeLevel, { zh: string; en: string }> = { high: { zh: '建議升級', en: 'Worth upgrading' }, mid: { zh: '可考慮', en: 'Consider' }, low: { zh: '提升有限', en: 'Small gain' } };

const UpgradeTable: React.FC<{ rows: UpgradeRow[]; who: 'player' | 'merc'; note?: (r: UpgradeRow) => React.ReactNode; noteHead?: string; noteHeadEn?: string }> = ({ rows, who, note, noteHead, noteHeadEn }) => {
  const { isEn, t } = useLanguage();
  const slot = (code: string) => (SLOT[code] ? SLOT[code][isEn ? 1 : 0] : code);
  const baseName = (b: UpgradeRow['from']) => (isEn ? (b.nameEnUS ?? b.nameEn) : (b.name ?? b.nameEn));
  if (rows.length === 0) return <p className="text-xs text-sanctuary-400">{t('沒有符合的暗金。', 'No matching uniques.')}</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[56rem]">
        <thead><tr className="text-sanctuary-500 text-[11px] font-mono text-left">
          <th className="font-normal pb-1 pr-3">{t('暗金', 'Unique')}</th>
          <th className="font-normal pb-1 pr-3">{t('底材（升級前 → 後）', 'Base (before → after)')}</th>
          <th className="font-normal pb-1 pr-3">{t('防禦／傷害', 'Defense / damage')}</th>
          <th className="font-normal pb-1 pr-3">{t('需求', 'Requirements')}</th>
          <th className="font-normal pb-1 pr-3">{t('升級幅度', 'Gain')}</th>
          <th className="font-normal pb-1 pr-3">{t('無形', 'Ethereal')}</th>
          {note && <th className="font-normal pb-1">{isEn ? noteHeadEn : noteHead}</th>}
        </tr></thead>
        <tbody>
          {rows.map((r) => {
            const eth = etherealAdvice(r, who);
            const stat = r.kind === 'armor' ? t('防禦', 'Def') : t('傷害', 'Dmg');
            return (
              <tr key={r.id} className="border-t border-sanctuary-800/60 align-top">
                <td className="py-2 pr-3 min-w-[8rem]">
                  <div className="text-d2-unique font-medium">{isEn ? r.nameEn : r.name}</div>
                  <div className="text-[11px] font-mono text-sanctuary-500">
                    {isEn ? slot(r.type) : `${slot(r.type)}　${r.nameEn}`}{r.cls ? ` · ${isEn ? CLASS_CODE_EN[r.cls] : CLASS_CODE_ZH[r.cls]}` : ''}
                  </div>
                </td>
                <td className="py-2 pr-3 text-sanctuary-200 min-w-[13rem]">
                  <div>{baseName(r.from)} → <span className="text-sanctuary-100 font-medium">{baseName(r.to)}</span></div>
                  <div className="text-[11px] text-sanctuary-500">{r.fromTier === 'normal' ? t('普通 → 擴充 → 傳奇（升兩階）', 'Normal → Exceptional → Elite (2 steps)') : t('擴充 → 傳奇', 'Exceptional → Elite')}</div>
                  {r.oneStep && <div className="text-[11px] text-sanctuary-400 mt-1">{isEn ? `One step only: ${baseName(r.oneStep.base)}, ${stat} ${fmt(r.oneStep.after)}, Str ${r.oneStep.reqStr}` : `只升一階：${baseName(r.oneStep.base)}，${stat} ${fmt(r.oneStep.after)}、力量 ${r.oneStep.reqStr}`}</div>}
                </td>
                <td className="py-2 pr-3 font-mono whitespace-nowrap">
                  <div className="text-sanctuary-300">{stat} {fmt(r.now)} → <span className="text-emerald-300">{fmt(r.after)}</span></div>
                  <div className="text-[11px] text-sanctuary-500">{t('無形', 'Eth')} {fmt(r.nowEth)} → {fmt(r.afterEth)}</div>
                </td>
                <td className="py-2 pr-3 font-mono whitespace-nowrap text-sanctuary-300">
                  <div className={r.reqStr[1] >= HIGH_STR ? 'text-d2-fire' : undefined} title={r.reqStr[1] >= HIGH_STR ? t('力量需求很高，請確認你或傭兵扛得住', 'Very high strength requirement; make sure you or the mercenary can meet it') : undefined}>{t('力量', 'Str')} {r.reqStr[0]} → {r.reqStr[1]}</div>
                  <div className="text-[11px] text-sanctuary-500">{t('等級', 'Lv')} {r.levelReq} → {r.levelReqAfter}</div>
                </td>
                <td className="py-2 pr-3">
                  <span className={`text-[11px] px-1.5 py-0.5 rounded border font-bold whitespace-nowrap ${LEVEL_TONE[r.level]}`}>{isEn ? LEVEL_LABEL[r.level].en : LEVEL_LABEL[r.level].zh}</span>
                  <div className="text-[11px] text-sanctuary-500 mt-1">{isEn ? r.reason.en : r.reason.zh}</div>
                </td>
                <td className="py-2 pr-3 min-w-[11rem]">
                  <span className={`text-[11px] px-1.5 py-0.5 rounded border whitespace-nowrap ${eth.ok ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' : 'text-d2-fire border-d2-fire/40 bg-d2-fire/10'}`}>{eth.ok ? t('建議無形', 'Ethereal OK') : t('不建議無形', 'Skip ethereal')}</span>
                  {eth.note && <div className="text-[11px] text-sanctuary-500 mt-1">{isEn ? eth.note.en : eth.note.zh}</div>}
                </td>
                {note && <td className="py-2 text-sanctuary-300 min-w-[10rem]">{note(r)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const UniqueUpgrades: React.FC = () => {
  const { isEn, t } = useLanguage();
  const [tab, setTab] = useState<TabId>('player');
  const [slotFilter, setSlotFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState<UpgradeLevel | ''>('');
  const [query, setQuery] = useState('');

  const used = useMemo(() => buildsUsing(), []);
  const playerRows = useMemo(() => UPGRADE_ROWS.filter((r) => used.has(r.id)).sort(byGain), [used]);
  const mercRows = useMemo(() => MERC_PICKS.flatMap((p) => { const r = upgradeRowOf(p.nameEn); return r ? [r] : []; }).sort(byGain), []);
  const slots = useMemo(() => [...new Set(UPGRADE_ROWS.map((r) => r.type))].sort((a, b) => (SLOT[a]?.[0] ?? a).localeCompare(SLOT[b]?.[0] ?? b, 'zh-Hant')), []);
  const allRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UPGRADE_ROWS.filter((r) => (!slotFilter || r.type === slotFilter) && (!levelFilter || r.level === levelFilter)
      && (!q || r.name.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q) || r.from.nameEn.toLowerCase().includes(q) || r.to.nameEn.toLowerCase().includes(q) || (r.from.name ?? '').includes(q) || (r.to.name ?? '').includes(q))).sort(byGain);
  }, [slotFilter, levelFilter, query]);
  const mercSource = (r: UpgradeRow) => SOURCE_LABEL[MERC_PICKS.find((p) => upgradeRowOf(p.nameEn)?.id === r.id)?.source ?? 'both'];
  const tabs: { id: TabId; zh: string; en: string }[] = [{ id: 'player', zh: '角色', en: 'Characters' }, { id: 'merc', zh: '傭兵', en: 'Mercenaries' }, { id: 'all', zh: '全部可升級暗金', en: 'All upgradable uniques' }];
  const stepLabel = (s: 'exceptional' | 'elite') => (s === 'exceptional' ? t('普通 → 擴充', 'Normal → Exceptional') : t('擴充 → 傳奇', 'Exceptional → Elite'));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<GameIcon name="upgrade" className="w-7 h-7" />}
        title={t('暗金升級', 'Unique Upgrades')}
        desc={t(
          '哪些暗金值得用方塊升級底材，升級後防禦與傷害差多少，以及角色與傭兵該不該用無形。',
          'Which uniques are worth upgrading in the Horadric Cube, how much defense and damage the better base adds, and when ethereal makes sense for a character versus a mercenary.',
        )}
        tone="text-d2-unique"
      />

      <section aria-label={t('升級規則', 'How upgrading works')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
        <h3 className="font-bold text-sanctuary-100">{t('升級規則', 'How upgrading works')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[32rem]">
            <thead><tr className="text-sanctuary-500 text-[11px] font-mono text-left">
              <th className="font-normal pb-1 pr-3">{t('步驟', 'Step')}</th><th className="font-normal pb-1 pr-3">{t('武器', 'Weapon')}</th><th className="font-normal pb-1 pr-3">{t('防具', 'Armor')}</th><th className="font-normal pb-1">{t('需求等級', 'Required level')}</th>
            </tr></thead>
            <tbody>
              {(['exceptional', 'elite'] as const).map((step) => {
                const w = UPGRADE_RECIPES.find((r) => r.step === step && r.kind === 'weapon'); const a = UPGRADE_RECIPES.find((r) => r.step === step && r.kind === 'armor');
                const list = (r?: typeof w) => (r ? r.inputs.map((i) => (isEn ? i.nameEn : i.name)).join(' + ') : '—');
                return (
                  <tr key={step} className="border-t border-sanctuary-800/60">
                    <td className="py-1.5 pr-3 text-sanctuary-200">{stepLabel(step)}</td>
                    <td className="py-1.5 pr-3 text-sanctuary-300">{list(w)}</td>
                    <td className="py-1.5 pr-3 text-sanctuary-300">{list(a)}</td>
                    <td className="py-1.5 font-mono text-sanctuary-300">+{w?.levelReq ?? a?.levelReq}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ul className="text-xs text-sanctuary-300 space-y-1 list-disc pl-5">
          <li>{t('材料之外，把要升級的那件暗金一起放進方塊。普通底材的暗金要升兩次才到傳奇底材。', 'Put the unique itself in the cube with the ingredients. A unique on a normal base needs two upgrades to reach an elite base.')}</li>
          <li>{t('暗金的屬性不變，變的是底材：防禦或傷害、力量需求、腰帶格數；需求等級也會增加。', 'The unique keeps its properties; only the base changes: defense or damage, strength requirement and belt slots. The required level also goes up.')}</li>
          <li>{t('無形裝備：底材防禦與傷害 +50%、力量與敏捷需求 −10，代價是耐久減半且不能修理。裝備在傭兵身上的物品不損耗耐久，所以無形對傭兵沒有代價。升級配方可用在無形裝備上，升級後仍是無形。', 'Ethereal gear: +50% base defense and damage and −10 Str/Dex requirements, at the cost of halved durability and no repairs. Items worn by a mercenary lose no durability, so ethereal is free for them. The upgrade recipes work on ethereal items, which stay ethereal.')}</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('對象', 'Audience')}>
        {tabs.map((x) => <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)} className={btnCls(tab === x.id)}>{isEn ? x.en : x.zh}</button>)}
      </div>

      {tab === 'player' && (
        <section aria-label={t('角色', 'Characters')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
          <p className="text-xs text-sanctuary-400">{t(
            '列出本站流派範本（入門與頂裝檔）用到、而且底材還能升級的暗金，依升級幅度排序。範本本身放的是未升級的底材。',
            'Uniques used in this site\'s build presets (starter and best-in-slot tiers) whose base can still be upgraded, ordered by gain. The presets themselves use the un-upgraded base.',
          )}</p>
          <UpgradeTable rows={playerRows} who="player" noteHead="用於流派" noteHeadEn="Used in builds" note={(r) => (
            <div className="flex flex-wrap gap-1">
              {byClass(used.get(r.id) ?? []).map(([code, list]) => (
                <span key={code} title={list.map((b) => (isEn ? b.main : b.name)).join(isEn ? ', ' : '、')} className="text-[10px] px-1.5 py-0.5 rounded border border-sanctuary-700 text-sanctuary-300">{isEn ? CLASS_CODE_EN[code] : CLASS_CODE_ZH[code]} × {list.length}</span>
              ))}
            </div>
          )} />
        </section>
      )}

      {tab === 'merc' && (
        <section aria-label={t('傭兵', 'Mercenaries')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
          <p className="text-xs text-sanctuary-400">{t(
            '只列頭盔與身體護甲（所有傭兵都能穿），來自 Maxroll 與 InvenGlobal 的傭兵裝備推薦。底材已是傳奇的推薦（安達莉爾的面貌、格鬥士之禍、死神喪鐘等）沒有升級可談，不在這裡。',
            'Helms and body armor only (every mercenary can wear them), taken from the Maxroll and InvenGlobal mercenary gear guides. Recommendations already on an elite base (Andariel\'s Visage, The Gladiator\'s Bane, The Reaper\'s Toll and so on) have nothing to upgrade and are not listed.',
          )}</p>
          <UpgradeTable rows={mercRows} who="merc" noteHead="推薦來源" noteHeadEn="Recommended by" note={mercSource} />
        </section>
      )}

      {tab === 'all' && (
        <section aria-label={t('全部可升級暗金', 'All upgradable uniques')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-sanctuary-300">
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('搜尋暗金或底材名稱', 'Search unique or base name')} aria-label={t('搜尋暗金或底材名稱', 'Search unique or base name')} className={`${inputCls} w-56`} />
            <select value={slotFilter} onChange={(e) => setSlotFilter(e.target.value)} aria-label={t('部位', 'Slot')} className={inputCls}>
              <option value="">{t('全部部位', 'All slots')}</option>
              {slots.map((s) => <option key={s} value={s}>{SLOT[s]?.[isEn ? 1 : 0] ?? s}</option>)}
            </select>
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as UpgradeLevel | '')} aria-label={t('升級幅度', 'Gain')} className={inputCls}>
              <option value="">{t('全部幅度', 'All gains')}</option>
              {(['high', 'mid', 'low'] as UpgradeLevel[]).map((l) => <option key={l} value={l}>{isEn ? LEVEL_LABEL[l].en : LEVEL_LABEL[l].zh}</option>)}
            </select>
            <span className="text-sanctuary-500">{isEn ? `${allRows.length} / ${UPGRADE_ROWS.length} uniques` : `${allRows.length} / ${UPGRADE_ROWS.length} 件`}</span>
          </div>
          <UpgradeTable rows={allRows} who="player" />
        </section>
      )}

      <section aria-label={t('說明與限制', 'Notes and limits')} className="text-[11px] text-sanctuary-500 space-y-1">
        <p>{t(
          '升級幅度只看升級後防禦（防具）、平均傷害（武器）與腰帶格數多了多少：+100 以上「建議升級」，+50 以上「可考慮」，腰帶多 4 格也算建議。它不判斷這件暗金本身強不強，也不看你的力量夠不夠，請對照「需求」欄。',
          'The gain only measures how much defense (armor), average damage (weapons) and belt slots increase: +100 or more is "Worth upgrading", +50 or more is "Consider", and +4 belt slots also counts. It does not judge how strong the unique itself is or whether you have the strength; check the Requirements column.',
        )}</p>
        <p>{t(
          '防禦與傷害只算底材和暗金自己的增強防禦／增強傷害與固定加成，不含每等級加成、元素傷害、鑲嵌與詞綴，是用來比較的數字，不等於遊戲內角色面板。範圍取最低到最高的底材數值與暗金詞綴範圍。',
          'Defense and damage count only the base plus the unique\'s own enhanced defense/damage and flat bonuses, not per-level bonuses, elemental damage, sockets or affixes, so they are for comparison and not the in-game sheet. Ranges run from the lowest to the highest base and affix roll.',
        )}</p>
        <p>{isEn
          ? <>Ethereal rules follow <a className="underline" href="https://www.gamerguides.com/diablo-ii-resurrected/guide/equipment/ethereal-items/ethereal-items-overview" target="_blank" rel="noopener noreferrer">GamerGuides</a> and <a className="underline" href="https://maxroll.gg/d2/resources/mercenary" target="_blank" rel="noopener noreferrer">Maxroll</a>; mercenary picks follow Maxroll and <a className="underline" href="https://www.invenglobal.com/articles/15240/guide-how-to-keep-your-mercenaries-alive-in-diablo-2-resurrected-weapons-runewords-helms-armor" target="_blank" rel="noopener noreferrer">InvenGlobal</a>. They were not re-tested in-game for the current patch, and the upgrade recipes come from the game tables.</>
          : <>無形的規則依 <a className="underline" href="https://www.gamerguides.com/diablo-ii-resurrected/guide/equipment/ethereal-items/ethereal-items-overview" target="_blank" rel="noopener noreferrer">GamerGuides</a> 與 <a className="underline" href="https://maxroll.gg/d2/resources/mercenary" target="_blank" rel="noopener noreferrer">Maxroll</a>；傭兵推薦依 Maxroll 與 <a className="underline" href="https://www.invenglobal.com/articles/15240/guide-how-to-keep-your-mercenaries-alive-in-diablo-2-resurrected-weapons-runewords-helms-armor" target="_blank" rel="noopener noreferrer">InvenGlobal</a>。這些說法沒有在目前版本的遊戲內逐項重測；升級配方來自遊戲資料表。</>}</p>
      </section>
    </div>
  );
};
