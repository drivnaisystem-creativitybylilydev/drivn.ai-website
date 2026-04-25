const fs = require("fs");
const path = require("path");

const OS_LEADS_PATH = path.join(
  __dirname,
  "Drivn.AI OS/leads"
);

// Read all leads from OS folders
const osLeads = [];
const niches = fs.readdirSync(OS_LEADS_PATH).filter((f) => {
  const stat = fs.statSync(path.join(OS_LEADS_PATH, f));
  return stat.isDirectory();
});

console.log("📂 Reading leads from OS folders...");
niches.forEach((niche) => {
  const leadsFile = path.join(OS_LEADS_PATH, niche, "leads.json");
  if (fs.existsSync(leadsFile)) {
    try {
      const leads = JSON.parse(fs.readFileSync(leadsFile, "utf8"));
      osLeads.push(...leads.map((l) => ({ ...l, niche })));
      console.log(`  ${niche}: ${leads.length}`);
    } catch (e) {
      console.warn(`  ⚠️  Error reading ${niche}/leads.json`);
    }
  }
});

console.log(`\n✅ Total leads in OS: ${osLeads.length}`);

// Deduplicate by name (since MongoDB might have the same leads)
const uniqueNames = new Set(osLeads.map((l) => l.name));
console.log(`✅ Unique business names: ${uniqueNames.length}`);

// Show business names for verification
console.log("\n📋 All business names in OS:");
Array.from(uniqueNames).sort().forEach((name) => {
  const lead = osLeads.find((l) => l.name === name);
  console.log(`  - ${name} (${lead.niche}, score: ${lead.score})`);
});

// Export for MongoDB sync
const summaryPath = path.join(OS_LEADS_PATH, "OS_LEADS_INVENTORY.json");
fs.writeFileSync(
  summaryPath,
  JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      totalLeads: osLeads.length,
      uniqueBusinesses: uniqueNames.size,
      niches: Array.from(
        new Map(niches.map((n) => [n, osLeads.filter((l) => l.niche === n).length]))
      ),
      sampleLeads: osLeads.slice(0, 5),
    },
    null,
    2
  )
);

console.log(`\n✅ Inventory saved to: ${summaryPath}`);
