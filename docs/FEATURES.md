# Site features

## Layout and content

- A compact workspace header contains in-page navigation, the author's repository link, and an optional theme control.
- The introduction displays the author's name, portrait, about text, skills, and repository link from content data. Optional title/location metadata describes the author; no visitor lookup occurs.
- The project section currently contains six cards in source order across rows. The grid has one column below 640px, two from 640px, and three from 1024px, within a 1280px page container.
- Every card keeps its title, description, wrapping technology tags, and repository action visible on keyboard, pointer, and touch input.
- Artwork uses full square previews above the metadata. Projects without mapped artwork render text cards.

## Themes and progressive enhancement

The initial theme follows the system preference unless a valid light/dark choice is stored. The toggle persists explicit choices and becomes visible only after its handler is bound. Invalid stored values and unavailable storage do not prevent the controls from working.

Astro generates responsive AVIF/WebP image sources and PNG fallbacks. JavaScript selects the matching light/dark artwork inside inert templates before inserting it, avoiding an initial download of the opposite variant. Without JavaScript, light previews, content, and project links remain available; the theme toggle stays hidden.

The portrait uses a local JPEG. With JavaScript enabled, a failed portrait request falls back to the bundled SVG.

## Accessibility

The page includes a keyboard skip link, visible headings, focus outlines, meaningful navigation labels, and 44px theme/navigation targets. Text flows normally below images and wraps at narrow widths or enlarged text sizes. Reduced-motion settings disable transitions, animation, and smooth scrolling.

Current local validation and remaining device/browser checks are recorded in [IMPLEMENTATION.md](./IMPLEMENTATION.md).
