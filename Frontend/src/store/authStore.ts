import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: true,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, isInitializing: false }),

      setAccessToken: (accessToken) =>
        set({ accessToken, isAuthenticated: true, isInitializing: false }),

      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false }),

      setInitializing: (isInitializing) =>
        set({ isInitializing }),
    }),
    {
      name: 'borrowbox_auth_user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
