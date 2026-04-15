"use server";

import { revalidatePath } from "next/cache";
import { updateSourcedLeadStatus, mergeNicheCategories, type SourcedLeadStatus } from "@/lib/sourced-lead-db";

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

export async function mergeNichesAction(
  fromNiche: string,
  toNiche: string,
): Promise<{ merged?: number; error?: string }> {
  try {
    const count = await mergeNicheCategories(fromNiche, toNiche);
    revalidatePath("/admin/sourced-leads");
    return { merged: count };
  } catch (err) {
    console.error("[mergeNichesAction]", err);
    return { error: "Failed to merge niches." };
  }
}
