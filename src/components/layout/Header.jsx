import { Activity } from 'lucide-react';

/**
 * 頁面頭部組件
 *
 * @param {Object} props
 * @param {string} props.currentPage - 當前頁面ID
 */
export const Header = ({ currentPage }) => {
  const pageTitles = {
    'dashboard': '六大核心能力',
    'profile': '用戶資料',
    'companies': '基本面分析',
    'data-management': '資料管理',
    'pl_income_basics': '損益基本數據',
    'financial_basics': '財務基本數據',
    'reports': '報表中心',
    'sources': '指標來源'
  };

  const pageTitle = pageTitles[currentPage] || currentPage;

  return (
    <header className="liquid-glass-card border-b border-white/20 px-6 py-5 shadow-xl backdrop-blur-xl text-neutral-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">
            {pageTitle}
          </h2>
          <p className="text-neutral-600 text-sm font-medium mt-1">企業持續經營能力分析</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-500 font-medium">評估日期</div>
          <div className="text-xl font-bold text-neutral-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            {new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}-01
          </div>
        </div>
      </div>
    </header>
  );
};
