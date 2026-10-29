-- Homework tab: tasks, ticks/checks with points, Millie's daily reminders, push notifications.
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Tasks (added by the homework run, or by a parent on the site).
create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child in ('millie','kristan')),
  title text not null check (char_length(title) <= 160),
  subject text,
  details text,
  due date,
  due_time text,
  link_url text,
  link_label text,
  kind text not null default 'tick' check (kind in ('tick','site')),
  target jsonb,          -- site tasks: {"mode": "vocab"|"spelling"|"revise"|..., "topic": "...", "minPct": 80}
  source text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
alter table public.homework enable row level security;
grant select, insert, update, delete on public.homework to authenticated;
create policy "family reads homework" on public.homework for select to authenticated using (private.is_member());
create policy "parents add homework" on public.homework for insert to authenticated with check (private.is_parent());
create policy "parents edit homework" on public.homework for update to authenticated using (private.is_parent()) with check (private.is_parent());
create policy "parents remove homework" on public.homework for delete to authenticated using (private.is_parent());

-- Completion: ticked by the child, verified by the site (or the homework run), confirmed or rejected by a parent.
create table if not exists public.homework_done (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework(id) on delete cascade,
  child text not null,
  status text not null check (status in ('ticked','verified','confirmed','rejected')),
  feel text check (feel in ('easy','ok','hard')),
  note text check (char_length(note) <= 200),
  done_at timestamptz not null default now(),
  checked_at timestamptz,
  points int not null default 0,
  created_by uuid,
  unique (homework_id)
);
alter table public.homework_done enable row level security;
grant select, insert, update on public.homework_done to authenticated;
create policy "family reads homework done" on public.homework_done for select to authenticated using (private.is_member());
create policy "mark own homework" on public.homework_done for insert to authenticated with check (private.can_write_for(child));
create policy "update own homework mark" on public.homework_done for update to authenticated using (private.can_write_for(child)) with check (private.can_write_for(child));

create or replace function private.hw_site_ok(h public.homework) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.attempts a
    where a.child = h.child and a.at >= h.created_at
      and (h.target->>'mode' is null or a.mode = h.target->>'mode' or (h.target->>'mode' = 'revise' and a.mode = 'revise'))
      and (h.target->>'topic' is null or a.topic = h.target->>'topic')
      and a.total >= coalesce((h.target->>'minQuestions')::int, 5)
      and a.score * 100 >= a.total * coalesce((h.target->>'minPct')::int, 80)
  )
$$;

create or replace function private.guard_hw_done() returns trigger
language plpgsql security definer set search_path = '' as $$
declare h public.homework; parent boolean := private.is_parent(); sys boolean := auth.uid() is null;
begin
  select * into h from public.homework where id = new.homework_id;
  if h.id is null then raise exception 'No such homework'; end if;
  new.child := h.child;
  if tg_op = 'INSERT' then
    new.done_at := now(); new.created_by := auth.uid();
    if not sys and not parent then
      if new.status = 'verified' and not private.hw_site_ok(h) then raise exception 'Not completed on the site yet'; end if;
      if new.status = 'ticked' and h.kind = 'site' then raise exception 'This one is checked by the site'; end if;
      if new.status not in ('ticked','verified') then raise exception 'Only Mum or Dad can confirm homework'; end if;
    end if;
  else
    new.homework_id := old.homework_id; new.done_at := old.done_at; new.created_by := old.created_by;
    if not sys and not parent then
      -- a child can re-tick after a rejection, or the site can verify; nothing else
      if not ((old.status = 'rejected' and new.status = 'ticked' and h.kind = 'tick')
           or (new.status = 'verified' and private.hw_site_ok(h))) then
        raise exception 'Only Mum or Dad can change this';
      end if;
      if old.status = 'rejected' then new.done_at := now(); end if;
    end if;
    if new.status is distinct from old.status and new.status in ('confirmed','rejected','verified') then new.checked_at := now(); end if;
  end if;
  new.points := case new.status when 'ticked' then 15 when 'verified' then 25 when 'confirmed' then 25 else 0 end
    + case when new.status <> 'rejected' and h.due is not null and (new.done_at at time zone 'Asia/Dubai')::date < h.due then 5 else 0 end;
  return new;
end $$;
drop trigger if exists hw_done_guard on public.homework_done;
create trigger hw_done_guard before insert or update on public.homework_done for each row execute function private.guard_hw_done();
revoke all on function private.guard_hw_done() from public, anon, authenticated;
revoke all on function private.hw_site_ok(public.homework) from public, anon, authenticated;

