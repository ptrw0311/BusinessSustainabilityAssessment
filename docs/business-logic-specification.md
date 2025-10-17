# 企業永續評估指標規格文件

## 📋 文件概述

本文件定義企業永續性評估平台的雷達圖指標計算邏輯，包含商業公式、PostgreSQL查詢語法及評分標準。

**版本：** 1.2
**更新日期：** 2025-10-14
**適用範圍：** 雷達圖六大維度指標計算及用戶體驗優化

---

## 🎯 雷達圖維度：營運能力

### 指標1：存貨週轉率

**商業邏輯：**
- **計算公式：** 存貨週轉率 = 營業成本合計 ÷ 平均存貨
- **平均存貨：** (當年度存貨 + 前一年度存貨) ÷ 2
- **評分邏輯：** (週轉率 ÷ 基準值6) × 85分
- **分數範圍：** 0-100分
- **維度權重：** 佔營運能力 25%

**資料來源：**
- 營業成本合計：`pl_income_basics.operating_costs_total`
- 當年度存貨：`financial_basics.inventory`
- 前一年度存貨：`financial_basics.inventory` (前一年度)

**PostgreSQL查詢語法：**
```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    
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
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85 > 100 THEN 100
        WHEN (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85 < 0 THEN 0
        ELSE (pl.operating_costs_total::NUMERIC / ((f_current.inventory + COALESCE(f_previous.inventory, 0))::NUMERIC / 2.0)) / 6 * 85
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
    pl.fiscal_year = :fiscal_year
    AND pl.tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'97179430' 遠傳電信)

**預期結果欄位：**
- `inventory_turnover_ratio` - 存貨週轉率數值
- `radar_score` - 雷達圖標準化分數 (0-100)

**評分標準：**
- **基準值：** 6 (週轉6次視為標準)
- **最高分：** 85分
- **特殊處理：** 存貨為0時給0分，分數上限100分、下限0分

---

### 指標2：應收帳款週轉率

**商業邏輯：**
- **計算公式：** 應收帳款週轉率 = 營業收入合計 ÷ 平均應收帳款
- **平均應收帳款：** (當年度應收帳款 + 前一年度應收帳款) ÷ 2
- **應收帳款組成：** 應收票據淨額 + 應收帳款淨額 + 應收帳款-關係人淨額
- **評分邏輯：** (週轉率 ÷ 基準值12) × 85分
- **分數範圍：** 0-100分
- **維度權重：** 佔營運能力 25%

**資料來源：**
- 營業收入合計：`pl_income_basics.operating_revenue_total`
- 應收票據淨額：`financial_basics.notes_receivable_net`
- 應收帳款淨額：`financial_basics.ar_net`
- 應收帳款-關係人淨額：`financial_basics.ar_related_net`

**PostgreSQL查詢語法：**
```sql
SELECT
    -- 年度
    pl.fiscal_year,
    -- 公司名稱
    pl.company_name,
    -- 統一編號
    pl.tax_id,

    -- 當年度營業收入合計
    pl.operating_revenue_total,

    -- 當年度 應收帳款
    COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0) as current_ar,

    -- 前一年度 應收帳款 (可能為 NULL，因此稍後會用 COALESCE 處理)
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0) as previous_year_ar,

    -- 平均 應收帳款 = (當年度應收帳款 + 前一年應收帳款) / 2
    -- 若前一年為 NULL，則以 0 代替，避免錯誤
    (COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0 as avg_ar,

    -- 應收帳款週轉率 = 營業收入合計 ÷ 平均應收帳款
    -- 當分母為 0 時，回傳 NULL 避免錯誤
    CASE 
        WHEN COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0) > 0 
        THEN pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)
        ELSE NULL 
    END AS ar_turnover_ratio,

    -- 雷達圖分數轉換（標準化）
    -- 應收帳款週轉率 ÷ 12（基準標準）× 85，加權為 85 分
    -- 若結果 > 100，回傳 100；若 < 0，回傳 0；否則回傳結果
    CASE 
        WHEN (COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0)) = 0 THEN 0  -- 分母為 0，直接設 0 分
        WHEN (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / 12 * 85 > 100 THEN 100
        WHEN (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / 12 * 85 < 0 THEN 0
        ELSE (pl.operating_revenue_total::NUMERIC / ((COALESCE(f_current.notes_receivable_net,0) + COALESCE(f_current.ar_net,0) + COALESCE(f_current.ar_related_net,0)+
    COALESCE(f_previous.notes_receivable_net,0) + COALESCE(f_previous.ar_net,0) + COALESCE(f_previous.ar_related_net,0))::NUMERIC/2.0)) / 12 * 85
    END AS radar_score

-- 🔗 主表：損益表 (營業收入來自這裡)
FROM public.pl_income_basics pl
-- 內聯接當年度資產負債表（抓當年度應收帳款）
INNER JOIN public.financial_basics f_current 
    ON pl.tax_id = f_current.tax_id 
    AND pl.fiscal_year = f_current.fiscal_year

-- 左聯接前一年度資產負債表（抓前一年應收帳款）
LEFT JOIN public.financial_basics f_previous 
    ON pl.tax_id = f_previous.tax_id 
    AND f_previous.fiscal_year = (pl.fiscal_year::INTEGER - 1)::TEXT

-- 篩選條件：僅查詢指定年度和公司資料
WHERE
    pl.fiscal_year = :fiscal_year
    AND pl.tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'97179430' 遠傳電信)

**預期結果欄位：**
- `ar_turnover_ratio` - 應收帳款週轉率數值
- `radar_score` - 雷達圖標準化分數 (0-100)

**評分標準：**
- **基準值：** 12 (週轉12次視為標準)
- **最高分：** 85分
- **特殊處理：** 應收帳款為0時給0分，分數上限100分、下限0分

**實際測試數據：**
- **富鴻網 (24566673)：** radar_score = 69.52
- **遠傳電信 (97179430)：** radar_score = 61.33

---

## 💰 雷達圖維度：財務能力

### 指標3：股東權益報酬率 (ROE)

**商業邏輯：**
- **計算公式：** ROE = 本期淨利(淨損) ÷ 平均權益總額
- **平均權益總額：** (當年度權益總額 + 前一年度權益總額) ÷ 2
- **評分邏輯：** 分段評分制
  - ROE < 0：0-25分 (依虧損程度)
  - 0 ≤ ROE ≤ 15%：50-83分 (線性增長)
  - ROE > 15%：83-100分 (超優表現)
- **維度權重：** 佔財務能力 30%

**資料來源：**
- 本期淨利：`pl_income_basics.net_income`
- 當年度權益總額：`financial_basics.total_equity`
- 前一年度權益總額：`financial_basics.total_equity` (前一年度)

**PostgreSQL查詢語法：**
```sql
SELECT 
    '財務能力' AS core_competence,
    'ROE' AS indicator_name,
    pl.fiscal_year,
    pl.company_name,
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
    pl.fiscal_year = :fiscal_year 
    AND pl.tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'97179430' 遠傳電信)

**預期結果欄位：**
- `roe` - ROE 百分比數值
- `radar_score` - 雷達圖標準化分數 (0-100)

**評分標準：**
- **優秀基準：** ROE ≥ 15% (可獲得83分以上)
- **及格基準：** ROE ≥ 0% (可獲得50分以上)
- **虧損處理：** ROE < 0% (最高25分，依虧損程度遞減)
- **分數範圍：** 0-100分

---

### 指標4：流動比率

**商業邏輯：**
- **計算公式：** 流動比率 = 流動資產合計 ÷ 流動負債合計
- **流動資產組成：** 現金及約當現金 + 透過損益按公允價值衡量之金融資產-流動 + 透過其他綜合損益按公允價值衡量之金融資產-流動 + 按攤銷後成本衡量之金融資產-流動 + 避險之金融資產-流動 + 合約資產-流動 + 應收票據淨額 + 應收帳款淨額 + 應收帳款-關係人淨額 + 其他應收款淨額 + 存貨
- **流動負債組成：** 其他非流動資產 + 非流動資產合計 + 資產總額 + 預付設備款 + 存出保證金 + 短期借款 + 應付短期票券 + 避險之金融負債-流動 + 合約負債-流動 + 應付票據 + 應付帳款
- **評分邏輯：** 以2.0為基準，線性計算0-100分
  - 計算公式：MIN(100, MAX(0, (流動比率 / 2.0) × 100))
- **分數範圍：** 0-100分
- **維度權重：** 佔財務能力權重待定
- **指標意義：** 流動比率衡量企業短期償債能力，比率越高代表短期償債能力越強

**資料來源：**
- 所有流動資產科目：`financial_basics` 表相關欄位
- 所有流動負債科目：`financial_basics` 表相關欄位

**PostgreSQL查詢語法：**
```sql
-- 流動比率查詢
-- 流動比率 = 流動資產合計 / 流動負債合計
-- 雷達圖分數轉換（標準化）= MIN(100, MAX(0, (結果值/2)*100))
-- 說明：以2.0為基準，線性計算0-100分

WITH f AS (
    SELECT
        f_current.fiscal_year,
        f_current.tax_id,
        f_current.company_name,

        -- 流動資產合計
        (
            COALESCE(f_current.cash_equivalents, 0) +
            COALESCE(f_current.fvtpl_assets_current, 0) +
            COALESCE(f_current.fvoci_assets_current, 0) +
            COALESCE(f_current.amortized_assets_current, 0) +
            COALESCE(f_current.hedging_assets_current, 0) +
            COALESCE(f_current.contract_assets_current, 0) +
            COALESCE(f_current.notes_receivable_net, 0) +
            COALESCE(f_current.ar_net, 0) +
            COALESCE(f_current.ar_related_net, 0) +
            COALESCE(f_current.other_receivables_net, 0) +
            COALESCE(f_current.inventory, 0)
        ) AS total_current_assets,

        -- 流動負債合計
        (
            COALESCE(f_current.other_noncurrent_assets, 0) +
            COALESCE(f_current.total_noncurrent_assets, 0) +
            COALESCE(f_current.total_assets, 0) +
            COALESCE(f_current.prepayments_for_equip, 0) +
            COALESCE(f_current.guarantee_deposits_out, 0) +
            COALESCE(f_current.short_term_borrowings, 0) +
            COALESCE(f_current.short_term_notes_payable, 0) +
            COALESCE(f_current.hedging_liabilities_current, 0) +
            COALESCE(f_current.contract_liabilities_current, 0) +
            COALESCE(f_current.notes_payable, 0) +
            COALESCE(f_current.ap, 0)
        ) AS total_current_liabilities

    FROM public.financial_basics f_current
)

SELECT
    '財務能力' AS core_competence,
    '流動比率' AS indicator_name,
    fiscal_year,
    tax_id,
    company_name,
    total_current_assets,
    total_current_liabilities,

    -- 流動比率計算
    CASE
        WHEN total_current_liabilities = 0 THEN 0
        ELSE (total_current_assets / total_current_liabilities)::NUMERIC
    END AS current_ratio,

    -- 雷達圖分數轉換（標準化）
    -- MIN(100, MAX(0, (結果值/2)*100))
    -- 說明：以2.0為基準，線性計算0-100分
    CASE
        WHEN total_current_liabilities = 0 THEN 0
        ELSE LEAST(100, GREATEST(0, (total_current_assets / total_current_liabilities)::NUMERIC / 2 * 100))
    END AS radar_score

FROM f
WHERE fiscal_year = :fiscal_year
    AND tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'97179430' 遠傳電信)

