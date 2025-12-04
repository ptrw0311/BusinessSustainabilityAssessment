import { User } from 'lucide-react';

/**
 * 用戶資料頁面
 */
export const ProfilePage = () => {
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
};
