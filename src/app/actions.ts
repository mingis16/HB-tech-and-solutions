"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BOOKING, isBookableDate, isValidDateString, todayIn } from "@/lib/booking";
import { SITE } from "@/lib/constants";
import {
  LIMITS,
  allowByMemory,
  getClientIp,
  hashIp,
  isTooFast,
  spamReason,
  verifyTurnstile,
} from "@/lib/spam";
import {
  bookingSchema,
  inquirySchema,
  toFieldErrors,
  type BookingFormValues,
  type InquiryFormValues,
} from "@/lib/validation";
import type { ActionResult, SubmitMeta } from "@/lib/types";

type Failure = Extract<ActionResult<never>, { ok: false }>;

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no 0/O/1/I
const HOUR_MS = 60 * 60 * 1000;

function makeReference(prefix: string) {
  let suffix = "";
  for (const byte of randomBytes(6)) suffix += REFERENCE_ALPHABET[byte % 32];
  return `${prefix}-${suffix}`;
}

async function userAgent() {
  const ua = (await headers()).get("user-agent");
  return ua ? ua.slice(0, 300) : null;
}

/** Bots fill every input, including the visually hidden "website" field. */
function isBot(values: unknown) {
  return (
    typeof values === "object" &&
    values !== null &&
    "website" in values &&
    typeof values.website === "string" &&
    values.website.trim() !== ""
  );
}

/**
 * Without Supabase credentials: simulate success in development so the UI can
 * be exercised, but fail loudly in production so leads are never silently lost.
 */
function notConfigured<T>(data: T): ActionResult<T> {
  if (process.env.NODE_ENV === "production") {
    console.error("[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.");
    return {
      ok: false,
      code: "unavailable",
      error: "Online submissions are temporarily unavailable. Please reach us on WhatsApp.",
    };
  }
  console.warn("[demo mode] Supabase env vars missing; submission was NOT saved.");
  return { ok: true, data, demo: true };
}

const RATE_LIMITED: Failure = {
  ok: false,
  code: "rate_limited",
  error: "Too many submissions from your network. Please try again later, or message us on WhatsApp.",
};

/**
 * Runs the anti-spam layers that don't need the database.
 * Returns a failure to send back, or the hashed IP for storage and DB limits.
 */
async function screen(
  kind: keyof typeof LIMITS,
  meta: SubmitMeta | undefined,
  content: { name: string; title?: string; body?: string },
): Promise<Failure | { ipHash: string | null }> {
  if (isTooFast(meta?.elapsedMs)) {
    return {
      ok: false,
      code: "too_fast",
      error: "That was quick! Please take a moment to review your details, then submit again.",
    };
  }

  const reason = spamReason(content);
  if (reason) return { ok: false, code: "validation", error: reason };

  const ip = await getClientIp();
  if (!(await verifyTurnstile(meta?.turnstileToken, ip))) {
    return { ok: false, code: "captcha", error: "Please complete the security check and try again." };
  }

  // Without an IP (e.g. a proxy that strips it) every visitor would share one
  // bucket, so IP limits are skipped rather than blocking everyone.
  const ipHash = ip ? hashIp(ip) : null;
  if (ipHash && !allowByMemory(`${kind}:${ipHash}`, LIMITS[kind].perHour)) return RATE_LIMITED;

  return { ipHash };
}

async function overDatabaseLimit(table: "inquiries" | "bookings", ipHash: string | null, limit: number) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !ipHash) return false;
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - HOUR_MS).toISOString());
  if (error) {
    console.error(`[${table}] rate-limit lookup failed:`, error.code, error.message);
    return false;
  }
  return (count ?? 0) >= limit;
}

