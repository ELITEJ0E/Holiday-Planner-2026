
import { UserData, UserProfile } from '../types';

/**
 * SIMULATED CLOUD BACKEND SERVICE
 * In a real production app, these methods would call Firebase or Supabase APIs.
 */

const CLOUD_STORAGE_KEY = 'mycuti_cloud_db';
const LATENCY = 800; // ms

export const CloudDB = {
  // Simulate fetching user data from the cloud
  fetchUserData: async (userId: string): Promise<UserData | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cloudData = localStorage.getItem(`${CLOUD_STORAGE_KEY}_${userId}`);
        resolve(cloudData ? JSON.parse(cloudData) : null);
      }, LATENCY);
    });
  },

  // Simulate saving data to the cloud
  saveUserData: async (userId: string, data: UserData): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(`${CLOUD_STORAGE_KEY}_${userId}`, JSON.stringify({
          ...data,
          lastUpdated: Date.now()
        }));
        resolve(true);
      }, LATENCY);
    });
  },

  // Simulate Google OAuth Login
  loginWithGoogle: async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'google_user_9921',
          name: 'Azlan Ibrahim',
          email: 'azlan.dev@gmail.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Azlan'
        });
      }, 1200);
    });
  }
};
