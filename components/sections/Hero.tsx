"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { CRMPipeline } from "@/components/sections/hero/CRMPipeline";
import Link from "next/link";
import { useRef, type ReactNode } from "react";

const SPRING = [0.32, 0.72, 0, 1] as const;
const SPRING_TIGHT = { type: "spring" as const, stiffness: 400, damping: 40 };

// ── Word-by-word clip-path reveal ──────────────────────────────────────────
function WordReveal({
  text,
  accent = false,
  baseDelay = 0,
  wordDelay = 0.055,
}: {
  text: string;
  accent?: boolean;
  baseDelay?: number;
  wordDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <span
      aria-label={text}
      style={{ color: accent ? "#a78bfa" : undefined }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "108%", clipPath: "inset(0 0 100% 0)" }}
            animate={{ y: "0%", clipPath: "inset(0 0 0% 0)" }}
            transition={{
              duration: 0.52,
              ease: SPRING,
              delay: baseDelay + i * wordDelay,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
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
    mx.set((e.clientX - r.left - r.width / 2) * 0.28);
    my.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

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
      data-cursor-ring
    >
      {children}
    </motion.button>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
export default function Hero() {
  const { openAuditForm } = useAuditForm();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Parallax: card moves up 25% of the hero travel distance
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      id="hero"
      className="relative overflow-x-clip min-h-[100dvh] flex items-center"
    >
      {/* Background — single subtle radial vignette only, no orbs, no grid */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-brand-dark" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 38% 50%, rgba(139,92,246,0.055) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-brand-dark))" }}
        aria-hidden
      />

      {/* Content */}
      <div
        ref={heroRef}
        className="relative z-10 container-max w-full pt-24 pb-16 md:pt-28 md:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] items-center gap-10 lg:gap-14">

          {/* LEFT — copy */}
          <div className="flex flex-col items-start gap-6">

            {/* Eyebrow — numbered label, not pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <span
                className="font-sora text-[11px] font-semibold"
                style={{ color: "rgba(139,92,246,0.55)", letterSpacing: "0.06em" }}
              >
                01
              </span>
              <div style={{ width: 18, height: 1, background: "rgba(139,92,246,0.35)" }} />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: "rgba(239,240,243,0.35)" }}
              >
                AI Growth Partner for Service Businesses
              </span>
            </motion.div>

            {/* Headline — word-by-word clip-path reveal */}
            <h1
              className="font-sora text-[clamp(38px,6.5vw,72px)] font-semibold leading-[1.02] tracking-[-0.03em] text-balance"
            >
              <span style={{ display: "block" }}>
                <WordReveal text="The AI Growth Partner" baseDelay={0.12} wordDelay={0.055} />
              </span>
              <span style={{ display: "block" }}>
                <WordReveal text="for Service Businesses" baseDelay={0.36} wordDelay={0.055} />
              </span>
              <span style={{ display: "block" }}>
                <WordReveal text="Ready to Scale." accent baseDelay={0.57} wordDelay={0.055} />
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: SPRING, delay: 0.78 }}
              className="text-[17px] leading-relaxed max-w-[540px]"
              style={{ color: "rgba(239,240,243,0.82)" }}
            >
              Drivn.AI helps service businesses capture more leads, respond
              faster, book more appointments, and automate the busywork that
              slows growth.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: SPRING, delay: 0.86 }}
              className="flex flex-col xs:flex-row items-start xs:items-center gap-3 mt-1"
            >
              <MagneticButton
                onClick={() => openAuditForm()}
                className="btn-primary group"
              >
                <span className="btn-primary-text">Book a Free Lead Conversion Audit</span>
                <span className="btn-pocket" aria-hidden>
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </span>
              </MagneticButton>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={SPRING_TIGHT}
              >
                <Link href="#work" className="btn-ghost" data-cursor-ring>
                  See Systems We&apos;ve Built
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — CRM Pipeline with parallax */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.3 }}
            style={{ y: cardY }}
          >
            <div
              className="relative w-full max-w-[420px] rounded-3xl p-6"
              style={{
                background: "rgba(15,18,32,0.65)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Panel header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: "rgba(239,240,243,0.35)", letterSpacing: "0.06em" }}
                >
                  Lead Pipeline
                </span>
                <motion.span
                  className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold"
                  style={{ color: "rgba(74,222,128,0.80)" }}
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  LIVE
                </motion.span>
              </div>

              <CRMPipeline />
            </div>
          </motion.div>

        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex justify-center mt-14 md:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.a
            href="#problem"
            aria-label="Scroll to problem section"
            className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/55 transition-colors duration-300"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
