import {
  Building,
  Search,
  Target,
  Database,
  BookOpen,
  FileText,
  User,
  Calculator,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Settings
} from 'lucide-react';

/**
 * 側邊欄組件
 *
 * @param {Object} props
 * @param {string} props.currentPage - 當前選中的頁面
 * @param {Function} props.onPageChange - 頁面切換回調函數
 * @param {boolean} props.dataManagementExpanded - 資料管理選單是否展開
 * @param {Function} props.onDataManagementToggle - 資料管理選單展開/收合回調
 * @param {Function} props.onDataTypeChange - 資料類型切換回調
 */
export const Sidebar = ({
  currentPage,
  onPageChange,
  dataManagementExpanded,
  onDataManagementToggle,
  onDataTypeChange
}) => {
  // 雷達圖 SVG 圖示組件 - Fixed menu order
  const RadarIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(12, 12)">
        {/* Grid circles */}
        <circle cx="0" cy="0" r="9" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="0" cy="0" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="0" cy="0" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>

        {/* Grid lines (6 axes) */}
        <line x1="0" y1="0" x2="0" y2="-9" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        <line x1="0" y1="0" x2="7.8" y2="-4.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        <line x1="0" y1="0" x2="7.8" y2="4.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        <line x1="0" y1="0" x2="-7.8" y2="4.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
        <line x1="0" y1="0" x2="-7.8" y2="-4.5" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>

        {/* Radar data area */}
        <polygon points="0,-7.5 6,-3.75 5.25,4.5 0,6.75 -5.25,3.75 -6,-3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>

        {/* Data points */}
        <circle cx="0" cy="-7.5" r="1.2" fill="currentColor"/>
        <circle cx="6" cy="-3.75" r="1.2" fill="currentColor"/>
        <circle cx="5.25" cy="4.5" r="1.2" fill="currentColor"/>
        <circle cx="0" cy="6.75" r="1.2" fill="currentColor"/>
        <circle cx="-5.25" cy="3.75" r="1.2" fill="currentColor"/>
        <circle cx="-6" cy="-3" r="1.2" fill="currentColor"/>
      </g>
    </svg>
  );

  const menuItems = [
    { id: 'dashboard', label: '六大核心能力', icon: <RadarIcon className="w-5 h-5" />, active: true },
    { id: 'companies', label: '基本面分析', icon: <Building className="w-5 h-5" /> },
    { id: 'sources', label: '指標來源', icon: <BookOpen className="w-5 h-5" /> },
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
    { id: 'reports', label: '報表中心', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 liquid-glass-card shadow-xl border-r border-white/20 flex flex-col h-screen overflow-hidden backdrop-blur-xl text-neutral-800">
      {/* Logo區域 */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-3 rounded-xl shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">
              企業評估平台
            </h1>
            <p className="text-xs text-neutral-600 font-medium">Business Assessment</p>
          </div>
        </div>

        {/* 搜尋框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="搜尋功能..."
            className="form-input w-full pl-10 text-sm placeholder-neutral-500"
          />
        </div>
      </div>

      {/* 選單項目 - 無需滾動 */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* 主選單項目 */}
              <button
                onClick={() => {
                  if (item.expandable) {
                    onDataManagementToggle();
                  } else {
                    onPageChange(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-normal group relative ${
                  (currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics')))
                    ? 'warm-gradient-card text-neutral-800 shadow-lg transform hover:-translate-y-0.5'
                    : 'text-neutral-600 hover:warm-gradient-card hover:text-neutral-800 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className={(currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics'))) ? 'text-neutral-800' : 'text-neutral-500 group-hover:text-neutral-800'}>
                  {item.icon}
                </div>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {item.expandable && (
                  <div className="text-neutral-500 group-hover:text-neutral-800">
                    {dataManagementExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                )}
                {item.badge && (
                  <div className="ml-auto bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold">
                    {item.badge}
                  </div>
                )}
                {(currentPage === item.id || (item.expandable && (currentPage === 'pl_income_basics' || currentPage === 'financial_basics'))) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                )}
              </button>

              {/* 子選單項目 */}
              {item.expandable && dataManagementExpanded && item.subItems && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        onPageChange(subItem.id);
                        onDataTypeChange(subItem.id);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-normal group relative ${
                        currentPage === subItem.id
                          ? 'warm-gradient-card text-neutral-800 shadow-lg border-l-2 border-primary-500'
                          : 'text-neutral-600 hover:warm-gradient-card hover:text-neutral-800 hover:shadow-sm'
                      }`}
                    >
                      <div className={currentPage === subItem.id ? 'text-neutral-800' : 'text-neutral-500 group-hover:text-neutral-800'}>
                        {subItem.icon}
                      </div>
                      <span className="font-medium text-sm">{subItem.label}</span>
                      {currentPage === subItem.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 底部用戶資訊 */}
      <footer className="p-3 border-t border-white/20">
        <div className="flex items-center space-x-3 warm-gradient-card rounded-xl p-3 hover-lift">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-neutral-800">Audit01</div>
            <div className="text-xs text-neutral-600 font-medium">聯稽總部</div>
          </div>
          <button className="text-neutral-500 hover:text-neutral-700 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </aside>
  );
};
