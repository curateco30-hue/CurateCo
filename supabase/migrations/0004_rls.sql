-- =========================================================================
-- Row Level Security
-- =========================================================================

-- ---------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_curator_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.curators where profile_id = auth.uid();
$$;

create or replace function public.current_brand_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.brands where profile_id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- ---------------------------------------------------------------------
-- curators
-- ---------------------------------------------------------------------
alter table public.curators enable row level security;

create policy "curators_select_own_or_admin" on public.curators
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "curators_insert_own" on public.curators
  for insert with check (profile_id = auth.uid());

create policy "curators_update_own_or_admin" on public.curators
  for update using (profile_id = auth.uid() or public.is_admin());

create policy "curators_delete_admin" on public.curators
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- curator_stores
-- ---------------------------------------------------------------------
alter table public.curator_stores enable row level security;

create policy "curator_stores_select_public_or_owner_or_admin" on public.curator_stores
  for select using (
    is_active = true
    or curator_id = public.current_curator_id()
    or public.is_admin()
  );

create policy "curator_stores_insert_owner" on public.curator_stores
  for insert with check (curator_id = public.current_curator_id());

create policy "curator_stores_update_owner_or_admin" on public.curator_stores
  for update using (curator_id = public.current_curator_id() or public.is_admin());

create policy "curator_stores_delete_owner_or_admin" on public.curator_stores
  for delete using (curator_id = public.current_curator_id() or public.is_admin());

-- ---------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------
alter table public.brands enable row level security;

create policy "brands_select_own_or_admin" on public.brands
  for select using (profile_id = auth.uid() or public.is_admin());

create policy "brands_insert_own" on public.brands
  for insert with check (profile_id = auth.uid());

create policy "brands_update_own_or_admin" on public.brands
  for update using (profile_id = auth.uid() or public.is_admin());

create policy "brands_delete_admin" on public.brands
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
alter table public.products enable row level security;

create policy "products_select_public_or_owner_or_admin" on public.products
  for select using (
    (status = 'approved' and is_visible = true)
    or brand_id = public.current_brand_id()
    or public.is_admin()
  );

create policy "products_insert_owner" on public.products
  for insert with check (brand_id = public.current_brand_id());

create policy "products_update_owner_or_admin" on public.products
  for update using (brand_id = public.current_brand_id() or public.is_admin());

create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- curator_store_products
-- ---------------------------------------------------------------------
alter table public.curator_store_products enable row level security;

create policy "csp_select_public_or_owner_or_admin" on public.curator_store_products
  for select using (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.is_active = true
    )
    or exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
    or public.is_admin()
  );

create policy "csp_insert_owner" on public.curator_store_products
  for insert with check (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
  );

create policy "csp_update_owner_or_admin" on public.curator_store_products
  for update using (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
    or public.is_admin()
  );

create policy "csp_delete_owner_or_admin" on public.curator_store_products
  for delete using (
    exists (
      select 1 from public.curator_stores s
      where s.id = store_id and s.curator_id = public.current_curator_id()
    )
    or public.is_admin()
  );

-- ---------------------------------------------------------------------
-- orders / order_items
-- Checkout writes happen server-side via the service role key (bypasses
-- RLS), so no public insert policy is needed or granted here.
-- ---------------------------------------------------------------------
alter table public.orders enable row level security;

create policy "orders_select_curator_or_brand_or_admin" on public.orders
  for select using (
    curator_id = public.current_curator_id()
    or brand_id = public.current_brand_id()
    or public.is_admin()
  );

create policy "orders_update_brand_or_admin" on public.orders
  for update using (brand_id = public.current_brand_id() or public.is_admin());

alter table public.order_items enable row level security;

create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.curator_id = public.current_curator_id()
          or o.brand_id = public.current_brand_id()
          or public.is_admin()
        )
    )
  );

-- ---------------------------------------------------------------------
-- carts (server-side only via service role; admin can inspect)
-- ---------------------------------------------------------------------
alter table public.carts enable row level security;

create policy "carts_select_admin" on public.carts
  for select using (public.is_admin());

-- ---------------------------------------------------------------------
-- analytics_events (server-side writes via service role)
-- ---------------------------------------------------------------------
alter table public.analytics_events enable row level security;

create policy "analytics_events_select_owner_or_admin" on public.analytics_events
  for select using (curator_id = public.current_curator_id() or public.is_admin());

-- ---------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------
alter table public.notifications enable row level security;

create policy "notifications_select_own_or_admin" on public.notifications
  for select using (recipient_profile_id = auth.uid() or public.is_admin());

create policy "notifications_update_own_or_admin" on public.notifications
  for update using (recipient_profile_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- support_messages
-- ---------------------------------------------------------------------
alter table public.support_messages enable row level security;

create policy "support_messages_insert_anyone" on public.support_messages
  for insert with check (true);

create policy "support_messages_select_admin" on public.support_messages
  for select using (public.is_admin());

create policy "support_messages_update_admin" on public.support_messages
  for update using (public.is_admin());

-- ---------------------------------------------------------------------
-- template_settings (publicly readable, admin-editable)
-- ---------------------------------------------------------------------
alter table public.template_settings enable row level security;

create policy "template_settings_select_all" on public.template_settings
  for select using (true);

create policy "template_settings_insert_admin" on public.template_settings
  for insert with check (public.is_admin());

create policy "template_settings_update_admin" on public.template_settings
  for update using (public.is_admin());
