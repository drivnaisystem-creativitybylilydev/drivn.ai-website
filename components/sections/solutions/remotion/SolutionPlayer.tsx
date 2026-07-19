"use client";

import { Player } from "@remotion/player";
import { useInView, useReducedMotion } from "framer-motion";
import { useRef, type ComponentType, type ReactNode } from "react";

// These compositions were authored at normal 30fps pacing (11-19s full length) —
// far too slow for a marketing-site showcase panel. Play them back compressed so
// a visitor sees the whole demo in a few seconds instead of waiting it out.
const PLAYBACK_RATE = 3.5;

export function SolutionPlayer({
  component,
  durationInFrames,
  fps = 30,
  compositionWidth,
  compositionHeight,
  fallback,
  className = "",
}: {
  component: ComponentType;
  durationInFrames: number;
  fps?: number;
  compositionWidth: number;
  compositionHeight: number;
  fallback: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // A hand-rolled IntersectionObserver driving manual play()/pause()/seekTo() calls
  // kept finding new edge cases (concurrency, threshold flicker, timing races) and
  // still wasn't reliably firing in real scrolling. Simpler and much more robust:
  // only mount the <Player> while the panel is actually in view — `once: false` so
  // it remounts (and Remotion's own `autoPlay` fires fresh) every time you scroll
  // back to it — and let `autoPlay` + `loop` do the playing natively, no manual
  // triggering at all. On the server (and until measured client-side) this starts
  // `false`, so it never server-renders the Player — same hydration-safety the old
  // `mounted` gate provided, just via a well-tested hook instead of hand-rolled state.
  const inView = useInView(containerRef, { amount: 0.35, once: false });

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {reducedMotion || !inView ? (
        fallback
      ) : (
        <Player
          component={component}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={compositionWidth}
          compositionHeight={compositionHeight}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          // Browsers block unmuted autoplay without a user gesture, which was silently
          // stalling every panel — these compositions have no real audio anyway (just
          // Remotion's internal sync tags), so muting costs nothing and fixes autoplay.
          initiallyMuted
          loop
          playbackRate={PLAYBACK_RATE}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          allowFullscreen={false}
          showPosterWhenUnplayed={false}
          renderLoading={() => null}
          className={className}
          acknowledgeRemotionLicense
        />
      )}
    </div>
  );
}
