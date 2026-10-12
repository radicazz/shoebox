# AGENTS.md

Project: **shoebox** — a lightweight personal portfolio gallery built with Astro and exported to GitHub Pages.

## Current site

The site has a workspace header, author introduction, responsive project grid, and footer. Six projects currently appear in row order, with one/two/three columns at the 640px and 1024px breakpoints. Content and links render without JavaScript. Optional scripts control persistent themes, select matching artwork, and handle portrait fallback.

## Documentation

- [README.md](./README.md): quickstart, commands, and project overview
- [docs/STACK.md](./docs/STACK.md): stack and architectural constraints
- [docs/IMPLEMENTATION.md](./docs/IMPLEMENTATION.md): content editing, validation, and maintenance
- [docs/FEATURES.md](./docs/FEATURES.md): current site behavior
- [.github/DEPLOYMENT.md](./.github/DEPLOYMENT.md): hosting setup and tag-based releases

Update the relevant documentation when behavior, commands, content structure, or workflows change. Describe implemented behavior; distinguish completed validation from outstanding checks.

## Requirements

- Use modern JavaScript, semantic HTML, and CSS Grid/Flexbox with consistent naming and formatting.
- Preserve the static, performance-first architecture, progressive enhancement, accessible controls, and a setup workflow targeting under five minutes with the pinned tools.
- Use local assets and system fonts. Keep generated output within the enforced 16 MiB budget.
- Keep public paths aware of the configured `/shoebox` base and verify production preview.
- pnpm is the only supported package manager. Keep `pnpm-lock.yaml` as the single lockfile and use local `node_modules/` dependencies.
- Preserve useful developer commands; remove obsolete code only after checking its callers and references.

## Tools and commands

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) once, then run:

```bash
nvm install
nvm use
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm dev
```

The tool pins are Node 22.21.1 in `.nvmrc` and pnpm 10.23.0 in `package.json`; engine fields must agree. Runtime scripts source `scripts/_nvm-load.sh`, which uses nvm to install/activate the pinned Node version when a different version is active, or fails if nvm is unavailable. Setup, dev, doctor, and quality helpers also enforce the pinned pnpm version. The clean helper requires only Bash and scopes deletion to this checkout.

Run `pnpm check` before completing implementation work. It checks shell syntax, validates data, runs tests, builds the site, and validates output. `./scripts/ci-test` additionally performs a frozen-lockfile installation and is the CI entrypoint. Validate workflow edits with `actionlint`; use production-preview browser checks for changes affecting presentation or browser behavior. Keep one-off validation artifacts outside the repository.

## Git rules

- Work on a focused branch and preserve unrelated changes. Do not reset, discard, or amend another contributor's work.
- Split changes into logical, independently reviewable commits. Keep unrelated dependency upgrades, behavioral fixes, refactors, and documentation work separate.
- Use lowercase Conventional Commit subjects: `feat:`, `fix:`, `refactor:`, `ci:`, `docs:`, `test:`, or `chore:`. Optional scopes are welcome, for example `fix(theme): handle blocked storage`.
- Inspect staged diffs and run relevant checks before each commit. Run the complete quality checks for the final result and report any checks that could not be completed.
- Commit source, artwork, documentation, and the pnpm lockfile. Keep `dist/`, `.astro/`, dependencies, caches, and browser artifacts untracked.
- Routine cleanup does not include release tags or publication. Releases use reviewed changes on `main` and a new `v*` tag; merging alone does not deploy. Preserve logical commits when integrating a branch.

## Components and content

- `src/layouts/Base.astro`: page metadata, skip link, layout, and theme controller
- `src/components/ProfileSection.astro`: author introduction and portrait
- `src/components/gallery/Gallery.astro`: project section, grid, and themed-image enhancement
- `src/components/gallery/GalleryItem.astro`: readable project cards and responsive previews
- `src/data/gallery.json`: author and project content, validated at build time
- `src/pages/index.astro`: composition and imported artwork mapping
