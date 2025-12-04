import { Plus, Edit, Trash2, AlertTriangle, Database } from 'lucide-react';
import { Button, Loading } from '../ui';

/**
 * 資料管理頁面
 * 通用的資料管理頁面，支援損益基本數據和財務基本數據兩種類型
 *
 * @param {Object} props
 * @param {string} props.dataType - 資料類型 ('pl_income' 或 'financial')
 * @param {string} props.pageTitle - 頁面標題
 * @param {Array} props.data - 資料陣列
 * @param {boolean} props.loading - 載入狀態
 * @param {string} props.error - 錯誤訊息
 * @param {string} props.yearFilter - 年度篩選值
 * @param {string} props.companyFilter - 公司篩選值
 * @param {Function} props.onYearFilterChange - 年度篩選變更回調
 * @param {Function} props.onCompanyFilterChange - 公司篩選變更回調
 * @param {Function} props.onClearFilters - 清除篩選回調
 * @param {Function} props.onAdd - 新增資料回調
 * @param {Function} props.onEdit - 編輯資料回調
 * @param {Function} props.onDelete - 刪除資料回調
 * @param {Function} props.onReload - 重新載入回調
 * @param {Function} props.formatNumber - 數字格式化函數
 */
export const DataManagementPage = ({
  dataType,
  pageTitle,
  data,
  loading,
  error,
  yearFilter,
  companyFilter,
  onYearFilterChange,
  onCompanyFilterChange,
  onClearFilters,
  onAdd,
  onEdit,
  onDelete,
  onReload,
  formatNumber
}) => {
  // 取得唯一的年度和公司名稱選項
  const uniqueYears = [...new Set(data.map(item => item.fiscal_year))].filter(Boolean).sort((a, b) => b - a);
  const uniqueCompanies = [...new Set(data.map(item => item.company_name))].filter(Boolean).sort();

  // 過濾資料邏輯
  const filteredData = data.filter(item => {
    const yearMatch = !yearFilter || item.fiscal_year?.toString() === yearFilter;
    const companyMatch = !companyFilter || item.company_name === companyFilter;
    return yearMatch && companyMatch;
  });

  // 根據資料類型定義表頭
  const getTableHeaders = () => {
    if (dataType === 'pl_income') {
      return [
        { key: 'fiscal_year', label: '年度' },
        { key: 'company_name', label: '公司名稱' },
        { key: 'operating_revenue_total', label: '營業收入合計' },
        { key: 'operating_costs_total', label: '營業成本合計' },
        { key: 'gross_profit_loss', label: '營業毛利(毛損)' },
        { key: 'gross_profit_loss_net', label: '營業毛利(毛損)淨額' }
      ];
    } else {
      return [
        { key: 'fiscal_year', label: '年度' },
        { key: 'company_name', label: '公司名稱' },
        { key: 'cash_equivalents', label: '現金及約當現金' },
        { key: 'fvtpl_assets_current', label: '透過損益按公允價值衡量之金融資產-流動' },
        { key: 'fvoci_assets_current', label: '透過其它綜合損益按公允價值衡量之金融資產-流動' }
      ];
    }
  };

  const tableHeaders = getTableHeaders();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{pageTitle}</h2>
        <div className="flex space-x-3">
          <Button
            onClick={onAdd}
            variant="primary"
            icon={Plus}
            iconPosition="left"
          >
            新增資料
          </Button>
        </div>
      </div>

      {/* 過濾器區域 */}
      <div className="liquid-glass-card rounded-xl p-4 shadow-lg border border-slate-500/30">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-slate-700">年度</label>
            <select
              value={yearFilter}
              onChange={(e) => onYearFilterChange(e.target.value)}
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
              onChange={(e) => onCompanyFilterChange(e.target.value)}
              className="liquid-glass custom-select border border-slate-500/40 text-slate-800 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">所有公司</option>
              {uniqueCompanies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onClearFilters}
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
                {tableHeaders.map(header => (
                  <th key={header.key} className="px-6 py-4 text-left text-sm font-medium text-white">
                    {header.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-sm font-medium text-white">...</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={tableHeaders.length + 2} className="px-6 py-8 text-center text-slate-600">
                    <Loading type="dots" text="載入中..." />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={tableHeaders.length + 2} className="px-6 py-8 text-center text-red-600">
                    <div className="flex flex-col items-center space-y-2">
                      <AlertTriangle className="w-8 h-8" />
                      <div>連線錯誤: {error}</div>
                      <Button
                        onClick={onReload}
                        variant="primary"
                      >
                        重新載入
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length + 2} className="px-6 py-8 text-center text-slate-600">
                    <div className="flex flex-col items-center space-y-2">
                      <Database className="w-8 h-8" />
                      <div>目前沒有資料</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-100/50 transition-colors">
                    {tableHeaders.map(header => (
                      <td key={header.key} className={`px-6 py-4 text-sm ${header.key === 'company_name' ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                        {header.key === 'fiscal_year' || header.key === 'company_name'
                          ? (item[header.key] || 'N/A')
                          : formatNumber(item[header.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center text-sm text-slate-500">...</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                          title="編輯"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
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
};
