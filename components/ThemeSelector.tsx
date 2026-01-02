
import React, { useState, useRef, useEffect } from 'react';
import { ThemeKey } from '../types';
import { THEMES } from '../constants';

interface ThemeSelectorProps {
  selectedTheme: ThemeKey;
  onSelect: (theme: ThemeKey) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-all text-xs font-bold text-gray-600 uppercase tracking-widest"
      >
        <span className={`w-3 h-3 rounded-full ${THEMES[selectedTheme].accent} ring-2 ring-white shadow-sm`} />
        <span className="hidden md:inline">Theme</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-50">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Theme</h3>
          </div>
          <div className="px-2 pt-2 grid grid-cols-1 gap-1">
            {(Object.keys(THEMES) as ThemeKey[]).map(key => {
              const theme = THEMES[key];
              const isSelected = selectedTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onSelect(key);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left
                    ${isSelected ? 'bg-gray-50 ring-1 ring-gray-100' : 'hover:bg-gray-50/50'}
                  `}
                >
                  <div className={`w-10 h-6 rounded-lg ${theme.bgGradient} shadow-sm`} />
                  <div className="flex flex-col">
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                      {theme.name}
                    </span>
                  </div>
                  {isSelected && (
                    <svg className="ml-auto w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
