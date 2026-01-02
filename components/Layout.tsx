
import React from 'react';
import { ThemeConfig, ThemeKey } from '../types';
import ThemeSelector from './ThemeSelector';

interface LayoutProps {
  children: React.ReactNode;
  theme: ThemeConfig;
  selectedTheme: ThemeKey;
  onSelectTheme: (theme: ThemeKey) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, theme, selectedTheme, onSelectTheme
}) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${theme.accent} rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 transition-transform hover:scale-105`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-gray-900 leading-none">MyCuti</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">Plan. Rest. Repeat.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSelector 
              selectedTheme={selectedTheme} 
              onSelect={onSelectTheme} 
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full p-8 text-center">
        <div className="h-px w-24 bg-white/20 mx-auto mb-6" />
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} MyCuti Malaysia</p>
      </footer>
    </div>
  );
};

export default Layout;
