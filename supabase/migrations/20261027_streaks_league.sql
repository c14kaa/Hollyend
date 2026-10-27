-- Streaks, Millie's space journey and Kristan's league: server-side checks so results can't be faked.

-- 1. Every attempt gets a Dubai "play day", set by the server.
alter table public.attempts add column if not exists play_day date;
update public.attempts set play_day = (at at time zone 'Asia/Dubai')::date where play_day is null;
create unique index if not exists attempts_one_match_per_day on public.attempts (child, play_day) where mode = 'match';

create or replace function private.dubai_today() returns date
language sql stable set search_path = '' as $$ select (now() at time zone 'Asia/Dubai')::date $$;

create or replace function private.norm(t text) returns text
language sql immutable set search_path = '' as $$
  select lower(regexp_replace(replace(btrim(coalesce(t, '')), E'’', ''''), '\s+', ' ', 'g'))
$$;

-- 2. Kristan's daily match: started on the server, answered one question at a time, marked by the server.
create table if not exists public.match_starts (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child = 'kristan'),
  play_day date not null,
  started_at timestamptz not null default now(),
  questions jsonb not null,
  answers jsonb not null default '[]'::jsonb,
  created_by uuid,
  unique (child, play_day)
);
alter table public.match_starts enable row level security;
grant select, insert, update on public.match_starts to authenticated;
drop policy if exists "family reads matches" on public.match_starts;
create policy "family reads matches" on public.match_starts for select to authenticated using (private.is_member());
drop policy if exists "kristan kicks off" on public.match_starts;
create policy "kristan kicks off" on public.match_starts for insert to authenticated with check (private.my_child() = child);
drop policy if exists "kristan answers" on public.match_starts;
create policy "kristan answers" on public.match_starts for update to authenticated using (private.my_child() = child) with check (private.my_child() = child);

create or replace function private.guard_match() returns trigger
language plpgsql security definer set search_path = '' as $$
declare i int; q jsonb; a jsonb; ok boolean; marked jsonb := '[]'::jsonb;
begin
  if tg_op = 'INSERT' then
    new.play_day := private.dubai_today();
    new.started_at := now();
    new.answers := '[]'::jsonb;
    new.created_by := auth.uid();
    if jsonb_typeof(new.questions) <> 'array' or jsonb_array_length(new.questions) <> 5 then
      raise exception 'A match has exactly 5 questions';
    end if;
    for i in 0..4 loop
      if (new.questions->i->>'answer') is null then raise exception 'Match question % has no answer', i + 1; end if;
    end loop;
    return new;
  end if;
  -- UPDATE: only new answers can be added, today, one at a time, and the server marks them.
  if new.child <> old.child or new.play_day <> old.play_day or new.questions <> old.questions or new.started_at <> old.started_at then
    raise exception 'Matches can''t be changed';
  end if;
  if old.play_day <> private.dubai_today() then raise exception 'That match day is over'; end if;
  if jsonb_typeof(new.answers) <> 'array' or jsonb_array_length(new.answers) <> jsonb_array_length(old.answers) + 1 or jsonb_array_length(new.answers) > 5 then
    raise exception 'Answer one question at a time';
  end if;
  for i in 0..jsonb_array_length(new.answers) - 1 loop
    if i < jsonb_array_length(old.answers) then
      marked := marked || jsonb_build_array(old.answers->i);
    else
      q := old.questions->i; a := new.answers->i;
      if coalesce(q->>'type', '') = 'type' then ok := private.norm(a->>'chosen') = private.norm(q->>'answer');
      else ok := (a->>'chosen') = (q->>'answer'); end if;
      marked := marked || jsonb_build_array(jsonb_build_object('chosen', a->>'chosen', 'ok', ok, 'at', now()));
    end if;
  end loop;
  new.answers := marked;
  return new;
end $$;
drop trigger if exists match_guard on public.match_starts;
create trigger match_guard before insert or update on public.match_starts for each row execute function private.guard_match();
revoke all on function private.guard_match() from public, anon, authenticated;

-- 3. Attempts: server time, results must add up, points recalculated, no rapid-fire saves, one match a day.
create or replace function private.guard_attempt() returns trigger
language plpgsql security definer set search_path = '' as $$
declare n_res int; n_ok int; cb_ok int; mult numeric; m public.match_starts; m_ok int; i int;
begin
  new.created_by := auth.uid();
  if auth.uid() is null then  -- admin imports keep their own times
    new.play_day := coalesce(new.play_day, (new.at at time zone 'Asia/Dubai')::date);
    return new;
  end if;
  new.at := now();
  new.play_day := private.dubai_today();
  if new.total < 1 or new.total > 30 or new.score < 0 or new.score > new.total then
    raise exception 'Result doesn''t add up';
  end if;
  if new.level not in (1, 2, 3) then raise exception 'Result doesn''t add up'; end if;
  if jsonb_typeof(new.results) <> 'array' then raise exception 'Result doesn''t add up'; end if;
  n_res := jsonb_array_length(new.results);
  select count(*) filter (where (r->>'ok')::boolean), count(*) filter (where (r->>'ok')::boolean and coalesce((r->>'comeback')::boolean, false))
    into n_ok, cb_ok from jsonb_array_elements(new.results) r;
  if n_res <> new.total or n_ok <> new.score then raise exception 'Result doesn''t add up'; end if;
  if coalesce(jsonb_array_length(new.missed), 0) <> new.total - new.score then raise exception 'Result doesn''t add up'; end if;
  mult := case new.level when 1 then 1 when 2 then 1.5 else 2 end;
  new.comeback_right := cb_ok;
  new.points := least(500, round(new.score * 10 * mult + cb_ok * 5 + case when new.score = new.total then 20 else 0 end));
  if exists (select 1 from public.attempts x where x.child = new.child and x.at > now() - make_interval(secs => new.total * 3)) then
    raise exception 'Too fast: take your time over each question';
  end if;
  if new.mode = 'match' then
    select * into m from public.match_starts s where s.child = new.child and s.play_day = new.play_day;
    if m.id is null or new.total <> 5 or jsonb_array_length(m.answers) <> 5 then raise exception 'Play the match from the League page'; end if;
    select count(*) filter (where (a->>'ok')::boolean) into m_ok from jsonb_array_elements(m.answers) a;
    if m_ok <> new.score then raise exception 'Result doesn''t add up'; end if;
    for i in 0..4 loop
      if ((new.results->i->>'ok')::boolean) is distinct from ((m.answers->i->>'ok')::boolean) then raise exception 'Result doesn''t add up'; end if;
    end loop;
    if exists (select 1 from public.attempts x where x.child = new.child and x.mode = 'match' and x.play_day = new.play_day) then
      raise exception 'Today''s match has already been played';
    end if;
  end if;
  return new;
end $$;
revoke all on function private.guard_attempt() from public, anon, authenticated;

-- 4. Live updates for the league page.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'match_starts') then
    alter publication supabase_realtime add table public.match_starts;
  end if;
end $$;
