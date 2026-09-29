"use client";

import {
  ArrowUpRight,
  BrainCircuit,
  CalendarClock,
  Code2,
  Crosshair,
  Megaphone,
  ShieldCheck,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ServiceType } from "@/lib/constants";
import { useUI } from "../UIProvider";
import { SectionHeading } from "./SectionHeading";

type Service = {
  title: ServiceType;
  command: string;
  icon: LucideIcon;
  description: string;
  tags: string[];
};

const SERVICES: Service[] = [
  {
    title: "Custom Web Development",
    command: "./build --web",
    icon: Code2,
    description:
      "Fast, secure websites and web apps engineered with modern frameworks: built to load instantly, rank well and scale.",
    tags: ["Next.js", "E-commerce", "Dashboards"],
  },
  {
    title: "App Building",
    command: "./build --mobile",
    icon: Smartphone,
    description:
      "Cross-platform mobile and web apps from MVP to launch, with clean UX, offline support and hardened APIs.",
    tags: ["iOS & Android", "MVPs", "APIs"],
  },
  {
    title: "Business Automation Setup",
    command: "./automate --ops",
    icon: Workflow,
    description:
      "Connect your tools and kill repetitive work: invoicing, bookings, CRM updates and reporting on autopilot.",
    tags: ["CRM", "Integrations", "Reporting"],
  },
  {
    title: "Digital Marketing Strategies",
    command: "./grow --reach",
    icon: Megaphone,
    description:
      "Data-driven campaigns, SEO and conversion funnels that turn attention into qualified, measurable leads.",
    tags: ["SEO", "Paid social", "Analytics"],
  },
  {
    title: "AI Workflow Consulting",
    command: "./ai --integrate",
    icon: BrainCircuit,
    description:
      "Practical AI assistants, document processing and decision support woven into how your team already works.",
    tags: ["LLM agents", "RAG", "Chatbots"],
  },
  {
    title: "Penetration Testing",
    command: "./pentest --scope",
    icon: Crosshair,
    description:
      "Authorized, scoped attack simulations on your web apps, APIs and networks, with a prioritized remediation report.",
    tags: ["OWASP Top 10", "API", "Network"],
  },
  {
    title: "Cybersecurity",
    command: "./secure --harden",
    icon: ShieldCheck,
    description:
      "Security audits, hardening, policies and staff awareness to protect your data, uptime and reputation.",
    tags: ["Audits", "Hardening", "Awareness"],
  },
];

export function Services() {
  const { requestService, openBooking } = useUI();

  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          index="01"
          label="services"
          title={
            <>
              Full-stack capability. <span className="text-fg-muted">One accountable partner.</span>
            </>
          }
          description="From the first line of code to the last line of defence. Pick a service to pre-fill your request, or book a call if you're still scoping."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(({ title, command, icon: Icon, description, tags }) => (
            <article
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-surface/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyber/50 hover:bg-surface hover:shadow-glow has-[:focus-visible]:border-cyber has-[:focus-visible]:shadow-glow motion-reduce:hover:translate-y-0"
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyber/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl border border-edge-strong bg-ink/60 text-cyber transition duration-300 group-hover:border-cyber/60 group-hover:bg-cyber group-hover:text-ink-deep">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-[11px] text-fg-subtle transition group-hover:text-cyber">{command}</span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-fg">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{description}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md border border-edge bg-ink/50 px-2 py-0.5 font-mono text-[11px] text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => requestService(title)}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyber after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
              >
                Request this service
                <ArrowUpRight
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </article>
          ))}

          {/* Catch-all card */}
          <article className="group relative flex flex-col justify-between rounded-2xl border border-dashed border-cyber/40 bg-cyber/[0.04] p-6 transition duration-300 hover:border-cyber hover:bg-cyber/[0.08] has-[:focus-visible]:border-cyber">
            <div>
              <span className="grid size-11 place-items-center rounded-xl border border-cyber/40 bg-cyber/10 text-cyber">
                <CalendarClock className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-fg">Not sure where to start?</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                Book a 30-minute discovery call. We&apos;ll map your goals to the right mix of build, secure and
                automate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBooking()}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-cyber after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              Book a discovery call
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}
