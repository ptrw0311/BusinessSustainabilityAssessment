// 測試應收帳款週轉率功能
import { getAccountsReceivableTurnoverData, getCompanyAllMetrics } from './src/services/dataService.js';
import { createClient } from '@supabase/supabase-js';

// 設定 Supabase 環境變數 (需要實際值)
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

async function testArTurnover() {
  console.log('🧪 開始測試應收帳款週轉率功能...\n');

  try {
    // 測試參數
    const testParams = {
      tax_id: '97179430', // 遠傳電信
      fiscal_year: '2024'
    };

    console.log('📊 測試參數:', testParams);

    // 測試單一指標
    console.log('\n=== 測試單一應收帳款週轉率查詢 ===');
    const arData = await getAccountsReceivableTurnoverData(testParams);
    console.log('📈 應收帳款週轉率數據:', arData);

    // 測試完整指標套件
    console.log('\n=== 測試完整公司指標查詢 ===');
    const allMetrics = await getCompanyAllMetrics(testParams.tax_id, testParams.fiscal_year);
    console.log('📊 完整指標數據:', allMetrics);

    // 驗證結果
    if (allMetrics.ar_turnover) {
      console.log('\n✅ AR 週轉率數據成功載入:');
      console.log(`   📈 週轉率: ${allMetrics.ar_turnover.ar_turnover_ratio}`);
      console.log(`   🎯 雷達分數: ${allMetrics.ar_turnover.radar_score}`);
      console.log(`   🏢 公司名稱: ${allMetrics.ar_turnover.company_name}`);
    } else {
      console.log('❌ AR 週轉率數據未載入');
    }

    console.log('\n🎉 測試完成!');

  } catch (error) {
    console.error('❌ 測試失敗:', error);
  }
}

// 執行測試 (需要在支援 ES modules 的環境中執行)
testArTurnover();