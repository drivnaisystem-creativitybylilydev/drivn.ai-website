"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { viewRelaxed } from "@/lib/motion-viewport";

const SPRING = [0.32, 0.72, 0, 1] as const;

export default function FinalCTA() {
  const t = useTranslations("FinalCTA");
  const { openAuditForm } = useAuditForm();

  return (
    <section id="contact" className="relative py-24 md:py-40 overflow-hidden">
      <div className="relative z-10 container-max">
        <div className="max-w-[760px] pt-16 border-t-2" style={{ borderColor: "rgba(124,77,255,0.45)" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.65, ease: SPRING }}
          >
            <span
              className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] mb-8 block"
              style={{ color: "rgba(245,245,244,0.42)" }}
            >
              {t("eyebrow")}
            </span>

            <h2
              className="font-display font-semibold leading-[1.06] tracking-[-0.025em] text-balance mb-2"
              style={{ fontSize: "clamp(26px,4vw,44px)", color: "rgba(245,245,244,0.55)" }}
            >
              {t("setup")}
            </h2>

            <p
              className="font-display font-semibold leading-[1.06] tracking-[-0.03em] text-balance mb-10"
              style={{ fontSize: "clamp(30px,4.8vw,54px)" }}
            >
              <span className="text-white">that&rsquo;s not a discipline problem. </span>
              <span className="font-accent italic font-normal" style={{ color: "var(--color-accent-light)" }}>
                It&rsquo;s a systems problem.
              </span>
            </p>

            <p className="text-[17px] leading-relaxed mb-10 max-w-[520px]" style={{ color: "rgba(245,245,244,0.65)" }}>
              {t("body")}
            </p>

            {/* Primary CTA */}
            <motion.button
              type="button"
              onClick={() => openAuditForm()}
              className="relative inline-flex items-center gap-3 pl-7 pr-2 py-2 font-display font-medium rounded-full cursor-pointer select-none bg-white text-[#0a0a0c]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <span
                className="pointer-events-none absolute -inset-2 rounded-full -z-10"
                style={{ boxShadow: "0 0 40px 4px rgba(124,77,255,0.35)" }}
                aria-hidden
              />
              <span className="text-[15px] tracking-tight font-semibold">{t("cta")}</span>
              <span className="w-11 h-11 rounded-full flex items-center justify-center bg-black/10" aria-hidden>
                <ArrowRight size={16} weight="bold" />
              </span>
            </motion.button>

            {/* Trust tokens */}
            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-2 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {(t.raw("tokens") as string[]).map((token) => (
                <span key={token} className="flex items-center gap-1.5 text-[13px]" style={{ color: "rgba(245,245,244,0.42)" }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: "rgba(245,245,244,0.35)" }} aria-hidden />
                  {token}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
