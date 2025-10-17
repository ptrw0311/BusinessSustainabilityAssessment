// src/services/calculationService.js
// 企業永續性評估 - 計算服務層

import {
  OPERATIONAL_METRICS,
  FINANCIAL_METRICS,
  DIMENSION_WEIGHTS,
  SCORE_LEVELS,
  MOCK_DIMENSION_SCORES,
  getMetricConfig,
  getDimensionMetrics,
  getScoreLevel,
  calculateDimensionScore,
  calculateOverallScore
} from '../config/businessLogic.js';

import {
  getInventoryTurnoverData,
  getRoeData,
  getRevenueGrowthData,
  getReceivablesTurnoverData,
  getCurrentRatioData,
  getRevenueCagrData,
  getCompanyAllMetrics,
  getComparisonData
} from './dataService.js';

/**
 * 根據稅號獲取公司代碼
 */
const getCompanyKeyByTaxId = (taxId) => {
  const taxIdToKeyMap = {
    '97179430': 'FET',      // 遠傳電信
    '03540099': 'TSMC',     // 台積電
    '97176270': 'TWM',      // 台灣大哥大
    '24566673': 'FOXCONN'   // 富鴻網
  };
  return taxIdToKeyMap[taxId] || 'FET';
};

/**
 * 計算存貨週轉率分數
 */
export const calculateInventoryTurnoverScore = (turnoverRatio) => {
  const config = OPERATIONAL_METRICS.inventory_turnover;
  
  if (turnoverRatio === null || turnoverRatio === undefined) {
    return 0;
  }
  
  // 基於配置計算分數
  const score = (turnoverRatio / config.benchmark) * config.maxScore;
  
  // 應用邊界限制
  return Math.max(0, Math.min(100, score));
};

/**
 * 計算應收帳款週轉率分數
 */
export const calculateReceivablesTurnoverScore = (turnoverRatio) => {
  const config = OPERATIONAL_METRICS.receivables_turnover;
  
  if (turnoverRatio === null || turnoverRatio === undefined) {
    return 0;
  }
  
  // 基於基準值計算分數
  const score = (turnoverRatio / config.benchmark) * config.maxScore;
  
  // 限制在 0-100 範圍內
  return Math.max(0, Math.min(100, score));
};

/**
 * 計算ROE分數 (分段評分)
 */
export const calculateRoeScore = (roe) => {
  if (roe === null || roe === undefined) {
    return null;
  }
  
  const config = FINANCIAL_METRICS.roe;
  
  // 根據分段評分規則計算
  for (const segment of config.scoring.segments) {
    let inRange = false;
    
    if (segment.condition === 'roe < 0' && roe < 0) {
      inRange = true;
    } else if (segment.condition === '0 <= roe <= 0.15' && roe >= 0 && roe <= 0.15) {
      inRange = true;
    } else if (segment.condition === 'roe > 0.15' && roe > 0.15) {
      inRange = true;
    }
    
    if (inRange) {
      if (roe < 0) {
        // 虧損情況：0-25分
        return 0 + (25 - 0) * Math.min(Math.abs(roe) / 10.0, 1.0);
      } else if (roe <= 0.15) {
        // 正常情況：50-83分
        return 50 + (83 - 50) * (roe / 0.15);
      } else {
        // 優秀情況：83-100分
        return 83 + (100 - 83) * Math.min((roe - 0.15) / 0.15, 1.0);
      }
    }
  }
  
  return 0; // 預設值
};

/**
 * 計算營收成長率分數
 */
export const calculateRevenueGrowthScore = (growthRate) => {
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
};

/**
 * 計算營收複合年均成長率分數 (線性映射)
 */
export const calculateRevenueCagrScore = (cagrPercent) => {
  if (cagrPercent === null || cagrPercent === undefined) {
    return null;
  }
  
  // 線性映射：區間 [-10%, 20%] 映射到 [0, 100]
  // 公式：((CAGR% - (-10%)) / (20% - (-10%))) * 100
  const cagrDecimal = cagrPercent / 100.0; // 轉換為小數
  const minRange = -0.1; // -10%
  const maxRange = 0.2;  // 20%
  
  const score = ((cagrDecimal - minRange) / (maxRange - minRange)) * 100;
  
  // 限制在 0-100 範圍內
  return Math.max(0, Math.min(100, score));
};

