import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import {
  ADDRESS,
  LEGAL_LINKS,
  MAPS_URL,
  NAV_LINKS,
  SERVICE_TYPES,
  SITE,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "@/lib/constants";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

// Links get vertical padding so they're comfortable tap targets on phones.
const linkClass = "inline-flex min-h-9 items-center gap-2 py-1 text-sm text-fg-muted transition hover:text-cyber";
const headingClass = "font-mono text-xs uppercase tracking-wider text-fg-subtle";

export function Footer() {
  return (
    <footer className="border-t border-edge bg-ink-deep">
      <div className="container grid gap-10 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo showCommand={false} />
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{SITE.tagline}</p>
          <address className="mt-5 space-y-1 not-italic">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={`${linkClass} items-start`}>
              <MapPin className="mt-0.5 size-4 shrink-0 text-cyber" aria-hidden="true" />
              <span>
                {ADDRESS.street}, {ADDRESS.area}, {ADDRESS.city}, {ADDRESS.country}
              </span>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              data-track-location="footer"
              className={linkClass}
            >
              <WhatsAppIcon className="size-4 shrink-0 text-[#25D366]" />
              {WHATSAPP_DISPLAY}
            </a>
            {SITE.contactEmail && (
              <a href={`mailto:${SITE.contactEmail}`} className={linkClass}>
                <Mail className="size-4 shrink-0 text-cyber" aria-hidden="true" />
                {SITE.contactEmail}
              </a>
            )}
          </address>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          <nav aria-label="Services" className="col-span-2 sm:col-span-1">
            <h2 className={headingClass}>Services</h2>
            <ul className="mt-3">
              {SERVICE_TYPES.map((service) => (
                <li key={service}>
                  <Link href="/#services" className={linkClass}>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className={headingClass}>Company</h2>
            <ul className="mt-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#inquiry" className={linkClass}>
                  Start a project
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className={headingClass}>Legal</h2>
            <ul className="mt-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className={linkClass} />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-edge">
        {/* Extra bottom padding on mobile so the floating WhatsApp button never covers text. */}
        <div className="container flex flex-col gap-2 pb-24 pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-mono">{"// secure by design. automated by default."}</p>
        </div>
      </div>
    </footer>
  );
}
