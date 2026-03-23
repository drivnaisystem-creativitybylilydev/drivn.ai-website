"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { HeroSplit } from "@/components/sections/hero/HeroSplit";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-brand-dark/50" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-24">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.15,
              },
            },
          }}
          className="space-y-10 md:space-y-12"
        >
          <HeroSplit />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#problem"
            aria-label="Scroll down"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
          >
            <ChevronDown className="h-8 w-8" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
