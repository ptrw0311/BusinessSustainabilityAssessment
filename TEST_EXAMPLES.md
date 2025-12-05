# calculationService 測試代碼示例詳解

## 概述

本文檔詳細解釋 `calculationService.test.js` 中的測試代碼結構和每個測試的含義。

---

## 1. 簡單的邊界值測試示例

### 示例：測試計算函數處理null/undefined

```javascript
describe('calculateInventoryTurnoverScore - 存貨週轉率分數', () => {
  it('應該為null或undefined輸入返回0', () => {
    // 測試null值
    expect(calculateInventoryTurnoverScore(null)).toBe(0);

    // 測試undefined值
    expect(calculateInventoryTurnoverScore(undefined)).toBe(0);
  });
});
```

**說明**:
- `describe()` - 創建一個測試套件，用來組織相關的測試
- `it()` - 定義一個單個測試用例
- `expect()` - 驗證實際結果是否符合預期

### 示例：測試分數範圍限制

```javascript
it('應該限制分數在0-100範圍內', () => {
  expect(calculateInventoryTurnoverScore(0)).toBe(0);          // 下限
  expect(calculateInventoryTurnoverScore(100)).toBe(100);      // 上限
  expect(calculateInventoryTurnoverScore(-5)).toBe(0);         // 負數被限制到0
  expect(calculateInventoryTurnoverScore(1000)).toBeLessThanOrEqual(100);  // 超大值被限制
});
```

**關鍵點**:
- 測試邊界條件（0和100）
- 測試越界條件（負數、超大值）
- 使用 `toBeLessThanOrEqual()` 進行比較斷言

---

## 2. 複雜的分段評分測試示例

### 示例：ROE分段評分 (最重要)

```javascript
describe('calculateRoeScore - ROE分數 (分段評分)', () => {

  // 虧損情況測試 (ROE < 0)
  it('應該處理負ROE (虧損情況)', () => {
    // ROE = -0.05：返回 0 + 25 * MIN(0.05 / 10.0, 1.0) = 0.125
    const score = calculateRoeScore(-0.05);

    // 確保分數在虧損分段的範圍內 (0-25)
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(25);
  });

  // 正常情況測試 (0 <= ROE <= 0.15)
  it('應該處理0 <= ROE <= 0.15 (正常情況)', () => {
    // ROE = 0.075：返回 50 + 33 * (0.075 / 0.15) = 50 + 16.5 = 66.5
    const score = calculateRoeScore(0.075);

    // toBeCloseTo() 允許浮點數誤差
    expect(score).toBeCloseTo(66.5, 1); // 1表示精度（小數位數）
  });

  // 優秀情況測試 (ROE > 0.15)
  it('應該處理ROE > 0.15 (優秀情況)', () => {
    // ROE = 0.30：返回 83 + 17 * MIN((0.30 - 0.15) / 0.15, 1.0) = 83 + 17 = 100
    const score = calculateRoeScore(0.30);

    expect(score).toBe(100);
  });

  // 分段邊界測試
  it('應該正確處理三個分段的邊界', () => {
    expect(calculateRoeScore(0)).toBe(50);        // ROE=0是第二段的起點
    expect(calculateRoeScore(0.15)).toBe(83);     // ROE=0.15是第二段的終點/第三段的起點
    expect(calculateRoeScore(-10)).toBe(25);      // ROE=-10達到第一段的上限
  });

  // 全範圍限制測試
  it('應該限制分數在0-100範圍內', () => {
    const scores = [
      calculateRoeScore(-100),    // 超低虧損
      calculateRoeScore(0),       // 零ROE
      calculateRoeScore(0.5),     // 超高ROE
      calculateRoeScore(10)       // 極高ROE
    ];

    scores.forEach(score => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
```

**關鍵概念**:
1. **分段評分** - 根據不同的輸入範圍使用不同的計算公式
2. **邊界值測試** - 測試每個分段的臨界點
3. **浮點數比較** - 使用 `toBeCloseTo()` 而不是 `toBe()`

---

## 3. 邏輯組合測試示例

### 示例：未來力維度分數 (條件分支)

