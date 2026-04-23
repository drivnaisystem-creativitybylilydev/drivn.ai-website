import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import NoTimeQuestionnaireForm from "@/components/case-study/notime-storage/NoTimeQuestionnaireForm";

export const metadata: Metadata = {
  title: "NoTime Storage — Case study questionnaire | Drivn.AI",
  description:
    "Client interview form for the NoTime Storage case study. Your answers help document outcomes and shape the public story.",
  robots: { index: false, follow: false },
};

export default function NoTimeStorageQuestionnairePage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-brand-purple-light mb-3">
            Confidential · NoTime Storage
          </p>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-white mb-4">
            Case study questionnaire
          </h1>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl">
            This form mirrors the interview script we use for testimonials and
            case studies. Submit once you&apos;re done — your responses are
            delivered securely to Finn at Drivn.AI.
          </p>
          <NoTimeQuestionnaireForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
