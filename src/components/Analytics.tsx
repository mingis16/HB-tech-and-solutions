"use client";

import { useEffect } from "react";
import Script from "next/script";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/constants";
import { useConsent } from "@/lib/consent";

/** Deletes Google Analytics cookies after consent is withdrawn. */
function clearGaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^_ga/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/**
 * Google Analytics 4, loaded only after the visitor accepts analytics cookies.
 * Also tracks CTA and WhatsApp clicks via delegated `data-track` attributes.
 */
export function Analytics() {
  const consent = useConsent();
  const granted = Boolean(SITE.gaId) && consent?.analytics === true;

  useEffect(() => {
    if (consent?.analytics === false && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
      clearGaCookies();
    }
  }, [consent]);

  // <a data-track="cta_click" data-track-location="hero"> and every wa.me link.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-track], a[href*='wa.me/']");
      if (!el) return;
      const name = el.dataset.track || "whatsapp_click";
      const location = el.dataset.trackLocation || el.closest("section[id]")?.id || "page";
      track(name, { location, page: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!granted) return null;

  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${SITE.gaId}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`} strategy="afterInteractive" />
    </>
  );
}
