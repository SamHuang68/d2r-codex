/**
 * 建置時產生的靜態內容摘要：放進各分頁靜態外殼的 <noscript>，讓不執行 JavaScript 的爬蟲也看得到各頁的實際內容
 * （名稱、基本資料），並用連結指向每個單品頁。只讀網站本身的資料模組，不依賴瀏覽器，所以任何建置環境都能跑（vite.config.ts 的 staticRoutes 呼叫）。
 * 名稱與畫面一致：畫面上的名稱同樣來自這些資料。
 */
import basesJson from '../data/game/bases.json';
import { UNIQUE_ITEMS_DATA } from '../data/uniqueItems';
import { SET_ITEMS_DATA } from '../data/setItems';
import { RUNEWORDS_DATA } from '../data/runewords';
import { CUBE_RECIPES_DATA } from '../data/cubeRecipes';
import { getAllCraftedRecipes } from '../data/codex/craftedItems';
import { SKILLS_DATA } from '../data/skills';
import { CHARACTER_CLASSES_DATA } from '../data/classes';
import { CLASS_TRANSLATIONS } from '../data/classTranslations';
import { CLASS_ZH_TO_EN } from '../engine/slots';
import { getAboutHeader, getAboutSections } from '../data/aboutCopy';
import type { Lang } from './routes';
import { resolvedPatchNotes, resolvedNonLadder } from './patchResolve';
import { PATCH_SOURCE } from '../data/patchNotes';

const esc = (v: unknown) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface Base { code: string; type?: string; name: string; nameEn: string; nameEnUS?: string; levelReq?: number }

const section = (title: string, items: string[]) => `<section><h2>${esc(title)}（${items.length}）</h2><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></section>`;

/** 清單裡每一項都連到單品網址（相對網站根目錄：頁面的 <base> 指向根目錄，所以寫 items/<id>/；英文版多一層 en/），讓爬蟲順著連結就能走到每個單品頁 */
const link = (prefix: string, tab: string, id: string, label: string) => `<a href="${prefix}${tab}/${encodeURIComponent(id)}/">${esc(label)}</a>`;
const sectionEn = (title: string, items: string[]) => `<section><h2>${esc(title)} (${items.length})</h2><ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul></section>`;

function uniques(lang: Lang): string {
  if (lang === 'en') return sectionEn('Unique Items', UNIQUE_ITEMS_DATA.map((u) => `${link('en/', 'items', u.id, u.nameEn)} - ${esc(u.baseItemEn ?? u.baseItem)}${u.requiredLevel ? `, required level ${u.requiredLevel}` : ''}`));
  return section('暗金裝備', UNIQUE_ITEMS_DATA.map((u) => `${link('', 'items', u.id, `${u.name}（${u.nameEn}）`)}－${esc(u.baseItem)}${u.requiredLevel ? `，需求等級 ${u.requiredLevel}` : ''}`));
}

function sets(lang: Lang): string {
  if (lang === 'en') return sectionEn('Set Items', SET_ITEMS_DATA.map((set) => `${link('en/', 'items', set.id, set.nameEn)}: ${set.pieces.map((p) => link('en/', 'items', p.id, p.nameEn)).join(', ')}`));
  return section('套裝裝備', SET_ITEMS_DATA.map((set) => `${link('', 'items', set.id, `${set.name}（${set.nameEn}）`)}：${set.pieces.map((p) => link('', 'items', p.id, `${p.name}（${p.nameEn}）`)).join('、')}`));
}

function runewords(lang: Lang): string {
  if (lang === 'en') return sectionEn('Runewords', RUNEWORDS_DATA.map((rw) => `${link('en/', 'runewords', rw.id, rw.nameEn)}: ${rw.runes.map(esc).join(' + ')}, ${rw.sockets} sockets${(rw.allowedBasesEn ?? rw.allowedBases).length ? `, ${esc((rw.allowedBasesEn ?? rw.allowedBases).join(', '))}` : ''}`));
  return section('符文之語', RUNEWORDS_DATA.map((rw) => `${link('', 'runewords', rw.id, `${rw.name}（${rw.nameEn}）`)}：${rw.runes.map(esc).join(' + ')}，${rw.sockets} 孔${rw.allowedBases.length ? `，${esc(rw.allowedBases.join('、'))}` : ''}`));
}

