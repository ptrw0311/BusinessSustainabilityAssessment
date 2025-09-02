# Business Sustainability Assessment 專案技術文檔

## 📋 專案概述

企業永續性評估平台是一個基於 React 的數據分析與視覺化應用程式，專門用於評估企業的六大核心能力並進行多維度比較分析。

## 🏗️ 技術架構

### 核心框架
- **前端框架**: React 18.2.0
- **構建工具**: Vite 5.3.1  
- **開發語言**: JavaScript (JSX)
- **部署平台**: GitHub Pages

### 開發工具鏈
```json
{
  "構建工具": "Vite",
  "包管理器": "npm / yarn",
  "代碼打包": "Rollup (Vite內建)",
  "開發伺服器": "Vite Dev Server",
  "自動化部署": "GitHub Actions"
}
```

## 🎨 外觀模組設計

### 1. CSS 框架與樣式系統

#### Tailwind CSS 3.4.10
```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: []
}
```

#### 自訂樣式系統
```css
/* 全域樣式 */
html, body, #root {
  background-color: #0f172a; /* slate-900 */
  color: #f8fafc; /* slate-50 */
  font-family: 'Inter', 'Noto Sans TC', sans-serif;
}

/* 自訂工具類 */
.card { @apply bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6; }
.btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500; }
```

### 2. 主要UI組件架構

#### 版面布局結構
```
應用程式根容器
├── 左側邊欄 (Sidebar)
│   ├── Logo區域
│   ├── 搜尋框
│   ├── 選單項目 (Navigation)
│   └── 用戶資訊
└── 主要內容區域
    ├── Header Bar
    └── 動態內容區域
```

#### 色彩設計系統
```javascript
const performanceColors = {
  優異: '#4CAF50',    // 綠色
  良好: '#8BC34A',    // 淺綠
  一般: '#FFC107',    // 黃色  
  待改善: '#FF9800',  // 橘色
  風險: '#F44336'     // 紅色
};
```

