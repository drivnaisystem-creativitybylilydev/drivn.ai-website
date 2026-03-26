"use client";

import { motion, type Variants } from "framer-motion";
import { HeroLeftColumn } from "./HeroLeftColumn";
import { HeroBulletColumn } from "./HeroBulletColumn";

/**
 * Left + right columns animate in parallel; bullet list staggers inside `HeroBulletColumn`.
 */
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
      <HeroBulletColumn />
    </motion.div>
  );
}