**預期結果欄位：**
- `current_ratio` - 流動比率數值 (如 2.5 代表流動資產是流動負債的2.5倍)
- `radar_score` - 雷達圖標準化分數 (0-100)
- `total_current_assets` - 流動資產合計
- `total_current_liabilities` - 流動負債合計

**評分標準：**
- **理想基準：** 流動比率 = 2.0 (給100分)
- **及格基準：** 流動比率 = 1.0 (給50分)
- **評分公式：** (流動比率 / 2.0) × 100，上限100分，下限0分
- **特殊處理：** 流動負債為0時給0分

**評分範例：**
- 流動比率 = 2.5：(2.5 / 2.0) × 100 = 125 → 100分 (取上限)
- 流動比率 = 2.0：(2.0 / 2.0) × 100 = 100分
- 流動比率 = 1.5：(1.5 / 2.0) × 100 = 75分
- 流動比率 = 1.0：(1.0 / 2.0) × 100 = 50分
- 流動比率 = 0.5：(0.5 / 2.0) × 100 = 25分
- 流動比率 = 0.0：0分

**實作整合說明：**
- 此指標應整合至現有的財務能力維度數據載入流程
- 查詢參數 (`:fiscal_year`, `:tax_id`) 應與下拉選單連動
- 數據載入應使用與ROE相同的快取機制
- 雷達圖應同步更新顯示此新指標

