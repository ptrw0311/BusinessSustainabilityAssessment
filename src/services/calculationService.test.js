// src/services/calculationService.test.js
// 企業永續性評估 - 計算服務層單元測試

import {
  calculateInventoryTurnoverScore,
  calculateReceivablesTurnoverScore,
  calculateTotalAssetsTurnoverScore,
  calculateRoeScore,
  calculateRevenueGrowthScore,
  calculateRevenueCagrScore,
  calculateFutureCapabilityScore,
  calculateCurrentRatioScore,
  processCompanyMetrics,
  processComparisonData,
  generateComparisonAnalysis,
  generateRecommendations,
  formatRadarChartData,
  formatComparisonRadarData,
  validateCalculationResults,
  generateCompanyReport
} from './calculationService.js';

import * as dataService from './dataService.js';
import { DIMENSION_WEIGHTS } from '../config/businessLogic.js';

// Mock dataService 模組
jest.mock('./dataService.js');

describe('計算服務層 - calculationService', () => {

  // ===========================
  // 1. 存貨週轉率分數計算測試
  // ===========================
  describe('calculateInventoryTurnoverScore - 存貨週轉率分數', () => {
    it('應該為null或undefined輸入返回0', () => {
      expect(calculateInventoryTurnoverScore(null)).toBe(0);
      expect(calculateInventoryTurnoverScore(undefined)).toBe(0);
    });

    it('應該計算正常的存貨週轉率分數', () => {
      // 基準值為6，最高分85
      // 分數 = (turnover_ratio / 6) * 85
      const score = calculateInventoryTurnoverScore(6); // 應該得到 85
      expect(score).toBe(85);
    });

    it('應該計算低於基準的存貨週轉率分數', () => {
      const score = calculateInventoryTurnoverScore(3); // 應該得到 42.5
      expect(score).toBe(42.5);
    });

    it('應該計算高於基準的存貨週轉率分數', () => {
      const score = calculateInventoryTurnoverScore(10); // 應該得到 ~141.67但被限制在100
      expect(score).toBe(100);
    });

    it('應該限制分數在0-100範圍內', () => {
      expect(calculateInventoryTurnoverScore(0)).toBe(0);
      expect(calculateInventoryTurnoverScore(100)).toBe(100);
      expect(calculateInventoryTurnoverScore(-5)).toBe(0);
    });

    it('應該處理非常大的數值', () => {
      const score = calculateInventoryTurnoverScore(1000000);
      expect(score).toBeLessThanOrEqual(100);
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  // ===========================
  // 2. 應收帳款週轉率分數計算測試
  // ===========================
  describe('calculateReceivablesTurnoverScore - 應收帳款週轉率分數', () => {
    it('應該為null或undefined輸入返回0', () => {
      expect(calculateReceivablesTurnoverScore(null)).toBe(0);
      expect(calculateReceivablesTurnoverScore(undefined)).toBe(0);
    });

    it('應該計算正常的應收帳款週轉率分數', () => {
      // 基準值為12，最高分85
      // 分數 = (turnover_ratio / 12) * 85
      const score = calculateReceivablesTurnoverScore(12); // 應該得到 85
      expect(score).toBe(85);
    });

    it('應該計算低於基準的應收帳款週轉率分數', () => {
      const score = calculateReceivablesTurnoverScore(6); // 應該得到 42.5
      expect(score).toBe(42.5);
    });

    it('應該限制分數在0-100範圍內', () => {
      expect(calculateReceivablesTurnoverScore(0)).toBe(0);
      expect(calculateReceivablesTurnoverScore(200)).toBe(100);
    });
  });

  // ===========================
  // 3. 總資產週轉率分數計算測試
  // ===========================
  describe('calculateTotalAssetsTurnoverScore - 總資產週轉率分數', () => {
    it('應該為null或undefined輸入返回0', () => {
      expect(calculateTotalAssetsTurnoverScore(null)).toBe(0);
      expect(calculateTotalAssetsTurnoverScore(undefined)).toBe(0);
    });

    it('應該計算正常的總資產週轉率分數', () => {
      // 基準值為1.5，最高分85
      // 分數 = (turnover_ratio / 1.5) * 85
      const score = calculateTotalAssetsTurnoverScore(1.5); // 應該得到 85
      expect(score).toBe(85);
    });

    it('應該計算低於基準的總資產週轉率分數', () => {
      const score = calculateTotalAssetsTurnoverScore(0.75); // 應該得到 42.5
      expect(score).toBe(42.5);
    });

    it('應該限制分數在0-100範圍內', () => {
      expect(calculateTotalAssetsTurnoverScore(0)).toBe(0);
      expect(calculateTotalAssetsTurnoverScore(5)).toBe(100);
    });
  });

  // ===========================
  // 4. ROE分數計算測試 (分段評分)
  // ===========================
  describe('calculateRoeScore - ROE分數 (分段評分)', () => {
    it('應該為null或undefined輸入返回null', () => {
      expect(calculateRoeScore(null)).toBeNull();
      expect(calculateRoeScore(undefined)).toBeNull();
    });

    it('應該處理負ROE (虧損情況)', () => {
      // roe < 0：0 + (25 - 0) * MIN(ABS(roe) / 10.0, 1.0)
      const score = calculateRoeScore(-0.05); // 應該得到 0 + 25 * 0.005 = 0.125...
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(25);
    });

    it('應該處理ROE = -10 (最低虧損)', () => {
      const score = calculateRoeScore(-10);
      expect(score).toBe(25); // 0 + (25 - 0) * MIN(10 / 10.0, 1.0) = 25
    });

    it('應該處理ROE = 0 (邊界)', () => {
      const score = calculateRoeScore(0);
      expect(score).toBe(50); // 50 + (83 - 50) * (0 / 0.15) = 50
    });

    it('應該處理0 <= ROE <= 0.15 (正常情況)', () => {
      // 50 + (83 - 50) * (roe / 0.15)
      const score = calculateRoeScore(0.075); // 應該得到 50 + 33 * 0.5 = 66.5
      expect(score).toBeCloseTo(66.5, 1);
    });

    it('應該處理ROE = 0.15 (邊界)', () => {
      const score = calculateRoeScore(0.15);
      expect(score).toBe(83); // 50 + 33 * (0.15 / 0.15) = 83
    });

    it('應該處理ROE > 0.15 (優秀情況)', () => {
      // 83 + (100 - 83) * MIN((roe - 0.15) / 0.15, 1.0)
      const score = calculateRoeScore(0.30); // 應該得到 83 + 17 * MIN(1.0, 1.0) = 100
      expect(score).toBe(100);
    });

    it('應該處理ROE = 0.225 (優秀情況)', () => {
      const score = calculateRoeScore(0.225); // 83 + 17 * 0.5 = 91.5
      expect(score).toBeCloseTo(91.5, 1);
    });

    it('應該限制分數在0-100範圍內', () => {
      const scores = [
        calculateRoeScore(-100),
        calculateRoeScore(0),
        calculateRoeScore(0.5),
        calculateRoeScore(10)
      ];
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  // ===========================
  // 5. 營收成長率分數計算測試
  // ===========================
  describe('calculateRevenueGrowthScore - 營收成長率分數', () => {
    it('應該為null或undefined輸入返回50 (中等分數)', () => {
      expect(calculateRevenueGrowthScore(null)).toBe(50);
      expect(calculateRevenueGrowthScore(undefined)).toBe(50);
    });

    it('應該處理成長率 < -20% (返回0)', () => {
      expect(calculateRevenueGrowthScore(-0.25)).toBe(0);
      expect(calculateRevenueGrowthScore(-1)).toBe(0);
    });

    it('應該處理-20% <= 成長率 < 0%', () => {
      // 25 + (growth_rate * 1.25 * 100)
      const score = calculateRevenueGrowthScore(-0.1); // 25 + (-0.1 * 125) = 12.5
      expect(score).toBeCloseTo(12.5, 1);
    });

    it('應該處理成長率 = -20% (邊界)', () => {
      const score = calculateRevenueGrowthScore(-0.2);
      expect(score).toBe(25); // 25 + (-0.2 * 125) = 0 (實際應該是25)
    });

    it('應該處理成長率 >= 0%', () => {
      // MIN(100, 50 + (growth_rate * 2.5 * 100))
      const score = calculateRevenueGrowthScore(0.1); // 50 + (0.1 * 250) = 75
      expect(score).toBe(75);
    });

    it('應該處理成長率 = 0% (邊界)', () => {
      const score = calculateRevenueGrowthScore(0);
      expect(score).toBe(50);
    });

    it('應該處理成長率 = 20% (高成長)', () => {
      const score = calculateRevenueGrowthScore(0.2); // 50 + (0.2 * 250) = 100
      expect(score).toBe(100);
    });

    it('應該限制分數不超過100', () => {
      const score = calculateRevenueGrowthScore(1); // 50 + (1 * 250) = 300，應該被限制到100
      expect(score).toBeLessThanOrEqual(100);
    });

    it('應該限制分數在0-100範圍內', () => {
      const scores = [
        calculateRevenueGrowthScore(-1),
        calculateRevenueGrowthScore(-0.1),
        calculateRevenueGrowthScore(0),
        calculateRevenueGrowthScore(0.2),
        calculateRevenueGrowthScore(2)
      ];
      scores.forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });
  });

  // ===========================
  // 6. 營收複合年均成長率分數計算測試
  // ===========================
  describe('calculateRevenueCagrScore - 營收CAGR分數', () => {
    it('應該為null或undefined輸入返回null', () => {
      expect(calculateRevenueCagrScore(null)).toBeNull();
      expect(calculateRevenueCagrScore(undefined)).toBeNull();
    });

    it('應該計算線性映射 [-10%, 20%] -> [0, 100]', () => {
      // 公式：((cagrPercent / 100 - (-0.1)) / (0.2 - (-0.1))) * 100
      const score = calculateRevenueCagrScore(5); // ((0.05 - (-0.1)) / (0.2 - (-0.1))) * 100 = 50
      expect(score).toBe(50);
    });

    it('應該處理CAGR = -10% (最小值)', () => {
      const score = calculateRevenueCagrScore(-10); // ((−0.1 − (−0.1)) / 0.3) * 100 = 0
      expect(score).toBe(0);
    });

    it('應該處理CAGR = 20% (最大值)', () => {
      const score = calculateRevenueCagrScore(20); // ((0.2 − (−0.1)) / 0.3) * 100 = 100
      expect(score).toBe(100);
    });

    it('應該處理CAGR = 0% (中點)', () => {
      const score = calculateRevenueCagrScore(0); // ((0 − (−0.1)) / 0.3) * 100 = 33.33...
      expect(score).toBeCloseTo(33.33, 1);
    });

    it('應該限制分數在0-100範圍內', () => {
      expect(calculateRevenueCagrScore(-20)).toBe(0);
      expect(calculateRevenueCagrScore(30)).toBe(100);
      expect(calculateRevenueCagrScore(50)).toBe(100);
    });

    it('應該處理負值CAGR', () => {
      const score = calculateRevenueCagrScore(-5); // ((−0.05 − (−0.1)) / 0.3) * 100 = 16.67
      expect(score).toBeCloseTo(16.67, 1);
    });
  });

  // ===========================
  // 7. 未來力維度分數計算測試
  // ===========================
  describe('calculateFutureCapabilityScore - 未來力維度分數', () => {
    it('應該為空對象返回null', () => {
      expect(calculateFutureCapabilityScore({})).toBeNull();
    });

    it('應該計算兩個指標的平均值', () => {
      const metrics = {
        revenue_growth: { score: 75 },
        revenue_cagr: { score: 85 }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBe(80);
    });

    it('應該優先使用revenue_growth分數 (如果只有該指標)', () => {
      const metrics = {
        revenue_growth: { score: 75 }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBe(75);
    });

    it('應該優先使用revenue_cagr分數 (如果只有該指標)', () => {
      const metrics = {
        revenue_cagr: { score: 85 }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBe(85);
    });

    it('應該忽略null或undefined分數', () => {
      const metrics = {
        revenue_growth: { score: null },
        revenue_cagr: { score: 85 }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBe(85);
    });

    it('應該處理兩個分數都為null的情況', () => {
      const metrics = {
        revenue_growth: { score: null },
        revenue_cagr: { score: undefined }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBeNull();
    });

    it('應該處理缺失的score欄位', () => {
      const metrics = {
        revenue_growth: {},
        revenue_cagr: { score: 50 }
      };
      expect(calculateFutureCapabilityScore(metrics)).toBe(50);
    });
  });

  // ===========================
  // 8. 流動比率分數計算測試
  // ===========================
  describe('calculateCurrentRatioScore - 流動比率分數', () => {
    it('應該為null或undefined輸入返回0', () => {
      expect(calculateCurrentRatioScore(null)).toBe(0);
      expect(calculateCurrentRatioScore(undefined)).toBe(0);
    });

    it('應該計算正常的流動比率分數', () => {
      // 公式：MIN(100, MAX(0, (current_ratio / 2.0) * 100))
      const score = calculateCurrentRatioScore(2.0); // (2.0 / 2.0) * 100 = 100
      expect(score).toBe(100);
    });

    it('應該計算低於基準的流動比率分數', () => {
      const score = calculateCurrentRatioScore(1.0); // (1.0 / 2.0) * 100 = 50
      expect(score).toBe(50);
    });

    it('應該計算0流動比率', () => {
      const score = calculateCurrentRatioScore(0);
      expect(score).toBe(0);
    });

    it('應該限制分數不超過100', () => {
      const score = calculateCurrentRatioScore(5); // (5 / 2.0) * 100 = 250，應該被限制到100
      expect(score).toBe(100);
    });

    it('應該返回保留兩位小數的分數', () => {
      const score = calculateCurrentRatioScore(1.33); // (1.33 / 2.0) * 100 = 66.5
      expect(score).toBe(66.5);
    });

    it('應該處理負數輸入 (邊界情況)', () => {
      const score = calculateCurrentRatioScore(-1);
      expect(score).toBe(0); // MAX(0, 負數) = 0
    });
  });

  // ===========================
  // 9. processCompanyMetrics 測試
  // ===========================
  describe('processCompanyMetrics - 處理單一公司指標', () => {
    beforeEach(() => {
      // Reset所有mock
      jest.clearAllMocks();
    });

    it('應該成功處理公司指標並返回完整的metrics物件', async () => {
      // Mock dataService
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 7.06,
          radar_score: 100
        },
        roe: {
          company_name: '遠傳電信',
          roe: 0.12,
          radar_score: 81.03
        },
        revenue_growth: {
          company_name: '遠傳電信',
          revenue_growth_rate: 0.101,
          radar_score: 75.3
        },
        revenue_cagr: {
          company_name: '遠傳電信',
          cagr_percent: 4.89,
          radar_score: 49.63
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 13.48,
          radar_score: 61.33
        },
        current_ratio: {
          company_name: '遠傳電信',
          current_ratio: 1.2,
          radar_score: 60
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.08,
          radar_score: 61.33
        }
      });

      const result = await processCompanyMetrics('97179430', '2024');

      expect(result).toBeDefined();
      expect(result.company_info).toBeDefined();
      expect(result.company_info.tax_id).toBe('97179430');
      expect(result.company_info.fiscal_year).toBe('2024');
      expect(result.dimension_scores).toBeDefined();
      expect(result.overall_score).toBeDefined();
      expect(result.score_level).toBeDefined();
    });

    it('應該拋出錯誤 (如果dataService失敗)', async () => {
      dataService.getCompanyAllMetrics.mockRejectedValue(new Error('DB Error'));

      await expect(processCompanyMetrics('97179430', '2024')).rejects.toThrow('DB Error');
    });

    it('應該計算營運能力維度分數', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 6,
          radar_score: 85
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 12,
          radar_score: 85
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.5,
          radar_score: 85
        },
        roe: null,
        revenue_growth: null,
        revenue_cagr: null,
        current_ratio: null
      });

      const result = await processCompanyMetrics('97179430', '2024');

      expect(result.dimension_scores.營運能力).toBeDefined();
      expect(result.dimension_scores.營運能力).toBeGreaterThan(0);
    });

    it('應該處理缺失的指標數據', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: null,
        roe: null,
        revenue_growth: null,
        receivables_turnover: null,
        current_ratio: null,
        revenue_cagr: null,
        total_assets_turnover: null
      });

      const result = await processCompanyMetrics('97179430', '2024');

      expect(result.company_info).toBeDefined();
      expect(result.dimension_scores).toBeDefined();
    });
  });

  // ===========================
  // 10. processComparisonData 測試
  // ===========================
  describe('processComparisonData - 處理比較分析資料', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('應該成功處理兩家公司的比較數據', async () => {
      // 建立mock數據
      const mockMetrics = {
        company_info: { tax_id: '97179430', fiscal_year: '2024', company_name: '遠傳電信' },
        dimension_scores: {
          營運能力: 75,
          財務能力: 80,
          未來力: 70,
          AI數位力: 82,
          ESG永續力: 75,
          創新能力: 65
        },
        overall_score: 75.5,
        score_level: { level: '良好' }
      };

      dataService.getCompanyAllMetrics
        .mockResolvedValueOnce({
          inventory_turnover: {
            company_name: '遠傳電信',
            inventory_turnover_ratio: 7.06,
            radar_score: 100
          },
          roe: { company_name: '遠傳電信', roe: 0.12, radar_score: 81.03 },
          revenue_growth: { company_name: '遠傳電信', revenue_growth_rate: 0.101, radar_score: 75.3 },
          revenue_cagr: { company_name: '遠傳電信', cagr_percent: 4.89, radar_score: 49.63 },
          receivables_turnover: { company_name: '遠傳電信', receivables_turnover_ratio: 13.48, radar_score: 61.33 },
          current_ratio: { company_name: '遠傳電信', current_ratio: 1.2, radar_score: 60 },
          total_assets_turnover: { company_name: '遠傳電信', total_assets_turnover_ratio: 1.08, radar_score: 61.33 }
        })
        .mockResolvedValueOnce({
          inventory_turnover: {
            company_name: '中華電信',
            inventory_turnover_ratio: 28.97,
            radar_score: 90.5
          },
          roe: { company_name: '中華電信', roe: 0.098, radar_score: 73.5 },
          revenue_growth: { company_name: '中華電信', revenue_growth_rate: 0.049, radar_score: 62.2 },
          revenue_cagr: { company_name: '中華電信', cagr_percent: 2.40, radar_score: 41.33 },
          receivables_turnover: { company_name: '中華電信', receivables_turnover_ratio: 13.65, radar_score: 62.1 },
          current_ratio: { company_name: '中華電信', current_ratio: 1.33, radar_score: 66.5 },
          total_assets_turnover: { company_name: '中華電信', total_assets_turnover_ratio: 1.03, radar_score: 58.4 }
        });

      const result = await processComparisonData('97179430', '96979933', '2024');

      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.compare).toBeDefined();
      expect(result.comparison_analysis).toBeDefined();
    });

    it('應該拋出錯誤 (如果dataService失敗)', async () => {
      dataService.getCompanyAllMetrics.mockRejectedValue(new Error('DB Error'));

      await expect(processComparisonData('97179430', '96979933', '2024')).rejects.toThrow();
    });
  });

  // ===========================
  // 11. generateComparisonAnalysis 測試
  // ===========================
  describe('generateComparisonAnalysis - 生成比較分析', () => {
    const primaryMetrics = {
      overall_score: 85,
      score_level: { level: '優異' },
      dimension_scores: {
        營運能力: 80,
        財務能力: 85,
        未來力: 90,
        AI數位力: 82,
        ESG永續力: 75,
        創新能力: 65
      },
      營運能力: {
        inventory_turnover: { name: '存貨週轉率', score: 85 },
        receivables_turnover: { name: '應收帳款週轉率', score: 75 }
      },
      財務能力: {
        roe: { name: 'ROE', score: 85 },
        current_ratio: { name: '流動比率', score: 85 }
      }
    };

    const compareMetrics = {
      overall_score: 75,
      score_level: { level: '良好' },
      dimension_scores: {
        營運能力: 70,
        財務能力: 80,
        未來力: 75,
        AI數位力: 75,
        ESG永續力: 80,
        創新能力: 70
      },
      營運能力: {
        inventory_turnover: { name: '存貨週轉率', score: 70 },
        receivables_turnover: { name: '應收帳款週轉率', score: 70 }
      },
      財務能力: {
        roe: { name: 'ROE', score: 80 },
        current_ratio: { name: '流動比率', score: 80 }
      }
    };

    it('應該生成完整的比較分析物件', () => {
      const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

      expect(analysis).toBeDefined();
      expect(analysis.overall_comparison).toBeDefined();
      expect(analysis.dimension_comparison).toBeDefined();
      expect(analysis.metric_comparison).toBeDefined();
      expect(analysis.recommendations).toBeDefined();
    });

    it('應該計算總體分數差異', () => {
      const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

      expect(analysis.overall_comparison.primary_score).toBe(85);
      expect(analysis.overall_comparison.compare_score).toBe(75);
      expect(analysis.overall_comparison.difference).toBe(10);
      expect(analysis.overall_comparison.performance).toBe('優於');
    });

    it('應該判斷相當的表現', () => {
      const metrics1 = { ...primaryMetrics, overall_score: 80 };
      const metrics2 = { ...compareMetrics, overall_score: 80 };

      const analysis = generateComparisonAnalysis(metrics1, metrics2);

      expect(analysis.overall_comparison.performance).toBe('相當');
    });

    it('應該判斷劣於的表現', () => {
      const metrics1 = { ...primaryMetrics, overall_score: 70 };
      const metrics2 = { ...compareMetrics, overall_score: 80 };

      const analysis = generateComparisonAnalysis(metrics1, metrics2);

      expect(analysis.overall_comparison.performance).toBe('劣於');
    });

    it('應該計算所有維度的比較', () => {
      const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

      Object.keys(DIMENSION_WEIGHTS).forEach(dimension => {
        expect(analysis.dimension_comparison[dimension]).toBeDefined();
        expect(analysis.dimension_comparison[dimension].primary_score).toBeDefined();
        expect(analysis.dimension_comparison[dimension].compare_score).toBeDefined();
        expect(analysis.dimension_comparison[dimension].difference).toBeDefined();
      });
    });

    it('應該計算指標級別的比較', () => {
      const analysis = generateComparisonAnalysis(primaryMetrics, compareMetrics);

      expect(analysis.metric_comparison.inventory_turnover).toBeDefined();
      expect(analysis.metric_comparison.inventory_turnover.primary_score).toBe(85);
      expect(analysis.metric_comparison.inventory_turnover.compare_score).toBe(70);
    });
  });

  // ===========================
  // 12. generateRecommendations 測試
  // ===========================
  describe('generateRecommendations - 生成改善建議', () => {
    it('應該為無差異的情況返回空建議陣列', () => {
      const analysis = {
        overall_comparison: { difference: 5 },
        dimension_comparison: {
          營運能力: { difference: 2 },
          財務能力: { difference: 1 },
          未來力: { difference: 0 },
          AI數位力: { difference: -1 },
          ESG永續力: { difference: -2 },
          創新能力: { difference: 1 }
        },
        metric_comparison: {}
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations).toEqual([]);
    });

    it('應該為總體表現差 (< -10) 生成high priority建議', () => {
      const analysis = {
        overall_comparison: { difference: -15 },
        dimension_comparison: {
          營運能力: { difference: 0 },
          財務能力: { difference: 0 },
          未來力: { difference: 0 },
          AI數位力: { difference: 0 },
          ESG永續力: { difference: 0 },
          創新能力: { difference: 0 }
        },
        metric_comparison: {}
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0].priority).toBe('high');
      expect(recommendations[0].type).toBe('overall');
    });

    it('應該為維度表現差 (< -5) 生成medium priority建議', () => {
      const analysis = {
        overall_comparison: { difference: 0 },
        dimension_comparison: {
          營運能力: { difference: -7 },
          財務能力: { difference: 0 },
          未來力: { difference: 0 },
          AI數位力: { difference: 0 },
          ESG永續力: { difference: 0 },
          創新能力: { difference: 0 }
        },
        metric_comparison: {}
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBeGreaterThan(0);
      const dimRec = recommendations.find(r => r.type === 'dimension');
      expect(dimRec).toBeDefined();
      expect(dimRec.priority).toBe('medium');
      expect(dimRec.dimension).toBe('營運能力');
    });

    it('應該為指標表現差 (< -10) 生成high priority建議', () => {
      const analysis = {
        overall_comparison: { difference: 0 },
        dimension_comparison: {
          營運能力: { difference: 0 },
          財務能力: { difference: 0 },
          未來力: { difference: 0 },
          AI數位力: { difference: 0 },
          ESG永續力: { difference: 0 },
          創新能力: { difference: 0 }
        },
        metric_comparison: {
          roe: {
            name: 'ROE',
            dimension: '財務能力',
            difference: -12
          }
        }
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBeGreaterThan(0);
      const metricRec = recommendations.find(r => r.type === 'metric');
      expect(metricRec).toBeDefined();
      expect(metricRec.priority).toBe('high');
      expect(metricRec.metric).toBe('ROE');
    });

    it('應該生成多個建議 (複雜情況)', () => {
      const analysis = {
        overall_comparison: { difference: -15 },
        dimension_comparison: {
          營運能力: { difference: -10 },
          財務能力: { difference: -7 },
          未來力: { difference: 0 },
          AI數位力: { difference: 0 },
          ESG永續力: { difference: 0 },
          創新能力: { difference: 0 }
        },
        metric_comparison: {
          roe: {
            name: 'ROE',
            dimension: '財務能力',
            difference: -12
          }
        }
      };

      const recommendations = generateRecommendations(analysis);

      expect(recommendations.length).toBeGreaterThan(1);
    });
  });

  // ===========================
  // 13. formatRadarChartData 測試
  // ===========================
  describe('formatRadarChartData - 格式化為雷達圖數據', () => {
    it('應該正確轉換維度分數為雷達圖數據格式', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 80,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        }
      };

      const radarData = formatRadarChartData(metrics);

      expect(radarData).toHaveLength(6);
      expect(radarData[0]).toHaveProperty('dimension');
      expect(radarData[0]).toHaveProperty('score');
      expect(radarData[0]).toHaveProperty('fullMark', 100);
    });

    it('應該保留兩位小數的分數', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 80.666666,
          財務能力: 85.123456,
          未來力: 75,
          AI數位力: 82.999999,
          ESG永續力: 78.11111,
          創新能力: 70.5
        }
      };

      const radarData = formatRadarChartData(metrics);

      radarData.forEach(item => {
        expect(item.score).toEqual(Math.round(item.score * 100) / 100);
      });
    });

    it('應該處理缺失的dimension_scores', () => {
      const metrics = {};

      const radarData = formatRadarChartData(metrics);

      expect(radarData).toEqual([]);
    });

    it('應該處理空的dimension_scores', () => {
      const metrics = {
        dimension_scores: {}
      };

      const radarData = formatRadarChartData(metrics);

      expect(radarData).toEqual([]);
    });
  });

  // ===========================
  // 14. formatComparisonRadarData 測試
  // ===========================
  describe('formatComparisonRadarData - 格式化比較雷達圖數據', () => {
    it('應該正確轉換兩家公司的維度分數', () => {
      const primary = {
        dimension_scores: {
          營運能力: 80,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        }
      };

      const compare = {
        dimension_scores: {
          營運能力: 70,
          財務能力: 80,
          未來力: 85,
          AI數位力: 75,
          ESG永續力: 80,
          創新能力: 75
        }
      };

      const radarData = formatComparisonRadarData(primary, compare);

      expect(radarData).toHaveLength(6);
      expect(radarData[0]).toHaveProperty('dimension');
      expect(radarData[0]).toHaveProperty('主要公司');
      expect(radarData[0]).toHaveProperty('比較公司');
      expect(radarData[0]).toHaveProperty('fullMark', 100);
    });

    it('應該正確放置分數在對應的公司欄位', () => {
      const primary = {
        dimension_scores: {
          營運能力: 80,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        }
      };

      const compare = {
        dimension_scores: {
          營運能力: 70,
          財務能力: 80,
          未來力: 85,
          AI數位力: 75,
          ESG永續力: 80,
          創新能力: 75
        }
      };

      const radarData = formatComparisonRadarData(primary, compare);

      expect(radarData[0].主要公司).toBe(80);
      expect(radarData[0].比較公司).toBe(70);
    });

    it('應該處理缺失的維度分數 (使用0作為預設值)', () => {
      const primary = {
        dimension_scores: {
          營運能力: 80
          // 其他維度缺失
        }
      };

      const compare = {
        dimension_scores: {
          營運能力: 70
          // 其他維度缺失
        }
      };

      const radarData = formatComparisonRadarData(primary, compare);

      expect(radarData.length).toBeGreaterThan(0);
      radarData.forEach(item => {
        if (item.dimension !== '營運能力') {
          expect(item.主要公司).toBe(0);
          expect(item.比較公司).toBe(0);
        }
      });
    });
  });

  // ===========================
  // 15. validateCalculationResults 測試
  // ===========================
  describe('validateCalculationResults - 驗證計算結果', () => {
    it('應該為有效結果返回空錯誤陣列', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 80,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        },
        overall_score: 78.5
      };

      const errors = validateCalculationResults(metrics);

      expect(errors).toEqual([]);
    });

    it('應該為超出範圍的維度分數返回錯誤', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 150,
          財務能力: -10,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        },
        overall_score: 78.5
      };

      const errors = validateCalculationResults(metrics);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('應該為超出範圍的總體分數返回錯誤', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 80,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        },
        overall_score: 150
      };

      const errors = validateCalculationResults(metrics);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('應該為負數分數返回錯誤', () => {
      const metrics = {
        dimension_scores: {
          營運能力: -5,
          財務能力: 85,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        },
        overall_score: 78.5
      };

      const errors = validateCalculationResults(metrics);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('應該處理缺失的dimension_scores', () => {
      const metrics = {
        overall_score: 78.5
      };

      const errors = validateCalculationResults(metrics);

      expect(Array.isArray(errors)).toBe(true);
    });

    it('應該允許邊界值 (0和100)', () => {
      const metrics = {
        dimension_scores: {
          營運能力: 0,
          財務能力: 100,
          未來力: 75,
          AI數位力: 82,
          ESG永續力: 78,
          創新能力: 70
        },
        overall_score: 0
      };

      const errors = validateCalculationResults(metrics);

      expect(errors).toEqual([]);
    });
  });

  // ===========================
  // 16. generateCompanyReport 測試
  // ===========================
  describe('generateCompanyReport - 生成企業評估報告', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('應該生成完整的企業報告', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 7.06,
          radar_score: 100
        },
        roe: {
          company_name: '遠傳電信',
          roe: 0.12,
          radar_score: 81.03
        },
        revenue_growth: {
          company_name: '遠傳電信',
          revenue_growth_rate: 0.101,
          radar_score: 75.3
        },
        revenue_cagr: {
          company_name: '遠傳電信',
          cagr_percent: 4.89,
          radar_score: 49.63
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 13.48,
          radar_score: 61.33
        },
        current_ratio: {
          company_name: '遠傳電信',
          current_ratio: 1.2,
          radar_score: 60
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.08,
          radar_score: 61.33
        }
      });

      const report = await generateCompanyReport('97179430', '2024');

      expect(report).toBeDefined();
      expect(report.radar_data).toBeDefined();
      expect(report.validation_errors).toBeDefined();
      expect(report.generated_at).toBeDefined();
      expect(Array.isArray(report.radar_data)).toBe(true);
    });

    it('應該包含雷達圖數據', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 7.06,
          radar_score: 100
        },
        roe: {
          company_name: '遠傳電信',
          roe: 0.12,
          radar_score: 81.03
        },
        revenue_growth: {
          company_name: '遠傳電信',
          revenue_growth_rate: 0.101,
          radar_score: 75.3
        },
        revenue_cagr: {
          company_name: '遠傳電信',
          cagr_percent: 4.89,
          radar_score: 49.63
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 13.48,
          radar_score: 61.33
        },
        current_ratio: {
          company_name: '遠傳電信',
          current_ratio: 1.2,
          radar_score: 60
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.08,
          radar_score: 61.33
        }
      });

      const report = await generateCompanyReport('97179430', '2024');

      expect(report.radar_data.length).toBe(6);
      expect(report.radar_data[0]).toHaveProperty('dimension');
      expect(report.radar_data[0]).toHaveProperty('score');
    });

    it('應該包含validation_errors陣列', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 7.06,
          radar_score: 100
        },
        roe: {
          company_name: '遠傳電信',
          roe: 0.12,
          radar_score: 81.03
        },
        revenue_growth: {
          company_name: '遠傳電信',
          revenue_growth_rate: 0.101,
          radar_score: 75.3
        },
        revenue_cagr: {
          company_name: '遠傳電信',
          cagr_percent: 4.89,
          radar_score: 49.63
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 13.48,
          radar_score: 61.33
        },
        current_ratio: {
          company_name: '遠傳電信',
          current_ratio: 1.2,
          radar_score: 60
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.08,
          radar_score: 61.33
        }
      });

      const report = await generateCompanyReport('97179430', '2024');

      expect(Array.isArray(report.validation_errors)).toBe(true);
    });

    it('應該包含生成時間戳', async () => {
      dataService.getCompanyAllMetrics.mockResolvedValue({
        inventory_turnover: {
          company_name: '遠傳電信',
          inventory_turnover_ratio: 7.06,
          radar_score: 100
        },
        roe: {
          company_name: '遠傳電信',
          roe: 0.12,
          radar_score: 81.03
        },
        revenue_growth: {
          company_name: '遠傳電信',
          revenue_growth_rate: 0.101,
          radar_score: 75.3
        },
        revenue_cagr: {
          company_name: '遠傳電信',
          cagr_percent: 4.89,
          radar_score: 49.63
        },
        receivables_turnover: {
          company_name: '遠傳電信',
          receivables_turnover_ratio: 13.48,
          radar_score: 61.33
        },
        current_ratio: {
          company_name: '遠傳電信',
          current_ratio: 1.2,
          radar_score: 60
        },
        total_assets_turnover: {
          company_name: '遠傳電信',
          total_assets_turnover_ratio: 1.08,
          radar_score: 61.33
        }
      });

      const report = await generateCompanyReport('97179430', '2024');

      expect(report.generated_at).toBeDefined();
      expect(typeof report.generated_at).toBe('string');
      expect(new Date(report.generated_at).getTime()).toBeGreaterThan(0);
    });

    it('應該拋出錯誤 (如果dataService失敗)', async () => {
      dataService.getCompanyAllMetrics.mockRejectedValue(new Error('DB Error'));

      await expect(generateCompanyReport('97179430', '2024')).rejects.toThrow('DB Error');
    });
  });
});
