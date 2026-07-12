# Implementation and deployment

Run `pnpm install`, `pnpm validate:data`, `pnpm test`, and `pnpm build` before merging.

GitHub Actions runs the same quality gates on pull requests and main. Tagged releases publish the static `dist/` artifact to GitHub Pages.

Gallery content lives in `src/data/gallery.json`; images used by Astro processing live in `src/assets/gallery`.
