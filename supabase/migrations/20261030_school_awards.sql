-- School certificates, awards and selections shown on the Awards tab (merits stay in public.merits).
create table public.school_awards (
  id uuid primary key default gen_random_uuid(),
  ref text unique,
  child text not null check (child in ('millie','kristan')),
  date date not null,
  kind text not null default 'certificate' check (kind in ('certificate','award','selection','class')),
  title text not null check (char_length(title) <= 160),
  details text check (char_length(details) <= 400),
  given_by text check (char_length(given_by) <= 80),
  source text,
  created_at timestamptz not null default now()
);
-- RLS: family reads; parents insert, update and delete. Realtime on.