export async function submitInquiry(
  values: InquiryFormValues & { website?: string },
  meta?: SubmitMeta,
): Promise<ActionResult<{ reference: string }>> {
  const reference = makeReference("INQ");
  if (isBot(values)) return { ok: true, data: { reference } };

  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      code: "validation",
      error: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }
  const input = parsed.data;

  const screened = await screen("inquiry", meta, {
    name: input.name,
    title: input.title,
    body: input.description,
  });
  if ("ok" in screened) return screened;

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured({ reference });
  if (await overDatabaseLimit("inquiries", screened.ipHash, LIMITS.inquiry.perHour)) return RATE_LIMITED;

  const { error } = await supabase.from("inquiries").insert({
    reference,
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company || null,
    phone: input.phone || null,
    service_type: input.serviceType,
    industry: input.industry,
    priority: input.priority,
    title: input.title,
    description: input.description,
    user_agent: await userAgent(),
    ip_hash: screened.ipHash,
  });

  if (error) {
    console.error("[inquiries] insert failed:", error.code, error.message);
    return {
      ok: false,
      code: "server",
      error: "We couldn't save your request. Please try again, or message us on WhatsApp.",
    };
  }

  return { ok: true, data: { reference } };
}

/** Returns the "HH:MM" slots already taken on a date. Reveals nothing else. */
export async function getBookedSlots(date: string): Promise<string[]> {
  if (typeof date !== "string" || !isValidDateString(date)) return [];

  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bookings")
    .select("time_slot")
    .eq("booking_date", date)
    .neq("status", "cancelled");

  if (error) {
    console.error("[bookings] availability lookup failed:", error.code, error.message);
    return [];
  }
  return data.map((row) => row.time_slot.slice(0, 5));
}

export async function createBooking(
  values: BookingFormValues & { website?: string },
  meta?: SubmitMeta,
): Promise<ActionResult<{ reference: string }>> {
  const reference = makeReference("CALL");
  if (isBot(values)) return { ok: true, data: { reference } };

  const parsed = bookingSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      code: "validation",
      error: "Please fix the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }
  const input = parsed.data;

  if (!isBookableDate(input.date, SITE.timeZone)) {
    return {
      ok: false,
      code: "validation",
      error: "That date is no longer available. Please pick another day.",
      fieldErrors: { date: "Date no longer available" },
    };
  }

  const screened = await screen("booking", meta, { name: input.name, body: input.notes });
  if ("ok" in screened) return screened;

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured({ reference });
  if (await overDatabaseLimit("bookings", screened.ipHash, LIMITS.booking.perHour)) return RATE_LIMITED;

  const email = input.email.toLowerCase();
  const { count: upcoming, error: upcomingError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("booking_date", todayIn(SITE.timeZone))
    .neq("status", "cancelled");
  if (upcomingError) {
    console.error("[bookings] upcoming lookup failed:", upcomingError.code, upcomingError.message);
  } else if ((upcoming ?? 0) >= LIMITS.booking.activePerEmail) {
    return {
      ok: false,
      code: "limit",
      error: `You already have ${LIMITS.booking.activePerEmail} upcoming calls booked. Message us on WhatsApp to reschedule or add another.`,
    };
  }

  const { error } = await supabase.from("bookings").insert({
    reference,
    name: input.name,
    email,
    phone: input.phone || null,
    company: input.company || null,
    service_type: input.serviceType || null,
    notes: input.notes || null,
    booking_date: input.date,
    time_slot: input.slot,
    duration_minutes: BOOKING.durationMinutes,
    timezone: SITE.timeZone,
    user_agent: await userAgent(),
    ip_hash: screened.ipHash,
  });

  if (error) {
    // 23505 = unique_violation on bookings_active_slot_uidx: someone got there first.
    if (error.code === "23505") {
      return {
        ok: false,
        code: "slot_taken",
        error: "That time slot was just booked. Please choose another.",
        fieldErrors: { slot: "Slot just taken" },
      };
    }
    console.error("[bookings] insert failed:", error.code, error.message);
    return {
      ok: false,
      code: "server",
      error: "We couldn't confirm your booking. Please try again, or message us on WhatsApp.",
    };
  }

  return { ok: true, data: { reference } };
}
