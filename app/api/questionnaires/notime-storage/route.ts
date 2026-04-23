import { NextResponse } from "next/server";
import {
  buildNotimeQuestionnaireAdminHtml,
  isQuestionnaireEmailConfigured,
  sendNotimeQuestionnaireEmails,
} from "@/lib/case-study-questionnaire/notime-storage-email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = json as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!isQuestionnaireEmailConfigured()) {
    return NextResponse.json(
      {
        error: "Form delivery is not configured.",
        hint: "Set RESEND_API_KEY, RESEND_FROM_EMAIL, and QUESTIONNAIRE_INBOX_EMAIL on the server.",
      },
      { status: 503 },
    );
  }

  const data: Record<string, string> = {};
  if (json && typeof json === "object" && !Array.isArray(json)) {
    for (const [k, v] of Object.entries(json)) {
      if (k === "website") continue;
      if (typeof v === "string") data[k] = v;
      else if (v != null) data[k] = String(v);
    }
  }

  const clientName = data.client_name?.trim() ?? "";
  if (!clientName) {
    return NextResponse.json(
      { error: "Please enter your name at the top of the form." },
      { status: 400 },
    );
  }

  const adminHtml = buildNotimeQuestionnaireAdminHtml(data);
  const first = clientName.split(/\s+/)[0] ?? clientName;
  const result = await sendNotimeQuestionnaireEmails({
    adminHtml,
    clientEmail: data.client_email,
    clientFirstName: first,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Could not submit. Try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
