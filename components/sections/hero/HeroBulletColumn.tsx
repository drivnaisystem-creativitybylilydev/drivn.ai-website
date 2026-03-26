"use client";

import { CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { HERO_BULLET_POINTS } from "./hero-content";

/** Parent only orchestrates stagger; each line slides in from the right. */
const bulletColumnContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

const bulletFromRight: Variants = {
  hidden: { opacity: 0, x: 44 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Right column: subheading + checklist. Heading and each bullet stagger in from the right.
 */
export function HeroBulletColumn() {
  return (
    <motion.div
      variants={bulletColumnContainer}
      data-hero-region="bullets"
      className="hero-split__bullets hero-split-bullets flex min-h-0 min-w-0 w-full max-w-full flex-col overflow-visible items-center lg:h-full lg:items-start"
    >
      <motion.h2
        variants={bulletFromRight}
        className="text-2xl md:text-3xl lg:text-5xl font-sora font-bold text-white mb-6"
      >
        Stop Losing While Your Competitors{" "}
        <span className="text-brand-purple-light">Automate</span>.
      </motion.h2>
      <ul className="flex w-full max-w-full list-none flex-col items-stretch space-y-3 pl-0">
        {HERO_BULLET_POINTS.map((text) => (
          <motion.li
            key={text}
            variants={bulletFromRight}
            className="flex w-full items-start gap-3"
          >
            <CheckCircle
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-purple-light"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
              }}
            />
            <span className="text-base font-inter leading-relaxed text-white md:text-lg lg:text-xl">
              {text}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
