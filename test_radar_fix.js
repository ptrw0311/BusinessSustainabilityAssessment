// 測試修正後的雷達圖數據

import { processCompanyMetrics } from './src/services/calculationService.js';
import { COMPANIES } from './src/config/businessLogic.js';

console.log('🔧 測試修正後的雷達圖數據\n');

async function testRadarDataFix() {
  try {
    console.log('📊 測試公司指標數據載入...\n');
    
    // 測試富鴻網
    console.log('🏢 富鴻網 (tax_id: 24566673)');
    const foxconnData = await processCompanyMetrics('24566673', '2024');
    console.log('  營運能力分數:', foxconnData.dimension_scores?.營運能力);
    console.log('  財務能力分數:', foxconnData.dimension_scores?.財務能力);
    
    // 測試遠傳電信
    console.log('\n🏢 遠傳電信 (tax_id: 97179430)');
    const fetData = await processCompanyMetrics('97179430', '2024');
    console.log('  營運能力分數:', fetData.dimension_scores?.營運能力);
    console.log('  財務能力分數:', fetData.dimension_scores?.財務能力);
    
    // 模擬雷達圖數據生成
    console.log('\n📈 模擬雷達圖數據生成:');
    
    const radarData = [
      { 
        dimension: '營運能力', 
        主要公司: Math.round(fetData.dimension_scores?.營運能力 || 0), 
        比較公司: Math.round(foxconnData.dimension_scores?.營運能力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: '財務能力', 
        主要公司: Math.round(fetData.dimension_scores?.財務能力 || 0), 
        比較公司: Math.round(foxconnData.dimension_scores?.財務能力 || 0), 
        fullMark: 100 
      }
    ];
    
    console.table(radarData);
    
    // 驗證結果
    console.log('\n✅ 驗證結果:');
    const fetOperational = Math.round(fetData.dimension_scores?.營運能力 || 0);
    const fetFinancial = Math.round(fetData.dimension_scores?.財務能力 || 0);
    const foxconnOperational = Math.round(foxconnData.dimension_scores?.營運能力 || 0);
    const foxconnFinancial = Math.round(foxconnData.dimension_scores?.財務能力 || 0);
    
    console.log(`遠傳 - 營運能力: ${fetOperational} (預期: 100) ${fetOperational === 100 ? '✅' : '❌'}`);
    console.log(`遠傳 - 財務能力: ${fetFinancial} (預期: 81) ${fetFinancial === 81 ? '✅' : '❌'}`);
    console.log(`富鴻網 - 營運能力: ${foxconnOperational} (預期: 45) ${foxconnOperational === 45 ? '✅' : '❌'}`);
    console.log(`富鴻網 - 財務能力: ${foxconnFinancial} (預期: 1) ${foxconnFinancial === 1 ? '✅' : '❌'}`);
    
    const allCorrect = fetOperational === 100 && fetFinancial === 81 && foxconnOperational === 45 && foxconnFinancial === 1;
    
    console.log(`\n🎯 總體結果: ${allCorrect ? '✅ 全部正確' : '❌ 需要調整'}`);
    
    if (allCorrect) {
      console.log('\n🚀 雷達圖數據修正成功！現在可以在瀏覽器中預覽效果：');
      console.log('   1. 開啟 http://localhost:5174');
      console.log('   2. 選擇遠傳電信 vs 富鴻網');
      console.log('   3. 觀察雷達圖顯示正確分數');
    }
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
  }
}

testRadarDataFix();