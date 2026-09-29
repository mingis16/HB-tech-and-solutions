import type { Metadata } from "next";
import Link from "next/link";
import { House } from "lucide-react";
import { PrimaryCta } from "@/components/PrimaryCta";
import { TerminalDots } from "@/components/ui/TerminalDots";
import { LEGAL_LINKS, NAV_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn't exist or has moved. Head back to HB Tech Solutions.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_65%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-cyber-glow" />

      <div className="container relative flex min-h-[72vh] flex-col items-center justify-center py-16 text-center">
        <div className="panel w-full max-w-lg overflow-hidden text-left">
          <div className="flex items-center gap-3 border-b border-edge bg-ink/60 px-4 py-3">
            <TerminalDots />
            <span className="truncate font-mono text-xs text-fg-muted">hb@solutions: ~</span>
          </div>
          <div className="space-y-1.5 overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
            <p className="whitespace-nowrap">
              <span className="text-cyber">➜</span> <span className="text-severity-low">~</span>{" "}
              <span className="text-fg">cd ./requested-page</span>
            </p>
            <p className="text-severity-critical">bash: cd: ./requested-page: No such file or directory</p>
            <p className="whitespace-nowrap">
              <span className="text-cyber">➜</span> <span className="text-severity-low">~</span>{" "}
              <span className="text-fg">status</span>
            </p>
            <p className="text-fg-muted">
              404 <span className="text-fg-subtle">·</span> route_not_found
            </p>
            <p className="flex items-center gap-2">
              <span className="text-cyber">➜</span> <span className="text-severity-low">~</span>
              <span className="inline-block h-4 w-2 animate-blink bg-cyber" aria-hidden="true" />
            </p>
          </div>
        </div>

        <h1 className="mt-10 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-fg-muted">
          The page you&apos;re looking for was moved, deleted or never existed. Let&apos;s get you back on track.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/" className="btn-ghost">
            <House className="size-4" aria-hidden="true" />
            Back to homepage
          </Link>
          <PrimaryCta location="404" />
        </div>

        <nav aria-label="Helpful links" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-mono text-xs">
            {[...NAV_LINKS, ...LEGAL_LINKS].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-9 items-center text-fg-subtle hover:text-cyber">
                  ./{link.label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
