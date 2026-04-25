const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://drivnaisystem_db_user:Finn_2005@drivn-website.sgh6j34.mongodb.net/drivn?retryWrites=true&w=majority';

async function verify() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('drivn');
    const col = db.collection('sourced_leads');
    
    const count = await col.countDocuments({});
    const sample = await col.findOne({});
    
    console.log(`✅ Connected to MongoDB`);
    console.log(`Total leads in 'drivn' database: ${count}`);
    if (sample) {
      console.log(`Sample: ${sample.name} (${sample.category}) - Score: ${sample.score}`);
    }
    
  } finally {
    await client.close();
  }
}

verify().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
