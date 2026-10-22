-- Apply ONLY to the new SalemDZTube database AFTER 202610220001_init_content.sql.
-- Admin membership assigned manually through SQL after creating the admin user in Auth.
create policy "Admin read membership" on public.site_admins for select to authenticated using (user_id = (select auth.uid()));
create policy "Admin read all articles" on public.articles for select to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin insert articles" on public.articles for insert to authenticated with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin update articles" on public.articles for update to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid()))) with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin remove articles" on public.articles for delete to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin insert categories" on public.categories for insert to authenticated with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin update categories" on public.categories for update to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid()))) with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
create policy "Admin delete categories" on public.categories for delete to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
