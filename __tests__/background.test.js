import { jest } from '@jest/globals';
import { DEFAULT_GO_LINKS } from '../constants.js';

let onInstalledCallback;
let onChangedCallback;

beforeEach(async () => {
  global.chrome = {
    storage: {
      sync: {
        get: jest.fn(),
        set: jest.fn()
      },
      onChanged: { addListener: jest.fn(cb => { onChangedCallback = cb; }) }
    },
    declarativeNetRequest: {
      getDynamicRules: jest.fn(),
      updateDynamicRules: jest.fn()
    },
    runtime: {
      onInstalled: { addListener: jest.fn(cb => { onInstalledCallback = cb; }) }
    }
  };

  await import('../background.js');
});

describe('mergeLinksAndUpdateRules via onInstalled', () => {
  test('merges stored links with defaults and updates storage', () => {
    const stored = { custom: 'https://example.com' };

    chrome.storage.sync.get.mockImplementation((key, cb) => cb({ goLinks: stored }));
    chrome.storage.sync.set.mockImplementation((obj, cb) => { cb(); });

    // Simulate extension installation
    onInstalledCallback();

    expect(chrome.storage.sync.get).toHaveBeenCalledWith('goLinks', expect.any(Function));
    expect(chrome.storage.sync.set).toHaveBeenCalledWith(
      { goLinks: { ...DEFAULT_GO_LINKS, ...stored } },
      expect.any(Function)
    );
  });
});

describe('updateDeclarativeNetRequestRules via storage change', () => {
  test('removes existing rules and adds new redirect rules', () => {
    const links = { a: 'https://a.com', b: 'https://b.com' };
    chrome.declarativeNetRequest.getDynamicRules.mockImplementation(cb => cb([{ id: 10 }, { id: 20 }]));

    const calls = [];
    chrome.declarativeNetRequest.updateDynamicRules.mockImplementation((params, cb) => {
      calls.push(params);
      cb && cb();
    });

    // Simulate storage change event
    onChangedCallback({ goLinks: { newValue: links } }, 'sync');

    expect(chrome.declarativeNetRequest.getDynamicRules).toHaveBeenCalled();
    expect(calls[0]).toEqual({ removeRuleIds: [10, 20] });

    const expectedRules = [
      {
        id: 1,
        priority: 1,
        action: { type: 'redirect', redirect: { url: 'https://a.com' } },
        condition: { urlFilter: '*://go/a', resourceTypes: ['main_frame'] }
      },
      {
        id: 2,
        priority: 1,
        action: { type: 'redirect', redirect: { url: 'https://b.com' } },
        condition: { urlFilter: '*://go/b', resourceTypes: ['main_frame'] }
      }
    ];

    expect(calls[1]).toEqual({ addRules: expectedRules });
  });
});
