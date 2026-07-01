-- =========================================================================
-- CurateCo test data
-- Intended for local development (`supabase db reset`) or a disposable
-- staging project — not for production. Seeds one user per role plus a
-- full curator -> brand -> product -> order chain so the MVP flow in the
-- build doc can be clicked through end to end.
--
-- Login passwords (email / password):
--   curateco30@gmail.com / CurateCoAdmin123!   (admin)
--   debbie@curateco.test / Curator123!         (curator)
--   atelier@curateco.test / Brand123!          (brand)
-- =========================================================================

-- ---------------------------------------------------------------------
-- auth.users + auth.identities
-- ---------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'curateco30@gmail.com',
    crypt('CurateCoAdmin123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'debbie@curateco.test',
    crypt('Curator123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'atelier@curateco.test',
    crypt('Brand123!', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{}',
    now(), now(), '', '', '', ''
  )
on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values
  (
    gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"curateco30@gmail.com"}', 'email', now(), now(), now()
  ),
  (
    gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"debbie@curateco.test"}', 'email', now(), now(), now()
  ),
  (
    gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"atelier@curateco.test"}', 'email', now(), now(), now()
  )
on conflict do nothing;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
insert into public.profiles (id, role, full_name, email) values
  ('11111111-1111-1111-1111-111111111111', 'admin', 'CurateCo Admin', 'curateco30@gmail.com'),
  ('22222222-2222-2222-2222-222222222222', 'curator', 'Debbie Okafor', 'debbie@curateco.test'),
  ('33333333-3333-3333-3333-333333333333', 'brand', 'Atelier Noir', 'atelier@curateco.test')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- curators + curator_stores
-- ---------------------------------------------------------------------
insert into public.curators (id, profile_id, brand_name, brand_color, profile_photo_url, bank_name, account_number, account_name, wallet_balance, pending_commission)
values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '22222222-2222-2222-2222-222222222222',
  'Debbie', '#63001F', null,
  'GTBank', '0123456789', 'Debbie Okafor', 45000, 8500
)
on conflict (id) do nothing;

insert into public.curator_stores (id, curator_id, store_slug, intro_headline_prefix, intro_text, is_active, total_views)
values (
  'bbbbbbbb-0000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'debbie',
  'Curated by',
  'I pick pieces that feel like they were made for a slow Sunday and a good cup of coffee — quiet luxury, nothing loud.',
  true, 1240
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------
insert into public.brands (id, profile_id, business_name, logo_url, description, bank_name, account_number, account_name, is_active, is_suspended)
values (
  'cccccccc-0000-0000-0000-000000000001',
  '33333333-3333-3333-3333-333333333333',
  'Atelier Noir', null,
  'Lagos-based ready-to-wear label specialising in tailored linen and cotton staples.',
  'Zenith Bank', '0987654321', 'Atelier Noir Ltd', true, false
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
insert into public.products (id, brand_id, name, description, base_price, curateco_commission_pct, max_curator_commission_cap_pct, sizes, colors, stock, images, status, is_visible)
values
  (
    'dddddddd-0000-0000-0000-000000000001',
    'cccccccc-0000-0000-0000-000000000001',
    'T-Shirt Short', 'Breathable short-sleeve linen shirt cut for warm days and easy layering.',
    65000, 10, 15, array['S','M','L','XL'], array['Beige','Black'], 24,
    array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    'approved', true
  ),
  (
    'dddddddd-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000001',
    'Short-Sleeved Shirt', 'Tie-front blouse in soft rose cotton poplin.',
    72000, 10, 15, array['XS','S','M'], array['Rose','White'], 18,
    array['https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800'],
    'approved', true
  ),
  (
    'dddddddd-0000-0000-0000-000000000003',
    'cccccccc-0000-0000-0000-000000000001',
    'Sleeved Shirt with Inner', 'Layered overshirt with built-in inner tee, brushed cotton twill.',
    58000, 10, 15, array['M','L','XL'], array['Olive','Brown'], 12,
    array['https://images.unsplash.com/photo-1602810318660-d2c46b750f88?w=800'],
    'approved', true
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- curator_store_products
-- ---------------------------------------------------------------------
insert into public.curator_store_products (id, store_id, product_id, curator_commission_pct, why_curated_note)
values
  (
    'eeeeeeee-0000-0000-0000-000000000001',
    'bbbbbbbb-0000-0000-0000-000000000001',
    'dddddddd-0000-0000-0000-000000000001',
    12,
    'This shirt is the first thing I reach for on a humid Lagos morning — the linen breathes and somehow still looks put together by noon.'
  ),
  (
    'eeeeeeee-0000-0000-0000-000000000002',
    'bbbbbbbb-0000-0000-0000-000000000001',
    'dddddddd-0000-0000-0000-000000000002',
    12,
    'The tie-front detail makes this feel intentional rather than basic. I wear mine tucked into raw denim.'
  ),
  (
    'eeeeeeee-0000-0000-0000-000000000003',
    'bbbbbbbb-0000-0000-0000-000000000001',
    'dddddddd-0000-0000-0000-000000000003',
    12,
    'Olive and brushed cotton — this overshirt is doing all the work when I want to look finished without trying.'
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- sample order (already delivered, to populate dashboards with history)
-- ---------------------------------------------------------------------
insert into public.orders (id, store_id, curator_id, brand_id, customer_name, customer_phone, delivery_address, status, total_amount, curator_commission_amount, curateco_commission_amount, brand_payout_amount)
values (
  'ffffffff-0000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'cccccccc-0000-0000-0000-000000000001',
  'Tolu Adebayo', '+2348012345678', '14 Admiralty Way, Lekki Phase 1, Lagos',
  'delivered', 80080, 8580, 6500, 65000
)
on conflict (id) do nothing;

insert into public.order_items (order_id, product_id, store_product_id, quantity, size, color, unit_price, curator_commission_pct, subtotal)
values (
  'ffffffff-0000-0000-0000-000000000001',
  'dddddddd-0000-0000-0000-000000000001',
  'eeeeeeee-0000-0000-0000-000000000001',
  1, 'M', 'Beige', 80080, 12, 80080
);
