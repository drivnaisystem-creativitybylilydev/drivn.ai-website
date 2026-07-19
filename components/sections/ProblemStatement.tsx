"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { MessageClockIcon, StreakGapIcon, ScatteredSquaresIcon } from "@/components/sections/problem/FilmstripIcons";

const SPRING = [0.32, 0.72, 0, 1] as const;
const ICONS = [MessageClockIcon, StreakGapIcon, ScatteredSquaresIcon];

export default function ProblemStatement() {
  const t = useTranslations("Problem");
  const beats = t.raw("beats") as Array<{ lead: string; body: string }>;

  return (
    <section id="problem" className="relative py-24 md:py-36 overflow-hidden">
      <div className="relative z-10 container-max">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewRelaxed} transition={{ duration: 0.5 }}>
          <ChapterLabel title="The Problem" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: SPRING }}
          className="font-display max-w-3xl text-[clamp(26px,4.2vw,44px)] font-semibold leading-[1.15] tracking-[-0.02em] text-white mb-16 md:mb-20"
        >
          {t("headline")}
        </motion.h2>

        {/* Filmstrip — one strip, three frames, divided by hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.7, ease: SPRING }}
          className="grid grid-cols-1 md:grid-cols-3 border-t border-b"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          {beats.map((beat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                className={`p-8 md:p-10 border-b md:border-b-0 last:border-b-0 ${i > 0 ? "md:border-l" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                <div className="mb-6">
                  <Icon />
                </div>
                <p className="font-display text-[19px] md:text-[21px] font-semibold leading-snug text-white mb-3">
                  {beat.lead}
                </p>
                <p className="font-mono text-[13.5px] leading-relaxed" style={{ color: "rgba(245,245,244,0.58)" }}>
                  {beat.body}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom line — full width, centered, key phrase highlighted.
            Hardcoded EN here (not t()) to split out the highlight span, matching the
            same accepted exception already used in Hero/FinalCTA for inline emphasis. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, delay: 0.1, ease: SPRING }}
          className="mt-16 md:mt-20 flex flex-col items-center text-center gap-7"
        >
          <p className="font-display text-[28px] md:text-[40px] lg:text-[46px] font-semibold leading-[1.2] max-w-4xl text-white">
            You don&apos;t need more tools. You need{" "}
            <span
              style={{
                background: "rgba(124,77,255,0.28)",
                borderRadius: "0.35em",
                padding: "0.02em 0.18em",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              one system that works
            </span>{" "}
            whether or not you&apos;re the one running it.
          </p>
          <a
            href="#systems"
            className="inline-flex items-center gap-2 text-[14px] font-medium font-display text-white/60 hover:text-white transition-colors duration-200"
          >
            {t("bottom_cta")}
            <span aria-hidden>↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
