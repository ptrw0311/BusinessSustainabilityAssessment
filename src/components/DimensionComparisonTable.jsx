// src/components/DimensionComparisonTable.jsx
// 維度評分比較表格組件 - Image #1 格式

import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, Award, Leaf, Lightbulb } from 'lucide-react';
import { processComparisonData } from '../services/calculationService.js';

const DimensionComparisonTable = ({ primaryCompany, compareCompany }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從真實數據服務獲取數據
  useEffect(() => {
    console.log('DimensionComparisonTable useEffect triggered');
    console.log('Primary company:', primaryCompany);
    console.log('Compare company:', compareCompany);

    const fetchComparisonData = async () => {
      try {
        console.log('開始獲取比較數據...');
        setLoading(true);
        const data = await processComparisonData(
          primaryCompany.taxId,
          compareCompany.taxId,
          '2024'
        );
        console.log('獲取到的比較數據:', data);
        setComparisonData(data);
      } catch (err) {
        console.error('獲取比較數據失敗:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (primaryCompany?.taxId && compareCompany?.taxId) {
      console.log('條件滿足，開始獲取數據');
      fetchComparisonData();
    } else {
      console.log('條件不滿足：', {
        primaryTaxId: primaryCompany?.taxId,
        compareTaxId: compareCompany?.taxId
      });
      setLoading(false);
    }
  }, [primaryCompany?.taxId, compareCompany?.taxId]);

  // 維度圖示映射
  const dimensionIcons = {
    營運能力: <BarChart3 className="w-5 h-5 text-gray-600" />,
    財務能力: <BarChart3 className="w-5 h-5 text-gray-600" />,
    未來力: <Zap className="w-5 h-5 text-gray-600" />,
    AI數位力: <Award className="w-5 h-5 text-gray-600" />,
    ESG永續力: <Leaf className="w-5 h-5 text-gray-600" />,
    創新能力: <Lightbulb className="w-5 h-5 text-gray-600" />
  };

  if (loading) {
    return (
      <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
        <div className="text-center">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
        <div className="text-center text-red-500">錯誤: {error}</div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
        <div className="text-center">無法載入數據</div>
      </div>
    );
  }

  // 獲取六大維度的分數
  const primaryDimensionScores = comparisonData.primary.dimension_scores || {};
  const compareDimensionScores = comparisonData.compare.dimension_scores || {};

  // 營運能力的詳細指標數據
  const operationalMetrics = {
    存貨週轉率: {
      primary: comparisonData.primary.營運能力?.inventory_turnover?.score || 0,
      compare: comparisonData.compare.營運能力?.inventory_turnover?.score || 0
    },
    應收帳款週轉率: {
      primary: comparisonData.primary.營運能力?.receivables_turnover?.score || 0,
      compare: comparisonData.compare.營運能力?.receivables_turnover?.score || 0
    }
  };

  // 定義維度順序，按照 Image #1 的順序
  const dimensionOrder = ['營運能力', '財務能力', '未來力', 'AI數位力', 'ESG永續力', '創新能力'];

  return (
    <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
      <h3 className="text-xl font-bold mb-6 text-slate-800">維度評分比較</h3>

      {/* Image #1 格式的簡潔表格 */}
      <div className="bg-white rounded-lg p-4 shadow-inner">
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="font-medium text-gray-700">{comparisonData.primary.company_info?.company_name || primaryCompany.name}</span>
          </div>
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span className="font-medium text-gray-700">{comparisonData.compare.company_info?.company_name || compareCompany.name}</span>
          </div>
        </div>

        {/* 六大維度評分 */}
        <div className="space-y-4">
          {dimensionOrder.map((dimension, index) => {
            const primaryScore = primaryDimensionScores[dimension] || 0;
            const compareScore = compareDimensionScores[dimension] || 0;

            return (
              <div key={dimension}>
                {/* 主要維度 */}
                <div className="flex items-center py-3">
                  <div className="flex items-center space-x-3 flex-1">
                    {dimensionIcons[dimension]}
                    <div>
                      <div className="font-medium text-gray-800">{dimension}</div>
                      <div className="text-sm text-gray-500">分數</div>
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {Math.round(primaryScore * 100) / 100}
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-teal-400">
                      {Math.round(compareScore * 100) / 100}
                    </div>
                  </div>
                </div>

                {/* 營運能力詳細指標 */}
                {dimension === '營運能力' && (
                  <div className="ml-8 space-y-3">
                    {/* 存貨週轉率 */}
                    <div className="flex items-center py-2">
                      <div className="flex-1">
                        <div className="text-gray-700 font-medium">存貨週轉率</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-lg font-bold text-orange-400">
                            {Math.round(operationalMetrics.存貨週轉率.primary * 100) / 100}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-orange-400 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(operationalMetrics.存貨週轉率.primary, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-lg font-bold text-teal-400">
                            {Math.round(operationalMetrics.存貨週轉率.compare * 100) / 100}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-teal-400 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(operationalMetrics.存貨週轉率.compare, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 應收帳款週轉率 */}
                    <div className="flex items-center py-2">
                      <div className="flex-1">
                        <div className="text-gray-700 font-medium">應收帳款週轉率</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-lg font-bold text-orange-400">
                            {Math.round(operationalMetrics.應收帳款週轉率.primary * 100) / 100}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-orange-400 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(operationalMetrics.應收帳款週轉率.primary, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-lg font-bold text-teal-400">
                            {Math.round(operationalMetrics.應收帳款週轉率.compare * 100) / 100}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-teal-400 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(operationalMetrics.應收帳款週轉率.compare, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DimensionComparisonTable;