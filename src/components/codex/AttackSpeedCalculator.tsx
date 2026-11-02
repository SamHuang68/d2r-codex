import React, { useEffect, useMemo, useState } from 'react';
import { Swords } from 'lucide-react';
import basesJson from '../../data/game/bases.json';
import { useLanguage } from '../../context/LanguageContext';
import { CLASS_CODE_EN, CLASS_CODE_ZH } from '../../engine/classes';
import { ATTACK_CLASSES, SPEED_MAX, attackResult, weaponAnimClass, type AttackClass } from '../../engine/attackSpeed';
import type { BaseItem } from '../../engine/types';

type SiasModule = typeof import('../../engine/attackSpeedSkills');

const inputCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 font-mono focus:outline-none focus:border-d2-gold/50';
const selectCls = 'bg-sanctuary-950/80 border border-sanctuary-800 rounded-xl px-3 py-2 text-xs text-sanctuary-100 focus:outline-none focus:border-d2-gold/50 max-w-full';
const clamp = (v: string, lo: number, hi: number, dflt: number): number => (/^\d+$/.test(v.trim()) ? Math.min(hi, Math.max(lo, Number(v.trim()))) : dflt);

/** 可選的武器種類（投擲武器的普通攻擊是投擲動作、雙爪是雙持，這個公式不涵蓋，所以不列） */
const WEAPON_TYPES: { code: string; zh: string; en: string }[] = [
  { code: 'swor', zh: '刀劍', en: 'Swords' }, { code: 'axe', zh: '斧', en: 'Axes' }, { code: 'mace', zh: '釘鎚', en: 'Maces' },
  { code: 'hamm', zh: '重槌', en: 'Hammers' }, { code: 'club', zh: '短棒', en: 'Clubs' }, { code: 'scep', zh: '權杖', en: 'Scepters' },
  { code: 'wand', zh: '魔杖', en: 'Wands' }, { code: 'knif', zh: '匕首', en: 'Daggers' }, { code: 'spea', zh: '矛', en: 'Spears' },
  { code: 'pole', zh: '長柄武器', en: 'Polearms' }, { code: 'staf', zh: '法杖', en: 'Staves' }, { code: 'bow', zh: '弓', en: 'Bows' },
  { code: 'xbow', zh: '弩', en: 'Crossbows' }, { code: 'orb', zh: '法珠', en: 'Orbs' }, { code: 'abow', zh: '亞馬遜弓', en: 'Amazon Bows' },
  { code: 'aspe', zh: '亞馬遜矛', en: 'Amazon Spears' },
];
/** 技能攻速來源的顯示名（遊戲內名稱） */
const SKILL_LABEL: Record<string, { zh: string; en: string }> = {
  Fanaticism: { zh: '狂熱', en: 'Fanaticism' }, Frenzy: { zh: '狂亂連擊', en: 'Frenzy' }, Quickness: { zh: '速度爆發', en: 'Burst of Speed' },
};
const TIER_ORDER: Record<string, number> = { normal: 0, exceptional: 1, elite: 2 };
const CLASS_BY_CODE: Record<string, AttackClass> = { ama: 'ama', sor: 'sor', nec: 'nec', pal: 'pal', bar: 'bar', dru: 'dru', ass: 'ass' };

const WEAPONS = (basesJson as unknown as BaseItem[]).filter((b) => b.kind === 'weapon' && WEAPON_TYPES.some((t) => t.code === b.type));

