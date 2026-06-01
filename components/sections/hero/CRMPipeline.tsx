"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Phone,
  CheckCircle,
  CalendarCheck,
  Briefcase,
  Star,
} from "lucide-react";

const STAGES = [
  { label: "New Lead",         Icon: UserPlus,      accent: "#a78bfa", sub: "Inquiry received" },
  { label: "Contacted",        Icon: Phone,         accent: "#a78bfa", sub: "Auto-response sent in 41s" },
  { label: "Qualified",        Icon: CheckCircle,   accent: "#818cf8", sub: "Lead scored & confirmed" },
  { label: "Booked",           Icon: CalendarCheck, accent: "#60a5fa", sub: "Appointment confirmed" },
  { label: "Completed",        Icon: Briefcase,     accent: "#4ade80", sub: "Job completed" },
  { label: "Review Requested", Icon: Star,          accent: "#fbbf24", sub: "Auto-review request sent" },
];

// step 0..5 = that stage is currently active
// step 6    = all done, hold state
// then resets to 0
const STAGE_MS  = 1400; // time each stage is "active"
const HOLD_MS   = 2400; // time to hold the completed state before reset

export function CRMPipeline() {
  // step 0-5: which stage is active. step 6: hold (all complete). -1: brief blank on reset
  const [step, setStep] = useState(0);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

    const tick = (current: number) => {
      const next = current + 1;

      if (next <= STAGES.length) {
        // advance through stages then into hold (step === STAGES.length)
        id = setTimeout(() => {
          setStep(next);
          tick(next);
        }, next === STAGES.length ? HOLD_MS : STAGE_MS);
      } else {
        // hold is done — reset cleanly
        id = setTimeout(() => {
          setStep(0);
          tick(0);
        }, 200);
      }
    };

    tick(0);
    return () => clearTimeout(id);
  }, []);

  const isHolding = step === STAGES.length;

  return (
    <div className="flex flex-col gap-0">
      {STAGES.map((stage, i) => {
        const isActive    = step === i;
        const isCompleted = step > i; // includes hold state
        const isPending   = !isActive && !isCompleted;
        const Icon        = stage.Icon;

        return (
          <div key={stage.label} className="flex flex-col" style={{ alignItems: "flex-start" }}>

            {/* Row */}
            <motion.div
              className="flex items-center gap-3 py-1 w-full"
              animate={{ opacity: isPending ? 0.28 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Circle node */}
              <motion.div
                className="relative flex items-center justify-center rounded-full shrink-0"
                style={{ width: 36, height: 36, border: "1.5px solid rgba(255,255,255,0.12)" }}
                animate={{
                  background:   isActive || isCompleted ? `${stage.accent}22` : "rgba(255,255,255,0.04)",
                  borderColor:  isActive || isCompleted ? stage.accent         : "rgba(255,255,255,0.12)",
                  boxShadow:    isActive ? `0 0 16px ${stage.accent}55`        : "none",
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {/* Pulse ring — only when active */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="pulse"
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1.5px solid ${stage.accent}` }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.65, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.0, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>

                <Icon
                  style={{
                    width: 16,
                    height: 16,
                    color: isActive || isCompleted ? stage.accent : "rgba(255,255,255,0.22)",
                    transition: "color 0.35s ease",
                  }}
                  strokeWidth={1.75}
                />
              </motion.div>

              {/* Label + subtitle */}
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <motion.span
                  style={{ fontFamily: "var(--font-sora, system-ui)", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}
                  animate={{
                    color: isActive
                      ? stage.accent
                      : isCompleted
                      ? "#eff0f3"
                      : "rgba(239,240,243,0.30)",
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {stage.label}
                </motion.span>

                <AnimatePresence>
                  {(isActive || isCompleted) && (
                    <motion.span
                      key={`sub-${i}`}
                      style={{
                        fontSize: 10,
                        lineHeight: 1.3,
                        color: isActive ? `${stage.accent}BB` : "rgba(239,240,243,0.38)",
                        overflow: "hidden",
                        display: "block",
                      }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 14 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      {stage.sub}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Checkmark badge */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    key={`check-${i}`}
                    className="shrink-0"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 520, damping: 22 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="7.5" fill={`${stage.accent}22`} stroke={stage.accent} strokeWidth="1" />
                      <polyline points="4.5,8.2 7,10.5 11.5,5" stroke={stage.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Connector line — between each stage except the last */}
            {i < STAGES.length - 1 && (
              <div
                style={{
                  marginLeft: 17,
                  width: 2,
                  height: 16,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    transformOrigin: "top",
                    background: `linear-gradient(to bottom, ${stage.accent}, ${STAGES[i + 1].accent})`,
                    borderRadius: 2,
                  }}
                  animate={{ scaleY: isCompleted ? 1 : 0 }}
                  initial={{ scaleY: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}

          </div>
        );
      })}

      {/* Footer label */}
      <motion.p
        className="text-center text-[10px] uppercase tracking-[0.18em] font-semibold mt-3"
        style={{ color: "rgba(139,92,246,0.45)" }}
        animate={{ opacity: isHolding ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        Automated · Running 24/7
      </motion.p>
    </div>
  );
}