/**
 * 計算未來力維度分數 (營收成長率 + 營收複合年均成長率的平均)
 */
export const calculateFutureCapabilityScore = (futureMetrics) => {
  const revenueGrowthScore = futureMetrics.revenue_growth?.score;
  const revenueCagrScore = futureMetrics.revenue_cagr?.score;
  
  // 如果兩個指標都有分數，取平均值
  if (revenueGrowthScore !== null && revenueGrowthScore !== undefined && 
      revenueCagrScore !== null && revenueCagrScore !== undefined) {
    return (revenueGrowthScore + revenueCagrScore) / 2;
  }
  
  // 如果只有其中一個指標，使用該指標的分數
  if (revenueGrowthScore !== null && revenueGrowthScore !== undefined) {
    return revenueGrowthScore;
  }
  
  if (revenueCagrScore !== null && revenueCagrScore !== undefined) {
    return revenueCagrScore;
  }
  
  // 如果都沒有，返回null
  return null;
};

/**
 * 計算流動比率分數
 */
export const calculateCurrentRatioScore = (currentRatio) => {
  if (currentRatio === null || currentRatio === undefined) {
    return 0;
  }
  
  // 依據規格文件：以2.0為基準，線性計算0-100分
  // 計算公式：MIN(100, MAX(0, (流動比率 / 2.0) × 100))
  const score = Math.min(100, Math.max(0, (currentRatio / 2.0) * 100));
  
  return Math.round(score * 100) / 100; // 保留兩位小數
};

/**
 * 處理單一公司的原始資料並計算分數
 */
export const processCompanyMetrics = async (taxId, fiscalYear) => {
  try {
    const rawData = await getCompanyAllMetrics(taxId, fiscalYear);
    
    const processedMetrics = {
      營運能力: {},
      財務能力: {},
      company_info: {
        tax_id: taxId,
        fiscal_year: fiscalYear,
        company_name: rawData.inventory_turnover?.company_name || rawData.roe?.company_name || '未知公司'
      }
    };
    
    // 處理存貨週轉率
    if (rawData.inventory_turnover) {
      const turnoverRatio = rawData.inventory_turnover.inventory_turnover_ratio;
      const radarScore = rawData.inventory_turnover.radar_score; // 使用SQL計算的分數
      
      processedMetrics.營運能力.inventory_turnover = {
        name: '存貨週轉率',
        value: turnoverRatio,
        score: radarScore,
        calculated_score: calculateInventoryTurnoverScore(turnoverRatio), // 用於驗證
        raw_data: rawData.inventory_turnover
      };
    }
    
    // 處理應收帳款週轉率
    if (rawData.receivables_turnover) {
      const turnoverRatio = rawData.receivables_turnover.receivables_turnover_ratio;
      const radarScore = rawData.receivables_turnover.radar_score; // 使用SQL計算的分數
      
      processedMetrics.營運能力.receivables_turnover = {
        name: '應收帳款週轉率',
        value: turnoverRatio,
        score: radarScore,
        calculated_score: calculateReceivablesTurnoverScore(turnoverRatio), // 用於驗證
        raw_data: rawData.receivables_turnover
      };
    }
    
    // 處理ROE
    if (rawData.roe) {
      const roeValue = rawData.roe.roe;
      const radarScore = rawData.roe.radar_score; // 使用SQL計算的分數
      
      processedMetrics.財務能力.roe = {
        name: 'ROE',
        value: roeValue,
        score: radarScore,
        calculated_score: calculateRoeScore(roeValue), // 用於驗證
        raw_data: rawData.roe
      };
    }
    
    // 處理流動比率
    if (rawData.current_ratio) {
      const currentRatioValue = rawData.current_ratio.current_ratio;
      const radarScore = rawData.current_ratio.radar_score; // 使用SQL計算的分數
      
      processedMetrics.財務能力.current_ratio = {
        name: '流動比率',
        value: currentRatioValue,
        score: radarScore,
        calculated_score: calculateCurrentRatioScore(currentRatioValue), // 用於驗證
        raw_data: rawData.current_ratio
      };
    }
    
    // 初始化未來力維度
    processedMetrics.未來力 = {};
    
    // 處理營收成長率數據 (未來力)
    if (rawData.revenue_growth) {
      const revenueGrowthValue = rawData.revenue_growth.revenue_growth_rate;
      const radarScore = rawData.revenue_growth.radar_score;
      
      processedMetrics.未來力.revenue_growth = {
        name: '營收成長率',
        value: revenueGrowthValue,
        score: radarScore,
        calculated_score: calculateRevenueGrowthScore(revenueGrowthValue), // 用於驗證
        raw_data: rawData.revenue_growth
      };
    }
    
    // 處理營收複合年均成長率數據 (未來力)
    if (rawData.revenue_cagr) {
      const revenueCagrValue = rawData.revenue_cagr.cagr_percent;
      const radarScore = rawData.revenue_cagr.radar_score;
      
      processedMetrics.未來力.revenue_cagr = {
        name: '營收複合年均成長率',
        value: revenueCagrValue,
        score: radarScore,
        calculated_score: calculateRevenueCagrScore(revenueCagrValue), // 用於驗證
        raw_data: rawData.revenue_cagr
      };
    }
    
    // 計算維度分數 (包含真實和虚擬數據)
    const companyKey = getCompanyKeyByTaxId(taxId);
    const mockScores = MOCK_DIMENSION_SCORES[companyKey] || MOCK_DIMENSION_SCORES.FET;
    
    // 計算未來力分數 (營收成長率 + 營收複合年均成長率的平均)
    const futureCapabilityScore = calculateFutureCapabilityScore(processedMetrics.未來力);
    
    processedMetrics.dimension_scores = {
      營運能力: calculateDimensionScore(processedMetrics.營運能力),
      財務能力: calculateDimensionScore(processedMetrics.財務能力),
      未來力: futureCapabilityScore !== null ? futureCapabilityScore : mockScores.未來力,
      AI數位力: mockScores.AI數位力,
      ESG永續力: mockScores.ESG永續力,
      創新能力: mockScores.創新能力
    };
    
    // 計算總體分數
    processedMetrics.overall_score = calculateOverallScore(processedMetrics.dimension_scores);
    processedMetrics.score_level = getScoreLevel(processedMetrics.overall_score);
    
    return processedMetrics;
    
  } catch (error) {
    console.error('processCompanyMetrics Error:', error);
    throw error;
  }
};

