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
    weight: 0.3333, // 在營運能力中的權重 (33.33%)
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
    weight: 0.3333, // 在營運能力中的權重 (33.33%)
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
  },
  total_assets_turnover: {
    name: '總資產週轉率',
    weight: 0.3334, // 在營運能力中的權重 (33.34%)
    benchmark: 1.5, // 行業標準值
    maxScore: 85, // 最高分數
    calculation: {
      formula: 'operating_revenue_total / avg_total_assets',
      tables: ['pl_income_basics', 'financial_basics'],
      fields: {
        operating_revenue_total: 'pl_income_basics.operating_revenue_total',
        current_total_assets: 'calculated from multiple asset components',
        previous_total_assets: 'calculated from multiple asset components'
      },
      asset_components: [
        'cash_and_equivalents', 'short_term_investments', 'notes_receivable',
        'accounts_receivable', 'other_receivables', 'inventory',
        'current_tax_assets', 'other_current_assets', 'non_current_assets_held_for_sale',
        'investments', 'property_plant_equipment', 'investment_property',
        'intangible_assets', 'deferred_tax_assets', 'other_non_current_assets',
        'goodwill'
      ]
    },
    scoring: {
      method: 'ratio_benchmark',
      formula: '(value / benchmark) * maxScore',
      bounds: { min: 0, max: 100 },
      specialRules: [
        'if avg_total_assets = 0 then score = 0',
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
    weight: 0.5, // 在財務能力中的權重 (與流動比率平分)
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
  },
  current_ratio: {
    name: '流動比率',
    weight: 0.5, // 在財務能力中的權重 (與ROE平分)
    calculation: {
      formula: 'total_current_assets / total_current_liabilities',
      tables: ['financial_basics'],
      fields: {
        total_current_assets: 'calculated_field',
        total_current_liabilities: 'calculated_field'
      }
    },
    scoring: {
      method: 'linear_scoring',
      benchmark: 2.0, // 以2.0為基準
      formula: 'MIN(100, MAX(0, (current_ratio / 2.0) * 100))',
      specialRules: [
        'if total_current_liabilities = 0 then score = 0'
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
 * 未來力指標配置
 */
export const FUTURE_METRICS = {
  revenue_growth: {
    name: '營收成長率',
    weight: 0.5, // 在未來力中的權重 (與CAGR平分)
    calculation: {
      formula: '(current_revenue - previous_revenue) / previous_revenue',
      tables: ['pl_income_basics'],
      fields: {
        current_revenue: 'pl_current.operating_revenue_total',
        previous_revenue: 'pl_previous.operating_revenue_total'
      }
    },
    scoring: {
      method: 'segmented_scoring',
      segments: [
        {
          condition: 'growth_rate < -0.2',
          scoreRange: { min: 0, max: 0 },
          formula: '0'
        },
        {
          condition: '-0.2 <= growth_rate < 0',
          scoreRange: { min: 25, max: 50 },
          formula: '25 + (growth_rate * 1.25 * 100)'
        },
        {
          condition: 'growth_rate >= 0',
          scoreRange: { min: 50, max: 100 },
          formula: 'MIN(100, 50 + (growth_rate * 2.5 * 100))'
        }
      ],
      specialRules: [
        'if previous_revenue <= 0 then score = NULL'
      ]
    }
  },
  revenue_cagr: {
    name: '營收複合年均成長率',
    weight: 0.5, // 在未來力中的權重 (與營收成長率平分)
    calculation: {
      formula: 'POWER(ending_value / NULLIF(beginning_value, 0), 1.0 / n_years) - 1',
      tables: ['pl_income_basics'],
      fields: {
        beginning_value: 'revenue_start.operating_revenue_total',
        ending_value: 'revenue_end.operating_revenue_total',
        n_years: 'calculated_field'
      }
    },
    scoring: {
      method: 'linear_mapping',
      range: { min: -0.1, max: 0.2 }, // -10% 到 20%
      formula: 'GREATEST(0, LEAST(100, ((cagr_percent / 100.0 - (-0.1)) / (0.2 - (-0.1)) * 100)))',
      specialRules: [
        'if beginning_value <= 0 then score = NULL',
        'filter out invalid year combinations'
      ]
    }
  }
};

/**
 * 虚擬維度分數 (未來實作的維度使用固定分數)
 */
export const MOCK_DIMENSION_SCORES = {
  FET: {
    AI數位力: 82,
    ESG永續力: 75,
    創新能力: 65
  },
  CHT: {
    AI數位力: 85,
    ESG永續力: 80,
    創新能力: 72
  },
  TWM: {
    AI數位力: 75,
    ESG永續力: 82,
    創新能力: 63
  },
  FOXCONN: {
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
  CHT: {
    name: '中華電信股份有限公司',
    taxId: '96979933',
    ticker: 'CHT'
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
    未來力: FUTURE_METRICS,
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
    未來力: FUTURE_METRICS,
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
    const config = getMetricConfig('營運能力', metricKey) || 
                   getMetricConfig('財務能力', metricKey) || 
                   getMetricConfig('未來力', metricKey);
    if (config && metricValue.score !== null && metricValue.score !== undefined) {
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