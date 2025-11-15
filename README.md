# shoe-box

Lightweight, personal Pinterest-style gallery website to showcase your work.

## quick-start

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) once on your machine, then every clone can stay self-contained thanks to the `.nvmrc` pinned at Node **20.19.5**.

```bash
git clone https://www.github.com/radicazz/shoe-box.git/
cd shoe-box

nvm install              # Reads .nvmrc and installs the exact toolchain
nvm use                  # Activates that version in your shell

npm install              # Installs node_modules/ into this repo (gitignored)
npm run dev              # Development server at http://localhost:4321
```

Helper scripts wrap the same flow and automatically load `.nvmrc` via `scripts/_nvm-load.sh`:

```bash
./scripts/setup         # Install deps and build once
./scripts/dev           # Start dev server
./scripts/clean         # Remove node_modules/ + dist/
```

All Node dependencies live in `node_modules/` inside this repo (gitignored) to keep the project portable.

Build manually when needed:

```bash
npm run build           # Production build to dist/
```

**Helpful scripts:**
- `./scripts/doctor` - Check environment health
- `./scripts/clean` - Remove all build artifacts
- `./scripts/ci-test` - Run CI pipeline locally

**Docs:** Read docs/STACK.md → docs/FEATURES.md → docs/IMPLEMENTATION.md

## license

MIT - See [LICENSE](LICENSE) for more details.
