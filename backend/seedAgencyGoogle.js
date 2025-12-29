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

async function seedAgencyGoogle() {
  try {
    const emailArg = process.argv[2];
    const email = (emailArg || 'karlmendy23@gmail.com').trim().toLowerCase();

    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI in backend/.env or backend/.env.local');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    const now = new Date();
    const defaultPassword = 'GoogleSeedUser123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const existing = await Agency.findOne({ email });

    if (existing) {
      existing.isVerified = true;
      existing.verificationToken = undefined;

      // Keep existing password if present; otherwise set one.
      if (!existing.password) {
        existing.password = hashedPassword;
      }

      // Ensure trial fields exist.
      if (!existing.trialStartedAt) existing.trialStartedAt = existing.dateCreated || now;
      if (!existing.trialEndsAt) existing.trialEndsAt = addDays(existing.trialStartedAt, 30);
      if (!existing.subscriptionPlan) existing.subscriptionPlan = 'Trial';

      await existing.save();
      console.log('✅ Agency already exists. Updated verification + trial fields.');
      console.log(`📧 Email: ${existing.email}`);
      console.log(`🏢 Agency: ${existing.agencyName}`);
      console.log(`✅ Verified: ${existing.isVerified}`);
      console.log('ℹ️ Use Google login with this email to test.');

      await mongoose.connection.close();
      return;
    }

    const agencyName = `Karl Mendy Agency`;

    const created = await Agency.create({
      agencyName,
      email,
      password: hashedPassword,
      googleId: null,
      signUpMethod: 'google',
      phoneNumber: 555000111,
      countryCode: '+213',
      websiteUrl: '',
      country: 'Algeria',
      city: 'Algiers',
      streetAddress: 'Test Street 1',
      postalCode: 16000,
      businessRegistrationNumber: 'TEST-RC-0001',
      rcDocument: '',
      logo: '',
      logoPublicId: '',
      industry: 'Advertising',
      companySize: '1-10',
      yearEstablished: 2025,
      servicesOffered: [],
      fullName: 'Karl Mendy',
      jobTitle: 'Owner',
      facebookUrl: '',
      linkedinUrl: '',
      posts: [],
      userType: 'agency',
      agreeToTerms: true,
      isVerified: true,
      verificationToken: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      trialStartedAt: now,
      trialEndsAt: addDays(now, 30),
      subscriptionPlan: 'Trial',
      updatedAt: now,
    });

    console.log('✅ Created agency for Google login testing');
    console.log(`📧 Email: ${created.email}`);
    console.log(`🏢 Agency: ${created.agencyName}`);
    console.log('ℹ️ Now log in using Google with this email in the app.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedAgencyGoogle();
