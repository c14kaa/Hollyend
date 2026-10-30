-- 7:30pm Abu Dhabi (15:30 UTC) nightly nudge to both children: homework count, and whether today's quiz is done.
select cron.schedule('hollyend-nightly-nudge', '30 15 * * *', $$select private.push_call('nudge')$$);
