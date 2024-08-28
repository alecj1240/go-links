import { DEFAULT_GO_LINKS } from './constants.js';

function mergeLinks() {
  chrome.storage.sync.get('goLinks', function(data) {
    const storedLinks = data.goLinks || {};
    const mergedLinks = { ...DEFAULT_GO_LINKS, ...storedLinks };
    chrome.storage.sync.set({ goLinks: mergedLinks });
  });
}

chrome.runtime.onInstalled.addListener(mergeLinks);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'mergeLinks') {
    mergeLinks();
  }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  
  if (url.hostname === 'go' || url.hostname.endsWith('.go')) {
    const path = url.pathname.slice(1);
    chrome.storage.sync.get('goLinks', function(data) {
      const goLinks = data.goLinks || DEFAULT_GO_LINKS;
      const destination = goLinks[path];
      
      if (destination) {
        chrome.tabs.update(details.tabId, { url: destination });
      }
    });
  }
});