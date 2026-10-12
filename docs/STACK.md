# Stack and architecture

shoebox is a single-page Astro site exported as static files for GitHub Pages. There is no backend, database, runtime framework, remote font, or visitor-location service.

| Layer | Choice |
| --- | --- |
| Site generation | Astro 7, static output |
| Source | Astro components, TypeScript interfaces, JavaScript validation |
| Styling | Tailwind CSS 3 through PostCSS and Autoprefixer; project-owned CSS tokens |
| Images | Astro asset processing with sharp; responsive AVIF/WebP and PNG fallbacks |
| Tests | Node's built-in test runner |
| Toolchain | Node 22.21.1 and pnpm 10.23.0 |
| Hosting | GitHub Pages at `/shoebox/` |

[package.json](../package.json) and [pnpm-lock.yaml](../pnpm-lock.yaml) define dependency versions. [`.nvmrc`](../.nvmrc), the Node engine, and the pnpm package-manager/engine fields must agree on the pinned tools. No additional runtime dependencies are needed.

## Design constraints

- Render all portfolio content and navigation in static HTML. JavaScript enhances theme controls, selects matching image variants, and handles portrait fallback.
- Use system fonts, a static background grid, and ordinary CSS Grid/Flexbox layouts. Avoid continuous decorative animation or unnecessary browser work.
- Keep generated files below the enforced 16 MiB budget. Local images are processed during builds rather than by the hosting server.
- Keep public asset URLs aware of Astro's base path. Production and local preview both use `/shoebox/`.
- Maintain a short pnpm setup workflow with one lockfile. Build artifacts and browser-validation artifacts do not belong in Git.

The current quality checks validate content, behavior, shell syntax, and generated output. They do not provide a separate Astro/TypeScript type-check or formatting gate. Dependency migrations should remain separate from routine documentation or layout cleanup.
