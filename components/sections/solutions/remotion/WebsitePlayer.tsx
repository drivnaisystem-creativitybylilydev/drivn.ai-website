"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import WebsiteComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/WebsiteComposition";
import WebsiteMockup from "@/components/sections/solutions/mockups/WebsiteMockup";

export default function WebsitePlayer() {
  return (
    <SolutionPlayer
      component={WebsiteComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={560}
      compositionHeight={520}
      fallback={<WebsiteMockup />}
    />
  );
}
