"use client";

/**
 * Operating-System visual for the homepage "What We Build" closing panel.
 *
 * Deliberately NOT via SolutionPlayer: that swaps a small `max-w-[720px]` mockup for
 * a full-frame <Player> on scroll-in, which reads as the dashboard "growing" into
 * place. Here the footprint is always the final size — an empty full-size box while
 * out of view, then the <Player> crossfades in on top at that same size. Reduced
 * motion gets the settled final frame, static, at the same size.
 */

import { Player } from "@remotion/player";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import OperatingSystemComposition, {
  FPS,
  TOTAL_FRAMES,
} from "@/components/sections/solutions/remotion/OperatingSystemComposition";

// Compositions were authored at a slow 30fps pace — play back compressed.
const PLAYBACK_RATE = 3.5;
const EASE = [0.32, 0.72, 0, 1] as const;

const PLAYER_PROPS = {
  component: OperatingSystemComposition,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  compositionWidth: 1400,
  compositionHeight: 1050,
  style: { width: "100%", height: "100%" },
  initiallyMuted: true,
  controls: false,
  clickToPlay: false,
  doubleClickToFullscreen: false,
  spaceKeyToPlayOrPause: false,
  allowFullscreen: false,
  showPosterWhenUnplayed: false,
  renderLoading: () => null,
  acknowledgeRemotionLicense: true as const,
};

export default function OperatingSystemPlayer() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // once: false — keeps the homepage's behaviour of replaying when scrolled back to.
  const inView = useInView(ref, { amount: 0.3, once: false });

  return (
    <div ref={ref} className="relative h-full w-full">
      {reducedMotion ? (
        // Static settled frame, full size — no motion, no swap.
        <Player
          {...PLAYER_PROPS}
          autoPlay={false}
          loop={false}
          initialFrame={TOTAL_FRAMES - 1}
        />
      ) : (
        <AnimatePresence>
          {inView && (
            <motion.div
              key="os-player"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <Player
                {...PLAYER_PROPS}
                autoPlay
                loop
                playbackRate={PLAYBACK_RATE}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
