"use client";

import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ArrowRight } from "lucide-react";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const SPRING = [0.32, 0.72, 0, 1] as const;

const industries = [
  { label: "HVAC",                 desc: "Missed calls and seasonal demand spikes" },
  { label: "Plumbing",             desc: "Emergency leads who need fast responses" },
  { label: "Roofing",              desc: "High-value jobs lost to slow follow-up" },
  { label: "Landscaping",          desc: "Repeat clients and seasonal booking" },
  { label: "Electrical",           desc: "Complex quoting and scheduling" },
  { label: "Med Spa / Aesthetics", desc: "High-ticket bookings and repeat visits" },
  { label: "Physiotherapy",        desc: "Insurance queries and appointment flow" },
  { label: "Dental Clinics",       desc: "New patient intake and recall automation" },
  { label: "Cleaning Services",    desc: "Recurring bookings and lead qualification" },
  { label: "Pest Control",         desc: "Urgent leads and seasonal demand" },
  { label: "Moving Companies",     desc: "Quote requests and booking conversion" },
  { label: "Professional Services",desc: "Consultants and service firms with slow admin" },
];

const tagVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: SPRING },
  },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function IndustriesWeServe() {
  const { openAuditForm } = useAuditForm();

  return (
    <section
      id="industries"
      className="relative py-14 md:py-20 overflow-hidden"
    >
      {/* Subtle purple radial */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.05) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-10 md:mb-14 max-w-[600px]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 28, height: 1, background: "rgba(139,92,246,0.55)", borderRadius: 1 }} />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.20em]"
              style={{ color: "rgba(139,92,246,0.60)" }}
            >
              Industries
            </span>
          </div>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white">
            If you rely on leads, calls, or appointments — we can help.
          </h2>
          <p
            className="mt-4 text-[16px] leading-relaxed"
            style={{ color: "rgba(239,240,243,0.78)" }}
          >
            We work best with service businesses that have a steady flow of
            inquiries but no system to convert them consistently.
          </p>
        </motion.div>

        {/* Industry tag grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={viewRelaxed}
        >
          {industries.map((industry) => (
            <motion.div
              key={industry.label}
              className="flex items-start gap-3 p-4 rounded-xl group cursor-default"
              style={{
                background: "rgba(20,26,46,0.90)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              variants={tagVariants}
              whileHover={{
                borderColor: "rgba(139,92,246,0.22)",
                background: "rgba(139,92,246,0.05)",
              }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#8b5cf6" }}
                aria-hidden
              />
              <div>
                <p className="text-[14px] font-semibold text-white leading-tight">
                  {industry.label}
                </p>
                <p
                  className="text-[12px] mt-0.5 leading-snug"
                  style={{ color: "rgba(239,240,243,0.68)" }}
                >
                  {industry.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.15, ease: SPRING }}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <p
            className="text-[15px] max-w-[480px] leading-relaxed"
            style={{ color: "rgba(239,240,243,0.78)" }}
          >
            Don&apos;t see your industry? If you&apos;re a service business with a
            lead-to-booking problem, we&apos;ve likely built a system for it.
          </p>
          <button
            type="button"
            onClick={() => openAuditForm()}
            className="shrink-0 inline-flex items-center gap-2 text-[13px] font-semibold transition-colors duration-200"
            style={{ color: "#a78bfa" }}
          >
            Let&apos;s talk
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
