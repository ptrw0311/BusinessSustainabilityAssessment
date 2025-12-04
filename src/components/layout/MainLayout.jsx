import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * 主版面布局組件
 * 整合側邊欄、頭部和內容區域
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 頁面內容
 * @param {string} props.currentPage - 當前頁面ID
 * @param {Function} props.onPageChange - 頁面切換回調
 * @param {boolean} props.dataManagementExpanded - 資料管理選單是否展開
 * @param {Function} props.onDataManagementToggle - 資料管理選單展開/收合回調
 * @param {Function} props.onDataTypeChange - 資料類型切換回調
 */
export const MainLayout = ({
  children,
  currentPage,
  onPageChange,
  dataManagementExpanded,
  onDataManagementToggle,
  onDataTypeChange
}) => {
  return (
    <div className="min-h-screen dynamic-bg text-neutral-900 flex">
      {/* 左側邊欄 */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={onPageChange}
        dataManagementExpanded={dataManagementExpanded}
        onDataManagementToggle={onDataManagementToggle}
        onDataTypeChange={onDataTypeChange}
      />

      {/* 主要內容區域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header currentPage={currentPage} />

        {/* 內容區域 - 可滾動 */}
        <section className="flex-1 overflow-y-auto bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
          {children}
        </section>
      </main>
    </div>
  );
};
