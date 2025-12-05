# 單元測試執行指南

## 概述
本項目使用Jest框架進行單元測試。此指南說明如何安裝、配置和運行測試。

## 一、安裝依賴

### 1. 安裝Jest和相關依賴
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @babel/preset-env @babel/preset-react babel-jest
npm install --save-dev @babel/core
```

### 2. 更新package.json
在package.json中的scripts部分添加以下命令：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 二、測試文件位置

測試文件已創建在以下位置：
```
src/services/calculationService.test.js
```

## 三、運行測試

### 執行所有測試
```bash
npm test
```

### 執行特定測試文件
```bash
npm test -- src/services/calculationService.test.js
```

### 監視模式 (自動重新運行)
```bash
npm test:watch
```

### 生成覆蓋率報告
```bash
npm test:coverage
```

## 四、測試結構

### 測試組織
- 使用 `describe()` 組織測試套件
- 使用 `it()` 或 `test()` 定義單個測試
- 使用 `beforeEach()` 初始化共享測試數據
- 使用 `jest.mock()` 模擬外部依賴

### 測試命名約定
- 文件名：`[sourceFile].test.js` 或 `[sourceFile].spec.js`
- 測試描述：清晰說明測試的功能，例如：
  ```javascript
  describe('calculateInventoryTurnoverScore', () => {
    it('應該為null輸入返回0', () => {
      // 測試代碼
    });
  });
  ```

## 五、測試覆蓋範圍

### calculationService.test.js 涵蓋的函數

#### 1. 計算函數 (邊界測試)
- `calculateInventoryTurnoverScore()` - 存貨週轉率分數
- `calculateReceivablesTurnoverScore()` - 應收帳款週轉率分數
- `calculateTotalAssetsTurnoverScore()` - 總資產週轉率分數
- `calculateRoeScore()` - ROE分段評分
- `calculateRevenueGrowthScore()` - 營收成長率分數
- `calculateRevenueCagrScore()` - 營收CAGR分數
- `calculateCurrentRatioScore()` - 流動比率分數

#### 2. 數據處理函數 (使用Mock)
- `processCompanyMetrics()` - 處理單一公司指標
- `processComparisonData()` - 處理比較分析數據

#### 3. 分析函數
- `generateComparisonAnalysis()` - 生成比較分析
- `generateRecommendations()` - 生成改善建議

#### 4. 格式化函數
- `formatRadarChartData()` - 雷達圖數據格式化
- `formatComparisonRadarData()` - 比較雷達圖數據格式化

#### 5. 驗證函數
- `validateCalculationResults()` - 驗證計算結果
- `generateCompanyReport()` - 生成企業評估報告

### 測試類型覆蓋

#### 邊界值測試
- null/undefined 輸入
- 零值
- 負數
- 超大數值
- 邊界條件

#### 正常情況測試
- 標準輸入值
- 預期的計算結果
- 正確的數據格式

#### 異常情況測試
- 錯誤拋出和捕獲
- 無效數據處理
- Mock失敗場景

## 六、測試用例示例

### 邊界值測試
```javascript
describe('calculateInventoryTurnoverScore', () => {
  it('應該為null輸入返回0', () => {
    expect(calculateInventoryTurnoverScore(null)).toBe(0);
    expect(calculateInventoryTurnoverScore(undefined)).toBe(0);
  });

  it('應該限制分數在0-100範圍內', () => {
    expect(calculateInventoryTurnoverScore(0)).toBe(0);
    expect(calculateInventoryTurnoverScore(100)).toBe(100);
    expect(calculateInventoryTurnoverScore(-5)).toBe(0);
  });
});
```

### ROE分段評分測試
```javascript
describe('calculateRoeScore', () => {
  it('應該處理負ROE (虧損情況)', () => {
    const score = calculateRoeScore(-0.05);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(25);
  });

  it('應該處理0 <= ROE <= 0.15 (正常情況)', () => {
    const score = calculateRoeScore(0.075);
    expect(score).toBeCloseTo(66.5, 1);
  });

  it('應該處理ROE > 0.15 (優秀情況)', () => {
    const score = calculateRoeScore(0.30);
    expect(score).toBe(100);
  });
});
```

### Mock測試
```javascript
describe('processCompanyMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功處理公司指標', async () => {
    dataService.getCompanyAllMetrics.mockResolvedValue({
      inventory_turnover: {
        company_name: '遠傳電信',
        inventory_turnover_ratio: 7.06,
        radar_score: 100
      },
      // ... 其他數據
    });

    const result = await processCompanyMetrics('97179430', '2024');

    expect(result).toBeDefined();
    expect(result.company_info.tax_id).toBe('97179430');
  });
});
```

## 七、常見命令速查表

| 命令 | 說明 |
|------|------|
| `npm test` | 執行所有測試 |
| `npm test -- --watch` | 監視模式 |
| `npm test -- --coverage` | 生成覆蓋率報告 |
| `npm test -- src/services/calculationService.test.js` | 執行特定文件 |
| `npm test -- --testNamePattern="ROE"` | 執行符合模式的測試 |
| `npm test -- --verbose` | 詳細輸出 |

## 八、預期的測試輸出

成功執行測試時應該看到類似的輸出：
```
PASS  src/services/calculationService.test.js
  計算服務層 - calculationService
    calculateInventoryTurnoverScore - 存貨週轉率分數
      ✓ 應該為null或undefined輸入返回0 (2 ms)
      ✓ 應該計算正常的存貨週轉率分數 (1 ms)
      ✓ 應該計算低於基準的存貨週轉率分數 (1 ms)
      ... (更多測試)

