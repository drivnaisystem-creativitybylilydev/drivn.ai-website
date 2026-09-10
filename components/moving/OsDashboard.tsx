"use client";

/**
 * Operating-System dashboard for /moving-and-logistics.
 *
 * Same Remotion composition the homepage Services section uses, but without
 * SolutionPlayer's small placeholder card. SolutionPlayer swaps a compact
 * `max-w-[720px]` fallback for the full-size <Player> on scroll-in, which reads as
 * the visual "growing" into place. Here the box is always the final size: nothing
 * renders until it scrolls into view, then the <Player> mounts at full size and
 * plays the composition's own intro (card fade-in, chart draw, count-ups). Reduced
 * motion gets the settled final frame, static, at the same size.
 */

import { Player } from "@remotion/player";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import OperatingSystemComposition, {
  FPS,
  TOTAL_FRAMES,
} from "@/components/sections/solutions/remotion/OperatingSystemComposition";

// Matches SolutionPlayer — these compositions were authored at a slow 30fps pace.
const PLAYBACK_RATE = 3.5;

export default function OsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Never render <Player> during SSR / first paint (hydration safety), and only
  // once the block is actually in view. `once: true` so it never unmounts and
  // never replays-from-small on scroll-back.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const inView = useInView(ref, { amount: 0.2, once: true });
  const show = mounted && inView;

  return (
    <div ref={ref} className="h-full w-full">
      {show && (
        <Player
          component={OperatingSystemComposition}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          compositionWidth={1400}
          compositionHeight={1050}
          style={{ width: "100%", height: "100%" }}
          autoPlay={!reducedMotion}
          initialFrame={reducedMotion ? TOTAL_FRAMES - 1 : 0}
          initiallyMuted
          loop={!reducedMotion}
          playbackRate={PLAYBACK_RATE}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          allowFullscreen={false}
          showPosterWhenUnplayed={false}
          renderLoading={() => null}
          acknowledgeRemotionLicense
        />
      )}
    </div>
  );
}
