"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import OperatingSystemComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/OperatingSystemComposition";
import OperatingSystemMockup from "@/components/sections/solutions/mockups/OperatingSystemMockup";

export default function OperatingSystemPlayer() {
  return (
    <SolutionPlayer
      component={OperatingSystemComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={1400}
      compositionHeight={1050}
      fallback={<OperatingSystemMockup />}
    />
  );
}
