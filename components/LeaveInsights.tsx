
import React, { useMemo } from 'react';
import { format, parseISO, startOfYear, endOfYear, getMonth, isSameYear } from 'date-fns';
import { LeaveEntry, LeaveType, ThemeConfig } from '../types';

interface LeaveInsightsProps {
  leaves: LeaveEntry[];
  entitlement: number;
  theme: ThemeConfig;
}

const LeaveInsights: React.FC<LeaveInsightsProps> = ({ leaves, entitlement, theme }) => {
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();

  const stats = useMemo(() => {
    const monthlyData = Array(12).fill(0);
    const typeData: Record<LeaveType, number> = {
      [LeaveType.ANNUAL]: 0,
      [LeaveType.EMERGENCY]: 0,
      [LeaveType.MEDICAL]: 0,
      [LeaveType.UNPAID]: 0,
      [LeaveType.OTHERS]: 0,
    };

    leaves.forEach(leave => {
      const date = parseISO(leave.date);
      if (isSameYear(date, new Date())) {
        monthlyData[getMonth(date)]++;
        typeData[leave.type]++;
      }
    });

    const totalUsed = monthlyData.reduce((a, b) => a + b, 0);

    return {
      monthlyData,
      typeData,
      totalUsed
    };
  }, [leaves, entitlement, currentMonthIdx]);

  const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  return (
    <div className={`${theme.card} rounded-3xl p-6 space-y-6 shadow-xl border border-white/20`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-black uppercase tracking-widest ${theme.text} opacity-70`}>Analytics</h3>
        <span className="text-[10px] font-black px-2 py-0.5 bg-black/5 rounded-full text-gray-500">{currentYear}</span>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Frequency</p>
        <div className="flex items-end justify-between h-16 gap-1 px-1">
          {stats.monthlyData.map((count, i) => {
            const height = count > 0 ? Math.min(100, (count / 5) * 100) : 5;
            const isCurrent = i === currentMonthIdx;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div 
                  className={`w-full rounded-full transition-all duration-700 ease-out ${isCurrent ? 'bg-teal-500 shadow-lg shadow-teal-500/30' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                  style={{ height: `${height}%` }}
                />
                <span className={`text-[8px] font-black ${isCurrent ? 'text-teal-600' : 'text-gray-400'}`}>{monthNames[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100/50 space-y-4">
        <div className="flex justify-between items-baseline">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type Breakdown</p>
          <span className="text-[10px] font-black text-gray-900">{stats.totalUsed} Days Total</span>
        </div>
        <div className="space-y-2.5">
          {Object.entries(stats.typeData).filter(([_, count]) => count > 0).map(([type, count]) => (
            <div key={type} className="group">
              <div className="flex justify-between text-[10px] font-bold text-gray-700 mb-1.5">
                <span className="opacity-60">{type}</span>
                <span>{count}</span>
              </div>
              <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-800 transition-all duration-700 group-hover:bg-teal-500" 
                  style={{ width: `${(count / stats.totalUsed) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {stats.totalUsed === 0 && <p className="text-[10px] text-gray-400 italic text-center py-2">No leave records found.</p>}
        </div>
      </div>
    </div>
  );
};

export default LeaveInsights;
