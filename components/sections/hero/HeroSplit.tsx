"use client";

import { motion } from "framer-motion";
import { HeroLeftColumn } from "./HeroLeftColumn";
import { HeroBulletColumn } from "./HeroBulletColumn";

const fadeInFromLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInFromRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const splitContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
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
      className="hero-split grid w-full min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 xl:gap-12 items-start lg:items-stretch"
      variants={splitContainer}
      initial="initial"
      animate="animate"
    >
      <HeroLeftColumn variants={fadeInFromLeft} />
      <HeroBulletColumn variants={fadeInFromRight} />
    </motion.div>
  );
}