/**
 * 處理比較分析資料
 */
export const processComparisonData = async (primaryTaxId, compareTaxId, fiscalYear) => {
  try {
    const [primaryMetrics, compareMetrics] = await Promise.all([
      processCompanyMetrics(primaryTaxId, fiscalYear),
      processCompanyMetrics(compareTaxId, fiscalYear)
    ]);
    
    return {
      primary: primaryMetrics,
      compare: compareMetrics,
      comparison_analysis: generateComparisonAnalysis(primaryMetrics, compareMetrics)
    };
    
  } catch (error) {
    console.error('processComparisonData Error:', error);
    throw error;
  }
};

/**
 * 生成比較分析報告
 */
export const generateComparisonAnalysis = (primaryMetrics, compareMetrics) => {
  const analysis = {
    overall_comparison: {},
    dimension_comparison: {},
    metric_comparison: {},
    recommendations: []
  };
  
  // 總體分數比較
  const primaryScore = primaryMetrics.overall_score;
  const compareScore = compareMetrics.overall_score;
  const scoreDiff = primaryScore - compareScore;
  
  analysis.overall_comparison = {
    primary_score: primaryScore,
    compare_score: compareScore,
    difference: scoreDiff,
    performance: scoreDiff > 0 ? '優於' : scoreDiff < 0 ? '劣於' : '相當',
    primary_level: primaryMetrics.score_level,
    compare_level: compareMetrics.score_level
  };
  
  // 維度比較
  Object.keys(DIMENSION_WEIGHTS).forEach(dimension => {
    const primaryDimScore = primaryMetrics.dimension_scores[dimension] || 0;
    const compareDimScore = compareMetrics.dimension_scores[dimension] || 0;
    const dimDiff = primaryDimScore - compareDimScore;
    
    analysis.dimension_comparison[dimension] = {
      primary_score: primaryDimScore,
      compare_score: compareDimScore,
      difference: dimDiff,
      performance: dimDiff > 0 ? '優於' : dimDiff < 0 ? '劣於' : '相當'
    };
  });
  
  // 指標比較
  ['營運能力', '財務能力'].forEach(dimension => {
    const primaryDimMetrics = primaryMetrics[dimension] || {};
    const compareDimMetrics = compareMetrics[dimension] || {};
    
    Object.keys(primaryDimMetrics).forEach(metricKey => {
      const primaryMetric = primaryDimMetrics[metricKey];
      const compareMetric = compareDimMetrics[metricKey];
      
      if (primaryMetric && compareMetric) {
        const scoreDiff = primaryMetric.score - compareMetric.score;
        
        analysis.metric_comparison[metricKey] = {
          name: primaryMetric.name,
          dimension,
          primary_value: primaryMetric.value,
          compare_value: compareMetric.value,
          primary_score: primaryMetric.score,
          compare_score: compareMetric.score,
          difference: scoreDiff,
          performance: scoreDiff > 0 ? '優於' : scoreDiff < 0 ? '劣於' : '相當'
        };
      }
    });
  });
  
  // 生成建議
  analysis.recommendations = generateRecommendations(analysis);
  
  return analysis;
};

