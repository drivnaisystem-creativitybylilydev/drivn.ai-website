"use client";

import { CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { HERO_BULLET_POINTS } from "./hero-content";

/** Parent orchestrates stagger; each line fades up into place. */
const bulletColumnContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const bulletReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Value-prop checklist — single column width; icons left of text, left-aligned copy.
 */
export function HeroBulletColumn() {
  return (
    <motion.div
      variants={bulletColumnContainer}
      initial="hidden"
      animate="visible"
      data-hero-region="bullets"
      className="hero-split__bullets hero-split-bullets flex w-full max-w-6xl flex-col items-stretch overflow-visible text-left"
    >
      <motion.h2
        variants={bulletReveal}
        className="mb-8 max-w-full pb-1 font-sora text-2xl font-bold leading-tight text-white text-balance md:mb-10 md:text-3xl lg:text-5xl"
      >
        Stop Losing While Your Competitors{" "}
        <span className="text-brand-purple-light">Automate</span>.
      </motion.h2>
      <ul className="flex w-full list-none flex-col space-y-4 pl-0 md:space-y-5">
        {HERO_BULLET_POINTS.map((text) => (
          <motion.li
            key={text}
            variants={bulletReveal}
            className="flex w-full max-w-full flex-row items-start gap-3 md:gap-4"
          >
            <CheckCircle
              className="mt-0.5 h-6 w-6 shrink-0 text-brand-purple-light md:h-7 md:w-7"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
              }}
            />
            <span className="min-w-0 flex-1 text-base font-inter leading-relaxed text-white md:text-lg lg:text-xl">
              {text}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