---

## 🚀 雷達圖維度：未來力

### 指標3：營收成長率

**商業邏輯：**
- **計算公式：** 營收成長率 = (本期營收 - 去年營收) ÷ 去年營收
- **評分邏輯：** 分段評分制
  - 成長率 < -20%：0分 (嚴重衰退)
  - -20% ≤ 成長率 < 0%：25-50分 (輕微衰退，線性計分)
  - 成長率 ≥ 0%：50-100分 (正成長，線性增長至上限)
- **分數範圍：** 0-100分
- **維度權重：** 佔未來力 35%

**資料來源：**
- 本期營收：`pl_income_basics.operating_revenue_total` (當年度)
- 去年營收：`pl_income_basics.operating_revenue_total` (前一年度)

**PostgreSQL查詢語法：**
```sql
SELECT 
    '未來力' AS core_competence,
    '營收成長率' AS indicator_name,
    pl_current.fiscal_year,
    pl_current.company_name,
    pl_current.operating_revenue_total AS current_operating_revenue_total,
    pl_previous.operating_revenue_total AS previous_operating_revenue_total,

    -- 營收成長率計算
    CASE 
        WHEN COALESCE(pl_previous.operating_revenue_total, 0) > 0 
        THEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total
        ELSE NULL 
    END AS revenue_growth_rate,

    -- 雷達圖分數計算
    CASE 
        WHEN COALESCE(pl_previous.operating_revenue_total, 0) <= 0 THEN NULL
        ELSE 
            CASE 
                -- 成長率 < -20%：0分
                WHEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total < -0.2 THEN 
                    0
                -- -20% ≤ 成長率 < 0%：25-50分線性計分
                WHEN (pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total < 0 THEN 
                    25 + ((pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total) * 1.25 * 100
                -- 成長率 ≥ 0%：50-100分線性增長
                ELSE 
                    LEAST(100, 50 + ((pl_current.operating_revenue_total - pl_previous.operating_revenue_total)::NUMERIC / pl_previous.operating_revenue_total) * 2.5 * 100)
            END
    END AS radar_score

FROM public.pl_income_basics pl_current
LEFT JOIN public.pl_income_basics pl_previous 
    ON pl_current.tax_id = pl_previous.tax_id 
    AND pl_previous.fiscal_year = (pl_current.fiscal_year::INTEGER - 1)
WHERE pl_current.fiscal_year = :fiscal_year 
    AND pl_current.tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'24566673' 富鴻網)

**預期結果欄位：**
- `revenue_growth_rate` - 營收成長率數值 (小數，如0.15代表15%成長)
- `radar_score` - 雷達圖標準化分數 (0-100)

**評分標準詳解：**
- **基準線：** 0%成長給50分
- **正成長獎勵：** 每1%成長加2.5分，最高100分
- **衰退懲罰：** 輕微衰退(-20%~0%)給25-50分線性遞減
- **嚴重衰退：** 超過-20%衰退直接給0分
- **特殊處理：** 去年營收為0或負值時回傳NULL

**評分範例：**
- 成長率 +20%：50 + (20 × 2.5) = 100分
- 成長率 +10%：50 + (10 × 2.5) = 75分
- 成長率 0%：50分
- 成長率 -10%：25 + (-10 × 1.25) = 37.5分
- 成長率 -20%：25 + (-20 × 1.25) = 0分
- 成長率 -30%：0分

### 指標4：營收複合年均成長率 (Revenue CAGR)

**商業邏輯：**
- **計算公式：** CAGR = (ending_value ÷ beginning_value) ^ (1 ÷ n_years) - 1
- **時間範圍：** 計算多年期間的年化複合成長率
- **評分邏輯：** 線性映射評分制
  - CAGR 範圍：-10% 到 20%
  - 評分公式：((CAGR% - (-10%)) ÷ (20% - (-10%))) × 100
  - 分數範圍：0-100分
- **維度權重：** 佔未來力 35%
- **指標意義：** 衡量企業營收長期穩定成長能力，平滑短期波動影響

**資料來源：**
- 營業收入合計：`pl_income_basics.operating_revenue_total`
- 多年期財務數據：支援任意年度區間計算

**PostgreSQL查詢語法：**
```sql
-- 營收複合年均成長率 (Revenue CAGR)
-- 計算公式：CAGR = (ending_value / beginning_value)^(1/n_years) - 1
-- 雷達圖分數轉換：線性映射到 0~100，區間 [-10%, 20%]

