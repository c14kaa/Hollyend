-- Kristan's football corner: cache filled by the `football` edge function (football-data.org free tier).
create table public.football_cache (key text primary key, data jsonb not null, updated_at timestamptz not null default now());
-- RLS: family reads only; the edge function writes with the service role.
-- private.football_call() posts to /functions/v1/football with the cron secret; cron job 'hollyend-football' at 02:07 and 14:07 UTC.
-- Needs the FOOTBALL_DATA_KEY secret (Supabase > Edge Functions > Secrets), added by Harps.
