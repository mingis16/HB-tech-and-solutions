import type { Metadata } from "next";
import Link from "next/link";
import { LegalContact, LegalPage, type LegalSection } from "@/components/LegalPage";
import { ADDRESS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms for using the HB Tech Solutions website, submitting inquiries, booking discovery calls and engaging our software, cybersecurity and automation services.",
  alternates: { canonical: "/terms" },
  openGraph: { title: "Terms & Conditions | HB Tech Solutions", url: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    content: (
      <>
        <p>
          These terms govern your use of this website, operated by <strong>{SITE.name}</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;) from {ADDRESS.street}, {ADDRESS.area}, {ADDRESS.city},{" "}
          {ADDRESS.country}. By using the website, submitting an inquiry or booking a call, you agree to them. If you
          don&apos;t agree, please don&apos;t use the website.
        </p>
        <p>
          Our <Link href="/privacy">Privacy Policy</Link> explains how we handle personal data and forms part of these
          terms.
        </p>
      </>
    ),
  },
  {
    id: "using-the-site",
    title: "Using this website",
    content: (
      <>
        <p>You may use this website for lawful purposes only. You must not:</p>
        <ul>
          <li>
            probe, scan or test the vulnerability of this website or our systems, or attempt to breach its security or
            authentication, without our prior written permission;
          </li>
          <li>send spam, bulk or automated submissions, or content that is false, misleading or unlawful;</li>
          <li>upload or transmit malware or any code designed to disrupt, damage or gain unauthorised access;</li>
          <li>impersonate anyone, or submit someone else&apos;s personal data without their permission;</li>
          <li>scrape or copy the website in a way that places an unreasonable load on it.</li>
        </ul>
        <p>We may block access or remove submissions that break these rules.</p>
      </>
    ),
  },
  {
    id: "inquiries-quotes",
    title: "Inquiries, quotes and proposals",
    content: (
      <ul>
        <li>Submitting an inquiry does not create a contract or oblige either of us to proceed.</li>
        <li>
          The priority you select helps us triage requests but is not a guaranteed response time unless agreed in
          writing.
        </li>
        <li>
          Quotes and proposals are estimates based on the information you provide. They are valid for 30 days unless
          stated otherwise and may change if the scope changes.
        </li>
        <li>An engagement starts only when both parties sign a proposal, statement of work or contract.</li>
      </ul>
    ),
  },
  {
    id: "consultations",
    title: "Discovery calls",
    content: (
      <ul>
        <li>Discovery calls last up to 30 minutes and are for discussing your needs; they are not professional advice.</li>
        <li>
          A booking is a request until we confirm it. We may need to reschedule or decline a booking, and will tell you
          if we do.
        </li>
        <li>
          If you can&apos;t make it, please let us know at least 24 hours in advance via WhatsApp
          {SITE.contactEmail ? " or email" : ""} so we can offer the slot to someone else.
        </li>
      </ul>
    ),
  },
  {
    id: "security-testing",
    title: "Security testing: authorised work only",
    content: (
      <>
        <p>
          We carry out penetration testing, vulnerability assessments and other security testing{" "}
          <strong>only</strong> on systems that you own or are legally authorised to have tested, and only under a
          signed written agreement that defines the scope, timing, methods and rules of engagement.
        </p>
        <ul>
          <li>You must confirm in writing that you have authority to approve testing of every in-scope system.</li>
          <li>
            You are responsible for any third-party permissions required, for example from hosting, cloud or managed
            service providers.
          </li>
          <li>We will not test systems, networks or people outside the agreed scope.</li>
          <li>Findings are confidential and shared only with the contacts you nominate.</li>
        </ul>
      </>
    ),
  },
  {
    id: "services",
    title: "Services, fees and payment",
    content: (
      <p>
        Fees, payment terms, deliverables, timelines, warranties and ownership of work for any paid engagement are set
        out in the signed proposal or contract for that engagement. If those documents conflict with these terms, the
        signed documents take priority.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <p>
        The content of this website, including text, graphics, logos and code, belongs to {SITE.name} or its
        licensors. You may view and share pages for personal or internal business purposes, but you may not copy,
        modify or republish our content for commercial purposes without our written permission. Ownership of work we
        produce for clients is governed by the relevant contract.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party links and services",
    content: (
      <p>
        This website links to services we don&apos;t control, such as WhatsApp, Google Maps and Google Calendar. We
        are not responsible for their content, availability or privacy practices. Your use of them is governed by
        their own terms.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: (
      <p>
        Information on this website is general and provided &ldquo;as is&rdquo;. It isn&apos;t tailored advice for
        your situation until we are engaged under a written agreement. We work to keep the website accurate, available
        and secure, but we don&apos;t guarantee it will always be error-free or uninterrupted.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect or consequential loss, or for any
          loss of profit, revenue, data or business opportunity, arising from your use of this website.
        </p>
        <p>
          Nothing in these terms limits or excludes liability that cannot be limited or excluded by law. Liability for
          paid services is governed by the relevant contract.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Your responsibility",
    content: (
      <p>
        You agree to compensate us for reasonable losses and costs we incur as a result of your breach of these terms,
        including any security testing requested without proper authorisation.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms from time to time. The &ldquo;last updated&rdquo; date at the top shows when they
        last changed. Continuing to use the website after an update means you accept the new terms.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    content: (
      <p>
        These terms are governed by the laws of {ADDRESS.country}, and the courts of {ADDRESS.country} have exclusive
        jurisdiction over any dispute arising from them, unless the law of your country requires otherwise.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <>
        <p>Questions about these terms? Get in touch:</p>
        <LegalContact />
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      slug="terms"
      title="Terms & Conditions"
      intro={
        <p>
          The ground rules for using this website, sending us inquiries, booking discovery calls and engaging our
          services.
        </p>
      }
      sections={sections}
    />
  );
}
