const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Agency = require('../models/agency');
const Post = require('../models/post');
const Booking = require('../models/booking');
const { OAuth2Client } = require('google-auth-library');
// --- CLOUDINARY IMPORTS ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// --- END CLOUDINARY IMPORTS ---

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to create Cloudinary storage configuration
const createCloudinaryStorage = (folderName, allowedFormats) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return {
                folder: `agency/${folderName}`,
                allowed_formats: allowedFormats,
                transformation: [{ width: 800, crop: 'limit' }],
                public_id: `${file.fieldname}-${uniqueSuffix}`
            };
        }
    });
};

// --- STORAGE CONFIGURATION FOR ALL FILES ---
// NOTE: We define single-file upload instances only for simplicity and stability.
const logoStorage = createCloudinaryStorage('logos', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
const postImageStorage = createCloudinaryStorage('posts', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

const uploadLogo = multer({ storage: logoStorage, limits: { fileSize: 5 * 1024 * 1024 } }).single('logo');
const uploadPostImage = multer({ storage: postImageStorage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

// --- END STORAGE CONFIGURATION ---


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

// Helper to destroy Cloudinary resource
const destroyCloudinaryResource = async (publicId) => {
    if (publicId) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error(`Cloudinary deletion failed for ID ${publicId}:`, error);
        }
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

const sendPasswordResetEmail = async (agency, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${agency._id}&userType=agency`;
  await transporter.sendMail({
    from: `"MarketingWeb" <${process.env.SMTP_USER}>`,
    to: agency.email,
    subject: "Reset Your Password",
    html: `<p>Hi ${agency.agencyName},</p>
           <p>You requested to reset your password. Click the link below to reset it:</p>
           <a href="${url}">${url}</a>
           <p>This link will expire in 1 hour.</p>
           <p>If you didn't request this, please ignore this email.</p>`
  });
};

// --- REGISTER ROUTE (SIMPLIFIED for single logo upload only) ---
router.post('/register', uploadLogo, async (req, res) => {
    try {
        const { 
            agencyName, email, userType, password, phoneNumber, countryCode, websiteUrl, country, city, streetAddress, 
            postalCode, businessRegistrationNumber, industry, companySize, yearEstablished, fullName, 
            jobTitle, servicesOffered, facebookUrl, linkedinUrl, agreeToTerms 
        } = req.body;

        if (!agreeToTerms || agreeToTerms !== 'true' && agreeToTerms !== true) {
            // Clean up if agreement is missing
            if (req.file) await destroyCloudinaryResource(req.file.filename);
            return res.status(400).json({ error: 'You must agree to the Terms and Conditions' });
        }

        const existingAgency = await Agency.findOne({ email });
        if (existingAgency) {
            if (req.file) await destroyCloudinaryResource(req.file.filename);
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        let parsedServices = servicesOffered ? (typeof servicesOffered === 'string' ? JSON.parse(servicesOffered) : servicesOffered) : [];

        // Store Cloudinary URLs and Public IDs
        const logoUrl = req.file ? req.file.path : undefined;
        const logoPublicId = req.file ? req.file.filename : undefined;
        // RC document fields will be null/undefined here, assuming it's done later/separately if needed

        const agency = new Agency({
            agencyName, email, userType: userType || 'agency', password: hashedPassword,
            phoneNumber, countryCode, websiteUrl, country, city, streetAddress, postalCode, businessRegistrationNumber,
            // rcDocument fields omitted for simplicity in this stable version
            logo: logoUrl, logoPublicId,                      
            industry, companySize, yearEstablished: yearEstablished ? parseInt(yearEstablished) : undefined,
            fullName, jobTitle, servicesOffered: parsedServices, facebookUrl, linkedinUrl,
            agreeToTerms: agreeToTerms === 'true' || agreeToTerms === true, isVerified: false, verificationToken,
            signUpMethod: 'local'
        });

        await agency.save();
        await sendVerificationEmail(agency, verificationToken);

        const token = jwt.sign({ agencyId: agency._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Agency registered successfully. Please check your email to verify your account.',
            token,
            agency: { id: agency._id, agencyName: agency.agencyName, email: agency.email, logo: agency.logo, servicesOffered: agency.servicesOffered }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (req.file) await destroyCloudinaryResource(req.file.filename);
        res.status(500).json({ error: error.message });
    }
});

// ... (Existing verification, login, google-auth, resend-verification routes remain unchanged) ...


// --- PROFILE UPDATE ROUTE (STABLE SINGLE FILE FIX - Matches companies.js) ---
router.put('/profile', authMiddleware, uploadLogo, async (req, res) => {
    try {
        const { 
            agencyName, email, phoneNumber, websiteUrl, country, city, streetAddress, postalCode, 
            businessRegistrationNumber, industry, companySize, yearEstablished, fullName, 
            jobTitle, servicesOffered, facebookUrl, linkedinUrl 
        } = req.body;

        const updateData = { updatedAt: Date.now() };

        const oldAgency = await Agency.findById(req.agencyId);
        if (!oldAgency) return res.status(404).json({ error: 'Agency not found' });
        
        // Handle static text fields
        Object.assign(updateData, {
            agencyName, email, phoneNumber, websiteUrl, country, city, streetAddress, postalCode, 
            businessRegistrationNumber, industry, companySize, yearEstablished: yearEstablished ? parseInt(yearEstablished) : undefined,
            fullName, jobTitle, facebookUrl, linkedinUrl,
            servicesOffered: servicesOffered ? JSON.parse(servicesOffered) : oldAgency.servicesOffered
        });

        // CRITICAL FIX: Handle Logo Update (If new file uploaded via uploadLogo middleware)
        if (req.file) {
            // Delete old image from Cloudinary
            await destroyCloudinaryResource(oldAgency.logoPublicId);

            // Update with new Cloudinary URL and Public ID
            updateData.logo = req.file.path;
            updateData.logoPublicId = req.file.filename;
        }
        
        // NOTE: rcDocument update fields are ignored here to maintain stability.

        const agency = await Agency.findByIdAndUpdate(
            req.agencyId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password').populate('servicesOffered');

        res.json({ message: 'Profile updated', agency });
    } catch (error) {
        console.error('Update error:', error);
        // Clean up newly uploaded files if DB update fails
        if (req.file) await destroyCloudinaryResource(req.file.filename);
        res.status(500).json({ error: error.message });
    }
});


// --- CREATE POST ROUTE (UPDATED for Cloudinary URL) ---
router.post('/posts', authMiddleware, uploadPostImage, async (req, res) => {
    try {
        const { title, description, priceRange, category } = req.body;
        
        let imageURL = req.file ? req.file.path : null; // Cloudinary URL
        let imagePublicId = req.file ? req.file.filename : null; // Cloudinary Public ID

        if (!imageURL) {
             return res.status(400).json({ error: 'Post image is required.' });
        }

        if (!category) {
            await destroyCloudinaryResource(imagePublicId);
            return res.status(400).json({ error: 'Category ID is required.' });
        }

        const post = new Post({
            title,
            description,
            priceRange,
            imageURL,
            imagePublicId, // Store Public ID
            category: new mongoose.Types.ObjectId(category),
            agency: req.agencyId
        });

        await post.save();
        await Agency.findByIdAndUpdate(req.agencyId, { $push: { posts: post._id } });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        if (req.file) await destroyCloudinaryResource(req.file.filename);
        res.status(500).json({ error: error.message });
    }
});

// --- UPDATE POST ROUTE (UPDATED for Cloudinary Deletion) ---
router.put('/posts/:id', authMiddleware, uploadPostImage, async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, description, priceRange, category } = req.body;
        
        const updateData = { updatedAt: Date.now() };

        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priceRange) updateData.priceRange = priceRange;
        if (category) updateData.category = new mongoose.Types.ObjectId(category);

        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            if (req.file) await destroyCloudinaryResource(req.file.filename);
            return res.status(404).json({ error: 'Post not found' });
        }

        if (req.file) {
            // Delete old image from Cloudinary
            await destroyCloudinaryResource(oldPost.imagePublicId);

            // Update with new Cloudinary URL and Public ID
            updateData.imageURL = req.file.path;
            updateData.imagePublicId = req.file.filename;
        }

        const post = await Post.findOneAndUpdate(
            { _id: postId, agency: req.agencyId },
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!post) {
            if (req.file) await destroyCloudinaryResource(req.file.filename);
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        if (req.file) await destroyCloudinaryResource(req.file.filename);
        res.status(500).json({ error: error.message });
    }
});


// 3. DELETE/INACTIVATE POST STATUS (UPDATED for Cloudinary Deletion)
router.put('/posts/:id/status', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const { isActive } = req.body; 

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ error: 'isActive status must be boolean' });
        }

        const post = await Post.findOneAndUpdate(
            { _id: postId, agency: req.agencyId },
            { isActive: isActive, updatedAt: Date.now() },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        // NOTE: We don't delete the resource from Cloudinary here, only set isActive=false. 
        // A future DELETE endpoint could handle destruction.

        res.json({ message: `Post status set to ${isActive ? 'active' : 'inactive'}`, post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ agency: req.agencyId })
      .populate('post', 'title description priceRange imageURL category location')
      .populate('agency', 'name email location ')
      .populate('company', 'name email phoneNumber')
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
router.get('/new/:id', async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id)
      .select('+websiteUrl +logo +facebookUrl +linkedinUrl +profileDescription +yearEstablished +companySize +businessRegistrationNumber')
      .populate('servicesOffered', 'name');

    if (!agency) return res.status(404).json({ error: 'Agency not found' });
    res.json(agency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify-email', async (req, res) => {
  try {
    const { token, id } = req.query;
    if (!token || !id) {
      return res.status(400).json({ error: "Invalid request. Token and ID are required." });
    }

    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(404).json({ error: "Agency not found." });
    }
    if (agency.verificationToken !== token) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }
    if (agency.isVerified) {
      return res.status(400).json({ error: "Email already verified." });
    }

    agency.isVerified = true;
    agency.verificationToken = undefined;
    await agency.save();
    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: "Server error" });
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

