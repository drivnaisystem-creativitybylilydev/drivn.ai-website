"use client";

import { motion, type Variants } from "framer-motion";
import { HeroLeftColumn } from "./HeroLeftColumn";
import { HeroBulletColumn } from "./HeroBulletColumn";

/**
 * Canonical stagger: parent `hidden` → `visible` so children reliably leave
 * `opacity: 0` (FM + React 19 can fail with `initial`/`animate` naming alone).
 */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Two isolated regions: headline (left) and value props (right).
 * DevTools: `#hero-split`, `[data-hero-region]`, `.hero-split__left`, `.hero-split__bullets`
 */
export function HeroSplit() {
  return (
    <motion.div
      id="hero-split"
      data-hero-split=""
      className="hero-split grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 xl:gap-10 items-start lg:items-stretch"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <HeroLeftColumn variants={fadeInFromLeft} />
      <HeroBulletColumn variants={fadeInFromRight} />
    </motion.div>
  );
}
