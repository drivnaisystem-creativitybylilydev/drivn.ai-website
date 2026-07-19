"use client";

import { motion } from "framer-motion";
import { ChatCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import { viewRelaxed } from "@/lib/motion-viewport";

const CHANNELS = [
  { Icon: SiWhatsapp, color: "#25D366" },
  { Icon: SiInstagram, color: "#E4405F" },
  { Icon: ChatCircle, color: "var(--color-accent-light)" },
];

export default function MessagingAgentMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[360px] p-5">
      {/* Channel row */}
      <div className="flex items-center gap-2 mb-4">
        {CHANNELS.map((ch, i) => (
          <span
            key={i}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: ch.color.startsWith("#") ? `${ch.color}1A` : "rgba(124,77,255,0.10)",
              border: `1px solid ${ch.color.startsWith("#") ? `${ch.color}4D` : "rgba(124,77,255,0.30)"}`,
            }}
          >
            <ch.Icon size={14} color={ch.color} />
          </span>
        ))}
        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-[0.1em]" style={{ color: "rgba(245,245,244,0.35)" }}>
          Any inbox
        </span>
      </div>

      {/* Incoming message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewRelaxed}
        transition={{ duration: 0.5 }}
        className="rounded-xl rounded-tl-sm px-3.5 py-2.5 mb-2 max-w-[85%]"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-[12.5px] leading-snug text-white">Hey, do you have availability Thursday?</p>
      </motion.div>

      {/* AI reply */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewRelaxed}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-xl rounded-tr-sm px-3.5 py-2.5 mb-4 max-w-[85%] ml-auto"
        style={{ background: "rgba(124,77,255,0.18)", border: "1px solid rgba(124,77,255,0.30)" }}
      >
        <p className="text-[12.5px] leading-snug text-white">Yes! 2pm works — want me to book it in?</p>
      </motion.div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <span className="flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: "#34d399" }}>
          <CheckCircle size={13} weight="fill" />
          Booked
        </span>
        <span className="font-mono text-[10px]" style={{ color: "rgba(245,245,244,0.38)" }}>
          Synced to CRM
        </span>
      </div>
    </div>
  );
}
