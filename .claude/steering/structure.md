# 專案結構與編碼規範

## 專案目錄結構

```
BusinessSustainabilityAssessment/
├── .claude/                                # Claude Code 配置
│   ├── agents/                            # Agent 定義
│   ├── commands/                          # Slash 命令
│   ├── templates/                         # 文件模板
│   └── steering/                          # 專案指引文件
│       ├── product.md                     # 產品願景
│       ├── tech.md                        # 技術堆疊
│       └── structure.md                   # 此文件
│
├── .github/                               # GitHub 配置
│   └── workflows/                         # CI/CD 自動化
│       └── deploy.yml                     # GitHub Pages 部署
│
├── src/                                   # 原始碼目錄
│   ├── components/                        # UI 組件
│   │   ├── ui/                           # 基礎 UI 組件庫
│   │   │   ├── Button.jsx                # 按鈕組件
│   │   │   ├── Card.jsx                  # 卡片組件
│   │   │   ├── Select.jsx                # 下拉選單
│   │   │   ├── Table.jsx                 # 表格組件
│   │   │   ├── Loading.jsx               # 載入狀態
│   │   │   └── index.js                  # 統一導出
│   │   ├── layout/                       # 版面組件
│   │   │   ├── Header.jsx                # 頁首
│   │   │   ├── Sidebar.jsx               # 側邊欄
│   │   │   └── MainLayout.jsx            # 主版面
│   │   ├── pages/                        # 頁面組件
│   │   │   ├── CompaniesPage.jsx         # 公司列表頁
│   │   │   ├── DataManagementPage.jsx    # 數據管理頁
│   │   │   ├── ProfilePage.jsx           # 個人資料頁
│   │   │   ├── ReportsPage.jsx           # 報表頁
│   │   │   └── SourcesPage.jsx           # 來源頁
│   │   ├── charts/                       # 圖表配置
│   │   │   └── chartThemes.js            # Recharts 主題
│   │   └── DimensionComparisonTable.jsx  # 維度比較表
│   │
│   ├── contexts/                          # React Context 狀態管理
│   │   ├── UIContext.jsx                 # UI 狀態
│   │   ├── CompanyContext.jsx            # 公司數據狀態
│   │   ├── DataManagementContext.jsx     # 數據管理狀態
│   │   └── index.js                      # 統一導出
│   │
│   ├── services/                          # 業務邏輯服務層
│   │   ├── dataService.js                # Supabase 數據操作
│   │   ├── calculationService.js         # 評分計算邏輯
│   │   └── calculationService.test.js    # 單元測試
│   │
│   ├── config/                            # 配置與靜態定義
│   │   ├── businessLogic.js              # 指標定義與權重
│   │   └── sqlTemplates.js               # SQL 查詢模板
│   │
│   ├── BusinessSustainabilityAssessment.jsx  # 主應用組件 (待重構)
│   ├── App.jsx                            # 應用入口
│   ├── main.jsx                           # React 掛載點
│   ├── index.css                          # 全域樣式與 CSS 變數
│   └── supabaseClient.js                 # Supabase 連接配置
│
├── docs/                                  # 技術文檔
│   ├── business-logic-specification.md   # 指標計算規格
│   └── implementation-summary.md         # 實作摘要
│
├── design-refs/                           # 設計參考資源
├── dist/                                  # 建構輸出 (git ignored)
├── node_modules/                          # 依賴套件 (git ignored)
│
├── index.html                             # HTML 入口
├── package.json                           # 專案依賴與腳本
├── package-lock.json                      # 鎖定依賴版本
├── vite.config.js                         # Vite 建構配置
├── tailwind.config.js                     # Tailwind CSS 配置
├── postcss.config.js                      # PostCSS 配置
├── .gitignore                             # Git 忽略清單
├── README.md                              # 專案說明
└── CLAUDE.md                              # Claude Code 技術文檔
```

## 命名規範

### 檔案命名
- **組件檔案**: `PascalCase.jsx` (如 `CompanyContext.jsx`)
- **服務檔案**: `camelCase.js` (如 `dataService.js`)
- **配置檔案**: `camelCase.js` (如 `businessLogic.js`)
- **測試檔案**: `*.test.js` (如 `calculationService.test.js`)

