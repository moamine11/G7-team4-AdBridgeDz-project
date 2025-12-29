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
const bcrypt = require('bcryptjs');
const Agency = require('./models/agency');
const { addDays } = require('./utils/subscription');

async function seedAgencyPassword() {
  try {
    const emailArg = process.argv[2];
    const passwordArg = process.argv[3];

    const email = (emailArg || '').trim().toLowerCase();
    const password = (passwordArg || 'Agency12345!').toString();

    if (!email) {
      throw new Error('Usage: node seedAgencyPassword.js <email> [password]');
    }

    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI in backend/.env or backend/.env.local');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    const now = new Date();
    const hashed = await bcrypt.hash(password, 10);

    const agency = await Agency.findOne({ email }).select('trialStartedAt trialEndsAt subscriptionPlan dateCreated');
    if (!agency) {
      throw new Error(`Agency not found for email: ${email}`);
    }

    const trialStartedAt = agency.trialStartedAt || agency.dateCreated || now;
    const trialEndsAt = agency.trialEndsAt || addDays(trialStartedAt, 30);
    const subscriptionPlan = agency.subscriptionPlan || 'Trial';

    // Use a direct update to avoid failing validation on legacy/inconsistent records.
    await Agency.updateOne(
      { _id: agency._id },
      {
        $set: {
          password: hashed,
          isVerified: true,
          verificationToken: undefined,
          signUpMethod: 'local',
          trialStartedAt,
          trialEndsAt,
          subscriptionPlan,
          updatedAt: now,
        },
      }
    );

    console.log('✅ Agency password reset');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`✅ Verified: ${agency.isVerified}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedAgencyPassword();
