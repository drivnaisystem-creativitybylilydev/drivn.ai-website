"use client";

import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";

const STROKE = "var(--color-accent-light)";
const DIM = "rgba(245,245,244,0.28)";
const SW = 1.75;

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: viewRelaxed,
  transition: { duration: 0.9, delay, ease: [0.32, 0.72, 0, 1] as const },
});

// Beat 1 — a message that sits unanswered while the clock runs
export function MessageClockIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <motion.rect x="6" y="10" width="34" height="24" rx="6" stroke={STROKE} strokeWidth={SW} {...draw(0)} />
      <motion.path d="M14 34 L9 42" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" {...draw(0.3)} />
      <motion.circle cx="42" cy="17" r="10" stroke={STROKE} strokeWidth={SW} fill="var(--color-mono-bg)" {...draw(0.45)} />
      <motion.line x1="42" y1="17" x2="42" y2="11" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" {...draw(0.7)} />
      <motion.line x1="42" y1="17" x2="46" y2="19.5" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" {...draw(0.8)} />
    </svg>
  );
}

// Beat 2 — a weekly rhythm that starts strong and breaks off
export function StreakGapIcon() {
  const days = [0, 1, 2, 3, 4, 5, 6];
  const filled = [true, true, true, false, false, false, false];
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <motion.rect x="7" y="12" width="42" height="32" rx="5" stroke={STROKE} strokeWidth={SW} {...draw(0)} />
      <motion.line x1="17" y1="6" x2="17" y2="15" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" {...draw(0.2)} />
      <motion.line x1="39" y1="6" x2="39" y2="15" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" {...draw(0.25)} />
      <motion.line x1="7" y1="21" x2="49" y2="21" stroke={STROKE} strokeWidth={SW} {...draw(0.35)} />
      {days.map((d, i) => (
        <motion.circle
          key={d}
          cx={14 + i * 5.3}
          cy={32}
          r={2.6}
          fill={filled[i] ? STROKE : "none"}
          stroke={filled[i] ? "none" : DIM}
          strokeWidth={1.25}
          strokeDasharray={filled[i] ? undefined : "1.5 1.5"}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.4, delay: 0.55 + i * 0.06 }}
        />
      ))}
    </svg>
  );
}

// Beat 3 — separate systems, no shared view across them
export function ScatteredSquaresIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <motion.rect
        x="6" y="14" width="16" height="16" rx="3.5"
        stroke={STROKE} strokeWidth={SW}
        style={{ transformOrigin: "14px 22px", rotate: -8 }}
        {...draw(0)}
      />
      <motion.rect
        x="26" y="6" width="18" height="18" rx="3.5"
        stroke={STROKE} strokeWidth={SW}
        style={{ transformOrigin: "35px 15px", rotate: 6 }}
        {...draw(0.25)}
      />
      <motion.rect
        x="18" y="32" width="16" height="16" rx="3.5"
        stroke={STROKE} strokeWidth={SW}
        style={{ transformOrigin: "26px 40px", rotate: -4 }}
        {...draw(0.5)}
      />
    </svg>
  );
}
