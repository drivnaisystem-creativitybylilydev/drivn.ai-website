import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { NoTimeStorageCaseStudy } from "@/components/case-study/notime-storage/NoTimeStorageCaseStudy";

export const metadata: Metadata = {
  title: "NoTime Storage — Case study | Drivn.AI",
  description:
    "From DMs and hustle to a system that books while you sleep: 24/7 self-serve booking, unified Stripe payments, and a credible web presence for NoTime Storage.",
};

export default function NoTimeStorageCaseStudyPage() {
  return (
    <>
      <Navigation />
      <NoTimeStorageCaseStudy />
      <Footer />
    </>
  );
}
