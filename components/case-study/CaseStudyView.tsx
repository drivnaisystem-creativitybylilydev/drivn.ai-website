"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CaseStudy } from "@/lib/case-studies";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { viewRelaxed } from "@/lib/motion-viewport";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewRelaxed,
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

type Props = { study: CaseStudy };

/**
 * Editorial case study layout: asymmetric type, stat band, thin rules — not generic card grids.
 */
export function CaseStudyView({ study }: Props) {
  const { openAuditForm } = useAuditForm();

  return (
    <article className="relative min-h-screen overflow-x-clip bg-brand-dark pt-20 text-white md:pt-24">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute -right-[20%] -top-[30%] h-[70vmin] w-[70vmin] rounded-full bg-brand-purple/[0.07] blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.35]" aria-hidden>
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover object-top opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/88" />
      </div>

      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-8">
          <Link
            href="/#work"
            className="font-inter text-xs font-medium uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white/70"
          >
            ← Results
          </Link>
          <span className="hidden font-inter text-[11px] uppercase tracking-[0.25em] text-white/35 sm:block">
            Case study
          </span>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-12 md:px-8 md:pt-16 lg:pt-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/[0.08] pb-10 md:mb-14 md:pb-12">
          <div className="max-w-3xl space-y-4">
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-purple-light">
              {study.sector}
            </p>
            <h1 className="font-sora text-4xl font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-[3.25rem]">
              {study.title}
            </h1>
            <p className="font-inter text-lg text-white/55 md:text-xl">{study.subheading}</p>
          </div>
          <p className="max-w-xs text-right font-inter text-sm leading-relaxed text-white/40">
            {study.timeline}
          </p>
        </div>

        <p className="mb-14 max-w-4xl font-sora text-xl font-medium leading-snug text-white/90 md:text-2xl md:leading-snug lg:text-[1.65rem]">
          {study.heroLine}
        </p>

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:mb-20 lg:gap-6">
          {study.stats.map((s) => (
            <div
              key={s.label}
              className="border border-white/[0.09] bg-white/[0.02] px-6 py-7 md:px-8 md:py-8"
            >
              <p className="mb-2 font-inter text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {s.label}
              </p>
              <p className="font-sora text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {s.value}
              </p>
              {s.hint ? (
                <p className="mt-2 font-inter text-sm text-white/45">{s.hint}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <motion.div {...fade} className="lg:col-span-7">
            <div className="space-y-10">
              <section>
                <h2 className="mb-4 font-inter text-[10px] font-bold uppercase tracking-[0.28em] text-brand-purple-light">
                  Context
                </h2>
                <p className="font-inter text-base leading-[1.85] text-white/78 md:text-lg">
                  {study.intro}
                </p>
              </section>
              <section>
                <h2 className="mb-4 font-inter text-[10px] font-bold uppercase tracking-[0.28em] text-brand-purple-light">
                  Challenge
                </h2>
                <p className="font-inter text-base leading-[1.85] text-white/78 md:text-lg">
                  {study.challenge}
                </p>
              </section>
              <section>
                <h2 className="mb-4 font-inter text-[10px] font-bold uppercase tracking-[0.28em] text-brand-purple-light">
                  Approach
                </h2>
                <p className="font-inter text-base leading-[1.85] text-white/78 md:text-lg">
                  {study.approach}
                </p>
              </section>
            </div>
          </motion.div>

          <aside className="lg:col-span-5">
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.08 }}
              className="sticky top-28 border-l-2 border-brand-purple/50 pl-6 md:pl-8"
            >
              <p className="mb-4 font-inter text-[10px] font-bold uppercase tracking-[0.28em] text-white/35">
                Outcome
              </p>
              <p className="font-sora text-xl font-medium leading-relaxed text-white md:text-2xl">
                {study.outcome}
              </p>
              <p className="mt-8 border-t border-white/[0.08] pt-8 font-inter text-sm italic leading-relaxed text-white/50">
                &ldquo;{study.resultSummary}&rdquo;
              </p>
            </motion.div>
          </aside>
        </div>

        <motion.footer
          {...fade}
          className="mt-20 border-t border-white/[0.08] pt-14 md:mt-24 md:pt-16"
        >
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="font-inter text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
                Next step
              </p>
              <p className="mt-2 max-w-md font-sora text-lg text-white/85">
                Want a similar outcome for your operation? Start with a short audit conversation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="button"
                size="lg"
                className="bg-violet-900 px-8 hover:bg-violet-800"
                onClick={() => openAuditForm()}
              >
                Book free audit
              </Button>
              <Link
                href="/#work"
                className="px-4 py-2 text-center font-inter text-sm text-white/55 underline-offset-4 hover:text-white/80 hover:underline"
              >
                All results
              </Link>
            </div>
          </div>
        </motion.footer>
      </div>
    </article>
  );
}
