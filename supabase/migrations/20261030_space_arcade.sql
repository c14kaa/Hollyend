-- Millie's Space Arcade (Journey tab): game plays and moon base builds.
-- Games never count towards streaks. Small points bonus, set by the server:
--   trumps win 6 / lose 2; moonbase min(score,6); bananas min(score,12)/2; memory win 5 / lose 2; quizshow min(score,10)/2 + 2 if won.
--   Only the first 2 plays of each game per day earn points, max 20 game points a day, at least 15 s between plays.
create table public.game_plays (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child in ('millie','kristan')),
  game text not null check (game in ('trumps','moonbase','bananas','memory','quizshow')),
  kind text not null default 'play' check (kind in ('play','build')),
  score integer not null default 0 check (score between 0 and 50),
  total integer not null default 0 check (total between 0 and 50),
  won boolean,
  item text check (char_length(item) <= 40),
  points integer not null default 0,
  play_day date,
  at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
create unique index game_plays_one_build on public.game_plays (child, item) where kind = 'build';
-- RLS: family reads; a child (or parent) inserts for that child. Trigger private.guard_game sets at, play_day and points.
-- private.points_balance now adds game_plays.points.
