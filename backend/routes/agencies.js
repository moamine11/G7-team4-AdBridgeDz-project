const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Agency = require('../models/agency');
const Post = require('../models/post');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




const uploadDirs = ['uploads/logos', 'uploads/documents'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logos/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'document-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'));
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /pdf|msword|officedocument|image/.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, or image files are allowed for documents!'));
  }
};

const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: imageFilter
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: documentFilter
});
const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'logo') {
        cb(null, 'uploads/logos/');
      } else if (file.fieldname === 'rcDocument') {
        cb(null, 'uploads/documents/');
      } else {
        cb(new Error('Unexpected field'));
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = file.fieldname === 'logo' ? 'logo-' : 'document-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'logo') {
      imageFilter(req, file, cb);
    } else if (file.fieldname === 'rcDocument') {
      documentFilter(req, file, cb);
    } else {
      cb(new Error('Unexpected field'));
    }
  }
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'rcDocument', maxCount: 1 }
]);


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

const sendVerificationEmail = async (agency, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${agency._id}`;

  await transporter.sendMail({
    from: `"MarketingWeb" <${process.env.SMTP_USER}>`,
    to: agency.email,
    subject: 'Verify your email',
    html: `<p>Hi ${agency.agencyName},</p>
           <p>Please verify your email by clicking below:</p>
           <a href="${url}">${url}</a>`
  });
};

router.post('/register', (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { 
        agencyName, email, userType, password, phoneNumber, countryCode, websiteUrl, country, city, streetAddress, 
        postalCode, businessRegistrationNumber, industry, companySize, yearEstablished, fullName, 
        jobTitle, servicesOffered, facebookUrl, linkedinUrl, agreeToTerms 
      } = req.body;

     
      const existingAgency = await Agency.findOne({ email });
      if (existingAgency) return res.status(400).json({ error: 'Email already exists' });

   
      const hashedPassword = await bcrypt.hash(password, 10);

    
      const verificationToken = crypto.randomBytes(32).toString('hex');

      let parsedServices = [];
      if (servicesOffered) {
        try {
          parsedServices = JSON.parse(servicesOffered);
        } catch (e) {
          parsedServices = Array.isArray(servicesOffered) ? servicesOffered : [servicesOffered];
        }
      }

      const logoPath = req.files?.logo ? `/uploads/logos/${req.files.logo[0].filename}` : undefined;
      const rcDocumentPath = req.files?.rcDocument ? `/uploads/documents/${req.files.rcDocument[0].filename}` : undefined;

      const agency = new Agency({
        agencyName,
        email,
        userType: userType || 'agency',
        password: hashedPassword,
        phoneNumber,
        countryCode,
        websiteUrl,
        country,
        city,
        streetAddress,
        postalCode,
        businessRegistrationNumber,
        rcDocument: rcDocumentPath,
        logo: logoPath,
        industry,
        companySize,
        yearEstablished: yearEstablished ? parseInt(yearEstablished) : undefined,
        fullName,
        jobTitle,
        servicesOffered: parsedServices,
        facebookUrl,
        linkedinUrl,
        agreeToTerms: agreeToTerms === 'true' || agreeToTerms === true,
        isVerified: false,
        verificationToken,
        signUpMethod: 'local'
      });

      await agency.save();
      await sendVerificationEmail(agency, verificationToken);

      const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        message: 'Agency registered successfully. Please check your email to verify your account.',
        token,
        agency: { 
          id: agency._id, 
          agencyName: agency.agencyName, 
          email: agency.email,
          logo: agency.logo,
          servicesOffered: agency.servicesOffered
        }
      });
    } catch (error) {
      
      if (req.files?.logo) {
        fs.unlinkSync(path.join(__dirname, '..', req.files.logo[0].path));
      }
      if (req.files?.rcDocument) {
        fs.unlinkSync(path.join(__dirname, '..', req.files.rcDocument[0].path));
      }
      res.status(500).json({ error: error.message });
    }
  });
});
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ agency: req.agencyId })
      .populate('post', 'title description priceRange imageURL category location')
      .populate('agency', 'name email location ')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/google-auth', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;
    
    let agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(404).json({
        error: 'No account found with this email. Please register first.'
      });
    }

    if (!agency.googleId) {
      agency.googleId = googleId;
      agency.signUpMethod = 'google'; 
      await agency.save();
    }
    
    if (!agency.isVerified) {
      agency.isVerified = true;
      await agency.save();
    }
    
    const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: "Google login successful",
      token,
      agency: {
        id: agency._id,
        agencyName: agency.agencyName,
        email: agency.email,
        country: agency.country,
        phoneNumber: agency.phoneNumber,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/verify-email', async (req, res) => {
  try {
    const { token, id } = req.query;
    if (!token || !id) return res.status(400).send("Invalid request");

    const agency = await Agency.findById(id);
    if (!agency || agency.verificationToken !== token)
      return res.status(400).send("Invalid or expired token");

    agency.isVerified = true;
    agency.verificationToken = undefined;
    await agency.save();
    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }
    if (agency.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    agency.verificationToken = verificationToken;
    await agency.save();
    await sendVerificationEmail(agency, verificationToken);
    
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const agency = await Agency.findOne({ email }).select('+password');
    if (!agency) return res.status(401).json({ error: 'Invalid credentials' });
    if (!agency.isVerified) return res.status(401).json({ error: 'Email not verified. Please check your email.' });
    
    const isValid = await bcrypt.compare(password, agency.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      agency: { 
        id: agency._id, 
        agencyName: agency.agencyName, 
        email: agency.email, 
        country: agency.country,
        logo: agency.logo 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const agency = await Agency.findById(req.agencyId)
      .select('-password')
      .populate('servicesOffered')
      .populate('posts');

    if (!agency) return res.status(404).json({ error: 'Agency not found' });

    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/profile', authMiddleware, (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { 
        agencyName, email, phoneNumber, websiteUrl, country, city, streetAddress, postalCode, 
        businessRegistrationNumber, industry, companySize, yearEstablished, fullName, 
        jobTitle, servicesOffered, facebookUrl, linkedinUrl 
      } = req.body;

      const updateData = {
        agencyName,
        email,
        phoneNumber,
        websiteUrl,
        country,
        city,
        streetAddress,
        postalCode,
        businessRegistrationNumber,
        industry,
        companySize,
        yearEstablished: yearEstablished ? parseInt(yearEstablished) : undefined,
        fullName,
        jobTitle,
        servicesOffered: servicesOffered ? JSON.parse(servicesOffered) : undefined,
        facebookUrl,
        linkedinUrl,
        updatedAt: Date.now()
      };

      
      if (req.files?.logo) {
        updateData.logo = `/uploads/logos/${req.files.logo[0].filename}`;
        
        const oldAgency = await Agency.findById(req.agencyId);
        if (oldAgency.logo) {
          const oldLogoPath = path.join(__dirname, '..', oldAgency.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
      }

      
      if (req.files?.rcDocument) {
        updateData.rcDocument = `/uploads/documents/${req.files.rcDocument[0].filename}`;
    
        const oldAgency = await Agency.findById(req.agencyId);
        if (oldAgency.rcDocument) {
          const oldDocPath = path.join(__dirname, '..', oldAgency.rcDocument);
          if (fs.existsSync(oldDocPath)) {
            fs.unlinkSync(oldDocPath);
          }
        }
      }

      const agency = await Agency.findByIdAndUpdate(
        req.agencyId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password').populate('servicesOffered');

      res.json({ message: 'Profile updated', agency });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, description, priceRange, imageURL, category } = req.body;
    
    const post = new Post({
      title,
      description,
      priceRange,
      imageURL,
      category,
      agencyId: req.agencyId 
    });

    await post.save();
    await Agency.findByIdAndUpdate(req.agencyId, { $push: { posts: post._id } });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/posts/agency/:agencyId', async (req, res) => {
  try {
    const posts = await Post.find({ agencyId: req.params.agencyId }).populate('agencyId', 'agencyName');

    if (!posts.length) return res.status(404).json({ error: 'No posts found for this agency' });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test', async (req, res) => {
  try {
    const agencies = await Agency.find().select('agencyName email verificationToken isVerified userType');
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/booking/:id/status', authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.agency.toString() !== req.agencyId) {
      return res.status(403).json({ error: 'Unauthorized: This booking belongs to another agency' });
    }
    booking.status = status;
    await booking.save();
    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;