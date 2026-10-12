import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

const fixture = async (t, version = manifest.engines.pnpm) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'shoebox-tooling-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const project = path.join(directory, 'project');
  const elsewhere = path.join(directory, 'elsewhere');
  await mkdir(project);
  await mkdir(elsewhere);
  await cp(path.join(repository, 'scripts'), path.join(project, 'scripts'), { recursive: true });
  await writeFile(path.join(project, '.nvmrc'), `${process.version}\n`);
  await writeFile(path.join(project, 'package.json'), JSON.stringify({
    ...manifest, engines: { ...manifest.engines, node: process.version.slice(1) },
  }));
  const bin = path.join(directory, 'bin');
  await mkdir(bin);
  await writeFile(path.join(bin, 'pnpm'), `#!/usr/bin/env bash\nif [ "$1" = "--version" ]; then echo '${version}'; else pwd; printf '%s\\n' "$@"; fi\n`, { mode: 0o755 });
  const run = (script, extra = {}) => spawnSync('bash', [path.join(project, 'scripts', script)], {
    cwd: elsewhere,
    env: { ...process.env, PATH: `${bin}:${path.dirname(process.execPath)}:${process.env.PATH}`, SHOEBOX_PKG_MANAGER: 'pnpm', ...extra },
    encoding: 'utf8',
  });
  return { project, elsewhere, run };
};

test('developer commands run from the repository when invoked elsewhere', async (t) => {
  const { project, run } = await fixture(t);
  const result = run('dev');
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(project));
  assert.match(result.stdout, /run\ndev/);
});

test('CI helper installs with a frozen lockfile and delegates to the shared check', async (t) => {
  const { run } = await fixture(t);
  const result = run('ci-test');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /install\n--frozen-lockfile/);
  assert.match(result.stdout, /run\ncheck/);
});

test('rejects npm overrides and an incorrect pnpm version', async (t) => {
  const normal = await fixture(t);
  const npm = normal.run('dev', { SHOEBOX_PKG_MANAGER: 'npm' });
  assert.notEqual(npm.status, 0);
  assert.match(npm.stderr, /Only pnpm is supported/);
  const wrong = (await fixture(t, '0.0.0')).run('dev');
  assert.notEqual(wrong.status, 0);
  assert.match(wrong.stderr, /pnpm .* required but 0\.0\.0 is active/);
});

test('clean removes only repository artifacts when invoked elsewhere', async (t) => {
  const { project, elsewhere, run } = await fixture(t);
  for (const directory of [project, elsewhere]) {
    for (const name of ['dist', '.astro', 'node_modules']) await mkdir(path.join(directory, name));
  }
  const result = run('clean');
  assert.equal(result.status, 0, result.stderr);
  for (const name of ['dist', '.astro', 'node_modules']) {
    await assert.rejects(stat(path.join(project, name)), { code: 'ENOENT' });
    assert.equal((await stat(path.join(elsewhere, name))).isDirectory(), true);
  }
});
