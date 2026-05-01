import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export interface QuestionnaireResponseDocument {
  _id?: ObjectId;
  client: "notime-storage";
  sessionId: string;
  status: "draft" | "submitted";
  data: Record<string, string>;
  checkboxes: {
    q12Drivers: Record<string, boolean>;
    q22Pick: Record<string, boolean>;
  };
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}

export interface QuestionnaireResponseRow {
  _id: string;
  client: "notime-storage";
  sessionId: string;
  status: "draft" | "submitted";
  data: Record<string, string>;
  checkboxes: {
    q12Drivers: Record<string, boolean>;
    q22Pick: Record<string, boolean>;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

function normalizeRow(doc: QuestionnaireResponseDocument): QuestionnaireResponseRow {
  return {
    _id: doc._id?.toHexString() ?? "",
    client: doc.client,
    sessionId: doc.sessionId,
    status: doc.status,
    data: doc.data,
    checkboxes: doc.checkboxes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    submittedAt: doc.submittedAt?.toISOString(),
  };
}

let _indexesEnsured = false;

async function ensureIndexes() {
  if (_indexesEnsured) return;
  const db = await getDb();
  if (!db) return;
  const col = db.collection<QuestionnaireResponseDocument>("questionnaire_responses");
  await col
    .createIndex({ client: 1, status: 1, createdAt: -1 })
    .catch(() => {});
  await col
    .createIndex({ sessionId: 1 }, { unique: true, sparse: true })
    .catch(() => {});
  _indexesEnsured = true;
}

export async function upsertQuestionnaireDraft(
  sessionId: string,
  data: Record<string, string>,
  checkboxes: { q12Drivers: Record<string, boolean>; q22Pick: Record<string, boolean> }
): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB not configured");

  await ensureIndexes();
  const col = db.collection<QuestionnaireResponseDocument>("questionnaire_responses");

  const now = new Date();
  const result = await col.findOneAndUpdate(
    { sessionId, client: "notime-storage" },
    {
      $set: {
        data,
        checkboxes,
        updatedAt: now,
      },
      $setOnInsert: {
        client: "notime-storage",
        status: "draft",
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  return result?._id?.toHexString() ?? "";
}

export async function markQuestionnaireSubmitted(sessionId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB not configured");

  const col = db.collection<QuestionnaireResponseDocument>("questionnaire_responses");
  const now = new Date();
  await col.updateOne(
    { sessionId, client: "notime-storage" },
    {
      $set: {
        status: "submitted",
        submittedAt: now,
        updatedAt: now,
      },
    }
  );
}

export async function listQuestionnaireResponses(): Promise<QuestionnaireResponseRow[]> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB not configured");

  await ensureIndexes();
  const col = db.collection<QuestionnaireResponseDocument>("questionnaire_responses");
  const docs = await col
    .find({ client: "notime-storage" })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(normalizeRow);
}

export async function getQuestionnaireResponse(id: string): Promise<QuestionnaireResponseRow | null> {
  const db = await getDb();
  if (!db) throw new Error("MongoDB not configured");

  if (!ObjectId.isValid(id)) return null;

  const col = db.collection<QuestionnaireResponseDocument>("questionnaire_responses");
  const doc = await col.findOne({ _id: new ObjectId(id), client: "notime-storage" });

  return doc ? normalizeRow(doc) : null;
}
