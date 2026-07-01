-- =========================================================================
-- CurateCo core schema
-- =========================================================================

-- ---------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('curator', 'brand', 'admin', 'customer')),
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- curators
-- ---------------------------------------------------------------------
create table if not exists public.curators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete cascade,
  brand_name text not null,
  brand_color text not null default '#63001F',
  profile_photo_url text,
  bank_name text,
  account_number text,
  account_name text,
  wallet_balance numeric(12, 2) not null default 0,
  pending_commission numeric(12, 2) not null default 0,
  -- AI-ready fields
  taste_vector jsonb,
  style_tags text[],
  curation_score numeric(5, 2),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- curator_stores
-- ---------------------------------------------------------------------
create table if not exists public.curator_stores (
  id uuid primary key default gen_random_uuid(),
  curator_id uuid not null references public.curators (id) on delete cascade,
  store_slug text unique not null,
  intro_headline_prefix text not null default 'Curated by',
  intro_text text,
  featured_video_url text,
  featured_video_product_id uuid,
  is_active boolean not null default true,
  total_views integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles (id) on delete cascade,
  business_name text not null,
  logo_url text,
  description text,
  bank_name text,
  account_number text,
  account_name text,
  is_active boolean not null default true,
  is_suspended boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands (id) on delete cascade,
  name text not null,
  description text,
  base_price numeric(12, 2) not null check (base_price >= 0),
  curateco_commission_pct numeric(5, 2) not null default 0,
  max_curator_commission_cap_pct numeric(5, 2) not null default 0,
  selling_price numeric(12, 2) generated always as (
    base_price * (1 + curateco_commission_pct / 100)
  ) stored,
  sizes text[],
  colors text[],
  stock integer not null default 0,
  images text[],
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  is_visible boolean not null default true,
  -- AI-ready fields
  style_tags text[],
  embedding extensions.vector(1536),
  trend_score numeric(5, 2),
  created_at timestamptz not null default now()
);

create index if not exists products_brand_id_idx on public.products (brand_id);
create index if not exists products_status_idx on public.products (status);

-- ---------------------------------------------------------------------
-- curator_store_products
-- ---------------------------------------------------------------------
create table if not exists public.curator_store_products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.curator_stores (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  curator_commission_pct numeric(5, 2) not null,
  why_curated_note text,
  product_views integer not null default 0,
  added_at timestamptz not null default now(),
  unique (store_id, product_id)
);

create index if not exists curator_store_products_store_id_idx on public.curator_store_products (store_id);

-- ---------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.curator_stores (id),
  curator_id uuid references public.curators (id),
  brand_id uuid references public.brands (id),
  customer_name text not null,
  customer_phone text not null,
  customer_alt_phone text,
  delivery_address text not null,
  status text not null default 'new' check (status in (
    'new', 'brand_accepted', 'awaiting_pickup',
    'picked_up', 'delivered', 'cancelled'
  )),
  total_amount numeric(12, 2),
  curator_commission_amount numeric(12, 2),
  curateco_commission_amount numeric(12, 2),
  brand_payout_amount numeric(12, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_curator_id_idx on public.orders (curator_id);
create index if not exists orders_brand_id_idx on public.orders (brand_id);
create index if not exists orders_status_idx on public.orders (status);

-- ---------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  store_product_id uuid references public.curator_store_products (id),
  quantity integer not null default 1,
  size text,
  color text,
  unit_price numeric(12, 2),
  curator_commission_pct numeric(5, 2),
  subtotal numeric(12, 2)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ---------------------------------------------------------------------
-- carts (abandonment tracking)
-- ---------------------------------------------------------------------
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references public.curator_stores (id),
  customer_email text,
  items jsonb not null default '[]'::jsonb,
  abandoned_email_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists carts_abandonment_idx on public.carts (abandoned_email_sent, created_at);

-- ---------------------------------------------------------------------
-- analytics_events (AI-ready event log)
-- ---------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  store_id uuid references public.curator_stores (id),
  product_id uuid references public.products (id),
  curator_id uuid references public.curators (id),
  session_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_store_id_idx on public.analytics_events (store_id);
create index if not exists analytics_events_type_idx on public.analytics_events (event_type);

-- ---------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_profile_id uuid references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  is_read boolean not null default false,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_idx on public.notifications (recipient_profile_id, is_read);

-- ---------------------------------------------------------------------
-- support_messages
-- ---------------------------------------------------------------------
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  sender_email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- template_settings (admin-editable page templates)
-- ---------------------------------------------------------------------
create table if not exists public.template_settings (
  id uuid primary key default gen_random_uuid(),
  template_name text unique not null check (template_name in ('storefront', 'product_listing', 'product_detail')),
  settings jsonb not null,
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- updated_at maintenance trigger
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.orders;
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.carts;
create trigger set_updated_at before update on public.carts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.template_settings;
create trigger set_updated_at before update on public.template_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Enforce max 3 products per curator store
-- ---------------------------------------------------------------------
create or replace function public.enforce_store_product_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.curator_store_products where store_id = new.store_id) >= 3 then
    raise exception 'A curator store can hold a maximum of 3 products';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_store_product_limit on public.curator_store_products;
create trigger enforce_store_product_limit
  before insert on public.curator_store_products
  for each row execute function public.enforce_store_product_limit();

-- ---------------------------------------------------------------------
-- Auto-hide products when stock hits zero / restore when restocked
-- ---------------------------------------------------------------------
create or replace function public.sync_product_visibility()
returns trigger
language plpgsql
as $$
begin
  if new.stock = 0 then
    new.is_visible = false;
  elsif old.stock = 0 and new.stock > 0 then
    new.is_visible = true;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_product_visibility on public.products;
create trigger sync_product_visibility
  before update of stock on public.products
  for each row execute function public.sync_product_visibility();
