// src/TestDimensionComparison.jsx
// 測試新的維度評分比較組件

import React from 'react';
import DimensionComparisonTable from './components/DimensionComparisonTable.jsx';

const TestDimensionComparison = () => {
  // 真實公司數據 - 包含稅號
  const primaryCompany = {
    name: '富鴻網',
    tax_id: '24566673' // 富鴻網統一編號
  };

  const compareCompany = {
    name: '遠傳電信',
    tax_id: '97179430' // 遠傳電信統一編號
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">維度評分比較測試頁面</h1>

        <DimensionComparisonTable
          primaryCompany={primaryCompany}
          compareCompany={compareCompany}
        />
      </div>
    </div>
  );
};

export default TestDimensionComparison;