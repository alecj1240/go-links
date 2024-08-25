const goLinks = {
  "calendar": "https://calendar.google.com",
  "canvas": "https://canvas.ubc.ca/",
  "chat": "https://chatgpt.com/",
  "claude": "https://claude.ai/new",
  "docs": "https://docs.google.com",
  "drive": "https://drive.google.com",
  "extensions": "chrome://extensions/",
  "github": "https://github.com/",
  "gmail": "https://mail.google.com/",
  "go": "chrome://extensions/?id=obphcibpljohboodikbpckofphjdljog",
  "hey": "https://app.hey.com/",
  "hn": "https://news.ycombinator.com/",
  "ig": "https://www.instagram.com/",
  "linkedin": "https://www.linkedin.com/feed/",
  "mail": "https://mail.google.com/",
  "notion": "https://www.notion.so/",
  "openai-limits": "https://platform.openai.com/settings/organization/limits",
  "openai-usage": "https://platform.openai.com/usage",
  "stripe": "https://dashboard.stripe.com/payments",
  "workday": "https://wd10.myworkday.com/ubc/d/home.htmld",
  "x": "https://x.com/home",
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