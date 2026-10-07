-- Run this once in the Supabase SQL editor for the project used by this site.
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  is_rset_student boolean not null,
  university_id text,
  college_email text,
  department text,
  semester text,
  institution_name text,
  year_of_study text,
  why_attend text,
  heard_from text not null check (heard_from in ('instagram', 'friends', 'posters', 'other')),
  consent boolean not null check (consent = true),
  constraint registration_student_details check (
    (is_rset_student and university_id is not null and college_email is not null
      and department is not null and semester is not null
      and institution_name is null and year_of_study is null)
    or
    (not is_rset_student and institution_name is not null and year_of_study is not null
      and university_id is null and college_email is null
      and department is null and semester is null)
  )
);

-- The browser must never access registration rows directly. Server requests use
-- the service role key, which bypasses RLS; keep it in server environment vars.
alter table public.registrations enable row level security;
