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
  googleId: { type: String, default: null }, //identify google users as the email can change over time , but the ID will not       
  signUpMethod: { type: String, enum: ['local', 'google'], default: 'local' }, 
  websiteURL: { type: String },
  location: { type: String, required: true },
  phonenumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;


