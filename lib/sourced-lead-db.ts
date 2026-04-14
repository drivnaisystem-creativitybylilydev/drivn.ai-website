import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { ScoredLead } from "@/lib/lead-sourcing/types";

export type SourcedLeadStatus = "new" | "emailed" | "called" | "booked" | "converted" | "dismissed";

export interface SourcedLeadDocument {
  _id?: ObjectId;
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  score: number;
  signals: string[];
  emailDraft?: { subject: string; body: string };
  sourcingQuery: string;
  status: SourcedLeadStatus;
  source: "google_maps" | "apify";
  createdAt: Date;
  updatedAt: Date;
}

export interface SourcedLeadRow {
  id: string;
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  score: number;
  signals: string[];
  emailDraft?: { subject: string; body: string };
  sourcingQuery: string;
  status: SourcedLeadStatus;
  source: "google_maps" | "apify";
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = "sourced_leads";
let _indexesEnsured = false;

async function ensureIndexes() {
  if (_indexesEnsured) return;
  const db = await getDb();
  if (!db) return;
  const col = db.collection(COLLECTION);
  await col.createIndex({ placeId: 1 }, { unique: true }).catch(() => {});
  await col.createIndex({ score: -1, createdAt: -1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  _indexesEnsured = true;
}

function normalizeRow(doc: SourcedLeadDocument & { _id: ObjectId }): SourcedLeadRow {
  return {
    id: doc._id.toHexString(),
    placeId: doc.placeId,
    name: doc.name,
    address: doc.address,
    phone: doc.phone,
    website: doc.website,
    email: doc.email,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    category: doc.category,
    score: doc.score,
    signals: doc.signals,
    emailDraft: doc.emailDraft,
    sourcingQuery: doc.sourcingQuery,
    status: doc.status,
    source: doc.source,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function upsertSourcedLead(lead: ScoredLead, sourcingQuery: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  await ensureIndexes();
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const now = new Date();
  const doc: Omit<SourcedLeadDocument, "_id"> = {
    placeId: lead.placeId,
    name: lead.name,
    address: lead.address,
    phone: lead.phone,
    website: lead.website,
    email: lead.email,
    rating: lead.rating,
    reviewCount: lead.reviewCount,
    category: lead.category,
    score: lead.score,
    signals: lead.signals.map((s) => s.label),
    emailDraft: lead.emailDraft ? { subject: lead.emailDraft.subject, body: lead.emailDraft.body } : undefined,
    sourcingQuery,
    status: "new",
    source: lead.source,
    createdAt: now,
    updatedAt: now,
  };

  const res = await col.findOneAndUpdate(
    { placeId: lead.placeId },
    {
      $setOnInsert: {
        placeId: doc.placeId,
        name: doc.name,
        address: doc.address,
        phone: doc.phone,
        website: doc.website,
        email: doc.email,
        rating: doc.rating,
        reviewCount: doc.reviewCount,
        category: doc.category,
        sourcingQuery: doc.sourcingQuery,
        status: doc.status,
        source: doc.source,
        createdAt: now,
      },
      $set: {
        updatedAt: now,
        score: doc.score,
        signals: doc.signals,
        emailDraft: doc.emailDraft,
      },
    },
    { upsert: true, returnDocument: "after" },
  );

  return res?._id?.toHexString() ?? "";
}

export async function listSourcedLeads(limit = 100): Promise<SourcedLeadRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<SourcedLeadDocument>(COLLECTION);
    const docs = await col.find({}).sort({ score: -1, createdAt: -1 }).limit(limit).toArray();
    return docs.map((d) => normalizeRow(d as SourcedLeadDocument & { _id: ObjectId }));
  } catch (err) {
    console.error("[sourced-lead-db] listSourcedLeads failed:", err);
    return [];
  }
}

export async function updateSourcedLeadStatus(id: string, status: SourcedLeadStatus): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  );
  return res.matchedCount > 0;
}
