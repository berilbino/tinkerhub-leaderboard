-- ==============================================================================
-- TinkerHub Leaderboard — Supabase Schema
-- Run this entire file in the Supabase SQL Editor to set up all tables.
-- ==============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. LEADERBOARDS
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.leaderboards (
  id               uuid        primary key default gen_random_uuid(),
  title            text        not null,
  subtitle         text,
  slug             text        not null unique,
  illustration_key text        not null default 'cassette',
  status           text        not null default 'active' check (status in ('active','completed','draft')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Supports projects created with an older version of this schema.
alter table public.leaderboards drop constraint if exists leaderboards_status_check;
alter table public.leaderboards add constraint leaderboards_status_check
  check (status in ('active','completed','draft'));

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. PARTICIPANTS
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.participants (
  id                uuid        primary key default gen_random_uuid(),
  leaderboard_id    uuid        not null references public.leaderboards(id) on delete cascade,
  name              text        not null,
  access_code_hash  text        not null,
  access_code_hint  text,        -- plain-text code shown to admin only
  created_at        timestamptz not null default now()
);

-- One participant can only appear once per leaderboard
create unique index if not exists participants_leaderboard_name_idx
  on public.participants (leaderboard_id, lower(name));
create unique index if not exists participants_leaderboard_access_code_idx
  on public.participants (leaderboard_id, access_code_hash);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. ROUNDS
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.rounds (
  id             uuid        primary key default gen_random_uuid(),
  leaderboard_id uuid        not null references public.leaderboards(id) on delete cascade,
  name           text        not null,
  round_order    int         not null default 1,
  max_score      int         not null default 20,
  published      boolean     not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. SCORES
-- ──────────────────────────────────────────────────────────────────────────────
create table if not exists public.scores (
  id             uuid        primary key default gen_random_uuid(),
  participant_id uuid        not null references public.participants(id) on delete cascade,
  round_id       uuid        not null references public.rounds(id) on delete cascade,
  score          int         not null default 0 check (score >= 0),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (participant_id, round_id)
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. HELPER: updated_at auto-update trigger
-- ──────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger leaderboards_updated_at
  before update on public.leaderboards
  for each row execute function public.set_updated_at();

create or replace trigger rounds_updated_at
  before update on public.rounds
  for each row execute function public.set_updated_at();

create or replace trigger scores_updated_at
  before update on public.scores
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. ROW-LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────────────────────
alter table public.leaderboards   enable row level security;
alter table public.participants   enable row level security;
alter table public.rounds         enable row level security;
alter table public.scores         enable row level security;

-- Drop policies first to make this script re-runnable.
drop policy if exists "Public read leaderboards" on public.leaderboards;
drop policy if exists "Public read participants" on public.participants;
drop policy if exists "Public read rounds" on public.rounds;
drop policy if exists "Public read scores" on public.scores;

-- No anonymous policies are created. Browser clients cannot query participant
-- names, access-code hints, scores, or event data directly from Supabase.
-- All reads and writes pass through the Next.js server, whose service-role key
-- is never exposed to the browser or committed to git.

-- ==============================================================================
-- Done
-- ==============================================================================
