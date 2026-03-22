"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Globe,
  FileText,
  Mail,
  Phone,
  ArrowRight,
  Banknote,
  AlertTriangle,
} from "lucide-react";

// Business funnel steps: Lead → Quote → Follow-up → Book (bottlenecks flagged)
const funnelSteps = [
  { Icon: Globe, label: "Lead", isBottleneck: true },
  { Icon: FileText, label: "Quote", isBottleneck: true },
  { Icon: Mail, label: "Follow-up", isBottleneck: true },
  { Icon: Phone, label: "Book", isBottleneck: false },
];

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
      className="pt-20 md:pt-32 pb-12 md:pb-16 border-t border-brand-purple/20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Writing */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-sora font-semibold text-white">
              The Problem...
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Too much time and money goes into manual admin — spreadsheets, data
              entry, chasing leads, writing quotes. It keeps you from scaling the
              way you could.
            </p>
            <p className="text-xl md:text-2xl font-sora font-semibold text-brand-purple-light">
              We fix that. So you can scale without the grind.
            </p>
          </motion.div>

          {/* Right: Business system diagram - funnel with bottlenecks → where we fix */}
          <motion.div
            style={{ opacity: graphicsOpacity, x: graphicsX }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg flex flex-col md:flex-row items-center gap-6 md:gap-4">
              {/* Left: Business funnel with flagged bottlenecks */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="flex flex-row items-center gap-1">
                {funnelSteps.map(({ Icon, label, isBottleneck }, i) => (
                  <div key={i} className="flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                      className="relative"
                    >
                      <div
                        className={`rounded-xl border p-3 backdrop-blur-sm ${
                          isBottleneck
                            ? "border-amber-500/50 bg-amber-500/15"
                            : "border-white/20 bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isBottleneck ? "text-amber-400" : "text-white/70"
                          }`}
                        />
                      </div>
                      {isBottleneck && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-1.5 -right-1.5"
                        >
                          <AlertTriangle className="h-4 w-4 text-amber-400 fill-amber-500/30" />
                        </motion.div>
                      )}
                    </motion.div>
                    {i < funnelSteps.length - 1 && (
                      <div className="w-3 md:w-4 h-px bg-white/20 mx-0.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/50 mt-2 text-center">
                  Your funnel · bottlenecks flagged
                </span>
              </motion.div>

              {/* Arrow - "where we fix" */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center gap-1"
              >
                <ArrowRight className="h-8 w-8 text-brand-purple" />
                <span className="text-[10px] font-medium text-brand-purple/90 uppercase tracking-wider whitespace-nowrap">
                  We fix here
                </span>
              </motion.div>

              {/* Right: Optimized outcome → Revenue */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 rounded bg-gradient-to-r from-brand-purple/60 to-brand-purple" />
                  <span className="text-[10px] uppercase tracking-wider text-brand-purple-light/80">
                    Streamlined
                  </span>
                </div>
                <div className="relative">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                        "0 0 30px rgba(139, 92, 246, 0.5)",
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-4 rounded-2xl border border-brand-purple/40 bg-brand-purple/20 backdrop-blur-sm"
                  >
                    <Banknote className="h-10 w-10 text-brand-purple-light" />
                  </motion.div>
                </div>
                <div className="flex gap-1.5 items-end h-14">
                  {[20, 32, 44, 28, 48].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: h }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.9 + i * 0.08,
                        ease: "easeOut",
                      }}
                      className="w-2 rounded-t bg-gradient-to-t from-brand-purple/80 to-brand-purple-light"
                    />
                  ))}
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 }}
                  className="text-xs font-semibold text-brand-purple-light uppercase tracking-wider"
                >
                  Revenue
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}