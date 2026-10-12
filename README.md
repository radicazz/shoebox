# shoebox

[![Live](https://img.shields.io/badge/live-demo-1d4ed8)](https://radicazz.github.io/shoebox/)
[![Node](https://img.shields.io/badge/node-22.21.1-026e00)](./.nvmrc)
[![CI](https://github.com/radicazz/shoebox/actions/workflows/ci.yml/badge.svg)](https://github.com/radicazz/shoebox/actions/workflows/ci.yml)

A lightweight personal portfolio built with Astro. An author introduction and six projects sit in a responsive grid, with light and dark themes and locally optimized artwork. The site exports static HTML and CSS; its content and links work without JavaScript.

[View the site](https://radicazz.github.io/shoebox/).

## Quickstart

Use Bash and install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) once. On Windows, use WSL. Node and pnpm versions are pinned in [`.nvmrc`](./.nvmrc) and [`package.json`](./package.json).

```bash
git clone https://github.com/radicazz/shoebox.git
cd shoebox
nvm install
nvm use
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:4321/shoebox/**. pnpm is the only supported package manager; keep `pnpm-lock.yaml` as the single lockfile.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Export the site to `dist/` |
| `pnpm preview` | Serve the production build at `/shoebox/` |
| `pnpm check` | Check shell syntax, validate content, run tests, build, and validate output |
| `pnpm validate:data` | Validate profile and gallery content |
| `pnpm test` | Run the built-in Node test suite |
| `pnpm check:output` | Check an existing build for missing local assets and the 16 MiB limit |
| `./scripts/ci-test` | Install with a frozen lockfile, then run `pnpm check` |
| `./scripts/setup` | Install dependencies and build |
| `./scripts/dev` | Start development with tool-version checks |
| `./scripts/doctor` | Check tools, dependencies, content, build, and output |
| `./scripts/clean` | Remove this checkout's dependencies and generated build files |

Runtime scripts use nvm to install and activate the pinned Node version when a different version is active. Without nvm, the pinned Node version must already be active. Setup, dev, doctor, and quality helpers also verify the exact pnpm version. Helpers resolve paths from the checkout, even when invoked from another directory.

## Customize the portfolio

Edit [`src/data/gallery.json`](./src/data/gallery.json) for the author, gallery heading, descriptions, tags, and repository links. Projects appear in source order across rows. Add project artwork under `src/assets/gallery/` and map its light/dark imports to the project ID in [`src/pages/index.astro`](./src/pages/index.astro).

See [implementation guidance](./docs/IMPLEMENTATION.md) for the content contract and image workflow, [features](./docs/FEATURES.md) for site behavior, and [stack](./docs/STACK.md) for architecture and constraints.

## CI and publishing

Pull requests and pushes to `main` run the same frozen-install quality checks. Publishing happens only when a `v*` tag is pushed; merging to `main` does not deploy. See [GitHub Pages deployment](./.github/DEPLOYMENT.md) for setup, release steps, and troubleshooting.

Keep changes in focused Conventional Commits such as `fix:`, `feat:`, `ci:`, and `docs:`. Contributor instructions are in [AGENTS.md](./AGENTS.md).

## License

[MIT](./LICENSE).