function runes(lang: Lang): string {
  const rows = (basesJson as unknown as Base[]).filter((b) => b.type === 'rune').map((b) => ({ b, n: Number(b.code.replace(/\D/g, '')) })).sort((x, y) => x.n - y.n);
  if (lang === 'en') return sectionEn('Runes', rows.map(({ b, n }) => `${n}. ${esc((b.nameEnUS ?? b.nameEn).replace(/ Rune$/, ''))}${b.levelReq ? `, required level ${b.levelReq}` : ''}`));
  return section('符文', rows.map(({ b, n }) => `${n}. ${esc(b.name.replace(/^符文[：:]/, ''))}（${esc((b.nameEnUS ?? b.nameEn).replace(/ Rune$/, ''))}）${b.levelReq ? `，需求等級 ${b.levelReq}` : ''}`));
}

/** 版本改動頁：每個項目連到單品頁，改動逐條列出（舊值 → 新值）；非天梯新增清單與出處 */
function patches(lang: Lang): string {
  const en = lang === 'en';
  const pf = en ? 'en/' : '';
  const entries = resolvedPatchNotes();
  const sec = (v: '3.4' | '3.3') => {
    const rows = entries.filter((e) => e.entry.version === v).map((e) => `${link(pf, e.tab, e.id, en ? e.nameEn : `${e.name}（${e.nameEn}）`)}${e.entry.ladderOnly ? (en ? ' (ladder only)' : '（僅限天梯）') : ''}: ${e.entry.changes.map((c) => esc(en ? c.en : c.zh)).join(en ? '; ' : '；')}`);
    const title = en ? `Patch ${v} item changes` : `Patch ${v} 物品改動`;
    return en ? sectionEn(title, rows) : section(title, rows);
  };
  const nl = resolvedNonLadder();
  const refs = (list: { nameEn: string; ref?: { tab: 'items' | 'runewords'; id: string; name: string; nameEn: string }; aliasNote?: { zh: string; en: string } }[]) => list.map((x) => (x.ref ? `${link(pf, x.ref.tab, x.ref.id, en ? x.ref.nameEn : `${x.ref.name}（${x.ref.nameEn}）`)}${x.aliasNote ? (en ? ` (${x.aliasNote.en})` : `（${x.aliasNote.zh}）`) : ''}` : esc(x.nameEn)));
  const nlTitle = en ? 'Now available in non-ladder' : '非天梯新增';
  const nlSec = en ? sectionEn(nlTitle, [...refs(nl.items), ...refs(nl.runewords)]) : section(nlTitle, [...refs(nl.items), ...refs(nl.runewords)]);
  const src = `<p>${en ? 'Compiled from' : '整理自'} <a href="${PATCH_SOURCE.url}">${esc(PATCH_SOURCE.name)} - ${esc(PATCH_SOURCE.titleEn)}</a></p>`;
  return sec('3.4') + sec('3.3') + nlSec + src;
}

/** 資料來源與版權聲明：與互動頁面（SourcesPage）共用同一份文案來源 */
function about(lang: Lang): string {
  const sections = getAboutSections(lang);
  const header = getAboutHeader(lang);
  const blocks = sections.map(
    (s) => `<section><h2>${esc(s.title)}</h2>${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`,
  ).join('');
  return `${blocks}<p>${esc(header.footerNote)}</p>`;
}

