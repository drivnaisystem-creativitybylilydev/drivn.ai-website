import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "NoTime Storage — Case study | Drivn.AI",
  description:
    "Full case study for NoTime Storage is coming soon. Seasonal storage and college move-in booking systems.",
};

export default function NoTimeStorageCaseStudyPage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-[70vh] px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-purple-light mb-4">
            NoTime Storage
          </p>
          <h1 className="font-sora text-3xl font-semibold text-white sm:text-4xl mb-4">
            Full case study coming soon
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-10">
            We&apos;re finishing a detailed write-up of this engagement. The overview
            on our homepage reflects real outcomes; the full story, stack, and
            process will live here when it&apos;s ready.
          </p>
          <Button asChild variant="default" size="lg" className="rounded-[20px]">
            <Link href="/#work">Back to past work</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
