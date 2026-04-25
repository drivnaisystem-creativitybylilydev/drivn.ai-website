import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { ScoredLead } from "@/lib/lead-sourcing/types";

export type SourcedLeadStatus = "new" | "called" | "booked" | "converted" | "dismissed";

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

// ─── Niche grouping ───────────────────────────────────────────────────────────

export interface NicheGroup {
  niche: string;
  count: number;
  avgScore: number;
  topScore: number;
  newCount: number;
  leads: SourcedLeadRow[];
}

export function groupLeadsByNiche(leads: SourcedLeadRow[]): NicheGroup[] {
  const map = new Map<string, SourcedLeadRow[]>();

  for (const lead of leads) {
    const key = lead.category?.trim() || "Uncategorized";
    const bucket = map.get(key) ?? [];
    bucket.push(lead);
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .map(([niche, bucket]) => ({
      niche,
      count: bucket.length,
      avgScore: Math.round(bucket.reduce((s, l) => s + l.score, 0) / bucket.length),
      topScore: Math.max(...bucket.map((l) => l.score)),
      newCount: bucket.filter((l) => l.status === "new").length,
      leads: bucket.sort((a, b) => b.score - a.score),
    }))
    .sort((a, b) => b.count - a.count);
}

export async function mergeNicheCategories(
  fromCategory: string,
  toCategory: string,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateMany(
    { category: fromCategory },
    { $set: { category: toCategory, updatedAt: new Date() } },
  );
  return res.modifiedCount;
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

export async function createManualLead(data: {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MONGODB_URI not configured");

  const col = db.collection<SourcedLeadDocument>(COLLECTION);

  // Check for duplicate by name
  const existing = await col.findOne({ name: data.name });
  if (existing) {
    throw new Error(`Business "${data.name}" already exists`);
  }

  const now = new Date();

  // Calculate score based on available fields
  let score = 50;
  if (data.rating) score += Math.min(data.rating * 10, 30);
  if (data.reviewCount && data.reviewCount > 0) score += Math.min(data.reviewCount * 0.5, 15);
  if (data.website) score += 3;
  if (data.email) score += 2;
  score = Math.min(Math.max(score, 0), 100);

  const doc: Omit<SourcedLeadDocument, "_id"> = {
    placeId: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    address: data.address || "",
    phone: data.phone,
    website: data.website,
    email: data.email,
    rating: data.rating,
    reviewCount: data.reviewCount,
    category: data.category,
    score: Math.round(score),
    signals: [],
    sourcingQuery: data.category,
    status: "new" as const,
    source: "manual" as const,
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as SourcedLeadDocument);
  return result.insertedId.toHexString();
}
