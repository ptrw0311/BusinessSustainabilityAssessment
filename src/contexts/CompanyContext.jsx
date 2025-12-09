import { createContext, useContext, useState, useCallback } from 'react';

/**
 * 公司狀態管理 Context
 * 管理公司選擇、公司數據、指標等狀態
 */
const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  // 公司選擇狀態
  const [selectedCompany, setSelectedCompany] = useState('FOXCONN');
  const [compareCompany, setCompareCompany] = useState('TWM');

  // 公司選項列表
  const [companyOptions] = useState([
    { value: 'FET', label: '遠傳電信股份有限公司', tax_id: '97179430' },
    { value: 'CHT', label: '中華電信股份有限公司', tax_id: '96979933' },
    { value: 'TWM', label: '台灣大哥大股份有限公司', tax_id: '97176270' },
    { value: 'FOXCONN', label: '富鴻網股份有限公司', tax_id: '24566673' }
  ]);

  const [compareOptions] = useState([
    { value: 'FET', label: '遠傳電信股份有限公司', tax_id: '97179430' },
    { value: 'CHT', label: '中華電信股份有限公司', tax_id: '96979933' },
    { value: 'TWM', label: '台灣大哥大股份有限公司', tax_id: '97176270' },
    { value: 'FOXCONN', label: '富鴻網股份有限公司', tax_id: '24566673' }
  ]);

  // 公司指標數據
  const [companyMetrics, setCompanyMetrics] = useState({});
  const [comparisonData, setComparisonData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // 數據快取
  const [companyDataCache, setCompanyDataCache] = useState({});
  const [financialDataCache, setFinancialDataCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    selectedCompany: false,
    compareCompany: false
  });

  // 基本面財務數據
  const getCompanyBasicFinancialData = useCallback((companyId) => {
    const financialData = {
      FET: { eps: '3.56元', pe: '26.4倍', bookValue: '38.5元' },
      CHT: { eps: '4.80元', pe: '26.5倍', bookValue: '48.2元' },
      TWM: { eps: '4.57元', pe: '18.5倍', bookValue: '42.8元' },
      FOXCONN: { eps: '2.50元', pe: '15.2倍', bookValue: '35.0元' }
    };
    return financialData[companyId] || { eps: 'N/A', pe: 'N/A', bookValue: 'N/A' };
  }, []);

  // 安全獲取公司數據
  const safeGetCompanyData = useCallback((companyId) => {
    const companies = {
      FET: { name: '遠傳電信', ticker: '4904', taxId: '97179430' },
      CHT: { name: '中華電信', ticker: '2412', taxId: '96979933' },
      TWM: { name: '台灣大哥大', ticker: '3045', taxId: '97176270' },
      FOXCONN: { name: '富鴻網', ticker: '8940', taxId: '24566673' }
    };
    return companies[companyId] || { name: 'Unknown', ticker: 'N/A', taxId: null };
  }, []);

  // 基本面數據（用於圖表）
  const [fundamentalData] = useState({
    FET: {
      earnings: [
        { period: '2Q24', value: 3.2, growth: 5.2 },
        { period: '3Q24', value: 3.5, growth: 9.4 },
        { period: '4Q24', value: 3.8, growth: 8.6 },
        { period: '1Q25', value: 4.1, growth: 7.9 }
      ],
      marketCap: [
        { period: '2Q24', value: 36.5, growth: 2.1 },
        { period: '3Q24', value: 37.2, growth: 1.9 },
        { period: '4Q24', value: 38.1, growth: 2.4 },
        { period: '1Q25', value: 38.5, growth: 1.0 }
      ],
      revenue: [
        { period: '2Q24', value: 185, growth: 3.5 },
        { period: '3Q24', value: 192, growth: 3.8 },
        { period: '4Q24', value: 198, growth: 3.1 },
        { period: '1Q25', value: 205, growth: 3.5 }
      ],
      ebitda: [
        { period: '2Q24', value: 45, growth: 5.2 },
        { period: '3Q24', value: 48, growth: 6.7 },
        { period: '4Q24', value: 51, growth: 6.3 },
        { period: '1Q25', value: 53, growth: 3.9 }
      ]
    },
    CHT: {
      earnings: [
        { period: '2Q24', value: 4.2, growth: 3.5 },
        { period: '3Q24', value: 4.5, growth: 7.1 },
        { period: '4Q24', value: 4.7, growth: 4.4 },
        { period: '1Q25', value: 4.8, growth: 2.1 }
      ],
      marketCap: [
        { period: '2Q24', value: 46.8, growth: 1.5 },
        { period: '3Q24', value: 47.5, growth: 1.5 },
        { period: '4Q24', value: 47.9, growth: 0.8 },
        { period: '1Q25', value: 48.2, growth: 0.6 }
      ],
      revenue: [
        { period: '2Q24', value: 520, growth: 2.5 },
        { period: '3Q24', value: 535, growth: 2.9 },
        { period: '4Q24', value: 548, growth: 2.4 },
        { period: '1Q25', value: 562, growth: 2.6 }
      ],
      ebitda: [
        { period: '2Q24', value: 145, growth: 3.2 },
        { period: '3Q24', value: 152, growth: 4.8 },
        { period: '4Q24', value: 158, growth: 3.9 },
        { period: '1Q25', value: 163, growth: 3.2 }
      ]
    },
    TWM: {
      earnings: [
        { period: '2Q24', value: 4.0, growth: 4.2 },
        { period: '3Q24', value: 4.3, growth: 7.5 },
        { period: '4Q24', value: 4.5, growth: 4.7 },
        { period: '1Q25', value: 4.6, growth: 2.2 }
      ],
      marketCap: [
        { period: '2Q24', value: 41.2, growth: 1.8 },
        { period: '3Q24', value: 41.9, growth: 1.7 },
        { period: '4Q24', value: 42.5, growth: 1.4 },
        { period: '1Q25', value: 42.8, growth: 0.7 }
      ],
      revenue: [
        { period: '2Q24', value: 315, growth: 2.8 },
        { period: '3Q24', value: 325, growth: 3.2 },
        { period: '4Q24', value: 332, growth: 2.2 },
        { period: '1Q25', value: 340, growth: 2.4 }
      ],
      ebitda: [
        { period: '2Q24', value: 82, growth: 3.8 },
        { period: '3Q24', value: 86, growth: 4.9 },
        { period: '4Q24', value: 89, growth: 3.5 },
        { period: '1Q25', value: 92, growth: 3.4 }
      ]
    },
    FOXCONN: {
      earnings: [
        { period: '2Q24', value: 2.1, growth: 8.5 },
        { period: '3Q24', value: 2.3, growth: 9.5 },
        { period: '4Q24', value: 2.4, growth: 4.3 },
        { period: '1Q25', value: 2.5, growth: 4.2 }
      ],
      marketCap: [
        { period: '2Q24', value: 33.5, growth: 2.5 },
        { period: '3Q24', value: 34.2, growth: 2.1 },
        { period: '4Q24', value: 34.7, growth: 1.5 },
        { period: '1Q25', value: 35.0, growth: 0.9 }
      ],
      revenue: [
        { period: '2Q24', value: 125, growth: 5.5 },
        { period: '3Q24', value: 132, growth: 5.6 },
        { period: '4Q24', value: 138, growth: 4.5 },
        { period: '1Q25', value: 145, growth: 5.1 }
      ],
      ebitda: [
        { period: '2Q24', value: 28, growth: 6.2 },
        { period: '3Q24', value: 30, growth: 7.1 },
        { period: '4Q24', value: 32, growth: 6.7 },
        { period: '1Q25', value: 34, growth: 6.3 }
      ]
    }
  });

  const value = {
    // 公司選擇
    selectedCompany,
    setSelectedCompany,
    compareCompany,
    setCompareCompany,

    // 公司選項
    companyOptions,
    compareOptions,

    // 公司指標
    companyMetrics,
    setCompanyMetrics,
    comparisonData,
    setComparisonData,
    metricsLoading,
    setMetricsLoading,
    metricsError,
    setMetricsError,
    hoveredMetric,
    setHoveredMetric,

    // 數據快取
    companyDataCache,
    setCompanyDataCache,
    financialDataCache,
    setFinancialDataCache,
    loadingStates,
    setLoadingStates,

    // 基本面數據
    fundamentalData,
    getCompanyBasicFinancialData,
    safeGetCompanyData
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

/**
 * 使用公司狀態的 Hook
 */
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};
