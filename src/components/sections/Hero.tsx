import { Bot, Code2, MapPin, ShieldCheck } from "lucide-react";
import { ADDRESS } from "@/lib/constants";
import { BookCallButton } from "../BookCallButton";
import { PrimaryCta } from "../PrimaryCta";
import { TerminalDots } from "../ui/TerminalDots";

type TerminalLine =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string }
  | { kind: "ok"; label: string; status: string };

const TERMINAL_LINES: TerminalLine[] = [
  { kind: "cmd", text: 'hb init --client="you" --mode=secure' },
  { kind: "out", text: "resolving requirements…" },
  { kind: "ok", label: "software_engineering", status: "ready" },
  { kind: "ok", label: "cybersecurity", status: "armed" },
  { kind: "ok", label: "ai_automation", status: "online" },
  { kind: "ok", label: "discovery_call", status: "30 min" },
  { kind: "out", text: "system initialized. awaiting your brief." },
];

const PILLARS = [
  { icon: Code2, title: "Software Engineering", text: "Web & mobile products built for speed and scale." },
  { icon: ShieldCheck, title: "Cybersecurity", text: "Pen testing & hardening before attackers find the gaps." },
  { icon: Bot, title: "AI Automation", text: "Workflows that remove busywork and compound output." },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Backdrop: grid lines fading out + green glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-lines bg-grid [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-cyber-glow" />

      <div className="container relative grid items-center gap-12 pb-20 pt-8 sm:pb-28 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20">
        <div>
          <p className="inline-flex max-w-full items-center gap-2 rounded-lg border border-edge bg-surface/70 px-3 py-1.5 font-mono text-xs text-fg-muted backdrop-blur sm:text-sm">
            <span className="font-bold text-cyber">&gt;_</span>
            <span className="truncate">
              HB Tech Solutions <span className="text-fg-subtle">/</span> <span className="text-fg">Initialize</span>
            </span>
            <span className="inline-block h-4 w-2 shrink-0 animate-blink bg-cyber" aria-hidden="true" />
          </p>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Elite software.
            <br />
            <span className="bg-gradient-to-r from-cyber-300 via-cyber to-cyber-500 bg-clip-text text-transparent">
              Hardened security.
            </span>
            <br />
            Automation that scales.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            HB Tech Solutions engineers high-performance web and mobile products, stress-tests them with
            penetration testing, and wires in AI automation. One accountable partner for building, securing
            and scaling your business.
          </p>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <PrimaryCta location="hero" className="min-h-12 px-7 text-base" />
            <BookCallButton variant="link" className="justify-center sm:justify-start">
              or book a 30-min discovery call
            </BookCallButton>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-fg-subtle sm:justify-start">
            <MapPin className="size-3.5 text-cyber" aria-hidden="true" />
            Based in {ADDRESS.city}, {ADDRESS.country}. Working with teams everywhere.
          </p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex gap-3 rounded-xl border border-edge bg-surface/50 p-3.5 backdrop-blur sm:block sm:p-4"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-cyber" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-fg sm:mt-2.5">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-fg-muted sm:mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal window */}
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-cyber/10 blur-3xl" />
          <div className="panel relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-edge bg-ink/60 px-4 py-3">
              <TerminalDots />
              <span className="truncate font-mono text-xs text-fg-muted">hb@solutions: ~/initialize</span>
              <span className="ml-auto font-mono text-[10px] uppercase text-fg-subtle">bash</span>
            </div>
            <div className="space-y-2 overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed sm:p-6 sm:text-sm">
              {TERMINAL_LINES.map((line, i) => (
                <div
                  key={i}
                  className="animate-fade-up whitespace-nowrap"
                  style={{ animationDelay: `${250 + i * 320}ms` }}
                >
                  {line.kind === "cmd" && (
                    <p>
                      <span className="text-cyber">➜</span> <span className="text-severity-low">~</span>{" "}
                      <span className="text-fg">{line.text}</span>
                    </p>
                  )}
                  {line.kind === "out" && <p className="text-fg-muted">{line.text}</p>}
                  {line.kind === "ok" && (
                    <p className="flex items-center gap-3">
                      <span className="text-cyber">✓</span>
                      <span className="min-w-[10.5rem] text-fg sm:min-w-[12rem]">{line.label}</span>
                      <span className="rounded border border-cyber/30 bg-cyber/10 px-1.5 text-[11px] text-cyber">
                        {line.status}
                      </span>
                    </p>
                  )}
                </div>
              ))}
              <p
                className="flex animate-fade-up items-center gap-2"
                style={{ animationDelay: `${250 + TERMINAL_LINES.length * 320}ms` }}
              >
                <span className="text-cyber">➜</span> <span className="text-severity-low">~</span>
                <span className="inline-block h-4 w-2 animate-blink bg-cyber" aria-hidden="true" />
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-edge bg-ink/40 font-mono text-[11px]">
              {[
                ["latency", "low"],
                ["posture", "hardened"],
                ["uptime", "monitored"],
              ].map(([k, v]) => (
                <div key={k} className="border-r border-edge px-4 py-3 last:border-r-0">
                  <p className="uppercase tracking-wider text-fg-subtle">{k}</p>
                  <p className="mt-0.5 text-cyber">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
