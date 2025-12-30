const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added for local cleanup context/use
const Company = require('../models/company');
const Booking = require('../models/booking');
const { OAuth2Client } = require('google-auth-library');
// --- NEW CLOUDINARY IMPORTS ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// --- END CLOUDINARY IMPORTS ---

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- CLOUDINARY CONFIGURATION (NEW) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for company logos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'company-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    // public_id is now dynamically generated, referencing company ID for easy cleanup
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Use companyId if available during update, otherwise use a generic prefix
      const companyId = req.companyId || 'new-company';
      return `logo-${companyId}-${uniqueSuffix}`;
    }
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
  storage, // Using Cloudinary storage
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// --- END CLOUDINARY CONFIGURATION ---


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.companyId = decoded.companyId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'hello from here ' });
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

// --- REGISTER ROUTE (MODIFIED for Cloudinary URL/ID storage) ---
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
      // Clean up uploaded file if registration fails
      if (req.file) await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    let imageURL = '';
    let cloudinaryPublicId = ''; // New field for Cloudinary public ID
    
    if (req.file) {
      // Cloudinary URL is req.file.path; Public ID is req.file.filename
      imageURL = req.file.path;
      cloudinaryPublicId = req.file.filename;
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
      cloudinaryPublicId, // Store Public ID
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
    // Clean up uploaded file if registration fails
    if (req.file && req.file.filename) {
        try {
            await cloudinary.uploader.destroy(req.file.filename);
        } catch (deleteError) {
            console.error('Error deleting Cloudinary file:', deleteError);
        }
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
    res.status(500).json({ error: "Server error" });
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
    const companies = await Company.find().select('name email password imageURL verificationToken');
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

// --- PROFILE UPDATE ROUTE (MODIFIED for Cloudinary deletion) ---
router.put('/profile', authMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const updateFields = ['name', 'websiteURL', 'location', 'phonenumber', 'socialMedia', 'industrySector', 'companySize', 'yearEstablished'];
    const updateData = {};

    // Fetch existing company data first to get the old public ID
    const company = await Company.findById(req.companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    
    let oldPublicId = company.cloudinaryPublicId;
    
    // Cloudinary Logo Handling
    if (req.file) {
      // req.file.path contains the absolute Cloudinary URL
      updateData.imageURL = req.file.path; 
      // req.file.filename contains the Cloudinary public_id
      updateData.cloudinaryPublicId = req.file.filename; 
    }

    // Handle other fields from body
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

    const updatedCompany = await Company.findByIdAndUpdate(
      req.companyId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Delete old image from Cloudinary if a new one was uploaded and an old public ID exists
    if (req.file && oldPublicId) {
        try {
            await cloudinary.uploader.destroy(oldPublicId);
        } catch (deleteError) {
            console.error('Error deleting old Cloudinary image:', deleteError);
        }
    }

    res.json({ message: 'Profile updated successfully', company: updatedCompany });
  } catch (error) {
    // If update failed, clean up the newly uploaded file from Cloudinary
    if (req.file && req.file.filename) {
        try {
            await cloudinary.uploader.destroy(req.file.filename);
        } catch (deleteError) {
            console.error('Error deleting failed Cloudinary upload:', deleteError);
        }
    }
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