#### 響應式設計
- **桌面版**: 側邊欄 + 主內容區域 (flex布局)
- **手機版**: 可摺疊側邊欄設計
- **網格系統**: Tailwind Grid 系統 (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

### 3. 卡片系統設計

#### 財務數據卡片
```javascript
// 新版布局: 左側3卡片 + 右側圓形評分
<div className="flex gap-6">
  {/* 左側三個卡片 */}
  <div className="flex flex-col gap-4 flex-1">
    <div className="bg-teal-600 p-4 rounded-lg">
      <div className="text-white text-sm font-medium">營收</div>
      <div className="text-2xl font-bold text-white">{revenue}</div>
      <div className="text-teal-100 text-sm font-medium">{growth}</div>
    </div>
    // 市值、每股盈餘卡片...
  </div>
  
  {/* 右側大圓形綜合評分 */}
  <div className="bg-teal-600 rounded-3xl p-8 flex flex-col items-center justify-center min-w-[200px]">
    <div className="text-6xl font-bold text-yellow-400">{overallScore}</div>
  </div>
</div>
```

## 📊 圖表模組架構

### 1. Recharts 2.12.7 圖表庫

#### 主要圖表組件
```javascript
import { 
  Radar, RadarChart,           // 雷達圖
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,  // 極座標系統
  ResponsiveContainer,         // 響應式容器
  BarChart, Bar,              // 長條圖
  XAxis, YAxis,               // 座標軸
  CartesianGrid,              // 網格線
  Tooltip, Legend,            // 提示與圖例
  LineChart, Line,            // 折線圖
  PieChart, Pie, Cell         // 圓餅圖
} from 'recharts';
```

### 2. 核心圖表實作

#### 六大維度雷達圖
```javascript
const radarData = Object.entries(companyMetrics).map(([key, value]) => ({
  dimension: key,
  主要公司: value,
  比較公司: compareCompanyValue,
  fullMark: 100
}));

<RadarChart data={radarData}>
  <PolarGrid gridType="polygon" stroke="#475569" />
  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#e2e8f0' }} />
  <PolarRadiusAxis angle={90} domain={[0, 100]} />
  <Radar
    name={companyName}
    dataKey="主要公司"
    stroke="#06d6a0"
    fill="#06d6a0"
    fillOpacity={0.4}
    strokeWidth={3}
  />
  <Legend />
</RadarChart>
```

#### 趨勢分析折線圖
```javascript
const trendData = [
  { period: '1Q25', score: 82 },
  { period: '2Q25', score: 83 },
  { period: '3Q25', score: 84 },
  { period: '4Q25', score: 85 }
];

<LineChart data={trendData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
  <XAxis dataKey="period" stroke="#94a3b8" />
  <YAxis stroke="#94a3b8" domain={[80, 86]} />
  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} />
</LineChart>
```

### 3. 圖表樣式客製化

#### 深色主題適配
```javascript
const chartTheme = {
  grid: '#475569',        // 網格線顏色
  axis: '#94a3b8',        // 座標軸顏色  
  text: '#e2e8f0',        // 文字顏色
  tooltip: {
    backgroundColor: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '8px',
    color: '#e2e8f0'
  }
};
```

#### 響應式圖表容器
```javascript
<ResponsiveContainer width="100%" height={400}>
  {/* 圖表內容 */}
</ResponsiveContainer>
```

## 🎯 圖示系統

### Lucide React 0.344.0
```javascript
import { 
  TrendingUp, Award, AlertTriangle, CheckCircle,
  BarChart3, Zap, Leaf, Lightbulb,
  User, Building, FileText, Settings,
  History, MessageSquare, Star, LogOut,
  Search, Activity, Target 
} from 'lucide-react';

// 維度圖示映射
const dimensionIcons = {
  營運能力: <BarChart3 className="w-5 h-5" />,
  財務能力: <TrendingUp className="w-5 h-5" />,
  未來力: <Zap className="w-5 h-5" />,
  AI數位力: <Award className="w-5 h-5" />,
  ESG永續力: <Leaf className="w-5 h-5" />,
  創新能力: <Lightbulb className="w-5 h-5" />
};
```

## 🚀 部署配置

### GitHub Actions 自動化部署
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - name: Install dependencies
      run: npm ci
    - name: Build project
      run: npm run build
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v4
      with:
        path: ./dist
```

### Vite 配置
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/BusinessSustainabilityAssessment/',  // GitHub Pages 路徑
});
```

## 📦 依賴套件總覽

### 生產環境依賴
```json
{
  "react": "^18.2.0",           // React 核心
  "react-dom": "^18.2.0",       // React DOM
  "recharts": "^2.12.7",        // 圖表庫
  "lucide-react": "^0.344.0"    // 圖示庫
}
```

### 開發環境依賴
```json
{
  "vite": "^5.3.1",                    // 構建工具
  "@vitejs/plugin-react": "^4.3.1",   // React 插件
  "tailwindcss": "^3.4.10",           // CSS 框架
  "postcss": "^8.4.41",               // CSS 後處理器
  "autoprefixer": "^10.4.19",         // CSS 前綴自動化
  "gh-pages": "^6.1.1"                // GitHub Pages 部署
}
```

## 🎨 設計特色

### 視覺設計原則
1. **深色主題**: 使用 Slate 色系營造專業感
2. **卡片化設計**: 資訊分組清晰，提升可讀性  
3. **色彩編碼**: 績效評級用顏色直觀表示
4. **響應式布局**: 適應不同裝置螢幕尺寸
5. **微互動**: Hover 效果與過渡動畫增強用戶體驗

### 數據視覺化亮點
- **多維度雷達圖**: 六大能力同時比較
- **趨勢折線圖**: 時間序列性能追蹤
- **進度條圖表**: 各維度評分視覺化
- **色彩評級系統**: 即時性能狀態反饋

## 🔧 開發與維護

### 本地開發環境
```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 構建生產版本
npm run build

# 預覽構建結果  
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

### 專案結構
```
BusinessSustainabilityAssessment/
├── src/
│   ├── BusinessSustainabilityAssessment.jsx  # 主組件
│   ├── App.jsx                                # 應用入口
│   ├── main.jsx                               # React 掛載點
│   └── index.css                              # 全域樣式
├── dist/                                      # 構建輸出
├── .github/workflows/                         # GitHub Actions
├── tailwind.config.js                        # Tailwind 配置
├── vite.config.js                            # Vite 配置
└── package.json                               # 專案依賴
```

---

*此文檔詳細記錄了企業永續性評估平台的技術架構、外觀模組設計與圖表系統實作，為專案維護與擴展提供完整的技術參考。*