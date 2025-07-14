// Simplified background script - focus on core functionality
// Import configuration
importScripts('config.js');

// Get configuration values
const SUPABASE_URL = globalThis.GO_LINKS_CONFIG?.SUPABASE_URL;
const SUPABASE_ANON_KEY = globalThis.GO_LINKS_CONFIG?.SUPABASE_ANON_KEY;

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing configuration! Please create config.js from config.example.js');
  throw new Error('Configuration not found');
}

// Sync state management
let syncInProgress = false;
let syncRetryCount = 0;
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Fetch go links from Supabase with error handling
async function fetchGoLinks() {
  try {
    console.log('Fetching go links from Supabase...');
    
    // Get auth token
    const authData = await chrome.storage.local.get('authToken');
    if (!authData.authToken) {
      console.log('No auth token found');
      return { error: 'NO_AUTH', data: null };
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/go_links?select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${authData.authToken}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid
        await chrome.storage.local.remove('authToken');
        return { error: 'AUTH_EXPIRED', data: null };
      } else if (response.status === 429) {
        // Rate limited
        return { error: 'RATE_LIMITED', data: null };
      } else if (response.status >= 500) {
        // Server error
        return { error: 'SERVER_ERROR', data: null };
      }
      
      return { error: 'API_ERROR', data: null };
    }

    const links = await response.json();
    console.log('Fetched', links.length, 'links');
    
    // Convert to simple object format
    const goLinksMap = {};
    links.forEach(link => {
      goLinksMap[link.shortcut] = link.url;
    });

    // Reset retry count on success
    syncRetryCount = 0;
    
    return { error: null, data: goLinksMap };
  } catch (error) {
    console.error('Error fetching go links:', error);
    
    // Distinguish between different error types
    if (error.name === 'AbortError') {
      return { error: 'TIMEOUT', data: null };
    } else if (!navigator.onLine) {
      return { error: 'OFFLINE', data: null };
    }
    
    return { error: 'NETWORK_ERROR', data: null };
  }
}

// Update browser redirect rules
async function updateRedirectRules(goLinks) {
  try {
    // Clear existing rules
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIds = existingRules.map(rule => rule.id);
    
    if (ruleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ruleIds });
    }

    // Add new rules
    const newRules = Object.entries(goLinks).map(([shortcut, url], index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { url }
      },
      condition: {
        urlFilter: `*://go/${shortcut}`,
        resourceTypes: ['main_frame']
      }
    }));

    if (newRules.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
      console.log('Updated redirect rules for', newRules.length, 'links');
    }
  } catch (error) {
    console.error('Error updating redirect rules:', error);
  }
}

