"use client";

import { motion } from "framer-motion";
import { SiGoogleads, SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { viewRelaxed } from "@/lib/motion-viewport";

const ITEMS = [
  { Icon: SiGoogleads, label: "Google Ads", status: "12 new clicks", color: "#4285F4" },
  { Icon: FaLinkedin, label: "LinkedIn post", status: "Published", color: "#0A66C2" },
  { Icon: SiInstagram, label: "Instagram", status: "Scheduled", color: "#E4405F" },
];

export default function MarketingMockup() {
  return (
    <div className="glass-card glass-glow w-full max-w-[340px] p-5 flex flex-col gap-2.5">
      {ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex items-center gap-3 rounded-xl px-3.5 py-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${item.color}1A`, border: `1px solid ${item.color}4D` }}
          >
            <item.Icon size={15} color={item.color} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-medium text-white leading-tight">{item.label}</p>
            <p className="font-mono text-[10px]" style={{ color: "rgba(245,245,244,0.42)" }}>{item.status}</p>
          </div>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#34d399" }} aria-hidden />
        </motion.div>
      ))}
    </div>
  );
}
