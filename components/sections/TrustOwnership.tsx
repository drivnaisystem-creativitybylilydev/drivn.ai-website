"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

type Point = { title: string; body: string };

export default function TrustOwnership() {
  const t = useTranslations("TrustOwnership");
  const points = t.raw("points") as Point[];

  return (
    <section id="trust" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: SPRING }}
          className="mb-16 md:mb-20 max-w-2xl"
        >
          <ChapterLabel title={t("eyebrow")} />
          <h2 className="font-display mt-4 text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white text-balance">
            {t("headline")}
          </h2>
          <p className="font-mono mt-5 text-[15px] leading-relaxed max-w-xl" style={{ color: "rgba(245,245,244,0.62)" }}>
            {t("subtext")}
          </p>
        </motion.div>

        {/* 3 text columns, no cards, no icon tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.6, ease: SPRING, delay: i * 0.08 }}
              className="pt-6 border-t-2"
              style={{ borderColor: "rgba(124,77,255,0.45)" }}
            >
              <h3 className="font-display text-[17px] font-semibold leading-snug mb-2.5" style={{ color: "var(--color-accent-light)" }}>
                {point.title}
              </h3>
              <p className="font-mono text-[13.5px] leading-relaxed text-white">
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
