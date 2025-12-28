const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.updatedAt = Date.now();
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Admin', adminSchema);