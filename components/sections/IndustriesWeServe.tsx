"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

export default function IndustriesWeServe() {
  const t = useTranslations("Industries");
  const { openAuditForm } = useAuditForm();
  const industries = t.raw("items") as Array<{
    label: string;
    desc: string;
    link?: string;
  }>;

  return (
    <section id="industries" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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

        {/* Divided grid — 2 cols desktop, 1 col mobile, no card boxes */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 border-t border-l-0 md:border-l"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          {industries.map((industry, i) => (
            <motion.div
              key={industry.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.55, ease: SPRING, delay: i * 0.05 }}
              className="p-7 md:p-9 border-b md:border-r"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
            >
              <p className="font-display text-[18px] font-semibold text-white leading-tight mb-1.5">
                {industry.label}
              </p>
              <p className="font-mono text-[12.5px] leading-relaxed" style={{ color: "rgba(245,245,244,0.55)" }}>
                {industry.desc}
              </p>
              {industry.link && (
                <Link
                  href={industry.link}
                  className="mt-3 inline-flex items-center gap-1.5 font-display text-[13px] font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: "var(--color-accent-light)" }}
                >
                  See solutions
                  <ArrowRight size={13} weight="bold" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.15, ease: SPRING }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <p className="font-mono text-[14px] max-w-[480px] leading-relaxed" style={{ color: "rgba(245,245,244,0.62)" }}>
            {t("footer_text")}
          </p>
          <button
            type="button"
            onClick={() => openAuditForm()}
            className="shrink-0 inline-flex items-center gap-2 text-[13px] font-medium font-display transition-colors duration-200"
            style={{ color: "var(--color-accent-light)" }}
          >
            {t("footer_cta")}
            <ArrowRight size={14} weight="bold" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
