/**
 * 百科頁的符文之語資料：由遊戲資料表（game/runewords.json）即時產生，不再另存一份。
 * 屬性行＝符文之語本身的屬性＋符文鑲嵌後的效果（依可用底材類型：武器／防具／盾牌），與遊戲內完成後的提示框一致。
 * 標籤、天梯標示、舊 id、舊譯名來自覆蓋層 codex/overlay.json。
 * 對齊參考來源 https://d2r.world/zh-TW：
 * - 具備雙部位獨立組成之符文組（歇斯底里、剛毅、精神、鳳凰、變化）完整呈現【護甲】／【武器】／【盾牌】／【共通】屬性區塊
 * - 歇斯底里（Hustle）護甲版與武器版（狂躁）統一為「歇斯底里」，可用底材同時具備武器與護甲
 */
import type { RunewordData } from '../types';
import runewordsJson from './game/runewords.json';
import { gameData } from '../engine/data';
import type { Modifier } from '../engine/types';
import { overlay, slug, uniqueId } from './codex/common';
import { modLines } from './codex/itemLines';

interface Row { id: string; nameEn: string; nameEnUS?: string; name: string; patch?: string; itypes: string[]; etypes: string[]; runes: string[]; runeNamesEn: string[]; sockets: number; mods: Modifier[] }
const rows = runewordsJson as unknown as Row[];

/** 遊戲物品類型代碼 → 百科頁的「可用底材」中文名 */
const ITYPE_ZH: Record<string, string> = {
  weap: '武器', mele: '近戰武器', miss: '弓或弩', swor: '刀劍', axe: '斧', mace: '釘鎚', club: '短棒', hamm: '重槌', scep: '權杖',
  pole: '長柄武器', spea: '長矛', staf: '法杖', wand: '魔杖', knif: '匕首', h2h: '爪或拳刃',
  tors: '護甲', helm: '頭盔', shld: '盾牌', pala: '聖騎士盾牌', ashd: '聖騎士盾牌', head: '巫毒頭顱', grim: '魔典',
};

const ITYPE_EN: Record<string, string> = {
  weap: 'Weapons', mele: 'Melee Weapons', miss: 'Missile Weapons', swor: 'Swords', axe: 'Axes', mace: 'Maces', club: 'Clubs', hamm: 'Hammers', scep: 'Scepters',
  pole: 'Polearms', spea: 'Spears', staf: 'Staves', wand: 'Wands', knif: 'Daggers', h2h: 'Claws',
  tors: 'Body Armor', helm: 'Helms', shld: 'Shields', pala: 'Paladin Shields', ashd: 'Paladin Shields', head: 'Shrunken Heads', grim: 'Grimoires',
};

type Cat = 'weapon' | 'armor' | 'shield';
/** 物品類型代碼可鑲在哪一類底材（符文效果分武器／護甲／盾牌三種）：由遊戲底材的類型階層推得 */
const catOfType = new Map<string, Set<Cat>>();
for (const b of gameData.bases) {
  if (b.kind === 'misc') continue;
  const cat: Cat = b.kind === 'weapon' ? 'weapon' : b.ancestors.includes('shld') ? 'shield' : 'armor';
  for (const t of b.ancestors) (catOfType.get(t) ?? catOfType.set(t, new Set()).get(t)!).add(cat);
}
const gemByCode = new Map(gameData.gems.map((g) => [g.code, g]));
const runeLevel = new Map(gameData.bases.filter((b) => b.type === 'rune').map((b) => [b.code, b.levelReq ?? 0]));

const used = new Set<string>(Object.values(overlay.runewords).map((o) => o.id as string));

const eff = (code: string, c: Cat) => gemByCode.get(code)?.[c] ?? [];

/** 比較並拆分符文在兩個部位的效果為「共通」、「A專屬」與「B專屬」 */
function partitionModifiers(code: string, catA: Cat, catB: Cat): { common: Modifier[]; onlyA: Modifier[]; onlyB: Modifier[] } {
  const effA = eff(code, catA);
  const effB = eff(code, catB);
  const common: Modifier[] = [];
  const onlyA: Modifier[] = [];
  const onlyB: Modifier[] = [];

  const matchedB = new Set<number>();
  for (const ma of effA) {
    const aStr = JSON.stringify(ma);
    const bIdx = effB.findIndex((mb, idx) => !matchedB.has(idx) && JSON.stringify(mb) === aStr);
    if (bIdx >= 0) {
      common.push(ma);
      matchedB.add(bIdx);
    } else {
      onlyA.push(ma);
    }
  }
  effB.forEach((mb, idx) => {
    if (!matchedB.has(idx)) onlyB.push(mb);
  });

  return { common, onlyA, onlyB };
}

