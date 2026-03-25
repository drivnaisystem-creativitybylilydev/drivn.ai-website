"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import ChaosToOrderGraphic from "@/components/ChaosToOrderGraphic";
import { viewRelaxed } from "@/lib/motion-viewport";

export default function ProblemStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const graphicsOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 1]);
  const graphicsX = useTransform(scrollYProgress, [0, 0.25], [30, 0]);

  return (
    <section
      id="problem"
      ref={ref}
      className="relative overflow-hidden border-t border-brand-purple/20 pb-12 pt-20 md:pb-16 md:pt-32"
    >
      {/* Continuous purple lines — matches hero, no hard black seam */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Writing */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 space-y-8 lg:order-1"
          >
            <h2 className="font-sora text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
              The Problem...
            </h2>
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              Too much time and money goes into manual admin — spreadsheets, data
              entry, chasing leads, writing quotes. It keeps you from scaling the
              way you could.
            </p>
            <p className="font-sora text-xl font-semibold text-brand-purple-light md:text-2xl">
              We fix that. So you can scale without the grind.
            </p>
          </motion.div>

          {/* Right: Chaos → Order graphic */}
          <motion.div
            style={{ opacity: graphicsOpacity, x: graphicsX }}
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <div className="w-full max-w-xl lg:max-w-none">
              <ChaosToOrderGraphic />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
