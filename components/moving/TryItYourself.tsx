"use client";

/**
 * Interactive "try it yourself" block for /moving-and-logistics.
 * Three tabs, all client-side, nothing saved, no network:
 *   1. Missed-revenue calculator — what slow/no follow-up costs per year
 *   2. Instant-quote demo — the size/distance/date → price-range widget a customer would see
 *   3. Response-speed impact — how much faster first-response lifts the odds of booking
 *
 * All math is deliberately simple and directional. Assumptions are shown on screen.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CurrencyDollar,
  Calculator,
  Timer,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

const SPRING = [0.32, 0.72, 0, 1] as const;

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));

const round25 = (n: number) => Math.round(n / 25) * 25;

// ── Count-up on a changing number (respects reduced motion) ─────────────────
function useCountUp(target: number, duration = 650) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVal(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(from + (target - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
    };
  }, [target, duration]);

  return val;
}

// ── Labeled slider ─────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[12px] text-white">{label}</span>
        <span
          className="font-display text-[15px] font-semibold tabular-nums"
          style={{ color: "var(--color-accent-light)" }}
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-2.5 w-full cursor-pointer"
        style={{ accentColor: "#7c4dff" }}
      />
      {hint && <p className="font-mono mt-1.5 text-[10.5px] text-white">{hint}</p>}
    </div>
  );
}

function ResultCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-col self-start rounded-2xl border p-6 md:p-7 lg:sticky lg:top-28"
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        background: "var(--color-mono-bg)",
      }}
    >
      {children}
    </div>
  );
}

function Footnote({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono mt-6 text-[10.5px] leading-relaxed text-white">
      {children}
    </p>
  );
}

// ── Panel 1 — missed revenue ───────────────────────────────────────────────
// The share of quote requests that never get a fast answer, and the share of the
// resulting loss the system realistically books back. Held as constants so the
// panel stays a 3-slider decision, not a 5-slider spreadsheet.
const COLD_SHARE = 0.35;
const RECOVER_SHARE = 0.5;

function RevenuePanel({ onGetStarted }: { onGetStarted: () => void }) {
  const [leads, setLeads] = useState(8);
  const [avgJob, setAvgJob] = useState(1400);
  const [closeRate, setCloseRate] = useState(30);
  const [showRecovery, setShowRecovery] = useState(false);

  const coldPerYear = leads * 52 * COLD_SHARE;
  const lost = coldPerYear * (closeRate / 100) * avgJob;
  const recovered = lost * RECOVER_SHARE;

  const shownLost = useCountUp(lost);
  const shownRecovered = useCountUp(showRecovery ? recovered : 0);

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
        <div className="space-y-6">
          <Field
            label="Quote requests a week"
            value={leads}
            display={`${leads}`}
            min={1}
            max={40}
            step={1}
            onChange={setLeads}
          />
          <Field
            label="Average job value"
            value={avgJob}
            display={usd(avgJob)}
            min={500}
            max={8000}
            step={100}
            onChange={setAvgJob}
          />
          <Field
            label="Jobs you win when you reach the lead fast"
            value={closeRate}
            display={`${closeRate}%`}
            min={10}
            max={70}
            step={1}
            onChange={setCloseRate}
          />
          <p className="font-mono text-[11px] leading-relaxed text-white">
            Assumes about 1 in 3 quote requests never gets a fast answer &mdash; the
            mover who replies first takes those jobs.
          </p>
        </div>

        <ResultCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
            Lost to slow follow-up
          </p>
          <p className="font-display mt-2 text-[clamp(36px,6.5vw,54px)] font-semibold leading-[0.95] tracking-[-0.02em] text-white tabular-nums">
            {usd(shownLost)}
          </p>
          <p className="font-mono mt-2 text-[12px] leading-relaxed text-white">
            a year &mdash; jobs that went to whoever answered first
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px] text-white">
            <span>
              {Math.round(coldPerYear).toLocaleString()} leads/yr never answered fast
            </span>
            <span aria-hidden>&middot;</span>
            <span>{usd(lost / 12)}/mo</span>
          </div>

          {!showRecovery ? (
            <button
              type="button"
              onClick={() => setShowRecovery(true)}
              className="font-display ease-spring mt-6 inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#0a0a0c] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: "var(--color-accent-light)" }}
            >
              See what we could win back
              <ArrowRight size={13} weight="bold" />
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: SPRING }}
              className="mt-6 border-t pt-5"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--color-accent-light)" }}
              >
                Realistically recoverable
              </p>
              <p
                className="font-display mt-2 text-[clamp(28px,5vw,40px)] font-semibold leading-none tracking-[-0.02em] tabular-nums"
                style={{ color: "var(--color-accent-light)" }}
              >
                {usd(shownRecovered)}
                <span className="font-mono text-[13px] font-normal text-white">
                  {" "}
                  /yr
                </span>
              </p>
              <p className="font-mono mt-2 text-[12px] leading-relaxed text-white">
                About half, conservatively &mdash; roughly {usd(recovered / 12)}/mo back
                on the calendar. The quote goes out in seconds and the follow-up
                doesn&rsquo;t stop until they reply.
              </p>
              <button
                type="button"
                onClick={onGetStarted}
                className="font-display ease-spring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0a0a0c] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.98]"
              >
                Get this running
                <ArrowRight size={13} weight="bold" />
              </button>
            </motion.div>
          )}
        </ResultCard>
      </div>
      <Footnote>
        Quote requests &times; the third that never gets a fast answer &times; your win
        rate &times; average job value. Recovery estimate is deliberately conservative.
        Directional only &mdash; the call runs it on your real numbers.
      </Footnote>
    </div>
  );
}

// ── Panel 2 — instant quote demo ───────────────────────────────────────────
const SIZES: Array<[string, string]> = [
  ["studio", "Studio"],
  ["1br", "1 bed"],
  ["2br", "2 bed"],
  ["3br", "3 bed"],
  ["4br", "4+ bed"],
];
const SIZE_BASE: Record<string, number> = {
  studio: 450,
  "1br": 750,
  "2br": 1150,
  "3br": 1700,
  "4br": 2500,
};

function QuotePanel() {
  const [size, setSize] = useState("2br");
  const [miles, setMiles] = useState(25);
  const [weekend, setWeekend] = useState(false);

  const raw = (SIZE_BASE[size] + miles * 3.5) * (weekend ? 1.1 : 1);
  const low = round25(raw * 0.9);
  const high = round25(raw * 1.16);
  const shownLow = useCountUp(low);
  const shownHigh = useCountUp(high);

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div className="space-y-6">
          <div>
            <span className="font-mono text-[12px] text-white">Home size</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SIZES.map(([id, lbl]) => {
                const on = size === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSize(id)}
                    className="font-mono rounded-xl border px-3 py-2 text-[12px] transition-colors"
                    style={{
                      borderColor: on
                        ? "var(--color-accent)"
                        : "rgba(255,255,255,0.12)",
                      background: on ? "rgba(124,77,255,0.12)" : "transparent",
                      color: on ? "#fff" : "#f5f5f4",
                    }}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          <Field
            label="Distance"
            value={miles}
            display={`${miles} mi`}
            min={0}
            max={250}
            step={5}
            onChange={setMiles}
          />

          <div>
            <span className="font-mono text-[12px] text-white">Move date</span>
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setWeekend((v) => !v)}
                className="font-mono rounded-full border px-3.5 py-1.5 text-[11.5px] transition-colors"
                style={{
                  borderColor: weekend
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.14)",
                  background: weekend ? "rgba(124,77,255,0.12)" : "transparent",
                  color: weekend ? "#fff" : "#f5f5f4",
                }}
              >
                Weekend move {weekend ? "· on" : "· off"}
              </button>
            </div>
          </div>
        </div>

        <ResultCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
            Estimate on screen
          </p>
          <p className="font-display mt-2 whitespace-nowrap text-[clamp(24px,3.8vw,34px)] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">
            {usd(shownLow)}
            <span className="text-white">&nbsp;&ndash;&nbsp;</span>
            {usd(shownHigh)}
          </p>
          <p className="font-mono mt-3 text-[12px] leading-relaxed text-white">
            What a customer sees the second they land on your site &mdash; no form,
            no wait for a callback.
          </p>
        </ResultCard>
      </div>
      <Footnote>
        Illustrative pricing model. On a real build the formula is tuned to your
        rates, crew size, and add-ons.
      </Footnote>
    </div>
  );
}

// ── Panel 3 — response speed ───────────────────────────────────────────────
const SPEED_STEPS: Array<{ label: string; odds: number }> = [
  { label: "5 minutes", odds: 100 },
  { label: "15 minutes", odds: 62 },
  { label: "1 hour", odds: 36 },
  { label: "4 hours", odds: 18 },
  { label: "a day", odds: 8 },
];

function Bar({
  label,
  pct,
  strong,
}: {
  label: string;
  pct: number;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[11.5px]">
        <span className="text-white">{label}</span>
        <span
          className="tabular-nums"
          style={{ color: strong ? "var(--color-accent-light)" : "#f5f5f4" }}
        >
          {Math.round(pct)}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: strong
              ? "var(--color-accent)"
              : "rgba(255,255,255,0.28)",
          }}
          animate={{ width: `${Math.max(3, pct)}%` }}
          transition={{ duration: 0.5, ease: SPRING }}
        />
      </div>
    </div>
  );
}

function SpeedPanel() {
  const [idx, setIdx] = useState(2);
  const cur = SPEED_STEPS[idx];
  const mult = 100 / cur.odds;
  const shownMult = useCountUp(mult);
  const isFast = idx === 0;

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div className="space-y-6">
          <Field
            label="Your average first response"
            value={idx}
            display={cur.label}
            min={0}
            max={SPEED_STEPS.length - 1}
            step={1}
            onChange={setIdx}
          />
          <div className="space-y-4 pt-1">
            <Bar label="Answered in 5 minutes" pct={100} strong />
            <Bar label={`Answered in ${cur.label}`} pct={cur.odds} />
          </div>
        </div>

        <ResultCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
            {isFast ? "You're already fast" : "Speed advantage"}
          </p>
          {isFast ? (
            <>
              <p className="font-display mt-2 text-[clamp(30px,5vw,44px)] font-semibold leading-none tracking-[-0.02em] text-white">
                Keep it.
              </p>
              <p className="font-mono mt-3 text-[12px] leading-relaxed text-white">
                Answering inside five minutes is the edge. The system makes it
                automatic instead of dependent on someone being free.
              </p>
            </>
          ) : (
            <>
              <p className="font-display mt-2 text-[clamp(32px,5.5vw,46px)] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">
                {shownMult.toFixed(shownMult < 10 ? 1 : 0)}&times;
              </p>
              <p className="font-mono mt-3 text-[12px] leading-relaxed text-white">
                more likely to become a booked job when the first reply lands in
                five minutes instead of {cur.label}.
              </p>
            </>
          )}
        </ResultCard>
      </div>
      <Footnote>
        Directional figures drawn from lead-response research (Harvard Business
        Review; InsideSales / LRM). Your market will differ.
      </Footnote>
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "revenue", label: "Missed revenue", short: "Revenue", icon: CurrencyDollar },
  { id: "quote", label: "Instant quote", short: "Quote", icon: Calculator },
  { id: "speed", label: "Response speed", short: "Speed", icon: Timer },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TryItYourself({
  onGetStarted,
}: {
  onGetStarted: () => void;
}) {
  const [tab, setTab] = useState<TabId>("revenue");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="inline-flex rounded-full border p-1"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "var(--color-mono-surface)",
        }}
      >
        {TABS.map((t) => {
          const on = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="font-display ease-spring inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors duration-300 sm:px-4"
              style={{
                background: on ? "#fff" : "transparent",
                color: on ? "#0a0a0c" : "#f5f5f4",
              }}
            >
              <Icon size={15} weight="bold" />
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="glass-card mt-8 p-6 sm:p-8 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: SPRING }}
          >
            {tab === "revenue" && <RevenuePanel onGetStarted={onGetStarted} />}
            {tab === "quote" && <QuotePanel />}
            {tab === "speed" && <SpeedPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Handoff */}
      <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[12px] text-white">
          Rough numbers. We&rsquo;ll run them on your real ones.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="font-display ease-spring inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-white/[0.06]"
          style={{ borderColor: "rgba(255,255,255,0.18)" }}
        >
          Get started
          <ArrowRight size={13} weight="bold" />
        </button>
      </div>
    </div>
  );
}