```javascript
describe('calculateFutureCapabilityScore - 未來力維度分數', () => {

  // 情況1：兩個指標都有分數
  it('應該計算兩個指標的平均值', () => {
    const metrics = {
      revenue_growth: { score: 75 },    // 營收成長率分數
      revenue_cagr: { score: 85 }       // CAGR分數
    };

    // 預期 (75 + 85) / 2 = 80
    expect(calculateFutureCapabilityScore(metrics)).toBe(80);
  });

  // 情況2：只有一個指標有分數
  it('應該優先使用revenue_growth分數 (如果只有該指標)', () => {
    const metrics = {
      revenue_growth: { score: 75 }
      // revenue_cagr 不存在或為null
    };

    expect(calculateFutureCapabilityScore(metrics)).toBe(75);
  });

  // 情況3：兩個指標都沒有有效分數
  it('應該處理兩個分數都為null的情況', () => {
    const metrics = {
      revenue_growth: { score: null },
      revenue_cagr: { score: undefined }
    };

    expect(calculateFutureCapabilityScore(metrics)).toBeNull();
  });

  // 情況4：缺失score欄位
  it('應該處理缺失的score欄位', () => {
    const metrics = {
      revenue_growth: {},                // 沒有score欄位
      revenue_cagr: { score: 50 }
    };

    // 應該只使用revenue_cagr的分數
    expect(calculateFutureCapabilityScore(metrics)).toBe(50);
  });
});
```

**邏輯流**:
```
計算未來力分數流程：
  ↓
檢查是否有兩個指標分數
  ├─ 是 → 返回平均值
  └─ 否 ↓
      檢查revenue_growth是否有分數
        ├─ 有 → 返回該分數
        └─ 否 ↓
            檢查revenue_cagr是否有分數
              ├─ 有 → 返回該分數
              └─ 否 → 返回null
```

---

## 4. 異步函數+Mock測試示例

### 示例：processCompanyMetrics (重要)

```javascript
describe('processCompanyMetrics - 處理單一公司指標', () => {

  // 在每個測試之前清理mock
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('應該成功處理公司指標並返回完整的metrics物件', async () => {
    // 1. 設置Mock數據
    dataService.getCompanyAllMetrics.mockResolvedValue({
      inventory_turnover: {
        company_name: '遠傳電信',
        inventory_turnover_ratio: 7.06,
        radar_score: 100
      },
      roe: {
        company_name: '遠傳電信',
        roe: 0.12,
        radar_score: 81.03
      },
      revenue_growth: {
        company_name: '遠傳電信',
        revenue_growth_rate: 0.101,
        radar_score: 75.3
      },
      revenue_cagr: {
        company_name: '遠傳電信',
        cagr_percent: 4.89,
        radar_score: 49.63
      },
      receivables_turnover: {
        company_name: '遠傳電信',
        receivables_turnover_ratio: 13.48,
        radar_score: 61.33
      },
      current_ratio: {
        company_name: '遠傳電信',
        current_ratio: 1.2,
        radar_score: 60
      },
      total_assets_turnover: {
        company_name: '遠傳電信',
        total_assets_turnover_ratio: 1.08,
        radar_score: 61.33
      }
    });

    // 2. 調用異步函數
    const result = await processCompanyMetrics('97179430', '2024');

    // 3. 驗證結果
    expect(result).toBeDefined();
    expect(result.company_info).toBeDefined();
    expect(result.company_info.tax_id).toBe('97179430');
    expect(result.company_info.fiscal_year).toBe('2024');
    expect(result.dimension_scores).toBeDefined();
    expect(result.overall_score).toBeDefined();
    expect(result.score_level).toBeDefined();
  });

  // 測試錯誤處理
  it('應該拋出錯誤 (如果dataService失敗)', async () => {
    // Mock返回錯誤
    dataService.getCompanyAllMetrics.mockRejectedValue(
      new Error('DB Error')
    );

    // 期望函數拋出該錯誤
    await expect(
      processCompanyMetrics('97179430', '2024')
    ).rejects.toThrow('DB Error');
  });

  // 測試數據處理
  it('應該計算營運能力維度分數', async () => {
    // Mock只包含營運能力相關的數據
    dataService.getCompanyAllMetrics.mockResolvedValue({
      inventory_turnover: {
        company_name: '遠傳電信',
        inventory_turnover_ratio: 6,
        radar_score: 85
      },
      receivables_turnover: {
        company_name: '遠傳電信',
        receivables_turnover_ratio: 12,
        radar_score: 85
      },
      total_assets_turnover: {
        company_name: '遠傳電信',
        total_assets_turnover_ratio: 1.5,
        radar_score: 85
      },
      roe: null,
      revenue_growth: null,
      revenue_cagr: null,
      current_ratio: null
    });

    const result = await processCompanyMetrics('97179430', '2024');

    // 驗證營運能力分數被計算
    expect(result.dimension_scores.營運能力).toBeDefined();
    expect(result.dimension_scores.營運能力).toBeGreaterThan(0);
  });
});
```