WITH revenue_cte AS (
    SELECT
        tax_id,
        company_name,
        fiscal_year,
        operating_revenue_total::numeric AS revenue
    FROM public.pl_income_basics
),
revenue_combinations AS (
    SELECT
        r1.tax_id,
        r1.company_name,
        r1.fiscal_year AS start_year,
        r2.fiscal_year AS end_year,
        r1.revenue AS beginning_value,
        r2.revenue AS ending_value,
        r2.fiscal_year - r1.fiscal_year AS n_years
    FROM revenue_cte r1
    JOIN revenue_cte r2
        ON r1.tax_id = r2.tax_id
       AND r1.fiscal_year < r2.fiscal_year
),
cagr_calculated AS (
    SELECT
        tax_id,
        company_name,
        start_year,
        end_year,
        n_years,
        beginning_value,
        ending_value,
        
        -- CAGR 計算：(結束值/開始值)^(1/年數) - 1
        ROUND(
            (POWER(ending_value / NULLIF(beginning_value, 0), 1.0 / n_years) - 1) * 100,
            2
        ) AS cagr_percent
    FROM revenue_combinations
    WHERE beginning_value > 0  -- 避免除零錯誤
)
SELECT
    '未來力' AS core_competence,
    '營收複合年均成長率' AS indicator_name,
    tax_id,
    company_name,
    start_year,
    end_year,
    n_years,
    beginning_value,
    ending_value,
    cagr_percent,
    
    -- 雷達分數轉換邏輯：線性映射到 0~100，區間 [-10%, 20%]
    -- 計算公式：((CAGR% - (-10%)) / (20% - (-10%))) * 100
    ROUND(
        GREATEST(0, LEAST(100, ((cagr_percent / 100.0 - (-0.1)) / (0.2 - (-0.1)) * 100))),
        2
    ) AS radar_score

