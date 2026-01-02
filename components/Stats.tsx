
import React from 'react';
import { ThemeConfig } from '../types';

interface StatsProps {
  entitlement: number;
  used: number;
  balance: number;
  theme: ThemeConfig;
  updateEntitlement: (val: number) => void;
}

const Stats: React.FC<StatsProps> = ({ entitlement, used, balance, theme, updateEntitlement }) => {
  const usagePercentage = entitlement > 0 ? (used / entitlement) * 100 : 0;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* Total Entitlement */}
      <div className={`${theme.card} rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-white/20 shadow-xl shadow-black/5 flex flex-col justify-between`}>
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tight sm:tracking-widest">Entitlement</p>
          <div className="hidden sm:block p-1.5 bg-cyan-50 rounded-lg text-cyan-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          <input 
            type="number" 
            value={entitlement} 
            onChange={(e) => updateEntitlement(parseInt(e.target.value) || 0)}
            className="text-xl sm:text-3xl font-black bg-transparent border-none p-0 w-10 sm:w-16 outline-none text-gray-900 focus:text-teal-600 transition-colors"
          />
          <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">Days</span>
        </div>
      </div>

      {/* Used */}
      <div className={`${theme.card} rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-white/20 shadow-xl shadow-black/5 flex flex-col justify-between`}>
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tight sm:tracking-widest">Used</p>
          <div className="hidden sm:block p-1.5 bg-orange-50 rounded-lg text-orange-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          <span className="text-xl sm:text-3xl font-black text-gray-900">{used}</span>
          <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase">Days</span>
        </div>
        <div className="mt-2 sm:mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${Math.min(100, usagePercentage)}%` }} />
        </div>
      </div>

      {/* Balance */}
      <div className={`${theme.accent} rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-white/10 shadow-2xl shadow-black/10 text-white flex flex-col justify-between`}>
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <p className="text-[8px] sm:text-[10px] font-bold text-white/60 uppercase tracking-tight sm:tracking-widest">Balance</p>
          <div className="hidden sm:block p-1.5 bg-white/20 rounded-lg text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 sm:gap-1">
          <span className="text-xl sm:text-3xl font-black">{balance}</span>
          <span className="text-[8px] sm:text-[10px] font-black text-white/60 uppercase">Days</span>
        </div>
        <p className="hidden sm:block mt-3 text-[9px] font-bold text-white/40 uppercase tracking-wider">Available</p>
      </div>
    </div>
  );
};

export default Stats;
