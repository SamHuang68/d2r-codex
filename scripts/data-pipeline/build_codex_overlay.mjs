// 由「舊百科資料」一次性產生覆蓋層 src/data/codex/overlay.json：
//   遊戲資料表（src/data/game/*.json）沒有、但百科頁使用者看得到的內容（舊 id、公開英文名、舊譯名、標籤、備註、
//   技能戰術解析、社群別名…），以遊戲資料表的 id 為鍵。百科頁的物品／技能資料全部由遊戲資料表即時產生，
//   覆蓋層只補這些編輯性內容，不是第二份物品資料。
// 用法：node scripts/data-pipeline/build_codex_overlay.mjs <舊資料根目錄> [輸出檔=src/data/codex/overlay.json]
//   舊資料根目錄需含 src/data/*.ts：git archive e5b3f02 src/data src/types | tar -x -C <dir>
import fs from 'node:fs';
import path from 'node:path';
import { loadCodex, loadGame, loadLegacy, matchLists, norm, normLine, SKILL_ALIASES, slug, zhn } from './lib/legacy_match.mjs';

const legacyRoot = process.argv[2];
if (!legacyRoot) { console.error('用法：node scripts/data-pipeline/build_codex_overlay.mjs <舊資料根目錄> [輸出檔]'); process.exit(1); }
const outFile = process.argv[3] || 'src/data/codex/overlay.json';
const L = await loadLegacy(legacyRoot);
const gUniques = loadGame('uniques'), gSetItems = loadGame('setItems'), gSets = loadGame('sets'), gRunewords = loadGame('runewords'), gBases = loadGame('bases');
const gSkills = loadGame('skills');
// 專案既有的物品圖片對照（遊戲目錄 id → 圖片）；舊百科的圖片網址若與它不同，保留在覆蓋層
const imageMap = JSON.parse(fs.readFileSync('src/data/catalogImageMap.json', 'utf8'));
const REMOTE = 'https://static.d2r.world/img/items/';
const imageOf = (key, code) => { const v = key in imageMap.byId ? imageMap.byId[key] : imageMap.byBaseCode[code]; return v ? (v.startsWith('images/') ? v : REMOTE + v) : undefined; };
const strip = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)));
const overlay = { _meta: { source: '舊百科資料（commit e5b3f02 的 src/data/*.ts）', generator: 'scripts/data-pipeline/build_codex_overlay.mjs', note: '鍵為遊戲資料表 id；只存與遊戲表預設值不同的欄位。手動維護，勿重跑覆蓋（見 README）' } };
const HEAD = /^(防禦：|需要|耐久度|武器基本速度|單手傷害：|雙手傷害：|重擊傷害：|踢擊傷害：|投擲傷害：|範圍: |格擋機率：|腰帶空間|數量：|最大堆疊)/;

