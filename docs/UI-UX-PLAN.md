# UI/UX review and implementation plan

Reviewed 2026-10-12. This is a source and build review; visual browser testing is still required. This document plans the redesign without changing the application.

## Current findings

- **Critical: progressive enhancement is broken.** `layout.css` hides `.masonry-section` until the inline script in `Gallery.astro` adds a class. Without JavaScript, most content is invisible unless reduced motion is enabled. Render everything visibly by default.
- **High: profile metadata describes the visitor.** `ProfileSection.astro` replaces the author's title and location with the visitor's country and IP from ipapi.co. Missing data leaves permanent “detecting” placeholders on failure. Remove this request and render author information from content; omit unknown location rather than inventing it.
- **High: weak hierarchy.** Profile, about, skills, and projects share the same column flow. The gallery heading and description are hidden, while the only h1 is screen-reader-only. Introduce a visible identity heading and a distinct project section.
- **High: fragile card readability.** Image cards position all text absolutely over bounded screenshots. Long descriptions, tags, narrow screens, and enlarged text can crowd the image or exceed its container. Put project metadata in normal flow below the image.
- **Medium: reading order.** CSS columns flow vertically before moving right; browsing projects visually and by keyboard can feel inconsistent. Use a row-major CSS Grid, keeping source and visual order aligned. This intentionally replaces masonry and must be reflected in FEATURES.md.
- **Medium: excessive effects.** The outer shell scales on hover, multiple cards move, panels apply backdrop blur, and a continuous canvas network competes with the work. The canvas also mixes device-pixel dimensions with CSS-pixel node coordinates. Replace the decorative canvas/parallax with a subtle static grid.
- **Medium: accessibility polish.** Add a skip link, visible section headings, shared focus styles, and a minimum 44px theme-toggle target. Reduced-motion styles currently remove transitions but still permit several hover/focus transforms and smooth scrolling.
- **Medium: image delivery.** The hard-coded image `sizes` values do not account accurately for nested padding or capped content width. Initial light sources can load before scripts swap to dark sources. Review requests after the new layout; preserve Astro image processing and intrinsic dimensions.
- **Strengths to preserve:** static Astro output, semantic project links, theme preference persistence, system fonts, local theme-aware images, data validation, safe-area gutters, and pnpm-only reproducibility.

## Visual direction

A personal developer workspace: quiet graphite surfaces, crisp dividers, cyan accents, restrained corners, and monospace labels. Keep the author's playful skills and existing project content. Use syntax-like accents sparingly in section labels and a static `radicazz / shoebox` window title, with plain visible names and descriptions.

Use system sans-serif for body copy and existing monospace fallbacks for labels, tags, and repository links. No remote fonts or new runtime framework. Start with the existing accessible text colors, reduce radius to roughly 8–12px and shadows to a subtle elevation, and verify contrast after tuning. Light mode gets equally intentional off-white surfaces and a darker cyan accent. Continue honoring system preference and stored theme selection.

Proposed order:

1. Compact workspace header with identity, Projects anchor, GitHub link, and theme toggle. Decorative window dots remain noninteractive. Replace the live clock with a useful static label.
2. Profile introduction: smaller avatar, visible h1, author role/about, existing playful skills, and a clearly labeled GitHub action using existing content. Do not fabricate a contact address or availability status.
3. Visible “Selected projects” heading and description, followed by six project cards. Screenshots above titles, descriptions, wrapping tags, and a persistent repository affordance. Text-only cards follow the same spacing and hierarchy without synthetic screenshots.
4. Simple static attribution footer.

## Responsive behavior

- Mobile first: 16px gutters, wrapping header actions, stacked introduction, single-column projects, and no fixed-height text containers.
- At approximately 640px: two project columns only when cards retain comfortable width; allow the intro to split when its content fits.
- At approximately 1024px: three project columns, approximately 1200–1280px maximum content width, and a balanced horizontal introduction.
- Use `minmax(0, 1fr)`, `min-width: 0`, wrapping tags, fluid heading sizes, and overflow wrapping for long tokens. Fix overflow at its source instead of relying on `body { overflow-x: hidden }`.
- Keep screenshot previews at a consistent ratio with project-appropriate fit/position; inspect existing artwork before choosing cropping. Update `sizes` to match actual card widths and retain lazy loading for below-fold images.
- Keep all descriptions and link indicators visible on touch. Hover and keyboard focus may change borders/color but should not move the page shell.

## Logical commits

Each implementation commit should build, remain independently reviewable, and include relevant verification. The plan itself can be committed as `docs: add UI UX redesign plan`.

