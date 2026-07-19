"use client";

import { SolutionPlayer } from "@/components/sections/solutions/remotion/SolutionPlayer";
import MessagingAgentComposition, { FPS, TOTAL_FRAMES } from "@/components/sections/solutions/remotion/MessagingAgentComposition";
import MessagingAgentMockup from "@/components/sections/solutions/mockups/MessagingAgentMockup";

export default function MessagingAgentPlayer() {
  return (
    <SolutionPlayer
      component={MessagingAgentComposition}
      // Full length, including the last ~25 frames that fade everything back to the
      // empty chat state — that fade exists specifically so `loop` restarts seamlessly.
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      compositionWidth={560}
      compositionHeight={480}
      fallback={<MessagingAgentMockup />}
    />
  );
}
