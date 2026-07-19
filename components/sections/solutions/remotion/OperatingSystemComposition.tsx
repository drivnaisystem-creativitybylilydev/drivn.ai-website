"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lightning, MoneyWavy, Users, ChartBar, Sparkle } from "@phosphor-icons/react/dist/ssr";

export const FPS = 30;
export const TOTAL_FRAMES = 330;

const AREA_PATH =
  "M0,120 C30,114 55,100 80,88 C110,73 130,60 165,48 C195,38 225,30 260,25 C290,21 320,18 350,16";
const AREA_FILL_PATH = `${AREA_PATH} L350,140 L0,140 Z`;

const MONTH_ROWS = [
  { label: "Leads Answered", value: "128" },
  { label: "Bookings Confirmed", value: "34" },
  { label: "Reviews Requested", value: "21" },
  { label: "Content Published", value: "9" },
];

const STAT_TILES = [
  { Icon: Lightning, value: "128", label: "Total Leads" },
  { Icon: MoneyWavy, value: "34", label: "Bookings This Month" },
  { Icon: Users, value: "759", label: "Active Customers" },
  { Icon: ChartBar, value: "12.4K", label: "Site Visitors" },
];

// Deterministic-enough scatter — this composition only ever renders client-side
// (gated by SolutionPlayer's mount check), so Math.random() here never runs
// during SSR and can't cause a hydration mismatch.
function makeDots(count: number) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: 0.5 + Math.random() * 1.3,
    o: 0.12 + Math.random() * 0.4,
  }));
}
const HEADER_DOTS = makeDots(30);
const TILE_DOTS = STAT_TILES.map(() => makeDots(14));

function DotField({ dots }: { dots: { x: number; y: number; r: number; o: number }[] }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={`${d.x}%`} cy={`${d.y}%`} r={d.r} fill="var(--color-accent-light)" opacity={d.o} />
      ))}
    </svg>
  );
}

function countUp(frame: number, target: number, start = 20, len = 60) {
  return Math.round(interpolate(frame, [start, start + len], [0, target], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
}

export default function OperatingSystemComposition() {
  const frame = useCurrentFrame();

  const cardsIn = interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chartDraw = interpolate(frame, [50, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pipelineValue = countUp(frame, 128, 20, 70);
  const liveValue = countUp(frame, 47, 40, 70);
  const pulse = 0.7 + 0.3 * Math.abs(Math.sin(frame / 15));

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: cardsIn }} className="relative w-full h-full p-8 flex flex-col justify-center">
        {/* Header — icon + title + live status, dot-scatter texture behind */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="absolute -top-4 right-0 w-64 h-32 overflow-visible">
            <DotField dots={HEADER_DOTS} />
          </div>
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,77,255,0.15)", border: "1px solid rgba(124,77,255,0.40)" }}
          >
            <Sparkle size={20} weight="fill" color="var(--color-accent-light)" />
          </span>
          <div>
            <p className="font-display text-[24px] font-semibold text-white leading-tight">AI Operating System</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] mt-0.5 flex items-center gap-1.5" style={{ color: "var(--color-accent-light)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34d399", opacity: pulse }} />
              Today · Live
            </p>
          </div>
        </div>

        {/* Top row — 3 cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Pipeline card */}
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="font-display text-[16px] font-semibold text-white">Pipeline</span>
            <div className="flex items-end gap-8 mt-4 mb-5">
              <div>
                <p className="font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.42)" }}>Leads</p>
                <p className="font-display text-[32px] font-semibold text-white leading-none mt-1.5">{pipelineValue}</p>
              </div>
              <div>
                <p className="font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.42)" }}>Response</p>
                <p className="font-display text-[32px] font-semibold text-white leading-none mt-1.5">52s</p>
              </div>
            </div>
            <p className="font-mono text-[10.5px] mb-2" style={{ color: "rgba(245,245,244,0.4)" }}>Monthly goal</p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: "78%", background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))" }} />
            </div>
          </div>

          {/* This Month card */}
          <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-[16px] font-semibold text-white">This Month</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--color-accent-light)" }}>Last 30 Days</span>
            </div>
            <div className="flex flex-col">
              {MONTH_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="text-[12.5px] text-white">{row.label}</span>
                  <span className="font-mono text-[12.5px] font-medium" style={{ color: "var(--color-accent-light)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live card */}
          <div className="rounded-xl p-6 flex flex-col" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="font-display text-[16px] font-semibold text-white mb-2">Real-Time</span>
            <p className="font-display text-[38px] font-semibold text-white leading-none mb-1">{liveValue}</p>
            <p className="font-mono text-[10.5px] mb-3" style={{ color: "rgba(245,245,244,0.4)" }}>Active conversations</p>
            <svg viewBox="0 0 350 140" className="w-full flex-1" preserveAspectRatio="none">
              <defs>
                <linearGradient id="osFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124,77,255,0.45)" />
                  <stop offset="100%" stopColor="rgba(124,77,255,0)" />
                </linearGradient>
              </defs>
              <path d={AREA_FILL_PATH} fill="url(#osFill)" opacity={chartDraw} />
              <path
                d={AREA_PATH}
                fill="none"
                stroke="var(--color-accent-light)"
                strokeWidth={2.5}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(124,77,255,0.65))",
                  strokeDasharray: 600,
                  strokeDashoffset: 600 * (1 - chartDraw),
                }}
              />
            </svg>
          </div>
        </div>

        {/* Bottom row — big-number icon tiles, dot texture + bottom glow per tile */}
        <div className="grid grid-cols-4 gap-4">
          {STAT_TILES.map((tile, i) => (
            <div
              key={tile.label}
              className="relative rounded-xl p-5 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <DotField dots={TILE_DOTS[i]} />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                style={{ background: "linear-gradient(to top, rgba(124,77,255,0.22), transparent)" }}
                aria-hidden
              />
              <span
                className="relative w-11 h-11 rounded-lg flex items-center justify-center mb-6"
                style={{ background: "rgba(124,77,255,0.10)", border: "1px solid rgba(124,77,255,0.30)" }}
              >
                <tile.Icon size={20} weight="light" color="var(--color-accent-light)" />
              </span>
              <p className="relative font-mono text-[11px] mb-1.5" style={{ color: "rgba(245,245,244,0.45)" }}>{tile.label}</p>
              <p className="relative font-display text-[34px] font-semibold text-white leading-none">{tile.value}</p>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}
