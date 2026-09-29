"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { BOOKING, isBookableDate, isValidDateString } from "@/lib/booking";
import { SITE } from "@/lib/constants";
import {
  bookingSchema,
  inquirySchema,
  toFieldErrors,
  type BookingFormValues,
  type InquiryFormValues,
} from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no 0/O/1/I

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

export async function submitInquiry(
  values: InquiryFormValues & { website?: string },
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

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured({ reference });

  const input = parsed.data;
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

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfigured({ reference });

  const { error } = await supabase.from("bookings").insert({
    reference,
    name: input.name,
    email: input.email.toLowerCase(),
    phone: input.phone || null,
    company: input.company || null,
    service_type: input.serviceType || null,
    notes: input.notes || null,
    booking_date: input.date,
    time_slot: input.slot,
    duration_minutes: BOOKING.durationMinutes,
    timezone: SITE.timeZone,
    user_agent: await userAgent(),
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
