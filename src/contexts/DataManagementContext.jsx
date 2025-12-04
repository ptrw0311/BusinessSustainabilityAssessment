import { createContext, useContext, useState } from 'react';

/**
 * 資料管理 Context
 * 管理財務數據、篩選器、CRUD操作等狀態
 */
const DataManagementContext = createContext(null);

export const DataManagementProvider = ({ children }) => {
  // 資料狀態
  const [financialData, setFinancialData] = useState([]);
  const [financialBasicsData, setFinancialBasicsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 篩選器狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // 模態框狀態
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // 刷新觸發器
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 清除所有篩選器
  const clearFilters = () => {
    setYearFilter('');
    setCompanyFilter('');
    setSearchTerm('');
    setStatusFilter('');
  };

  // 數字格式化函數
  const formatNumber = (num) => {
    if (num === null || num === undefined || num === '') return 'N/A';
    return new Intl.NumberFormat('zh-TW').format(num);
  };

  const value = {
    // 資料狀態
    financialData,
    setFinancialData,
    financialBasicsData,
    setFinancialBasicsData,
    loading,
    setLoading,
    error,
    setError,

    // 篩選器
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    yearFilter,
    setYearFilter,
    companyFilter,
    setCompanyFilter,
    clearFilters,

    // 模態框
    editingItem,
    setEditingItem,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    showAddModal,
    setShowAddModal,

    // 刷新
    refreshTrigger,
    setRefreshTrigger,

    // 工具函數
    formatNumber
  };

  return (
    <DataManagementContext.Provider value={value}>
      {children}
    </DataManagementContext.Provider>
  );
};

/**
 * 使用資料管理狀態的 Hook
 */
export const useDataManagement = () => {
  const context = useContext(DataManagementContext);
  if (!context) {
    throw new Error('useDataManagement must be used within DataManagementProvider');
  }
  return context;
};
