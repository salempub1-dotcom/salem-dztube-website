# SalemDZTube — Phase 4
## Visual design
The main homepage markup and styling are retained from the approved version. Updates change only navigation URLs, asset paths, and SEO metadata.

## Fixed
- Brand and Home menu always route to `/`.
- Article reader Back/Articles routes to `/articles/`, not `/`.
- Homepage asset URLs use root-absolute paths, preventing errors when accessed via nested routes.
- Public site sitemap/robots provided for the current Vercel domain.
- Example draft articles remain noindex; the dynamic reader remains noindex until articles have server-rendered URLs and original reviewed content.

## Deployment
1. Upload **contents** of this folder to the GitHub repository root (not a new nested folder).
2. Configure Vercel Root Directory to repository root, Framework Preset Other and Output Directory unset.
3. Confirm `/` contains the hero, stats and all home sections; `/articles/` shows only the articles archive.
4. Confirm `/styles.css`, `/assets/hero-reference.jpg`, `/admin/` and `/sitemap.xml`.
5. Perform a manual login and draft/publish test before inviting visitors.

## AdSense note
This is not yet AdSense-ready: dynamic article pages currently use client-side rendering and noindex, and require original editorial content, server-rendered stable URLs, consent/privacy review, and production testing before submitting to AdSense.
