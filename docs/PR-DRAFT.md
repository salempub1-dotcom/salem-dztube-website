# Restore the SalemDZTube homepage and add the Supabase editorial platform

The uploaded repository flattened its page folders and replaced the root homepage with the About page. Restore the original homepage and asset structure, keeping the existing visual identity, and add a server-rendered article archive and article URLs backed by the existing Supabase project.

The Arabic editor supports drafts, publish/unpublish, local preview, category management, private draft image uploads, YouTube links and SEO fields. Public reads use RLS and the publishable key only. Legacy query URLs redirect permanently; unpublished/missing articles return 404; the dynamic sitemap excludes drafts. Build output excludes documentation and sample drafts. Add current privacy, cookies, contact, about and terms pages without enabling ads.

Validation: build and 11 Node tests pass; dependency audit reports zero known vulnerabilities. Desktop/mobile browser checks pass with no JavaScript errors, broken images, horizontal overflow or automated WCAG A/AA findings. Editor interactions passed against local intercepted API responses. Real database RLS create/publish/unpublish tests passed inside a rolled-back transaction; zero articles remain. Actual account password login and Vercel preview routing remain unverified.

Do not merge until the existing Vercel project has produced a verified Preview and the owner approves it. No Production deployment was requested or performed by this change.
