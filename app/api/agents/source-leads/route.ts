import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { runMasterLeadAgent } from "@/lib/lead-sourcing/master-agent";
import { upsertSourcedLead } from "@/lib/sourced-lead-db";
import type { SourcingBrief } from "@/lib/lead-sourcing/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // ── Auth debug ─────────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("leads_admin_session")?.value;
  console.log("[source-leads] cookie present:", !!sessionCookie);
  console.log("[source-leads] password env set:", !!process.env.LEADS_ADMIN_PASSWORD?.trim());
  // ──────────────────────────────────────────────────────────────────────────

  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    console.log("[source-leads] auth failed — cookie:", !!sessionCookie, "password:", !!process.env.LEADS_ADMIN_PASSWORD?.trim());
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let brief: SourcingBrief;
  try {
    brief = (await req.json()) as SourcingBrief;
    if (!brief.query?.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  brief.maxLeads = Math.min(brief.maxLeads ?? 20, 40);

  try {
    const result = await runMasterLeadAgent(brief);

    // Save all scored leads to DB (upsert by placeId — no dupes)
    let savedCount = 0;
    await Promise.allSettled(
      result.leads.map(async (lead) => {
        await upsertSourcedLead(lead, brief.query);
        savedCount++;
      }),
    );

    return NextResponse.json({ ...result, savedToDb: savedCount });
  } catch (err) {
    console.error("[source-leads]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent failed" },
      { status: 500 },
    );
  }
}
