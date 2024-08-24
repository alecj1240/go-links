const goLinks = {
  "calendar": "https://calendar.google.com",
  "chat": "https://chatgpt.com/",
  "docs": "https://docs.google.com",
  "drive": "https://drive.google.com",
  "extensions": "chrome://extensions/",
  "github": "https://github.com/",
  "gmail": "https://mail.google.com/",
  "hn": "https://news.ycombinator.com/",
  "mail": "https://mail.google.com/",
  "notion": "https://www.notion.so/",
  "workday": "https://wd10.myworkday.com/ubc/d/home.htmld",
  "youtube": "https://www.youtube.com/feed/subscriptions",
};

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);

  if (url.hostname === 'go' || url.hostname.endsWith('.go')) {
    const path = url.pathname.slice(1);
    const destination = goLinks[path];

    if (destination) {
      chrome.tabs.update(details.tabId, { url: destination });
    }
  }
});