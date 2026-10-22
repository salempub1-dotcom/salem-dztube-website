# SalemDZTube — Content platform implementation

## Scope of this upgrade

- Homepage branding, color palette, layout and card dimensions retained.
- `/articles/` archive with text search/category filters, and `/articles/<slug>/` individual draft preview pages.
- Draft article pages use `noindex` intentionally; source content contains only preliminary outlines.
- `/about/`, `/contact/`, `/privacy/` pages added. Privacy text must be revised when analytics, advertising, cookies, or contact forms are implemented.
- Database migration is a *proposed* schema only; it has NOT been applied.
- `robots.txt` added; add sitemap and canonical production URLs only after choosing the final domain.

## Next steps

1. Restore Vercel project access and verify GitHub repo branch is linked.
2. Create a separate Supabase project, obtain consent for quoted costs, and apply migration there only. Do not use the Miraj Ostadh project.
3. Implement protected editorial admin UI and server-side auth/authorization, then connect Supabase data. Never commit service role keys.
4. Replace placeholder articles with original, fact checked, useful content; publish only final approved text.
5. Set site domain, sitemap, structured data, analytics/cookie compliance and AdSense script after approval.

Run locally: `python -m http.server 8000` from the project root and open http://localhost:8000.
