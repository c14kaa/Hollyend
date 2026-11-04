-- Small points for Millie's daily tasks (TT Rockstars, reading, Reading Record): 3 points per task ticked today,
-- plus a 3-point bonus on the tick that completes all of today's tasks (max 12 a day). Daily tasks never count towards the streak.
alter table public.daily_ticks add column if not exists points int not null default 0;

create or replace function private.guard_daily_tick()
 returns trigger language plpgsql security definer set search_path to '' as $function$
declare n_tasks int; n_done int; has_bonus boolean;
begin
  new.day := private.dubai_today();
  new.created_by := auth.uid();
  if not exists (select 1 from public.daily_tasks t where t.id = new.task and t.child = new.child and t.active) then
    new.points := 0; return new;
  end if;
  new.points := 3;
  select count(*) into n_tasks from public.daily_tasks t where t.child = new.child and t.active;
  select count(*), coalesce(bool_or(k.points > 3), false) into n_done, has_bonus
    from public.daily_ticks k join public.daily_tasks t on t.id = k.task and t.active
    where k.child = new.child and k.day = new.day;
  if n_done + 1 >= n_tasks and not has_bonus then new.points := 6; end if;
  return new;
end $function$;

create or replace function private.points_balance(c text)
 returns integer language sql stable security definer set search_path to 'public' as $function$
  select (coalesce((select sum(points) from public.attempts where child = c), 0)
       + coalesce((select sum(points) from public.homework_done where child = c), 0)
       + coalesce((select sum(points) from public.game_plays where child = c), 0)
       + coalesce((select sum(points) from public.daily_ticks where child = c), 0)
       - coalesce((select sum(cost) from public.purchases where child = c), 0)
       - coalesce((select sum(points) from public.bank where child = c and status <> 'cancelled'), 0))::integer
$function$;
