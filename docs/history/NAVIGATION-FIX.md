# SalemDZTube — Navigation repair

- Root `/` must serve the project-root `index.html` (the landing page with HERO, topics, videos, articles, partnership).
- `/articles/` must serve `articles/index.html` only.
- Navigation links have been corrected to absolute paths on the Vercel domain.
- Vercel Project Settings → Build and Deployment → Root Directory must be empty or `./`, **NOT `articles`**.
- Framework Preset: Other. Output Directory: leave blank. Disable any custom rewrite that maps `/` or `/(.*)` to `/articles`.
- Ensure the files are uploaded as files at Git repository root, and not nested inside another directory.
- After deploying: open `/`, `/articles/`, `/styles.css`, `/assets/hero-reference.jpg`. Inspect source of `/` for `id="home"` and `id="topics"`. Check that the Home menu goes to `/`.
- Preserve pages and Supabase connection; no backend schema changes are necessary.
