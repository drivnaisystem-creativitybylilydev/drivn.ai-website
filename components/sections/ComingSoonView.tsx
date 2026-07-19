"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

export default function ComingSoonView({
  logoSrc,
  logoAlt,
  logoAspect,
}: {
  logoSrc: string;
  logoAlt: string;
  logoAspect: number;
}) {
  const t = useTranslations("ComingSoon");

  return (
    <section className="relative min-h-[100dvh] flex items-center pt-32 pb-24">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SPRING }}
          className="max-w-xl mx-auto text-center flex flex-col items-center"
        >
          <ChapterLabel title={t("eyebrow")} />

          <div className="relative h-10 w-40 my-8 opacity-90">
            <Image src={logoSrc} alt={logoAlt} fill className="object-contain" sizes="160px" style={{ aspectRatio: logoAspect }} />
          </div>

          <h1 className="font-display text-[clamp(28px,4.5vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white text-balance mb-5">
            {t("title")}
          </h1>
          <p className="font-mono text-[14.5px] leading-relaxed max-w-[440px]" style={{ color: "rgba(245,245,244,0.58)" }}>
            {t("subtext")}
          </p>

          <IntlLink
            href="/work"
            className="group mt-10 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors duration-200"
            style={{ color: "rgba(245,245,244,0.6)" }}
          >
            <ArrowLeft size={14} weight="bold" className="group-hover:text-white transition-colors duration-200" />
            <span className="group-hover:text-white transition-colors duration-200">{t("back_cta")}</span>
          </IntlLink>
        </motion.div>
      </div>
    </section>
  );
}
