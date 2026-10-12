# Implementation and deployment

Run `pnpm install`, `pnpm validate:data`, `pnpm test`, and `pnpm build` before merging.

GitHub Actions runs the same quality gates on pull requests and main. Tagged releases publish the static `dist/` artifact to GitHub Pages.

Gallery content lives in `src/data/gallery.json`; images used by Astro processing live in `src/assets/gallery`.

## UI refresh validation (2026-10-12)

Implemented the responsive developer workspace described in `UI-UX-PLAN.md`. The introduction is separate from the row-major project grid; screenshot metadata lives below full square previews. The background grid is static, and all core content works without JavaScript. Theme-dependent pictures are selected in inert templates before insertion to avoid loading the opposite variant; optimized light previews remain available through `noscript`.

Validated with Node 22.21.1, pnpm 10.23.0, and a frozen-lockfile installation. `pnpm validate:data`, `pnpm test`, `pnpm build`, and `pnpm check:output` pass. Focused theme-controller tests cover binding controls, invalid saved values, explicit preference precedence, clearing preferences, and blocked storage.

Local production preview at `/shoebox/` was checked in headless Chromium:

- Both themes at 320, 375, 390, 639, 640, 768, 1023, 1024, and 1440px. Correct 1/2/3-column behavior, six visible cards, no horizontal overflow or clipped card text, and a 44px theme control.
- 200% root text size at 320px, long descriptions and unbroken technology labels, 768×375 landscape, and 360px reflow (equivalent layout width to 400% zoom from 1440px).
- Keyboard skip-link activation and visible focus, theme persistence, reduced motion, JavaScript disabled, blocked localStorage, and a blocked portrait request with the local SVG fallback.
- Fresh dark-theme navigation and scrolling request only dark AVIF project previews, with no failed asset responses. Fully loaded desktop and mobile screenshots were visually reviewed in both themes.
- Primary, muted, and accent text against page, surface, and muted surface tokens have a minimum measured contrast of 4.89:1. Layout-shift observations recorded CLS 0 in the viewport matrix; this is a local lab observation, not field performance data.

Inline JavaScript is approximately 7.6 KB versus 16.6 KB in the prior source scripts. The static output contains 15,022,118 bytes of files and remains within the existing 16 MiB budget. No new dependencies, fonts, source artwork, or lockfile changes were required. Generated browser scripts, screenshots, and results were kept outside the repository in `/tmp`.

Remaining release checks: verify on physical touch devices and Safari/Firefox, perform an actual browser zoom and screen-reader pass, and confirm deployed assets after an authorized release tag. Headless viewport/text-size checks do not substitute for those checks. The dependency review below is separate from this UI change.

## Dependency review (2026-10-12)

Upgraded Astro from 5.18.2 to 7.3.8 and refreshed compatible transitive dependencies in `pnpm-lock.yaml`. Astro 7 supports the existing Node 22.21.1 and pnpm 10.23.0 pins. Autoprefixer 10.6.1, sharp 0.35.5, and Tailwind CSS 3.4.19 were already current within their selected release lines.

Removed `@astrojs/tailwind` 6.0.2, which declares Astro compatibility only through v5. Tailwind 3 continues to run through the existing `postcss.config.cjs` and `@tailwind` directives in `global.css`. Keeping Tailwind 3 avoids introducing Tailwind 4's styling and browser-support changes into the framework update. Moved an HTML comment out of a template expression to satisfy Astro 7's stricter compiler.

The registry audit dropped from 42 advisories (including one critical) to three: a low-severity esbuild Windows development-server advisory, a high-severity braces deeply nested pattern advisory, and a moderate-severity postcss-selector-parser CPU exhaustion advisory. These dependencies are build tooling; the deployed site remains static. Braces has no patched release in the audit, and the other fixes require versions outside the parents' declared dependency ranges. No unsupported overrides or advisory suppressions were added. Recheck these when Vite or Tailwind updates; consider Tailwind 4 as a separate styling migration.

Validation: frozen-lockfile install, content validation, existing tests, production build with all 36 image variants regenerated from an empty asset cache, development-route smoke test, and the 16 MiB output check pass. Headless Chromium checks pass in both themes at nine widths from 320 to 1440px, including theme persistence, dark-only image requests, keyboard skip link, enlarged text, reduced motion, JavaScript disabled, blocked storage, and portrait fallback. Text contrast remains at least 4.89:1. Physical-device, Safari/Firefox, and deployed-site release checks above remain outstanding.

References: [Astro 6 migration guide](https://docs.astro.build/en/guides/upgrade-to/v6/), [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/), and [deprecated Tailwind integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/).
