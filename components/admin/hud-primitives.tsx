"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function HudBrackets({
  color = "rgba(139,92,246,0.4)",
  size = 10,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <>
      <div style={{ width: size, height: size, borderColor: color }} className="absolute left-0 top-0 border-l border-t" />
      <div style={{ width: size, height: size, borderColor: color }} className="absolute right-0 top-0 border-r border-t" />
      <div style={{ width: size, height: size, borderColor: color }} className="absolute bottom-0 left-0 border-b border-l" />
      <div style={{ width: size, height: size, borderColor: color }} className="absolute bottom-0 right-0 border-b border-r" />
    </>
  );
}

export function AnimatedNumber({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let start: number | null = null;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node!.textContent = prefix + Math.round(eased * to).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, prefix, suffix, duration]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function ScanLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-20 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent"
      initial={{ top: 0, opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 0.9, 0.9, 0] }}
      transition={{ duration: 1.4, ease: "linear", delay, times: [0, 0.05, 0.95, 1] }}
    />
  );
}
