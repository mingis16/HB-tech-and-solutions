export const SERVICE_TYPES = [
  "Custom Web Development",
  "App Building",
  "Business Automation Setup",
  "Digital Marketing Strategies",
  "AI Workflow Consulting",
  "Penetration Testing",
  "Cybersecurity",
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

export const INDUSTRIES = [
  "Restaurant / Salon",
  "Professional Services",
  "School / Education",
  "Hotel / Tourism",
  "Hospital / Healthcare",
  "NGO / Development",
  "Mining / Resources",
  "Banking / Finance",
  "Government",
  "Agriculture",
  "Other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const PRIORITY_VALUES = ["low", "medium", "high", "critical"] as const;
export type Priority = (typeof PRIORITY_VALUES)[number];

export const PRIORITIES: ReadonlyArray<{ value: Priority; label: string; hint: string }> = [
  { value: "low", label: "Low", hint: "General inquiry" },
  { value: "medium", label: "Medium", hint: "Needs attention" },
  { value: "high", label: "High", hint: "Urgent" },
  { value: "critical", label: "Critical", hint: "Emergency" },
];

function resolveTimeZone(tz: string | undefined): string {
  if (!tz) return "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return "UTC";
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const SITE = {
  name: "HB Tech Solutions",
  tagline: "Elite software engineering, cybersecurity & AI automation.",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "23299108117").replace(/\D/g, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  timeZone: resolveTimeZone(process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE || "Africa/Freetown"),
  activityFeed: process.env.NEXT_PUBLIC_ACTIVITY_FEED !== "false",
  /** GA4 measurement ID; only accepted in the G-XXXXXXX format so it is safe to inline. */
  gaId: /^G-[A-Z0-9]{4,}$/.test(GA_ID) ? GA_ID : "",
  /** Cloudflare Turnstile site key; the widget is skipped when empty. */
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  legalUpdated: "29 September 2026",
} as const;

export const ADDRESS = {
  street: "120 Regent Road",
  area: "IMATT",
  city: "Freetown",
  country: "Sierra Leone",
  countryCode: "SL",
} as const;

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.area}, ${ADDRESS.city}, ${ADDRESS.country}`;
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_LINE)}`;

/** "+232 99 108 117" for Sierra Leone numbers, "+<digits>" otherwise. */
export const WHATSAPP_DISPLAY = /^232\d{8}$/.test(SITE.whatsappNumber)
  ? SITE.whatsappNumber.replace(/^(232)(\d{2})(\d{3})(\d{3})$/, "+$1 $2 $3 $4")
  : `+${SITE.whatsappNumber}`;

export function whatsappLink(message = "Hi HB Tech Solutions, I'd like to discuss a project.") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** The single primary call to action used across the site. */
export const PRIMARY_CTA = { label: "Start your project", href: "/#inquiry" } as const;

// Root-relative so they also work from the legal and 404 pages.
export const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#sectors", label: "Sectors" },
  { href: "/#contact", label: "Contact" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;
