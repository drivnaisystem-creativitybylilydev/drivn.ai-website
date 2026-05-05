"use client";

import { motion } from "framer-motion";
import type { TimeEntry } from "./TimeKeeperDashboard";

interface Props {
  entries: TimeEntry[];
}

export function TimeKeeperStats({ entries }: Props) {
  const totalMins = entries.reduce((sum, e) => sum + e.duration_minutes, 0);
  const billableMins = entries
    .filter((e) => e.roi_level === "high")
    .reduce((sum, e) => sum + e.duration_minutes, 0);
  const highMins = billableMins;
  const medMins = entries
    .filter((e) => e.roi_level === "medium")
    .reduce((sum, e) => sum + e.duration_minutes, 0);
  const lowMins = entries
    .filter((e) => e.roi_level === "low")
    .reduce((sum, e) => sum + e.duration_minutes, 0);

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const pct = (num: number, total: number) =>
    total > 0 ? Math.round((num / total) * 100) : 0;

  const cards = [
    {
      label: "Total Hours",
      value: formatHours(totalMins),
      secondary: `${entries.length} entries`,
      color: "from-white/10 to-white/5",
      border: "border-white/[0.07]",
      accent: "text-white",
    },
    {
      label: "Billable (High ROI)",
      value: formatHours(highMins),
      secondary: `${pct(highMins, totalMins)}% of time`,
      color: "from-emerald-900/30 to-emerald-950/20",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
    {
      label: "Medium ROI",
      value: formatHours(medMins),
      secondary: `${pct(medMins, totalMins)}% of time`,
      color: "from-amber-900/30 to-amber-950/20",
      border: "border-amber-500/30",
      accent: "text-amber-400",
    },
    {
      label: "Low ROI",
      value: formatHours(lowMins),
      secondary: `${pct(lowMins, totalMins)}% of time`,
      color: "from-red-900/30 to-red-950/20",
      border: "border-red-500/30",
      accent: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className={`relative overflow-hidden rounded-lg border ${card.border} bg-gradient-to-br ${card.color} p-4 backdrop-blur transition hover:border-white/[0.15]`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05),transparent_1%)]" style={{ backgroundSize: "6px 6px" }} />
          <div className="relative">
            <div className="font-inter text-xs font-medium uppercase tracking-wider text-white/60">
              {card.label}
            </div>
            <div className={`mt-2 font-mono text-2xl font-bold ${card.accent}`}>
              {card.value}
            </div>
            <div className="mt-2 font-inter text-xs text-white/50">
              {card.secondary}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
