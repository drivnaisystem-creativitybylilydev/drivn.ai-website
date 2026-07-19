"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Brain, PaperPlaneTilt, Heart } from "@phosphor-icons/react/dist/ssr";
import { SiGmail } from "react-icons/si";

export const FPS = 30;
export const TOTAL_FRAMES = 390;

const GMAIL_COLOR = "#EA4335";

const STEPS = [
  { label: "Email inquiry received", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Intent identified", Icon: Brain, color: "var(--color-accent-light)" },
  { label: "Response drafted", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Response checked", Icon: SiGmail, color: GMAIL_COLOR },
  { label: "Personalized response sent", Icon: PaperPlaneTilt, color: "var(--color-accent-light)" },
  { label: "Lead stays engaged", Icon: Heart, color: "var(--color-accent-light)" },
];

const STEP_STARTS = [20, 70, 120, 170, 220, 270];
const STEP_LEN = 20;
const ROW_HEIGHT = 52;

function reveal(frame: number, start: number, len = STEP_LEN) {
  return interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export default function WorkflowComposition() {
  const frame = useCurrentFrame();

  const lineProgress = interpolate(
    frame,
    [STEP_STARTS[0], STEP_STARTS[STEP_STARTS.length - 1] + STEP_LEN],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = 1 - interpolate(frame, [340, 365], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const totalHeight = ROW_HEIGHT * STEPS.length - (ROW_HEIGHT - 24);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: fadeOut }} className="glass-card glass-glow w-[400px] p-6">
        <div className="relative" style={{ paddingLeft: 4 }}>
          {/* Connecting line, draws downward as steps activate */}
          <div
            className="absolute left-[24px] top-3 w-px"
            style={{ height: totalHeight, background: "rgba(255,255,255,0.08)" }}
            aria-hidden
          />
          <div
            className="absolute left-[24px] top-3 w-px"
            style={{
              height: totalHeight * lineProgress,
              background: "linear-gradient(180deg, var(--color-accent), var(--color-accent-light))",
              boxShadow: "0 0 8px rgba(124,77,255,0.6)",
            }}
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const lit = reveal(frame, STEP_STARTS[i]);
            const isBrand = step.color.startsWith("#");
            return (
              <div key={step.label} className="relative flex items-center gap-4" style={{ height: ROW_HEIGHT }}>
                <span
                  className="relative z-10 shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: `color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} ${10 + lit * 10}%, transparent)`,
                    border: `1.5px solid color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} ${25 + lit * 45}%, transparent)`,
                    boxShadow: lit > 0.15 ? `0 0 ${14 * lit}px color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} 45%, transparent)` : "none",
                    opacity: 0.45 + lit * 0.55,
                    transform: `scale(${0.9 + lit * 0.1})`,
                  }}
                >
                  <step.Icon size={20} color={step.color} />
                </span>
                <span
                  className="font-mono text-[13px]"
                  style={{ color: `rgba(245,245,244,${0.4 + lit * 0.5})`, fontWeight: lit > 0.5 ? 600 : 400 }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
