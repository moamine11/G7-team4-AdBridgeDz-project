const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: [true, 'Company email is required'],
    unique: true,
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  },
  password: { type: String, minLength: 6, select: false },
  googleId: { type: String, default: null }, 
  signUpMethod: { type: String, enum: ['local', 'google'], default: 'local' },

  websiteURL: { type: String },
  imageURL: { type: String }, 
  socialMedia: {
    facebook: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  industrySector: { type: String, required: true },
  companySize: { type: String, required: true },  
  yearEstablished: { type: Number }, 
  servicesOffered: {
    type: [String], 
    enum: [
      "Outdoor Advertising",
      "Digital Marketing",
      "Brand Strategy",
      "Media Planning",
      "Creative Services"
    ],
    default: [] 
  },
  location: { type: String, required: true },
  phonenumber: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
