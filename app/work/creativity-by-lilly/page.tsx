import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { CreativityByLilyCaseStudy } from "@/components/case-study/creativity-by-lilly/CreativityByLilyCaseStudy";

export const metadata: Metadata = {
  title: "Creativity by Lily — Case study | Drivn.AI",
  description:
    "From Etsy fees and manual admin to full ownership: custom e-commerce for Creativity by Lily Co. Handmade jewelry, Square, Supabase, Vercel.",
};

export default function CreativityByLillyCaseStudyPage() {
  return (
    <>
      <Navigation />
      <CreativityByLilyCaseStudy />
      <Footer />
    </>
  );
}