| Order | Conventional Commit subject | Scope and completion criteria |
| --- | --- | --- |
| 1 | `fix(a11y): make portfolio content usable without JavaScript` | Make gallery visible by default; make animation optional; add skip link and main target; correct reduced-motion transforms and scrolling; hide the inactive theme control until its handlers are bound. Static content and project links work with JS disabled. |
| 2 | `fix(profile): show author metadata instead of visitor IP` | Remove ipapi fetch and detecting placeholders; use optional author title/location; decouple and remove the clock in favor of a static workspace label. Profile renders consistently offline. |
| 3 | `feat(theme): introduce a restrained developer visual system` | Tune semantic tokens, spacing, borders, corners, and both palettes; remove canvas/parallax and outer-shell transforms; replace animated footer styling; unify focus and interaction styles. No new runtime dependencies or continuous decorative animation. |
| 4 | `feat(layout): separate profile introduction from project gallery` | Refactor index/ProfileSection/Gallery together: visible heading hierarchy, compact responsive header, introduction outside gallery, and row-major responsive Grid. Update FEATURES.md for the masonry-to-grid change. Verify source order and 1/2/3-column transitions. |
| 5 | `feat(gallery): add readable project cards and responsive previews` | Move image metadata into normal flow, unify text/image cards, add persistent external-link affordances, and adjust responsive image sizes. Verify long descriptions, wrapping tags, both screenshot themes, and keyboard/touch states. |
| 6 | `docs: document redesign validation and responsive behavior` | Record actual browser checks, image request findings, remaining limitations, and final behavior in project docs. Add focused behavioral regression coverage only where useful; avoid CSS snapshot tests or adding a framework for a one-off audit. |

## Git and hosting

Verified with local Git and `gh`: public repository `radicazz/shoebox`, default branch `main`, initial working tree clean, current local HEAD `f6504e3` (`chore: release v0.8.3`). Recent history already uses Conventional Commits.

- Implement on a branch such as `feat/portfolio-ui-refresh`, then open a PR into main. Preserve the logical commits when merging; if repository settings require squash, use separate PRs for the slices to retain that history.
- GitHub Pages uses workflow deployment at `https://radicazz.github.io/shoebox/`. Keep Astro `base: '/shoebox'`, canonical configuration, and BASE_URL-aware public asset paths. Verify `/shoebox/` directly in the production preview; use fragment anchors for on-page navigation.
- CI runs on PRs and pushes to main. Deployment runs only for `v*` tags. Merging alone does not deploy; create the next release tag only after the reviewed changes are merged and deployment is authorized. No release/tag is needed for planning.
- Commit source artwork, source code, docs, and the existing `pnpm-lock.yaml`. Keep `dist/`, `.astro/`, dependencies, and local browser artifacts untracked. Add ignore entries only if tooling introduces new generated directories.
- Open dependency PRs #9, #12, and #13 were observed during review. Keep dependency upgrades separate; check the branch against updated main before merging. No GitHub Releases were returned by `gh release list`; that does not establish whether Git tags exist.

## Validation and acceptance

Baseline: content validation, current tests, static build, and output-budget check completed successfully. Output is reported as approximately 15 MiB against a 16 MiB cap, leaving little room for new assets. The shell initially reported an nvm version lookup failure, but subsequent project scripts completed. Confirm the pinned Node 22.21.1 and pnpm 10.23.0 environment before implementation checks. Existing browser-data freshness warnings are separate maintenance work.

Required per relevant slice: `pnpm validate:data`, `pnpm test`, `pnpm build`, and `pnpm check:output`. Existing tests primarily cover gallery data; a passing build does not establish responsive correctness.

Before merge, inspect 320, 375, 390, 640, 768, 1024, and 1440px widths, plus landscape and breakpoint edges. Test both themes, 200% text enlargement and 400% zoom/reflow, keyboard navigation, reduced motion, JS disabled, blocked storage, and failed image loading. Confirm no horizontal overflow, clipped descriptions, hidden focus, or tiny controls. Check headings, accessible link names, and normal text contrast of at least 4.5:1; focus/control boundaries need sufficient contrast too.

Use production preview and browser request inspection to verify base-path assets, theme persistence, screenshot switching, and appropriate image candidates. Avoid unnecessary image downloads during theme initialization. Compare load and layout stability with the baseline using browser tools; keep CLS below 0.1 and avoid increasing shipped runtime JS or the existing output budget. Record measured results rather than claiming them from source inspection.

Defer category filters, project modals, terminal simulators, and extra animations: six projects currently need clearer presentation more than additional controls.

## Implementation status

Implemented on `feat/portfolio-ui-refresh` on 2026-10-12. The planned fixes and visual changes are complete; an additional focused fix validates stored theme values and makes the skip link bypass workspace navigation. See `IMPLEMENTATION.md` for measured validation and remaining release checks. No deployment or release tag is part of this implementation.
