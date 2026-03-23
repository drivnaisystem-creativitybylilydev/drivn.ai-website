"use client";

import { CheckCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { HERO_BULLET_POINTS } from "./hero-content";

type HeroBulletColumnProps = {
  variants: Variants;
};

/**
 * Right column: subheading + checklist. Own layout box — tweak list styling here without touching headline.
 */
export function HeroBulletColumn({ variants }: HeroBulletColumnProps) {
  return (
    <motion.div
      variants={variants}
      data-hero-region="bullets"
      className="hero-split__bullets hero-split-bullets flex min-h-0 min-w-0 w-full max-w-full flex-col overflow-visible items-center lg:h-full lg:items-start"
    >
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-sora font-bold text-white mb-6">
        Stop Losing While Your Competitors{" "}
        <span className="text-brand-purple-light">Automate</span>.
      </h2>
      <ul className="space-y-3 flex flex-col items-stretch w-full max-w-full list-none pl-0">
        {HERO_BULLET_POINTS.map((text) => (
          <li key={text} className="flex items-start gap-3 w-full">
            <CheckCircle
              className="h-6 w-6 flex-shrink-0 mt-0.5 text-brand-purple-light"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
              }}
            />
            <span className="text-base md:text-lg lg:text-xl font-inter text-white leading-relaxed">
              {text}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
