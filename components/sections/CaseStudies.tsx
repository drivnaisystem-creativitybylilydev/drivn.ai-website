"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { viewRelaxed } from "@/lib/motion-viewport";

const caseStudies = [
  {
    title: "NoTime Storage",
    subheading: "College Move-In Service",
    intro:
      "They came to us with a problem: growth was chaos. We solved it. The details of how stay between us and our clients — but the outcome speaks for itself.",
    bulletsIntro: null,
    bullets: [] as string[],
    result:
      "50 → 200+ bookings per semester. No additional staff.",
  },
  {
    title: "Creativity by Lilly Co",
    subheading: "Jewellery & E-commerce",
    intro:
      "Limited to pop-ups and marketplaces that took a cut of every sale. She needed a different path. We built one. She runs it. The business scales.",
    bulletsIntro: null,
    bullets: [] as string[],
    result:
      "Margins reclaimed. Workflow streamlined. Zero platform fees on direct sales.",
  },
];

export default function CaseStudies() {
  return (
    <section id="work" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          className="text-3xl md:text-4xl font-sora font-semibold text-center mb-12 md:mb-16"
        >
          Results That Matter
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {caseStudies.map((study) => (
            <div key={study.title}>
              <Card className="h-full min-h-[280px] hover:border-brand-purple/50 transition-all duration-300 border-l-4 border-l-brand-purple">
                <CardHeader>
                  <h3 className="text-xl font-sora font-semibold">
                    {study.title}
                  </h3>
                  <p className="text-sm text-brand-purple-light">
                    {study.subheading}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 leading-[1.7]">
                  <p className="text-white/80">{study.intro}</p>
                  {study.bulletsIntro && (
                    <p className="text-white/90 font-medium">
                      {study.bulletsIntro}
                    </p>
                  )}
                  {study.bullets.length > 0 && (
                    <ul className="space-y-2 text-white/80">
                      {study.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="text-brand-purple">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-white/90 font-medium pt-2">
                    {study.result}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
