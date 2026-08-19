import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Free Website — Apollonas Moving & Junk Removal | Drivn.AI",
  robots: { index: false, follow: false },
};

export default function ApollonasPitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
