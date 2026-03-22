"use client";

import { motion } from "framer-motion";
import { Zap, Target, Briefcase } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    heading: "Speed That Matters",
    text: "Weeks, not months. Every week you wait is revenue you don't capture. We move.",
  },
  {
    icon: Target,
    heading: "We Share the Risk",
    text: "You don't pay the full investment until you see results. No outcomes, no final payment. We're invested in your success, not just the project.",
  },
  {
    icon: Briefcase,
    heading: "We Only Do This",
    text: "Home services. Trades. Local businesses. We don't dabble. We've solved these problems before — and we know how to solve them for you.",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function WhyDrivn() {
  return (
    <section id="why-us" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            {...fadeInUp}
            className="text-3xl md:text-4xl font-sora font-semibold mb-6"
          >
            Why Businesses Choose Drivn.AI
          </motion.h2>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto"
          >
            Most firms sell solutions. We sell outcomes. Here&apos;s what that
            means in practice:
          </motion.p>
        </div>

        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.heading}
              className="p-6 border border-white/10 rounded-xl hover:border-brand-purple/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] transition-all duration-300"
            >
              <benefit.icon className="h-8 w-8 text-brand-purple mb-4" />
              <h3 className="text-xl font-sora font-semibold text-white mb-3">
                {benefit.heading}
              </h3>
              <p className="text-base text-white/70 leading-relaxed">
                {benefit.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
