const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

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
const Admin = require('./models/admin');

async function seedAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Add it to backend/.env.local');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    const email = process.env.ADMIN_EMAIL || 'admin@adbridge.local';
    const password = process.env.ADMIN_PASSWORD || 'Admin12345!';
    const name = process.env.ADMIN_NAME || 'Admin';
    const role = process.env.ADMIN_ROLE || 'admin';

    const existing = await Admin.findOne({ email }).select('+password');

    if (existing) {
      existing.isActive = true;
      existing.name = existing.name || name;
      existing.role = existing.role || role;

      const shouldResetPassword = String(process.env.ADMIN_RESET_PASSWORD || '').toLowerCase() === 'true';
      if (shouldResetPassword) {
        existing.password = password;
      }

      await existing.save();

      console.log('✅ Admin already exists (ensured active).');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${shouldResetPassword ? password : '(unchanged)'}`);
      console.log(`🛡️ Role: ${existing.role}`);
    } else {
      await Admin.create({
        name,
        email,
        password,
        role,
        isActive: true,
      });

      console.log('✅ Admin created successfully!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`🛡️ Role: ${role}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
