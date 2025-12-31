require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Company = require('./models/company');

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'chaouchimohamedamine1119@gmail.com';
    const defaultPassword = 'password123'; // Default password - user can change it later
    
    // Check if user already exists
    const existingUser = await Company.findOne({ email });
    
    if (existingUser) {
      // Update existing user to be verified and set password if needed
      if (!existingUser.isVerified) {
        existingUser.isVerified = true;
        existingUser.verificationToken = undefined;
      }
      
      // Update password if it doesn't exist or if user wants to reset
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        existingUser.password = hashedPassword;
      }
      
      await existingUser.save();
      console.log(`✅ User ${email} already exists. Updated to verified status.`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Default Password: ${defaultPassword}`);
      console.log(`✅ Verified: ${existingUser.isVerified}`);
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const newUser = new Company({
        name: 'Mohammed Amine Chaouchi',
        email: email,
        password: hashedPassword,
        userType: 'company',
        location: 'Algiers, Algeria',
        phonenumber: 1234567890, // Default phone number
        isVerified: true, // Set as verified so they can login immediately
        verificationToken: undefined,
        signUpMethod: 'local',
        websiteURL: '',
        socialMedia: {
          facebook: '',
          linkedin: ''
        }
      });

      await newUser.save();
      console.log(`✅ User created successfully!`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${defaultPassword}`);
      console.log(`✅ Verified: true`);
    }

    mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedUser();

