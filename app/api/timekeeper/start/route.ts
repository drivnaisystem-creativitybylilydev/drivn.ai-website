import { MongoClient } from "mongodb";

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

export async function POST(request: Request) {
  try {
    if (!MONGODB_URI) return Response.json({ error: "No MONGODB_URI" }, { status: 500 });

    const body = await request.json();
    const { category, project_client, description } = body;

    if (!category || !Object.keys(CATEGORIES).includes(category)) {
      return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("drivn");

    const existing = await db
      .collection("time_sessions")
      .findOne({ status: "active" });

    if (existing) {
      await client.close();
      return Response.json(
        { error: "Timer already running" },
        { status: 400 }
      );
    }

    await db.collection("time_sessions").insertOne({
      start_time: new Date(),
      category,
      project_client: project_client || null,
      description: description || null,
      status: "active",
      created_at: new Date(),
    });

    await client.close();

    return Response.json({
      success: true,
      message: `Timer started: ${category}`,
    });
  } catch (error) {
    console.error("TimeKeeper start error:", error);
    return Response.json(
      { error: "Failed to start timer" },
      { status: 500 }
    );
  }
}