/** 赫拉迪克方塊：標準合成公式與手工物品固定詞綴配方 */
function cube(lang: Lang): string {
  const en = lang === 'en';
  const recipeRows = CUBE_RECIPES_DATA.map((r) => {
    const title = en ? r.titleEn : r.title;
    const inputs = (en ? r.inputsEn ?? r.inputs : r.inputs).join(' + ');
    const output = en ? r.outputEn ?? r.output : r.output;
    return `<strong>${esc(title)}</strong>: ${esc(inputs)} → ${esc(output)}`;
  });
  const craftedRows = getAllCraftedRecipes().map((c) => {
    const name = en ? c.nameEn : `${c.name}（${c.nameEn}）`;
    const base = (en ? c.basesEn : c.bases).slice(0, 3).join(en ? ' / ' : '／');
    const rune = en ? `${c.runeNameEn} (#${c.runeNumber})` : `${c.runeNumber}# ${c.runeName} (${c.runeNameEn})`;
    const gem = en ? c.gemNameEn : c.gemName;
    const mods = (en ? c.fixedModsEn : c.fixedMods).join(en ? '; ' : '；');
    return `<strong>${esc(name)}</strong>: ${esc(base)} + ${esc(rune)} + ${esc(gem)} → ${esc(mods)}`;
  });
  const recSec = en ? sectionEn('Cube Recipes', recipeRows) : section('赫拉迪克方塊配方', recipeRows);
  const craftSec = en ? sectionEn('Crafted Items Recipes', craftedRows) : section('手工合成配方', craftedRows);
  return recSec + craftSec;
}

/** 技能寶典：全職業技能樹與各技能名稱／需求等級 */
function skills(lang: Lang): string {
  const en = lang === 'en';
  return SKILLS_DATA.map((grp) => {
    const clsName = en ? (CLASS_ZH_TO_EN[grp.characterClass] ?? grp.characterClass) : grp.characterClass;
    const treeBlocks = grp.trees.map((tree) => {
      const treeTitle = en ? `${clsName} — ${tree.nameEn || tree.name}` : `${clsName} — ${tree.name}`;
      const rows = tree.skills.map(
        (sk) => `${esc(en ? sk.nameEn : `${sk.name}（${sk.nameEn}）`)} (Lv ${sk.requiredLevel})`,
      );
      return en ? sectionEn(treeTitle, rows) : section(treeTitle, rows);
    }).join('');
    return treeBlocks;
  }).join('');
}

/** 角色寶典：八大職業初始屬性、成長倍率、三大技能系別與熱門流派 */
function characters(lang: Lang): string {
  const en = lang === 'en';
  return CHARACTER_CLASSES_DATA.map((cls) => {
    const tr = CLASS_TRANSLATIONS[cls.id];
    const heading = en ? `${cls.nameEn} — ${tr?.title ?? cls.title}` : `${cls.name}（${cls.nameEn}）— ${cls.title}`;
    const desc = en && tr ? tr.description : cls.description;
    const stats = en
      ? `Starting Stats: Str ${cls.startingStats.str}, Dex ${cls.startingStats.dex}, Vit ${cls.startingStats.vit}, Ene ${cls.startingStats.ene}, Life ${cls.startingStats.life}, Mana ${cls.startingStats.mana}. +${cls.statGains.lifePerVit} Life/Vit, +${cls.statGains.manaPerEne} Mana/Ene.`
      : `初始屬性：力量 ${cls.startingStats.str}、敏捷 ${cls.startingStats.dex}、體力 ${cls.startingStats.vit}、精力 ${cls.startingStats.ene}、生命 ${cls.startingStats.life}、法力 ${cls.startingStats.mana}。每點活力 +${cls.statGains.lifePerVit} 生命、每點精力 +${cls.statGains.manaPerEne} 法力。`;
    const trees = (en && tr ? tr.skillTrees : cls.skillTrees).map(
      (t) => `${esc(t.name)}: ${esc(t.keySkills.join(en ? ', ' : '、'))}`,
    );
    const builds = cls.popularBuilds.map((b, i) => {
      const bEn = tr?.popularBuilds[i];
      return `${esc(en && bEn ? bEn.name : b.name)} (${esc(b.tier)} Tier): ${esc(en && bEn ? bEn.coreSkills : b.coreSkills)}`;
    });
    return `<section><h2>${esc(heading)}</h2><p>${esc(desc)}</p><p>${esc(stats)}</p><h3>${en ? 'Skill Trees' : '技能系別'}</h3><ul>${trees.map((x) => `<li>${x}</li>`).join('')}</ul><h3>${en ? 'Meta Builds' : '推薦流派'}</h3><ul>${builds.map((x) => `<li>${x}</li>`).join('')}</ul></section>`;
  }).join('');
}

