// Configuration template for Go Links extension
// Copy this file to config.js and fill in your values
// DO NOT commit config.js to version control

const CONFIG = {
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-supabase-anon-key-here'
};

// Make config available globally
if (typeof globalThis !== 'undefined') {
  globalThis.GO_LINKS_CONFIG = CONFIG;
} else if (typeof window !== 'undefined') {
  window.GO_LINKS_CONFIG = CONFIG;
} else if (typeof self !== 'undefined') {
  self.GO_LINKS_CONFIG = CONFIG;
}