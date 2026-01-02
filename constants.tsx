
import { ThemeKey, ThemeConfig, Holiday, LeaveType } from './types';

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  [ThemeKey.OCEAN]: {
    name: 'Ocean Blue & Green',
    bgGradient: 'bg-gradient-to-br from-cyan-600 via-emerald-500 to-teal-600',
    accent: 'bg-cyan-500',
    card: 'bg-white/90 backdrop-blur-md',
    text: 'text-cyan-900',
  },
  [ThemeKey.SUNSET]: {
    name: 'Sunset Orange & Pink',
    bgGradient: 'bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500',
    accent: 'bg-rose-500',
    card: 'bg-white/90 backdrop-blur-md',
    text: 'text-rose-900',
  },
  [ThemeKey.MIDNIGHT]: {
    name: 'Midnight Purple & Indigo',
    bgGradient: 'bg-gradient-to-br from-indigo-700 via-purple-600 to-blue-800',
    accent: 'bg-indigo-500',
    card: 'bg-slate-900/80 backdrop-blur-md',
    text: 'text-white',
  },
  [ThemeKey.MINIMAL]: {
    name: 'Minimal Light',
    bgGradient: 'bg-gray-100',
    accent: 'bg-gray-800',
    card: 'bg-white shadow-sm border border-gray-200',
    text: 'text-gray-900',
  },
};

export const LEAVE_ICONS: Record<LeaveType, { emoji: string; color: string; bg: string }> = {
  [LeaveType.ANNUAL]: { emoji: '🏖️', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  [LeaveType.EMERGENCY]: { emoji: '🚨', color: 'text-rose-700', bg: 'bg-rose-600' },
  [LeaveType.MEDICAL]: { emoji: '🏥', color: 'text-blue-700', bg: 'bg-blue-600' },
  [LeaveType.UNPAID]: { emoji: '💸', color: 'text-amber-700', bg: 'bg-amber-600' },
  [LeaveType.OTHERS]: { emoji: '📝', color: 'text-gray-700', bg: 'bg-gray-700' },
};

// Malaysia Public Holiday Data for 2026
export const PUBLIC_HOLIDAYS: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day", isFederal: true },
  { date: '2026-02-17', name: 'Chinese New Year', isFederal: true },
  { date: '2026-02-18', name: 'Chinese New Year (Day 2)', isFederal: true },
  { date: '2026-03-20', name: 'Hari Raya Puasa (Aidilfitri)', isFederal: true },
  { date: '2026-03-21', name: 'Hari Raya Puasa (Day 2)', isFederal: true },
  { date: '2026-04-03', name: 'Good Friday', isFederal: true },
  { date: '2026-05-01', name: 'Labour Day', isFederal: true },
  { date: '2026-05-27', name: 'Hari Raya Haji', isFederal: true },
  { date: '2026-05-31', name: 'Wesak Day', isFederal: true },
  { date: '2026-06-01', name: 'Agong\'s Birthday', isFederal: true },
  { date: '2026-06-17', name: 'Awal Muharram', isFederal: true },
  { date: '2026-08-31', name: 'National Day (Merdeka Day)', isFederal: true },
  { date: '2026-09-16', name: 'Malaysia Day', isFederal: true },
  { date: '2026-11-08', name: 'Deepavali', isFederal: true },
  { date: '2026-11-09', name: 'Deepavali (Replacement)', isFederal: true },
  { date: '2026-12-25', name: 'Christmas Day', isFederal: true },
];
