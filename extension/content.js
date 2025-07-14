// Content script to bridge communication between web app and extension
// This script runs on the web app pages and can communicate with the extension

// Listen for messages from the web app
window.addEventListener('message', (event) => {
  // Only accept messages from our web app (support both localhost ports and production)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://personalgolinks.com'
  ];
  if (!allowedOrigins.includes(event.origin)) return;
  
  if (event.data && event.data.type === 'GO_LINKS_AUTH') {
    // Forward the message to the background script
    chrome.runtime.sendMessage({
      action: 'login',
      token: event.data.token,
      config: event.data.config
    }, (response) => {
      // Send response back to web app
      window.postMessage({
        type: 'GO_LINKS_AUTH_RESPONSE',
        success: response && response.success
      }, event.origin);
    });
  }
});

// Inject a helper function into the page
const script = document.createElement('script');
script.textContent = `
  window.goLinksExtension = {
    sendAuthData: function(token, config) {
      window.postMessage({
        type: 'GO_LINKS_AUTH',
        token: token,
        config: config
      }, '*');
    }
  };
`;
document.head.appendChild(script);