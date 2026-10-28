create table if not exists public.rest_days (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child in ('millie','kristan')),
  day date not null,
  note text check (char_length(note) <= 80),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  unique (child, day)
);
alter table public.rest_days enable row level security;
grant select, insert, delete on public.rest_days to authenticated;
create policy "family reads rest days" on public.rest_days for select to authenticated using (private.is_member());
create policy "parents add rest days" on public.rest_days for insert to authenticated with check (private.is_parent());
create policy "parents remove rest days" on public.rest_days for delete to authenticated using (private.is_parent());
alter publication supabase_realtime add table public.rest_days;