export const AttackSpeedCalculator: React.FC = () => {
  const { isEn, t } = useLanguage();
  const [cls, setCls] = useState<AttackClass>('ama');
  const [weaponType, setWeaponType] = useState<string>('none');
  const [baseCode, setBaseCode] = useState<string>('');
  const [oneHanded, setOneHanded] = useState(false);
  const [iasText, setIasText] = useState('0');
  const [skillEn, setSkillEn] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState('20');
  const [siasText, setSiasText] = useState('0');
  const [sk, setSk] = useState<SiasModule>();

  // 技能表很大，只有要算技能攻速時才載入
  useEffect(() => { let on = true; import('../../engine/attackSpeedSkills').then((m) => { if (on) setSk(m); }); return () => { on = false; }; }, []);

  const types = useMemo(() => WEAPON_TYPES.filter((wt) => WEAPONS.some((b) => b.type === wt.code && (!b.class || CLASS_BY_CODE[b.class] === cls))), [cls]);
  const effectiveType = weaponType === 'none' || types.some((x) => x.code === weaponType) ? weaponType : 'none';
  const bases = useMemo(() => WEAPONS.filter((b) => b.type === effectiveType && (!b.class || CLASS_BY_CODE[b.class] === cls))
    .sort((a, b) => (TIER_ORDER[a.tier ?? 'normal'] - TIER_ORDER[b.tier ?? 'normal']) || (a.levelReq ?? 0) - (b.levelReq ?? 0)), [effectiveType, cls]);
  const base = effectiveType === 'none' ? undefined : bases.find((b) => b.code === baseCode) ?? bases[0];
  const canOneHand = cls === 'bar' && !!base?.twoHanded && !!base?.oneOrTwoHanded;
  const wclass = weaponAnimClass(base, canOneHand && oneHanded);
  const wsm = base?.speed ?? 0;

  const classSkills = (sk?.SIAS_SKILLS ?? []).filter((s) => s.cls === cls);
  const chosenSkill = classSkills.find((s) => s.skillEn === skillEn);
  const level = clamp(skillLevel, 1, 20, 20);
  const fromSkill = chosenSkill && sk ? sk.siasOf(chosenSkill.skillEn, level) : undefined;
  const sias = chosenSkill ? fromSkill ?? 0 : clamp(siasText, 0, 75, 0);
  const ias = clamp(iasText, 0, 1000, 0);
  const result = wclass ? attackResult(cls, wclass, ias, sias, wsm) : undefined;

  return (
    <div className="space-y-6">
      <section aria-label={t('攻速計算器', 'Attack Speed Calculator')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sanctuary-100">
          <Swords className="w-4 h-4 text-d2-fire" />
          {t('普通攻擊的影格數', 'Frames per Standard Attack')}
        </div>
        <p className="text-xs text-sanctuary-400">
          {t('選職業與武器、輸入裝備的總攻擊速度（IAS），算出每次普通攻擊要幾個影格，以及下一個斷點還差多少。', 'Pick a class and weapon, enter your total gear IAS, and see the frames per standard attack and how far the next breakpoint is.')}
        </p>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('職業', 'Class')}>
          {ATTACK_CLASSES.map((c) => (
            <button key={c} type="button" onClick={() => setCls(c)} aria-pressed={cls === c}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${cls === c ? 'bg-d2-fire text-sanctuary-950 border-d2-fire' : 'bg-sanctuary-900 text-sanctuary-300 border-sanctuary-800 hover:text-white'}`}>
              {isEn ? CLASS_CODE_EN[c] : CLASS_CODE_ZH[c]}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-sanctuary-300">
            {t('武器種類', 'Weapon type')}
            <select className={selectCls} value={effectiveType} onChange={(e) => { setWeaponType(e.target.value); setBaseCode(''); setOneHanded(false); }}>
              <option value="none">{t('空手（沒有武器）', 'Unarmed (no weapon)')}</option>
              {types.map((wt) => <option key={wt.code} value={wt.code}>{isEn ? wt.en : wt.zh}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-sanctuary-300">
            {t('武器底材', 'Weapon base')}
            <select className={selectCls} value={base?.code ?? ''} disabled={effectiveType === 'none'} onChange={(e) => { setBaseCode(e.target.value); setOneHanded(false); }}>
              {bases.map((b) => (
                <option key={b.code} value={b.code}>
                  {isEn ? (b.nameEnUS ?? b.nameEn) : b.name}（{isEn ? ({ normal: 'Normal', exceptional: 'Exceptional', elite: 'Elite' } as Record<string, string>)[b.tier ?? 'normal'] : ({ normal: '普通', exceptional: '精良', elite: '菁英' } as Record<string, string>)[b.tier ?? 'normal']}・WSM {b.speed ?? 0}）
                </option>
              ))}
            </select>
          </label>
        </div>
        {canOneHand && (
          <label className="flex items-center gap-2 text-xs text-sanctuary-300">
            <input type="checkbox" checked={oneHanded} onChange={(e) => setOneHanded(e.target.checked)} />
            {t('單手持握（野蠻人可以單手拿這把武器，改用單手動畫）', 'Wield one-handed (Barbarian only; uses the one-handed animation)')}
          </label>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-sanctuary-300">
            {t('裝備總攻擊速度 IAS（%，含主手武器，不含副手）', 'Total gear IAS (%, incl. main-hand weapon, excl. off-hand)')}
            <input type="text" inputMode="numeric" value={iasText} onChange={(e) => setIasText(e.target.value)} aria-label={t('裝備總 IAS', 'Total gear IAS')} className={inputCls} />
          </label>
          <div className="flex flex-col gap-1 text-xs text-sanctuary-300">
            {t('技能攻速 SIAS（%）', 'Skill IAS (SIAS, %)')}
            <div className="flex flex-wrap items-center gap-2">
              {classSkills.length > 0 && (
                <select className={selectCls} value={chosenSkill ? chosenSkill.skillEn : ''} onChange={(e) => setSkillEn(e.target.value)} aria-label={t('技能來源', 'Skill source')}>
                  <option value="">{t('手動輸入', 'Manual')}</option>
                  {classSkills.map((s) => <option key={s.skillEn} value={s.skillEn}>{isEn ? SKILL_LABEL[s.skillEn].en : SKILL_LABEL[s.skillEn].zh}</option>)}
                </select>
              )}
              {chosenSkill ? (
                <>
                  <span>{t('等級', 'Lv')}</span>
                  <input type="text" inputMode="numeric" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} aria-label={t('技能等級', 'Skill level')} className={`${inputCls} w-16`} />
                  <span className="font-mono text-d2-gold">= {sias}%</span>
                </>
              ) : (
                <input type="text" inputMode="numeric" value={siasText} onChange={(e) => setSiasText(e.target.value)} aria-label={t('技能攻速', 'Skill IAS')} className={`${inputCls} w-24`} />
              )}
            </div>
          </div>
        </div>
      </section>

      {!wclass ? (
        <p className="text-sm text-sanctuary-500">{t('這把武器目前不支援。', 'This weapon is not supported yet.')}</p>
      ) : !result ? (
        <p className="text-sm text-sanctuary-500">{t('遊戲資料裡沒有這個職業用這類武器的攻擊動畫。', 'The game data has no attack animation for this class and weapon type.')}</p>
      ) : (
        <>
          <section aria-label={t('計算結果', 'Result')} className="bg-sanctuary-900/60 p-5 rounded-2xl border border-sanctuary-800 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-sanctuary-300">
              <div><div className="text-sanctuary-500">{t('有效 IAS（EIAS）', 'Effective IAS (EIAS)')}</div><div className="font-mono text-lg text-sanctuary-100">{result.eias}%</div></div>
              <div><div className="text-sanctuary-500">{t('武器速度 WSM', 'Weapon speed (WSM)')}</div><div className="font-mono text-lg text-sanctuary-100">{wsm}</div></div>
              <div><div className="text-sanctuary-500">{t('技能 IAS', 'Skill IAS')}</div><div className="font-mono text-lg text-sanctuary-100">{sias}%</div></div>
              <div><div className="text-sanctuary-500">{t(`速度加成（上限 ${SPEED_MAX}）`, `Speed bonus (cap ${SPEED_MAX})`)}</div><div className="font-mono text-lg text-d2-gold">{result.bonus}%{result.capped ? t('（已到上限）', ' (capped)') : ''}</div></div>
            </div>
            {result.rows.map((row) => (
              <div key={row.modes.join('')} className="border-t border-sanctuary-850 pt-3 space-y-3">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <div className="text-xs text-sanctuary-500">{row.modes.join(' / ')}{t('　動畫', ' animation')} {row.anim[0]} {t('影格', 'frames')}{row.anim[1] !== 256 ? `（${t('動畫速度', 'speed')} ${row.anim[1]}）` : ''}</div>
                  <div className="text-sanctuary-100"><b className="font-mono text-2xl text-d2-gold">{row.frames}</b> {t('影格／次', 'frames/attack')}　<span className="font-mono">{row.perSecond.toFixed(2)}</span> {t('次／秒', 'attacks/sec')}</div>
                  <div className="text-xs text-sanctuary-300">
                    {row.next
                      ? t(`下一個斷點：${row.next.ias}% IAS → ${row.next.frames} 影格（還差 ${row.next.missing}%）`, `Next breakpoint: ${row.next.ias}% IAS → ${row.next.frames} frames (${row.next.missing}% to go)`)
                      : t('已是最快檔位', 'Already at the fastest breakpoint')}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-sanctuary-400 border-b border-sanctuary-800">
                      <tr><th className="py-1.5 pr-4">{t('裝備 IAS 需要', 'Gear IAS needed')}</th><th className="py-1.5 pr-4">{t('影格', 'Frames')}</th><th className="py-1.5 pr-4">{t('次／秒', 'Attacks/sec')}</th><th className="py-1.5">{t('狀態', 'Status')}</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sanctuary-850">
                      {row.breakpoints.map((bp) => {
                        const reached = ias >= bp.ias;
                        const current = bp.frames === row.frames;
                        return (
                          <tr key={bp.ias} className={current ? 'bg-d2-gold/10' : undefined}>
                            <td className="py-1.5 pr-4 font-mono"><button type="button" onClick={() => setIasText(String(bp.ias))} className="text-d2-gold hover:underline" aria-label={t(`把 IAS 設成 ${bp.ias}`, `Set IAS to ${bp.ias}`)}>{bp.ias}%</button></td>
                            <td className="py-1.5 pr-4 font-mono text-sanctuary-100">{bp.frames}</td>
                            <td className="py-1.5 pr-4 font-mono text-sanctuary-300">{(25 / bp.frames).toFixed(2)}</td>
                            <td className="py-1.5 text-sanctuary-400">{current ? t('目前', 'Current') : reached ? t('已超過', 'Passed') : t(`還差 ${bp.ias - ias}%`, `${bp.ias - ias}% to go`)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      <section className="text-xs text-sanctuary-500 space-y-1.5 px-1" aria-label={t('說明與限制', 'Notes and limits')}>
        <p>{t('動畫影格數與武器速度來自遊戲檔案；公式採 Maxroll〈Attack Speed〉（2026-02 更新），速度加成的上限 75 與下限 −85 來自 DiabloBytes 的 IAS 計算機。同一組公式與動畫資料也能重現社群整理的快速施法（FCR）斷點。', 'Animation frames and weapon speed come from the game files. The formula follows Maxroll\'s "Attack Speed" article (updated 2026-02); the +75 cap and −85 floor come from the DiabloBytes IAS calculator. The same formula and animation data reproduce the community FCR breakpoint tables.')}</p>
        <p>{t('還沒涵蓋：雙持（野蠻人、刺客雙爪）、刺擊／衝鋒／雷爪等序列技能、旋風斬、狂熱／狂怒／掃射等輪迴技能、變形（狼人、熊人、吸血鬼）、投擲武器、術士。實際遊戲內影格以你自己的實測為準。', 'Not covered yet: dual wielding (Barbarian, Assassin claws), sequence skills (Jab, Charge, Claws of Thunder…), Whirlwind, rollback skills (Zeal, Fury, Strafe), shapeshifting, throwing weapons, and the Warlock. Verify in game when it matters.')}</p>
      </section>
    </div>
  );
};
