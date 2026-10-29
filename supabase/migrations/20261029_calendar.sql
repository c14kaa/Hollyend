-- Shared family calendar: school events and deadlines from the school run, plus parent-only to-dos.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  ref text unique,                       -- stable key used by the school run to avoid duplicates
  child text not null check (child in ('millie','kristan','both')),
  type text not null default 'event' check (type in ('event','deadline','action','trip','sport','holiday','news')),
  title text not null check (char_length(title) <= 160),
  details text check (char_length(details) <= 600),
  date date not null,
  end_date date,
  time text,
  bring text check (char_length(bring) <= 160),
  form_url text,
  link_url text,
  audience text not null default 'family' check (audience in ('family','parents')),
  done boolean not null default false,
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
create index if not exists events_date_idx on public.events (date);
alter table public.events enable row level security;
grant select, insert, update, delete on public.events to authenticated;
create policy "family reads events" on public.events for select to authenticated using (private.is_member() and (audience = 'family' or private.is_parent()));
create policy "parents add events" on public.events for insert to authenticated with check (private.is_parent());
create policy "parents edit events" on public.events for update to authenticated using (private.is_parent()) with check (private.is_parent());
create policy "parents remove events" on public.events for delete to authenticated using (private.is_parent());

-- Checkpoint for the school run (replaces the old planner artifact's meta/state).
create table if not exists private.run_state (key text primary key, value jsonb, updated_at timestamptz not null default now());
revoke all on private.run_state from public, anon, authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'events') then alter publication supabase_realtime add table public.events; end if;
end $$;
