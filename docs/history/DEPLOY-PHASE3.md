# SalemDZTube — Phase 3 (Supabase live CMS)

- Preserve all folders when copying to GitHub. The deployed website expects `/assets`, `/content`, `/articles`, `/config`, and `/admin`.
- `config/supabase.js` includes only the **public publishable** key, never a database password or service role key.
- Login: `/admin/` with the Supabase Auth account that was already assigned in `site_admins`.
- Public articles: `/articles/`. Only `published` articles with valid `published_at` display.
- Article reader: `/articles/read/?slug=the-slug`.
- Note: This reader uses query parameters on a static website and is not ideal for search indexing. For AdSense/Google SEO, move article rendering to SSR or static pre-rendering with proper unique canonical URLs, sitemaps and structured data before public launch. Do not enable AdSense until editorial and privacy review.
- Database created in Supabase project `dzlkwzzcmbydbsdisulx` (do **not** re-apply old migration files as they may conflict with existing schema).
- Vercel deployment was NOT performed. Connected Vercel tool did not return this project; deploy from your linked GitHub repo once the source is updated.
- User account was already assigned admin rights via `site_admins`, not from this package.
- Local preview: `python -m http.server 8000` from project root. Navigate to `/articles/` and `/admin/`.
- Existing drafted sample pages remain in source for revision and are not linked as publicly published articles.
