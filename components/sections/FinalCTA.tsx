"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { viewRelaxed } from "@/lib/motion-viewport";

const SPRING = [0.32, 0.72, 0, 1] as const;

export default function FinalCTA() {
  const { openAuditForm } = useAuditForm();

  return (
    <section
      id="contact"
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* No grid bg. No orb. Negative space does the work. */}
      <hr className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 container-max">
        <div className="max-w-[760px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.65, ease: SPRING }}
          >
            {/* Horizontal rule label — replaces eyebrow pill */}
            <div className="flex items-center gap-4 mb-10">
              <div
                style={{
                  width: 32,
                  height: 2,
                  background: "#8b5cf6",
                  borderRadius: 1,
                }}
              />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ color: "rgba(139,92,246,0.65)" }}
              >
                Lead Conversion
              </span>
            </div>

            {/* Setup line — muted */}
            <h2
              className="font-sora font-semibold leading-[1.06] tracking-[-0.025em] text-balance mb-3"
              style={{
                fontSize: "clamp(26px,4vw,44px)",
                color: "rgba(239,240,243,0.65)",
              }}
            >
              If leads are coming in but not turning into booked appointments,
            </h2>

            {/* Punchline — accent, own visual tier */}
            <p
              className="font-sora font-semibold leading-[1.06] tracking-[-0.03em] text-balance mb-10"
              style={{
                fontSize: "clamp(30px,4.8vw,54px)",
                color: "#a78bfa",
              }}
            >
              your follow-up system is the leak.
            </p>

            <p
              className="text-[17px] leading-relaxed mb-10 max-w-[520px]"
              style={{ color: "rgba(239,240,243,0.72)" }}
            >
              Book a free 15-minute Lead Conversion Audit. We&apos;ll show you
              exactly where inquiries are slipping away — and what it would take
              to fix it. No pitch. No obligation.
            </p>

            {/* Primary CTA */}
            <motion.button
              type="button"
              onClick={() => openAuditForm()}
              className="btn-primary group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              data-cursor-ring
            >
              <span className="btn-primary-text">Book a Free Lead Conversion Audit</span>
              <span className="btn-pocket" aria-hidden>
                <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
              </span>
            </motion.button>

            {/* Trust tokens */}
            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-2 mt-7"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {[
                "15 minutes",
                "No sales pitch",
                "Actual audit — not a demo",
                "Keep insights either way",
              ].map((token) => (
                <span
                  key={token}
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(239,240,243,0.38)" }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "rgba(139,92,246,0.60)" }}
                    aria-hidden
                  />
                  {token}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
