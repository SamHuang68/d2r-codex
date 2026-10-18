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

## 輸出
meta、itemtypes、bases（武器／防具／misc）、uniques、sets、setItems、runewords、properties（modifier→stat 對映）、stats（itemstatcost 子集）、statStrings.zhTW（描述模板）、charstats、skills（名稱／歸屬／格位，無數值）、inventory（紙娃娃座標）、uiCategories（拾取篩選器類別樹）。

## 已知限制
- `skilltab-war`、`roguesbow-affix1`、`magdam-rand`、`Gethit-skill` 在 properties.txt 無定義（4 件暗金），`Crafted *` 為 Rift 製作範本；皆標示於稽核輸出，不當作一般暗金。
- 技能傷害、synergy 公式尚未納入（S2/S6）。
- modifier 的文字描述（descfunc 渲染）尚未實作（S5 提示框）。
