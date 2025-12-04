import { createContext, useContext, useState } from 'react';

/**
 * UI 狀態管理 Context
 * 管理當前頁面、導航、選單展開等UI狀態
 */
const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  // 頁面導航
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 資料管理選單
  const [dataManagementExpanded, setDataManagementExpanded] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState('pl_income_basics');

  // 切換資料類型
  const handleDataTypeChange = (dataType) => {
    setSelectedDataType(dataType);
    setCurrentPage(dataType);
  };

  // 切換資料管理選單展開狀態
  const toggleDataManagement = () => {
    setDataManagementExpanded(!dataManagementExpanded);
  };

  const value = {
    // 頁面狀態
    currentPage,
    setCurrentPage,

    // 資料管理選單
    dataManagementExpanded,
    setDataManagementExpanded,
    toggleDataManagement,
    selectedDataType,
    setSelectedDataType,
    handleDataTypeChange
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

/**
 * 使用 UI 狀態的 Hook
 */
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};
