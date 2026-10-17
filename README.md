# 聖休亞瑞典藏中樞 (D2R Sanctuary Codex)

暗黑破壞神 II：獄火重生 (Diablo II: Resurrected) 旗艦遊戲專頁與全功能速查手冊。

結合暴雪官方網站的大氣沉浸視覺（Cinematic Portal）與 D2R.world 級別的高效實用手冊工具（Utility-First Codex），支援毫秒級全域搜尋、全職業幀數斷點計算機、完整的符文之語與裝備資料庫，以及純本地無痕保存的聖杯打寶挑戰器。

---

## 核心功能特色

### 1. 沉浸式大氣展演 (Portal Showcase)
- **英雄主視覺 (Hero Masthead)**：古典暗黑哥德風格設計，整合宣傳與實機展示影片燈箱。
- **職業殿堂 (Classes Showcase)**：完整 8 大職業（包含最新 DLC 職業**術士 Warlock**），詳細解析三大技能樹系別、屬性加點成長比率與 S 級終局主流流派。
- **《術士軍臨》DLC 改版對照**：版本特色卡片、專屬暗金與符文之語、跨遊戲獎勵與品質提升 QoL 矩陣。

### 2. 百科資料庫與極速手冊 (Interactive Codex)
- **全域即時快顯搜尋 (Omni Search Modal)**：
  - 鍵盤按下 `Q` 或 `/` 立即彈出搜尋框。
  - 毫秒級模糊搜尋：中英文雙語索引（例如：輸入「謎團」、「剛毅」、「精神」或「Enigma」、「Spirit」均可秒出結果）。
- **符文之語檢索器 (Runewords Finder)**：
  - 多維度交叉過濾：按孔數 (2-6S)、底材類型、天梯限定 (Ladder)、DLC 限定 (RotW)、關鍵詞綴標籤 (Teleport, FCR, CB, IAS, MF 等)。
  - 完整呈現符文鑲嵌順序、屬性數值浮動範圍與推薦畢業底材。
- **裝備寶典 (Item Compendium)**：
  - 收錄各部位指標性暗金裝備 (Unique) 與熱門套裝 (Set Items)。
  - 忠實還原遊戲內暗金/套裝色碼懸浮 Tooltip 與套裝部分/全套加成。
- **33 枚符文全典藏 (Rune Compendium)**：
  - 1# 艾爾 (El) 至 33# 薩德 (Zod) 完整列表。
  - 清楚列示武器、防具/頭盔、盾牌之不同鑲嵌效果與方塊合成升級所需寶石。
- **赫拉迪姆方塊工坊 (Cube Lab)**：
  - 完整白裝隨機打孔公式、暗金/亮黃防具武器升級公式、免錢修理裝備與充能次數。
  - 施法系 (Caster) 與血腥系 (Blood) 手工飾品/手套洗裝配方。
  - 赦免徽章四大精華洗點與乳牛關卡開啟指南。
- **機制斷點計算機 & 85 場景表 (Breakpoints & 85 Areas)**：
  - 全職業施法速度 (FCR)、打擊恢復 (FHR)、格擋速度 (FBR) 幀數 (Frames) 斷點對照。
  - 支援輸入個人裝備總數值，即時動態高亮當前達成幀數與距離下一檔所需數值。
  - 第 1 章至第 5 章 Area Level 85 高級打寶場景清單、原生免疫抗性與掉寶特色。

### 3. 個人專屬工坊 (Vault & Hunter Tools)
- **聖杯挑戰打寶追蹤器 (Holy Grail Tracker)**：
  - 收錄遊戲內全數暗金裝備與套裝組件。
  - 單擊即時標記已收集 / 未獲得，並支援獨立標記無形 (ETH) 版本。
  - 即時動態統計總完成率百分比與剩餘件數。
  - 純本地 LocalStorage 保存，並支援一鍵匯出/匯入 JSON 備份檔案。
- **角色配裝工坊 (Build Planner)**：
  - 自由配置 10 大裝備欄位，支援自訂方案名稱與多角色存檔切換。
  - 即時加總 FCR、FHR、抗性與 MF，並自動檢測是否踩中該職業核心幀數門檻。

---

## 技術架構與開發規範

- **核心技術**：React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons。
- **完全合規**：100% 排除任何中系套件與依賴，指令完全相容 Windows pwsh 7+。
- **極致效能**：純前端靜態編譯輸出，支援離線執行，無外部 API 延遲。

---

## 本機開發與建置

```powershell
# 安裝依賴
npm install

# 本機開發預覽 (http://localhost:3000)
npm run dev

# 靜態打包驗證
npm run build

# 啟動正式版預覽
npm run preview
```
