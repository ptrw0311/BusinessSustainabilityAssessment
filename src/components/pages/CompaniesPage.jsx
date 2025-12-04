import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

/**
 * 基本面分析頁面
 * 顯示公司財務基本面數據的圖表分析
 *
 * @param {Object} props
 * @param {string} props.selectedCompany - 當前選擇的公司代碼
 * @param {Function} props.onCompanyChange - 公司選擇變更回調
 * @param {Array} props.companyOptions - 公司選項列表
 * @param {Object} props.fundamentalData - 基本面數據對象
 * @param {Function} props.safeGetCompanyData - 安全獲取公司數據的函數
 * @param {Function} props.getCompanyBasicFinancialData - 獲取公司基本財務數據的函數
 */
export const CompaniesPage = ({
  selectedCompany,
  onCompanyChange,
  companyOptions,
  fundamentalData,
  safeGetCompanyData,
  getCompanyBasicFinancialData
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-end mb-6">
        <select
          value={selectedCompany}
          onChange={(e) => onCompanyChange(e.target.value)}
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
              {safeGetCompanyData(selectedCompany).name}
            </div>
          </div>
          <div className="warm-gradient-card p-4 rounded-lg">
            <div className="text-slate-600 text-sm">淨值</div>
            <div className="text-2xl font-bold text-slate-800">
              {getCompanyBasicFinancialData(selectedCompany).bookValue}
            </div>
          </div>
          <div className="warm-gradient-card p-4 rounded-lg">
            <div className="text-slate-600 text-sm">本益比</div>
            <div className="text-2xl font-bold text-slate-800">
              P/E: {getCompanyBasicFinancialData(selectedCompany).pe}
            </div>
          </div>
          <div className="warm-gradient-card p-4 rounded-lg">
            <div className="text-slate-600 text-sm">每股盈餘</div>
            <div className="text-2xl font-bold text-slate-800">
              EPS: {getCompanyBasicFinancialData(selectedCompany).eps}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
