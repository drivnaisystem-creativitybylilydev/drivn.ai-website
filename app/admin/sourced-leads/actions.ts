"use server";

import { revalidatePath } from "next/cache";
import { updateSourcedLeadStatus, type SourcedLeadStatus } from "@/lib/sourced-lead-db";

export async function updateLeadStatusAction(
  id: string,
  status: SourcedLeadStatus,
): Promise<{ error?: string }> {
  try {
    await updateSourcedLeadStatus(id, status);
    revalidatePath("/admin/sourced-leads");
    return {};
  } catch (err) {
    console.error("[updateLeadStatusAction]", err);
    return { error: "Failed to update status." };
  }
}
