"use client";

import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import {
  UserPlus,
  Phone,
  CheckCircle,
  CalendarCheck,
  Briefcase,
  Star,
} from "lucide-react";

const STAGES = [
  { label: "New Lead",         Icon: UserPlus,      accent: "#a78bfa" },
  { label: "Contacted",        Icon: Phone,         accent: "#a78bfa" },
  { label: "Qualified",        Icon: CheckCircle,   accent: "#a78bfa" },
  { label: "Booked",           Icon: CalendarCheck, accent: "#60a5fa" },
  { label: "Completed",        Icon: Briefcase,     accent: "#4ade80" },
  { label: "Review Requested", Icon: Star,          accent: "#fbbf24" },
];

const FRAMES_PER_STAGE = 38;
const HOLD_FRAMES = 35;
const TOTAL_FRAMES = STAGES.length * FRAMES_PER_STAGE + HOLD_FRAMES;

export { TOTAL_FRAMES };

export function CRMPipelineComposition() {
  const frame = useCurrentFrame();

  // Which stage is currently activating (0-based)
  const activeStageIdx = Math.min(
    Math.floor(frame / FRAMES_PER_STAGE),
    STAGES.length - 1
  );

  // Progress of the currently active stage (0→1)
  const stageProgress = (frame % FRAMES_PER_STAGE) / FRAMES_PER_STAGE;

  const isHolding = frame >= STAGES.length * FRAMES_PER_STAGE;

  return (
    <AbsoluteFill
      style={{
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0,
        padding: "0 20px",
      }}
    >
      {STAGES.map((stage, i) => {
        const isCompleted = i < activeStageIdx || isHolding;
        const isActive = i === activeStageIdx && !isHolding;

        // Node scale pulse on activation
        const nodeScale = isActive
          ? 1 + interpolate(stageProgress, [0, 0.3, 0.6, 1], [0, 0.12, 0.06, 0], { extrapolateRight: "clamp" })
          : 1;

        // Opacity for each stage
        const stageOpacity = isCompleted || isActive
          ? 1
          : interpolate(frame, [i * FRAMES_PER_STAGE - 10, i * FRAMES_PER_STAGE], [0.25, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Connector line fill (0→1 as this stage activates)
        const lineFill = i < activeStageIdx || isHolding
          ? 1
          : i === activeStageIdx
          ? interpolate(stageProgress, [0, 0.8], [0, 1], { extrapolateRight: "clamp" })
          : 0;

        const nodeColor = isCompleted
          ? stage.accent
          : isActive
          ? stage.accent
          : "rgba(255,255,255,0.12)";

        const nodeBg = isCompleted || isActive
          ? `${stage.accent}22`
          : "rgba(255,255,255,0.04)";

        const Icon = stage.Icon;

        return (
          <div key={stage.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Row: node + label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: stageOpacity,
                transform: `scale(${nodeScale})`,
                transformOrigin: "left center",
                paddingLeft: 4,
              }}
            >
              {/* Circle node */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: nodeBg,
                  border: `1.5px solid ${nodeColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: isActive || isCompleted
                    ? `0 0 16px ${stage.accent}40`
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <Icon
                  style={{
                    width: 18,
                    height: 18,
                    color: isCompleted || isActive ? stage.accent : "rgba(255,255,255,0.30)",
                  }}
                  strokeWidth={1.75}
                />
              </div>

              {/* Label */}
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive || isCompleted ? 600 : 400,
                    color: isActive
                      ? stage.accent
                      : isCompleted
                      ? "rgba(239,240,243,0.90)"
                      : "rgba(239,240,243,0.35)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {stage.label}
                </span>
                {isCompleted && (
                  <span
                    style={{
                      fontSize: 10,
                      color: `${stage.accent}99`,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {i === STAGES.length - 1 ? "Sent automatically" : "Done"}
                  </span>
                )}
                {isActive && (
                  <span
                    style={{
                      fontSize: 10,
                      color: `${stage.accent}88`,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    In progress...
                  </span>
                )}
              </div>
            </div>

            {/* Connector line (not after last item) */}
            {i < STAGES.length - 1 && (
              <div
                style={{
                  marginLeft: 23,
                  width: 2,
                  height: 22,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${lineFill * 100}%`,
                    background: `linear-gradient(to bottom, ${stage.accent}, ${STAGES[i + 1].accent})`,
                    borderRadius: 2,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
