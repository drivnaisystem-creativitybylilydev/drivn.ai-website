import { findLatestLeadIdByEmail, mergeLeadBooking } from "@/lib/lead-db";
import type { LeadBooking, LeadInvitee } from "@/lib/lead-document";

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

function parseDate(v: unknown): Date | undefined {
  if (typeof v !== "string") return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function extractInviteeEmail(payload: Record<string, unknown>): string | null {
  if (typeof payload.email === "string" && payload.email.includes("@")) {
    return payload.email.trim().toLowerCase();
  }
  const inv = asRecord(payload.invitee);
  if (typeof inv?.email === "string" && inv.email.includes("@")) {
    return inv.email.trim().toLowerCase();
  }
  return null;
}

function extractInviteeName(payload: Record<string, unknown>): string | undefined {
  if (typeof payload.name === "string" && payload.name.trim()) return payload.name.trim();
  const fn = typeof payload.first_name === "string" ? payload.first_name.trim() : "";
  const ln = typeof payload.last_name === "string" ? payload.last_name.trim() : "";
  const combined = [fn, ln].filter(Boolean).join(" ");
  return combined || undefined;
}

function extractEventTypeName(
  payload: Record<string, unknown>,
  scheduled: Record<string, unknown> | null,
): string | undefined {
  const et = asRecord(payload.event_type);
  if (typeof et?.name === "string" && et.name.trim()) return et.name.trim();
  const et2 = scheduled ? asRecord(scheduled.event_type) : null;
  if (typeof et2?.name === "string" && et2.name.trim()) return et2.name.trim();
  return undefined;
}

function extractJoinUrl(scheduled: Record<string, unknown> | null): string | undefined {
  if (!scheduled) return undefined;
  const loc = asRecord(scheduled.location);
  if (!loc) return undefined;
  if (typeof loc.join_url === "string") return loc.join_url;
  if (typeof loc.location === "string" && loc.location.startsWith("http")) return loc.location;
  return undefined;
}

function buildInvitees(
  email: string | null,
  name: string | undefined,
  payload: Record<string, unknown>,
): LeadInvitee[] | undefined {
  if (email) {
    return [{ email, name }];
  }
  const guests = payload.guests;
  if (!Array.isArray(guests)) return undefined;
  const out: LeadInvitee[] = [];
  for (const g of guests) {
    const gr = asRecord(g);
    if (typeof gr?.email === "string" && gr.email.includes("@")) {
      out.push({
        email: gr.email.trim().toLowerCase(),
        name: typeof gr.name === "string" ? gr.name.trim() : undefined,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}

function bookingPatchFromInviteePayload(
  payload: Record<string, unknown>,
  canceled: boolean,
): Partial<LeadBooking> {
  const scheduled = asRecord(payload.scheduled_event);
  const start = scheduled ? parseDate(scheduled.start_time) : undefined;
  const end = scheduled ? parseDate(scheduled.end_time) : undefined;
  const timezone =
    (typeof payload.timezone === "string" && payload.timezone) ||
    (scheduled && typeof scheduled.timezone === "string" ? scheduled.timezone : undefined);

  const email = extractInviteeEmail(payload);
  const name = extractInviteeName(payload);
  const invitees = buildInvitees(email, name, payload);

  const patch: Partial<LeadBooking> = {
    lastWebhookAt: new Date(),
    canceled,
  };

  if (typeof payload.uri === "string") patch.calendlyInviteeUri = payload.uri;
  if (scheduled && typeof scheduled.uri === "string") patch.calendlyEventUri = scheduled.uri;
  else if (typeof payload.event === "string" && payload.event.includes("calendly.com")) {
    patch.calendlyEventUri = payload.event;
  }

  const etName = extractEventTypeName(payload, scheduled);
  if (etName) patch.eventTypeName = etName;

  const join = extractJoinUrl(scheduled);
  if (join) patch.joinUrl = join;

  if (start) patch.scheduledStart = start;
  if (end) patch.scheduledEnd = end;
  if (timezone) patch.timezone = timezone;
  if (invitees) patch.invitees = invitees;

  return patch;
}

export type CalendlyWebhookHandleResult =
  | { ok: true; matched: true; leadId: string; event: string }
  | { ok: true; matched: false; event: string; reason: string }
  | { ok: false; error: string };

/**
 * Applies supported Calendly webhook events to the latest lead with matching invitee email.
 */
export async function handleCalendlyWebhookBody(body: unknown): Promise<CalendlyWebhookHandleResult> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const root = body as Record<string, unknown>;
  const event = typeof root.event === "string" ? root.event : "";
  if (!event) {
    return { ok: false, error: "Missing event type" };
  }

  const payload = asRecord(root.payload);
  if (!payload) {
    return { ok: true, matched: false, event, reason: "missing_payload" };
  }

  const email = extractInviteeEmail(payload);
  if (!email) {
    return { ok: true, matched: false, event, reason: "no_invitee_email" };
  }

  const leadId = await findLatestLeadIdByEmail(email);
  if (!leadId) {
    return { ok: true, matched: false, event, reason: "no_lead_for_email" };
  }

  /** Calendly does not expose `invitee.rescheduled`; reschedules are typically cancel + new `invitee.created`. */
  if (event === "invitee.created") {
    const patch = bookingPatchFromInviteePayload(payload, false);
    await mergeLeadBooking(leadId, patch, { setStatus: "call_booked" });
    return { ok: true, matched: true, leadId, event };
  }

  if (event === "invitee.canceled") {
    const patch = bookingPatchFromInviteePayload(payload, true);
    await mergeLeadBooking(leadId, patch);
    return { ok: true, matched: true, leadId, event };
  }

  return { ok: true, matched: false, event, reason: "event_not_handled" };
}
