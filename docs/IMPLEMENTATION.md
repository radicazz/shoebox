# Implementation Plan

## Timeline: 2-3 Days (Vertical Slices)

### Slice 1: Project Setup + Static Profile (2-3 hours)
**Deliverable**: Static page with profile header, builds successfully
1. Initialize Astro project with Tailwind + Alpine.js
2. Create base layout and global styles
3. Implement static profile section (photo, name, contact)
4. Setup `gallery.json` with sample data
5. **Verify**: `npm run build` produces dist/, profile displays correctly

### Slice 2: Static Gallery Grid (2-3 hours)
**Deliverable**: Full gallery grid visible, responsive, no interactions yet
1. Build Pinterest-style masonry grid with CSS Grid
2. Render gallery items from JSON data
3. Apply responsive breakpoints (mobile/tablet/desktop)
4. Add hover animations (scale, shadow)
5. **Verify**: All images display, grid reflows on resize

### Slice 3: Interactive Modal (2-3 hours)
**Deliverable**: Clicking gallery items opens detailed modal view
1. Create modal component with Alpine.js
2. Wire click handlers to open/close modal
3. Display full image, title, description, tags, date
4. Implement close methods (X button, ESC key, backdrop click)
5. Add modal animations (fade, scale transitions)
6. **Verify**: Modal opens/closes smoothly, all data displays

### Slice 4: Performance & Production (2-3 hours)
**Deliverable**: Production-ready build, deployment artifacts
1. Optimize images (compress, convert to WebP)
2. Audit bundle size, verify Tailwind purge working
3. Add lazy loading for images below fold
4. Test on mobile devices and slow connection
5. Create Caddyfile with compression settings
6. **Verify**: Lighthouse 95+, page load <2s on 3G

## Project Structure
```
shoe-box/
├── src/
│   ├── components/
│   │   ├── Profile.astro       # Header with photo/name/contact
│   │   ├── Gallery.astro       # Masonry grid layout
│   │   └── Modal.astro         # Expanded media view
│   ├── layouts/
│   │   └── Base.astro          # Main layout wrapper
│   ├── pages/
│   │   └── index.astro         # Single page application
│   └── styles/
│       └── global.css          # Tailwind imports + custom CSS
├── public/
│   ├── media/                  # Gallery images/videos
│   └── gallery.json            # Content data
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration
├── package.json
└── Caddyfile                   # Production server config
```

## Content Schema (gallery.json)
```json
{
  "profile": {
    "name": "string",
    "photo": "string (path)",
    "contact": {
      "email": "string",
      "github": "string (optional)",
      "linkedin": "string (optional)"
    }
  },
  "items": [
    {
      "id": "string",
      "thumbnail": "string (path)",
      "fullImage": "string (path)",
      "title": "string",
      "description": "string",
      "tags": ["string"],
      "date": "ISO date"
    }
  ]
}
```

## Deployment Process
1. Build static site: `npm run build` → outputs to `dist/`
2. Copy `dist/` directory to VPS (scp/rsync)
3. Point Caddy at `dist/` directory (single Caddyfile directive)
4. Start Caddy → auto HTTPS, site live

## Development Commands
- `npm run dev` - Local dev server (localhost:4321)
- `npm run build` - Production build
- `npm run preview` - Preview production build locally

## Performance Pass (Slice 4)
**Actions**:
1. Run `astro build` → verify Tailwind purges to <15KB
2. Compress gallery images → target <200KB each, WebP format
3. Audit `dist/` bundle size → ensure total <500KB uncompressed
4. Add `loading="lazy"` to images below fold
5. Test Lighthouse → confirm 95+ scores
6. Enable Brotli compression in Caddyfile

**Verification Checklist**:
- [ ] Profile + gallery display correctly on all devices
- [ ] Modal opens/closes smoothly, all content visible
- [ ] Animations run without jank (60fps)
- [ ] Page load <2s on throttled 3G
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] No console errors or accessibility warnings
