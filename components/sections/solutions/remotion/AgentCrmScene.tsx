"use client";

import { interpolate, useCurrentFrame } from "remotion";
import { Robot, Database, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const DAYS = ["M", "T", "W", "Th", "F"];
const THU_COL = 3;
const OPEN_ROW = 2;

function clamped(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// A short cutaway from the chat: the agent querying the CRM, scanning the week,
// landing on the one open Thursday slot, and writing the appointment in.
// `start` is the absolute frame this scene begins at within the parent composition.
export function AgentCrmScene({ start }: { start: number }) {
  const frame = useCurrentFrame();
  const t = frame - start;

  const nodesIn = clamped(t, 0, 20);
  const lineDraw = clamped(t, 15, 35);
  const pulseActive = t > 35 && t < 100;
  const pulseT = pulseActive ? ((t - 35) % 40) / 40 : 0;
  const calendarIn = clamped(t, 90, 115);
  const thuHighlight = clamped(t, 120, 145);
  const slotFound = clamped(t, 150, 172);
  const chipIn = clamped(t, 182, 206);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 px-4">
      <p
        className="font-mono text-[10.5px] uppercase tracking-[0.14em]"
        style={{ color: "rgba(245,245,244,0.4)", opacity: nodesIn }}
      >
        Checking the calendar
      </p>

      {/* Agent <-> CRM connection */}
      <div className="relative w-full flex items-center justify-center" style={{ height: 84, opacity: nodesIn }}>
        <div className="flex flex-col items-center gap-2" style={{ position: "absolute", left: "16%" }}>
          <span
            className="rounded-full flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "rgba(124,77,255,0.15)",
              border: "1.5px solid rgba(124,77,255,0.5)",
              boxShadow: "0 0 24px rgba(124,77,255,0.3)",
            }}
          >
            <Robot size={24} weight="fill" color="var(--color-accent-light)" />
          </span>
          <span className="font-mono text-[10px]" style={{ color: "rgba(245,245,244,0.4)" }}>Agent</span>
        </div>

        <svg width="100%" height="84" viewBox="0 0 300 84" className="absolute inset-0" preserveAspectRatio="none" aria-hidden>
          <line x1="66" y1="38" x2="234" y2="38" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <line
            x1="66"
            y1="38"
            x2="234"
            y2="38"
            stroke="var(--color-accent-light)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 6px rgba(124,77,255,0.7))",
              strokeDasharray: 168,
              strokeDashoffset: 168 * (1 - lineDraw),
            }}
          />
          {pulseActive && (
            <circle
              cx={66 + pulseT * 168}
              cy={38}
              r={4}
              fill="#ffffff"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))" }}
            />
          )}
        </svg>

        <div className="flex flex-col items-center gap-2" style={{ position: "absolute", right: "16%" }}>
          <span
            className="rounded-full flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.20)",
            }}
          >
            <Database size={22} weight="fill" color="rgba(245,245,244,0.8)" />
          </span>
          <span className="font-mono text-[10px]" style={{ color: "rgba(245,245,244,0.4)" }}>Your CRM</span>
        </div>
      </div>

      {/* Mini week view */}
      <div
        style={{ opacity: calendarIn, transform: `translateY(${(1 - calendarIn) * 10}px)` }}
        className="w-full max-w-[260px]"
      >
        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className="text-center font-mono text-[10px] py-1 rounded-md"
              style={{
                color: i === THU_COL ? "#0a0a0c" : "rgba(245,245,244,0.5)",
                background: i === THU_COL ? `rgba(124,77,255,${thuHighlight})` : "transparent",
                fontWeight: i === THU_COL ? 700 : 400,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {DAYS.map((_, col) => (
            <div key={col} className="flex flex-col gap-1">
              {[0, 1, 2].map((row) => {
                const isOpenSlot = col === THU_COL && row === OPEN_ROW;
                return (
                  <div
                    key={row}
                    className="h-4 rounded"
                    style={{
                      background: isOpenSlot ? `rgba(124,77,255,${0.25 + slotFound * 0.55})` : "rgba(255,255,255,0.06)",
                      border: isOpenSlot ? `1px solid rgba(124,77,255,${0.4 + slotFound * 0.6})` : "none",
                      boxShadow: isOpenSlot && slotFound > 0.6 ? "0 0 10px rgba(124,77,255,0.5)" : "none",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment written in */}
      <div style={{ opacity: chipIn, transform: `translateY(${(1 - chipIn) * 8}px)` }}>
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2.5"
          style={{ background: "rgba(124,77,255,0.15)", border: "1px solid rgba(124,77,255,0.35)" }}
        >
          <CheckCircle size={15} weight="fill" color="#34d399" />
          <span className="text-[12px] text-white">Sarah M. · Thu 2:00pm added</span>
        </div>
      </div>
    </div>
  );
}