/**
 * 生成改善建議
 */
export const generateRecommendations = (analysis) => {
  const recommendations = [];
  
  // 基於總體表現給建議
  if (analysis.overall_comparison.difference < -10) {
    recommendations.push({
      type: 'overall',
      priority: 'high',
      message: '整體表現有待提升，建議重點關注財務能力和營運效率'
    });
  }
  
  // 基於維度表現給建議
  Object.entries(analysis.dimension_comparison).forEach(([dimension, comparison]) => {
    if (comparison.difference < -5) {
      recommendations.push({
        type: 'dimension',
        priority: 'medium',
        dimension,
        message: `${dimension}表現落後，建議加強相關指標管理`
      });
    }
  });
  
  // 基於具體指標給建議
  Object.entries(analysis.metric_comparison).forEach(([metricKey, comparison]) => {
    if (comparison.difference < -10) {
      recommendations.push({
        type: 'metric',
        priority: 'high',
        metric: comparison.name,
        dimension: comparison.dimension,
        message: `${comparison.name}表現明顯落後，需要立即改善`
      });
    }
  });
  
  return recommendations;
};

/**
 * 將處理後的資料轉換為雷達圖格式
 */
export const formatRadarChartData = (companyMetrics) => {
  const radarData = [];
  
  // 提取六大維度的分數
  Object.entries(companyMetrics.dimension_scores || {}).forEach(([dimension, score]) => {
    radarData.push({
      dimension,
      score: Math.round(score * 100) / 100, // 保留兩位小數
      fullMark: 100
    });
  });
  
  return radarData;
};

/**
 * 將比較資料轉換為雷達圖格式
 */
export const formatComparisonRadarData = (primaryMetrics, compareMetrics) => {
  const radarData = [];
  
  Object.keys(DIMENSION_WEIGHTS).forEach(dimension => {
    const primaryScore = primaryMetrics.dimension_scores[dimension] || 0;
    const compareScore = compareMetrics.dimension_scores[dimension] || 0;
    
    radarData.push({
      dimension,
      主要公司: Math.round(primaryScore * 100) / 100,
      比較公司: Math.round(compareScore * 100) / 100,
      fullMark: 100
    });
  });
  
  return radarData;
};

/**
 * 驗證計算結果
 */
export const validateCalculationResults = (metrics) => {
  const errors = [];
  
  // 檢查分數範圍
  Object.values(metrics.dimension_scores || {}).forEach((score, index) => {
    if (score < 0 || score > 100) {
      errors.push(`Dimension score ${index} out of range: ${score}`);
    }
  });
  
  if (metrics.overall_score < 0 || metrics.overall_score > 100) {
    errors.push(`Overall score out of range: ${metrics.overall_score}`);
  }
  
  return errors;
};

/**
 * 獲取完整的企業評估報告
 */
export const generateCompanyReport = async (taxId, fiscalYear) => {
  try {
    const metrics = await processCompanyMetrics(taxId, fiscalYear);
    const validationErrors = validateCalculationResults(metrics);
    
    if (validationErrors.length > 0) {
      console.warn('Validation warnings:', validationErrors);
    }
    
    return {
      ...metrics,
      radar_data: formatRadarChartData(metrics),
      validation_errors: validationErrors,
      generated_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('generateCompanyReport Error:', error);
    throw error;
  }
};