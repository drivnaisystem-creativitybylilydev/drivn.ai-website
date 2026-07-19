"use client";

import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";

export default function WebsiteMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[380px] overflow-hidden">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <span
          className="flex-1 text-center font-mono text-[10.5px] rounded-full py-1"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(245,245,244,0.45)" }}
        >
          yourbusiness.com
        </span>
      </div>

      {/* Mini hero */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5 }}
          className="h-2.5 rounded-full w-3/4 mb-2.5"
          style={{ background: "rgba(255,255,255,0.65)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-2.5 rounded-full w-1/2 mb-4"
          style={{ background: "rgba(255,255,255,0.65)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1.5 rounded-full w-full mb-1.5"
          style={{ background: "rgba(255,255,255,0.16)" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="h-1.5 rounded-full w-4/5 mb-5"
          style={{ background: "rgba(255,255,255,0.16)" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="inline-flex items-center rounded-full px-4 py-2"
          style={{ background: "var(--color-accent)" }}
        >
          <span className="font-mono text-[10.5px] font-medium text-white">Book Now</span>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-3 px-6 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "#34d399" }}>● Live in 2 weeks</span>
        <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "rgba(245,245,244,0.38)" }}>SEO built in</span>
      </div>
    </div>
  );
}
