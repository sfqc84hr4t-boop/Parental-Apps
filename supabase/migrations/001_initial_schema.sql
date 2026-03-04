-- ============================================================
-- Kindroots — Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Parent info
  full_name text,
  avatar_url text,
  -- Subscription
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium')),
  subscription_expires_at timestamptz,
  stripe_customer_id text,
  -- Onboarding
  onboarding_completed boolean not null default false,
  -- Push notifications
  expo_push_token text
);

-- ============================================================
-- FAMILIES
-- ============================================================
create table families (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Owner
  owner_id uuid not null references profiles(id) on delete cascade,
  -- Partner (optional)
  partner_name text,
  partner_email text,
  -- Stage: pregnancy | newborn | infant | toddler
  stage text not null default 'pregnancy' check (stage in ('pregnancy', 'newborn', 'infant', 'toddler')),
  -- Parenting frameworks selected during onboarding (array of slugs)
  frameworks text[] not null default '{}',
  -- Notes / preferences
  notes text
);

-- ============================================================
-- BABIES
-- ============================================================
create table babies (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  date_of_birth date,
  due_date date,
  sex text check (sex in ('male', 'female', 'prefer_not_to_say')),
  avatar_url text,
  -- Feeding
  feeding_method text check (feeding_method in ('breastfed', 'formula', 'combination', 'expressing', 'not_started')),
  -- Health
  premature boolean not null default false,
  adjusted_age_weeks integer -- weeks premature (for adjusted age calculations)
);

-- ============================================================
-- KIRA CHAT MESSAGES
-- ============================================================
create table kira_messages (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  family_id uuid not null references families(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  -- For grouping conversations into sessions
  session_id uuid not null default uuid_generate_v4()
);

create index kira_messages_family_session_idx on kira_messages(family_id, session_id, created_at);

-- ============================================================
-- MILESTONES
-- ============================================================
create table milestone_definitions (
  id uuid primary key default uuid_generate_v4(),
  stage text not null,
  age_weeks_min integer,
  age_weeks_max integer,
  category text not null check (category in ('motor', 'language', 'social', 'cognitive', 'feeding', 'sleep')),
  title text not null,
  description text,
  tips text,
  -- Framework tags (e.g. which books discuss this)
  framework_tags text[] default '{}',
  sort_order integer not null default 0,
  is_system boolean not null default true
);

create table baby_milestones (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  baby_id uuid not null references babies(id) on delete cascade,
  milestone_id uuid references milestone_definitions(id),
  -- For custom milestones
  custom_title text,
  custom_category text,
  -- Completion
  achieved_at date,
  photo_url text,
  note text
);

create index baby_milestones_baby_idx on baby_milestones(baby_id, achieved_at);

-- ============================================================
-- ROUTINES
-- ============================================================
create table routines (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  -- morning | nap | evening | night | feeding | custom
  routine_type text not null default 'custom',
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table routine_steps (
  id uuid primary key default uuid_generate_v4(),
  routine_id uuid not null references routines(id) on delete cascade,
  sort_order integer not null default 0,
  title text not null,
  duration_minutes integer,
  icon text,
  notes text
);

-- ============================================================
-- LIBRARY / CONTENT
-- ============================================================
create table library_articles (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  stage text not null,
  age_weeks_min integer,
  age_weeks_max integer,
  framework_tags text[] default '{}',
  category text not null,
  title text not null,
  summary text,
  body text,
  read_time_minutes integer,
  is_premium boolean not null default false,
  sort_order integer not null default 0
);

create table user_article_reads (
  id uuid primary key default uuid_generate_v4(),
  read_at timestamptz not null default now(),
  profile_id uuid not null references profiles(id) on delete cascade,
  article_id uuid not null references library_articles(id) on delete cascade,
  unique(profile_id, article_id)
);

-- ============================================================
-- WONDER WEEKS LEAPS
-- ============================================================
create table wonder_weeks_leaps (
  id uuid primary key default uuid_generate_v4(),
  leap_number integer not null unique,
  name text not null,
  age_weeks_start integer not null,
  age_weeks_end integer not null,
  stormy_description text,
  sunny_description text,
  new_skills text[]
);

-- ============================================================
-- DAILY LOG (tracking feeds, sleeps, nappies)
-- ============================================================
create table daily_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  baby_id uuid not null references babies(id) on delete cascade,
  logged_at timestamptz not null default now(),
  log_type text not null check (log_type in ('feed', 'sleep', 'nappy', 'mood', 'note')),
  -- Feed
  feed_type text check (feed_type in ('breast_left', 'breast_right', 'bottle', 'solid')),
  feed_duration_minutes integer,
  feed_amount_ml integer,
  -- Sleep
  sleep_start timestamptz,
  sleep_end timestamptz,
  sleep_quality text check (sleep_quality in ('great', 'ok', 'poor')),
  -- Nappy
  nappy_type text check (nappy_type in ('wet', 'dirty', 'both', 'dry')),
  -- General
  note text,
  mood_rating integer check (mood_rating between 1 and 5)
);

create index daily_logs_baby_date_idx on daily_logs(baby_id, logged_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table families enable row level security;
alter table babies enable row level security;
alter table kira_messages enable row level security;
alter table baby_milestones enable row level security;
alter table routines enable row level security;
alter table routine_steps enable row level security;
alter table user_article_reads enable row level security;
alter table daily_logs enable row level security;

-- Profiles: user can only see/edit their own
create policy "profiles_own" on profiles
  for all using (auth.uid() = id);

-- Families: owner can CRUD
create policy "families_owner" on families
  for all using (auth.uid() = owner_id);

-- Babies: owner of family can CRUD
create policy "babies_family_owner" on babies
  for all using (
    exists (
      select 1 from families f
      where f.id = babies.family_id and f.owner_id = auth.uid()
    )
  );

-- Kira messages: family owner only
create policy "kira_messages_owner" on kira_messages
  for all using (
    exists (
      select 1 from families f
      where f.id = kira_messages.family_id and f.owner_id = auth.uid()
    )
  );

-- Baby milestones
create policy "baby_milestones_owner" on baby_milestones
  for all using (
    exists (
      select 1 from babies b
      join families f on f.id = b.family_id
      where b.id = baby_milestones.baby_id and f.owner_id = auth.uid()
    )
  );

-- Routines
create policy "routines_owner" on routines
  for all using (
    exists (
      select 1 from families f
      where f.id = routines.family_id and f.owner_id = auth.uid()
    )
  );

create policy "routine_steps_owner" on routine_steps
  for all using (
    exists (
      select 1 from routines r
      join families f on f.id = r.family_id
      where r.id = routine_steps.routine_id and f.owner_id = auth.uid()
    )
  );

-- Library reads
create policy "article_reads_own" on user_article_reads
  for all using (auth.uid() = profile_id);

-- Daily logs
create policy "daily_logs_owner" on daily_logs
  for all using (
    exists (
      select 1 from babies b
      join families f on f.id = b.family_id
      where b.id = daily_logs.baby_id and f.owner_id = auth.uid()
    )
  );

-- Public read for library_articles, milestones, wonder_weeks
create policy "library_public_read" on library_articles for select using (true);
create policy "milestone_definitions_public_read" on milestone_definitions for select using (true);
create policy "wonder_weeks_public_read" on wonder_weeks_leaps for select using (true);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger families_updated_at before update on families
  for each row execute function update_updated_at();
create trigger babies_updated_at before update on babies
  for each row execute function update_updated_at();
create trigger routines_updated_at before update on routines
  for each row execute function update_updated_at();
