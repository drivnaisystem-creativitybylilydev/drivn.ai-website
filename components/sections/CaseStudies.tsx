"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { viewRelaxed } from "@/lib/motion-viewport";
import { caseStudies } from "@/lib/case-studies";

const SPRING = [0.32, 0.72, 0, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: SPRING },
  },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export default function CaseStudies() {
  return (
    <section id="work" className="relative py-14 md:py-20 overflow-hidden">
      {/* Light surface wash */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-brand-dark) 0%, rgba(15,18,32,0.60) 50%, var(--color-brand-dark) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 28, height: 1, background: "rgba(139,92,246,0.55)", borderRadius: 1 }} />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.20em]"
              style={{ color: "rgba(139,92,246,0.60)" }}
            >
              Proof
            </span>
          </div>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[540px] text-balance text-white">
            Real businesses. Real results.
          </h2>
          <p
            className="mt-3 text-[16px] max-w-[480px] leading-relaxed"
            style={{ color: "rgba(239,240,243,0.78)" }}
          >
            We don&apos;t just build systems — we measure what happens after.
          </p>
        </motion.div>

        {/* Case study cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewRelaxed}
        >
          {caseStudies.map((study) => (
            <motion.div key={study.slug} variants={cardVariants} className="h-full">
              <Link
                href={`/work/${study.slug}`}
                className="group block h-full rounded-2xl overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
              >
                <div
                  className="h-full flex flex-col p-7 rounded-2xl transition-all duration-300"
                  style={{
                    background: "rgba(20,26,46,0.96)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(139,92,246,0.28)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(255,255,255,0.10)";
                  }}
                >
                  {/* Logo + arrow */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative h-14 w-28">
                      <Image
                        src={study.cardLogoSrc}
                        alt={study.cardLogoAlt}
                        fill
                        className="object-contain object-left"
                        sizes="112px"
                      />
                    </div>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-brand-purple/20 group-hover:text-brand-purple-light"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(239,240,243,0.35)",
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                    </span>
                  </div>

                  {/* Title + subheading */}
                  <div className="mb-4">
                    <h3 className="font-sora text-[18px] font-semibold text-white mb-1 group-hover:text-brand-purple-light transition-colors duration-200">
                      {study.title}
                    </h3>
                    <p
                      className="text-[13px] capitalize font-medium"
                      style={{ color: "rgba(139,92,246,0.80)" }}
                    >
                      {study.subheading}
                    </p>
                  </div>

                  {/* Result lines */}
                  <div
                    className="flex flex-col gap-2 pt-4 mt-auto border-t"
                    style={{ borderColor: "rgba(255,255,255,0.10)" }}
                  >
                    {study.cardResultLines.map((line, i) => (
                      <p
                        key={`${study.slug}-${i}`}
                        className="text-[14px] font-semibold text-white leading-snug"
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  <span
                    className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-widest transition-colors duration-200"
                    style={{ color: "rgba(167,139,250,0.65)" }}
                  >
                    Read case study
                    <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