FROM cagr_calculated
WHERE end_year = :fiscal_year 
    AND tax_id = :tax_id;
```

**查詢參數：**
- `:fiscal_year` - 結束會計年度 (例：'2024')
- `:tax_id` - 統一編號 (例：'24566673' 富鴻網)

**預期結果欄位：**
- `cagr_percent` - CAGR百分比數值 (如15.25代表15.25%年複合成長率)
- `radar_score` - 雷達圖標準化分數 (0-100)
- `start_year` - 計算起始年度
- `end_year` - 計算結束年度  
- `n_years` - 計算年度區間
- `beginning_value` - 起始年度營收
- `ending_value` - 結束年度營收

**評分標準詳解：**
- **優異表現：** CAGR ≥ 20% (給100分)
- **良好表現：** CAGR ≥ 10% (給約67分)
- **基準線：** CAGR = 0% (給約33分)
- **衰退表現：** CAGR ≤ -10% (給0分)
- **線性計算：** 在[-10%, 20%]區間內線性映射到[0, 100]分

**評分範例：**
- CAGR = 20%：((20/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 100分
- CAGR = 15%：((15/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 83.33分
- CAGR = 10%：((10/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 66.67分
- CAGR = 5%：((5/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 50分
- CAGR = 0%：((0/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 33.33分
- CAGR = -5%：((-5/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 16.67分
- CAGR = -10%：((-10/100 - (-0.1)) / (0.2 - (-0.1))) × 100 = 0分

**技術整合說明：**
- 查詢參數 (`:fiscal_year`, `:tax_id`) 與下拉選單連動
- 支援現有快取機制，與其他指標共用數據載入流程
- 結果格式符合雷達圖數據結構
- CTE結構支援多年期複合計算，自動選擇最佳年度區間
- 錯誤處理：beginning_value為0時自動過濾，避免計算錯誤

**實作優先級：**
- 本指標與「營收成長率」並列為未來力維度核心指標
- 建議同時顯示於雷達圖和詳細數據表格
- 可考慮提供年度區間選擇功能（如3年、5年CAGR）

---

## 📊 整體配置

### 維度權重分配
- **營運能力：** 20%
- **財務能力：** 25%
- **未來力：** 15%
- **AI數位力：** 15%
- **ESG永續力：** 15%
- **創新能力：** 10%

### 評分等級配置
- **90-100分：** 優異 (綠色、🏆圖示)
- **75-89分：** 良好 (淺綠色、👍圖示)
- **60-74分：** 一般 (黃色、⚖️圖示)
- **40-59分：** 待改善 (橘色、⚠️圖示)
- **0-39分：** 風險 (紅色、🚨圖示)

### 通用查詢參數
- **會計年度：** 2024 (可調整)
- **主要測試公司：** 遠傳電信 (統編：97179430)
- **比較公司：** 台積電、台灣大哥大等

### 資料表結構
- **主要資料表：**
  - `pl_income_basics` - 損益基本數據
  - `financial_basics` - 財務基本數據
- **連接欄位：** `tax_id` + `fiscal_year`
- **時間序列：** 支援前一年度數據比較

---

## 🔧 開發實作指引

### 1. 資料服務層實作
- 將SQL查詢封裝成可重用的函數
- 支援參數化查詢 (`:fiscal_year`, `:tax_id`)
- 處理NULL值和異常情況

### 2. 計算服務層實作
- 實作各指標的評分邏輯
- 標準化分數計算 (0-100分)
- 維度權重加總計算

### 3. 前端整合
- 雷達圖資料格式轉換
- 動態更新查詢參數
- 錯誤處理和載入狀態

---

## 📈 擴展指標範例

### 未來可新增的指標

#### 營運能力維度
- **總資產週轉率：** 營業收入 ÷ 平均總資產
- **營業利益率：** 營業利益 ÷ 營業收入
- **固定資產週轉率：** 營業收入 ÷ 平均固定資產

#### 財務能力維度
- **流動比率：** 流動資產 ÷ 流動負債
- **負債權益比：** 總負債 ÷ 股東權益
- **利息保障倍數：** 營業利益 ÷ 利息費用

### 新增指標的步驟
1. 在 `businessLogic.js` 中定義指標配置
2. 在 `sqlTemplates.js` 中新增SQL模板
3. 在 `calculationService.js` 中實作計算邏輯
4. 更新前端組件以顯示新指標

---

## 🎯 測試與驗證

### 測試案例
1. **邊界值測試：** 0值、極大值、負值處理
2. **業務邏輯驗證：** 計算公式與預期結果比對
3. **資料完整性：** 缺失資料的處理邏輯
4. **效能測試：** 大量資料查詢的響應時間

### 驗證標準
- 計算結果與手工計算一致
- 評分分布合理 (避免過度集中)
- SQL查詢效能可接受 (<2秒)
- 錯誤處理完善

---

## 🔧 系統性能優化 (v1.1 新增)

### 用戶體驗改進

#### 問題描述
原始系統在下拉選單變更時會觸發整頁重新載入，顯示「載入企業指標中...」覆蓋畫面，影響用戶體驗。

#### 解決方案
**1. 移除全局Loading狀態**
- 刪除 `metricsLoading` 全頁覆蓋檢查
- 改採局部Loading指示器機制

**2. 智能數據快取**
```javascript
// 新增快取機制
const [companyDataCache, setCompanyDataCache] = useState({});
const [loadingStates, setLoadingStates] = useState({
  selectedCompany: false,
  compareCompany: false
});
```

**3. 優化載入邏輯**
```javascript
// 支援快取的loadCompanyMetrics函數
const loadCompanyMetrics = async (companyKey, isSelectedCompany = true) => {
  // 檢查快取
  if (companyDataCache[companyKey]) {
    console.log(`使用快取數據 for ${companyKey}`);
    setCompanyMetrics(prev => ({
      ...prev,
      [companyKey]: companyDataCache[companyKey]
    }));
    return;
  }
  // 載入新數據並更新快取...
};
```

**4. 分離useEffect依賴**
```javascript
// 頁面初始載入
useEffect(() => {
  if (currentPage === 'dashboard') {
    loadCompanyMetrics(selectedCompany, true);
    loadCompanyMetrics(compareCompany, false);
  }
}, [currentPage]);

