# 企業永續性評估平台 - 專案基準規格文件

## 📋 文件資訊

- **文件版本**: v1.0.0
- **建立日期**: 2025-12-08
- **最後更新**: 2025-12-08
- **文件用途**: 記錄專案當前狀態(重構進度 50%)，記錄已實作的 7 個 KRI 詳細規格，作為未來新增 KRI 需求的參考基準
- **維護者**: 開發團隊
- **適用範圍**: 配合 Spec Workflow (`/spec-create`, `/spec-design`, `/spec-tasks`, `/spec-execute`) 使用

---

## 📌 專案概述

### 專案簡介

**企業永續性評估平台**是一個基於 React 的數據分析與視覺化應用程式，專門用於評估企業的六大核心能力並進行多維度比較分析。平台透過整合損益表與資產負債表數據，計算關鍵風險指標 (KRI)，以雷達圖、折線圖等視覺化方式呈現企業績效，輔助投資決策者與企業管理層做出明智的商業決策。

**核心價值**：
- 提供專業、即時的企業永續性評估
- 透過數據視覺化與多維度分析輔助決策
- 基於 PostgreSQL 資料庫的可靠數據來源
- 支援公司間績效比較與歷史趨勢追蹤

### 技術堆疊

#### 前端技術
- **React 18.2.0** - 核心 UI 框架
- **Vite 5.3.1** - 快速建構工具與開發伺服器
- **JavaScript (JSX)** - 開發語言(非 TypeScript)
- **Tailwind CSS 3.4.10** - Utility-first CSS 框架
- **Recharts 2.12.7** - 數據視覺化圖表庫
- **Lucide React 0.344.0** - 現代化圖示庫

#### 後端與資料庫
- **Supabase** - PostgreSQL 雲端資料庫 + RESTful API
- **@supabase/supabase-js 2.57.4** - Supabase JavaScript 客戶端
- **未來遷移目標**: SQL Server (企業內部部署)

#### 狀態管理
- **React Context API** - 全域狀態管理
  - `UIContext` - UI 狀態 (頁面導航、選單展開等)
  - `CompanyContext` - 公司選擇與指標數據
  - `DataManagementContext` - 數據管理頁面狀態

#### 部署與 CI/CD
- **GitHub Pages** - 靜態網站託管(當前)
- **gh-pages 6.1.1** - 部署工具
- **GitHub Actions** - 自動化建構與部署
- **未來**: 企業內部伺服器部署

### 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    前端應用層 (React)                         │
├─────────────────────────────────────────────────────────────┤
│  UI Components                                               │
│  ├── pages/ (Dashboard, DataManagement, Profile...)         │
│  ├── layout/ (Header, Sidebar, MainLayout)                  │
│  └── ui/ (Button, Card, Table, Loading...)                  │
├─────────────────────────────────────────────────────────────┤
│  Context State Management                                    │
│  ├── UIContext (頁面狀態、選單狀態)                          │
│  ├── CompanyContext (公司數據、指標快取)                     │
│  └── DataManagementContext (數據管理狀態)                    │
├─────────────────────────────────────────────────────────────┤
│  Services Layer (業務邏輯層)                                 │
│  ├── dataService.js (Supabase 查詢操作)                     │
│  └── calculationService.js (評分計算邏輯)                    │
├─────────────────────────────────────────────────────────────┤
│  Config Layer (配置層)                                       │
│  ├── businessLogic.js (指標定義、權重、評分標準)             │
│  └── sqlTemplates.js (SQL 查詢模板)                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL 資料庫)                    │
│  ├── pl_income_basics (損益表基本數據)                       │
│  └── financial_basics (資產負債表基本數據)                   │
└─────────────────────────────────────────────────────────────┘
```

### 六大評估維度概覽

| 維度 | 權重 | 已實作 KRI 數量 | 狀態 |
|------|------|----------------|------|
| **營運能力** | 20% | 3 個 (KRI 1.1-1.3) | ✅ 已完整實作 |
| **財務能力** | 25% | 2 個 (KRI 2.1-2.2) | ✅ 已完整實作 |
| **未來力** | 15% | 2 個 (KRI 3.1-3.2) | ✅ 已完整實作 |
| **AI數位力** | 15% | 0 個 | ⚠️ 使用虛擬分數 |
| **ESG永續力** | 15% | 0 個 | ⚠️ 使用虛擬分數 |
| **創新能力** | 10% | 0 個 | ⚠️ 使用虛擬分數 |

**已實作 KRI 總計**：7 個 KRI (營運能力 3 個 + 財務能力 2 個 + 未來力 2 個)

**總體評分計算公式**：
```
綜合評分 = Σ(維度分數 × 維度權重)
         = 營運能力×0.20 + 財務能力×0.25 + 未來力×0.15
         + AI數位力×0.15 + ESG永續力×0.15 + 創新能力×0.10
```

---

## 🗄️ 資料庫架構

### 資料表結構

#### pl_income_basics (損益表基本數據)

**表格描述**：記錄企業損益表數據，包含營業收入、成本、利潤等財務指標。

**主鍵**: `(tax_id, fiscal_year)`

**關鍵欄位清單**：

| 欄位名稱 | 資料型別 | 中文說明 | 備註 |
|---------|---------|---------|------|
| `tax_id` | TEXT | 統一編號 | 主鍵之一 |
| `fiscal_year` | TEXT | 會計年度 | 主鍵之一，格式：'2024' |
| `company_name` | TEXT | 公司名稱 | |
| `operating_revenue_total` | NUMERIC | 營業收入合計 | 用於計算週轉率、成長率 |
| `operating_costs_total` | NUMERIC | 營業成本合計 | 用於計算存貨週轉率 |
| `net_income` | NUMERIC | 稅後淨利 | 用於計算 ROE |
| `gross_profit` | NUMERIC | 毛利 | |
| `operating_income` | NUMERIC | 營業利益 | |

**範例數據** (遠傳電信 2024)：
```sql
SELECT * FROM pl_income_basics
WHERE tax_id = '97179430' AND fiscal_year = '2024';
```

#### financial_basics (資產負債表基本數據)

**表格描述**：記錄企業資產負債表數據，包含資產、負債、權益等財務狀況指標。

**主鍵**: `(tax_id, fiscal_year)`

**流動資產欄位**：

| 欄位名稱 | 資料型別 | 中文說明 |
|---------|---------|---------|
| `cash_equivalents` | NUMERIC | 現金及約當現金 |
| `fvtpl_assets_current` | NUMERIC | 透過損益按公允價值衡量之金融資產-流動 |
| `fvoci_assets_current` | NUMERIC | 透過其他綜合損益按公允價值衡量之金融資產-流動 |
| `notes_receivable_net` | NUMERIC | 應收票據淨額 |
| `ar_net` | NUMERIC | 應收帳款淨額 |
| `ar_related_net` | NUMERIC | 應收帳款-關係人淨額 |
| `other_receivables_net` | NUMERIC | 其他應收款淨額 |
| `inventory` | NUMERIC | 存貨 |
| `prepayments` | NUMERIC | 預付款項 |
| `total_current_assets` | NUMERIC | 流動資產合計 |

**非流動資產欄位**：

| 欄位名稱 | 資料型別 | 中文說明 |
|---------|---------|---------|
| `fvtpl_assets_noncurrent` | NUMERIC | 透過損益按公允價值衡量之金融資產-非流動 |
| `fvoci_assets_noncurrent` | NUMERIC | 透過其他綜合損益按公允價值衡量之金融資產-非流動 |
| `equity_method_investments` | NUMERIC | 採用權益法之投資 |
| `ppe` | NUMERIC | 不動產、廠房及設備 |
| `right_of_use_assets` | NUMERIC | 使用權資產 |
| `investment_properties_net` | NUMERIC | 投資性不動產淨額 |
| `intangible_assets` | NUMERIC | 無形資產 |
| `deferred_tax_assets` | NUMERIC | 遞延稅項資產 |

**權益與負債欄位**：

| 欄位名稱 | 資料型別 | 中文說明 |
|---------|---------|---------|
| `total_equity` | NUMERIC | 股東權益合計 |
| `total_current_liabilities` | NUMERIC | 流動負債合計 |

**範例數據** (遠傳電信 2024)：
```sql
SELECT * FROM financial_basics
WHERE tax_id = '97179430' AND fiscal_year = '2024';
```

### 資料表關聯

**連接邏輯**：

1. **主鍵關聯**：`pl_income_basics` 與 `financial_basics` 透過 `(tax_id, fiscal_year)` 進行 INNER JOIN
2. **前一年數據關聯**：使用 LEFT JOIN 連接前一年度的 `financial_basics`，條件為 `f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT`
3. **用途**：計算平均值指標(如平均存貨、平均股東權益)時需要當年度與前一年度數據

**ER 圖示說明**：
```
pl_income_basics
    ├── tax_id (FK) ──┐
    └── fiscal_year    │
                       ├───> financial_basics (當年度)
                       │         ├── tax_id
                       │         └── fiscal_year
                       │
                       └───> financial_basics (前一年度)
                                 ├── tax_id
                                 └── fiscal_year = (當年-1)