**重要概念**:

1. **Mock設置**:
   ```javascript
   jest.mock('./dataService.js');  // 在文件頂部
   dataService.getCompanyAllMetrics.mockResolvedValue({...})  // 模擬成功返回
   dataService.getCompanyAllMetrics.mockRejectedValue(new Error(...))  // 模擬錯誤
   ```

2. **async/await測試**:
   ```javascript
   it('...', async () => {     // 添加async
     const result = await func();  // await調用異步函數
     expect(result).toBeDefined();
   });
   ```

3. **錯誤驗證**:
   ```javascript
   await expect(func()).rejects.toThrow('Error Message');
   ```

4. **清理Mock**:
   ```javascript
   beforeEach(() => {
     jest.clearAllMocks();  // 每個測試前清理
   });
   ```

---

## 5. 比較分析測試示例

### 示例：generateComparisonAnalysis

```javascript
describe('generateComparisonAnalysis - 生成比較分析', () => {

  // 準備測試數據
  const primaryMetrics = {
    overall_score: 85,
    score_level: { level: '優異' },
    dimension_scores: {
      營運能力: 80,
      財務能力: 85,
      未來力: 90,
      AI數位力: 82,
      ESG永續力: 75,
      創新能力: 65
    },
    營運能力: {
      inventory_turnover: { name: '存貨週轉率', score: 85 },
      receivables_turnover: { name: '應收帳款週轉率', score: 75 }
    },
    財務能力: {
      roe: { name: 'ROE', score: 85 },
      current_ratio: { name: '流動比率', score: 85 }
    }
  };

  const compareMetrics = {
    overall_score: 75,
    score_level: { level: '良好' },
    dimension_scores: {
      營運能力: 70,
      財務能力: 80,
      未來力: 75,
      AI數位力: 75,
      ESG永續力: 80,
      創新能力: 70
    },
    營運能力: {
      inventory_turnover: { name: '存貨週轉率', score: 70 },
      receivables_turnover: { name: '應收帳款週轉率', score: 70 }
    },
    財務能力: {
      roe: { name: 'ROE', score: 80 },
      current_ratio: { name: '流動比率', score: 80 }
    }
  };

  it('應該生成完整的比較分析物件', () => {
    const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

    // 驗證結構
    expect(analysis).toBeDefined();
    expect(analysis.overall_comparison).toBeDefined();
    expect(analysis.dimension_comparison).toBeDefined();
    expect(analysis.metric_comparison).toBeDefined();
    expect(analysis.recommendations).toBeDefined();
  });

  it('應該計算總體分數差異', () => {
    const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

    // 驗證計算結果
    expect(analysis.overall_comparison.primary_score).toBe(85);
    expect(analysis.overall_comparison.compare_score).toBe(75);
    expect(analysis.overall_comparison.difference).toBe(10); // 85 - 75
    expect(analysis.overall_comparison.performance).toBe('優於');
  });

  it('應該計算所有維度的比較', () => {
    const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

    // 驗證六個維度都有比較
    Object.keys(DIMENSION_WEIGHTS).forEach(dimension => {
      expect(analysis.dimension_comparison[dimension]).toBeDefined();
      expect(analysis.dimension_comparison[dimension].primary_score).toBeDefined();
      expect(analysis.dimension_comparison[dimension].compare_score).toBeDefined();
      expect(analysis.dimension_comparison[dimension].difference).toBeDefined();
    });
  });
});
```

