import { supabase } from './supabase';
import {
  GoLink,
  InsertGoLink,
  UpdateGoLink,
  Profile,
  UpdateProfile,
  UserSettings,
  UpdateUserSettings,
} from '@/types';

export class API {
  // Go Links methods
  async getGoLinks(): Promise<GoLink[]> {
    const { data, error } = await supabase
      .from('go_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createGoLink(
    shortcut: string,
    url: string,
    description: string = ''
  ): Promise<GoLink> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const linkData: InsertGoLink = {
      user_id: user.id,
      shortcut: shortcut.toLowerCase(),
      url,
      description,
    };

    const { data, error } = await supabase
      .from('go_links')
      .insert(linkData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateGoLink(id: string, updates: UpdateGoLink): Promise<GoLink> {
    const { data, error } = await supabase
      .from('go_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteGoLink(id: string): Promise<void> {
    const { error } = await supabase.from('go_links').delete().eq('id', id);

    if (error) throw error;
  }

  async getGoLinkByShortcut(shortcut: string): Promise<GoLink | null> {
    const { data, error } = await supabase
      .from('go_links')
      .select('*')
      .eq('shortcut', shortcut.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // User Profile methods
  async getProfile(): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(updates: UpdateProfile): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // User Settings methods
  async getSettings(): Promise<UserSettings> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateSettings(updates: UpdateUserSettings): Promise<UserSettings> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToGoLinks(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('go_links_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'go_links',
        },
        callback
      )
      .subscribe();

    return subscription;
  }

  // Search and filtering
  async searchGoLinks(
    query: string,
    limit: number = 50
  ): Promise<GoLink[]> {
    const { data, error } = await supabase
      .from('go_links')
      .select('*')
      .or(`shortcut.ilike.%${query}%,url.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const api = new API();
export default api;