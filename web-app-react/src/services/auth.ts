import { supabase } from './supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { api } from './api';
import { Profile } from '@/types';

export class AuthService {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  async initialize(): Promise<void> {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.currentUser = session.user;
      this.currentSession = session;
      
      // Send initial auth token to extension
      if (window.goLinksExtension && session.access_token) {
        console.log('Sending initial auth token to extension...');
        setTimeout(() => {
          window.goLinksExtension?.sendAuthData(session.access_token, {
            userId: session.user.id,
            email: session.user.email
          });
        }, 1000); // Small delay to ensure content script is ready
      }
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      this.currentSession = session;
      this.handleAuthStateChange(event, session);
    });
  }

  async signInWithGoogle(): Promise<{ url?: string }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async getProfile(): Promise<Profile | null> {
    try {
      if (!this.currentUser) return null;
      return await api.getProfile();
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  private handleAuthStateChange(event: AuthChangeEvent, session: Session | null): void {
    if (event === 'SIGNED_IN' && session) {
      console.log('User signed in:', session?.user.email);
      
      // Notify extension of authentication success
      this.notifyExtension('AUTH_SUCCESS', session?.user, session);
      
      // Send auth token to extension via content script
      if (window.goLinksExtension && session.access_token) {
        console.log('Sending auth token to extension...');
        window.goLinksExtension.sendAuthData(session.access_token, {
          userId: session.user.id,
          email: session.user.email
        });
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      
      // Notify extension of sign out
      this.notifyExtension('SIGN_OUT');
      
      // Clear extension auth
      if (window.goLinksExtension) {
        window.goLinksExtension.sendAuthData(null, null);
      }
    }
  }

  private notifyExtension(
    type: 'AUTH_SUCCESS' | 'AUTH_ERROR' | 'SIGN_OUT',
    user?: User | null,
    session?: Session | null,
    error?: string
  ): void {
    try {
      // Store auth state in localStorage for extension to read
      const authData = {
        type,
        user: user || null,
        session: session || null,
        error: error || null,
        timestamp: Date.now(),
      };

      localStorage.setItem('go_links_auth_state', JSON.stringify(authData));

      // Also dispatch a custom event
      window.dispatchEvent(
        new CustomEvent('go_links_auth_change', { detail: authData })
      );
    } catch (error) {
      console.error('Error notifying extension:', error);
    }
  }

  async requireAuth(): Promise<boolean> {
    const session = await this.getSession();
    if (!session) {
      return false;
    }
    return true;
  }
}

export const authService = new AuthService();
export default authService;