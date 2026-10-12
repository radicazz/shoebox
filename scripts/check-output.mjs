import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MAX_BYTES = 16 * 1024 * 1024;
const LOCAL_ORIGIN = 'https://shoebox.invalid';

export const checkOutput = async (directory, { basePath = '/shoebox', maxBytes = MAX_BYTES } = {}) => {
  const files = new Map();
  const visit = async (relative = '') => {
    for (const name of await readdir(path.join(directory, relative))) {
      const filename = path.posix.join(relative, name);
      const stats = await lstat(path.join(directory, filename));
      if (stats.isSymbolicLink()) throw new Error(`dist contains a symbolic link: ${filename}`);
      if (stats.isDirectory()) await visit(filename);
      else if (stats.isFile()) files.set(filename, stats.size);
    }
  };

  try {
    await visit();
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('dist/index.html is missing or empty');
    throw error;
  }
  if (!files.get('index.html')) throw new Error('dist/index.html is missing or empty');
  const bytes = [...files.values()].reduce((sum, size) => sum + size, 0);
  if (bytes > maxBytes) throw new Error(`dist exceeds the ${maxBytes}-byte budget (${bytes} bytes)`);

  const base = `${basePath.replace(/\/$/, '')}/`;
  const references = [];
  const htmlIds = new Map();
  for (const filename of files.keys()) {
    if (!/\.(html|css)$/.test(filename)) continue;
    const source = await readFile(path.join(directory, filename), 'utf8');
    if (filename.endsWith('.html')) {
      htmlIds.set(filename, new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])));
      // Includes inert theme templates, noscript pictures, and the portrait fallback.
      const attributes = /\b(src|href|srcset|data-theme-src(?:set)?-(?:dark|light)|data-fallback-src)=["']([^"']*)["']/g;
      for (const [, attribute, value] of source.matchAll(attributes)) {
        const urls = attribute.includes('srcset') && !value.startsWith('data:')
          ? value.split(',').map((candidate) => candidate.trim().split(/\s+/)[0])
          : [value];
        for (const url of urls) references.push({ filename, url });
      }
    } else {
      for (const match of source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)) {
        references.push({ filename, url: match[1] });
      }
    }
  }

  for (const { filename, url: reference } of references) {
    if (!reference) continue;
    const url = new URL(reference.replace(/&amp;/g, '&'), `${LOCAL_ORIGIN}${base}${filename}`);
    if (url.origin !== LOCAL_ORIGIN) continue;
    if (!url.pathname.startsWith(base)) {
      throw new Error(`${filename}: local reference bypasses ${base}: ${reference}`);
    }
    let target = decodeURIComponent(url.pathname.slice(base.length));
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!files.has(target)) throw new Error(`${filename}: missing local asset ${reference}`);
    if (url.hash && htmlIds.has(target) && !htmlIds.get(target).has(decodeURIComponent(url.hash.slice(1)))) {
      throw new Error(`${filename}: missing fragment target ${reference}`);
    }
  }
  return { bytes, files: files.size };
};

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const { default: config } = await import('../astro.config.mjs');
    const directory = fileURLToPath(new URL('../dist/', import.meta.url));
    const result = await checkOutput(directory, { basePath: config.base });
    console.log(`✓ dist: ${result.files} files, ${result.bytes} bytes; local assets resolve within the 16 MiB budget`);
  } catch (error) {
    console.error(`✗ ${error.message}`);
    process.exitCode = 1;
  }
}
