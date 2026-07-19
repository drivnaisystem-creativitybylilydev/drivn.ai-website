import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
} from "@/lib/consultant-pipeline-constants";
import type {
  PipelineStage,
  ActionLogEntry,
} from "@/lib/consultant-pipeline-constants";
export type { PipelineStage, ActionLogEntry };
export { PIPELINE_STAGES, PIPELINE_STAGE_LABELS };

/** Raw document shape in MongoDB (set by scraper + CRM fields added on top) */
export interface ConsultantLeadDocument {
  _id?: ObjectId;
  // Scraper fields
  source?: string;
  profile_url?: string;
  name?: string;
  title?: string;
  location?: string;
  niche?: string;
  independence_signal?: string;
  email_primary?: string;
  email_confidence?: number;
  phone?: string;
  company_name?: string;
  website_url?: string;
  services_fit?: string;
  icp_score?: number | "unscored";
  outreach_status?: string;
  outreach_channel?: string;
  last_contacted?: string;
  notes?: string;
  scraped_at?: string;
  // CRM fields (added by this app)
  pipeline_stage?: PipelineStage;
  pipeline_log?: ActionLogEntry[];
  crm_notes?: string;
  crm_updated_at?: string;
}

/** Serialized row passed to the client (all ObjectIds → strings, dates → ISO strings) */
export interface ConsultantLeadRow {
  id: string;
  source?: string;
  profile_url?: string;
  name: string;
  title?: string;
  location?: string;
  niche?: string;
  independence_signal?: string;
  email_primary?: string;
  email_confidence?: number;
  phone?: string;
  company_name?: string;
  website_url?: string;
  services_fit?: string;
  icp_score: number; // normalized (unscored → 5)
  icp_score_raw: number | "unscored";
  outreach_status?: string;
  outreach_channel?: string;
  last_contacted?: string;
  notes?: string;
  scraped_at?: string;
  pipeline_stage: PipelineStage;
  pipeline_log: ActionLogEntry[];
  crm_notes?: string;
  crm_updated_at?: string;
}

export interface LeadStats {
  total: number;
  byStage: Record<PipelineStage, number>;
  withEmail: number;
  topNiches: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLLECTION = "consultant_leads";

function normalizeScore(raw: number | "unscored" | undefined): number {
  if (raw === undefined || raw === "unscored") return 5;
  return Number(raw);
}

function normalizeRow(doc: ConsultantLeadDocument & { _id: ObjectId }): ConsultantLeadRow {
  return {
    id: doc._id.toHexString(),
    source: doc.source,
    profile_url: doc.profile_url,
    name: doc.name ?? "Unknown",
    title: doc.title,
    location: doc.location,
    niche: doc.niche,
    independence_signal: doc.independence_signal,
    email_primary: doc.email_primary,
    email_confidence: doc.email_confidence,
    phone: doc.phone,
    company_name: doc.company_name,
    website_url: doc.website_url,
    services_fit: doc.services_fit,
    icp_score: normalizeScore(doc.icp_score),
    icp_score_raw: doc.icp_score ?? "unscored",
    outreach_status: doc.outreach_status,
    outreach_channel: doc.outreach_channel,
    last_contacted: doc.last_contacted,
    notes: doc.notes,
    scraped_at: doc.scraped_at,
    pipeline_stage: doc.pipeline_stage ?? "new",
    pipeline_log: doc.pipeline_log ?? [],
    crm_notes: doc.crm_notes,
    crm_updated_at: doc.crm_updated_at,
  };
}

// ─── DB Functions ─────────────────────────────────────────────────────────────

export interface ConsultantLeadFilters {
  stage?: PipelineStage;
  niche?: string;
  minScore?: number;
  hasEmail?: boolean;
}

export async function listConsultantLeads(
  filters?: ConsultantLeadFilters,
): Promise<ConsultantLeadRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    const col = db.collection<ConsultantLeadDocument>(COLLECTION);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (filters?.stage) {
      if (filters.stage === "new") {
        // "new" means either explicitly set to new OR no stage field yet
        query.$or = [
          { pipeline_stage: "new" },
          { pipeline_stage: { $exists: false } },
        ];
      } else {
        query.pipeline_stage = filters.stage;
      }
    }

