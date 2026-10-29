-- Millie's Star Wallet: her cash-outs go straight into an online wallet; parents add money (birthday money etc.) and record spending.
-- Also fixes the old 500-points rate check, which clashed with the 150-points rate set by guard_bank.
alter table public.bank drop constraint if exists rate;
alter table public.bank add constraint rate check (points * 2 = pence * 3);
alter table public.bank drop constraint if exists bank_status_check;
alter table public.bank add constraint bank_status_check check (status in ('requested','paid','cancelled','wallet'));
-- private.guard_bank: on insert, a Millie cash-out gets status 'wallet' and paid_at now(); updates may never set 'wallet'.
create table public.wallet (
  id uuid primary key default gen_random_uuid(),
  child text not null check (child in ('millie','kristan')),
  kind text not null check (kind in ('in','out')),
  pence integer not null check (pence > 0 and pence <= 100000),
  note text check (char_length(note) <= 120),
  day date not null default (now() at time zone 'Asia/Dubai')::date,
  at timestamptz not null default now(),
  created_by uuid default auth.uid()
);
-- RLS: family reads; parents insert and delete. private.wallet_balance(child) = wallet cash-outs + money in - money out.
-- private.guard_wallet (before insert): stamps at/created_by and refuses spending more than the balance.
