"use client";

/**
 * "Custom automations" — its own block in the homepage "What We Build" section.
 * Not a carousel: centered copy above, a horizontal Remotion pipeline band in the
 * middle, supporting points + CTA below. CTA opens the homepage audit form.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import WorkflowPlayer from "@/components/sections/solutions/remotion/WorkflowPlayer";

const SPRING = [0.32, 0.72, 0, 1] as const;

type Data = {
  eyebrow: string;
  headline: string;
  subtext: string;
  bullets: { title: string; desc: string }[];
  cta: string;
};

export default function CustomAutomations() {
  const t = useTranslations("Services");
  const d = t.raw("customAutomations") as Data;
  const { openAuditForm } = useAuditForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewRelaxed}
      transition={{ duration: 0.6, ease: SPRING }}
      className="pt-4 md:pt-6"
    >
      {/* Text above */}
      <div className="max-w-2xl">
        <span
          className="mb-2.5 block font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
          style={{ color: "var(--color-accent-light)" }}
        >
          {d.eyebrow}
        </span>
        <h3 className="font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.01em] text-white text-balance sm:text-[23px]">
          {d.headline}
        </h3>
        <p className="font-mono mt-3 text-[13.5px] leading-relaxed text-white">
          {d.subtext}
        </p>
      </div>

      {/* Horizontal Remotion band */}
      <div
        className="relative mt-8 overflow-hidden rounded-[1.5rem] border"
        style={{
          borderColor: "rgba(255,255,255,0.10)",
          background: "var(--color-mono-surface)",
        }}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: "1180 / 280" }}
        >
          <WorkflowPlayer />
        </div>
      </div>

      {/* Text below */}
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 md:grid-cols-4">
        {d.bullets.map((b) => (
          <div key={b.title}>
            <p
              className="font-display mb-1 text-[13px] font-semibold"
              style={{ color: "var(--color-accent-light)" }}
            >
              {b.title}
            </p>
            <p className="font-mono text-[12px] leading-relaxed text-white">
              {b.desc}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => openAuditForm()}
        className="font-display ease-spring group/cta mt-8 inline-flex items-center gap-2 rounded-full py-2 pl-5 pr-2 text-[12.5px] font-semibold text-[#0a0a0c] transition-transform duration-500 hover:scale-[1.03] active:scale-[0.97]"
        style={{ background: "var(--color-accent-light)" }}
      >
        {d.cta}
        <span
          className="ease-spring flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform duration-500 group-hover/cta:translate-x-0.5"
          aria-hidden
        >
          <ArrowRight size={12} weight="bold" />
        </span>
      </button>
    </motion.div>
  );
}
