
import React, { useMemo } from 'react';
import { 
  addDays, 
  subDays, 
  format, 
  isWeekend, 
  parseISO,
  isFuture,
  differenceInDays,
  isSameDay
} from 'date-fns';
import { Holiday, LeaveEntry, ThemeConfig } from '../types';

interface SuggestionProps {
  holidays: Holiday[];
  leaves: LeaveEntry[];
  theme: ThemeConfig;
}

interface Suggestion {
  holiday: Holiday;
  suggestion: string;
  type: 'natural' | 'bridge' | 'mega';
  datesToApply: Date[];
  impactDays: number;
}

const LongWeekendSuggestions: React.FC<SuggestionProps> = ({ holidays, leaves, theme }) => {
  const suggestions = useMemo(() => {
    const list: Suggestion[] = [];
    const now = new Date();
    const leaveDates = leaves.map(l => l.date);
    
    // Sort upcoming holidays
    const futureHolidays = holidays
      .map(h => ({ ...h, d: parseISO(h.date) }))
      .filter(h => isFuture(h.d))
      .sort((a, b) => a.d.getTime() - b.d.getTime());

    futureHolidays.forEach(h => {
      const day = h.d;
      const dayOfWeek = format(day, 'EEEE');
      
      // Check if user already has leave on this date - if so, maybe skip suggesting
      if (leaveDates.includes(format(day, 'yyyy-MM-dd'))) return;

      // 1. Natural Long Weekend (Fri or Mon holiday)
      if (dayOfWeek === 'Friday' || dayOfWeek === 'Monday') {
        list.push({ 
          holiday: h, 
          suggestion: `Enjoy a natural 3-day break!`,
          type: 'natural',
          datesToApply: [],
          impactDays: 3
        });
      }
      
      // 2. Bridge Day (Tuesday or Thursday holiday)
      else if (dayOfWeek === 'Tuesday') {
        const bridgeDay = subDays(day, 1);
        const bridgeDayStr = format(bridgeDay, 'yyyy-MM-dd');
        if (!leaveDates.includes(bridgeDayStr)) {
          list.push({ 
            holiday: h, 
            suggestion: `Take leave on ${format(bridgeDay, 'MMM d')} (Mon) for 4 days off!`,
            type: 'bridge',
            datesToApply: [bridgeDay],
            impactDays: 4
          });
        }
      }
      else if (dayOfWeek === 'Thursday') {
        const bridgeDay = addDays(day, 1);
        const bridgeDayStr = format(bridgeDay, 'yyyy-MM-dd');
        if (!leaveDates.includes(bridgeDayStr)) {
          list.push({ 
            holiday: h, 
            suggestion: `Take leave on ${format(bridgeDay, 'MMM d')} (Fri) for 4 days off!`,
            type: 'bridge',
            datesToApply: [bridgeDay],
            impactDays: 4
          });
        }
      }

      // 3. Mid-week Mega Break (Wednesday holiday)
      else if (dayOfWeek === 'Wednesday') {
        const mon = subDays(day, 2);
        const tue = subDays(day, 1);
        const thu = addDays(day, 1);
        const fri = addDays(day, 2);
        
        list.push({
          holiday: h,
          suggestion: `Take Mon-Tue or Thu-Fri for a 5-day escape!`,
          type: 'mega',
          datesToApply: [tue, mon],
          impactDays: 5
        });
      }
    });

    // Remove duplicates or very similar suggestions (limit to next 4)
    return list.slice(0, 4);
  }, [holidays, leaves]);

  if (suggestions.length === 0) return null;

  return (
    <div className={`${theme.card} rounded-3xl p-6 space-y-4 shadow-xl`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">🏖️</span>
        <h3 className={`text-lg font-bold ${theme.text}`}>Cuti Strategy</h3>
      </div>
      <div className="space-y-4">
        {suggestions.map((s, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white/50 p-4 rounded-2xl border border-black/5 hover:border-teal-500/30 transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest
                ${s.type === 'natural' ? 'bg-emerald-100 text-emerald-700' : 
                  s.type === 'bridge' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}
              `}>
                {s.type === 'natural' ? 'No Leave Needed' : s.type === 'bridge' ? '1 Day Leave' : '2 Days Leave'}
              </span>
              <span className="text-[10px] font-bold text-gray-400">{s.impactDays} Days Off</span>
            </div>
            
            <p className="text-[10px] font-bold text-gray-500 tracking-tighter truncate w-full" title={s.holiday.name}>
              {s.holiday.name}
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {s.suggestion}
            </p>
            
            {s.datesToApply.length > 0 && (
              <div className="mt-2 flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {s.datesToApply.map((d, i) => (
                  <span key={i} className="text-[8px] bg-black/5 px-1.5 py-0.5 rounded font-bold">
                    {format(d, 'dd/MM')}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pt-2 flex justify-center">
        <p className="text-[10px] text-gray-400 font-medium italic">Smart planning makes better holidays!</p>
      </div>
    </div>
  );
};

export default LongWeekendSuggestions;
