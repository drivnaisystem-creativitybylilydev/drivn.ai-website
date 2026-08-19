import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Website Demo — Apollonas Moving & Junk Removal | Drivn.AI",
  robots: { index: false, follow: false },
};

export default function ApollonasMovingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
