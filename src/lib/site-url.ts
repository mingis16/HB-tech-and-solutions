/**
 * Absolute site origin for metadata, sitemap and structured data (server only).
 * Set NEXT_PUBLIC_SITE_URL in production; Vercel's production URL is used as a fallback.
 */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
