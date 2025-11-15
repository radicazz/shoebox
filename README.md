# about

A lightweight, personal Pinterest-style portfolio website for showcasing your hard work in style.

## features
- Profile header with avatar, contact links, and light/dark toggle (remembers system + user preferences)
- JSON-driven gallery grid (edit `public/gallery.json`) with responsive masonry layout
- Modular components (`Gallery.astro`, `GalleryItem.astro`) to prepare for the upcoming modal interactions

## quick-start

Either download as a `.zip` or clone the repo through git.

```
git clone https://www.github.com/radicazz/shoe-box.git/
cd shoe-box
```
Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) on your machine for self-contained dependency management currently pinned at Node **20.19.5**.

```bash
nvm install              # Reads .nvmrc and installs the exact toolchain
nvm use                  # Activates that version in your shell

npm install              # Installs node_modules/ into this repo (gitignored)
npm run dev              # Development server at http://localhost:4321
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

## license

MIT - See [LICENSE](LICENSE) for more details.