// ── 暗金 ──
{
  const m = matchLists(L.UNIQUE_ITEMS_DATA, gUniques, { prefer: (o, n) => zhn(o.baseItem) === zhn(n.baseName) });
  const out = {};
  for (const { o, n } of m.pairs) {
    const e = strip({ id: o.id, nameEn: o.nameEn !== (n.nameEnUS ?? n.nameEn) ? o.nameEn : undefined, nameClassic: o.nameClassic && o.nameClassic !== o.name ? o.nameClassic : undefined });
    // Rift 護身符的 Crafted／PreCrafted 是範本（詞綴隨機），遊戲表沒有可用的屬性，沿用舊資料的屬性行
    if (/^(Pre)?Crafted /.test(n.nameEn)) e.staticLines = o.attributes.filter((a) => !HEAD.test(a));
    if (o.imageUrl && o.imageUrl !== imageOf(`unique:${n.id}`, n.code)) e.imageUrl = o.imageUrl;
    if (Object.keys(e).length) out[n.id] = e;
  }
  overlay.uniques = out; console.log('暗金', m.pairs.length, '配對，覆蓋', Object.keys(out).length);
}
// ── 套裝 ──
{
  const ms = matchLists(L.SET_ITEMS_DATA, gSets);
  const sets = {};
  const pieceIdx = new Map();
  const oldPieces = L.SET_ITEMS_DATA.flatMap((s) => s.pieces);
  const mp = matchLists(oldPieces, gSetItems);
  const pieces = {};
  for (const { o, n } of mp.pairs) {
    const e = strip({ id: o.id, nameEn: o.nameEn !== (n.nameEnUS ?? n.nameEn) ? o.nameEn : undefined, nameClassic: o.nameClassic && o.nameClassic !== o.name ? o.nameClassic : undefined, imageUrl: o.imageUrl && o.imageUrl !== imageOf(`set:${n.id}`, n.code) ? o.imageUrl : undefined });
    if (Object.keys(e).length) pieces[n.id] = e;
  }
  // 套裝內單件的顯示順序沿用舊百科（遊戲表是依列號排列）
  const gameOfOld = new Map(mp.pairs.map(({ o, n }) => [o.id, n.id]));
  for (const { o, n } of ms.pairs) sets[n.id] = strip({ id: o.id, nameEn: o.nameEn !== (n.nameEnUS ?? n.nameEn) ? o.nameEn : undefined, isClassSet: o.isClassSet || undefined, class: o.class || undefined, order: o.pieces.map((p) => gameOfOld.get(p.id)).filter(Boolean) });
  overlay.sets = sets; overlay.setItems = pieces; console.log('套裝', ms.pairs.length, '套', mp.pairs.length, '件');
}
// ── 符文之語 ──
{
  const m = matchLists(L.RUNEWORDS_DATA, gRunewords);
  const out = {};
  for (const { o, n } of m.pairs) {
    out[n.id] = strip({ id: o.id, nameEn: o.nameEn !== (n.nameEnUS ?? n.nameEn) ? o.nameEn : undefined, nameClassic: o.nameClassic && o.nameClassic !== o.name ? o.nameClassic : undefined, tags: o.tags, ladderOnly: o.ladderOnly || undefined, isNewDLC: o.isNewDLC || undefined, recommendedBases: o.recommendedBases, description: o.description });
  }
  overlay.runewords = out; console.log('符文之語', m.pairs.length);
}
// ── 底材（防具＋武器） ──
{
  const gEq = gBases.filter((b) => b.kind !== 'misc');
  const m = matchLists(L.BASE_ITEMS_DATA, gEq, { prefer: (o, n) => zhn(o.name) === zhn(n.name) });
  const out = {};
  for (const { o, n } of m.pairs) {
    const e = strip({ id: o.id, nameEn: o.nameEn.trim() !== (n.nameEnUS ?? n.nameEn) ? o.nameEn.trim() : undefined, nameClassic: o.nameClassic, imageUrl: o.imageUrl && o.imageUrl !== imageOf(`base:${n.code}`, n.code) ? o.imageUrl : undefined, itemType: o.itemType !== '鎧甲防具' && o.itemType !== '武器鑲材' ? o.itemType : undefined, speedGrade: o.speedGrade !== '-' ? o.speedGrade : undefined, attackSpeedModifier: o.attackSpeedModifier || undefined, recommendedRunewords: o.recommendedRunewords, tacticalNotes: o.tacticalNotes, dropRecommendation: o.dropRecommendation, isSuperiorValued: o.isSuperiorValued || undefined, isEthPreferred: o.isEthPreferred || undefined });
    if (Object.keys(e).length) out[n.code] = e;
  }
  overlay.bases = out; console.log('底材', m.pairs.length, '配對，覆蓋', Object.keys(out).length);
}
// ── 符文 ──
{
  const out = {};
  for (const r of L.RUNES_DATA) out[r.number] = strip({ nameEn: r.nameEn, cubeRecipe: r.cubeRecipe, oldName: r.name });
  overlay.runes = out; console.log('符文', L.RUNES_DATA.length);
}
// ── 技能 ──
{
  const classCode = { 亞馬遜: 'ama', 魔法使: 'sor', 死靈法師: 'nec', 聖騎士: 'pal', 野蠻人: 'bar', 德魯伊: 'dru', 刺客: 'ass', 術士: 'war' };
  const byNorm = new Map(gSkills.map((s) => [`${s.charClass}:${norm(s.nameEn)}`, s]));
  const out = {}; const idMap = new Map(); let unmatched = 0; const trees = {};
  for (const c of L.SKILLS_DATA) for (const t of c.trees) for (const s of t.skills) {
    const cc = classCode[c.characterClass];
    let g = byNorm.get(`${cc}:${norm(s.nameEn)}`);
    if (!g) g = gSkills.find((x) => x.charClass === cc && zhn(x.name) === zhn(s.name));
    if (!g && SKILL_ALIASES[s.nameEn]) g = byNorm.get(`${cc}:${norm(SKILL_ALIASES[s.nameEn])}`);
    if (!g) { unmatched++; continue; } // 術士 30 招為虛構，不進覆蓋層
    idMap.set(s.id, g);
    // 舊技能樹 → 遊戲技能頁：取該樹技能的多數頁碼；樹的說明文字是手寫的，遊戲表沒有
    ((trees[`${cc}/${t.name}`] ||= { code: cc, pages: {}, description: t.description }).pages[g.page] = ((trees[`${cc}/${t.name}`].pages[g.page]) || 0) + 1);
    // 舊中文名含括號別名（如「戰鬥體質 (BO / 戰鬥號令)」）：拆成搜尋別名；與遊戲官方名相同者不重複
    const aliases = [...new Set([s.name, ...[...s.name.matchAll(/[（(]([^）)]+)[）)]/g)].flatMap((m) => m[1].split('/').map((x) => x.trim())), s.name.replace(/\s*[（(][^）)]*[）)]/g, '').trim()].filter((a) => a && a !== g.name))];
    out[g.id] = strip({ nameEn: s.nameEn !== (g.nameEnUS ?? g.nameEn) ? s.nameEn : undefined, aliases, details: s.details });
  }
  overlay.skills = out;
  overlay.trees = Object.fromEntries(Object.values(trees).map((x) => [`${x.code}/${Object.entries(x.pages).sort((a, b) => b[1] - a[1])[0][0]}`, { description: x.description }]));
  // 舊協同表中遊戲表展開式沒有的條目：保留並標示，不靜默刪除（其中少數在遊戲技能的其他計算式有引用）
  const gameRel = new Set();
  for (const t of L.GAME_SKILLS) for (const x of L.synergySources(t, {}).sources) gameRel.add(`${x.skill.id}>${t.id}`);
  const legacySynergies = [];
  for (const r of L.SYNERGY_RELATIONS) {
    const a = idMap.get(r.sourceId), b = idMap.get(r.targetId); if (!a || !b) continue;
    if (gameRel.has(`${a.id}>${b.id}`)) continue; // 遊戲表有的由計算式展開（百分比以遊戲表為準）
    const calc = JSON.stringify({ e: b.elem, p: b.phys, a: b.auraStats, s: b.passiveStats, par: b.params });
    legacySynergies.push({ source: a.id, target: b.id, percent: r.percentPerPoint, type: r.bonusType, text: r.displayText, gameCalcReferencesSource: calc.includes(`skill('${a.nameEn}'`) });
  }
  overlay.legacySynergies = legacySynergies;
  console.log('技能', Object.keys(out).length, '招；未配對（術士虛構）', unmatched, '；舊協同（遊戲表無此條）', legacySynergies.length, '其中遊戲計算式有引用', legacySynergies.filter((x) => x.gameCalcReferencesSource).length);
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(overlay));
console.log('輸出', outFile, (fs.statSync(outFile).size / 1024).toFixed(1), 'KB');

