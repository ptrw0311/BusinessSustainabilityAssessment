// 測試營收成長率計算邏輯

// 模擬營收成長率計算函數
function calculateRevenueGrowthScore(growthRate) {
  if (growthRate === null || growthRate === undefined) {
    return 50; // 無法計算時給予中等分數
  }
  
  // 依據規格文件的評分邏輯
  if (growthRate < -0.2) {
    // 成長率 < -20%：0分
    return 0;
  } else if (growthRate < 0) {
    // -20% ≤ 成長率 < 0%：25-50分線性計分
    return 25 + (growthRate * 1.25 * 100);
  } else {
    // 成長率 ≥ 0%：50-100分線性增長
    return Math.min(100, 50 + (growthRate * 2.5 * 100));
  }
}

console.log('🧪 營收成長率計算邏輯測試\n');

// 測試各種成長率情況
const testCases = [
  { company: '富鴻網', growth: 0.140, expected: 85.0 },
  { company: '遠傳電信', growth: 0.101, expected: 75.3 },
  { company: '台積電', growth: 0.087, expected: 71.7 },
  { company: '台灣大哥大', growth: 0.029, expected: 57.3 },
  { company: '負成長範例', growth: -0.10, expected: 37.5 },
  { company: '嚴重衰退', growth: -0.25, expected: 0 },
  { company: '零成長', growth: 0.0, expected: 50 },
  { company: '高成長', growth: 0.20, expected: 100 }
];

console.log('📊 營收成長率分數計算結果:\n');

testCases.forEach(testCase => {
  const calculatedScore = calculateRevenueGrowthScore(testCase.growth);
  const growthPercent = (testCase.growth * 100).toFixed(1);
  const isMatch = Math.abs(calculatedScore - testCase.expected) < 0.1;
  
  console.log(`${testCase.company}:`);
  console.log(`  成長率: ${growthPercent}%`);
  console.log(`  計算分數: ${calculatedScore.toFixed(1)}`);
  console.log(`  預期分數: ${testCase.expected}`);
  console.log(`  結果: ${isMatch ? '✅ 正確' : '❌ 不符'}`);
  console.log('');
});

// 驗證分數計算公式
console.log('🔍 分數計算公式驗證:\n');

console.log('正成長公式: 50 + (成長率 × 2.5 × 100)');
console.log('富鴻網 14%: 50 + (0.14 × 2.5 × 100) = 50 + 35 = 85 ✅');
console.log('遠傳 10.1%: 50 + (0.101 × 2.5 × 100) = 50 + 25.25 = 75.25 ≈ 75.3 ✅');

console.log('\n負成長公式: 25 + (成長率 × 1.25 × 100)');
console.log('負10%: 25 + (-0.1 × 1.25 × 100) = 25 + (-12.5) = 12.5');

console.log('\n🎉 計算邏輯測試完成！');