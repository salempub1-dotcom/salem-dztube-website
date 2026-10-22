# SalemDZTube — Vercel Deployment Checklist

Upload the **contents** of this folder into the GitHub repository root. `index.html`, `styles.css`, `main.js` and `vercel.json` must appear at the top level, next to the `assets`, `content`, `articles` and `admin` directories.

In Vercel settings for the existing repository: Framework Preset = Other, Root Directory = empty, Build Command = empty, Output Directory = empty. Redeploy the latest commit. Do not create a new Vercel project or change the original site's visual design.

Check these live URLs:
- `/` should render the hero, statistics, video section and article section.
- `/styles.css` should return a CSS file (not 404 or HTML).
- `/main.js` should return JavaScript.
- `/assets/hero-reference.jpg` should return the hero image.
- `/content/videos.json` and `/content/articles.json` should return JSON data.
- `/articles/` and `/admin/` should load their HTML pages.

If the homepage works but sections remain empty, verify `content/*.json` are deployed. If the homepage is plain unstyled HTML, verify `styles.css`. If the hero image is missing, verify `assets/hero-reference.jpg`.

The production deployment has not been changed by generating this package. The public URL and its assets could not be fetched with the available tools.
