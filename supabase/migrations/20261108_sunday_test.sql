-- Kristan's Sunday test: one go each Sunday (Abu Dhabi day), at least 10 questions; a perfect score earns double points.
create or replace function private.guard_attempt()
 returns trigger language plpgsql security definer set search_path to '' as $function$
declare n_res int; n_ok int; cb_ok int; mult numeric; m public.match_starts; m_ok int; i int;
begin
  new.created_by := auth.uid();
  if auth.uid() is null then
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
  new.points := least(500, round(new.score * 5 * mult + cb_ok * 3 + case when new.score = new.total then 10 else 0 end));
  if exists (select 1 from public.attempts x where x.child = new.child and x.at > now() - make_interval(secs => new.total * 3)) then
    raise exception 'Too fast: take your time over each question';
  end if;
  if new.mode = 'sunday' then
    if extract(dow from new.play_day) <> 0 then raise exception 'The Sunday test opens on Sunday'; end if;
    if new.total < 10 then raise exception 'Result doesn''t add up'; end if;
    if exists (select 1 from public.attempts x where x.child = new.child and x.mode = 'sunday' and x.play_day = new.play_day) then
      raise exception 'This week''s Sunday test has already been done';
    end if;
    if new.score = new.total then new.points := least(500, new.points * 2); end if;
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
end $function$;
