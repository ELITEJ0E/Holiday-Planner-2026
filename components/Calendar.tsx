
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth, 
  isToday,
  isWeekend
} from 'date-fns';
import { LeaveEntry, Holiday, ThemeConfig } from '../types';
import { LEAVE_ICONS } from '../constants';

interface CalendarProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  leaves: LeaveEntry[];
  holidays: Holiday[];
  theme: ThemeConfig;
}

const Calendar: React.FC<CalendarProps> = ({ 
  currentDate, onDateClick, leaves, holidays, theme 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const transitionKey = format(currentDate, 'yyyy-MM');

  return (
    <div className="w-full select-none overflow-visible">
      <div className="grid grid-cols-7 mb-4 border-b border-gray-100/50 pb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div 
        key={transitionKey} 
        className="grid grid-cols-7 gap-1 md:gap-2 animate-in fade-in slide-in-from-bottom-2"
      >
        {days.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          const matchingHolidays = holidays.filter(h => h.date === dateStr);
          const leave = leaves.find(l => l.date === dateStr);
          const isWe = isWeekend(day);
          const hasHoliday = matchingHolidays.length > 0;
          
          return (
            <button
              key={idx}
              onClick={() => onDateClick(day)}
              className={`
                relative h-20 sm:h-24 md:h-28 p-1 sm:p-2 rounded-xl flex flex-col items-start transition-all
                ${isCurrentMonth ? 'bg-white/40 hover:bg-white/70' : 'bg-transparent opacity-10 pointer-events-none'}
                ${isToday(day) ? 'ring-2 ring-teal-500 bg-white/90 shadow-lg scale-[1.02] z-10' : 'hover:scale-[1.02]'}
                ${leave ? 'bg-orange-50 ring-1 ring-orange-200/50' : ''}
                ${hasHoliday ? 'bg-rose-50 ring-1 ring-rose-200/50' : ''}
                active:scale-95 cursor-pointer group
              `}
            >
              {/* Tooltip implementation */}
              {(leave || hasHoliday) && isCurrentMonth && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block z-[60] pointer-events-none animate-in fade-in zoom-in slide-in-from-bottom-2 duration-150">
                  <div className="bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10 text-left">
                    {/* Holiday Section in Tooltip */}
                    {matchingHolidays.map((h, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${h.isFederal ? 'bg-rose-500' : 'bg-blue-400'}`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                            {h.isFederal ? 'Federal' : 'Custom'} Holiday
                          </span>
                        </div>
                        <p className="text-xs font-bold leading-tight">{h.name}</p>
                      </div>
                    ))}

                    {/* Divider if both exist */}
                    {hasHoliday && leave && <div className="my-2 h-px bg-white/10" />}

                    {/* Leave Section in Tooltip */}
                    {leave && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span>{LEAVE_ICONS[leave.type].emoji}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">{leave.type} Leave</span>
                        </div>
                        {leave.note ? (
                          <p className="text-xs italic text-gray-300 leading-snug border-l-2 border-white/20 pl-2 mt-1">
                            "{leave.note}"
                          </p>
                        ) : (
                          <p className="text-[10px] text-white/40 italic">No notes added</p>
                        )}
                      </div>
                    )}
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900/95" />
                  </div>
                </div>
              )}

              <span className={`text-xs sm:text-sm font-bold ${isWe ? 'text-rose-500' : 'text-gray-900'} ${isToday(day) ? 'text-teal-600' : ''}`}>
                {format(day, 'd')}
              </span>
              
              <div className="w-full flex flex-col gap-1 mt-auto overflow-hidden">
                {matchingHolidays.map((holiday, hIdx) => (
                  <div 
                    key={hIdx} 
                    className={`
                      text-[7px] md:text-[8px] px-1 py-0.5 rounded shadow-sm truncate font-bold tracking-tighter w-full text-left
                      ${holiday.isFederal ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}
                    `}
                  >
                    {holiday.name}
                  </div>
                ))}

                {leave && (
                  <div className="flex justify-center sm:justify-start">
                    <span className="text-xl sm:text-2xl transition-transform group-hover:scale-125 drop-shadow-sm filter">
                      {LEAVE_ICONS[leave.type].emoji}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
