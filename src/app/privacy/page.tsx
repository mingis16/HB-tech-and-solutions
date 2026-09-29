import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalPage, type LegalSection } from "@/components/LegalPage";
import { ADDRESS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How HB Tech Solutions collects, uses and protects personal data from inquiries, consultation bookings, cookies and analytics, and how to exercise your privacy rights.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | HB Tech Solutions", url: "/privacy" },
};

const COOKIES = [
  {
    name: "hb-consent-v1",
    kind: "Local storage · essential",
    purpose: "Remembers your cookie choices so we don't ask on every visit.",
    duration: "Until you change your choice or clear your browser storage",
  },
  {
    name: "hb-activity-dismissed",
    kind: "Session storage · essential",
    purpose: "Remembers that you closed the on-site activity notifications.",
    duration: "Until you close the browser tab",
  },
  {
    name: "_ga, _ga_<ID>",
    kind: "Cookie · analytics (optional)",
    purpose: "Google Analytics: distinguishes visitors and sessions to produce usage statistics.",
    duration: "Up to 2 years. Only set if you accept analytics cookies",
  },
];

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          This website is operated by <strong>{SITE.name}</strong>, a software engineering, cybersecurity and
          automation company based at {ADDRESS.street}, {ADDRESS.area}, {ADDRESS.city}, {ADDRESS.country}. We
          decide how and why the personal data described in this policy is processed, so we are its
          &ldquo;controller&rdquo;.
        </p>
        <p>
          This policy explains what we collect when you use this website, contact us or book a consultation, why we
          collect it, and the choices and rights you have.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    content: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Service &amp; inquiry form:</strong> your name, email address, company, phone number, the service
            you&apos;re interested in, your industry, the priority you select, and the title and description of your
            request.
          </li>
          <li>
            <strong>Consultation bookings:</strong> your name, email address, phone number, company, preferred topic,
            any notes you add, and the date and time you choose.
          </li>
          <li>
            <strong>WhatsApp and email:</strong> anything you send us directly. WhatsApp messages are also handled by
            WhatsApp (Meta) under its own terms and privacy policy.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Technical data with submissions:</strong> your browser&apos;s user-agent string and a salted,
            one-way hash of your IP address. We use the hash only to detect spam and abuse (for example, limiting
            how many requests can be sent per hour). We do not store your raw IP address with your submission.
          </li>
          <li>
            <strong>Server logs:</strong> our hosting provider automatically records standard request data (such as IP
            address, time and page requested) to keep the site secure and running.
          </li>
          <li>
            <strong>Analytics (only with your consent):</strong> if you accept analytics cookies, Google Analytics
            collects information such as the pages you visit, how you arrived, your device and browser type, your
            approximate location (country or city), and actions such as submitting a form or opening WhatsApp. We never
            send your name, email or phone number to Google Analytics.
          </li>
          <li>
            <strong>Bot protection:</strong> if enabled, Cloudflare Turnstile processes technical signals from your
            browser to tell people and automated bots apart when you submit a form.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    content: (
      <ul>
        <li>To respond to your inquiry, answer questions and prepare proposals or quotes.</li>
        <li>To schedule, confirm, reschedule and hold consultation calls.</li>
        <li>To deliver services you engage us for, under a separate written agreement.</li>
        <li>To protect this website and our users from spam, fraud, abuse and security threats.</li>
        <li>To understand how the website is used and improve it (analytics, only with your consent).</li>
        <li>To meet legal, accounting and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    id: "legal-bases",
    title: "Why we're allowed to use it",
    content: (
      <>
        <p>Where data protection law requires a legal basis, we rely on:</p>
        <ul>
          <li>
            <strong>Steps before a contract / performance of a contract:</strong> handling your inquiry or booking and
            providing services you request.
          </li>
          <li>
            <strong>Legitimate interests:</strong> keeping the site secure, preventing spam and abuse, and running our
            business, balanced against your rights.
          </li>
          <li>
            <strong>Consent:</strong> analytics cookies. You can withdraw consent at any time.
          </li>
          <li>
            <strong>Legal obligation:</strong> where the law requires us to keep or disclose information.
          </li>
        </ul>
        <p>We do not sell your personal data, and we do not use it for automated decisions that have legal effects on you.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    content: (
      <>
        <p>
          We use a small amount of essential browser storage to make the site work, and optional analytics cookies
          only if you accept them in our cookie banner. You can change your choice at any time using{" "}
          <strong>Cookie settings</strong> in the website footer.
        </p>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Purpose</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((cookie) => (
                <tr key={cookie.name}>
                  <td className="font-mono text-xs text-fg">{cookie.name}</td>
                  <td>{cookie.kind}</td>
                  <td>{cookie.purpose}</td>
                  <td>{cookie.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          If you decline or later withdraw consent, Google Analytics is not loaded (or is switched off) and its cookies
          are removed. Most browsers also let you block or delete cookies through their settings.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    content: (
      <>
        <p>We share personal data only with service providers that help us run this website and our business:</p>
        <ul>
          <li>
            <strong>Supabase</strong>: secure database hosting for inquiries and bookings.
          </li>
          <li>
            <strong>Our website hosting provider</strong>: serves the site and keeps standard server logs.
          </li>
          <li>
            <strong>Google</strong>: Google Analytics, only if you consent.
          </li>
          <li>
            <strong>Cloudflare</strong>: Turnstile bot protection, when enabled.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong>: only when you choose to contact us on WhatsApp.
          </li>
        </ul>
        <p>
          We may also disclose information to professional advisers, or where required by law, court order or a
          government authority, and to a successor if our business is reorganised or sold.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    content: (
      <p>
        Some of our service providers store or process data outside {ADDRESS.country}. When that happens we use
        reputable providers that apply appropriate safeguards, such as encryption in transit and at rest and
        contractual data protection commitments.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <ul>
        <li>
          <strong>Inquiries and bookings:</strong> up to 24 months after our last contact with you, unless you become a
          client, in which case we keep records for as long as the engagement and our legal, tax and accounting
          obligations require.
        </li>
        <li>
          <strong>Hashed IP data:</strong> deleted together with the submission it belongs to.
        </li>
        <li>
          <strong>Analytics data:</strong> no longer than 14 months, the maximum retention period we configure in
          Google Analytics.
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    content: (
      <p>
        Security is our business. Data is encrypted in transit (HTTPS), our database is locked down so it can&apos;t be
        read or written from the public internet, access is restricted to the people who need it, and forms are
        protected against automated abuse. No system is perfectly secure, but we work hard to protect your
        information and will act promptly if an incident occurs.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>ask for a copy of the personal data we hold about you;</li>
          <li>ask us to correct inaccurate or incomplete data;</li>
          <li>ask us to delete your data;</li>
          <li>object to, or ask us to restrict, how we use your data;</li>
          <li>receive your data in a portable format;</li>
          <li>withdraw consent at any time, without affecting earlier processing.</li>
        </ul>
        <p>
          To make a request, contact us using the details below. We&apos;ll respond within 30 days and may need to
          verify your identity first. You can also complain to your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        This website and our services are intended for businesses and adults. We do not knowingly collect personal
        data from anyone under 18. If you believe a child has sent us information, please contact us and we&apos;ll
        delete it.
      </p>
    ),
  },
  {
    id: "client-engagements",
    title: "Client engagements & security testing",
    content: (
      <p>
        This policy covers our website. Personal data we access while delivering services, for example during
        authorised penetration testing or system work for a client, is handled under that client&apos;s contract and
        confidentiality terms. See our <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top shows when it last
        changed. Significant changes will be highlighted on this website.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>Questions about this policy or your personal data? Get in touch:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      slug="privacy"
      title="Privacy Policy"
      intro={
        <p>
          We collect only what we need to answer your request, run our consultations and keep this site secure. We
          never sell your data.
        </p>
      }
      sections={sections}
    />
  );
}
