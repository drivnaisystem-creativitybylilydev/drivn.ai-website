"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Brain, PaperPlaneTilt, Heart } from "@phosphor-icons/react/dist/ssr";
import { SiGmail } from "react-icons/si";

export const FPS = 30;
export const TOTAL_FRAMES = 390;

// Authored wide — a left-to-right pipeline that fills a horizontal band.
export const COMPOSITION_WIDTH = 1180;
export const COMPOSITION_HEIGHT = 280;

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

// Horizontal geometry
const PAD_X = 56; // matches the track inset below
const ICON = 48;
const ROW_TOP = 40; // top offset of the icon row inside the card
const TRACK_Y = ROW_TOP + ICON / 2;

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

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{ opacity: fadeOut, width: COMPOSITION_WIDTH - 40 }}
        className="glass-card glass-glow"
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: `${ROW_TOP}px ${PAD_X}px 36px`,
          }}
        >
          {/* Connecting rail, draws left-to-right as steps activate */}
          <div
            style={{
              position: "absolute",
              left: PAD_X,
              right: PAD_X,
              top: TRACK_Y,
              height: 2,
              background: "rgba(255,255,255,0.08)",
            }}
            aria-hidden
          />
          <div
            style={{
              position: "absolute",
              left: PAD_X,
              top: TRACK_Y,
              height: 2,
              width: `calc((100% - ${PAD_X * 2}px) * ${lineProgress})`,
              background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))",
              boxShadow: "0 0 8px rgba(124,77,255,0.6)",
            }}
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const lit = reveal(frame, STEP_STARTS[i]);
            const isBrand = step.color.startsWith("#");
            return (
              <div
                key={step.label}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  width: 150,
                }}
              >
                <span
                  className="shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: ICON,
                    height: ICON,
                    // Opaque fill (mixed into the surface colour) so the connecting
                    // rail is never visible through the icon.
                    background: `color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} ${14 + lit * 16}%, #131316)`,
                    border: `1.5px solid color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} ${30 + lit * 42}%, rgba(255,255,255,0.05))`,
                    boxShadow: lit > 0.15 ? `0 0 ${16 * lit}px color-mix(in srgb, ${isBrand ? step.color : "var(--color-accent)"} 45%, transparent)` : "none",
                    transform: `scale(${0.92 + lit * 0.08})`,
                  }}
                >
                  <span style={{ display: "flex", opacity: 0.5 + lit * 0.5 }}>
                    <step.Icon size={20} color={step.color} />
                  </span>
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 12,
                    lineHeight: 1.35,
                    textAlign: "center",
                    color: `rgba(245,245,244,${0.4 + lit * 0.5})`,
                    fontWeight: lit > 0.5 ? 600 : 400,
                  }}
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