// 主要公司變更
useEffect(() => {
  if (currentPage === 'dashboard') {
    loadCompanyMetrics(selectedCompany, true);
  }
}, [selectedCompany]);

// 比較公司變更
useEffect(() => {
  if (currentPage === 'dashboard') {
    loadCompanyMetrics(compareCompany, false);
  }
}, [compareCompany]);
```

#### 技術優勢
- **即時響應：** 已載入公司數據立即顯示
- **減少API請求：** 智能快取避免重複查詢
- **穩定UI：** 頁面保持穩定，不再重新渲染
- **AJAX效果：** 各數據區塊獨立更新

#### 測試驗證
- 下拉選單變更時頁面保持穩定
- 快取命中時數據立即顯示
- 新公司載入時僅顯示局部loading
- 控制台顯示快取使用情況

---

## 📝 版本變更歷史

### v1.3 (2025-10-17)
**新增功能：**
- 新增「未來力」維度指標：營收複合年均成長率 (Revenue CAGR)
  - 計算公式：CAGR = (ending_value ÷ beginning_value) ^ (1 ÷ n_years) - 1
  - 評分標準：線性映射到0-100分，評分區間[-10%, 20%]
  - 技術特色：CTE結構支援多年期複合計算，自動選擇最佳年度區間
  - 整合說明：與下拉選單連動，支援現有快取機制與雷達圖顯示

### v1.2 (2025-10-14)
**新增功能：**
- 新增「財務能力」維度指標：流動比率 (Current Ratio)
  - 計算公式：流動資產合計 ÷ 流動負債合計
  - 評分標準：以2.0為基準，線性計算0-100分
  - 整合說明：支援下拉選單參數傳遞與快取機制

### v1.1 (2025-09-18)
**優化功能：**
- 新增系統性能優化章節
- 實作智能數據快取機制
- 移除全局Loading狀態
- 優化用戶體驗，避免整頁重新載入

### v1.0 (初始版本)
**建立指標：**
- 營運能力：存貨週轉率、應收帳款週轉率
- 財務能力：ROE股東權益報酬率
- 未來力：營收成長率

---

**備註：** 本規格文件將持續更新，新增其他維度指標時請遵循相同格式。每次更新應包含版本號和變更說明。