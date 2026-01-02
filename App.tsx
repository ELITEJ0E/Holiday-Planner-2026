
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  format, 
  addMonths, 
  subMonths
} from 'date-fns';
import { 
  ThemeKey, 
  UserData, 
  LeaveEntry, 
  Holiday,
  CustomHoliday
} from './types';
import { THEMES, PUBLIC_HOLIDAYS } from './constants';
import Layout from './components/Layout';
import Calendar from './components/Calendar';
import LeaveModal from './components/LeaveModal';
import Stats from './components/Stats';
import LongWeekendSuggestions from './components/LongWeekendSuggestions';
import LeaveInsights from './components/LeaveInsights';

const DEFAULT_DATA: UserData = {
  leaves: [],
  customHolidays: [],
  entitlement: 14,
  theme: ThemeKey.OCEAN,
  isDarkMode: false,
  preventPublicHolidayLeave: true
};

const App: React.FC = () => {
  const [data, setData] = useState<UserData>(DEFAULT_DATA);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('mycuti_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // 2. Persistence to LocalStorage on every change
  useEffect(() => {
    if (isInitialLoad) return;
    localStorage.setItem('mycuti_data', JSON.stringify(data));
  }, [data, isInitialLoad]);

  const updateData = useCallback((updates: Partial<UserData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const addOrUpdateLeave = (entry: LeaveEntry) => {
    setData(prev => {
      const existing = prev.leaves.findIndex(l => l.date === entry.date);
      const newLeaves = [...prev.leaves];
      if (existing > -1) {
        newLeaves[existing] = entry;
      } else {
        newLeaves.push(entry);
      }
      return { ...prev, leaves: newLeaves };
    });
  };

  const addOrUpdateCustomHoliday = (entry: CustomHoliday) => {
    setData(prev => {
      const existing = prev.customHolidays.findIndex(h => h.date === entry.date);
      const newHolidays = [...prev.customHolidays];
      if (existing > -1) {
        newHolidays[existing] = entry;
      } else {
        newHolidays.push(entry);
      }
      return { ...prev, customHolidays: newHolidays };
    });
  };

  const removeLeave = (dateStr: string) => {
    setData(prev => ({
      ...prev,
      leaves: prev.leaves.filter(l => l.date !== dateStr)
    }));
  };

  const removeCustomHoliday = (dateStr: string) => {
    setData(prev => ({
      ...prev,
      customHolidays: prev.customHolidays.filter(h => h.date !== dateStr)
    }));
  };

  const activeHolidays = useMemo(() => {
    const systemHolidays = PUBLIC_HOLIDAYS;
    const mappedCustom: Holiday[] = data.customHolidays.map(ch => ({
      date: ch.date,
      name: ch.name,
      isFederal: false,
      states: []
    }));

    return [...systemHolidays, ...mappedCustom];
  }, [data.customHolidays]);

  const usedLeavesCount = useMemo(() => {
    return data.leaves.length;
  }, [data.leaves]);

  const balance = useMemo(() => {
    return data.entitlement - usedLeavesCount;
  }, [data.entitlement, usedLeavesCount]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsLeaveModalOpen(true);
  };

  const currentTheme = THEMES[data.theme];

  return (
    <div className={`min-h-screen ${currentTheme.bgGradient} theme-transition font-sans text-gray-900 pb-12`}>
      <Layout 
        theme={currentTheme}
        selectedTheme={data.theme}
        onSelectTheme={(t) => updateData({ theme: t })}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Content (Left) */}
            <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Stats 
                entitlement={data.entitlement}
                used={usedLeavesCount}
                balance={balance}
                theme={currentTheme}
                updateEntitlement={(e) => updateData({ entitlement: e })}
              />
              
              <div className={`${currentTheme.card} rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/30 backdrop-blur-xl`}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="text-center min-w-[160px]">
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        {format(currentDate, 'MMMM')}
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 -mt-1">{format(currentDate, 'yyyy')}</p>
                    </div>
                    <button 
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="p-2.5 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentDate(new Date(2026, 0, 1))}
                    className="px-6 py-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-xs font-black uppercase tracking-widest text-gray-900 hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0"
                  >
                    Back to Jan
                  </button>
                </div>

                <Calendar 
                  currentDate={currentDate}
                  onDateClick={handleDateClick}
                  leaves={data.leaves}
                  holidays={activeHolidays}
                  theme={currentTheme}
                />
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
              <LeaveInsights 
                leaves={data.leaves} 
                entitlement={data.entitlement} 
                theme={currentTheme} 
              />

              <LongWeekendSuggestions 
                holidays={activeHolidays} 
                leaves={data.leaves}
                theme={currentTheme}
              />
              
              {/* Info Notice */}
              <div className="flex flex-col items-center gap-2 pt-4 px-6">
                <div className="p-4 rounded-2xl w-full text-center bg-black/5">
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    All your leave data is saved <span className="font-black">locally</span> to this browser.
                  </p>
                </div>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Malaysia 2026 Edition</span>
              </div>
            </div>
          </div>
        </div>

        {isLeaveModalOpen && selectedDate && (
          <LeaveModal 
            date={selectedDate}
            onClose={() => setIsLeaveModalOpen(false)}
            onSaveLeave={addOrUpdateLeave}
            onDeleteLeave={removeLeave}
            onSaveHoliday={addOrUpdateCustomHoliday}
            onDeleteHoliday={removeCustomHoliday}
            existingLeave={data.leaves.find(l => l.date === format(selectedDate, 'yyyy-MM-dd'))}
            existingCustomHoliday={data.customHolidays.find(h => h.date === format(selectedDate, 'yyyy-MM-dd'))}
            systemHoliday={PUBLIC_HOLIDAYS.find(h => h.date === format(selectedDate, 'yyyy-MM-dd'))}
            theme={currentTheme}
          />
        )}
      </Layout>
    </div>
  );
};

export default App;