/** 配裝模擬器：功能說明與主要區塊摘要 */
function planner(lang: Lang): string {
  const en = lang === 'en';
  if (en) {
    return `<section><h2>Armory Planner Overview</h2><p>Full 1:1 Diablo II: Resurrected build simulator backed directly by the extracted game tables. Configure class, level, difficulty, quest rewards, socketables, and charms to compute stats in real time.</p></section>` +
      `<section><h2>Simulator Sections</h2><ul>` +
      `<li><strong>Inventory & Paper Doll</strong>: Equip head, armor, weapons, swap weapons, shield, gloves, belt, boots, rings, amulet, and charms, with ethereal toggle and rune/gem/jewel socketing.</li>` +
      `<li><strong>Attributes & Combat Summary</strong>: Allocate Strength, Dexterity, Vitality, and Energy; inspect Life, Mana, Defense, Block Chance, Elemental Resistances, FCR/FHR/FBR Breakpoints, Survivability (EHP & DR), and Magic Find scaling.</li>` +
      `<li><strong>Skill Trees & Auras</strong>: Allocate up to 110 skill points, toggle Warcries/Auras/Buffs, and preview main skill damage including synergies and resistance pierce.</li>` +
      `<li><strong>Mercenary Setup</strong>: Choose Act I/II/III/V mercenaries, configure level and gear, and apply mercenary auras to the character.</li>` +
      `<li><strong>Builds & Profiles</strong>: Apply starter/endgame meta templates, save custom profiles locally, and copy shareable build URLs.</li>` +
      `</ul></section>`;
  }
  return `<section><h2>1:1 配裝模擬器簡介</h2><p>依據遊戲資料表即時計算的 D2R 配裝模擬器。可選擇八大職業、設定角色等級與任務獎勵，自由搭配全身裝備、鑲嵌物與咒符，即時檢視完整角色面板與斷點。</p></section>` +
    `<section><h2>主要功能區塊</h2><ul>` +
    `<li><strong>物品欄（紙娃娃與裝備）</strong>：配置頭盔、護甲、正副手武器與盾牌、手套、腰帶、靴子、戒指、項鍊與咒符，支援無形切換與符文／寶石／珠寶鑲嵌。</li>` +
    `<li><strong>屬性與戰鬥計算</strong>：分配力量、敏捷、體力、精力，即時呈現生命、法力、防禦、格擋率、四元素抗性、FCR／FHR／FBR 斷點、物理與元素有效生命（EHP）及尋寶率（MF）遞減效益。</li>` +
    `<li><strong>技能樹與光環增益</strong>：模擬最高 110 點技能加點，計算協同與專精傷害，並可切換光環、戰吼與武器降抗效果。</li>` +
    `<li><strong>傭兵配置</strong>：選擇第一章至第五章傭兵與裝備，自動計算傭兵生命並將光環套用至角色。</li>` +
    `<li><strong>流派範本與分享</strong>：套用各職業入門／頂裝範本，於瀏覽器本地保存自訂配裝 Profile，或複製短網址分享配裝。</li>` +
    `</ul></section>`;
}

/** 分頁 id → 該頁的靜態內容摘要（HTML 片段）；沒有列出的分頁沒有摘要 */
export const staticSummary = (id: string, lang: Lang = 'zh'): string => {
  switch (id) {
    case 'items': return uniques(lang) + sets(lang);
    case 'runewords': return runewords(lang);
    case 'runes': return runes(lang);
    case 'patches': return patches(lang);
    case 'about': return about(lang);
    case 'cube': return cube(lang);
    case 'skills': return skills(lang);
    case 'characters': return characters(lang);
    case 'planner': return planner(lang);
    default: return '';
  }
};
