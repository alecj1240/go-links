import { User, Session } from '@supabase/supabase-js';
import { Profile } from './database';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface ExtensionAuthMessage {
  type: 'AUTH_SUCCESS' | 'AUTH_ERROR' | 'SIGN_OUT';
  user?: User;
  session?: Session;
  error?: string;
}