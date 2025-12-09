# 新增指標工作流程指南

本文件說明如何使用 Claude Code Spec Workflow 系統性地新增新的評估指標到企業永續性評估平台。

---

## 📋 工作流程概覽

使用 Spec Workflow 新增指標的完整流程：

```
1. 需求分析 (/spec-create)
   ↓
2. 技術設計 (/spec-design)
   ↓
3. 任務拆分 (/spec-tasks)
   ↓
4. 逐步執行 (/spec-execute)
   ↓
5. 測試驗證
```

---

## 🎯 步驟一：需求分析 (Requirements)

### 使用命令
```
/spec-create
```

### 目的
建立新指標的需求文件，明確定義：
- 指標的業務意義
- 計算公式
- 資料來源
- 評分標準
- 預期效果

### 需求文件位置
**建議**: 使用**單一需求文件**，持續新增內容

```
.claude/specs/indicators-requirements.md
```

**為什麼不建立多個需求文件？**
- 所有指標都屬於同一個系統（企業永續性評估）
- 統一管理方便查詢與維護
- 避免文件碎片化
- 方便比對不同指標的一致性

### 需求文件結構範例

```markdown
# 企業永續性評估指標需求文件

## 文件資訊
- **建立日期**: 2025-12-08
- **最後更新**: 2025-12-08
- **維護者**: [你的名字]

---

## 指標 1: 存貨週轉率

### 業務需求
**維度**: 營運能力
**權重**: 33.33%
**業務意義**: 衡量企業存貨管理效率

### 計算定義
- **公式**: 營業成本合計 ÷ 平均存貨
- **平均存貨**: (當年度存貨 + 前一年度存貨) ÷ 2

### 資料來源
- 營業成本: `pl_income_basics.operating_costs_total`
- 當年存貨: `financial_basics.inventory` (當年度)
- 前年存貨: `financial_basics.inventory` (前一年度)

### 評分標準
- 基準值: 6 (週轉6次視為標準)
- 最高分: 85分
- 評分公式: (週轉率 ÷ 6) × 85
- 特殊處理: 存貨為0時給0分

### 驗收標準
- [ ] 計算結果與手工計算一致
- [ ] 評分範圍在 0-100 之間
- [ ] 處理邊界情況（存貨為0）
- [ ] 顯示在雷達圖上

---

## 指標 2: 流動比率

### 業務需求
**維度**: 財務能力
**權重**: 50%
**業務意義**: 衡量企業短期償債能力

### 計算定義
... (類似結構)

---

## 指標 3: [新指標名稱]

... (新增指標時，在此處繼續追加)
```

### 實際操作

1. **第一次新增指標時**:
   ```
   /spec-create
   ```
   - Claude 會引導你建立 `indicators-requirements.md`
   - 填寫第一個指標的需求

2. **後續新增指標時**:
   ```
   /spec-create
   ```
   - 告訴 Claude: "我要在現有的 indicators-requirements.md 中新增新指標"
   - Claude 會讀取現有文件
   - 在文件末尾新增新指標的需求區塊

---

## 🏗️ 步驟二：技術設計 (Design)

### 使用命令
```
/spec-design
```

### 目的
將業務需求轉換為技術實作設計，包含：
- SQL 查詢語法
- 資料結構設計
- 計算函數簽名
- UI 整合方式

### 設計文件位置
**建議**: 按**維度**分別建立設計文件

```
.claude/specs/operational-capability-design.md  # 營運能力維度
.claude/specs/financial-capability-design.md     # 財務能力維度
.claude/specs/future-capability-design.md        # 未來力維度
.claude/specs/ai-digital-capability-design.md    # AI數位力維度
.claude/specs/esg-sustainability-design.md       # ESG永續力維度
.claude/specs/innovation-capability-design.md    # 創新能力維度
```

**為什麼按維度分開？**
- 每個維度的技術實作有相似性
- 方便同時開發同一維度的多個指標
- 設計文件不會過於龐大
- 更容易找到相關技術細節

### 設計文件結構範例

```markdown
# 營運能力維度 - 技術設計文件

## 文件資訊
- **關聯需求**: indicators-requirements.md
- **維度**: 營運能力
- **包含指標**: 存貨週轉率、應收帳款週轉率、總資產週轉率

---

## 1. 存貨週轉率

### 1.1 資料庫查詢設計

#### SQL 查詢
```sql
SELECT
    pl.fiscal_year,
    pl.company_name,
    pl.operating_costs_total,
    f_current.inventory AS current_inventory,
    f_previous.inventory AS previous_year_inventory,
    ... (完整 SQL)
