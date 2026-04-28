import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export interface DiscoveryOutput {
  healthScore: number;
  buildRequirements: string;
  markdownBrief: string;
  auditReport: string;
}

export interface DiscoverySession {
  _id?: ObjectId;
  businessName: string;
  niche: string;
  linkedLeadId?: string;
  transcript?: string;
  answers: Record<string, string>;
  status: "processing" | "completed" | "error";
  outputs?: DiscoveryOutput;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DiscoverySessionRow = Omit<DiscoverySession, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

async function getCollection() {
  const db = await getDb();
  if (!db) throw new Error("Failed to connect to database");
  return db.collection<DiscoverySession>("discovery_sessions");
}

export async function insertSession(data: Omit<DiscoverySession, "_id" | "createdAt" | "updatedAt">) {
  const collection = await getCollection();
  const now = new Date();
  const result = await collection.insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId.toHexString();
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Omit<DiscoverySession, "_id" | "createdAt">>
) {
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(sessionId) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );
  return result.modifiedCount > 0;
}

export async function getSession(sessionId: string): Promise<DiscoverySessionRow | null> {
  const collection = await getCollection();
  const doc = await collection.findOne({ _id: new ObjectId(sessionId) });
  if (!doc) return null;
  return normalizeRow(doc);
}

export async function listSessions(limit = 50): Promise<DiscoverySessionRow[]> {
  const collection = await getCollection();
  const docs = await collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(normalizeRow);
}

function normalizeRow(doc: DiscoverySession): DiscoverySessionRow {
  const { _id, createdAt, updatedAt, ...rest } = doc;
  return {
    ...rest,
    _id: _id?.toHexString() || "",
    createdAt: createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: updatedAt?.toISOString() || new Date().toISOString(),
  };
}
