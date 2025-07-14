import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      isAuthenticated: false,
      
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      
      setSession: (session) => {
        set({ session });
      },
      
      setProfile: (profile) => {
        set({ profile });
      },
      
      clearAuth: () => {
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'go-links-auth',
      partialize: (state) => ({
        // Only persist minimal auth state
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);