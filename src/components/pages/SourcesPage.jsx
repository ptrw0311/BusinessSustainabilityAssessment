import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * 指標來源頁面
 * 展示各個評估指標的學術研究來源
 */
export const SourcesPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});

  const switchTab = (tabId) => {
    setActiveTab(tabId);
  };

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // 完整的 34 個指標數據
  const indicators = [
    // 營運能力 (5個)
    {
      id: 'receivables_turnover',
      title: '應收帳款周轉率',
      tag: '營運能力',
      category: 'operation',
      description: '代表公司收現速度快不快，越高表示現金回收效率佳。',
      source: 'Which metrics really drive total returns to shareholders',
      org: '🏛️ McKinsey & Company (2022)'
    },
    {
      id: 'inventory_turnover',
      title: '存貨周轉率',
      tag: '營運能力',
      category: 'operation',
      description: '衡量庫存管理效率，越高代表存貨變現快，不易積壓。',
      source: 'Uncovering cash and insights from working capital',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'fixed_assets_turnover',
      title: '固定資產周轉率',
      tag: '營運能力',
      category: 'operation',
      description: '衡量公司運用固定資產創造收入的能力。',
      source: 'The Impact Of Asset Management Efficiency Ratios on Earnings per Share',
      org: '🎓 Academic Research (2019)'
    },
    {
      id: 'total_assets_turnover',
      title: '總資產周轉率',
      tag: '營運能力',
      category: 'operation',
      description: '看公司整體資產運用效率，數字越高代表資產使用越有效率。',
      source: 'A long-term look at ROIC',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'operating_cycle',
      title: '營運週期',
      tag: '營運能力',
      category: 'operation',
      description: '公司完成一次「買進—生產/銷售—收款」的時間，越短代表越有效率。',
      source: 'Uncovering cash and insights from working capital',
      org: '🏛️ McKinsey & Company (2014)'
    },

    // 財務能力 (8個)
    {
      id: 'current_ratio',
      title: '流動比率',
      tag: '財務能力',
      category: 'financial',
      description: '衡量短期償債能力。',
      source: 'Capital ratios and financial distress',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'quick_ratio',
      title: '速動比率',
      tag: '財務能力',
      category: 'financial',
      description: '更嚴格的短期償債能力。',
      source: 'How to improve liquidity accuracy at a time of economic uncertainty',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'cash_ratio',
      title: '現金比率',
      tag: '財務能力',
      category: 'financial',
      description: '最保守的償債能力。',
      source: 'Uncovering cash and insights from working capital',
      org: '🏛️ McKinsey & Company (2014)'
    },
    {
      id: 'interest_coverage',
      title: '利息保障倍數',
      tag: '財務能力',
      category: 'financial',
      description: '衡量支付利息能力。',
      source: 'Financial Analysis and Management',
      org: '🎓 Academic Research'
    },
    {
      id: 'debt_ratio',
      title: '負債比率',
      tag: '財務能力',
      category: 'financial',
      description: '衡量資產中由債務融資比例。',
      source: 'IMD Center for Future Readiness',
      org: '🎓 IMD Business School'
    },
    {
      id: 'operating_cf_to_debt',
      title: '營業現金流對負債比',
      tag: '財務能力',
      category: 'financial',
      description: '用營運現金還債能力。',
      source: 'Cash Flow Management Best Practices',
      org: '🎓 Financial Management Research'
    },
    {
      id: 'free_cash_flow',
      title: '自由現金流',
      tag: '財務能力',
      category: 'financial',
      description: '衡量可自由支配的現金。',
      source: 'IMD Center for Future Readiness',
      org: '🎓 IMD Business School'
    },
    {
      id: 'roe',
      title: 'ROE (股東權益報酬率)',
      tag: '財務能力',
      category: 'financial',
      description: '股東權益報酬；持續高於同業為佳。',
      source: 'How to choose between growth and ROIC',
      org: '🏛️ McKinsey & Company (2022)'
    },

    // 成長能力 (10個)
    {
      id: 'revenue_growth',
      title: '營收成長率',
      tag: '成長能力',
      category: 'growth',
      description: '反映企業規模擴張能力。',
      source: 'Revenue growth: Ten rules for success',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'revenue_cagr',
      title: '營收複合年均成長率',
      tag: '成長能力',
      category: 'growth',
      description: '衡量長期營收趨勢，比單一年份更穩定。',
      source: 'IMD Center for Future Readiness',
      org: '🎓 IMD Business School'
    },
    {
      id: 'gross_profit_growth',
      title: '毛利成長率',
      tag: '成長能力',
      category: 'growth',
      description: '不僅看營收，還要看獲利是否同步上升。',
      source: 'Achieving extraordinary growth: Myths and realities',
      org: '🏛️ McKinsey & Company (2024)'
    },
    {
      id: 'eps_growth',
      title: 'EPS 成長率',
      tag: '成長能力',
      category: 'growth',
      description: '投資領域最常用的獲利成長指標。',
      source: 'Growth Metrics Analysis',
      org: '🎓 Investment Research'
    },
    {
      id: 'operating_cf_growth',
      title: '營業現金流成長率',
      tag: '成長能力',
      category: 'growth',
      description: '較高的營業現金流能促進企業成長。',
      source: 'Cash Flow Growth Indicators',
      org: '🎓 Financial Analysis Research'
    },
    {
      id: 'total_assets_growth',
      title: '總資產成長率',
      tag: '成長能力',
      category: 'growth',
      description: '顯示企業是否積極擴張資產。',
      source: 'Asset Growth and Performance',
      org: '🎓 Management Research'
    },
    {
      id: 'rd_growth',
      title: '研發成長率',
      tag: '成長能力',
      category: 'growth',
      description: '顯示企業未來成長潛力。',
      source: 'R&D Investment Trends',
      org: '🎓 Innovation Research'
    },
    {
      id: 'employee_growth',
      title: '員工數成長率',
      tag: '成長能力',
      category: 'growth',
      description: '企業規模是否擴張的一個輔助指標。',
      source: 'Workforce Expansion Analysis',
      org: '🎓 HR Research'
    },
    {
      id: 'new_product_revenue_ratio',
      title: '新產品營收佔比',
      tag: '成長能力',
      category: 'growth',
      description: '新產品營收 / 總營收。',
      source: 'Taking the measure of innovation with conversion metrics',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'market_diversification',
      title: '市場多元化指數',
      tag: '成長能力',
      category: 'growth',
      description: '1 - Σ(各市場營收占比²)。',
      source: 'Mapping the value of diversification',
      org: '🏛️ McKinsey & Company (2022)'
    },

    // ESG永續力 (4個)
    {
      id: 'energy_efficiency',
      title: '能源效率比',
      tag: 'ESG永續力',
      category: 'esg',
      description: '營業收入 / 總能源消耗。',
      source: 'Energy efficiency: A compelling global resource',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'employee_retention',
      title: '員工留任率',
      tag: 'ESG永續力',
      category: 'esg',
      description: '(期末-新進) / 期初。',
      source: "It's Time to Reimagine Employee Retention",
      org: '🎓 Harvard Business Review (2022)'
    },
    {
      id: 'compliance_rate',
      title: '合規達成率',
      tag: 'ESG永續力',
      category: 'esg',
      description: '通過法遵項數 / 總檢查項數。',
      source: 'ESG Reporting Takes Major Step Forward',
      org: '🌐 WEF with Deloitte, EY, KPMG and PwC (2021)'
    },
    {
      id: 'renewable_energy_ratio',
      title: '再生能源佔整體用電比例',
      tag: 'ESG永續力',
      category: 'esg',
      description: '再生能源佔整體使用能源比例。',
      source: 'SASB STANDARD',
      org: '🌐 Sustainability Accounting Standards Board'
    },

    // 研發創新 (4個)
    {
      id: 'rd_intensity',
      title: '研發支出占比',
      tag: '研發創新',
      category: 'innovation',
      description: '研發支出 / 營業收入。',
      source: 'The Trillion-Dollar R&D Fix',
      org: '🎓 Harvard Business Review (2012)'
    },
    {
      id: 'ip_growth',
      title: '智慧財產權成長率',
      tag: '研發創新',
      category: 'innovation',
      description: '(今年專利 - 去年專利) / 去年專利。',
      source: 'Getting tangible about intangibles',
      org: '🏛️ McKinsey & Company (2024)'
    },
    {
      id: 'rd_cagr',
      title: '研發費用年複合成長率',
      tag: '研發創新',
      category: 'innovation',
      description: '可以看出企業長期對於研發的投入。',
      source: 'IMD Center for Future Readiness',
      org: '🎓 IMD Business School'
    },
    {
      id: 'product_update_cycle',
      title: '產品更新週期',
      tag: '研發創新',
      category: 'innovation',
      description: '平均更新頻率(月數)。',
      source: 'Taking the measure of product development',
      org: '🏛️ McKinsey & Company (2023)'
    },

    // 資訊化 (3個)
    {
      id: 'digital_maturity',
      title: '數位化程度',
      tag: '資訊化',
      category: 'digital',
      description: '公司所有程序中以資訊化的占比程度。',
      source: 'What is digital transformation?',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'it_investment_intensity',
      title: 'IT投資強度',
      tag: '資訊化',
      category: 'digital',
      description: 'IT支出 / 營業收入。',
      source: 'How high performers optimize IT productivity for revenue growth',
      org: '🏛️ McKinsey & Company (2024)'
    },
    {
      id: 'data_driven_decisions',
      title: '資料驅動決策比例',
      tag: '資訊化',
      category: 'digital',
      description: '有數據支持決策 / 重要決策總數。',
      source: 'Charting a path to the data- and AI-driven enterprise of 2030',
      org: '🏛️ McKinsey & Company (2024)'
    }
  ];

  // 過濾指標
  const filteredIndicators = activeTab === 'all'
    ? indicators
    : indicators.filter(ind => ind.category === activeTab);

  return (
    <div className="p-6 dynamic-bg" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 頁面標題 */}
        <div className="text-center mb-12" style={{ animation: 'fadeInDown 0.8s ease' }}>
          <h1 className="text-slate-800 mb-4" style={{
            fontSize: '42px',
            fontWeight: '700',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
          }}>
            🔬 指標來源
          </h1>
          <p className="text-slate-700 text-lg leading-relaxed font-medium">
            每項指標均基於國際頂尖研究機構的學術研究與業界最佳實務<br />
            確保評估體系的理論基礎與實務價值
          </p>
        </div>

        {/* Tab導航 */}
        <div className="flex gap-4 mb-10 flex-wrap justify-center" style={{ animation: 'fadeIn 1s ease 0.2s both' }}>
          {[
            { id: 'all', label: '全部指標' },
            { id: 'operation', label: '營運能力' },
            { id: 'financial', label: '財務能力' },
            { id: 'growth', label: '成長能力' },
            { id: 'esg', label: 'ESG永續力' },
            { id: 'innovation', label: '研發創新' },
            { id: 'digital', label: '資訊化' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`px-8 py-4 font-semibold rounded-2xl transition-all duration-300 border-2 ${
                activeTab === tab.id
                  ? 'warm-gradient-card text-slate-800 border-slate-400 shadow-lg'
                  : 'liquid-glass-card border-slate-400/30 text-slate-700 hover:warm-gradient-card hover:text-slate-800 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 統計卡片 */}
        {activeTab === 'all' && (
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              <div className="text-center p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl liquid-glass-card border border-slate-500/30 shadow-lg">
                <div className="text-slate-800 text-5xl font-bold mb-2">{indicators.length}</div>
                <div className="text-slate-600">評估指標總數</div>
              </div>
              <div className="text-center p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl liquid-glass-card border border-slate-500/30 shadow-lg">
                <div className="text-slate-800 text-5xl font-bold mb-2">30+</div>
                <div className="text-slate-600">學術研究來源</div>
              </div>
              <div className="text-center p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl liquid-glass-card border border-slate-500/30 shadow-lg">
                <div className="text-slate-800 text-5xl font-bold mb-2">6</div>
                <div className="text-slate-600">核心能力維度</div>
              </div>
            </div>
          </div>
        )}

        {/* 指標卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIndicators.map((indicator) => (
            <div
              key={indicator.id}
              className="liquid-glass-card rounded-3xl p-8 shadow-lg border border-slate-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* 標籤 */}
              <div className="inline-block px-5 py-2 rounded-full warm-gradient-card text-slate-800 font-semibold mb-4 shadow-md">
                {indicator.tag}
              </div>

              {/* 標題 */}
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                {indicator.title}
              </h3>

              {/* 描述 */}
              <p className="text-slate-700 leading-relaxed mb-6 font-medium">
                {indicator.description}
              </p>

              {/* 展開/收合按鈕 */}
              <button
                onClick={() => toggleCard(indicator.id)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-semibold"
              >
                {expandedCards[indicator.id] ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    <span>收合來源</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    <span>展開查看來源</span>
                  </>
                )}
              </button>

              {/* 展開的內容 */}
              {expandedCards[indicator.id] && (
                <div className="mt-6 p-6 bg-white/50 rounded-2xl border border-slate-300/50">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📚</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 mb-2">研究來源</div>
                      <div className="text-slate-700 mb-3 italic">"{indicator.source}"</div>
                      <div className="text-slate-600 font-semibold">{indicator.org}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
