"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import ReceptionistComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/ReceptionistComposition";
import ReceptionistMockup from "@/components/sections/solutions/mockups/ReceptionistMockup";

export default function ReceptionistPlayer() {
  return (
    <SolutionPlayer
      component={ReceptionistComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={560}
      compositionHeight={520}
      fallback={<ReceptionistMockup />}
    />
  );
}
