"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { viewRelaxed } from "@/lib/motion-viewport";

const SPRING = [0.32, 0.72, 0, 1] as const;

const rows = [
  {
    stat: "47%",
    label: "of calls go unanswered",
    title: "Missed Calls = Missed Revenue",
    body: "Every unanswered call is a job going to your competitor. Most businesses never even know how many leads they're losing this way.",
    improvement: "< 2%",
    improvementLabel: "miss rate with AI",
  },
  {
    stat: "5 min",
    label: "window before a lead goes cold",
    title: "Slow Follow-Up Kills Deals",
    body: "85% of leads won't call back if you miss them. Speed of response is your biggest competitive advantage — and most businesses ignore it.",
    improvement: "< 60s",
    improvementLabel: "response time",
  },
  {
    stat: "60%",
    label: "of web forms never get a response",
    title: "Website Forms Going Cold",
    body: "A visitor fills out your contact form. Nothing happens. They book your competitor while you're on a job.",
    improvement: "100%",
    improvementLabel: "response rate",
  },
  {
    stat: "0",
    label: "automated follow-ups at most businesses",
    title: "Manual Follow-Up Falls Apart",
    body: "Staff forget. Owners are busy. Leads slip through because the system depends on someone remembering to make a call.",
    improvement: "Fully",
    improvementLabel: "automated",
  },
  {
    stat: "3.8★",
    label: "average rating without review automation",
    title: "Reviews Left on the Table",
    body: "Happy customers don't leave reviews unless you ask. Nobody asks. Meanwhile, competitors with fewer skills rank higher on Google.",
    improvement: "4.8★",
    improvementLabel: "avg with automation",
  },
];

export default function ProblemStatement() {
  return (
    <section
      id="problem"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <hr className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 container-max">
        {/* Header — left-aligned block number, no eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-14 md:mb-16 max-w-[680px]"
        >
          <span
            className="block font-sora text-[clamp(56px,8vw,96px)] font-bold leading-none tracking-tight mb-4 select-none"
            style={{ color: "rgba(139,92,246,0.12)" }}
            aria-hidden
          >
            02
          </span>
          <h2 className="font-sora text-[clamp(28px,4.5vw,52px)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white">
            Most businesses don&apos;t need more leads. They need a system that converts the ones they already get.
          </h2>
        </motion.div>

        {/* Stat rows */}
        <div className="max-w-5xl mx-auto">
          {rows.map((row, i) => (
            <motion.div
              key={row.stat}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.5, ease: SPRING, delay: i * 0.08 }}
              className="grid grid-cols-1 md:grid-cols-[200px_1fr_160px] gap-4 md:gap-10 py-8 border-b items-start"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              {/* Mobile: stat + improvement side by side; desktop: stat only in col 1 */}
              <div className="flex items-start gap-4 md:block">
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className="font-sora text-[38px] md:text-[48px] font-bold leading-none tracking-tight"
                    style={{ color: "#a78bfa" }}
                  >
                    {row.stat}
                  </span>
                  <span
                    className="text-[12px] md:text-[13px] leading-snug max-w-[160px]"
                    style={{ color: "rgba(239,240,243,0.50)" }}
                  >
                    {row.label}
                  </span>
                </div>
                {/* Improvement pill — only shown inline on mobile */}
                <div
                  className="md:hidden flex flex-col gap-1 rounded-xl px-3 py-2.5 shrink-0"
                  style={{
                    background: "rgba(74,222,128,0.05)",
                    border: "1px solid rgba(74,222,128,0.15)",
                  }}
                >
                  <span
                    className="font-sora text-[18px] font-bold leading-none"
                    style={{ color: "#4ade80" }}
                  >
                    {row.improvement}
                  </span>
                  <span
                    className="text-[10px] leading-snug"
                    style={{ color: "rgba(74,222,128,0.70)" }}
                  >
                    {row.improvementLabel}
                  </span>
                </div>
              </div>

              {/* Pain copy */}
              <div className="pt-0 md:pt-2">
                <h3 className="font-sora text-[17px] md:text-[19px] font-semibold text-white leading-tight mb-2">
                  {row.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "rgba(239,240,243,0.70)" }}
                >
                  {row.body}
                </p>
              </div>

              {/* Improvement column — desktop only */}
              <div
                className="hidden md:flex flex-col gap-1 pt-1 md:pt-2 rounded-xl px-3 py-2.5 self-start"
                style={{
                  background: "rgba(74,222,128,0.05)",
                  border: "1px solid rgba(74,222,128,0.15)",
                }}
              >
                <span
                  className="font-sora text-[20px] md:text-[24px] font-bold leading-none"
                  style={{ color: "#4ade80" }}
                >
                  {row.improvement}
                </span>
                <span
                  className="text-[10px] md:text-[11px] leading-snug"
                  style={{ color: "rgba(74,222,128,0.70)" }}
                >
                  {row.improvementLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA — centered */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.2, ease: SPRING }}
          className="mt-12 flex flex-col items-center text-center gap-5"
        >
          <p
            className="font-sora text-[18px] md:text-[20px] font-semibold leading-snug max-w-[560px]"
            style={{ color: "#eff0f3" }}
          >
            You don&apos;t need more software.
            <br />
            You need a connected system that works while you&apos;re on the job.
          </p>
          <a
            href="#offer"
            className="inline-flex flex-col items-center gap-1.5 text-[14px] font-semibold transition-colors duration-200"
            style={{ color: "#a78bfa" }}
          >
            <span>See the system</span>
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
