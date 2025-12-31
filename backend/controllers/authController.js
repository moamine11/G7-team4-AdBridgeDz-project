const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        const normalizedPassword = String(password || '');

        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        const isPasswordValid = await admin.comparePassword(normalizedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        admin.lastLogin = Date.now();
        await admin.save();

        const token = jwt.sign({ id: admin._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({
                success: true,
                message: 'If your email is registered, you will receive a reset link'
            });
        }

        const resetToken = admin.createPasswordResetToken();
        await admin.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS.replace(/\s/g, '')
            }
        });

        const mailOptions = {
            from: `"Admin Dashboard" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: #f4f4f4;">
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                        <p>Hello ${admin.name},</p>
                        <p>You requested a password reset for your admin account.</p>
                        <p>Click the button below to reset your password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                        </div>
                        <p>Or copy and paste this link:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <p style="color: #999; font-size: 12px;">This link will expire in 10 minutes.</p>
                        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">Best regards,<br>Admin Team</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Password reset instructions sent to your email'
        });
    } catch (error) {
        console.error('Email sending error:', error.message);
        console.error('Full error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to send reset email: ${error.message}`
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const admin = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        admin.password = password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        admin.updatedAt = Date.now();
        await admin.save();

        const newToken = jwt.sign({ id: admin._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN
        });

        res.json({
            success: true,
            token: newToken,
            message: 'Password reset successful',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        res.json({
            success: true,
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
