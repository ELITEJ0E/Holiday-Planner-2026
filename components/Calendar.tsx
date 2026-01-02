
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

  // This key changes whenever the month or year changes,
  // prompting React to remount the grid and trigger CSS animations.
  const transitionKey = format(currentDate, 'yyyy-MM');

  return (
    <div className="w-full select-none overflow-hidden">
      <div className="grid grid-cols-7 mb-4 border-b border-gray-100/50 pb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      {/* Animated container for smooth month transitions */}
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
                active:scale-95 cursor-pointer overflow-hidden group
              `}
            >
              <span className={`text-xs sm:text-sm font-bold ${isWe ? 'text-rose-500' : 'text-gray-900'} ${isToday(day) ? 'text-teal-600' : ''}`}>
                {format(day, 'd')}
              </span>
              
              <div className="w-full flex flex-col gap-1 mt-auto overflow-hidden">
                {/* Holidays: Show Badge with Name (Removed icons) */}
                {matchingHolidays.map((holiday, hIdx) => (
                  <div 
                    key={hIdx} 
                    className={`
                      text-[7px] md:text-[8px] px-1 py-0.5 rounded shadow-sm truncate font-bold tracking-tighter w-full text-left
                      ${holiday.isFederal ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}
                    `}
                    title={`${holiday.isFederal ? 'Federal' : 'State/Custom'} Holiday: ${holiday.name}`}
                  >
                    {holiday.name}
                  </div>
                ))}

                {/* Leaves: Show Big Emoji Only */}
                {leave && (
                  <div 
                    className="flex justify-center sm:justify-start"
                    title={`${leave.type} Leave${leave.note ? ': ' + leave.note : ''}`}
                  >
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
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
      `}</style>
    </div>
  );
};

export default Calendar;
