import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import WorkIndex from "@/components/sections/WorkIndex";

export const metadata: Metadata = {
  title: "Our Work — Drivn.AI",
  description: "Real businesses, real systems, real results — case studies from Drivn.AI's client work.",
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <WorkIndex />
      <Footer />
    </>
  );
}
