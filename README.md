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

## Before going live

1. **Supabase:** create a project, then run both SQL files in `supabase/migrations/` in order
   (SQL Editor → paste → Run). Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your host's env vars.
2. **Site URL:** set `NEXT_PUBLIC_SITE_URL` (e.g. `https://hbtechsolutions.com`) so canonical URLs, the
   sitemap and link previews point at the real domain.
3. **Analytics:** create a Google Analytics 4 property and set `NEXT_PUBLIC_GA_ID`. In GA, set data
   retention to 14 months (Admin → Data collection → Data retention) to match the Privacy Policy.
4. **Optional bot check:** create a Cloudflare Turnstile widget and set both Turnstile keys.
5. **Review the legal pages** (`src/app/privacy`, `src/app/terms`) with a lawyer. They're a solid starting
   template, not legal advice.

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

## Supabase

- `20260929000000_init.sql`: `inquiries` and `bookings` tables, check constraints, a unique index that blocks
  double-booking a slot, and `updated_at` triggers.
- `20260929120000_spam_protection.sql`: `ip_hash` columns and indexes used for rate limiting.

**Security model:** Row Level Security is enabled on both tables with *no* policies, and all privileges are
revoked from `anon`/`authenticated`. The public anon key can't read or write anything. Only the server
actions in `src/app/actions.ts`, which use the service-role key server-side, can insert.
Never expose that key with a `NEXT_PUBLIC_` prefix.

View submissions in the Supabase Table Editor. Update `status` as you work them
(`new → in_review → responded → closed` for inquiries, `pending → confirmed / cancelled` for bookings).
Cancelling a booking frees its slot again.

## Spam protection

Every submission passes these layers in `src/lib/spam.ts` before anything is saved:

1. **Honeypot:** a hidden field only bots fill in; those submissions are silently discarded.
2. **Time trap:** inquiries sent less than 3 seconds (bookings: 2 seconds) after the form opens are
   rejected with a friendly "that was quick" message.
3. **Content rules:** no links in names or titles, max 2 links in descriptions, no BBCode/HTML links.
4. **Cloudflare Turnstile** (optional): enabled when both keys are set.
5. **Rate limits:** 5 inquiries and 3 bookings per hour per IP (IP addresses are stored only as salted
   one-way hashes), plus a cap of 2 upcoming calls per email address.

## Analytics & cookies

Google Analytics loads **only after** a visitor clicks *Accept* in the cookie banner; declining (or later
withdrawing via *Cookie settings* in the footer) keeps it off and removes its cookies. Tracked events:

| Event | When |
| --- | --- |
| `cta_click` | "Start your project" clicked (`location` = hero, navbar, mobile_menu, 404) |
| `generate_lead` | Inquiry form submitted successfully (service, industry, priority) |
| `book_call` | Discovery call booked |
| `whatsapp_click` | Any WhatsApp link clicked (`location` = floating_button, footer, …) |

No names, emails or phone numbers are ever sent to Google.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL (server only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server only) |
| `NEXT_PUBLIC_SITE_URL` | Live site origin for SEO metadata, sitemap and share previews |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, international format (default `23299108117`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact panel, footer and legal pages; hidden when empty |
| `NEXT_PUBLIC_BUSINESS_TIMEZONE` | IANA zone that call slots are offered in (default `Africa/Freetown`) |
| `NEXT_PUBLIC_ACTIVITY_FEED` | `false` disables the simulated "someone just requested…" toasts |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-…`); empty disables analytics |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile bot check |
| `RATE_LIMIT_SALT` | Optional salt for IP hashing (defaults to the service key) |

## Project layout

```
src/
  app/
    actions.ts            Server actions: submitInquiry, createBooking, getBookedSlots
    layout.tsx            Fonts, site-wide metadata, navbar/footer, cookie banner, analytics
    page.tsx              Landing page + LocalBusiness structured data
    privacy/ terms/       Legal pages
    not-found.tsx         Custom 404
    opengraph-image.tsx   Generated link-preview image
    robots.ts sitemap.ts manifest.ts apple-icon.tsx
  components/
    PrimaryCta.tsx        The one primary call to action ("Start your project")
    CookieConsent.tsx     Consent banner + preferences
    Analytics.tsx         Consent-gated GA4 + click tracking
    Turnstile.tsx         Optional Cloudflare bot check widget
    InquiryForm.tsx       Option A: service & inquiry form with live validation
    BookingModal.tsx      Option B: 30-min discovery call picker (bottom sheet on mobile)
    LegalPage.tsx         Layout for legal pages
    Navbar.tsx Footer.tsx WhatsAppButton.tsx ActivityToast.tsx UIProvider.tsx
    sections/             Hero, Services, Sectors, Contact
    ui/                   Dialog, Field, TextField, TerminalDots
  lib/
    constants.ts          Services, industries, contact details, address, CTA, site config
    spam.ts               Server-side spam protection
    consent.ts            Cookie consent store
    analytics.ts          track() helper
    booking.ts            Slot generation + timezone-safe date helpers
    validation.ts         Zod schemas shared by client and server
    supabase/             Server-only client + database types
supabase/migrations/      SQL schema
tailwind.config.ts        Colour tokens (ink, surface, edge, fg, cyber, severity), animations
```

## Customising

- **Contact details, address, CTA label:** `src/lib/constants.ts`.
- **Booking hours, days, slot length, lunch break:** `BOOKING` in `src/lib/booking.ts`.
- **Spam limits:** `LIMITS` and `MIN_FILL_MS` in `src/lib/spam.ts`.
- **Services copy/icons:** `SERVICES` in `src/components/sections/Services.tsx`.
- **Colours:** `tailwind.config.ts`. `cyber` is the accent, `ink` the page background.

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`
