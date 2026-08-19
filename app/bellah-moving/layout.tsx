import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website + Speed-to-Lead + Marketing — Bellah Moving | Drivn.AI",
  robots: { index: false, follow: false },
};

export default function BellahMovingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
