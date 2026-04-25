const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable not set");
  process.exit(1);
}

const OS_SOURCED_LEADS = path.join(__dirname, "../../Drivn.AI OS/sourced-leads");

async function exportSourcedLeads() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("drivn");
    const col = db.collection("sourced_leads");

    // Get all leads with status "new" (uncontacted)
    console.log("📥 Fetching uncontacted leads...");
    const newLeads = await col
      .find({ status: "new" })
      .sort({ score: -1, createdAt: -1 })
      .toArray();

    console.log(`✅ Found ${newLeads.length} uncontacted leads`);

    // Create sourced-leads folder
    if (!fs.existsSync(OS_SOURCED_LEADS)) {
      fs.mkdirSync(OS_SOURCED_LEADS, { recursive: true });
      console.log(`📁 Created ${OS_SOURCED_LEADS}`);
    }

    // Export all uncontacted leads
    const leadsData = newLeads.map((lead) => ({
      name: lead.name,
      category: lead.category,
      phone: lead.phone,
      website: lead.website,
      email: lead.email,
      address: lead.address,
      rating: lead.rating,
      reviewCount: lead.reviewCount,
      score: lead.score,
      source: lead.source,
      createdAt: lead.createdAt.toISOString(),
    }));

    const allLeadsFile = path.join(OS_SOURCED_LEADS, "all-leads.json");
    fs.writeFileSync(allLeadsFile, JSON.stringify(leadsData, null, 2));
    console.log(`✅ Exported to: ${allLeadsFile}`);

    // Also export by niche
    const byNiche = {};
    newLeads.forEach((lead) => {
      const niche = lead.category || "Uncategorized";
      if (!byNiche[niche]) byNiche[niche] = [];
      byNiche[niche].push({
        name: lead.name,
        phone: lead.phone,
        website: lead.website,
        email: lead.email,
        address: lead.address,
        score: lead.score,
      });
    });

    const nicheFile = path.join(OS_SOURCED_LEADS, "by-niche.json");
    fs.writeFileSync(nicheFile, JSON.stringify(byNiche, null, 2));
    console.log(`✅ Exported by niche: ${nicheFile}`);

    // Create summary
    const summary = {
      totalUncontacted: newLeads.length,
      exportedAt: new Date().toISOString(),
      niches: Object.entries(byNiche).map(([name, leads]) => ({
        name,
        count: leads.length,
        avgScore: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length),
      })).sort((a, b) => b.count - a.count),
    };

    const summaryFile = path.join(OS_SOURCED_LEADS, "SUMMARY.json");
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));

    console.log("\n📊 Summary:");
    console.log(`  Total uncontacted leads: ${newLeads.length}`);
    console.log(`  Niches: ${Object.keys(byNiche).length}`);
    summary.niches.slice(0, 5).forEach((n) => {
      console.log(`  - ${n.name}: ${n.count}`);
    });

    console.log("\n✅ All files ready in Drivn.AI OS/sourced-leads/");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

exportSourcedLeads();
