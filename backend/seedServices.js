
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Prefer .env.local for local/secret credentials, fallback to .env
const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}
const mongoose = require('mongoose');
const Service = require('./models/service');

const services = [
  { name: 'Outdoor (OOH)', description: 'Billboards, digital billboards (DOOH), transit ads, signage' },
  { name: 'Digital Paid Ads', description: 'Search, social ads, display/banner, retargeting, marketplaces' },
  { name: 'Content & Influencers', description: 'Influencers, UGC creators, organic social content, community' },
  { name: 'Video & Production', description: 'TV/video ads, reels, product videos, photography, editing' },
  { name: 'Audio (Radio & Streaming)', description: 'Radio, podcasts, streaming audio ads, voiceovers/jingles' },
  { name: 'Print & Design', description: 'Print media, flyers, packaging, branding, graphic design' }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
  });

  
  await Service.deleteMany({});

  for (const svc of services) {
    await Service.findOneAndUpdate(
      { name: svc.name },
      svc,
      { upsert: true, new: true }
    );
  }

  console.log('✅ 6 services seeded!');
  mongoose.connection.close();
}

seed().catch(console.error);