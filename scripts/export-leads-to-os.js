const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://drivnaisystem_db_user:Finn_2005@drivn-website.sgh6j34.mongodb.net/drivn?retryWrites=true&w=majority";

const OS_LEADS_PATH = path.join(
  __dirname,
  "../../Drivn.AI OS/leads"
);
const WEBSITE_LEADS_PATH = path.join(__dirname, "../leads");

async function exportLeads() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("drivn");
    const col = db.collection("sourced_leads");

    // Get all leads
    console.log("📥 Fetching all leads from MongoDB...");
    const allLeads = await col.find({}).toArray();
    console.log(`✅ Found ${allLeads.length} total leads`);

    // Deduplicate by placeId first, then by name
    const seen = new Set();
    const dedupedLeads = [];

    for (const lead of allLeads) {
      const key = lead.placeId || lead.name;
      if (!seen.has(key)) {
        seen.add(key);
        dedupedLeads.push(lead);
      }
    }

    console.log(
      `✅ After deduplication: ${dedupedLeads.length} unique leads (removed ${allLeads.length - dedupedLeads.length})`
    );

    // Group by niche
    const byNiche = {};
    dedupedLeads.forEach((lead) => {
      const niche = lead.category || "Uncategorized";
      if (!byNiche[niche]) {
        byNiche[niche] = [];
      }
      byNiche[niche].push({
        name: lead.name,
        placeId: lead.placeId,
        address: lead.address,
        phone: lead.phone,
        website: lead.website,
        email: lead.email,
        rating: lead.rating,
        reviewCount: lead.reviewCount,
        score: lead.score,
        status: lead.status,
        source: lead.source,
      });
    });

    // Create OS directories and write JSON files
    console.log("\n📝 Writing to OS folders...");
    ensureDir(OS_LEADS_PATH);

    let totalWritten = 0;
    Object.entries(byNiche)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([niche, leads]) => {
        const nicheDir = path.join(OS_LEADS_PATH, niche);
        ensureDir(nicheDir);

        const leadsFile = path.join(nicheDir, "leads.json");
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

        console.log(`  ✅ ${niche}: ${leads.length} leads`);
        totalWritten += leads.length;
      });

    // Copy leads structure to website/leads folder for deployment
    console.log("\n📤 Syncing to website folder...");
    ensureDir(WEBSITE_LEADS_PATH);

    Object.entries(byNiche).forEach(([niche, leads]) => {
      const nicheDir = path.join(WEBSITE_LEADS_PATH, niche);
      ensureDir(nicheDir);

      const leadsFile = path.join(nicheDir, "leads.json");
      fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    });

    // Create consolidated summary
    const summary = {
      exportedAt: new Date().toISOString(),
      totalLeads: dedupedLeads.length,
      totalNiches: Object.keys(byNiche).length,
      niches: Object.entries(byNiche)
        .map(([name, leads]) => ({
          name,
          count: leads.length,
          avgScore: Math.round(
            leads.reduce((s, l) => s + l.score, 0) / leads.length
          ),
          topScore: Math.max(...leads.map((l) => l.score)),
        }))
        .sort((a, b) => b.count - a.count),
    };

    const summaryPath = path.join(OS_LEADS_PATH, "EXPORT_SUMMARY.json");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log("\n✨ Summary:");
    console.log(`  Total leads exported: ${dedupedLeads.length}`);
    console.log(`  Total niches: ${Object.keys(byNiche).length}`);
    console.log(`  Duplicates removed: ${allLeads.length - dedupedLeads.length}`);

    console.log("\n📊 Leads by niche:");
    summary.niches.forEach((n) => {
      console.log(`  ${n.name}: ${n.count} (avg score: ${n.avgScore})`);
    });

    console.log("\n✅ Export complete!");
    console.log(`   OS: ${OS_LEADS_PATH}`);
    console.log(`   Website: ${WEBSITE_LEADS_PATH}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

exportLeads();
