import { ObjectId } from "mongodb";
import type { LeadPayload } from "@/lib/lead-submission";
import {
  type LeadBooking,
  type LeadDocument,
  type LeadEmailSent,
  type LeadRow,
  type LeadStatus,
  mergeBookingFields,
  newLeadCrmDefaults,
  normalizeLeadRowFromDoc,
} from "@/lib/lead-document";
import { getLeadsDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "leads";

export type { LeadRow };

/** Sync check for UI (connection is lazy until first request). */
export { isMongoConfigured as isLeadStorageConfigured };

async function ensureLeadIndexes(): Promise<void> {
  const db = await getLeadsDb();
  if (!db) return;
  const col = db.collection<LeadDocument>(COLLECTION);
  await col.createIndex({ createdAt: -1 }).catch(() => {});
  await col.createIndex({ status: 1, createdAt: -1 }).catch(() => {});
  /** Non-unique: duplicate submissions / same email allowed until dedup strategy exists. */
  await col.createIndex({ "payload.email": 1 }).catch(() => {});
}

export async function insertLead(payload: LeadPayload): Promise<string> {
  const db = await getLeadsDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  const col = db.collection<LeadDocument>(COLLECTION);
  await ensureLeadIndexes();
  const res = await col.insertOne({
    createdAt: new Date(),
    payload,
    ...newLeadCrmDefaults(),
  });
  return res.insertedId.toHexString();
}

/** Latest submission wins when the same email books or submits twice. */
export async function findLatestLeadIdByEmail(email: string): Promise<string | null> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !emailNorm.includes("@")) return null;
  try {
    const db = await getLeadsDb();
    if (!db) return null;
    const col = db.collection<LeadDocument>(COLLECTION);
    const escaped = emailNorm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const doc = await col.findOne(
      { "payload.email": { $regex: new RegExp(`^${escaped}$`, "i") } },
      { sort: { createdAt: -1 } },
    );
    return doc ? doc._id.toHexString() : null;
  } catch (err) {
    console.error("[lead-db] findLatestLeadIdByEmail failed:", err);
    return null;
  }
}

export async function appendLeadEmailSent(
  leadId: string,
  entry: LeadEmailSent,
): Promise<boolean> {
  if (!ObjectId.isValid(leadId)) return false;
  try {
    const db = await getLeadsDb();
    if (!db) return false;
    const col = db.collection<LeadDocument>(COLLECTION);
    const res = await col.updateOne(
      { _id: new ObjectId(leadId) },
      { $push: { emailsSent: entry } },
    );
    return res.matchedCount > 0;
  } catch (err) {
    console.error("[lead-db] appendLeadEmailSent failed:", err);
    return false;
  }
}

/** Nurture: form submitted, no scheduled call, 1–14 days old, nudge not sent. */
export async function findLeadsForNudge(limit = 25): Promise<LeadRow[]> {
  const rows = await listLeads(500);
  const now = Date.now();
  const msDay = 24 * 60 * 60 * 1000;
  return rows
    .filter((r) => {
      if (r.status !== "form_submitted") return false;
      const created = r.created_at.getTime();
      if (now - created < msDay) return false;
      if (now - created > 14 * msDay) return false;
      if (r.booking?.scheduledStart) return false;
      if (r.emailsSent.some((e) => e.type === "nudge_not_booked")) return false;
      return true;
    })
    .slice(0, limit);
}

export async function listLeads(limit = 500): Promise<LeadRow[]> {
  try {
    const db = await getLeadsDb();
    if (!db) return [];
    await ensureLeadIndexes();
    const col = db.collection<LeadDocument>(COLLECTION);
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
    const rows: LeadRow[] = [];
    for (const d of docs) {
      const row = normalizeLeadRowFromDoc(d);
      if (row) rows.push(row);
    }
    return rows;
  } catch (err) {
    console.error("[lead-db] listLeads failed:", err);
    return [];
  }
}

export async function getLeadById(leadId: string): Promise<LeadRow | null> {
  if (!ObjectId.isValid(leadId)) return null;
  try {
    const db = await getLeadsDb();
    if (!db) return null;
    const col = db.collection<LeadDocument>(COLLECTION);
    const doc = await col.findOne({ _id: new ObjectId(leadId) });
    return doc ? normalizeLeadRowFromDoc(doc) : null;
  } catch (err) {
    console.error("[lead-db] getLeadById failed:", err);
    return null;
  }
}

export async function updateLeadCrmFields(
  leadId: string,
  fields: {
    status?: LeadStatus;
    internalNotes?: string;
    callNotes?: string;
  },
): Promise<boolean> {
  if (!ObjectId.isValid(leadId)) return false;
  const db = await getLeadsDb();
  if (!db) return false;
  const col = db.collection<LeadDocument>(COLLECTION);
  const $set: Record<string, unknown> = {};
  if (fields.status !== undefined) $set.status = fields.status;
  if (fields.internalNotes !== undefined) $set.internalNotes = fields.internalNotes;
  if (fields.callNotes !== undefined) $set.callNotes = fields.callNotes;
  if (Object.keys($set).length === 0) return false;
  const res = await col.updateOne({ _id: new ObjectId(leadId) }, { $set });
  return res.matchedCount > 0;
}

/** For Calendly webhooks: merge into existing `booking` without wiping unspecified fields. */
export async function mergeLeadBooking(
  leadId: string,
  patch: Partial<LeadBooking>,
  options?: { setStatus?: LeadStatus },
): Promise<boolean> {
  if (!ObjectId.isValid(leadId)) return false;
  const db = await getLeadsDb();
  if (!db) return false;
  const col = db.collection<LeadDocument>(COLLECTION);
  const oid = new ObjectId(leadId);
  const existing = await col.findOne({ _id: oid });
  if (!existing) return false;
  const row = normalizeLeadRowFromDoc(existing);
  if (!row) return false;
  const next = mergeBookingFields(row.booking, patch);
  const $set: Record<string, unknown> = { booking: next };
  if (options?.setStatus !== undefined) $set.status = options.setStatus;
  const res = await col.updateOne({ _id: oid }, { $set });
  return res.matchedCount > 0;
}
