"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  timingSafeEqualStr,
  setLeadsAdminSessionCookie,
  clearLeadsAdminSessionCookie,
  isLeadsAdminAuthenticated,
} from "@/lib/admin-session";
import { LEAD_STATUS_OPTIONS, type LeadStatus } from "@/lib/lead-document";
import { updateLeadCrmFields } from "@/lib/lead-db";

export async function loginLeadsAdmin(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string") {
    redirect("/admin/leads?e=1");
  }
  const expected = process.env.LEADS_ADMIN_PASSWORD?.trim();
  if (!expected) {
    redirect("/admin/leads?e=2");
  }
  if (!timingSafeEqualStr(password, expected)) {
    redirect("/admin/leads?e=1");
  }
  await setLeadsAdminSessionCookie();
  redirect("/admin/leads");
}

export async function logoutLeadsAdmin() {
  await clearLeadsAdminSessionCookie();
  redirect("/admin/leads");
}

function parseLeadStatus(raw: FormDataEntryValue | null): LeadStatus | null {
  if (typeof raw !== "string") return null;
  return LEAD_STATUS_OPTIONS.includes(raw as LeadStatus) ? (raw as LeadStatus) : null;
}

export async function updateLeadCrmFromAdmin(formData: FormData) {
  if (!(await isLeadsAdminAuthenticated())) {
    redirect("/admin/leads");
  }
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !ObjectId.isValid(leadId.trim())) {
    redirect("/admin/leads");
  }
  const status = parseLeadStatus(formData.get("status"));
  if (!status) {
    redirect("/admin/leads");
  }
  const internalNotes =
    typeof formData.get("internalNotes") === "string"
      ? formData.get("internalNotes")
      : "";
  const callNotes =
    typeof formData.get("callNotes") === "string" ? formData.get("callNotes") : "";

  await updateLeadCrmFields(leadId.trim(), {
    status,
    internalNotes: internalNotes as string,
    callNotes: callNotes as string,
  });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
