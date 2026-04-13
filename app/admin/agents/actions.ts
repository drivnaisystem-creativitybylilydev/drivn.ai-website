"use server";

import { revalidatePath } from "next/cache";
import { insertAgentRun, deleteAgentRun } from "@/lib/agent-db";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";

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

export async function deleteAgentRunAction(runId: string): Promise<{ error?: string }> {
  if (!(await isLeadsAdminAuthenticated())) return { error: "Unauthorized" };
  try {
    await deleteAgentRun(runId);
    revalidatePath("/admin/agents");
    return {};
  } catch (err) {
    console.error("[deleteAgentRunAction]", err);
    return { error: "Failed to delete run." };
  }
}