// Main sync function with retry logic
async function syncGoLinks(isRetry = false) {
  // Prevent concurrent syncs
  if (syncInProgress && !isRetry) {
    console.log('Sync already in progress, skipping...');
    return false;
  }
  
  syncInProgress = true;
  console.log('Starting sync...', isRetry ? `(retry ${syncRetryCount}/${MAX_RETRY_COUNT})` : '');
  
  try {
    const result = await fetchGoLinks();
    
    if (result.error) {
      console.log('Sync failed with error:', result.error);
      
      // Handle different error types
      switch (result.error) {
        case 'NO_AUTH':
        case 'AUTH_EXPIRED':
          // Notify popup about auth issues
          chrome.runtime.sendMessage({ 
            action: 'syncError', 
            error: 'Authentication required'
          }).catch(() => {});
          break;
          
        case 'RATE_LIMITED':
          // Wait longer before retry
          if (syncRetryCount < MAX_RETRY_COUNT) {
            syncRetryCount++;
            setTimeout(() => syncGoLinks(true), RETRY_DELAY * 5); // 10 seconds
          }
          break;
          
        case 'OFFLINE':
        case 'NETWORK_ERROR':
        case 'TIMEOUT':
        case 'SERVER_ERROR':
          // Retry with exponential backoff
          if (syncRetryCount < MAX_RETRY_COUNT) {
            syncRetryCount++;
            const delay = RETRY_DELAY * Math.pow(2, syncRetryCount - 1);
            console.log(`Retrying in ${delay}ms...`);
            setTimeout(() => syncGoLinks(true), delay);
          }
          break;
      }
      
      // Use cached data for redirect rules
      const cached = await chrome.storage.local.get('goLinksCache');
      if (cached.goLinksCache) {
        await updateRedirectRules(cached.goLinksCache);
        console.log('Using cached data for redirect rules');
      }
      
      return false;
    }
    
    // Success - update everything
    const goLinks = result.data;
    
    // Update cache with timestamp
    await chrome.storage.local.set({ 
      goLinksCache: goLinks,
      lastSyncTime: Date.now()
    });
    
    // Update redirect rules
    await updateRedirectRules(goLinks);
    
    // Notify popup
    chrome.runtime.sendMessage({ 
      action: 'syncComplete',
      linksCount: Object.keys(goLinks).length
    }).catch(() => {});
    
    console.log('Sync completed successfully');
    return true;
    
  } catch (error) {
    console.error('Unexpected error during sync:', error);
    return false;
  } finally {
    syncInProgress = false;
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sync') {
    // Force sync (reset retry count)
    syncRetryCount = 0;
    syncGoLinks().then(success => {
      sendResponse({ success });
    });
    return true; // Will respond asynchronously
  }
  
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['goLinksCache', 'lastSyncTime', 'authToken'], (data) => {
      sendResponse({
        hasAuth: !!data.authToken,
        linksCount: data.goLinksCache ? Object.keys(data.goLinksCache).length : 0,
        lastSyncTime: data.lastSyncTime || null,
        syncInProgress
      });
    });
    return true;
  }
  
  if (request.action === 'login') {
    // Store auth token when webapp sends it
    if (request.token) {
      chrome.storage.local.set({
        authToken: request.token
      }).then(() => {
        console.log('Auth token stored, starting sync');
        syncRetryCount = 0; // Reset retry count for fresh sync
        syncGoLinks();
        sendResponse({ success: true });
      });
    } else {
      // Logout case - clear auth
      chrome.storage.local.remove(['authToken', 'goLinksCache']).then(() => {
        console.log('Auth cleared');
        updateRedirectRules({});
        sendResponse({ success: true });
      });
    }
    return true;
  }
  
  if (request.action === 'logout') {
    // Clear auth and cache
    chrome.storage.local.clear().then(() => {
      updateRedirectRules({});
      sendResponse({ success: true });
    });
    return true;
  }
});

// Handle messages from web app
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === 'login') {
    if (request.token) {
      chrome.storage.local.set({
        authToken: request.token
      }).then(() => {
        console.log('External auth token stored, starting sync');
        syncRetryCount = 0; // Reset retry count
        syncGoLinks();
        sendResponse({ success: true });
      });
    } else {
      // Logout case
      chrome.storage.local.remove(['authToken', 'goLinksCache']).then(() => {
        console.log('External auth cleared');
        updateRedirectRules({});
        sendResponse({ success: true });
      });
    }
    return true;
  }
});

// Auto-sync on startup if we have auth
chrome.runtime.onStartup.addListener(async () => {
  const authData = await chrome.storage.local.get('authToken');
  if (authData.authToken) {
    console.log('Extension started, syncing...');
    syncGoLinks();
  }
});

// Auto-sync on install if we have auth
chrome.runtime.onInstalled.addListener(async () => {
  const authData = await chrome.storage.local.get('authToken');
  if (authData.authToken) {
    console.log('Extension installed, syncing...');
    syncGoLinks();
  }
});

// Periodic sync every 5 minutes if authenticated
setInterval(async () => {
  const authData = await chrome.storage.local.get('authToken');
  if (authData.authToken && !syncInProgress) {
    console.log('Periodic sync...');
    syncGoLinks();
  }
}, 5 * 60 * 1000);

// Sync when network comes back online
self.addEventListener('online', async () => {
  console.log('Network is back online, syncing...');
  const authData = await chrome.storage.local.get('authToken');
  if (authData.authToken) {
    syncRetryCount = 0; // Reset retry count
    syncGoLinks();
  }
});

console.log('Background script loaded');