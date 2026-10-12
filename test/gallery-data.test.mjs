import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { validateGalleryData } from '../src/data/validate-gallery.mjs';

const data = JSON.parse(await readFile(new URL('../src/data/gallery.json', import.meta.url), 'utf8'));

test('gallery data is valid', () => {
  assert.doesNotThrow(() => validateGalleryData(data));
});

test('gallery data rejects duplicate ids', () => {
  const duplicateIdData = structuredClone(data);
  duplicateIdData.items[1].id = duplicateIdData.items[0].id;

  assert.throws(() => validateGalleryData(duplicateIdData), /duplicate item id/);
});

test('gallery data rejects non-HTTPS project links', () => {
  const insecureLinkData = structuredClone(data);
  insecureLinkData.items[0].link = 'http://example.com';

  assert.throws(() => validateGalleryData(insecureLinkData), /must use https/);
});

test('gallery data rejects malformed HTTPS project and profile links', () => {
  for (const link of ['https://', 'https://[invalid', 'not a URL']) {
    const project = structuredClone(data);
    project.items[0].link = link;
    assert.throws(() => validateGalleryData(project), /items\[0\]\.link must be a valid URL/);

    const profile = structuredClone(data);
    profile.profile.repository = link;
    assert.throws(() => validateGalleryData(profile), /profile\.repository must be a valid URL/);
  }
});
