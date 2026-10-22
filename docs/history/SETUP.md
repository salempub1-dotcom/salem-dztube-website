# SalemDZTube — Phase 2 setup

## What is implemented
- Original homepage and existing article pages preserved.
- `/admin/` authenticated editorial dashboard for article creation/editing and draft/published status.
- `config/supabase.js` contains empty public configuration; therefore admin remains inactive until setup.
- RLS policies limit article writing to manually registered administrators. No registration screen exposed.

## Configure separate Supabase project
1. Create a NEW Supabase project named `salem-dztube` (not Miraj Ostadh). Review the quoted cost before creating.
2. Apply `202610220001_init_content.sql` and then `202610220002_admin_policies.sql` in order.
3. Create a private user under Supabase Authentication > Users (disable open signup for this admin-only project). In SQL editor, grant access using `insert into public.site_admins(user_id) values ('THE-AUTH-USER-UUID');` substituting real user UUID. Never assign admin using user-editable metadata.
4. Copy the project URL and publishable key into `config/supabase.js`; do not ever use secret/service_role keys in front-end files or GitHub.
5. Test successful login at `/admin/`, create a draft, edit it, verify that a non-admin cannot read drafts or save articles, and verify anonymous users see published records only.

## Remaining work
- Public article archive currently reads static JSON. New Supabase articles are managed in the dashboard but are NOT automatically published to the public website yet. Next phase should create dynamic public pages with crawlable SSR/SSG (e.g. Next.js) to meet SEO needs; never confuse the dashboard's published flag with a live indexed page.
- Add verified final domain and then canonical tags/sitemap. Review legal/privacy pages for live collection and cookies before applying for AdSense.
- The existing 3 article examples are still drafts; do not treat them as reviewed published content.
- Original GitHub Pages workflow remains for compatibility. Vercel deployment has not been verified from this environment.

## Local test
Run `python -m http.server 8000` inside project folder. Open `http://localhost:8000/admin/`.
