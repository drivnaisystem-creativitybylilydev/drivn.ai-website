"use client";

import { motion } from "framer-motion";
import { PhoneCall, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";

const BARS = [8, 16, 11, 22, 14, 26, 12, 19, 9, 24, 15, 10];

export default function ReceptionistMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[340px] p-5">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(124,77,255,0.15)", border: "1px solid rgba(124,77,255,0.40)" }}
        >
          <PhoneCall size={16} weight="fill" color="var(--color-accent-light)" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white leading-tight">Incoming — Sarah M.</p>
          <p className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.4)" }}>00:38</p>
        </div>
        <span className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#34d399" }} aria-hidden />
      </div>

      {/* Waveform */}
      <div className="flex items-center gap-[3px] h-10 mb-4">
        {BARS.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 4, opacity: 0.4 }}
            whileInView={{ height: h, opacity: 1 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.5, delay: i * 0.03 }}
            className="flex-1 rounded-full"
            style={{ background: "var(--color-accent-light)" }}
          />
        ))}
      </div>

      <p className="text-[12px] leading-relaxed mb-4" style={{ color: "rgba(245,245,244,0.55)" }}>
        &ldquo;I can confirm you for 2pm Thursday — I&apos;ll send a reminder the day before.&rdquo;
      </p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <span className="flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: "#34d399" }}>
          <CheckCircle size={13} weight="fill" />
          Appointment confirmed
        </span>
        <span className="font-mono text-[10px]" style={{ color: "rgba(245,245,244,0.38)" }}>
          No escalation needed
        </span>
      </div>
    </div>
  );
}
