"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useRef, type ReactNode } from "react";

const SPRING = [0.32, 0.72, 0, 1] as const;

// Scroll-linked reveal: starts tilted back (semi-lifted, hinged at the bottom edge),
// lays flat as it scrolls into place. Continuously tied to scroll position (not a
// one-shot animation) so it reverses smoothly on scroll-up too.
function TiltReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.4"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });
  const rotateX = useTransform(smoothProgress, [0, 1], reducedMotion ? [0, 0] : [22, 0]);

  return (
    <div ref={ref} style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX, transformOrigin: "bottom center", transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
      </motion.div>
    </div>
  );
}

export type Bullet = { title: string; desc: string };

function BulletGrid({ bullets, columns = 2 }: { bullets: Bullet[]; columns?: 2 | 4 }) {
  return (
    <div className={`grid grid-cols-1 ${columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-4"} gap-x-8 gap-y-5`}>
      {bullets.map((b) => (
        <div key={b.title}>
          <p className="font-display text-[14px] font-semibold mb-1" style={{ color: "var(--color-accent-light)" }}>{b.title}</p>
          <p className="font-mono text-[12.5px] leading-relaxed text-white">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}

function GradientFrame({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden ${fullWidth ? "w-full aspect-[4/3]" : "w-full lg:w-1/2 shrink-0 aspect-[5/4]"}`}
    >
      <div className="orb orb-a" aria-hidden />
      <div className="orb orb-b" aria-hidden />
      <div className={`absolute inset-0 z-10 flex items-center justify-center ${fullWidth ? "p-3 md:p-4" : "p-6 md:p-10"}`}>{children}</div>
    </div>
  );
}

export function ShowcasePanelSplit({
  eyebrow,
  headline,
  subtext,
  bullets,
  mockup,
  href,
  cta,
  reversed = false,
}: {
  eyebrow: string;
  headline: string;
  subtext?: string;
  bullets: Bullet[];
  mockup: ReactNode;
  href: string;
  cta: string;
  reversed?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewRelaxed}
      transition={{ duration: 0.7, ease: SPRING }}
      className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-stretch gap-10 lg:gap-16 py-16 md:py-20 border-t`}
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    >
      <GradientFrame>{mockup}</GradientFrame>

      <div className="lg:w-1/2 flex flex-col justify-center min-w-0">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--color-accent-light)" }}>
          {eyebrow}
        </span>
        <h3 className="font-display mt-3 mb-4 text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.01em] text-white text-balance">
          {headline}
        </h3>
        {subtext && (
          <p className="font-mono text-[13.5px] leading-relaxed mb-6" style={{ color: "rgba(245,245,244,0.55)" }}>
            {subtext}
          </p>
        )}
        <BulletGrid bullets={bullets} />
        <Link
          href={href}
          className="group mt-8 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors duration-200"
          style={{ color: "rgba(245,245,244,0.6)" }}
        >
          {cta}
          <ArrowUpRight size={14} weight="bold" className="group-hover:text-white transition-colors duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}

export function ShowcasePanelFull({
  eyebrow,
  headline,
  subtext,
  bullets,
  mockup,
  href,
  cta,
}: {
  eyebrow: string;
  headline: string;
  subtext: string;
  bullets: Bullet[];
  mockup: ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewRelaxed}
      transition={{ duration: 0.7, ease: SPRING }}
      className="py-16 md:py-20 border-t"
      style={{ borderColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--color-accent-light)" }}>
          {eyebrow}
        </span>
        <h3 className="font-display mt-3 mb-4 text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.01em] text-white text-balance">
          {headline}
        </h3>
        <p className="font-mono text-[14.5px] leading-relaxed" style={{ color: "rgba(245,245,244,0.58)" }}>{subtext}</p>
      </div>

      <TiltReveal>
        <GradientFrame fullWidth>{mockup}</GradientFrame>
      </TiltReveal>

      <div className="mt-10 max-w-3xl mx-auto">
        <BulletGrid bullets={bullets} columns={4} />
      </div>

      <div className="flex justify-center">
        <Link
          href={href}
          className="group mt-8 inline-flex items-center gap-1.5 font-display text-[13px] font-semibold uppercase tracking-widest transition-colors duration-200"
          style={{ color: "rgba(245,245,244,0.6)" }}
        >
          {cta}
          <ArrowUpRight size={14} weight="bold" className="group-hover:text-white transition-colors duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}
