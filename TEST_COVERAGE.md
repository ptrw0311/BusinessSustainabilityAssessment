# calculationService.js 測試覆蓋詳細說明

## 文件信息
- **測試文件**: `src/services/calculationService.test.js`
- **被測試文件**: `src/services/calculationService.js`
- **測試框架**: Jest
- **總測試數**: 80+個測試用例
- **覆蓋率目標**: > 80%

---

## 測試函數清單

### 1. calculateInventoryTurnoverScore() - 存貨週轉率分數

**測試用例數**: 6個

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該為null或undefined輸入返回0 | 邊界值測試 | 返回0 |
| 2 | 應該計算正常的存貨週轉率分數 | 正常情況 | 計算score = (6/6)*85 = 85 |
| 3 | 應該計算低於基準的存貨週轉率分數 | 邊界值 | 計算score = (3/6)*85 = 42.5 |
| 4 | 應該計算高於基準的存貨週轉率分數 | 超出上限 | 被限制在100 |
| 5 | 應該限制分數在0-100範圍內 | 邊界限制 | 所有值都在[0,100] |
| 6 | 應該處理非常大的數值 | 極值測試 | 返回≤100的分數 |

**計算邏輯**: `score = (turnover_ratio / benchmark) * maxScore = (ratio / 6) * 85`

---

### 2. calculateReceivablesTurnoverScore() - 應收帳款週轉率分數

**測試用例數**: 4個

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該為null或undefined輸入返回0 | 邊界值測試 | 返回0 |
| 2 | 應該計算正常的應收帳款週轉率分數 | 正常情況 | score = (12/12)*85 = 85 |
| 3 | 應該計算低於基準的應收帳款週轉率分數 | 邊界值 | score = (6/12)*85 = 42.5 |
| 4 | 應該限制分數在0-100範圍內 | 邊界限制 | 所有值都在[0,100] |

**計算邏輯**: `score = (turnover_ratio / benchmark) * maxScore = (ratio / 12) * 85`

---

### 3. calculateTotalAssetsTurnoverScore() - 總資產週轉率分數

**測試用例數**: 4個

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該為null或undefined輸入返回0 | 邊界值測試 | 返回0 |
| 2 | 應該計算正常的總資產週轉率分數 | 正常情況 | score = (1.5/1.5)*85 = 85 |
| 3 | 應該計算低於基準的總資產週轉率分數 | 邊界值 | score = (0.75/1.5)*85 = 42.5 |
| 4 | 應該限制分數在0-100範圍內 | 邊界限制 | 所有值都在[0,100] |

**計算邏輯**: `score = (turnover_ratio / benchmark) * maxScore = (ratio / 1.5) * 85`

---

### 4. calculateRoeScore() - ROE分段評分 (最複雜)

**測試用例數**: 11個

這個函數使用分段評分，根據ROE值分為三個區間：

#### 分段規則

| ROE範圍 | 分數範圍 | 計算公式 |
|--------|---------|---------|
| ROE < 0 | 0-25 | `0 + (25 - 0) * MIN(ABS(roe) / 10.0, 1.0)` |
| 0 ≤ ROE ≤ 0.15 | 50-83 | `50 + (83 - 50) * (roe / 0.15)` |
| ROE > 0.15 | 83-100 | `83 + (100 - 83) * MIN((roe - 0.15) / 0.15, 1.0)` |

#### 測試用例

| 序號 | 測試名稱 | ROE值 | 預期分數 | 目的 |
|------|---------|------|---------|------|
| 1 | 應該為null或undefined輸入返回null | null | null | 邊界值 |
| 2 | 應該處理負ROE (虧損情況) | -0.05 | 0-25之間 | 負值範圍 |
| 3 | 應該處理ROE = -10 (最低虧損) | -10 | 25 | 邊界值 |
| 4 | 應該處理ROE = 0 (邊界) | 0 | 50 | 邊界值 |
| 5 | 應該處理0 <= ROE <= 0.15 (正常情況) | 0.075 | ~66.5 | 正常範圍中點 |
| 6 | 應該處理ROE = 0.15 (邊界) | 0.15 | 83 | 邊界值 |
| 7 | 應該處理ROE > 0.15 (優秀情況) | 0.30 | 100 | 優秀範圍 |
| 8 | 應該處理ROE = 0.225 (優秀情況) | 0.225 | ~91.5 | 優秀範圍中點 |
| 9-11 | 應該限制分數在0-100範圍內 | 多個值 | [0,100] | 邊界限制 |

