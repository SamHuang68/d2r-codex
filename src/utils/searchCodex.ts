import type { SearchResultItem } from './search';

/**
 * 全域搜尋（按 Q）的第二批資料：怪物圖鑑、詞綴寶典、聖壇圖鑑、經驗值表。
 * 這幾份資料比較大（怪物約 190 kB、詞綴約 250 kB），所以只在使用者開始輸入之後才動態載入，不拖慢首頁與搜尋視窗開啟；
 * 結果附加在原本搜尋結果（searchOmni）的後面，原本的結果與排序不變。
 */
const MAX_PER_KIND = 6;
const rank = (name: string, nameEn: string, q: string): number => {
  const a = name.toLowerCase(); const b = nameEn.toLowerCase();
  return a === q || b === q ? 0 : a.startsWith(q) || b.startsWith(q) ? 1 : 2;
};

export async function searchCodex(query: string): Promise<SearchResultItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const [mon, aff, shr, exp] = await Promise.all([
    import('../data/codex/monsters'), import('../data/codex/magicAffixes'), import('../data/codex/shrines'), import('../data/codex/experience'),
  ]);
  const out: SearchResultItem[] = [];

  // 怪物（含首領）：名稱、英文名、代碼
  const monsters = mon.MONSTERS.filter((m) => m.name.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
    .sort((a, b) => rank(a.name, a.nameEn, q) - rank(b.name, b.nameEn, q) || a.name.localeCompare(b.name, 'zh-Hant'))
    .slice(0, MAX_PER_KIND);
  for (const m of monsters) {
    const imm = mon.immunitiesOf(m, 2).map((e) => mon.ELEM_ZH[e]);
    out.push({
      id: `monster:${m.id}`, type: 'monster', title: m.name, titleEn: m.nameEn,
      category: `怪物圖鑑 · ${mon.KIND_ZH[m.kind ?? 'other']}`, badge: m.boss ? '首領' : '怪物',
      preview: `地獄 Lv ${m.levels[2] ?? '—'}・${imm.length ? `免疫 ${imm.join('、')}` : '無免疫'}`, targetTab: 'monsters',
    });
  }

  // 詞綴：同一個詞綴有好幾階，合併成一筆（階數寫在說明裡）；比對名稱與屬性文字
  const groups = new Map<string, import('../data/codex/magicAffixes').Affix[]>();
  for (const a of aff.AFFIXES) {
    if (!(a.name.toLowerCase().includes(q) || a.nameEn.toLowerCase().includes(q) || aff.affixLines(a).some((l) => l.toLowerCase().includes(q)))) continue;
    const k = `${a.kind}|${a.nameEn}`;
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(a);
  }
  const affixHits = [...groups.values()]
    .sort((x, y) => rank(x[0].name, x[0].nameEn, q) - rank(y[0].name, y[0].nameEn, q) || y.length - x.length || x[0].name.localeCompare(y[0].name, 'zh-Hant'))
    .slice(0, MAX_PER_KIND);
  for (const rows of affixHits) {
    const a = rows[0];
    out.push({
      id: `affix:${a.kind}|${a.nameEn}`, type: 'affix', title: a.name, titleEn: a.nameEn,
      category: `詞綴寶典 · ${aff.AFFIX_KIND_ZH[a.kind]}`, badge: '詞綴',
      preview: `${aff.affixLines(a).join('，')}${rows.length > 1 ? `（${rows.length} 階）` : ''}`, targetTab: 'affixes',
    });
  }

  // 聖壇：名稱與效果說明
  const shrines = shr.SHRINES.filter((s) => s.name.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q) || shr.shrineSummary(s).toLowerCase().includes(q)).slice(0, 4);
  for (const s of shrines) {
    const sec = shr.durationSeconds(s);
    out.push({
      id: `shrine:${s.code}`, type: 'shrine', title: s.name, titleEn: s.nameEn,
      category: `聖壇圖鑑 · ${shr.SHRINE_TYPE_ZH[s.type]}`, badge: '聖壇',
      preview: `${shr.shrineSummary(s)}${sec !== undefined ? `（${sec} 秒）` : ''}`, targetTab: 'shrines',
    });
  }

  // 經驗值：問到「經驗」「升級」或 exp 時給經驗值表；有帶 1~99 的數字就直接給那一級的數值
  if (/經驗|升級|exp/.test(q)) {
    out.push({
      id: 'exp:table', type: 'exp', title: '經驗值表', titleEn: 'Experience Table', category: '經驗值表 · 1~99 級', badge: '經驗值',
      preview: `升到 99 級累計 ${exp.fmtExp(exp.expToReach(exp.MAX_LEVEL))}；98→99 級需要 ${exp.fmtExp(exp.expForLevel(exp.MAX_LEVEL))}`, targetTab: 'experience',
    });
    const n = Number((/(?:^|\D)(\d{1,2})(?!\d)/.exec(q) ?? [])[1]);
    if (n >= 1 && n <= exp.MAX_LEVEL) {
      out.push({
        id: `exp:${n}`, type: 'exp', title: `${n} 級經驗`, titleEn: `Level ${n}`, category: '經驗值表 · 單級數值', badge: '經驗值',
        preview: `升到 ${n} 級累計 ${exp.fmtExp(exp.expToReach(n))}；從 ${n - 1} 級升上來需要 ${exp.fmtExp(exp.expForLevel(n))}`, targetTab: 'experience',
      });
    }
  }
  return out;
}
