require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Agency = require('./models/agency');
const Company = require('./models/company');

async function seedTestAccounts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Test Agency Account (for Google login)
    // IMPORTANT: Change this to your actual Google email!
    const testAgencyEmail = 'mohamed.amine.chaouchi@ensia.edu.dz';
    
    const existingAgency = await Agency.findOne({ email: testAgencyEmail });
    
    if (existingAgency) {
      console.log('Agency already exists, updating for Google login...');
      existingAgency.isVerified = true;
      existingAgency.signUpMethod = 'google';
      await existingAgency.save();
      console.log('Agency updated:', existingAgency.email);
    } else {
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      
      const testAgency = new Agency({
        agencyName: 'Test Agency',
        email: testAgencyEmail,
        password: hashedPassword,
        phoneNumber: 555123456,
        countryCode: '+213',
        country: 'Algeria',
        city: 'Algiers',
        streetAddress: '123 Test Street',
        postalCode: 16000,
        businessRegistrationNumber: 'TEST-001',
        fullName: 'Mohamed Amine Chaouchi',
        jobTitle: 'Developer',
        userType: 'agency',
        agreeToTerms: true,
        isVerified: true,
        signUpMethod: 'google'
      });
      
      await testAgency.save();
      console.log('Test Agency created:', testAgency.email);
    }

    // Test Company Account
    const testCompanyEmail = 'test.company@ensia.edu.dz';
    
    const existingCompany = await Company.findOne({ email: testCompanyEmail });
    
    if (existingCompany) {
      console.log('Company already exists, updating for Google login...');
      existingCompany.isVerified = true;
      existingCompany.signUpMethod = 'google';
      await existingCompany.save();
      console.log('Company updated:', existingCompany.email);
    } else {
      const hashedPassword = await bcrypt.hash('Test123!', 10);
      
      const testCompany = new Company({
        name: 'Test Company',
        email: testCompanyEmail,
        password: hashedPassword,
        location: 'Algiers, Algeria',
        phonenumber: 555987654,
        userType: 'company',
        isVerified: true,
        signUpMethod: 'google'
      });
      
      await testCompany.save();
      console.log('Test Company created:', testCompany.email);
    }

    console.log('\n✅ Test accounts ready!');
    console.log('\n📧 To use Google login, your Google account email must match one of these:');
    console.log(`   Agency: ${testAgencyEmail}`);
    console.log(`   Company: ${testCompanyEmail}`);
    console.log('\n🔑 Or login with email/password: Test123!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedTestAccounts();
