// Enhanced content script for better auth sync
console.log('Go Links extension content script loaded');

// Helper function to safely send messages to extension
function sendMessageToExtension(message) {
  try {
    if (!chrome.runtime || !chrome.runtime.id) {
      console.log('Extension context invalidated, cannot send message');
      return;
    }
    
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        if (chrome.runtime.lastError.message.includes('Extension context invalidated')) {
          console.log('Extension context invalidated during message send');
        } else {
          console.error('Error sending message to extension:', chrome.runtime.lastError.message);
        }
      }
    });
  } catch (error) {
    console.error('Error sending message to extension:', error);
  }
}

// Function to check and send auth data to extension
function checkAndSendAuth() {
  try {
    // Check if extension context is still valid
    if (!chrome.runtime || !chrome.runtime.id) {
      console.log('Extension context invalidated, skipping auth sync');
      return;
    }

    // Check for auth state in localStorage
    const authState = localStorage.getItem('go_links_auth_state');
    // Get project ID from current URL or use a fallback pattern
    const projectId = window.location.hostname.split('.')[0];
    const supabaseAuth = localStorage.getItem(`sb-${projectId}-auth-token`);
    
    if (authState) {
      const authData = JSON.parse(authState);
      if (authData.session && authData.session.access_token) {
        console.log('Found auth state, sending to extension');
        sendMessageToExtension({
          action: 'login',
          token: authData.session.access_token
        });
      }
    } else if (supabaseAuth) {
      const session = JSON.parse(supabaseAuth);
      const currentSession = session.currentSession || session;
      if (currentSession && currentSession.access_token) {
        console.log('Found Supabase auth, sending to extension');
        sendMessageToExtension({
          action: 'login',
          token: currentSession.access_token
        });
      }
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
}

// Check auth on page load
checkAndSendAuth();

// Listen for custom auth change events
window.addEventListener('go_links_auth_change', (event) => {
  console.log('Auth change event detected:', event.detail);
  setTimeout(checkAndSendAuth, 100); // Small delay to ensure localStorage is updated
});

// Listen for storage changes
window.addEventListener('storage', (event) => {
  if (event.key === 'go_links_auth_state' || event.key.startsWith('sb-') && event.key.endsWith('-auth-token')) {
    console.log('Storage change detected for auth key');
    checkAndSendAuth();
  }
});

// Also check periodically in case we miss events
setInterval(checkAndSendAuth, 10000); // Check every 10 seconds

// Listen for sync requests from extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkAuth') {
    checkAndSendAuth();
    sendResponse({ success: true });
  }
});