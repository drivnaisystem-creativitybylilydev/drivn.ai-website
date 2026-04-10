"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { viewRelaxed } from "@/lib/motion-viewport";
import { caseStudies } from "@/lib/case-studies";

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
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <Card className="h-full min-h-[280px] border-l-4 border-l-brand-purple transition-all duration-300 group-hover:border-brand-purple/50">
                <CardHeader>
                  <h3 className="text-xl font-sora font-semibold group-hover:text-brand-purple-light transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm capitalize text-brand-purple-light">
                    {study.subheading}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 leading-[1.7]">
                  <p className="text-white/80">{study.intro}</p>
                  <p className="pt-2 font-medium text-white/90">
                    {study.resultSummary}
                  </p>
                  <span className="inline-block font-inter text-xs font-semibold uppercase tracking-wider text-white/45 group-hover:text-white/70">
                    Read case study →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
