import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const layout = await readFile(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
const script = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)[1];

// Exercise the shipped theme controller with browser API stand-ins, without a test framework.
const createBrowser = ({ dark = false, stored = null, blocked = false } = {}) => {
  const root = { dataset: {}, classList: { toggle() {} } };
  const label = { textContent: '' };
  const button = new EventTarget();
  button.hidden = true;
  button.attributes = {};
  button.querySelector = () => label;
  button.setAttribute = (key, value) => { button.attributes[key] = value; };
  const document = new EventTarget();
  document.readyState = 'loading';
  document.documentElement = root;
  document.querySelectorAll = () => [button];
  const media = new EventTarget();
  media.matches = dark;
  const storage = new Map(stored === null ? [] : [['shoebox-theme', stored]]);
  const localStorage = {
    getItem(key) { if (blocked) throw new Error('Blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('Blocked'); storage.set(key, value); },
    removeItem(key) { if (blocked) throw new Error('Blocked'); storage.delete(key); },
  };
  const window = { matchMedia: () => media };
  runInNewContext(script, { window, document, localStorage, CustomEvent, console: { warn() {} } });
  const ready = () => document.dispatchEvent(new Event('DOMContentLoaded'));
  const systemTheme = (next) => {
    media.matches = next;
    media.dispatchEvent(Object.assign(new Event('change'), { matches: next }));
  };
  return { root, button, label, storage, window, ready, systemTheme };
};

test('theme toggle stays hidden until its handler is bound and persists choices', () => {
  const browser = createBrowser();
  assert.equal(browser.button.hidden, true);
  browser.ready();
  assert.equal(browser.button.hidden, false);
  assert.equal(browser.label.textContent, 'Switch to dark mode');
  browser.button.dispatchEvent(new Event('click'));
  assert.equal(browser.root.dataset.theme, 'dark');
  assert.equal(browser.button.attributes['aria-pressed'], 'true');
  assert.equal(browser.label.textContent, 'Switch to light mode');
  assert.equal(browser.storage.get('shoebox-theme'), 'dark');
});

test('invalid stored preferences fall back to system theme', () => {
  const browser = createBrowser({ stored: 'invalid', dark: true });
  assert.equal(browser.root.dataset.theme, 'dark');
  browser.ready();
  browser.systemTheme(false);
  assert.equal(browser.root.dataset.theme, 'light');
});

test('explicit choice overrides system changes until cleared', () => {
  const browser = createBrowser({ stored: 'light', dark: true });
  browser.ready();
  browser.systemTheme(true);
  assert.equal(browser.root.dataset.theme, 'light');
  browser.window.__shoeboxTheme.clear();
  assert.equal(browser.root.dataset.theme, 'dark');
  browser.systemTheme(false);
  assert.equal(browser.root.dataset.theme, 'light');
});

test('blocked storage does not prevent theme controls from working', () => {
  const browser = createBrowser({ blocked: true, dark: true });
  browser.ready();
  browser.button.dispatchEvent(new Event('click'));
  assert.equal(browser.root.dataset.theme, 'light');
  browser.window.__shoeboxTheme.clear();
  assert.equal(browser.root.dataset.theme, 'dark');
});
