import type { Metadata } from "next";
import { Sora, Inter, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import logoNobg from "./logo-nobg.png";

// Sora/Inter stay loaded for /admin, case studies, and /services/websites (untouched this round).
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Homepage rebuild 2026-07-17 — see PRODUCT.md/DESIGN.md. Additive, not a replacement.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Contrasting expressive face for single-word emphasis moments (mixed-typography technique) — used sparingly, never for full headlines/body.
const accentFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drivn.AI — The AI Growth Partner for Service Businesses",
  description:
    "Capture more leads, respond in under 60 seconds, book more appointments, and automate the admin. AI-powered growth systems for service businesses.",
  metadataBase: new URL("https://drivn-ai-website.vercel.app"),
  openGraph: {
    title: "Drivn.AI — The AI Growth Partner for Service Businesses",
    description:
      "Capture more leads, respond in under 60 seconds, book more appointments, and automate the admin. AI-powered growth systems for service businesses.",
    url: "https://drivn-ai-website.vercel.app",
    siteName: "Drivn.AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drivn.AI — The AI Growth Partner for Service Businesses",
    description:
      "Capture more leads, respond in under 60 seconds, book more appointments, and automate the admin.",
  },
  icons: {
    icon: [{ url: logoNobg.src, type: "image/png" }],
    apple: logoNobg.src,
    shortcut: logoNobg.src,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // next-intl middleware sets this header so we can reflect the correct lang attribute
  const locale = (await headers()).get("x-next-intl-locale") ?? "en";

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable} ${geist.variable} ${geistMono.variable} ${accentFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
