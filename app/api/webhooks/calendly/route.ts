import { NextResponse } from "next/server";
import { handleCalendlyWebhookBody } from "@/lib/calendly-webhook-process";
import { verifyCalendlyWebhookSignature } from "@/lib/calendly-verify";

export const runtime = "nodejs";

/**
 * Browser / Calendly “URL check” uses GET. POST carries signed webhook payloads.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/webhooks/calendly",
    methods: ["GET", "POST"],
    hint: "Calendly sends events as signed POST requests. Set CALENDLY_WEBHOOK_SIGNING_KEY in Vercel.",
  });
}

/**
 * Calendly → your app: register this URL in Calendly (Developer → Webhooks).
 *
 * Env: `CALENDLY_WEBHOOK_SIGNING_KEY` — signing key from the webhook subscription.
 * (You create the subscription in the Calendly UI; this is the only manual step.)
 */
export async function POST(request: Request) {
  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY?.trim();
  if (!signingKey) {
    return NextResponse.json(
      { error: "Calendly webhook signing key is not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const sig =
    request.headers.get("calendly-webhook-signature") ??
    request.headers.get("Calendly-Webhook-Signature");

  if (!verifyCalendlyWebhookSignature(rawBody, sig, signingKey)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await handleCalendlyWebhookBody(json);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.matched) {
    return NextResponse.json({
      ok: true,
      matched: true,
      leadId: result.leadId,
      event: result.event,
    });
  }

  return NextResponse.json({
    ok: true,
    matched: false,
    event: result.event,
    reason: result.reason,
  });
}
