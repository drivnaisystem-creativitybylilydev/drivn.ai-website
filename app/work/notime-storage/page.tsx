import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import { getCaseStudyBySlug } from "@/lib/case-studies";

export async function generateMetadata(): Promise<Metadata> {
  const study = getCaseStudyBySlug("notime-storage");
  if (!study) return { title: "Case study | Drivn.AI" };
  return {
    title: `${study.title} — Case study | Drivn.AI`,
    description: study.heroLine,
  };
}

export default function NoTimeStorageCaseStudyPage() {
  const study = getCaseStudyBySlug("notime-storage");
  if (!study) notFound();

  return (
    <>
      <Navigation />
      <CaseStudyView study={study} />
      <Footer />
    </>
  );
}
