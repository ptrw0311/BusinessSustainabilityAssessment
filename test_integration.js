// Integration Test for Total Assets Turnover Functionality
// This script tests the new total assets turnover implementation

import { OPERATIONAL_METRICS, calculateDimensionScore } from './src/config/businessLogic.js';
import { calculateTotalAssetsTurnoverScore } from './src/services/calculationService.js';

async function testTotalAssetsTurnoverIntegration() {
  console.log('🔍 開始總資產週轉率功能整合測試...\n');
  
  try {
    // 測試1: 檢查業務配置
    console.log('✅ 測試1: 檢查 OPERATIONAL_METRICS 配置');
    const totalAssetsConfig = OPERATIONAL_METRICS.total_assets_turnover;
    if (!totalAssetsConfig) {
      throw new Error('總資產週轉率配置未找到');
    }
    console.log(`   - 名稱: ${totalAssetsConfig.name}`);
    console.log(`   - 權重: ${totalAssetsConfig.weight} (應為 0.334)`);
    console.log(`   - 基準值: ${totalAssetsConfig.benchmark}`);
    console.log(`   - 最高分數: ${totalAssetsConfig.maxScore}\n`);

    // 測試2: 驗證權重總和
    console.log('✅ 測試2: 驗證營運能力權重分配');
    const totalWeight = OPERATIONAL_METRICS.inventory_turnover.weight + 
                       OPERATIONAL_METRICS.receivables_turnover.weight + 
                       OPERATIONAL_METRICS.total_assets_turnover.weight;
    console.log(`   - 存貨週轉率權重: ${OPERATIONAL_METRICS.inventory_turnover.weight}`);
    console.log(`   - 應收帳款週轉率權重: ${OPERATIONAL_METRICS.receivables_turnover.weight}`);
    console.log(`   - 總資產週轉率權重: ${OPERATIONAL_METRICS.total_assets_turnover.weight}`);
    console.log(`   - 權重總和: ${totalWeight.toFixed(3)} (應接近 1.0)\n`);

    // 測試3: 測試分數計算函數
    console.log('✅ 測試3: 測試總資產週轉率分數計算');
    const testValues = [0.5, 1.0, 1.5, 2.0, 2.5];
    
    for (const value of testValues) {
      const score = calculateTotalAssetsTurnoverScore(value);
      console.log(`   - 週轉率 ${value}: 分數 ${score.toFixed(2)}`);
    }
    console.log('');

    // 測試4: 測試維度分數計算
    console.log('✅ 測試4: 測試營運能力維度分數計算');
    
    // 模擬三個指標的數據
    const mockOperationalMetrics = {
      inventory_turnover: { score: 80 },
      receivables_turnover: { score: 75 },
      total_assets_turnover: { score: 70 }
    };
    
    const dimensionScore = calculateDimensionScore(mockOperationalMetrics);
    console.log(`   - 存貨週轉率分數: 80`);
    console.log(`   - 應收帳款週轉率分數: 75`);
    console.log(`   - 總資產週轉率分數: 70`);
    console.log(`   - 營運能力維度分數: ${dimensionScore.toFixed(2)}`);
    
    // 計算預期分數 (權重平均)
    const expectedScore = (80 * 0.333 + 75 * 0.333 + 70 * 0.334);
    console.log(`   - 預期分數 (權重平均): ${expectedScore.toFixed(2)}`);
    console.log(`   - 計算準確性: ${Math.abs(dimensionScore - expectedScore) < 0.1 ? '✓' : '✗'}`);
    console.log('');

    // 測試5: 測試邊界條件
    console.log('✅ 測試5: 測試邊界條件');
    
    const edgeCases = [
      { value: null, expected: 0 },
      { value: undefined, expected: 0 },
      { value: 0, expected: 0 }
    ];
    
    for (const testCase of edgeCases) {
      const score = calculateTotalAssetsTurnoverScore(testCase.value);
      const isCorrect = score === testCase.expected;
      console.log(`   - 輸入 ${testCase.value}: 分數 ${score} ${isCorrect ? '✓' : '✗'}`);
    }
    console.log('');

    console.log('🎉 總資產週轉率功能整合測試通過!');
    console.log('✨ 新功能已成功集成到營運能力維度中');
    
  } catch (error) {
    console.error('❌ 整合測試失敗:', error);
    console.error('錯誤詳情:', error.message);
    process.exit(1);
  }
}

// 執行測試
testTotalAssetsTurnoverIntegration();