-- =========================================================================
-- Storage buckets
-- Upload convention: object path must start with the uploader's
-- auth.uid(), e.g. `${auth.uid()}/product-1/image-1.jpg`. This lets RLS
-- check ownership purely from the path without extra joins.
-- =========================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('product-images', 'product-images', true, 10485760),       -- 10MB
  ('curator-photos', 'curator-photos', true, 10485760),        -- 10MB
  ('brand-logos', 'brand-logos', true, 5242880),                -- 5MB
  ('curator-videos', 'curator-videos', true, 104857600)         -- 100MB
on conflict (id) do nothing;

-- Public read access on all four buckets
create policy "public_read_product_images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "public_read_curator_photos" on storage.objects
  for select using (bucket_id = 'curator-photos');

create policy "public_read_brand_logos" on storage.objects
  for select using (bucket_id = 'brand-logos');

create policy "public_read_curator_videos" on storage.objects
  for select using (bucket_id = 'curator-videos');

-- Authenticated owners can upload/update/delete within their own folder
create policy "owner_write_product_images" on storage.objects
  for insert with check (
    bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_update_product_images" on storage.objects
  for update using (
    bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_delete_product_images" on storage.objects
  for delete using (
    bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner_write_curator_photos" on storage.objects
  for insert with check (
    bucket_id = 'curator-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_update_curator_photos" on storage.objects
  for update using (
    bucket_id = 'curator-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_delete_curator_photos" on storage.objects
  for delete using (
    bucket_id = 'curator-photos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner_write_brand_logos" on storage.objects
  for insert with check (
    bucket_id = 'brand-logos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_update_brand_logos" on storage.objects
  for update using (
    bucket_id = 'brand-logos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_delete_brand_logos" on storage.objects
  for delete using (
    bucket_id = 'brand-logos' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "owner_write_curator_videos" on storage.objects
  for insert with check (
    bucket_id = 'curator-videos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_update_curator_videos" on storage.objects
  for update using (
    bucket_id = 'curator-videos' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "owner_delete_curator_videos" on storage.objects
  for delete using (
    bucket_id = 'curator-videos' and (storage.foldername(name))[1] = auth.uid()::text
  );
