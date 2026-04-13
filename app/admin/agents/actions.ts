"use server";

import { revalidatePath } from "next/cache";
import { insertAgentRun } from "@/lib/agent-db";

export async function runAgentAction(
  agentId: string,
  agentName: string,
): Promise<{ runId?: string; error?: string }> {
  try {
    const runId = await insertAgentRun({ agentId, agentName, triggeredBy: "manual" });
    revalidatePath("/admin/agents");
    // Remote Control hook: when environment_id is available, fire the trigger here.
    return { runId };
  } catch (err) {
    console.error("[runAgentAction]", err);
    return { error: "Failed to queue agent run." };
  }
}
