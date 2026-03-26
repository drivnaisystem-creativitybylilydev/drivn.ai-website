"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroSplit } from "@/components/sections/hero/HeroSplit";
import { viewRelaxed } from "@/lib/motion-viewport";

/**
 * Map document scroll → 0–1 over a distance in viewport units. Larger factor = logo / intro
 * effects need more scrolling before they finish, so the mark stays visible until the hero
 * is mostly passed and the next section is nearly in view.
 */
const INTRO_SCROLL_FACTOR = 0.82;

function introT(scrollPixels: number): number {
  if (typeof window === "undefined") return 0;
  const h = window.innerHeight || 1;
  return Math.min(1, Math.max(0, scrollPixels / (h * INTRO_SCROLL_FACTOR)));
}

export default function Hero() {
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, (y) => {
    const t = introT(y);
    if (t <= 0.48) return 1;
    if (t >= 0.98) return 0;
    return 1 - (t - 0.48) / 0.5;
  });
  const scale = useTransform(scrollY, (y) => {
    const t = introT(y);
    if (t <= 0.5) return 1;
    if (t >= 0.98) return 0.82;
    return 1 - (1 - 0.82) * ((t - 0.5) / 0.48);
  });
  const liftY = useTransform(scrollY, (y) => {
    const t = introT(y);
    if (t <= 0.5) return 0;
    if (t >= 0.98) return -100;
    return -100 * ((t - 0.5) / 0.48);
  });
  const blurPx = useTransform(scrollY, (y) => {
    const t = introT(y);
    if (t <= 0.44) return 0;
    if (t >= 0.94) return 12;
    return 12 * ((t - 0.44) / 0.5);
  });
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);

  return (
    <section id="hero" className="relative scroll-mt-20 overflow-x-clip">
      {/* One background for logo + split (same stack as ProblemStatement) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-brand-dark" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/50" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6">
        <header className="flex flex-col items-center pt-[max(4.5rem,7svh)] md:pt-[max(5rem,8svh)]">
          <motion.div
            style={{ opacity, scale, y: liftY, filter }}
            className="flex min-h-0 w-full max-w-full flex-col items-center gap-1 px-4 text-center sm:px-6 md:px-8"
          >
            {/* leading-none + object-top: no baseline gap under img; align art to top of box so arrow isn’t pushed down by letterboxing */}
            <div className="w-full max-w-full leading-none md:max-w-[min(100%,88rem)]">
              <Image
                src="/brand/nobgwithlogo.png"
                alt="Drivn.AI"
                width={1600}
                height={500}
                priority
                className="mx-auto block h-auto w-full max-w-full object-contain object-top"
                sizes="100vw"
              />
            </div>

            <motion.div className="flex flex-col items-center pt-0.5" aria-hidden>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown className="h-5 w-5 text-white/30 md:h-6 md:w-6" strokeWidth={1.5} />
              </motion.div>
              <span className="mt-0 text-[0.65rem] text-white/30 md:text-xs">Scroll</span>
            </motion.div>
          </motion.div>
        </header>

        <div
          id="hero-main"
          className="scroll-mt-24 -mt-5 pt-0 md:-mt-7 md:scroll-mt-28 lg:-mt-9"
        >
          <HeroSplit />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewRelaxed}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-12 flex justify-center pb-10 md:mt-14 md:pb-12"
          >
            <motion.a
              href="#problem"
              aria-label="Scroll to next section"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-2 rounded-md text-white/60 transition-colors hover:text-white/80 active:scale-95 active:text-white/90"
            >
              <ChevronDown className="h-8 w-8" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
