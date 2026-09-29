# HB Tech Solutions

Personal brand and service booking site. Next.js 16 (App Router), Tailwind CSS 3.4, Lucide icons, Supabase.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Without Supabase credentials the forms run in **demo mode** during development: submissions show the
success state but are not saved, and the server logs a warning. In production, missing credentials make
the forms return an error instead, so leads are never silently dropped.

## Supabase setup

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/migrations/20260929000000_init.sql`.
   This creates the `inquiries` and `bookings` tables, check constraints, a unique index that blocks
   double-booking a slot, and `updated_at` triggers.
3. Copy **Project URL** and the **service_role** (or new "secret") key from *Project Settings → API* into
   `.env.local` as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

**Security model:** Row Level Security is enabled on both tables with *no* policies, and all privileges are
revoked from `anon`/`authenticated`. The public anon key can't read or write anything. Only the server
actions in `src/app/actions.ts`, which use the service-role key server-side, can insert.
Never expose that key with a `NEXT_PUBLIC_` prefix.

View submissions in the Supabase Table Editor. Update `status` as you work them
(`new → in_review → responded → closed` for inquiries, `pending → confirmed / cancelled` for bookings).
Cancelling a booking frees its slot again.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL (server only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server only) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, international format, e.g. `23276123456` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact panel and footer; hidden when empty |
| `NEXT_PUBLIC_BUSINESS_TIMEZONE` | IANA zone that call slots are offered in (default `UTC`) |
| `NEXT_PUBLIC_ACTIVITY_FEED` | `false` disables the simulated "someone just requested…" toasts |

## Project layout

```
src/
  app/
    actions.ts          Server actions: submitInquiry, createBooking, getBookedSlots
    layout.tsx          Fonts, metadata, viewport
    page.tsx            Landing page composition
    globals.css         Tailwind layers + shared component classes (.btn, .field, .panel)
  components/
    UIProvider.tsx      Opens the booking modal / pre-fills the form from service cards
    Navbar.tsx          Sticky header + mobile drawer
    InquiryForm.tsx     Option A: service & inquiry form with live validation
    BookingModal.tsx    Option B: 30-min discovery call picker (bottom sheet on mobile)
    ActivityToast.tsx   Simulated live-request notifications
    WhatsAppButton.tsx  Floating wa.me chat button
    sections/           Hero, Services, Sectors, Contact
    ui/                 Dialog, Field, TextField, TerminalDots
  lib/
    constants.ts        Service types, industries, priorities, site config
    booking.ts          Slot generation + timezone-safe date helpers
    validation.ts       Zod schemas shared by client and server
    supabase/           Server-only client + database types
supabase/migrations/    SQL schema
tailwind.config.ts      Colour tokens (ink, surface, edge, fg, cyber, severity), animations
```

## Customising

- **Booking hours, days, slot length, lunch break:** `BOOKING` in `src/lib/booking.ts`.
- **Services copy/icons:** `SERVICES` in `src/components/sections/Services.tsx`.
- **Colours:** `tailwind.config.ts`. `cyber` is the accent, `ink` the page background.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`
