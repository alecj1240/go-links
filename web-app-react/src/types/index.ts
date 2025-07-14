export * from './database';
export * from './auth';

import { GoLink } from './database';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchFilters {
  query?: string;
  sortBy?: 'created_at' | 'updated_at' | 'shortcut' | 'url';
  sortOrder?: 'asc' | 'desc';
}

export interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string }>;
  total: number;
}

export interface ExportData {
  links: GoLink[];
  exportedAt: string;
  version: string;
}

// Extension communication interface
declare global {
  interface Window {
    goLinksExtension?: {
      sendAuthData: (token: string | null, config: any) => void;
    };
  }
}