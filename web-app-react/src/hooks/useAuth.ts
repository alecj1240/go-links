import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/auth';
import { Profile } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const refreshProfile = useCallback(async (userId?: string) => {
    try {
      if (!userId) {
        setProfile(null);
        return;
      }
      const profileData = await authService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.initialize();
      
      const currentUser = authService.getCurrentUser();
      const currentSession = authService.getCurrentSession();
      
      setUser(currentUser);
      setSession(currentSession);
      
      if (currentUser) {
        await refreshProfile(currentUser.id);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      await authService.signInWithGoogle();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'Sign in failed');
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Sign out failed');
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initialize();
    }
  }, [initialize]);

  // Listen for auth state changes from the service
  useEffect(() => {
    const handleAuthChange = async () => {
      const currentUser = authService.getCurrentUser();
      const currentSession = authService.getCurrentSession();
      
      setUser(currentUser);
      setSession(currentSession);
      
      if (currentUser) {
        await refreshProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    };

    // Listen for custom auth events
    window.addEventListener('go_links_auth_change', handleAuthChange);
    
    return () => {
      window.removeEventListener('go_links_auth_change', handleAuthChange);
    };
  }, [refreshProfile]);

  return {
    user,
    session,
    profile,
    loading,
    error,
    signInWithGoogle,
    signOut,
    refreshProfile: () => refreshProfile(user?.id),
    isAuthenticated: !!user,
  };
};