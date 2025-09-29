'use client'

import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, AlertTriangle, CheckCircle, BarChart3, Zap, Leaf, Lightbulb, User, Building, FileText, Settings, History, MessageSquare, Star, LogOut, Search, Activity, Target, Database, Plus, Edit, Trash2, Eye, Download, Filter, ChevronDown, ChevronRight, DollarSign, Calculator } from 'lucide-react';
import { supabase } from './supabaseClient';
// 新的服務層導入
import { 
  processCompanyMetrics, 
  processComparisonData, 
  formatComparisonRadarData,
  generateCompanyReport 
} from './services/calculationService.js';
import { 
  getCompanyAllMetrics,
  getFinancialBasicsData,
  getPLIncomeBasicsData,
  updateFinancialBasicsRecord,
  handleDataServiceError
} from './services/dataService.js';
import {
  COMPANIES,
  DEFAULT_QUERY_PARAMS,
  getScoreLevel,
  SCORE_LEVELS
} from './config/businessLogic.js';
import DimensionComparisonTable from './components/DimensionComparisonTable.jsx';

const BusinessSustainabilityAssessment = () => {
  // 使用新的公司代碼系統
  const [selectedCompany, setSelectedCompany] = useState('FET'); // 遠傳電信
  const [compareCompany, setCompareCompany] = useState('TSMC'); // 台積電
  
  // 新增動態資料狀態
  const [companyMetrics, setCompanyMetrics] = useState({});
  const [comparisonData, setComparisonData] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [dataManagementExpanded, setDataManagementExpanded] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState('pl_income_basics');

  // 當頁面切換到資料管理的子項目時，自動展開資料管理選單
  useEffect(() => {
    if (currentPage === 'pl_income_basics' || currentPage === 'financial_basics') {
      setDataManagementExpanded(true);
    }
  }, [currentPage]);

  // 數字格式化函數 - 加上千分位逗號
  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 財務數據格式化函數
  const formatCurrency = (amount) => {
    if (!amount || amount === '待確認') return '待確認';
    if (amount === 'N/A') return 'N/A';
    if (amount >= 1000000000000) { // 兆
      return `${(amount / 1000000000000).toFixed(2)} 兆元`;
    } else if (amount >= 100000000) { // 億
      return `${(amount / 100000000).toFixed(0)} 億元`;
    } else if (amount >= 10000) { // 萬
      return `${(amount / 10000).toFixed(0)} 萬元`;
    } else {
      return `${amount.toLocaleString()} 元`;
    }
  };

  // 獲取公司財務數據
  const getCompanyFinancialData = (companyKey) => {
    const company = COMPANIES[companyKey];
    if (!company) return { revenue: 'N/A', netWorth: 'N/A', eps: 'N/A' };
    
    // 財務數據對應 (基於dataService.js中的real data)
    const financialData = {
      'FET': {
        revenue: 104623000000, // 1046.23億元
        netWorth: 43000000000, // 430億元
        eps: 3.56
      },
      'TSMC': {
        revenue: 2540000000000, // 2.54兆元
        netWorth: 320000000000, // 3200億元
        eps: 32.5
      },
      'TWM': {
        revenue: 75000000000, // 750億元
        netWorth: 35000000000, // 350億元
        eps: 2.8
      },
      'FOXCONN': {
        revenue: '待確認', 
        netWorth: '待確認', 
        eps: '待確認'
      }
    };

    return financialData[companyKey] || { revenue: 'N/A', netWorth: 'N/A', eps: 'N/A' };
  };

  // 完整的欄位對應表 (基於資料庫結構)
  const fieldLabels = {
    fiscal_year: '會計年度',
    tax_id: '統一編號', 
    company_name: '公司名稱',
    account_item: '帳戶項目',
    operating_revenue_total: '營業收入合計',
    operating_costs_total: '營業成本合計',
    gross_profit_loss: '營業毛利(毛損)',
    gross_profit_loss_net: '營業毛利(毛損)淨額',
    selling_expenses: '推銷費用',
    general_admin_expenses: '管理費用',
    r_and_d_expenses: '研發費用',
    expected_credit_loss_net: '預期信用損失',
    operating_expenses_total: '營業費用合計',
    other_income_expense_net: '其他收益及費損淨額',
    operating_income_loss: '營業利益(損失)',
    interest_income: '利息收入',
    other_income: '其他收入',
    other_gains_losses_net: '其他利益及損失淨額',
    finance_costs_net: '財務成本淨額',
    equity_method_share_net: '採用權益法之關聯企業及合資損益之份額淨額',
    nonop_income_expense_total: '營業外收入及支出合計',
    profit_before_tax: '稅前淨利(淨損)',
    income_tax_expense_total: '所得稅費用(利益)合計',
    net_income_cont_ops: '繼續營業單位本期淨利(淨損)',
    net_income: '本期淨利(淨損)'
  };

  // 財務基本數據欄位對應表
  const financialFieldLabels = {
    fiscal_year: '會計年度',
    tax_id: '統一編號',
    company_name: '公司名稱',
    cash_equivalents: '現金及約當現金',
    fvtpl_assets_current: '透過損益按公允價值衡量之金融資產-流動',
    fvoci_assets_current: '透過其它綜合損益按公允價值衡量之金融資產-流動',
    debt_investments_current: '按攤銷後成本衡量之金融資產-流動',
    accounts_receivable_net: '應收帳款淨額',
    accounts_receivable_related: '應收帳款-關係人',
    other_receivables: '其他應收款',
    inventories: '存貨',
    prepaid_expenses: '預付款項',
    other_current_assets: '其他流動資產',
    current_assets_total: '流動資產合計',
    financial_assets_noncurrent: '透過損益按公允價值衡量之金融資產-非流動',
    debt_investments_noncurrent: '按攤銷後成本衡量之金融資產-非流動',
    equity_investments_fvoci: '透過其它綜合損益按公允價值衡量之權益工具投資',
    investments_accounted_equity: '採用權益法之投資',
    property_plant_equipment: '不動產、廠房及設備',
    right_of_use_assets: '使用權資產',
    intangible_assets: '無形資產',
    deferred_tax_assets: '遞延所得稅資產',
    other_noncurrent_assets: '其他非流動資產',
    noncurrent_assets_total: '非流動資產合計',
    assets_total: '資產總計'
  };
  
  // 資料管理相關狀態
  const [financialData, setFinancialData] = useState([]);
  const [financialBasicsData, setFinancialBasicsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  // 資料管理功能
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('pl_income_basics')
        .select('*');
      
      if (searchTerm) {
        query = query.ilike('company_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setFinancialData(data || []);
    } catch (err) {
      setError(err.message);
      console.error('獲取資料錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (updatedData) => {
    try {
      const tableName = (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') ? 'financial_basics' : 'pl_income_basics';
      const { error } = await supabase
        .from(tableName)
        .update(updatedData)
        .eq('id', editingItem.id);
      
      if (error) {
        throw error;
      }
      
      setShowEditModal(false);
      setEditingItem(null);
      if (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') {
        await fetchFinancialBasicsData();
      } else {
        await fetchFinancialData();
      }
      alert('資料更新成功！');
    } catch (err) {
      alert('更新失敗: ' + err.message);
    }
  };

  const deleteRecord = async (item) => {
    try {
      const tableName = (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') ? 'financial_basics' : 'pl_income_basics';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('fiscal_year', item.fiscal_year)
        .eq('tax_id', item.tax_id)
        .eq('company_name', item.company_name);
      
      if (error) {
        throw error;
      }
      
      setShowDeleteModal(false);
      setDeleteItem(null);
      if (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') {
        await fetchFinancialBasicsData();
      } else {
        await fetchFinancialData();
      }
      alert('資料刪除成功！');
    } catch (err) {
      alert('刪除失敗: ' + err.message);
    }
  };

  const addRecord = async (newData) => {
    try {
      const tableName = (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') ? 'financial_basics' : 'pl_income_basics';
      const { error } = await supabase
        .from(tableName)
        .insert([newData]);
      
      if (error) {
        throw error;
      }
      
      setShowAddModal(false);
      setNewItem({});
      if (currentPage === 'financial_basics' || selectedDataType === 'financial_basics') {
        await fetchFinancialBasicsData();
      } else {
        await fetchFinancialData();
      }
      alert('資料新增成功！');
    } catch (err) {
      alert('新增失敗: ' + err.message);
    }
  };

  // 財務基本數據獲取功能
  const fetchFinancialBasicsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('financial_basics')
        .select('*');
      
      if (searchTerm) {
        query = query.ilike('company_name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setFinancialBasicsData(data || []);
    } catch (err) {
      setError(err.message);
      console.error('獲取財務基本數據錯誤:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFinancialBasicsRecord = async (updatedData) => {
    try {
      const { error } = await supabase
        .from('financial_basics')
        .update(updatedData)
        .eq('id', editingItem.id);
      
      if (error) {
        throw error;
      }
      
      setShowEditModal(false);
      setEditingItem(null);
      await fetchFinancialBasicsData();
      alert('資料更新成功！');
    } catch (err) {
      alert('更新失敗: ' + err.message);
    }
  };

  const deleteFinancialBasicsRecord = async (item) => {
    try {
      const { error } = await supabase
        .from('financial_basics')
        .delete()
        .eq('fiscal_year', item.fiscal_year)
        .eq('tax_id', item.tax_id)
        .eq('company_name', item.company_name);
      
      if (error) {
        throw error;
      }
      
      setShowDeleteModal(false);
      setDeleteItem(null);
      await fetchFinancialBasicsData();
      alert('資料刪除成功！');
    } catch (err) {
      alert('刪除失敗: ' + err.message);
    }
  };

  const handleAdd = () => {
    setNewItem({});
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  // 載入公司指標數據的函數
  const loadCompanyMetrics = async (companyKey) => {
    try {
      setMetricsLoading(true);
      setMetricsError(null);
      
      const company = COMPANIES[companyKey];
      if (!company) {
        throw new Error(`公司 ${companyKey} 不存在`);
      }
      
      // 使用新的服務層獲取數據
      const metrics = await processCompanyMetrics(company.taxId, DEFAULT_QUERY_PARAMS.fiscal_year);
      
      // 更新狀態
      setCompanyMetrics(prev => ({
        ...prev,
        [companyKey]: metrics
      }));
      
    } catch (error) {
      console.error(`載入 ${companyKey} 指標數據錯誤:`, error);
      setMetricsError(`載入 ${companyKey} 資料失敗: ${error.message}`);
    } finally {
      setMetricsLoading(false);
    }
  };

  // 載入比較數據的函數
  const loadComparisonData = async (primaryCompany, compareCompany) => {
    try {
      const primaryCompanyData = COMPANIES[primaryCompany];
      const compareCompanyData = COMPANIES[compareCompany];
      
      if (!primaryCompanyData || !compareCompanyData) {
        throw new Error('公司資料不完整');
      }
      
      const comparisonData = await processComparisonData(
        primaryCompanyData.taxId, 
        compareCompanyData.taxId,
        DEFAULT_QUERY_PARAMS.fiscal_year
      );
      
      setComparisonData(comparisonData);
      
    } catch (error) {
      console.error('載入比較數據錯誤:', error);
      setMetricsError(`載入比較資料失敗: ${error.message}`);
    }
  };

  // 當公司選擇改變時自動載入數據
  useEffect(() => {
    if (currentPage === 'dashboard') {
      loadCompanyMetrics(selectedCompany);
      loadCompanyMetrics(compareCompany);
      loadComparisonData(selectedCompany, compareCompany);
    }
  }, [selectedCompany, compareCompany, currentPage]);

  // 當進入資料管理頁面時自動獲取資料
  useEffect(() => {
    if (currentPage === 'data-management' || currentPage === 'pl_income_basics' || currentPage === 'financial_basics') {
      if (currentPage === 'pl_income_basics' || (currentPage === 'data-management' && selectedDataType === 'pl_income_basics')) {
        fetchFinancialData();
      }
      if (currentPage === 'financial_basics' || (currentPage === 'data-management' && selectedDataType === 'financial_basics')) {
        fetchFinancialBasicsData();
      }
    }
  }, [currentPage, searchTerm, selectedDataType]);

  // 動態公司資料 (從新的配置和服務獲取)
  const getCompanyDisplayData = (companyKey) => {
    const company = COMPANIES[companyKey];
    const metrics = companyMetrics[companyKey];
    
    if (!company) return null;
    
    return {
      name: company.name,
      ticker: company.ticker,
      taxId: company.taxId,
      overallScore: metrics?.overall_score || 0,
      scoreLevel: metrics?.score_level || getScoreLevel(0),
      // 維度分數
      metrics: metrics?.dimension_scores || {
        營運能力: 0,
        財務能力: 0,
        未來力: 0,
        AI數位力: 0,
        ESG永續力: 0,
        創新能力: 0
      },
      // 原始指標資料
      rawMetrics: metrics,
      // 載入狀態
      loading: metricsLoading,
      error: metricsError
    };
  };
  
  // 公司資料映射
  const companyData = {
    FET: getCompanyDisplayData('FET'),
    TSMC: getCompanyDisplayData('TSMC'),
    TWM: getCompanyDisplayData('TWM'),
    FOXCONN: getCompanyDisplayData('FOXCONN'),
    // 向後相容的別名
    NVDA: getCompanyDisplayData('FET'), // 映射到遠傳
    CHT: getCompanyDisplayData('TSMC') // 映射到台積電
  };
  
  // 安全獲取公司資料的輔助函數
  const safeGetCompanyData = (companyKey) => {
    const data = companyData[companyKey];
    if (!data) {
      return {
        name: '載入中...',
        ticker: companyKey,
        overallScore: 0,
        metrics: {
          營運能力: 0,
          財務能力: 0,
          未來力: 0,
          AI數位力: 0,
          ESG永續力: 0,
          創新能力: 0
        },
        loading: true
      };
    }
    return data;
  };

  const companyOptions = [
    { value: 'FET', label: '遠傳電信 Far EasTone' },
    { value: 'TSMC', label: '台積電 TSMC' },
    { value: 'TWM', label: '台灣大哥大 Taiwan Mobile' },
    { value: 'FOXCONN', label: '富鴻網 FOXCONN' }
  ];

  const compareOptions = [
    { value: 'TSMC', label: '台積電 TSMC' },
    { value: 'TWM', label: '台灣大哥大 Taiwan Mobile' },
    { value: 'FET', label: '遠傳電信 FET' },
    { value: 'FOXCONN', label: '富鴻網 FOXCONN' }
  ];

  // 獲取雷達圖資料
  const getRadarData = () => {
    const primaryData = getCompanyDisplayData(selectedCompany);
    const compareData = getCompanyDisplayData(compareCompany);
    
    if (!primaryData || !compareData) {
      // 預設空資料
      return [
        { dimension: '營運能力', 主要公司: 0, 比較公司: 0, fullMark: 100 },
        { dimension: '財務能力', 主要公司: 0, 比較公司: 0, fullMark: 100 },
        { dimension: '未來力', 主要公司: 0, 比較公司: 0, fullMark: 100 },
        { dimension: 'AI數位力', 主要公司: 0, 比較公司: 0, fullMark: 100 },
        { dimension: 'ESG永續力', 主要公司: 0, 比較公司: 0, fullMark: 100 },
        { dimension: '創新能力', 主要公司: 0, 比較公司: 0, fullMark: 100 }
      ];
    }
    
    // 使用動態資料構建雷達圖
    return [
      { 
        dimension: '營運能力', 
        主要公司: Math.round(primaryData.metrics.營運能力 || 0), 
        比較公司: Math.round(compareData.metrics.營運能力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: '財務能力', 
        主要公司: Math.round(primaryData.metrics.財務能力 || 0), 
        比較公司: Math.round(compareData.metrics.財務能力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: '未來力', 
        主要公司: Math.round(primaryData.metrics.未來力 || 0), 
        比較公司: Math.round(compareData.metrics.未來力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: 'AI數位力', 
        主要公司: Math.round(primaryData.metrics.AI數位力 || 0), 
        比較公司: Math.round(compareData.metrics.AI數位力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: 'ESG永續力', 
        主要公司: Math.round(primaryData.metrics.ESG永續力 || 0), 
        比較公司: Math.round(compareData.metrics.ESG永續力 || 0), 
        fullMark: 100 
      },
      { 
        dimension: '創新能力', 
        主要公司: Math.round(primaryData.metrics.創新能力 || 0), 
        比較公司: Math.round(compareData.metrics.創新能力 || 0), 
        fullMark: 100 
      }
    ];
  };

  const radarData = getRadarData();

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
    { id: 'companies', label: '基本面分析', icon: <Building className="w-5 h-5" /> },
    { 
      id: 'data-management', 
      label: '資料管理', 
      icon: <Database className="w-5 h-5" />,
      expandable: true,
      subItems: [
        { id: 'pl_income_basics', label: '損益基本數據', icon: <DollarSign className="w-4 h-4" /> },
        { id: 'financial_basics', label: '財務基本數據', icon: <Calculator className="w-4 h-4" /> }
      ]
    },
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
    
    if (currentPage === 'financial_basics') {
      // 取得唯一的年度和公司名稱選項
      const uniqueYears = [...new Set(financialBasicsData.map(item => item.fiscal_year))].filter(Boolean).sort((a, b) => b - a);
      const uniqueCompanies = [...new Set(financialBasicsData.map(item => item.company_name))].filter(Boolean).sort();

      // 過濾資料邏輯
      const filteredData = financialBasicsData.filter(item => {
        const yearMatch = !yearFilter || item.fiscal_year?.toString() === yearFilter;
        const companyMatch = !companyFilter || item.company_name === companyFilter;
        return yearMatch && companyMatch;
      });

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">財務基本數據</h2>
            <div className="flex space-x-3">
              <button 
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>新增資料</span>
              </button>
            </div>
          </div>

          {/* 過濾器區域 */}
          <div className="liquid-glass-card rounded-xl p-4 shadow-lg border border-slate-500/30">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">年度</label>
                <select 
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">所有年度</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">公司名稱</label>
                <select 
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">所有公司</option>
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => {
                  setYearFilter('');
                  setCompanyFilter('');
                }}
                className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                清除篩選
              </button>
            </div>
          </div>

          {/* 資料表格 */}
          <div className="liquid-glass-card rounded-xl shadow-lg border border-slate-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">年度</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">公司名稱</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">現金及約當現金</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">透過損益按公允價值衡量之金融資產-流動</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">透過其它綜合損益按公允價值衡量之金融資產-流動</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white">...</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-600">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="ml-2">載入中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-red-600">
                        <div className="flex flex-col items-center space-y-2">
                          <AlertTriangle className="w-8 h-8" />
                          <div>連線錯誤: {error}</div>
                          <button 
                            onClick={fetchFinancialBasicsData}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            重新載入
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-slate-600">
                        <div className="flex flex-col items-center space-y-2">
                          <Database className="w-8 h-8" />
                          <div>目前沒有資料</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-100/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900">{item.fiscal_year || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.company_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.cash_equivalents)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.fvtpl_assets_current)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.fvoci_assets_current)}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-500">...</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors" 
                              title="編輯"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors" 
                              title="刪除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分頁控制 */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                顯示 1-{filteredData.length} 筆，共 {filteredData.length} 筆資料
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">
                  上一頁
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">
                  下一頁
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (currentPage === 'data-management' || currentPage === 'pl_income_basics') {
      // 取得唯一的年度和公司名稱選項
      const uniqueYears = [...new Set(financialData.map(item => item.fiscal_year))].filter(Boolean).sort((a, b) => b - a);
      const uniqueCompanies = [...new Set(financialData.map(item => item.company_name))].filter(Boolean).sort();

      // 過濾資料邏輯
      const filteredData = financialData.filter(item => {
        const yearMatch = !yearFilter || item.fiscal_year?.toString() === yearFilter;
        const companyMatch = !companyFilter || item.company_name === companyFilter;
        return yearMatch && companyMatch;
      });

      return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {currentPage === 'pl_income_basics' ? '損益基本數據' : '資料管理'}
            </h2>
            <div className="flex space-x-3">
              <button 
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>新增資料</span>
              </button>
            </div>
          </div>

          {/* 過濾器區域 */}
          <div className="liquid-glass-card rounded-xl p-4 shadow-lg border border-slate-500/30">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">年度</label>
                <select 
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">所有年度</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">公司名稱</label>
                <select 
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">所有公司</option>
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => {
                  setYearFilter('');
                  setCompanyFilter('');
                }}
                className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                清除篩選
              </button>
            </div>
          </div>

          {/* 資料表格 */}
          <div className="liquid-glass-card rounded-xl shadow-lg border border-slate-500/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">年度</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">公司名稱</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">營業收入合計</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">營業成本合計</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">營業毛利(毛損)</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">營業毛利(毛損)淨額</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white">...</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-slate-600">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <span className="ml-2">載入中...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-red-600">
                        <div className="flex flex-col items-center space-y-2">
                          <AlertTriangle className="w-8 h-8" />
                          <div>連線錯誤: {error}</div>
                          <button 
                            onClick={fetchFinancialData}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            重新載入
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-slate-600">
                        <div className="flex flex-col items-center space-y-2">
                          <Database className="w-8 h-8" />
                          <div>目前沒有資料</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-100/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900">{item.fiscal_year || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.company_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.operating_revenue_total)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.operating_costs_total)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.gross_profit_loss)}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{formatNumber(item.gross_profit_loss_net)}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-500">...</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors" 
                              title="編輯"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors" 
                              title="刪除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 分頁控制 */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                顯示 1-{filteredData.length} 筆，共 {filteredData.length} 筆資料
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">
                  上一頁
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors">
                  下一頁
                </button>
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
              {safeGetCompanyData(selectedCompany).name} - 基本資訊
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">股票代號</div>
                <div className="text-2xl font-bold text-slate-800">
                  {safeGetCompanyData(selectedCompany).ticker}
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">淨值</div>
                <div className="text-2xl font-bold text-slate-800">
                  市值: 待計算
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">本益比</div>
                <div className="text-2xl font-bold text-slate-800">
                  P/E: 待計算
                </div>
              </div>
              <div className="warm-gradient-card p-4 rounded-lg">
                <div className="text-slate-600 text-sm">每股盈餘</div>
                <div className="text-2xl font-bold text-slate-800">
                  EPS: 待計算
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
    // 顯示載入狀態
    if (metricsLoading) {
      return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">載入企業指標資料中...</p>
            </div>
          </div>
        </div>
      );
    }
    
    // 顯示錯誤狀態
    if (metricsError) {
      return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="text-red-800 font-medium">資料載入失敗</h3>
            </div>
            <p className="text-red-700 mt-2">{metricsError}</p>
            <button 
              onClick={() => {
                setMetricsError(null);
                loadCompanyMetrics(selectedCompany);
                loadCompanyMetrics(compareCompany);
                loadComparisonData(selectedCompany, compareCompany);
              }}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      );
    }
    
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
                <h2 className="text-xl font-bold text-slate-800">{safeGetCompanyData(selectedCompany).name}</h2>
                <p className="text-slate-600">{safeGetCompanyData(selectedCompany).ticker}</p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* 左側三個卡片 */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">營收</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {safeGetCompanyData(selectedCompany).loading ? '載入中...' : formatCurrency(getCompanyFinancialData(selectedCompany).revenue)}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    {safeGetCompanyData(selectedCompany).loading ? '' : '2024年度營收'}
                  </div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">淨值</div>
                  <div className="text-xl font-bold text-slate-800">{formatCurrency(getCompanyFinancialData(selectedCompany).netWorth)}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">每股盈餘</div>
                  <div className="text-xl font-bold text-slate-800">
                    {getCompanyFinancialData(selectedCompany).eps === '待確認' ? '待確認' : `${getCompanyFinancialData(selectedCompany).eps} 元`}
                  </div>
                </div>
              </div>
              
              {/* 右側大圓形綜合評價 */}
              <div className="rounded-3xl p-8 flex flex-col items-center justify-center min-w-[200px] shadow-lg"
                   style={{
                     background: getPerformanceBackground(safeGetCompanyData(selectedCompany).overallScore),
                     backdropFilter: 'blur(16px)',
                     WebkitBackdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                   }}>
                <div className="text-white text-sm font-medium mb-2">綜合評價</div>
                <div className="text-2xl mb-2">
                  {safeGetCompanyData(selectedCompany).scoreLevel?.icon || '🚨'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {safeGetCompanyData(selectedCompany).scoreLevel?.level || '風險'}
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
                <h2 className="text-xl font-bold text-slate-800">{safeGetCompanyData(compareCompany).name}</h2>
                <p className="text-slate-600">{safeGetCompanyData(compareCompany).ticker}</p>
              </div>
            </div>

            <div className="flex gap-6">
              {/* 左側三個卡片 */}
              <div className="flex flex-col gap-4 flex-1">
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">營收</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {safeGetCompanyData(compareCompany).loading ? '載入中...' : formatCurrency(getCompanyFinancialData(compareCompany).revenue)}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">
                    {safeGetCompanyData(compareCompany).loading ? '' : '2024年度營收'}
                  </div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">淨值</div>
                  <div className="text-xl font-bold text-slate-800">{formatCurrency(getCompanyFinancialData(compareCompany).netWorth)}</div>
                </div>
                <div className="warm-gradient-card p-4 rounded-lg shadow-lg">
                  <div className="text-slate-600 text-sm font-medium">每股盈餘</div>
                  <div className="text-xl font-bold text-slate-800">
                    {getCompanyFinancialData(compareCompany).eps === '待確認' ? '待確認' : `${getCompanyFinancialData(compareCompany).eps} 元`}
                  </div>
                </div>
              </div>
              
              {/* 右側大圓形綜合評價 */}
              <div className="rounded-3xl p-8 flex flex-col items-center justify-center min-w-[200px] shadow-lg"
                   style={{
                     background: getPerformanceBackground(safeGetCompanyData(compareCompany).overallScore),
                     backdropFilter: 'blur(16px)',
                     WebkitBackdropFilter: 'blur(16px)',
                     border: '1px solid rgba(255, 255, 255, 0.3)',
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                   }}>
                <div className="text-white text-sm font-medium mb-2">綜合評價</div>
                <div className="text-2xl mb-2">
                  {safeGetCompanyData(compareCompany).scoreLevel?.icon || '🚨'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {safeGetCompanyData(compareCompany).scoreLevel?.level || '風險'}
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
                  name={safeGetCompanyData(compareCompany).name}
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

          {/* 維度評分詳情 - 比較模式 - Image #1 格式 */}
          <DimensionComparisonTable
            primaryCompany={safeGetCompanyData(selectedCompany)}
            compareCompany={safeGetCompanyData(compareCompany)}
          />
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
              <div key={item.id}>
                {/* 主選單項目 */}
                <button
                  onClick={() => {
                    if (item.expandable) {
                      setDataManagementExpanded(!dataManagementExpanded);
                    } else {
                      setCurrentPage(item.id);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group relative ${
                    (currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics')))
                      ? 'warm-gradient-card text-slate-800 shadow-lg' 
                      : 'text-slate-600 hover:warm-gradient-card hover:text-slate-800'
                  }`}
                >
                  <div className={(currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics'))) ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}>
                    {item.icon}
                  </div>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.expandable && (
                    <div className="text-slate-500 group-hover:text-slate-800">
                      {dataManagementExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  )}
                  {item.badge && (
                    <div className="ml-auto bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 text-xs px-2 py-1 rounded-full shadow-lg">
                      {item.badge}
                    </div>
                  )}
                  {(currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics'))) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r shadow-lg"></div>
                  )}
                </button>

                {/* 子選單項目 */}
                {item.expandable && dataManagementExpanded && item.subItems && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setCurrentPage(subItem.id);
                          setSelectedDataType(subItem.id);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-300 group relative ${
                          currentPage === subItem.id 
                            ? 'warm-gradient-card text-slate-800 shadow-lg border-l-2 border-slate-600' 
                            : 'text-slate-600 hover:warm-gradient-card hover:text-slate-800'
                        }`}
                      >
                        <div className={currentPage === subItem.id ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}>
                          {subItem.icon}
                        </div>
                        <span className="font-medium text-sm">{subItem.label}</span>
                        {currentPage === subItem.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-600 to-slate-800 rounded-r shadow-lg"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                 currentPage === 'data-management' ? '資料管理' :
                 currentPage === 'pl_income_basics' ? '損益基本數據' :
                 currentPage === 'financial_basics' ? '財務基本數據' :
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

      {/* 全域彈窗 - 編輯彈出視窗 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <h3 className="text-lg font-bold mb-4 text-slate-800">編輯資料</h3>
            <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentPage === 'financial_basics' ? financialFieldLabels : fieldLabels).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={editingItem?.[field] || ''}
                      onChange={(e) => setEditingItem({...editingItem, [field]: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  if (currentPage === 'financial_basics') {
                    updateFinancialBasicsRecord(editingItem);
                  } else {
                    updateRecord(editingItem);
                  }
                  setShowEditModal(false);
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                更新
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全域彈窗 - 刪除確認對話框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold text-slate-800">確認刪除</h3>
            </div>
            <p className="text-slate-600 mb-6">
              您確定要刪除這筆資料嗎？此操作無法復原。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (currentPage === 'financial_basics') {
                    deleteFinancialBasicsRecord(deleteItem);
                  } else {
                    deleteRecord(deleteItem);
                  }
                  setShowDeleteModal(false);
                  setDeleteItem(null);
                }}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                確認刪除
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteItem(null);
                }}
                className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 全域彈窗 - 新增資料彈出視窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <h3 className="text-lg font-bold mb-4 text-slate-800">新增資料</h3>
            <div className="overflow-y-auto max-h-[calc(90vh-150px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentPage === 'financial_basics' ? financialFieldLabels : fieldLabels).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                    <input
                      type="text"
                      value={newItem?.[field] || ''}
                      onChange={(e) => setNewItem({...newItem, [field]: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`請輸入${label}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  addRecord(newItem);
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                新增
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem({});
                }}
                className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-400 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSustainabilityAssessment;
