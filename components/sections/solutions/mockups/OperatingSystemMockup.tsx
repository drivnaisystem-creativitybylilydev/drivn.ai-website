"use client";

import { motion } from "framer-motion";
import { Lightning, Calendar, ChartLineUp, Star } from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";

const ROWS = [
  { Icon: Lightning, label: "Leads", status: "12 new", detail: "3 pre-qualified" },
  { Icon: Calendar, label: "Bookings", status: "4 today", detail: "Next: 2:00pm" },
  { Icon: ChartLineUp, label: "Marketing", status: "2 scheduled", detail: "1 live campaign" },
  { Icon: Star, label: "Reviews", status: "Synced", detail: "4.9 avg rating" },
];

export default function OperatingSystemMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[720px] overflow-hidden">
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <span className="font-display text-[14px] font-semibold text-white">One System</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--color-accent-light)" }}>
          4 sources · 1 view
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {ROWS.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-3 px-6 py-4 border-b sm:[&:nth-child(2n)]:border-l"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(124,77,255,0.10)", border: "1px solid rgba(124,77,255,0.28)" }}
            >
              <row.Icon size={16} weight="light" color="var(--color-accent-light)" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-medium text-white">{row.label}</p>
                <p className="font-mono text-[10.5px]" style={{ color: "var(--color-accent-light)" }}>{row.status}</p>
              </div>
              <p className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.4)" }}>{row.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
