import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

async function getTimeEntries(timeframe: "today" | "week" | "month") {
  if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("drivn");
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    let startTime: Date;
    if (timeframe === "today") {
      startTime = new Date(utcNow);
      startTime.setUTCHours(0, 0, 0, 0);
    } else if (timeframe === "week") {
      startTime = new Date(utcNow);
      const day = startTime.getUTCDay();
      const diff = startTime.getUTCDate() - day + (day === 0 ? -6 : 1);
      startTime.setUTCDate(diff);
      startTime.setUTCHours(0, 0, 0, 0);
    } else {
      startTime = new Date(utcNow);
      startTime.setUTCDate(1);
      startTime.setUTCHours(0, 0, 0, 0);
    }

    const entries = await db
      .collection("time_entries")
      .find({ start_time: { $gte: startTime } })
      .sort({ start_time: -1 })
      .toArray();

    return entries.map((e) => ({
      _id: e._id.toString(),
      category: e.category,
      project_client: e.project_client,
      description: e.description,
      duration_minutes: e.duration_minutes,
      roi_level: e.roi_level,
      start_time: (e.start_time as Date).toISOString(),
      end_time: (e.end_time as Date).toISOString(),
    }));
  } finally {
    await client.close();
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "today") as
      | "today"
      | "week"
      | "month";

    const entries = await getTimeEntries(timeframe);
    return Response.json({ entries });
  } catch (error) {
    console.error("TimeKeeper API error:", error);
    return Response.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
