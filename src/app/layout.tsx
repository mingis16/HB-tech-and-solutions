import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "HB Tech Solutions | Software Engineering, Cybersecurity & AI Automation",
    template: "%s | HB Tech Solutions",
  },
  description:
    "HB Tech Solutions builds high-performance web and mobile software, secures it with penetration testing and cybersecurity services, and automates operations with AI workflows.",
  keywords: [
    "web development",
    "app development",
    "penetration testing",
    "cybersecurity",
    "AI automation",
    "business automation",
    "digital marketing",
  ],
  openGraph: {
    title: "HB Tech Solutions",
    description: "Elite software engineering, cybersecurity & AI automation.",
    type: "website",
    siteName: "HB Tech Solutions",
  },
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
