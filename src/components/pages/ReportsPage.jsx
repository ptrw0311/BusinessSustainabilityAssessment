/**
 * 報表中心頁面
 */
export const ReportsPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">報表中心</h2>
      <div className="space-y-4">
        <div className="liquid-glass-card rounded-xl p-4 flex justify-between items-center border border-slate-500/30 shadow-lg">
          <div>
            <h3 className="font-bold text-slate-800">Q3 2025 企業評估報告</h3>
            <p className="text-slate-600 text-sm">2025-08-31</p>
          </div>
          <div className="text-green-600 font-semibold">已完成</div>
        </div>
        <div className="liquid-glass-card rounded-xl p-4 flex justify-between items-center border border-slate-500/30 shadow-lg">
          <div>
            <h3 className="font-bold text-slate-800">科技股比較分析</h3>
            <p className="text-slate-600 text-sm">2025-08-28</p>
          </div>
          <div className="text-yellow-600 font-semibold">進行中</div>
        </div>
      </div>
    </div>
  );
};
