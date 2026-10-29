-- Bank weekly limit raised to £12 (guard_bank: used + new.pence > 1200). Rate: 150 points = £1, points set by the server.
-- Kristan's school merits: £1 each, paid when a parent marks them paid.
create table if not exists public.merits (
  id uuid primary key default gen_random_uuid(),
  ref text unique,
  child text not null default 'kristan' check (child in ('millie','kristan')),
  date date not null,
  subject text,
  reason text check (char_length(reason) <= 300),
  teacher text,
  count int not null default 1 check (count > 0),
  pence_each int not null default 100,
  paid_at timestamptz,
  source text,
  created_at timestamptz not null default now()
);
alter table public.merits enable row level security;
grant select, insert, update, delete on public.merits to authenticated;
create policy "family reads merits" on public.merits for select to authenticated using (private.is_member());
create policy "parents add merits" on public.merits for insert to authenticated with check (private.is_parent());
create policy "parents edit merits" on public.merits for update to authenticated using (private.is_parent()) with check (private.is_parent());
create policy "parents remove merits" on public.merits for delete to authenticated using (private.is_parent());
-- Kristan's La Liga Academy football: Tue and Thu 6:30-8pm, added as calendar rows 'laliga-YYYY-MM-DD' to 2 Jul 2027.
