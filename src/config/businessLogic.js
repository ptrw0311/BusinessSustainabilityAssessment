// src/config/businessLogic.js
// 企業永續性評估 - 商業邏輯配置

/**
 * 雷達圖六大維度配置
 */
export const RADAR_DIMENSIONS = {
  營運能力: 'operational_capability',
  財務能力: 'financial_capability', 
  未來力: 'future_capability',
  AI數位力: 'ai_digital_capability',
  ESG永續力: 'esg_sustainability',
  創新能力: 'innovation_capability'
};

/**
 * 營運能力指標配置
 */
export const OPERATIONAL_METRICS = {
  inventory_turnover: {
    name: '存貨週轉率',
    weight: 0.25, // 在營運能力中的權重
    benchmark: 6, // 行業標準值
    maxScore: 85, // 最高分數
    calculation: {
      formula: 'operating_costs_total / avg_inventory',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        operating_costs_total: 'pl_income_basics.operating_costs_total',
        current_inventory: 'f_current.inventory',
        previous_inventory: 'f_previous.inventory'
      }
    },
    scoring: {
      method: 'ratio_benchmark',
      formula: '(value / benchmark) * maxScore',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if avg_inventory = 0 then score = 0',
        'if score > 100 then score = 100',
        'if score < 0 then score = 0'
      ]
    }
  },
  receivables_turnover: {
    name: '應收帳款週轉率',
    weight: 0.25, // 在營運能力中的權重
    benchmark: 12, // 行業標準值
    maxScore: 85, // 最高分數
    calculation: {
      formula: 'revenue / avg_accounts_receivable',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        revenue: 'pl_income_basics.revenue',
        current_receivables: 'f_current.accounts_receivable',
        previous_receivables: 'f_previous.accounts_receivable'
      }
    },
    scoring: {
      method: 'ratio_benchmark',
      formula: '(value / benchmark) * maxScore',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if avg_accounts_receivable = 0 then score = 0',
        'if score > 100 then score = 100',
        'if score < 0 then score = 0'
      ]
    }
  }
};

/**
 * 財務能力指標配置
 */
export const FINANCIAL_METRICS = {
  roe: {
    name: '股東權益報酬率(ROE)',
    weight: 0.3, // 在財務能力中的權重
    calculation: {
      formula: 'net_income / avg_total_equity',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        net_income: 'pl_income_basics.net_income',
        current_equity: 'f_current.total_equity',
        previous_equity: 'f_previous.total_equity'
      }
    },
    scoring: {
      method: 'segmented_scoring',
      segments: [
        {
          condition: 'roe < 0',
          scoreRange: { min: 0, max: 25 },
          formula: '0 + (25 - 0) * MIN(ABS(roe) / 10.0, 1.0)'
        },
        {
          condition: '0 <= roe <= 0.15',
          scoreRange: { min: 50, max: 83 },
          formula: '50 + (83 - 50) * (roe / 0.15)'
        },
        {
          condition: 'roe > 0.15',
          scoreRange: { min: 83, max: 100 },
          formula: '83 + (100 - 83) * MIN((roe - 0.15) / 0.15, 1.0)'
        }
      ],
      specialRules: [
        'if avg_total_equity <= 0 then score = NULL'
      ]
    }
  }
};

/**
 * 維度權重配置
 */
export const DIMENSION_WEIGHTS = {
  營運能力: 0.20,
  財務能力: 0.25,
  未來力: 0.15,
  AI數位力: 0.15,
  ESG永續力: 0.15,
  創新能力: 0.10
};

/**
 * 虚擬維度分數 (未來實作的維度使用固定分數)
 */
export const MOCK_DIMENSION_SCORES = {
  FET: {
    未來力: 68,
    AI數位力: 82,
    ESG永續力: 75,
    創新能力: 65
  },
  TSMC: {
    未來力: 85,
    AI數位力: 88,
    ESG永續力: 85,
    創新能力: 90
  },
  TWM: {
    未來力: 62,
    AI數位力: 75,
    ESG永續力: 82,
    創新能力: 63
  },
  FOXCONN: {
    未來力: 78,
    AI數位力: 85,
    ESG永續力: 70,
    創新能力: 82
  }
};

/**
 * 評分等級配置
 */
export const SCORE_LEVELS = {
  優異: { min: 90, max: 100, color: '#4CAF50', icon: '🏆' },
  良好: { min: 75, max: 89, color: '#8BC34A', icon: '👍' },
  一般: { min: 60, max: 74, color: '#FFC107', icon: '⚖️' },
  待改善: { min: 40, max: 59, color: '#FF9800', icon: '⚠️' },
  風險: { min: 0, max: 39, color: '#F44336', icon: '🚨' }
};

/**
 * 測試公司配置
 */
export const COMPANIES = {
  FET: {
    name: '遠傳電信',
    taxId: '97179430',
    ticker: 'FET'
  },
  TSMC: {
    name: '台積電 TSMC',
    taxId: '03540099',
    ticker: 'TSM'
  },
  TWM: {
    name: '台灣大哥大',
    taxId: '97176270', 
    ticker: 'TWM'
  },
  FOXCONN: {
    name: '富鴻網',
    taxId: '24566673',
    ticker: 'FOXCONN'
  }
};

/**
 * 預設查詢參數
 */
export const DEFAULT_QUERY_PARAMS = {
  fiscal_year: '2024',
  tax_id: '97179430' // 遠傳電信
};

/**
 * 獲取指標配置
 */
export const getMetricConfig = (dimension, metricKey) => {
  const dimensionMetrics = {
    營運能力: OPERATIONAL_METRICS,
    財務能力: FINANCIAL_METRICS,
    // 可擴展其他維度...
  };
  
  return dimensionMetrics[dimension]?.[metricKey];
};

/**
 * 獲取維度所有指標
 */
export const getDimensionMetrics = (dimension) => {
  const dimensionMetrics = {
    營運能力: OPERATIONAL_METRICS,
    財務能力: FINANCIAL_METRICS,
    // 可擴展其他維度...
  };
  
  return dimensionMetrics[dimension] || {};
};

/**
 * 獲取公司資訊
 */
export const getCompanyInfo = (companyKey) => {
  return COMPANIES[companyKey];
};

/**
 * 根據分數獲取評級
 */
export const getScoreLevel = (score) => {
  for (const [level, config] of Object.entries(SCORE_LEVELS)) {
    if (score >= config.min && score <= config.max) {
      return {
        level,
        ...config
      };
    }
  }
  return SCORE_LEVELS.風險; // 預設返回風險等級
};

/**
 * 計算維度總分
 */
export const calculateDimensionScore = (metrics) => {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [metricKey, metricValue] of Object.entries(metrics)) {
    const config = getMetricConfig('營運能力', metricKey) || getMetricConfig('財務能力', metricKey);
    if (config && metricValue.score !== null) {
      totalScore += metricValue.score * config.weight;
      totalWeight += config.weight;
    }
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
};

/**
 * 計算總體評分
 */
export const calculateOverallScore = (dimensionScores) => {
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [dimension, score] of Object.entries(dimensionScores)) {
    const weight = DIMENSION_WEIGHTS[dimension];
    if (weight && score !== null) {
      totalScore += score * weight;
      totalWeight += weight;
    }
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0;
};