```

---

## 📐 系統架構

### 前端架構

#### Context 狀態管理

**1. UIContext** (`src/contexts/UIContext.jsx`)

管理全局 UI 狀態：
- `currentPage` - 當前頁面 ID (dashboard, profile, financial_basics, companies 等)
- `dataManagementExpanded` - 資料管理選單展開狀態
- `selectedDataType` - 資料類型選擇 (pl_income_basics / financial_basics)
- 方法：`toggleDataManagement()`, `handleDataTypeChange()`

**2. CompanyContext** (`src/contexts/CompanyContext.jsx`)

管理公司相關狀態：
- `selectedCompany` / `compareCompany` - 主要/比較公司選擇 (FET, CHT, TWM, FOXCONN)
- `companyMetrics` / `comparisonData` - 公司指標與比較數據
- `metricsLoading` / `metricsError` - 載入狀態與錯誤信息
- `companyDataCache` / `financialDataCache` - 數據快取
- `fundamentalData` - 硬編碼的基本面數據 (earnings, marketCap, revenue, ebitda)
- Helper 方法：`getCompanyBasicFinancialData()`, `safeGetCompanyData()`

**3. DataManagementContext** (`src/contexts/DataManagementContext.jsx`)

管理資料管理頁面狀態：
- `financialData` / `financialBasicsData` - 表格資料
- `loading` / `error` - 全局載入狀態
- 篩選狀態：`searchTerm`, `statusFilter`, `yearFilter`, `companyFilter`
- 模態框狀態：`editingItem`, `showEditModal`, `showDeleteModal`, `showAddModal`
- `refreshTrigger` - 強制數據重新整理
- 工具函數：`formatNumber()`, `clearFilters()`

#### 頁面組件結構

**已實作頁面**：

| 頁面組件 | 路徑 | 功能描述 |
|---------|------|---------|
| `ProfilePage` | `src/components/pages/ProfilePage.jsx` | 使用者個人資料頁面 |
| `CompaniesPage` | `src/components/pages/CompaniesPage.jsx` | 基本面分析頁面 (每股盈餘、淨值、營收、EBITDA圖表) |
| `DataManagementPage` | `src/components/pages/DataManagementPage.jsx` | 通用數據管理頁面 (支援兩種資料類型) |
| `ReportsPage` | `src/components/pages/ReportsPage.jsx` | 報表中心頁面 |
| `SourcesPage` | `src/components/pages/SourcesPage.jsx` | 指標來源與研究文獻頁面 (34個指標規劃) |

**待提取頁面**：
- `DashboardPage` - 當前仍在主組件 `BusinessSustainabilityAssessment.jsx` 中 (line 2274+)

#### UI 組件庫

**位置**: `src/components/ui/`

| 組件名稱 | 功能描述 |
|---------|---------|
| `Button.jsx` | 通用按鈕組件，支援 variant (primary, secondary, error) 和 icon |
| `Card.jsx` | 卡片容器組件 |
| `Select.jsx` | 下拉選單組件 |
| `Loading.jsx` | 載入指示器組件 (支援 dots 類型) |
| `Table.jsx` | 資料表格組件 |
| `index.js` | 統一導出點 |

**佈局組件** (`src/components/layout/`):
- `MainLayout.jsx` - 主版面布局 (Sidebar + Header + Content)
- `Sidebar.jsx` - 側邊欄導航
- `Header.jsx` - 頂部標題欄

### 後端服務層

#### config/ - 配置層

**1. businessLogic.js** (`src/config/businessLogic.js`)

**功能**：定義指標配置、權重、評分標準

**核心配置物件**：
- `OPERATIONAL_METRICS` - 營運能力指標配置 (存貨週轉率、應收帳款週轉率、總資產週轉率)
- `FINANCIAL_METRICS` - 財務能力指標配置 (ROE、流動比率)
- `FUTURE_METRICS` - 未來力指標配置 (營收成長率、營收CAGR)
- `DIMENSION_WEIGHTS` - 維度權重配置
- `SCORE_LEVELS` - 評分等級配置 (優異/良好/一般/待改善/風險)
- `MOCK_DIMENSION_SCORES` - 未實作維度的虛擬分數
- `COMPANIES` - 測試公司配置

**工具函數**：
- `getMetricConfig(dimension, metricKey)` - 獲取指標配置
- `getDimensionMetrics(dimension)` - 獲取維度所有指標
- `getScoreLevel(score)` - 根據分數獲取評級
- `calculateDimensionScore(metrics)` - 計算維度總分
- `calculateOverallScore(dimensionScores)` - 計算總體評分

**2. sqlTemplates.js** (`src/config/sqlTemplates.js`)

**功能**：定義 SQL 查詢模板

**核心 SQL 模板**：
- `INVENTORY_TURNOVER_QUERY` - 存貨週轉率查詢
- `ROE_QUERY` - ROE 查詢
- `RECEIVABLES_TURNOVER_QUERY` - 應收帳款週轉率查詢
- `TOTAL_ASSETS_TURNOVER_QUERY` - 總資產週轉率查詢
- `REVENUE_CAGR_QUERY` - 營收CAGR查詢
- `MULTI_COMPANY_METRICS_QUERY` - 多公司多指標查詢

**工具函數**：
- `getSqlTemplate(templateName)` - 獲取SQL模板
- `formatSqlParams(templateName, params)` - 格式化SQL參數
- `validateSqlParams(templateName, params)` - 驗證SQL參數

#### services/ - 服務層

**1. dataService.js** (`src/services/dataService.js`)

**功能**：Supabase 數據操作與查詢

**核心函數**：
- `executeTemplateQuery(templateName, params)` - 執行模板化查詢
- `getInventoryTurnoverData(taxId, year)` - 獲取存貨週轉率數據
- `getRoeData(taxId, year)` - 獲取ROE數據
- `getReceivablesTurnoverData(taxId, year)` - 獲取應收帳款週轉率數據
- `getTotalAssetsTurnoverData(taxId, year)` - 獲取總資產週轉率數據
- `getRevenueCagrData(taxId, year)` - 獲取營收CAGR數據
- `getRevenueGrowthData(taxId, year)` - 獲取營收成長率數據
- `getCurrentRatioData(taxId, year)` - 獲取流動比率數據

**2. calculationService.js** (`src/services/calculationService.js`)

**功能**：評分計算邏輯與數據聚合

**核心函數**：
- `calculateInventoryTurnoverScore(turnoverRatio)` - 計算存貨週轉率分數
- `calculateReceivablesTurnoverScore(turnoverRatio)` - 計算應收帳款週轉率分數
- `calculateTotalAssetsTurnoverScore(turnoverRatio)` - 計算總資產週轉率分數
- `calculateRoeScore(roe)` - 計算ROE分數 (分段評分)
- `calculateCurrentRatioScore(currentRatio)` - 計算流動比率分數
- `calculateRevenueGrowthScore(growthRate)` - 計算營收成長率分數
- `calculateRevenueCagrScore(cagrPercent)` - 計算營收CAGR分數 (線性映射)
- `processCompanyMetrics(taxId, year)` - 處理單一公司所有指標計算

### 數據流動機制

```
1. 用戶交互 (選擇公司/年度)
        ↓
