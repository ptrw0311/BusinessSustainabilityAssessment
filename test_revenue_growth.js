// 測試營收成長率功能

import { getRevenueGrowthData } from './src/services/dataService.js';

console.log('🧪 測試營收成長率功能\n');

async function testRevenueGrowthFunction() {
  try {
    console.log('📊 測試富鴻網營收成長率...');
    
    // 測試富鴻網營收成長率
    const foxconnRevenueData = await getRevenueGrowthData({ 
      tax_id: '24566673', 
      fiscal_year: '2024' 
    });
    
    console.log('\n✅ 富鴻網營收成長率結果:');
    console.log('公司名稱:', foxconnRevenueData[0]?.company_name);
    console.log('稅號:', '24566673');
    console.log('當年度營收:', foxconnRevenueData[0]?.current_operating_revenue_total);
    console.log('前年度營收:', foxconnRevenueData[0]?.previous_operating_revenue_total);
    console.log('營收成長率:', (foxconnRevenueData[0]?.revenue_growth_rate * 100).toFixed(1) + '%');
    console.log('雷達分數:', foxconnRevenueData[0]?.radar_score);
    
    // 測試遠傳電信作為對比
    console.log('\n📊 測試遠傳電信營收成長率作為對比...');
    const fetRevenueData = await getRevenueGrowthData({ 
      tax_id: '97179430', 
      fiscal_year: '2024' 
    });
    
    console.log('\n✅ 遠傳電信營收成長率結果:');
    console.log('公司名稱:', fetRevenueData[0]?.company_name);
    console.log('當年度營收:', fetRevenueData[0]?.current_operating_revenue_total);
    console.log('前年度營收:', fetRevenueData[0]?.previous_operating_revenue_total);
    console.log('營收成長率:', (fetRevenueData[0]?.revenue_growth_rate * 100).toFixed(1) + '%');
    console.log('雷達分數:', fetRevenueData[0]?.radar_score);
    
    // 測試台積電
    console.log('\n📊 測試台積電營收成長率...');
    const tsmcRevenueData = await getRevenueGrowthData({ 
      tax_id: '03540099', 
      fiscal_year: '2024' 
    });
    
    console.log('\n✅ 台積電營收成長率結果:');
    console.log('公司名稱:', tsmcRevenueData[0]?.company_name);
    console.log('營收成長率:', (tsmcRevenueData[0]?.revenue_growth_rate * 100).toFixed(1) + '%');
    console.log('雷達分數:', tsmcRevenueData[0]?.radar_score);
    
    // 顯示所有公司的營收成長率排名
    console.log('\n🏆 營收成長率排名:');
    const allCompanies = [
      { name: '富鴻網', score: foxconnRevenueData[0]?.radar_score, growth: foxconnRevenueData[0]?.revenue_growth_rate },
      { name: '遠傳電信', score: fetRevenueData[0]?.radar_score, growth: fetRevenueData[0]?.revenue_growth_rate },
      { name: '台積電', score: tsmcRevenueData[0]?.radar_score, growth: tsmcRevenueData[0]?.revenue_growth_rate }
    ];
    
    allCompanies
      .sort((a, b) => b.score - a.score)
      .forEach((company, index) => {
        console.log(`${index + 1}. ${company.name}: ${company.score.toFixed(1)}分 (成長率: ${(company.growth * 100).toFixed(1)}%)`);
      });
    
    console.log('\n🎉 營收成長率功能測試完成！');
    
  } catch (error) {
    console.error('❌ 測試失敗:', error.message);
    console.log('\n🔍 可能的解決方案:');
    console.log('1. 檢查資料服務層配置');
    console.log('2. 確認營收成長率計算邏輯');
    console.log('3. 檢查回退數據設定');
  }
}

testRevenueGrowthFunction();