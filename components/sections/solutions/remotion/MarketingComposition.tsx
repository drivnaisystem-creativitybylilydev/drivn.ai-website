"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Envelope } from "@phosphor-icons/react/dist/ssr";
import { SiGoogleads, SiInstagram, SiFacebook } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

export const FPS = 30;
export const TOTAL_FRAMES = 330;

const ITEMS = [
  { Icon: SiGoogleads, label: "Google Ads", status: "12 new clicks", color: "#4285F4" },
  { Icon: FaLinkedin, label: "LinkedIn post", status: "Published", color: "#0A66C2" },
  { Icon: SiInstagram, label: "Instagram", status: "Scheduled", color: "#E4405F" },
  { Icon: SiFacebook, label: "Facebook Ad", status: "3 new leads", color: "#1877F2" },
  { Icon: Envelope, label: "Email campaign", status: "Sent to 240", color: "var(--color-accent-light)" },
];

function reveal(frame: number, start: number, len = 20) {
  return interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export default function MarketingComposition() {
  const frame = useCurrentFrame();
  const fadeOut = 1 - interpolate(frame, [300, 325], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-card glass-glow w-[420px] p-6 flex flex-col gap-2.5">
        {ITEMS.map((item, i) => {
          const progress = reveal(frame, 20 + i * 42, 22);
          return (
            <div
              key={item.label}
              style={{
                opacity: progress * fadeOut,
                transform: `translateX(${(1 - progress) * -12}px)`,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5"
            >
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: item.color.startsWith("#") ? `${item.color}1A` : "rgba(124,77,255,0.10)",
                  border: `1px solid ${item.color.startsWith("#") ? `${item.color}4D` : "rgba(124,77,255,0.28)"}`,
                }}
              >
                <item.Icon size={16} color={item.color} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-white leading-tight">{item.label}</p>
                <p className="font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.42)" }}>{item.status}</p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#34d399" }} aria-hidden />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
