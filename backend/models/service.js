const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },

});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
