"use server";

import { revalidatePath } from "next/cache";
import { updateSourcedLeadStatus, mergeNicheCategories, createManualLead, type SourcedLeadStatus } from "@/lib/sourced-lead-db";

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

export async function addBusinessAction(data: {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}): Promise<{ id?: string; error?: string }> {
  try {
    const id = await createManualLead(data);
    revalidatePath("/admin/sourced-leads");
    return { id };
  } catch (err) {
    console.error("[addBusinessAction]", err);
    return { error: err instanceof Error ? err.message : "Failed to add business." };
  }
}
