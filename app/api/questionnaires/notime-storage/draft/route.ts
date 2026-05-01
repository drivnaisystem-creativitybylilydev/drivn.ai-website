import { NextResponse } from "next/server";
import { upsertQuestionnaireDraft } from "@/lib/questionnaire-db";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = json as Record<string, unknown>;
  const sessionId = raw.sessionId as string | undefined;
  const data = raw.data as Record<string, string> | undefined;
  const checkboxes = raw.checkboxes as
    | { q12Drivers: Record<string, boolean>; q22Pick: Record<string, boolean> }
    | undefined;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "data is required" }, { status: 400 });
  }

  if (
    !checkboxes ||
    typeof checkboxes.q12Drivers !== "object" ||
    typeof checkboxes.q22Pick !== "object"
  ) {
    return NextResponse.json({ error: "checkboxes is required" }, { status: 400 });
  }

  try {
    const id = await upsertQuestionnaireDraft(sessionId, data, checkboxes);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("Error saving questionnaire draft:", err);
    return NextResponse.json(
      { error: "Failed to save draft. Try again later." },
      { status: 500 }
    );
  }
}
