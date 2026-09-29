import { useMemo, useSyncExternalStore } from "react";

// Cookie consent lives in localStorage and is shared through a tiny store so
// the banner, the analytics loader and the activity toast stay in sync.

export type Consent = { analytics: boolean; decidedAt: string; version: 1 };

const STORAGE_KEY = "hb-consent-v1";
const CHANGE_EVENT = "hb:consent-change";
export const OPEN_SETTINGS_EVENT = "hb:open-cookie-settings";

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent>;
    return typeof value.analytics === "boolean" && value.version === 1 ? (value as Consent) : null;
  } catch {
    return null;
  }
}

export function readConsent(): Consent | null {
  return parse(readRaw());
}

export function writeConsent(analytics: boolean) {
  const value: Consent = { analytics, decidedAt: new Date().toISOString(), version: 1 };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * undefined = not known yet (server render / before hydration),
 * null = visitor hasn't chosen, otherwise their stored choice.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined);
  return useMemo(() => (raw === undefined ? undefined : parse(raw)), [raw]);
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
