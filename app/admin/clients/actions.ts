"use server";

import { revalidatePath } from "next/cache";
import { insertClient, updateClient, type ClientStatus } from "@/lib/client-db";

function parseStatus(raw: unknown): ClientStatus {
  const valid: ClientStatus[] = ["prospect", "proposal", "active", "paused", "churned"];
  return valid.includes(raw as ClientStatus) ? (raw as ClientStatus) : "prospect";
}

function parseServices(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseClientFields(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim() ?? "",
    industry: (formData.get("industry") as string)?.trim() ?? "",
    contactName: (formData.get("contactName") as string)?.trim() ?? "",
    contactEmail: (formData.get("contactEmail") as string)?.trim() ?? "",
    status: parseStatus(formData.get("status")),
    mrr: parseInt((formData.get("mrr") as string) ?? "0", 10) || 0,
    services: parseServices(formData.get("services") as string | null),
    notes: (formData.get("notes") as string)?.trim() ?? "",
  };
}

export async function addClientAction(formData: FormData): Promise<{ error?: string }> {
  try {
    const fields = parseClientFields(formData);
    if (!fields.name) return { error: "Client name is required." };
    await insertClient(fields);
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return {};
  } catch (err) {
    console.error("[addClientAction]", err);
    return { error: "Failed to add client. Check MongoDB connection." };
  }
}

export async function editClientAction(
  clientId: string,
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    const fields = parseClientFields(formData);
    if (!fields.name) return { error: "Client name is required." };
    await updateClient(clientId, fields);
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return {};
  } catch (err) {
    console.error("[editClientAction]", err);
    return { error: "Failed to update client." };
  }
}
