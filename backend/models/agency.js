const mongoose = require("mongoose");
const agencySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  profileDescription: { type: String, default: 'A leading advertising agency.' },
  location: { type: String, required: true },
  servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], 
  createdAt: { type: Date, default:Date.now } ,
  posts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Post' 
        }
    ],
});

const Agency = mongoose.model('Agency', agencySchema);
module.exports = Agency;
