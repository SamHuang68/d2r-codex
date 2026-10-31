# 交接單：用新版遊戲檔案更新基本資料（給本機 session）

雲端 session 讀不到本機的 D2R 安裝檔（本機是 Windows，不提供給雲端 session），所以「把 3.4 改動套到單品頁」與「補 Rogue's Bow 屬性」要在有遊戲檔案的電腦上做。這份是照著做的清單。

## 背景
- 目前基本資料版本：**3.3.93847**（`src/data/game/meta.json`）。
- 網站有一頁「版本改動」（`/patches/`，資料在 `src/data/patchNotes.ts`），列出 Patch 3.4 與 3.3 的物品改動（舊值 → 新值），出處 d2db.net。**3.3 的改動大多已在基本資料裡，3.4 的還沒有。**
- 進度可以用腳本量：`npm run check:patches`（每筆改動有 `expect`，基本資料文字包含它就算已套用）。目前基準：**3.4 為 0／24、3.3 為 11／12**。

## 步驟
1. **確認安裝的遊戲版本**夠新。Patch 3.4（天梯第 16 季）若還沒推到你的安裝版，抽出來的資料表不會有新數值——先記下 `D2R_BUILD`（版本號），跑完後 `npm run check:patches` 的 3.4 數字沒動就是這個原因。
2. 照 `scripts/data-pipeline/README.md` 的「步驟」做：用 `ex.exe` 唯讀抽取 `*global\excel\*` 與 `*local\lng\strings*`，再
   `D2R_BUILD=<版本號> node scripts/data-pipeline/build_game_data.mjs <抽取根目錄> src/data/game`
3. 稽核：`node scripts/data-pipeline/audit_game_data.mjs src/data/game`（有同版號的 d2data 可當第二來源）。
4. 在**新分支**上看差異（`git diff --stat src/data/game`），然後依序跑：
   - `npm run lint`、`node scripts/check_data_i18n.mjs`、`node scripts/test_item_taxonomy.mjs`
   - `npm run test:engine`（若「資料筆數」類斷言因新增項目而失敗，是預期的，更新數字前先確認新增項目合理）、`npm test`
   - `npm run check:patches`：看 3.4 的 24 筆進來幾筆；沒進來的是資料表裡還沒有，或 `expect` 字串與資料寫法不同（要看實際資料再調整 `expect`，不要硬改資料去迎合）。
   - `npm run build && node scripts/check_static_links.mjs && node scripts/check_chunk_cycles.mjs`
5. 新增的暗金／套裝／符文之語需要：覆蓋層 id（`src/data/codex/overlay.json`，沒有的會用穩定 slug，聖杯存檔相容）、物品圖（`node scripts/sync_item_image_mirror.mjs` 會檢查缺圖）、必要的英文對照（`check_data_i18n.mjs` 會列出缺的）。
6. 開 PR（CI 會跑冒煙測試與靜態頁檢查）；**只提交衍生的 `src/data/game/*.json`，不提交抽出來的原始資料表**。

## 套用完成後
- 當 `npm run check:patches` 顯示 3.4 全數已套用：`src/components/codex/PatchNotes.tsx` 的 3.4 說明文字（「還沒有套用這些數值…」）改成「已套用」，`SourcesPage` 的出處說明同步調整；頁面保留作歷史紀錄。
- `meta.json` 的 `gameVersion` 會自動顯示在資料來源頁與版本改動頁頁尾。

## 已知缺口：Rogue's Bow（3.3 改動「寒冰箭或火焰箭 +1–3，只限亞馬遜」）
- 這是**管線的已知限制**，不是版本太舊：該屬性代碼 `roguesbow-affix1` 在遊戲的 `properties.txt` 沒有定義，`src/engine/describe.ts` 的 `HIDDEN_CODES`（約第 98 行）刻意把它隱藏，`scripts/test_engine.mjs` 的 `KNOWN_UNDEFINED` 也列了它。目前資料裡它的數值是 min=max=1，與文章的「+1–3」不一致，不能直接照抄。
- 建議做法：在抽出的字串表（`item-modifiers.json` 等）搜尋 `roguesbow`／對應中文，找得到遊戲自己的說明文字就在 `describe.ts` 加一個明確的 case 輸出它，並讓 `expect`（`寒冰箭`）通過；找不到就在遊戲裡看一眼實際顯示，再決定怎麼寫。不要憑文章編造數值。

## 備註：Mania／Hysteria 不是缺口
文章用遊戲內公開英文名：Hustle（護甲，Runeword171）＝**Hysteria／歇斯底里**，Hustle（武器，Runeword172）＝**Mania／狂躁**。本站把它們合併成一筆（`/runewords/hustle/`），版本改動頁已用別名（`RUNEWORD_ALIASES`）對到那一筆。
