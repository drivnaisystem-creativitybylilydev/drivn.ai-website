"use client";

import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";
import {
  Search,
  LayoutTemplate,
  Wrench,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Consultation",
    description:
      "We understand your workflows, bottlenecks, and goals — then identify key opportunities to capture revenue.",
    Icon: Search,
  },
  {
    number: 2,
    title: "Solution Design",
    description:
      "We map out a custom revenue system tailored to your business, tools, and operations.",
    Icon: LayoutTemplate,
  },
  {
    number: 3,
    title: "Implementation",
    description:
      "We build and deploy your systems using your existing platforms and workflows.",
    Icon: Wrench,
  },
  {
    number: 4,
    title: "Optimization",
    description:
      "We test, monitor, and iterate — ensuring more booked jobs, more revenue, and long-term value.",
    Icon: TrendingUp,
  },
];

const staggerDelay = 0.3;

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 pt-12 pb-16 md:scroll-mt-24 md:pt-16 md:pb-24"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Bridge from Industries — intro sits in How It Works, uses full section width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-6xl text-center md:mb-20 lg:mb-24"
        >
          <div className="relative mx-auto mb-8 inline-flex md:mb-10">
            <div className="absolute inset-0 scale-150 rounded-full bg-brand-purple/25 blur-xl" />
            <div className="relative rounded-2xl border border-brand-purple/35 bg-brand-purple/10 p-4 backdrop-blur-sm md:p-5">
              <Sparkles className="h-10 w-10 text-brand-purple-light md:h-12 md:w-12 lg:h-14 lg:w-14" />
            </div>
          </div>
          <p className="mx-auto w-full max-w-5xl px-2 font-sora text-2xl font-semibold leading-snug text-white md:text-3xl md:leading-snug lg:text-4xl lg:leading-tight xl:text-5xl">
            Each engagement is tailored. We don&apos;t do templates.
          </p>
          <a
            href="#how-it-works-steps"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-2 py-2 font-sora text-base font-semibold text-brand-purple-light transition-colors hover:text-brand-purple-light/85 active:scale-[0.98] md:mt-10 md:text-lg lg:text-xl"
          >
            See how it works
            <span className="text-xl md:text-2xl" aria-hidden>
              ↓
            </span>
          </a>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-sora font-semibold text-center text-white mb-16 md:mb-20"
        >
          How It Works
        </motion.h2>

        <div
          id="how-it-works-steps"
          className="relative mx-auto max-w-3xl scroll-mt-28"
        >
          {/* Vertical connecting line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewRelaxed}
            transition={{ duration: 1, ease: "easeOut", delay: staggerDelay }}
            className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-purple via-brand-purple-light to-brand-purple origin-top"
          />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewRelaxed}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: staggerDelay + i * staggerDelay,
                }}
                className="relative flex gap-6 md:gap-8 pl-14 md:pl-16"
              >
                {/* Numbered circle - left of line */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={viewRelaxed}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    delay: staggerDelay + i * staggerDelay,
                  }}
                  className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm md:text-base z-10 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
                >
                  {step.number}
                </motion.div>

                {/* Content - right of line */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-brand-purple/20 border border-brand-purple/30">
                      <step.Icon className="h-5 w-5 text-brand-purple-light" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-sora font-bold text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
