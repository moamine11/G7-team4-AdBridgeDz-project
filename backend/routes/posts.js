const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const Agency = require('../models/agency');
const Service = require('../models/service');
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.companyId = decoded.companyId; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


router.get('/', async (req, res) => {
  try {
    const { agencyId, category, q, minPrice, maxPrice, location, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (agencyId) query.agency =new  mongoose.Types.ObjectId(agencyId);

    if (category) query.category =new mongoose.Types.ObjectId(category);

      if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { priceRange: { $regex: q, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.priceRange = {};
      if (minPrice) query.priceRange.$gte = parseFloat(minPrice);
      if (maxPrice) query.priceRange.$lte = parseFloat(maxPrice);
    }

    if (location) query.location = { $regex: location, $options: 'i' };

    const posts = await Post.find(query)
      .populate('agency', 'name email location profileDescription')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/services/:id/posts', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const posts = await Post.find({ category: mongoose.Types.ObjectId(serviceId), isActive: true })
      .populate('agency', 'name email location profileDescription')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('agency', 'name email location profileDescription')
      .populate('category', 'name');

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/book', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { requestDescription } = req.body;

    const post = await Post.findById(postId).populate('agency');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.isActive) return res.status(400).json({ error: 'Post is no longer available' });

    const booking = new Booking({
      company: req.companyId,
      post: postId,
      agency: post.agency._id,
      requestDescription,
      status: 'Pending',
    });

    await booking.save();
    await booking.populate([
      { path: 'post', select: 'title description priceRange imageURL category location' },
      { path: 'agency', select: 'name email location profileDescription' },
    ]);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
