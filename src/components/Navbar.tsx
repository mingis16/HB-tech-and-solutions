"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Menu, X } from "lucide-react";
import { LEGAL_LINKS, NAV_LINKS, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { PrimaryCta } from "./PrimaryCta";
import { useUI } from "./UIProvider";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { Dialog } from "./ui/Dialog";

export function Navbar() {
  const { openBooking } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    // The drawer is mobile-only; close it if the viewport grows past md.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300",
        scrolled ? "border-edge bg-ink/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="rounded-lg" aria-label="HB Tech Solutions home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 font-mono text-[13px] text-fg-muted transition hover:bg-surface hover:text-fg"
              >
                <span className="text-cyber/70">./</span>
                {link.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <PrimaryCta location="navbar" className="hidden min-h-10 py-2 sm:inline-flex" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid size-11 place-items-center rounded-lg border border-edge bg-surface/60 text-fg transition hover:border-cyber/50 md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Dialog
        open={menuOpen}
        onClose={close}
        labelledBy="mobile-menu-title"
        className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[86vw] max-w-sm open:animate-drawer-in md:hidden"
      >
        <div
          id="mobile-menu"
          className="flex h-full flex-col overflow-y-auto border-l border-edge bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
        >
          <div className="flex h-12 items-center justify-between">
            <span id="mobile-menu-title" className="font-mono text-xs text-cyber">
              &gt;_ menu --open
            </span>
            <button
              type="button"
              onClick={close}
              className="grid size-11 place-items-center rounded-lg text-fg-muted hover:bg-surface-hover hover:text-fg"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-lg font-medium text-fg transition hover:bg-surface-hover"
                >
                  <span className="font-mono text-xs text-cyber">0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 border-t border-edge pt-5">
            <PrimaryCta location="mobile_menu" onClick={close} className="w-full" />
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              data-track-location="mobile_menu"
              className="btn-ghost w-full"
            >
              <WhatsAppIcon className="size-4 text-[#25D366]" />
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <button
              type="button"
              onClick={() => {
                close();
                openBooking();
              }}
              className="flex min-h-11 w-full items-center justify-center gap-2 text-sm text-fg-muted transition hover:text-fg"
            >
              <CalendarClock className="size-4" aria-hidden="true" />
              Or book a 30-min discovery call
            </button>
            <p className="flex justify-center gap-4 pt-1 text-xs text-fg-subtle">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={close} className="py-2 hover:text-fg">
                  {link.label}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </Dialog>
    </header>
  );
}
