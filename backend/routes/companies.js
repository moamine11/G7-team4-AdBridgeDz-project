const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const Company = require('../models/company');
const Booking = require('../models/booking');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for logo upload'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


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



const sendVerificationEmail = async (company, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${company._id}`;
  await transporter.sendMail({
    from: `"MarketingWeb" <${process.env.SMTP_USER}>`,
    to: company.email,
    subject: "Verify your email",
    html: `<p>Hi ${company.name},</p>
           <p>Please verify your email by clicking below:</p>
           <a href="${url}">${url}</a>`
  });
};


router.post('/register', upload.single('logo'), async (req, res) => {
  try {
    const {
      name,
      email,
      userType,
      password,
      websiteURL,
      location,
      phonenumber,
      socialMedia,
      industrySector,
      companySize,
      yearEstablished,
      agreesToTerms 
    } = req.body;

   
    if (!agreesToTerms || agreesToTerms !== 'true' && agreesToTerms !== true) {
      return res.status(400).json({ error: 'You must agree to the Terms and Conditions' });
    }

   
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    let imageURL = '';
    if (req.file) {
      
      imageURL = `${process.env.BACKEND_URL}/uploads/logos/${req.file.filename}`;
    } else if (typeof req.body.imageURL === 'string') {
      imageURL = req.body.imageURL;
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    let parsedSocialMedia = { facebook: "", linkedin: "" };
    if (socialMedia) {
      try {
        parsedSocialMedia = typeof socialMedia === 'string' ? JSON.parse(socialMedia) : socialMedia;
      } catch (e) {
       
      }
    }

    const company = new Company({
      name,
      email,
      userType,
      password: hashedPassword,
      imageURL,
      websiteURL,
      location,
      phonenumber,
      socialMedia: parsedSocialMedia,
      industrySector,
      companySize,
      yearEstablished,
      signUpMethod: 'local',
      isVerified: false,
      verificationToken
    });

    await company.save();
    await sendVerificationEmail(company, verificationToken);

    res.status(201).json({
      message: 'Company registered successfully. Please check your email to verify your account.',
      company: {
        id: company._id,
        name: company.name,
        email: company.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
 
    if (req.file) {
      const fs = require('fs');
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: error.message });
  }
});


router.get('/verify-email', async (req, res) => {
  try {
    const { token, id } = req.query;
    if (!token || !id) return res.status(400).send("Invalid request");
    const company = await Company.findById(id);
    if (!company || company.verificationToken !== token) return res.status(400).send("Invalid or expired token");
    company.isVerified = true;
    company.verificationToken = undefined;
    await company.save();
    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email }).select('+password');
    if (!company) return res.status(401).json({ error: 'Invalid email or password' });
    if (!company.isVerified) return res.status(401).json({ error: 'Email not verified. Please check your email.' });
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      message: 'Login successful',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        imageURL: company.imageURL,
        websiteURL: company.websiteURL,
        location: company.location,
        phonenumber: company.phonenumber,
        socialMedia: company.socialMedia,
        industrySector: company.industrySector,
        companySize: company.companySize,
        yearEstablished: company.yearEstablished,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test', async (req, res) => {
  try {
    const companies = await Company.find().select('name email verificationToken');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/google-auth', async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;
    let company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ error: 'No account found with this email. Please register first using the regular registration form.' });
    }
    if (!company.googleId) {
      company.googleId = googleId;
      await company.save();
    }
    if (!company.isVerified) {
      company.isVerified = true;
      await company.save();
    }
    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({
      message: "Google login successful",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        imageURL: company.imageURL,
        websiteURL: company.websiteURL,
        location: company.location,
        phonenumber: company.phonenumber,
        socialMedia: company.socialMedia,
        industrySector: company.industrySector,
        companySize: company.companySize,
        yearEstablished: company.yearEstablished,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    if (company.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    const verificationToken = crypto.randomBytes(32).toString('hex');
    company.verificationToken = verificationToken;
    await company.save();
    await sendVerificationEmail(company, verificationToken);
    res.json({ message: 'Verification email sent' });
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

router.put('/profile', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const updateFields = ['name', 'websiteURL', 'location', 'phonenumber', 'socialMedia', 'industrySector', 'companySize', 'yearEstablished'];
    const updateData = {};

    if (req.file) {
      updateData.imageURL = `${process.env.BACKEND_URL}/uploads/logos/${req.file.filename}`;
    }

    for (const field of updateFields) {
      if (req.body[field] !== undefined) {
        if (field === 'socialMedia') {
          try {
            updateData[field] = typeof req.body[field] === 'string' ? JSON.parse(req.body[field]) : req.body[field];
          } catch (e) {
            updateData[field] = req.body[field];
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    updateData.updatedAt = Date.now();

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      updateData,
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
    const booking = await Booking.findOne({ _id: req.params.id, company: req.companyId })
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
    if (booking.status !== 'Pending') return res.status(400).json({ error: `Cannot cancel booking with status: ${booking.status}` });
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