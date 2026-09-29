-- Spam protection: store a salted one-way hash of the submitter's IP so the
-- server can rate-limit submissions without keeping raw IP addresses.

alter table public.inquiries add column if not exists ip_hash text;
alter table public.bookings  add column if not exists ip_hash text;

create index if not exists inquiries_ip_hash_created_idx
  on public.inquiries (ip_hash, created_at desc)
  where ip_hash is not null;

create index if not exists bookings_ip_hash_created_idx
  on public.bookings (ip_hash, created_at desc)
  where ip_hash is not null;

-- Used to cap how many upcoming calls one email address can hold.
create index if not exists bookings_email_date_idx
  on public.bookings (email, booking_date);