    if (filters?.niche) {
      query.niche = { $regex: filters.niche, $options: "i" };
    }

    if (filters?.hasEmail) {
      query.email_primary = { $exists: true, $ne: "" };
    }

    const docs = await col
      .find(query)
      .sort({ icp_score: -1 })
      .toArray();

    let rows = docs.map((d) =>
      normalizeRow(d as ConsultantLeadDocument & { _id: ObjectId }),
    );

    // Apply minScore filter in memory (icp_score can be "unscored" string in DB)
    if (filters?.minScore !== undefined && filters.minScore > 0) {
      rows = rows.filter((r) => r.icp_score >= (filters.minScore ?? 0));
    }

    return rows;
  } catch (err) {
    console.error("[consultant-pipeline-db] listConsultantLeads failed:", err);
    return [];
  }
}

export async function updateLeadStage(
  id: string,
  stage: PipelineStage,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const col = db.collection<ConsultantLeadDocument>(COLLECTION);
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          pipeline_stage: stage,
          crm_updated_at: new Date().toISOString(),
        },
      },
    );
    return res.matchedCount > 0;
  } catch (err) {
    console.error("[consultant-pipeline-db] updateLeadStage failed:", err);
    return false;
  }
}

export async function logLeadAction(
  id: string,
  entry: ActionLogEntry,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const col = db.collection<ConsultantLeadDocument>(COLLECTION);
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { pipeline_log: entry },
        $set: { crm_updated_at: new Date().toISOString() },
      },
    );
    return res.matchedCount > 0;
  } catch (err) {
    console.error("[consultant-pipeline-db] logLeadAction failed:", err);
    return false;
  }
}

export async function updateLeadNotes(
  id: string,
  notes: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const col = db.collection<ConsultantLeadDocument>(COLLECTION);
    const res = await col.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          crm_notes: notes,
          crm_updated_at: new Date().toISOString(),
        },
      },
    );
    return res.matchedCount > 0;
  } catch (err) {
    console.error("[consultant-pipeline-db] updateLeadNotes failed:", err);
    return false;
  }
}

export async function getLeadStats(): Promise<LeadStats> {
  try {
    const db = await getDb();
    if (!db) {
      return {
        total: 0,
        byStage: Object.fromEntries(
          PIPELINE_STAGES.map((s) => [s, 0]),
        ) as Record<PipelineStage, number>,
        withEmail: 0,
        topNiches: [],
      };
    }
    const col = db.collection<ConsultantLeadDocument>(COLLECTION);

    const [total, withEmail, stageAgg, nicheAgg] = await Promise.all([
      col.countDocuments(),
      col.countDocuments({ email_primary: { $exists: true, $ne: "" } }),
      col
        .aggregate<{ _id: string | null; count: number }>([
          { $group: { _id: "$pipeline_stage", count: { $sum: 1 } } },
        ])
        .toArray(),
      col
        .aggregate<{ _id: string | null; count: number }>([
          { $match: { niche: { $exists: true, $ne: "" } } },
          { $group: { _id: "$niche", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 6 },
        ])
        .toArray(),
    ]);

    const byStage = Object.fromEntries(
      PIPELINE_STAGES.map((s) => [s, 0]),
    ) as Record<PipelineStage, number>;

    for (const row of stageAgg) {
      const stage = (row._id ?? "new") as PipelineStage;
      if (PIPELINE_STAGES.includes(stage)) {
        byStage[stage] = (byStage[stage] ?? 0) + row.count;
      } else {
        // null pipeline_stage → count as "new"
        byStage.new = (byStage.new ?? 0) + row.count;
      }
    }

    const topNiches = nicheAgg
      .map((n) => n._id)
      .filter((n): n is string => !!n);

    return { total, byStage, withEmail, topNiches };
  } catch (err) {
    console.error("[consultant-pipeline-db] getLeadStats failed:", err);
    return {
      total: 0,
      byStage: Object.fromEntries(
        PIPELINE_STAGES.map((s) => [s, 0]),
      ) as Record<PipelineStage, number>,
      withEmail: 0,
      topNiches: [],
    };
  }
}
