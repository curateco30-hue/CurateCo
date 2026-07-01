-- Curators need the same active/suspended status brands already have,
-- so admin curator management can suspend/restore accounts.
alter table public.curators
  add column if not exists is_active boolean not null default true;

alter table public.curators
  add column if not exists is_suspended boolean not null default false;
