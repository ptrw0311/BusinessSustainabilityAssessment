// 測試新的商業邏輯架構
import { 
  COMPANIES,
  getScoreLevel,
  calculateDimensionScore,
  calculateOverallScore 
} from './src/config/businessLogic.js';

import {
  getInventoryTurnoverData,
  getRoeData,
  getCompanyAllMetrics
} from './src/services/dataService.js';

import {
  calculateInventoryTurnoverScore,
  calculateRoeScore,
  processCompanyMetrics,
  formatRadarChartData
} from './src/services/calculationService.js';

console.log('🧪 測試企業永續評估架構...\n');

// 測試 1: 基本配置
console.log('📋 測試 1: 基本配置');
console.log('公司列表:', Object.keys(COMPANIES));
console.log('遠傳電信資訊:', COMPANIES.FET);

// 測試 2: 評分等級
console.log('\n🏆 測試 2: 評分等級');
const testScores = [95, 80, 65, 45, 25];
testScores.forEach(score => {
  const level = getScoreLevel(score);
  console.log(`分數 ${score}: ${level.level} (${level.icon})`);
});

// 測試 3: 指標計算
console.log('\n📊 測試 3: 指標計算');
const testTurnoverRatio = 4.2;
const inventoryScore = calculateInventoryTurnoverScore(testTurnoverRatio);
console.log(`存貨週轉率 ${testTurnoverRatio} -> 雷達圖分數: ${inventoryScore.toFixed(2)}`);

const testRoe = 0.085;
const roeScore = calculateRoeScore(testRoe);
console.log(`ROE ${(testRoe * 100).toFixed(1)}% -> 雷達圖分數: ${roeScore.toFixed(2)}`);

// 測試 4: 維度分數計算
console.log('\n🎯 測試 4: 維度分數計算');
const mockMetrics = {
  inventory_turnover: { score: 75, name: '存貨週轉率' }
};
const dimensionScore = calculateDimensionScore(mockMetrics);
console.log(`營運能力維度分數: ${dimensionScore.toFixed(2)}`);

// 測試 5: 總體評分
console.log('\n🌟 測試 5: 總體評分');
const mockDimensionScores = {
  營運能力: 75,
  財務能力: 82,
  未來力: 0,     // 暫無數據
  AI數位力: 0,   // 暫無數據
  ESG永續力: 0,  // 暫無數據
  創新能力: 0    // 暫無數據
};
const overallScore = calculateOverallScore(mockDimensionScores);
console.log(`總體評分: ${overallScore.toFixed(2)}`);

// 測試 6: 模擬資料服務
console.log('\n🔄 測試 6: 模擬資料服務');

(async () => {
  try {
    console.log('測試存貨週轉率資料獲取...');
    const inventoryData = await getInventoryTurnoverData({
      tax_id: '97179430',
      fiscal_year: '2024'
    });
    console.log('存貨週轉率資料:', inventoryData[0]);

    console.log('\n測試ROE資料獲取...');
    const roeData = await getRoeData({
      tax_id: '97179430', 
      fiscal_year: '2024'
    });
    console.log('ROE資料:', roeData[0]);

    console.log('\n測試完整公司指標處理...');
    const companyReport = await processCompanyMetrics('97179430', '2024');
    console.log('公司報告摘要:');
    console.log('- 公司名稱:', companyReport.company_info.company_name);
    console.log('- 總體分數:', companyReport.overall_score?.toFixed(2));
    console.log('- 評級:', companyReport.score_level?.level);
    
    console.log('\n雷達圖資料:', formatRadarChartData(companyReport));
    
    console.log('\n✅ 所有測試完成！新架構運行正常。');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
  }
})();