import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed-to-Lead + Automated Quoting — Allset Moving | Drivn.AI",
  robots: { index: false, follow: false },
};

export default function AllsetMovingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
