// 檢查雷達圖分數的PostgreSQL查詢結果

import { getInventoryTurnoverData, getRoeData } from './src/services/dataService.js';

console.log('📊 PostgreSQL查詢結果驗證表格\n');

async function checkRadarScores() {
  try {
    // 富鴻網數據 (tax_id: 24566673)
    console.log('🏢 富鴻網 (tax_id: 24566673)');
    const foxconnInventory = await getInventoryTurnoverData({ tax_id: '24566673', fiscal_year: '2024' });
    const foxconnRoe = await getRoeData({ tax_id: '24566673', fiscal_year: '2024' });
    
    console.log('  營運能力分數:', foxconnInventory[0]?.radar_score);
    console.log('  財務能力分數:', foxconnRoe[0]?.radar_score);
    
    // 遠傳電信數據 (tax_id: 97179430)  
    console.log('\n🏢 遠傳電信 (tax_id: 97179430)');
    const fetInventory = await getInventoryTurnoverData({ tax_id: '97179430', fiscal_year: '2024' });
    const fetRoe = await getRoeData({ tax_id: '97179430', fiscal_year: '2024' });
    
    console.log('  營運能力分數:', fetInventory[0]?.radar_score);
    console.log('  財務能力分數:', fetRoe[0]?.radar_score);
    
    // 確認表格
    console.log('\n📋 PostgreSQL查詢結果確認表格:');
    console.log('┌─────────────┬──────────────┬──────────────┐');
    console.log('│   公司名稱   │   營運能力   │   財務能力   │');
    console.log('├─────────────┼──────────────┼──────────────┤');
    console.log(`│ 富鴻網       │ ${String(foxconnInventory[0]?.radar_score || 'N/A').padEnd(10)} │ ${String(foxconnRoe[0]?.radar_score || 'N/A').padEnd(10)} │`);
    console.log(`│ 遠傳電信     │ ${String(fetInventory[0]?.radar_score || 'N/A').padEnd(10)} │ ${String(fetRoe[0]?.radar_score || 'N/A').padEnd(10)} │`);
    console.log('└─────────────┴──────────────┴──────────────┘');

    // 預期vs實際對比
    console.log('\n🎯 預期vs實際對比:');
    console.log(`富鴻網 - 營運能力: 預期 45.17, 實際 ${foxconnInventory[0]?.radar_score}`);
    console.log(`富鴻網 - 財務能力: 預期 1.13, 實際 ${foxconnRoe[0]?.radar_score}`);
    console.log(`遠傳 - 營運能力: 預期 100, 實際 ${fetInventory[0]?.radar_score}`);
    console.log(`遠傳 - 財務能力: 預期 81.03, 實際 ${fetRoe[0]?.radar_score}`);
    
  } catch (error) {
    console.error('查詢錯誤:', error.message);
  }
}

checkRadarScores();