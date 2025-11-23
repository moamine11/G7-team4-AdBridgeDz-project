const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const Booking = require('../models/booking');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, websiteURL, location, phonenumber } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      websiteURL,
      location,
      phonenumber,
      signUpMethod: 'local'
    });

    await company.save();

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Company registered successfully',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        websiteURL: company.websiteURL,
        location: company.location,
        phonenumber: company.phonenumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email }).select('+password');
    if (!company)
      return res.status(401).json({ error: 'Invalid email or password' });
    if (company.signUpMethod === 'google') {
      return res.status(400).json({
        error: 'This account uses Google Sign-In. Please login with Google.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        websiteURL: company.websiteURL,
        location: company.location,
        phonenumber: company.phonenumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/google-auth', async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let company = await Company.findOne({ email });

    if (!company) {
      company = new Company({
        name,
        email,
        googleId,
        password: null,
        signUpMethod: 'google',
        location: "Unknown",
        phonenumber: 0
      });

      await company.save();
    }

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: "Google login successful",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.companyId).select('-password');
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, websiteURL, location, phonenumber } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { name, websiteURL, location, phonenumber, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ company: req.companyId })
      .populate('post', 'title description priceRange imageURL category location')
      .populate('agency', 'name email location profileDescription')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      company: req.companyId
    })
      .populate('post', 'title description priceRange imageURL category location')
      .populate('agency', 'name email location profileDescription');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/bookings/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, company: req.companyId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.status !== 'Pending')
      return res.status(400).json({ error: `Cannot cancel booking with status: ${booking.status}` });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/bookings/stats/summary', authMiddleware, async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $match: { company: req.companyId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const summary = { total: 0, pending: 0, accepted: 0, rejected: 0, completed: 0 };
    stats.forEach(stat => {
      summary.total += stat.count;
      summary[stat._id.toLowerCase()] = stat.count;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
