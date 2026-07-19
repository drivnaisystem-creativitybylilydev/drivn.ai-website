"use client";

import { motion } from "framer-motion";
import { MagnifyingGlass, ChatCircleText, Wrench, TestTube, RocketLaunch, ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;
const ICONS = [MagnifyingGlass, ChatCircleText, Wrench, TestTube, RocketLaunch, ArrowsClockwise];

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = t.raw("steps") as Array<{ title: string; subtitle: string; description: string }>;

  return (
    <section id="process" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewRelaxed} transition={{ duration: 0.5 }}>
          <ChapterLabel title="The Process" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: SPRING }}
          className="font-display max-w-2xl text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white mb-20 md:mb-24 text-balance"
        >
          {t("headline")}
        </motion.h2>

        {/* Vertical numbered timeline — 6 steps, connected by a continuous line */}
        <div className="relative">
          <div
            className="absolute left-[27px] top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(180deg, rgba(124,77,255,0.55), rgba(124,77,255,0.08))" }}
            aria-hidden
          />

          {steps.map((step, i) => {
            const Icon = ICONS[i];
            const isLast = i === steps.length - 1;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewRelaxed}
                transition={{ duration: 0.6, ease: SPRING, delay: i * 0.08 }}
                className={`relative flex gap-6 md:gap-10 pl-0 ${isLast ? "" : "pb-12 md:pb-14"}`}
              >
                {/* Marker */}
                <div
                  className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "var(--color-mono-bg)",
                    border: "1px solid rgba(124,77,255,0.45)",
                    boxShadow: "0 0 24px rgba(124,77,255,0.18), inset 0 1px 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <Icon size={22} weight="light" color="var(--color-accent-light)" />
                </div>

                {/* Content */}
                <div className="pt-1 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[12px] uppercase tracking-[0.14em]" style={{ color: "rgba(245,245,244,0.35)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[22px] md:text-[26px] font-semibold text-white leading-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] mt-2" style={{ color: "var(--color-accent-light)" }}>
                    {step.subtitle}
                  </p>
                  <p className="font-mono text-[14px] leading-relaxed max-w-md mt-3" style={{ color: "rgba(245,245,244,0.60)" }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
