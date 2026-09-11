"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import WorkflowComposition, {
  FPS,
  TOTAL_FRAMES,
  COMPOSITION_WIDTH,
  COMPOSITION_HEIGHT,
} from "@/components/sections/solutions/remotion/WorkflowComposition";
import WorkflowMockup from "@/components/sections/solutions/mockups/WorkflowMockup";

export default function WorkflowPlayer() {
  return (
    <SolutionPlayer
      component={WorkflowComposition}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={COMPOSITION_WIDTH}
      compositionHeight={COMPOSITION_HEIGHT}
      fallback={<WorkflowMockup />}
    />
  );
}
