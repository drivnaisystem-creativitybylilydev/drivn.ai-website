"use client";

import { motion } from "framer-motion";

const SPRING = [0.32, 0.72, 0, 1] as const;

const leads = [
  {
    initials: "JM",
    name: "James M.",
    type: "Roofing estimate",
    responseTime: "41s",
    status: "Booked",
    statusColor: "#4ade80",
    statusBg: "rgba(34,197,94,0.10)",
    statusBorder: "rgba(34,197,94,0.25)",
    avatarBg: "rgba(139,92,246,0.25)",
    delay: 0.3,
  },
  {
    initials: "SK",
    name: "Sarah K.",
    type: "HVAC service call",
    responseTime: "58s",
    status: "Booked",
    statusColor: "#4ade80",
    statusBg: "rgba(34,197,94,0.10)",
    statusBorder: "rgba(34,197,94,0.25)",
    avatarBg: "rgba(167,139,250,0.22)",
    delay: 0.5,
  },
  {
    initials: "RT",
    name: "Ryan T.",
    type: "Plumbing emergency",
    responseTime: "29s",
    status: "Calling now",
    statusColor: "#fbbf24",
    statusBg: "rgba(251,191,36,0.10)",
    statusBorder: "rgba(251,191,36,0.25)",
    avatarBg: "rgba(139,92,246,0.18)",
    delay: 0.7,
    pulse: true,
  },
];

const itemVariants = {
  hidden: { opacity: 0, x: 14, filter: "blur(4px)" },
  show: (delay: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: SPRING, delay },
  }),
};

export function HeroFlowDiagram() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Stats row */}
      <motion.div
        className="grid grid-cols-3 gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: SPRING, delay: 0.2 }}
      >
        {[
          { value: "14", label: "Leads today" },
          { value: "11", label: "Booked" },
          { value: "79%", label: "Conv. rate" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center py-3 rounded-xl"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.18)",
            }}
          >
            <span
              className="font-sora text-[20px] font-bold leading-none"
              style={{ color: "#a78bfa" }}
            >
              {stat.value}
            </span>
            <span
              className="text-[11px] mt-1 font-medium"
              style={{ color: "rgba(239,240,243,0.48)" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Lead rows */}
      <div className="flex flex-col gap-2">
        {leads.map((lead) => (
          <motion.div
            key={lead.name}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{
              background: "rgba(20,26,46,0.90)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            variants={itemVariants}
            custom={lead.delay}
            initial="hidden"
            animate="show"
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-sora text-[12px] font-bold text-white"
              style={{ background: lead.avatarBg }}
            >
              {lead.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white leading-tight truncate">
                {lead.name}
              </p>
              <p
                className="text-[11px] leading-tight mt-0.5 truncate"
                style={{ color: "rgba(239,240,243,0.48)" }}
              >
                {lead.type}
              </p>
            </div>

            {/* Right side: response time + status */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="text-[10px] font-semibold"
                style={{ color: "rgba(167,139,250,0.75)" }}
              >
                ↩ {lead.responseTime}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                style={{
                  color: lead.statusColor,
                  background: lead.statusBg,
                  border: `1px solid ${lead.statusBorder}`,
                }}
              >
                {lead.pulse && (
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: lead.statusColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
                {lead.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer tag */}
      <motion.p
        className="text-center text-[10px] uppercase tracking-[0.22em] font-semibold pt-1"
        style={{ color: "rgba(139,92,246,0.50)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        Automated · Running 24/7
      </motion.p>
    </div>
  );
}
