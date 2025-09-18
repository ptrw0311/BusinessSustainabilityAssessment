// 測試Supabase ROE查詢功能

import { getRoeData } from './src/services/dataService.js';

console.log('🧪 測試Supabase ROE查詢功能\n');

async function testSupabaseRoeQuery() {
  try {
    console.log('📊 測試富鴻網ROE數據查詢...');
    
    // 測試富鴻網ROE查詢
    const foxconnRoeData = await getRoeData({ 
      tax_id: '24566673', 
      fiscal_year: '2024' 
    });
    
    console.log('\n✅ 富鴻網ROE查詢結果:');
    console.log('公司名稱:', foxconnRoeData[0]?.company_name);
    console.log('稅號:', foxconnRoeData[0]?.tax_id);
    console.log('淨利:', foxconnRoeData[0]?.net_income);
    console.log('平均股東權益:', foxconnRoeData[0]?.avg_total_equity);
    console.log('ROE:', foxconnRoeData[0]?.roe);
    console.log('雷達分數:', foxconnRoeData[0]?.radar_score);
    
    // 驗證是否使用了真實Supabase數據
    const isRealData = foxconnRoeData[0]?.net_income === 100000; // 你更新的net_income值
    
    console.log('\n🔍 數據來源驗證:');
    if (isRealData) {
      console.log('✅ 使用真實Supabase數據');
      console.log('✅ net_income = 100000 (符合你在Supabase中更新的值)');
      
      // 計算預期的ROE分數
      const expectedScore = foxconnRoeData[0]?.radar_score;
      console.log(`✅ 新的雷達分數: ${expectedScore} (應該接近100)`);
      
      if (expectedScore > 90) {
        console.log('🎉 SUCCESS: 雷達分數已更新為高分！');
      } else {
        console.log('⚠️  雷達分數仍較低，可能需要調整股東權益數據');
      }
    } else {
      console.log('❌ 仍在使用模擬數據 (net_income != 100000)');
      console.log('🔍 可能的原因:');
      console.log('  1. Supabase連線問題');
      console.log('  2. 資料表中沒有對應記錄');
      console.log('  3. 欄位名稱不匹配');
    }
    
    // 測試遠傳電信作為對比
    console.log('\n📊 測試遠傳電信ROE數據作為對比...');
    const fetRoeData = await getRoeData({ 
      tax_id: '97179430', 
      fiscal_year: '2024' 
    });
    
    console.log('遠傳雷達分數:', fetRoeData[0]?.radar_score);
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.log('\n🔍 可能的解決方案:');
    console.log('1. 檢查Supabase連線設定');
    console.log('2. 確認資料表結構和欄位名稱');
    console.log('3. 檢查網路連線');
  }
}

testSupabaseRoeQuery();