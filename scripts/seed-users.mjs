import fs from 'fs';
import path from 'path';

const API_URL = 'http://127.0.0.1:5000/api';

const companyData = {
  name: 'Test Company',
  email: 'testcompany@example.com',
  password: 'Password123!',
  phonenumber: '+213555123456',
  websiteURL: 'https://testcompany.com',
  location: 'Algiers, Algeria',
  industrySector: 'Technology',
  companySize: '11-50',
  yearEstablished: '2020',
  socialMedia: JSON.stringify({
    facebook: 'https://facebook.com/testcompany',
    linkedin: 'https://linkedin.com/company/testcompany'
  }),
  agreesToTerms: 'true'
};

const agencyData = {
  agencyName: 'Test Agency',
  email: 'testagency@example.com',
  password: 'Password123!',
  phoneNumber: '+213555987654',
  countryCode: 'DZ',
  websiteUrl: 'https://testagency.com',
  country: 'Algeria',
  city: 'Algiers',
  streetAddress: '456 Agency Blvd',
  postalCode: '16000',
  businessRegistrationNumber: 'RC123456789',
  industry: 'Media & Advertising',
  companySize: '11-50',
  yearEstablished: '2018',
  fullName: 'John Doe',
  jobTitle: 'Director',
  servicesOffered: JSON.stringify(['Outdoor advertising', 'Media planning & buying', 'Digital Marketing']),
  facebookUrl: 'https://facebook.com/testagency',
  linkedinUrl: 'https://linkedin.com/company/testagency',
  agreeToTerms: 'true'
};

async function registerCompany() {
  console.log('Registering Company...');
  try {
    const formData = new FormData();
    for (const key in companyData) {
      formData.append(key, companyData[key]);
    }
    
    // Create dummy logo
    const dummyImage = new Blob(['dummy image content'], { type: 'image/png' });
    formData.append('logo', dummyImage, 'company-logo.png');

    const response = await fetch(`${API_URL}/companies/register`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      // If it fails because email exists, that's fine for testing
      if (data.error && data.error.includes('already exists')) {
        console.log('Company already exists.');
        return;
      }
      throw new Error(data.error || data.message || 'Failed to register company');
    }
    console.log('Company registered successfully:', data);
  } catch (error) {
    console.error('Error registering company:', error.message);
  }
}

async function registerAgency() {
  console.log('Registering Agency...');
  try {
    const formData = new FormData();
    for (const key in agencyData) {
      formData.append(key, agencyData[key]);
    }

    // Create dummy files
    const dummyImage = new Blob(['dummy image content'], { type: 'image/png' });
    const dummyPdf = new Blob(['dummy pdf content'], { type: 'application/pdf' });

    formData.append('logo', dummyImage, 'agency-logo.png');
    formData.append('rcDocument', dummyPdf, 'rc.pdf');

    const response = await fetch(`${API_URL}/agencies/register`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
       if (data.error && data.error.includes('already exists')) {
        console.log('Agency already exists.');
        return;
      }
      throw new Error(data.error || data.message || 'Failed to register agency');
    }
    console.log('Agency registered successfully:', data);
  } catch (error) {
    console.error('Error registering agency:', error.message);
  }
}

async function main() {
  await registerCompany();
  await registerAgency();
}

main();
