'use client'

import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, AlertTriangle, CheckCircle, BarChart3, Zap, Leaf, Lightbulb, User, Building, FileText, Settings, History, MessageSquare, Star, LogOut, Search, Activity, Target } from 'lucide-react';

const BusinessSustainabilityAssessment = () => {
  const [selectedCompany, setSelectedCompany] = useState('NVDA');
  const [compareCompany, setCompareCompany] = useState('CHT');
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 示範數據 - 多家公司
  const companyData = {
    NVDA: {
      name: '輝達 Nvidia Corp',
      ticker: 'NVDA',
      overallScore: 85,
      revenue: '1305億美元',
      growth: '+114%',
      marketCap: '40600億美元',
      pe: '31.2',
      eps: '28.12美元',
      metrics: {
        營運能力: 88,
        財務能力: 92,
        未來力: 95,
        AI數位力: 98,
        ESG永續力: 75,
        創新能力: 90
      }
    },
    FET: {
      name: '遠傳電信 Far EasTone',
      ticker: '4904',
      overallScore: 72,
      revenue: '1051.7億元',
      growth: '+2.8%',
      marketCap: '3036億元',
      pe: '23.7',
      eps: '2.15元',
      metrics: {
        營運能力: 75,
        財務能力: 78,
        未來力: 68,
        AI數位力: 82,
        ESG永續力: 85,
        創新能力: 65
      }
    },
    CHT: {
      name: '台積電 TSMC',
      ticker: 'TSM',
      overallScore: 88,
      revenue: '2096億新台幣',
      growth: '+37.6%',
      marketCap: '12800億美元',
      pe: '20.7',
      eps: '35.85新台幣',
      metrics: {
        營運能力: 90,
        財務能力: 92,
        未來力: 85,
        AI數位力: 88,
        ESG永續力: 85,
        創新能力: 90
      }
    },
    TWM: {
      name: '台灣大哥大 Taiwan Mobile',
      ticker: '3045',
      overallScore: 70,
      revenue: '1426億',
      growth: '+1.8%',
      marketCap: '3280億元',
      pe: '16.8',
      eps: '6.12新台幣',
      metrics: {
        營運能力: 78,
        財務能力: 80,
        未來力: 62,
        AI數位力: 75,
        ESG永續力: 82,
        創新能力: 63
      }
    }
  };

  const companyOptions = [
    { value: 'NVDA', label: '輝達 Nvidia Corp' },
    { value: 'FET', label: '遠傳電信 Far EasTone' }
  ];

  const compareOptions = [
    { value: 'CHT', label: '台積電 TSMC' },
    { value: 'TWM', label: '台灣大哥大 Taiwan Mobile' }
  ];

  const radarData = Object.entries(companyData[selectedCompany].metrics).map(([key, value]) => ({
    dimension: key,
    主要公司: value,
    比較公司: companyData[compareCompany].metrics[key],
    fullMark: 100
  }));

  const performanceColors = {
    優異: '#4CAF50',
    良好: '#8BC34A', 
    一般: '#FFC107',
    待改善: '#FF9800',
    風險: '#F44336'
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return '優異';
    if (score >= 75) return '良好';
    if (score >= 60) return '一般';
    if (score >= 40) return '待改善';
    return '風險';
  };

  const getScoreColor = (score) => {
    return performanceColors[getPerformanceLevel(score)];
  };

  const getPerformanceBackground = (score) => {
    const level = getPerformanceLevel(score);
    switch(level) {
      case '優異': return 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)'; // 綠色系
      case '良好': return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)'; // 藍色系  
      case '一般': return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'; // 橘色系
      case '待改善': return 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)'; // 粉紅色系
      case '風險': return 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)'; // 紫色系
      default: return 'linear-gradient(135deg, #4a90e2 0%, #b19cd9 100%)';
    }
  };

  const dimensionIcons = {
    營運能力: <BarChart3 className="w-5 h-5" />,
    財務能力: <TrendingUp className="w-5 h-5" />,
    未來力: <Zap className="w-5 h-5" />,
    AI數位力: <Award className="w-5 h-5" />,
    ESG永續力: <Leaf className="w-5 h-5" />,
    創新能力: <Lightbulb className="w-5 h-5" />
  };

  const trendData = [
    { period: '1Q25', score: 82 },
    { period: '2Q25', score: 83 },
    { period: '3Q25', score: 84 },
    { period: '4Q25', score: 85 }
  ];

  // 基本面數據
  const fundamentalData = {
    FET: {
      earnings: [
        { period: '2023-Q3', value: 1.8, growth: -8 },
        { period: '2024-Q1', value: 2.0, growth: 11 },
        { period: '2024-Q3', value: 2.1, growth: 5 },
        { period: '2025-Q1', value: 2.15, growth: 2 },
        { period: '2025-Q3', value: 2.2, growth: 2 },
        { period: '2026-Q1', value: 2.3, growth: 5 }
      ],
      revenue: [
        { period: '2023-Q3', value: 980, growth: 2 },
        { period: '2024-Q1', value: 1020, growth: 4 },
        { period: '2024-Q3', value: 1040, growth: 2 },
        { period: '2025-Q1', value: 1051, growth: 1 },
        { period: '2025-Q3', value: 1065, growth: 1 },
        { period: '2026-Q1', value: 1080, growth: 1 }
      ],
      ebitda: [
        { period: '2023-Q3', value: 180, growth: 3 },
        { period: '2024-Q1', value: 185, growth: 3 },
        { period: '2024-Q3', value: 190, growth: 3 },
        { period: '2025-Q1', value: 195, growth: 3 },
        { period: '2025-Q3', value: 200, growth: 3 },
        { period: '2026-Q1', value: 205, growth: 3 }
      ],
      marketCap: [
        { period: '2023-Q3', value: 2800, growth: -2 },
        { period: '2024-Q1', value: 2900, growth: 4 },
        { period: '2024-Q3', value: 3000, growth: 3 },
        { period: '2025-Q1', value: 3036, growth: 1 },
        { period: '2025-Q3', value: 3050, growth: 0 },
        { period: '2026-Q1', value: 3080, growth: 1 }
      ]
    },
    NVDA: {
      earnings: [
        { period: '2023-Q3', value: 0.4, growth: -5 },
        { period: '2024-Q1', value: 0.6, growth: 50 },
        { period: '2024-Q3', value: 0.8, growth: 33 },
        { period: '2025-Q1', value: 0.95, growth: 19 },
        { period: '2025-Q3', value: 1.0, growth: 5 },
        { period: '2026-Q1', value: 1.1, growth: 10 }
      ],
      revenue: [
        { period: '2023-Q3', value: 10000, growth: 100 },
        { period: '2024-Q1', value: 15000, growth: 150 },
        { period: '2024-Q3', value: 25000, growth: 167 },
        { period: '2025-Q1', value: 35000, growth: 140 },
        { period: '2025-Q3', value: 42000, growth: 120 },
        { period: '2026-Q1', value: 48000, growth: 114 }
      ],
      ebitda: [
        { period: '2023-Q3', value: 8000, growth: 0 },
        { period: '2024-Q1', value: 12000, growth: 200 },
        { period: '2024-Q3', value: 20000, growth: 500 },
        { period: '2025-Q1', value: 25000, growth: 108 },
        { period: '2025-Q3', value: 28000, growth: 40 },
        { period: '2026-Q1', value: 30000, growth: 25 }
      ],
      marketCap: [
        { period: '2023-Q3', value: 800, growth: 0 },
        { period: '2024-Q1', value: 1200, growth: 50 },
        { period: '2024-Q3', value: 2800, growth: 133 },
        { period: '2025-Q1', value: 4200, growth: 50 },
        { period: '2025-Q3', value: 4800, growth: 14 },
        { period: '2026-Q1', value: 5000, growth: 4 }
      ]
    }
  };

  // 側邊選單項目
  const menuItems = [
    { id: 'dashboard', label: '六大核心能力', icon: <Target className="w-5 h-5" />, active: true },
    { id: 'companies', label: '基本面', icon: <Building className="w-5 h-5" /> },
    { id: 'reports', label: '報表', icon: <FileText className="w-5 h-5" /> },
    { id: 'analytics', label: '趨勢分析', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'messages', label: '最新訊息', icon: <MessageSquare className="w-5 h-5" />, badge: '3' },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  // 渲染不同頁面內容
  const renderPageContent = () => {
    if (currentPage === 'profile') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">用戶資料</h2>
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Audit01</h3>
                <p className="text-slate-400">聯稽總部</p>
                <p className="text-slate-400">audit01@company.com</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentPage === 'companies') {
      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-end mb-6">
            <select 
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="liquid-glass-card custom-select px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-800"
            >
              {companyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 基本面圖表 - 2x2 佈局 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 每股盈餘 */}
            <div className="liquid-glass-card rounded-xl p-6 text-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">每股盈餘</h3>
                </div>
                <button className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <span>單季</span> | <span className="text-slate-400">近4季</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-slate-400">{selectedCompany === 'FET' ? '新台幣' : '美元'}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fundamentalData[selectedCompany]?.earnings || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#earningsGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#1e293b"
                    strokeWidth={2}
                    dot={{ fill: '#1e293b', strokeWidth: 2, r: 4 }}
                  />
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 每股淨值 */}
            <div className="liquid-glass-card rounded-xl p-6 text-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">每股淨值</h3>
                </div>
                <button className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <span>單季</span> | <span className="text-slate-400">近4季</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-slate-400">{selectedCompany === 'FET' ? '新台幣' : '美元'}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fundamentalData[selectedCompany]?.marketCap || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#netValueGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#1e293b"
                    strokeWidth={2}
                    dot={{ fill: '#1e293b', strokeWidth: 2, r: 4 }}
                  />
                  <defs>
                    <linearGradient id="netValueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 營收 */}
            <div className="liquid-glass-card rounded-xl p-6 text-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">營收</h3>
                </div>
                <button className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <span>單季</span> | <span className="text-slate-400">近4季</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-slate-400">{selectedCompany === 'FET' ? '億新台幣' : '百萬美元'}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fundamentalData[selectedCompany]?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#revenueGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#1e293b"
                    strokeWidth={2}
                    dot={{ fill: '#1e293b', strokeWidth: 2, r: 4 }}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* EBITDA */}
            <div className="liquid-glass-card rounded-xl p-6 text-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">EBITDA</h3>
                </div>
                <button className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                  <span>單季</span> | <span className="text-slate-400">近4季</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-slate-400">{selectedCompany === 'FET' ? '億新台幣' : '百萬美元'}</span>
                <span className="text-xs text-slate-400">%</span>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fundamentalData[selectedCompany]?.ebitda || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.3)" />
                  <XAxis 
                    dataKey="period" 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#1e293b" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#ebitdaGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#1e293b"
                    strokeWidth={2}
                    dot={{ fill: '#1e293b', strokeWidth: 2, r: 4 }}
                  />
                  <defs>
                    <linearGradient id="ebitdaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 公司基本資訊卡片 */}
          <div className="liquid-glass-card rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              {companyData[selectedCompany].name} - 基本資訊
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">股票代號</div>
                <div className="text-2xl font-bold text-slate-800">
                  {companyData[selectedCompany].ticker}
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">淨值</div>
                <div className="text-2xl font-bold text-slate-800">
                  {companyData[selectedCompany].marketCap}
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">本益比</div>
                <div className="text-2xl font-bold text-slate-800">
                  {companyData[selectedCompany].pe}
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">每股盈餘</div>
                <div className="text-2xl font-bold text-slate-800">
                  {companyData[selectedCompany].eps}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentPage === 'reports') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">報表中心</h2>
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Q3 2025 企業評估報告</h3>
                <p className="text-slate-600 text-sm">2025-08-31</p>
              </div>
              <div className="text-green-400 font-semibold">已完成</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">科技股比較分析</h3>
                <p className="text-slate-400 text-sm">2025-08-28</p>
              </div>
              <div className="text-yellow-400 font-semibold">進行中</div>
            </div>
          </div>
        </div>
      );
    }
    
    // 預設返回dashboard內容
    return renderDashboard();
  };

  // Dashboard內容
  const renderDashboard = () => {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 公司選擇區 */}
        <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30 mb-6 text-slate-800">
          <div className="flex flex-row gap-8 items-center justify-center">
            <div className="flex items-center space-x-3">
              <label className="text-slate-600 font-medium">主要分析公司:</label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {companyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="text-slate-600 font-medium">比較公司:</label>
              <select 
                value={compareCompany}
                onChange={(e) => setCompareCompany(e.target.value)}
                className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {compareOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 評分標準 */}
        <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-orange-500/30">
          <h3 className="text-xl font-bold mb-6 text-slate-800">評分標準</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(performanceColors).map(([level, color]) => (
              <div key={level} className="flex items-center space-x-2 p-3 warm-gradient-card rounded-lg transition-all duration-300 hover:scale-105">
                <div className="text-lg">
                  {level === '優異' && '🏆'}
                  {level === '良好' && '👍'}
                  {level === '一般' && '⚖️'}
                  {level === '待改善' && '⚠️'}
                  {level === '風險' && '🚨'}
                </div>
                <div>
                  <div className="font-medium text-sm text-slate-800">{level}</div>
                  <div className="text-xs text-slate-600">
                    {level === '優異' && '90-100分'}
                    {level === '良好' && '75-89分'}
                    {level === '一般' && '60-74分'}
                    {level === '待改善' && '40-59分'}
                    {level === '風險' && '0-39分'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 公司概覽 - 比較模式 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 主要公司 */}
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30 text-slate-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{companyData[selectedCompany].name}</h2>
                <p className="text-slate-600">{companyData[selectedCompany].ticker}</p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* 左側三個卡片 */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">營收</div>
                  <div className="text-2xl font-bold text-slate-800">{companyData[selectedCompany].revenue}</div>
                  <div className="text-slate-600 text-sm font-medium">{companyData[selectedCompany].growth}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">淨值</div>
                  <div className="text-xl font-bold text-slate-800">{companyData[selectedCompany].marketCap}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">每股盈餘</div>
                  <div className="text-xl font-bold text-slate-800">{companyData[selectedCompany].eps}</div>
                </div>
              </div>
              
              {/* 右側大圓形綜合評價 */}
              <div className="rounded-3xl p-8 flex flex-col items-center justify-center min-w-[200px] shadow-lg"
                   style={{
                     background: getPerformanceBackground(companyData[selectedCompany].overallScore),
                     backdropFilter: 'blur(16px)',
                     WebkitBackdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                   }}>
                <div className="text-white text-sm font-medium mb-2">綜合評價</div>
                <div className="text-2xl mb-2">
                  {companyData[selectedCompany].overallScore >= 90 && '🏆'}
                  {companyData[selectedCompany].overallScore >= 75 && companyData[selectedCompany].overallScore < 90 && '👍'}
                  {companyData[selectedCompany].overallScore >= 60 && companyData[selectedCompany].overallScore < 75 && '⚖️'}
                  {companyData[selectedCompany].overallScore >= 40 && companyData[selectedCompany].overallScore < 60 && '⚠️'}
                  {companyData[selectedCompany].overallScore < 40 && '🚨'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {getPerformanceLevel(companyData[selectedCompany].overallScore)}
                </div>
              </div>
            </div>
          </div>

          {/* 比較公司 */}
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30 text-slate-800">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{companyData[compareCompany].name}</h2>
                <p className="text-slate-600">{companyData[compareCompany].ticker}</p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* 左側三個卡片 */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">營收</div>
                  <div className="text-2xl font-bold text-slate-800">{companyData[compareCompany].revenue}</div>
                  <div className="text-slate-600 text-sm font-medium">{companyData[compareCompany].growth}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">淨值</div>
                  <div className="text-xl font-bold text-slate-800">{companyData[compareCompany].marketCap}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">每股盈餘</div>
                  <div className="text-xl font-bold text-slate-800">{companyData[compareCompany].eps}</div>
                </div>
              </div>
              
              {/* 右側大圓形綜合評價 */}
              <div className="rounded-3xl p-8 flex flex-col items-center justify-center min-w-[200px] shadow-lg"
                   style={{
                     background: getPerformanceBackground(companyData[compareCompany].overallScore),
                     backdropFilter: 'blur(16px)',
                     WebkitBackdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                   }}>
                <div className="text-white text-sm font-medium mb-2">綜合評價</div>
                <div className="text-2xl mb-2">
                  {companyData[compareCompany].overallScore >= 90 && '🏆'}
                  {companyData[compareCompany].overallScore >= 75 && companyData[compareCompany].overallScore < 90 && '👍'}
                  {companyData[compareCompany].overallScore >= 60 && companyData[compareCompany].overallScore < 75 && '⚖️'}
                  {companyData[compareCompany].overallScore >= 40 && companyData[compareCompany].overallScore < 60 && '⚠️'}
                  {companyData[compareCompany].overallScore < 40 && '🚨'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {getPerformanceLevel(companyData[compareCompany].overallScore)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 六大維度雷達圖 - 比較模式 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
            <h3 className="text-xl font-bold mb-6 text-center text-slate-800">六大核心能力比較雷達圖</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke="#64748b" strokeOpacity={0.4} />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fontSize: 14, fill: '#1e293b' }}
                  className="text-sm"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#1e293b' }}
                />
                <Radar
                  name={companyData[selectedCompany].name}
                  dataKey="主要公司"
                  stroke="#FFB84D"
                  fill="#FFB84D"
                  fillOpacity={0.4}
                  strokeWidth={3}
                  dot={{ fill: '#FFB84D', strokeWidth: 3, r: 5, fillOpacity: 1 }}
                />
                <Radar
                  name={companyData[compareCompany].name}
                  dataKey="比較公司"
                  stroke="#4ECDC4"
                  fill="#4ECDC4"
                  fillOpacity={0.3}
                  strokeWidth={3}
                  dot={{ fill: '#4ECDC4', strokeWidth: 3, r: 4, fillOpacity: 1 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 維度評分詳情 - 比較模式 */}
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
            <h3 className="text-xl font-bold mb-6 text-slate-800">維度評分比較</h3>
            <div className="space-y-4">
              {Object.entries(companyData[selectedCompany].metrics).map(([dimension, score]) => (
                <div key={dimension} 
                     className="p-4 warm-gradient-card rounded-lg hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-slate-600">
                      {dimensionIcons[dimension]}
                    </div>
                    <span className="font-medium text-lg text-slate-800">{dimension}</span>
                  </div>
                  
                  {/* 主要公司 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#FFB84D'}}></div>
                      <span className="text-sm text-slate-600">{companyData[selectedCompany].name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 liquid-glass rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 shadow-sm"
                          style={{ 
                            width: `${score}%`, 
                            backgroundColor: '#FFB84D'
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-[3rem]" style={{color: '#FFB84D'}}>
                        {score}
                      </span>
                    </div>
                  </div>
                  
                  {/* 比較公司 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: '#4ECDC4'}}></div>
                      <span className="text-sm text-slate-600">{companyData[compareCompany].name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 liquid-glass rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 shadow-sm"
                          style={{ 
                            width: `${companyData[compareCompany].metrics[dimension]}%`,
                            backgroundColor: '#4ECDC4'
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-[3rem]" style={{color: '#4ECDC4'}}>
                        {companyData[compareCompany].metrics[dimension]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 趨勢分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
            <h3 className="text-xl font-bold mb-6 text-slate-800">評分趨勢</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.3} />
                <XAxis dataKey="period" stroke="#1e293b" />
                <YAxis stroke="#1e293b" domain={[80, 86]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#FFB84D" 
                  strokeWidth={3}
                  dot={{ fill: '#FFB84D', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#FFB84D' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 風險預警 */}
          <div className="liquid-glass-card rounded-xl p-6 shadow-lg border border-slate-500/30">
            <h3 className="text-xl font-bold mb-6 text-slate-800">風險預警指標</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 warm-gradient-card border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400">財務健康度</div>
                  <div className="text-sm text-slate-600">流動比率、ROE表現優異</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 warm-gradient-card border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-medium text-yellow-400">ESG關注點</div>
                  <div className="text-sm text-slate-600">能源效率需要持續改善</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 warm-gradient-card border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400">創新動能</div>
                  <div className="text-sm text-slate-600">研發投入與專利成長強勁</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen dynamic-bg text-slate-900 flex">
      {/* 左側邊欄 */}
      <div className="w-64 liquid-glass-card shadow-xl border-r border-slate-500/20 flex flex-col h-screen overflow-hidden backdrop-blur-xl text-slate-800">
        {/* Logo區域 */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">
                企業評估平台
              </h1>
            </div>
          </div>
        </div>

        {/* 搜尋框 */}
        <div className="p-4 border-b border-white/20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full liquid-glass rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/50 border border-slate-300/50 placeholder-slate-500 text-slate-800"
            />
          </div>
        </div>

        {/* 選單項目 - 可滾動 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                  currentPage === item.id 
                    ? 'warm-gradient-card text-slate-800 shadow-lg' 
                    : 'text-slate-600 hover:warm-gradient-card hover:text-slate-800'
                }`}
              >
                <div className={currentPage === item.id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <div className="ml-auto bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 text-xs px-2 py-1 rounded-full shadow-lg">
                    {item.badge}
                  </div>
                )}
                {currentPage === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r shadow-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 底部用戶資訊 */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-3 warm-gradient-card rounded-lg p-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">Audit01</div>
              <div className="text-xs text-slate-600">聯稽總部</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="liquid-glass-card border-b border-slate-500/20 px-6 py-4 shadow-xl backdrop-blur-xl text-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {currentPage === 'dashboard' ? '六大核心能力' : 
                 currentPage === 'profile' ? '用戶資料' :
                 currentPage === 'companies' ? '基本面分析' :
                 currentPage === 'reports' ? '報告中心' :
                 currentPage}
              </h2>
              <p className="text-slate-600 text-sm">企業持續經營能力分析</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">評估日期</div>
              <div className="text-lg font-semibold text-slate-800">2025-08-31</div>
            </div>
          </div>
        </div>

        {/* 內容區域 - 可滾動 */}
        <div className="flex-1 overflow-y-auto" style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(1px)'
        }}>
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessSustainabilityAssessment;
