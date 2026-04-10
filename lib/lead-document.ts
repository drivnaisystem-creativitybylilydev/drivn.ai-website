import { ObjectId, type WithId } from "mongodb";
import type { LeadPayload } from "@/lib/lead-submission";

/** Bump when stored document shape changes in a breaking way for readers. */
export const LEAD_SCHEMA_VERSION = 2 as const;

export type LeadStatus =
  | "form_submitted"
  | "call_booked"
  | "call_completed"
  | "converted"
  | "lost";

export const LEAD_STATUS_OPTIONS: readonly LeadStatus[] = [
  "form_submitted",
  "call_booked",
  "call_completed",
  "converted",
  "lost",
] as const;

export type LeadInvitee = {
  email: string;
  name?: string;
};

/**
 * Booking metadata (Calendly webhooks / manual sync).
 * Partial documents are merged with `mergeLeadBooking` in `lead-db`.
 */
export type LeadBooking = {
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  eventTypeName?: string;
  joinUrl?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  timezone?: string;
  lastWebhookAt?: Date;
  canceled?: boolean;
  invitees?: LeadInvitee[];
};

export type LeadEmailSent = {
  type: string;
  sentAt: Date;
  opened?: boolean;
};

/**
 * MongoDB document shape for `leads`.
 * Legacy rows may omit CRM fields; use `normalizeLeadRowFromDoc` when reading.
 */
export type LeadDocument = {
  createdAt: Date;
  payload: LeadPayload;
  schemaVersion?: number;
  status?: LeadStatus;
  booking?: LeadBooking;
  emailsSent?: LeadEmailSent[];
  internalNotes?: string;
  callNotes?: string;
};

export type LeadRow = {
  id: string;
  created_at: Date;
  payload: LeadPayload;
  schemaVersion: number;
  status: LeadStatus;
  booking: LeadBooking | null;
  emailsSent: LeadEmailSent[];
  internalNotes: string;
  callNotes: string;
};

function isLeadPayload(value: unknown): value is LeadPayload {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  const keys = [
    "fullName",
    "email",
    "phone",
    "businessName",
    "businessType",
    "biggestChallenge",
    "monthlyRevenue",
    "hearAboutUs",
    "additionalNotes",
  ] as const;
  return keys.every((k) => typeof o[k] === "string");
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    value === "form_submitted" ||
    value === "call_booked" ||
    value === "call_completed" ||
    value === "converted" ||
    value === "lost"
  );
}

function coerceDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return undefined;
}

function normalizeInvitees(raw: unknown): LeadInvitee[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: LeadInvitee[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.email !== "string" || o.email.trim() === "") continue;
    out.push({
      email: o.email.trim(),
      name: typeof o.name === "string" ? o.name.trim() : undefined,
    });
  }
  return out.length > 0 ? out : undefined;
}

function normalizeBooking(raw: unknown): LeadBooking | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const b = raw as Record<string, unknown>;
  const out: LeadBooking = {};
  if (typeof b.calendlyEventUri === "string") out.calendlyEventUri = b.calendlyEventUri;
  if (typeof b.calendlyInviteeUri === "string") out.calendlyInviteeUri = b.calendlyInviteeUri;
  if (typeof b.eventTypeName === "string") out.eventTypeName = b.eventTypeName;
  if (typeof b.joinUrl === "string") out.joinUrl = b.joinUrl;
  const start = coerceDate(b.scheduledStart);
  const end = coerceDate(b.scheduledEnd);
  const wh = coerceDate(b.lastWebhookAt);
  if (start) out.scheduledStart = start;
  if (end) out.scheduledEnd = end;
  if (typeof b.timezone === "string") out.timezone = b.timezone;
  if (wh) out.lastWebhookAt = wh;
  if (typeof b.canceled === "boolean") out.canceled = b.canceled;
  const inv = normalizeInvitees(b.invitees);
  if (inv) out.invitees = inv;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Shallow merge for webhook updates; `undefined` in patch does not clear existing keys. */
export function mergeBookingFields(
  prev: LeadBooking | null | undefined,
  patch: Partial<LeadBooking>,
): LeadBooking {
  const base: LeadBooking = prev ? { ...prev, invitees: prev.invitees ? [...prev.invitees] : undefined } : {};
  for (const key of Object.keys(patch) as (keyof LeadBooking)[]) {
    const v = patch[key];
    if (v === undefined) continue;
    if (key === "invitees" && Array.isArray(v)) {
      base.invitees = v.map((i) => ({ ...i }));
      continue;
    }
    (base as Record<string, unknown>)[key] = v;
  }
  return base;
}

function normalizeEmailsSent(raw: unknown): LeadEmailSent[] {
  if (!Array.isArray(raw)) return [];
  const out: LeadEmailSent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const e = item as Record<string, unknown>;
    if (typeof e.type !== "string") continue;
    const sentAt = coerceDate(e.sentAt);
    if (!sentAt) continue;
    out.push({
      type: e.type,
      sentAt,
      opened: typeof e.opened === "boolean" ? e.opened : undefined,
    });
  }
  return out;
}

/** Default CRM fields for new inserts (v2). */
export function newLeadCrmDefaults(): Omit<LeadDocument, "createdAt" | "payload"> {
  return {
    schemaVersion: LEAD_SCHEMA_VERSION,
    status: "form_submitted",
    emailsSent: [],
    internalNotes: "",
    callNotes: "",
  };
}

/**
 * Maps a DB document to `LeadRow`, tolerating legacy shapes.
 * Returns null if `payload` is missing or invalid (skipped in list).
 */
export function normalizeLeadRowFromDoc(doc: WithId<unknown>): LeadRow | null {
  const d = doc as Record<string, unknown>;
  const createdAt = coerceDate(d.createdAt);
  if (!createdAt) return null;
  if (!isLeadPayload(d.payload)) return null;

  const schemaVersion =
    typeof d.schemaVersion === "number" && Number.isFinite(d.schemaVersion)
      ? d.schemaVersion
      : 1;

  const status: LeadStatus = isLeadStatus(d.status) ? d.status : "form_submitted";
  const booking = normalizeBooking(d.booking) ?? null;
  const emailsSent = normalizeEmailsSent(d.emailsSent);
  const internalNotes = typeof d.internalNotes === "string" ? d.internalNotes : "";
  const callNotes = typeof d.callNotes === "string" ? d.callNotes : "";

  const id = doc._id instanceof ObjectId ? doc._id.toHexString() : String(doc._id);
  return {
    id,
    created_at: createdAt,
    payload: d.payload,
    schemaVersion,
    status,
    booking,
    emailsSent,
    internalNotes,
    callNotes,
  };
}
