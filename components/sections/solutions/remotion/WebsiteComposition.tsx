"use client";

import { AbsoluteFill, useCurrentFrame } from "remotion";

export const FPS = 30;
export const TOTAL_FRAMES = 360;

const VIEWPORT_HEIGHT = 420;
const CONTENT_HEIGHT = 620;

function PageContent() {
  return (
    <div style={{ height: CONTENT_HEIGHT }} className="px-7 pt-8">
      {/* Hero block */}
      <div className="h-3 rounded-full w-3/4 mb-3" style={{ background: "rgba(255,255,255,0.7)" }} />
      <div className="h-3 rounded-full w-1/2 mb-5" style={{ background: "rgba(255,255,255,0.7)" }} />
      <div className="h-1.5 rounded-full w-full mb-1.5" style={{ background: "rgba(255,255,255,0.16)" }} />
      <div className="h-1.5 rounded-full w-4/5 mb-6" style={{ background: "rgba(255,255,255,0.16)" }} />
      <div className="inline-flex items-center rounded-full px-5 py-2.5 mb-10" style={{ background: "var(--color-accent)" }}>
        <span className="font-mono text-[11px] font-medium text-white">Book Now</span>
      </div>

      {/* 3-up feature row */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-6 h-6 rounded-md mb-2" style={{ background: "rgba(124,77,255,0.30)" }} />
            <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.18)" }} />
          </div>
        ))}
      </div>

      {/* Testimonial-style block */}
      <div className="rounded-xl p-4 mb-10" style={{ background: "rgba(124,77,255,0.08)", border: "1px solid rgba(124,77,255,0.20)" }}>
        <div className="h-1.5 rounded-full w-full mb-1.5" style={{ background: "rgba(255,255,255,0.22)" }} />
        <div className="h-1.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.22)" }} />
      </div>

      {/* Footer-style row */}
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 rounded-full flex-1" style={{ background: "rgba(255,255,255,0.10)" }} />
        ))}
      </div>
    </div>
  );
}

export default function WebsiteComposition() {
  const frame = useCurrentFrame();
  const progress = (frame % TOTAL_FRAMES) / TOTAL_FRAMES;
  const offset = progress * CONTENT_HEIGHT;

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-card glass-glow w-[440px] overflow-hidden">
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
        >
          <div className="flex gap-1.5" aria-hidden>
            <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <span
            className="flex-1 text-center font-mono text-[10.5px] rounded-full py-1"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(245,245,244,0.45)" }}
          >
            yourbusiness.com
          </span>
        </div>

        <div style={{ height: VIEWPORT_HEIGHT, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: -offset, left: 0, right: 0 }}>
            <PageContent />
            <PageContent />
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(10,10,12,0.6))" }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "#34d399" }}>● Live in 2 weeks</span>
          <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: "rgba(245,245,244,0.38)" }}>SEO built in</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
