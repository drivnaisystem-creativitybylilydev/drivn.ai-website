import { NextResponse } from "next/server";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listConsultantLeads, getLeadStats } from "@/lib/consultant-pipeline-db";

export async function GET() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [leads, stats] = await Promise.all([
    listConsultantLeads(),
    getLeadStats(),
  ]);

  return NextResponse.json({ leads, stats });
}