---

## 6. 條件分支測試示例

### 示例：generateRecommendations

```javascript
describe('generateRecommendations - 生成改善建議', () => {

  it('應該為無差異的情況返回空建議陣列', () => {
    // 所有差異都 >= -5，不觸發任何建議條件
    const analysis = {
      overall_comparison: { difference: 5 },
      dimension_comparison: {
        營運能力: { difference: 2 },
        財務能力: { difference: 1 },
        未來力: { difference: 0 },
        AI數位力: { difference: -1 },
        ESG永續力: { difference: -2 },
        創新能力: { difference: 1 }
      },
      metric_comparison: {}
    };

    const recommendations = generateRecommendations(analysis);
    expect(recommendations).toEqual([]); // 空陣列
  });

  it('應該為總體表現差 (< -10) 生成high priority建議', () => {
    // 總體分數差 -15，觸發overall建議
    const analysis = {
      overall_comparison: { difference: -15 },  // < -10 → 觸發
      dimension_comparison: {
        營運能力: { difference: 0 },
        財務能力: { difference: 0 },
        未來力: { difference: 0 },
        AI數位力: { difference: 0 },
        ESG永續力: { difference: 0 },
        創新能力: { difference: 0 }
      },
      metric_comparison: {}
    };

    const recommendations = generateRecommendations(analysis);

    // 應該至少有一個建議
    expect(recommendations.length).toBeGreaterThan(0);

    // 第一個應該是high priority的overall建議
    expect(recommendations[0].priority).toBe('high');
    expect(recommendations[0].type).toBe('overall');
  });

  it('應該為維度表現差 (< -5) 生成medium priority建議', () => {
    // 營運能力維度分數差 -7，觸發dimension建議
    const analysis = {
      overall_comparison: { difference: 0 },
      dimension_comparison: {
        營運能力: { difference: -7 },  // < -5 → 觸發
        財務能力: { difference: 0 },
        未來力: { difference: 0 },
        AI數位力: { difference: 0 },
        ESG永續力: { difference: 0 },
        創新能力: { difference: 0 }
      },
      metric_comparison: {}
    };

    const recommendations = generateRecommendations(analysis);

    // 應該有維度相關的建議
    const dimRec = recommendations.find(r => r.type === 'dimension');
    expect(dimRec).toBeDefined();
    expect(dimRec.priority).toBe('medium');
    expect(dimRec.dimension).toBe('營運能力');
  });

  it('應該為指標表現差 (< -10) 生成high priority建議', () => {
    // ROE指標分數差 -12，觸發metric建議
    const analysis = {
      overall_comparison: { difference: 0 },
      dimension_comparison: {
        營運能力: { difference: 0 },
        財務能力: { difference: 0 },
        未來力: { difference: 0 },
        AI數位力: { difference: 0 },
        ESG永續力: { difference: 0 },
        創新能力: { difference: 0 }
      },
      metric_comparison: {
        roe: {
          name: 'ROE',
          dimension: '財務能力',
          difference: -12  // < -10 → 觸發
        }
      }
    };

    const recommendations = generateRecommendations(analysis);

    // 應該有指標相關的建議
    const metricRec = recommendations.find(r => r.type === 'metric');
    expect(metricRec).toBeDefined();
    expect(metricRec.priority).toBe('high');
    expect(metricRec.metric).toBe('ROE');
  });
});
```

**建議觸發邏輯**:
```
overall_comparison.difference < -10
  ├─ 是 → 生成overall high priority建議
  └─ 否 ↓

dimension_comparison[*].difference < -5 (對每個維度)
  ├─ 是 → 生成該維度的medium priority建議
  └─ 否 ↓

metric_comparison[*].difference < -10 (對每個指標)
  ├─ 是 → 生成該指標的high priority建議
  └─ 否 → 不生成建議
```

---

## 7. 數據驗證測試示例

### 示例：validateCalculationResults

