import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

const PAGE_CATEGORIES: Record<string, string> = {
  "/admin": "Admin",
  "/admin/leads": "Client Calls",
  "/admin/clients": "Client Projects",
  "/admin/revenue": "Strategy",
  "/admin/agents": "System Building",
  "/admin/discovery": "Client Support",
  "/admin/interview-questionnaire": "Client Calls",
  "/admin/questionnaire-responses": "Client Projects",
  "/admin/sourced-leads": "Sales",
  "/admin/internal-files": "Learning",
  "/admin/timekeeper": "Admin",
};

export async function POST(request: Request) {
  try {
    if (!MONGODB_URI) return Response.json({ error: "No MONGODB_URI" }, { status: 500 });

    const body = await request.json();
    const { page } = body;

    if (!page) return Response.json({ error: "No page provided" }, { status: 400 });

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("drivn");

    const activeSession = await db
      .collection("time_sessions")
      .findOne({ status: "active" });

    if (activeSession) {
      const suggestedCategory = PAGE_CATEGORIES[page] || "Admin";

      // Store page view in activity log
      await db.collection("page_views").insertOne({
        page,
        suggested_category: suggestedCategory,
        timestamp: new Date(),
        session_id: activeSession._id,
      });
    }

    await client.close();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Page tracking error:", error);
    return Response.json({ error: "Failed to track page" }, { status: 500 });
  }
}
