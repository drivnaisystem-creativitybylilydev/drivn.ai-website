"use client";

/**
 * Progressive carousel used for the homepage "What We Build" service groups
 * (Foundation, Speed-to-Lead, Never Miss a Call). A large render on top, a row of
 * labelled buttons below where the active one fills with a loading bar as it
 * auto-advances. It keeps auto-rotating until a button is clicked (or an arrow
 * key is pressed), then holds on that slide. Also pauses off-screen and on a
 * hidden tab. Respects prefers-reduced-motion. The image and its copy animate in
 * together on every advance. Each slide's CTA opens the homepage audit form. No
 * own heading — the section header above is the title; an optional small eyebrow
 * labels the group.
 */

import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Check, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const SPRING = [0.32, 0.72, 0, 1] as const;

type IconType = ComponentType<{
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  style?: CSSProperties;
  className?: string;
}>;

export type CarouselSlide = {
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  image: string;
  objectPosition?: string;
  scale?: number;
  Icon: IconType;
};

// Literal class strings so Tailwind's JIT picks them up.
const STRIP_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
};

export default function SolutionCarousel({
  ariaLabel,
  eyebrow,
  title,
  subtext,
  slides,
  autoplayMs = 5200,
}: {
  ariaLabel: string;
  eyebrow?: string;
  title?: string;
  subtext: string;
  slides: CarouselSlide[];
  autoplayMs?: number;
}) {
  const { openAuditForm } = useAuditForm();
  const n = slides.length;

  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"auto" | "manual">("auto");

  const toManual = (next: number) => {
    setMode("manual");
    setIndex(((next % n) + n) % n);
  };

  // Auto-rotates until a strip button is clicked (or an arrow key pressed).
  const autoRunning = mode === "auto" && !reduce && inView;

  useEffect(() => {
    if (!autoRunning) return;
    if (
      typeof document !== "undefined" &&
      document.visibilityState !== "visible"
    )
      return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % n);
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoRunning, n, index, autoplayMs]);

  const active = slides[index] ?? slides[0];
  const ActiveIcon = active.Icon;

  return (
    <div ref={ref} className="pt-4 md:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewRelaxed}
        transition={{ duration: 0.6, ease: SPRING }}
        className="max-w-2xl"
      >
        {eyebrow && (
          <span
            className="mb-2.5 block font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ color: "var(--color-accent-light)" }}
          >
            {eyebrow}
          </span>
        )}
        {title && (
          <h3 className="font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.01em] text-white text-balance sm:text-[23px]">
            {title}
          </h3>
        )}
        <p className="font-mono mt-3 text-[13.5px] leading-relaxed text-white">
          {subtext}
        </p>
      </motion.div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewRelaxed}
        transition={{ duration: 0.6, ease: SPRING, delay: 0.05 }}
        className="relative mt-8 outline-none"
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") toManual(index + 1);
          else if (e.key === "ArrowLeft") toManual(index - 1);
        }}
      >
        {/* Stage */}
        <div
          className="relative overflow-hidden rounded-[1.5rem] border"
          style={{
            borderColor: "rgba(255,255,255,0.10)",
            background: "var(--color-mono-surface)",
          }}
        >
          <div className="relative aspect-[16/11] w-full sm:aspect-[16/7]">
            {/* Image + copy share the same key and matched timing, so they
                cross-fade in together on every advance. */}
            <AnimatePresence initial={false}>
              <motion.img
                key={`img-${index}`}
                src={active.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: active.objectPosition ?? "80% 44%",
                  transform: `scale(${reduce ? 1 : active.scale ?? 1.14})`,
                  transformOrigin: "right center",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.15 : 0.6, ease: SPRING }}
              />
            </AnimatePresence>

            {/* legibility scrim — darkens the top-left where the copy sits */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(13,13,17,0.95) 0%, rgba(13,13,17,0.7) 34%, rgba(13,13,17,0.2) 62%, transparent 84%), linear-gradient(to bottom, rgba(13,13,17,0.78) 0%, rgba(13,13,17,0.1) 42%, transparent 62%)",
              }}
            />

            {/* caption — top-left. Same key scheme + duration as the image so
                the two enter simultaneously (no mode="wait" hand-off delay). */}
            <AnimatePresence initial={false}>
              <motion.div
                key={`cap-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0.15 : 0.6, ease: SPRING }}
                className="absolute left-0 top-0 max-w-[26rem] p-6 will-change-transform sm:p-8 md:p-10"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: "rgba(124,77,255,0.18)" }}
                  >
                    <ActiveIcon
                      size={18}
                      weight="light"
                      style={{ color: "var(--color-accent-light)" }}
                    />
                  </span>
                  <span
                    className="font-mono text-[11px] font-semibold tabular-nums"
                    style={{ color: "var(--color-accent-light)" }}
                  >
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(n).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="font-display mt-4 text-[22px] font-semibold text-white sm:text-[26px]">
                  {active.title}
                </h4>
                <p className="font-mono mt-2.5 text-[13px] leading-relaxed text-white">
                  {active.desc}
                </p>
                <ul className="mt-4 space-y-2">
                  {active.bullets.map((bt) => (
                    <li key={bt} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        weight="bold"
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--color-accent-light)" }}
                      />
                      <span className="font-mono text-[12px] leading-relaxed text-white">
                        {bt}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => openAuditForm()}
                  className="font-display ease-spring group/cta mt-6 inline-flex items-center gap-2 rounded-full py-2 pl-5 pr-2 text-[12.5px] font-semibold text-[#0a0a0c] transition-transform duration-500 hover:scale-[1.03] active:scale-[0.97]"
                  style={{ background: "var(--color-accent-light)" }}
                >
                  {active.cta}
                  <span
                    className="ease-spring flex h-6 w-6 items-center justify-center rounded-full bg-black/15 transition-transform duration-500 group-hover/cta:translate-x-0.5"
                    aria-hidden
                  >
                    <ArrowRight size={12} weight="bold" />
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Button strip */}
        <div className={`mt-3 grid gap-2 ${STRIP_COLS[n] ?? STRIP_COLS[5]}`}>
          {slides.map((it, i) => {
            const on = i === index;
            return (
              <button
                key={it.title}
                type="button"
                onClick={() => toManual(i)}
                aria-current={on}
                aria-label={`Show ${it.title}`}
                className={`group relative flex flex-col overflow-hidden rounded-xl border p-3.5 text-left transition-colors duration-200 ${
                  on ? "" : "hover:border-white/20 hover:bg-white/[0.02]"
                }`}
                style={{
                  borderColor: on
                    ? "rgba(124,77,255,0.45)"
                    : "rgba(255,255,255,0.10)",
                  background: on ? "rgba(124,77,255,0.07)" : "transparent",
                }}
              >
                {/* loading bar — track on every button, fill on the active one:
                    animated while auto-rotating, solid once it's been clicked */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px]"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                />
                {on &&
                  (autoRunning ? (
                    <motion.span
                      aria-hidden
                      key={`p-${index}`}
                      className="absolute bottom-0 left-0 h-[3px]"
                      style={{
                        background: "var(--color-accent)",
                        boxShadow: "0 0 8px rgba(124,77,255,0.55)",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: autoplayMs / 1000,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-[3px] w-full"
                      style={{ background: "var(--color-accent-light)" }}
                    />
                  ))}

                <span
                  className={`font-mono text-[9px] font-semibold tabular-nums ${
                    on ? "" : "text-white/70"
                  }`}
                  style={
                    on ? { color: "var(--color-accent-light)" } : undefined
                  }
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-display mt-1 text-[12.5px] font-semibold ${
                    on ? "text-white" : "text-white/80"
                  }`}
                >
                  {it.title}
                </span>
                <span
                  className={`font-mono mt-1 line-clamp-2 text-[10.5px] leading-snug ${
                    on ? "text-white" : "text-white/70"
                  }`}
                >
                  {it.desc}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