-- Homework points count towards the balance used by the shop and bank.
create or replace function private.points_balance(c text) returns integer
language sql stable security definer set search_path = 'public' as $$
  select coalesce((select sum(points) from public.attempts where child = c), 0)
       + coalesce((select sum(points) from public.homework_done where child = c), 0)
       - coalesce((select sum(cost) from public.purchases where child = c), 0)
       - coalesce((select sum(points) from public.bank where child = c and status <> 'cancelled'), 0)
$$;

-- Daily reminders (no points, no streak).
create table if not exists public.daily_tasks (
  id text primary key,
  child text not null check (child in ('millie','kristan')),
  title text not null,
  link_url text,
  sort int not null default 0,
  active boolean not null default true
);
alter table public.daily_tasks enable row level security;
grant select, insert, update, delete on public.daily_tasks to authenticated;
create policy "family reads daily tasks" on public.daily_tasks for select to authenticated using (private.is_member());
create policy "parents edit daily tasks" on public.daily_tasks for all to authenticated using (private.is_parent()) with check (private.is_parent());
insert into public.daily_tasks (id, child, title, link_url, sort) values
  ('millie-ttrs', 'millie', 'TT Rockstars: 15–30 minutes', 'https://play.ttrockstars.com', 1),
  ('millie-reading', 'millie', 'Read for 30 minutes', null, 2),
  ('millie-record', 'millie', 'Update your Reading Record', null, 3)
on conflict (id) do nothing;

create table if not exists public.daily_ticks (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child in ('millie','kristan')),
  task text not null,
  day date not null,
  created_by uuid default auth.uid(),
  unique (child, task, day)
);
alter table public.daily_ticks enable row level security;
grant select, insert, delete on public.daily_ticks to authenticated;
create policy "family reads daily ticks" on public.daily_ticks for select to authenticated using (private.is_member());
create policy "tick own daily" on public.daily_ticks for insert to authenticated with check (private.can_write_for(child));
create policy "untick own daily" on public.daily_ticks for delete to authenticated using (private.can_write_for(child));
create or replace function private.guard_daily_tick() returns trigger
language plpgsql security definer set search_path = '' as $$
begin new.day := private.dubai_today(); new.created_by := auth.uid(); return new; end $$;
drop trigger if exists daily_tick_guard on public.daily_ticks;
create trigger daily_tick_guard before insert on public.daily_ticks for each row execute function private.guard_daily_tick();
revoke all on function private.guard_daily_tick() from public, anon, authenticated;

-- Push notifications: one row per device subscription. Keys live only in push_config (no client access).
create table if not exists public.push_subs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  child text,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);
alter table public.push_subs enable row level security;
grant select, insert, delete on public.push_subs to authenticated;
create policy "own subscriptions" on public.push_subs for select to authenticated using (user_id = auth.uid());
create policy "add own subscription" on public.push_subs for insert to authenticated with check (user_id = auth.uid());
create policy "remove own subscription" on public.push_subs for delete to authenticated using (user_id = auth.uid());
create or replace function private.guard_push_sub() returns trigger
language plpgsql security definer set search_path = '' as $$
begin new.user_id := auth.uid(); new.child := private.my_child(); return new; end $$;
drop trigger if exists push_sub_guard on public.push_subs;
create trigger push_sub_guard before insert on public.push_subs for each row execute function private.guard_push_sub();
revoke all on function private.guard_push_sub() from public, anon, authenticated;

create table if not exists public.push_config (
  id int primary key default 1 check (id = 1),
  public_key text,
  private_jwk jsonb,
  cron_secret text not null default encode(extensions.gen_random_bytes(24), 'hex')
);
alter table public.push_config enable row level security;
revoke all on public.push_config from anon, authenticated;
insert into public.push_config (id) values (1) on conflict (id) do nothing;

-- Ask the push function to do something (used by the schedule and by the homework run).
create or replace function private.push_call(kind text) returns bigint
language sql security definer set search_path = '' as $$
  select net.http_post(
    url := 'https://dikpmyisanokawbqohqa.supabase.co/functions/v1/push',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', (select cron_secret from public.push_config where id = 1)),
    body := jsonb_build_object('action', 'run', 'kind', kind)
  )
$$;
revoke all on function private.push_call(text) from public, anon, authenticated;

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'homework') then alter publication supabase_realtime add table public.homework; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'homework_done') then alter publication supabase_realtime add table public.homework_done; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'daily_ticks') then alter publication supabase_realtime add table public.daily_ticks; end if;
end $$;

-- Reminders: 4pm Abu Dhabi (12:00 UTC) homework due today/tomorrow; 6:30pm (14:30 UTC) Millie's daily tasks.
select cron.schedule('hollyend-homework-reminder', '0 12 * * *', $$select private.push_call('homework')$$);
select cron.schedule('hollyend-daily-reminder', '30 14 * * *', $$select private.push_call('daily')$$);
