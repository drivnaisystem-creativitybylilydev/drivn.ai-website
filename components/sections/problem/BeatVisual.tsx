"use client";

import { motion } from "framer-motion";

const chipBase = "glass-card p-5 w-full max-w-[280px]";

// Beat 1 — a lead's response window ticking past the point of no return
export function TimerReadout() {
  return (
    <div className={chipBase}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(245,245,244,0.4)" }}>
          New Lead
        </span>
        <span className="relative flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#f87171" }} aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "#f87171" }}>Cold</span>
        </span>
      </div>
      <div className="font-mono text-[34px] font-medium tracking-tight text-white leading-none">05:12</div>
      <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--color-accent-light), #f87171)" }}
          initial={{ width: "6%" }}
          whileInView={{ width: "92%" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Beat 2 — a follow-up streak breaking down over the course of a week
export function StreakReadout() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const filled = [true, true, true, false, false, false, false];
  return (
    <div className={chipBase}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(245,245,244,0.4)" }}>
          This Week
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--color-accent-light)" }}>
          3/7 sent
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {days.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="w-full h-7 rounded-md"
              style={{
                background: filled[i] ? "var(--color-accent)" : "rgba(255,255,255,0.05)",
                border: filled[i] ? "1px solid rgba(124,77,255,0.55)" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: filled[i] ? "0 0 12px rgba(124,77,255,0.35)" : "none",
              }}
            />
            <span className="font-mono text-[9px]" style={{ color: "rgba(245,245,244,0.32)" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Beat 3 — three disconnected data sources with no single view across them
export function FragmentReadout() {
  const nodes = [
    { label: "Leads", rotate: -3, x: 0 },
    { label: "Bookings", rotate: 2, x: 18 },
    { label: "Reports", rotate: -1, x: -6 },
  ];
  return (
    <div className={`${chipBase} flex flex-col items-center justify-center gap-3 py-8`}>
      {nodes.map((n) => (
        <span
          key={n.label}
          className="font-mono text-[11px] uppercase tracking-[0.1em] px-3.5 py-2 rounded-lg"
          style={{
            color: "rgba(245,245,244,0.55)",
            background: "rgba(255,255,255,0.03)",
            border: "1px dashed rgba(255,255,255,0.14)",
            transform: `rotate(${n.rotate}deg) translateX(${n.x}px)`,
          }}
        >
          {n.label}
        </span>
      ))}
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] mt-1" style={{ color: "rgba(245,245,244,0.28)" }}>
        No single view
      </span>
    </div>
  );
}
