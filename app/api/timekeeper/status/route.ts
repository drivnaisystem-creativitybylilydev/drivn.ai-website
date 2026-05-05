import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
  try {
    if (!MONGODB_URI) return Response.json({ error: "No MONGODB_URI" }, { status: 500 });

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("drivn");

    const session = await db
      .collection("time_sessions")
      .findOne({ status: "active" });

    await client.close();

    if (!session) {
      return Response.json({ active: false });
    }

    const startTime = new Date(session.start_time);
    const now = new Date();
    const mins = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;

    return Response.json({
      active: true,
      category: session.category,
      project_client: session.project_client,
      description: session.description,
      duration_minutes: mins,
      duration_display: h > 0 ? `${h}h ${m}m` : `${m}m`,
      start_time: startTime.toISOString(),
    });
  } catch (error) {
    console.error("TimeKeeper status error:", error);
    return Response.json({ error: "Failed to get status" }, { status: 500 });
  }
}