### 變數與函數命名
- **React 組件**: `PascalCase` (如 `MainLayout`)
- **函數**: `camelCase` (如 `calculateScore`)
- **常數**: `UPPER_SNAKE_CASE` (如 `API_URL`)
- **私有變數**: `_camelCase` (如 `_cache`)

### CSS 類別命名
- **Tailwind Utilities**: 直接使用 (如 `bg-slate-800`)
- **自訂類別**: `kebab-case` (如 `card-container`)
- **CSS 變數**: `--kebab-case` (如 `--primary-500`)

## 組件設計規範

### 組件結構模板
```jsx
// 1. Import 區塊
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';

// 2. 常數定義
const DEFAULT_VALUE = 100;

// 3. 組件定義
export const ComponentName = ({ prop1, prop2 }) => {
  // 3.1 Hooks
  const [state, setState] = useState(null);

  // 3.2 副作用
  useEffect(() => {
    // 初始化邏輯
  }, []);

  // 3.3 事件處理
  const handleClick = () => {
    // 處理邏輯
  };

  // 3.4 渲染邏輯
  return (
    <div className="container">
      {/* JSX 內容 */}
    </div>
  );
};

// 4. PropTypes (可選)
ComponentName.propTypes = {
  // ...
};

// 5. Default Export (如果需要)
export default ComponentName;
```

### 組件拆分原則
- **單一職責**: 一個組件只做一件事
- **可重用性**: 基礎組件放在 `components/ui/`
- **頁面組件**: 完整頁面放在 `components/pages/`
- **版面組件**: 布局相關放在 `components/layout/`
- **大小限制**: 單一組件不超過 300 行 (目前 BusinessSustainabilityAssessment.jsx 需重構)

## 數據流動規範

### 數據獲取流程
```
UI Component
    ↓ (呼叫)
Context Provider
    ↓ (呼叫)
Service Layer (dataService)
    ↓ (查詢)
Supabase Client
    ↓ (返回)
Raw Data
    ↓ (處理)
Calculation Service
    ↓ (返回)
Computed Data
    ↓ (更新)
Component State
    ↓ (渲染)
UI Update
```

### 狀態管理規範
- **本地狀態**: 使用 `useState` (僅限單一組件)
- **共享狀態**: 使用 Context API
- **快取策略**: `companyDataCache` 存儲已載入數據
- **Loading 狀態**: 各組件獨立管理避免全頁阻塞

## 樣式設計規範

### Tailwind CSS 使用原則
1. **優先使用 Utility Classes**
2. **避免內聯樣式** (除非動態計算)
3. **使用 CSS 變數** 定義主題色彩
4. **響應式設計**: `md:` `lg:` 斷點

### CSS 變數系統
定義於 `src/index.css`:
```css
:root {
  /* 色彩系統 */
  --primary-500: #3b82f6;
  --secondary-500: #8b5cf6;
  --neutral-800: #1e293b;

  /* 間距系統 */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;

  /* 圓角系統 */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* 陰影系統 */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 色彩設計系統
- **主色調**: Slate 系列 (淺色主題)
- **強調色**: Blue, Teal, Purple
- **狀態色彩**:
  - 優異: `#4CAF50` (綠色)
  - 良好: `#8BC34A` (淺綠)
  - 一般: `#FFC107` (黃色)
  - 待改善: `#FF9800` (橘色)
  - 風險: `#F44336` (紅色)

## 業務邏輯配置規範

### 新增指標的標準流程
1. **定義指標** - 在 `config/businessLogic.js` 新增配置
   ```javascript
   export const INDICATORS = {
     新指標名稱: {
       weight: 0.33,        // 權重
       benchmarks: {...},   // 基準值
       scoringLogic: fn     // 評分邏輯
     }
   };
   ```

2. **定義 SQL** - 在 `config/sqlTemplates.js` 新增查詢
   ```javascript
   export const SQL_TEMPLATES = {
     新指標查詢: (taxId, year) => `SELECT ...`
   };
   ```

3. **實作計算** - 在 `services/calculationService.js` 新增函數
   ```javascript
   export const calculate新指標 = (rawData) => {
     // 計算邏輯
     return score;
   };
   ```

4. **更新 UI** - 在組件中呈現新指標

### 配置檔案職責
- `businessLogic.js` - **WHAT**: 定義指標、權重、評分標準
- `sqlTemplates.js` - **HOW**: 定義數據查詢方式
- `calculationService.js` - **COMPUTE**: 實作計算邏輯
- `dataService.js` - **FETCH**: 執行數據獲取

