import { ObjectId } from "mongodb";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export type ClientStatus = "prospect" | "proposal" | "active" | "paused" | "churned";

export interface ClientDocument {
  _id?: ObjectId;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  status: ClientStatus;
  mrr: number;
  services: string[];
  notes: string;
  startDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientRow {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  status: ClientStatus;
  mrr: number;
  services: string[];
  notes: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  total: number;
  active: number;
  totalMrr: number;
  byStatus: Record<ClientStatus, number>;
}

const COLLECTION = "clients";

let _indexesEnsured = false;

export { isMongoConfigured as isClientStorageConfigured };

function normalizeRow(doc: ClientDocument & { _id: ObjectId }): ClientRow {
  return {
    id: doc._id.toHexString(),
    name: doc.name ?? "",
    industry: doc.industry ?? "",
    contactName: doc.contactName ?? "",
    contactEmail: doc.contactEmail ?? "",
    status: doc.status ?? "prospect",
    mrr: doc.mrr ?? 0,
    services: doc.services ?? [],
    notes: doc.notes ?? "",
    startDate: doc.startDate?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function ensureIndexes(): Promise<void> {
  if (_indexesEnsured) return;
  const db = await getDb();
  if (!db) return;
  const col = db.collection(COLLECTION);
  await col.createIndex({ status: 1, createdAt: -1 }).catch(() => {});
  await col.createIndex({ name: 1 }).catch(() => {});
  _indexesEnsured = true;
}

export async function insertClient(data: {
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  status: ClientStatus;
  mrr: number;
  services: string[];
  notes: string;
  startDate?: Date;
}): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MONGODB_URI not configured");
  const col = db.collection<ClientDocument>(COLLECTION);
  await ensureIndexes();
  const now = new Date();
  const res = await col.insertOne({ ...data, createdAt: now, updatedAt: now } as ClientDocument);
  return res.insertedId.toHexString();
}

export async function listClients(limit = 200): Promise<ClientRow[]> {
  try {
    const db = await getDb();
    if (!db) return [];
    await ensureIndexes();
    const col = db.collection<ClientDocument>(COLLECTION);
    const docs = await col.find({}).sort({ status: 1, createdAt: -1 }).limit(limit).toArray();
    return docs.map((d) => normalizeRow(d as ClientDocument & { _id: ObjectId }));
  } catch (err) {
    console.error("[client-db] listClients failed:", err);
    return [];
  }
}

export async function getClientById(clientId: string): Promise<ClientRow | null> {
  if (!ObjectId.isValid(clientId)) return null;
  try {
    const db = await getDb();
    if (!db) return null;
    const col = db.collection<ClientDocument>(COLLECTION);
    const doc = await col.findOne({ _id: new ObjectId(clientId) });
    return doc ? normalizeRow(doc as ClientDocument & { _id: ObjectId }) : null;
  } catch (err) {
    console.error("[client-db] getClientById failed:", err);
    return null;
  }
}

export async function updateClient(
  clientId: string,
  fields: Partial<Omit<ClientDocument, "_id" | "createdAt">>,
): Promise<boolean> {
  if (!ObjectId.isValid(clientId)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const col = db.collection<ClientDocument>(COLLECTION);
    const res = await col.updateOne(
      { _id: new ObjectId(clientId) },
      { $set: { ...fields, updatedAt: new Date() } },
    );
    return res.matchedCount > 0;
  } catch (err) {
    console.error("[client-db] updateClient failed:", err);
    return false;
  }
}

export function computeClientStats(clients: ClientRow[]): ClientStats {
  const byStatus: Record<ClientStatus, number> = {
    prospect: 0,
    proposal: 0,
    active: 0,
    paused: 0,
    churned: 0,
  };
  let totalMrr = 0;
  for (const c of clients) {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    if (c.status === "active") totalMrr += c.mrr;
  }
  return { total: clients.length, active: byStatus.active, totalMrr, byStatus };
}

export async function getClientStats(): Promise<ClientStats> {
  return computeClientStats(await listClients());
}

export async function deleteClient(clientId: string): Promise<boolean> {
  if (!ObjectId.isValid(clientId)) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const col = db.collection<ClientDocument>(COLLECTION);
    const res = await col.deleteOne({ _id: new ObjectId(clientId) });
    return res.deletedCount > 0;
  } catch (err) {
    console.error("[client-db] deleteClient failed:", err);
    return false;
  }
}