export const RUNEWORDS_DATA: RunewordData[] = (() => {
  const out: RunewordData[] = [];
  const hustleWeaponRow = rows.find((r) => r.id === 'hustle_weapon_172');

  for (const r of rows) {
    // 歇斯底里（Hustle）：遊戲資料表中 Row 171 為護甲、Row 172 為武器（暴雪舊譯名狂躁）
    // 依 d2r.world 權威標準統一為一筆「歇斯底里」，包含護甲與武器雙重組成
    if (r.id === 'hustle_weapon_172') continue;

    const o = overlay.runewords[r.id];
    const isHustle = r.id === 'hustle_armor_171';

    if (isHustle && hustleWeaponRow) {
      const armorMods: Modifier[] = [...r.mods];
      const weaponMods: Modifier[] = [...hustleWeaponRow.mods];
      const commonMods: Modifier[] = [];

      for (const code of r.runes) {
        const { common, onlyA: onlyW, onlyB: onlyA } = partitionModifiers(code, 'weapon', 'armor');
        commonMods.push(...common);
        weaponMods.push(...onlyW);
        armorMods.push(...onlyA);
      }

      const attributes: string[] = [
        '【護甲】',
        ...modLines(armorMods),
        '【武器】',
        ...modLines(weaponMods),
        '【共通】',
        ...modLines(commonMods),
      ];

      out.push({
        id: 'hustle',
        name: '歇斯底里',
        nameEn: 'Hustle',
        nameClassic: '狂躁 / 催促',
        runes: r.runeNamesEn.map((n) => n.replace(/ Rune$/, '')),
        runeNumbers: r.runes.map((c) => Number(c.replace(/\D/g, ''))),
        sockets: r.sockets,
        allowedBases: ['武器', '護甲'],
        allowedBasesEn: ['Weapons', 'Body Armor'],
        requiredLevel: Math.max(0, ...r.runes.map((c) => runeLevel.get(c) ?? 0)),
        ladderOnly: true,
        isNewDLC: true,
        attributes,
        tags: o?.tags ?? ['攻速', '靈氣', '跑步速度', '打擊恢復'],
        recommendedBases: '幻化之刃 / 統御者鎧甲 / 灰暮罩衣',
        description: '2.6 新增符文之語。武器版賦予狂熱靈氣與擊中觸發速度爆發，為絕佳副手或起步武器；防具版提供極高跑速、攻速與打擊恢復。',
      });
      continue;
    }

    if (r.id === 'metamorphosis_174') {
      // 變化（Metamorphosis）：頭盔，但具備狼之印記與熊之印記兩種形態加成
      const commonMods: Modifier[] = [...r.mods.filter((m) => m.code !== 'hit-skill')];
      for (const code of r.runes) commonMods.push(...eff(code, 'armor'));
      const attributes: string[] = [
        '【共通】',
        '狼人變化的攻擊會賦予印記，持續 180 秒',
        '熊人變化的攻擊會賦予印記，持續 180 秒',
        ...modLines(commonMods),
        '【狼之印記】',
        '+30% 準確率加成',
        '生命上限提高 40%',
        '【熊之印記】',
        '攻擊速度 +25%',
        '受到的物理傷害降低 8%',
      ];
      out.push({
        id: o?.id ?? uniqueId(slug(r.nameEnUS ?? r.nameEn), used, r.id),
        name: r.name,
        nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
        nameClassic: o?.nameClassic,
        runes: r.runeNamesEn.map((n) => n.replace(/ Rune$/, '')),
        runeNumbers: r.runes.map((c) => Number(c.replace(/\D/g, ''))),
        sockets: r.sockets,
        allowedBases: [...new Set(r.itypes.map((t) => ITYPE_ZH[t] ?? t))],
        allowedBasesEn: [...new Set(r.itypes.map((t) => ITYPE_EN[t] ?? t))],
        requiredLevel: Math.max(0, ...r.runes.map((c) => runeLevel.get(c) ?? 0)),
        ladderOnly: o?.ladderOnly ?? false,
        isNewDLC: o?.isNewDLC ?? true,
        attributes,
        tags: o?.tags ?? [],
        recommendedBases: o?.recommendedBases,
        description: o?.description,
      });
      continue;
    }

    const cats = new Set<Cat>();
    r.itypes.forEach((t) => catOfType.get(t)?.forEach((c) => cats.add(c)));

    const hasWeapon = cats.has('weapon');
    const hasArmor = cats.has('armor');
    const hasShield = cats.has('shield');

    if (hasWeapon && (hasArmor || hasShield)) {
      // 跨部位符文組：剛毅（武器+護甲）、精神（武器+盾牌）、鳳凰（武器+盾牌）
      const otherCat: Cat = hasArmor ? 'armor' : 'shield';
      const otherLabel = hasArmor ? '護甲' : '盾牌';

      const commonMods: Modifier[] = [...r.mods];
      const weaponMods: Modifier[] = [];
      const otherMods: Modifier[] = [];

      for (const code of r.runes) {
        const { common, onlyA: onlyW, onlyB: onlyO } = partitionModifiers(code, 'weapon', otherCat);
        commonMods.push(...common);
        weaponMods.push(...onlyW);
        otherMods.push(...onlyO);
      }

      const attributes: string[] = [
        `【${otherLabel}】`,
        ...modLines(otherMods),
        '【武器】',
        ...modLines(weaponMods),
        '【共通】',
        ...modLines(commonMods),
      ];

      out.push({
        id: o?.id ?? uniqueId(slug(r.nameEnUS ?? r.nameEn), used, r.id),
        name: r.name,
        nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
        nameClassic: o?.nameClassic,
        runes: r.runeNamesEn.map((n) => n.replace(/ Rune$/, '')),
        runeNumbers: r.runes.map((c) => Number(c.replace(/\D/g, ''))),
        sockets: r.sockets,
        allowedBases: [...new Set(r.itypes.map((t) => ITYPE_ZH[t] ?? t))],
        allowedBasesEn: [...new Set(r.itypes.map((t) => ITYPE_EN[t] ?? t))],
        requiredLevel: Math.max(0, ...r.runes.map((c) => runeLevel.get(c) ?? 0)),
        ladderOnly: o?.ladderOnly ?? false,
        isNewDLC: o?.isNewDLC,
        attributes,
        tags: o?.tags ?? [],
        recommendedBases: o?.recommendedBases,
        description: o?.description,
      });
      continue;
    }

    // 一般情況（單一部位，或防具+盾牌如飛龍、頭盔+盾牌如夢境）
    const common: Modifier[] = [...r.mods];
    const tagged: Record<string, Modifier[]> = {};
    const armorLabel = r.itypes.includes('tors') ? '護甲' : r.itypes.includes('helm') ? '頭盔' : '護甲';
    for (const code of r.runes) {
      if (cats.has('weapon')) common.push(...eff(code, 'weapon'));
      if (cats.has('armor') && cats.has('shield')) {
        const a = eff(code, 'armor'); const s = eff(code, 'shield');
        if (JSON.stringify(a) === JSON.stringify(s)) common.push(...a);
        else { (tagged[armorLabel] ??= []).push(...a); (tagged['盾牌'] ??= []).push(...s); }
      } else {
        if (cats.has('armor')) common.push(...eff(code, 'armor'));
        if (cats.has('shield')) common.push(...eff(code, 'shield'));
      }
    }
    const attributes = [...modLines(common), ...Object.entries(tagged).flatMap(([tag, ms]) => modLines(ms).map((l) => `${l} （只限${tag}）`))];
    out.push({
      id: o?.id ?? uniqueId(slug(r.nameEnUS ?? r.nameEn), used, r.id),
      name: r.name,
      nameEn: o?.nameEn ?? r.nameEnUS ?? r.nameEn,
      nameClassic: o?.nameClassic,
      runes: r.runeNamesEn.map((n) => n.replace(/ Rune$/, '')),
      runeNumbers: r.runes.map((c) => Number(c.replace(/\D/g, ''))),
      sockets: r.sockets,
      allowedBases: [...new Set(r.itypes.map((t) => ITYPE_ZH[t] ?? t))],
      allowedBasesEn: [...new Set(r.itypes.map((t) => ITYPE_EN[t] ?? t))],
      requiredLevel: Math.max(0, ...r.runes.map((c) => runeLevel.get(c) ?? 0)),
      ladderOnly: o?.ladderOnly ?? false,
      isNewDLC: o?.isNewDLC,
      attributes,
      tags: o?.tags ?? [],
      recommendedBases: o?.recommendedBases,
      description: o?.description,
    });
  }
  return out;
})();