## 測試規範

### 測試檔案位置
- 單元測試: `*.test.js` 放在同一目錄
- 整合測試: `tests/integration/`
- E2E 測試: `tests/e2e/`

### 測試覆蓋要求
- **關鍵業務邏輯**: 必須有單元測試
- **評分計算**: 100% 覆蓋
- **UI 組件**: 視情況增加測試

### 測試命名規範
```javascript
describe('calculationService', () => {
  describe('calculateInventoryTurnover', () => {
    it('should return correct score when turnover is above benchmark', () => {
      // 測試邏輯
    });

    it('should handle zero inventory gracefully', () => {
      // 邊界測試
    });
  });
});
```

## Git 工作流程

### 分支命名
- `main` - 主分支 (穩定版本)
- `develop` - 開發分支
- `feature/功能名稱` - 功能分支
- `fix/問題描述` - 修復分支
- `refactor/重構範圍` - 重構分支

### Commit 訊息規範
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型**:
- `feat`: 新功能
- `fix`: 修復問題
- `refactor`: 重構代碼
- `style`: 樣式調整
- `docs`: 文檔更新
- `test`: 測試相關
- `chore`: 建構/工具調整

**範例**:
```
feat(財務能力): 新增 ROE 指標計算

- 在 businessLogic.js 定義 ROE 評分標準
- 在 calculationService.js 實作計算函數
- 更新雷達圖顯示 ROE 數據

Closes #123
```

## 文檔規範

### 必要文檔
- `README.md` - 專案概述與快速開始
- `CLAUDE.md` - Claude Code 技術文檔 (已存在)
- `docs/business-logic-specification.md` - 指標計算規格 (已存在)

### 程式碼註解規範
```javascript
/**
 * 計算存貨週轉率評分
 *
 * @param {number} turnoverRate - 週轉率數值
 * @param {number} benchmark - 基準值 (預設 6)
 * @returns {number} 評分 (0-100)
 *
 * @example
 * const score = calculateInventoryTurnover(8, 6);
 * // => 113.33 (最高100)
 */
export const calculateInventoryTurnover = (turnoverRate, benchmark = 6) => {
  return Math.min((turnoverRate / benchmark) * 85, 100);
};
```

### 何時需要註解
- ✅ 複雜的業務邏輯
- ✅ 非直觀的計算公式
- ✅ 公開 API 函數
- ❌ 自解釋的代碼 (如 `const total = a + b`)

## 效能優化規範

### 必須遵守的效能目標
- **數據載入**: < 1 秒
- **圖表渲染**: < 1 秒
- **互動響應**: < 200ms

### 優化檢查清單
- [ ] 使用快取避免重複查詢
- [ ] 避免不必要的重新渲染 (React.memo)
- [ ] 使用 `useMemo` 快取計算結果
- [ ] 使用 `useCallback` 快取事件處理函數
- [ ] Lazy loading 大型組件
- [ ] 圖片優化與壓縮

## 安全性規範

### 必須遵守的安全原則
- ✅ 使用參數化查詢 (防 SQL 注入)
- ✅ 環境變數管理敏感資訊
- ✅ 不在前端暴露 API 密鑰
- ✅ Supabase RLS (Row Level Security) 配置

### 未來安全需求 (企業部署)
- 實作 JWT 或 Session 認證
- Role-Based Access Control (RBAC)
- API Rate Limiting
- 資料加密

## 部署流程

### GitHub Pages 部署 (當前)
```bash
# 自動部署 (推送到 main 分支)
git push origin main

# 手動部署
npm run build
npm run deploy
```

### 未來企業內部部署
1. 建構 Docker 映像
2. 部署至內部 K8s/VM
3. 配置 Nginx 反向代理
4. 設定 SSL 憑證
5. 整合企業 SSO

## 維護與重構指南

### 已知需要重構的部分
- **BusinessSustainabilityAssessment.jsx** (3093 行)
  - 拆分為多個小組件
  - 提取共用邏輯至 Hooks
  - 移除重複代碼

### 重構優先順序
1. 🔴 高優先: 影響效能或安全性
2. 🟡 中優先: 影響可維護性
3. 🟢 低優先: 代碼美化

---

*此文件定義專案結構、命名規範與編碼標準,指導所有開發活動。*
