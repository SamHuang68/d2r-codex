# 遊戲資料管線（S1）

由本機 D2R 安裝檔產生 `src/data/game/*.json`（結構化 modifier，繁中名稱）。不提交原始資料表，只提交模擬器所需的衍生子集。

## 步驟
1. 取得 CascLib（MIT，github.com/ladislav-zezula/CascLib），以 MSVC 連同 `casc_extract/ex.cpp` 編譯為 `ex.exe`（需連結 src 下 *.cpp、common、jenkins/lookup3.c、zlib/*.c、hashes/*.cpp、overwatch/{aes,apm,cmf}.cpp；advapi32 user32 wininet ws2_32）。
2. 唯讀抽取：
   - `ex.exe "<D2R 安裝目錄>" "*global\excel\*" <輸出根目錄>`
   - `ex.exe "<D2R 安裝目錄>" "*local\lng\strings*" <輸出根目錄>`
3. 產生：`D2R_BUILD=<遊戲版本> node scripts/data-pipeline/build_game_data.mjs <輸出根目錄> src/data/game`
4. 稽核：`node scripts/data-pipeline/audit_game_data.mjs src/data/game [d2data/json 路徑]`
   - d2data（blizzhackers/d2data，同版號）作為獨立來源逐欄比對。
5. 與百科頁舊資料的差異（唯讀；舊資料已從主樹移除，需先取出：`git archive e5b3f02 src/data src/types | tar -x -C <舊資料資料夾>`）：`node scripts/data-pipeline/diff_legacy_vs_game.mjs <輸出資料夾> <舊資料資料夾>`
   - 輸出 `diff.json`（逐筆明細與「舊 id → 遊戲 id」對照）與 `appendix.md`；需要 `node_modules`（用 esbuild 打包舊資料與 `src/engine`）。
6. 百科頁資料層（`src/data/{uniqueItems,setItems,runewords,bases,runes,skills/*}.ts`）由 `src/data/game/*.json` 即時產生，沒有第二份資料。
   - 不在遊戲資料表裡、只能人工維護的內容放 `src/data/codex/overlay.json`：聖杯存檔與社群別名使用的舊 id、舊譯名、套裝件顯示順序、符文之語標籤、底材戰術備註、符文方塊配方、技能俗稱與戰術解析、遊戲公式沒有依據的舊協同。
   - `build_codex_overlay.mjs` 只用於首次由舊資料（commit e5b3f02）產生覆蓋層，之後直接編輯 JSON；`parity_codex_vs_legacy.mjs <舊資料資料夾>` 可重跑新舊逐行對照。
   - `scripts/enrich_bases.mjs`、`scripts/sync_d2r_world.mjs` 會覆寫上述模組，已停用。
   - 驗證：`npm run test:engine`（含「百科頁資料層」區塊）、`npm test`（圖示解析與部位檢查）。

## 輸出
meta、itemtypes、skillNames／skillTabsEn（技能公開英文名；skillNames 另帶職業技能的 charClass）、skillCalc（技能計算式裡的 lnXY／dmXY 函式定義，來自遊戲 skillcalc.txt，引擎 `engine/calc.ts` 用它求值）、bases（武器／防具／misc，含 nameEnUS 公開英文名、重擊／踢擊傷害、腰帶格數、堆疊上限）、uniques、sets、setItems、runewords、properties（modifier→stat 對映）、stats（itemstatcost 子集）、statStrings.zhTW（描述模板）、charstats、skills（240 招：繁中名稱與說明、樹／列／欄格位、前置、等級上限、魔力與傷害欄位、協同計算式）、skillTabs（技能樹繁中名稱）、inventory（紙娃娃座標）、uiCategories（拾取篩選器類別樹）、itemSkills（沒有職業的物品技能：印記、蜘蛛網、譫妄、生命連結的狀態持續影格與秒數，描述屬性時用）。

## 已知限制
- `skilltab-war`、`roguesbow-affix1`、`magdam-rand`、`Gethit-skill` 在 properties.txt 無定義（4 件暗金），`Crafted *` 為 Rift 製作範本；皆標示於稽核輸出，不當作一般暗金。
- 技能傷害與協同以 skills.txt 的欄位與計算式為準（src/engine/calc.ts 求值），已與術士 5 招 1–20 級的公開傷害表逐級比對一致；專精、抗性、光環與武器傷害尚未納入。
- SkillCategory 字串編號與 SkillPage 的對應：舊 7 職業相反（4−頁碼）、術士相同，已以技能內容核對並寫入 engine/skills.ts。
- modifier 的文字描述由 `src/engine/describe.ts` 依 descfunc／descpriority 渲染（`describeModifiers` 單一擲骰值、`describeRanges` 數值區間）；`dm`（衰減）公式未支援，標示為不支援。
