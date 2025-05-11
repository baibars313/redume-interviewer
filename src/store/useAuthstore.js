import {create} from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
      (set) => ({
        token: null,
        userId: null,
        isLoggedIn: false,
        setAuth: (token, userId) => set({ token, userId, isLoggedIn: true }),
        clearAuth: () => set({ token: null, userId: null, isLoggedIn: false }),
      }),
      {
        name: 'auth-storage', // name of item in storage
        getStorage: () => localStorage,
      }
    )
  );