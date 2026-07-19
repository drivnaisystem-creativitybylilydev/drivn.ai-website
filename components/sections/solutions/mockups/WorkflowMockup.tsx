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
    <div className="glass-card glass-glow w-full max-w-[360px] p-6">
      <div className="relative pl-1">
        <div className="absolute left-[24px] top-3 bottom-3 w-px" style={{ background: "rgba(255,255,255,0.10)" }} aria-hidden />
        <div className="flex flex-col gap-2.5">
          {STEPS.map((step, i) => {
            const isBrand = step.color.startsWith("#");
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewRelaxed}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex items-center gap-4 h-9"
              >
                <span
                  className="relative z-10 shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: isBrand ? `${step.color}1A` : "rgba(124,77,255,0.10)",
                    border: `1px solid ${isBrand ? `${step.color}4D` : "rgba(124,77,255,0.30)"}`,
                  }}
                >
                  <step.Icon size={16} color={step.color} />
                </span>
                <span className="font-mono text-[12.5px]" style={{ color: "rgba(245,245,244,0.7)" }}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
