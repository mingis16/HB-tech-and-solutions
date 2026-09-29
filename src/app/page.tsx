import type { Metadata } from "next";
import { ActivityToast } from "@/components/ActivityToast";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Sectors } from "@/components/sections/Sectors";
import { Services } from "@/components/sections/Services";
import { ADDRESS, SERVICE_TYPES, SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function StructuredData() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${url}/#business`,
    name: SITE.name,
    description: SITE.tagline,
    url,
    image: `${url}/opengraph-image`,
    telephone: `+${SITE.whatsappNumber}`,
    ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ADDRESS.street}, ${ADDRESS.area}`,
      addressLocality: ADDRESS.city,
      addressCountry: ADDRESS.countryCode,
    },
    areaServed: { "@type": "Country", name: ADDRESS.country },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SERVICE_TYPES.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <main id="main">
        <Hero />
        <Services />
        <Sectors />
        <Contact />
      </main>
      <ActivityToast />
    </>
  );
}
