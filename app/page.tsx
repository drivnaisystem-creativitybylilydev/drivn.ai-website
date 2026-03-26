"use client";

import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import ProblemStatement from "@/components/sections/ProblemStatement";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import IndustriesWeServe from "@/components/sections/IndustriesWeServe";
import TechIntegrations from "@/components/sections/TechIntegrations";
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
      <IndustriesWeServe />
      <HowItWorks />
      <TechIntegrations />
      <CaseStudies />
      <WhyDrivn />
      <FinalCTA />
      <Footer />
    </>
  );
}
