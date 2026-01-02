
import React, { useState, useEffect } from 'react';
import { format, isValid } from 'date-fns';
import { LeaveEntry, LeaveType, Holiday, ThemeConfig, CustomHoliday } from '../types';
import { LEAVE_ICONS } from '../constants';

interface LeaveModalProps {
  date: Date;
  onClose: () => void;
  onSaveLeave: (entry: LeaveEntry) => void;
  onDeleteLeave: (dateStr: string) => void;
  onSaveHoliday: (entry: CustomHoliday) => void;
  onDeleteHoliday: (dateStr: string) => void;
  existingLeave?: LeaveEntry;
  existingCustomHoliday?: CustomHoliday;
  systemHoliday?: Holiday;
  theme: ThemeConfig;
}

const LeaveModal: React.FC<LeaveModalProps> = ({ 
  date, onClose, onSaveLeave, onDeleteLeave, onSaveHoliday, onDeleteHoliday,
  existingLeave, existingCustomHoliday, systemHoliday, theme 
}) => {
  const [activeTab, setActiveTab] = useState<'leave' | 'holiday'>(existingCustomHoliday ? 'holiday' : 'leave');
  const [leaveType, setLeaveType] = useState<LeaveType>(existingLeave?.type || LeaveType.ANNUAL);
  const [leaveNote, setLeaveNote] = useState(existingLeave?.note || '');
  const [holidayName, setHolidayName] = useState(existingCustomHoliday?.name || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const dateStr = format(date, 'yyyy-MM-dd');

  // Ensure fields are pre-filled if props change (though typically modal remounts)
  useEffect(() => {
    if (existingCustomHoliday) {
      setHolidayName(existingCustomHoliday.name);
    }
  }, [existingCustomHoliday]);

  const handleSaveLeave = () => {
    onSaveLeave({
      id: existingLeave?.id || Math.random().toString(36).substr(2, 9),
      date: dateStr,
      type: leaveType,
      note: leaveNote
    });
    onClose();
  };

  const handleSaveHoliday = () => {
    // Validation: Name must not be empty
    if (!holidayName.trim()) return;
    
    // Validation: Date format check (sanity check)
    if (!isValid(date)) return;

    onSaveHoliday({
      id: existingCustomHoliday?.id || Math.random().toString(36).substr(2, 9),
      date: dateStr,
      name: holidayName.trim()
    });
    onClose();
  };

  const handleDelete = () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    if (activeTab === 'leave') {
      onDeleteLeave(dateStr);
    } else {
      onDeleteHoliday(dateStr);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Compact for mobile */}
        <div className={`p-4 sm:p-6 ${theme.bgGradient} text-white shrink-0`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">{format(date, 'EEEE')}</h2>
              <p className="text-xs sm:text-sm opacity-80">{format(date, 'do MMMM yyyy')}</p>
              {existingLeave && (
                <div className="mt-2 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <span>{LEAVE_ICONS[existingLeave.type].emoji}</span>
                  <span>Currently: {existingLeave.type}</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-5 h-5 sm:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
          {/* Public Holiday Banner - Removed Flag Icon */}
          {systemHoliday && (
            <div className="bg-rose-50 border border-rose-100 p-3 sm:p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-rose-700 font-bold text-xs sm:text-sm">{systemHoliday.name}</p>
                <p className="text-rose-600 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Public Holiday</p>
              </div>
            </div>
          )}

          {/* Tab Selection */}
          <div className="flex p-1 bg-gray-100 rounded-lg sm:rounded-xl shrink-0">
            <button 
              onClick={() => { setActiveTab('leave'); setIsDeleting(false); }}
              className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase rounded-md sm:rounded-lg transition-all ${activeTab === 'leave' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Plan Leave
            </button>
            <button 
              onClick={() => { setActiveTab('holiday'); setIsDeleting(false); }}
              className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase rounded-md sm:rounded-lg transition-all ${activeTab === 'holiday' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Custom Holiday
            </button>
          </div>

          {activeTab === 'leave' ? (
            <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {Object.values(LeaveType).map(t => (
                    <button
                      key={t}
                      onClick={() => setLeaveType(t)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all border-2
                        ${leaveType === t ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-inner' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}
                      `}
                    >
                      <span>{LEAVE_ICONS[t].emoji}</span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Notes (Optional)</label>
                <textarea
                  value={leaveNote}
                  onChange={(e) => setLeaveNote(e.target.value)}
                  placeholder="E.g. Family trip to Penang"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all outline-none text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {existingLeave && (
                  <button 
                    onClick={handleDelete}
                    className={`flex-1 px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl font-bold transition-all
                      ${isDeleting ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-100 text-rose-500 hover:bg-rose-50'}
                    `}
                  >
                    {isDeleting ? 'Confirm Delete?' : 'Delete'}
                  </button>
                )}
                <button 
                  onClick={handleSaveLeave}
                  className="flex-[2] px-4 py-2.5 sm:py-3 bg-gray-900 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                >
                  {existingLeave ? 'Update Leave' : 'Add Leave'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Holiday Name</label>
                <input
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  placeholder="E.g. School Break / State Holiday"
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all outline-none text-xs sm:text-sm font-medium
                    ${!holidayName.trim() && holidayName.length > 0 ? 'ring-1 ring-rose-300' : ''}
                  `}
                />
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                <p className="text-[10px] sm:text-xs text-blue-700 leading-relaxed">
                  Add state-specific holidays or personal non-working days here. They won't deduct from your leave balance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {existingCustomHoliday && (
                  <button 
                    onClick={handleDelete}
                    className={`flex-1 px-4 py-2.5 sm:py-3 border-2 rounded-xl sm:rounded-2xl font-bold transition-all
                      ${isDeleting ? 'bg-rose-600 border-rose-600 text-white shadow-inner' : 'border-rose-100 text-rose-500 hover:bg-rose-50'}
                    `}
                  >
                    {isDeleting ? 'Sure?' : 'Remove'}
                  </button>
                )}
                <button 
                  onClick={handleSaveHoliday}
                  className="flex-[2] px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
                  disabled={!holidayName.trim()}
                >
                  {existingCustomHoliday ? 'Update Holiday' : 'Add Holiday'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;