```

#### 查詢參數
- `:fiscal_year` (String) - 會計年度
- `:tax_id` (String) - 統一編號

#### 回傳資料結構
```javascript
{
  inventory_turnover_ratio: number,
  radar_score: number,
  raw_data: {
    operating_costs_total: number,
    current_inventory: number,
    previous_inventory: number
  }
}
```

### 1.2 計算函數設計

#### 函數簽名
```javascript
/**
 * 計算存貨週轉率
 * @param {Object} data - 原始資料
 * @param {number} data.operating_costs_total - 營業成本合計
 * @param {number} data.current_inventory - 當年度存貨
 * @param {number} data.previous_inventory - 前一年度存貨
 * @returns {Object} - { ratio: number, score: number }
 */
export const calculateInventoryTurnover = (data) => { ... }
```

#### 評分函數
```javascript
/**
 * 計算存貨週轉率評分
 * @param {number} turnoverRatio - 週轉率
 * @returns {number} - 0-100分
 */
export const scoreInventoryTurnover = (turnoverRatio) => { ... }
```

### 1.3 配置整合

#### businessLogic.js 配置
```javascript
export const OPERATIONAL_METRICS = {
  inventory_turnover: {
    name: '存貨週轉率',
    weight: 0.3333,
    benchmark: 6,
    maxScore: 85,
    ...
  }
}
```

### 1.4 UI 整合設計

#### 雷達圖資料格式
```javascript
const radarData = [
  {
    dimension: '營運能力',
    主要公司: 75,  // 存貨週轉率分數
    比較公司: 68,
    fullMark: 100
  }
]
```

#### 卡片顯示
- 顯示位置: 營運能力卡片區
- 顯示內容: 週轉率數值 + 評分
- 顏色編碼: 根據評分等級

---

## 2. 應收帳款週轉率

... (類似結構)

---

## 3. [新指標名稱]

... (新增指標時，在對應維度文件中繼續追加)
```

### 實際操作

1. **第一次為某維度新增指標**:
   ```
   /spec-design
   ```
   - 建立對應維度的設計文件（如 `operational-capability-design.md`）
   - 參考 `indicators-requirements.md` 中的需求
   - 設計 SQL、計算函數、UI 整合

2. **為同一維度新增更多指標**:
   ```
   /spec-design
   ```
   - 告訴 Claude: "在 operational-capability-design.md 中新增『總資產週轉率』的設計"
   - Claude 會在同一文件中追加新指標的設計

---

## 🔨 步驟三：任務拆分 (Tasks)

### 使用命令
```
/spec-tasks
```

### 目的
將設計文件拆分為可執行的小任務，每個任務：
- 原子性：單一職責
- 可測試：明確的驗收標準
- 有序性：考慮依賴關係

### 任務文件位置
**建議**: 為每個**指標**建立獨立任務文件

```
.claude/specs/tasks/inventory-turnover-tasks.md
.claude/specs/tasks/accounts-receivable-turnover-tasks.md
.claude/specs/tasks/current-ratio-tasks.md
```

**為什麼每個指標獨立？**
- 任務清單明確，不會混淆
- 可以平行開發不同指標
- 任務狀態獨立追蹤
- 完成後可作為實作記錄

### 任務文件結構範例

