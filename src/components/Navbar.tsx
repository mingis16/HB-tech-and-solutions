"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Menu, MessageCircle, X } from "lucide-react";
import { NAV_LINKS, whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useUI } from "./UIProvider";
import { Dialog } from "./ui/Dialog";

export function Navbar() {
  const { openBooking } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        <a href="#top" className="rounded-lg" aria-label="HB Tech Solutions home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-md px-3 py-2 font-mono text-[13px] text-fg-muted transition hover:bg-surface hover:text-fg"
              >
                <span className="text-cyber/70">./</span>
                {link.label.toLowerCase()}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openBooking()} className="btn-primary hidden min-h-10 py-2 sm:inline-flex">
            <CalendarClock className="size-4" aria-hidden="true" />
            Book a call
          </button>
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
        onClose={() => setMenuOpen(false)}
        labelledBy="mobile-menu-title"
        className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-[86vw] max-w-sm open:animate-drawer-in md:hidden"
      >
        <div
          id="mobile-menu"
          className="flex h-full flex-col border-l border-edge bg-surface px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
        >
          <div className="flex h-12 items-center justify-between">
            <span id="mobile-menu-title" className="font-mono text-xs text-cyber">
              &gt;_ menu --open
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-11 place-items-center rounded-lg text-fg-muted hover:bg-surface-hover hover:text-fg"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-lg font-medium text-fg transition hover:bg-surface-hover"
                >
                  <span className="font-mono text-xs text-cyber">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 border-t border-edge pt-5">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
              className="btn-primary w-full"
            >
              <CalendarClock className="size-4" aria-hidden="true" />
              Book a 30-min call
            </button>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full">
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </Dialog>
    </header>
  );
}
