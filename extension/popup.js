// Simple popup logic - no overcomplicated auth checking
const WEBAPP_URL = 'http://localhost:3000'; // React dev server URL

let goLinks = [];
let syncTimeout = null;
let isInitialized = false;

// Initialize popup
async function init() {
  try {
    // Get status from background
    chrome.runtime.sendMessage({ action: 'getStatus' }, (status) => {
      if (!status?.hasAuth) {
        showAuthRequiredView();
        updateStatus('Not authenticated', false);
        return;
      }
      
      // Update sync status based on last sync time
      if (status.lastSyncTime) {
        const timeSinceSync = Date.now() - status.lastSyncTime;
        const minutes = Math.floor(timeSinceSync / 60000);
        if (minutes < 1) {
          updateStatus('Synced just now', true);
        } else if (minutes < 60) {
          updateStatus(`Synced ${minutes}m ago`, true);
        } else {
          updateStatus('Sync needed', false);
        }
      }
    });
    
    // Load cached links and show them
    await loadLinks();
    
    // Show the links
    showLinksView();
    
    // Try to sync in background
    chrome.runtime.sendMessage({ action: 'sync' });
    
    isInitialized = true;
  } catch (error) {
    console.error('Error loading links:', error);
    showEmptyView();
    updateStatus('Error loading', false);
  }
}

// Load links from cache
async function loadLinks() {
  const result = await chrome.storage.local.get('goLinksCache');
  const cached = result.goLinksCache || {};
  goLinks = Object.entries(cached).map(([shortcut, url]) => ({ shortcut, url }));
}

// Refresh links without full re-initialization
async function refreshLinks() {
  await loadLinks();
  
  // If we're showing the links view, update it
  const linkList = document.getElementById('linkList');
  if (linkList) {
    // Preserve search input value if it exists
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput?.value || '';
    
    // Filter links based on current search
    const filtered = searchValue ? goLinks.filter(link => 
      link.shortcut.toLowerCase().includes(searchValue.toLowerCase()) ||
      link.url.toLowerCase().includes(searchValue.toLowerCase())
    ) : goLinks;
    
    displayLinks(filtered);
  } else if (goLinks.length === 0) {
    showEmptyView();
  } else {
    showLinksView();
  }
}

// Show links view
function showLinksView() {
  const mainContent = document.getElementById('mainContent');
  
  if (goLinks.length === 0) {
    showEmptyView();
    return;
  }
  
  // Check if the view is already showing to avoid recreating it
  const existingSearch = document.getElementById('searchInput');
  if (existingSearch) {
    // View already exists, just update the links
    displayLinks(goLinks);
    return;
  }
  
  mainContent.innerHTML = `
    <div class="search-container">
      <div class="search-wrapper">
        <input type="text" id="searchInput" class="search-input" placeholder="Search links..." autocomplete="off">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
    </div>
    <div id="linkList" class="links-container"></div>
    <div class="actions">
      <button class="action-btn" id="syncBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        Sync
      </button>
      <a href="${WEBAPP_URL}" target="_blank" class="action-btn primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2L2 19h20L12 2z"/>
        </svg>
        Dashboard
      </a>
    </div>
  `;
  
  // Set up event listeners
  document.getElementById('searchInput').addEventListener('input', handleSearch);
  document.getElementById('syncBtn').addEventListener('click', handleSync);
  
  // Display all links
  displayLinks(goLinks);
}

// Show empty view
function showEmptyView() {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
      <h3>No links yet</h3>
      <p>Create your first go link in the dashboard</p>
      <a href="${WEBAPP_URL}" target="_blank" class="auth-button">
        Open Dashboard
      </a>
    </div>
  `;
}

// Display links in the list
function displayLinks(links) {
  const linkList = document.getElementById('linkList');
  if (!linkList) return;
  
  linkList.innerHTML = links.map(link => `
    <div class="link-item" data-url="${link.url}">
      <div class="link-shortcut">go/${link.shortcut}</div>
      <div class="link-url">${link.url}</div>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.link-item').forEach(item => {
    item.addEventListener('click', () => {
      const url = item.dataset.url;
      chrome.tabs.create({ url });
      window.close();
    });
  });
}

// Handle search with debouncing
let searchTimeout = null;
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Debounce the search
  searchTimeout = setTimeout(() => {
    const filtered = goLinks.filter(link => 
      link.shortcut.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
    displayLinks(filtered);
  }, 150); // 150ms debounce
}

// Handle sync button
async function handleSync() {
  const syncBtn = document.getElementById('syncBtn');
  if (!syncBtn) return;
  
  // Clear any existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncBtn.disabled = true;
  syncBtn.innerHTML = '<div class="spinner"></div> Syncing...';
  updateStatus('Syncing...', false);
  
  // Set a timeout in case sync doesn't respond
  syncTimeout = setTimeout(() => {
    syncBtn.disabled = false;
    syncBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      Sync
    `;
    updateStatus('Sync timeout', false);
  }, 15000); // 15 second timeout
  
  chrome.runtime.sendMessage({ action: 'sync' }, async (response) => {
    // Clear timeout
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
    
    // Check if we got a proper response
    if (chrome.runtime.lastError) {
      console.error('Sync error:', chrome.runtime.lastError);
      updateStatus('Connection error', false);
    } else {
      // Refresh links after sync
      await refreshLinks();
      updateStatus(response?.success ? 'Synced' : 'Sync failed', response?.success || false);
    }
    
    syncBtn.disabled = false;
    syncBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
      Sync
    `;
  });
}

// Update sync status
function updateStatus(text, state = 'default') {
  const syncStatus = document.getElementById('syncStatus');
  if (!syncStatus) return;
  
  // Determine class based on state
  let className = 'sync-status';
  if (state === true || state === 'synced') {
    className = 'sync-status synced';
  } else if (state === 'error' || state === false) {
    className = 'sync-status error';
  } else if (state === 'warning') {
    className = 'sync-status warning';
  }
  
  syncStatus.className = className;
  syncStatus.innerHTML = `
    <div class="sync-dot"></div>
    <span>${text}</span>
  `;
}

// Show auth required view
function showAuthRequiredView() {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon" style="color: #ff4444;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3>Authentication Required</h3>
      <p>Please sign in to sync your go links</p>
      <a href="${WEBAPP_URL}" target="_blank" class="auth-button">
        Sign In
      </a>
    </div>
  `;
}

// Listen for messages from background
chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action === 'syncComplete') {
    // Clear timeout if exists
    if (syncTimeout) {
      clearTimeout(syncTimeout);
      syncTimeout = null;
    }
    
    // Only refresh if already initialized, otherwise let init() handle it
    if (isInitialized) {
      await refreshLinks();
      updateStatus('Synced', true);
    }
  } else if (request.action === 'syncError') {
    updateStatus(request.error || 'Sync error', false);
    if (request.error === 'Authentication required') {
      showAuthRequiredView();
    }
  }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);