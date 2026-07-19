"use client";

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ChatCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import { AgentCrmScene } from "@/components/sections/solutions/remotion/AgentCrmScene";

export const FPS = 30;
export const TOTAL_FRAMES = 600;

const CHANNELS = [
  { Icon: SiWhatsapp, color: "#25D366" },
  { Icon: SiInstagram, color: "#E4405F" },
  { Icon: ChatCircle, color: "var(--color-accent-light)" },
];

const BACKEND_START = 235;

function reveal(frame: number, start: number, len = 20) {
  return interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export default function MessagingAgentComposition() {
  const frame = useCurrentFrame();

  const incoming = reveal(frame, 30, 25);
  const aiReply = reveal(frame, 100, 25);
  const userReply = reveal(frame, 170, 25);
  const finalReply = reveal(frame, 500, 25);
  const status = reveal(frame, 540, 20);

  // Chat window visibility — fades out for the CRM cutaway, fades back in after.
  const chatOut = 1 - reveal(frame, 205, 25);
  const chatIn = reveal(frame, 465, 25);
  const chatVisible = Math.max(chatOut, chatIn);
  const chatBlur = (1 - chatVisible) * 6;
  const chatScale = 0.97 + chatVisible * 0.03;

  // Backend cutaway visibility — windowed (fades in, holds, fades out).
  const backendIn = reveal(frame, 225, 15);
  const backendOut = 1 - reveal(frame, 455, 15);
  const backendVisible = Math.min(backendIn, backendOut);

  // Final loop fade — everything settles back to the empty chat state at the seam.
  const loopFadeOut = 1 - interpolate(frame, [575, 598], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bubbleStyle = (progress: number) => ({
    opacity: progress * chatVisible * loopFadeOut,
    transform: `translateY(${(1 - progress) * 8}px)`,
  });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-card glass-glow w-[420px] h-[420px] relative overflow-hidden">
        {/* Chat layer */}
        <div
          className="absolute inset-0 p-6"
          style={{
            opacity: chatVisible * loopFadeOut,
            filter: `blur(${chatBlur}px)`,
            transform: `scale(${chatScale})`,
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            {CHANNELS.map((ch, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: ch.color.startsWith("#") ? `${ch.color}1A` : "rgba(124,77,255,0.10)",
                  border: `1px solid ${ch.color.startsWith("#") ? `${ch.color}4D` : "rgba(124,77,255,0.30)"}`,
                }}
              >
                <ch.Icon size={16} color={ch.color} />
              </span>
            ))}
            <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "rgba(245,245,244,0.35)" }}>
              Any inbox
            </span>
          </div>

          <div
            style={{ ...bubbleStyle(incoming), background: "rgba(255,255,255,0.05)" }}
            className="rounded-xl rounded-tl-sm px-4 py-3 mb-2.5 max-w-[85%]"
          >
            <p className="text-[14px] leading-snug text-white">Hey, do you have availability Thursday?</p>
          </div>

          <div
            style={{ ...bubbleStyle(aiReply), background: "rgba(124,77,255,0.18)", border: "1px solid rgba(124,77,255,0.30)" }}
            className="rounded-xl rounded-tr-sm px-4 py-3 mb-2.5 max-w-[85%] ml-auto"
          >
            <p className="text-[14px] leading-snug text-white">Yes! 2pm works — want me to book it in?</p>
          </div>

          <div
            style={{ ...bubbleStyle(userReply), background: "rgba(255,255,255,0.05)" }}
            className="rounded-xl rounded-tl-sm px-4 py-3 mb-2.5 max-w-[85%]"
          >
            <p className="text-[14px] leading-snug text-white">Yes please!</p>
          </div>

          <div
            style={{ ...bubbleStyle(finalReply), background: "rgba(124,77,255,0.18)", border: "1px solid rgba(124,77,255,0.30)" }}
            className="rounded-xl rounded-tr-sm px-4 py-3 mb-4 max-w-[85%] ml-auto"
          >
            <p className="text-[14px] leading-snug text-white">Booked — see you Thursday at 2pm.</p>
          </div>

          <div
            style={{ opacity: status * chatVisible * loopFadeOut, borderColor: "rgba(255,255,255,0.08)" }}
            className="flex items-center justify-between pt-4 border-t"
          >
            <span className="flex items-center gap-1.5 font-mono text-[12px]" style={{ color: "#34d399" }}>
              <CheckCircle size={15} weight="fill" />
              Booked
            </span>
            <span className="font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.38)" }}>
              Synced to CRM
            </span>
          </div>
        </div>

        {/* Backend cutaway layer — the agent querying the CRM */}
        <div
          className="absolute inset-0"
          style={{
            opacity: backendVisible,
            transform: `scale(${0.97 + backendVisible * 0.03})`,
            pointerEvents: "none",
          }}
        >
          <AgentCrmScene start={BACKEND_START} />
        </div>
      </div>
    </AbsoluteFill>
  );
}
