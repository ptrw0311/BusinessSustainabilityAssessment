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

  // 指標數據（簡化版本，包含主要指標）
  const indicators = [
    {
      id: 'receivables_turnover',
      title: '應收帳款週轉率',
      tag: '營運能力',
      category: 'operation',
      description: '代表公司收現速度快不快,越高表示現金回收效率佳。',
      source: 'Which metrics really drive total returns to shareholders',
      org: '🏛️ McKinsey & Company (2022)'
    },
    {
      id: 'inventory_turnover',
      title: '存貨週轉率',
      tag: '營運能力',
      category: 'operation',
      description: '衡量庫存管理效率,越高代表存貨變現快,不易積壓。',
      source: 'Uncovering cash and insights from working capital',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'current_ratio',
      title: '流動比率',
      tag: '財務能力',
      category: 'financial',
      description: '衡量短期償債能力,反映企業應對短期財務壓力的能力。',
      source: 'Capital ratios and financial distress',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'roe',
      title: 'ROE (股東權益報酬率)',
      tag: '財務能力',
      category: 'financial',
      description: '股東權益報酬,反映企業為股東創造價值的能力;持續高於同業為佳。',
      source: 'How to choose between growth and ROIC',
      org: '🏛️ McKinsey & Company (2022)'
    },
    {
      id: 'revenue_growth',
      title: '營收成長率',
      tag: '成長能力',
      category: 'growth',
      description: '反映企業規模擴張能力,是評估企業成長動能的關鍵指標。',
      source: 'Revenue growth: Ten rules for success',
      org: '🏛️ McKinsey & Company (2021)'
    },
    {
      id: 'esg_score',
      title: 'ESG綜合評分',
      tag: 'ESG永續力',
      category: 'esg',
      description: '評估企業在環境、社會責任和公司治理三方面的表現。',
      source: 'ESG and financial performance',
      org: '🎓 IMD Business School'
    },
    {
      id: 'rd_intensity',
      title: '研發密集度',
      tag: '研發創新',
      category: 'innovation',
      description: '研發支出占營收比例,反映企業對創新的投入程度。',
      source: 'Innovation metrics that matter',
      org: '🏛️ McKinsey & Company (2023)'
    },
    {
      id: 'digital_maturity',
      title: '數位化成熟度',
      tag: '資訊化',
      category: 'digital',
      description: '評估企業數位轉型的進展和資訊系統的先進程度。',
      source: 'Digital transformation index',
      org: '🎓 IMD Business School'
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
