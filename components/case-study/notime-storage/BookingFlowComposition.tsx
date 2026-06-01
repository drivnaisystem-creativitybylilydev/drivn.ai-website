"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, CreditCard, Mail, MousePointer, PackageCheck } from "lucide-react";

const STEPS = [
  { label: "Customer visits site",    sub: "Professional first impression",     Icon: MousePointer,  accent: "#a78bfa" },
  { label: "Selects storage option",  sub: "Real-time availability shown",       Icon: PackageCheck,  accent: "#60a5fa" },
  { label: "Picks move-in date",      sub: "Instant scheduling, no phone calls", Icon: CalendarCheck, accent: "#34d399" },
  { label: "Pays Stripe deposit",     sub: "Card, Apple Pay, Link — secured",    Icon: CreditCard,    accent: "#fbbf24" },
  { label: "Confirmation sent",       sub: "Automated email — job is locked in", Icon: Mail,          accent: "#fb923c" },
];

const STEP_MS = 1500;
const HOLD_MS = 2600;

export function BookingFlowComposition() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;

    const tick = (current: number) => {
      const next = current + 1;
      if (next <= STEPS.length) {
        id = setTimeout(() => { setStep(next); tick(next); }, next === STEPS.length ? HOLD_MS : STEP_MS);
      } else {
        id = setTimeout(() => { setStep(0); tick(0); }, 200);
      }
    };

    tick(0);
    return () => clearTimeout(id);
  }, []);

  const isHolding = step === STEPS.length;

  return (
    <div className="flex flex-col gap-0 px-1 py-2">
      {STEPS.map((s, i) => {
        const isActive    = step === i;
        const isCompleted = step > i;
        const isPending   = !isActive && !isCompleted;
        const Icon        = s.Icon;

        return (
          <div key={s.label} className="flex flex-col" style={{ alignItems: "flex-start" }}>
            <motion.div
              className="flex w-full items-center gap-3 py-1"
              animate={{ opacity: isPending ? 0.25 : 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* Circle node */}
              <motion.div
                className="relative flex shrink-0 items-center justify-center rounded-full"
                style={{ width: 36, height: 36, border: "1.5px solid rgba(255,255,255,0.10)" }}
                animate={{
                  background:  isActive || isCompleted ? `${s.accent}22` : "rgba(255,255,255,0.03)",
                  borderColor: isActive || isCompleted ? s.accent : "rgba(255,255,255,0.10)",
                  boxShadow:   isActive ? `0 0 18px ${s.accent}50` : "none",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="pulse"
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1.5px solid ${s.accent}` }}
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 1.7, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </AnimatePresence>
                <Icon
                  style={{
                    width: 15, height: 15,
                    color: isActive || isCompleted ? s.accent : "rgba(255,255,255,0.2)",
                    transition: "color 0.35s ease",
                  }}
                  strokeWidth={1.75}
                />
              </motion.div>

              {/* Text */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <motion.span
                  style={{ fontFamily: "var(--font-inter, system-ui)", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}
                  animate={{ color: isActive ? s.accent : isCompleted ? "#eff0f3" : "rgba(239,240,243,0.28)" }}
                  transition={{ duration: 0.35 }}
                >
                  {s.label}
                </motion.span>
                <AnimatePresence>
                  {(isActive || isCompleted) && (
                    <motion.span
                      key={`sub-${i}`}
                      style={{ fontSize: 10, lineHeight: 1.3, color: isActive ? `${s.accent}BB` : "rgba(239,240,243,0.38)", display: "block", overflow: "hidden" }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 14 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.26, ease: "easeOut" }}
                    >
                      {s.sub}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Check badge */}
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
                      <circle cx="8" cy="8" r="7.5" fill={`${s.accent}22`} stroke={s.accent} strokeWidth="1" />
                      <polyline points="4.5,8.2 7,10.5 11.5,5" stroke={s.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{ marginLeft: 17, width: 2, height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                <motion.div
                  style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100%", transformOrigin: "top", background: `linear-gradient(to bottom, ${s.accent}, ${STEPS[i + 1].accent})`, borderRadius: 2 }}
                  animate={{ scaleY: isCompleted ? 1 : 0 }}
                  initial={{ scaleY: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}

      <motion.p
        className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(52,211,153,0.5)" }}
        animate={{ opacity: isHolding ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        ✓ Job secured — zero manual work
      </motion.p>
    </div>
  );
}
