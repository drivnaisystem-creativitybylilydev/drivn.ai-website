"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PhoneCall, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export const FPS = 30;
export const TOTAL_FRAMES = 330;

const BAR_COUNT = 24;

function reveal(frame: number, start: number, len = 20) {
  return interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export default function ReceptionistComposition() {
  const frame = useCurrentFrame();

  const line1 = reveal(frame, 40, 25);
  const line2 = reveal(frame, 110, 25);
  const line3 = reveal(frame, 180, 25);
  const confirmed = reveal(frame, 235, 20);
  const fadeOut = 1 - interpolate(frame, [300, 325], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineStyle = (progress: number) => ({ opacity: progress * fadeOut, transform: `translateY(${(1 - progress) * 6}px)` });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-card glass-glow w-[420px] p-6">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(124,77,255,0.15)", border: "1px solid rgba(124,77,255,0.40)" }}
          >
            <PhoneCall size={18} weight="fill" color="var(--color-accent-light)" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-white leading-tight">Incoming — Sarah M.</p>
            <p className="font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.4)" }}>
              {String(Math.floor(frame / 30 / 60)).padStart(2, "0")}:{String(Math.floor((frame / 30) % 60)).padStart(2, "0")}
            </p>
          </div>
          <span className="ml-auto w-2.5 h-2.5 rounded-full" style={{ background: "#34d399", opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame / 12)) }} aria-hidden />
        </div>

        {/* Continuous waveform — always "live" for the whole loop */}
        <div className="flex items-center gap-[3px] h-11 mb-5">
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(frame / 8 + i * 0.6)) * 28;
            return (
              <div key={i} className="flex-1 rounded-full" style={{ height: `${h}px`, background: "var(--color-accent-light)" }} />
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          <div style={lineStyle(line1)} className="rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[88%]" >
            <div style={{ background: "rgba(255,255,255,0.05)" }} className="rounded-xl px-0 py-0">
              <p className="text-[13px] leading-snug text-white">&ldquo;I&apos;d like to book an appointment.&rdquo;</p>
            </div>
          </div>
          <div style={{ ...lineStyle(line2), background: "rgba(124,77,255,0.18)", border: "1px solid rgba(124,77,255,0.30)" }} className="rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[88%] ml-auto">
            <p className="text-[13px] leading-snug text-white">&ldquo;Of course — what day works for you?&rdquo;</p>
          </div>
          <div style={{ ...lineStyle(line3), background: "rgba(255,255,255,0.05)" }} className="rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[88%]">
            <p className="text-[13px] leading-snug text-white">&ldquo;Thursday afternoon, if possible.&rdquo;</p>
          </div>
        </div>

        <div style={{ opacity: confirmed * fadeOut, borderColor: "rgba(255,255,255,0.08)" }} className="flex items-center justify-between pt-4 border-t">
          <span className="flex items-center gap-1.5 font-mono text-[11.5px]" style={{ color: "#34d399" }}>
            <CheckCircle size={14} weight="fill" />
            Appointment confirmed
          </span>
          <span className="font-mono text-[10.5px]" style={{ color: "rgba(245,245,244,0.38)" }}>
            No escalation needed
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
