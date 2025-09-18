// src/config/sqlTemplates.js
// 企業永續性評估 - SQL查詢模板

/**
 * 存貨週轉率查詢模板
 */
export const INVENTORY_TURNOVER_QUERY = `
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,
    
    -- 當年度營業成本合計
    pl.operating_costs_total,
    
    -- 當年度存貨
    f_current.inventory AS current_inventory,
    
    -- 前一年度存貨 (可能為 NULL，因此稍後會用 COALESCE 處理)
    f_previous.inventory AS previous_year_inventory,
    
    -- 平均存貨 = (當年度存貨 + 前一年存貨) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0 AS avg_inventory,
    
    -- 存貨週轉率 = 營業成本合計 ÷ 平均存貨
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE 
        WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) > 0 
        THEN pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)
        ELSE NULL 
    END AS inventory_turnover_ratio,
    
    -- 雷達圖分數轉換（標準化）
    -- 存貨週轉率 ÷ 6（基準標準）× 85，加權為 85 分
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE 
        WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2 > 100 THEN 100
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2 < 0 THEN 0
        ELSE (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / $1 * $2
    END AS radar_score

-- 🔗 主表：損益表 (營業成本來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度存貨）
INNER JOIN public.financial_basics f_current 
    ON pl.tax_id = f_current.tax_id 
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年存貨）
LEFT JOIN public.financial_basics f_previous 
    ON pl.tax_id = f_previous.tax_id 
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = $3
    AND pl.tax_id = $4;
`;

/**
 * ROE (股東權益報酬率) 查詢模板
 */
export const ROE_QUERY = `
SELECT 
    '財務能力' AS core_competence,
    'ROE' AS indicator_name,
    pl.fiscal_year,
    pl.company_name,
    pl.tax_id,
    pl.net_income,
    f_current.total_equity AS current_total_equity,
    f_previous.total_equity AS previous_year_total_equity,
    (f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0 AS avg_total_equity,

    -- ROE 計算
    CASE 
        WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) > 0 
        THEN pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)
        ELSE NULL 
    END AS roe,

    -- 雷達圖分數 (依據 ROE)
    CASE 
        WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) <= 0 THEN NULL
        ELSE
            CASE 
                -- ROE < 0：虧損時給 0-25 分
                WHEN (pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) < 0 THEN
                    0 + (25 - 0) * LEAST(ABS(pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 10.0, 1.0)  -- 限制最大為25
                -- 0 ≤ ROE ≤ 15%：給 50-83 分
                WHEN (pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) <= 0.15 THEN
                    50 + (83 - 50) * ((pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 0.15)
                -- ROE > 15%：給 83-100 分
                ELSE
                    83 + (100 - 83) * LEAST(((pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) - 0.15) / 0.15, 1.0)
            END
    END AS radar_score

FROM public.pl_income_basics pl
    INNER JOIN public.financial_basics f_current 
        ON pl.tax_id = f_current.tax_id 
        AND pl.fiscal_year = f_current.fiscal_year
    LEFT JOIN public.financial_basics f_previous 
        ON pl.tax_id = f_previous.tax_id 
        AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)

WHERE 
    pl.fiscal_year = $1 
    AND pl.tax_id = $2;
`;

/**
 * 多公司多指標查詢模板 (未來擴展用)
 */
