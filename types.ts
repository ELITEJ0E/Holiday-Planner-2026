
export enum LeaveType {
  ANNUAL = 'Annual',
  EMERGENCY = 'Emergency',
  UNPAID = 'Unpaid',
  MEDICAL = 'Medical',
  OTHERS = 'Others'
}

export interface LeaveEntry {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  type: LeaveType;
  note?: string;
}

export interface CustomHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  isFederal: boolean;
  states?: string[]; // Empty means all (Federal)
}

export enum ThemeKey {
  OCEAN = 'ocean',
  SUNSET = 'sunset',
  MIDNIGHT = 'midnight',
  MINIMAL = 'minimal'
}

export interface ThemeConfig {
  name: string;
  bgGradient: string;
  accent: string;
  card: string;
  text: string;
}

export interface UserData {
  leaves: LeaveEntry[];
  customHolidays: CustomHoliday[];
  entitlement: number;
  theme: ThemeKey;
  isDarkMode: boolean;
  preventPublicHolidayLeave: boolean;
  lastUpdated?: number;
}

// Added UserProfile interface to resolve type errors in authentication services
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
