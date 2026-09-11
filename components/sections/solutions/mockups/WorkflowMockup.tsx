"use client";

import { motion } from "framer-motion";
import { Brain, PaperPlaneTilt, Heart } from "@phosphor-icons/react/dist/ssr";
import { SiGmail } from "react-icons/si";
import { viewRelaxed } from "@/lib/motion-viewport";

const GMAIL_COLOR = "#EA4335";

const STEPS = [
  { label: "Email inquiry received", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Intent identified", Icon: Brain, color: "var(--color-accent-light)" },
  { label: "Response drafted", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Response checked", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Personalized response sent", Icon: PaperPlaneTilt, color: "var(--color-accent-light)" },
  { label: "Lead stays engaged", Icon: Heart, color: "var(--color-accent-light)" },
];

export default function WorkflowMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[1100px] px-8 py-8 sm:px-14">
      <div className="relative flex items-start justify-between">
        {/* horizontal rail */}
        <div
          className="absolute left-6 right-6 top-6 h-px"
          style={{ background: "rgba(255,255,255,0.10)" }}
          aria-hidden
        />
        {STEPS.map((step, i) => {
          const isBrand = step.color.startsWith("#");
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewRelaxed}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative z-10 flex w-[120px] flex-col items-center gap-3 text-center"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                style={{
                  // Opaque fill so the rail behind never shows through the icon.
                  background: isBrand
                    ? `color-mix(in srgb, ${step.color} 16%, #131316)`
                    : "color-mix(in srgb, var(--color-accent) 16%, #131316)",
                  border: `1px solid ${isBrand ? `${step.color}4D` : "rgba(124,77,255,0.30)"}`,
                }}
              >
                <step.Icon size={18} color={step.color} />
              </span>
              <span
                className="font-mono text-[11.5px] leading-snug"
                style={{ color: "rgba(245,245,244,0.7)" }}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
