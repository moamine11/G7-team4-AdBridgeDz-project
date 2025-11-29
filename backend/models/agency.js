const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agencySchema = new Schema({
  agencyName: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, default: null }, 
  signUpMethod: { type: String, enum: ['local', 'google'], default: 'local' }, 
  phoneNumber: { type: Number, required: true },
  countryCode: { type: String, required: true },
  websiteUrl: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  streetAddress: { type: String, required: true },
  postalCode: { type: Number, required: true },
  businessRegistrationNumber: { type: String, required: true },
  rcDocument: { type: String }, 
  logo: { type: String },
  industry: { type: String},
  companySize: { type: String },
  yearEstablished: { type: Number },
  servicesOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'  
  }],
  fullName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  facebookUrl: { type: String },
  linkedinUrl: { type: String },
  posts: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post' 
    }
  ],
  userType: { 
    type: String, 
    enum: ['company', 'agency'], 
    required: true, 
    default: 'agency' 
  },
  agreeToTerms: { type: Boolean, required: true },
  isVerified: { type: Boolean, default: false }, 
  verificationToken: { type: String }, 
  dateCreated: { type: Date, default: Date.now }
});
const Agency = mongoose.model('Agency', agencySchema);
module.exports = Agency;
