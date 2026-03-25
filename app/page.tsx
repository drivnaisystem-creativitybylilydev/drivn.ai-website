"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import IndustriesWeServe from "@/components/sections/IndustriesWeServe";
import CaseStudies from "@/components/sections/CaseStudies";
import WhyDrivn from "@/components/sections/WhyDrivn";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <ProblemStatement />
      <Services />
      <HowItWorks />
      <IndustriesWeServe />
      <CaseStudies />
      <WhyDrivn />
      <FinalCTA />
      <Footer />
    </>
  );
}