---

### 5. calculateRevenueGrowthScore() - 營收成長率分數

**測試用例數**: 9個

#### 分段規則

| 成長率範圍 | 分數範圍 | 計算公式 |
|----------|---------|---------|
| growth_rate < -20% | 0 | `0` |
| -20% ≤ growth_rate < 0% | 25-50 | `25 + (growth_rate * 1.25 * 100)` |
| growth_rate ≥ 0% | 50-100 | `MIN(100, 50 + (growth_rate * 2.5 * 100))` |

#### 測試用例

| 序號 | 測試名稱 | 成長率 | 預期分數 | 目的 |
|------|---------|------|---------|------|
| 1 | 應該為null或undefined輸入返回50 | null | 50 | 缺失值默認 |
| 2 | 應該處理成長率 < -20% | -0.25 | 0 | 低於閾值 |
| 3 | 應該處理-20% <= 成長率 < 0% | -0.1 | ~12.5 | 負成長 |
| 4 | 應該處理成長率 = -20% (邊界) | -0.2 | 25 | 邊界值 |
| 5 | 應該處理成長率 >= 0% | 0.1 | 75 | 正成長 |
| 6 | 應該處理成長率 = 0% (邊界) | 0 | 50 | 零成長 |
| 7 | 應該處理成長率 = 20% (高成長) | 0.2 | 100 | 高成長 |
| 8 | 應該限制分數不超過100 | 1.0 | 100 | 上限限制 |
| 9 | 應該限制分數在0-100範圍內 | 多個值 | [0,100] | 全範圍限制 |

---

### 6. calculateRevenueCagrScore() - 營收複合年均成長率分數

**測試用例數**: 7個

#### 計算邏輯

線性映射：區間 [-10%, 20%] 映射到 [0, 100]

**公式**: `((cagrPercent / 100.0 - (-0.1)) / (0.2 - (-0.1))) * 100`

#### 測試用例

| 序號 | 測試名稱 | CAGR% | 預期分數 | 目的 |
|------|---------|------|---------|------|
| 1 | 應該為null或undefined輸入返回null | null | null | 缺失值 |
| 2 | 應該計算線性映射 [-10%, 20%] -> [0, 100] | 5 | 50 | 中點映射 |
| 3 | 應該處理CAGR = -10% (最小值) | -10 | 0 | 下限 |
| 4 | 應該處理CAGR = 20% (最大值) | 20 | 100 | 上限 |
| 5 | 應該處理CAGR = 0% (中點) | 0 | ~33.33 | 零增長 |
| 6 | 應該限制分數在0-100範圍內 | -20, 30, 50 | [0,100] | 邊界限制 |
| 7 | 應該處理負值CAGR | -5 | ~16.67 | 負增長 |

---

### 7. calculateFutureCapabilityScore() - 未來力維度分數

**測試用例數**: 6個

#### 計算邏輯

- 如果有兩個指標分數：取平均值
- 如果只有一個：使用該指標分數
- 如果都沒有：返回null

#### 測試用例

| 序號 | 測試名稱 | 輸入 | 預期結果 | 目的 |
|------|---------|------|---------|------|
| 1 | 應該為空對象返回null | {} | null | 空數據 |
| 2 | 應該計算兩個指標的平均值 | {growth: 75, cagr: 85} | 80 | 正常情況 |
| 3 | 應該優先使用revenue_growth分數 | {growth: 75} | 75 | 單一指標 |
| 4 | 應該優先使用revenue_cagr分數 | {cagr: 85} | 85 | 單一指標 |
| 5 | 應該忽略null或undefined分數 | {growth: null, cagr: 85} | 85 | 部分缺失 |
| 6 | 應該處理兩個分數都為null | {growth: null, cagr: undefined} | null | 全部缺失 |