2. Context 狀態更新 (CompanyContext.setSelectedCompany)
        ↓
3. 觸發 useEffect 監聽
        ↓
4. 檢查快取 (companyDataCache)
        ↓
   [有快取] → 直接使用快取數據
   [無快取] ↓
5. 呼叫 dataService 查詢 Supabase
        ↓
6. 執行 SQL 模板查詢 (sqlTemplates)
        ↓
7. 返回原始數據
        ↓
8. calculationService 計算評分
        ↓
9. 更新快取與狀態
        ↓
10. UI 組件重新渲染 (Recharts 圖表更新)
```

**快取機制**：
- `companyDataCache` - 存儲已載入的公司基本數據
- `financialDataCache` - 存儲已載入的財務數據
- 相同公司重複選擇時直接使用快取，避免重複查詢

**Loading 狀態管理**：
- 全局 Loading - `DataManagementContext.loading`
- 公司指標 Loading - `CompanyContext.metricsLoading`
- 分離 Loading 狀態避免全頁阻塞

---

## 🎯 已實作 KRI 規格

### 維度一：營運能力（權重 20%）

營運能力維度用於衡量企業運用資源的效率，包含三個核心指標：

#### KRI 1.1: 存貨週轉率

##### 業務定義

- **指標名稱**：存貨週轉率 (Inventory Turnover Ratio)
- **所屬維度**：營運能力
- **維度權重**：33.33% (在營運能力維度中)
- **業務意義**：衡量企業存貨管理效率。週轉率越高代表存貨周轉速度越快，資金運用效率更高，表示企業能快速將存貨轉換為銷售收入。行業標準約為 6 次/年。

##### 計算公式

**數學公式**：
```
存貨週轉率 = 營業成本合計 ÷ 平均存貨
平均存貨 = (當年度存貨 + 前一年度存貨) ÷ 2
```

**變數定義**：
- **營業成本合計**：當年度損益表中的營業成本總額 (包含銷售成本、製造成本等)
- **當年度存貨**：當年度資產負債表中的存貨金額
- **前一年度存貨**：前一年度資產負債表中的存貨金額

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 營業成本合計 | `pl_income_basics` | `operating_costs_total` | 損益表數據 |
| 當年度存貨 | `financial_basics` | `inventory` | 資產負債表數據（當年） |
| 前一年度存貨 | `financial_basics` | `inventory` | 資產負債表數據（前一年） |

##### 評分邏輯

- **評分方法**：ratio_benchmark（比率基準法）
- **基準值**：6（週轉 6 次視為行業標準）
- **最高分**：85 分
- **評分公式**：`(週轉率 ÷ 6) × 85`
- **分數範圍**：0-100 分
- **特殊規則**：
  - 若平均存貨為 0，則給 0 分
  - 若計算結果 > 100，則取上限 100
  - 若計算結果 < 0，則取下限 0

##### SQL 完整語法

```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,

    -- 當年度營業成本合計
    pl.operating_costs_total,

    -- 當年度存貨
    f_current.inventory AS current_inventory,

    -- 前一年度存貨 (可能為 NULL，因此稍後會用 COALESCE 處理)
    f_previous.inventory AS previous_year_inventory,

    -- 平均存貨 = (當年度存貨 + 前一年存貨) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0 AS avg_inventory,

    -- 存貨週轉率 = 營業成本合計 ÷ 平均存貨
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) > 0
        THEN pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)
        ELSE NULL
    END AS inventory_turnover_ratio,

    -- 雷達圖分數轉換（標準化）
    -- 存貨週轉率 ÷ 6（基準標準）× 85，加權為 85 分
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE
        WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2 > 100 THEN 100
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2 < 0 THEN 0
        ELSE (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2
    END AS radar_score

-- 🔗 主表：損益表 (營業成本來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度存貨）
INNER JOIN public.financial_basics f_current
    ON pl.tax_id = f_current.tax_id
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年存貨）
LEFT JOIN public.financial_basics f_previous
    ON pl.tax_id = f_previous.tax_id
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = $3
    AND pl.tax_id = $4;
```

**查詢參數**：
- `$1`: benchmark (基準值，預設 6)
- `$2`: maxScore (最高分，預設 85)
- `$3`: fiscal_year (會計年度，如 '2024')
- `$4`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const OPERATIONAL_METRICS = {
  inventory_turnover: {
    name: '存貨週轉率',
    weight: 0.3333, // 在營運能力中的權重 (33.33%)
    benchmark: 6, // 行業標準值
    maxScore: 85, // 最高分數
    calculation: {
      formula: 'operating_costs_total / avg_inventory',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        operating_costs_total: 'pl_income_basics.operating_costs_total',
        current_inventory: 'f_current.inventory',
        previous_inventory: 'f_previous.inventory'
      }
    },
    scoring: {
      method: 'ratio_benchmark',
      formula: '(value / benchmark) * maxScore',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if avg_inventory = 0 then score = 0',
        'if score > 100 then score = 100',
        'if score < 0 then score = 0'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算存貨週轉率分數
 */
export const calculateInventoryTurnoverScore = (turnoverRatio) => {
  const config = OPERATIONAL_METRICS.inventory_turnover;

  if (turnoverRatio === null || turnoverRatio === undefined) {
    return 0;
  }

  // 基於配置計算分數
  const score = (turnoverRatio / config.benchmark) * config.maxScore;

  // 應用邊界限制
  return Math.max(0, Math.min(100, score));
};
```

---

#### KRI 1.2: 應收帳款週轉率

##### 業務定義

- **指標名稱**：應收帳款週轉率 (Accounts Receivable Turnover Ratio)
- **所屬維度**：營運能力
- **維度權重**：33.33% (在營運能力維度中)
- **業務意義**：衡量企業應收帳款管理效率與收款能力。週轉率越高代表收款速度越快，資金回收效率更高，降低壞帳風險。行業標準約為 12 次/年。

##### 計算公式

**數學公式**：
```
應收帳款週轉率 = 營業收入合計 ÷ 平均應收帳款
平均應收帳款 = (當年度應收帳款 + 前一年度應收帳款) ÷ 2
應收帳款合計 = 應收票據淨額 + 應收帳款淨額 + 應收帳款-關係人淨額
```

**變數定義**：
- **營業收入合計**：當年度損益表中的營業收入總額
- **應收票據淨額**：已扣除備抵壞帳後的應收票據金額
- **應收帳款淨額**：已扣除備抵壞帳後的應收帳款金額
- **應收帳款-關係人淨額**：對關係企業的應收帳款淨額

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 營業收入合計 | `pl_income_basics` | `operating_revenue_total` | 損益表數據 |
| 應收票據淨額 (當年) | `financial_basics` | `notes_receivable_net` | 資產負債表數據 |
| 應收帳款淨額 (當年) | `financial_basics` | `ar_net` | 資產負債表數據 |
| 關係人應收帳款淨額 (當年) | `financial_basics` | `ar_related_net` | 資產負債表數據 |
| 應收票據淨額 (前一年) | `financial_basics` | `notes_receivable_net` | 資產負債表數據 (前一年) |
| 應收帳款淨額 (前一年) | `financial_basics` | `ar_net` | 資產負債表數據 (前一年) |
| 關係人應收帳款淨額 (前一年) | `financial_basics` | `ar_related_net` | 資產負債表數據 (前一年) |

##### 評分邏輯

- **評分方法**：ratio_benchmark（比率基準法）
- **基準值**：12（週轉 12 次視為行業標準）
- **最高分**：85 分
- **評分公式**：`(週轉率 ÷ 12) × 85`
- **分數範圍**：0-100 分
- **特殊規則**：
  - 若平均應收帳款為 0，則給 0 分
  - 若計算結果 > 100，則取上限 100
  - 若計算結果 < 0，則取下限 0

##### SQL 完整語法

```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,

    -- 當年度營業收入合計
    pl.operating_revenue_total,

    -- 當年度 應收帳款
    COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0) as current_ar,

    -- 前一年度 應收帳款 (可能為 NULL，因此稍後會用 COALESCE 處理)
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0) as previous_year_ar,

    -- 平均 應收帳款 = (當年度應收帳款 + 前一年應收帳款) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0 as avg_ar,

    -- 應收帳款週轉率 = 營業收入合計 ÷ 平均應收帳款
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0) > 0
        THEN pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)
        ELSE NULL
    END AS ar_turnover_ratio,

    -- 雷達圖分數轉換（標準化）
    -- 應收帳款週轉率 ÷ 12（假設標準）× 85，加權為 85 分
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE
        WHEN (COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0)) = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / $1 * $2 > 100 THEN 100
        WHEN (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / $1 * $2 < 0 THEN 0
        ELSE (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / $1 * $2
    END AS radar_score

-- 🔗 主表：損益表 (營業收入來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度應收帳款）
INNER JOIN public.financial_basics f_current
    ON pl.tax_id = f_current.tax_id
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年應收帳款）
LEFT JOIN public.financial_basics f_previous
    ON pl.tax_id = f_previous.tax_id
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = $3
    AND pl.tax_id = $4;
```

**查詢參數**：
- `$1`: benchmark (基準值，預設 12)
- `$2`: maxScore (最高分，預設 85)
- `$3`: fiscal_year (會計年度，如 '2024')
- `$4`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
receivables_turnover: {
  name: '應收帳款週轉率',
  weight: 0.3333, // 在營運能力中的權重 (33.33%)
  benchmark: 12, // 行業標準值
  maxScore: 85, // 最高分數
  calculation: {
    formula: 'revenue / avg_accounts_receivable',
    tables: ['pl_income_basics', 'financial_basics'],
    fields: {
      revenue: 'pl_income_basics.revenue',
      current_receivables: 'f_current.accounts_receivable',
      previous_receivables: 'f_previous.accounts_receivable'
    }
  },
  scoring: {
    method: 'ratio_benchmark',
    formula: '(value / benchmark) * maxScore',
    bounds: { min: 0, max: 100 },
    specialRules: [
      'if avg_accounts_receivable = 0 then score = 0',
      'if score > 100 then score = 100',
      'if score < 0 then score = 0'
    ]
  }
}
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算應收帳款週轉率分數
 */
export const calculateReceivablesTurnoverScore = (turnoverRatio) => {
  const config = OPERATIONAL_METRICS.receivables_turnover;

  if (turnoverRatio === null || turnoverRatio === undefined) {
    return 0;
  }

  // 基於基準值計算分數
  const score = (turnoverRatio / config.benchmark) * config.maxScore;

  // 限制在 0-100 範圍內
  return Math.max(0, Math.min(100, score));
};
```

---

#### KRI 1.3: 總資產週轉率

##### 業務定義

- **指標名稱**：總資產週轉率 (Total Assets Turnover Ratio)
- **所屬維度**：營運能力
- **維度權重**：33.34% (在營運能力維度中)
- **業務意義**：衡量企業運用總資產創造營收的整體效率。週轉率越高代表資產運用效率越好，企業能用較少的資產創造更多的營收。行業標準約為 1.5 次/年。

##### 計算公式

**數學公式**：
```
總資產週轉率 = 營業收入合計 ÷ 平均總資產
平均總資產 = (當年度總資產 + 前一年度總資產) ÷ 2
總資產 = 流動資產合計 + 非流動資產合計
```

**變數定義**：
- **營業收入合計**：當年度損益表中的營業收入總額
- **總資產**：資產負債表中所有資產科目的總和，包含：
  - 流動資產：現金、金融資產、應收票據、應收帳款、存貨、預付款項等
  - 非流動資產：金融資產、權益法投資、不動產廠房設備、無形資產等

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 營業收入合計 | `pl_income_basics` | `operating_revenue_total` | 損益表數據 |
| 流動資產合計 | `financial_basics` | `total_current_assets` | 資產負債表數據（當年） |
| 非流動資產合計 | `financial_basics` | 計算求得 | 26個非流動資產欄位加總 |
| 前一年度總資產 | `financial_basics` | 同上欄位 | 資產負債表數據（前一年） |

**完整資產科目清單**：
```javascript
// 資產負債表中的26個資產科目
const assetFields = [
  // 流動資產 (13項)
  'cash_equivalents', 'fvtpl_assets_current', 'fvoci_assets_current',
  'notes_receivable_net', 'ar_net', 'ar_related_net', 'other_receivables_net',
  'inventory', 'prepayments', 'total_current_assets',

  // 非流動資產 (13項)
  'fvtpl_assets_noncurrent', 'fvoci_assets_noncurrent', 'equity_method_investments',
  'ppe', 'right_of_use_assets', 'investment_properties_net',
  'intangible_assets', 'deferred_tax_assets'
];
```

##### 評分邏輯

- **評分方法**：ratio_benchmark（比率基準法）
- **基準值**：1.5（週轉 1.5 次視為行業標準）
- **最高分**：85 分
- **評分公式**：`(週轉率 ÷ 1.5) × 85`
- **分數範圍**：0-100 分
- **特殊規則**：
  - 若平均總資產為 0，則給 0 分
  - 若計算結果 > 100，則取上限 100
  - 若計算結果 < 0，則取下限 0

##### SQL 完整語法

```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,

    -- 當年度營業收入合計
    pl.operating_revenue_total,

    -- 當年度總資產 (流動資產 + 非流動資產)
    COALESCE(f_current.total_current_assets,0) +
    COALESCE(f_current.fvtpl_assets_noncurrent,0) +
    COALESCE(f_current.fvoci_assets_noncurrent,0) +
    COALESCE(f_current.equity_method_investments,0) +
    COALESCE(f_current.ppe,0) +
    COALESCE(f_current.right_of_use_assets,0) +
    COALESCE(f_current.investment_properties_net,0) +
    COALESCE(f_current.intangible_assets,0) +
    COALESCE(f_current.deferred_tax_assets,0)
    AS current_total_assets,

    -- 前一年度總資產 (可能為 NULL，因此稍後會用 COALESCE 處理)
    COALESCE(f_previous.total_current_assets,0) +
    COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
    COALESCE(f_previous.fvoci_assets_noncurrent,0) +
    COALESCE(f_previous.equity_method_investments,0) +
    COALESCE(f_previous.ppe,0) +
    COALESCE(f_previous.right_of_use_assets,0) +
    COALESCE(f_previous.investment_properties_net,0) +
    COALESCE(f_previous.intangible_assets,0) +
    COALESCE(f_previous.deferred_tax_assets,0)
    AS previous_year_total_assets,

    -- 平均總資產 = (當年度總資產 + 前一年總資產) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (
        (COALESCE(f_current.total_current_assets,0) +
         COALESCE(f_current.fvtpl_assets_noncurrent,0) +
         COALESCE(f_current.fvoci_assets_noncurrent,0) +
         COALESCE(f_current.equity_method_investments,0) +
         COALESCE(f_current.ppe,0) +
         COALESCE(f_current.right_of_use_assets,0) +
         COALESCE(f_current.investment_properties_net,0) +
         COALESCE(f_current.intangible_assets,0) +
         COALESCE(f_current.deferred_tax_assets,0))
        +
        (COALESCE(f_previous.total_current_assets,0) +
         COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
         COALESCE(f_previous.fvoci_assets_noncurrent,0) +
         COALESCE(f_previous.equity_method_investments,0) +
         COALESCE(f_previous.ppe,0) +
         COALESCE(f_previous.right_of_use_assets,0) +
         COALESCE(f_previous.investment_properties_net,0) +
         COALESCE(f_previous.intangible_assets,0) +
         COALESCE(f_previous.deferred_tax_assets,0))
    )::NUMERIC / 2.0 AS avg_total_assets,

    -- 總資產週轉率 = 營業收入合計 ÷ 平均總資產
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN (
            (COALESCE(f_current.total_current_assets,0) +
             COALESCE(f_current.fvtpl_assets_noncurrent,0) +
             COALESCE(f_current.fvoci_assets_noncurrent,0) +
             COALESCE(f_current.equity_method_investments,0) +
             COALESCE(f_current.ppe,0) +
             COALESCE(f_current.right_of_use_assets,0) +
             COALESCE(f_current.investment_properties_net,0) +
             COALESCE(f_current.intangible_assets,0) +
             COALESCE(f_current.deferred_tax_assets,0))
            +
            (COALESCE(f_previous.total_current_assets,0) +
             COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
             COALESCE(f_previous.fvoci_assets_noncurrent,0) +
             COALESCE(f_previous.equity_method_investments,0) +
             COALESCE(f_previous.ppe,0) +
             COALESCE(f_previous.right_of_use_assets,0) +
             COALESCE(f_previous.investment_properties_net,0) +
             COALESCE(f_previous.intangible_assets,0) +
             COALESCE(f_previous.deferred_tax_assets,0))
        ) > 0
        THEN pl.operating_revenue_total::NUMERIC / (
            (
                (COALESCE(f_current.total_current_assets,0) +
                 COALESCE(f_current.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_current.fvoci_assets_noncurrent,0) +
                 COALESCE(f_current.equity_method_investments,0) +
                 COALESCE(f_current.ppe,0) +
                 COALESCE(f_current.right_of_use_assets,0) +
                 COALESCE(f_current.investment_properties_net,0) +
                 COALESCE(f_current.intangible_assets,0) +
                 COALESCE(f_current.deferred_tax_assets,0))
                +
                (COALESCE(f_previous.total_current_assets,0) +
                 COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_previous.fvoci_assets_noncurrent,0) +
                 COALESCE(f_previous.equity_method_investments,0) +
                 COALESCE(f_previous.ppe,0) +
                 COALESCE(f_previous.right_of_use_assets,0) +
                 COALESCE(f_previous.investment_properties_net,0) +
                 COALESCE(f_previous.intangible_assets,0) +
                 COALESCE(f_previous.deferred_tax_assets,0))
            )::NUMERIC / 2.0
        )
        ELSE NULL
    END AS total_assets_turnover_ratio,

    -- 雷達圖分數轉換（標準化）
    -- 總資產週轉率 ÷ 1.5（基準標準）× 85，加權為 85 分
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE
        WHEN (
            (COALESCE(f_current.total_current_assets,0) +
             COALESCE(f_current.fvtpl_assets_noncurrent,0) +
             COALESCE(f_current.fvoci_assets_noncurrent,0) +
             COALESCE(f_current.equity_method_investments,0) +
             COALESCE(f_current.ppe,0) +
             COALESCE(f_current.right_of_use_assets,0) +
             COALESCE(f_current.investment_properties_net,0) +
             COALESCE(f_current.intangible_assets,0) +
             COALESCE(f_current.deferred_tax_assets,0))
            +
            (COALESCE(f_previous.total_current_assets,0) +
             COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
             COALESCE(f_previous.fvoci_assets_noncurrent,0) +
             COALESCE(f_previous.equity_method_investments,0) +
             COALESCE(f_previous.ppe,0) +
             COALESCE(f_previous.right_of_use_assets,0) +
             COALESCE(f_previous.investment_properties_net,0) +
             COALESCE(f_previous.intangible_assets,0) +
             COALESCE(f_previous.deferred_tax_assets,0))
        ) = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (pl.operating_revenue_total::NUMERIC / (
            (
                (COALESCE(f_current.total_current_assets,0) +
                 COALESCE(f_current.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_current.fvoci_assets_noncurrent,0) +
                 COALESCE(f_current.equity_method_investments,0) +
                 COALESCE(f_current.ppe,0) +
                 COALESCE(f_current.right_of_use_assets,0) +
                 COALESCE(f_current.investment_properties_net,0) +
                 COALESCE(f_current.intangible_assets,0) +
                 COALESCE(f_current.deferred_tax_assets,0))
                +
                (COALESCE(f_previous.total_current_assets,0) +
                 COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_previous.fvoci_assets_noncurrent,0) +
                 COALESCE(f_previous.equity_method_investments,0) +
                 COALESCE(f_previous.ppe,0) +
                 COALESCE(f_previous.right_of_use_assets,0) +
                 COALESCE(f_previous.investment_properties_net,0) +
                 COALESCE(f_previous.intangible_assets,0) +
                 COALESCE(f_previous.deferred_tax_assets,0))
            )::NUMERIC / 2.0
        )) / $1 * $2 > 100 THEN 100
        WHEN (pl.operating_revenue_total::NUMERIC / (
            (
                (COALESCE(f_current.total_current_assets,0) +
                 COALESCE(f_current.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_current.fvoci_assets_noncurrent,0) +
                 COALESCE(f_current.equity_method_investments,0) +
                 COALESCE(f_current.ppe,0) +
                 COALESCE(f_current.right_of_use_assets,0) +
                 COALESCE(f_current.investment_properties_net,0) +
                 COALESCE(f_current.intangible_assets,0) +
                 COALESCE(f_current.deferred_tax_assets,0))
                +
                (COALESCE(f_previous.total_current_assets,0) +
                 COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_previous.fvoci_assets_noncurrent,0) +
                 COALESCE(f_previous.equity_method_investments,0) +
                 COALESCE(f_previous.ppe,0) +
                 COALESCE(f_previous.right_of_use_assets,0) +
                 COALESCE(f_previous.investment_properties_net,0) +
                 COALESCE(f_previous.intangible_assets,0) +
                 COALESCE(f_previous.deferred_tax_assets,0))
            )::NUMERIC / 2.0
        )) / $1 * $2 < 0 THEN 0
        ELSE (pl.operating_revenue_total::NUMERIC / (
            (
                (COALESCE(f_current.total_current_assets,0) +
                 COALESCE(f_current.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_current.fvoci_assets_noncurrent,0) +
                 COALESCE(f_current.equity_method_investments,0) +
                 COALESCE(f_current.ppe,0) +
                 COALESCE(f_current.right_of_use_assets,0) +
                 COALESCE(f_current.investment_properties_net,0) +
                 COALESCE(f_current.intangible_assets,0) +
                 COALESCE(f_current.deferred_tax_assets,0))
                +
                (COALESCE(f_previous.total_current_assets,0) +
                 COALESCE(f_previous.fvtpl_assets_noncurrent,0) +
                 COALESCE(f_previous.fvoci_assets_noncurrent,0) +
                 COALESCE(f_previous.equity_method_investments,0) +
                 COALESCE(f_previous.ppe,0) +
                 COALESCE(f_previous.right_of_use_assets,0) +
                 COALESCE(f_previous.investment_properties_net,0) +
                 COALESCE(f_previous.intangible_assets,0) +
                 COALESCE(f_previous.deferred_tax_assets,0))
            )::NUMERIC / 2.0
        )) / $1 * $2
    END AS radar_score

