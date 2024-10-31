import { DEFAULT_GO_LINKS } from './constants.js';

function mergeLinksAndUpdateRules() {
  chrome.storage.sync.get('goLinks', function (data) {
    const storedLinks = data.goLinks || {};
    const mergedLinks = { ...DEFAULT_GO_LINKS, ...storedLinks };

    chrome.storage.sync.set({ goLinks: mergedLinks }, function () {
      updateDeclarativeNetRequestRules(mergedLinks);
    });
  });
}

function updateDeclarativeNetRequestRules(goLinks) {
  // First, remove all existing dynamic rules
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    const ruleIds = rules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules(
      { removeRuleIds: ruleIds },
      () => {
        // Now, add new rules based on goLinks
        const newRules = Object.keys(goLinks).map((key, index) => ({
          id: index + 1,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: { url: goLinks[key] }
          },
          condition: {
            urlFilter: `*://go/${key}`,
            resourceTypes: ['main_frame']
          }
        }));

        chrome.declarativeNetRequest.updateDynamicRules(
          { addRules: newRules },
          () => {
            console.log('Updated declarativeNetRequest rules');
          }
        );
      }
    );
  });
}

// Merge links and update rules when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  mergeLinksAndUpdateRules();
});

// Update rules whenever goLinks changes
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (areaName === 'sync' && changes.goLinks) {
    const newGoLinks = changes.goLinks.newValue;
    updateDeclarativeNetRequestRules(newGoLinks);
  }
});
