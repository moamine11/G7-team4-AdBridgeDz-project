const mongoose = require("mongoose");
const companySchema=new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: [true, 'Comapany email is required '], unique: true , lowercase:true  , match:/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/},
  password: { type: String, required: true  , minLength:6 },
  websiteURL: { type: String },
  location: { type: String, required: true },
  createdAt: { type: Date, default:  Date.now },
  updatedAt:  { type: Date, default: Date.now },
  phonenumber:{type:Number , required :true }
});
const Company = mongoose.model('Company', companySchema);
module.exports = Company;


