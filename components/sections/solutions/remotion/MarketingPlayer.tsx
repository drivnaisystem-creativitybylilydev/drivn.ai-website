"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import MarketingComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/MarketingComposition";
import MarketingMockup from "@/components/sections/solutions/mockups/MarketingMockup";

export default function MarketingPlayer() {
  return (
    <SolutionPlayer
      component={MarketingComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={560}
      compositionHeight={520}
      fallback={<MarketingMockup />}
    />
  );
}