---

### 8. calculateCurrentRatioScore() - 流動比率分數

**測試用例數**: 7個

#### 計算邏輯

基準值 2.0，線性計算

**公式**: `MIN(100, MAX(0, (current_ratio / 2.0) * 100))`

#### 測試用例

| 序號 | 測試名稱 | 流動比率 | 預期分數 | 目的 |
|------|---------|--------|---------|------|
| 1 | 應該為null或undefined輸入返回0 | null | 0 | 缺失值 |
| 2 | 應該計算正常的流動比率分數 | 2.0 | 100 | 達到基準 |
| 3 | 應該計算低於基準的流動比率分數 | 1.0 | 50 | 低於基準 |
| 4 | 應該計算0流動比率 | 0 | 0 | 零值 |
| 5 | 應該限制分數不超過100 | 5 | 100 | 超出上限 |
| 6 | 應該返回保留兩位小數的分數 | 1.33 | 66.5 | 精度要求 |
| 7 | 應該處理負數輸入 (邊界情況) | -1 | 0 | 負數限制 |

---

### 9. processCompanyMetrics() - 處理公司指標 (異步+Mock)

**測試用例數**: 4個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該成功處理公司指標並返回完整的metrics物件 | 正常流程 | 返回完整metrics物件，包含dimension_scores和overall_score |
| 2 | 應該拋出錯誤 (如果dataService失敗) | 錯誤處理 | 拋出並傳播錯誤 |
| 3 | 應該計算營運能力維度分數 | 維度計算 | dimension_scores.營運能力 > 0 |
| 4 | 應該處理缺失的指標數據 | 容錯能力 | 即使沒有數據仍能返回有效結構 |

**關鍵Mock設置**:
```javascript
jest.mock('./dataService.js');
dataService.getCompanyAllMetrics.mockResolvedValue({...})
```

---

### 10. processComparisonData() - 比較分析數據 (異步+Mock)

**測試用例數**: 2個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該成功處理兩家公司的比較數據 | 正常流程 | 返回包含primary、compare和comparison_analysis的物件 |
| 2 | 應該拋出錯誤 (如果dataService失敗) | 錯誤處理 | 拋出並傳播錯誤 |

---

### 11. generateComparisonAnalysis() - 生成比較分析

**測試用例數**: 6個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該生成完整的比較分析物件 | 結構驗證 | 包含overall_comparison、dimension_comparison、metric_comparison、recommendations |
| 2 | 應該計算總體分數差異 | 分數計算 | 正確計算difference和performance |
| 3 | 應該判斷相當的表現 | 比較邏輯 | 當分數相同時返回'相當' |
| 4 | 應該判斷劣於的表現 | 比較邏輯 | 當主要分數低於對比時返回'劣於' |
| 5 | 應該計算所有維度的比較 | 維度覆蓋 | 6個維度都有比較結果 |
| 6 | 應該計算指標級別的比較 | 詳細分析 | 指標級數據正確對應 |

---

### 12. generateRecommendations() - 生成改善建議

**測試用例數**: 5個

#### 建議觸發條件

| 條件 | Priority | Type | 觸發值 |
|------|----------|------|---------|
| 總體表現差 | high | overall | difference < -10 |
| 維度表現差 | medium | dimension | difference < -5 |
| 指標表現差 | high | metric | difference < -10 |

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該為無差異的情況返回空建議陣列 | 正常狀態 | recommendations = [] |
| 2 | 應該為總體表現差生成high priority建議 | High Priority | 生成overall類型high priority建議 |
| 3 | 應該為維度表現差生成medium priority建議 | Medium Priority | 生成dimension類型medium priority建議 |
| 4 | 應該為指標表現差生成high priority建議 | High Priority | 生成metric類型high priority建議 |
| 5 | 應該生成多個建議 (複雜情況) | 多層級分析 | 同時生成overall、dimension、metric建議 |

