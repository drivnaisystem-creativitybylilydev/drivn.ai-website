"use client";

import { motion } from "framer-motion";
import { Globe, Zap, Calendar, LayoutDashboard, Star, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { RadialOrbitalTimeline, type TimelineItem } from "@/components/ui/radial-orbital-timeline";

const SPRING = [0.32, 0.72, 0, 1] as const;
const ICONS = [Globe, Zap, Calendar, LayoutDashboard, Star];
const RELATED_IDS = [[2, 5], [1, 3], [2, 4], [3, 5], [4, 1]];
const STATUSES = ["completed", "in-progress", "completed", "in-progress", "upcoming"] as const;
const ENERGIES = [85, 95, 80, 75, 70];

export default function CoreOffer() {
  const t = useTranslations("CoreOffer");
  const { openAuditForm } = useAuditForm();

  const rawTimeline = t.raw("timeline") as Array<{ title: string; date: string; content: string; category: string }>;
  const timelineData: TimelineItem[] = rawTimeline.map((item, i) => ({
    id: i + 1,
    title: item.title,
    date: item.date,
    content: item.content,
    category: item.category,
    icon: ICONS[i],
    relatedIds: RELATED_IDS[i],
    status: STATUSES[i],
    energy: ENERGIES[i],
  }));

  return (
    <section id="offer" className="relative py-20 md:py-24 overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(201,168,118,0.08) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <hr className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 container-max">
        {/* Header — left-aligned, block number replaces eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-12 md:mb-14 max-w-[640px]"
        >
          <span
            className="block font-sora text-[clamp(56px,8vw,96px)] font-bold leading-none tracking-tight mb-4 select-none"
            style={{ color: "rgba(201,168,118,0.12)" }}
            aria-hidden
          >
            03
          </span>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white">
            {t("headline")}
          </h2>
          <p
            className="mt-4 text-[16px] leading-relaxed"
            style={{ color: "rgba(239,240,243,0.72)" }}
          >
            {t("subtext")}
          </p>
        </motion.div>

        {/* Orbital timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.7, ease: SPRING, delay: 0.1 }}
          className="max-w-[580px] mx-auto"
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>

        {/* CTA — centered, stacked */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.2, ease: SPRING }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            onClick={() => openAuditForm()}
            className="btn-primary group"
          >
            <span className="btn-primary-text">{t("cta")}</span>
            <span className="btn-pocket" aria-hidden>
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </span>
          </button>
          <p
            className="text-[13px] text-center"
            style={{ color: "rgba(239,240,243,0.40)" }}
          >
            {t("disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
