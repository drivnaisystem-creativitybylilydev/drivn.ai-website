"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

const LOGOS = [
  { src: "/case-studies/logos-tint/notime-storage-cutout.png", alt: "NoTime Storage logo", ratio: 482 / 481 },
  { src: "/case-studies/logos-tint/creativity-by-lily-cutout.png", alt: "Creativity by Lilly Co logo", ratio: 1200 / 1201 },
  { src: "/case-studies/logos-tint/notimemover-cutout.png", alt: "NoTime Mover logo", ratio: 785 / 265 },
];

const DUOTONE_FILTER = "grayscale(1) brightness(0.4) sepia(1) hue-rotate(235deg) saturate(1.6)";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SPRING } },
};

export default function CaseStudies() {
  const t = useTranslations("CaseStudies");

  return (
    <section id="work" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-14 md:mb-16 max-w-2xl mx-auto flex flex-col items-center text-center"
        >
          <ChapterLabel title={t("eyebrow")} />
          <h2 className="font-display mt-4 text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white text-balance">
            {t("headline")}
          </h2>
          <p className="font-mono mt-4 text-[15px] max-w-[420px] leading-relaxed" style={{ color: "rgba(245,245,244,0.62)" }}>
            {t("subtext")}
          </p>
        </motion.div>

        {/* Logo teaser — ghosted, low-opacity dark-purple duotone, tight together, centered */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-9"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewRelaxed}
        >
          {LOGOS.map((logo) => (
            <motion.div
              key={logo.alt}
              variants={tileVariants}
              className="relative h-20 md:h-24 transition-opacity duration-300 hover:opacity-70"
              style={{ aspectRatio: logo.ratio, opacity: 0.32 }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                style={{ filter: DUOTONE_FILTER }}
                sizes="200px"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to full case study index */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.2, ease: SPRING }}
          className="flex justify-center"
        >
          <Link
            href="/work"
            className="mt-10 inline-flex items-center gap-2 text-[14px] font-medium font-display transition-colors duration-200"
            style={{ color: "var(--color-accent-light)" }}
          >
            {t("cta")}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
