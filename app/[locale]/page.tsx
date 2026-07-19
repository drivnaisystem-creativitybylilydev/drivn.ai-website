"use client";

import Navigation from "@/components/Navigation";
import Ticker from "@/components/Ticker";
import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustOwnership from "@/components/sections/TrustOwnership";
import IndustriesWeServe from "@/components/sections/IndustriesWeServe";
import CaseStudies from "@/components/sections/CaseStudies";
import HomeFAQ from "@/components/sections/HomeFAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default function Home() {
  return (
    <div style={{ background: "var(--color-mono-bg)" }}>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <Ticker />
      <Navigation />
      <Hero />
      <ProblemStatement />
      <Services />
      <HowItWorks />
      <TrustOwnership />
      <IndustriesWeServe />
      <CaseStudies />
      <HomeFAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
