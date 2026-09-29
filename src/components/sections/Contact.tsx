import { Check, Mail } from "lucide-react";
import { BOOKING, formatSlot, timeZoneLabel } from "@/lib/booking";
import { SITE, whatsappLink } from "@/lib/constants";
import { BookCallButton } from "../BookCallButton";
import { InquiryForm } from "../InquiryForm";
import { WhatsAppIcon } from "../WhatsAppIcon";
import { SectionHeading } from "./SectionHeading";

const NEXT_STEPS = [
  { title: "Triage", text: "Your request is ranked by severity. Critical issues jump the queue." },
  { title: "Response", text: "You get a reply with clarifying questions or a proposed approach." },
  { title: "Kick-off", text: "Scoping, a clear proposal, then we build, secure or automate." },
];

export function Contact() {
  const days = "Mon–Fri";
  const hours = `${formatSlot(BOOKING.dayStart)}–${formatSlot(BOOKING.dayEnd)}`;

  return (
    <section id="contact" className="scroll-mt-20 border-t border-edge/60 bg-ink-deep/50 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          index="03"
          label="engage"
          title={
            <>
              Two ways to start. <span className="text-cyber">Zero friction.</span>
            </>
          }
          description="Send a detailed brief (Option A) or grab a 30-minute discovery call (Option B). Prefer chat? WhatsApp is one tap away."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div id="inquiry" className="scroll-mt-24">
            <InquiryForm />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* Option B */}
            <div className="panel p-6">
              <span className="rounded-md border border-cyber/40 bg-cyber/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyber">
                Option B
              </span>
              <h3 className="mt-3 text-lg font-semibold text-fg">Book a 30-min discovery call</h3>
              <p className="mt-1.5 text-sm text-fg-muted">
                Talk through your goals live and leave with a clear next step.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fg-muted">
                {[
                  "Scope goals, constraints & timeline",
                  "Honest advice on the right approach",
                  `${days} · ${hours} ${timeZoneLabel(SITE.timeZone)}`,
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-cyber" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <BookCallButton className="mt-5 w-full">Pick a time slot</BookCallButton>
            </div>

            {/* Instant channel */}
            <div className="panel p-6">
              <p className="eyebrow">Instant channel</p>
              <h3 className="mt-2 text-lg font-semibold text-fg">Chat on WhatsApp</h3>
              <p className="mt-1.5 text-sm text-fg-muted">Quick question or an active incident? Message us directly.</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-4 w-full bg-[#25D366] text-ink-deep hover:bg-[#2fe476]"
              >
                <WhatsAppIcon className="size-5" />
                Start a chat
              </a>
              {SITE.contactEmail && (
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="mt-3 flex items-center justify-center gap-2 text-sm text-fg-muted transition hover:text-cyber"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {SITE.contactEmail}
                </a>
              )}
            </div>

            {/* What happens next */}
            <div className="rounded-2xl border border-edge p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">What happens next</p>
              <ol className="mt-4 space-y-4">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-cyber/40 font-mono text-xs text-cyber">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-fg">{step.title}</p>
                      <p className="mt-0.5 text-sm text-fg-muted">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