Test Suites: 1 passed, 1 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        3.456 s
```

## 九、測試覆蓋率目標

當前測試覆蓋率目標：
- **語句覆蓋率 (Statements)**: > 80%
- **分支覆蓋率 (Branches)**: > 75%
- **函數覆蓋率 (Functions)**: > 80%
- **行數覆蓋率 (Lines)**: > 80%

## 十、常見問題排查

### Q: Jest找不到模組
**A:** 確保所有導入路徑正確，並且jest.config.js中的moduleNameMapper配置正確。

### Q: Mock不生效
**A:** 確保在測試開始前使用 `jest.clearAllMocks()`，並正確設置 `mockResolvedValue()` 或 `mockRejectedValue()`。

### Q: 非同步測試超時
**A:** 增加Jest的超時時間：
```javascript
it('應該處理非同步操作', async () => {
  // ... 測試代碼
}, 10000); // 10秒超時
```

### Q: 測試無法找到業務邏輯配置
**A:** 確保 `businessLogic.js` 中的所有配置項都已正確導出，並在測試文件中正確引入。

## 十一、最佳實踐

1. **清晰的測試描述**
   - 使用有意義的測試名稱
   - 清楚地說明測試的目的

2. **AAA模式 (Arrange-Act-Assert)**
   ```javascript
   it('應該計算分數', () => {
     // Arrange - 設置測試數據
     const input = 10;

     // Act - 執行被測試的代碼
     const result = calculateScore(input);

     // Assert - 驗證結果
     expect(result).toBe(expectedValue);
   });
   ```

3. **測試獨立性**
   - 每個測試應該是獨立的
   - 不依賴其他測試的結果
   - 使用beforeEach清理狀態

4. **充分的邊界值測試**
   - 測試null/undefined
   - 測試零值
   - 測試負數和極值

5. **模擬外部依賴**
   - 使用jest.mock()模擬dataService
   - 避免實際的數據庫連接
   - 控制測試數據

## 十二、後續步驟

1. 安裝必要的依賴
2. 配置Jest
3. 運行測試確保所有通過
4. 在CI/CD流程中集成測試
5. 定期檢查覆蓋率報告

## 聯繫和支援

如有任何關於測試的問題，請參考：
- Jest文檔: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- 項目CLAUDE.md文檔