```markdown
# 存貨週轉率 - 實作任務清單

## 文件資訊
- **關聯設計**: operational-capability-design.md
- **指標名稱**: 存貨週轉率
- **維度**: 營運能力

---

## 任務清單

### Task 1: 在 businessLogic.js 中新增指標配置
**優先級**: P0 (必須)
**預估時間**: 10分鐘
**依賴**: 無

**詳細說明**:
- 在 `OPERATIONAL_METRICS` 物件中新增 `inventory_turnover` 配置
- 包含: name, weight, benchmark, maxScore, calculation, scoring

**驗收標準**:
- [ ] 配置結構符合現有格式
- [ ] weight = 0.3333
- [ ] benchmark = 6
- [ ] maxScore = 85

**檔案位置**: `src/config/businessLogic.js:19`

---

### Task 2: 在 sqlTemplates.js 中新增 SQL 查詢模板
**優先級**: P0 (必須)
**預估時間**: 15分鐘
**依賴**: 無

**詳細說明**:
- 新增 `getInventoryTurnoverQuery` 函數
- SQL 包含: 營業成本、當年/前年存貨、計算週轉率、評分

**驗收標準**:
- [ ] SQL 語法正確
- [ ] 支援參數化查詢 (:fiscal_year, :tax_id)
- [ ] 處理 NULL 值 (COALESCE)
- [ ] 計算邏輯正確

**檔案位置**: `src/config/sqlTemplates.js`

---

### Task 3: 在 calculationService.js 中實作計算函數
**優先級**: P0 (必須)
**預估時間**: 20分鐘
**依賴**: Task 1

**詳細說明**:
- 實作 `calculateInventoryTurnover` 函數
- 實作 `scoreInventoryTurnover` 函數
- 處理邊界情況（存貨為0）

**驗收標準**:
- [ ] 計算公式正確
- [ ] 評分邏輯符合設計
- [ ] 處理除零錯誤
- [ ] 回傳格式: { ratio, score }

**檔案位置**: `src/services/calculationService.js`

---

### Task 4: 在 dataService.js 中整合查詢
**優先級**: P0 (必須)
**預估時間**: 15分鐘
**依賴**: Task 2

**詳細說明**:
- 在 `fetchOperationalMetrics` 中呼叫新的 SQL 查詢
- 處理 Supabase 回傳資料
- 整合到現有資料結構

**驗收標準**:
- [ ] 查詢成功執行
- [ ] 資料轉換正確
- [ ] 錯誤處理完善

**檔案位置**: `src/services/dataService.js`

---

### Task 5: 更新 UI 顯示存貨週轉率
**優先級**: P1 (重要)
**預估時間**: 30分鐘
**依賴**: Task 3, Task 4

**詳細說明**:
- 在營運能力卡片中顯示存貨週轉率
- 整合到雷達圖資料
- 加入評分色彩編碼

**驗收標準**:
- [ ] 雷達圖正確顯示
- [ ] 卡片顯示週轉率數值
- [ ] 評分色彩正確
- [ ] 響應式設計正常

**檔案位置**: `src/BusinessSustainabilityAssessment.jsx`

---

### Task 6: 編寫單元測試
**優先級**: P1 (重要)
**預估時間**: 25分鐘
**依賴**: Task 3

**詳細說明**:
- 測試 `calculateInventoryTurnover`
- 測試 `scoreInventoryTurnover`
- 涵蓋邊界情況（存貨為0、極大值）

**驗收標準**:
- [ ] 測試覆蓋率 > 90%
- [ ] 所有測試通過
- [ ] 包含邊界值測試

**檔案位置**: `src/services/calculationService.test.js`

---

## 執行順序建議

### 階段 1: 配置與資料層
1. Task 1 (配置)
2. Task 2 (SQL)
3. Task 4 (資料服務)

### 階段 2: 計算邏輯
4. Task 3 (計算函數)
5. Task 6 (測試)

### 階段 3: UI 整合
6. Task 5 (UI 顯示)

---

## 進度追蹤

- [ ] 所有 P0 任務完成
- [ ] 所有 P1 任務完成
- [ ] 所有測試通過
- [ ] 在開發環境驗證
- [ ] Code Review 完成
```

### 實際操作

```
/spec-tasks
```

Claude 會：
1. 讀取對應的設計文件
2. 分析需要修改的檔案
3. 拆分為 6-8 個原子任務
4. 建立任務文件（如 `inventory-turnover-tasks.md`）
5. 自動驗證任務的原子性與可執行性

---

## ⚙️ 步驟四：執行任務 (Execute)

### 使用命令
```
/spec-execute
```

### 目的
逐一執行任務清單中的任務，確保：
- 程式碼品質
- 測試覆蓋
- 符合設計規範

### 執行方式

#### 方式 1: 逐一執行（建議）
```
/spec-execute
```

Claude 會：
1. 讀取任務文件
2. 找到第一個未完成的任務
3. 執行該任務（寫程式碼、測試）
4. 標記任務為完成
5. 詢問是否繼續下一個任務

#### 方式 2: 指定任務
```
/spec-execute --task 3
```

執行特定任務編號。

### 執行過程中的最佳實踐

1. **每完成一個任務就測試**
   ```bash
   npm run dev  # 檢查是否正常運作
   ```

2. **檢查程式碼品質**
   - 確保註解為繁體中文
   - 變數命名符合規範
   - 錯誤處理完善

3. **即時驗證**
   - 每個任務完成後，在瀏覽器中驗證
   - 檢查 Console 是否有錯誤

4. **Git Commit**
   ```bash
   git add .
   git commit -m "feat(營運能力): 完成存貨週轉率計算函數"
   ```

---

## ✅ 步驟五：測試驗證

### 單元測試
```bash
npm run test  # 執行所有測試
```

### 手動測試檢查清單

