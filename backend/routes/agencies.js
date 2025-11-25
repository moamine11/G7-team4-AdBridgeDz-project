

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Agency = require('../models/agency');
const Post = require('../models/post');
const Booking = require('../models/booking');


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.agencyId = decoded.agencyId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, profileDescription } = req.body;

    const existingAgency = await Agency.findOne({ email });
    if (existingAgency)
      return res.status(400).json({ error: 'Agency already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const agency = new Agency({
      name,
      email,
      password: hashedPassword,
      location,
      profileDescription
    });

    await agency.save();

    const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      message: "Agency registered successfully",
      token,
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        location: agency.location,
        profileDescription: agency.profileDescription
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const agency = await Agency.findOne({ email }).select('+password');
    if (!agency)
      return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, agency.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      message: 'Login successful',
      token,
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        location: agency.location,
        profileDescription: agency.profileDescription
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const agency = await Agency.findById(req.agencyId).select('-password').populate('posts');
    if (!agency) return res.status(404).json({ error: 'Agency not found' });
    res.json(agency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, location, profileDescription } = req.body;

    const updatedAgency = await Agency.findByIdAndUpdate(
      req.agencyId,
      { name, location, profileDescription },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: "Profile updated successfully", agency: updatedAgency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, priceRange, imageURL } = req.body;

    const post = new Post({
      title,
      agency: req.agencyId,
      category,
      description,
      priceRange,
      imageURL
    });

    await post.save();

    await Agency.findByIdAndUpdate(req.agencyId, {
      $push: { posts: post._id }
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOneAndUpdate(
      { _id: postId, agency: req.agencyId },
      req.body,
      { new: true }
    );

    if (!post) return res.status(404).json({ error: 'Post not found or unauthorized' });

    res.json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await Post.findOneAndDelete({ _id: postId, agency: req.agencyId });
    if (!deleted) return res.status(404).json({ error: 'Post not found or unauthorized' });

    await Agency.findByIdAndUpdate(req.agencyId, {
      $pull: { posts: postId }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ agency: req.agencyId })
      .populate('company', 'name email location')
      .populate('post', 'title description priceRange imageURL')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agency: req.agencyId
    })
      .populate('company', 'name email location')
      .populate('post', 'title description priceRange imageURL');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/bookings/:id/accept', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agency: req.agencyId
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'Pending')
      return res.status(400).json({ error: 'Booking is not pending' });

    booking.status = 'Accepted';
    await booking.save();

    res.json({ message: 'Booking accepted', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/bookings/:id/reject', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agency: req.agencyId
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'Pending')
      return res.status(400).json({ error: 'Booking is not pending' });

    booking.status = 'Rejected';
    await booking.save();

    res.json({ message: 'Booking rejected', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/bookings/:id/complete', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agency: req.agencyId
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.status !== 'Accepted')
      return res.status(400).json({ error: 'Only accepted bookings can be completed' });

    booking.status = 'Completed';
    await booking.save();

    res.json({ message: 'Booking marked as completed', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // deleting a booking only if its pending
router.delete('/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      agency: req.agencyId
    });

    if (!booking)
      return res.status(404).json({ error: 'Booking not found' });

    if (booking.status !== 'Pending')
      return res.status(400).json({
        error: `Cannot delete booking with status: ${booking.status}`
      });

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
