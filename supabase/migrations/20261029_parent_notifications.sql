-- Parents get a push when a child finishes homework, and a 7pm round-up.
create or replace function private.notify_hw_done() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status in ('ticked','verified') and (tg_op = 'INSERT' or old.status is distinct from new.status) and not private.is_parent() then
    perform net.http_post(
      url := 'https://dikpmyisanokawbqohqa.supabase.co/functions/v1/push',
      headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', (select cron_secret from public.push_config where id = 1)),
      body := jsonb_build_object('action', 'run', 'kind', 'done', 'homework_id', new.homework_id)
    );
  end if;
  return null;
end $$;
revoke all on function private.notify_hw_done() from public, anon, authenticated;
create trigger hw_done_notify after insert or update on public.homework_done for each row execute function private.notify_hw_done();
-- 7pm Abu Dhabi (15:00 UTC)
select cron.schedule('hollyend-parents-roundup', '0 15 * * *', $$select private.push_call('parents')$$);
