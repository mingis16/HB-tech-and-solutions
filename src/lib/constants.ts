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

export const SITE = {
  name: "HB Tech Solutions",
  tagline: "Elite software engineering, cybersecurity & AI automation.",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15555550123").replace(/\D/g, ""),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  timeZone: resolveTimeZone(process.env.NEXT_PUBLIC_BUSINESS_TIMEZONE),
  activityFeed: process.env.NEXT_PUBLIC_ACTIVITY_FEED !== "false",
} as const;

export function whatsappLink(message = "Hi HB Tech Solutions, I'd like to discuss a project.") {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#sectors", label: "Sectors" },
  { href: "#inquiry", label: "Inquiry" },
  { href: "#contact", label: "Contact" },
] as const;
