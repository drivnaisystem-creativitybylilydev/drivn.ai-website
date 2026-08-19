import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed-to-Lead + Quoting — Sheridan Movers | Drivn.AI",
  robots: { index: false, follow: false },
};

export default function SheridanMoversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
