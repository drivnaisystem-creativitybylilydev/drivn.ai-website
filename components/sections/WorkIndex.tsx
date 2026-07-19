"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { caseStudies } from "@/lib/case-studies";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: SPRING } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

type WorkCard = {
  slug: string;
  href: string;
  title: string;
  subheading: string;
  cardLogoSrc: string;
  cardLogoAlt: string;
  cardResultLines: string[];
  comingSoon?: boolean;
};

export default function WorkIndex() {
  const t = useTranslations("CaseStudies");

  // Real, written case studies plus NoTime Mover — a co-founded venture we're
  // building, not a finished client engagement — shown so it's not hidden, but
  // linking to a dedicated "coming soon" page instead of a fabricated write-up.
  const cards: WorkCard[] = [
    ...caseStudies.map((study) => ({
      slug: study.slug,
      href: `/work/${study.slug}`,
      title: study.title,
      subheading: study.subheading,
      cardLogoSrc: study.cardLogoSrc,
      cardLogoAlt: study.cardLogoAlt,
      cardResultLines: study.cardResultLines,
    })),
    {
      slug: "notime-mover",
      href: "/work/notime-mover",
      title: "NoTime Mover",
      subheading: "Moving & junk removal",
      cardLogoSrc: "/case-studies/logos-tint/notimemover-cutout.png",
      cardLogoAlt: "NoTime Mover logo",
      cardResultLines: [],
      comingSoon: true,
    },
  ];

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-36 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-16 md:mb-20 max-w-2xl"
        >
          <ChapterLabel title={t("eyebrow")} />
          <h1 className="font-display mt-4 text-[clamp(32px,5.5vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white text-balance">
            {t("headline")}
          </h1>
          <p className="font-mono mt-5 text-[15px] max-w-[480px] leading-relaxed" style={{ color: "rgba(245,245,244,0.62)" }}>
            {t("subtext")}
          </p>
        </motion.div>

        {/* Case study cards — single hairline, hover brightens to white */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {cards.map((card) => (
            <motion.div key={card.slug} variants={cardVariants} className="h-full">
              <Link
                href={card.href}
                className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]"
              >
                <div
                  className="h-full flex flex-col p-8 rounded-2xl border transition-all duration-300 group-hover:border-transparent"
                  style={{ borderColor: "rgba(255,255,255,0.10)", opacity: card.comingSoon ? 0.75 : 1 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = card.comingSoon
                      ? "0 0 0 1px rgba(255,255,255,0.14)"
                      : "0 0 0 1px rgba(124,77,255,0.35), 0 0 40px rgba(124,77,255,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* Logo + arrow */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative h-12 w-24">
                      <Image
                        src={card.cardLogoSrc}
                        alt={card.cardLogoAlt}
                        fill
                        className="object-contain object-left"
                        sizes="96px"
                      />
                    </div>
                    {card.comingSoon ? (
                      <span
                        className="relative w-9 h-9 rounded-full flex items-center justify-center border"
                        style={{ borderColor: "rgba(255,255,255,0.16)", color: "rgba(245,245,244,0.40)" }}
                      >
                        <Clock size={15} weight="regular" />
                      </span>
                    ) : (
                      <span
                        className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:border-transparent"
                        style={{ borderColor: "rgba(255,255,255,0.16)", color: "rgba(245,245,244,0.50)" }}
                      >
                        <span
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: "var(--color-accent)", boxShadow: "0 0 20px 2px rgba(124,77,255,0.45)" }}
                        />
                        <ArrowUpRight size={16} weight="regular" className="relative group-hover:text-white transition-colors duration-300" />
                      </span>
                    )}
                  </div>

                  {/* Title + subheading */}
                  <div className="mb-6">
                    <h3 className="font-display text-[20px] font-semibold text-white mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-[13px] font-mono uppercase tracking-[0.1em]" style={{ color: "rgba(245,245,244,0.45)" }}>
                      {card.subheading}
                    </p>
                  </div>

                  {/* Result lines, or a coming-soon badge in their place */}
                  <div className="flex flex-col gap-2 pt-6 mt-auto border-t" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
                    {card.comingSoon ? (
                      <p className="font-display text-[14px] font-medium" style={{ color: "rgba(245,245,244,0.45)" }}>
                        {t("coming_soon_badge")}
                      </p>
                    ) : (
                      card.cardResultLines.map((line, i) => (
                        <p key={`${card.slug}-${i}`} className="font-display text-[14px] font-medium text-white leading-snug">
                          {line}
                        </p>
                      ))
                    )}
                  </div>

                  <span
                    className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold font-display uppercase tracking-widest transition-colors duration-200"
                    style={{ color: "rgba(245,245,244,0.55)" }}
                  >
                    {card.comingSoon ? t("coming_soon_cta") : t("read_cta")}
                    {!card.comingSoon && <ArrowUpRight size={12} weight="bold" />}
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
