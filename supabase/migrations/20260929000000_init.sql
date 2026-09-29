-- HB Tech Solutions: inquiries + consultation bookings
-- Run in the Supabase SQL editor, or with `supabase db push` if you use the CLI.
--
-- Security model: RLS is enabled with NO policies, so the public anon /
-- authenticated roles cannot read or write these tables at all. The Next.js
-- server actions use the service-role key (server-only), which bypasses RLS.

-- ---------------------------------------------------------------------------
-- Shared: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- inquiries: Option A, the service & inquiry form
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  name          text not null check (char_length(name) between 2 and 120),
  email         text not null check (char_length(email) <= 254 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  company       text check (char_length(company) <= 160),
  phone         text check (char_length(phone) <= 40),
  service_type  text not null check (service_type in (
                  'Custom Web Development',
                  'App Building',
                  'Business Automation Setup',
                  'Digital Marketing Strategies',
                  'AI Workflow Consulting',
                  'Penetration Testing',
                  'Cybersecurity'
                )),
  industry      text not null check (industry in (
                  'Restaurant / Salon',
                  'Professional Services',
                  'School / Education',
                  'Hotel / Tourism',
                  'Hospital / Healthcare',
                  'NGO / Development',
                  'Mining / Resources',
                  'Banking / Finance',
                  'Government',
                  'Agriculture',
                  'Other'
                )),
  priority      text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  title         text not null check (char_length(title) between 4 and 160),
  description   text not null check (char_length(description) between 20 and 5000),
  status        text not null default 'new' check (status in ('new', 'in_review', 'responded', 'closed')),
  user_agent    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_triage_idx on public.inquiries (status, priority);

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- bookings: Option B, 30-minute discovery calls
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique,
  name              text not null check (char_length(name) between 2 and 120),
  email             text not null check (char_length(email) <= 254 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  phone             text check (char_length(phone) <= 40),
  company           text check (char_length(company) <= 160),
  service_type      text check (service_type in (
                      'Custom Web Development',
                      'App Building',
                      'Business Automation Setup',
                      'Digital Marketing Strategies',
                      'AI Workflow Consulting',
                      'Penetration Testing',
                      'Cybersecurity'
                    )),
  notes             text check (char_length(notes) <= 1000),
  booking_date      date not null,
  time_slot         time not null,
  duration_minutes  smallint not null default 30 check (duration_minutes between 15 and 120),
  timezone          text not null default 'UTC',
  status            text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  user_agent        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- One active booking per slot. Cancelled bookings free the slot again.
create unique index if not exists bookings_active_slot_uidx
  on public.bookings (booking_date, time_slot)
  where status <> 'cancelled';

create index if not exists bookings_date_idx on public.bookings (booking_date);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Lock down public access
-- ---------------------------------------------------------------------------
alter table public.inquiries enable row level security;
alter table public.bookings  enable row level security;

revoke all on table public.inquiries from anon, authenticated;
revoke all on table public.bookings  from anon, authenticated;
