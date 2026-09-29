import { Mail } from "lucide-react";
import { NAV_LINKS, SERVICE_TYPES, SITE, whatsappLink } from "@/lib/constants";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="border-t border-edge bg-ink-deep">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo showCommand={false} />
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">{SITE.tagline}</p>
          <p className="mt-4 font-mono text-xs text-fg-subtle">{"// secure by design. automated by default."}</p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-fg-subtle">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_TYPES.map((service) => (
              <li key={service}>
                <a href="#services" className="text-sm text-fg-muted transition hover:text-cyber">
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-fg-subtle">Navigate</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-fg-muted transition hover:text-cyber">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-cyber"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </li>
            {SITE.contactEmail && (
              <li>
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-cyber"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {SITE.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-edge">
        {/* Extra bottom padding on mobile so the floating WhatsApp button never covers text. */}
        <div className="container flex flex-col gap-2 pb-24 pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-mono">
            status: <span className="text-cyber">operational</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
