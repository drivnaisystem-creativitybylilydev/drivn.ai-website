"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import WorkflowComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/WorkflowComposition";
import WorkflowMockup from "@/components/sections/solutions/mockups/WorkflowMockup";

export default function WorkflowPlayer() {
  return (
    <SolutionPlayer
      component={WorkflowComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={520}
      compositionHeight={520}
      fallback={<WorkflowMockup />}
    />
  );
}
