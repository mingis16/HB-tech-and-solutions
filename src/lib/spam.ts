import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

// Layered spam protection for the public forms:
//   1. Honeypot field            (checked in the actions)
//   2. Minimum time to complete  (bots submit instantly)
//   3. Link / markup heuristics
//   4. Cloudflare Turnstile      (only when both keys are configured)
//   5. Per-IP rate limits        (in-memory per instance + Supabase-backed)

export const MIN_FILL_MS = 3000;

export const LIMITS = {
  inquiry: { perHour: 5 },
  booking: { perHour: 3, activePerEmail: 2 },
} as const;

export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || null;
}

/** One-way, salted hash so raw IP addresses are never stored. */
export function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "hb-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function isTooFast(elapsedMs: unknown) {
  return typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS;
}

const LINK_RE = /(?:https?:\/\/|www\.)\S+/gi;
const MARKUP_RE = /\[url=|\[link=|<a\s+href/i;

/** Returns a user-facing reason when the content looks like spam, otherwise null. */
export function spamReason(fields: { name: string; title?: string; body?: string }) {
  const { name, title = "", body = "" } = fields;
  if (/(?:https?:\/\/|www\.)/i.test(name)) return "Please remove the link from your name.";
  if (MARKUP_RE.test(`${title} ${body}`)) return "Links in that format aren't allowed. Paste plain URLs instead.";
  if ((body.match(LINK_RE) ?? []).length > 2) return "Please include no more than 2 links.";
  if ((title.match(LINK_RE) ?? []).length > 0) return "Please keep links out of the title.";
  return null;
}

// ---------------------------------------------------------------------------
// In-memory sliding window. Serverless instances don't share memory, so this
// is a fast first line of defence; the database check below is authoritative.
// ---------------------------------------------------------------------------
const buckets = new Map<string, number[]>();

export function allowByMemory(key: string, limit: number, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 10_000) {
    for (const [k, times] of buckets) if (!times.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

// ---------------------------------------------------------------------------
// Cloudflare Turnstile
// ---------------------------------------------------------------------------
export function turnstileEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown, ip: string | null) {
  if (!turnstileEnabled()) return true;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] verification request failed:", error);
    return false; // fail closed
  }
}
