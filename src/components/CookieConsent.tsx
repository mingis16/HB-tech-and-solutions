"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, SlidersHorizontal } from "lucide-react";
import { OPEN_SETTINGS_EVENT, readConsent, useConsent, writeConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);

  // The footer's "Cookie settings" link reopens the banner with preferences.
  useEffect(() => {
    const open = () => {
      setAnalyticsDraft(readConsent()?.analytics ?? false);
      setShowPrefs(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  const open = consent === null || reopened;
  if (consent === undefined || !open) return null;

  const decide = (analytics: boolean) => {
    writeConsent(analytics);
    setReopened(false);
    setShowPrefs(false);
  };

  return (
    <section
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 animate-toast-in sm:inset-x-auto sm:left-5 sm:w-[26rem]"
    >
      <div className="rounded-2xl border border-edge-strong bg-surface/95 p-4 shadow-panel backdrop-blur-md sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-cyber/30 bg-cyber/10 text-cyber">
            <Cookie className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-fg">Cookies &amp; your privacy</h2>
            <p className="mt-1 text-xs leading-relaxed text-fg-muted sm:text-[13px]">
              We use essential storage to run this site. With your permission we&apos;d also like to use analytics
              cookies to see which pages help visitors most. See our{" "}
              <Link href="/privacy#cookies" className="text-cyber underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {showPrefs && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-edge bg-ink/60 px-3 py-2.5">
              <div>
                <p className="text-xs font-semibold text-fg">Essential</p>
                <p className="text-[11px] text-fg-subtle">Remembers your choices. Always on.</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyber">Required</span>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-edge bg-ink/60 px-3 py-2.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyber/60">
              <div>
                <p className="text-xs font-semibold text-fg">Analytics</p>
                <p className="text-[11px] text-fg-subtle">Google Analytics: anonymous usage statistics.</p>
              </div>
              <input
                type="checkbox"
                role="switch"
                checked={analyticsDraft}
                onChange={(e) => setAnalyticsDraft(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full border transition",
                  analyticsDraft ? "border-cyber bg-cyber" : "border-edge-strong bg-surface-raised",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-[18px] rounded-full bg-fg transition-transform",
                    analyticsDraft ? "translate-x-[22px]" : "translate-x-0.5",
                  )}
                />
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {showPrefs ? (
            <>
              <button type="button" onClick={() => decide(false)} className="btn-ghost min-h-10 px-3 text-xs">
                Reject all
              </button>
              <button type="button" onClick={() => decide(analyticsDraft)} className="btn-primary min-h-10 px-3 text-xs">
                Save choices
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => decide(false)} className="btn-ghost min-h-10 px-3 text-xs">
                Decline
              </button>
              <button type="button" onClick={() => decide(true)} className="btn-primary min-h-10 px-3 text-xs">
                Accept
              </button>
            </>
          )}
        </div>
        {!showPrefs && (
          <button
            type="button"
            onClick={() => setShowPrefs(true)}
            className="mx-auto mt-2 flex min-h-9 items-center gap-1.5 text-xs text-fg-muted transition hover:text-fg"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Manage preferences
          </button>
        )}
      </div>
    </section>
  );
}
