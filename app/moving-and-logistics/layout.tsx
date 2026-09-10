import type { Metadata } from "next";

const TITLE = "Growth System for Moving & Logistics Companies | Drivn.AI";
const DESCRIPTION =
  "One system for movers: a booking-ready website, instant auto-quoting, speed-to-lead follow-up, Google Business Profile, and local SEO — with an operating-system dashboard tying it together.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/moving-and-logistics" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/moving-and-logistics",
    siteName: "Drivn.AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function MovingAndLogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
