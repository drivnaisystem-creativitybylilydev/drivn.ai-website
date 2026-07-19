"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

function FAQItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewRelaxed}
      transition={{ duration: 0.5, ease: SPRING, delay: index * 0.06 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
        aria-expanded={open}
      >
        <span className="font-display text-[16px] font-semibold leading-snug text-white">
          {item.q}
        </span>
        <span
          className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200"
          style={{
            borderColor: open ? "rgba(124,77,255,0.55)" : "rgba(255,255,255,0.14)",
            background: open ? "rgba(124,77,255,0.15)" : "transparent",
            color: open ? "var(--color-accent-light)" : "rgba(245,245,244,0.45)",
          }}
        >
          {open ? <Minus size={12} weight="bold" /> : <Plus size={12} weight="bold" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="font-mono pb-5 text-[13.5px] leading-relaxed pr-10" style={{ color: "rgba(245,245,244,0.60)" }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px" style={{ background: "rgba(255,255,255,0.10)" }} />
    </motion.div>
  );
}

export default function HomeFAQ() {
  const t = useTranslations("HomeFAQ");
  const FAQS = t.raw("faqs") as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-20">
          {/* Left — header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: SPRING }}
          >
            <ChapterLabel title={t("eyebrow")} />
            <h2 className="font-display text-[clamp(24px,3.5vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white text-balance">
              {t("headline")}
            </h2>
            <p className="font-mono mt-4 text-[13px] leading-relaxed" style={{ color: "rgba(245,245,244,0.55)" }}>
              {t("footer_text")}
            </p>
          </motion.div>

          {/* Right — accordion */}
          <div>
            <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.10)" }} />
            {FAQS.map((faq, i) => (
              <FAQItem key={i} item={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
