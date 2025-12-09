# 技術堆疊與架構決策

## 核心技術堆疊

### 前端框架
- **React 18.2.0** - 核心 UI 框架
- **React DOM 18.2.0** - DOM 渲染
- **JavaScript (JSX)** - 開發語言 (非 TypeScript)

### 建構工具
- **Vite 5.3.1** - 快速建構工具與開發伺服器
- **@vitejs/plugin-react 4.3.1** - React 支援插件
- **npm** - 套件管理器

### UI 與樣式
- **Tailwind CSS 3.4.10** - Utility-first CSS 框架
- **PostCSS 8.4.41** - CSS 後處理器
- **Autoprefixer 10.4.19** - CSS 前綴自動化
- **CSS 變數系統** - 自訂設計令牌 (定義於 `src/index.css`)

### 數據視覺化
- **Recharts 2.12.7** - 圖表庫
  - 雷達圖 (RadarChart)
  - 折線圖 (LineChart)
  - 長條圖 (BarChart)
  - 圓餅圖 (PieChart)

### 圖示系統
- **Lucide React 0.344.0** - 現代化圖示庫

### 後端與資料庫
- **Supabase** - PostgreSQL 雲端資料庫 + RESTful API
- **@supabase/supabase-js 2.57.4** - Supabase JavaScript 客戶端
- **未來遷移目標**: SQL Server (企業內部部署)

### 部署與 CI/CD
- **GitHub Pages** - 靜態網站託管 (當前)
- **gh-pages 6.1.1** - GitHub Pages 部署工具
- **GitHub Actions** - 自動化建構與部署

### 狀態管理
- **React Context API** - 全域狀態管理
  - `UIContext` - UI 狀態 (側邊欄、載入狀態等)
  - `CompanyContext` - 公司選擇與數據
  - `DataManagementContext` - 數據管理邏輯

## 技術架構

### 前端架構模式
```
UI Layer (Components)
    ↓
Context Layer (State Management)
    ↓
Service Layer (Business Logic)
    ↓
Data Layer (Supabase Client)
```

### 資料夾結構規範
```
src/
├── components/          # UI 組件
│   ├── ui/             # 基礎組件 (Button, Card, Table 等)
│   ├── layout/         # 版面組件 (Header, Sidebar, MainLayout)
│   ├── pages/          # 頁面組件
│   └── charts/         # 圖表主題與配置
├── contexts/           # React Context 提供者
├── services/           # 業務邏輯服務層
│   ├── dataService.js       - Supabase 操作
│   └── calculationService.js - 評分計算
├── config/             # 配置與靜態定義
│   ├── businessLogic.js     - 指標權重與評分標準
│   └── sqlTemplates.js      - SQL 查詢模板
├── App.jsx             # 應用入口
├── main.jsx            # React 掛載點
├── index.css           # 全域樣式與 CSS 變數
└── supabaseClient.js   # Supabase 連接配置
```

## 關鍵技術決策

### 為何選擇 JavaScript 而非 TypeScript？
- 快速開發原型
- 降低學習曲線
- 專案規模可控
- **未來考量**: 大型化後可考慮遷移至 TypeScript

### 為何使用 Vite 而非 Create React App？
- 極快的冷啟動速度
- 原生 ES 模組支援
- 更好的建構效能
- 現代化工具鏈

### 為何採用 Tailwind CSS？
- Utility-first 提高開發效率
- 設計系統一致性
- 打包後 CSS 體積小
- 配合 CSS 變數實現主題系統

### 為何選擇 Recharts？
- React 原生整合
- 宣告式 API 易於使用
- 豐富的圖表類型
- 支援響應式設計

### 為何使用 React Context 而非 Redux？
- 專案狀態管理需求簡單
- 避免過度工程化
- 減少依賴套件
- Context API 已足夠應付需求

