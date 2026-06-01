"use client";

import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";
import { MessageSquare, Search, Wrench, Rocket, TrendingUp } from "lucide-react";

const SPRING = [0.32, 0.72, 0, 1] as const;

const steps = [
  {
    number: "01",
    title: "Discovery",
    subtitle: "Free 15-minute call",
    description:
      "We talk through how your business currently handles leads — where they come from, how fast you respond, and how many you're actually converting. You'll leave this call knowing exactly where the gaps are.",
    icon: MessageSquare,
  },
  {
    number: "02",
    title: "Audit",
    subtitle: "Deep-dive analysis",
    description:
      "We map your full lead journey end-to-end: your website, follow-up speed, booking flow, and what's falling through the cracks. You get a clear picture of what's costing you money — even if we never work together.",
    icon: Search,
  },
  {
    number: "03",
    title: "Build",
    subtitle: "10–14 days",
    description:
      "We build your Lead Conversion System — website, follow-up automation, booking flow, CRM, and review requests — tailored to your business and the way you work.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Launch",
    subtitle: "You're live",
    description:
      "Your system goes live and starts working immediately. We walk you through everything, make sure your team is comfortable, and stay available for the first 30 days.",
    icon: Rocket,
  },
  {
    number: "05",
    title: "Optimize",
    subtitle: "Ongoing monthly",
    description:
      "Every month we review what's working, tune what isn't, and improve your system as your business grows. Your competitors are not doing this. You will be.",
    icon: TrendingUp,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-14 md:py-20 overflow-hidden"
    >
      <div className="container-max">
        {/* Header — left-aligned block number, no eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-10 md:mb-14 max-w-[560px]"
        >
          <span
            className="block font-sora text-[clamp(56px,8vw,96px)] font-bold leading-none tracking-tight mb-4 select-none"
            style={{ color: "rgba(139,92,246,0.12)" }}
            aria-hidden
          >
            04
          </span>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white">
            Simple process. Fast results.
          </h2>
        </motion.div>

        {/* Steps — left-aligned list with connecting line */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical connecting line */}
          <motion.div
            className="absolute left-[19px] top-8 bottom-8 w-px origin-top hidden md:block"
            style={{
              background:
                "linear-gradient(to bottom, #8b5cf6 0%, rgba(139,92,246,0.30) 70%, transparent 100%)",
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={viewRelaxed}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />

          <div className="flex flex-col gap-8 md:gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="relative flex gap-6 md:gap-8 pl-0 md:pl-14"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewRelaxed}
                  transition={{
                    duration: 0.55,
                    ease: SPRING,
                    delay: 0.1 + i * 0.1,
                  }}
                >
                  {/* Number circle */}
                  <motion.div
                    className="absolute left-0 top-0 hidden md:flex w-10 h-10 rounded-full items-center justify-center shrink-0 z-10 font-sora text-[13px] font-bold"
                    style={{
                      background: "rgba(139,92,246,0.18)",
                      border: "1px solid rgba(139,92,246,0.40)",
                      color: "#a78bfa",
                      boxShadow: "0 0 0 4px rgba(139,92,246,0.06)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={viewRelaxed}
                    transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 20,
                      delay: 0.15 + i * 0.1,
                    }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Content */}
                  <div
                    className="flex-1 rounded-2xl p-6 md:p-7"
                    style={{
                      background: "rgba(15,18,32,0.70)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04)",
                    }}
                  >
                    <div className="flex items-baseline gap-3 mb-2">
                      <span
                        className="font-sora text-[12px] font-bold shrink-0 md:hidden"
                        style={{ color: "rgba(139,92,246,0.65)" }}
                      >
                        {step.number}
                      </span>
                      <div>
                        <h3 className="font-sora text-[17px] font-semibold text-white leading-tight">
                          {step.title}
                        </h3>
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: "rgba(139,92,246,0.80)" }}
                        >
                          {step.subtitle}
                        </span>
                      </div>
                    </div>
                    <p
                      className="text-[14px] leading-relaxed mt-2"
                      style={{ color: "rgba(239,240,243,0.72)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
