import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export type AgentRunStatus = "pending" | "running" | "completed" | "error";
export type AgentTrigger = "manual" | "schedule" | "remote";

export interface AgentRunDocument {
  _id?: ObjectId;
  agentId: string;
  agentName: string;
  status: AgentRunStatus;
  triggeredAt: Date;
  completedAt?: Date;
  durationMs?: number;
  summary?: string;
  triggeredBy: AgentTrigger;
}

export interface AgentRunRow {
  id: string;
  agentId: string;
  agentName: string;
  status: AgentRunStatus;
  triggeredAt: string;
  completedAt?: string;
  durationMs?: number;
  summary?: string;
  triggeredBy: AgentTrigger;
}

export { isMongoConfigured as isAgentStorageConfigured };

const COLLECTION = "agent_runs";

let _indexesEnsured = false;

async function ensureIndexes(): Promise<void> {
  if (_indexesEnsured) return;
  const db = await getDb();
  if (!db) return;
  const col = db.collection(COLLECTION);
  await col.createIndex({ triggeredAt: -1 }).catch(() => {});
  await col.createIndex({ agentId: 1, triggeredAt: -1 }).catch(() => {});
  _indexesEnsured = true;
}

function normalizeRow(doc: AgentRunDocument & { _id: ObjectId }): AgentRunRow {
  return {
    id: doc._id.toHexString(),
    agentId: doc.agentId,
    agentName: doc.agentName,
    status: doc.status,
    triggeredAt: doc.triggeredAt.toISOString(),
    completedAt: doc.completedAt?.toISOString(),
    durationMs: doc.durationMs,
    summary: doc.summary,
    triggeredBy: doc.triggeredBy,
  };
}

export async function insertAgentRun(data: {
  agentId: string;
  agentName: string;
  triggeredBy: AgentTrigger;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  await ensureIndexes();
  const col = db.collection<AgentRunDocument>(COLLECTION);
  const res = await col.insertOne({
    ...data,
    status: "pending",
    triggeredAt: new Date(),
  } as AgentRunDocument);
  return res.insertedId.toHexString();
}

export async function updateAgentRun(
  runId: string,
  fields: Partial<Pick<AgentRunDocument, "status" | "completedAt" | "durationMs" | "summary">>,
): Promise<boolean> {
  if (!ObjectId.isValid(runId)) return false;
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<AgentRunDocument>(COLLECTION);
  const res = await col.updateOne({ _id: new ObjectId(runId) }, { $set: fields });
  return res.matchedCount > 0;
}

export async function listAgentRuns(limit = 50): Promise<AgentRunRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<AgentRunDocument>(COLLECTION);
    const docs = await col.find({}).sort({ triggeredAt: -1 }).limit(limit).toArray();
    return docs.map((d) => normalizeRow(d as AgentRunDocument & { _id: ObjectId }));
  } catch (err) {
    console.error("[agent-db] listAgentRuns failed:", err);
    return [];
  }
}

export async function getLastRunByAgent(
  agentIds: string[],
): Promise<Record<string, AgentRunRow>> {
  try {
    const db = await getDb();
    if (!db) return {};
    await ensureIndexes();
    const col = db.collection<AgentRunDocument>(COLLECTION);
    const docs = await col
      .aggregate([
        { $match: { agentId: { $in: agentIds } } },
        { $sort: { triggeredAt: -1 } },
        { $group: { _id: "$agentId", doc: { $first: "$$ROOT" } } },
      ])
      .toArray();
    const result: Record<string, AgentRunRow> = {};
    for (const entry of docs) {
      result[entry._id as string] = normalizeRow(
        entry.doc as AgentRunDocument & { _id: ObjectId },
      );
    }
    return result;
  } catch (err) {
    console.error("[agent-db] getLastRunByAgent failed:", err);
    return {};
  }
}
