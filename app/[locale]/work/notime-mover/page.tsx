import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import ComingSoonView from "@/components/sections/ComingSoonView";

export const metadata: Metadata = {
  title: "NoTime Mover — Case Study Coming Soon | Drivn.AI",
  description: "The NoTime Mover case study is still being written — check back soon.",
};

export default function NoTimeMoverComingSoonPage() {
  return (
    <>
      <Navigation />
      <ComingSoonView
        logoSrc="/case-studies/logos-tint/notimemover-cutout.png"
        logoAlt="NoTime Mover logo"
        logoAspect={785 / 265}
      />
      <Footer />
    </>
  );
}
