# Technology Stack

## Core Technologies

### Frontend
- **Astro 4.x** - Static site generator, islands architecture, zero JS by default
- **Tailwind CSS 3.x** - Utility-first CSS, purged/minified output
- **Alpine.js 3.x** - Minimal reactive framework (15KB) for interactions only
- **Native View Transitions API** - Smooth page/modal transitions (progressive enhancement)

### Server
- **Caddy 2** - Modern web server, auto HTTPS, HTTP/2/3 support, minimal config
- **Ubuntu 22.04+** - Target deployment OS (Vultr VPS)

### Content Management
- **JSON data file** - Single `gallery.json` for all content (no database)
- **Local file storage** - Images in `/public/media` directory

## Rationale

**Why Astro:**
- Outputs pure static HTML/CSS (minimal JS shipped to client)
- Fast build times, excellent performance on weak hardware
- Simple project structure, minimal dependencies
- Built-in image optimization

**Why Tailwind:**
- Purges unused CSS automatically (final size ~8-12KB)
- Rapid development, consistent design system
- No runtime overhead

**Why Alpine.js:**
- Only loads for interactive components (gallery grid, modal)
- Declarative syntax, minimal learning curve
- Tiny footprint compared to React/Vue

**Why Caddy:**
- Zero-config HTTPS (Let's Encrypt auto-renewal)
- Simpler than Nginx for basic static hosting
- Built-in compression, security headers
- Single binary deployment

## Performance Targets
- First Contentful Paint: <1s
- Total page weight: <150KB (initial load)
- Lighthouse score: 95+ (all categories)
- Memory footprint: <100MB server RAM

## Development Requirements
- Node.js 18+ (for Astro build)
- npm/pnpm (package management)
- No compilation watchers needed in production