export const MULTI_COMPANY_METRICS_QUERY = `
WITH company_list AS (
    SELECT unnest($1::text[]) AS tax_id
),
metrics_data AS (
    -- 存貨週轉率數據
    SELECT 
        cl.tax_id,
        pl.company_name,
        pl.fiscal_year,
        'inventory_turnover' AS metric_name,
        CASE 
            WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) > 0 
            THEN pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)
            ELSE NULL 
        END AS metric_value,
        CASE 
            WHEN (f_current.inventory + COALESCE(f_previous.inventory, 0)) = 0 THEN 0
            WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85 > 100 THEN 100
            WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85 < 0 THEN 0
            ELSE (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85
        END AS radar_score
    FROM company_list cl
    LEFT JOIN public.pl_income_basics pl ON cl.tax_id = pl.tax_id AND pl.fiscal_year = $2
    LEFT JOIN public.financial_basics f_current ON pl.tax_id = f_current.tax_id AND pl.fiscal_year = f_current.fiscal_year
    LEFT JOIN public.financial_basics f_previous ON pl.tax_id = f_previous.tax_id AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT
    
    UNION ALL
    
    -- ROE 數據
    SELECT 
        cl.tax_id,
        pl.company_name,
        pl.fiscal_year,
        'roe' AS metric_name,
        CASE 
            WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) > 0 
            THEN pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)
            ELSE NULL 
        END AS metric_value,
        CASE 
            WHEN (f_current.total_equity + COALESCE(f_previous.total_equity, 0)) <= 0 THEN NULL
            ELSE
                CASE 
                    WHEN (pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) < 0 THEN
                        0 + (25 - 0) * LEAST(ABS(pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 10.0, 1.0)
                    WHEN (pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) <= 0.15 THEN
                        50 + (83 - 50) * ((pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) / 0.15)
                    ELSE
                        83 + (100 - 83) * LEAST(((pl.net_income::NUMERIC / ((f_current.total_equity + COALESCE(f_previous.total_equity, 0))::NUMERIC / 2.0)) - 0.15) / 0.15, 1.0)
                END
        END AS radar_score
    FROM company_list cl
    LEFT JOIN public.pl_income_basics pl ON cl.tax_id = pl.tax_id AND pl.fiscal_year = $2
    LEFT JOIN public.financial_basics f_current ON pl.tax_id = f_current.tax_id AND pl.fiscal_year = f_current.fiscal_year
    LEFT JOIN public.financial_basics f_previous ON pl.tax_id = f_previous.tax_id AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT
)
SELECT * FROM metrics_data 
WHERE tax_id IS NOT NULL
ORDER BY tax_id, metric_name;
`;

/**
 * SQL查詢模板映射
 */
export const SQL_TEMPLATES = {
  inventory_turnover: INVENTORY_TURNOVER_QUERY,
  roe: ROE_QUERY,
  multi_company_metrics: MULTI_COMPANY_METRICS_QUERY
};

/**
 * 獲取SQL模板
 */
export const getSqlTemplate = (templateName) => {
  return SQL_TEMPLATES[templateName];
};

/**
 * 格式化SQL參數
 * @param {string} templateName - 模板名稱
 * @param {object} params - 參數對象
 * @returns {array} - 參數數組
 */
export const formatSqlParams = (templateName, params) => {
  switch (templateName) {
    case 'inventory_turnover':
      return [
        params.benchmark || 6,      // $1 - 基準值
        params.maxScore || 85,      // $2 - 最高分數
        params.fiscal_year,         // $3 - 會計年度
        params.tax_id              // $4 - 統一編號
      ];
    
    case 'roe':
      return [
        params.fiscal_year,         // $1 - 會計年度
        params.tax_id              // $2 - 統一編號
      ];
      
    case 'multi_company_metrics':
      return [
        params.tax_ids,            // $1 - 公司統一編號陣列
        params.fiscal_year         // $2 - 會計年度
      ];
      
    default:
      return [];
  }
};

/**
 * 驗證SQL參數
 */
export const validateSqlParams = (templateName, params) => {
  const errors = [];
  
  switch (templateName) {
    case 'inventory_turnover':
    case 'roe':
      if (!params.fiscal_year) {
        errors.push('fiscal_year is required');
      }
      if (!params.tax_id) {
        errors.push('tax_id is required');
      }
      break;
      
    case 'multi_company_metrics':
      if (!params.tax_ids || !Array.isArray(params.tax_ids) || params.tax_ids.length === 0) {
        errors.push('tax_ids array is required');
      }
      if (!params.fiscal_year) {
        errors.push('fiscal_year is required');
      }
      break;
  }
  
  return errors;
};