```javascript
describe('validateCalculationResults - 驗證計算結果', () => {

  it('應該為有效結果返回空錯誤陣列', () => {
    // 所有分數都在有效範圍內
    const metrics = {
      dimension_scores: {
        營運能力: 80,    // ✓ 在[0,100]內
        財務能力: 85,    // ✓ 在[0,100]內
        未來力: 75,      // ✓ 在[0,100]內
        AI數位力: 82,    // ✓ 在[0,100]內
        ESG永續力: 78,   // ✓ 在[0,100]內
        創新能力: 70     // ✓ 在[0,100]內
      },
      overall_score: 78.5  // ✓ 在[0,100]內
    };

    const errors = validateCalculationResults(metrics);
    expect(errors).toEqual([]);
  });

  it('應該為超出範圍的維度分數返回錯誤', () => {
    const metrics = {
      dimension_scores: {
        營運能力: 150,   // ✗ 超過100
        財務能力: -10,   // ✗ 低於0
        未來力: 75,      // ✓
        AI數位力: 82,    // ✓
        ESG永續力: 78,   // ✓
        創新能力: 70     // ✓
      },
      overall_score: 78.5
    };

    const errors = validateCalculationResults(metrics);

    // 應該檢測到兩個超範圍的分數
    expect(errors.length).toBeGreaterThan(0);
  });

  it('應該為超出範圍的總體分數返回錯誤', () => {
    const metrics = {
      dimension_scores: {
        營運能力: 80,
        財務能力: 85,
        未來力: 75,
        AI數位力: 82,
        ESG永續力: 78,
        創新能力: 70
      },
      overall_score: 150  // ✗ 超過100
    };

    const errors = validateCalculationResults(metrics);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('應該允許邊界值 (0和100)', () => {
    const metrics = {
      dimension_scores: {
        營運能力: 0,     // ✓ 邊界值
        財務能力: 100,   // ✓ 邊界值
        未來力: 75,
        AI數位力: 82,
        ESG永續力: 78,
        創新能力: 70
      },
      overall_score: 0   // ✓ 邊界值
    };

    const errors = validateCalculationResults(metrics);
    expect(errors).toEqual([]); // 邊界值應該是有效的
  });
});
```

---

## 測試最佳實踐速查表

| 場景 | 使用方法 | 示例 |
|------|---------|------|
| 相等比較 | `toBe()` | `expect(score).toBe(100)` |
| 浮點數比較 | `toBeCloseTo()` | `expect(score).toBeCloseTo(66.5, 1)` |
| 大於/小於 | `toBeGreaterThan()` | `expect(score).toBeGreaterThan(0)` |
| 範圍內 | 結合使用 | `expect(score).toBeGreaterThanOrEqual(0)` |
| null檢查 | `toBeNull()` | `expect(result).toBeNull()` |
| 陣列長度 | `.length` | `expect(arr.length).toBeGreaterThan(0)` |
| 物件結構 | `toBeDefined()` | `expect(obj.prop).toBeDefined()` |
| 陣列內容 | `toEqual()` | `expect(arr).toEqual([])` |
| 異步成功 | `mockResolvedValue()` | `mock.mockResolvedValue(data)` |
| 異步失敗 | `mockRejectedValue()` | `mock.mockRejectedValue(error)` |
| 異步驗證 | `rejects.toThrow()` | `await expect(func()).rejects.toThrow()` |

---

## 調試技巧

### 1. 查看Mock被調用次數
```javascript
expect(dataService.getCompanyAllMetrics).toHaveBeenCalledTimes(1);
```

### 2. 查看Mock被調用的參數
```javascript
expect(dataService.getCompanyAllMetrics).toHaveBeenCalledWith('97179430', '2024');
```

### 3. 打印測試中間結果
```javascript
const result = processCompanyMetrics(...);
console.log('Result:', result);  // 會在測試輸出中顯示
```

### 4. 只執行某個測試 (跳過其他)
```javascript
it.only('應該...', () => {  // 只執行這個測試
  // ...
});
```

### 5. 跳過某個測試
```javascript
it.skip('應該...', () => {  // 跳過這個測試
  // ...
});
```

---

最後更新：2024年11月28日
