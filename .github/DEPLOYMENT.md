# GitHub Pages Deployment

This project auto-deploys to GitHub Pages on every push to `main`.

## Setup Instructions

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Under "Build and deployment":
     - Source: **GitHub Actions**
   
2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Site will be live at**:
   - https://radicazz.github.io/shoe-box/

## Manual Deployment

Trigger a deployment manually:
- Go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"

## Local Testing with GitHub Pages Path

The site uses `/shoe-box` as the base path for GitHub Pages. To test locally with the same path (pnpm preferred):

```bash
pnpm run build
pnpm run preview
# Visit http://localhost:4321/shoe-box/
```

Need npm instead? Run `npm install && npm run build && npm run preview`.

## Troubleshooting

**Assets not loading?** 
- Check that `astro.config.mjs` has correct `site` and `base` values
- Verify GitHub Pages is enabled and set to "GitHub Actions" source

**Build failing in Actions?**
- Check the Actions tab for error logs
- Run `./scripts/ci-test` locally to replicate CI environment
