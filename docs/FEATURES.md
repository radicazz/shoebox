# Features

- Responsive, theme-aware project grid: one column on mobile, two from 640px, three from 1024px, capped at a 1280px page width.
- Dedicated author introduction with about text, skills, and a repository link supplied by gallery data.
- Visible heading hierarchy, skip link, keyboard focus, and touch-friendly navigation.
- Theme toggle honors system preference and persists explicit choices; it appears only when JavaScript binds its behavior.
- All portfolio content and project links remain usable without JavaScript.
- Local Astro-optimized project previews with light/dark variants.

Project order follows source order across rows. Profile metadata belongs to the author; no visitor location lookup is performed.

Project descriptions and technology tags remain visible on every input type. Square previews preserve the full artwork, reserve space before loading, and use responsive AVIF/WebP sources with a PNG fallback. JavaScript selects a matching screenshot variant before insertion; without JavaScript, static light previews remain available. Reduced motion disables transitions and smooth scrolling.
