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
  source: "google_maps" | "apify" | "manual";
  notes?: string;
  priority?: boolean;
  legendary?: boolean;
  /** Manual visual flag (orange outline in the pipeline table) for leads with a hot, time-sensitive angle. */
  hotLead?: boolean;
  /** Pet groomer flag — flashy paw badge in the pipeline table. */
  dogGroomer?: boolean;
  /** When this lead is next due for outreach. Drives the Weekly Queue view. */
  nextActionDate?: Date;
  /** Manually flagged from the general leads pool to pull into the Weekly Queue,
   * regardless of category — lets a lead outside the 5 queue niches still get scheduled. */
  inQueue?: boolean;
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
  source: "google_maps" | "apify" | "manual";
  notes?: string;
  priority?: boolean;
  legendary?: boolean;
  hotLead?: boolean;
  dogGroomer?: boolean;
  nextActionDate?: string;
  inQueue?: boolean;
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
    notes: doc.notes,
    priority: doc.priority,
    legendary: doc.legendary,
    hotLead: doc.hotLead,
    dogGroomer: doc.dogGroomer,
    nextActionDate: doc.nextActionDate ? doc.nextActionDate.toISOString() : undefined,
    inQueue: doc.inQueue,
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

export async function setInQueue(id: string, value: boolean): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { inQueue: value, updatedAt: new Date() } },
  );
  return res.matchedCount > 0;
}

/**
 * Leads eligible for the Weekly Queue: everything in the given niches, PLUS any
 * lead manually flagged via setInQueue regardless of its category. This is what
 * both the Queue page's display and its scheduler should read from.
 */
export async function listQueueEligibleLeads(niches: string[], limit = 1000): Promise<SourcedLeadRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<SourcedLeadDocument>(COLLECTION);
    const docs = await col
      .find({ $or: [{ category: { $in: niches } }, { inQueue: true }] })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => normalizeRow(d as SourcedLeadDocument & { _id: ObjectId }));
  } catch (err) {
    console.error("[sourced-lead-db] listQueueEligibleLeads failed:", err);
    return [];
  }
}

/**
 * Like listSourcedLeads, but scoped to specific categories via the query itself
 * instead of a global top-N-by-score cut. The collection has grown past 500 docs
 * total, so niche-scoped pages (Priority Pipeline, Weekly Queue) that used to call
 * listSourcedLeads(500) and filter client-side were silently dropping leads whose
 * global score rank fell outside the top 500 even though they belonged in scope.
 */
export async function listSourcedLeadsByCategory(categories: string[], limit = 1000): Promise<SourcedLeadRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<SourcedLeadDocument>(COLLECTION);
    const docs = await col
      .find({ category: { $in: categories } })
      .sort({ score: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) => normalizeRow(d as SourcedLeadDocument & { _id: ObjectId }));
  } catch (err) {
    console.error("[sourced-lead-db] listSourcedLeadsByCategory failed:", err);
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
  notes?: string;
  priority?: boolean;
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
    notes: data.notes,
    priority: data.priority,
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc as SourcedLeadDocument);
  return result.insertedId.toHexString();
}

export async function updateLeadNotes(id: string, notes: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { notes, updatedAt: new Date() } },
  );
  return res.matchedCount > 0;
}

export async function bulkUpdateStatus(
  ids: string[],
  status: SourcedLeadStatus,
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const validIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
  if (validIds.length === 0) return 0;
  const res = await col.updateMany(
    { _id: { $in: validIds } },
    { $set: { status, updatedAt: new Date() } },
  );
  return res.modifiedCount;
}

// ─── Weekly outreach queue ─────────────────────────────────────────────────
// Assigns each not-yet-contacted lead a nextActionDate (a business day) so
// the Weekly Queue view can show "who do I contact today" instead of a flat
// list. Regenerating only touches leads that don't already have a date, so
// a lead Finn is mid-sequence with never gets silently reshuffled.

export async function setNextActionDate(id: string, date: Date | null): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateOne(
    { _id: new ObjectId(id) },
    date
      ? { $set: { nextActionDate: date, updatedAt: new Date() } }
      : { $unset: { nextActionDate: "" }, $set: { updatedAt: new Date() } },
  );
  return res.matchedCount > 0;
}

/** Next N business days (Mon-Fri) starting from `from`, inclusive if `from` is itself a weekday. */
function nextBusinessDays(from: Date, count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(9, 0, 0, 0);
  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export interface AutoScheduleResult {
  scheduled: number;
  byDay: { date: string; count: number }[];
}

/**
 * Buckets every unscheduled, not-yet-contacted lead in `niches` across the next
 * `dayCount` business days, `perDay` leads at a time. Priority order:
 *   1. manually-verified (priority) leads — walk-in candidates
 *   2. leads with no website on file — fastest, most self-evident pitch
 *   3. everything else, niche order as given, highest score first
 */
export async function autoScheduleQueue(
  niches: string[],
  opts: { startDate?: Date; perDay?: number; dayCount?: number } = {},
): Promise<AutoScheduleResult> {
  const db = await getDb();
  if (!db) return { scheduled: 0, byDay: [] };
  const col = db.collection<SourcedLeadDocument>(COLLECTION);

  const perDay = opts.perDay ?? 20;
  const dayCount = opts.dayCount ?? 5;
  const startDate = opts.startDate ?? new Date();

  const candidates = await col
    .find({
      $or: [{ category: { $in: niches } }, { inQueue: true }],
      status: "new",
      nextActionDate: { $exists: false },
    })
    .toArray();

  const nicheRank = new Map(niches.map((n, i) => [n, i]));
  candidates.sort((a, b) => {
    if (Boolean(a.priority) !== Boolean(b.priority)) return a.priority ? -1 : 1;
    const aNoSite = a.website ? 1 : 0;
    const bNoSite = b.website ? 1 : 0;
    if (aNoSite !== bNoSite) return aNoSite - bNoSite;
    const rankA = nicheRank.get(a.category ?? "") ?? 999;
    const rankB = nicheRank.get(b.category ?? "") ?? 999;
    if (rankA !== rankB) return rankA - rankB;
    return b.score - a.score;
  });

  const days = nextBusinessDays(startDate, dayCount);
  const byDay: { date: string; count: number }[] = days.map((d) => ({ date: d.toISOString(), count: 0 }));

  // Cap at perDay*dayCount and leave the rest unscheduled (still nextActionDate-less) so a
  // future regenerate picks them up for the following week instead of dumping the whole
  // overflow onto the last day.
  const capped = candidates.slice(0, perDay * days.length);
  const ops = capped.map((lead, i) => {
    const dayIndex = Math.floor(i / perDay);
    byDay[dayIndex].count += 1;
    return {
      updateOne: {
        filter: { _id: lead._id },
        update: { $set: { nextActionDate: days[dayIndex], updatedAt: new Date() } },
      },
    };
  });

  if (ops.length > 0) await col.bulkWrite(ops);

  return { scheduled: ops.length, byDay: byDay.filter((d) => d.count > 0) };
}

export async function clearQueueSchedule(niches: string[]): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const col = db.collection<SourcedLeadDocument>(COLLECTION);
  const res = await col.updateMany(
    { $or: [{ category: { $in: niches } }, { inQueue: true }], status: "new" },
    { $unset: { nextActionDate: "" }, $set: { updatedAt: new Date() } },
  );
  return res.modifiedCount;
}
