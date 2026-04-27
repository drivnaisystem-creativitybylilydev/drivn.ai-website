"use client";

import Image from "next/image";
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
          Some of our past work
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/work/${study.slug}`}
              className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-light focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <Card className="h-full min-h-[260px] border border-white/10 bg-white/[0.02] text-center transition-all duration-300 hover:border-brand-purple/40 hover:bg-white/[0.04]">
                <CardHeader className="space-y-4 pb-2">
                  <div className="relative mx-auto aspect-square h-36 w-36 shrink-0 md:h-40 md:w-40">
                    <Image
                      src={study.cardLogoSrc}
                      alt={study.cardLogoAlt}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 768px) 144px, 160px"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-sora font-semibold group-hover:text-brand-purple-light transition-colors">
                      {study.title}
                    </h3>
                    <p className="mt-1 text-sm capitalize text-brand-purple-light">
                      {study.subheading}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-0 leading-[1.7]">
                  <div className="space-y-2">
                    {study.cardResultLines.map((line, i) => (
                      <p
                        key={`${study.slug}-${i}`}
                        className="block text-sm font-bold text-white md:text-base"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <span className="inline-block font-inter text-xs font-semibold uppercase tracking-wider text-brand-purple-light group-hover:text-brand-purple-light/90">
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
