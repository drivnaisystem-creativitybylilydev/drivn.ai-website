"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroLeftColumn } from "./HeroLeftColumn";
import { HeroBulletColumn } from "./HeroBulletColumn";

const AUTO_ADVANCE_MS = 6500;
const SLIDE_COUNT = 2;
const SWIPE_MIN_PX = 50;
const SWIPE_RATIO = 1.15; // horizontal must exceed vertical * ratio to count as swipe

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

const arrowBtnClass =
  "z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-purple/50 bg-brand-dark/90 text-brand-purple-light shadow-[0_0_28px_rgba(139,92,246,0.35)] backdrop-blur-sm transition hover:border-brand-purple-light hover:bg-brand-purple/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple-light active:scale-95 md:h-12 md:w-12";

function useHorizontalSwipe(onPrev: () => void, onNext: () => void) {
  const startRef = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startRef.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (Math.abs(dx) < SWIPE_MIN_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
      if (dx < 0) onNext();
      else onPrev();
    },
  };
}

/**
 * Auto-rotating carousel between headline/CTA and value-prop bullets.
 * Slides use overflow visible so the page (not an inner box) receives wheel scroll.
 * Mobile: no arrows; horizontal swipe + dots. `prefers-reduced-motion`: static split.
 */
export function HeroSplit() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDE_COUNT);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const swipeHandlers = useHorizontalSwipe(goPrev, goNext);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  if (reduceMotion) {
    return (
      <motion.div
        id="hero-split"
        data-hero-split=""
        className="hero-split grid min-h-[min(28rem,70svh)] w-full min-w-0 grid-cols-1 items-center gap-10 lg:min-h-[32rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-12 xl:gap-14"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroLeftColumn variants={fadeInFromLeft} />
        <div className="flex min-h-0 w-full justify-center lg:justify-start">
          <div className="w-full max-w-6xl">
            <HeroBulletColumn />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      id="hero-split"
      data-hero-split=""
      className="hero-split relative w-full min-w-0"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      {/* touch-pan-y: browser keeps vertical scroll; we only react to clear horizontal swipes in JS */}
      <div className="relative w-full touch-pan-y">
        <button
          type="button"
          aria-label="Previous slide"
          className={`${arrowBtnClass} absolute left-0 top-1/2 hidden -translate-y-1/2 md:flex`}
          onClick={goPrev}
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className={`${arrowBtnClass} absolute right-0 top-1/2 hidden -translate-y-1/2 md:flex`}
          onClick={goNext}
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} aria-hidden />
        </button>

        <div
          className="w-full px-0 md:px-14"
          {...swipeHandlers}
        >
          <div className="relative min-h-[min(32rem,82svh)] w-full min-w-0 md:min-h-[min(36rem,78svh)] lg:min-h-[min(38rem,72svh)]">
            <AnimatePresence mode="wait" initial={false}>
              {index === 0 ? (
                <motion.div
                  key="hero-slide-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label="Slide 1 of 2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={slideTransition}
                  className="absolute inset-0 flex min-h-0 w-full flex-col items-center overflow-visible px-1 py-6 sm:px-2 sm:py-8 md:py-10"
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex min-h-0 w-full max-w-full flex-col items-center justify-center"
                  >
                    <HeroLeftColumn variants={fadeInFromLeft} />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="hero-slide-1"
                  role="group"
                  aria-roledescription="slide"
                  aria-label="Slide 2 of 2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={slideTransition}
                  className="absolute inset-0 flex min-h-0 w-full flex-col items-center overflow-visible px-1 pb-8 pt-10 sm:px-2 sm:pb-10 sm:pt-12 md:pb-12 md:pt-14"
                >
                  <div className="flex w-full max-w-6xl flex-col items-stretch">
                    <HeroBulletColumn />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div
        className="mt-6 flex justify-center gap-2 md:mt-8"
        role="tablist"
        aria-label="Choose slide"
      >
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple-light ${
              index === i ? "bg-brand-purple-light" : "bg-white/25 hover:bg-white/40"
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
