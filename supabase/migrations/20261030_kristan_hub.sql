-- Kristan's Hub: Fortnite and Rocket League season info, readable only by Kristan and Dad.
create or replace function private.is_hub_viewer() returns boolean language sql stable security definer set search_path to 'public','private' as $$
  select exists (select 1 from public.members m where m.user_id = auth.uid() and ((m.role = 'child' and m.child = 'kristan') or (m.role = 'parent' and m.display_name = 'Dad')))
$$;
create table public.hub_items (
  id uuid primary key default gen_random_uuid(), ref text unique,
  game text not null check (game in ('fortnite','rocketleague')),
  kind text not null default 'event' check (kind in ('season','event','update')),
  title text not null, details text, starts date, ends date,
  status text not null default 'confirmed' check (status in ('confirmed','expected','rumour')),
  link_url text, active boolean not null default true, updated_at timestamptz not null default now()
);
-- RLS: select only where private.is_hub_viewer(). Writes by the school run (database owner).
-- The football edge function also stores FPL gameweek deadlines in football_cache (key 'fpl_events').
