import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export interface JarvisMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface JarvisMemoryPoint {
  category: string; // "decision", "metric", "goal", "risk", "pattern"
  summary: string;
  details?: string;
  timestamp: Date;
}

export interface JarvisConversation {
  _id?: ObjectId;
  sessionId: string;
  startedAt: Date;
  lastMessageAt: Date;
  messages: JarvisMessage[];
  memory: JarvisMemoryPoint[];
  clientCount?: number;
  currentMRR?: number;
  lastUpdated: Date;
}

export interface JarvisConversationRow {
  id: string;
  sessionId: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  memoryPoints: number;
  currentMRR?: number;
  lastUpdated: string;
}

const COLLECTION = "jarvis_conversations";

async function ensureIndexes(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const col = db.collection(COLLECTION);
  await col.createIndex({ sessionId: 1 }).catch(() => {});
  await col.createIndex({ lastMessageAt: -1 }).catch(() => {});
  await col.createIndex({ startedAt: -1 }).catch(() => {});
}

function normalizeConversation(
  doc: JarvisConversation & { _id: ObjectId }
): JarvisConversationRow {
  return {
    id: doc._id.toHexString(),
    sessionId: doc.sessionId,
    startedAt: doc.startedAt.toISOString(),
    lastMessageAt: doc.lastMessageAt.toISOString(),
    messageCount: doc.messages.length,
    memoryPoints: doc.memory.length,
    currentMRR: doc.currentMRR,
    lastUpdated: doc.lastUpdated.toISOString(),
  };
}

export async function createConversation(sessionId: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  await ensureIndexes();
  const col = db.collection<JarvisConversation>(COLLECTION);
  const res = await col.insertOne({
    sessionId,
    startedAt: new Date(),
    lastMessageAt: new Date(),
    messages: [],
    memory: [],
    lastUpdated: new Date(),
  } as JarvisConversation);
  return res.insertedId.toHexString();
}

export async function getConversation(
  sessionId: string
): Promise<JarvisConversation | null> {
  const db = await getDb();
  if (!db) return null;
  await ensureIndexes();
  const col = db.collection<JarvisConversation>(COLLECTION);
  const doc = await col.findOne({ sessionId });
  return doc;
}

export async function addMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<JarvisConversation>(COLLECTION);
  const res = await col.updateOne(
    { sessionId },
    {
      $push: {
        messages: {
          role,
          content,
          timestamp: new Date(),
        } as JarvisMessage,
      },
      $set: {
        lastMessageAt: new Date(),
        lastUpdated: new Date(),
      },
    }
  );
  return res.modifiedCount > 0;
}

export async function addMemoryPoint(
  sessionId: string,
  category: string,
  summary: string,
  details?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<JarvisConversation>(COLLECTION);
  const res = await col.updateOne(
    { sessionId },
    {
      $push: {
        memory: {
          category,
          summary,
          details,
          timestamp: new Date(),
        } as JarvisMemoryPoint,
      },
      $set: {
        lastUpdated: new Date(),
      },
    }
  );
  return res.modifiedCount > 0;
}

export async function updateConversationMetrics(
  sessionId: string,
  clientCount?: number,
  currentMRR?: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<JarvisConversation>(COLLECTION);
  const updates: Record<string, Date | number> = {
    lastUpdated: new Date(),
  };
  if (clientCount !== undefined) updates.clientCount = clientCount;
  if (currentMRR !== undefined) updates.currentMRR = currentMRR;

  const res = await col.updateOne({ sessionId }, { $set: updates });
  return res.modifiedCount > 0;
}

export async function listConversations(
  limit = 20
): Promise<JarvisConversationRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<JarvisConversation>(COLLECTION);
    const docs = await col
      .find({})
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map((d) =>
      normalizeConversation(d as JarvisConversation & { _id: ObjectId })
    );
  } catch (err) {
    console.error("[jarvis-db] listConversations failed:", err);
    return [];
  }
}

export async function deleteConversation(sessionId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const col = db.collection<JarvisConversation>(COLLECTION);
  const res = await col.deleteOne({ sessionId });
  return res.deletedCount > 0;
}
