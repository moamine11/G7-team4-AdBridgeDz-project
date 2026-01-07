const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Prefer .env.local for local/secret credentials (e.g., Atlas), fallback to .env
const envPath = path.join(__dirname, '.env');
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const mongoose = require('mongoose');
const Agency = require('./models/agency');

async function seedPendingAgencyWithDocs() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Add it to backend/.env.local');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const email = process.env.SEED_AGENCY_EMAIL || 'pending-agency@adbridge.local';
    const agencyName = process.env.SEED_AGENCY_NAME || 'Pending Agency (Docs Test)';
    const plainPassword = process.env.SEED_AGENCY_PASSWORD || 'Agency12345!';

    // PDFs served by Next.js public/ (localhost:3000)
    // Default filenames match public/verification-docs/RC.pdf and public/verification-docs/NIF.pdf
    const rcDocumentUrl =
      process.env.SEED_RC_DOC_URL || 'http://localhost:3000/verification-docs/RC.pdf';
    const nifNisDocumentUrl =
      process.env.SEED_NIF_NIS_DOC_URL || 'http://localhost:3000/verification-docs/NIF.pdf';

    const existing = await Agency.findOne({ email }).select('+password');
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const patch = {
      agencyName,
      email,
      password: hashedPassword,
      googleId: null,
      signUpMethod: 'local',
      phoneNumber: 551234567,
      countryCode: '+213',
      websiteUrl: 'https://example.com',
      country: 'Algeria',
      city: 'Algiers',
      streetAddress: '1 Test Street',
      postalCode: 16000,
      businessRegistrationNumber: 'RC-TEST-0001',
      fullName: 'Test Admin Review',
      jobTitle: 'Manager',
      userType: 'agency',
      agreeToTerms: true,
      isVerified: false,
      verificationToken: crypto.randomBytes(32).toString('hex'),

      rcDocument: rcDocumentUrl,
      nifNisDocument: nifNisDocumentUrl,

      // Keep legacy field in sync so older code paths still work
      otherDocument: nifNisDocumentUrl,

      updatedAt: new Date(),
    };

    if (existing) {
      await Agency.updateOne({ _id: existing._id }, { $set: patch });
      console.log('✅ Updated pending agency with docs');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${plainPassword}`);
      console.log(`📄 RC: ${rcDocumentUrl}`);
      console.log(`📄 NIF/NIS: ${nifNisDocumentUrl}`);
    } else {
      // Note: Agency schema uses `dateCreated` (not createdAt)
      await Agency.create({
        ...patch,
        dateCreated: new Date(),
      });

      console.log('✅ Created pending agency with docs');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${plainPassword}`);
      console.log(`📄 RC: ${rcDocumentUrl}`);
      console.log(`📄 NIF/NIS: ${nifNisDocumentUrl}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedPendingAgencyWithDocs();
