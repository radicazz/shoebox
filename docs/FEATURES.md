# Feature Specifications

## Core Features (Mandatory)

### 1. Profile Section
**Location**: Top of page, full-width
**Elements**:
- Profile photo (circular, 120px diameter)
- Name (large, bold typography)
- Contact info (email, optional social links)
- Clean, centered layout

**Mockup**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                  ╭─────╮                        │
│                  │     │   [Profile Photo]      │
│                  ╰─────╯                        │
│                                                 │
│              Your Name Here                     │
│         email@example.com • GitHub              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2. Gallery Grid (Pinterest-style)
**Layout**: CSS Grid masonry, 3-4 columns desktop, 2 mobile, 1 small mobile
**Behavior**:
- Hover effect: subtle scale + shadow
- Click: opens modal with full details
- Lazy load images as user scrolls
- Smooth fade-in animation on load

**Mockup**:
```
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│         │  │         │  │  tall   │  │         │
│ square  │  │  wide   │  │  image  │  │ square  │
│         │  │         │  │         │  │         │
└─────────┘  └─────────┘  │         │  └─────────┘
┌─────────┐  ┌─────────┐  │         │  ┌─────────┐
│  wide   │  │ square  │  └─────────┘  │  tall   │
│         │  │         │  ┌─────────┐  │  image  │
└─────────┘  └─────────┘  │ square  │  │         │
                          └─────────┘  │         │
                                        └─────────┘
```

### 3. Modal/Expanded View
**Trigger**: Click any gallery item
**Content**:
- Full-size image/media (max 90vw/90vh)
- Title (prominent)
- Detailed description (markdown support optional)
- Tags/categories (pill badges)
- Date/metadata
- Close button (X) + ESC key + click outside to close

**Animations**:
- Backdrop fade-in (0.2s)
- Content scale + fade (0.3s ease-out)
- Exit: reverse animation

**Mockup**:
```
┌─────────────────────────────────────────────────┐
│ [Dark backdrop - 80% opacity]                   │
│                                       [X Close] │
│   ┌──────────────────────────────┐              │
│   │                              │              │
│   │      Full Size Image         │              │
│   │                              │              │
│   └──────────────────────────────┘              │
│                                                 │
│   Project Title                                 │
│   Detailed description goes here...             │
│   [tag1] [tag2] [tag3]                          │
│   Date: 2024-11-08                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Animations & Interactions

### Gallery Items
- **On load**: Stagger fade-in (each item 50ms delay)
- **On hover**: Scale 1.02, shadow elevation increase (0.2s ease)
- **On click**: Quick scale 0.98 (tactile feedback)

### Modal
- **Open**: Backdrop fade 0.2s, content scale 0.9→1.0 + fade 0.3s
- **Close**: Reverse of open (scale 1.0→0.95 + fade out)

### Page Transitions
- **Profile section**: Slide down + fade (0.4s on page load)
- **Gallery**: Lazy reveal as images enter viewport

## Design System

### Colors (Tailwind defaults + custom)
- Background: `bg-gray-50` (light mode) / `bg-gray-900` (dark mode)
- Text: `text-gray-900` / `text-gray-100`
- Accent: `blue-600` (links, focus states)
- Hover: `gray-100` / `gray-800`

### Typography
- Name: `text-4xl font-bold`
- Contact: `text-lg text-gray-600`
- Modal title: `text-3xl font-semibold`
- Description: `text-base leading-relaxed`

### Spacing
- Profile section: `py-16 px-4`
- Gallery gap: `gap-4`
- Modal padding: `p-8`

## Responsive Breakpoints
- Mobile: `<640px` - 1 column gallery
- Tablet: `640px-1024px` - 2 column gallery
- Desktop: `>1024px` - 3-4 column gallery

## Accessibility Requirements
- Semantic HTML (header, main, article, dialog)
- ARIA labels for interactive elements
- Keyboard navigation (Tab, Enter, ESC)
- Focus visible states
- Alt text for all images
- Color contrast ratio 4.5:1 minimum

## Out of Scope (Do NOT implement)
- User authentication/login
- Admin panel/CMS
- Comments/social features
- Search/filtering (can add later if needed)
- Multiple pages/routing
- Analytics/tracking (can add script tag manually)
- Dark mode toggle (CSS prefers-color-scheme is enough)

## Data Requirements
- Profile photo: 400x400px minimum, WebP preferred
- Gallery thumbnails: 600px width, auto height, WebP
- Full images: 1920px max width, maintain aspect ratio
- File size target: <200KB per image (compressed)

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)
- No IE11 support required
