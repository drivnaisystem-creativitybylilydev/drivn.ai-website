"use client";

import Image from "next/image";
import { ChevronDown, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const fadeInFromLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInFromBottom = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const fadeInFromRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function Hero() {
  const { openAuditForm } = useAuditForm();
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24">
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
          {/* Split section: title left, bullets right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Title */}
            <motion.h1
              variants={fadeInFromLeft}
              className="leading-tight flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <span className="text-5xl md:text-6xl lg:text-7xl font-sora font-bold text-white whitespace-nowrap">
                You&apos;re <span className="underline-glow-purple">Losing Revenue</span>.
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold text-neon-purple whitespace-nowrap">
                We Know Where.
              </span>
            </motion.h1>

            {/* Right: Bullet points */}
            <motion.div variants={fadeInFromRight} className="flex flex-col items-center lg:items-start">
              <ul className="space-y-4 flex flex-col items-stretch w-fit">
                <li className="flex items-center gap-3 w-full">
                  <CheckCircle
                    className="h-7 w-7 flex-shrink-0 text-brand-purple-light"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
                    }}
                  />
                  <span className="text-lg md:text-xl lg:text-2xl font-inter text-white leading-relaxed underline-glow-purple underline-glow-purple-bullet whitespace-nowrap">
                    Stop leaving money on the table.
                  </span>
                </li>
                <li className="flex items-center gap-3 w-full">
                  <CheckCircle
                    className="h-7 w-7 flex-shrink-0 text-brand-purple-light"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
                    }}
                  />
                  <span className="text-lg md:text-xl lg:text-2xl font-inter text-white leading-relaxed underline-glow-purple underline-glow-purple-bullet whitespace-nowrap">
                    Book more jobs by responding faster.
                  </span>
                </li>
                <li className="flex items-center gap-3 w-full">
                  <CheckCircle
                    className="h-7 w-7 flex-shrink-0 text-brand-purple-light"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
                    }}
                  />
                  <span className="text-lg md:text-xl lg:text-2xl font-inter text-white leading-relaxed underline-glow-purple underline-glow-purple-bullet whitespace-nowrap">
                    Scale without expensive hiring.
                  </span>
                </li>
                <li className="flex items-center gap-3 w-full">
                  <CheckCircle
                    className="h-7 w-7 flex-shrink-0 text-brand-purple-light"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(167, 139, 250, 0.6)) drop-shadow(0 0 12px rgba(167, 139, 250, 0.4))",
                    }}
                  />
                  <span className="text-lg md:text-xl lg:text-2xl font-inter text-white leading-relaxed underline-glow-purple underline-glow-purple-bullet">
                    More time to run your business, less on tedious admin.
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom: Centered subtext + buttons */}
          <div className="flex flex-col items-center text-center">
            <motion.p
              variants={fadeInFromBottom}
              className="text-xl md:text-2xl lg:text-3xl font-inter text-white font-medium pt-4 md:pt-6 w-full max-w-3xl mx-auto"
            >
              <span className="whitespace-nowrap">The question isn&apos;t whether it&apos;s possible — it&apos;s whether</span>{" "}
              you&apos;re ready to <span className="text-brand-purple-light">find out how</span>.
            </motion.p>

            <motion.div
              variants={fadeInFromBottom}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                size="lg"
                className="px-8 bg-violet-900 hover:bg-violet-800 shadow-[0_0_24px_rgba(88,28,135,0.6)]"
                onClick={openAuditForm}
              >
                Book Free Audit
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="border-2 border-violet-900"
              >
                <a href="#work">See Results</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
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
