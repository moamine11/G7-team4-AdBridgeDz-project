const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, 
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, 
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true }, 
  requestDescription: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
