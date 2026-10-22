-- Reviewed changes applied on 2026-10-22 ONLY to dzlkwzzcmbydbsdisulx.
-- Audit record, not a replacement for the existing database or migration history.
-- Original tables/data and article/category RLS policies were retained.
begin;
revoke truncate, references, trigger on public.articles,public.categories,public.videos,public.site_admins,public.collaboration_requests from anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('article-drafts','article-drafts',false,5242880,array['image/jpeg','image/png','image/webp']),
       ('article-images','article-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
-- Policy was created only after confirming no storage policies existed.
create policy salem_admin_images on storage.objects for all to authenticated
using (bucket_id in ('article-drafts','article-images') and exists(select 1 from public.site_admins where user_id=(select auth.uid())))
with check (bucket_id in ('article-drafts','article-images') and exists(select 1 from public.site_admins where user_id=(select auth.uid())));
commit;
