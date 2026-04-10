import { NextResponse } from "next/server";
import { parseCalendlyEmbedBody, recordCalendlyEmbedBooking } from "@/lib/calendly-embed-record";
import { isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

/**
 * Records a booking after the Calendly **inline embed** fires `event_scheduled`
 * (works on free Calendly; no webhook subscription required).
 *
 * Best used with the same email the visitor used on your discovery form so we
 * can attach booking URIs to the existing lead.
 */
export async function POST(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = json as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const parsed = parseCalendlyEmbedBody(json);
  if (!parsed) {
    return NextResponse.json(
      { error: "eventUri and inviteeUri must be non-empty Calendly URLs." },
      { status: 400 },
    );
  }

  try {
    const result = await recordCalendlyEmbedBooking(parsed);
    return NextResponse.json({
      ok: true,
      leadMatched: result.leadMatched,
      leadId: result.leadId,
    });
  } catch (err) {
    console.error("[calendly-embed] record failed:", err);
    return NextResponse.json({ error: "Could not save booking." }, { status: 502 });
  }
}
