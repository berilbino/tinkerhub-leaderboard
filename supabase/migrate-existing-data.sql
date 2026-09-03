-- TinkerHub Leaderboard — safe migration for an existing Supabase project
--
-- Run this in Supabase SQL Editor when the leaderboards, participants, rounds,
-- and scores tables already contain data. It does NOT delete, replace, or seed
-- leaderboard or participant rows. UUIDs remain database-only primary keys;
-- the web app uses each leaderboard's human-readable `slug` in public URLs.

begin;

alter table public.leaderboards
  add column if not exists illustration_key text not null default 'cassette',
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

alter table public.participants
  add column if not exists access_code_hint text;

alter table public.rounds
  add column if not exists max_score int not null default 20,
  add column if not exists published boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

alter table public.scores
  add column if not exists updated_at timestamptz not null default now();

alter table public.leaderboards drop constraint if exists leaderboards_status_check;
alter table public.leaderboards add constraint leaderboards_status_check
  check (status in ('active', 'completed', 'draft'));

create unique index if not exists rounds_leaderboard_round_order_idx
  on public.rounds (leaderboard_id, round_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leaderboards_updated_at on public.leaderboards;
create trigger leaderboards_updated_at
  before update on public.leaderboards
  for each row execute function public.set_updated_at();

drop trigger if exists rounds_updated_at on public.rounds;
create trigger rounds_updated_at
  before update on public.rounds
  for each row execute function public.set_updated_at();

drop trigger if exists scores_updated_at on public.scores;
create trigger scores_updated_at
  before update on public.scores
  for each row execute function public.set_updated_at();

alter table public.leaderboards enable row level security;
alter table public.participants enable row level security;
alter table public.rounds enable row level security;
alter table public.scores enable row level security;

commit;
