/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

beforeEach(() => {
  document.body.innerHTML = `
    <input type="text" id="shortcutInput">
    <input type="text" id="urlInput">
    <button id="addButton">Add</button>
    <div id="linkList"></div>
  `;

  global.chrome = {
    storage: { sync: { get: jest.fn(), set: jest.fn() } },
    runtime: { sendMessage: jest.fn() }
  };
});

test('loads links from storage and displays them', async () => {
  const links = { a: 'https://a.com' };
  chrome.storage.sync.get.mockImplementation((key, cb) => cb({ goLinks: links }));

  await import('../popup.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await Promise.resolve();

  const items = document.querySelectorAll('.link-item');
  expect(items.length).toBe(1);
  expect(items[0].querySelector('.link-shortcut').textContent).toBe('a');
  expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'mergeLinks' });
});

test('adds a new link on button click', async () => {
  chrome.storage.sync.get.mockImplementation((key, cb) => cb({ goLinks: {} }));
  chrome.storage.sync.set.mockImplementation((obj, cb) => cb && cb());

  await import('../popup.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await Promise.resolve();

  document.getElementById('shortcutInput').value = 'x';
  document.getElementById('urlInput').value = 'https://x.com';

  document.getElementById('addButton').click();
  await Promise.resolve();

  expect(chrome.storage.sync.set).toHaveBeenLastCalledWith(
    { goLinks: { x: 'https://x.com' } },
    expect.any(Function)
  );
});

test('deletes a link when delete button is clicked', async () => {
  const initial = { del: 'https://del.com' };
  chrome.storage.sync.get.mockImplementation((key, cb) => cb({ goLinks: { ...initial } }));
  chrome.storage.sync.set.mockImplementation((obj, cb) => cb && cb());

  await import('../popup.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await Promise.resolve();

  // delete button is created after DOMContentLoaded
  const deleteBtn = document.querySelector('.delete-btn');
  // When deleteLink calls chrome.storage.sync.get again
  chrome.storage.sync.get.mockImplementation((key, cb) => cb({ goLinks: { ...initial } }));

  deleteBtn.dispatchEvent(new Event('click'));
  await Promise.resolve();

  expect(chrome.storage.sync.set).toHaveBeenLastCalledWith(
    { goLinks: {} },
    expect.any(Function)
  );
});