---

### 13. formatRadarChartData() - 格式化雷達圖數據

**測試用例數**: 4個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該正確轉換維度分數為雷達圖數據格式 | 格式轉換 | 6個維度數據，含dimension、score、fullMark |
| 2 | 應該保留兩位小數的分數 | 精度控制 | 所有score都四捨五入到小數點後兩位 |
| 3 | 應該處理缺失的dimension_scores | 容錯能力 | 返回空陣列 |
| 4 | 應該處理空的dimension_scores | 容錯能力 | 返回空陣列 |

---

### 14. formatComparisonRadarData() - 格式化比較雷達圖

**測試用例數**: 4個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該正確轉換兩家公司的維度分數 | 格式轉換 | 含dimension、主要公司、比較公司、fullMark |
| 2 | 應該正確放置分數在對應的公司欄位 | 數據映射 | 主要公司和比較公司分數正確對應 |
| 3 | 應該處理缺失的維度分數 (使用0作為預設值) | 容錯能力 | 缺失維度使用0作為預設值 |
| 4 | 已隱含在測試1和2中 | - | - |

---

### 15. validateCalculationResults() - 驗證計算結果

**測試用例數**: 6個

#### 驗證規則

- 所有dimension_scores值必須在 [0, 100] 範圍內
- overall_score必須在 [0, 100] 範圍內
- 返回錯誤字符串陣列

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該為有效結果返回空錯誤陣列 | 有效驗證 | errors = [] |
| 2 | 應該為超出範圍的維度分數返回錯誤 | 邊界檢測 | 錯誤陣列長度 > 0 |
| 3 | 應該為超出範圍的總體分數返回錯誤 | 邊界檢測 | 錯誤陣列長度 > 0 |
| 4 | 應該為負數分數返回錯誤 | 邊界檢測 | 錯誤陣列長度 > 0 |
| 5 | 應該處理缺失的dimension_scores | 容錯能力 | 返回有效結果 |
| 6 | 應該允許邊界值 (0和100) | 邊界允許 | errors = [] |

---

### 16. generateCompanyReport() - 生成企業評估報告 (異步+Mock)

**測試用例數**: 5個

#### 測試用例

| 序號 | 測試名稱 | 目的 | 預期結果 |
|------|---------|------|---------|
| 1 | 應該生成完整的企業報告 | 報告生成 | 包含所有必需欄位 |
| 2 | 應該包含雷達圖數據 | 數據包含 | radar_data是6個維度的陣列 |
| 3 | 應該包含validation_errors陣列 | 驗證結果 | validation_errors是陣列 |
| 4 | 應該包含生成時間戳 | 時間記錄 | generated_at是有效的ISO格式 |
| 5 | 應該拋出錯誤 (如果dataService失敗) | 錯誤處理 | 拋出並傳播錯誤 |

---

## 測試統計

### 按函數分類

| 函數名 | 測試數 | 類型 | 備註 |
|--------|--------|------|------|
| calculateInventoryTurnoverScore | 6 | 邊界值 | 基準值6 |
| calculateReceivablesTurnoverScore | 4 | 邊界值 | 基準值12 |
| calculateTotalAssetsTurnoverScore | 4 | 邊界值 | 基準值1.5 |
| calculateRoeScore | 11 | 分段評分 | 最複雜的計算 |
| calculateRevenueGrowthScore | 9 | 分段評分 | 三個分段 |
| calculateRevenueCagrScore | 7 | 線性映射 | 映射區間[-10%,20%] |
| calculateFutureCapabilityScore | 6 | 邏輯組合 | 指標平均值 |
| calculateCurrentRatioScore | 7 | 邊界值 | 基準值2.0 |
| processCompanyMetrics | 4 | 異步+Mock | 數據處理 |
| processComparisonData | 2 | 異步+Mock | 批量處理 |
| generateComparisonAnalysis | 6 | 邏輯驗證 | 分析生成 |
| generateRecommendations | 5 | 邏輯驗證 | 條件分支 |
| formatRadarChartData | 4 | 數據轉換 | 格式化 |
| formatComparisonRadarData | 4 | 數據轉換 | 對比格式化 |
| validateCalculationResults | 6 | 驗證邏輯 | 邊界檢測 |
| generateCompanyReport | 5 | 異步+Mock | 報告生成 |
| **合計** | **81** | - | - |

