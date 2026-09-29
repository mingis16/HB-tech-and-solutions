"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { INDUSTRIES, SERVICE_TYPES, SITE, type Priority } from "@/lib/constants";
import { readConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

// SIMULATED social-proof feed: these events are randomly generated, not real
// submissions. Disable with NEXT_PUBLIC_ACTIVITY_FEED=false.

type Activity = { id: number; industry: string; service: string; priority: Priority; ago: string };

const SECTORS = INDUSTRIES.filter((i) => i !== "Other");
const PRIORITY_POOL: Priority[] = ["low", "medium", "medium", "high", "high", "critical"];
const AGO = ["just now", "1 min ago", "2 min ago", "4 min ago"];
const PRIORITY_TEXT: Record<Priority, string> = {
  low: "text-severity-low",
  medium: "text-severity-medium",
  high: "text-severity-high",
  critical: "text-severity-critical",
};
const DISMISS_KEY = "hb-activity-dismissed";

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

export function ActivityToast() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!SITE.activityFeed || dismissed) return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // Storage blocked: just show the feed.
    }

    let showTimer = 0;
    let hideTimer = 0;
    let count = 0;

    const schedule = (delay: number) => {
      showTimer = window.setTimeout(() => {
        // Wait while the tab is hidden or the cookie banner is still on screen.
        if (document.hidden || readConsent() === null) return schedule(4000);
        count += 1;
        setActivity({
          id: count,
          industry: pick(SECTORS),
          service: pick(SERVICE_TYPES),
          priority: pick(PRIORITY_POOL),
          ago: pick(AGO),
        });
        setVisible(true);
        hideTimer = window.setTimeout(() => setVisible(false), 6500);
        schedule(20000 + Math.random() * 15000);
      }, delay);
    };

    schedule(8000);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [dismissed]);

  if (!activity) return null;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-4 right-24 z-30 transition duration-500 sm:right-auto sm:w-[22rem]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div key={activity.id} className="relative flex items-start gap-3 rounded-xl border border-edge bg-surface/95 p-3.5 pr-10 shadow-panel backdrop-blur">
        <span className="relative mt-1.5 flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyber opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-cyber" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyber">Live · new request</p>
          <p className="mt-0.5 leading-snug text-fg-muted">
            Someone in <span className="font-medium text-fg">{activity.industry}</span> just requested{" "}
            <span className="font-medium text-fg">{activity.service}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] text-fg-subtle">
            {activity.ago} · priority: <span className={PRIORITY_TEXT[activity.priority]}>{activity.priority}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setDismissed(true);
            try {
              sessionStorage.setItem(DISMISS_KEY, "1");
            } catch {
              // ignore
            }
          }}
          className="absolute right-1.5 top-1.5 grid size-8 place-items-center rounded-md text-fg-subtle transition hover:bg-surface-hover hover:text-fg"
          aria-label="Dismiss activity notifications"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
