-- ============================================================================
-- IGC HEALTH HUB — Phase 1 Auth: profiles table + signup trigger + RLS
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run (uses if-not-exists / drop-if-exists throughout).
-- ============================================================================

-- 1. PROFILES TABLE (one row per auth user) ---------------------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  full_name      text,
  avatar_url     text,
  role           text not null default 'member' check (role in ('member','admin')),
  points         integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  created_at     timestamptz not null default now()
);

-- 2. AUTO-CREATE A PROFILE WHEN A USER SIGNS UP ------------------------------
-- SECURITY DEFINER lets the trigger insert the row past RLS.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. ROW LEVEL SECURITY ------------------------------------------------------
alter table public.profiles enable row level security;

-- Any signed-in user can READ profiles (needed for the leaderboard).
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read"
  on public.profiles for select
  to authenticated
  using (true);

-- A user can UPDATE only their own profile (e.g. edit their name).
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

-- A user can INSERT only their own row (safety net; the trigger normally does it).
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- 4. BACKFILL any users who signed up BEFORE the trigger existed -------------
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- ----------------------------------------------------------------------------
-- MAKE YOURSELF AN ADMIN (run once, after signing up — replace the email):
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- ----------------------------------------------------------------------------

