export const APP_NAME = 'Go Links';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const DEFAULT_LINKS = [
  {
    shortcut: 'calendar',
    url: 'https://calendar.google.com',
    description: 'Google Calendar',
  },
  {
    shortcut: 'drive',
    url: 'https://drive.google.com',
    description: 'Google Drive',
  },
  {
    shortcut: 'gmail',
    url: 'https://gmail.com',
    description: 'Gmail',
  },
  {
    shortcut: 'github',
    url: 'https://github.com',
    description: 'GitHub',
  },
];

export const STORAGE_KEYS = {
  AUTH_STATE: 'go_links_auth_state',
  SYNC_DATA: 'go_links_sync_data',
  THEME: 'go_links_theme',
} as const;

export const EXTENSION_MESSAGES = {
  CHECK_EXTENSION: 'CHECK_EXTENSION',
  EXTENSION_AVAILABLE: 'EXTENSION_AVAILABLE',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_ERROR: 'AUTH_ERROR',
  SIGN_OUT: 'SIGN_OUT',
  SYNC_LINKS: 'SYNC_LINKS',
} as const;