### 為何選擇 Supabase？
- 快速搭建後端服務
- PostgreSQL 強大查詢能力
- RESTful API 自動生成
- 免費方案適合初期開發
- **未來遷移**: 企業內部會改用 SQL Server

## 效能要求與優化策略

### 效能目標
- **數據載入時間**: < 1 秒
- **圖表渲染速度**: < 1 秒
- **頁面互動響應**: < 200ms

### 優化策略
1. **智能快取機制** - `companyDataCache` 避免重複查詢
2. **分離 Loading 狀態** - 避免全頁阻塞
3. **按需載入組件** - 未來可考慮 React.lazy
4. **Vite 建構優化** - Tree-shaking 與 code-splitting
5. **Recharts 響應式容器** - 避免重複渲染

### 數據庫查詢優化
- 參數化查詢防止 SQL 注入
- 索引優化 (tax_id, fiscal_year)
- 前端評分計算減少後端負擔

## 第三方服務整合

### Supabase 配置
- **認證方式**: `supabaseClient.js` 管理連接
- **環境變數**: Supabase URL 與 anon key
- **資料表**:
  - `pl_income_basics` - 損益表基本數據
  - `financial_basics` - 資產負債表基本數據

### 未來整合需求
- **網頁爬蟲服務** - 自動化數據收集
- **表格辨識 API** - OCR/表格解析
- **SQL Server 連接** - 企業內部資料庫

## 技術限制與約束

### 當前限制
- **無伺服器端渲染 (SSR)** - 純前端 SPA
- **無用戶認證** - GitHub Pages 無後端
- **數據手動維護** - 需人工輸入財務數據
- **公開部署** - 無權限管理機制

### 瀏覽器支援
- 現代瀏覽器 (Chrome, Firefox, Safari, Edge)
- ES6+ 語法支援
- CSS Grid 與 Flexbox 支援

### 未來技術遷移計畫
1. **Phase 1**: 保持當前架構，優化效能
2. **Phase 2**: 整合爬蟲與表格辨識
3. **Phase 3**: 企業內部部署
   - 新增後端 API 層 (Node.js/Express 或 .NET)
   - 實作登入與權限系統
   - 遷移至 SQL Server
   - 整合企業 SSO

## 開發工具與環境

### 本地開發
```bash
npm install        # 安裝依賴
npm run dev        # 啟動開發伺服器 (http://localhost:5173)
npm run build      # 建構生產版本
npm run preview    # 預覽建構結果
```

### 部署流程
```bash
npm run deploy     # 部署至 GitHub Pages
```

### CI/CD 流程
- **觸發條件**: Push 到 main 分支
- **建構環境**: Ubuntu + Node.js 18
- **部署目標**: GitHub Pages
- **建構產物**: ./dist 目錄

## 安全性考量

### 當前安全措施
- 參數化 SQL 查詢防止注入
- Supabase Row Level Security (RLS) 配置
- 環境變數管理敏感資訊

### 未來安全需求 (企業內部部署)
- JWT 或 Session 認證
- Role-Based Access Control (RBAC)
- API Rate Limiting
- 資料加密 (傳輸與儲存)
- 稽核日誌 (Audit Logs)

## 測試策略

### 當前測試
- `calculationService.test.js` - 評分計算邏輯單元測試

### 未來測試需求
- [ ] 組件單元測試 (React Testing Library)
- [ ] 整合測試 (API 層)
- [ ] E2E 測試 (Playwright/Cypress)
- [ ] 視覺回歸測試

## 技術債務與改進方向

### 已知技術債
- BusinessSustainabilityAssessment.jsx 過大 (3093 行)
- 需進一步模組化拆分
- 缺乏完整測試覆蓋

### 改進計劃
- 重構大型組件為小型可重用組件
- 增加測試覆蓋率
- 考慮引入 TypeScript
- 實作 Error Boundary

---

*此文件定義技術選型、架構模式與技術限制，指導所有技術實作決策。*
