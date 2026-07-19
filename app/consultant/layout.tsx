import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consultant OS — Drivn.AI",
  robots: { index: false },
};

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