// ── 第二階段：遊戲表無法描述的屬性（未定義的屬性、觸發技能等級 0）改附舊百科的文字行 ──
// 需要用剛寫出的覆蓋層建置百科資料，所以只在輸出到預設位置時執行
if (path.resolve(outFile) === path.resolve('src/data/codex/overlay.json')) {
  const N = await loadCodex();
  const props = loadGame('properties'); const lc = new Map(Object.keys(props).map((k) => [k.toLowerCase(), k]));
  const trigger = new Set(['att-skill', 'hit-skill', 'gethit-skill', 'kill-skill', 'death-skill', 'levelup-skill']);
  const problem = (m) => !lc.has(m.code.toLowerCase()) || (trigger.has(m.code.toLowerCase()) && !m.max);
  const hidden = new Set(['roguesbow-affix1', 'skilltab-war', 'bloody', 'cold-len']); // 描述層已處理或刻意不顯示
  const m = matchLists(L.UNIQUE_ITEMS_DATA, gUniques, { prefer: (o, n) => zhn(o.baseItem) === zhn(n.baseName) });
  let n = 0;
  for (const { o, n: g } of m.pairs) {
    if (/^(Pre)?Crafted /.test(g.nameEn)) continue;
    const idx = g.mods.map((x, i) => (problem(x) && !hidden.has(x.code) ? i : -1)).filter((i) => i >= 0); if (!idx.length) continue;
    const base = loadGame('bases').find((b) => b.code === g.code);
    const gen = N.modLines(g.mods.filter((_, i) => !idx.includes(i)), base).map(normLine);
    const left = o.attributes.filter((a) => !HEAD.test(a)).filter((a) => { const k = normLine(a); const at = gen.indexOf(k); if (at >= 0) { gen.splice(at, 1); return false; } return true; });
    overlay.uniques[g.id] = { ...overlay.uniques[g.id], dropMods: idx, extraLines: left }; n++;
    console.log('  額外文字行', g.nameEn, JSON.stringify(left));
  }
  fs.writeFileSync(outFile, JSON.stringify(overlay));
  console.log('第二階段：', n, '件附舊百科文字行');
}
