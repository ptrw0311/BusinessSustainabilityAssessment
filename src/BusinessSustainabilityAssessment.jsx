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
      revenue: '441.0億',
      growth: '+11%',
      marketCap: '44310億元',
      pe: '52.85',
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
      revenue: '968.7億',
      growth: '+2.8%',
      marketCap: '3115億元',
      pe: '23.7',
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
      name: '中華電信 Chunghwa Telecom',
      ticker: '2412',
      overallScore: 76,
      revenue: '2156億',
      growth: '+2.8%',
      marketCap: '8950億元',
      pe: '15.2',
      metrics: {
        營運能力: 82,
        財務能力: 85,
        未來力: 65,
        AI數位力: 78,
        ESG永續力: 88,
        創新能力: 68
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
    { value: 'CHT', label: '中華電信 Chunghwa Telecom' },
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
          <h2 className="text-2xl font-bold mb-6">用戶資料</h2>
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">張經理</h3>
                <p className="text-slate-400">投資分析師</p>
                <p className="text-slate-400">email@company.com</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">分析報告</div>
                <div className="text-2xl font-bold">156</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">評估公司</div>
                <div className="text-2xl font-bold">43</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentPage === 'companies') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">基本面分析</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(companyData).map((company) => (
              <div key={company.ticker} className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors cursor-pointer">
                <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                <p className="text-slate-400 mb-3">{company.ticker}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">評分: </span>
                  <span className="font-bold" style={{color: getScoreColor(company.overallScore)}}>
                    {company.overallScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (currentPage === 'reports') {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">報表中心</h2>
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">Q3 2025 企業評估報告</h3>
                <p className="text-slate-400 text-sm">2025-08-31</p>
              </div>
              <div className="text-green-400 font-semibold">已完成</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">科技股比較分析</h3>
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
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 mb-6">
          <div className="flex flex-row gap-8 items-center justify-center">
            <div className="flex items-center space-x-3">
              <label className="text-slate-300 font-medium">主要分析公司:</label>
              <select 
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {companyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <label className="text-slate-300 font-medium">比較公司:</label>
              <select 
                value={compareCompany}
                onChange={(e) => setCompareCompany(e.target.value)}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        {/* 公司概覽 - 比較模式 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 主要公司 */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-400">{companyData[selectedCompany].name}</h2>
                <p className="text-slate-300">{companyData[selectedCompany].ticker}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">營收</div>
                <div className="text-xl font-bold text-white">{companyData[selectedCompany].revenue}</div>
                <div className="text-green-400 text-sm font-medium">{companyData[selectedCompany].growth}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">市值</div>
                <div className="text-lg font-bold text-white">{companyData[selectedCompany].marketCap}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">本益比</div>
                <div className="text-lg font-bold text-white">{companyData[selectedCompany].pe}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">綜合評分</div>
                <div className="text-xl font-bold" style={{color: getScoreColor(companyData[selectedCompany].overallScore)}}>
                  {companyData[selectedCompany].overallScore}
                </div>
              </div>
            </div>
          </div>

          {/* 比較公司 */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-green-500 p-3 rounded-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-400">{companyData[compareCompany].name}</h2>
                <p className="text-slate-300">{companyData[compareCompany].ticker}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">營收</div>
                <div className="text-xl font-bold text-white">{companyData[compareCompany].revenue}</div>
                <div className="text-green-400 text-sm font-medium">{companyData[compareCompany].growth}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">市值</div>
                <div className="text-lg font-bold text-white">{companyData[compareCompany].marketCap}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">本益比</div>
                <div className="text-lg font-bold text-white">{companyData[compareCompany].pe}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">綜合評分</div>
                <div className="text-xl font-bold" style={{color: getScoreColor(companyData[compareCompany].overallScore)}}>
                  {companyData[compareCompany].overallScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 六大維度雷達圖 - 比較模式 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-6 text-center">六大核心能力比較雷達圖</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" stroke="#475569" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fontSize: 12, fill: '#e2e8f0' }}
                  className="text-sm"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                />
                <Radar
                  name={companyData[selectedCompany].name}
                  dataKey="主要公司"
                  stroke="#06d6a0"
                  fill="#06d6a0"
                  fillOpacity={0.4}
                  strokeWidth={3}
                  dot={{ fill: '#06d6a0', strokeWidth: 3, r: 5, fillOpacity: 1 }}
                />
                <Radar
                  name={companyData[compareCompany].name}
                  dataKey="比較公司"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 3, r: 4, fillOpacity: 1 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 維度評分詳情 - 比較模式 */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-6">維度評分比較</h3>
            <div className="space-y-4">
              {Object.entries(companyData[selectedCompany].metrics).map(([dimension, score]) => (
                <div key={dimension} 
                     className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-blue-400">
                      {dimensionIcons[dimension]}
                    </div>
                    <span className="font-medium text-lg">{dimension}</span>
                  </div>
                  
                  {/* 主要公司 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">{companyData[selectedCompany].name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-slate-600 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-400 transition-all duration-1000"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-[3rem] text-green-400">
                        {score}
                      </span>
                    </div>
                  </div>
                  
                  {/* 比較公司 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">{companyData[compareCompany].name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-slate-600 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-400 transition-all duration-1000"
                          style={{ width: `${companyData[compareCompany].metrics[dimension]}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold min-w-[3rem] text-blue-400">
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
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-6">評分趨勢</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[80, 86]} />
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
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 風險預警 */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
            <h3 className="text-xl font-bold mb-6">風險預警指標</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400">財務健康度</div>
                  <div className="text-sm text-slate-300">流動比率、ROE表現優異</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-medium text-yellow-400">ESG關注點</div>
                  <div className="text-sm text-slate-300">能源效率需要持續改善</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-green-400">創新動能</div>
                  <div className="text-sm text-slate-300">研發投入與專利成長強勁</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 評估標準 */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h3 className="text-xl font-bold mb-6">評分標準</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(performanceColors).map(([level, color]) => (
              <div key={level} className="flex items-center space-x-2 p-3 bg-slate-700 rounded-lg">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{backgroundColor: color}}
                />
                <div>
                  <div className="font-medium text-sm">{level}</div>
                  <div className="text-xs text-slate-400">
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
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex">
      {/* 左側邊欄 */}
      <div className="w-64 bg-slate-800 shadow-xl border-r border-slate-700 flex flex-col h-screen overflow-hidden">
        {/* Logo區域 */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">企業評估平台</h1>
              <p className="text-xs text-slate-400">v6.0</p>
            </div>
          </div>
        </div>

        {/* 搜尋框 */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full bg-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
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
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group relative ${
                  currentPage === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <div className={currentPage === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <div className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </div>
                )}
                {currentPage === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 底部用戶資訊 */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Audit01</div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold capitalize">
                {currentPage === 'dashboard' ? '儀表板' : 
                 currentPage === 'profile' ? '用戶資料' :
                 currentPage === 'companies' ? '公司管理' :
                 currentPage === 'reports' ? '報告中心' :
                 currentPage}
              </h2>
              <p className="text-blue-100 text-sm">企業持續經營能力分析</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">評估日期</div>
              <div className="text-lg font-semibold">2025-08-31</div>
            </div>
          </div>
        </div>

        {/* 內容區域 - 可滾動 */}
        <div className="flex-1 overflow-y-auto">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessSustainabilityAssessment;
