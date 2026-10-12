# Implementation and maintenance

## Page structure

The index page loads validated gallery data, maps project IDs to imported artwork, and composes the base layout, profile introduction, project grid, and footer. The base layout owns metadata, the skip link, and the theme controller. Gallery cards own their static content and responsive image markup; the gallery enhances image selection when JavaScript is available.

Global styling is split into semantic tokens, page layout, and theme utilities. Component styles handle the portrait and project cards. Tailwind runs through the existing PostCSS configuration.

## Editing content

`src/data/gallery.json` supplies:

| Field | Meaning |
| --- | --- |
| `title`, `description` | Visible project-section heading and introductory text |
| `profile.name`, `profile.photo` | Author name and portrait path |
| `profile.repository`, `profile.about`, `profile.skills` | Author repository link, introduction, and skills |
| `items` | Ordered project records with `id`, `title`, `description`, `tags`, and `link` |

Strings must be nonempty, skills/tags must be nonempty lists of strings, and item IDs must be unique. Repository and project links must be valid HTTPS URLs. The site validates content both through `pnpm validate:data` and during the build.

Use public portrait paths such as `/media/pfp.jpeg`; the profile component adds the configured base path. `public/media/profile.svg` supplies the JavaScript error fallback. Public paths should not include `/shoebox` themselves.

To add project artwork:

1. Put light/dark source images in `src/assets/gallery/`.
2. Import them in `src/pages/index.astro` and add an entry to `galleryImageMap` using the matching project ID.
3. Run `pnpm check` and inspect both themes in production preview.

Projects without a map entry remain text cards. Responsive artwork currently has 480px and 1024px candidates; changes to image sizes must match the actual card layout and preserve the output budget.

## Local and CI validation

Use the pinned tools and run `pnpm install --frozen-lockfile`, then `pnpm check`. `./scripts/ci-test` performs both steps and is the shared entrypoint for pull-request/main CI and release-tag builds.

The checks cover shell syntax, content validation, Node tests, production compilation, and generated output. Output validation totals regular-file bytes, requires a nonempty index, rejects symbolic links, and checks local HTML/CSS references, including themed srcsets, no-JavaScript previews, portrait fallback, and fragment targets. It enforces the configured base path and a 16 MiB budget; it does not fetch external repository links.

`./scripts/doctor` checks the declared dependencies and current source paths, then validates content, build, and output. A failure retains a uniquely named build log in the temporary directory. `./scripts/clean` removes only this checkout's `node_modules/`, `dist/`, and `.astro/`.

For UI changes, inspect production preview at `/shoebox/` in both themes. Include narrow widths, breakpoint edges, enlarged text, keyboard navigation, reduced motion, JavaScript disabled, blocked storage, and failed portrait loading. Keep screenshots and one-off browser scripts outside the checkout.

## Validation record: 2026-10-12 cleanup

The frozen-install quality checks, repaired doctor command, shell syntax checks, and actionlint workflow validation passed. Focused tests cover gallery links and duplicate IDs, theme preference behavior, helper execution from another directory, pnpm enforcement, cleanup boundaries, and output-validation failures.

Headless Chromium production-preview checks passed in both themes at 320, 375, 390, 639, 640, 768, 1023, 1024, and 1440px. The checks confirmed six cards, correct one/two/three-column transitions, no horizontal overflow or clipped card text, and a 44px theme control. Additional checks covered preference persistence, dark-only initial project-image requests, keyboard skip-link activation, enlarged text and wrapping, landscape/reflow, reduced motion, JavaScript disabled, blocked storage, and the JPEG-to-SVG portrait fallback. Desktop and mobile captures were visually reviewed.

Measured text contrast was at least 4.89:1 across the tested theme tokens. The generated files totaled 14,963,558 bytes (14.27 MiB), below the 16 MiB cap. These are local measurements, not deployed-site or field-performance claims.

Physical touch devices, Safari/Firefox, actual browser zoom, and screen-reader checks remain outstanding. Public HTTP checks confirmed that the existing live site responds successfully and recent main CI runs passed. Repository Pages settings were unavailable through the unauthenticated API. This branch's workflows and updated assets still require verification after integration and release. See [deployment guidance](../.github/DEPLOYMENT.md) for release verification.
