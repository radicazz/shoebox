import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, truncate, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkOutput } from '../scripts/check-output.mjs';

const fixture = async (t, html = '<main id="projects">Projects</main>') => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'shoebox-output-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, 'index.html'), html);
  return directory;
};

test('checks themed, responsive, noscript, fallback, stylesheet, and fragment references', async (t) => {
  const directory = await fixture(t, `<main id="projects"></main><a href="#projects">Projects</a>
    <link href="/shoebox/site.css" rel="stylesheet">
    <template><picture><source srcset="/shoebox/light.avif 480w, /shoebox/light.avif 1024w"
      data-theme-srcset-dark="/shoebox/dark.avif 480w"><img src="/shoebox/light.png"
      data-theme-src-dark="/shoebox/dark.png" data-fallback-src="/shoebox/profile.svg"></picture></template>
    <noscript><img src="/shoebox/light.png"></noscript>
    <a href="https://github.com/radicazz/shoebox">GitHub</a>`);
  for (const name of ['light.avif', 'dark.avif', 'light.png', 'dark.png', 'profile.svg']) {
    await writeFile(path.join(directory, name), 'image');
  }
  await writeFile(path.join(directory, 'site.css'), 'body { background: url("./profile.svg"); }');
  assert.equal((await checkOutput(directory)).files, 7);
  await rm(path.join(directory, 'dark.avif'));
  await assert.rejects(checkOutput(directory), /missing local asset.*dark\.avif/);
});

test('rejects absent and empty index pages', async (t) => {
  const directory = await fixture(t, '');
  await assert.rejects(checkOutput(directory), /index.html is missing or empty/);
  await rm(path.join(directory, 'index.html'));
  await assert.rejects(checkOutput(directory), /index.html is missing or empty/);
});

test('enforces the output budget including unreferenced files', async (t) => {
  const directory = await fixture(t);
  const asset = path.join(directory, 'large.bin');
  await writeFile(asset, '');
  await truncate(asset, 16 * 1024 * 1024);
  await assert.rejects(checkOutput(directory), /exceeds.*budget/);
});

test('rejects missing assets, fragments, and references outside the configured base', async (t) => {
  for (const [html, error] of [
    ['<img src="/shoebox/missing.png">', /missing local asset/],
    ['<a href="#missing">Missing</a>', /missing fragment/],
    ['<img src="/media/profile.svg">', /bypasses \/shoebox\//],
  ]) {
    await assert.rejects(checkOutput(await fixture(t, html)), error);
  }
});

test('supports a root base and CSS-relative references', async (t) => {
  const directory = await fixture(t, '<link href="/styles/main.css" rel="stylesheet">');
  await mkdir(path.join(directory, 'styles'));
  await writeFile(path.join(directory, 'styles/main.css'), 'body { background: url(../image.svg); }');
  await writeFile(path.join(directory, 'image.svg'), 'image');
  assert.equal((await checkOutput(directory, { basePath: '/' })).files, 3);
  await rm(path.join(directory, 'image.svg'));
  await assert.rejects(checkOutput(directory, { basePath: '/' }), /missing local asset/);
});

test('rejects symbolic links in the Pages artifact', async (t) => {
  const directory = await fixture(t);
  await symlink('index.html', path.join(directory, 'linked.html'));
  await assert.rejects(checkOutput(directory), /symbolic link/);
});