-- 🔗 主表：損益表 (營業收入來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度總資產）
INNER JOIN public.financial_basics f_current
    ON pl.tax_id = f_current.tax_id
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年總資產）
LEFT JOIN public.financial_basics f_previous
    ON pl.tax_id = f_previous.tax_id
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = $3
    AND pl.tax_id = $4;
```

**查詢參數**：
- `$1`: benchmark (基準值，預設 1.5)
- `$2`: maxScore (最高分，預設 85)
- `$3`: fiscal_year (會計年度，如 '2024')
- `$4`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const OPERATIONAL_METRICS = {
  // ... 其他指標
  total_assets_turnover: {
    name: '總資產週轉率',
    weight: 0.3334, // 在營運能力中的權重 (33.34%)
    benchmark: 1.5, // 行業標準值
    maxScore: 85, // 最高分數
    calculation: {
      formula: 'operating_revenue_total / avg_total_assets',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        operating_revenue_total: 'pl_income_basics.operating_revenue_total',
        current_assets: 'f_current.total_assets',
        previous_assets: 'f_previous.total_assets'
      },
      asset_components: [
        'total_current_assets', 'fvtpl_assets_noncurrent',
        'fvoci_assets_noncurrent', 'equity_method_investments',
        'ppe', 'right_of_use_assets', 'investment_properties_net',
        'intangible_assets', 'deferred_tax_assets'
      ]
    },
    scoring: {
      method: 'ratio_benchmark',
      formula: '(value / benchmark) * maxScore',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if avg_total_assets = 0 then score = 0',
        'if score > 100 then score = 100',
        'if score < 0 then score = 0'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算總資產週轉率分數
 */
export const calculateTotalAssetsTurnoverScore = (turnoverRatio) => {
  const config = OPERATIONAL_METRICS.total_assets_turnover;

  if (turnoverRatio === null || turnoverRatio === undefined) {
    return 0;
  }

  // 基於配置計算分數
  const score = (turnoverRatio / config.benchmark) * config.maxScore;

  // 應用邊界限制
  return Math.max(0, Math.min(100, score));
};
```

---

### 維度二：財務能力（權重 25%）

財務能力維度用於衡量企業的財務健康狀況、獲利能力與流動性，包含兩個核心指標：

#### KRI 2.1: 股東權益報酬率 (ROE)

##### 業務定義

- **指標名稱**：股東權益報酬率 (Return on Equity, ROE)
- **所屬維度**：財務能力
- **維度權重**：50% (在財務能力維度中)
- **業務意義**：衡量企業運用股東權益創造利潤的能力。ROE 越高代表股東投入資本的運用效率越好，企業為股東創造價值的能力越強。行業標準約為 15%。

##### 計算公式

**數學公式**：
```
股東權益報酬率 = 稅後淨利 ÷ 平均股東權益
平均股東權益 = (當年度股東權益 + 前一年度股東權益) ÷ 2
```

**變數定義**：
- **稅後淨利**：當年度損益表中的稅後純益
- **股東權益**：資產負債表中的股東權益合計

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 稅後淨利 | `pl_income_basics` | `net_income` | 損益表數據 |
| 當年度股東權益 | `financial_basics` | `total_equity` | 資產負債表數據（當年） |
| 前一年度股東權益 | `financial_basics` | `total_equity` | 資產負債表數據（前一年） |

##### 評分邏輯

- **評分方法**：segmented_scoring（分段評分法）
- **評分分段**：
  - ROE < 0：0-25 分（虧損情況）
  - 0% ≤ ROE ≤ 15%：50-83 分（正常獲利）
  - ROE > 15%：83-100 分（優異獲利）
- **特殊規則**：
  - 若平均股東權益 ≤ 0，則評分為 NULL

##### SQL 完整語法

```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,

    -- 當年度稅後淨利
    pl.net_income,

    -- 當年度股東權益
    f_current.total_equity AS current_equity,

    -- 前一年度股東權益 (可能為 NULL，因此稍後會用 COALESCE 處理)
    f_previous.total_equity AS previous_year_equity,

    -- 平均股東權益 = (當年度股東權益 + 前一年股東權益) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0 AS avg_equity,

    -- 股東權益報酬率 = 稅後淨利 ÷ 平均股東權益
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) > 0
        THEN pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)
        ELSE NULL
    END AS roe,

    -- 雷達圖分數轉換（分段評分）
    -- 分段評分邏輯：
    -- ROE < 0: 0-25分
    -- 0% ≤ ROE ≤ 15%: 50-83分
    -- ROE > 15%: 83-100分
    CASE
        WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) <= 0 THEN NULL  -- 分母 <= 0，評分為 NULL

        WHEN pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0) < 0 THEN
            -- ROE < 0: 0-25分，按虧損程度線性映射
            0 + 25 * LEAST(ABS(pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 10.0, 1.0)

        WHEN pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0) <= 0.15 THEN
            -- 0% ≤ ROE ≤ 15%: 50-83分，線性映射
            50 + 33 * (pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 0.15

        ELSE
            -- ROE > 15%: 83-100分，按超出程度線性映射
            83 + 17 * LEAST((pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0) - 0.15) / 0.15, 1.0)
    END AS radar_score

-- 🔗 主表：損益表 (稅後淨利來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度股東權益）
INNER JOIN public.financial_basics f_current
    ON pl.tax_id = f_current.tax_id
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年股東權益）
LEFT JOIN public.financial_basics f_previous
    ON pl.tax_id = f_previous.tax_id
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = $1
    AND pl.tax_id = $2;
```

**查詢參數**：
- `$1`: fiscal_year (會計年度，如 '2024')
- `$2`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const FINANCIAL_METRICS = {
  roe: {
    name: '股東權益報酬率(ROE)',
    weight: 0.5, // 在財務能力中的權重 (與流動比率平分)
    calculation: {
      formula: 'net_income / avg_total_equity',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        net_income: 'pl_income_basics.net_income',
        current_equity: 'f_current.total_equity',
        previous_equity: 'f_previous.total_equity'
      }
    },
    scoring: {
      method: 'segmented_scoring',
      segments: [
        {
          condition: 'roe < 0',
          scoreRange: { min: 0, max: 25 },
          formula: '0 + (25 - 0) * MIN(ABS(roe) / 10.0, 1.0)'
        },
        {
          condition: '0 <= roe <= 0.15',
          scoreRange: { min: 50, max: 83 },
          formula: '50 + (83 - 50) * (roe / 0.15)'
        },
        {
          condition: 'roe > 0.15',
          scoreRange: { min: 83, max: 100 },
          formula: '83 + (100 - 83) * MIN((roe - 0.15) / 0.15, 1.0)'
        }
      ],
      specialRules: [
        'if avg_total_equity <= 0 then score = NULL'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算股東權益報酬率分數
 */
export const calculateRoeScore = (roe) => {
  const config = FINANCIAL_METRICS.roe;

  if (roe === null || roe === undefined) {
    return 0;
  }

  // 分段評分邏輯
  if (roe < 0) {
    // ROE < 0: 0-25分
    return Math.min(25, Math.abs(roe) * 2.5);
  } else if (roe <= 0.15) {
    // 0% ≤ ROE ≤ 15%: 50-83分
    return 50 + (roe / 0.15) * 33;
  } else {
    // ROE > 15%: 83-100分
    return 83 + Math.min(17, (roe - 0.15) * 113.33);
  }
};
```

---

#### KRI 2.2: 流動比率

##### 業務定義

- **指標名稱**：流動比率 (Current Ratio)
- **所屬維度**：財務能力
- **維度權重**：50% (在財務能力維度中)
- **業務意義**：衡量企業短期債務償還能力。流動比率越高代表企業短期流動性越好，能夠及時償還短期債務。行業標準為 2.0。

##### 計算公式

**數學公式**：
```
流動比率 = 流動資產合計 ÷ 流動負債合計
```

**變數定義**：
- **流動資產合計**：資產負債表中的流動資產總額
- **流動負債合計**：資產負債表中的流動負債總額

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 流動資產合計 | `financial_basics` | `total_current_assets` | 資產負債表數據 |
| 流動負債合計 | `financial_basics` | `total_current_liabilities` | 資產負債表數據 |

##### 評分邏輯

- **評分方法**：linear_scoring（線性評分法）
- **基準值**：2.0（流動比率 2.0 視為健康標準）
- **評分公式**：`(流動比率 ÷ 2.0) × 100`
- **分數範圍**：0-100 分
- **特殊規則**：
  - 若流動負債為 0，則給 0 分
  - 若計算結果 > 100，則取上限 100

##### SQL 完整語法

```sql
SELECT
    -- 年度
    fiscal_year,
    -- 公司名稱
    company_name,
    -- 統一編號
    tax_id,

    -- 流動資產合計
    total_current_assets,

    -- 流動負債合計
    total_current_liabilities,

    -- 流動比率 = 流動資產合計 ÷ 流動負債合計
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN total_current_liabilities > 0
        THEN total_current_assets::NUMERIC / total_current_liabilities::NUMERIC
        ELSE NULL
    END AS current_ratio,

    -- 雷達圖分數轉換（線性評分）
    -- 流動比率 ÷ 2.0（基準標準）× 100
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE
        WHEN total_current_liabilities = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (total_current_assets::NUMERIC / total_current_liabilities::NUMERIC) / 2.0 * 100 > 100 THEN 100
        WHEN (total_current_assets::NUMERIC / total_current_liabilities::NUMERIC) / 2.0 * 100 < 0 THEN 0
        ELSE (total_current_assets::NUMERIC / total_current_liabilities::NUMERIC) / 2.0 * 100
    END AS radar_score

-- 🔗 主表：資產負債表
FROM public.financial_basics

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    fiscal_year = $1
    AND tax_id = $2;
```

**查詢參數**：
- `$1`: fiscal_year (會計年度，如 '2024')
- `$2`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const FINANCIAL_METRICS = {
  // ... ROE 配置
  current_ratio: {
    name: '流動比率',
    weight: 0.5, // 在財務能力中的權重 (與ROE平分)
    calculation: {
      formula: 'total_current_assets / total_current_liabilities',
      tables: ['financial_basics'],
      fields: {
        total_current_assets: 'financial_basics.total_current_assets',
        total_current_liabilities: 'financial_basics.total_current_liabilities'
      }
    },
    scoring: {
      method: 'linear_scoring',
      benchmark: 2.0, // 以2.0為基準
      formula: 'MIN(100, MAX(0, (current_ratio / 2.0) * 100))',
      specialRules: [
        'if total_current_liabilities = 0 then score = 0'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算流動比率分數
 */
export const calculateCurrentRatioScore = (currentRatio) => {
  const config = FINANCIAL_METRICS.current_ratio;

  if (currentRatio === null || currentRatio === undefined) {
    return 0;
  }

  // 基於基準值計算分數，限制在 0-100 範圍內
  const score = (currentRatio / config.benchmark) * 100;
  return Math.max(0, Math.min(100, score));
};
```

---

### 維度三：未來力（權重 15%）

未來力維度用於衡量企業的成長潛力與未來發展趨勢，包含兩個核心指標：

#### KRI 3.1: 營收成長率

##### 業務定義

- **指標名稱**：營收成長率 (Revenue Growth Rate)
- **所屬維度**：未來力
- **維度權重**：50% (在未來力維度中)
- **業務意義**：衡量企業營收的年度成長幅度。成長率越高代表企業業務擴張能力越強，市場競爭力越好。正面成長率為佳。

##### 計算公式

**數學公式**：
```
營收成長率 = (當年度營收 - 前一年度營收) ÷ 前一年度營收
```

**變數定義**：
- **當年度營收**：當年度損益表中的營業收入合計
- **前一年度營收**：前一年度損益表中的營業收入合計

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 當年度營收 | `pl_income_basics` | `operating_revenue_total` | 損益表數據（當年） |
| 前一年度營收 | `pl_income_basics` | `operating_revenue_total` | 損益表數據（前一年） |

##### 評分邏輯

- **評分方法**：segmented_scoring（分段評分法）
- **評分分段**：
  - 成長率 < -20%：0 分（嚴重衰退）
  - -20% ≤ 成長率 < 0%：按衰退程度評分 0-30 分
  - 0% ≤ 成長率 ≤ 15%：線性評分 60-85 分
  - 成長率 > 15%：優異評分 85-100 分
- **特殊規則**：
  - 若前一年度營收 ≤ 0，則評分為 NULL

##### SQL 完整語法

```sql
SELECT
    -- 當年度
    pl_current.fiscal_year,
    -- 公司名稱
    pl_current.company_name,
    -- 統一編號
    pl_current.tax_id,

    -- 當年度營收
    pl_current.operating_revenue_total AS current_revenue,

    -- 前一年度營收
    pl_previous.operating_revenue_total AS previous_year_revenue,

    -- 營收成長率 = (當年度營收 - 前一年營收) ÷ 前一年營收
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN pl_previous.operating_revenue_total > 0
        THEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC
        ELSE NULL
    END AS revenue_growth_rate,

    -- 雷達圖分數轉換（分段評分）
    -- 分段評分邏輯：
    -- 成長率 < -20%: 0分
    -- -20% ≤ 成長率 < 0%: 0-30分
    -- 0% ≤ 成長率 ≤ 15%: 60-85分
    -- 成長率 > 15%: 85-100分
    CASE
        WHEN pl_previous.operating_revenue_total <= 0 THEN NULL  -- 分母 <= 0，評分為 NULL

        WHEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC < -0.20 THEN
            -- 成長率 < -20%: 0分
            0

        WHEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC < 0 THEN
            -- -20% ≤ 成長率 < 0%: 0-30分
            30 * (1 + ((pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC) / 0.20)

        WHEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC <= 0.15 THEN
            -- 0% ≤ 成長率 ≤ 15%: 60-85分
            60 + 25 * ((pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC) / 0.15

        ELSE
            -- 成長率 > 15%: 85-100分
            85 + 15 * LEAST(((pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total::NUMERIC - 0.15) / 0.15, 1.0)
    END AS radar_score

-- 🔗 主表：當年度損益表
FROM public.pl_income_basics pl_current

-- 左聯接前一年度損益表（抓前一年營收）
LEFT JOIN public.pl_income_basics pl_previous
    ON pl_current.tax_id = pl_previous.tax_id
    AND pl_previous.fiscal_year = (pl_current.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl_current.fiscal_year = $1
    AND pl_current.tax_id = $2;
```

**查詢參數**：
- `$1`: fiscal_year (會計年度，如 '2024')
- `$2`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const FUTURE_METRICS = {
  revenue_growth: {
    name: '營收成長率',
    weight: 0.5, // 在未來力中的權重 (與CAGR平分)
    calculation: {
      formula: '(current_revenue - previous_revenue) / previous_revenue',
      tables: ['pl_income_basics'],
      fields: {
        current_revenue: 'pl_current.operating_revenue_total',
        previous_revenue: 'pl_previous.operating_revenue_total'
      }
    },
    scoring: {
      method: 'segmented_scoring',
      segments: [
        {
          condition: 'growth_rate < -0.2',
          scoreRange: { min: 0, max: 0 },
          formula: '0'
        },
        {
          condition: '-0.2 <= growth_rate < 0',
          scoreRange: { min: 0, max: 30 },
          formula: '30 * (1 + growth_rate / 0.2)'
        },
        {
          condition: '0 <= growth_rate <= 0.15',
          scoreRange: { min: 60, max: 85 },
          formula: '60 + 25 * (growth_rate / 0.15)'
        },
        {
          condition: 'growth_rate > 0.15',
          scoreRange: { min: 85, max: 100 },
          formula: '85 + 15 * MIN((growth_rate - 0.15) / 0.15, 1.0)'
        }
      ],
      specialRules: [
        'if previous_revenue <= 0 then score = NULL'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算營收成長率分數
 */
export const calculateRevenueGrowthScore = (growthRate) => {
  const config = FUTURE_METRICS.revenue_growth;

  if (growthRate === null || growthRate === undefined) {
    return 0;
  }

  // 分段評分邏輯
  if (growthRate < -0.20) {
    // 成長率 < -20%: 0分
    return 0;
  } else if (growthRate < 0) {
    // -20% ≤ 成長率 < 0%: 0-30分
    return 30 * (1 + growthRate / 0.20);
  } else if (growthRate <= 0.15) {
    // 0% ≤ 成長率 ≤ 15%: 60-85分
    return 60 + 25 * (growthRate / 0.15);
  } else {
    // 成長率 > 15%: 85-100分
    return 85 + 15 * Math.min((growthRate - 0.15) / 0.15, 1.0);
  }
};
```

---

#### KRI 3.2: 營收 CAGR

##### 業務定義

- **指標名稱**：營收年複合成長率 (Revenue Compound Annual Growth Rate, CAGR)
- **所屬維度**：未來力
- **維度權重**：50% (在未來力維度中)
- **業務意義**：衡量企業營收在過去3年的年複合成長率，反映長期成長趨勢。CAGR 越高代表企業長期成長能力越穩健。

##### 計算公式

**數學公式**：
```
營收 CAGR = (當年度營收 ÷ 3年前營收)^(1/3) - 1
```

**變數定義**：
- **當年度營收**：當年度損益表中的營業收入合計
- **3年前營收**：3年前損益表中的營業收入合計

##### 資料來源

| 資料項目 | 資料表 | 欄位名稱 | 說明 |
|---------|--------|----------|------|
| 當年度營收 | `pl_income_basics` | `operating_revenue_total` | 損益表數據（當年） |
| 3年前營收 | `pl_income_basics` | `operating_revenue_total` | 損益表數據（3年前） |

##### 評分邏輯

- **評分方法**：linear_scoring（線性評分法）
- **評分公式**：`(CAGR × 100) + 75`（將 CAGR 轉換為百分比後加基礎分）
- **分數範圍**：0-100 分
- **特殊規則**：
  - 若3年前營收 ≤ 0，則評分為 NULL
  - 若計算結果 > 100，則取上限 100

##### SQL 完整語法

```sql
SELECT
    -- 當年度
    pl_current.fiscal_year,
    -- 公司名稱
    pl_current.company_name,
    -- 統一編號
    pl_current.tax_id,

    -- 當年度營收
    pl_current.operating_revenue_total AS current_revenue,

    -- 3年前營收
    pl_3years_ago.operating_revenue_total AS revenue_3_years_ago,

    -- 營收 CAGR = (當年度營收 ÷ 3年前營收)^(1/3) - 1
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE
        WHEN pl_3years_ago.operating_revenue_total > 0
        THEN POWER(pl_current.operating_revenue_total::NUMERIC / pl_3years_ago.operating_revenue_total::NUMERIC, 1.0/3.0) - 1
        ELSE NULL
    END AS revenue_cagr,

    -- 雷達圖分數轉換（線性評分）
    -- CAGR × 100 + 75
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE
        WHEN pl_3years_ago.operating_revenue_total <= 0 THEN NULL  -- 分母 <= 0，評分為 NULL
        WHEN (POWER(pl_current.operating_revenue_total::NUMERIC / pl_3years_ago.operating_revenue_total::NUMERIC, 1.0/3.0) - 1) * 100 + 75 > 100 THEN 100
        WHEN (POWER(pl_current.operating_revenue_total::NUMERIC / pl_3years_ago.operating_revenue_total::NUMERIC, 1.0/3.0) - 1) * 100 + 75 < 0 THEN 0
        ELSE (POWER(pl_current.operating_revenue_total::NUMERIC / pl_3years_ago.operating_revenue_total::NUMERIC, 1.0/3.0) - 1) * 100 + 75
    END AS radar_score

-- 🔗 主表：當年度損益表
FROM public.pl_income_basics pl_current

-- 左聯接3年前損益表（抓3年前營收）
LEFT JOIN public.pl_income_basics pl_3years_ago
    ON pl_current.tax_id = pl_3years_ago.tax_id
    AND pl_3years_ago.fiscal_year = (pl_current.fiscal_year::INTEGER - 3)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl_current.fiscal_year = $1
    AND pl_current.tax_id = $2;
```

**查詢參數**：
- `$1`: fiscal_year (會計年度，如 '2024')
- `$2`: tax_id (統一編號，如 '97179430')

##### 計算函數

**配置定義** (`src/config/businessLogic.js`):
```javascript
export const FUTURE_METRICS = {
  // ... 營收成長率配置
  revenue_cagr: {
    name: '營收CAGR',
    weight: 0.5, // 在未來力中的權重 (與營收成長率平分)
    calculation: {
      formula: 'POWER(current_revenue / revenue_3_years_ago, 1/3) - 1',
      tables: ['pl_income_basics'],
      fields: {
        current_revenue: 'pl_current.operating_revenue_total',
        revenue_3_years_ago: 'pl_3years_ago.operating_revenue_total'
      }
    },
    scoring: {
      method: 'linear_scoring',
      formula: '(cagr * 100) + 75',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if revenue_3_years_ago <= 0 then score = NULL'
      ]
    }
  }
};
```

**評分函數** (`src/services/calculationService.js`):
```javascript
/**
 * 計算營收 CAGR 分數
 */
export const calculateRevenueCagrScore = (cagr) => {
  const config = FUTURE_METRICS.revenue_cagr;

  if (cagr === null || cagr === undefined) {
    return 0;
  }

  // 線性評分：CAGR × 100 + 75，限制在 0-100 範圍內
  const score = (cagr * 100) + 75;
  return Math.max(0, Math.min(100, score));
};
```

---

(將繼續新增其他 KRI...)
