import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ADDRESS_LINE, MAPS_URL, SITE, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/constants";

export type LegalSection = { id: string; title: string; content: React.ReactNode };

type LegalPageProps = {
  slug: string;
  title: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

function Toc({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="space-y-1 text-sm">
      {sections.map((section, i) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex min-h-9 items-center gap-2 rounded-md px-2 text-fg-muted transition hover:bg-surface hover:text-fg"
          >
            <span className="w-5 shrink-0 font-mono text-[11px] text-cyber">{String(i + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function LegalPage({ slug, title, intro, sections }: LegalPageProps) {
  return (
    <main id="main" className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-cyber-glow" />
      <div className="container relative pb-20 pt-8 sm:pb-28 sm:pt-12">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-fg-subtle">
          <Link href="/" className="hover:text-cyber">
            ~
          </Link>{" "}
          / <span className="text-fg-muted">{slug}</span>
        </nav>

        <header className="mt-6 max-w-3xl">
          <p className="eyebrow">
            <span className="text-fg-subtle">{"//"}</span> legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-5xl">{title}</h1>
          <div className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">{intro}</div>
          <p className="mt-4 font-mono text-xs text-fg-subtle">Last updated: {SITE.legalUpdated}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside>
            <details className="group rounded-xl border border-edge bg-surface/60 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronDown className="size-4 text-fg-muted transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="px-2 pb-3">
                <Toc sections={sections} />
              </div>
            </details>
            <div className="sticky top-24 hidden lg:block">
              <p className="mb-3 px-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">On this page</p>
              <Toc sections={sections} />
            </div>
          </aside>

          <article className="legal min-w-0 max-w-3xl">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`}>
                  <span className="mr-2 font-mono text-sm text-cyber">{i + 1}.</span>
                  {section.title}
                </h2>
                {section.content}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}

/** Contact details block reused at the end of each legal page. */
export function LegalContact() {
  return (
    <ul>
      <li>
        <strong>Office:</strong>{" "}
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
          {ADDRESS_LINE}
        </a>
      </li>
      <li>
        <strong>WhatsApp:</strong>{" "}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-track-location="legal">
          {WHATSAPP_DISPLAY}
        </a>
      </li>
      {SITE.contactEmail && (
        <li>
          <strong>Email:</strong> <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </li>
      )}
    </ul>
  );
}
