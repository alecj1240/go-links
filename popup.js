import { DEFAULT_GO_LINKS } from './constants.js';

document.addEventListener('DOMContentLoaded', function() {
  const shortcutInput = document.getElementById('shortcutInput');
  const urlInput = document.getElementById('urlInput');
  const addButton = document.getElementById('addButton');
  const linkList = document.getElementById('linkList');

  function displayLinks(links) {
    linkList.innerHTML = '';

    Object.entries(links).forEach(([shortcut, url]) => {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';

      const linkInfo = document.createElement('div');
      linkInfo.className = 'link-info';

      const shortcutElement = document.createElement('div');
      shortcutElement.className = 'link-shortcut';
      shortcutElement.textContent = shortcut;

      const urlElement = document.createElement('div');
      urlElement.className = 'link-url';
      urlElement.textContent = url;

      linkInfo.appendChild(shortcutElement);
      linkInfo.appendChild(urlElement);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.innerHTML = '&times;';
      deleteButton.setAttribute('aria-label', 'Delete link');
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteLink(shortcut);
      });

      linkItem.appendChild(linkInfo);
      linkItem.appendChild(deleteButton);
      linkList.appendChild(linkItem);
    });
  }

  function deleteLink(shortcut) {
    chrome.storage.sync.get('goLinks', function(data) {
      const links = data.goLinks || DEFAULT_GO_LINKS;
      delete links[shortcut];
      chrome.storage.sync.set({goLinks: links}, function() {
        loadLinks();
      });
    });
  }

  function loadLinks() {
    chrome.storage.sync.get('goLinks', function(data) {
      const links = data.goLinks || DEFAULT_GO_LINKS;
      displayLinks(links);
    });
  }

  addButton.addEventListener('click', function() {
    const shortcut = shortcutInput.value.trim();
    const url = urlInput.value.trim();
    if (shortcut && url) {
      chrome.storage.sync.get('goLinks', function(data) {
        const links = data.goLinks || DEFAULT_GO_LINKS;
        links[shortcut] = url;
        chrome.storage.sync.set({goLinks: links}, function() {
          shortcutInput.value = '';
          urlInput.value = '';
          loadLinks();
        });
      });
    }
  });

  loadLinks();
  chrome.runtime.sendMessage({ action: 'mergeLinks' });
});