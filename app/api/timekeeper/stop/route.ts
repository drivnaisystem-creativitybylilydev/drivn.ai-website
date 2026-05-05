import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

const CATEGORIES = {
  "Client Projects": "high",
  "Client Calls": "high",
  "Client Support": "high",
  Sales: "high",
  Marketing: "medium",
  Strategy: "medium",
  "System Building": "medium",
  Learning: "medium",
  Admin: "low",
  Meetings: "low",
};

export async function POST() {
  try {
    if (!MONGODB_URI) return Response.json({ error: "No MONGODB_URI" }, { status: 500 });

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("drivn");

    const session = await db
      .collection("time_sessions")
      .findOne({ status: "active" });

    if (!session) {
      await client.close();
      return Response.json({ error: "No active timer" }, { status: 400 });
    }

    const now = new Date();
    const startTime = new Date(session.start_time);
    const mins = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    const roi =
      CATEGORIES[session.category as keyof typeof CATEGORIES] || "medium";

    await db.collection("time_entries").insertOne({
      start_time: startTime,
      end_time: now,
      duration_minutes: mins,
      category: session.category,
      project_client: session.project_client,
      description: session.description,
      roi_level: roi,
      tags: [],
      created_at: now,
      updated_at: now,
    });

    await db.collection("time_sessions").deleteOne({ _id: session._id });

    await client.close();

    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const dur = h > 0 ? `${h}h ${m}m` : `${m}m`;

    return Response.json({
      success: true,
      message: `Logged: ${session.category} - ${dur}`,
    });
  } catch (error) {
    console.error("TimeKeeper stop error:", error);
    return Response.json(
      { error: "Failed to stop timer" },
      { status: 500 }
    );
  }
}
