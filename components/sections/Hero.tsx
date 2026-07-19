"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { useRef, type ReactNode } from "react";
import DashboardVisual from "@/components/sections/DashboardVisual";
import DottedSphere from "@/components/sections/hero/DottedSphere";

const SPRING = [0.32, 0.72, 0, 1] as const;
const SPRING_TIGHT = { type: "spring" as const, stiffness: 400, damping: 40 };

// ── Word-by-word clip-path reveal ──────────────────────────────────────────
function WordReveal({
  text,
  baseDelay = 0,
  wordDelay = 0.055,
  color,
}: {
  text: string;
  baseDelay?: number;
  wordDelay?: number;
  color?: string;
}) {
  const words = text.split(" ");
  return (
    <span aria-label={text} style={color ? { color } : undefined}>
      {words.map((word, i) => (
        <span key={i}>
          {/* Small padding buffer, canceled by matching negative margin so layout doesn't shift —
              just enough room for ascenders/descenders on the overflow:hidden reveal box. Kept
              tight since both lines are non-italic Geist now (the old italic-clipping issue that
              needed generous padding no longer applies here). */}
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: 1.15,
              padding: "0.12em 0.1em 0.04em 0.04em",
              margin: "-0.12em -0.1em -0.04em -0.04em",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "108%", clipPath: "inset(0 0 100% 0)" }}
              animate={{ y: "0%", clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 0.55, ease: SPRING, delay: baseDelay + i * wordDelay }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

// ── Magnetic CTA button ────────────────────────────────────────────────────
function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 420, damping: 28 });
  const sy = useSpring(my, { stiffness: 420, damping: 28 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.22);
    my.set((e.clientY - r.top - r.height / 2) * 0.22);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING_TIGHT}
    >
      {children}
    </motion.button>
  );
}

// ── Hero — cinematic center, no side widget ─────────────────────────────────
export default function Hero() {
  const t = useTranslations("Hero");
  const { openAuditForm } = useAuditForm();

  return (
    <section id="hero" className="relative overflow-x-clip">
      {/* Background — near-black base, no orb field, no grid */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "var(--color-mono-bg)" }} aria-hidden />

      {/* Dotted sphere — replaces the old soft radial-gradient glow. Same footprint/position,
          same rough opacity, glows and pulses instead of being a static blur. */}
      <DottedSphere />

      {/* Dashboard as true hero background — sits behind ALL text (low z-index, low opacity),
          not a separate section and not competing for legibility with the CTA/headline on top. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-4"
        style={{
          opacity: 0.28,
          transform: "scale(1.05)",
          filter: "blur(0.5px)",
          maskImage: "radial-gradient(ellipse 65% 60% at 50% 55%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 55%, black 40%, transparent 85%)",
        }}
        aria-hidden
      >
        <DashboardVisual />
      </div>

      <div className="relative z-10 min-h-[100dvh] container-max w-full pt-32 pb-16 flex flex-col items-center justify-center text-center">
        {/* Eyebrow — "AI Consulting" stacked above the caption, same font-mono treatment,
            twice the size, in white. */}
        <div className="mb-7 flex flex-col items-center gap-1.5">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-mono text-[22px] font-semibold uppercase tracking-[0.22em] text-white"
          >
            {t("eyebrow_overlay")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-light)" }}
          >
            {t("eyebrow")}
          </motion.span>
        </div>

        {/* Headline — max 2 lines. Both lines in Geist now (italic Instrument Serif dropped —
            its own letterforms read as "cut off" on n/e at this size, confirmed not a CSS bug
            by disabling all clipping and getting a pixel-identical render). Color still
            differentiates line 1. */}
        <h1 className="font-display max-w-5xl text-[clamp(38px,7vw,84px)] font-semibold leading-[0.98] tracking-[-0.03em] text-white">
          <span style={{ display: "block" }}>
            <WordReveal text={t("headline1")} baseDelay={0.12} wordDelay={0.06} color="var(--color-accent-light)" />
          </span>
          <span style={{ display: "block", marginTop: "-0.02em" }}>
            <WordReveal text={t("headline2")} baseDelay={0.4} wordDelay={0.06} />
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: SPRING, delay: 0.72 }}
          className="font-mono mt-7 text-[15px] sm:text-[17px] md:text-[19px] leading-relaxed whitespace-nowrap"
          style={{ color: "rgba(245,245,244,0.68)" }}
        >
          The right system depends on your business, not a template.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: SPRING, delay: 0.8 }}
          className="font-mono mt-1 text-[17px] md:text-[19px] font-semibold leading-relaxed"
          style={{ color: "var(--color-accent-light)" }}
        >
          We find it. We build it.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: SPRING, delay: 0.85 }}
          className="flex flex-col xs:flex-row items-center gap-3 mt-10"
        >
          <MagneticButton
            onClick={() => openAuditForm()}
            className="relative inline-flex items-center gap-3 pl-7 pr-2 py-2 font-display font-medium rounded-full cursor-pointer select-none bg-white text-[#0a0a0c]"
          >
            <span
              className="pointer-events-none absolute -inset-2 rounded-full -z-10"
              style={{ boxShadow: "0 0 40px 4px rgba(124,77,255,0.35)" }}
              aria-hidden
            />
            <span className="text-[15px] tracking-tight font-semibold">{t("cta_primary")}</span>
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center bg-black/10 transition-transform duration-500 ease-spring"
              aria-hidden
            >
              <ArrowRight size={16} weight="bold" />
            </span>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Glowy gradient bottom border — soft light bleeding along the hero's bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden h-40" aria-hidden>
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2"
          style={{
            width: "min(1100px, 92%)",
            height: "160px",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,255,255,0.5) 0%, rgba(124,77,255,0.4) 32%, rgba(124,77,255,0.12) 55%, transparent 78%)",
            filter: "blur(36px)",
          }}
        />
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 h-px"
          style={{
            width: "min(760px, 70%)",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            boxShadow: "0 0 24px 4px rgba(255,255,255,0.5), 0 0 60px 12px rgba(124,77,255,0.5)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#problem"
        aria-label={t("scroll_label")}
        className="relative z-10 mb-10 flex flex-col items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 7, 0] }}
        transition={{ opacity: { delay: 1.3, duration: 0.5 }, y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <ArrowDown size={18} weight="light" />
      </motion.a>
    </section>
  );
}
