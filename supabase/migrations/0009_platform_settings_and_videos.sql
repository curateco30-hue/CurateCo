-- =========================================================================
-- Platform-wide configurable limits (admin-editable), and a proper table
-- for curator storefront videos (replaces the single featured_video_url/
-- featured_video_product_id columns on curator_stores — a curator can now
-- have up to platform_settings.max_store_products videos, same limit as
-- their product cap).
-- =========================================================================

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  max_store_products integer not null default 3,
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (max_store_products)
select 3
where not exists (select 1 from public.platform_settings);

alter table public.platform_settings enable row level security;

create policy "platform_settings_select_all" on public.platform_settings
  for select using (true);

create policy "platform_settings_update_admin" on public.platform_settings
  for update using (public.is_admin());

drop trigger if exists set_updated_at on public.platform_settings;
create trigger set_updated_at before update on public.platform_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- curator_store_videos
-- ---------------------------------------------------------------------
create table if not exists public.curator_store_videos (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.curator_stores (id) on delete cascade,
  video_url text not null,
  product_id uuid references public.products (id),
  created_at timestamptz not null default now()
);

create index if not exists curator_store_videos_store_id_idx on public.curator_store_videos (store_id);

alter table public.curator_store_videos enable row level security;

create policy "csv_select_public_or_owner_or_admin" on public.curator_store_videos
  for select using (
    exists (select 1 from public.curator_stores s where s.id = store_id and s.is_active = true)
    or exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
    or public.is_admin()
  );

create policy "csv_insert_owner" on public.curator_store_videos
  for insert with check (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
  );

create policy "csv_delete_owner_or_admin" on public.curator_store_videos
  for delete using (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
    or public.is_admin()
  );

-- Enforce max videos per store — same limit as max_store_products.
create or replace function public.enforce_store_video_limit()
returns trigger
language plpgsql
as $$
declare
  limit_count integer;
  current_count integer;
begin
  select max_store_products into limit_count from public.platform_settings limit 1;
  select count(*) into current_count from public.curator_store_videos where store_id = new.store_id;
  if current_count >= coalesce(limit_count, 3) then
    raise exception 'This store has reached its featured video limit of %', coalesce(limit_count, 3);
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_store_video_limit on public.curator_store_videos;
create trigger enforce_store_video_limit
  before insert on public.curator_store_videos
  for each row execute function public.enforce_store_video_limit();

-- ---------------------------------------------------------------------
-- Make the existing product-limit trigger read the same admin-configurable
-- limit instead of a hardcoded 3.
-- ---------------------------------------------------------------------
create or replace function public.enforce_store_product_limit()
returns trigger
language plpgsql
as $$
declare
  limit_count integer;
  current_count integer;
begin
  select max_store_products into limit_count from public.platform_settings limit 1;
  select count(*) into current_count from public.curator_store_products where store_id = new.store_id;
  if current_count >= coalesce(limit_count, 3) then
    raise exception 'A curator store can hold a maximum of % products', coalesce(limit_count, 3);
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Drop the now-superseded single-video columns on curator_stores.
-- ---------------------------------------------------------------------
alter table public.curator_stores drop column if exists featured_video_url;
alter table public.curator_stores drop column if exists featured_video_product_id;