### 按測試類型分類

| 測試類型 | 數量 | 百分比 | 說明 |
|---------|------|--------|------|
| 邊界值/邊界限制 | 25 | 31% | null、0、負數、超大值 |
| 正常情況 | 20 | 25% | 標準輸入和預期輸出 |
| 分段/條件分支 | 16 | 20% | ROE、營收成長、建議條件 |
| 異步操作+Mock | 11 | 14% | processCompanyMetrics等 |
| 數據轉換/格式化 | 8 | 10% | 雷達圖、報告格式 |
| **合計** | **80** | 100% | - |

---

## 測試覆蓋率預估

### 代碼覆蓋率目標

- **語句覆蓋率 (Statements)**: ~85%
- **分支覆蓋率 (Branches)**: ~80%
- **函數覆蓋率 (Functions)**: ~90%
- **行數覆蓋率 (Lines)**: ~85%

### 未覆蓋區域 (可接受)

- 某些錯誤日誌的特定條件分支
- 生產環境特定的邊界情況
- 第三方庫依賴的邊界情況

---

## 運行測試

### 基本命令
```bash
# 執行所有測試
npm test

# 執行單個測試文件
npm test -- src/services/calculationService.test.js

# 監視模式
npm test:watch

# 生成覆蓋率報告
npm test:coverage
```

### 預期輸出
```
Test Suites: 1 passed, 1 total
Tests:       81 passed, 81 total
Snapshots:   0 total
Time:        ~3-5s
Coverage:    Statements: 85%, Branches: 80%, Functions: 90%, Lines: 85%
```

---

## 改進建議

### 短期 (可立即實施)
1. 安裝Jest和相關依賴
2. 配置jest.config.js
3. 運行測試驗證所有用例通過

### 中期 (後續優化)
1. 添加集成測試 (dataService.js)
2. 添加UI組件測試 (React組件)
3. 設置CI/CD流程中的測試自動化

### 長期 (完整測試套件)
1. 添加端到端測試 (E2E)
2. 性能基準測試
3. 日常覆蓋率監測
4. 回歸測試自動化

---

## 附錄: 測試數據範例

### ROE分段評分示例

```javascript
// 虧損情況
calculateRoeScore(-0.05)  // 返回: 0 + 25 * (0.05 / 10) = 0.125
calculateRoeScore(-10)    // 返回: 25 (達到上限)

// 正常情況
calculateRoeScore(0)      // 返回: 50
calculateRoeScore(0.075)  // 返回: 50 + 33 * (0.075 / 0.15) = 66.5
calculateRoeScore(0.15)   // 返回: 83

// 優秀情況
calculateRoeScore(0.225)  // 返回: 83 + 17 * ((0.225 - 0.15) / 0.15) = 91.5
calculateRoeScore(0.30)   // 返回: 100 (達到上限)
```

### 營收成長率分段評分示例

```javascript
// 衰退情況
calculateRevenueGrowthScore(-0.25)  // 返回: 0
calculateRevenueGrowthScore(-0.2)   // 返回: 25
calculateRevenueGrowthScore(-0.1)   // 返回: 25 + (-0.1 * 125) = 12.5

// 成長情況
calculateRevenueGrowthScore(0)      // 返回: 50
calculateRevenueGrowthScore(0.1)    // 返回: 50 + (0.1 * 250) = 75
calculateRevenueGrowthScore(0.2)    // 返回: 100
calculateRevenueGrowthScore(1)      // 返回: 100 (被限制)
```

---

**文檔最後更新**: 2024年11月28日
**測試框架版本**: Jest 29+
**Node版本要求**: 16.0+