#### 1. 資料正確性
- [ ] 在下拉選單中選擇測試公司（如遠傳電信）
- [ ] 檢查新指標的計算結果
- [ ] 與手工計算比對（可使用試算表）
- [ ] 確認評分在 0-100 範圍內

#### 2. UI 顯示
- [ ] 雷達圖顯示新維度/指標
- [ ] 卡片顯示正確數值
- [ ] 評分色彩編碼正確（優異=綠色、風險=紅色等）
- [ ] 響應式設計正常（手機、平板、桌面）

#### 3. 邊界情況
- [ ] 測試存貨為 0 的公司
- [ ] 測試前一年度資料缺失
- [ ] 測試極大數值
- [ ] 測試負值情況

#### 4. 效能
- [ ] 頁面載入時間 < 2秒
- [ ] 切換公司時使用快取（Console 顯示「使用快取數據」）
- [ ] 無明顯卡頓

#### 5. 錯誤處理
- [ ] 資料載入失敗時顯示錯誤訊息
- [ ] Console 無紅色錯誤訊息
- [ ] 異常情況不會導致應用崩潰

---

## 📚 完整範例：新增「毛利率」指標

假設我們要新增「毛利率」指標到「財務能力」維度。

### Step 1: 需求分析
```
/spec-create
```

對話範例：
```
你: 我要在 indicators-requirements.md 中新增「毛利率」指標的需求

Claude: 好的，我會讀取現有的 indicators-requirements.md 並新增新區塊...

[Claude 在文件末尾新增]

## 指標 N: 毛利率

### 業務需求
**維度**: 財務能力
**權重**: 25%
**業務意義**: 衡量企業產品的獲利能力

### 計算定義
- **公式**: (營業收入 - 營業成本) ÷ 營業收入 × 100%

... (繼續填寫)
```

### Step 2: 技術設計
```
/spec-design
```

對話範例：
```
你: 在 financial-capability-design.md 中新增「毛利率」的技術設計

Claude: 我會參考現有的 ROE 和流動比率設計，為毛利率建立技術設計...

[Claude 在 financial-capability-design.md 中追加設計區塊]
```

### Step 3: 任務拆分
```
/spec-tasks
```

Claude 自動建立 `.claude/specs/tasks/gross-profit-margin-tasks.md`

### Step 4: 執行任務
```
/spec-execute
```

Claude 逐一執行任務：
1. 新增配置到 `businessLogic.js`
2. 新增 SQL 到 `sqlTemplates.js`
3. 實作計算函數
4. ...

### Step 5: 測試驗證
```bash
npm run test
npm run dev
```

手動驗證所有檢查項目。

---

## 🎓 最佳實踐總結

### 文件組織策略

| 文件類型 | 組織方式 | 檔案數量 | 原因 |
|---------|---------|---------|------|
| **需求文件** | 單一文件 | 1 個 | 所有指標屬於同一系統 |
| **設計文件** | 按維度分開 | 6 個 | 技術實作有相似性 |
| **任務文件** | 每個指標獨立 | N 個 | 任務狀態獨立追蹤 |

### 工作流程建議

1. **批次規劃，逐個執行**
   - 可以一次規劃多個指標的需求
   - 但每次只執行一個指標的實作
   - 確保品質優於速度

2. **保持文件同步**
   - 需求變更時，同步更新設計文件
   - 任務完成後，在文件中標記

3. **測試先行**
   - 先寫測試案例
   - 再實作功能
   - 確保測試通過

4. **小步快跑**
   - 每個任務完成就 commit
   - 方便回溯與 code review
   - 降低出錯風險

### 常見問題

**Q: 如果中途需求變更怎麼辦？**
A: 回到 `/spec-create`，更新需求文件，然後執行 `/spec-design` 和 `/spec-tasks` 重新生成設計與任務。

**Q: 任務執行到一半卡住了？**
A: 可以隨時停止，下次執行 `/spec-execute` 會從未完成的任務繼續。

**Q: 發現設計有問題？**
A: 修改設計文件後，執行 `/spec-tasks --regenerate` 重新生成任務清單。

**Q: 要不要刪除已完成的任務文件？**
A: 建議保留，作為實作記錄，方便日後查閱與維護。

---

## 🔗 相關資源

- **Steering 文件**: `.claude/steering/` (產品、技術、架構指引)
- **業務邏輯文件**: `docs/business-logic-specification.md`
- **專案指南**: `CLAUDE.md`

---

*此工作流程確保新增指標的系統性、可追溯性與高品質，建議所有新功能開發都遵循此流程。*
