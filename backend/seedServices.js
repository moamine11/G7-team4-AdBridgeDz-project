
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/service');

const services = [
  { name: 'Billboards', description: 'Outdoor advertising on large displays' },
  { name: 'Digital Ads', description: 'Online advertising including banners, social, search' },
  { name: 'TV Commercials', description: 'Broadcast and streaming video ads' },
  { name: 'Radio Ads', description: 'Audio advertising on radio stations' },
  { name: 'Print Media', description: 'Newspapers, magazines, flyers' },
  { name: 'Influencer Marketing', description: 'Collaborations with social media influencers' }
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