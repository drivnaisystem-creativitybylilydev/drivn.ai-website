"use server";

import { revalidatePath } from "next/cache";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import {
  updateLeadStage,
  logLeadAction,
  updateLeadNotes,
  type PipelineStage,
  type ActionLogEntry,
} from "@/lib/consultant-pipeline-db";

// ─── Auth guard helper ────────────────────────────────────────────────────────

async function requireAuth(): Promise<{ error: string } | null> {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) return { error: "Unauthorized" };
  return null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function moveLeadToStage(
  leadId: string,
  stage: PipelineStage,
): Promise<{ success?: boolean; error?: string }> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  const stageActionMap: Partial<Record<PipelineStage, ActionLogEntry["action"]>> = {
    emailed: "emailed",
    followed_up: "followed_up",
    called: "called",
    replied: "replied",
    meeting: "meeting_booked",
  };

  const [staged] = await Promise.all([
    updateLeadStage(leadId, stage),
  ]);

  if (!staged) return { error: "Lead not found or DB error" };

  // Auto-log an action when moving to a meaningful stage
  const logAction = stageActionMap[stage];
  if (logAction) {
    await logLeadAction(leadId, {
      action: logAction,
      timestamp: new Date().toISOString(),
    });
  }

  revalidatePath("/admin/consultant-pipeline");
  return { success: true };
}

export async function logAction(
  leadId: string,
  action: ActionLogEntry["action"],
  note?: string,
): Promise<{ success?: boolean; error?: string }> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  const entry: ActionLogEntry = {
    action,
    timestamp: new Date().toISOString(),
    ...(note ? { note } : {}),
  };

  const ok = await logLeadAction(leadId, entry);
  if (!ok) return { error: "Lead not found or DB error" };

  revalidatePath("/admin/consultant-pipeline");
  return { success: true };
}

export async function updateNotes(
  leadId: string,
  notes: string,
): Promise<{ success?: boolean; error?: string }> {
  const authErr = await requireAuth();
  if (authErr) return authErr;

  const ok = await updateLeadNotes(leadId, notes);
  if (!ok) return { error: "Lead not found or DB error" };

  revalidatePath("/admin/consultant-pipeline");
  return { success: true };
}
