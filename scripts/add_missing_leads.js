const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set");
  process.exit(1);
}

// Map service types from sheet to niches
const serviceToNiche = {
  "Body Shop": "Auto Repair Shop",
  "Heating": "HVAC Service",
  "Hauling": "Junk Removal Service",
  "Roofing": "Roofing Contractor",
  "Roofing/Siding": "Roofing Contractor",
  "Auto Collisions": "Auto Repair Shop",
  "Lawn & Landscape": "Landscaping",
  "Landscaping": "Landscaping",
  "Lawn": "Landscaping",
  "Landscaping + Snow Plowng": "Landscaping",
  "Lawn Care": "Lawn Care Service",
  "Lawn Care Service": "Lawn Care Service",
  "Welding": "Construction Service",
  "Movers": "Moving Service",
  "Moving Service": "Moving Service",
  "Water": "Water Service",
  "Plumbing": "Plumbing Service",
  "Plumbing & Rooter": "Plumbing Service",
  "Rentals": "Construction Service",
  "Sccoping Poop": "Lawn Care Service",
  "Junk Removal": "Junk Removal Service",
  "Detailing": "Auto Repair Shop",
  "Locs/Hair": "Cleaning Service",
  "Roofing": "Roofing Contractor",
  "Concrete": "Concrete Service",
  "Tree Removal": "Tree Service",
  "Tree Service": "Tree Service",
  "Tree Trimming": "Tree Service",
  "Attic": "Construction Service",
  "Dog Grroming": "Pet Grooming Service",
  "Dog Grooming": "Pet Grooming Service",
  "Plumbing & Heating Inc": "Plumbing Service",
  "Electrician": "Electrical Service",
  "Driving School": "Construction Service",
  "Septic Tanks": "Water Service",
  "Cleaning": "Cleaning Service",
  "Cleaning (industrial)": "Cleaning Service",
  "Cleaning/Junk Removal": "Junk Removal Service",
  "Cleaning/Maintainence": "Cleaning Service",
  "Pressure Washing": "Pressure Washing Service",
  "Pressure Cleaning + Wood Staining": "Pressure Washing Service",
  "Construction": "Construction Service",
  "Air Duct Cleaning": "HVAC Service",
  "Painting": "Painting Service",
  "Contractor": "Construction Service",
  "Towing": "Auto Repair Shop",
  "Tree and Lawn": "Tree Service",
  "Fenceworks": "Fence Service",
  "Roofing & Improvement": "Roofing Contractor",
  "Stump Grinding": "Tree Service",
  "Skidsteer and Land Services.": "Landscaping",
  "Lawn": "Lawn Care Service",
  "Land and Lawnscaping": "Landscaping",
  "Landscape and Pools": "Landscaping",
  "Heating/HVAC": "HVAC Service",
  "Waste Management": "Junk Removal Service",
  "Fussballschule": "Construction Service",
  "Landscaping + Snow Plowng": "Landscaping",
  "Home Energy": "HVAC Service",
  "Irrigation": "Lawn Care Service",
  "Outboard Motors": "Construction Service",
  "Poolcare": "Landscaping",
  "Solar": "Construction Service",
};

// Google Sheet data for missing leads
const missingLeads = [
  { name: "Rafas Body Shop", phone: "19158773730", email: "rafasbodynpaint@gmail.com", service: "Body Shop" },
  { name: "Grab N Go", phone: "(786) 457-6012", service: "Hauling" },
  { name: "Garcia's Custom Welding & Fabrication", phone: "17144705661", service: "Welding" },
  { name: "Garcia Welding Services", phone: "15618801444", service: "Welding" },
  { name: "Garcia's welding", phone: "17044501435", service: "Welding" },
  { name: "Garcia Welding & Specialties, LLC", phone: "19702617781", service: "Welding" },
  { name: "(IG) garcias.welding", phone: "(626) 660-5734", service: "Welding" },
  { name: "Pioneer Equipment Rentals", phone: "19047322151", email: "rentals@pioneerjax.com", service: "Rentals" },
  { name: "Scoopin Poop", phone: "(252)-564-9132", email: "Brice@scoopinpoop252.com", service: "Sccoping Poop" },
  { name: "NuLocs", phone: "407 577 1769", email: "nulocs.co@gmail.com", service: "Locs/Hair" },
  { name: "Monroe And Son Roofing Marylad", phone: "410-900-2043", service: "Roofing" },
  { name: "Warick Tree Services", phone: "(401) 443-3132", service: "Tree Removal" },
  { name: "Midwest Attic Solutions", phone: "763-330-1257", service: "Attic" },
  { name: "Capital Clean Air", phone: "(984) 225-8196", service: "Air Duct Cleaning" },
  { name: "Hoffmann Auto School", phone: "19782419449", email: "info@hoffmanautoschool.com", service: "Driving School" },
  { name: "Revision Solar", phone: "(207) 221-6342", email: "hello@revisionenergy.com", service: "Solar" },
  { name: "Long Neck Landscaping", phone: "302-947-2409", service: "Landscaping" },
  { name: "Chamito Towing", phone: "617-816-9136", service: "Towing" },
  { name: "Kay Fix It", phone: "215-224-3879", email: "kscontractorservices@yahoo.com", service: "Contractor" },
  { name: "Carney Environmental, LLC", phone: "508-822-2208", email: "carneydisposal@gmail.com", service: "Trash Pickup" },
  { name: "Erlebnis Fussballschule", service: "Fussballschule", email: "stephan.schmitz@erlebnis-fussball-schule.de" },
  { name: "Jade Landscaping LLC", phone: "(513)-869-3962", service: "Landscaping" },
  { name: "j.m.dooleystumpgrinding", service: "Stump Grinding" },
  { name: "Oliver Lawncare Service", phone: "470 302 0956", service: "Land and Lawnscaping" },
  { name: "ABSTRACT EPOXY", service: "Flooring" },
  { name: "GodblessHomeRepairs", phone: "713-373-5009", service: "Construction" },
  { name: "LORENA'S PAINTING", phone: "828-470-8873", service: "Painting" },
  { name: "479Poolcare", phone: "(479)3663242", service: "Poolcare" },
  { name: "Ashla Landscape and Design", phone: "(817) 344 0133", email: "rblaylock.ppst@hotmail.com", service: "Landscaping" },
  { name: "Netts Landscaping", phone: "267 831 7659", service: "Landscaping" },
  { name: "Captain Jacks Junk Removal", phone: "(971)-526-6749", service: "Junk Removal" }
];

async function addMissingLeads() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db("drivn");
    const col = db.collection("sourced_leads");

    let added = 0;
    let skipped = 0;

    for (const lead of missingLeads) {
      const niche = serviceToNiche[lead.service] || "Construction Service";

      // Check if already exists
      const existing = await col.findOne({ name: lead.name });
      if (existing) {
        console.log(`  ⏭️  ${lead.name} (already exists)`);
        skipped++;
        continue;
      }

      const now = new Date();
      const doc = {
        placeId: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: lead.name,
        address: "",
        phone: lead.phone || "",
        website: "",
        email: lead.email || "",
        rating: undefined,
        reviewCount: undefined,
        category: niche,
        score: 50,
        signals: [],
        sourcingQuery: niche,
        status: "new",
        source: "manual",
        createdAt: now,
        updatedAt: now,
      };

      await col.insertOne(doc);
      console.log(`  ✅ ${lead.name} → ${niche}`);
      added++;
    }

    console.log(`\n✨ Added: ${added}, Skipped: ${skipped}`);
  } finally {
    await client.close();
  }
}

addMissingLeads().catch(console.error);
