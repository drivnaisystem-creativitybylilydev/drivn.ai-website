"use server";

import { redirect } from "next/navigation";
import {
  timingSafeEqualStr,
  setLeadsAdminSessionCookie,
  clearLeadsAdminSessionCookie,
} from "@/lib/admin-session";

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
