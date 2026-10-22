-- SalemDZTube standalone project only. Do not run against Miraj Ostadh.
create extension if not exists pgcrypto;
create table if not exists public.site_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.categories (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, created_at timestamptz not null default now());
create table if not exists public.articles (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, excerpt text not null default '', body jsonb not null default '[]'::jsonb, category_id uuid references public.categories(id), cover_image text, youtube_url text, seo_title text, seo_description text, status text not null default 'draft' check (status in ('draft','published')), published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.videos (id uuid primary key default gen_random_uuid(), youtube_id text not null unique, title text not null, category_id uuid references public.categories(id), description text, published_at timestamptz, created_at timestamptz not null default now());
create table if not exists public.partnership_requests (id uuid primary key default gen_random_uuid(), name text not null, email text not null, company text, message text not null, created_at timestamptz not null default now());
alter table public.site_admins enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.videos enable row level security;
alter table public.partnership_requests enable row level security;
create policy "Public read categories" on public.categories for select to anon, authenticated using (true);
create policy "Public read published articles" on public.articles for select to anon, authenticated using (status = 'published' and published_at <= now());
create policy "Public read videos" on public.videos for select to anon, authenticated using (true);
-- Admin writes must be served by verified server-side authentication and specific policies added after admin account setup.
-- No anonymous partnership submission is enabled until an authenticated/rate-limited backend is implemented.
create index if not exists articles_published_idx on public.articles (published_at desc) where status = 'published';
create index if not exists videos_published_idx on public.videos (published_at desc);
