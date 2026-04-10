import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";
import { getAllCaseStudySlugs, getCaseStudyBySlug } from "@/lib/case-studies";
import { isDedicatedCaseStudySlug } from "@/lib/case-study-routes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCaseStudySlugs()
    .filter((slug) => !isDedicatedCaseStudySlug(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study" };
  return {
    title: `${study.title} — Drivn.AI`,
    description: study.heroLine,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  if (isDedicatedCaseStudySlug(slug)) notFound();
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <>
      <Navigation />
      <CaseStudyView study={study} />
      <Footer />
    </>
  );
}
