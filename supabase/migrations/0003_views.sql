-- =========================================================================
-- Public-safe views (exclude bank/payout fields from anonymous reads)
-- =========================================================================

create or replace view public.curator_public_profile as
select
  c.id,
  c.profile_id,
  c.brand_name,
  c.brand_color,
  c.profile_photo_url,
  c.style_tags,
  c.curation_score,
  c.created_at
from public.curators c;

create or replace view public.brand_public_profile as
select
  b.id,
  b.business_name,
  b.logo_url,
  b.description,
  b.is_active,
  b.created_at
from public.brands b
where b.is_active = true and b.is_suspended = false;

grant select on public.curator_public_profile to anon, authenticated;
grant select on public.brand_public_profile to anon, authenticated;
