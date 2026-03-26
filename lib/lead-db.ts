import type { LeadPayload } from "@/lib/lead-submission";
import { getLeadsDb, isMongoConfigured } from "@/lib/mongodb";

const COLLECTION = "leads";

export type LeadRow = {
  id: string;
  created_at: Date;
  payload: LeadPayload;
};

/** Sync check for UI (connection is lazy until first request). */
export { isMongoConfigured as isLeadStorageConfigured };

export async function insertLead(payload: LeadPayload): Promise<void> {
  const db = await getLeadsDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  const col = db.collection<{ createdAt: Date; payload: LeadPayload }>(COLLECTION);
  await col.createIndex({ createdAt: -1 }).catch(() => {});
  await col.insertOne({ createdAt: new Date(), payload });
}

export async function listLeads(limit = 500): Promise<LeadRow[]> {
  const db = await getLeadsDb();
  if (!db) return [];
  const col = db.collection<{ createdAt: Date; payload: LeadPayload }>(COLLECTION);
  const docs = await col.find({}).sort({ createdAt: -1 }).limit(limit).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    created_at: d.createdAt,
    payload: d.payload,
  }));
}
