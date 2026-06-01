"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import CoreOffer from "@/components/sections/CoreOffer";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import IndustriesWeServe from "@/components/sections/IndustriesWeServe";
import CaseStudies from "@/components/sections/CaseStudies";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CursorTrailer } from "@/components/ui/CursorTrailer";

export default function Home() {
  return (
    <>
      {/* Grain overlay — fixed, pointer-events-none */}
      <div className="grain-overlay" aria-hidden />

      {/* Global UI chrome */}
      <ScrollProgress />
      <CursorTrailer />

      <Navigation />
      <Hero />
      <ProblemStatement />
      <CoreOffer />
      <Services />
      <HowItWorks />
      <IndustriesWeServe />
      <CaseStudies />
      <FinalCTA />
      <Footer />
    </>
  );
}
