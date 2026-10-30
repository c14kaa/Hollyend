-- School reports for the "Me → School reports" page. Children read only their own; parents read both.
create table public.reports (
  id uuid primary key default gen_random_uuid(), ref text unique not null,
  child text not null check (child in ('millie','kristan')),
  year_label text not null, term_label text not null, issued date not null,
  tutor text, tutor_comment text, attendance numeric, lates int, absences int, house_points int, referrals int,
  subjects jsonb not null default '[]',  -- [{name, grade '1+'|'1'|'2'|'3'|'4', attitude, punctuality, teacher, comment, target}]
  external jsonb,                        -- {gl:[{name,sas,stanine}], ngrt:{sas, readingAge}}
  feedback jsonb,                        -- {kid:[...], parent:[...], next:[...]} written when the report is added
  created_at timestamptz not null default now()
);
-- RLS: select using (private.is_parent() or private.my_child() = child). Writes by the school run (database owner).
