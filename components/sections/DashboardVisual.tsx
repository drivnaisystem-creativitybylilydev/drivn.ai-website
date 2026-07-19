"use client";

import { motion, useInView, animate } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  House,
  SquaresFour,
  Sparkle,
  Database,
  CheckCircle,
  GearSix,
  FolderSimple,
} from "@phosphor-icons/react/dist/ssr";
import { viewRelaxed } from "@/lib/motion-viewport";

const SPRING = [0.32, 0.72, 0, 1] as const;
const BAR_HEIGHTS = [38, 55, 44, 68, 82, 60, 90, 74, 96, 70, 84, 92, 65, 88];
const SIDEBAR_ICONS = [House, SquaresFour, Sparkle, Database, CheckCircle, GearSix];

// Smooth rising area-chart path, illustrative (not tied to real data), matches the
// reference's "Agent Executions" style curve.
const AREA_PATH =
  "M0,130 C40,124 65,108 95,92 C130,73 150,55 190,42 C225,31 260,24 300,20 C335,17 370,15 400,14";
const AREA_FILL_PATH = `${AREA_PATH} L400,150 L0,150 Z`;

// ── Count-up for numeric metric values ──────────────────────────────────────
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(value);

  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/^[0-9.]+/, "");
  const hasDecimal = value.includes(".");

  useEffect(() => {
    if (!inView || Number.isNaN(numeric)) return;
    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const formatted = hasDecimal ? v.toFixed(1) : Math.round(v).toString();
        setDisplay(`${formatted}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, numeric, suffix, hasDecimal]);

  if (Number.isNaN(numeric)) return <span>{value}</span>;
  return <span ref={ref}>{display}</span>;
}

type Metric = { value: string; label: string };
type TimelineStat = { label: string; value: string };
type ActivityItem = { text: string; time: string };
type DataItem = { name: string; count: string };

export default function DashboardVisual() {
  const t = useTranslations("DashboardVisual");
  const metrics = t.raw("metrics") as Metric[];
  const timelineStats = t.raw("timeline_stats") as TimelineStat[];
  const activity = t.raw("activity") as ActivityItem[];
  const dataItems = t.raw("data_items") as DataItem[];

  return (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: SPRING, delay: 0.5 }}
          className="glass-card glass-glow w-full max-w-[1180px] mx-auto overflow-hidden"
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-3 px-5 py-3.5 border-b"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex gap-1.5" aria-hidden>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
            </div>
            <span
              className="flex-1 text-center font-display text-[13px] font-medium"
              style={{ color: "rgba(245,245,244,0.55)" }}
            >
              {t("window_title")}
            </span>
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "var(--color-accent)" }}
              aria-hidden
            >
              <Sparkle size={13} weight="fill" color="#fff" />
            </span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div
              className="hidden md:flex flex-col items-center gap-2 py-6 px-3 border-r shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              {SIDEBAR_ICONS.map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={
                    i === 0
                      ? { background: "rgba(124,77,255,0.15)", border: "1px solid rgba(124,77,255,0.40)" }
                      : { background: "transparent" }
                  }
                >
                  <Icon
                    size={17}
                    weight="light"
                    color={i === 0 ? "var(--color-accent-light)" : "rgba(245,245,244,0.35)"}
                  />
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 md:p-7 min-w-0">
              {/* Metric strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewRelaxed}
                    transition={{ duration: 0.5, ease: SPRING, delay: 0.1 + i * 0.07 }}
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.12em] block mb-2"
                      style={{ color: "rgba(245,245,244,0.42)" }}
                    >
                      {m.label}
                    </span>
                    <span className="font-display block text-[26px] font-semibold leading-none text-white">
                      <CountUp value={m.value} />
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Row 2: Activity Timeline (bars) + Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="font-display text-[14px] font-semibold text-white">{t("timeline_label")}</span>
                    <div className="flex items-center gap-4">
                      {timelineStats.map((s) => (
                        <span key={s.label} className="flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.45)" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent-light)" }} />
                          {s.label}: {s.value}
                        </span>
                      ))}
                      <span
                        className="font-mono text-[10px] px-2 py-1 rounded-md"
                        style={{ background: "rgba(124,77,255,0.18)", color: "var(--color-accent-light)" }}
                      >
                        {t("timeline_range")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-24">
                    {BAR_HEIGHTS.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: `${h}%`, opacity: 1 }}
                        viewport={viewRelaxed}
                        transition={{ duration: 0.6, ease: SPRING, delay: 0.3 + i * 0.025 }}
                        className="flex-1 rounded-t-sm"
                        style={{ background: "linear-gradient(to top, rgba(124,77,255,0.85), rgba(183,156,255,0.30))" }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="font-display text-[14px] font-semibold text-white block mb-4">{t("activity_label")}</span>
                  <div className="flex flex-col gap-3.5">
                    {activity.map((item, i) => (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={viewRelaxed}
                        transition={{ duration: 0.4, ease: SPRING, delay: 0.4 + i * 0.08 }}
                        className="flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--color-accent-light)" }} />
                        <div className="min-w-0">
                          <p className="text-[12.5px] leading-snug text-white truncate">{item.text}</p>
                          <p className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.38)" }}>
                            {item.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Response Volume (area chart) + Data Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-[14px] font-semibold text-white">{t("volume_label")}</span>
                    <span className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.42)" }}>
                      {t("volume_range")}
                    </span>
                  </div>
                  <motion.svg
                    viewBox="0 0 400 150"
                    className="w-full h-28"
                    preserveAspectRatio="none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={viewRelaxed}
                    transition={{ duration: 0.8, ease: SPRING }}
                  >
                    <defs>
                      <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(124,77,255,0.45)" />
                        <stop offset="100%" stopColor="rgba(124,77,255,0)" />
                      </linearGradient>
                    </defs>
                    <path d={AREA_FILL_PATH} fill="url(#volumeFill)" />
                    <motion.path
                      d={AREA_PATH}
                      fill="none"
                      stroke="var(--color-accent-light)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 6px rgba(124,77,255,0.65))" }}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={viewRelaxed}
                      transition={{ duration: 1.4, ease: SPRING, delay: 0.2 }}
                    />
                  </motion.svg>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-[14px] font-semibold text-white">{t("data_label")}</span>
                    <span className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.42)" }}>
                      {t("data_total")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dataItems.map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewRelaxed}
                        transition={{ duration: 0.4, ease: SPRING, delay: 0.3 + i * 0.06 }}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <FolderSimple size={16} weight="light" color="var(--color-accent-light)" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12.5px] font-medium text-white truncate">{item.name}</p>
                          <p className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.40)" }}>
                            {item.count}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
  );
}
