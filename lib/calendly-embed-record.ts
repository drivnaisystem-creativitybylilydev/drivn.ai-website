import { getLeadsDb } from "@/lib/mongodb";
import { findLatestLeadIdByEmail, mergeLeadBooking } from "@/lib/lead-db";

const COLLECTION = "calendly_embed_bookings";

export type CalendlyEmbedBookingDoc = {
  createdAt: Date;
  email: string | null;
  fullName: string | null;
  eventUri: string;
  inviteeUri: string;
  leadId: string | null;
  leadMatched: boolean;
};

function isCalendlyUri(value: string): boolean {
  return value.includes("calendly.com") || value.includes("calendly.");
}

/**
 * Free Calendly: no API webhooks. Called when the embed fires `event_scheduled`
 * (postMessage). Always logs a row for audit; updates `leads` when email matches.
 */
export async function recordCalendlyEmbedBooking(input: {
  email: string | null;
  fullName: string | null;
  eventUri: string;
  inviteeUri: string;
}): Promise<{ leadMatched: boolean; leadId: string | null }> {
  const emailNorm = input.email?.trim().toLowerCase() ?? null;
  let leadId: string | null = null;
  let leadMatched = false;

  if (emailNorm && emailNorm.includes("@")) {
    leadId = await findLatestLeadIdByEmail(emailNorm);
    if (leadId) {
      const now = new Date();
      await mergeLeadBooking(
        leadId,
        {
          calendlyEventUri: input.eventUri,
          calendlyInviteeUri: input.inviteeUri,
          lastWebhookAt: now,
          invitees: input.fullName
            ? [{ email: emailNorm, name: input.fullName.trim() }]
            : [{ email: emailNorm }],
        },
        { setStatus: "call_booked" },
      );
      leadMatched = true;
    }
  }

  const db = await getLeadsDb();
  if (db) {
    const col = db.collection<CalendlyEmbedBookingDoc>(COLLECTION);
    await col.createIndex({ createdAt: -1 }).catch(() => {});
    await col.insertOne({
      createdAt: new Date(),
      email: emailNorm,
      fullName: input.fullName?.trim() ?? null,
      eventUri: input.eventUri,
      inviteeUri: input.inviteeUri,
      leadId,
      leadMatched,
    });
  }

  return { leadMatched, leadId };
}

export function parseCalendlyEmbedBody(body: unknown): {
  email: string | null;
  fullName: string | null;
  eventUri: string;
  inviteeUri: string;
} | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const eventUri = typeof o.eventUri === "string" ? o.eventUri.trim() : "";
  const inviteeUri = typeof o.inviteeUri === "string" ? o.inviteeUri.trim() : "";
  if (!eventUri || !inviteeUri) return null;
  if (!isCalendlyUri(eventUri) || !isCalendlyUri(inviteeUri)) return null;

  const email = typeof o.email === "string" && o.email.includes("@") ? o.email.trim() : null;
  const fullName = typeof o.fullName === "string" ? o.fullName.trim() : null;

  return { email, fullName, eventUri, inviteeUri };
}