// Forgot Password - Request reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const agency = await Agency.findOne({ email });
    // Don't reveal if email exists for security
    if (!agency) {
      return res.json({ message: 'If that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    agency.resetPasswordToken = resetToken;
    agency.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await agency.save();

    await sendPasswordResetEmail(agency, resetToken);
    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password - Verify token and reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, id, password } = req.body;
    
    if (!token || !id || !password) {
      return res.status(400).json({ error: 'Token, ID, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    if (agency.resetPasswordToken !== token) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (!agency.resetPasswordExpires || agency.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    agency.password = hashedPassword;
    agency.resetPasswordToken = undefined;
    agency.resetPasswordExpires = undefined;
    await agency.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify reset token
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token, id } = req.query;
    
    if (!token || !id) {
      return res.status(400).json({ error: 'Token and ID are required' });
    }

    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    if (agency.resetPasswordToken !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    if (!agency.resetPasswordExpires || agency.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    res.json({ message: 'Token is valid' });
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

router.get('/posts/agency/:agencyId', async (req, res) => {
  try {
    const posts = await Post.find({ agency: req.params.agencyId })
        .populate('agency', 'agencyName email') // Use 'agency' field to match Post schema
        .populate('category', 'name')
        .sort({ createdAt: -1 });

    if (!posts.length) return res.status(404).json({ error: 'No posts found for this agency' });

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/test', async (req, res) => {
  try {
    const agencies = await Agency.find().select('agencyName email logo verificationToken isVerified userType');
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
router.put('/posts/:id/status', authMiddleware, async (req, res) => {
    try {
        const postId = req.params.id;
        const { isActive } = req.body; // Expecting boolean true/false

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ error: 'isActive status must be boolean' });
        }

        const post = await Post.findOneAndUpdate(
            { _id: postId, agency: req.agencyId },
            { isActive: isActive, updatedAt: Date.now() },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ error: 'Post not found or unauthorized' });
        }

        res.json({ message: `Post status set to ${isActive ? 'active' : 'inactive'}`, post });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;