const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true }, 
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, 
  description: { type: String, required: true }, 
  priceRange: { type: String }, 
  imageURL: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now } 
});

postSchema.index({ 
    title: 'text', 
    description: 'text',
    priceRange: 'text' 
}, {
    weights: {
        title: 5, 
        description: 3
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
