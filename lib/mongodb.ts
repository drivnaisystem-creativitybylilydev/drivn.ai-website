import { MongoClient, type Db } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let prodClientPromise: Promise<MongoClient> | null = null;

function getMongoUri(): string {
  return process.env.MONGODB_URI?.trim() ?? "";
}

/**
 * Returns null if MONGODB_URI is not set. Caches the client (dev: global for HMR; prod: module).
 */
export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = getMongoUri();
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  if (!prodClientPromise) {
    prodClientPromise = new MongoClient(uri).connect();
  }
  return prodClientPromise;
}

export function isMongoConfigured(): boolean {
  return getMongoUri().length > 0;
}

export async function getLeadsDb(): Promise<Db | null> {
  const client = await getMongoClient();
  if (!client) return null;
  const name = process.env.MONGODB_DB?.trim() || "drivn";
  return client.db(name);
}
