import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { UIProvider } from "@/components/UIProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const DEFAULT_TITLE = "HB Tech Solutions | Web, Cybersecurity & AI Automation in Freetown";
const DEFAULT_DESCRIPTION =
  "HB Tech Solutions builds fast websites and apps, runs penetration tests and cybersecurity audits, and sets up AI and business automation for organisations in Sierra Leone and beyond.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: DEFAULT_TITLE, template: `%s | ${SITE.name}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "technology",
  keywords: [
    "web development Sierra Leone",
    "app development Freetown",
    "penetration testing",
    "cybersecurity Sierra Leone",
    "AI automation",
    "business automation",
    "digital marketing",
    "HB Tech Solutions",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  // Phone numbers are linked explicitly; stop iOS from auto-styling others.
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyber focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-deep"
        >
          Skip to content
        </a>
        <UIProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
        </UIProvider>
        <Analytics />
      </body>
    </html>
  );
}
